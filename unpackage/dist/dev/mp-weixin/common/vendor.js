(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 103:
/*!******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/answer.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getQuestionList = getQuestionList;exports.getQuestion = getQuestion;exports.questionSubmit = questionSubmit;exports.getCList = getCList;exports.getTraining = getTraining;exports.submitTraining = submitTraining;exports.getResult = getResult;exports.infoDetail = infoDetail;var _request = _interopRequireDefault(__webpack_require__(/*! ../utils/request.js */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
// 精彩活动
function getQuestionList(params) {
  return (0, _request.default)({
    url: '/questionnaire/list',
    method: 'get',
    params: params });

}

function getQuestion(id) {
  return (0, _request.default)({
    url: '/questionnaire/get/' + id,
    method: 'get' });

}

function questionSubmit(params, id) {
  return (0, _request.default)({
    url: '/questionnaire/submit/' + id,
    method: 'post',
    params: params });

}

function getCList() {
  return (0, _request.default)({
    url: '/questionnaire/c_list',
    method: 'get' });

}

function getTraining(params) {
  return (0, _request.default)({
    url: '/questionnaire/get_training',
    method: 'post',
    params: params });

}

function submitTraining(params) {
  return (0, _request.default)({
    url: '/questionnaire/submit_training',
    method: 'post',
    params: params });

}

function getResult(id) {
  return (0, _request.default)({
    url: '/questionnaire/result/' + id,
    method: 'get' });

}

function infoDetail(id) {
  return (0, _request.default)({
    url: '/questionnaire/info_detail/' + id,
    method: 'get' });

}

/***/ }),

/***/ 104:
/*!***********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/redPack.png ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNjkwOENBNUJENzAxMUU4OENGREZBRDdDMDZGQjlERSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNjkwOENBNkJENzAxMUU4OENGREZBRDdDMDZGQjlERSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI2OTA4Q0EzQkQ3MDExRTg4Q0ZERkFEN0MwNkZCOURFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI2OTA4Q0E0QkQ3MDExRTg4Q0ZERkFEN0MwNkZCOURFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+oQb74QAADKxJREFUeNrsXWuMX0UVP3P7p+32AdqKMa0B01bZQgRNKEUl0KKJEDVRiYlKfDUxGvni44OvoF+ULxLE+IrE2C8mKj5AkcQoSEGjCU2RmNiHPNqaVYhArXTb3XZ373jO3rn27uzMnDP3zr3/u9ud5Jf//h9778z53fOcuXPVh+7S0JOmhnz+Xghi0HMCVIfCV30gaNAjElRHpGjPMXXgvHoxERJLgop839QUaQEBqitiBj0hQjn+VjWOpwXfhX7L/aZ1rRl0SEQMCaqmhqgIIauK+dIC09aJ1gw6IMMnUBVBxgrE6xGXIl5jsAmxDvHSyjimEf9BHEM8jfi7wX7E44hJiwCbFBc5Eq3RfSOkKRGuzy5GvAvxVsRViBHheC40uARxY+W7CcSjiN8gfo4YE5AhJSaZtgw6IIMTfPW7VYj3ID5sSEgZYRGh1xl8FfEw4keIXyBORWiNDmhGY23JEpOhHEL2Iau8rkfcijiE+C5ie8uJIp1zJ+Iuc85bTR8yq28h2ONNEqZnDYhQEVrhIoKwEvFZxN8QnzdC6bqtN+emPnzO9EkxxEgCD9UVISET5RN85vjuzYh9iC8jLuhB1YL68CXTp7d4+uwbj9SPJieEM1HAmCjCGsQ3Eb8ykVLfGvXpl6aPayr9VgJtaWzCsoZkcCbKHsgo4g+IXTD8YiI31l2mr6PMmJrmTrUI4cgI2dvyCrsBsceEowulXWL6fAOjKZlDO2qRkiUig3PiH0T8BLEWFl5ba/r+AYGTb0zKoIYqg0f4Pm0h1b+z5yZKIqfvIJYjfmByDUIuTCR1KpOlIsjILLWm1/civr7AyaiO+Q4zpswyx1lALpx/EROimBwkFBISdiC+nSD57FNbZsa0w+FTQuZMHA5nkX6Ds51lp7YgfmhUfLG15WZsW5ichMtTVFOn7jqw6wqhmtFuxPmweNv5ZowjHgshkZ1YQyTzFKG61G2IK2DxtyvMWDNhfiLJV6ITQ65IeI2Jqs6VtsuMWVKUFIdzdQqELjWlSaSvNY2o6J+vw9x4x1aAdWvaWeFwbBzg4YOY8R1oPIFB3bsdipL+aRMGl/LIA11QvrA4izBVoSyc8HHE1qYCuwZz45u2Aaxf006sTMekY7/7yuJcCdqoGXtWo+41T/axmbrvRC9BfCrF6K7e3N1yqO2bkp3r00YGnLlq5NRDDGcWPmE61Lit6HCl2Mrzkh3qAiODzKEpALI5lTmEKIGW+LAqpSOfnAKYnmmfDDoHnSuxg18F/Cxj0BJlNRJA+yq4CYrVH8nafyfaN1stnGOdkUXm8SeihDFrUCIp39+cemTjkwBnptsjg45N52ih3QzhmUa2pJIFiJDkHxchrmxjZM+f0KBbUBQ6Jh27pUayuFiYjyguMYxZQVKq49uhpUruFNr45xKTQseiY06156OUkUnGZO7eulYWMFMSs7WzTTs/cSYdKSUZdMyW206Qr1pRLh/ii7I4Uigz39726EiAzxzXjXwK/S8dowMyqF1lZCNdQhSMsiSmqvz7tVCsYWq9kYkhgb4wrqNCYvot/Q/979QMdNVIJpeDbFGECtWypKsOS/t4edeVPIqMxif1bEI3spySSAWDZdgZ0+tcFyScni60IXGeEdPoYt0HZ6d6fZqirb9nCZEsinZhdFijJUEXwu7N/ZGu+hZXz3KtG1ZZTTLKkHepudtFNYuM8ybnAfyr1e0TbFiSu7dt8PheVtZ1NKQ8+LoluQfLKNLF2irk1EPk2ASt7nqUFL5+f4+CU+g/1uPZP3KtrvWbDtpqCJff5/mO8n0mqGH5NGWk61Eux8vnjVuKcbxwEuDgP+f/Zv8YzJJB7Q2bh+b0R4QJobN0wi1V8ZmtobRLXwmwysxjHHpGzdOOPz1ZfPbqCzHU2ThUsyWdX59DFDdBFSJlYhijrGrJE88B/OuYWzu2bRpqSDxRJ8IKFRcli7tO9UFL9j59tktV7dgw3JDjVA3fDADhlYuchhwb1mhJS67fOldLyJ/0RDvAyCb23sR5eUjIh7hM2LNDTYU3FlEUtUcOKfjzU73RDjCyib3DKlhcDPmV8u+xYY+6jKLGjhdRF7XrL+tFOWUscEEHZR1a48HdqHNoWKN9/AjAAwfc82Lf21N8/v7tepia8gTUvHGnSfh6cCkh97b9df9xINAOnwMiQmipwMquR/u6VxEK00TO/Nd/Lbr3sR0a1o4MnYxJj/UQLZobCH2H6z3N4f2FTHlfTFZproZsskgmU5HmKlg6iWl/XLJOaWVS1RDX1neaef9bxGe6LqX02GTlRiYxMpzzmU+Q9u43voP8G4otj5Za0R41MvHJSzPEJNme6X7E1cNMEEc39mYq9/6mBwiZGp+q2Uw/iDi+pByzMnjQoxESs+UlJKRuLlNGYd7dqUb1Yoc15BNp1/febWThk5OWyDpzXP0hbbBPUH5HO7OdSBIzHu1uj4HHjiQ71wkjA598Qloz51VisnQAZWRBHdqdYmR7D9P9fyr11TtPM+gcdK5EbbeRQS6UmY4NeyW2zz7JjxFvQ2xOQcrewwtmN46nzNhDpt13oYvCXh2hIdVNWChzvx16vHqthabNmKeNDCSyCl3ws4Rw0YCPAO3oBJUN7j2HCLnXjFkim5Bf+b+sMyaiitGSEt9CHDkHyDhsxhojG87pzzFZXN7BmazyiqD55C8gTi5iMmhsX4Sz+/3mNU0W60O4sNdWydzxnv4+ajo8vQjJmDZjO+oYt0smWhj2zstDOGeeC7Sj+jtajv8VCO+6ttBabsa0zyGTnJER59x11amDMEH0Oa6yMzPWVfJ7KHZhyxcJGXeYMeWeMXNOHRgN0QMm7FWM31DWa1bpXDlDdp+xueRXzlugZNCE020OMlymivMnEOPUtTDkzT3a4sNDUGzjvRAd/UnT94eYMcaYMO/0Rijs5fxIHonHoNgPZCGFxNTXW0zfY8cr8R9scVEa9uYeOzrj8SUl/mEGeF/PM3pt+niLiabymmOOqWVpu5Zl/1B5SMkr3+WVwKD8fKby6mpUYP8G4hHEJxEbe0YG3eRwp8nAq8K34XLoWqAdQT8SmlO3dzxzkVIlQDGf2dVCGvBHoXiKzvug2Ph+mG0cihL6PYgzFhEhDbE/C/kPYMonEIqylCD0VVakBRYpnFmggf8UiscQvRPxDki071ZEO27ME9WlTgTMkUtDfGFvtDOvEiJ90KJtrrRFRNlmatjrF6HYC/dniGuheO7UZdDejti50VAKY2nZziTjI0JwaZIWmq15snD5EO7ZSrnjO4C4jbt8Wkf+5XeIBxAvR7wJsQ2Kp7OtaEgCCf0AYi8Uj6F4nokWXYTkUD/aAomDH3j8R0hbuARRqhWhXKe83eEeY0qon5sNaPujVyBeBsW9fKsrZJ02ecOEEfizJkqiSaQnLRuvIwnhTBdXchc9cdTnQ3w7+lejq1BTAlI5Qqq7HdD5DhpId4kOlX9SEJILw16ICX8HwqtZCTUlJCgpIWUoncH8fUIA+EXLOiLJDVUZQoS4CJBoBpt7hebUJY8mjSkaVgWzzHq1taNqCjOQbwDGrfLQwrLPTORrbB3Ld4HCgNGG0MNI7KQw1nSUZGQO5BUicpDvhSudgpbU4DizNBNZLtEcGVKTBUy6X63ySoKBZZ6/c/O+ejzuEXUqgf/QjoQuJPgZYXExxqEDlxiGTJcdAmcMKVwlOXP4jKymhnB+LsaHSEjg5kFAaqrqOHX71Ra0ixQtcK62I7dNVnXniCaEgMB/aE8JZCagTS7NAAEZYg3x1bUkD+O1SVGOMr9tmjLLF2WWyVIeYqQmq66WuIQvmRkUJYBQ43YEaUkFLFOTOwRmm6jqq4sI15N7UmgIF2VpZjZQByajRMt8OE0ZCM1VKB8BT6gaIiaLCHVVSz5EC2b6pERwZIhzkdgbdkKk2CGxLypykRAKdbnd2KTlGQhEQjnzKlmRCHWTwSaZeogUX87iKs1rK6rSFhEZU9pvQkioEpsLv6tLhk5BiJSUkM+pkmDXqVwlkhxk2xs1LWJK11BxpkkS0upUGiIlRXk6oTymzCYmFOJKNnEBpmzis/F5JGE6EDA0IqOpD3FN8yomslACaCEh0loWR0gdEgCEtxe04UMk4bCLDF+EFiIHmOpuKkJASAwISIFUZNQlxNaM2MKk63cxZNTxIbGkxGqDbkpEU0KkJiymJGOXZcSPmoskg/Mv0t8n04qUhHAmDDxmzPfqq5lJzBUIzRbUIEOqBY0X/6V6SJ0OzE2oiM66noLp0rg6JktaeR0KEakJaUKMr7TvfYJApADqaEznRLRFCGfGOKGG/k81FELU7cmCc7WyNvl/AgwAQavYj7XShGwAAAAASUVORK5CYII="

/***/ }),

/***/ 105:
/*!**********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/report.png ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOUQwNUNBMEJENzAxMUU4QUZFMEVFODAxM0Y3MkExNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyOUQwNUNBMUJENzAxMUU4QUZFMEVFODAxM0Y3MkExNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI5RDA1QzlFQkQ3MDExRThBRkUwRUU4MDEzRjcyQTE0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI5RDA1QzlGQkQ3MDExRThBRkUwRUU4MDEzRjcyQTE0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Dt33xgAAC+xJREFUeNrsXWuMXUUd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"

/***/ }),

/***/ 106:
/*!**********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/answer.png ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNzY2QzRCQUJENzAxMUU4QjQ2MDhEMUFDODRGNEI5RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNzY2QzRCQkJENzAxMUU4QjQ2MDhEMUFDODRGNEI5RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM3NjZDNEI4QkQ3MDExRThCNDYwOEQxQUM4NEY0QjlGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM3NjZDNEI5QkQ3MDExRThCNDYwOEQxQUM4NEY0QjlGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++yCpdgAADFhJREFUeNrsXVusHlUV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"

/***/ }),

