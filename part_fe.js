
import {model_list, target, model_config_Y} from "model_maker";

let wrinkle = [];
let flutter = 0;

function fepart_top(canvas,init_point,center,model,extention,erection,center_add) {

    const config_axis = config_axis_Y(init_point,model,erection);
    let config_shape  = null;

    const extention_ratio = [extention/100,(100-extention)/100];
    const erection_ratio  = [erection/100,(100-erection)/100];

    function top_pair(side) {
        // 클리핑 영역 설정
        canvas.beginPath();
        if(side) canvas.moveTo(0,init_point);
        else     canvas.moveTo(center*2,init_point);
        canvas.lineTo(center, init_point);
        canvas.lineTo(center, config_axis.axis_Y + config_axis.rclit_Y/3);

        config_shape = config_wing(side,false,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);

        let side_x_axis = side?0:center*2;
        canvas.lineTo(side_x_axis,config_axis.axis_Y_end);
        canvas.lineTo(side_x_axis,init_point);
        // canvas.stroke();
        canvas.closePath();
        canvas.save(); // 현재 캔버스 상태 저장
        canvas.clip(); // 현재 경로를 클리핑 영역으로 설정  

        if(side!=model_config_Y.lip_direction){
            canvas.beginPath();
            if(side) canvas.moveTo(0,init_point);
            else     canvas.moveTo(center*2,init_point);
            canvas.lineTo(center, 0);
            canvas.lineTo(center, config_axis.axis_Y + config_axis.rclit_Y/3);

            const config_shape_other = config_wing(!side,true,center,center_add,model,extention);
            draw_wing(canvas,config_shape_other,config_axis);

            canvas.lineTo(side_x_axis,config_axis.axis_Y_end);
            canvas.lineTo(side_x_axis,init_point);
            // canvas.stroke();
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

        let middle_point = middle_point_set((rclit_x + config_shape.minora_width_u*3/4)*extention_ratio[0] + (config_shape.minora_width_u+2*config_shape.minora_width_m-rclit_x*2)/3*extention_ratio[1],(lip_width+center_add)/2);
        if(model.hood_start<model.hood_width*2/3){
            canvas.moveTo(center, init_point);
        }else{
            canvas.moveTo(center+hood_start, init_point);
        }

        canvas.bezierCurveTo(
            center + hood_start, init_point,
            center + hood_width, config_axis.axis_Y  + config_axis.rclit_Y/3*2,
            center + middle_point, config_axis.axis_Y + model.lip_i_length*6/15
            );            
        //outer
        middle_point = middle_point_set((config_shape.minora_width_u+2*config_shape.minora_width_m)/3,lip_width+center_add);
        canvas.moveTo(center+hood_start+outer_start, init_point);
        canvas.bezierCurveTo(
            center + hood_start,           init_point,
            center + hood_width + rclit_x, config_axis.axis_Y + config_axis.rclit_Y/3*2,
            center + middle_point, config_axis.axis_Y + model.lip_i_length*6/15
            );
        canvas.quadraticCurveTo(
            center + middle_point*2/3, config_axis.axis_Y + model.lip_i_length*10/15,
            center + outer_start, config_axis.axis_Y_end
            );
        // hood
        middle_point = middle_point_set(config_shape.minora_width_u*3/4,(lip_width+center_add)/2);
        canvas.moveTo(center, config_axis.axis_Y - config_axis.rclit_Y);
        canvas.bezierCurveTo(
            center + rclit_x,     config_axis.axis_Y - config_axis.rclit_Y,
            center + (2*rclit_x+middle_point)/3,     config_axis.axis_Y + config_axis.rclit_Y/3,
            center + middle_point, config_axis.axis_Y + model.lip_i_length*6/15
            );
        canvas.quadraticCurveTo(
            center + middle_point*2/3, config_axis.axis_Y + model.lip_i_length*10/15,
            center, config_axis.axis_Y_end
            );
        //clit
        canvas.moveTo(center, config_axis.axis_Y - config_axis.rclit_Y);
        canvas.bezierCurveTo(
            center + rclit_x, config_axis.axis_Y - config_axis.rclit_Y,
            center + rclit_x, config_axis.axis_Y + config_axis.rclit_Y,
            center,           config_axis.axis_Y + config_axis.rclit_Y/3,
            );              
        canvas.stroke();

        if(side!=model_config_Y.lip_direction) canvas.restore(); // 이전 캔버스 상태로 복원 (클리핑 해제)
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
    const rclit_Y = model.core_l_e/2*extention_ratio[0]+model.core_l/2*extention_ratio[1];
    let lip_smallest = (model.lip_i_length_ru+model.lip_i_length_lu)<(model.lip_i_length_rm+model.lip_i_length_lm)?(model.lip_i_length_ru+model.lip_i_length_lu):(model.lip_i_length_rm+model.lip_i_length_lm);
        lip_smallest = lip_smallest<(model.lip_i_length_rd+model.lip_i_length_ld)?lip_smallest:(model.lip_i_length_rd+model.lip_i_length_ld);
        lip_smallest = lip_smallest*extention_ratio[1];
    let lip_i_u = (model.lip_i_length_ru + model.lip_i_length_lu - lip_smallest)/2<model.lip_i_width?(model.lip_i_length_ru + model.lip_i_length_lu - lip_smallest)/2:model.lip_i_width;
    let lip_i_d = (model.lip_i_length_rd + model.lip_i_length_ld - lip_smallest)/2<model.lip_i_width?(model.lip_i_length_rd + model.lip_i_length_ld - lip_smallest)/2:model.lip_i_width;
    lip_i_u = lip_i_u-model.lip_i_width*extention_ratio[1]>0?lip_i_u-model.lip_i_width*extention_ratio[1]:0;
    lip_i_d = lip_i_d-model.lip_i_width*extention_ratio[1]>0?lip_i_d-model.lip_i_width*extention_ratio[1]:0;
    
    axis_Y += rclit_Y*extention_ratio[1] + model.cu_distance/3*extention_ratio[0];
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
////--------------------- config ---------------------//
function config_axis_Y(init_point,model,erection) {
    const erection_ratio  = [erection/100,(100-erection)/100];
    const rclit_Y   = model.core_l_e/2*erection_ratio[0]+model.core_l/2*erection_ratio[1];
    const axis_Y    = init_point + model.hood_length;
    const axis_E    = axis_Y + model.lip_i_length;
    return{
        rclit_Y:    rclit_Y,
        axis_Y:     axis_Y,
        axis_Y_end: axis_E
    }
}
function config_wing(side,inout,center,center_add,model,extention) {
    const extention_ratio = [extention/100,(100-extention)/100];
    const fix_center    = side? center-center_add:center+center_add;
    let   lip_smallest  = 0;
    if(side){
        lip_smallest    = model.lip_i_length_ru<model.lip_i_length_rm?model.lip_i_length_ru:model.lip_i_length_rm;
        lip_smallest    = lip_smallest<model.lip_i_length_rd?lip_smallest:model.lip_i_length_rd;
    }else{
        lip_smallest    = model.lip_i_length_lu<model.lip_i_length_lm?model.lip_i_length_lu:model.lip_i_length_lm;
        lip_smallest    = lip_smallest<model.lip_i_length_ld?lip_smallest:model.lip_i_length_ld;
    }
    const width_lip = model.lip_i_width*extention_ratio[1];
    lip_smallest = lip_smallest*extention_ratio[1]-width_lip;

    let minora_width_u  = side?-model.lip_i_length_ru+lip_smallest:model.lip_i_length_lu-lip_smallest;
    let minora_width_m  = side?-model.lip_i_length_rm+lip_smallest:model.lip_i_length_lm-lip_smallest;
    let minora_width_d  = side?-model.lip_i_length_rd+lip_smallest:model.lip_i_length_ld-lip_smallest;

    let extention_temp  = (model_config_Y.intensive-extention)/100;
    if(extention_temp<0) extention_temp = 0;
    minora_width_u  = minora_width_u*extention_ratio[0] - minora_width_u*extention_temp;
    minora_width_m  = minora_width_m*extention_ratio[0] - minora_width_m*extention_temp;
    minora_width_d  = minora_width_d*extention_ratio[0] - minora_width_d*extention_temp;

    minora_width_u  += side? -width_lip:width_lip;
    minora_width_m  += side? -width_lip:width_lip;
    minora_width_d  += side? -width_lip:width_lip;
    
    if(inout){
        minora_width_u  = side? minora_width_u+width_lip:minora_width_u-width_lip;
        minora_width_m  = side? minora_width_m+width_lip:minora_width_m-width_lip;
        minora_width_d  = side? minora_width_d+width_lip:minora_width_d-width_lip;
    }
    return {
        center:         center,
        center_fixed:   fix_center,
        minora_length:  model.lip_i_length,
        minora_width_u: minora_width_u,
        minora_width_m: minora_width_m,
        minora_width_d: minora_width_d
    }
}
////--------------------- config ---------------------//
////--------------------- drawing ---------------------//
function draw_wing(canvas,config_shape,config_axis){
    canvas.moveTo(config_shape.center, config_axis.axis_Y + config_axis.rclit_Y/3);
    canvas.bezierCurveTo(
        config_shape.center_fixed + config_shape.minora_width_u/4, config_axis.axis_Y + config_axis.rclit_Y/3 + config_shape.minora_length/15,
        config_shape.center_fixed + config_shape.minora_width_u/2, config_axis.axis_Y + config_shape.minora_length*2/15,
        config_shape.center_fixed + config_shape.minora_width_u*3/4, config_axis.axis_Y + config_shape.minora_length*3/15,
        );
    canvas.bezierCurveTo(
        config_shape.center_fixed + config_shape.minora_width_u, config_axis.axis_Y + config_shape.minora_length*4/15,
        config_shape.center_fixed + (2*config_shape.minora_width_u+config_shape.minora_width_m)/3, config_axis.axis_Y + config_shape.minora_length*5/15,
        config_shape.center_fixed + (config_shape.minora_width_u+2*config_shape.minora_width_m)/3, config_axis.axis_Y + config_shape.minora_length*6/15,
        );
    canvas.bezierCurveTo(
        config_shape.center_fixed + config_shape.minora_width_m, config_axis.axis_Y + config_shape.minora_length*7/15,
        config_shape.center_fixed + config_shape.minora_width_m, config_axis.axis_Y + config_shape.minora_length*8/15,
        config_shape.center_fixed + (config_shape.minora_width_d+2*config_shape.minora_width_m)/3, config_axis.axis_Y + config_shape.minora_length*9/15
        );
    canvas.bezierCurveTo(
        config_shape.center_fixed + (2*config_shape.minora_width_d+config_shape.minora_width_m)/3, config_axis.axis_Y + config_shape.minora_length*10/15,
        config_shape.center_fixed + config_shape.minora_width_d, config_axis.axis_Y + config_shape.minora_length*11/15,
        config_shape.center_fixed + config_shape.minora_width_d*3/4, config_axis.axis_Y + config_shape.minora_length*12/15
        );
    canvas.bezierCurveTo(
        config_shape.center_fixed + config_shape.minora_width_d/2, config_axis.axis_Y + config_shape.minora_length*13/15,
        config_shape.center_fixed + config_shape.minora_width_d/4, config_axis.axis_Y + config_shape.minora_length*14/15,
        config_shape.center, config_axis.axis_Y_end
        );
}
function draw_wing_clipp(canvas,minora_ddirection,center,config_axis) {
    if(minora_ddirection){
        canvas.lineTo(center*2, config_axis.axis_Y_end);
        canvas.lineTo(center*2, config_axis.axis_Y + config_axis.rclit_Y/3);
        canvas.lineTo(center,   config_axis.axis_Y + config_axis.rclit_Y/3);
    }else{
        canvas.lineTo(0,        config_axis.axis_Y_end);
        canvas.lineTo(0,        config_axis.axis_Y + config_axis.rclit_Y/3);
        canvas.lineTo(center,   config_axis.axis_Y + config_axis.rclit_Y/3);
    }      
}
////--------------------- drawing ---------------------//

function fepart_wing(canvas,init_point,center,model,extention,erection,center_add) {
    const config_axis = config_axis_Y(init_point,model,erection);
    let config_shape  = null;
    //덮는 lip 클리핑
    canvas.beginPath();
    config_shape = config_wing(model_config_Y.lip_direction,true,center,center_add,model,extention);
    draw_wing(canvas,config_shape,config_axis);
    draw_wing_clipp(canvas,model_config_Y.lip_direction,center,config_axis);
    canvas.closePath();
    canvas.save();
    canvas.clip();
    //안쪽 lip 그리기
    canvas.beginPath();
    if(model_config_Y.lip_direction){
        config_shape = config_wing(false,false,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);            
        config_shape = config_wing(false,true,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);
    }else{
        config_shape = config_wing(true,false,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);            
        config_shape = config_wing(true,true,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);
    }
    canvas.stroke();
    //안쪽 lip 클리핑
    canvas.beginPath();
    config_shape = config_wing(!model_config_Y.lip_direction,true,center,center_add,model,extention);
    draw_wing(canvas,config_shape,config_axis);
    draw_wing_clipp(canvas,!model_config_Y.lip_direction,center,config_axis);
    canvas.closePath();
    canvas.save();
    canvas.clip();
    // lips 안쪽
    fepart_inner(canvas,init_point,center,model,extention,erection);
    canvas.restore();
    canvas.restore();
    // 클리핑 외부영역 그리기
    canvas.beginPath();
    if(model_config_Y.lip_direction){
        config_shape = config_wing(true,false,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);            
        config_shape = config_wing(true,true,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);            
    }else{
        config_shape = config_wing(false,false,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);            
        config_shape = config_wing(false,true,center,center_add,model,extention);
        draw_wing(canvas,config_shape,config_axis);            
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
        state = model_config_Y.fepart_ext;
        model_config_Y.fepart_ert = state;
    }else if(horny===404){
        horny = model_config_Y.fepart_ert;
        model_config_Y.fepart_ext = state;
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