// wasm_module contained following functions
// 1. test_alert, new_info, 
// 2. head_new, head_meiosis, head_blend, head_save, head_load, 
// 3. body_new, body_meiosis, body_blend, body_save, body_load, body_cup_s, body_cup_w, body_weight,
// 4. parts_new, parts_meiosis, parts_blend, parts_save, parts_load, parts_top,
import init, * as model_mk from "wasm_module";

export const model_list = {X:[],Y:[]};
export const target = {type:null,index:null};
export const model_config_Y = {
    lip_direction:  true,
    intensive:      0,
    fepart_ext:     0,
    fepart_ert:     0
}
const model_select = {
    mother: null,
    father: null
}

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
        info  : JSON.parse(model_mk.new_info(model_class)),
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
    if(model_select.mother != null && model_select.father != null) generation = true;
    if(generation){
        model.info.family = model_list.Y[father].info.family;
        model.mother.head = model_mk.head_meiosis(model_list.X[mother].mother.head,model_list.X[mother].father.head);
        model.father.head = model_mk.head_meiosis(model_list.Y[father].mother.head,model_list.Y[father].father.head);

        model.mother.body = model_mk.body_meiosis(model_list.X[mother].mother.body,model_list.X[mother].father.body);
        model.father.body = model_mk.body_meiosis(model_list.Y[father].mother.body,model_list.Y[father].father.body);

        model.mother.parts = model_mk.parts_meiosis(model_list.X[mother].mother.parts,model_list.X[mother].father.parts);
        model.father.parts = model_mk.parts_meiosis(model_list.Y[father].mother.parts,model_list.Y[father].father.parts);
    }else {
        model.mother.head  = model_mk.head_new();
        model.father.head  = model_mk.head_new();

        model.mother.body  = model_mk.body_new(false);
        model.father.body  = model_mk.body_new(true);

        model.mother.parts = model_mk.parts_new(false);
        model.father.parts = model_mk.parts_new(true);
    }
    model.gen.head = model_mk.head_blend(model.mother.head,model.father.head,model.info.gender);
    model.gen.body = model_mk.body_blend(model.mother.body,model.father.body,model.info.gender);
    model.gen.parts = model_mk.parts_blend(model.mother.parts,model.father.parts,model.info.gender);

    model.head  = JSON.parse(model_mk.head_save(model.gen.head));
    model.body  = JSON.parse(model_mk.body_save(model.gen.body));
    model.parts = JSON.parse(model_mk.parts_save(model.gen.parts));

    // model.gen.head  = model_mk.head_load(JSON.stringify(model.head));
    // model.gen.body  = model_mk.body_load(JSON.stringify(model.body));
    // model.gen.parts = model_mk.parts_load(JSON.stringify(model.parts));

    model.calc.cup = model_mk.body_cup_s(model.gen.body);
    model.calc.c_w = model_mk.body_cup_w(model.gen.body);
    if(model.calc.cup == '@') model.calc.cup = 'AA';

    let _hight  = model.gen.body.height;
    let _weight = model_mk.body_weight(model.gen.body);
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
        model_mk.test_alert(alarm_text);
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
        model_select.father = index;
        console.log("father:"+index);
    }else{
        model_type = "X";
        model_select.mother = index;
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
    if(type){
    }else{
        model_config_Y.lip_direction = Math.random()<0.5;
        model_config_Y.intensive = Math.floor(Math.random()*50);
        model_config_Y.fepart_ext = 0;
        model_config_Y.fepart_ert = 0;
        draw_fepart(0,0);
    }
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