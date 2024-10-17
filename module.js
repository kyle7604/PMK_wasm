import init, { test_alert, new_info, 
    head_new, head_meiosis, head_blend, head_save, head_load, 
    body_new, body_meiosis, body_blend, body_save, body_load, body_cup_s, body_cup_w, body_weight,
    parts_new, parts_meiosis, parts_blend, parts_save, parts_load, parts_top,} from "wasm_module";  // 여러 함수 불러옴
    
    const model_list = {X:[],Y:[]};
    const target = {type:null,index:null};
    const side_lip_width_ratio = 3;
    let mother   = null, father = null;
    let wrinkle  = [];
    let lip_direction = true;
    let fepart_ext = 0;
    let fepart_ert = 0;
    let flutter    = 0;

    function image_resize() {
        const container_width = document.getElementById("main_container").offsetWidth;
        const basic_width  = 400;
        const canvas_width = container_width<=basic_width?container_width:basic_width;
        document.querySelector(".character-image").style.flex = `0 0 ${canvas_width}px`;        
    }
    window.onload=function(){
        image_resize();
    }
    window.addEventListener("resize", function() {
        image_resize();
    })

    window.new_model = async function(model_class) {        
        await init();  // WebAssembly 모듈 초기화
        const model = {
            mother : {
                head:  null,
                body:  null,
                parts: null
            },
            father : {
                head:  null,
                body:  null,
                parts: null
            },
            gen  : {
                head:  null,
                body:  null,
                parts: null
            },
            info  : JSON.parse(new_info(model_class)),
            head  : null,
            body  : null,
            parts : null,
            calc  : {
                cup:    null,
                c_w:    null,
                weight: null,
                BMI:    null
            }
        }
        let generation = false;
        if(mother != null && father != null) generation = true;
        if(generation){
            model.info.family = model_list.Y[father].info.family;
            model.mother.head = head_meiosis(model_list.X[mother].mother.head,model_list.X[mother].father.head);
            model.father.head = head_meiosis(model_list.Y[father].mother.head,model_list.Y[father].father.head);
    
            model.mother.body = body_meiosis(model_list.X[mother].mother.body,model_list.X[mother].father.body);
            model.father.body = body_meiosis(model_list.Y[father].mother.body,model_list.Y[father].father.body);
    
            model.mother.parts = parts_meiosis(model_list.X[mother].mother.parts,model_list.X[mother].father.parts);
            model.father.parts = parts_meiosis(model_list.Y[father].mother.parts,model_list.Y[father].father.parts);
        }else {
            model.mother.head  = head_new();
            model.father.head  = head_new();
    
            model.mother.body  = body_new(false);
            model.father.body  = body_new(true);
    
            model.mother.parts = parts_new(false);
            model.father.parts = parts_new(true);
        }
        model.gen.head = head_blend(model.mother.head,model.father.head,model.info.gender);
        model.gen.body = body_blend(model.mother.body,model.father.body,model.info.gender);
        model.gen.parts = parts_blend(model.mother.parts,model.father.parts,model.info.gender);
    
        model.head  = JSON.parse(head_save(model.gen.head));
        model.body  = JSON.parse(body_save(model.gen.body));
        model.parts = JSON.parse(parts_save(model.gen.parts));
    
        // model.gen.head  = head_load(JSON.stringify(model.head));
        // model.gen.body  = body_load(JSON.stringify(model.body));
        // model.gen.parts = parts_load(JSON.stringify(model.parts));
    
        model.calc.cup = body_cup_s(model.gen.body);
        model.calc.c_w = body_cup_w(model.gen.body);
        if(model.calc.cup == '@') model.calc.cup = 'AA';
    
        let _hight  = model.gen.body.height;
        let _weight = body_weight(model.gen.body);
        let weight  = _weight+(model.calc.c_w/5);
        model.calc.BMI    = weight/(_hight/100*_hight/100);
        model.calc.weight = weight/100;
            
        let model_type = "X";
        if(model.info.gender) model_type = "Y";
        model_list[model_type].push(model);
    
        if(generation){
            let alarm_text = model_list.Y[father].info.family + model_list.Y[father].info.name;
            alarm_text += " 와 ";
            alarm_text += model_list.X[mother].info.family + model_list.X[mother].info.name;
            alarm_text += " 사이에서 ";
            alarm_text += model.info.family + model.info.name;;
            alarm_text += " 탄생.";
            test_alert(alarm_text);
        }
        models_list(model,model.info.gender);
    }
    
    window.models_list = function(model,gender){
        const document_list=gender?document.getElementById("model_list_Y"):document.getElementById("model_list_X");
        let inner_html  = document_list.innerHTML;
        const index = gender?model_list.Y.length:model_list.X.length;
        inner_html  += `<p onclick="target_id(${gender},${index-1})"> ${model.info.family+" "+model.info.name}</p>`;
        document_list.innerHTML = inner_html;
    }
    // window.models_list = function(){
    //     const document_list = document.getElementById("model_list");
    //     let inner_html  = '<div class="character-details">X';
    //     for (let index = 0; index < model_list.X.length; index++) {
    //         let model = model_list.X[index]
    //         inner_html  += `<p onclick="target_id(${false},${index})"> ${model.info.family+" "+model.info.name}</p>`;
    //     }
    //     inner_html  += '</div><div class="character-details">Y';
    //     for (let index = 0; index < model_list.Y.length; index++) {
    //         let model = model_list.Y[index]
    //         inner_html  += `<p onclick="target_id(${true},${index})"> ${model.info.family+" "+model.info.name}</p>`;
    //     }
    //     inner_html  += "<div>";
    //     document_list.innerHTML = inner_html;
    // }
    
    window.target_id = function(type,index){
        let model_type = null;
        if(type){
            model_type = "Y";
            father = index;
            console.log("father:"+index);
        }else{
            model_type = "X";
            mother = index;
            console.log("mother:"+index);
        }
        target.type  = model_type;
        target.index = index;
        if(model_type != null){
            const model_name = model_list[model_type][index].info.family + " " + model_list[model_type][index].info.name;
            document.getElementById("model_name").innerText = model_name;
            if(type) document.getElementById("Y_name").innerText = model_name;
            else     document.getElementById("X_name").innerText = model_name;
        }
        document.getElementById("draw_section").innerHTML="";
        get_info();
        lip_direction = Math.random()<0.5;
        fepart_ext = 0;
        fepart_ert = 0;
        draw_fepart(0,0);
    }

    window.get_info = function(){
        if(target.type != null && target.index != null){
            const model = model_list[target.type][target.index];
            let inner_html  = `<p><strong>나이:</strong> ${model.info.age}</p>`
            inner_html  += `<p><strong>키:</strong> ${(model.body.height/10).toFixed(1)}cm</p>`
            inner_html  += `<p><strong>무게:</strong> ${(model.calc.weight).toFixed(1)}kg</p>`
            inner_html  += `<p><strong>BMI:</strong> ${(model.calc.BMI).toFixed(1)}</p>`
            if(target.type == 'X'){
                inner_html  += `<p><strong>B:</strong> ${(model.body.breast/10).toFixed(1)}cm, <strong>W:</strong> ${(model.body.waist/10).toFixed(1)}cm, <strong>H:</strong> ${(model.body.hip/10).toFixed(1)}cm</p>`
                inner_html  += `<p><strong>Size: ${model.calc.cup}</strong></p>`
                inner_html  += `<section class="character-info" id="model_list">`
                inner_html  += `<input type="range" min="0" max="100" value="0" class="slider" oninput="draw_fepart(this.value,404)">`
                inner_html  += `<input type="range" min="0" max="100" value="0" class="slider" oninput="draw_fepart(404,this.value)">`
                inner_html  += `<br></section>`
            }
            document.getElementById("model_info").innerHTML = inner_html;
        }
    }
    
    function fepart_top(canvas,init_point,center,model,extention,erection,center_add) {
        const extention_ratio = [extention/100,(100-extention)/100];
        const erection_ratio  = [erection/100,(100-erection)/100];
        const rclit_y    = model.core_l_e/2*erection_ratio[0]+model.core_l/2*erection_ratio[1];
        const axis_Y     = init_point + model.hood_length;
        const axis_E     = axis_Y + model.lip_i_length;
        
        function top_pair(side) {
            const fix_center = side? center-center_add:center+center_add;
            let   lip_smallest   = 0;

            if(side){
                lip_smallest = model.lip_i_length_ru<model.lip_i_length_rm?model.lip_i_length_ru:model.lip_i_length_rm;
                lip_smallest = lip_smallest<model.lip_i_length_rd?lip_smallest:model.lip_i_length_rd;
            }else{
                lip_smallest = model.lip_i_length_lu<model.lip_i_length_lm?model.lip_i_length_lu:model.lip_i_length_lm;
                lip_smallest = lip_smallest<model.lip_i_length_ld?lip_smallest:model.lip_i_length_ld;
            }
            lip_smallest = lip_smallest*extention_ratio[1];

            let lip_i_u = side?-model.lip_i_length_ru+lip_smallest:model.lip_i_length_lu-lip_smallest;
            let lip_i_m = side?-model.lip_i_length_rm+lip_smallest:model.lip_i_length_lm-lip_smallest;
            let lip_i_d = side?-model.lip_i_length_rd+lip_smallest:model.lip_i_length_ld-lip_smallest;

            let extention_temp = (50-extention)/100;
            if(extention_temp<0) extention_temp = 0;
            lip_i_u = lip_i_u*extention_ratio[0] - lip_i_u*extention_temp;
            lip_i_m = lip_i_m*extention_ratio[0] - lip_i_m*extention_temp;
            lip_i_d = lip_i_d*extention_ratio[0] - lip_i_d*extention_temp;

            // 클리핑 영역 설정
            canvas.beginPath();
            if(side) canvas.moveTo(0,0);
            else     canvas.moveTo(center,0);
            canvas.lineTo(center, 0);
            canvas.lineTo(center, axis_Y + rclit_y/3);

            canvas.bezierCurveTo(
                fix_center +  lip_i_u/4, axis_Y + rclit_y/3 + model.lip_i_length/15,
                fix_center +  lip_i_u/2, axis_Y + model.lip_i_length*2/15,
                fix_center +  lip_i_u*3/4, axis_Y + model.lip_i_length*3/15,
                );
            canvas.bezierCurveTo(
                fix_center +  lip_i_u, axis_Y + model.lip_i_length*4/15,
                fix_center +  (2*lip_i_u+lip_i_m)/3, axis_Y + model.lip_i_length*5/15,
                fix_center +  (lip_i_u+2*lip_i_m)/3, axis_Y + model.lip_i_length*6/15,
                );
            canvas.bezierCurveTo(
                fix_center + lip_i_m, axis_Y + model.lip_i_length*7/15,
                fix_center + lip_i_m, axis_Y + model.lip_i_length*8/15,
                fix_center + (lip_i_d+2*lip_i_m)/3, axis_Y + model.lip_i_length*9/15
                );
            canvas.bezierCurveTo(
                fix_center + (2*lip_i_d+lip_i_m)/3, axis_Y + model.lip_i_length*10/15,
                fix_center + lip_i_d, axis_Y + model.lip_i_length*11/15,
                fix_center + lip_i_d*3/4, axis_Y + model.lip_i_length*12/15
                );
            canvas.bezierCurveTo(
                fix_center + lip_i_d/2, axis_Y + model.lip_i_length*13/15,
                fix_center + lip_i_d/4, axis_Y + model.lip_i_length*14/15,
                center, axis_E
                );

            let side_x_axis = side?0:center*2;
            canvas.lineTo(side_x_axis,axis_E);
            canvas.lineTo(side_x_axis,0);
            canvas.stroke();
            canvas.closePath();
            canvas.save(); // 현재 캔버스 상태 저장
            canvas.clip(); // 현재 경로를 클리핑 영역으로 설정

            if(side!=lip_direction){
                // 안으로 먹는경우 클리핑 영역
                let lip_other_u = !side?-model.lip_i_length_ru+lip_smallest:model.lip_i_length_lu-lip_smallest;
                let lip_other_m = !side?-model.lip_i_length_rm+lip_smallest:model.lip_i_length_lm-lip_smallest;
                let lip_other_d = !side?-model.lip_i_length_rd+lip_smallest:model.lip_i_length_ld-lip_smallest;
                const width_lip = model.lip_i_width*extention_ratio[1];
 
                lip_other_u = lip_other_u*extention_ratio[0] - lip_other_u*extention_temp;
                lip_other_m = lip_other_m*extention_ratio[0] - lip_other_m*extention_temp;
                lip_other_d = lip_other_d*extention_ratio[0] - lip_other_d*extention_temp;
                
                lip_other_u = !side? lip_other_u+width_lip:lip_other_u-width_lip;
                lip_other_m = !side? lip_other_m+width_lip:lip_other_m-width_lip;
                lip_other_d = !side? lip_other_d+width_lip:lip_other_d-width_lip;

                canvas.beginPath();
                if(side) canvas.moveTo(0,0);
                else     canvas.moveTo(center,0);
                canvas.lineTo(center, 0);
                canvas.lineTo(center, axis_Y + rclit_y/3);
                canvas.bezierCurveTo(
                    fix_center +  lip_other_u/4, axis_Y + rclit_y/3 + model.lip_i_length/15,
                    fix_center +  lip_other_u/2, axis_Y + model.lip_i_length*2/15,
                    fix_center +  lip_other_u*3/4, axis_Y + model.lip_i_length*3/15,
                    );
                canvas.bezierCurveTo(
                    fix_center +  lip_other_u, axis_Y + model.lip_i_length*4/15,
                    fix_center +  (2*lip_other_u+lip_other_m)/3, axis_Y + model.lip_i_length*5/15,
                    fix_center +  (lip_other_u+2*lip_other_m)/3, axis_Y + model.lip_i_length*6/15,
                    );
                canvas.bezierCurveTo(
                    fix_center + lip_other_m, axis_Y + model.lip_i_length*7/15,
                    fix_center + lip_other_m, axis_Y + model.lip_i_length*8/15,
                    fix_center + (lip_other_d+2*lip_other_m)/3, axis_Y + model.lip_i_length*9/15
                    );
                canvas.bezierCurveTo(
                    fix_center + (2*lip_other_d+lip_other_m)/3, axis_Y + model.lip_i_length*10/15,
                    fix_center + lip_other_d, axis_Y + model.lip_i_length*11/15,
                    fix_center + lip_other_d*3/4, axis_Y + model.lip_i_length*12/15
                    );
                canvas.bezierCurveTo(
                    fix_center + lip_other_d/2, axis_Y + model.lip_i_length*13/15,
                    fix_center + lip_other_d/4, axis_Y + model.lip_i_length*14/15,
                    center, axis_E
                    );


                canvas.lineTo(side_x_axis,axis_E);
                canvas.lineTo(side_x_axis,0);
                canvas.stroke();
                canvas.closePath();
                canvas.save(); // 현재 캔버스 상태 저장
                canvas.clip(); // 현재 경로를 클리핑 영역으로 설정
            }
            // pile
            canvas.beginPath();
            const hood_start = side?-model.hood_start/2:model.hood_start/2;
            const hood_width = side?-model.hood_width/2:model.hood_width/2;
            
            const core_x_ext = model.core_d_e*erection_ratio[0]+model.core_d**erection_ratio[1];
            const rclit_x    = side?-core_x_ext/2:core_x_ext/2;
            const outer_start = side?-model.core_d/2:model.core_d/2;

            const lip_width = model.lip_i_width;

            function middle_point_set(value_true,value_false) {
                let respose = null;
                if(side){
                    respose = value_true<-value_false?value_true:-value_false;
                }else{
                    respose = value_true>value_false ?value_true:value_false;
                }
                return respose;
            }

            let middle_point = middle_point_set((rclit_x + lip_i_u*3/4)*extention_ratio[0] + (lip_i_u+2*lip_i_m-rclit_x*2)/3*extention_ratio[1],(lip_width+center_add)/2);
            if(model.hood_start<model.hood_width*2/3){
                canvas.moveTo(center, init_point);
            }else{
                canvas.moveTo(center+hood_start, init_point);
            }            
            canvas.bezierCurveTo(
                center + hood_start, init_point,
                center + hood_width, axis_Y  + rclit_y/3*2,
                center + middle_point, axis_Y + model.lip_i_length*6/15
                );            
            //outer
            middle_point = middle_point_set((lip_i_u+2*lip_i_m)/3,lip_width+center_add);
            canvas.moveTo(center+hood_start+outer_start, init_point);
            canvas.bezierCurveTo(
                center + hood_start,           init_point,
                center + hood_width + rclit_x, axis_Y + rclit_y/3*2,
                center + middle_point, axis_Y + model.lip_i_length*6/15
                );
            canvas.quadraticCurveTo(
                center + middle_point*2/3, axis_Y + model.lip_i_length*10/15,
                center + outer_start, axis_E
                );
            // hood
            middle_point = middle_point_set(lip_i_u*3/4,(lip_width+center_add)/2);
            canvas.moveTo(center, axis_Y - rclit_y);
            canvas.bezierCurveTo(
                center + rclit_x,     axis_Y - rclit_y,
                center + (2*rclit_x+middle_point)/3,     axis_Y + rclit_y/3,
                center + middle_point, axis_Y + model.lip_i_length*6/15
                );
            canvas.quadraticCurveTo(
                center + middle_point*2/3, axis_Y + model.lip_i_length*10/15,
                center, axis_E
                );
            //clit
            canvas.moveTo(center, axis_Y - rclit_y);
            canvas.bezierCurveTo(
                center + rclit_x, axis_Y - rclit_y,
                center + rclit_x, axis_Y + rclit_y,
                center,           axis_Y + rclit_y/3,
                );              
            canvas.stroke();
            if(side!=lip_direction) canvas.restore(); // 이전 캔버스 상태로 복원 (클리핑 해제)
            canvas.restore(); // 이전 캔버스 상태로 복원 (클리핑 해제)
        }
        top_pair(true);
        top_pair(false);
    }
    function fepart_inner(canvas,init_point,center,model,extention,erection) {
        const extention_ratio = [extention/100,(100-extention)/100];
        const erection_ratio  = [erection/100,(100-erection)/100];
        const axis_E       = init_point + model.hood_length + model.lip_i_length;
        const inner_circle = model.lip_i_length - model.cu_distance/2;
        const rurethra     = model.urethra/2
        const rintroitus   = model.introitus/2*erection_ratio[1] + model.gape/2*erection_ratio[0];

        let axis_Y = init_point + model.hood_length;
        canvas.beginPath();
        const rclit_y = model.core_l_e/2*extention_ratio[0]+model.core_l/2*extention_ratio[1];
        let lip_smallest = (model.lip_i_length_ru+model.lip_i_length_lu)<(model.lip_i_length_rm+model.lip_i_length_lm)?(model.lip_i_length_ru+model.lip_i_length_lu):(model.lip_i_length_rm+model.lip_i_length_lm);
            lip_smallest = lip_smallest<(model.lip_i_length_rd+model.lip_i_length_ld)?lip_smallest:(model.lip_i_length_rd+model.lip_i_length_ld);
            lip_smallest = lip_smallest*extention_ratio[1];
        let lip_i_u = (model.lip_i_length_ru + model.lip_i_length_lu - lip_smallest)/2<model.lip_i_width?(model.lip_i_length_ru + model.lip_i_length_lu - lip_smallest)/2:model.lip_i_width;
        let lip_i_d = (model.lip_i_length_rd + model.lip_i_length_ld - lip_smallest)/2<model.lip_i_width?(model.lip_i_length_rd + model.lip_i_length_ld - lip_smallest)/2:model.lip_i_width;
        lip_i_u = lip_i_u-model.lip_i_width*extention_ratio[1]>0?lip_i_u-model.lip_i_width*extention_ratio[1]:0;
        lip_i_d = lip_i_d-model.lip_i_width*extention_ratio[1]>0?lip_i_d-model.lip_i_width*extention_ratio[1]:0;
        
        axis_Y += rclit_y*extention_ratio[1] + model.cu_distance/3*extention_ratio[0];
        canvas.moveTo(center, axis_Y);

        canvas.bezierCurveTo(
            center - (lip_i_u*extention_ratio[1]                + rurethra*extention_ratio[0]), 
                    axis_Y + model.lip_i_length/6*extention_ratio[1],
            center - ((2*lip_i_u+lip_i_d)/3*extention_ratio[1]  + (rintroitus*3/4+model.lip_i_length_ru/4)*extention_ratio[0]),
                    axis_Y + model.lip_i_length*2/6*extention_ratio[1]  + inner_circle/4*extention_ratio[0],
            center - ((lip_i_u+lip_i_d)/2*extention_ratio[1]    + (rintroitus*3/4+(model.lip_i_length_ru + model.lip_i_length_rd)/8)*extention_ratio[0]),
                    axis_Y +  model.lip_i_length*3/6*extention_ratio[1] + inner_circle/2*extention_ratio[0],
            );

        canvas.bezierCurveTo(
            center - ((lip_i_u+2*lip_i_d)/3*extention_ratio[1]  + (rintroitus*3/4 + model.lip_i_length_rd/4)*extention_ratio[0]), 
                    axis_Y + model.lip_i_length*4/6*extention_ratio[1] + inner_circle*3/4*extention_ratio[0],
            center - (lip_i_d*extention_ratio[1]                + rintroitus*extention_ratio[0]), 
                    (axis_Y + model.lip_i_length*5/6)*extention_ratio[1] + (axis_E - rurethra*3/2)*extention_ratio[0],
            center, axis_E - rurethra/2
            );

        canvas.bezierCurveTo(
            center + lip_i_d*extention_ratio[1]                 + rintroitus*extention_ratio[0], 
                    (axis_Y + model.lip_i_length*5/6)*extention_ratio[1] + (axis_E - rurethra*3/2)*extention_ratio[0],
            center + (lip_i_u+2*lip_i_d)/3*extention_ratio[1]   + (rintroitus*3/4 + model.lip_i_length_ld/4)*extention_ratio[0], 
                    axis_Y + model.lip_i_length*4/6*extention_ratio[1] + inner_circle*3/4*extention_ratio[0],
            center + (lip_i_u+lip_i_d)/2*extention_ratio[1]     + (rintroitus*3/4 + (model.lip_i_length_lu + model.lip_i_length_ld)/8)*extention_ratio[0],  
                    axis_Y +  model.lip_i_length*3/6*extention_ratio[1] + inner_circle/2*extention_ratio[0],
            );
            
        canvas.bezierCurveTo(
            center + (2*lip_i_u+lip_i_d)/3*extention_ratio[1]   + (rintroitus*3/4 + model.lip_i_length_lu/4)*extention_ratio[0],
                    axis_Y + model.lip_i_length*2/6*extention_ratio[1]  + inner_circle/4*extention_ratio[0],
            center + lip_i_u*extention_ratio[1]                 + rurethra*extention_ratio[0],
                    axis_Y + model.lip_i_length/6*extention_ratio[1],
            center, axis_Y,
            );

        canvas.stroke();
        canvas.save(); // 현재 캔버스 상태 저장
        canvas.clip(); // 현재 경로를 클리핑 영역으로 설정
        canvas.beginPath();
        //urethra
        canvas.fillStyle = "rgb(150, 50, 50)";
        axis_Y = init_point + model.hood_length + model.cu_distance;
        canvas.moveTo(center, axis_Y - rurethra);
        canvas.quadraticCurveTo(center, axis_Y, center - rurethra/2, axis_Y);
        canvas.quadraticCurveTo(center, axis_Y, center, axis_Y + rurethra);
        canvas.quadraticCurveTo(center, axis_Y, center + rurethra/2, axis_Y);
        canvas.quadraticCurveTo(center, axis_Y, center, axis_Y - rurethra);
        // canvas.quadraticCurveTo(center, axis_Y, center - 0.87*rurethra, axis_Y + rurethra/2);
        // canvas.quadraticCurveTo(center, axis_Y, center + 0.87*rurethra, axis_Y + rurethra/2);
        // canvas.quadraticCurveTo(center, axis_Y, center, axis_Y - rurethra);
        canvas.fill();
        canvas.beginPath();
        //intro
        axis_Y = axis_E - (model.introitus*erection_ratio[1]+model.gape*erection_ratio[0]) - (model.lip_i_length - model.cu_distance)/8;


        function intro(Y_axis){
            canvas.moveTo(center-(rintroitus-Y_axis)/2, axis_Y + Y_axis);
            canvas.quadraticCurveTo(
                center, axis_Y + Y_axis/2 + rurethra,
                center+(rintroitus-Y_axis)/2, axis_Y + Y_axis
                );
            canvas.bezierCurveTo(
                center + rintroitus - Y_axis/2, axis_Y + Y_axis,
                center + rintroitus - Y_axis/2, axis_Y + rintroitus,
                center + rintroitus - Y_axis/2, axis_Y + rintroitus
                );
            canvas.moveTo(center-(rintroitus-Y_axis)/2, axis_Y + Y_axis);
            canvas.bezierCurveTo(
                center - rintroitus + Y_axis/2, axis_Y + Y_axis,
                center - rintroitus + Y_axis/2, axis_Y + rintroitus,
                center - rintroitus + Y_axis/2, axis_Y + rintroitus
                );
            canvas.bezierCurveTo(
                center - rintroitus, axis_Y + rintroitus*2,
                center + rintroitus, axis_Y + rintroitus*2,
                center + rintroitus - Y_axis/2, axis_Y + rintroitus
                );      
        }
        for (let index = 0; index < rintroitus*8/10; index+=rintroitus/10) {
            intro(index);
        }
        canvas.stroke();
        canvas.beginPath();
        intro(rintroitus*8/10);
        canvas.fill();
        canvas.restore(); // 이전 캔버스 상태로 복원 (클리핑 해제)
    }
    function fepart_wing(canvas,init_point,center,model,extention,erection,center_add) {
        const extention_ratio = [extention/100,(100-extention)/100];
        const erection_ratio  = [erection/100,(100-erection)/100];
        
        const rclit_y    = model.core_l_e/2*erection_ratio[0]+model.core_l/2*erection_ratio[1];
        const axis_Y = init_point + model.hood_length;
        const axis_E = axis_Y + model.lip_i_length;

        function wing_pair(side,lip_width,inout) {
            const fix_center = side? center-center_add:center+center_add;
            function wing_draw(lip_i_length_u,lip_i_length_m,lip_i_length_d){
                canvas.moveTo(center, axis_Y + rclit_y/3);
                canvas.bezierCurveTo(
                    fix_center + lip_i_length_u/4, axis_Y + rclit_y/3 + model.lip_i_length/15,
                    fix_center + lip_i_length_u/2, axis_Y + model.lip_i_length*2/15,
                    fix_center + lip_i_length_u*3/4, axis_Y + model.lip_i_length*3/15,
                    );
                canvas.bezierCurveTo(
                    fix_center + lip_i_length_u, axis_Y + model.lip_i_length*4/15,
                    fix_center + (2*lip_i_length_u+lip_i_length_m)/3, axis_Y + model.lip_i_length*5/15,
                    fix_center + (lip_i_length_u+2*lip_i_length_m)/3, axis_Y + model.lip_i_length*6/15,
                    );
                canvas.bezierCurveTo(
                    fix_center + lip_i_length_m, axis_Y + model.lip_i_length*7/15,
                    fix_center + lip_i_length_m, axis_Y + model.lip_i_length*8/15,
                    fix_center + (lip_i_length_d+2*lip_i_length_m)/3, axis_Y + model.lip_i_length*9/15
                    );
                canvas.bezierCurveTo(
                    fix_center + (2*lip_i_length_d+lip_i_length_m)/3, axis_Y + model.lip_i_length*10/15,
                    fix_center + lip_i_length_d, axis_Y + model.lip_i_length*11/15,
                    fix_center + lip_i_length_d*3/4, axis_Y + model.lip_i_length*12/15
                    );
                canvas.bezierCurveTo(
                    fix_center + lip_i_length_d/2, axis_Y + model.lip_i_length*13/15,
                    fix_center + lip_i_length_d/4, axis_Y + model.lip_i_length*14/15,
                    center, axis_E
                    );
            }

            let   lip_smallest   = 0;
            if(side){
                lip_smallest = model.lip_i_length_ru<model.lip_i_length_rm?model.lip_i_length_ru:model.lip_i_length_rm;
                lip_smallest = lip_smallest<model.lip_i_length_rd?lip_smallest:model.lip_i_length_rd;
            }else{
                lip_smallest = model.lip_i_length_lu<model.lip_i_length_lm?model.lip_i_length_lu:model.lip_i_length_lm;
                lip_smallest = lip_smallest<model.lip_i_length_ld?lip_smallest:model.lip_i_length_ld;
            }
            lip_smallest = lip_smallest*extention_ratio[1];

            let lip_i_u = side?-model.lip_i_length_ru+lip_smallest:model.lip_i_length_lu-lip_smallest;
            let lip_i_m = side?-model.lip_i_length_rm+lip_smallest:model.lip_i_length_lm-lip_smallest;
            let lip_i_d = side?-model.lip_i_length_rd+lip_smallest:model.lip_i_length_ld-lip_smallest;
            const width_lip = lip_width*extention_ratio[1];

            let extention_temp = (50-extention)/100;
            if(extention_temp<0) extention_temp = 0;
            lip_i_u = lip_i_u*extention_ratio[0] - lip_i_u*extention_temp;
            lip_i_m = lip_i_m*extention_ratio[0] - lip_i_m*extention_temp;
            lip_i_d = lip_i_d*extention_ratio[0] - lip_i_d*extention_temp;

            if(inout){
                lip_i_u = side? lip_i_u+width_lip:lip_i_u-width_lip;
                lip_i_m = side? lip_i_m+width_lip:lip_i_m-width_lip;
                lip_i_d = side? lip_i_d+width_lip:lip_i_d-width_lip;
            }

            wing_draw(lip_i_u,lip_i_m,lip_i_d);
        }
        
        //덮는 lip 클리핑
        canvas.beginPath();
        if(lip_direction){
            wing_pair(true, model.lip_i_width,true);
            canvas.lineTo(center*2, axis_E);
            canvas.lineTo(center*2, axis_Y + rclit_y/3);
            canvas.lineTo(center, axis_Y + rclit_y/3);
        }else{
            wing_pair(false,model.lip_i_width,true);
            canvas.lineTo(0, axis_E);
            canvas.lineTo(0, axis_Y + rclit_y/3);
            canvas.lineTo(center, axis_Y + rclit_y/3);
        }        
        canvas.closePath();
        canvas.save();
        canvas.clip();
        //안쪽 lip 그리기
        canvas.beginPath();
        if(lip_direction){
            wing_pair(false,model.lip_i_width,false);
            wing_pair(false,model.lip_i_width,true);
        }else{
            wing_pair(true,model.lip_i_width,false);
            wing_pair(true,model.lip_i_width,true);
        }
        canvas.stroke();
        //안쪽 lip 클리핑
        canvas.beginPath();
        if(lip_direction){
            wing_pair(false,model.lip_i_width,true);
            canvas.lineTo(0, axis_E);
            canvas.lineTo(0, axis_Y + rclit_y/3);
            canvas.lineTo(center, axis_Y + rclit_y/3);
        }else{
            wing_pair(true, model.lip_i_width,true);
            canvas.lineTo(center*2, axis_E);
            canvas.lineTo(center*2, axis_Y + rclit_y/3);
            canvas.lineTo(center, axis_Y + rclit_y/3);
        }
        canvas.closePath();
        canvas.save();
        canvas.clip();
        // lips 안쪽
        fepart_inner(canvas,init_point,center,model,extention,erection);
        canvas.restore();
        canvas.restore();
        // 클리핑 외부영역 그리기
        canvas.beginPath();
        if(lip_direction){
            wing_pair(true,model.lip_i_width,false);
            wing_pair(true,model.lip_i_width,true);
        }else{
            wing_pair(false,model.lip_i_width,false);
            wing_pair(false,model.lip_i_width,true);
        }
        canvas.stroke();
    }
    function fepart_anus(canvas,init_point,center,model,ratio,wrinkle_size) {
        if(wrinkle.length != model.wrinkle){
            wrinkle = [];
            for (let index = 0; index < model.wrinkle; index++) {
                const direction = 10;
                const axis_x = Math.floor(Math.random() * direction*2)-direction;
                const axis_y = Math.floor(Math.random() * direction*2)-direction;
                const line_scale = Math.random()*wrinkle_size*ratio;
                const line_ratio = Math.sqrt(axis_x*axis_x+axis_y*axis_y);
                wrinkle.push([line_scale,axis_x/line_ratio,axis_y/line_ratio]);
            }
        }
        canvas.beginPath();
        const axis_E = init_point + model.hood_length + model.lip_i_length;
        const axis_Y = axis_E + model.perineum_l;
        flutter += (Math.random())-0.49;
        if(flutter>ratio)  flutter = ratio;
        else if(flutter<0) flutter = 0;
        for (let index = 0; index < wrinkle.length; index++) {
            const dynamic = [(110-Math.random()*20)/100,(110-Math.random()*20)/100]; //90~110%;
            canvas.moveTo(center+flutter*wrinkle[index][1], axis_Y+flutter*wrinkle[index][2]);
            canvas.lineTo(center+flutter*wrinkle[index][1] + dynamic[0]*wrinkle[index][0]*wrinkle[index][1],
                          axis_Y+flutter*wrinkle[index][2] + dynamic[1]*wrinkle[index][0]*wrinkle[index][2]);
        }
        canvas.stroke();
    }
    
    window.draw_fepart = function(state,horny){
        if(state===404){
            state = fepart_ext;
            fepart_ert = state;
        }else if(horny===404){
            horny = fepart_ert;
            fepart_ext = state;
        }
        if(target.type == 'X' && target.index != null){
            const container_value = document.querySelector(".character-image").style.flex;
            const canvas_width = Number(container_value.substring(4,container_value.length-2));
            
            document.getElementById("draw_section").innerHTML = `<canvas id="parts" width="${canvas_width}" height="600" style="border:1px solid black;">`;
            const model  = model_list[target.type][target.index].parts;
            const canvas = document.getElementById("parts");
            const canvas_center = canvas.width/2;
            const wrinkle_size  = 8;

            let lip_length = model.lip_i_length_lu;
            if(lip_length < model.lip_i_length_lm) lip_length = model.lip_i_length_lm;
            if(lip_length < model.lip_i_length_ld) lip_length = model.lip_i_length_ld;
            if(lip_length < model.lip_i_length_ru) lip_length = model.lip_i_length_ru;
            if(lip_length < model.lip_i_length_rm) lip_length = model.lip_i_length_rm;
            if(lip_length < model.lip_i_length_rd) lip_length = model.lip_i_length_rd;
            
            const introitus_ratio = 2/3;
            const ratio_w = canvas_center/(lip_length/10 + model.introitus*introitus_ratio/10);
            const parts_length = model.hood_length/10 + model.lip_i_length/10 + model.perineum_l/10 + wrinkle_size;

            const ratio_h = canvas.height/(parts_length + canvas.height/200);
            const ratio   = ratio_h<ratio_w?ratio_h:ratio_w;
            const init_point = (canvas.height-parts_length*ratio)/2;

            //conversion of units
            const draw  = {
                hood_shape     : model.hood_shape,
                hood_start     : ratio*model.hood_start/100,
                hood_width     : ratio*model.hood_width/100,
                hood_length    : ratio*model.hood_length/10,
                core_d         : ratio*model.core_d/100,
                core_d_e       : ratio*model.core_d_e/100,
                core_l         : ratio*model.core_l/100,
                core_l_e       : ratio*model.core_l_e/100,
                urethra        : ratio*model.urethra/10,
                lip_i_length   : ratio*model.lip_i_length/10,
                lip_i_length_lu: ratio*(model.lip_i_symmetry*model.lip_i_length_lu + (100-model.lip_i_symmetry)*model.lip_i_length_ru)/1000,
                lip_i_length_lm: ratio*(model.lip_i_symmetry*model.lip_i_length_lm + (100-model.lip_i_symmetry)*model.lip_i_length_rm)/1000,
                lip_i_length_ld: ratio*(model.lip_i_symmetry*model.lip_i_length_ld + (100-model.lip_i_symmetry)*model.lip_i_length_rd)/1000,
                lip_i_length_ru: ratio*((100-model.lip_i_symmetry)*model.lip_i_length_lu + model.lip_i_symmetry*model.lip_i_length_ru)/1000,
                lip_i_length_rm: ratio*((100-model.lip_i_symmetry)*model.lip_i_length_lm + model.lip_i_symmetry*model.lip_i_length_rm)/1000,
                lip_i_length_rd: ratio*((100-model.lip_i_symmetry)*model.lip_i_length_ld + model.lip_i_symmetry*model.lip_i_length_rd)/1000,
                lip_i_width    : ratio*model.lip_i_length/100,
                cu_distance    : ratio*model.cu_distance/10,
                introitus      : ratio*model.introitus/10,
                gape           : ratio*model.gape/10,
                perineum_l     : ratio*model.perineum_l/10,
                wrinkle        : model.wrinkle
            }
            const fix_center_add  = draw.introitus*state/100*introitus_ratio;
            const ctx   = canvas.getContext("2d");
            ctx.strokeStyle = "rgb(255, 150, 150)";
            length_scale(ctx,ratio);
            fepart_top(ctx,init_point,canvas_center,draw,state,horny,fix_center_add);
            ctx.strokeStyle = "rgb(150, 255, 150)";
            fepart_wing(ctx,init_point,canvas_center,draw,state,horny,fix_center_add);
            fepart_anus(ctx,init_point,canvas_center,draw,ratio,wrinkle_size);
        }
    }

    function length_scale(canvas,ratio) {
        const init_point = 10;
        canvas.beginPath();
        canvas.moveTo(init_point,               init_point);
        canvas.lineTo(init_point + ratio*10,    init_point);
        canvas.lineTo(init_point + ratio*10,    init_point+ratio);
        canvas.lineTo(init_point,               init_point+ratio);
        canvas.fill();
        canvas.fillText("0mm",init_point,              init_point*2.5)
        canvas.fillText("10",init_point + ratio*10 - 11,   init_point*2.5)
    }