/***/ 107:
/*!**********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/saishi.png ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 108:
/*!***********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/zhandui.png ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 127:
/*!**************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/my.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getAnswer = getAnswer;exports.getPractice = getPractice;exports.center = center;exports.info = info;exports.infoEdit = infoEdit;exports.myOnlineList = myOnlineList;exports.myOnlineDetail = myOnlineDetail;exports.questionRedPack = questionRedPack;exports.onlineRedPack = onlineRedPack;exports.resultDetail = resultDetail;var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function getAnswer(params) {
  return (0, _request.default)({
    url: '/questionnaire/my?type=test',
    method: 'get',
    params: params });

}

function getPractice(params) {
  return (0, _request.default)({
    url: '/questionnaire/my?type=training',
    method: 'get',
    params: params });

}

function center() {
  return (0, _request.default)({
    url: '/myInfo/center',
    method: 'get' });

}

function info() {
  return (0, _request.default)({
    url: '/myInfo/info',
    method: 'get' });

}

function infoEdit(params) {
  return (0, _request.default)({
    url: '/myInfo/info',
    method: 'patch',
    params: params });

}

function myOnlineList(params) {
  return (0, _request.default)({
    url: '/onlinealarm/myOnlineList',
    method: 'get',
    params: params });

}

function myOnlineDetail(id) {
  return (0, _request.default)({
    url: '/onlinealarm/myOnlineDetail/' + id,
    method: 'get' });

}

function questionRedPack(params) {
  return (0, _request.default)({
    url: '/myInfo/questionRedPack',
    method: 'get',
    params: params });

}

function onlineRedPack(params) {
  return (0, _request.default)({
    url: '/myInfo/onlineRedPack',
    method: 'get',
    params: params });

}

function resultDetail(params) {
  return (0, _request.default)({
    url: '/questionnaire/result_detail',
    method: 'get',
    params: params });

}

/***/ }),

/***/ 14:
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 164:
/*!********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/myVersus.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getVersusUserItemActivity = getVersusUserItemActivity;exports.getVersusUserJoinScore = getVersusUserJoinScore;exports.getVersusUserItem = getVersusUserItem;exports.getVersusUserApplyList = getVersusUserApplyList;exports.getVersusUserApplyExamine = getVersusUserApplyExamine;exports.getVersusUserApplyOut = getVersusUserApplyOut;exports.getVersusUserCaptainDelUser = getVersusUserCaptainDelUser;exports.getVersusUserCaptainTransfer = getVersusUserCaptainTransfer;exports.getVersusJoin = getVersusJoin;exports.getVersusCollection = getVersusCollection;var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
// 个人中心 - 我的战队参加过的赛事√
function getVersusUserItemActivity(params) {
  return (0, _request.default)({
    url: '/versus/user/item_activity',
    method: 'get',
    params: params });

}
// 个人中心 - 参与赛事详情中分数统计 - 团队总分，个人得分√
function getVersusUserJoinScore(id) {
  return (0, _request.default)({
    url: '/versus/user/join/score/' + id,
    method: 'get' });

}
// 个人中心 - 我的战队 - 成员列表
function getVersusUserItem(params) {
  return (0, _request.default)({
    url: '/versus/user/item',
    method: 'get',
    params: params });

}
// 个人中心 - 我的战队 - 队长 - 成员申请退队信息列表
function getVersusUserApplyList(params) {
  return (0, _request.default)({
    url: '/versus/user/apply/list',
    method: 'get',
    params: params });

}
// 个人中心 - 我的战队 - 队长 - 同意拒绝成员退出
function getVersusUserApplyExamine(params) {
  return (0, _request.default)({
    url: '/versus/user/apply/examine',
    method: 'patch',
    params: params });

}

// 个人中心 - 我的战队 - 队员 - 申请退出战队
function getVersusUserApplyOut(params) {
  return (0, _request.default)({
    url: '/versus/user/apply/out',
    method: 'post',
    params: params });

}
// 个人中心 - 我的战队 - 队长 - 删除队员
function getVersusUserCaptainDelUser(params) {
  return (0, _request.default)({
    url: '/versus/user/captain/del/user',
    method: 'delete',
    params: params });

}
// 个人中心 - 我的战队 - 队长 - 转移队长
function getVersusUserCaptainTransfer(params) {
  return (0, _request.default)({
    url: '/versus/user/captain/transfer',
    method: 'patch',
    params: params });

}
// 个人中心 - 我参与的赛事列表
function getVersusJoin(params) {
  return (0, _request.default)({
    url: '/versus/user/join',
    method: 'get',
    params: params });

}
// 个人中心 - 我收藏的赛事列表
function getVersusCollection(params) {
  return (0, _request.default)({
    url: '/versus/user/collection',
    method: 'get',
    params: params });

}

/***/ }),

/***/ 174:
/*!**********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/teamAnswer.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.postVersusActivityJoin = postVersusActivityJoin;exports.getVersusActivityQuestion = getVersusActivityQuestion;exports.postVersusActivityQuestion = postVersusActivityQuestion;exports.postVersusItemJoin = postVersusItemJoin;exports.VersusActivityItem = VersusActivityItem;exports.getVersusActivityItem = getVersusActivityItem;exports.VersusActivityItemuserRanking = VersusActivityItemuserRanking;exports.VersusActivityUserRanking = VersusActivityUserRanking;exports.VersusActivityItemRanking = VersusActivityItemRanking;exports.getVersusActivityList = getVersusActivityList;exports.postVersusActivityList = postVersusActivityList;exports.getVersusActivity = getVersusActivity;exports.getVersusActivityStatistics = getVersusActivityStatistics;exports.getQuestion = getQuestion;exports.questionSubmit = questionSubmit;exports.getCList = getCList;exports.getTraining = getTraining;exports.submitTraining = submitTraining;exports.getResult = getResult;exports.infoDetail = infoDetail;var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
// 队长加入赛事
function postVersusActivityJoin(id, data) {
  return (0, _request.default)({
    url: '/versus/activity/join/' + id,
    method: 'post',
    data: data });

}
// 我要答题 - 获取赛事题目列表
function getVersusActivityQuestion(id, params) {
  return (0, _request.default)({
    url: '/versus/activity/question/' + id,
    method: 'get',
    params: params });

}
// 我要答题 - 提交答题
function postVersusActivityQuestion(id, data) {
  return (0, _request.default)({
    url: '/versus/activity/question/' + id,
    method: 'post',
    data: data });

}
// 加入战队（不包括扫码）
function postVersusItemJoin(id) {
  return (0, _request.default)({
    url: '/versus/item/join/' + id,
    method: 'post' });

}

// 赛事详情 - 参与该赛事战队列表
function VersusActivityItem(id, params) {
  return (0, _request.default)({
    url: '/versus/activity/item/' + id,
    method: 'get',
    params: params });

}

// 赛事详情-参加的战队
function getVersusActivityItem(id, params) {
  return (0, _request.default)({
    url: '/versus/activity/item/' + id,
    method: 'get',
    params: params });

}
// 赛事排名 - 某赛事队内队员排名√
function VersusActivityItemuserRanking(id, params) {
  return (0, _request.default)({
    url: '/versus/activity/item_user/ranking/' + id,
    method: 'get',
    params: params });

}
// 赛事排名 - 某赛事个人排名列表√
function VersusActivityUserRanking(id, params) {
  return (0, _request.default)({
    url: '/versus/activity/user/ranking/' + id,
    method: 'get',
    params: params });

}
// 赛事排名 - 某赛事的团队得分排名列表
function VersusActivityItemRanking(id, params) {
  return (0, _request.default)({
    url: '/versus/activity/item/ranking/' + id,
    method: 'get',
    params: params });

}
// 赛事列表
function getVersusActivityList(params) {
  return (0, _request.default)({
    url: '/versus/activity',
    method: 'get',
    params: params });

}
// 赛事列表——收藏
function postVersusActivityList(id) {
  return (0, _request.default)({
    url: '/versus/collection/' + id,
    method: 'post' });

}

// 赛事详情
function getVersusActivity(id) {
  return (0, _request.default)({
    url: '/versus/activity/' + id,
    method: 'get' });

}
// 赛事详情-统计
function getVersusActivityStatistics(id) {
  return (0, _request.default)({
    url: '/versus/activity/statistics/' + id,
    method: 'get' });

}

function getQuestion(id) {
  return (0, _request.default)({
    url: '/questionnaire/get/' + id,
    method: 'get' });

}

function questionSubmit(params, id) {
  return (0, _request.default)({
    url: '/questionnaire/submit/' + id,
    method: 'post',
    params: params });

}

function getCList() {
  return (0, _request.default)({
    url: '/questionnaire/c_list',
    method: 'get' });

}

function getTraining(params) {
  return (0, _request.default)({
    url: '/questionnaire/get_training',
    method: 'post',
    params: params });

}

function submitTraining(params) {
  return (0, _request.default)({
    url: '/questionnaire/submit_training',
    method: 'post',
    params: params });

}

function getResult(id) {
  return (0, _request.default)({
    url: '/questionnaire/result/' + id,
    method: 'get' });

}

function infoDetail(id) {
  return (0, _request.default)({
    url: '/questionnaire/info_detail/' + id,
    method: 'get' });

}

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 21:
/*!******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/bg.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/bg.f19fa910.png";

/***/ }),

/***/ 22:
/*!*******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/1-2.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 23:
/*!*******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/1-4.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/1-4.00800d9b.png";

/***/ }),

