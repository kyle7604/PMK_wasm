let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
*/
export function main() {
    wasm.main();
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} message
*/
export function console_log(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.console_log(ptr0, len0);
}

/**
* @param {string} text
*/
export function test_alert(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.test_alert(ptr0, len0);
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}
/**
* @param {number} _gender
* @returns {string}
*/
export function new_info(_gender) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.new_info(retptr, _gender);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
* @returns {Head}
*/
export function head_new() {
    const ret = wasm.head_new();
    return Head.__wrap(ret);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {Head} mother
* @param {Head} father
* @returns {Head}
*/
export function head_meiosis(mother, father) {
    _assertClass(mother, Head);
    _assertClass(father, Head);
    const ret = wasm.head_meiosis(mother.__wbg_ptr, father.__wbg_ptr);
    return Head.__wrap(ret);
}

/**
* @param {Head} mother
* @param {Head} father
* @param {boolean} _gender
* @returns {Head}
*/
export function head_blend(mother, father, _gender) {
    _assertClass(mother, Head);
    _assertClass(father, Head);
    const ret = wasm.head_blend(mother.__wbg_ptr, father.__wbg_ptr, _gender);
    return Head.__wrap(ret);
}

/**
* @param {Head} model
* @returns {string}
*/
export function head_save(model) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(model, Head);
        wasm.head_save(retptr, model.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
* @param {string} model
* @returns {Head}
*/
export function head_load(model) {
    const ptr0 = passStringToWasm0(model, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.head_load(ptr0, len0);
    return Head.__wrap(ret);
}

/**
* @param {boolean} _gender
* @returns {Body}
*/
export function body_new(_gender) {
    const ret = wasm.body_new(_gender);
    return Body.__wrap(ret);
}

/**
* @param {Body} mother
* @param {Body} father
* @param {boolean} _gender
* @returns {Body}
*/
export function body_meiosis(mother, father, _gender) {
    _assertClass(mother, Body);
    _assertClass(father, Body);
    const ret = wasm.body_meiosis(mother.__wbg_ptr, father.__wbg_ptr, _gender);
    return Body.__wrap(ret);
}

/**
* @param {Body} mother
* @param {Body} father
* @param {boolean} _gender
* @returns {Body}
*/
export function body_blend(mother, father, _gender) {
    _assertClass(mother, Body);
    _assertClass(father, Body);
    const ret = wasm.body_blend(mother.__wbg_ptr, father.__wbg_ptr, _gender);
    return Body.__wrap(ret);
}

/**
* @param {Body} model
* @returns {string}
*/
export function body_save(model) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(model, Body);
        wasm.body_save(retptr, model.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
* @param {string} model
* @returns {Body}
*/
export function body_load(model) {
    const ptr0 = passStringToWasm0(model, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.body_load(ptr0, len0);
    return Body.__wrap(ret);
}

/**
* @param {Body} model
* @returns {string}
*/
export function body_cup_s(model) {
    _assertClass(model, Body);
    const ret = wasm.body_cup_s(model.__wbg_ptr);
    return String.fromCodePoint(ret);
}

/**
* @param {Body} model
* @returns {number}
*/
export function body_cup_w(model) {
    _assertClass(model, Body);
    const ret = wasm.body_cup_w(model.__wbg_ptr);
    return ret;
}

/**
* @param {Body} model
* @returns {number}
*/
export function body_weight(model) {
    _assertClass(model, Body);
    const ret = wasm.body_weight(model.__wbg_ptr);
    return ret;
}

/**
* @param {boolean} _gender
* @returns {Erogenous}
*/
export function parts_new(_gender) {
    const ret = wasm.parts_new(_gender);
    return Erogenous.__wrap(ret);
}

/**
* @param {Erogenous} mother
* @param {Erogenous} father
* @param {boolean} _gender
* @returns {Erogenous}
*/
export function parts_meiosis(mother, father, _gender) {
    _assertClass(mother, Erogenous);
    _assertClass(father, Erogenous);
    const ret = wasm.parts_meiosis(mother.__wbg_ptr, father.__wbg_ptr, _gender);
    return Erogenous.__wrap(ret);
}

/**
* @param {Erogenous} mother
* @param {Erogenous} father
* @param {boolean} _gender
* @returns {Erogenous}
*/
export function parts_blend(mother, father, _gender) {
    _assertClass(mother, Erogenous);
    _assertClass(father, Erogenous);
    const ret = wasm.parts_blend(mother.__wbg_ptr, father.__wbg_ptr, _gender);
    return Erogenous.__wrap(ret);
}

/**
* @param {Erogenous} model
* @returns {string}
*/
export function parts_save(model) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(model, Erogenous);
        wasm.parts_save(retptr, model.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
* @param {string} model
* @returns {Erogenous}
*/
export function parts_load(model) {
    const ptr0 = passStringToWasm0(model, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.parts_load(ptr0, len0);
    return Erogenous.__wrap(ret);
}

/**
* @param {Erogenous} model
* @returns {string}
*/
export function parts_top(model) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(model, Erogenous);
        wasm.parts_top(retptr, model.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const BodyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_body_free(ptr >>> 0, 1));
/**
*/
export class Body {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Body.prototype);
        obj.__wbg_ptr = ptr;
        BodyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BodyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_body_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get blood() {
        const ret = wasm.__wbg_get_body_blood(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set blood(arg0) {
        wasm.__wbg_set_body_blood(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get color() {
        const ret = wasm.__wbg_get_body_color(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set color(arg0) {
        wasm.__wbg_set_body_color(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        const ret = wasm.__wbg_get_body_height(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_body_height(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get breast() {
        const ret = wasm.__wbg_get_body_breast(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set breast(arg0) {
        wasm.__wbg_set_body_breast(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get chest() {
        const ret = wasm.__wbg_get_body_chest(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set chest(arg0) {
        wasm.__wbg_set_body_chest(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get waist() {
        const ret = wasm.__wbg_get_body_waist(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set waist(arg0) {
        wasm.__wbg_set_body_waist(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get hip() {
        const ret = wasm.__wbg_get_body_hip(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hip(arg0) {
        wasm.__wbg_set_body_hip(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get leg_ratio() {
        const ret = wasm.__wbg_get_body_leg_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set leg_ratio(arg0) {
        wasm.__wbg_set_body_leg_ratio(this.__wbg_ptr, arg0);
    }
}

const ErogenousFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_erogenous_free(ptr >>> 0, 1));
/**
*/
export class Erogenous {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Erogenous.prototype);
        obj.__wbg_ptr = ptr;
        ErogenousFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ErogenousFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_erogenous_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get hood_shape() {
        const ret = wasm.__wbg_get_erogenous_hood_shape(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hood_shape(arg0) {
        wasm.__wbg_set_erogenous_hood_shape(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get hood_texture() {
        const ret = wasm.__wbg_get_erogenous_hood_texture(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hood_texture(arg0) {
        wasm.__wbg_set_erogenous_hood_texture(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get hood_start() {
        const ret = wasm.__wbg_get_body_height(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hood_start(arg0) {
        wasm.__wbg_set_body_height(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get hood_width() {
        const ret = wasm.__wbg_get_body_breast(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hood_width(arg0) {
        wasm.__wbg_set_body_breast(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get hood_length() {
        const ret = wasm.__wbg_get_body_chest(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hood_length(arg0) {
        wasm.__wbg_set_body_chest(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_symmetry() {
        const ret = wasm.__wbg_get_erogenous_lip_i_symmetry(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_symmetry(arg0) {
        wasm.__wbg_set_erogenous_lip_i_symmetry(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_texture() {
        const ret = wasm.__wbg_get_erogenous_lip_i_texture(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_texture(arg0) {
        wasm.__wbg_set_erogenous_lip_i_texture(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_width() {
        const ret = wasm.__wbg_get_body_waist(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_width(arg0) {
        wasm.__wbg_set_body_waist(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length() {
        const ret = wasm.__wbg_get_body_hip(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length(arg0) {
        wasm.__wbg_set_body_hip(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length_ru() {
        const ret = wasm.__wbg_get_body_leg_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length_ru(arg0) {
        wasm.__wbg_set_body_leg_ratio(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length_rm() {
        const ret = wasm.__wbg_get_erogenous_lip_i_length_rm(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length_rm(arg0) {
        wasm.__wbg_set_erogenous_lip_i_length_rm(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length_rd() {
        const ret = wasm.__wbg_get_erogenous_lip_i_length_rd(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length_rd(arg0) {
        wasm.__wbg_set_erogenous_lip_i_length_rd(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length_lu() {
        const ret = wasm.__wbg_get_erogenous_lip_i_length_lu(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length_lu(arg0) {
        wasm.__wbg_set_erogenous_lip_i_length_lu(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length_lm() {
        const ret = wasm.__wbg_get_erogenous_lip_i_length_lm(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length_lm(arg0) {
        wasm.__wbg_set_erogenous_lip_i_length_lm(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_i_length_ld() {
        const ret = wasm.__wbg_get_erogenous_lip_i_length_ld(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_i_length_ld(arg0) {
        wasm.__wbg_set_erogenous_lip_i_length_ld(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_o_shape() {
        const ret = wasm.__wbg_get_erogenous_lip_o_shape(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_o_shape(arg0) {
        wasm.__wbg_set_erogenous_lip_o_shape(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lip_o_texture() {
        const ret = wasm.__wbg_get_erogenous_lip_o_texture(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lip_o_texture(arg0) {
        wasm.__wbg_set_erogenous_lip_o_texture(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get cu_distance() {
        const ret = wasm.__wbg_get_erogenous_cu_distance(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set cu_distance(arg0) {
        wasm.__wbg_set_erogenous_cu_distance(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get introitus() {
        const ret = wasm.__wbg_get_erogenous_introitus(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set introitus(arg0) {
        wasm.__wbg_set_erogenous_introitus(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get gape() {
        const ret = wasm.__wbg_get_erogenous_gape(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set gape(arg0) {
        wasm.__wbg_set_erogenous_gape(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get core_d() {
        const ret = wasm.__wbg_get_erogenous_core_d(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set core_d(arg0) {
        wasm.__wbg_set_erogenous_core_d(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get core_d_e() {
        const ret = wasm.__wbg_get_erogenous_core_d_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set core_d_e(arg0) {
        wasm.__wbg_set_erogenous_core_d_e(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get core_l() {
        const ret = wasm.__wbg_get_erogenous_core_l(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set core_l(arg0) {
        wasm.__wbg_set_erogenous_core_l(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get core_l_e() {
        const ret = wasm.__wbg_get_erogenous_core_l_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set core_l_e(arg0) {
        wasm.__wbg_set_erogenous_core_l_e(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get urethra() {
        const ret = wasm.__wbg_get_erogenous_urethra(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set urethra(arg0) {
        wasm.__wbg_set_erogenous_urethra(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get body_d() {
        const ret = wasm.__wbg_get_erogenous_body_d(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set body_d(arg0) {
        wasm.__wbg_set_erogenous_body_d(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get body_d_e() {
        const ret = wasm.__wbg_get_erogenous_body_d_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set body_d_e(arg0) {
        wasm.__wbg_set_erogenous_body_d_e(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get body_l() {
        const ret = wasm.__wbg_get_erogenous_body_l(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set body_l(arg0) {
        wasm.__wbg_set_erogenous_body_l(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get body_l_e() {
        const ret = wasm.__wbg_get_erogenous_body_l_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set body_l_e(arg0) {
        wasm.__wbg_set_erogenous_body_l_e(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get ball_r() {
        const ret = wasm.__wbg_get_erogenous_ball_r(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set ball_r(arg0) {
        wasm.__wbg_set_erogenous_ball_r(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get ball_l() {
        const ret = wasm.__wbg_get_erogenous_ball_l(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set ball_l(arg0) {
        wasm.__wbg_set_erogenous_ball_l(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get prepuce() {
        const ret = wasm.__wbg_get_erogenous_prepuce(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set prepuce(arg0) {
        wasm.__wbg_set_erogenous_prepuce(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get invert() {
        const ret = wasm.__wbg_get_erogenous_invert(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set invert(arg0) {
        wasm.__wbg_set_erogenous_invert(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get fork() {
        const ret = wasm.__wbg_get_erogenous_fork(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set fork(arg0) {
        wasm.__wbg_set_erogenous_fork(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get perineum() {
        const ret = wasm.__wbg_get_erogenous_perineum(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set perineum(arg0) {
        wasm.__wbg_set_erogenous_perineum(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get perineum_l() {
        const ret = wasm.__wbg_get_erogenous_perineum_l(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set perineum_l(arg0) {
        wasm.__wbg_set_erogenous_perineum_l(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get wrinkle() {
        const ret = wasm.__wbg_get_erogenous_wrinkle(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set wrinkle(arg0) {
        wasm.__wbg_set_erogenous_wrinkle(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get areola() {
        const ret = wasm.__wbg_get_erogenous_areola(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set areola(arg0) {
        wasm.__wbg_set_erogenous_areola(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get nipple_d() {
        const ret = wasm.__wbg_get_erogenous_nipple_d(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set nipple_d(arg0) {
        wasm.__wbg_set_erogenous_nipple_d(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get nipple_d_e() {
        const ret = wasm.__wbg_get_erogenous_nipple_d_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set nipple_d_e(arg0) {
        wasm.__wbg_set_erogenous_nipple_d_e(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get nipple_h() {
        const ret = wasm.__wbg_get_erogenous_nipple_h(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set nipple_h(arg0) {
        wasm.__wbg_set_erogenous_nipple_h(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get nipple_h_e() {
        const ret = wasm.__wbg_get_erogenous_nipple_h_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set nipple_h_e(arg0) {
        wasm.__wbg_set_erogenous_nipple_h_e(this.__wbg_ptr, arg0);
    }
}

const HeadFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_head_free(ptr >>> 0, 1));
/**
*/
export class Head {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Head.prototype);
        obj.__wbg_ptr = ptr;
        HeadFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HeadFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_head_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get hair() {
        const ret = wasm.__wbg_get_head_hair(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set hair(arg0) {
        wasm.__wbg_set_head_hair(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get curl() {
        const ret = wasm.__wbg_get_head_curl(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set curl(arg0) {
        wasm.__wbg_set_head_curl(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get eye() {
        const ret = wasm.__wbg_get_head_eye(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set eye(arg0) {
        wasm.__wbg_set_head_eye(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get eyelid() {
        const ret = wasm.__wbg_get_head_eyelid(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set eyelid(arg0) {
        wasm.__wbg_set_head_eyelid(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get dimple() {
        const ret = wasm.__wbg_get_head_dimple(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set dimple(arg0) {
        wasm.__wbg_set_head_dimple(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get bald() {
        const ret = wasm.__wbg_get_head_bald(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set bald(arg0) {
        wasm.__wbg_set_head_bald(this.__wbg_ptr, arg0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_log_71a54dcb70d69b4f = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_alert_7ed458e6bf57ddd0 = function(arg0, arg1) {
        alert(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_newnoargs_76313bd6ff35d0f2 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_1084a111329e68ce = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_3093d5d1f7bcb682 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_3bcfc4d31bc012f8 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_86b222e13bdf32ed = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e5a3fe56f8be9485 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_call_89af060b4e1523f2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_b7b08af79b0b0974 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_8a2cb9ca96b27ec9 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_ea1883e1e5e86686 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_d1e79e2388520f18 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_newwithlength_ec548f448387c968 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_7c2e3576afe181d1 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined' && Object.getPrototypeOf(module) === Object.prototype)
    ({module} = module)
    else
    console.warn('using deprecated parameters for `initSync()`; pass a single object instead')

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
    ({module_or_path} = module_or_path)
    else
    console.warn('using deprecated parameters for the initialization function; pass a single object instead')

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('model_maker_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