/***/ 24:
/*!*******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/1-3.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 25:
/*!*******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/1-5.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANMAAADZCAYAAAC6nAW/AAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nOy9d7wsx3Xn963qNHluvi8HPORIBCaBASSYRGkZJEpaiZRMWeZHq2BLS/vzsWxZXmqtz8qy16vVrtKHJkWJMkVKBKUlqSUEgkRgAAgQ6QF4D8DL8eacJnV3+Y+e0NPTPdNzZ+59D9Crz72fmao5XXXO6fM7VaequloopQhNz/7bAeBDIO4BDiBEgEA0fUTmW8pbMjTqjqojgq6lvANdGG29zQ51RtFF6iGk7dg66pKuhWdfeUfaDnxvWg/d0Harh0uSzgCPMPyBv4wiEKFgevbffgr4TSBfJat+xFVKWFmXhtAroLqi7ZMhNX3dKkPaCufUgee28m7WubwqAQWwDHyK4Q/8x+APzWB65ncHgEeA2+Ibkv+3Dvl+ASqMtqW8S7rYhtSGdssNKQZtC999AlRXtH3SQ2gdLT9cqvQo8CGGP7BUK2iA6elPDSDEc8D+OnlfDCmQ7+rm9qmX6hZQbesI8tZvQ2pXR5B2qwDVhu/Lcvh7ydJh4J4aoGSjXD2CUvvx91RKQcswUDV+Cy3vkPeXq6YvIW1G1eGjbVseg66J1sdLZB0BXmLrIYxORehhE7ps/hJosxudd+B7M3rwt9m2raAccfVwydJtwF/WMh6Ynv43H/d+2CpDolmhTUYboG1pswdAhToGFU4bKkcveggBypYYUlh5B7k76jLYZhd0kc6pQ5096eGSguqDzH/tHmj0TJ9q/LZFhuS7pCfPGkUXFyhxe7Ou9NAlUPphSGHOSYXVEeS7j4CK26v3Uw9NzqmNHNubPgUg1A9/5x7g4e0NRAP5K3FUBJ0/s81xVFv+rsRRIemgBO4BuvO4V+Ko8HxfPHOUx92ELpu/BNoMthWjV++nHpp6mC569dh62PZ0j0Sp19WzWx2I1r+E3UQVQRvWZg+A+ucWR/XNOQXbjEMXJl+b+/zqjqMOSGBg0wbSbSDaJGOXimppMwbdlTgqoo4g3z0AKtQ5RdCGlm+SLtI5tZFji5PcFFCCdD0HooF8t0BpMaQwOfoJqBCgbJshdZB7y51TkJcQvrd8+Ou/z3FtauuTbGZgk4YUSduuvEM+0uOGtdmlwUTxHIwn/OXbMvwNaytoSP6L+uicQttqp/MQvjdDh0KpkDZfhXGU3vgaYKA2w1ITqGnGRQHC+81fHsxH0dXLqU6+1NquzcwEhQ/ShrUZVmcbOn95pLxRdfRTD2Fyx9VZuNxKgXIj6GrJ35afFyEQwqMViEhdKj2DK9M4xTkkFTSpeRQd9eD7kCaOHMDemEBKga7pSClQVUApVeU7TA9V1uu8ipremuVWrqcPV0iUW0EIgRQSKQOzfloKlyROacbLyhCaDknvu4G0owPfb0FD8tMSbgj9ABT+ojZ8twNfXD2EykugvI3cXQJKuQo3fRDb1XAc1XDsLTbRxkjcEs76GSzTwDT0SECp5NVo+ZtZOv5VZGWaTDqBoesdnFOzHCp7J3pqH7NHvoBw1shlkyQHrsYRSRzHxVUdZHDL2GsnMU0dQ68CsdapoXC1POgDyMQe9OQOZk//E8KeJZNOYhpGE1hU4mpk4gBzJ/4eqTbIpBNYpoEInbYPT3pd4H4DqkmBm/C4mwEUvqIwb98iRwegdAUov5j96q070DXJB0optPF70egtPf/A77FjfIDBfLoKEOq9BXgG68gUEjh/7ixpq4Kha2hS+nqIVl0KKX1Zl8rKMazUPlTiKiZPfQchBIkdB9CTO/1DpshUKixx8qXHGRrIMrLrBrTEEEqmEVoaaWTQNatOuzR3hqnpRXS1gm7m0BJDVCpLCFXx+Fae2qdnFpGqgLZjCNMwwpfAIlKD563wuD0bUiDfbljU0maXvVkUz010vra2bfjbplcP0DquiwRWFy7wzHe/ghCg61rdu6rqdcK/JbNam1KKG1//Lxgc3cepc7MYhkY2ZaElRlHGkNfT1YdfoJvDXl2JnejZJE4yQ9k0QjqQaolbRhXOoRsaWmIXrpbCKdsADIxfx8L8NBVdZ/7MgxRLMDW3zOpqAcd1gzXW63TsEpahME2DEXMUPXstAHaliKwC6fvf+mumLr4CqkI+m2bXjiESAzdi5K9h7swDVDYWyGWTWGlPd0vL60hVYGQ4h+u6SBnfNTU7gK3wuJsxJGgAJRQ4XQJlM4Dyy/sqiaPcquGViutcPHOEoYE0+WwSKQUj+15PubTO7IUX0DWJpnlGkh25CiETTJ87jGMXAVhZK7BRKGM7LmbqarT89ZG93W13/1TEL82pUlxm8vwLDOTSZEauR0vsJFX9LZUZ4uY3fIjC2gLHnvgsQ+NXcfD6WylXbFy3OkFRT578K0sTzJx/jlwmRSppUJx7lqXJZ7kwMcXU1Ax33fNxxnddwzM//A75XIq9u0fYOT7E8FAOWdXhzOwSGytzwAgjg1U+bRupHFxXtR0NhyV9WzxubJCGe9xND/siARUmLwS+9Djs67FX3+ywDxAI0kmTXWMDjI/kkJpg+Nb3sbE8gbN6imw6QSplIoUgte9ukkPXUlk7h1EFmJSibsTF+SOsTZ9lZa1AqVTBVaCbSW6868eZmTzN8089TCppkrRMNE0EeGtwpJwSldUVDENHn3uegv0yS8vrrK4XcVyNO9/yYRYXZjh/cY6xA29kZM/rKG4sotxWe0ymB7lw6imWp48wkE+Rz6axLIXrlMkmNRgbwDK8fsIydXLZJDvHhtg5Nkgi2Ri6La+ss7KwytBgluBDspFPoLdJel8MZFOG1IZ2y+OoCNrXTBwFB296C3ljnVSygGYNIPUEG6vzODKNlR0lqa9hGBp6epzyxiIry8v1yxuxD6jSHIXFMyzNr1IoVXBdRSq/E4ALp49w4sXvMjaSJ5dJouu+4WMAVIauM5BPoWsSVZyktLrByuwyq+tFdhx8MwCHn/wn1guleg/75Lc/y8z0BAnLxDS9yRCF4j0/83uUyzarqxuMDmXRdYkx8DoyeR1rxMZ2XNKDHo9ve89HSVgm+VwKK2FSnH8KK60wgIrtUi7b1fa6B08wBSYgtsHjvlbiqKYmtrBXj+pZQ3t1r1A3kxy65V1YyTTThz9PJjkAwOzkGQ7e/tMkkmnmjv4NqYTOgJVn/vzzrKwVUKo5PhECLMtgeDBDOmlhOw5KQWLM24G2vjTJ+EieA3tHGBxIo2uBwWCVNyEEmiaxTINkwkQ3NAZEGss0sEWS0WvfwdrSBKvzZ0glzXo9VmacMS1DLpsklbTqs3U1eTcKJUrlCq7jIhJ7MPQMRjMHXH/LW5ryp158gD05mwSgXBelVKP36zGFTEBsg8d9LcRRnWh71UNTW0G529QJVEob/OCbf8U7f+KT5A/9GMWVKQAunn6RteVZ3vi+XyW9/32sTj7HADB17iWUUr5pYK89oQS65g0ZU0nTMzwFDOwC4Ka73ot7+9tJWh5ARIO5erKLs5TnnsI0dExT89ajhEBLSExTQ4zci9Qtjj/3jyQSBkMDaUzTA9Mb3/HzRCdRH4oppShO3M/8SpnJqSVW1jZ464/+OqaV5E/+/b8mmTAYGsySTSex9DI7HCeg88ZHSCZ2ap2A8Pik6cuVOCqa763q1Xsa9sHy3Hme/94XufPeXyIzuIf1lTkW56eQ7hpnXrifA7f8KKm8B4qLZ45gGno9MBeBHrCxHiNxXYXI7AFgaGwf5dIGTqWIEiKII6zUIMVSmamZJUaHc5hmsl63QCDztyOTO1mafpmL505g6hrDg1lE8TznX7iPieklisUyiYSJaXqxjlJQrlSYm53GMg0MQ0NKgRQ2piiSsioM77gZ00oCcO/7/iXf/sfPIPMaSVMnn0uja/4HzJt5buS7B5R+ST3ulTiqA22XgKpVCyQsncL8K5x58SEO3PxOpi6exFUuuUyCwtRTLI5dzeD4NawuzbIwO8m+3cMhK/6qqUlQKHMIqVlMnjnMzgO3MXnhJN+87w/JZVNYpo7UvDr2XvNmbn/LT3Py2PPMTcyTsAwyaas+hHPT1yNzNwEwMH49B256FxPHHmZw9CoS+T0oq8wObYBiqQIIj7eqHlxXMTC8F7s4h6UtIwRomiCfS5FIpMkceGddggOHbuZDP/tJTj7/NXaM5hjIpzGrkxN1afsEqOh1pu30uH2No/zkNaAEep4w+TYz7Lvs4qiG/IahMZhPYereWs6eAzdzND9KKukNpTZmnmdw/BoKG2s4rkvCCq72q/C2kvsBOHfiGebn57n5zncyPL4fzVlkaCCDaegopbj+de+iXNrg6LMPM5Qz6ypUSkH2JmT+dhy7iKYnmJk8w813vofBoXGkLJIYvYsEMEj7NHXmGRbPP0qpZHvDSEPDGHkTUrMori+SSA9y3xf+iI/9d/8rpmkwd/rB1lsRlZoAFecCgqt3QWP0K7QNXS34VapNHQEuN0tXb6tGEsz7+Q30BJFydEOnmst70llIeTu6pt/ayQ1SCCxTZ3j3rVRKGyDgR973y5TLDpomGN59CwBjuw5y010/Gtpksx69QF3mrsepFLlw8mlOHXkYgLvv/RkGskl27xjkqn2j3PKmD5LMDPHy0/8VU3MZyKVJJSxvtk8YiPztVIrLHHni7wF4+gcP8ugDXyQ3tJv1DW+t69H/8gd8+dO/yZc//ZvMXDzG2so8n/9Pv8oX/uS/5xtf+j0ANoolJqYWWV5Zx7ZdSF2PTO5j+vR3WVmeA+Dc6SM8fP/nGd15NeNXv5fZ+RUcxw2RL6iAEBvrkGTHm16/iTEMaZNAcStQXomiiwBpFAD6AagwBTbxEENnceja6SsMOG3roCWlBg9iZXdw7pXH+MG3v8Tw+H5ye95EoWKRGLqWhaljzEye5s63fQSHtLdQSbX3aNJX9T6lr0FoFpMnn0CTklyiwrmXH2V87/Xsvu5tKNclM3ot6fE7WJk7zdlXHiefSzEylCadspBCoJwy5ZVTHPne/8vqygrgDUlfevZBHv36n1AqrAOwtOKta1mmjlaNcQrFCo7jkLC8OTvHcVle3WB9o4SydiNyt1Jen+XFpx+sy5JJWVw8/TTnTjzJ2socM7NLlKs7L1TofabVVqJsJ5D0ZqI2Q5MtiKOUrZh5dIqpBye48bdvA8zwtnsa9m0ijurXsC/WrGDghvVj1hMPEENXvQOAV559gLm5eaZueTP5sUOo8igAx559gIsTM/zkL/0fHLrzQ1Rsp35tE18ClDCQQ68H4OjT38QydcZH8hSmHmdxcDdX3/ajTJ8ZJbn7LsqFJZ566HMIIRgZzHjDP1PWJxDWzz+IVBVyGW/LTyaVYHgwQy5lk8lUJw4+9Ov1KfVEyhvw/dwv/351d7kXd9U+k/m9JHe8Hdcp8cIP/o7VtSJaNf7LZhLks0mmTz6EW504d31blIQQ1eFtO+fbxh58KTAB0YOBdBNHIZh7YpaJr52jNF9i1/v3YmQDKwSv5TiqG/m60kMjje27jURuFxMnfkC5sMaOkRxnD38Vzcpz13t+lfmJY5w/eQQEHHv2m+w+dAfl0gZA6zBIgcrfgtQsTr/wT6yuLrNjNM9QPo2uS2aPP8Dg+NWMH7gLgO/+4x+zvLTE6HCWseEsmVQCTXi9ixCKhGUwPpoDyzt927IM0imL4cEM2bQHsMXZ85RLBZJJk7E9N6OU4uLZlzAMjVwuz2hqAFe5OLbDyvxpnPIK544+wOTEeS92qk4yeLGUztCAt7hbsRNI4VAqLOHYRRqTkCG67BJQ3a8z9ehx106tcuYLpyhc9G6cOWCy8327OrQVFCrCkIJACZ2p6xIoseho/LZts6O06NYPqL3X3U2lvMHzj91HMmGyezxPOgVjt30IgGe/dx+aJtg5NkBh+imeOv4o17/5Y4A3W9ZYv1Uoaxdy4DbKhUVefPJ+DF0yNJAmkzIxB64hf70HonJxAzOR4vXv/mVeeOzLDJhL5LJJDF163l95PYFl6gzm09i61wtpsrGoWwPB4ce/xuzMBAP5NG99/6+QSA3y4Nc+SzJhcuDgQd71kzdh2w6O66Bcxcyxr7E0N0HCMhgazNTXqmrPLlmWxmDe2zZUWX2BU6e+g12c9x4dMXTfXQnpoZomeaKdccRG1/573MpymYlvXGD2uzNNK857fmI/0tLo3ZB8kvdj2BcEFLQq8FL06rGcCzz57c8ztusgdqnA2HCWkcEMqaQJlRXOv/QKS7PnGMyn2DmaJ5kwMDUbw9B8TSjvT8sixryp5uce+SvKZZvRkSw7DtxGcvcbkAlvyHjiuW/wyDfv49Y3fYg3vO0D3P3+X2Vt/jRq7RgV+yKGXh1SVae5DSGhvt5TA1pDjOHxfaRyQ+QzKaxEGiuR5uA1t5JMGIyNjQCgaRIpvOGjdDcYzKVIpyxymSSabMgi8B4ItCwNKTQqts3QQBalvDrSKROhmTQn1fiP9cxdfaPr1nrchR/OcfqvT+FWmrerDL5uiOE3jAYE8Dfdpu0tiaPC5KVR3o9h31bGUb60sTLLgrvG6FCG8ZEc2bSFYegsnfsW0+cnGcynGB/JMbb/VszcfnK2gzmwl0ppA00T1fjGhbF3IjSLV37wN1w4e5w33Psxdh28Hc1IALBw4RmOH36QixcukEqYHH/uvzJ38UVuef372Hv1HTB8ENcuYq9fxJ5+GNPUq3v/RBD/DfsF3vzuXySYfvxnPtmU16RE12s9j0465Q0RdUNvXTNTVVBJMHSNwdGDDO7ZjcKb+dSSOwAobKyTSgR7+ng2pXufW+dxK6sVznzxdAuQtJTOgY8douYBt34dJqyHqZGHDQcj5OsHoPCT9GvY1wyohGUwNpxhfCRPLpPAMnWEECR0m5GBNPlMgoF8CsNMoQ/eVB+iHH3sH7yeQ/c8e2nhGEurhzl+5AkMQyOdzoKA+XNPc+zwg8xOT2A73jrVjtE8mbRFqVziyGNf4Pjz32LvoTvYc+gOKmXB3MwSQ4MZMmnL6zmUn/+qNqpivfDE1ygU1smkLAxDY2OjzHqhhGkaDA4OcuiW9+A4bj2+06Twel68bUbN1lbrYbwPKQW6tJH5a5uozr7yPdbXVkgnB5CiNtHdYTTjy+v+e7EVHvfiV8/jFPx7oby0+8d2o2f0JtotCchDnwsKytslUNrR4S/qvVfvTg+KC0/8MafOXCSVMBnMpxjKJ72tQlKilCKZMBkdFijlAaay8CJzE68wPbfC5NQMCwuLZNIWqaSJFLA+9UMmLy6QTBjkMkkWTz/IxRe/wuTMCmvrJUxTYzSfYWQoy9CAN5Qslx0Gsinml1c5efh+jjz5dRKpDPm0xDR1kgkTTSrc0hzTR7/CwuRRTEND0yT2ymlmp85y/Pnvs1Esk8sksSydctmmWLIxdI1Zy2B64jQz0xNoUqIJgazudBcCXBcKs09x6sg6lqXXtxw19fiVRVZOfJ6p2WWmZ5dYXSuytl5ECEE6ZXrXCNl8D6KcsgoO87bA426c32D2sVmCKbEjydjbd2weKJc8jiIcpKG0m+/VQ/Xgly+Ql1JgqDVySQHJFOmk1WRIQgh0IdAStfhAUCrbOKUlKoVldGEzOuRNZQ9kk5imjqsUw4NpctlEtT6JWzHJZRLkMgny2RQDuRTZTIJEwkAKSSrpgXYgn2J5tcDSygalsl0FkcDbGSSQlKG0SDYhIZkmYekIdx2Ka4yP5KjYDplMsr6u1NiMKyiWZhlIuxj5PJl0Ak3Wprg9dUh7AcqLjA3nyGZSWPUdHs2AEHj7BHVNks+lyGaSjA7nSCYMhFAh95m67lqHeU03i2hDarKXeB733JfP+nvwetr3kX0ILUgfkb8s46g+D/u6iaPaOBdNSjIpi51jOUCQThj1zat+PTQOSfG2HeUzCTQpGR3KIqvDpWw6gS4lSctkdMjr1XTdMxddk+QyCXRdkrAMTNNA1yTCtyE2mRCYpl5fQypXbDQpSSUtNClBqQa/494UeSaVwDQ18tkkB/d5sXTCMjF0DenbnOq6iortePv2hCCT8njx68WyDEaHs6RTCUzD6w0bqlAI4Q2FR4ZzJBImlYqNlBqppEk6nSRhma3g62Ar+lZ53NUTa6yeWMWfjJzB0F3D5G8aaLq5nTxuC+2VOCq0DikFScvArM7K1Y/fahasST5Neo9YJCwD11VIzZsc8Dy9BxxNGk286bokoxJIIRCSem/h14MQAl0DTepYpo5bbVcKUZ8ckAKPX1Nv8CsglTKxLB0hZNODin55lQKn+jSwpmsNp6FqbUty2aS380JWD3vxaUEIMHRJNu31uKrKs5TVNmWYzqEdoBoPB9aZ7Y+BTD88jZ7WyV6TJXdtjux1OZI7klUe/LSdPW6rUL0AinCH0dOwL36vXvzmBcy3XoVMVqrlmwBfB0A1HwKiWnv1pjqoXiMabQbo6htgqx+a8E1ph9Tn/aSqVXmglLVtoAEdSSmQCF+bAg2BZoS10eBNCKJ5VgqBt0Oi5YFFn8480AnQmuXryhn7ytuvM20GUFXB9n7kKqzBsJvTKlQzsz0Aqqkt1fRxucRRxp1XMfdr95H+hbeQevs4Art3QPnl68vwNw6d/+dL4Zxi3OeeRy1xnbGX2mx0DTAZRqdUtbz1tzqQwupsKQ8yG4dO+XjYRJ1R8rXI6ytXTV8a9XahM23Ym9lc+swjvPxXZ3G0fBsZonTur78bnbUrj0OnAuJ3kDsuXQvPwbbCbSxcjj7owd9mmI1FyCEDpYGGuhGqgxCbAZT/t7ZC9dOQwuRVEbRhbXais9H35QAoVTS+eSSJLZJt5N0uQwqRuwtD6g1Qm3dO4bzFoQuTr819jqEH2S+P2748Bl2/PW5ckLbzuHENpqXN9nT6eMb7omlsKIu/+16F5XW3gxxbbUht+O4HoMKcU5jOW/juAVCbdcab1IOMz2wPgLpUHrcbkPbkWcPaDBpMo2055G3wrIwMAbBsG3zhoXWW151oOaLaapEhBCjbYEjRQFERtG3a8vMdl+4yGP7Kthe2MNClIbUT4rUcRzXV3VqHsDTQJMUbrquTz5cln/naJIVSHEBtEij9MKS4vXo/nVNoWzFsrJ968LcZoXPZlVAdPG4rs/0EVIgQr9I4SpVsVj/wYzi5bBP5+VWX//zF482AipR3Owwp4j5vZRwVZlOvkjiqeQdE7bNG81o7GL8dXVNbNWX51x+i5I2rh+oLk5RATa+QffLrJP7h6wyMjZAaG6E8nGceeHGqyKfve4nf+OjNMXXWLz3guwX9mj6P0o9ft0Gj7tP0+SVYRtBbgbMVQoWURwrVTwOJoPO37QdxbAUG5Y2hB1T9t8qU92CkcBwy5y+y/8w5djsON2RTPLZjlIeXBZ84NUPqqrFo+boClF/MrTGkFjpotalL8i6uGPc5ru100EObCYio8gCzcei2M44KHdMHy7uos6uhivKJGS6vKq5jT6x6N6P2j3fPRpdXef/RE/z08XM8+/T50OvD84G2Loc4Koy2K12Glft47jrkCOF7M3RRbSrVaQJiK4TqJ6B6BErPgSgh8rbX2dofH0ZIgdBASAUaSB10U2KkdHRL5+DaBu6nn2Dib77Xcv2VOCqM7xh2GspbDzYW0qbsl8dtX0cEXZQQ2+lx29HFDkQD+Yhyd/UClWPLKOHVJaQHJKkrlFC4jovre6ztxF+/iLuwRIse2srRgx7i9urteqk4dKHlYTbWRud+vtu2FaQL4TnSOYXQhpZ7H9IvS3vg9FuoDjdzOz1uW+DENaRAPqS8+PkzgDekE0KB5qB0B6WDwoFyGeHY9cdT3LLD2vK5TTqhNnTtgNKPYV8UXRhQmvxEd86plecYdHHv8yb0INuiv69ChQElUB7G7GskjnJOnsB5cQOkWwVQCSVthA5IhdBBWTpKagj/wfKng7zF0FeYbrctjgrTbRsb66ftXeI4qvM6UxyhhO/mRwrVdFGAqX4CqkegbEEcpU4sUv6jix69qMVKNiRc0FykcNEcuz4hoXwTSMk35EJ46+QwOtDGka/b4W/Yfd6SOCouUGKAL5S3zdtYYKPrJoTKgho424bZuELFANR2edzYCvTxEqEzdWaZyqePoBwXJUV9ulhoOqCDK1EVF++guiqaql+1hIFu7oyQt50hBfM96KHn4e8mANXBOXVtU10BKuQ+x7Sx1gmIboSSGir5GdDug/xKH4TqdDM70DYXhJfH9bjdgDRKvsPzuH/6IpQqCBRCqGonLkB4QBIuoEkc3cTRZNW9edfv/cgehG4QqDzAQz8BFeYw2snbB0A12VRn59QfQG3yPnegk+FAiSeUyh8Gbc3Lic+C+YM+CBUobytUD4DawkC0/mW1AiUHpAJTgXQ9HAmBVN6/kIDuHciouQpsF1wPdLs/+LrWOkN5i6GvK3FUQPwebCeCbnPrTAqwJiHzsJevjfHNx8F4CAgc7fXPKo7yyfcj44ibhsARKOWCtL14CQWOg1SOBzAd0IX3+LQEJOz6sQMYA2NE3oMW3mIA5UocFVFHkK4DzxHytr6PMI5QwkGNPgjCqZeJWtSsHQbtgT4JFQNQl10c1cy3/MVDkDIRtgZKoqQ3whMGKKMMloM08KbDlesdUCJh/39zZ6tsUQbTxEM/nVDE9VfiqFBaGfg1oqGAEPnnQF9q5IPty5eBI30SKgZQLuc4SrPQf2MElABXeotMhkQYGpqpeyfyaCBwkZoLEvb8zHVo6XygzQCo2srbA6BCe5jOhtQfQIUBpY3c7cDX/CXQZhjdJu+zLy/jC1X9rq3jDv4Q5YJy8Cah3OpvUjSGfOJ7gB1fqJa2gkL1YCAt8kVcv0VxlBw/hLw9Aa43U6dsBa4CzUCq6iKu5vVYiV1pdn3kDlr0vl29ejfybQZQ/vvc1mgD+X4CaoviKNmtUGr0+0AFHOkZh/LOxFS1SutrJBsgn4iB/jaep0WoHgDVb4/bpSGZP3cIkKiKAEehNIHSJK6pg6khdIE0Bdf+9usRsvZWELe5nldNrx6m2zb3ua+ACgNKO4cRV4D/bJgAACAASURBVJcdeFYtExAdhDLnIbcCKoUXNUsaq4y+XqmW7CfBfTEm+vsIqO3yuF2Mr4U1hPGuLNgCHOFt2TcU0lRI4SJ02POJGzCGhvC6r9r1bqCJEH2FGcwl7dXb0PYFUCFACbWxLm2qK0C13ueQja7RQqmxJ1Fs+KrzgOQdt2uCsGgJw9zvgFros1DtDCeizpbyoHybBEoXhmS9/wBoGsoWKBuUUghTIHQY+8gBcq87iDdudhpt1Xso1Vzvq7lX7wpQIcBpW0cgvxlAdXRO4XxLf1k7oU7PTcDASRBrIEoIXO++K2g8MJWApqN0AUrMzj+6RUL1YCAB+SKv72NvJvRh0h/bB47ALYFb8LAz9OP7yL/hkEcrXLxY06HeQ3WUo4+AuhJHdaYN5U35Nrq2EcpVigM/8j2AWnSEEAoplUetFCgH5WyAazfv1QNGs2c4PzMfwWgYULoRqgdAXYI4ynr9AbTxJKosUSVF+vYhsnfsow4et+ahqr0TwSPAYgz7mr806MKAciWOCuF7c4DqvM5UvfCVJw+BEt6zOMIDkbdFxttuphSeIbjVfWaB+Gnv0NEIodox20dAXS5xlNDI/9q1oMC8KkP+PTfReFy71hvVpkhr63hVgMXSQ5cGE8V3F4BygHlcTuNyQijvH5cTuFwULhsthh8TKK+yOEoPFoQ94y6B6wfu4OIzBjtv8z/9qRC43hNuym195t8PKOd89fiWWuXhbTUxu4mD8etf6uWbPTch7lkBPnXEPF9BGx1j6NeuJXHTbtAcUEVQFeoHr6jqp6iBqja7p7zfmvTc5hyNuLqNkq8dnU++c4ULfGPlB5wqXqy/7QIgo6V4e+527s69DqTVoof+nvfdRu4WPWzC9lraatVDxDpT48PvJXabtyDmb/W2xEjVqFM4CBxvCNhyMEs1uUs9eont97j1cv9vfYqjErcc9BaW0KqLTNJzSPVeSVXzqpH391B986wx9NWmV7eVw4nKRc6Vp5uApAuNG5IHuDl5iKQIe/lySFuRPUw7nQfli7LfOHRh91lF0NJMS30Coguhpn+E2ZPXIqRCCVCy8eoPpRoOg5ZP0ah6E0IpR7F4eInyQrk/BhJB55b9+wr9iuwCfKF0/lNyRKNcaYBeBVYVMKo2CVEd6jXd1Pg3NxZdj3HUVHmGk8WLlN1KU/lOY5hbkocYMwYD1/t56RIo/QCU355b7LxVvm50KbsVSgCZ9beCk/F6JymovvEKpGyefPD3zmJ4c0IpmH9qkRd+72Xmn17EHDI6ChVZHtrDNBtSabbo7U4I1UMPgAoNvGsy+3oo/yxe7TtufINp4S3CMUbStpEvQFdRNqeKU0yW5prIdKFxbXIvV1t7kMHhU1yd9QSoMJtq54T645xCJiA6M5uyDE4/e6fX2dQeeKv+i5YeyEsXFw92LdTamXWO/N/HOPXX56ms2Oz94M5YQnU14RBQlJbUWT663B1QWuginFM9G5idUZJG7ySp905NExEdABUGlCYeujSYKPl8dAv2CqfLE6w6hfrPAthlDHONtZekZnaoI8BLT4BSAfE7yL0FzqkOJsd1uTC7iu24sYTam70OlIVQNgi3OqtX3bAHAXuxGBu8MbZQripy4dHTvPxHp9i4WARgxztGsIbMWEKFKyCsvJXOHDRZeHo+nM5/MzcdR9W+1A7Nqxa4Go3eSVEf3jUBKkzeds6pVb6u6KLkq+YzWhJdSDS9cYkhDA5au9lljHTQQzeACpH7ksZR4bQSpSiVbf7m68f5y/uOsbRciiWUoUnmT3kHz3sTH1V6oTeHBwrQ3o5hJDoKpagw8+R5nv2tk0z+/RqqOtwy8wY73z0aW6hmtrsHlFN0vOFeS1t+odrVEZSvHV1NWZJ6/ISsXlvroWo81FfJ4xtMiHwd6WL26mlh8bPD7+GDubeRsrwXMGe0BDuNYdJ60n9h6PWvtThKr9iu+PO/fZnnX5nHMqRvqtBXR8QUpl0YqRep2tY85Xi/C4+h1Y27yGaubVznu765LcHpL59n/rENgmnPv9iBNKWvDp9QW3BMc+ZQhulHp9n3kf0hdQT1ECiPRScCbdd0oIFwqjN7/gkI0Zjtq/dcvU75QrvXhpZLFVbWiuRzKQxDD6nDS1LBW7K3clvqao4WTzNpz7DPHEfWDcKvh8bHa/G1ofLBxy+OP/+KN6y58ao8I4OJEAWEo7+yNkhLEtWn3wBIkLTuiIX+cnkxFEiZAymG7xyI6SUE9c23PXjc7FUZ5h6fwy2FPDHcXBBe3lUc5c8Lqo/dVr/7p8T9//62A7xEelxfezF6qbNnZ/jcXzzK//UHX+f0mZn28ilFVkvxxvRNfDB/D2OmbwavJ521Kw+hCxtBhPYwUXXEpGvh2WtEPnt0bkwIxd237+ATP31TV0KN5PMNktq/63pbihwoFu5F141YzF746gLBJA3JgZ/d3fAgEUIp5eCqAo5awHZnsN0ZKvYcjr3eQQFh5ZDal0JIwdTDU23pmoTvOo4SjX/l/16bKjdoDO38cZND8CZGOqsmMTvoIUA3N7/BuQvznDozyx/8wdf57OceYX5hLVq+al7gvS09vK0wPWyCLlLudnUE8psBVAfnJB1XiffevZdf/PC1WKZsEMQQytADr4UHb1pZKXCvJWEdiCVUaWWO+ceKLVWNvHGA5LjZTB8QSikb11nGcZdQYgqXC9juJBXnNIWNI6zNtjsAP7xcSEH22ixTD07hlgM7tmt0fTGQGogCdMoAZXqAqm3PUrUZPR+g+upZm+luvW0PB/Z7w/hKxeGx7x/jz//sQdbXihF1RNQZRdePXr1dLxWHLrR8885J7hlPr/7kuw7WN7A2CRXabTbKHSew6bJOarKy+NZ4QgmX43++3FqHgPG3DrUVSuHiOus47gZOZQlHrYG2gCsnENY0MnOOwvqzLJw6Fip8lFJQiuyhDE7BYf6JuS0ykFq5v1fyN6EDlrdVq/5bjaC21Qhabu5mAOUf/lY/0kmL3/j19/Ked99SX+44dXqW3/8/v8rZC3OtdYTmNwmUbpxVT4BqlbttnR10qX3uf7n7p1IJY29TqQh008F81ZuWVQlj6Pn6KMTbSqYzO/1jDGUH6nRR1wMsn5lg+tvV9xVpgsz+FLt/0mDXe8dIjaV9dQSvFSi3iMs6rrOGkqsosQz6Kkqsgr6O7ejYykAlzuLos+CY6Fq2qf3wur3eafb7c5QWyoy9bSwgRzz9tJZHlNXLVSCv0ZjZk15eVI8vEj4QhskQIlP732iRT2qCG2/YhW27nDw1i1KKtbUSJ45Pceed+7EsM+L6sPwmdRZbt21ki00bV5eh5Y/qQ9lkdX9OmxmpiNmS5bV1/BOgKIP5iR9nNLPDR9f4CL54ylU2F75SYfePm6RvSZEbHUXUg+/mthos1r64uE4Z1ymAvgFiHSXXgBXQ1lm6aGCm18kfLLG+OM7a9BkW519B39jPzjvfidR8nIfM9qX2JJGWpDBRYOXYKrlrs6F00foJk7sDrV8/9SaMhtxKev+i+hnUD/jiy7CZuihdRuhBgZSCD3/oTvbuGeYLX3yMtbUiExOLfOlvn+DnPno3mVSi+Xq/vC0zlp1tanOzo349hs3URdUR1ENEeTs6X1sydpcc0m1W5GIj66aZOv0hhjPjRHebzXVIoXHTJw+w6x1XkR/dgUAL0Aevb+Rd18F1S7jKxi6UscsFXHcD1ymycAz0hEBoSTQjzdpckrFbi+y4u0RRO89zn30I5UbN1HmfQgoyB9IAzDw6E0G3yaFJC52f3B9H1X4w8Hql6mylkoHb5eOlx6FKWBwlpeANbzjIL3/iHkZHsiRTFpWyzfxC7RTfuLYTZ9gXcX2HkKO1jg51dqUfvz2rwH/jQ683FHdLPtTLtPQ0ALMXriZbeSs7BvzdfhTK/XW285YdPK6yUW4J5W7gOEWcchFRXmdjTZEcllRsl/zeRZQtEZSRWoXCRpr0VSbO0gTPf+cIt91zS4S8Xtu563OsvLLK0vNLlGaLWKOJED30y+M2k9d1UIur6ssNvvW2uB43rgf284avqKrzG2/cze/8zoeYmljCShiMjea6s50t6dW70UMbOqDX14Y29uZ143Gr+V2HzrA6fRUj6h6SptFKtxkv0QH9jbwLroNbKiNlAWSBcqmCpioUlnUG962iGwrNstl96zkEAnsDVmZ3kbu5zMlnX+4gryJ/Q7balGLuyflt8LhVWlWjDfZSYUYXV+eBfKTHDZOjUUc6ZXLo6jH27BnCNPVwupbrw+rrYGOxe/Vu9KBC2mpjY1329jJaqPZCrBbWWTxzG9mNdyKl4FIIpVwAF7dYQTMq2GVBxc2jJw1mX0izOpdiZW4MV2WYOTJCZd3Byi2SGFI42jIV1wppqyFvclcSLeENPZcOL4XL1+vMVROtDzw1T9qxznblta/tgBOl82CbXdL5yyNn6npwQlF0ocPBEL57GvaF0wVeKRNkNlqIbCLFkLqpsUt8u4WqPT7vCJRwcTdsRBl01khYG2xMgbNSQJQLnH0UZl/SqKzoFNc0Vi7sZPgql2IlEdFWtQkBmYNe3LRxsUBpNmLfYnB6uaU8TL5OgFLEB1SXzimuwbS0GeEY/XRhegjje6viqLZ1dKgzjn7aOKeQV8oEhYqhlEsglMA7VlgJF+GCcl2U7eAWFJXZEgOHKuSvcXCmS5iWZPyOeUqLLhtnCmgJxdCIhu3INm15qQYmgMJk41GD9j1MDwZST4HYpj7si2i7a50H8nEA5QdKmGNskaOfgApzGFG07cq7oPMDJ4ZzCj/qy89oXI+7JUK1or/xryOlgdBE/YXLOA4Vx0DXbDI7SjhrgNJwMVm8kEPLKVjdID08STJR7GBgXmbsrSMkxrzzC4qzxXAdheZ7AJSC5iFfNd93nfvzYUAJ3PemumOAr225L9+3Xr0DXZTcfYqjZNOPcRUYJUTPY/p2CmzOCyGQWgYpLZTSwBDIpINeeyBNwtIPTbRkieJ6mfEblpHSRY7AwrFhdKk1Hh1p43H1jM71v3ktyV1JChMFAsx00EMc/UTIXQdUUA/91jktuu0aKLHoOgDlNRBHyRav0A9P08JQl+iPKZQm0+iJHEIkcCsaMgP2ikLpIDQoFiyMvQrNTHDq4TSFRQsza5Edm2N91UYI33aoNgZiZHWu+cRBKsuV7vTQs8eFZkCFN33ZxFGq6QsziwvMLExvwnZ6ANQljKMCB6r0EVBbOZatfxGYxhhmNoc0EyhHR+klHATChdK6RXlFIuwCqmIzfNMqiZEiri2ZmdJJGFGbNlvbskYs9v7EnhC67fC4/iFfhMe9HOIoH0mpUmH0+s8xetN/5OzSt3HdcnQdofmYQLksQg7vI2KdKaSBFqG6MaStE0pgYplXY1gDaLqBlobCoo5TEYzcscDM40nWFl32vtll+mULVUwgDZuV1SyW3AiXL8hTta3kTquZbls8rn8Coppv53EvkzhqTf0AtGnAZt+NDyB2/D+gn22mi+I5ysa6kW8bQ47aZ/M5xkGP240Co4TYBqE0kcHU34iRyKMNKtSaxsayILXDZf8Hy1z3ng2cokNuVxK9skalkmBg+OruHEY72rblMehieVzRcml/DCnkPjfd7hDnEiVHrTz5FIN7HvA9giVALaAGPoPK/hfQJgk0En6ftzuOCpOvC0DJ9kL125ACzPdRKMvIkDbuJZsexNxXwUq5uLbgwvcTaAmF1DTc5Q1SO21e+K7JXXffQNcOox962C6PG1vn/jo65OPoIfEEbuY+cCve63NsCbZEOQbKyYBxHpX7I1Tin2icp96G71dRHBV/nWkzhtT3MX17OkMfIKm/i9zwtRRWJEpI8gcdUJDdtYE1oHP66UFuvPPd5PLJ0Dr6o4dL4XFDgLJtcZTi9NRJlspfQaW/6vVEtkDZGsqWKFtUgVVCVZa81+lY38bN/SEYT9N4w2SEfK+SOEqo+3/hEeDtcZ9xiaQLo20pj8h3+4xK6DNBDVqFgyMusFF8GVfOYNuwPpWhtHiAnVffSDafCpGjg3xhsnVDG8b3ljwfFUHbl+eCgl8E5UqZ2fLX2bXvaa9Igaq+URLfEZSqmvcytveWec178QPOfsTGz4E73IFnetdZt3po+tqW9neFuv/nHwHx9tCLQhnYhNGFMdCNwcQGVRidoHGyT4f6WspbMvGdS6+ACqPt1UAC+YW1iwzuepSL5w7iFHeTS+fIZQbQpCRa57C6tsra+jQkjrBj//MoSlXv7M2i1r21ECglcKtnXAhRq8V7mlRoqnH+DRrYNyIqHwA7cFBPv51QWxvbrEMXv1vb9guhW9GrF9S6uF6P1Yr7kFwLsxFthtYRpIP68WMt1wflrVXjV2AH+fqhB/wknXTUKrdSihMLAxwaWka2008gP5TZjXI1dh98wEejo9wxcIdAJUBZIEogbBDLoF0kkyuTqdG73jW4Tv3VQo0WPDChQAjvaG1qu1VqXNbV44B4AWUeAfkWROXD1A80jZSjg279eoDGb8F8G912Y3u+CQjfWL+v8UOgfJvjqBb5fGPcaDn6qIewCYc+x1HH5vN85eVDvLIw6Lu6Jm97nVeWfgIqo/WDj3BtYALki6A9Bfr3vU/5HIjT4JZ9tHgn0boS5QpcV3jgcF1wBcoB4Sqk8v6FchsH7ihaDl3y/l0Q30EZ/wG0sEX1GPqKO+HQZ9sLmYDYYkMCot9+157Z7gClAk134LsnPUSANJQ2rLxLOp/crgvfOHmQC6tpHjy5h3NLmUjasDpN3WB58qNQGQoYdZv/KhCUI1C2AttFOALhUD3NWYKjIRwFrvKGfvXrVf1f+L63gMpd8OKqTvrartnRqPvsA2/ERtcugdKVISlKgy9jZ8/imIsoo4hdLPdVqNY6WuWzC/YmAeVro6nNLp1QS3kMuoDHrSjJfa9czYmFHErB8YU83zy1l+lVi8DFbdsayA6wPPNxsFPtQVTrSWwPCNJWCNtFOA7Cdb1/R3m0tgOuQDgCXAFKenklEK5CKOUdXmuHtyXk/wbl2q7+KJ13qduuANWlTSmF7mXCxv41olr8ULu6t/jBzl2gMnbUe/zBsXBXkxz9T1l23quz441phGuAtNHXr0HUXvlTb7o/cdTkD2c4/90J7viVW9GTeuD6WltBhV8+cVTB0XlldoBvnd3LmeWB+k+uEryyMEgBHVQxXkxQB1SOpbmPMzD0OaD1ZN1aDdQmEfzHH/v8qkChhEAhvBOrhKD+yL0QCFVu9rtCRyjHp+8EmP8aSlr3OrvEcZTv4cCoHqZLj9uBrjJ8ApRCSQdlbHD6C5L1c4LpJ9cpjx6mNP409uiRwOXteqmQNjvQTT41w9rEOse/ejJa7li9VKt8seh6iKNcJF8/dhWffeFmTi8PNNWeNcv8/G2HOZBZC1zv5yXC4yrFQHaM8+c/6C37hPwLx/v3eilVHZ7Veh1Vfa2U9OIk10VUYyMhDARmPWYStWPhlADb9uqptcNPQWWwhbdIXcal24Y4Sjbf060wpAatYy3iWo0TjU7951HmHvHG+KtHEqwcqb4pwzW8m7ZJoep0IQpcPLHM0knv0MvJp2Z46UvH2tQRlLcbPUQ5pzDasPJwOonLraPz7Mmu1f2vFIprhpb4V7ce5bbh1eY6upnkUYq9O65nff3D4BjNQ6/aGX5KgNK8f7cKLtf1viuFcFwPFI73Xbgu2EWwy1CpNOqzBVSUbwg5BPIXgVs66KUDUC5hHBU9zAvm4wxh8BWFDYsE6POHcJPzTH9f1YFUS3MPZcndVEQ6VnWOQnXR7frbrAndSjv1VPMh9JNPzTBwKM/O1493r4dgW0166POwz0d37fAC73Ek9586iFJw5+gs9xy8SMKojYs7T4tH6lIp0qnXMb8sGE79va/crUbYEu945toPrsd501yBTweuAMf/6tTaz74CuROsXwXMxu9xbKzfw74el25a15k6GhLhRhslhK8OrTCAVsxy8blpTv3dNME090iGfR+QGInxnoRqlcOro7hYYjIAJoCX/vY4QASgwuStpS6AshlA+eXzGZIUilvH5hlKFhmwSuSscshZHL0Bajh3K1NTg+wY/gqoJW8YJ0UdS/XLaWa7OSm8V+O0SdoNYH4YlNFB5707IVVxmfj6CcbeuR8j9G0vtaY2F0f5TifyVah8X4L5sMa7GPatTZQ5+bXAWdW+tHj/Iczla311VOvrYSxbo5v8YSuQaun4V0+xNrFGq9xt6uxBDy10cYcm1bwmHPbnVslb5aoNxtRPF3HUjh17qfAJUDuqQzPlzdIpwB9uh7yoI9a/9lZI/AKIXEAPfv4D8rTIEU9foBCGZO3YIi/+1iPMf/9CjzprLZfNQPHdzC0wpLXJAs985jh2sSUgqqfz353BKfhWvjchVBhvdsHm/HcnItu1iw7P/OkLVUCF1xGa7xYooc7JRxtVx2boooDShXMyjDSu+ctg3AuO5puQcFtfGxX7X4DxTrB+tIMcPQAqIo7K3TSMvVbh1J8+y6k/fw63FOw5Nw+o7taZejAku2hz9L5zbYEEnlHPHl2KFmKTweHskYVYbR/90nHsQmBOvhs9xAVKHz1uE22XEw5x6KQQYLwNUr8C2hvBTTavPQXXosLWpmr/Yhwy/woS76Ip9tymXn3wrh31keH89y5w+De+zeTXT+CW/bbRjb4azkpGMxvHkOJ5XLtg88xnTrI2VSBOOv2tQA8SJlTITF07Qzr94IVYba9NrPPMn73YAVBh8qoI2jA5+u1x29URaGOzzkkpECOQeD8kfxpsrXX63PF9hv1b90LufwBtT6CtQNst8nW2sbh6SOxIYQ41Xtpgr5a58KWXOPwb32L2obOtTqqLXr35EMq4Hld1oA0IdfwbE7GBBFBcKrN4qnYofBshYhrC4qllioul2O17a1CniXYY/rYC+X4Cqss4qr+AinBOSoF+FeR+xZs8cERzvNTSE43x8tx7WE98EpLvjNBXl0DZjBPypfShPMFkr5Q589nnOfpvvkd53m+r8XWmfernbv44cKBRKJo+ossFleUK5ZkS9nIFEGiJ1q37L/39BSafXaTbVFwss/PO2vMtAWa6fAThpb871RWYwANUcaHE6M1BHgSVpRLlqQ3spRIIgZbQm/TSzEOwvJXNjrR9fz4qTh1B3gLlMg3WzSxWbiNpmXiAqM6Py0Gwbob0+yH9XkaG92OayZA6A/lu9dCtvqq/lecKrLwYPglWWSxSnFhj+O49wQsDdQfb4lE9erq0dn3tS6PcLbvMf2+epaeX/NWi5wwy12YYuGsII28w+dzipoAEsHR6jeJCicSQ5eOhxmKA5zZTvsXFEkunVjbFQ2MNaozKUpGlx6dZe3nRA5EvDbx5J8Pv2INM6jTrCzazjKCEjWtNIews0s630nXUQ6CtbqZ42+gyjG4wPwjc2ypbnTaoB3+dRNpY98sNYfJC4AsoRfpQYwtWWFo+PMPKkTlyN43E00NV3sArZYIXhgt74YsXKM20enp7pcLSU4ssPbWINmgwORl/aBeWTj80yQ0/uT++IVWFasgAp791sSceTt13gsLjUzjzre/craWlxycpnF5mz397EzKhB4DTvYEofY1K+ggidxGxfCPG0u0I14rWg1/upnwHnfUDUP62/UYd16Y2Ayh8Rd3smaym9MEcQgqUGxyqNdL0P50id+NwiAx+MZvb8k1ARI2vm/OzD82GAimYnMUKYwmdkYSG3m6Y0SbNHl32ZuC6mbny5e2Cw+yRzfWMuhCMJDTGEnpbINVSaWqD+YfPN9hs+tLdWN/Vl3D0Zcplh0r6BUq7v0x55FEcuci2xlFxJ3m6mmGlVQ+h+lI+MdvJ251uAaSpsfejN2AMBHfXN9Ly4RlWX1kIlzdCPtnux6BQhfMbLUO7TimpSXamdPKmVn0KNH6yiw7nvz/T4K3LaePz35/qOB0elvKmxs6UTlKTnYl9aenxKQqnlwMsdnHTlUKJCspYBK2AqDp4WxUomSdwMsfxHhrqTg/xANUjUDYDKD9QQoHTJVC6ANT4u/dz8797K8Nv3hUaWilHcfrTz6GcTnL4QNoqVDQSF58KeSt6zJQzJONJHUvrDlGTzywEWIlvSJNPR++0CEuWJtiZ0skZ3YHIn+YfvkD0ze3scZUq4WirqPrzJ16SGEgnC8r3aEJzI4FyXz6sN+vC4/Z/VtDHS6xeKqw82GYYXZi8jXI9Y3DVr9zGwU/cijQ1gqk0vcHKkbnmOlrka5RHrzMFLqwsV1g/sd7SYDdJF4KxhM5AF71UcanM5DPzzYUxDGny6TmKi2XipgHTG9JtdkhaS4UzK1QWS2za45pFlL5KcB+gcNKIcmBKt50etmX6PKStbkDaT0D5gaI60AbKR96ym9v+8B72ffQGzOFEE/n0/acirvfX77Xffp3Jd2GvQPKnrCEZS+gYMRF1/rFZOiowUD75dACAEcmQgh1JnWwPvVEwrb+0sGkDURRwtdqWploSSDuLVCnieNym30Lz0XTF5WmWj01EXx/Zw2wSpLEAFQaUdvJ22ZsBetZk/L0HuPnfvY3Rt++tTy4svzDLytG55joiHIb0Z8KF8j43zncOwrtJ3Rjx2mSBxVO+Taj+FKKYxVOrLJ1e7Vhvt6COm9ZeXgywFB9QrlZEycAEj6sh7CzCbv/a0Pbl8eiMTJpjf3iOE3/xLMXliQ69XICXLYuj/Px2CZRYdI3ftKTGgV+6mRv+9zcxcPsYQgrOfOZ53FLn02cDlhyBfqUonO9tmjsqDZgaI4nOw76pZ0K8fT3brMCp4LAwkKSAkYTW1XCzm1Q449u90aXHVbJI8MlIoUyEkwZXD6nDl/oQR2kyjTVisfjDEi/81jnOfvkwyg05o+M1FUe11pE5NMA1n7yLaz55F07B9naZt22r9n6mDl1vZaWCWwqcFNPHlNQ69xCTzy54MVAHBRYXS60xli8ZUCkR5gAAHgVJREFU0ovbup2p6zY1ABXmnAg3EAHewRfNuhZOAmmn8Xzf5jxuN3HU0Nsbrx6deajAs//TYS7c/zJ2ObD4/RqOo2rl+dtGue0/vAMjb7V3VirmOpO93OEBrz6kmpGn9WgjP/9YbZq8VtIq1Pnvtz50WEtpfWuGdWGpMQkBXRmIdFrGC8JNgJMI97iq6Uu1PNrjxgHUwB3NOwScgsPk15Y4/D++xMUnTqH8YH8Nx1G1cpnQGLhjvEEXEaPGWGeC0kz8WbFekhQwZHnDr7A0+ewidtEmSoF20WmdSq+mAVNjyNqaYV1YqtS3HHUPKBW4ScI1kW7tke6Qm7kJA2lHlxkcRk/pLTK5FZeJz03zyr8/Sn0fXlSdfQFUyH0O7WG61EMsuijnFFEnhE1AtArllLpf+OwlZQ0ZGkd5zzrV1rpaFVPfMeFLtfion7N1sVPcm17/WXmTDU2VCFCS+voSPtp2dUbRtZT78qphRKn9aaLS6olVFo9c3DxQYsdR/jo65DcDqLDerIdePeB+Agz1uObSS/LiKMFc0cH2CXH8/gkvdgpsYkwMmpz+9lRTHbUtQdsxrAsmL2ba7emyZe8ZtGyAreWdDKY0cSijhPL2jwkHUT+jO+7Gz01ugK3SDv2Iy8pL0fKd+/9mGPz9XR7Q4+7r87cV1raftm/7+sLkpVEeS2cd9oRW6fQ4QpVmmlfjtysZUjCe1Jkp2lSqmxLtgsPph6PjIv+1Ywl924Z14SkCOG02dJprV1HeGMcySyCKKKOAch1c5R22FQtQLW0RMN7OBmLuyADRywvlpTLL586S33cw3MDqbfn00Mum2naAapK3Rt7FBth+AIrQd9r6mffKt3Imr1OSAsYSetj2qchUm2i4tEDyp+6GJqabRpaGkMVdaKtXo69fh1bJB+jChiYqss4m2rblXsoM7WD49YH3JQXSub9YbrTZNq4I8NLvOMp3SSfdtrYZgy5iGSHIX8Q7bSMYu0RJivgcaNVJjEsOpBaGu7zpLQYTNKSQRvoYR2kJjas+fpDrf/M6cjfkQjeDFqeLTD9UG1r3CJTLOY4Kow3hW0YHohEMXOZJv+Qo8qW4RnAZe9zsNVmu+/Vrufm3bya5M0kwnf+H81RWg+dlbBIobYHTT0CFtdlO50E5wstlJPp9eWvU5FKnuLvNrcsJTNDGkAjxglvhcaPaCqON5ju5M8GN//ON7P+X+7FGG5tBle0y0xTD+ox/s0DpB6Ca5A3qoemiQN2bB5TOoQ/swEg1CkNm8OTxx+DZx1vKtzONWM0TEWEprUvyEWtU25mS1+0nef0BOPD2aolo+mikKOBH0JcWYPpJupu56l+gLQ3B2NvGGHnTCBf/8SLTD02jXMXMo9PsfO9OpFXTvY+XzU44dDUxAeFHYwfl7VIP7ejwF4lq04snFxm4qu1D8ZWpSeypyXYk25L0vMHxj/8SYXjSJGRvv5M9f/hn28/YdqXlE/D8H7fcxFbwBVDY60EkYUskQrBxfoPJb06y+Nwiw28c4eDHDobQijp9+zoj6LqijZBv0/rqhrb+Ttv2ydixE2PHzjikW5oqp1+4JGtGl13aZo8btR6V2pvi0C8dYvXEGqf+4iTLR5fJ35jvoedpfPR9+jxKXxBvGSGGbn1njV9Jr450+cRRtXz26gy3fOrW6mMKIXSXcxwVRtvSZjy6S7DH5krqPcUAVBhQmox384F2WF6agsHbhyLaCvDyGl2PugKmV1tquplhBtN/jxtaHtrDtOvlAm30AqgwkG7belR0rx4rZrqSLqek6OVAR6VcwEa5bqM+JCgJmkQIiRAarfFDrf0O22r6fl5f4+Nyj6OugOlVmbo3ECVsXHsDRRHXtVG28iiUACERUiCUDhgIaSCliZQmTcbU9amymwBK2GRHV+CLCyjo90vsroDpVZfa9zwtPRFlHGcZu7KBcgq4bgXlKER184vQFEJpyISGKhoIw0JzdFzdQqkEUiYQtbel9wNQ0F+gtKNraisIoGidRZdHyFf9uAKmV1NqGtNH3XTqBqNEgXL5POWNVZRdQgkb5bhICcqVCKmgItFSOuUNAy1pIt0iNhYaFYTjvQtGaunGICYuULoZHvYDUP62G91df4Z9UYDyi6WuDPNefallTF8rb/a4SpUpVY5RLi7hFAu4ykbqDkIqXBvQBbgSmdCwyyboJm65jNJMjHQZp+SBTkiFciXINKL+YPY/pzjKr9tAHBWQ7wqYXlVJEceTusqm5DxHqTyFU9hAiQrSdLwJr7JHJlwJpoarNFxposoWrjCw0gaunQDNRSkb15WAhhQaQiSJMqTXbhwVf9h3BUyvyhQNKKUUZZ5iff0VlL2BEi56wsEugioBto6Li3QSyJwNQiJ1A1wTc8REqQToNtJ1UUoizXVwwHU0pJGqGnavgKJB+xqKo66A6VWbwm9uwT5Cofwiti2wCzpSF5QuVLArJrpyIK3jLrvIwQqsmyhNoEplBvbbKEoIw0YK1/O0enXjqquj3BQNo+oCUBDRw/Rz2Hd5xFFXFm1f1ck3LFJQds5SrrzI2qpLaV5DrghWT1kYVganIDFGM0jNJrEbrOEk5ZUc2XFJKqMxd1KnuPr/t3fmMZJcdx3/vOrq7pmee2dmZ3c99jq+vV6b9RrHJsdijigHSQgCRCCKUAwI/oHwD/8TJECJkEJAIpESKeQPlAQSxRE5OJJggp3YOXzFjtex17vrPWbvuXr6rHo//qiq7lfVVT3VPb0z3ev+STPd9epXv3fU7/t+x3tVbZOxN9CqhNhltNRw63XvxV7BoqyYdRtxWycLt2l3VzT6F8OXduG2F9uQQl+McRDjmGE2b/AoYcZ19AoV94eUi1fQp0exMmWsBZfZ+TIZV8gvAu46ZMGp2mTGsoxfX8atOujCOJP2CrVKgbWlOhOLFaSeResK4k6QQVCWQ+PlmF38wFjP46hE3h7FUUDLy242iaMGDEzR2eT1SHGKoHHtp1m7dI7xGcF1S4zNWOTHNbggWRDtP/6voXzC5uJRl0LBYuYwFKxLnH1+D6OFIm5OUa8qstka2nHIZGu4Gw72mAI3AoBNAvL+j6PMquPcwUj/NnH7hm7eQFLYVXHVJVaWjzN3h5CdgdlbNaN7HSrLGVaOTbD60yyVkzZkITMJu+6pMjnlUNhXJj/ikpvQ3PDG82gLshN7ufh8DccdJZNzqJccMjZIvRCqM9kNIp7PLI/d19dORny/u+K7Km6f9zEE06BRy80VpPACol3WL09RPDtKpmBTX1G8+tgsUtDM3J+ntpThzGfGWH48h3MlQ3a+hoyOYOWnsCxF1nZZPFxh1+IF5m4X3MoI9Y0aumLhFqewbeOllG0B9XqLo5p/rS9UGVL/kxn8KsFhCUGhq4rLr4yh1RjlKwUWDhWZv6cE1gYTh2osPlxmdNFi/ZUs+YkRxhdmsHOXUBkQG0TbkBHycy6VdZvSUg5nucDozDyxSm4CJYSXLoHSEaC2CJRuACXGl5j+DljMNKSoTy9K4dar5CYzTOxZY+o6yNqaS8cKTC7WuHh0kuqG4Kw7FOaEqetHmdpXpFZWuNUyjCs0GU7+aBczN1xHZeUCMzeuk1ElSudm2HvXLd7OB4HNdgD0LI4KVTE4cdTQzRtY8m6w0sLq+SkspRA0mRFNvaqYO2Rz8rkZLjxjUVzKc8t7FJm5Uc48mePCT6c59q1dXHpaI8yilGZqwcYeOY5bzbH2moVla/YePExubIIWJdvM8qTiS4qbEmS2lEfq6MTyJMZsm8jcxO0bgmmgKP7m1k7dTLUoiM5x+vFZKhvTrLxqceDtRcb2VcmPu6z8rMzysxlGdpeQyjqT+4Ts1AjaWQFRzNxwlvHxVfbec4rlpxX5wo3kCgaQugGUhL40+a6K25dwfVwc1bauTWS2AdQQTINGMTf3+jsOcO6pES6/PE6+UGLpB1my8zVOPJZl+iaL+prN6tkJ9hzeIDdikSnksNwao9NXOPmNLMXiFGeeuhGtslx4NsPMGyrk3P0xwEkBqGjC4WrGUb1OOHQEKDNu8r4MY6aBI2nx6TO2hcrfS/ny00xf5zDjrrJ6apz5e+qsX8qCrVlZEtZfzeGuuTA5Rv76AqXqGMxPc/5pzdSeJS49r1h/Ps/Mwq3k9s40qgttBG00I24hMzi3TXFUHO+2xVGmDO9jCKaBpFZF+LkHbuXb/75BaeMFpmZcFu5Z48ozGaZu0ozfnkNG9pLNXiA/6VIqTlNZGsOqn2Bq+hJ2QXPluRFq5yZRpQXmj7yJUMIhdsdDh0BJxUfzXFzCoaNdEx0Cyqyrk2SH0b8hmAaWWm/ur7znEN//7jg/eeIZ7jrssO92haYE9Rr188s4yqGSV4hcZGTyNErZnH9pllNPrVM5M8otR27hwNsOkgiAFkB0AShotWYh5U1hpbYKqEZdAR/JvB0AagimQaKo6x5zc3/hyC0cfmA/3/zKs/zrp1/hrgNZFmddCrvL5HPCel2xfsXltZNZTr9cJO8Iv/qBu7nvQwexs3aMbLoAFLQChWZ5L9y+VI/Ft3HReu0eDmOmAaQUPn0+n+V97/953vXbD7C8nmetmAHtZZtGBeYV3P4QTE24TI/VsFSHlqfFwgRNiXMHo+2+duOoIZgGkVL69LmMy8J0iYVpU8mNL2me6WkoTnCN6RbF8fYojopr77bFUbQAJc2YW2TyO/+zEWnJyu50C/qLtrw2EscnjQ/jSxsZkePE8mibDb6WuhJ4W8o75DP73e3CbRs+y8lNtf6CVZ+SziT/Avjrhnq8NtJekSLHWwJUnPJKAi9h3rblKfh6vXCbwGc5jsugkOsOTluvKqW6uR0CpReAClmYKHhDF0Xq7CGgoiBN4u0FoCIgtZeOPlGsjC62/X2mfqHKlz7L8kabX35//EnWX/jJ9jWoR7T/0r9RqJ6OD6bB8NPbZK66XBsJJxbS8JmnX+dxVIR3uJ2on6jdzJx2xu1FHBXnFsVamK24fXFtjtbVrr9bcPvCBc3yLcZRw2xeP5AYStPJNp2W8oTjtpYnoc5NrJRbcSmdqVJeqpKbyTKyO09+VxbvTcqbWKi4/sUt3Ka1ZpuOQ5KVC8ra9LsDa2aP5G2xKNI9qc1ZeiQyg5CbS/6xarFyFFTp6jaiR+wmWblRqHbg7nQNKAy96dzt2zhVZvXFDVZeLFI6XWX3m6fZ9/Z57ILxqxmhuqIgDahHbl8aoGzjepS9d/FGxcytDAJdnv8OV8rRG2NSlf0HHti29vSMfvgd7/OqKVJ3cVR9zWXl6AarL25QPF6mXvQSQHP3T3HL719HbiZrXBt8DQAUL3Nb4qiQjBRj1qM4aujm9Ru1VSRoKEJXitQoIKQwAtUrdSoX62ycqVLy/6pX6g3Rhb15Fh7axezhSXJTdlNMo+pNgLIlQNFj9zcNoAgBpcFnHkfGcgimvqCItY0CpafvqfNI1zSrL5VZfanEytES9TUntmUzB8dZ/LVZRubzfhtSuIfdAApagbKjcZTZ7nST04CBqZ2LN8AkjX/0PH4wb7oWLjyxxoUn1qlcqCGaWBqZzzJ77wSz906Sn8tGALG5e5gMKGIsTEA9cvt2MI4aMDBdw9RTRaJ5zlCkpf9Z4fR/Lic2YXQhx+I7Z5m+K7LTpMXCtAEUtALldRJH2dfqZD+Q1JUiQRxwTBm6pjnz3yucf3ytpcrctM3svePM3jvO6J58cqNaLExQtSJS0Bu3Lw1Q+iyOGlqmvqFuFSmB11cQpywc/dQS5fPNnSNWTlHYk2P3myaZPTwR04YkRYqzMFtx+5L4zLq2wf1NYdU3HaNhAqJfSGjeSHqqSGsvl5h/4wTZiQz5GZvctE12wjZAGVWYJMtj1NGJ27cpoJL620O3r+NlhO7cviGY+oHE/NJbRdp1jxn/GIAR2vr/HQNlGEcN9+b1DUn0iySUB4cxfBL60uSL8rbISDhuyE4qN48lUlekLWn71804SFCPJI9DqB9pxyHN+DT7bVePvZrRr60zCFRfOr8pT/mZp7ahJb2lfLnmzWpp3aIWn55meTfuTloLBTHu4DCOCmSpk7/14HL1kh6IRzDsCQtnPWFxZIBp8f2LjN5g/PiyeZ8aB9FzISbj5nbI11LerkxtUt4ln9mWFhkJvFdrHOLanW7MPjJ08/qFTNck5KFswe3blC/JHYzyRmSlcvuS+OJcsTbuYE/HIa6/7dzBBJkJfFb0/JB2gq6iIsXFD1c7jgpNDDEg3bE4KoG3bXl6vqFl6hvaiiJtMuP2TJGibYsCpZ2F6SWg4oDSzsL0cBzirJlfbrUIGNIOUApFCilMFzNuzxTJlNMhULoBVMjKbcLbth+d8MVNTm1k+jS0TH1DKWbcq6lIbWbceJkRWddUHNVORoJMhmDqD+pkxt2SIiWANJY3rjzhOA2gQhYmBqSd9q+bcbjKcdQQTH1BPVSkOKDEzbg9UyRTThxQ2lmYXgIqDigpJoxejIMPUlX5wX+s6ez8BANAq1/+Z9Yfe7Itz+LHP7lNrekd5Vcewdp4ma7WVvpqHSYiq+frUe1kRHl7PQ6bneMjdv7mN7jsuo1BoNL3vrkpz+ihw9vQkh7TE1+HDfBmwbgdDz71w3vqQjISjhuyk8ojdcbyJfQ3UUYPxqGlLnMcNt81MXTz+oHi3KJYn76H8UNsXSncotg2xxz3bRwV5/62cUVN3rblQzD1D11NRYoDSr/GUeeqcKwc4Y1rW5txCPW33eQUbffWxsFuOTGkHSBjFr9m3q/Qodt3sYb8uIg87W26tj64F24YSTEOcf3eAffXW7QdUn9Qh25Ruxk37SzeOOyAr+P9bNG2tZbrZ85T/6czOE+u4tZdXMel/oVzyKoTuV5ixqFNu3sxDnFWPY6XgXPzrlEr2qIEHbhFvVSk2HWYdIoULk84bgFUmfrnlqg/UkSLRqPRGdf7XqxT/8wppFhNkJGyf6n4jHZuIY4aMDBdwxSnvNsdR4Xq7HAWbylPOEbAquKeOEXlY+dwXi2h0bgZBzdbQyNoLbgiuCt1qp8+g5QutMrYrH9t+xudMFL0LwXf8O1EfUNC+rRxn8dR+M+cxby5SKqrlD+1gr7ieOUKsFzAQXTGb6bVrPdyFedvquTeWSL35v0J42DET43T2x9HDd8B0VfUBaCgFSg78n6FiNKGZIA4G1S/tUz1exXvnCVgi/eJoJQFWtDierLEk+W9KFNwv7ZB9YlXyL8tQ/bAbpQ9RuuEkaJ/AqgcUOtiHMy6jP76NART31GShfFP99176oz2WT7wTRnapfTty5QfW/EMlgKV1ZARlOX1RxBU8AC1EiSwWAAZBa5Xl3OpQu3zgHWC/J0TjL5jlsxcIVX/dH2E+s8qVP7rJQq/cw/ZxYRxaOmfOQ7tx2ywwHTNuqQSsT5tZtwtuX0dppcbVSRZKd3kU4DWHqD8eKR+dpn1L63gXqx75zOCyohflaAyyuOva7QTiPLkixI8hCkQC1yrqdOOovTcCqVnl1FZC3txlOw4sGscZXsypa7RRQe9XMe5UEGvee8NzN0xSXbRSbbqW7DWgwWma5YChU4JlG4ABU3F2fJ76ozL0GHQ+5bpymdPUj1WAQRlC9igsoKV8XkcjWB5l2sBV4NlIZZCLEA0iIO4GnQO3KzRFtVMuFVc6q8UKQusfejXGf/iV7BK8b/Rlb2+wPQf3Q4S/DZyb93fIZj6hjoESur9bAH1wu0LLE+4aV5dJq8w+mCe0vEiKiuoLKgskAPJKMQFV+XIVKvgarQ4gAU6h0YQSwAXlJcuV67jV5FpGHERMzYDlOLKXXew8hd/RuEHPyZ//AT25WWU4yBZm3zBZe7DdwK13ri/MXHUEEx9RZ0AqvnRe7cvpi6C02amTuJdUYTRA7NMvL3M+vfXIeeBSbKgHZC6xqpW0RnQlkbjWwpxENcDm1gKZSskYyGuoJRGOQq0IOInJgww1eZmWavVIJ9l5a0PwlsfDI3sQ4UfoQhS7B2OA6SKo4Zg6jsyAAV9EEeJl6mOGjrR8e6O8rNxSjN1ZAGnVKNyvIzYCkShRSMISlzEsTxAZRQ4oJRGaz9m0spLPGiFYKG0BrFAvHUoImBaW5hjY2MjdkTvHbvICME7F9tMGFtcRhiCqR8oWHWPzdTtVBzlX6MC2QntVopGKk5psDSgG/HUrrftZvm7F9k4WvLiHxe0UuiRPFbVQQS0ZNAK0BolFjiCiIASVMby4yZAe/yiVTPs8Zt7fmE3KysrLU28e2adm0ZfjbEwwfVxk1ObMWsDqCGY+om27bmggJKslDROx5ajjHPaK7cMQBlmQ9k2u355L7nFFS587SLiiOeiuS6uI2jx2+coD0COBldjOS6IRmeziFKIq1BaNfoigNaCaEEsi2N75nAiYLo5t8r9t6zQWETuufsbBtQQTP1G3QAKDAsTHHfq9gkNS2TKQ9FIgQu+y2cAR/lgkuCz4e8ZHqPF+K27sH/X5vS/nMUtaw9ULt4fGQ9IolCuRkShRJFxQSuNoJA6YGUCySjlgc/VmnPzs1zc2ADDzbtvrsx7D1ZQdDoOm/ERMzl5x8NHMPqBWuKRJAvjH6ZZuE3t9hlrRUAIOI0sncEiNN051XTnvBx30DbfgogyRFuMLExz059OcPzTL1N6reKDSSFaUJafJncFnbFAbCwscAVcQVXrkMujMpa32KsFx3XRWvPS3DSrq6uNHjy0r8r7DtkekHq+HSsZfEPL1C8U9yg4XAW3z+Qzkwgmi295QvGED5yQG+e7eQ2mwFKqZplvmTyysGyLm/74ds4/epalr19C1zxrJtqXo/G2GYmgxd8dIaAsy+NRCssRXFcQx6WYy/Lc2Ci11VVG0Pze/TkeOhh9DiqlVW+c7i6OsqmsXAYG4sX91y75ihnnol2VOMr096PHeN8Dly0Am9L+hlSaYGtYsRggKR9AYhll3j+l8uz5pZuYvnuO5//6RdyqxguefA9SxDdw3nXKz+BJ3QFxaCRFgK9ev8jlcomD04o/efcurtuVDQ1HV1a9yzjKplY8DdzMkPqAEgDQ0zhKWpWsJaCWsPWyBC/lHVilgIIXAqvmtcpq4jMEUAsvZdd86mdkbor7/u4+zj12mhNfOIvUxfcW3eZlgQgtTYvht/2pmQnKu3N89E6X2968z1hQjrpoKcdsa3HUCZuN858EfpEh9Ql1AigiQAkVxCiCTlYkK6gD43oBSyPKRSntnw+EmpbIAJPgW6NAhvIBZlqoZtuUlWPvkZuYv38fr37+OOf+72LTxY14X2ZBYXGMD374Dqb3Gm+p29ntWI9aHPzAFyldNJ8PHtJ2U7snUs1zLU/gRnhjy4PjINEg4fPBp4ZQwkF81065KIw4SSwayYUGqIK/ADTgodP/0xEXMupVAvboCLc9fCeHP3qA/O4RtBa0xP9N3jHNfX91XxhIqcehHZ8YVlUif3EyGsf/y1s+fsJLQJz+/ue47b1/wJB2jpJ2PGzZ7fM/LEUzxpGIMketnBjZOtc7IappUQL3LsjcBccBwBoZPdNC0Zz1xQrXZVi28d3zPPCxeWonl1ldv0z1ZJFLLyjyuzUz8yNM3jhL4cACZKwOxyFqecz+btnt+0sI9ubd9t4/5PLR32T2jmEiYqcprYKkViT/XEh5jfgj7m2q4icblAmiGLdOmiBoPB0bWKKWBWKak3zjnBWjtB7l9s8wr3bB3bD47kgb045DiDfqokV4uwfU53jL3z8ajIBHp753iNWT5gvLhrRtFFG8tK5coqtiuIMNfTdnYzNwlvDluB6QTHdHjOsk8qcVaCPpEDwbYe7qhvCxmMppdj+pf5v0u8X9jbirYeb4OtPymeXCsyB/HnA0wXTo4ZMc//adQ0DtFHUAqFRxVACqOBnQtAKRALvxyHgQ/1hNC9SIl3zrY5ZrI8Fg1qUD+YbbalqONIBqPLy0Sb+7jifb8ZmTidkO+SrwEG/9RGMPU/jtRIcePsnU/gLHvvEI9Y0YO73T1IdN6iltYcZtUQRTRkwdSYokEWXXRmJBMCyMDyCJWpiYLFgIvHFtTlLaJN42/e4GUGadbZM8AJwE+RBH/uF9HPlEaDNg/A6Im9/1GwAc/fLfUph/B2O7b4zlixugNNRyWTo5dkFJftZfTIi5RGVHM1x52Q0Xbqlh3VFLHLIJafcYIsVwE7qIj1r4NP58qcLpXBM4vjwvP6FQKP9lDoHpET+2EZRvukRJaKE22mZlgfgrryK0xkYGbyi2kYjMkHCjf0nl7cbLrDoSR6VLnz8D6lGO/OMjJND/A1ZTszuN3+oNAAAAAElFTkSuQmCC"

/***/ }),

/***/ 26:
/*!**********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/bgTop2.jpg ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/bgTop2.98d71c30.jpg";

/***/ }),

/***/ 27:
/*!*******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/1-6.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 36:
/*!**********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/onemen.png ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/onemen.f30adf68.png";

/***/ }),

/***/ 37:
/*!***********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/address.png ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMzQwREMwREJENkUxMUU4QUVCRkVBMzAwN0NERjlBNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMzQwREMwRUJENkUxMUU4QUVCRkVBMzAwN0NERjlBNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzNDBEQzBCQkQ2RTExRThBRUJGRUEzMDA3Q0RGOUE0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIzNDBEQzBDQkQ2RTExRThBRUJGRUEzMDA3Q0RGOUE0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+WQ0gdgAAAqlJREFUeNpi/P//P8NQAkwMQwyMOnjUwWiAhViFCbNp54gFqaNJgiBgA+IwIF4GxPeB+CcQfwbi61CxUKga+iUJPCAQiLuAWAWLJzSgOBKI7wBxORCvG6gQZgbiTqgDVIhQD1KzFqqHeSBCuA2Iy8jQB9NTTk8Hh6A7lgUYV45aDAwWygwM0oIQsafvGRhO3GVg2H+NgeHPPwxHnwbiNfRwMCht9iMLCHIzMBS6MzDICaMqVBaDYFs1oIadDAzvv6JITwDiTUD8i9ZpGJTjZZBDFptjkQFIrgiohgU15UpDSxaah3AAMsdBE+FYULSvPMnAcOw2hG+lysAQbg7xlCxQjQOwvNhzFcOsJbQOYVNkjiVS+bAK6NjdVxgYvv6EYBB7/RnsaqHAhB7FmgQyR14EwT56G1PxgRtIajGTjSQ9HPyP3HLwD6bOv/Rw8H1kzsM3CLa1KqZiew0EG1TMoYF79HDwMWQOqJyFgTBgBnPVYWDgZodgEDvIBLtaKDhOj1JiIxCnwDj7gc0bOzVIKQAqDaItIRgdPH4HUYsGNtAjhHcD8Sd4ugSmwj5gpfDoLW4Nj4FyfTsgapHARyDeQ48Q/glt8CTABEA1WBMwrJy0IEWXFLRqfgZMs8eBbbR917BmuPVQs+jSlpiE7GBYCbDrCgSTYAbdmpfnQUUsBS29A1Az6NoenkiB3v6BaMCDSotLZOgD6dk8EA4GjXHVkaGvFqp3QDqhG9ErEgLgELQNPKC95mwi2wQgNfmDoZt/AYhnEaFuJlTtoBiXAKXLF3jkQXLVg2kgBVQxp+LJnMlA/GEwORgEtkCjHVtS2DbYhqpgIA+I9yHx91Ejo1F7qAoZgLrsQUhFVxCp3Xh6OxjWbLRnoBEYcsOtjKOzSKMOHnXwqIPxAoAAAwDcjqOaDjHgxgAAAABJRU5ErkJggg=="

/***/ }),

/***/ 4:
/*!***************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/pages.json ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 54:
/*!************************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/static/material.png ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMkM0NDVDRkJENzAxMUU4OEFENEYyRkY0NjY3OENBMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMkM0NDVEMEJENzAxMUU4OEFENEYyRkY0NjY3OENBMiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIyQzQ0NUNEQkQ3MDExRTg4QUQ0RjJGRjQ2Njc4Q0EyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIyQzQ0NUNFQkQ3MDExRTg4QUQ0RjJGRjQ2Njc4Q0EyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+MOXwXQAADBtJREFUeNrsXVusXUUZ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"

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@^2.0.0-alpha-24420191128001","_id":"@dcloudio/uni-stat@2.0.0-v3-24020191018001","_inBundle":false,"_integrity":"sha512-nYBm5pRrYzrj2dKMqucWSF2PwInUMnn3MLHM/ik3gnLUEKSW61rzcY1RPlUwaH7c+Snm6N+bAJzmj3GvlrlVXA==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"@dcloudio/uni-stat@^2.0.0-alpha-24420191128001","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"^2.0.0-alpha-24420191128001","saveSpec":null,"fetchSpec":"^2.0.0-alpha-24420191128001"},"_requiredBy":["/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-v3-24020191018001.tgz","_shasum":"6ef04326cc0b945726413eebe442ab8f47c7536c","_spec":"@dcloudio/uni-stat@^2.0.0-alpha-24420191128001","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"197e8df53cc9d4c3f6eb722b918ccf51672b5cfe","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-v3-24020191018001"};

/***/ }),

/***/ 7:
/*!********************************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/pages.json?{"type":"style"} ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "海淀公关", "usingComponents": {} }, "components/online/online": { "navigationBarTitleText": "违法线索举报", "usingComponents": {} }, "components/answer/index": { "navigationBarTitleText": "赛事广场", "usingComponents": {} }, "components/my/index": { "navigationBarTitleText": "个人中心", "usingComponents": {} }, "components/active/index": { "navigationBarTitleText": "精彩活动", "usingComponents": {} }, "components/friend/index": { "navigationBarTitleText": "网友福利", "usingComponents": {} }, "components/online/map": { "navigationBarTitleText": "选择案发地点", "usingComponents": {} }, "components/friend/webview": { "navigationBarTitleText": "", "usingComponents": {} }, "components/my/info": { "navigationBarTitleText": "我的资料", "usingComponents": {} }, "components/my/redPacket": { "navigationBarTitleText": "我的红包", "usingComponents": {} }, "components/my/online": { "navigationBarTitleText": "我的举报", "usingComponents": {} }, "components/my/onlineDetail": { "navigationBarTitleText": "举报详情", "usingComponents": {} }, "components/my/answers": { "navigationBarTitleText": "我的答题", "usingComponents": {} }, "components/my/contest": { "navigationBarTitleText": "我的赛事", "usingComponents": {} }, "components/my/contestDetail": { "navigationBarTitleText": "赛事详情", "usingComponents": {} } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "海淀公安", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!*******************************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/pages.json?{"type":"stat"} ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "" };exports.default = _default;

/***/ }),

/***/ 85:
/*!****************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/gift.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getGiftList = void 0;var _request = _interopRequireDefault(__webpack_require__(/*! ../utils/request */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// export function getGiftList (params) {
//   return request({
//     url: '/welfare',
//     method: 'get',
//     params
//   })
// }
// 网友福利
var getGiftList = function getGiftList(data) {return (0, _request.default)({
    url: "/welfare",
    method: 'GET',
    data: data });};exports.getGiftList = getGiftList;

/***/ }),

/***/ 86:
/*!*********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/utils/request.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _index = __webpack_require__(/*! ../config/index.js */ 88);var _default =

function _default() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { method: 'GET', data: {} };
  // const access_token = uni.getStorageSync('access_token')
  var access_token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaGR6aGFuZHVpLnRqYjJjLmNuL2FwaS90ZXN0X2xvZ2luIiwiaWF0IjoxNTc4MzYyODcxLCJleHAiOjE1ODEzNjI4NzEsIm5iZiI6MTU3ODM2Mjg3MSwianRpIjoiZHM1ZVY5TFdBTU5UTEJQeSIsInN1YiI6NDksInBydiI6IjNkMzY5YTdjNjRkNThiMTdkMGFiYjk4MDY2NTE3Y2I3MDYwZjlkYmYifQ.CdeBVZaktYtYmsnir8YcyBbolJcnXE0Ly8f-BtLtL_s';
  return uni.request({
    url: _index.baseUrl + options.url,
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      Authorization: "Bearer ".concat(access_token) },

    method: options.method.toUpperCase() }).
  then(function (res) {
    console.log(res);var _res$ =
    res[1],statusCode = _res$.statusCode,data = _res$.data,header = _res$.header;

    if (header && header.Authorization) {
      uni.setStorageSync(
      'access_token',
      header.Authorization.split(' ')[1]);

    }

    switch (statusCode) {
      case 401:{
          uni.removeStorageSync('access_token');
          return;
        }
      case 400:{
          if (data.message == '服务器繁忙，请稍候重试') {
            // return uni.redirectTo({
            //   url: `/pages/errorPage/index?code=${statusCode}`
            // })
          }
          break;
        }
      case 500:
      case 404:{
          // return uni.redirectTo({
          //   url: `/pages/errorPage/index?code=${statusCode}`
          // })
        }}


    return data;
  });
};exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 88:
/*!********************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/config/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.baseUrl = void 0; // 请求连接前缀
// 开发者工具勾去不检验合法域名
var baseUrl =
'http://hdzhandui.tjb2c.cn/api';

// 输出日志信息
// export const noConsole = false
exports.baseUrl = baseUrl;

/***/ }),

/***/ 89:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 90:
/*!*******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/store/index.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 89));

var _base = _interopRequireDefault(__webpack_require__(/*! ./modules/base */ 91));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);var _default =
new _vuex.default.Store({
  modules: {
    base: _base.default } });exports.default = _default;

/***/ }),

/***/ 91:
/*!**************************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/store/modules/base.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _base = __webpack_require__(/*! @/api/base */ 92);var _default =




{
  namespaced: true,
  state: {
    hasLogin: false,
    userInfo: {} },

  mutations: {
    login: function login(state, provider) {
      console.log(provider);
      state.hasLogin = true;
      state.userInfo = provider;
      uni.setStorage({ //缓存用户登陆状态
        key: 'userInfo',
        data: provider });

      console.log(state.userInfo);
    },
    logout: function logout(state) {
      state.hasLogin = false;
      state.userInfo = {};
      uni.removeStorage({
        key: 'userInfo' });

    } },

  actions: {
    // 登录
    handleLogin: function handleLogin(_ref, _ref2)






    {var commit = _ref.commit,dispatch = _ref.dispatch;var code = _ref2.code,encryptedData = _ref2.encryptedData,iv = _ref2.iv;
      return new Promise(function (resolve, reject) {
        (0, _base.login)({
          code: code,
          encryptedData: encryptedData,
          iv: iv }).

        then(function (res) {
          if (res) {
            uni.setStorageSync('access_token', res.access_token);
            resolve();
          }
        }).
        catch(function (err) {
          reject(err);
        });
      });
    },
    // 获取用户相关信息
    getUserInfo: function getUserInfo(_ref3)



    {var state = _ref3.state,commit = _ref3.commit,dispatch = _ref3.dispatch;
      return new Promise(function (resolve, reject) {
        try {
          (0, _base.getUserInfo)().
          then(function (res) {
            commit('login', res);
            resolve();
          }).
          catch(function (err) {
            reject(err);
          });
        } catch (error) {
          reject(error);
        }
      });
    } } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 92:
/*!****************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/base.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getUserInfo = exports.login = void 0;var _request = _interopRequireDefault(__webpack_require__(/*! ../utils/request */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var login = function login(data) {return Request({
    url: "/express/login",
    method: 'POST',
    data: data });};exports.login = login;


var getUserInfo = function getUserInfo(data) {return Request({
    url: "/express/depositor/show",
    method: 'GET',
    data: data });};exports.getUserInfo = getUserInfo;

/***/ }),

/***/ 93:
/*!******************************************************************!*\
  !*** C:/Users/86138/Documents/HBuilderProjects/hd/api/online.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.storeOnlineAlarm = storeOnlineAlarm;var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 86));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
// 案发时间
function storeOnlineAlarm(params) {
  return (0, _request.default)({
    url: '/onlinealarm/storeOnlineAlarm',
    method: 'post',
    params: params });

}

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map