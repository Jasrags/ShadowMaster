var mE = { exports: {} }, Zp = {}, yE = { exports: {} }, Rt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var eT;
function tD() {
  if (eT) return Rt;
  eT = 1;
  var F = Symbol.for("react.element"), k = Symbol.for("react.portal"), D = Symbol.for("react.fragment"), we = Symbol.for("react.strict_mode"), oe = Symbol.for("react.profiler"), ye = Symbol.for("react.provider"), g = Symbol.for("react.context"), Oe = Symbol.for("react.forward_ref"), Y = Symbol.for("react.suspense"), Z = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), B = Symbol.iterator;
  function ue(_) {
    return _ === null || typeof _ != "object" ? null : (_ = B && _[B] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var ne = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ie = Object.assign, Me = {};
  function nt(_, I, Ge) {
    this.props = _, this.context = I, this.refs = Me, this.updater = Ge || ne;
  }
  nt.prototype.isReactComponent = {}, nt.prototype.setState = function(_, I) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, I, "setState");
  }, nt.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function tn() {
  }
  tn.prototype = nt.prototype;
  function dt(_, I, Ge) {
    this.props = _, this.context = I, this.refs = Me, this.updater = Ge || ne;
  }
  var Ke = dt.prototype = new tn();
  Ke.constructor = dt, ie(Ke, nt.prototype), Ke.isPureReactComponent = !0;
  var le = Array.isArray, J = Object.prototype.hasOwnProperty, Ne = { current: null }, ve = { key: !0, ref: !0, __self: !0, __source: !0 };
  function pt(_, I, Ge) {
    var Qe, vt = {}, ot = null, lt = null;
    if (I != null) for (Qe in I.ref !== void 0 && (lt = I.ref), I.key !== void 0 && (ot = "" + I.key), I) J.call(I, Qe) && !ve.hasOwnProperty(Qe) && (vt[Qe] = I[Qe]);
    var st = arguments.length - 2;
    if (st === 1) vt.children = Ge;
    else if (1 < st) {
      for (var ht = Array(st), $t = 0; $t < st; $t++) ht[$t] = arguments[$t + 2];
      vt.children = ht;
    }
    if (_ && _.defaultProps) for (Qe in st = _.defaultProps, st) vt[Qe] === void 0 && (vt[Qe] = st[Qe]);
    return { $$typeof: F, type: _, key: ot, ref: lt, props: vt, _owner: Ne.current };
  }
  function Tt(_, I) {
    return { $$typeof: F, type: _.type, key: I, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function Ct(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === F;
  }
  function on(_) {
    var I = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(Ge) {
      return I[Ge];
    });
  }
  var Mt = /\/+/g;
  function Pe(_, I) {
    return typeof _ == "object" && _ !== null && _.key != null ? on("" + _.key) : I.toString(36);
  }
  function Vt(_, I, Ge, Qe, vt) {
    var ot = typeof _;
    (ot === "undefined" || ot === "boolean") && (_ = null);
    var lt = !1;
    if (_ === null) lt = !0;
    else switch (ot) {
      case "string":
      case "number":
        lt = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case F:
          case k:
            lt = !0;
        }
    }
    if (lt) return lt = _, vt = vt(lt), _ = Qe === "" ? "." + Pe(lt, 0) : Qe, le(vt) ? (Ge = "", _ != null && (Ge = _.replace(Mt, "$&/") + "/"), Vt(vt, I, Ge, "", function($t) {
      return $t;
    })) : vt != null && (Ct(vt) && (vt = Tt(vt, Ge + (!vt.key || lt && lt.key === vt.key ? "" : ("" + vt.key).replace(Mt, "$&/") + "/") + _)), I.push(vt)), 1;
    if (lt = 0, Qe = Qe === "" ? "." : Qe + ":", le(_)) for (var st = 0; st < _.length; st++) {
      ot = _[st];
      var ht = Qe + Pe(ot, st);
      lt += Vt(ot, I, Ge, ht, vt);
    }
    else if (ht = ue(_), typeof ht == "function") for (_ = ht.call(_), st = 0; !(ot = _.next()).done; ) ot = ot.value, ht = Qe + Pe(ot, st++), lt += Vt(ot, I, Ge, ht, vt);
    else if (ot === "object") throw I = String(_), Error("Objects are not valid as a React child (found: " + (I === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : I) + "). If you meant to render a collection of children, use an array instead.");
    return lt;
  }
  function Lt(_, I, Ge) {
    if (_ == null) return _;
    var Qe = [], vt = 0;
    return Vt(_, Qe, "", "", function(ot) {
      return I.call(Ge, ot, vt++);
    }), Qe;
  }
  function zt(_) {
    if (_._status === -1) {
      var I = _._result;
      I = I(), I.then(function(Ge) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = Ge);
      }, function(Ge) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = Ge);
      }), _._status === -1 && (_._status = 0, _._result = I);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var Le = { current: null }, ae = { transition: null }, ze = { ReactCurrentDispatcher: Le, ReactCurrentBatchConfig: ae, ReactCurrentOwner: Ne };
  function fe() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Rt.Children = { map: Lt, forEach: function(_, I, Ge) {
    Lt(_, function() {
      I.apply(this, arguments);
    }, Ge);
  }, count: function(_) {
    var I = 0;
    return Lt(_, function() {
      I++;
    }), I;
  }, toArray: function(_) {
    return Lt(_, function(I) {
      return I;
    }) || [];
  }, only: function(_) {
    if (!Ct(_)) throw Error("React.Children.only expected to receive a single React element child.");
    return _;
  } }, Rt.Component = nt, Rt.Fragment = D, Rt.Profiler = oe, Rt.PureComponent = dt, Rt.StrictMode = we, Rt.Suspense = Y, Rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ze, Rt.act = fe, Rt.cloneElement = function(_, I, Ge) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var Qe = ie({}, _.props), vt = _.key, ot = _.ref, lt = _._owner;
    if (I != null) {
      if (I.ref !== void 0 && (ot = I.ref, lt = Ne.current), I.key !== void 0 && (vt = "" + I.key), _.type && _.type.defaultProps) var st = _.type.defaultProps;
      for (ht in I) J.call(I, ht) && !ve.hasOwnProperty(ht) && (Qe[ht] = I[ht] === void 0 && st !== void 0 ? st[ht] : I[ht]);
    }
    var ht = arguments.length - 2;
    if (ht === 1) Qe.children = Ge;
    else if (1 < ht) {
      st = Array(ht);
      for (var $t = 0; $t < ht; $t++) st[$t] = arguments[$t + 2];
      Qe.children = st;
    }
    return { $$typeof: F, type: _.type, key: vt, ref: ot, props: Qe, _owner: lt };
  }, Rt.createContext = function(_) {
    return _ = { $$typeof: g, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: ye, _context: _ }, _.Consumer = _;
  }, Rt.createElement = pt, Rt.createFactory = function(_) {
    var I = pt.bind(null, _);
    return I.type = _, I;
  }, Rt.createRef = function() {
    return { current: null };
  }, Rt.forwardRef = function(_) {
    return { $$typeof: Oe, render: _ };
  }, Rt.isValidElement = Ct, Rt.lazy = function(_) {
    return { $$typeof: Re, _payload: { _status: -1, _result: _ }, _init: zt };
  }, Rt.memo = function(_, I) {
    return { $$typeof: Z, type: _, compare: I === void 0 ? null : I };
  }, Rt.startTransition = function(_) {
    var I = ae.transition;
    ae.transition = {};
    try {
      _();
    } finally {
      ae.transition = I;
    }
  }, Rt.unstable_act = fe, Rt.useCallback = function(_, I) {
    return Le.current.useCallback(_, I);
  }, Rt.useContext = function(_) {
    return Le.current.useContext(_);
  }, Rt.useDebugValue = function() {
  }, Rt.useDeferredValue = function(_) {
    return Le.current.useDeferredValue(_);
  }, Rt.useEffect = function(_, I) {
    return Le.current.useEffect(_, I);
  }, Rt.useId = function() {
    return Le.current.useId();
  }, Rt.useImperativeHandle = function(_, I, Ge) {
    return Le.current.useImperativeHandle(_, I, Ge);
  }, Rt.useInsertionEffect = function(_, I) {
    return Le.current.useInsertionEffect(_, I);
  }, Rt.useLayoutEffect = function(_, I) {
    return Le.current.useLayoutEffect(_, I);
  }, Rt.useMemo = function(_, I) {
    return Le.current.useMemo(_, I);
  }, Rt.useReducer = function(_, I, Ge) {
    return Le.current.useReducer(_, I, Ge);
  }, Rt.useRef = function(_) {
    return Le.current.useRef(_);
  }, Rt.useState = function(_) {
    return Le.current.useState(_);
  }, Rt.useSyncExternalStore = function(_, I, Ge) {
    return Le.current.useSyncExternalStore(_, I, Ge);
  }, Rt.useTransition = function() {
    return Le.current.useTransition();
  }, Rt.version = "18.3.1", Rt;
}
var ev = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
ev.exports;
var tT;
function nD() {
  return tT || (tT = 1, function(F, k) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var D = "18.3.1", we = Symbol.for("react.element"), oe = Symbol.for("react.portal"), ye = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), Oe = Symbol.for("react.profiler"), Y = Symbol.for("react.provider"), Z = Symbol.for("react.context"), Re = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), ue = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), Me = Symbol.for("react.offscreen"), nt = Symbol.iterator, tn = "@@iterator";
      function dt(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = nt && h[nt] || h[tn];
        return typeof C == "function" ? C : null;
      }
      var Ke = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, le = {
        transition: null
      }, J = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Ne = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ve = {}, pt = null;
      function Tt(h) {
        pt = h;
      }
      ve.setExtraStackFrame = function(h) {
        pt = h;
      }, ve.getCurrentStack = null, ve.getStackAddendum = function() {
        var h = "";
        pt && (h += pt);
        var C = ve.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var Ct = !1, on = !1, Mt = !1, Pe = !1, Vt = !1, Lt = {
        ReactCurrentDispatcher: Ke,
        ReactCurrentBatchConfig: le,
        ReactCurrentOwner: Ne
      };
      Lt.ReactDebugCurrentFrame = ve, Lt.ReactCurrentActQueue = J;
      function zt(h) {
        {
          for (var C = arguments.length, A = new Array(C > 1 ? C - 1 : 0), H = 1; H < C; H++)
            A[H - 1] = arguments[H];
          ae("warn", h, A);
        }
      }
      function Le(h) {
        {
          for (var C = arguments.length, A = new Array(C > 1 ? C - 1 : 0), H = 1; H < C; H++)
            A[H - 1] = arguments[H];
          ae("error", h, A);
        }
      }
      function ae(h, C, A) {
        {
          var H = Lt.ReactDebugCurrentFrame, re = H.getStackAddendum();
          re !== "" && (C += "%s", A = A.concat([re]));
          var Ve = A.map(function(de) {
            return String(de);
          });
          Ve.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Ve);
        }
      }
      var ze = {};
      function fe(h, C) {
        {
          var A = h.constructor, H = A && (A.displayName || A.name) || "ReactClass", re = H + "." + C;
          if (ze[re])
            return;
          Le("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, H), ze[re] = !0;
        }
      }
      var _ = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(h) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(h, C, A) {
          fe(h, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(h, C, A, H) {
          fe(h, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(h, C, A, H) {
          fe(h, "setState");
        }
      }, I = Object.assign, Ge = {};
      Object.freeze(Ge);
      function Qe(h, C, A) {
        this.props = h, this.context = C, this.refs = Ge, this.updater = A || _;
      }
      Qe.prototype.isReactComponent = {}, Qe.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, Qe.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var vt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, ot = function(h, C) {
          Object.defineProperty(Qe.prototype, h, {
            get: function() {
              zt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var lt in vt)
          vt.hasOwnProperty(lt) && ot(lt, vt[lt]);
      }
      function st() {
      }
      st.prototype = Qe.prototype;
      function ht(h, C, A) {
        this.props = h, this.context = C, this.refs = Ge, this.updater = A || _;
      }
      var $t = ht.prototype = new st();
      $t.constructor = ht, I($t, Qe.prototype), $t.isPureReactComponent = !0;
      function Mn() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var br = Array.isArray;
      function Rn(h) {
        return br(h);
      }
      function rr(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, A = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return A;
        }
      }
      function Bn(h) {
        try {
          return In(h), !1;
        } catch {
          return !0;
        }
      }
      function In(h) {
        return "" + h;
      }
      function $r(h) {
        if (Bn(h))
          return Le("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rr(h)), In(h);
      }
      function ci(h, C, A) {
        var H = h.displayName;
        if (H)
          return H;
        var re = C.displayName || C.name || "";
        return re !== "" ? A + "(" + re + ")" : A;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Le("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case ye:
            return "Fragment";
          case oe:
            return "Portal";
          case Oe:
            return "Profiler";
          case g:
            return "StrictMode";
          case B:
            return "Suspense";
          case ue:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Z:
              var C = h;
              return sa(C) + ".Consumer";
            case Y:
              var A = h;
              return sa(A._context) + ".Provider";
            case Re:
              return ci(h, h.render, "ForwardRef");
            case ne:
              var H = h.displayName || null;
              return H !== null ? H : Kn(h.type) || "Memo";
            case ie: {
              var re = h, Ve = re._payload, de = re._init;
              try {
                return Kn(de(Ve));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Tn = Object.prototype.hasOwnProperty, Yn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Sr, $a, Ln;
      Ln = {};
      function Er(h) {
        if (Tn.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (Tn.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function Qa(h, C) {
        var A = function() {
          Sr || (Sr = !0, Le("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        A.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: A,
          configurable: !0
        });
      }
      function fi(h, C) {
        var A = function() {
          $a || ($a = !0, Le("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        A.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: A,
          configurable: !0
        });
      }
      function se(h) {
        if (typeof h.ref == "string" && Ne.current && h.__self && Ne.current.stateNode !== h.__self) {
          var C = Kn(Ne.current.type);
          Ln[C] || (Le('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Ln[C] = !0);
        }
      }
      var Ae = function(h, C, A, H, re, Ve, de) {
        var Ye = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: we,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: A,
          props: de,
          // Record the component responsible for creating this element.
          _owner: Ve
        };
        return Ye._store = {}, Object.defineProperty(Ye._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Ye, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: H
        }), Object.defineProperty(Ye, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: re
        }), Object.freeze && (Object.freeze(Ye.props), Object.freeze(Ye)), Ye;
      };
      function ct(h, C, A) {
        var H, re = {}, Ve = null, de = null, Ye = null, St = null;
        if (C != null) {
          Er(C) && (de = C.ref, se(C)), ca(C) && ($r(C.key), Ve = "" + C.key), Ye = C.__self === void 0 ? null : C.__self, St = C.__source === void 0 ? null : C.__source;
          for (H in C)
            Tn.call(C, H) && !Yn.hasOwnProperty(H) && (re[H] = C[H]);
        }
        var Ot = arguments.length - 2;
        if (Ot === 1)
          re.children = A;
        else if (Ot > 1) {
          for (var ln = Array(Ot), qt = 0; qt < Ot; qt++)
            ln[qt] = arguments[qt + 2];
          Object.freeze && Object.freeze(ln), re.children = ln;
        }
        if (h && h.defaultProps) {
          var ft = h.defaultProps;
          for (H in ft)
            re[H] === void 0 && (re[H] = ft[H]);
        }
        if (Ve || de) {
          var Kt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Ve && Qa(re, Kt), de && fi(re, Kt);
        }
        return Ae(h, Ve, de, Ye, St, Ne.current, re);
      }
      function Bt(h, C) {
        var A = Ae(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return A;
      }
      function nn(h, C, A) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var H, re = I({}, h.props), Ve = h.key, de = h.ref, Ye = h._self, St = h._source, Ot = h._owner;
        if (C != null) {
          Er(C) && (de = C.ref, Ot = Ne.current), ca(C) && ($r(C.key), Ve = "" + C.key);
          var ln;
          h.type && h.type.defaultProps && (ln = h.type.defaultProps);
          for (H in C)
            Tn.call(C, H) && !Yn.hasOwnProperty(H) && (C[H] === void 0 && ln !== void 0 ? re[H] = ln[H] : re[H] = C[H]);
        }
        var qt = arguments.length - 2;
        if (qt === 1)
          re.children = A;
        else if (qt > 1) {
          for (var ft = Array(qt), Kt = 0; Kt < qt; Kt++)
            ft[Kt] = arguments[Kt + 2];
          re.children = ft;
        }
        return Ae(h.type, Ve, de, Ye, St, Ot, re);
      }
      function hn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === we;
      }
      var sn = ".", Xn = ":";
      function rn(h) {
        var C = /[=:]/g, A = {
          "=": "=0",
          ":": "=2"
        }, H = h.replace(C, function(re) {
          return A[re];
        });
        return "$" + H;
      }
      var Qt = !1, Wt = /\/+/g;
      function fa(h) {
        return h.replace(Wt, "$&/");
      }
      function Cr(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), rn("" + h.key)) : C.toString(36);
      }
      function xa(h, C, A, H, re) {
        var Ve = typeof h;
        (Ve === "undefined" || Ve === "boolean") && (h = null);
        var de = !1;
        if (h === null)
          de = !0;
        else
          switch (Ve) {
            case "string":
            case "number":
              de = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case we:
                case oe:
                  de = !0;
              }
          }
        if (de) {
          var Ye = h, St = re(Ye), Ot = H === "" ? sn + Cr(Ye, 0) : H;
          if (Rn(St)) {
            var ln = "";
            Ot != null && (ln = fa(Ot) + "/"), xa(St, C, ln, "", function(Kf) {
              return Kf;
            });
          } else St != null && (hn(St) && (St.key && (!Ye || Ye.key !== St.key) && $r(St.key), St = Bt(
            St,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            A + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (St.key && (!Ye || Ye.key !== St.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + St.key) + "/"
            ) : "") + Ot
          )), C.push(St));
          return 1;
        }
        var qt, ft, Kt = 0, mn = H === "" ? sn : H + Xn;
        if (Rn(h))
          for (var Rl = 0; Rl < h.length; Rl++)
            qt = h[Rl], ft = mn + Cr(qt, Rl), Kt += xa(qt, C, A, ft, re);
        else {
          var qo = dt(h);
          if (typeof qo == "function") {
            var Bi = h;
            qo === Bi.entries && (Qt || zt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Qt = !0);
            for (var Ko = qo.call(Bi), ou, qf = 0; !(ou = Ko.next()).done; )
              qt = ou.value, ft = mn + Cr(qt, qf++), Kt += xa(qt, C, A, ft, re);
          } else if (Ve === "object") {
            var oc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (oc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : oc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Kt;
      }
      function Hi(h, C, A) {
        if (h == null)
          return h;
        var H = [], re = 0;
        return xa(h, H, "", "", function(Ve) {
          return C.call(A, Ve, re++);
        }), H;
      }
      function Jl(h) {
        var C = 0;
        return Hi(h, function() {
          C++;
        }), C;
      }
      function eu(h, C, A) {
        Hi(h, function() {
          C.apply(this, arguments);
        }, A);
      }
      function pl(h) {
        return Hi(h, function(C) {
          return C;
        }) || [];
      }
      function vl(h) {
        if (!hn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function tu(h) {
        var C = {
          $$typeof: Z,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: h,
          _currentValue2: h,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        C.Provider = {
          $$typeof: Y,
          _context: C
        };
        var A = !1, H = !1, re = !1;
        {
          var Ve = {
            $$typeof: Z,
            _context: C
          };
          Object.defineProperties(Ve, {
            Provider: {
              get: function() {
                return H || (H = !0, Le("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(de) {
                C.Provider = de;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(de) {
                C._currentValue = de;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(de) {
                C._currentValue2 = de;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(de) {
                C._threadCount = de;
              }
            },
            Consumer: {
              get: function() {
                return A || (A = !0, Le("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(de) {
                re || (zt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", de), re = !0);
              }
            }
          }), C.Consumer = Ve;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var _r = -1, Dr = 0, ar = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var C = h._result, A = C();
          if (A.then(function(Ve) {
            if (h._status === Dr || h._status === _r) {
              var de = h;
              de._status = ar, de._result = Ve;
            }
          }, function(Ve) {
            if (h._status === Dr || h._status === _r) {
              var de = h;
              de._status = di, de._result = Ve;
            }
          }), h._status === _r) {
            var H = h;
            H._status = Dr, H._result = A;
          }
        }
        if (h._status === ar) {
          var re = h._result;
          return re === void 0 && Le(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, re), "default" in re || Le(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, re), re.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, A = {
          $$typeof: ie,
          _payload: C,
          _init: Wa
        };
        {
          var H, re;
          Object.defineProperties(A, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return H;
              },
              set: function(Ve) {
                Le("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), H = Ve, Object.defineProperty(A, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return re;
              },
              set: function(Ve) {
                Le("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), re = Ve, Object.defineProperty(A, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return A;
      }
      function vi(h) {
        h != null && h.$$typeof === ne ? Le("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Le("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Le("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Le("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: Re,
          render: h
        };
        {
          var A;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return A;
            },
            set: function(H) {
              A = H, !h.name && !h.displayName && (h.displayName = H);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function W(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === ye || h === Oe || Vt || h === g || h === B || h === ue || Pe || h === Me || Ct || on || Mt || typeof h == "object" && h !== null && (h.$$typeof === ie || h.$$typeof === ne || h.$$typeof === Y || h.$$typeof === Z || h.$$typeof === Re || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function pe(h, C) {
        W(h) || Le("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var A = {
          $$typeof: ne,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var H;
          Object.defineProperty(A, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return H;
            },
            set: function(re) {
              H = re, !h.name && !h.displayName && (h.displayName = re);
            }
          });
        }
        return A;
      }
      function xe() {
        var h = Ke.current;
        return h === null && Le(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function rt(h) {
        var C = xe();
        if (h._context !== void 0) {
          var A = h._context;
          A.Consumer === h ? Le("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : A.Provider === h && Le("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function Je(h) {
        var C = xe();
        return C.useState(h);
      }
      function gt(h, C, A) {
        var H = xe();
        return H.useReducer(h, C, A);
      }
      function mt(h) {
        var C = xe();
        return C.useRef(h);
      }
      function xn(h, C) {
        var A = xe();
        return A.useEffect(h, C);
      }
      function an(h, C) {
        var A = xe();
        return A.useInsertionEffect(h, C);
      }
      function cn(h, C) {
        var A = xe();
        return A.useLayoutEffect(h, C);
      }
      function ir(h, C) {
        var A = xe();
        return A.useCallback(h, C);
      }
      function Ga(h, C) {
        var A = xe();
        return A.useMemo(h, C);
      }
      function qa(h, C, A) {
        var H = xe();
        return H.useImperativeHandle(h, C, A);
      }
      function at(h, C) {
        {
          var A = xe();
          return A.useDebugValue(h, C);
        }
      }
      function ut() {
        var h = xe();
        return h.useTransition();
      }
      function Ka(h) {
        var C = xe();
        return C.useDeferredValue(h);
      }
      function nu() {
        var h = xe();
        return h.useId();
      }
      function ru(h, C, A) {
        var H = xe();
        return H.useSyncExternalStore(h, C, A);
      }
      var hl = 0, Wu, ml, Qr, $o, kr, lc, uc;
      function Gu() {
      }
      Gu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Wu = console.log, ml = console.info, Qr = console.warn, $o = console.error, kr = console.group, lc = console.groupCollapsed, uc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Gu,
              writable: !0
            };
            Object.defineProperties(console, {
              info: h,
              log: h,
              warn: h,
              error: h,
              group: h,
              groupCollapsed: h,
              groupEnd: h
            });
          }
          hl++;
        }
      }
      function da() {
        {
          if (hl--, hl === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: I({}, h, {
                value: Wu
              }),
              info: I({}, h, {
                value: ml
              }),
              warn: I({}, h, {
                value: Qr
              }),
              error: I({}, h, {
                value: $o
              }),
              group: I({}, h, {
                value: kr
              }),
              groupCollapsed: I({}, h, {
                value: lc
              }),
              groupEnd: I({}, h, {
                value: uc
              })
            });
          }
          hl < 0 && Le("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = Lt.ReactCurrentDispatcher, Za;
      function qu(h, C, A) {
        {
          if (Za === void 0)
            try {
              throw Error();
            } catch (re) {
              var H = re.stack.trim().match(/\n( *(at )?)/);
              Za = H && H[1] || "";
            }
          return `
` + Za + h;
        }
      }
      var au = !1, gl;
      {
        var Ku = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Ku();
      }
      function Xu(h, C) {
        if (!h || au)
          return "";
        {
          var A = gl.get(h);
          if (A !== void 0)
            return A;
        }
        var H;
        au = !0;
        var re = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ve;
        Ve = Xa.current, Xa.current = null, yl();
        try {
          if (C) {
            var de = function() {
              throw Error();
            };
            if (Object.defineProperty(de.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(de, []);
              } catch (mn) {
                H = mn;
              }
              Reflect.construct(h, [], de);
            } else {
              try {
                de.call();
              } catch (mn) {
                H = mn;
              }
              h.call(de.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (mn) {
              H = mn;
            }
            h();
          }
        } catch (mn) {
          if (mn && H && typeof mn.stack == "string") {
            for (var Ye = mn.stack.split(`
`), St = H.stack.split(`
`), Ot = Ye.length - 1, ln = St.length - 1; Ot >= 1 && ln >= 0 && Ye[Ot] !== St[ln]; )
              ln--;
            for (; Ot >= 1 && ln >= 0; Ot--, ln--)
              if (Ye[Ot] !== St[ln]) {
                if (Ot !== 1 || ln !== 1)
                  do
                    if (Ot--, ln--, ln < 0 || Ye[Ot] !== St[ln]) {
                      var qt = `
` + Ye[Ot].replace(" at new ", " at ");
                      return h.displayName && qt.includes("<anonymous>") && (qt = qt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, qt), qt;
                    }
                  while (Ot >= 1 && ln >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = Ve, da(), Error.prepareStackTrace = re;
        }
        var ft = h ? h.displayName || h.name : "", Kt = ft ? qu(ft) : "";
        return typeof h == "function" && gl.set(h, Kt), Kt;
      }
      function Pi(h, C, A) {
        return Xu(h, !1);
      }
      function Wf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, A) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Xu(h, Wf(h));
        if (typeof h == "string")
          return qu(h);
        switch (h) {
          case B:
            return qu("Suspense");
          case ue:
            return qu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Re:
              return Pi(h.render);
            case ne:
              return Vi(h.type, C, A);
            case ie: {
              var H = h, re = H._payload, Ve = H._init;
              try {
                return Vi(Ve(re), C, A);
              } catch {
              }
            }
          }
        return "";
      }
      var At = {}, Zu = Lt.ReactDebugCurrentFrame;
      function kt(h) {
        if (h) {
          var C = h._owner, A = Vi(h.type, h._source, C ? C.type : null);
          Zu.setExtraStackFrame(A);
        } else
          Zu.setExtraStackFrame(null);
      }
      function Qo(h, C, A, H, re) {
        {
          var Ve = Function.call.bind(Tn);
          for (var de in h)
            if (Ve(h, de)) {
              var Ye = void 0;
              try {
                if (typeof h[de] != "function") {
                  var St = Error((H || "React class") + ": " + A + " type `" + de + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[de] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw St.name = "Invariant Violation", St;
                }
                Ye = h[de](C, de, H, A, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Ot) {
                Ye = Ot;
              }
              Ye && !(Ye instanceof Error) && (kt(re), Le("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", H || "React class", A, de, typeof Ye), kt(null)), Ye instanceof Error && !(Ye.message in At) && (At[Ye.message] = !0, kt(re), Le("Failed %s type: %s", A, Ye.message), kt(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, A = Vi(h.type, h._source, C ? C.type : null);
          Tt(A);
        } else
          Tt(null);
      }
      var Ze;
      Ze = !1;
      function Ju() {
        if (Ne.current) {
          var h = Kn(Ne.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function lr(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), A = h.lineNumber;
          return `

Check your code at ` + C + ":" + A + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? lr(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var C = Ju();
        if (!C) {
          var A = typeof h == "string" ? h : h.displayName || h.name;
          A && (C = `

Check the top-level render call using <` + A + ">.");
        }
        return C;
      }
      function fn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var A = yi(C);
          if (!Or[A]) {
            Or[A] = !0;
            var H = "";
            h && h._owner && h._owner !== Ne.current && (H = " It was passed a child from " + Kn(h._owner.type) + "."), hi(h), Le('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', A, H), hi(null);
          }
        }
      }
      function Gt(h, C) {
        if (typeof h == "object") {
          if (Rn(h))
            for (var A = 0; A < h.length; A++) {
              var H = h[A];
              hn(H) && fn(H, C);
            }
          else if (hn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var re = dt(h);
            if (typeof re == "function" && re !== h.entries)
              for (var Ve = re.call(h), de; !(de = Ve.next()).done; )
                hn(de.value) && fn(de.value, C);
          }
        }
      }
      function Sl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var A;
          if (typeof C == "function")
            A = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === Re || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ne))
            A = C.propTypes;
          else
            return;
          if (A) {
            var H = Kn(C);
            Qo(A, h.props, "prop", H, h);
          } else if (C.PropTypes !== void 0 && !Ze) {
            Ze = !0;
            var re = Kn(C);
            Le("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", re || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Le("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function $n(h) {
        {
          for (var C = Object.keys(h.props), A = 0; A < C.length; A++) {
            var H = C[A];
            if (H !== "children" && H !== "key") {
              hi(h), Le("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", H), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Le("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Mr(h, C, A) {
        var H = W(h);
        if (!H) {
          var re = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (re += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ve = mi(C);
          Ve ? re += Ve : re += Ju();
          var de;
          h === null ? de = "null" : Rn(h) ? de = "array" : h !== void 0 && h.$$typeof === we ? (de = "<" + (Kn(h.type) || "Unknown") + " />", re = " Did you accidentally export a JSX literal instead of a component?") : de = typeof h, Le("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", de, re);
        }
        var Ye = ct.apply(this, arguments);
        if (Ye == null)
          return Ye;
        if (H)
          for (var St = 2; St < arguments.length; St++)
            Gt(arguments[St], h);
        return h === ye ? $n(Ye) : Sl(Ye), Ye;
      }
      var wa = !1;
      function iu(h) {
        var C = Mr.bind(null, h);
        return C.type = h, wa || (wa = !0, zt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return zt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Wo(h, C, A) {
        for (var H = nn.apply(this, arguments), re = 2; re < arguments.length; re++)
          Gt(arguments[re], H.type);
        return Sl(H), H;
      }
      function Go(h, C) {
        var A = le.transition;
        le.transition = {};
        var H = le.transition;
        le.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (le.transition = A, A === null && H._updatedFibers) {
            var re = H._updatedFibers.size;
            re > 10 && zt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), H._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function Gf(h) {
        if (lu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), A = F && F[C];
            lu = A.call(F, "timers").setImmediate;
          } catch {
            lu = function(re) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && Le("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ve = new MessageChannel();
              Ve.port1.onmessage = re, Ve.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var ba = 0, Ja = !1;
      function gi(h) {
        {
          var C = ba;
          ba++, J.current === null && (J.current = []);
          var A = J.isBatchingLegacy, H;
          try {
            if (J.isBatchingLegacy = !0, H = h(), !A && J.didScheduleLegacyUpdate) {
              var re = J.current;
              re !== null && (J.didScheduleLegacyUpdate = !1, Cl(re));
            }
          } catch (ft) {
            throw _a(C), ft;
          } finally {
            J.isBatchingLegacy = A;
          }
          if (H !== null && typeof H == "object" && typeof H.then == "function") {
            var Ve = H, de = !1, Ye = {
              then: function(ft, Kt) {
                de = !0, Ve.then(function(mn) {
                  _a(C), ba === 0 ? eo(mn, ft, Kt) : ft(mn);
                }, function(mn) {
                  _a(C), Kt(mn);
                });
              }
            };
            return !Ja && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              de || (Ja = !0, Le("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Ye;
          } else {
            var St = H;
            if (_a(C), ba === 0) {
              var Ot = J.current;
              Ot !== null && (Cl(Ot), J.current = null);
              var ln = {
                then: function(ft, Kt) {
                  J.current === null ? (J.current = [], eo(St, ft, Kt)) : ft(St);
                }
              };
              return ln;
            } else {
              var qt = {
                then: function(ft, Kt) {
                  ft(St);
                }
              };
              return qt;
            }
          }
        }
      }
      function _a(h) {
        h !== ba - 1 && Le("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function eo(h, C, A) {
        {
          var H = J.current;
          if (H !== null)
            try {
              Cl(H), Gf(function() {
                H.length === 0 ? (J.current = null, C(h)) : eo(h, C, A);
              });
            } catch (re) {
              A(re);
            }
          else
            C(h);
        }
      }
      var to = !1;
      function Cl(h) {
        if (!to) {
          to = !0;
          var C = 0;
          try {
            for (; C < h.length; C++) {
              var A = h[C];
              do
                A = A(!0);
              while (A !== null);
            }
            h.length = 0;
          } catch (H) {
            throw h = h.slice(C + 1), H;
          } finally {
            to = !1;
          }
        }
      }
      var uu = Mr, no = Wo, ro = iu, ei = {
        map: Hi,
        forEach: eu,
        count: Jl,
        toArray: pl,
        only: vl
      };
      k.Children = ei, k.Component = Qe, k.Fragment = ye, k.Profiler = Oe, k.PureComponent = ht, k.StrictMode = g, k.Suspense = B, k.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Lt, k.act = gi, k.cloneElement = no, k.createContext = tu, k.createElement = uu, k.createFactory = ro, k.createRef = Mn, k.forwardRef = vi, k.isValidElement = hn, k.lazy = pi, k.memo = pe, k.startTransition = Go, k.unstable_act = gi, k.useCallback = ir, k.useContext = rt, k.useDebugValue = at, k.useDeferredValue = Ka, k.useEffect = xn, k.useId = nu, k.useImperativeHandle = qa, k.useInsertionEffect = an, k.useLayoutEffect = cn, k.useMemo = Ga, k.useReducer = gt, k.useRef = mt, k.useState = Je, k.useSyncExternalStore = ru, k.useTransition = ut, k.version = D, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(ev, ev.exports)), ev.exports;
}
process.env.NODE_ENV === "production" ? yE.exports = tD() : yE.exports = nD();
var Dt = yE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nT;
function rD() {
  if (nT) return Zp;
  nT = 1;
  var F = Dt, k = Symbol.for("react.element"), D = Symbol.for("react.fragment"), we = Object.prototype.hasOwnProperty, oe = F.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, ye = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(Oe, Y, Z) {
    var Re, B = {}, ue = null, ne = null;
    Z !== void 0 && (ue = "" + Z), Y.key !== void 0 && (ue = "" + Y.key), Y.ref !== void 0 && (ne = Y.ref);
    for (Re in Y) we.call(Y, Re) && !ye.hasOwnProperty(Re) && (B[Re] = Y[Re]);
    if (Oe && Oe.defaultProps) for (Re in Y = Oe.defaultProps, Y) B[Re] === void 0 && (B[Re] = Y[Re]);
    return { $$typeof: k, type: Oe, key: ue, ref: ne, props: B, _owner: oe.current };
  }
  return Zp.Fragment = D, Zp.jsx = g, Zp.jsxs = g, Zp;
}
var Jp = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rT;
function aD() {
  return rT || (rT = 1, process.env.NODE_ENV !== "production" && function() {
    var F = Dt, k = Symbol.for("react.element"), D = Symbol.for("react.portal"), we = Symbol.for("react.fragment"), oe = Symbol.for("react.strict_mode"), ye = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), Oe = Symbol.for("react.context"), Y = Symbol.for("react.forward_ref"), Z = Symbol.for("react.suspense"), Re = Symbol.for("react.suspense_list"), B = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), ne = Symbol.for("react.offscreen"), ie = Symbol.iterator, Me = "@@iterator";
    function nt(R) {
      if (R === null || typeof R != "object")
        return null;
      var W = ie && R[ie] || R[Me];
      return typeof W == "function" ? W : null;
    }
    var tn = F.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function dt(R) {
      {
        for (var W = arguments.length, pe = new Array(W > 1 ? W - 1 : 0), xe = 1; xe < W; xe++)
          pe[xe - 1] = arguments[xe];
        Ke("error", R, pe);
      }
    }
    function Ke(R, W, pe) {
      {
        var xe = tn.ReactDebugCurrentFrame, rt = xe.getStackAddendum();
        rt !== "" && (W += "%s", pe = pe.concat([rt]));
        var Je = pe.map(function(gt) {
          return String(gt);
        });
        Je.unshift("Warning: " + W), Function.prototype.apply.call(console[R], console, Je);
      }
    }
    var le = !1, J = !1, Ne = !1, ve = !1, pt = !1, Tt;
    Tt = Symbol.for("react.module.reference");
    function Ct(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === we || R === ye || pt || R === oe || R === Z || R === Re || ve || R === ne || le || J || Ne || typeof R == "object" && R !== null && (R.$$typeof === ue || R.$$typeof === B || R.$$typeof === g || R.$$typeof === Oe || R.$$typeof === Y || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Tt || R.getModuleId !== void 0));
    }
    function on(R, W, pe) {
      var xe = R.displayName;
      if (xe)
        return xe;
      var rt = W.displayName || W.name || "";
      return rt !== "" ? pe + "(" + rt + ")" : pe;
    }
    function Mt(R) {
      return R.displayName || "Context";
    }
    function Pe(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && dt("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case we:
          return "Fragment";
        case D:
          return "Portal";
        case ye:
          return "Profiler";
        case oe:
          return "StrictMode";
        case Z:
          return "Suspense";
        case Re:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Oe:
            var W = R;
            return Mt(W) + ".Consumer";
          case g:
            var pe = R;
            return Mt(pe._context) + ".Provider";
          case Y:
            return on(R, R.render, "ForwardRef");
          case B:
            var xe = R.displayName || null;
            return xe !== null ? xe : Pe(R.type) || "Memo";
          case ue: {
            var rt = R, Je = rt._payload, gt = rt._init;
            try {
              return Pe(gt(Je));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Vt = Object.assign, Lt = 0, zt, Le, ae, ze, fe, _, I;
    function Ge() {
    }
    Ge.__reactDisabledLog = !0;
    function Qe() {
      {
        if (Lt === 0) {
          zt = console.log, Le = console.info, ae = console.warn, ze = console.error, fe = console.group, _ = console.groupCollapsed, I = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Ge,
            writable: !0
          };
          Object.defineProperties(console, {
            info: R,
            log: R,
            warn: R,
            error: R,
            group: R,
            groupCollapsed: R,
            groupEnd: R
          });
        }
        Lt++;
      }
    }
    function vt() {
      {
        if (Lt--, Lt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Vt({}, R, {
              value: zt
            }),
            info: Vt({}, R, {
              value: Le
            }),
            warn: Vt({}, R, {
              value: ae
            }),
            error: Vt({}, R, {
              value: ze
            }),
            group: Vt({}, R, {
              value: fe
            }),
            groupCollapsed: Vt({}, R, {
              value: _
            }),
            groupEnd: Vt({}, R, {
              value: I
            })
          });
        }
        Lt < 0 && dt("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ot = tn.ReactCurrentDispatcher, lt;
    function st(R, W, pe) {
      {
        if (lt === void 0)
          try {
            throw Error();
          } catch (rt) {
            var xe = rt.stack.trim().match(/\n( *(at )?)/);
            lt = xe && xe[1] || "";
          }
        return `
` + lt + R;
      }
    }
    var ht = !1, $t;
    {
      var Mn = typeof WeakMap == "function" ? WeakMap : Map;
      $t = new Mn();
    }
    function br(R, W) {
      if (!R || ht)
        return "";
      {
        var pe = $t.get(R);
        if (pe !== void 0)
          return pe;
      }
      var xe;
      ht = !0;
      var rt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Je;
      Je = ot.current, ot.current = null, Qe();
      try {
        if (W) {
          var gt = function() {
            throw Error();
          };
          if (Object.defineProperty(gt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(gt, []);
            } catch (at) {
              xe = at;
            }
            Reflect.construct(R, [], gt);
          } else {
            try {
              gt.call();
            } catch (at) {
              xe = at;
            }
            R.call(gt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (at) {
            xe = at;
          }
          R();
        }
      } catch (at) {
        if (at && xe && typeof at.stack == "string") {
          for (var mt = at.stack.split(`
`), xn = xe.stack.split(`
`), an = mt.length - 1, cn = xn.length - 1; an >= 1 && cn >= 0 && mt[an] !== xn[cn]; )
            cn--;
          for (; an >= 1 && cn >= 0; an--, cn--)
            if (mt[an] !== xn[cn]) {
              if (an !== 1 || cn !== 1)
                do
                  if (an--, cn--, cn < 0 || mt[an] !== xn[cn]) {
                    var ir = `
` + mt[an].replace(" at new ", " at ");
                    return R.displayName && ir.includes("<anonymous>") && (ir = ir.replace("<anonymous>", R.displayName)), typeof R == "function" && $t.set(R, ir), ir;
                  }
                while (an >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        ht = !1, ot.current = Je, vt(), Error.prepareStackTrace = rt;
      }
      var Ga = R ? R.displayName || R.name : "", qa = Ga ? st(Ga) : "";
      return typeof R == "function" && $t.set(R, qa), qa;
    }
    function Rn(R, W, pe) {
      return br(R, !1);
    }
    function rr(R) {
      var W = R.prototype;
      return !!(W && W.isReactComponent);
    }
    function Bn(R, W, pe) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return br(R, rr(R));
      if (typeof R == "string")
        return st(R);
      switch (R) {
        case Z:
          return st("Suspense");
        case Re:
          return st("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Y:
            return Rn(R.render);
          case B:
            return Bn(R.type, W, pe);
          case ue: {
            var xe = R, rt = xe._payload, Je = xe._init;
            try {
              return Bn(Je(rt), W, pe);
            } catch {
            }
          }
        }
      return "";
    }
    var In = Object.prototype.hasOwnProperty, $r = {}, ci = tn.ReactDebugCurrentFrame;
    function sa(R) {
      if (R) {
        var W = R._owner, pe = Bn(R.type, R._source, W ? W.type : null);
        ci.setExtraStackFrame(pe);
      } else
        ci.setExtraStackFrame(null);
    }
    function Kn(R, W, pe, xe, rt) {
      {
        var Je = Function.call.bind(In);
        for (var gt in R)
          if (Je(R, gt)) {
            var mt = void 0;
            try {
              if (typeof R[gt] != "function") {
                var xn = Error((xe || "React class") + ": " + pe + " type `" + gt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[gt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw xn.name = "Invariant Violation", xn;
              }
              mt = R[gt](W, gt, xe, pe, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (an) {
              mt = an;
            }
            mt && !(mt instanceof Error) && (sa(rt), dt("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", xe || "React class", pe, gt, typeof mt), sa(null)), mt instanceof Error && !(mt.message in $r) && ($r[mt.message] = !0, sa(rt), dt("Failed %s type: %s", pe, mt.message), sa(null));
          }
      }
    }
    var Tn = Array.isArray;
    function Yn(R) {
      return Tn(R);
    }
    function Sr(R) {
      {
        var W = typeof Symbol == "function" && Symbol.toStringTag, pe = W && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return pe;
      }
    }
    function $a(R) {
      try {
        return Ln(R), !1;
      } catch {
        return !0;
      }
    }
    function Ln(R) {
      return "" + R;
    }
    function Er(R) {
      if ($a(R))
        return dt("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Sr(R)), Ln(R);
    }
    var ca = tn.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, se;
    function Ae(R) {
      if (In.call(R, "ref")) {
        var W = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (W && W.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function ct(R) {
      if (In.call(R, "key")) {
        var W = Object.getOwnPropertyDescriptor(R, "key").get;
        if (W && W.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Bt(R, W) {
      typeof R.ref == "string" && ca.current;
    }
    function nn(R, W) {
      {
        var pe = function() {
          fi || (fi = !0, dt("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", W));
        };
        pe.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: pe,
          configurable: !0
        });
      }
    }
    function hn(R, W) {
      {
        var pe = function() {
          se || (se = !0, dt("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", W));
        };
        pe.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: pe,
          configurable: !0
        });
      }
    }
    var sn = function(R, W, pe, xe, rt, Je, gt) {
      var mt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: k,
        // Built-in properties that belong on the element
        type: R,
        key: W,
        ref: pe,
        props: gt,
        // Record the component responsible for creating this element.
        _owner: Je
      };
      return mt._store = {}, Object.defineProperty(mt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(mt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: xe
      }), Object.defineProperty(mt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: rt
      }), Object.freeze && (Object.freeze(mt.props), Object.freeze(mt)), mt;
    };
    function Xn(R, W, pe, xe, rt) {
      {
        var Je, gt = {}, mt = null, xn = null;
        pe !== void 0 && (Er(pe), mt = "" + pe), ct(W) && (Er(W.key), mt = "" + W.key), Ae(W) && (xn = W.ref, Bt(W, rt));
        for (Je in W)
          In.call(W, Je) && !Qa.hasOwnProperty(Je) && (gt[Je] = W[Je]);
        if (R && R.defaultProps) {
          var an = R.defaultProps;
          for (Je in an)
            gt[Je] === void 0 && (gt[Je] = an[Je]);
        }
        if (mt || xn) {
          var cn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          mt && nn(gt, cn), xn && hn(gt, cn);
        }
        return sn(R, mt, xn, rt, xe, ca.current, gt);
      }
    }
    var rn = tn.ReactCurrentOwner, Qt = tn.ReactDebugCurrentFrame;
    function Wt(R) {
      if (R) {
        var W = R._owner, pe = Bn(R.type, R._source, W ? W.type : null);
        Qt.setExtraStackFrame(pe);
      } else
        Qt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Cr(R) {
      return typeof R == "object" && R !== null && R.$$typeof === k;
    }
    function xa() {
      {
        if (rn.current) {
          var R = Pe(rn.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Hi(R) {
      return "";
    }
    var Jl = {};
    function eu(R) {
      {
        var W = xa();
        if (!W) {
          var pe = typeof R == "string" ? R : R.displayName || R.name;
          pe && (W = `

Check the top-level render call using <` + pe + ">.");
        }
        return W;
      }
    }
    function pl(R, W) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var pe = eu(W);
        if (Jl[pe])
          return;
        Jl[pe] = !0;
        var xe = "";
        R && R._owner && R._owner !== rn.current && (xe = " It was passed a child from " + Pe(R._owner.type) + "."), Wt(R), dt('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', pe, xe), Wt(null);
      }
    }
    function vl(R, W) {
      {
        if (typeof R != "object")
          return;
        if (Yn(R))
          for (var pe = 0; pe < R.length; pe++) {
            var xe = R[pe];
            Cr(xe) && pl(xe, W);
          }
        else if (Cr(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var rt = nt(R);
          if (typeof rt == "function" && rt !== R.entries)
            for (var Je = rt.call(R), gt; !(gt = Je.next()).done; )
              Cr(gt.value) && pl(gt.value, W);
        }
      }
    }
    function tu(R) {
      {
        var W = R.type;
        if (W == null || typeof W == "string")
          return;
        var pe;
        if (typeof W == "function")
          pe = W.propTypes;
        else if (typeof W == "object" && (W.$$typeof === Y || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        W.$$typeof === B))
          pe = W.propTypes;
        else
          return;
        if (pe) {
          var xe = Pe(W);
          Kn(pe, R.props, "prop", xe, R);
        } else if (W.PropTypes !== void 0 && !fa) {
          fa = !0;
          var rt = Pe(W);
          dt("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", rt || "Unknown");
        }
        typeof W.getDefaultProps == "function" && !W.getDefaultProps.isReactClassApproved && dt("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(R) {
      {
        for (var W = Object.keys(R.props), pe = 0; pe < W.length; pe++) {
          var xe = W[pe];
          if (xe !== "children" && xe !== "key") {
            Wt(R), dt("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", xe), Wt(null);
            break;
          }
        }
        R.ref !== null && (Wt(R), dt("Invalid attribute `ref` supplied to `React.Fragment`."), Wt(null));
      }
    }
    var Dr = {};
    function ar(R, W, pe, xe, rt, Je) {
      {
        var gt = Ct(R);
        if (!gt) {
          var mt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (mt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var xn = Hi();
          xn ? mt += xn : mt += xa();
          var an;
          R === null ? an = "null" : Yn(R) ? an = "array" : R !== void 0 && R.$$typeof === k ? (an = "<" + (Pe(R.type) || "Unknown") + " />", mt = " Did you accidentally export a JSX literal instead of a component?") : an = typeof R, dt("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", an, mt);
        }
        var cn = Xn(R, W, pe, rt, Je);
        if (cn == null)
          return cn;
        if (gt) {
          var ir = W.children;
          if (ir !== void 0)
            if (xe)
              if (Yn(ir)) {
                for (var Ga = 0; Ga < ir.length; Ga++)
                  vl(ir[Ga], R);
                Object.freeze && Object.freeze(ir);
              } else
                dt("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ir, R);
        }
        if (In.call(W, "key")) {
          var qa = Pe(R), at = Object.keys(W).filter(function(nu) {
            return nu !== "key";
          }), ut = at.length > 0 ? "{key: someKey, " + at.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Dr[qa + ut]) {
            var Ka = at.length > 0 ? "{" + at.join(": ..., ") + ": ...}" : "{}";
            dt(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ut, qa, Ka, qa), Dr[qa + ut] = !0;
          }
        }
        return R === we ? _r(cn) : tu(cn), cn;
      }
    }
    function di(R, W, pe) {
      return ar(R, W, pe, !0);
    }
    function Wa(R, W, pe) {
      return ar(R, W, pe, !1);
    }
    var pi = Wa, vi = di;
    Jp.Fragment = we, Jp.jsx = pi, Jp.jsxs = vi;
  }()), Jp;
}
process.env.NODE_ENV === "production" ? mE.exports = rD() : mE.exports = aD();
var Q = mE.exports, gE = { exports: {} }, Ia = {}, Qm = { exports: {} }, vE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aT;
function iD() {
  return aT || (aT = 1, function(F) {
    function k(ae, ze) {
      var fe = ae.length;
      ae.push(ze);
      e: for (; 0 < fe; ) {
        var _ = fe - 1 >>> 1, I = ae[_];
        if (0 < oe(I, ze)) ae[_] = ze, ae[fe] = I, fe = _;
        else break e;
      }
    }
    function D(ae) {
      return ae.length === 0 ? null : ae[0];
    }
    function we(ae) {
      if (ae.length === 0) return null;
      var ze = ae[0], fe = ae.pop();
      if (fe !== ze) {
        ae[0] = fe;
        e: for (var _ = 0, I = ae.length, Ge = I >>> 1; _ < Ge; ) {
          var Qe = 2 * (_ + 1) - 1, vt = ae[Qe], ot = Qe + 1, lt = ae[ot];
          if (0 > oe(vt, fe)) ot < I && 0 > oe(lt, vt) ? (ae[_] = lt, ae[ot] = fe, _ = ot) : (ae[_] = vt, ae[Qe] = fe, _ = Qe);
          else if (ot < I && 0 > oe(lt, fe)) ae[_] = lt, ae[ot] = fe, _ = ot;
          else break e;
        }
      }
      return ze;
    }
    function oe(ae, ze) {
      var fe = ae.sortIndex - ze.sortIndex;
      return fe !== 0 ? fe : ae.id - ze.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var ye = performance;
      F.unstable_now = function() {
        return ye.now();
      };
    } else {
      var g = Date, Oe = g.now();
      F.unstable_now = function() {
        return g.now() - Oe;
      };
    }
    var Y = [], Z = [], Re = 1, B = null, ue = 3, ne = !1, ie = !1, Me = !1, nt = typeof setTimeout == "function" ? setTimeout : null, tn = typeof clearTimeout == "function" ? clearTimeout : null, dt = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ke(ae) {
      for (var ze = D(Z); ze !== null; ) {
        if (ze.callback === null) we(Z);
        else if (ze.startTime <= ae) we(Z), ze.sortIndex = ze.expirationTime, k(Y, ze);
        else break;
        ze = D(Z);
      }
    }
    function le(ae) {
      if (Me = !1, Ke(ae), !ie) if (D(Y) !== null) ie = !0, zt(J);
      else {
        var ze = D(Z);
        ze !== null && Le(le, ze.startTime - ae);
      }
    }
    function J(ae, ze) {
      ie = !1, Me && (Me = !1, tn(pt), pt = -1), ne = !0;
      var fe = ue;
      try {
        for (Ke(ze), B = D(Y); B !== null && (!(B.expirationTime > ze) || ae && !on()); ) {
          var _ = B.callback;
          if (typeof _ == "function") {
            B.callback = null, ue = B.priorityLevel;
            var I = _(B.expirationTime <= ze);
            ze = F.unstable_now(), typeof I == "function" ? B.callback = I : B === D(Y) && we(Y), Ke(ze);
          } else we(Y);
          B = D(Y);
        }
        if (B !== null) var Ge = !0;
        else {
          var Qe = D(Z);
          Qe !== null && Le(le, Qe.startTime - ze), Ge = !1;
        }
        return Ge;
      } finally {
        B = null, ue = fe, ne = !1;
      }
    }
    var Ne = !1, ve = null, pt = -1, Tt = 5, Ct = -1;
    function on() {
      return !(F.unstable_now() - Ct < Tt);
    }
    function Mt() {
      if (ve !== null) {
        var ae = F.unstable_now();
        Ct = ae;
        var ze = !0;
        try {
          ze = ve(!0, ae);
        } finally {
          ze ? Pe() : (Ne = !1, ve = null);
        }
      } else Ne = !1;
    }
    var Pe;
    if (typeof dt == "function") Pe = function() {
      dt(Mt);
    };
    else if (typeof MessageChannel < "u") {
      var Vt = new MessageChannel(), Lt = Vt.port2;
      Vt.port1.onmessage = Mt, Pe = function() {
        Lt.postMessage(null);
      };
    } else Pe = function() {
      nt(Mt, 0);
    };
    function zt(ae) {
      ve = ae, Ne || (Ne = !0, Pe());
    }
    function Le(ae, ze) {
      pt = nt(function() {
        ae(F.unstable_now());
      }, ze);
    }
    F.unstable_IdlePriority = 5, F.unstable_ImmediatePriority = 1, F.unstable_LowPriority = 4, F.unstable_NormalPriority = 3, F.unstable_Profiling = null, F.unstable_UserBlockingPriority = 2, F.unstable_cancelCallback = function(ae) {
      ae.callback = null;
    }, F.unstable_continueExecution = function() {
      ie || ne || (ie = !0, zt(J));
    }, F.unstable_forceFrameRate = function(ae) {
      0 > ae || 125 < ae ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Tt = 0 < ae ? Math.floor(1e3 / ae) : 5;
    }, F.unstable_getCurrentPriorityLevel = function() {
      return ue;
    }, F.unstable_getFirstCallbackNode = function() {
      return D(Y);
    }, F.unstable_next = function(ae) {
      switch (ue) {
        case 1:
        case 2:
        case 3:
          var ze = 3;
          break;
        default:
          ze = ue;
      }
      var fe = ue;
      ue = ze;
      try {
        return ae();
      } finally {
        ue = fe;
      }
    }, F.unstable_pauseExecution = function() {
    }, F.unstable_requestPaint = function() {
    }, F.unstable_runWithPriority = function(ae, ze) {
      switch (ae) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          ae = 3;
      }
      var fe = ue;
      ue = ae;
      try {
        return ze();
      } finally {
        ue = fe;
      }
    }, F.unstable_scheduleCallback = function(ae, ze, fe) {
      var _ = F.unstable_now();
      switch (typeof fe == "object" && fe !== null ? (fe = fe.delay, fe = typeof fe == "number" && 0 < fe ? _ + fe : _) : fe = _, ae) {
        case 1:
          var I = -1;
          break;
        case 2:
          I = 250;
          break;
        case 5:
          I = 1073741823;
          break;
        case 4:
          I = 1e4;
          break;
        default:
          I = 5e3;
      }
      return I = fe + I, ae = { id: Re++, callback: ze, priorityLevel: ae, startTime: fe, expirationTime: I, sortIndex: -1 }, fe > _ ? (ae.sortIndex = fe, k(Z, ae), D(Y) === null && ae === D(Z) && (Me ? (tn(pt), pt = -1) : Me = !0, Le(le, fe - _))) : (ae.sortIndex = I, k(Y, ae), ie || ne || (ie = !0, zt(J))), ae;
    }, F.unstable_shouldYield = on, F.unstable_wrapCallback = function(ae) {
      var ze = ue;
      return function() {
        var fe = ue;
        ue = ze;
        try {
          return ae.apply(this, arguments);
        } finally {
          ue = fe;
        }
      };
    };
  }(vE)), vE;
}
var hE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var iT;
function lD() {
  return iT || (iT = 1, function(F) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var k = !1, D = 5;
      function we(se, Ae) {
        var ct = se.length;
        se.push(Ae), g(se, Ae, ct);
      }
      function oe(se) {
        return se.length === 0 ? null : se[0];
      }
      function ye(se) {
        if (se.length === 0)
          return null;
        var Ae = se[0], ct = se.pop();
        return ct !== Ae && (se[0] = ct, Oe(se, ct, 0)), Ae;
      }
      function g(se, Ae, ct) {
        for (var Bt = ct; Bt > 0; ) {
          var nn = Bt - 1 >>> 1, hn = se[nn];
          if (Y(hn, Ae) > 0)
            se[nn] = Ae, se[Bt] = hn, Bt = nn;
          else
            return;
        }
      }
      function Oe(se, Ae, ct) {
        for (var Bt = ct, nn = se.length, hn = nn >>> 1; Bt < hn; ) {
          var sn = (Bt + 1) * 2 - 1, Xn = se[sn], rn = sn + 1, Qt = se[rn];
          if (Y(Xn, Ae) < 0)
            rn < nn && Y(Qt, Xn) < 0 ? (se[Bt] = Qt, se[rn] = Ae, Bt = rn) : (se[Bt] = Xn, se[sn] = Ae, Bt = sn);
          else if (rn < nn && Y(Qt, Ae) < 0)
            se[Bt] = Qt, se[rn] = Ae, Bt = rn;
          else
            return;
        }
      }
      function Y(se, Ae) {
        var ct = se.sortIndex - Ae.sortIndex;
        return ct !== 0 ? ct : se.id - Ae.id;
      }
      var Z = 1, Re = 2, B = 3, ue = 4, ne = 5;
      function ie(se, Ae) {
      }
      var Me = typeof performance == "object" && typeof performance.now == "function";
      if (Me) {
        var nt = performance;
        F.unstable_now = function() {
          return nt.now();
        };
      } else {
        var tn = Date, dt = tn.now();
        F.unstable_now = function() {
          return tn.now() - dt;
        };
      }
      var Ke = 1073741823, le = -1, J = 250, Ne = 5e3, ve = 1e4, pt = Ke, Tt = [], Ct = [], on = 1, Mt = null, Pe = B, Vt = !1, Lt = !1, zt = !1, Le = typeof setTimeout == "function" ? setTimeout : null, ae = typeof clearTimeout == "function" ? clearTimeout : null, ze = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function fe(se) {
        for (var Ae = oe(Ct); Ae !== null; ) {
          if (Ae.callback === null)
            ye(Ct);
          else if (Ae.startTime <= se)
            ye(Ct), Ae.sortIndex = Ae.expirationTime, we(Tt, Ae);
          else
            return;
          Ae = oe(Ct);
        }
      }
      function _(se) {
        if (zt = !1, fe(se), !Lt)
          if (oe(Tt) !== null)
            Lt = !0, Ln(I);
          else {
            var Ae = oe(Ct);
            Ae !== null && Er(_, Ae.startTime - se);
          }
      }
      function I(se, Ae) {
        Lt = !1, zt && (zt = !1, ca()), Vt = !0;
        var ct = Pe;
        try {
          var Bt;
          if (!k) return Ge(se, Ae);
        } finally {
          Mt = null, Pe = ct, Vt = !1;
        }
      }
      function Ge(se, Ae) {
        var ct = Ae;
        for (fe(ct), Mt = oe(Tt); Mt !== null && !(Mt.expirationTime > ct && (!se || ci())); ) {
          var Bt = Mt.callback;
          if (typeof Bt == "function") {
            Mt.callback = null, Pe = Mt.priorityLevel;
            var nn = Mt.expirationTime <= ct, hn = Bt(nn);
            ct = F.unstable_now(), typeof hn == "function" ? Mt.callback = hn : Mt === oe(Tt) && ye(Tt), fe(ct);
          } else
            ye(Tt);
          Mt = oe(Tt);
        }
        if (Mt !== null)
          return !0;
        var sn = oe(Ct);
        return sn !== null && Er(_, sn.startTime - ct), !1;
      }
      function Qe(se, Ae) {
        switch (se) {
          case Z:
          case Re:
          case B:
          case ue:
          case ne:
            break;
          default:
            se = B;
        }
        var ct = Pe;
        Pe = se;
        try {
          return Ae();
        } finally {
          Pe = ct;
        }
      }
      function vt(se) {
        var Ae;
        switch (Pe) {
          case Z:
          case Re:
          case B:
            Ae = B;
            break;
          default:
            Ae = Pe;
            break;
        }
        var ct = Pe;
        Pe = Ae;
        try {
          return se();
        } finally {
          Pe = ct;
        }
      }
      function ot(se) {
        var Ae = Pe;
        return function() {
          var ct = Pe;
          Pe = Ae;
          try {
            return se.apply(this, arguments);
          } finally {
            Pe = ct;
          }
        };
      }
      function lt(se, Ae, ct) {
        var Bt = F.unstable_now(), nn;
        if (typeof ct == "object" && ct !== null) {
          var hn = ct.delay;
          typeof hn == "number" && hn > 0 ? nn = Bt + hn : nn = Bt;
        } else
          nn = Bt;
        var sn;
        switch (se) {
          case Z:
            sn = le;
            break;
          case Re:
            sn = J;
            break;
          case ne:
            sn = pt;
            break;
          case ue:
            sn = ve;
            break;
          case B:
          default:
            sn = Ne;
            break;
        }
        var Xn = nn + sn, rn = {
          id: on++,
          callback: Ae,
          priorityLevel: se,
          startTime: nn,
          expirationTime: Xn,
          sortIndex: -1
        };
        return nn > Bt ? (rn.sortIndex = nn, we(Ct, rn), oe(Tt) === null && rn === oe(Ct) && (zt ? ca() : zt = !0, Er(_, nn - Bt))) : (rn.sortIndex = Xn, we(Tt, rn), !Lt && !Vt && (Lt = !0, Ln(I))), rn;
      }
      function st() {
      }
      function ht() {
        !Lt && !Vt && (Lt = !0, Ln(I));
      }
      function $t() {
        return oe(Tt);
      }
      function Mn(se) {
        se.callback = null;
      }
      function br() {
        return Pe;
      }
      var Rn = !1, rr = null, Bn = -1, In = D, $r = -1;
      function ci() {
        var se = F.unstable_now() - $r;
        return !(se < In);
      }
      function sa() {
      }
      function Kn(se) {
        if (se < 0 || se > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        se > 0 ? In = Math.floor(1e3 / se) : In = D;
      }
      var Tn = function() {
        if (rr !== null) {
          var se = F.unstable_now();
          $r = se;
          var Ae = !0, ct = !0;
          try {
            ct = rr(Ae, se);
          } finally {
            ct ? Yn() : (Rn = !1, rr = null);
          }
        } else
          Rn = !1;
      }, Yn;
      if (typeof ze == "function")
        Yn = function() {
          ze(Tn);
        };
      else if (typeof MessageChannel < "u") {
        var Sr = new MessageChannel(), $a = Sr.port2;
        Sr.port1.onmessage = Tn, Yn = function() {
          $a.postMessage(null);
        };
      } else
        Yn = function() {
          Le(Tn, 0);
        };
      function Ln(se) {
        rr = se, Rn || (Rn = !0, Yn());
      }
      function Er(se, Ae) {
        Bn = Le(function() {
          se(F.unstable_now());
        }, Ae);
      }
      function ca() {
        ae(Bn), Bn = -1;
      }
      var Qa = sa, fi = null;
      F.unstable_IdlePriority = ne, F.unstable_ImmediatePriority = Z, F.unstable_LowPriority = ue, F.unstable_NormalPriority = B, F.unstable_Profiling = fi, F.unstable_UserBlockingPriority = Re, F.unstable_cancelCallback = Mn, F.unstable_continueExecution = ht, F.unstable_forceFrameRate = Kn, F.unstable_getCurrentPriorityLevel = br, F.unstable_getFirstCallbackNode = $t, F.unstable_next = vt, F.unstable_pauseExecution = st, F.unstable_requestPaint = Qa, F.unstable_runWithPriority = Qe, F.unstable_scheduleCallback = lt, F.unstable_shouldYield = ci, F.unstable_wrapCallback = ot, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(hE)), hE;
}
var lT;
function fT() {
  return lT || (lT = 1, process.env.NODE_ENV === "production" ? Qm.exports = iD() : Qm.exports = lD()), Qm.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uT;
function uD() {
  if (uT) return Ia;
  uT = 1;
  var F = Dt, k = fT();
  function D(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var we = /* @__PURE__ */ new Set(), oe = {};
  function ye(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (oe[n] = r, n = 0; n < r.length; n++) we.add(r[n]);
  }
  var Oe = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Y = Object.prototype.hasOwnProperty, Z = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Re = {}, B = {};
  function ue(n) {
    return Y.call(B, n) ? !0 : Y.call(Re, n) ? !1 : Z.test(n) ? B[n] = !0 : (Re[n] = !0, !1);
  }
  function ne(n, r, l, o) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function ie(n, r, l, o) {
    if (r === null || typeof r > "u" || ne(n, r, l, o)) return !0;
    if (o) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function Me(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var nt = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    nt[n] = new Me(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    nt[r] = new Me(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    nt[n] = new Me(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    nt[n] = new Me(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    nt[n] = new Me(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    nt[n] = new Me(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    nt[n] = new Me(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    nt[n] = new Me(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    nt[n] = new Me(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var tn = /[\-:]([a-z])/g;
  function dt(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      tn,
      dt
    );
    nt[r] = new Me(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(tn, dt);
    nt[r] = new Me(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(tn, dt);
    nt[r] = new Me(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    nt[n] = new Me(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), nt.xlinkHref = new Me("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    nt[n] = new Me(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Ke(n, r, l, o) {
    var c = nt.hasOwnProperty(r) ? nt[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ie(r, l, c, o) && (l = null), o || c === null ? ue(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var le = F.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, J = Symbol.for("react.element"), Ne = Symbol.for("react.portal"), ve = Symbol.for("react.fragment"), pt = Symbol.for("react.strict_mode"), Tt = Symbol.for("react.profiler"), Ct = Symbol.for("react.provider"), on = Symbol.for("react.context"), Mt = Symbol.for("react.forward_ref"), Pe = Symbol.for("react.suspense"), Vt = Symbol.for("react.suspense_list"), Lt = Symbol.for("react.memo"), zt = Symbol.for("react.lazy"), Le = Symbol.for("react.offscreen"), ae = Symbol.iterator;
  function ze(n) {
    return n === null || typeof n != "object" ? null : (n = ae && n[ae] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var fe = Object.assign, _;
  function I(n) {
    if (_ === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      _ = r && r[1] || "";
    }
    return `
` + _ + n;
  }
  var Ge = !1;
  function Qe(n, r) {
    if (!n || Ge) return "";
    Ge = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (U) {
          var o = U;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (U) {
          o = U;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (U) {
          o = U;
        }
        n();
      }
    } catch (U) {
      if (U && o && typeof U.stack == "string") {
        for (var c = U.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, E = d.length - 1; 1 <= m && 0 <= E && c[m] !== d[E]; ) E--;
        for (; 1 <= m && 0 <= E; m--, E--) if (c[m] !== d[E]) {
          if (m !== 1 || E !== 1)
            do
              if (m--, E--, 0 > E || c[m] !== d[E]) {
                var T = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", n.displayName)), T;
              }
            while (1 <= m && 0 <= E);
          break;
        }
      }
    } finally {
      Ge = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? I(n) : "";
  }
  function vt(n) {
    switch (n.tag) {
      case 5:
        return I(n.type);
      case 16:
        return I("Lazy");
      case 13:
        return I("Suspense");
      case 19:
        return I("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Qe(n.type, !1), n;
      case 11:
        return n = Qe(n.type.render, !1), n;
      case 1:
        return n = Qe(n.type, !0), n;
      default:
        return "";
    }
  }
  function ot(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case ve:
        return "Fragment";
      case Ne:
        return "Portal";
      case Tt:
        return "Profiler";
      case pt:
        return "StrictMode";
      case Pe:
        return "Suspense";
      case Vt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case on:
        return (n.displayName || "Context") + ".Consumer";
      case Ct:
        return (n._context.displayName || "Context") + ".Provider";
      case Mt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Lt:
        return r = n.displayName || null, r !== null ? r : ot(n.type) || "Memo";
      case zt:
        r = n._payload, n = n._init;
        try {
          return ot(n(r));
        } catch {
        }
    }
    return null;
  }
  function lt(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return ot(r);
      case 8:
        return r === pt ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function st(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function ht(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function $t(n) {
    var r = ht(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(m) {
        o = "" + m, d.call(this, m);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(m) {
        o = "" + m;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Mn(n) {
    n._valueTracker || (n._valueTracker = $t(n));
  }
  function br(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = ht(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function Rn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function rr(n, r) {
    var l = r.checked;
    return fe({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Bn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = st(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function In(n, r) {
    r = r.checked, r != null && Ke(n, "checked", r, !1);
  }
  function $r(n, r) {
    In(n, r);
    var l = st(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, st(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function ci(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function sa(n, r, l) {
    (r !== "number" || Rn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Kn = Array.isArray;
  function Tn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + st(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Yn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(D(91));
    return fe({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Sr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(D(92));
        if (Kn(l)) {
          if (1 < l.length) throw Error(D(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: st(l) };
  }
  function $a(n, r) {
    var l = st(r.value), o = st(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Ln(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Er(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function ca(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Er(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var Qa, fi = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (Qa = Qa || document.createElement("div"), Qa.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = Qa.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function se(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Ae = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, ct = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ae).forEach(function(n) {
    ct.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Ae[r] = Ae[n];
    });
  });
  function Bt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Ae.hasOwnProperty(n) && Ae[n] ? ("" + r).trim() : r + "px";
  }
  function nn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Bt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var hn = fe({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (hn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(D(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(D(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(D(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(D(62));
    }
  }
  function Xn(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var rn = null;
  function Qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Wt = null, fa = null, Cr = null;
  function xa(n) {
    if (n = Fe(n)) {
      if (typeof Wt != "function") throw Error(D(280));
      var r = n.stateNode;
      r && (r = yn(r), Wt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? Cr ? Cr.push(n) : Cr = [n] : fa = n;
  }
  function Jl() {
    if (fa) {
      var n = fa, r = Cr;
      if (Cr = fa = null, xa(n), r) for (n = 0; n < r.length; n++) xa(r[n]);
    }
  }
  function eu(n, r) {
    return n(r);
  }
  function pl() {
  }
  var vl = !1;
  function tu(n, r, l) {
    if (vl) return n(r, l);
    vl = !0;
    try {
      return eu(n, r, l);
    } finally {
      vl = !1, (fa !== null || Cr !== null) && (pl(), Jl());
    }
  }
  function _r(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = yn(l);
    if (o === null) return null;
    l = o[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(D(231, r, typeof l));
    return l;
  }
  var Dr = !1;
  if (Oe) try {
    var ar = {};
    Object.defineProperty(ar, "passive", { get: function() {
      Dr = !0;
    } }), window.addEventListener("test", ar, ar), window.removeEventListener("test", ar, ar);
  } catch {
    Dr = !1;
  }
  function di(n, r, l, o, c, d, m, E, T) {
    var U = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, U);
    } catch (K) {
      this.onError(K);
    }
  }
  var Wa = !1, pi = null, vi = !1, R = null, W = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function pe(n, r, l, o, c, d, m, E, T) {
    Wa = !1, pi = null, di.apply(W, arguments);
  }
  function xe(n, r, l, o, c, d, m, E, T) {
    if (pe.apply(this, arguments), Wa) {
      if (Wa) {
        var U = pi;
        Wa = !1, pi = null;
      } else throw Error(D(198));
      vi || (vi = !0, R = U);
    }
  }
  function rt(n) {
    var r = n, l = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function Je(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function gt(n) {
    if (rt(n) !== n) throw Error(D(188));
  }
  function mt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = rt(n), r === null) throw Error(D(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return gt(c), n;
          if (d === o) return gt(c), r;
          d = d.sibling;
        }
        throw Error(D(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, E = c.child; E; ) {
          if (E === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (E === o) {
            m = !0, o = c, l = d;
            break;
          }
          E = E.sibling;
        }
        if (!m) {
          for (E = d.child; E; ) {
            if (E === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (E === o) {
              m = !0, o = d, l = c;
              break;
            }
            E = E.sibling;
          }
          if (!m) throw Error(D(189));
        }
      }
      if (l.alternate !== o) throw Error(D(190));
    }
    if (l.tag !== 3) throw Error(D(188));
    return l.stateNode.current === l ? n : r;
  }
  function xn(n) {
    return n = mt(n), n !== null ? an(n) : null;
  }
  function an(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = an(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var cn = k.unstable_scheduleCallback, ir = k.unstable_cancelCallback, Ga = k.unstable_shouldYield, qa = k.unstable_requestPaint, at = k.unstable_now, ut = k.unstable_getCurrentPriorityLevel, Ka = k.unstable_ImmediatePriority, nu = k.unstable_UserBlockingPriority, ru = k.unstable_NormalPriority, hl = k.unstable_LowPriority, Wu = k.unstable_IdlePriority, ml = null, Qr = null;
  function $o(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var kr = Math.clz32 ? Math.clz32 : Gu, lc = Math.log, uc = Math.LN2;
  function Gu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (lc(n) / uc | 0) | 0;
  }
  var yl = 64, da = 4194304;
  function Xa(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Za(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = Xa(E) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - kr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function qu(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function au(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - kr(d), E = 1 << m, T = c[m];
      T === -1 ? (!(E & l) || E & o) && (c[m] = qu(E, r)) : T <= r && (n.expiredLanes |= E), d &= ~E;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Ku() {
    var n = yl;
    return yl <<= 1, !(yl & 4194240) && (yl = 64), n;
  }
  function Xu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Pi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - kr(r), n[r] = l;
  }
  function Wf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - kr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - kr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var At = 0;
  function Zu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var kt, Qo, hi, Ze, Ju, lr = !1, mi = [], Or = null, yi = null, fn = null, Gt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), $n = [], Mr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function wa(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Or = null;
        break;
      case "dragenter":
      case "dragleave":
        yi = null;
        break;
      case "mouseover":
      case "mouseout":
        fn = null;
        break;
      case "pointerover":
      case "pointerout":
        Gt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Fe(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Wo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Or = iu(Or, n, r, l, o, c), !0;
      case "dragenter":
        return yi = iu(yi, n, r, l, o, c), !0;
      case "mouseover":
        return fn = iu(fn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Gt.set(d, iu(Gt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Go(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = rt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Je(l), r !== null) {
            n.blockedOn = r, Ju(n.priority, function() {
              hi(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function El(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = no(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        rn = o, l.target.dispatchEvent(o), rn = null;
      } else return r = Fe(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function Gf() {
    lr = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), fn !== null && El(fn) && (fn = null), Gt.forEach(lu), Sl.forEach(lu);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, lr || (lr = !0, k.unstable_scheduleCallback(k.unstable_NormalPriority, Gf)));
  }
  function Ja(n) {
    function r(c) {
      return ba(c, n);
    }
    if (0 < mi.length) {
      ba(mi[0], n);
      for (var l = 1; l < mi.length; l++) {
        var o = mi[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Or !== null && ba(Or, n), yi !== null && ba(yi, n), fn !== null && ba(fn, n), Gt.forEach(r), Sl.forEach(r), l = 0; l < $n.length; l++) o = $n[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < $n.length && (l = $n[0], l.blockedOn === null); ) Go(l), l.blockedOn === null && $n.shift();
  }
  var gi = le.ReactCurrentBatchConfig, _a = !0;
  function eo(n, r, l, o) {
    var c = At, d = gi.transition;
    gi.transition = null;
    try {
      At = 1, Cl(n, r, l, o);
    } finally {
      At = c, gi.transition = d;
    }
  }
  function to(n, r, l, o) {
    var c = At, d = gi.transition;
    gi.transition = null;
    try {
      At = 4, Cl(n, r, l, o);
    } finally {
      At = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = no(n, r, l, o);
      if (c === null) Sc(n, r, o, uu, l), wa(n, o);
      else if (Wo(c, n, r, l, o)) o.stopPropagation();
      else if (wa(n, o), r & 4 && -1 < Mr.indexOf(n)) {
        for (; c !== null; ) {
          var d = Fe(c);
          if (d !== null && kt(d), d = no(n, r, l, o), d === null && Sc(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Sc(n, r, o, null, l);
    }
  }
  var uu = null;
  function no(n, r, l, o) {
    if (uu = null, n = Qt(o), n = vu(n), n !== null) if (r = rt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Je(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return uu = n, null;
  }
  function ro(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ut()) {
          case Ka:
            return 1;
          case nu:
            return 4;
          case ru:
          case hl:
            return 16;
          case Wu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ei = null, h = null, C = null;
  function A() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function H(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function re() {
    return !0;
  }
  function Ve() {
    return !1;
  }
  function de(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? re : Ve, this.isPropagationStopped = Ve, this;
    }
    return fe(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = re);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = re);
    }, persist: function() {
    }, isPersistent: re }), r;
  }
  var Ye = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, St = de(Ye), Ot = fe({}, Ye, { view: 0, detail: 0 }), ln = de(Ot), qt, ft, Kt, mn = fe({}, Ot, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Kt && (Kt && n.type === "mousemove" ? (qt = n.screenX - Kt.screenX, ft = n.screenY - Kt.screenY) : ft = qt = 0, Kt = n), qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : ft;
  } }), Rl = de(mn), qo = fe({}, mn, { dataTransfer: 0 }), Bi = de(qo), Ko = fe({}, Ot, { relatedTarget: 0 }), ou = de(Ko), qf = fe({}, Ye, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), oc = de(qf), Kf = fe({}, Ye, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), tv = de(Kf), Xf = fe({}, Ye, { data: 0 }), Zf = de(Xf), nv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, rv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Zm = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Zm[n]) ? !!r[n] : !1;
  }
  function Jf() {
    return Ii;
  }
  var ed = fe({}, Ot, { key: function(n) {
    if (n.key) {
      var r = nv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = H(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? rv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jf, charCode: function(n) {
    return n.type === "keypress" ? H(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? H(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), td = de(ed), nd = fe({}, mn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), av = de(nd), sc = fe({}, Ot, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jf }), iv = de(sc), Wr = fe({}, Ye, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = de(Wr), Nn = fe({}, mn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = de(Nn), rd = [9, 13, 27, 32], ao = Oe && "CompositionEvent" in window, Xo = null;
  Oe && "documentMode" in document && (Xo = document.documentMode);
  var Zo = Oe && "TextEvent" in window && !Xo, lv = Oe && (!ao || Xo && 8 < Xo && 11 >= Xo), uv = " ", cc = !1;
  function ov(n, r) {
    switch (n) {
      case "keyup":
        return rd.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function sv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var io = !1;
  function cv(n, r) {
    switch (n) {
      case "compositionend":
        return sv(r);
      case "keypress":
        return r.which !== 32 ? null : (cc = !0, uv);
      case "textInput":
        return n = r.data, n === uv && cc ? null : n;
      default:
        return null;
    }
  }
  function Jm(n, r) {
    if (io) return n === "compositionend" || !ao && ov(n, r) ? (n = A(), C = h = ei = null, io = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return lv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ey = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function fv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ey[n.type] : r === "textarea";
  }
  function ad(n, r, l, o) {
    Hi(o), r = as(r, "onChange"), 0 < r.length && (l = new St("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function dv(n) {
    du(n, 0);
  }
  function Jo(n) {
    var r = ni(n);
    if (br(r)) return n;
  }
  function ty(n, r) {
    if (n === "change") return r;
  }
  var pv = !1;
  if (Oe) {
    var id;
    if (Oe) {
      var ld = "oninput" in document;
      if (!ld) {
        var vv = document.createElement("div");
        vv.setAttribute("oninput", "return;"), ld = typeof vv.oninput == "function";
      }
      id = ld;
    } else id = !1;
    pv = id && (!document.documentMode || 9 < document.documentMode);
  }
  function hv() {
    Si && (Si.detachEvent("onpropertychange", mv), su = Si = null);
  }
  function mv(n) {
    if (n.propertyName === "value" && Jo(su)) {
      var r = [];
      ad(r, su, n, Qt(n)), tu(dv, r);
    }
  }
  function ny(n, r, l) {
    n === "focusin" ? (hv(), Si = r, su = l, Si.attachEvent("onpropertychange", mv)) : n === "focusout" && hv();
  }
  function yv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Jo(su);
  }
  function ry(n, r) {
    if (n === "click") return Jo(r);
  }
  function gv(n, r) {
    if (n === "input" || n === "change") return Jo(r);
  }
  function ay(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : ay;
  function es(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!Y.call(r, c) || !ti(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Sv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function fc(n, r) {
    var l = Sv(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r) return { node: l, offset: r - n };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Sv(l);
    }
  }
  function Tl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Tl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ts() {
    for (var n = window, r = Rn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = Rn(n.document);
    }
    return r;
  }
  function dc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function lo(n) {
    var r = ts(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Tl(l.ownerDocument.documentElement, l)) {
      if (o !== null && dc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = fc(l, d);
          var m = fc(
            l,
            o
          );
          c && m && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== m.node || n.focusOffset !== m.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > o ? (n.addRange(r), n.extend(m.node, m.offset)) : (r.setEnd(m.node, m.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var iy = Oe && "documentMode" in document && 11 >= document.documentMode, uo = null, ud = null, ns = null, od = !1;
  function sd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    od || uo == null || uo !== Rn(o) || (o = uo, "selectionStart" in o && dc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ns && es(ns, o) || (ns = o, o = as(ud, "onSelect"), 0 < o.length && (r = new St("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = uo)));
  }
  function pc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: pc("Animation", "AnimationEnd"), animationiteration: pc("Animation", "AnimationIteration"), animationstart: pc("Animation", "AnimationStart"), transitionend: pc("Transition", "TransitionEnd") }, ur = {}, cd = {};
  Oe && (cd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function vc(n) {
    if (ur[n]) return ur[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in cd) return ur[n] = r[l];
    return n;
  }
  var Ev = vc("animationend"), Cv = vc("animationiteration"), Rv = vc("animationstart"), Tv = vc("transitionend"), fd = /* @__PURE__ */ new Map(), hc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Da(n, r) {
    fd.set(n, r), ye(r, [n]);
  }
  for (var dd = 0; dd < hc.length; dd++) {
    var fu = hc[dd], ly = fu.toLowerCase(), uy = fu[0].toUpperCase() + fu.slice(1);
    Da(ly, "on" + uy);
  }
  Da(Ev, "onAnimationEnd"), Da(Cv, "onAnimationIteration"), Da(Rv, "onAnimationStart"), Da("dblclick", "onDoubleClick"), Da("focusin", "onFocus"), Da("focusout", "onBlur"), Da(Tv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), ye("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), ye("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), ye("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), ye("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), ye("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), ye("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), pd = new Set("cancel close invalid load scroll toggle".split(" ").concat(rs));
  function mc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, xe(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var E = o[m], T = E.instance, U = E.currentTarget;
          if (E = E.listener, T !== d && c.isPropagationStopped()) break e;
          mc(c, E, U), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (E = o[m], T = E.instance, U = E.currentTarget, E = E.listener, T !== d && c.isPropagationStopped()) break e;
          mc(c, E, U), d = T;
        }
      }
    }
    if (vi) throw n = R, vi = !1, R = null, n;
  }
  function It(n, r) {
    var l = r[us];
    l === void 0 && (l = r[us] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (xv(r, n, 2, !1), l.add(o));
  }
  function yc(n, r, l) {
    var o = 0;
    r && (o |= 4), xv(l, n, o, r);
  }
  var gc = "_reactListening" + Math.random().toString(36).slice(2);
  function oo(n) {
    if (!n[gc]) {
      n[gc] = !0, we.forEach(function(l) {
        l !== "selectionchange" && (pd.has(l) || yc(l, !1, n), yc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[gc] || (r[gc] = !0, yc("selectionchange", !1, r));
    }
  }
  function xv(n, r, l, o) {
    switch (ro(r)) {
      case 1:
        var c = eo;
        break;
      case 4:
        c = to;
        break;
      default:
        c = Cl;
    }
    l = c.bind(null, r, l, n), c = void 0, !Dr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Sc(n, r, l, o, c) {
    var d = o;
    if (!(r & 1) && !(r & 2) && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var E = o.stateNode.containerInfo;
        if (E === c || E.nodeType === 8 && E.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var T = m.tag;
          if ((T === 3 || T === 4) && (T = m.stateNode.containerInfo, T === c || T.nodeType === 8 && T.parentNode === c)) return;
          m = m.return;
        }
        for (; E !== null; ) {
          if (m = vu(E), m === null) return;
          if (T = m.tag, T === 5 || T === 6) {
            o = d = m;
            continue e;
          }
          E = E.parentNode;
        }
      }
      o = o.return;
    }
    tu(function() {
      var U = d, K = Qt(l), ee = [];
      e: {
        var q = fd.get(n);
        if (q !== void 0) {
          var Se = St, be = n;
          switch (n) {
            case "keypress":
              if (H(l) === 0) break e;
            case "keydown":
            case "keyup":
              Se = td;
              break;
            case "focusin":
              be = "focus", Se = ou;
              break;
            case "focusout":
              be = "blur", Se = ou;
              break;
            case "beforeblur":
            case "afterblur":
              Se = ou;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              Se = Rl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Se = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Se = iv;
              break;
            case Ev:
            case Cv:
            case Rv:
              Se = oc;
              break;
            case Tv:
              Se = Yi;
              break;
            case "scroll":
              Se = ln;
              break;
            case "wheel":
              Se = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              Se = tv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Se = av;
          }
          var ke = (r & 4) !== 0, kn = !ke && n === "scroll", O = ke ? q !== null ? q + "Capture" : null : q;
          ke = [];
          for (var w = U, N; w !== null; ) {
            N = w;
            var X = N.stateNode;
            if (N.tag === 5 && X !== null && (N = X, O !== null && (X = _r(w, O), X != null && ke.push(so(w, X, N)))), kn) break;
            w = w.return;
          }
          0 < ke.length && (q = new Se(q, be, null, l, K), ee.push({ event: q, listeners: ke }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (q = n === "mouseover" || n === "pointerover", Se = n === "mouseout" || n === "pointerout", q && l !== rn && (be = l.relatedTarget || l.fromElement) && (vu(be) || be[Qi])) break e;
          if ((Se || q) && (q = K.window === K ? K : (q = K.ownerDocument) ? q.defaultView || q.parentWindow : window, Se ? (be = l.relatedTarget || l.toElement, Se = U, be = be ? vu(be) : null, be !== null && (kn = rt(be), be !== kn || be.tag !== 5 && be.tag !== 6) && (be = null)) : (Se = null, be = U), Se !== be)) {
            if (ke = Rl, X = "onMouseLeave", O = "onMouseEnter", w = "mouse", (n === "pointerout" || n === "pointerover") && (ke = av, X = "onPointerLeave", O = "onPointerEnter", w = "pointer"), kn = Se == null ? q : ni(Se), N = be == null ? q : ni(be), q = new ke(X, w + "leave", Se, l, K), q.target = kn, q.relatedTarget = N, X = null, vu(K) === U && (ke = new ke(O, w + "enter", be, l, K), ke.target = N, ke.relatedTarget = kn, X = ke), kn = X, Se && be) t: {
              for (ke = Se, O = be, w = 0, N = ke; N; N = xl(N)) w++;
              for (N = 0, X = O; X; X = xl(X)) N++;
              for (; 0 < w - N; ) ke = xl(ke), w--;
              for (; 0 < N - w; ) O = xl(O), N--;
              for (; w--; ) {
                if (ke === O || O !== null && ke === O.alternate) break t;
                ke = xl(ke), O = xl(O);
              }
              ke = null;
            }
            else ke = null;
            Se !== null && wv(ee, q, Se, ke, !1), be !== null && kn !== null && wv(ee, kn, be, ke, !0);
          }
        }
        e: {
          if (q = U ? ni(U) : window, Se = q.nodeName && q.nodeName.toLowerCase(), Se === "select" || Se === "input" && q.type === "file") var _e = ty;
          else if (fv(q)) if (pv) _e = gv;
          else {
            _e = yv;
            var Ie = ny;
          }
          else (Se = q.nodeName) && Se.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (_e = ry);
          if (_e && (_e = _e(n, U))) {
            ad(ee, _e, l, K);
            break e;
          }
          Ie && Ie(n, q, U), n === "focusout" && (Ie = q._wrapperState) && Ie.controlled && q.type === "number" && sa(q, "number", q.value);
        }
        switch (Ie = U ? ni(U) : window, n) {
          case "focusin":
            (fv(Ie) || Ie.contentEditable === "true") && (uo = Ie, ud = U, ns = null);
            break;
          case "focusout":
            ns = ud = uo = null;
            break;
          case "mousedown":
            od = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            od = !1, sd(ee, l, K);
            break;
          case "selectionchange":
            if (iy) break;
          case "keydown":
          case "keyup":
            sd(ee, l, K);
        }
        var $e;
        if (ao) e: {
          switch (n) {
            case "compositionstart":
              var Xe = "onCompositionStart";
              break e;
            case "compositionend":
              Xe = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Xe = "onCompositionUpdate";
              break e;
          }
          Xe = void 0;
        }
        else io ? ov(n, l) && (Xe = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Xe = "onCompositionStart");
        Xe && (lv && l.locale !== "ko" && (io || Xe !== "onCompositionStart" ? Xe === "onCompositionEnd" && io && ($e = A()) : (ei = K, h = "value" in ei ? ei.value : ei.textContent, io = !0)), Ie = as(U, Xe), 0 < Ie.length && (Xe = new Zf(Xe, n, null, l, K), ee.push({ event: Xe, listeners: Ie }), $e ? Xe.data = $e : ($e = sv(l), $e !== null && (Xe.data = $e)))), ($e = Zo ? cv(n, l) : Jm(n, l)) && (U = as(U, "onBeforeInput"), 0 < U.length && (K = new Zf("onBeforeInput", "beforeinput", null, l, K), ee.push({ event: K, listeners: U }), K.data = $e));
      }
      du(ee, r);
    });
  }
  function so(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function as(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = _r(n, l), d != null && o.unshift(so(n, d, c)), d = _r(n, r), d != null && o.push(so(n, d, c))), n = n.return;
    }
    return o;
  }
  function xl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function wv(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, T = E.alternate, U = E.stateNode;
      if (T !== null && T === o) break;
      E.tag === 5 && U !== null && (E = U, c ? (T = _r(l, d), T != null && m.unshift(so(l, T, E))) : c || (T = _r(l, d), T != null && m.push(so(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var bv = /\r\n?/g, oy = /\u0000|\uFFFD/g;
  function _v(n) {
    return (typeof n == "string" ? n : "" + n).replace(bv, `
`).replace(oy, "");
  }
  function Ec(n, r, l) {
    if (r = _v(r), _v(n) !== r && l) throw Error(D(425));
  }
  function wl() {
  }
  var is = null, pu = null;
  function Cc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Rc = typeof setTimeout == "function" ? setTimeout : void 0, vd = typeof clearTimeout == "function" ? clearTimeout : void 0, Dv = typeof Promise == "function" ? Promise : void 0, co = typeof queueMicrotask == "function" ? queueMicrotask : typeof Dv < "u" ? function(n) {
    return Dv.resolve(null).then(n).catch(Tc);
  } : Rc;
  function Tc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function fo(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), Ja(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Ja(r);
  }
  function Ei(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function kv(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0) return n;
          r--;
        } else l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var bl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + bl, ls = "__reactProps$" + bl, Qi = "__reactContainer$" + bl, us = "__reactEvents$" + bl, po = "__reactListeners$" + bl, sy = "__reactHandles$" + bl;
  function vu(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = kv(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = kv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function Fe(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(D(33));
  }
  function yn(n) {
    return n[ls] || null;
  }
  var xt = [], ka = -1;
  function Oa(n) {
    return { current: n };
  }
  function un(n) {
    0 > ka || (n.current = xt[ka], xt[ka] = null, ka--);
  }
  function je(n, r) {
    ka++, xt[ka] = n.current, n.current = r;
  }
  var Rr = {}, Cn = Oa(Rr), Qn = Oa(!1), Gr = Rr;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Rr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function zn(n) {
    return n = n.childContextTypes, n != null;
  }
  function vo() {
    un(Qn), un(Cn);
  }
  function Ov(n, r, l) {
    if (Cn.current !== Rr) throw Error(D(168));
    je(Cn, r), je(Qn, l);
  }
  function os(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(D(108, lt(n) || "Unknown", c));
    return fe({}, l, o);
  }
  function Zn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Rr, Gr = Cn.current, je(Cn, n), je(Qn, Qn.current), !0;
  }
  function xc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(D(169));
    l ? (n = os(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, un(Qn), un(Cn), je(Cn, n)) : un(Qn), je(Qn, l);
  }
  var Ri = null, ho = !1, Wi = !1;
  function wc(n) {
    Ri === null ? Ri = [n] : Ri.push(n);
  }
  function _l(n) {
    ho = !0, wc(n);
  }
  function Ti() {
    if (!Wi && Ri !== null) {
      Wi = !0;
      var n = 0, r = At;
      try {
        var l = Ri;
        for (At = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ri = null, ho = !1;
      } catch (c) {
        throw Ri !== null && (Ri = Ri.slice(n + 1)), cn(Ka, Ti), c;
      } finally {
        At = r, Wi = !1;
      }
    }
    return null;
  }
  var Dl = [], kl = 0, Ol = null, Gi = 0, An = [], Ma = 0, pa = null, xi = 1, wi = "";
  function hu(n, r) {
    Dl[kl++] = Gi, Dl[kl++] = Ol, Ol = n, Gi = r;
  }
  function Mv(n, r, l) {
    An[Ma++] = xi, An[Ma++] = wi, An[Ma++] = pa, pa = n;
    var o = xi;
    n = wi;
    var c = 32 - kr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - kr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, xi = 1 << 32 - kr(r) + c | l << c | o, wi = d + n;
    } else xi = 1 << d | l << c | o, wi = n;
  }
  function bc(n) {
    n.return !== null && (hu(n, 1), Mv(n, 1, 0));
  }
  function _c(n) {
    for (; n === Ol; ) Ol = Dl[--kl], Dl[kl] = null, Gi = Dl[--kl], Dl[kl] = null;
    for (; n === pa; ) pa = An[--Ma], An[Ma] = null, wi = An[--Ma], An[Ma] = null, xi = An[--Ma], An[Ma] = null;
  }
  var Kr = null, Xr = null, pn = !1, La = null;
  function hd(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Lv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = Ei(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: xi, overflow: wi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function md(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function yd(n) {
    if (pn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Lv(n, r)) {
          if (md(n)) throw Error(D(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && Lv(n, r) ? hd(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Kr = n);
        }
      } else {
        if (md(n)) throw Error(D(418));
        n.flags = n.flags & -4097 | 2, pn = !1, Kr = n;
      }
    }
  }
  function Wn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Kr = n;
  }
  function Dc(n) {
    if (n !== Kr) return !1;
    if (!pn) return Wn(n), pn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Cc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (md(n)) throw ss(), Error(D(418));
      for (; r; ) hd(n, r), r = Ei(r.nextSibling);
    }
    if (Wn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(D(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Xr = Ei(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Xr = null;
      }
    } else Xr = Kr ? Ei(n.stateNode.nextSibling) : null;
    return !0;
  }
  function ss() {
    for (var n = Xr; n; ) n = Ei(n.nextSibling);
  }
  function Ml() {
    Xr = Kr = null, pn = !1;
  }
  function qi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var cy = le.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(D(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(D(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(D(284));
      if (!l._owner) throw Error(D(290, n));
    }
    return n;
  }
  function kc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(D(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Nv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(O, w) {
      if (n) {
        var N = O.deletions;
        N === null ? (O.deletions = [w], O.flags |= 16) : N.push(w);
      }
    }
    function l(O, w) {
      if (!n) return null;
      for (; w !== null; ) r(O, w), w = w.sibling;
      return null;
    }
    function o(O, w) {
      for (O = /* @__PURE__ */ new Map(); w !== null; ) w.key !== null ? O.set(w.key, w) : O.set(w.index, w), w = w.sibling;
      return O;
    }
    function c(O, w) {
      return O = Hl(O, w), O.index = 0, O.sibling = null, O;
    }
    function d(O, w, N) {
      return O.index = N, n ? (N = O.alternate, N !== null ? (N = N.index, N < w ? (O.flags |= 2, w) : N) : (O.flags |= 2, w)) : (O.flags |= 1048576, w);
    }
    function m(O) {
      return n && O.alternate === null && (O.flags |= 2), O;
    }
    function E(O, w, N, X) {
      return w === null || w.tag !== 6 ? (w = Gd(N, O.mode, X), w.return = O, w) : (w = c(w, N), w.return = O, w);
    }
    function T(O, w, N, X) {
      var _e = N.type;
      return _e === ve ? K(O, w, N.props.children, X, N.key) : w !== null && (w.elementType === _e || typeof _e == "object" && _e !== null && _e.$$typeof === zt && Nv(_e) === w.type) ? (X = c(w, N.props), X.ref = mu(O, w, N), X.return = O, X) : (X = Hs(N.type, N.key, N.props, null, O.mode, X), X.ref = mu(O, w, N), X.return = O, X);
    }
    function U(O, w, N, X) {
      return w === null || w.tag !== 4 || w.stateNode.containerInfo !== N.containerInfo || w.stateNode.implementation !== N.implementation ? (w = sf(N, O.mode, X), w.return = O, w) : (w = c(w, N.children || []), w.return = O, w);
    }
    function K(O, w, N, X, _e) {
      return w === null || w.tag !== 7 ? (w = tl(N, O.mode, X, _e), w.return = O, w) : (w = c(w, N), w.return = O, w);
    }
    function ee(O, w, N) {
      if (typeof w == "string" && w !== "" || typeof w == "number") return w = Gd("" + w, O.mode, N), w.return = O, w;
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case J:
            return N = Hs(w.type, w.key, w.props, null, O.mode, N), N.ref = mu(O, null, w), N.return = O, N;
          case Ne:
            return w = sf(w, O.mode, N), w.return = O, w;
          case zt:
            var X = w._init;
            return ee(O, X(w._payload), N);
        }
        if (Kn(w) || ze(w)) return w = tl(w, O.mode, N, null), w.return = O, w;
        kc(O, w);
      }
      return null;
    }
    function q(O, w, N, X) {
      var _e = w !== null ? w.key : null;
      if (typeof N == "string" && N !== "" || typeof N == "number") return _e !== null ? null : E(O, w, "" + N, X);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case J:
            return N.key === _e ? T(O, w, N, X) : null;
          case Ne:
            return N.key === _e ? U(O, w, N, X) : null;
          case zt:
            return _e = N._init, q(
              O,
              w,
              _e(N._payload),
              X
            );
        }
        if (Kn(N) || ze(N)) return _e !== null ? null : K(O, w, N, X, null);
        kc(O, N);
      }
      return null;
    }
    function Se(O, w, N, X, _e) {
      if (typeof X == "string" && X !== "" || typeof X == "number") return O = O.get(N) || null, E(w, O, "" + X, _e);
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case J:
            return O = O.get(X.key === null ? N : X.key) || null, T(w, O, X, _e);
          case Ne:
            return O = O.get(X.key === null ? N : X.key) || null, U(w, O, X, _e);
          case zt:
            var Ie = X._init;
            return Se(O, w, N, Ie(X._payload), _e);
        }
        if (Kn(X) || ze(X)) return O = O.get(N) || null, K(w, O, X, _e, null);
        kc(w, X);
      }
      return null;
    }
    function be(O, w, N, X) {
      for (var _e = null, Ie = null, $e = w, Xe = w = 0, tr = null; $e !== null && Xe < N.length; Xe++) {
        $e.index > Xe ? (tr = $e, $e = null) : tr = $e.sibling;
        var Ft = q(O, $e, N[Xe], X);
        if (Ft === null) {
          $e === null && ($e = tr);
          break;
        }
        n && $e && Ft.alternate === null && r(O, $e), w = d(Ft, w, Xe), Ie === null ? _e = Ft : Ie.sibling = Ft, Ie = Ft, $e = tr;
      }
      if (Xe === N.length) return l(O, $e), pn && hu(O, Xe), _e;
      if ($e === null) {
        for (; Xe < N.length; Xe++) $e = ee(O, N[Xe], X), $e !== null && (w = d($e, w, Xe), Ie === null ? _e = $e : Ie.sibling = $e, Ie = $e);
        return pn && hu(O, Xe), _e;
      }
      for ($e = o(O, $e); Xe < N.length; Xe++) tr = Se($e, O, Xe, N[Xe], X), tr !== null && (n && tr.alternate !== null && $e.delete(tr.key === null ? Xe : tr.key), w = d(tr, w, Xe), Ie === null ? _e = tr : Ie.sibling = tr, Ie = tr);
      return n && $e.forEach(function(Bl) {
        return r(O, Bl);
      }), pn && hu(O, Xe), _e;
    }
    function ke(O, w, N, X) {
      var _e = ze(N);
      if (typeof _e != "function") throw Error(D(150));
      if (N = _e.call(N), N == null) throw Error(D(151));
      for (var Ie = _e = null, $e = w, Xe = w = 0, tr = null, Ft = N.next(); $e !== null && !Ft.done; Xe++, Ft = N.next()) {
        $e.index > Xe ? (tr = $e, $e = null) : tr = $e.sibling;
        var Bl = q(O, $e, Ft.value, X);
        if (Bl === null) {
          $e === null && ($e = tr);
          break;
        }
        n && $e && Bl.alternate === null && r(O, $e), w = d(Bl, w, Xe), Ie === null ? _e = Bl : Ie.sibling = Bl, Ie = Bl, $e = tr;
      }
      if (Ft.done) return l(
        O,
        $e
      ), pn && hu(O, Xe), _e;
      if ($e === null) {
        for (; !Ft.done; Xe++, Ft = N.next()) Ft = ee(O, Ft.value, X), Ft !== null && (w = d(Ft, w, Xe), Ie === null ? _e = Ft : Ie.sibling = Ft, Ie = Ft);
        return pn && hu(O, Xe), _e;
      }
      for ($e = o(O, $e); !Ft.done; Xe++, Ft = N.next()) Ft = Se($e, O, Xe, Ft.value, X), Ft !== null && (n && Ft.alternate !== null && $e.delete(Ft.key === null ? Xe : Ft.key), w = d(Ft, w, Xe), Ie === null ? _e = Ft : Ie.sibling = Ft, Ie = Ft);
      return n && $e.forEach(function(hh) {
        return r(O, hh);
      }), pn && hu(O, Xe), _e;
    }
    function kn(O, w, N, X) {
      if (typeof N == "object" && N !== null && N.type === ve && N.key === null && (N = N.props.children), typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case J:
            e: {
              for (var _e = N.key, Ie = w; Ie !== null; ) {
                if (Ie.key === _e) {
                  if (_e = N.type, _e === ve) {
                    if (Ie.tag === 7) {
                      l(O, Ie.sibling), w = c(Ie, N.props.children), w.return = O, O = w;
                      break e;
                    }
                  } else if (Ie.elementType === _e || typeof _e == "object" && _e !== null && _e.$$typeof === zt && Nv(_e) === Ie.type) {
                    l(O, Ie.sibling), w = c(Ie, N.props), w.ref = mu(O, Ie, N), w.return = O, O = w;
                    break e;
                  }
                  l(O, Ie);
                  break;
                } else r(O, Ie);
                Ie = Ie.sibling;
              }
              N.type === ve ? (w = tl(N.props.children, O.mode, X, N.key), w.return = O, O = w) : (X = Hs(N.type, N.key, N.props, null, O.mode, X), X.ref = mu(O, w, N), X.return = O, O = X);
            }
            return m(O);
          case Ne:
            e: {
              for (Ie = N.key; w !== null; ) {
                if (w.key === Ie) if (w.tag === 4 && w.stateNode.containerInfo === N.containerInfo && w.stateNode.implementation === N.implementation) {
                  l(O, w.sibling), w = c(w, N.children || []), w.return = O, O = w;
                  break e;
                } else {
                  l(O, w);
                  break;
                }
                else r(O, w);
                w = w.sibling;
              }
              w = sf(N, O.mode, X), w.return = O, O = w;
            }
            return m(O);
          case zt:
            return Ie = N._init, kn(O, w, Ie(N._payload), X);
        }
        if (Kn(N)) return be(O, w, N, X);
        if (ze(N)) return ke(O, w, N, X);
        kc(O, N);
      }
      return typeof N == "string" && N !== "" || typeof N == "number" ? (N = "" + N, w !== null && w.tag === 6 ? (l(O, w.sibling), w = c(w, N), w.return = O, O = w) : (l(O, w), w = Gd(N, O.mode, X), w.return = O, O = w), m(O)) : l(O, w);
    }
    return kn;
  }
  var wn = yu(!0), he = yu(!1), va = Oa(null), Zr = null, mo = null, gd = null;
  function Sd() {
    gd = mo = Zr = null;
  }
  function Ed(n) {
    var r = va.current;
    un(va), n._currentValue = r;
  }
  function Cd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function gn(n, r) {
    Zr = n, gd = mo = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (jn = !0), n.firstContext = null);
  }
  function Na(n) {
    var r = n._currentValue;
    if (gd !== n) if (n = { context: n, memoizedValue: r, next: null }, mo === null) {
      if (Zr === null) throw Error(D(308));
      mo = n, Zr.dependencies = { lanes: 0, firstContext: n };
    } else mo = mo.next = n;
    return r;
  }
  var gu = null;
  function Rd(n) {
    gu === null ? gu = [n] : gu.push(n);
  }
  function Td(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Rd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
  }
  function ha(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ma = !1;
  function xd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function zv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, wt & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Rd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Oc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function Av(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var m = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = m : d = d.next = m, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: o.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function cs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, E = c.shared.pending;
    if (E !== null) {
      c.shared.pending = null;
      var T = E, U = T.next;
      T.next = null, m === null ? d = U : m.next = U, m = T;
      var K = n.alternate;
      K !== null && (K = K.updateQueue, E = K.lastBaseUpdate, E !== m && (E === null ? K.firstBaseUpdate = U : E.next = U, K.lastBaseUpdate = T));
    }
    if (d !== null) {
      var ee = c.baseState;
      m = 0, K = U = T = null, E = d;
      do {
        var q = E.lane, Se = E.eventTime;
        if ((o & q) === q) {
          K !== null && (K = K.next = {
            eventTime: Se,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var be = n, ke = E;
            switch (q = r, Se = l, ke.tag) {
              case 1:
                if (be = ke.payload, typeof be == "function") {
                  ee = be.call(Se, ee, q);
                  break e;
                }
                ee = be;
                break e;
              case 3:
                be.flags = be.flags & -65537 | 128;
              case 0:
                if (be = ke.payload, q = typeof be == "function" ? be.call(Se, ee, q) : be, q == null) break e;
                ee = fe({}, ee, q);
                break e;
              case 2:
                ma = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, q = c.effects, q === null ? c.effects = [E] : q.push(E));
        } else Se = { eventTime: Se, lane: q, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, K === null ? (U = K = Se, T = ee) : K = K.next = Se, m |= q;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          q = E, E = q.next, q.next = null, c.lastBaseUpdate = q, c.shared.pending = null;
        }
      } while (!0);
      if (K === null && (T = ee), c.baseState = T, c.firstBaseUpdate = U, c.lastBaseUpdate = K, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = ee;
    }
  }
  function wd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(D(191, c));
        c.call(o);
      }
    }
  }
  var fs = {}, bi = Oa(fs), ds = Oa(fs), ps = Oa(fs);
  function Su(n) {
    if (n === fs) throw Error(D(174));
    return n;
  }
  function bd(n, r) {
    switch (je(ps, r), je(ds, n), je(bi, fs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    un(bi), je(bi, r);
  }
  function Eu() {
    un(bi), un(ds), un(ps);
  }
  function Uv(n) {
    Su(ps.current);
    var r = Su(bi.current), l = ca(r, n.type);
    r !== l && (je(ds, n), je(bi, l));
  }
  function Mc(n) {
    ds.current === n && (un(bi), un(ds));
  }
  var Sn = Oa(0);
  function Lc(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var vs = [];
  function He() {
    for (var n = 0; n < vs.length; n++) vs[n]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var yt = le.ReactCurrentDispatcher, Ut = le.ReactCurrentBatchConfig, Xt = 0, jt = null, Un = null, Jn = null, Nc = !1, hs = !1, Cu = 0, G = 0;
  function Nt() {
    throw Error(D(321));
  }
  function We(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Nl(n, r, l, o, c, d) {
    if (Xt = d, jt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, yt.current = n === null || n.memoizedState === null ? Gc : Cs, n = l(o, c), hs) {
      d = 0;
      do {
        if (hs = !1, Cu = 0, 25 <= d) throw Error(D(301));
        d += 1, Jn = Un = null, r.updateQueue = null, yt.current = qc, n = l(o, c);
      } while (hs);
    }
    if (yt.current = bu, r = Un !== null && Un.next !== null, Xt = 0, Jn = Un = jt = null, Nc = !1, r) throw Error(D(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function Tr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jn === null ? jt.memoizedState = Jn = n : Jn = Jn.next = n, Jn;
  }
  function bn() {
    if (Un === null) {
      var n = jt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Un.next;
    var r = Jn === null ? jt.memoizedState : Jn.next;
    if (r !== null) Jn = r, Un = n;
    else {
      if (n === null) throw Error(D(310));
      Un = n, n = { memoizedState: Un.memoizedState, baseState: Un.baseState, baseQueue: Un.baseQueue, queue: Un.queue, next: null }, Jn === null ? jt.memoizedState = Jn = n : Jn = Jn.next = n;
    }
    return Jn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function zl(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(D(311));
    l.lastRenderedReducer = n;
    var o = Un, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var E = m = null, T = null, U = d;
      do {
        var K = U.lane;
        if ((Xt & K) === K) T !== null && (T = T.next = { lane: 0, action: U.action, hasEagerState: U.hasEagerState, eagerState: U.eagerState, next: null }), o = U.hasEagerState ? U.eagerState : n(o, U.action);
        else {
          var ee = {
            lane: K,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null
          };
          T === null ? (E = T = ee, m = o) : T = T.next = ee, jt.lanes |= K, Oi |= K;
        }
        U = U.next;
      } while (U !== null && U !== d);
      T === null ? m = o : T.next = E, ti(o, r.memoizedState) || (jn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, jt.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Ru(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(D(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (jn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function zc() {
  }
  function Ac(n, r) {
    var l = jt, o = bn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, jn = !0), o = o.queue, ms(Fc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jn !== null && Jn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Tu(9, jc.bind(null, l, o, c, r), void 0, null), Gn === null) throw Error(D(349));
      Xt & 30 || Uc(l, r, c);
    }
    return c;
  }
  function Uc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = jt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, jt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function jc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Hc(r) && Pc(n);
  }
  function Fc(n, r, l) {
    return l(function() {
      Hc(r) && Pc(n);
    });
  }
  function Hc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ti(n, l);
    } catch {
      return !0;
    }
  }
  function Pc(n) {
    var r = ha(n, 1);
    r !== null && Ar(r, n, 1, -1);
  }
  function Vc(n) {
    var r = Tr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = wu.bind(null, jt, n), [r.memoizedState, n];
  }
  function Tu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = jt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, jt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Bc() {
    return bn().memoizedState;
  }
  function yo(n, r, l, o) {
    var c = Tr();
    jt.flags |= n, c.memoizedState = Tu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function go(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Un !== null) {
      var m = Un.memoizedState;
      if (d = m.destroy, o !== null && We(o, m.deps)) {
        c.memoizedState = Tu(r, l, d, o);
        return;
      }
    }
    jt.flags |= n, c.memoizedState = Tu(1 | r, l, d, o);
  }
  function Ic(n, r) {
    return yo(8390656, 8, n, r);
  }
  function ms(n, r) {
    return go(2048, 8, n, r);
  }
  function Yc(n, r) {
    return go(4, 2, n, r);
  }
  function ys(n, r) {
    return go(4, 4, n, r);
  }
  function xu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function $c(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(4, 4, xu.bind(null, r, n), l);
  }
  function gs() {
  }
  function Qc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && We(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Wc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && We(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function _d(n, r, l) {
    return Xt & 21 ? (ti(l, r) || (l = Ku(), jt.lanes |= l, Oi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, jn = !0), n.memoizedState = l);
  }
  function Ss(n, r) {
    var l = At;
    At = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Ut.transition;
    Ut.transition = {};
    try {
      n(!1), r();
    } finally {
      At = l, Ut.transition = o;
    }
  }
  function Dd() {
    return bn().memoizedState;
  }
  function Es(n, r, l) {
    var o = Mi(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Jr(n)) jv(r, l);
    else if (l = Td(n, r, l, o), l !== null) {
      var c = Pn();
      Ar(l, n, o, c), en(l, r, o);
    }
  }
  function wu(n, r, l) {
    var o = Mi(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Jr(n)) jv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, E = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = E, ti(E, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Rd(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Td(n, r, c, o), l !== null && (c = Pn(), Ar(l, n, o, c), en(l, r, o));
    }
  }
  function Jr(n) {
    var r = n.alternate;
    return n === jt || r !== null && r === jt;
  }
  function jv(n, r) {
    hs = Nc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function en(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var bu = { readContext: Na, useCallback: Nt, useContext: Nt, useEffect: Nt, useImperativeHandle: Nt, useInsertionEffect: Nt, useLayoutEffect: Nt, useMemo: Nt, useReducer: Nt, useRef: Nt, useState: Nt, useDebugValue: Nt, useDeferredValue: Nt, useTransition: Nt, useMutableSource: Nt, useSyncExternalStore: Nt, useId: Nt, unstable_isNewReconciler: !1 }, Gc = { readContext: Na, useCallback: function(n, r) {
    return Tr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Na, useEffect: Ic, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(
      4194308,
      4,
      xu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return yo(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return yo(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Tr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Tr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Es.bind(null, jt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Tr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Vc, useDebugValue: gs, useDeferredValue: function(n) {
    return Tr().memoizedState = n;
  }, useTransition: function() {
    var n = Vc(!1), r = n[0];
    return n = Ss.bind(null, n[1]), Tr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = jt, c = Tr();
    if (pn) {
      if (l === void 0) throw Error(D(407));
      l = l();
    } else {
      if (l = r(), Gn === null) throw Error(D(349));
      Xt & 30 || Uc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Ic(Fc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Tu(9, jc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Tr(), r = Gn.identifierPrefix;
    if (pn) {
      var l = wi, o = xi;
      l = (o & ~(1 << 32 - kr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = G++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Cs = {
    readContext: Na,
    useCallback: Qc,
    useContext: Na,
    useEffect: ms,
    useImperativeHandle: $c,
    useInsertionEffect: Yc,
    useLayoutEffect: ys,
    useMemo: Wc,
    useReducer: zl,
    useRef: Bc,
    useState: function() {
      return zl(Xi);
    },
    useDebugValue: gs,
    useDeferredValue: function(n) {
      var r = bn();
      return _d(r, Un.memoizedState, n);
    },
    useTransition: function() {
      var n = zl(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: zc,
    useSyncExternalStore: Ac,
    useId: Dd,
    unstable_isNewReconciler: !1
  }, qc = { readContext: Na, useCallback: Qc, useContext: Na, useEffect: ms, useImperativeHandle: $c, useInsertionEffect: Yc, useLayoutEffect: ys, useMemo: Wc, useReducer: Ru, useRef: Bc, useState: function() {
    return Ru(Xi);
  }, useDebugValue: gs, useDeferredValue: function(n) {
    var r = bn();
    return Un === null ? r.memoizedState = n : _d(r, Un.memoizedState, n);
  }, useTransition: function() {
    var n = Ru(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: zc, useSyncExternalStore: Ac, useId: Dd, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = fe({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function kd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : fe({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Kc = { isMounted: function(n) {
    return (n = n._reactInternals) ? rt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Mi(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Ar(r, n, c, o), Oc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Mi(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Ar(r, n, c, o), Oc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Pn(), o = Mi(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (Ar(r, n, o, l), Oc(r, n, o));
  } };
  function Fv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !es(l, o) || !es(c, d) : !0;
  }
  function Xc(n, r, l) {
    var o = !1, c = Rr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Na(d) : (c = zn(r) ? Gr : Cn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : Rr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Kc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Hv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Kc.enqueueReplaceState(r, r.state, null);
  }
  function Rs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, xd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Na(d) : (d = zn(r) ? Gr : Cn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (kd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Kc.enqueueReplaceState(c, c.state, null), cs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += vt(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Od(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Md(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var Zc = typeof WeakMap == "function" ? WeakMap : Map;
  function Pv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      xo || (xo = !0, Ou = o), Md(n, r);
    }, l;
  }
  function Ld(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Md(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Md(n, r), typeof o != "function" && (jl === null ? jl = /* @__PURE__ */ new Set([this]) : jl.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Nd(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Zc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = yy.bind(null, n, r, l), r.then(n, n));
  }
  function Vv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Al(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n);
  }
  var Ts = le.ReactCurrentOwner, jn = !1;
  function or(n, r, l, o) {
    r.child = n === null ? he(r, null, l, o) : wn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gn(r, c), o = Nl(n, r, l, o, d, c), l = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Aa(n, r, c)) : (pn && l && bc(r), r.flags |= 1, or(n, r, o, c), r.child);
  }
  function Du(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Wd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, it(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref) return Aa(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function it(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref) if (jn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (jn = !0);
      else return r.lanes = n.lanes, Aa(n, r, c);
    }
    return Bv(n, r, l, o, c);
  }
  function xs(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, je(Co, ya), ya |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, je(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, je(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, je(Co, ya), ya |= o;
    return or(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Bv(n, r, l, o, c) {
    var d = zn(l) ? Gr : Cn.current;
    return d = qr(r, d), gn(r, c), l = Nl(n, r, l, o, d, c), o = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Aa(n, r, c)) : (pn && o && bc(r), r.flags |= 1, or(n, r, l, c), r.child);
  }
  function Iv(n, r, l, o, c) {
    if (zn(l)) {
      var d = !0;
      Zn(r);
    } else d = !1;
    if (gn(r, c), r.stateNode === null) za(n, r), Xc(r, l, o), Rs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var T = m.context, U = l.contextType;
      typeof U == "object" && U !== null ? U = Na(U) : (U = zn(l) ? Gr : Cn.current, U = qr(r, U));
      var K = l.getDerivedStateFromProps, ee = typeof K == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      ee || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== U) && Hv(r, m, o, U), ma = !1;
      var q = r.memoizedState;
      m.state = q, cs(r, o, m, c), T = r.memoizedState, E !== o || q !== T || Qn.current || ma ? (typeof K == "function" && (kd(r, l, K, o), T = r.memoizedState), (E = ma || Fv(r, l, E, o, q, T, U)) ? (ee || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = U, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, zv(n, r), E = r.memoizedProps, U = r.type === r.elementType ? E : ai(r.type, E), m.props = U, ee = r.pendingProps, q = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Na(T) : (T = zn(l) ? Gr : Cn.current, T = qr(r, T));
      var Se = l.getDerivedStateFromProps;
      (K = typeof Se == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== ee || q !== T) && Hv(r, m, o, T), ma = !1, q = r.memoizedState, m.state = q, cs(r, o, m, c);
      var be = r.memoizedState;
      E !== ee || q !== be || Qn.current || ma ? (typeof Se == "function" && (kd(r, l, Se, o), be = r.memoizedState), (U = ma || Fv(r, l, U, o, q, be, T) || !1) ? (K || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, be, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, be, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = be), m.props = o, m.state = be, m.context = T, o = U) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return ws(n, r, l, o, d, c);
  }
  function ws(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && xc(r, l, !1), Aa(n, r, d);
    o = r.stateNode, Ts.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = wn(r, n.child, null, d), r.child = wn(r, null, E, d)) : or(n, r, E, d), r.memoizedState = o.state, c && xc(r, l, !0), r.child;
  }
  function So(n) {
    var r = n.stateNode;
    r.pendingContext ? Ov(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Ov(n, r.context, !1), bd(n, r.containerInfo);
  }
  function Yv(n, r, l, o, c) {
    return Ml(), qi(c), r.flags |= 256, or(n, r, l, o), r.child;
  }
  var Jc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ad(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function ef(n, r, l) {
    var o = r.pendingProps, c = Sn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), je(Sn, c & 1), n === null)
      return yd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ad(l), r.memoizedState = Jc, n) : Ud(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return $v(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Hl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Hl(E, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ad(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = Jc, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Ud(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function bs(n, r, l, o) {
    return o !== null && qi(o), wn(r, n.child, null, l), n = Ud(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function $v(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Od(Error(D(422))), bs(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && wn(r, n.child, null, m), r.child.memoizedState = Ad(m), r.memoizedState = Jc, d);
    if (!(r.mode & 1)) return bs(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(D(419)), o = Od(d, o, void 0), bs(n, r, m, o);
    }
    if (E = (m & n.childLanes) !== 0, jn || E) {
      if (o = Gn, o !== null) {
        switch (m & -m) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), Ar(o, n, c, -1));
      }
      return Qd(), o = Od(Error(D(421))), bs(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = gy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, pn = !0, La = null, n !== null && (An[Ma++] = xi, An[Ma++] = wi, An[Ma++] = pa, xi = n.id, wi = n.overflow, pa = r), r = Ud(r, o.children), r.flags |= 4096, r);
  }
  function jd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Cd(n.return, r, l);
  }
  function Lr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function _i(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (or(n, r, o.children, l), o = Sn.current, o & 2) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && jd(n, l, r);
        else if (n.tag === 19) jd(n, l, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      o &= 1;
    }
    if (je(Sn, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Lc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Lr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Lc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Lr(r, !0, l, null, d);
        break;
      case "together":
        Lr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function za(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Aa(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(D(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function _s(n, r, l) {
    switch (r.tag) {
      case 3:
        So(r), Ml();
        break;
      case 5:
        Uv(r);
        break;
      case 1:
        zn(r.type) && Zn(r);
        break;
      case 4:
        bd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        je(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (je(Sn, Sn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? ef(n, r, l) : (je(Sn, Sn.current & 1), n = Aa(n, r, l), n !== null ? n.sibling : null);
        je(Sn, Sn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), je(Sn, Sn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, xs(n, r, l);
    }
    return Aa(n, r, l);
  }
  var Ua, Fn, Qv, Wv;
  Ua = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, Fn = function() {
  }, Qv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(bi.current);
      var d = null;
      switch (l) {
        case "input":
          c = rr(n, c), o = rr(n, o), d = [];
          break;
        case "select":
          c = fe({}, c, { value: void 0 }), o = fe({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = wl);
      }
      sn(l, o);
      var m;
      l = null;
      for (U in c) if (!o.hasOwnProperty(U) && c.hasOwnProperty(U) && c[U] != null) if (U === "style") {
        var E = c[U];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else U !== "dangerouslySetInnerHTML" && U !== "children" && U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && U !== "autoFocus" && (oe.hasOwnProperty(U) ? d || (d = []) : (d = d || []).push(U, null));
      for (U in o) {
        var T = o[U];
        if (E = c != null ? c[U] : void 0, o.hasOwnProperty(U) && T !== E && (T != null || E != null)) if (U === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          U,
          l
        )), l = T;
        else U === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(U, T)) : U === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(U, "" + T) : U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && (oe.hasOwnProperty(U) ? (T != null && U === "onScroll" && It("scroll", n), d || E === T || (d = [])) : (d = d || []).push(U, T));
      }
      l && (d = d || []).push("style", l);
      var U = d;
      (r.updateQueue = U) && (r.flags |= 4);
    }
  }, Wv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Ds(n, r) {
    if (!pn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var o = null; l !== null; ) l.alternate !== null && (o = l), l = l.sibling;
        o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
    }
  }
  function er(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Gv(n, r, l) {
    var o = r.pendingProps;
    switch (_c(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return er(r), null;
      case 1:
        return zn(r.type) && vo(), er(r), null;
      case 3:
        return o = r.stateNode, Eu(), un(Qn), un(Cn), He(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, La !== null && (Mu(La), La = null))), Fn(n, r), er(r), null;
      case 5:
        Mc(r);
        var c = Su(ps.current);
        if (l = r.type, n !== null && r.stateNode != null) Qv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(D(166));
            return er(r), null;
          }
          if (n = Su(bi.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[ls] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                It("cancel", o), It("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                It("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < rs.length; c++) It(rs[c], o);
                break;
              case "source":
                It("error", o);
                break;
              case "img":
              case "image":
              case "link":
                It(
                  "error",
                  o
                ), It("load", o);
                break;
              case "details":
                It("toggle", o);
                break;
              case "input":
                Bn(o, d), It("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, It("invalid", o);
                break;
              case "textarea":
                Sr(o, d), It("invalid", o);
            }
            sn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var E = d[m];
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Ec(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Ec(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : oe.hasOwnProperty(m) && E != null && m === "onScroll" && It("scroll", o);
            }
            switch (l) {
              case "input":
                Mn(o), ci(o, d, !0);
                break;
              case "textarea":
                Mn(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = wl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Er(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[ls] = o, Ua(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Xn(l, o), l) {
                case "dialog":
                  It("cancel", n), It("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  It("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < rs.length; c++) It(rs[c], n);
                  c = o;
                  break;
                case "source":
                  It("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  It(
                    "error",
                    n
                  ), It("load", n), c = o;
                  break;
                case "details":
                  It("toggle", n), c = o;
                  break;
                case "input":
                  Bn(n, o), c = rr(n, o), It("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = fe({}, o, { value: void 0 }), It("invalid", n);
                  break;
                case "textarea":
                  Sr(n, o), c = Yn(n, o), It("invalid", n);
                  break;
                default:
                  c = o;
              }
              sn(l, c), E = c;
              for (d in E) if (E.hasOwnProperty(d)) {
                var T = E[d];
                d === "style" ? nn(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && fi(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && se(n, T) : typeof T == "number" && se(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (oe.hasOwnProperty(d) ? T != null && d === "onScroll" && It("scroll", n) : T != null && Ke(n, d, T, m));
              }
              switch (l) {
                case "input":
                  Mn(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Mn(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + st(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? Tn(n, !!o.multiple, d, !1) : o.defaultValue != null && Tn(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = wl);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return er(r), null;
      case 6:
        if (n && r.stateNode != null) Wv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(D(166));
          if (l = Su(ps.current), Su(bi.current), Dc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ci] = r, (d = o.nodeValue !== l) && (n = Kr, n !== null)) switch (n.tag) {
              case 3:
                Ec(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Ec(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ci] = r, r.stateNode = o;
        }
        return er(r), null;
      case 13:
        if (un(Sn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (pn && Xr !== null && r.mode & 1 && !(r.flags & 128)) ss(), Ml(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(D(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(D(317));
              d[Ci] = r;
            } else Ml(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            er(r), d = !1;
          } else La !== null && (Mu(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || Sn.current & 1 ? Dn === 0 && (Dn = 3) : Qd())), r.updateQueue !== null && (r.flags |= 4), er(r), null);
      case 4:
        return Eu(), Fn(n, r), n === null && oo(r.stateNode.containerInfo), er(r), null;
      case 10:
        return Ed(r.type._context), er(r), null;
      case 17:
        return zn(r.type) && vo(), er(r), null;
      case 19:
        if (un(Sn), d = r.memoizedState, d === null) return er(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) Ds(d, !1);
        else {
          if (Dn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (m = Lc(n), m !== null) {
              for (r.flags |= 128, Ds(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return je(Sn, Sn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && at() > To && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Lc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ds(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return er(r), null;
          } else 2 * at() - d.renderingStartTime > To && l !== 1073741824 && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = at(), r.sibling = null, l = Sn.current, je(Sn, o ? l & 1 | 2 : l & 1), r) : (er(r), null);
      case 22:
      case 23:
        return $d(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ya & 1073741824 && (er(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : er(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(D(156, r.tag));
  }
  function tf(n, r) {
    switch (_c(r), r.tag) {
      case 1:
        return zn(r.type) && vo(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), un(Qn), un(Cn), He(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (un(Sn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(D(340));
          Ml();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return un(Sn), null;
      case 4:
        return Eu(), null;
      case 10:
        return Ed(r.type._context), null;
      case 22:
      case 23:
        return $d(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ks = !1, xr = !1, fy = typeof WeakSet == "function" ? WeakSet : Set, Te = null;
  function Eo(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      vn(n, r, o);
    }
    else l.current = null;
  }
  function nf(n, r, l) {
    try {
      l();
    } catch (o) {
      vn(n, r, o);
    }
  }
  var qv = !1;
  function Kv(n, r) {
    if (is = _a, n = ts(), dc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var o = l.getSelection && l.getSelection();
        if (o && o.rangeCount !== 0) {
          l = o.anchorNode;
          var c = o.anchorOffset, d = o.focusNode;
          o = o.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var m = 0, E = -1, T = -1, U = 0, K = 0, ee = n, q = null;
          t: for (; ; ) {
            for (var Se; ee !== l || c !== 0 && ee.nodeType !== 3 || (E = m + c), ee !== d || o !== 0 && ee.nodeType !== 3 || (T = m + o), ee.nodeType === 3 && (m += ee.nodeValue.length), (Se = ee.firstChild) !== null; )
              q = ee, ee = Se;
            for (; ; ) {
              if (ee === n) break t;
              if (q === l && ++U === c && (E = m), q === d && ++K === o && (T = m), (Se = ee.nextSibling) !== null) break;
              ee = q, q = ee.parentNode;
            }
            ee = Se;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, Te = r; Te !== null; ) if (r = Te, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Te = n;
    else for (; Te !== null; ) {
      r = Te;
      try {
        var be = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (be !== null) {
              var ke = be.memoizedProps, kn = be.memoizedState, O = r.stateNode, w = O.getSnapshotBeforeUpdate(r.elementType === r.type ? ke : ai(r.type, ke), kn);
              O.__reactInternalSnapshotBeforeUpdate = w;
            }
            break;
          case 3:
            var N = r.stateNode.containerInfo;
            N.nodeType === 1 ? N.textContent = "" : N.nodeType === 9 && N.documentElement && N.removeChild(N.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(D(163));
        }
      } catch (X) {
        vn(r, r.return, X);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Te = n;
        break;
      }
      Te = r.return;
    }
    return be = qv, qv = !1, be;
  }
  function Os(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && nf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Ms(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Fd(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function rf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, rf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[ls], delete r[us], delete r[po], delete r[sy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ls(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Zi(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ls(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = wl));
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  function ki(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  var _n = null, Nr = !1;
  function zr(n, r, l) {
    for (l = l.child; l !== null; ) Xv(n, r, l), l = l.sibling;
  }
  function Xv(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        xr || Eo(l, r);
      case 6:
        var o = _n, c = Nr;
        _n = null, zr(n, r, l), _n = o, Nr = c, _n !== null && (Nr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : _n.removeChild(l.stateNode));
        break;
      case 18:
        _n !== null && (Nr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? fo(n.parentNode, l) : n.nodeType === 1 && fo(n, l), Ja(n)) : fo(_n, l.stateNode));
        break;
      case 4:
        o = _n, c = Nr, _n = l.stateNode.containerInfo, Nr = !0, zr(n, r, l), _n = o, Nr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!xr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && nf(l, r, m), c = c.next;
          } while (c !== o);
        }
        zr(n, r, l);
        break;
      case 1:
        if (!xr && (Eo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (E) {
          vn(l, r, E);
        }
        zr(n, r, l);
        break;
      case 21:
        zr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (xr = (o = xr) || l.memoizedState !== null, zr(n, r, l), xr = o) : zr(n, r, l);
        break;
      default:
        zr(n, r, l);
    }
  }
  function Zv(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new fy()), r.forEach(function(o) {
        var c = uh.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ii(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, E = m;
        e: for (; E !== null; ) {
          switch (E.tag) {
            case 5:
              _n = E.stateNode, Nr = !1;
              break e;
            case 3:
              _n = E.stateNode.containerInfo, Nr = !0;
              break e;
            case 4:
              _n = E.stateNode.containerInfo, Nr = !0;
              break e;
          }
          E = E.return;
        }
        if (_n === null) throw Error(D(160));
        Xv(d, m, c), _n = null, Nr = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (U) {
        vn(c, r, U);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Hd(r, n), r = r.sibling;
  }
  function Hd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Os(3, n, n.return), Ms(3, n);
          } catch (ke) {
            vn(n, n.return, ke);
          }
          try {
            Os(5, n, n.return);
          } catch (ke) {
            vn(n, n.return, ke);
          }
        }
        break;
      case 1:
        ii(r, n), ta(n), o & 512 && l !== null && Eo(l, l.return);
        break;
      case 5:
        if (ii(r, n), ta(n), o & 512 && l !== null && Eo(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            se(c, "");
          } catch (ke) {
            vn(n, n.return, ke);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && In(c, d), Xn(E, m);
            var U = Xn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var K = T[m], ee = T[m + 1];
              K === "style" ? nn(c, ee) : K === "dangerouslySetInnerHTML" ? fi(c, ee) : K === "children" ? se(c, ee) : Ke(c, K, ee, U);
            }
            switch (E) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var q = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var Se = d.value;
                Se != null ? Tn(c, !!d.multiple, Se, !1) : q !== !!d.multiple && (d.defaultValue != null ? Tn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Tn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[ls] = d;
          } catch (ke) {
            vn(n, n.return, ke);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(D(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (ke) {
            vn(n, n.return, ke);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Ja(r.containerInfo);
        } catch (ke) {
          vn(n, n.return, ke);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Bd = at())), o & 4 && Zv(n);
        break;
      case 22:
        if (K = l !== null && l.memoizedState !== null, n.mode & 1 ? (xr = (U = xr) || K, ii(r, n), xr = U) : ii(r, n), ta(n), o & 8192) {
          if (U = n.memoizedState !== null, (n.stateNode.isHidden = U) && !K && n.mode & 1) for (Te = n, K = n.child; K !== null; ) {
            for (ee = Te = K; Te !== null; ) {
              switch (q = Te, Se = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, q, q.return);
                  break;
                case 1:
                  Eo(q, q.return);
                  var be = q.stateNode;
                  if (typeof be.componentWillUnmount == "function") {
                    o = q, l = q.return;
                    try {
                      r = o, be.props = r.memoizedProps, be.state = r.memoizedState, be.componentWillUnmount();
                    } catch (ke) {
                      vn(o, l, ke);
                    }
                  }
                  break;
                case 5:
                  Eo(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    Ns(ee);
                    continue;
                  }
              }
              Se !== null ? (Se.return = q, Te = Se) : Ns(ee);
            }
            K = K.sibling;
          }
          e: for (K = null, ee = n; ; ) {
            if (ee.tag === 5) {
              if (K === null) {
                K = ee;
                try {
                  c = ee.stateNode, U ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = ee.stateNode, T = ee.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = Bt("display", m));
                } catch (ke) {
                  vn(n, n.return, ke);
                }
              }
            } else if (ee.tag === 6) {
              if (K === null) try {
                ee.stateNode.nodeValue = U ? "" : ee.memoizedProps;
              } catch (ke) {
                vn(n, n.return, ke);
              }
            } else if ((ee.tag !== 22 && ee.tag !== 23 || ee.memoizedState === null || ee === n) && ee.child !== null) {
              ee.child.return = ee, ee = ee.child;
              continue;
            }
            if (ee === n) break e;
            for (; ee.sibling === null; ) {
              if (ee.return === null || ee.return === n) break e;
              K === ee && (K = null), ee = ee.return;
            }
            K === ee && (K = null), ee.sibling.return = ee.return, ee = ee.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && Zv(n);
        break;
      case 21:
        break;
      default:
        ii(
          r,
          n
        ), ta(n);
    }
  }
  function ta(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ls(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(D(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (se(c, ""), o.flags &= -33);
            var d = Zi(n);
            ki(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Zi(n);
            Di(n, E, m);
            break;
          default:
            throw Error(D(161));
        }
      } catch (T) {
        vn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function dy(n, r, l) {
    Te = n, Pd(n);
  }
  function Pd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Te !== null; ) {
      var c = Te, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || ks;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || xr;
          E = ks;
          var U = xr;
          if (ks = m, (xr = T) && !U) for (Te = c; Te !== null; ) m = Te, T = m.child, m.tag === 22 && m.memoizedState !== null ? Vd(c) : T !== null ? (T.return = m, Te = T) : Vd(c);
          for (; d !== null; ) Te = d, Pd(d), d = d.sibling;
          Te = c, ks = E, xr = U;
        }
        Jv(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, Te = d) : Jv(n);
    }
  }
  function Jv(n) {
    for (; Te !== null; ) {
      var r = Te;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              xr || Ms(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !xr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && wd(r, d, o);
              break;
            case 3:
              var m = r.updateQueue;
              if (m !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                wd(r, m, l);
              }
              break;
            case 5:
              var E = r.stateNode;
              if (l === null && r.flags & 4) {
                l = E;
                var T = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    T.autoFocus && l.focus();
                    break;
                  case "img":
                    T.src && (l.src = T.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var U = r.alternate;
                if (U !== null) {
                  var K = U.memoizedState;
                  if (K !== null) {
                    var ee = K.dehydrated;
                    ee !== null && Ja(ee);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(D(163));
          }
          xr || r.flags & 512 && Fd(r);
        } catch (q) {
          vn(r, r.return, q);
        }
      }
      if (r === n) {
        Te = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Te = l;
        break;
      }
      Te = r.return;
    }
  }
  function Ns(n) {
    for (; Te !== null; ) {
      var r = Te;
      if (r === n) {
        Te = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Te = l;
        break;
      }
      Te = r.return;
    }
  }
  function Vd(n) {
    for (; Te !== null; ) {
      var r = Te;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ms(4, r);
            } catch (T) {
              vn(r, l, T);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (T) {
                vn(r, c, T);
              }
            }
            var d = r.return;
            try {
              Fd(r);
            } catch (T) {
              vn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Fd(r);
            } catch (T) {
              vn(r, m, T);
            }
        }
      } catch (T) {
        vn(r, r.return, T);
      }
      if (r === n) {
        Te = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, Te = E;
        break;
      }
      Te = r.return;
    }
  }
  var py = Math.ceil, Ul = le.ReactCurrentDispatcher, ku = le.ReactCurrentOwner, sr = le.ReactCurrentBatchConfig, wt = 0, Gn = null, Hn = null, cr = 0, ya = 0, Co = Oa(0), Dn = 0, zs = null, Oi = 0, Ro = 0, af = 0, As = null, na = null, Bd = 0, To = 1 / 0, ga = null, xo = !1, Ou = null, jl = null, lf = !1, Ji = null, Us = 0, Fl = 0, wo = null, js = -1, wr = 0;
  function Pn() {
    return wt & 6 ? at() : js !== -1 ? js : js = at();
  }
  function Mi(n) {
    return n.mode & 1 ? wt & 2 && cr !== 0 ? cr & -cr : cy.transition !== null ? (wr === 0 && (wr = Ku()), wr) : (n = At, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ro(n.type)), n) : 1;
  }
  function Ar(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, wo = null, Error(D(185));
    Pi(n, l, o), (!(wt & 2) || n !== Gn) && (n === Gn && (!(wt & 2) && (Ro |= l), Dn === 4 && li(n, cr)), ra(n, o), l === 1 && wt === 0 && !(r.mode & 1) && (To = at() + 500, ho && Ti()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Za(n, n === Gn ? cr : 0);
    if (o === 0) l !== null && ir(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ir(l), r === 1) n.tag === 0 ? _l(Id.bind(null, n)) : wc(Id.bind(null, n)), co(function() {
        !(wt & 6) && Ti();
      }), l = null;
      else {
        switch (Zu(o)) {
          case 1:
            l = Ka;
            break;
          case 4:
            l = nu;
            break;
          case 16:
            l = ru;
            break;
          case 536870912:
            l = Wu;
            break;
          default:
            l = ru;
        }
        l = sh(l, uf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function uf(n, r) {
    if (js = -1, wr = 0, wt & 6) throw Error(D(327));
    var l = n.callbackNode;
    if (bo() && n.callbackNode !== l) return null;
    var o = Za(n, n === Gn ? cr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = of(n, o);
    else {
      r = o;
      var c = wt;
      wt |= 2;
      var d = th();
      (Gn !== n || cr !== r) && (ga = null, To = at() + 500, el(n, r));
      do
        try {
          nh();
          break;
        } catch (E) {
          eh(n, E);
        }
      while (!0);
      Sd(), Ul.current = d, wt = c, Hn !== null ? r = 0 : (Gn = null, cr = 0, r = Dn);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Fs(n, c))), r === 1) throw l = zs, el(n, 0), li(n, o), ra(n, at()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !vy(c) && (r = of(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Fs(n, d))), r === 1)) throw l = zs, el(n, 0), li(n, o), ra(n, at()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(D(345));
          case 2:
            Nu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Bd + 500 - at(), 10 < r)) {
              if (Za(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Pn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Rc(Nu.bind(null, n, na, ga), r);
              break;
            }
            Nu(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - kr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = at() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * py(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Rc(Nu.bind(null, n, na, ga), o);
              break;
            }
            Nu(n, na, ga);
            break;
          case 5:
            Nu(n, na, ga);
            break;
          default:
            throw Error(D(329));
        }
      }
    }
    return ra(n, at()), n.callbackNode === l ? uf.bind(null, n) : null;
  }
  function Fs(n, r) {
    var l = As;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = of(n, r), n !== 2 && (r = na, na = l, r !== null && Mu(r)), n;
  }
  function Mu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function vy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ti(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null) l.return = r, r = l;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function li(n, r) {
    for (r &= ~af, r &= ~Ro, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - kr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Id(n) {
    if (wt & 6) throw Error(D(327));
    bo();
    var r = Za(n, 0);
    if (!(r & 1)) return ra(n, at()), null;
    var l = of(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Fs(n, o));
    }
    if (l === 1) throw l = zs, el(n, 0), li(n, r), ra(n, at()), l;
    if (l === 6) throw Error(D(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Nu(n, na, ga), ra(n, at()), null;
  }
  function Yd(n, r) {
    var l = wt;
    wt |= 1;
    try {
      return n(r);
    } finally {
      wt = l, wt === 0 && (To = at() + 500, ho && Ti());
    }
  }
  function Lu(n) {
    Ji !== null && Ji.tag === 0 && !(wt & 6) && bo();
    var r = wt;
    wt |= 1;
    var l = sr.transition, o = At;
    try {
      if (sr.transition = null, At = 1, n) return n();
    } finally {
      At = o, sr.transition = l, wt = r, !(wt & 6) && Ti();
    }
  }
  function $d() {
    ya = Co.current, un(Co);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, vd(l)), Hn !== null) for (l = Hn.return; l !== null; ) {
      var o = l;
      switch (_c(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && vo();
          break;
        case 3:
          Eu(), un(Qn), un(Cn), He();
          break;
        case 5:
          Mc(o);
          break;
        case 4:
          Eu();
          break;
        case 13:
          un(Sn);
          break;
        case 19:
          un(Sn);
          break;
        case 10:
          Ed(o.type._context);
          break;
        case 22:
        case 23:
          $d();
      }
      l = l.return;
    }
    if (Gn = n, Hn = n = Hl(n.current, null), cr = ya = r, Dn = 0, zs = null, af = Ro = Oi = 0, na = As = null, gu !== null) {
      for (r = 0; r < gu.length; r++) if (l = gu[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      gu = null;
    }
    return n;
  }
  function eh(n, r) {
    do {
      var l = Hn;
      try {
        if (Sd(), yt.current = bu, Nc) {
          for (var o = jt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Nc = !1;
        }
        if (Xt = 0, Jn = Un = jt = null, hs = !1, Cu = 0, ku.current = null, l === null || l.return === null) {
          Dn = 1, zs = r, Hn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = cr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var U = T, K = E, ee = K.tag;
            if (!(K.mode & 1) && (ee === 0 || ee === 11 || ee === 15)) {
              var q = K.alternate;
              q ? (K.updateQueue = q.updateQueue, K.memoizedState = q.memoizedState, K.lanes = q.lanes) : (K.updateQueue = null, K.memoizedState = null);
            }
            var Se = Vv(m);
            if (Se !== null) {
              Se.flags &= -257, Al(Se, m, E, d, r), Se.mode & 1 && Nd(d, U, r), r = Se, T = U;
              var be = r.updateQueue;
              if (be === null) {
                var ke = /* @__PURE__ */ new Set();
                ke.add(T), r.updateQueue = ke;
              } else be.add(T);
              break e;
            } else {
              if (!(r & 1)) {
                Nd(d, U, r), Qd();
                break e;
              }
              T = Error(D(426));
            }
          } else if (pn && E.mode & 1) {
            var kn = Vv(m);
            if (kn !== null) {
              !(kn.flags & 65536) && (kn.flags |= 256), Al(kn, m, E, d, r), qi(_u(T, E));
              break e;
            }
          }
          d = T = _u(T, E), Dn !== 4 && (Dn = 2), As === null ? As = [d] : As.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var O = Pv(d, T, r);
                Av(d, O);
                break e;
              case 1:
                E = T;
                var w = d.type, N = d.stateNode;
                if (!(d.flags & 128) && (typeof w.getDerivedStateFromError == "function" || N !== null && typeof N.componentDidCatch == "function" && (jl === null || !jl.has(N)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var X = Ld(d, E, r);
                  Av(d, X);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        ah(l);
      } catch (_e) {
        r = _e, Hn === l && l !== null && (Hn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function th() {
    var n = Ul.current;
    return Ul.current = bu, n === null ? bu : n;
  }
  function Qd() {
    (Dn === 0 || Dn === 3 || Dn === 2) && (Dn = 4), Gn === null || !(Oi & 268435455) && !(Ro & 268435455) || li(Gn, cr);
  }
  function of(n, r) {
    var l = wt;
    wt |= 2;
    var o = th();
    (Gn !== n || cr !== r) && (ga = null, el(n, r));
    do
      try {
        hy();
        break;
      } catch (c) {
        eh(n, c);
      }
    while (!0);
    if (Sd(), wt = l, Ul.current = o, Hn !== null) throw Error(D(261));
    return Gn = null, cr = 0, Dn;
  }
  function hy() {
    for (; Hn !== null; ) rh(Hn);
  }
  function nh() {
    for (; Hn !== null && !Ga(); ) rh(Hn);
  }
  function rh(n) {
    var r = oh(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? ah(n) : Hn = r, ku.current = null;
  }
  function ah(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = tf(l, r), l !== null) {
          l.flags &= 32767, Hn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Dn = 6, Hn = null;
          return;
        }
      } else if (l = Gv(l, r, ya), l !== null) {
        Hn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Hn = r;
        return;
      }
      Hn = r = n;
    } while (r !== null);
    Dn === 0 && (Dn = 5);
  }
  function Nu(n, r, l) {
    var o = At, c = sr.transition;
    try {
      sr.transition = null, At = 1, my(n, r, l, o);
    } finally {
      sr.transition = c, At = o;
    }
    return null;
  }
  function my(n, r, l, o) {
    do
      bo();
    while (Ji !== null);
    if (wt & 6) throw Error(D(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(D(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Wf(n, d), n === Gn && (Hn = Gn = null, cr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || lf || (lf = !0, sh(ru, function() {
      return bo(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = sr.transition, sr.transition = null;
      var m = At;
      At = 1;
      var E = wt;
      wt |= 4, ku.current = null, Kv(n, l), Hd(l, n), lo(pu), _a = !!is, pu = is = null, n.current = l, dy(l), qa(), wt = E, At = m, sr.transition = d;
    } else n.current = l;
    if (lf && (lf = !1, Ji = n, Us = c), d = n.pendingLanes, d === 0 && (jl = null), $o(l.stateNode), ra(n, at()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (xo) throw xo = !1, n = Ou, Ou = null, n;
    return Us & 1 && n.tag !== 0 && bo(), d = n.pendingLanes, d & 1 ? n === wo ? Fl++ : (Fl = 0, wo = n) : Fl = 0, Ti(), null;
  }
  function bo() {
    if (Ji !== null) {
      var n = Zu(Us), r = sr.transition, l = At;
      try {
        if (sr.transition = null, At = 16 > n ? 16 : n, Ji === null) var o = !1;
        else {
          if (n = Ji, Ji = null, Us = 0, wt & 6) throw Error(D(331));
          var c = wt;
          for (wt |= 4, Te = n.current; Te !== null; ) {
            var d = Te, m = d.child;
            if (Te.flags & 16) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var U = E[T];
                  for (Te = U; Te !== null; ) {
                    var K = Te;
                    switch (K.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, K, d);
                    }
                    var ee = K.child;
                    if (ee !== null) ee.return = K, Te = ee;
                    else for (; Te !== null; ) {
                      K = Te;
                      var q = K.sibling, Se = K.return;
                      if (rf(K), K === U) {
                        Te = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = Se, Te = q;
                        break;
                      }
                      Te = Se;
                    }
                  }
                }
                var be = d.alternate;
                if (be !== null) {
                  var ke = be.child;
                  if (ke !== null) {
                    be.child = null;
                    do {
                      var kn = ke.sibling;
                      ke.sibling = null, ke = kn;
                    } while (ke !== null);
                  }
                }
                Te = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, Te = m;
            else e: for (; Te !== null; ) {
              if (d = Te, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var O = d.sibling;
              if (O !== null) {
                O.return = d.return, Te = O;
                break e;
              }
              Te = d.return;
            }
          }
          var w = n.current;
          for (Te = w; Te !== null; ) {
            m = Te;
            var N = m.child;
            if (m.subtreeFlags & 2064 && N !== null) N.return = m, Te = N;
            else e: for (m = w; Te !== null; ) {
              if (E = Te, E.flags & 2048) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ms(9, E);
                }
              } catch (_e) {
                vn(E, E.return, _e);
              }
              if (E === m) {
                Te = null;
                break e;
              }
              var X = E.sibling;
              if (X !== null) {
                X.return = E.return, Te = X;
                break e;
              }
              Te = E.return;
            }
          }
          if (wt = c, Ti(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        At = l, sr.transition = r;
      }
    }
    return !1;
  }
  function ih(n, r, l) {
    r = _u(l, r), r = Pv(n, r, 1), n = Ll(n, r, 1), r = Pn(), n !== null && (Pi(n, 1, r), ra(n, r));
  }
  function vn(n, r, l) {
    if (n.tag === 3) ih(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        ih(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (jl === null || !jl.has(o))) {
          n = _u(l, n), n = Ld(r, n, 1), r = Ll(r, n, 1), n = Pn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function yy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Pn(), n.pingedLanes |= n.suspendedLanes & l, Gn === n && (cr & l) === l && (Dn === 4 || Dn === 3 && (cr & 130023424) === cr && 500 > at() - Bd ? el(n, 0) : af |= l), ra(n, r);
  }
  function lh(n, r) {
    r === 0 && (n.mode & 1 ? (r = da, da <<= 1, !(da & 130023424) && (da = 4194304)) : r = 1);
    var l = Pn();
    n = ha(n, r), n !== null && (Pi(n, r, l), ra(n, l));
  }
  function gy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), lh(n, l);
  }
  function uh(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(D(314));
    }
    o !== null && o.delete(r), lh(n, l);
  }
  var oh;
  oh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Qn.current) jn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return jn = !1, _s(n, r, l);
      jn = !!(n.flags & 131072);
    }
    else jn = !1, pn && r.flags & 1048576 && Mv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        za(n, r), n = r.pendingProps;
        var c = qr(r, Cn.current);
        gn(r, l), c = Nl(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, zn(o) ? (d = !0, Zn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, xd(r), c.updater = Kc, r.stateNode = c, c._reactInternals = r, Rs(r, o, n, l), r = ws(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && bc(r), or(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (za(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Ey(o), n = ai(o, n), c) {
            case 0:
              r = Bv(null, r, o, n, l);
              break e;
            case 1:
              r = Iv(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = Du(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(D(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Bv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Iv(n, r, o, c, l);
      case 3:
        e: {
          if (So(r), n === null) throw Error(D(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, zv(n, r), cs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(D(423)), r), r = Yv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(D(424)), r), r = Yv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, pn = !0, La = null, l = he(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ml(), o === c) {
              r = Aa(n, r, l);
              break e;
            }
            or(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Uv(r), n === null && yd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Cc(o, c) ? m = null : d !== null && Cc(o, d) && (r.flags |= 32), zd(n, r), or(n, r, m, l), r.child;
      case 6:
        return n === null && yd(r), null;
      case 13:
        return ef(n, r, l);
      case 4:
        return bd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = wn(r, null, o, l) : or(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ea(n, r, o, c, l);
      case 7:
        return or(n, r, r.pendingProps, l), r.child;
      case 8:
        return or(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return or(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, je(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Qn.current) {
              r = Aa(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var E = d.dependencies;
            if (E !== null) {
              m = d.child;
              for (var T = E.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (d.tag === 1) {
                    T = Ki(-1, l & -l), T.tag = 2;
                    var U = d.updateQueue;
                    if (U !== null) {
                      U = U.shared;
                      var K = U.pending;
                      K === null ? T.next = T : (T.next = K.next, K.next = T), U.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), Cd(
                    d.return,
                    l,
                    r
                  ), E.lanes |= l;
                  break;
                }
                T = T.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(D(341));
              m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), Cd(m, l, r), m = d.sibling;
            } else m = d.child;
            if (m !== null) m.return = d;
            else for (m = d; m !== null; ) {
              if (m === r) {
                m = null;
                break;
              }
              if (d = m.sibling, d !== null) {
                d.return = m.return, m = d;
                break;
              }
              m = m.return;
            }
            d = m;
          }
          or(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, gn(r, l), c = Na(c), o = o(c), r.flags |= 1, or(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), Du(n, r, o, c, l);
      case 15:
        return it(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), za(n, r), r.tag = 1, zn(o) ? (n = !0, Zn(r)) : n = !1, gn(r, l), Xc(r, o, c), Rs(r, o, c, l), ws(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return xs(n, r, l);
    }
    throw Error(D(156, r.tag));
  };
  function sh(n, r) {
    return cn(n, r);
  }
  function Sy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new Sy(n, r, l, o);
  }
  function Wd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ey(n) {
    if (typeof n == "function") return Wd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Mt) return 11;
      if (n === Lt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Wd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case ve:
        return tl(l.children, c, d, r);
      case pt:
        m = 8, c |= 8;
        break;
      case Tt:
        return n = ja(12, l, r, c | 2), n.elementType = Tt, n.lanes = d, n;
      case Pe:
        return n = ja(13, l, r, c), n.elementType = Pe, n.lanes = d, n;
      case Vt:
        return n = ja(19, l, r, c), n.elementType = Vt, n.lanes = d, n;
      case Le:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Ct:
            m = 10;
            break e;
          case on:
            m = 9;
            break e;
          case Mt:
            m = 11;
            break e;
          case Lt:
            m = 14;
            break e;
          case zt:
            m = 16, o = null;
            break e;
        }
        throw Error(D(130, n == null ? n : typeof n, ""));
    }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = Le, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Gd(n, r, l) {
    return n = ja(6, n, null, r), n.lanes = l, n;
  }
  function sf(n, r, l) {
    return r = ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function ch(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xu(0), this.expirationTimes = Xu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function cf(n, r, l, o, c, d, m, E, T) {
    return n = new ch(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, xd(d), n;
  }
  function Cy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Ne, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function qd(n) {
    if (!n) return Rr;
    n = n._reactInternals;
    e: {
      if (rt(n) !== n || n.tag !== 1) throw Error(D(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (zn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(D(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (zn(l)) return os(n, l, r);
    }
    return r;
  }
  function fh(n, r, l, o, c, d, m, E, T) {
    return n = cf(l, o, !0, n, c, d, m, E, T), n.context = qd(null), l = n.current, o = Pn(), c = Mi(l), d = Ki(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function ff(n, r, l, o) {
    var c = r.current, d = Pn(), m = Mi(c);
    return l = qd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (Ar(n, c, m, d), Oc(n, c, m)), m;
  }
  function df(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Kd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function pf(n, r) {
    Kd(n, r), (n = n.alternate) && Kd(n, r);
  }
  function dh() {
    return null;
  }
  var zu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Xd(n) {
    this._internalRoot = n;
  }
  vf.prototype.render = Xd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(D(409));
    ff(n, r, null, null);
  }, vf.prototype.unmount = Xd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Lu(function() {
        ff(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function vf(n) {
    this._internalRoot = n;
  }
  vf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Ze();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < $n.length && r !== 0 && r < $n[l].priority; l++) ;
      $n.splice(l, 0, n), l === 0 && Go(n);
    }
  };
  function Zd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function hf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function ph() {
  }
  function Ry(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var U = df(m);
          d.call(U);
        };
      }
      var m = fh(r, o, n, 0, null, !1, !1, "", ph);
      return n._reactRootContainer = m, n[Qi] = m.current, oo(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var U = df(T);
        E.call(U);
      };
    }
    var T = cf(n, 0, !1, null, null, !1, !1, "", ph);
    return n._reactRootContainer = T, n[Qi] = T.current, oo(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      ff(r, T, l, o);
    }), T;
  }
  function Ps(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var T = df(m);
          E.call(T);
        };
      }
      ff(r, m, n, c);
    } else m = Ry(l, r, n, c, o);
    return df(m);
  }
  kt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, at()), !(wt & 6) && (To = at() + 500, Ti()));
        }
        break;
      case 13:
        Lu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Pn();
            Ar(o, n, 1, c);
          }
        }), pf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Pn();
        Ar(r, n, 134217728, l);
      }
      pf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Mi(n), l = ha(n, r);
      if (l !== null) {
        var o = Pn();
        Ar(l, n, r, o);
      }
      pf(n, r);
    }
  }, Ze = function() {
    return At;
  }, Ju = function(n, r) {
    var l = At;
    try {
      return At = n, r();
    } finally {
      At = l;
    }
  }, Wt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = yn(o);
              if (!c) throw Error(D(90));
              br(o), $r(o, c);
            }
          }
        }
        break;
      case "textarea":
        $a(n, l);
        break;
      case "select":
        r = l.value, r != null && Tn(n, !!l.multiple, r, !1);
    }
  }, eu = Yd, pl = Lu;
  var Ty = { usingClientEntryPoint: !1, Events: [Fe, ni, yn, Hi, Jl, Yd] }, Vs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, vh = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: le.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = xn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || dh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(vh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ty, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zd(r)) throw Error(D(200));
    return Cy(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!Zd(n)) throw Error(D(299));
    var l = !1, o = "", c = zu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = cf(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, oo(n.nodeType === 8 ? n.parentNode : n), new Xd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(D(188)) : (n = Object.keys(n).join(","), Error(D(268, n)));
    return n = xn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Lu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!hf(r)) throw Error(D(200));
    return Ps(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!Zd(n)) throw Error(D(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = zu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = fh(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, oo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new vf(r);
  }, Ia.render = function(n, r, l) {
    if (!hf(r)) throw Error(D(200));
    return Ps(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!hf(n)) throw Error(D(40));
    return n._reactRootContainer ? (Lu(function() {
      Ps(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = Yd, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!hf(l)) throw Error(D(200));
    if (n == null || n._reactInternals === void 0) throw Error(D(38));
    return Ps(n, r, l, !1, o);
  }, Ia.version = "18.3.1-next-f1338f8080-20240426", Ia;
}
var Ya = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oT;
function oD() {
  return oT || (oT = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var F = Dt, k = fT(), D = F.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, we = !1;
    function oe(e) {
      we = e;
    }
    function ye(e) {
      if (!we) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Oe("warn", e, a);
      }
    }
    function g(e) {
      if (!we) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Oe("error", e, a);
      }
    }
    function Oe(e, t, a) {
      {
        var i = D.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var Y = 0, Z = 1, Re = 2, B = 3, ue = 4, ne = 5, ie = 6, Me = 7, nt = 8, tn = 9, dt = 10, Ke = 11, le = 12, J = 13, Ne = 14, ve = 15, pt = 16, Tt = 17, Ct = 18, on = 19, Mt = 21, Pe = 22, Vt = 23, Lt = 24, zt = 25, Le = !0, ae = !1, ze = !1, fe = !1, _ = !1, I = !0, Ge = !0, Qe = !0, vt = !0, ot = /* @__PURE__ */ new Set(), lt = {}, st = {};
    function ht(e, t) {
      $t(e, t), $t(e + "Capture", t);
    }
    function $t(e, t) {
      lt[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), lt[e] = t;
      {
        var a = e.toLowerCase();
        st[a] = e, e === "onDoubleClick" && (st.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        ot.add(t[i]);
    }
    var Mn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
    function Rn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function rr(e) {
      try {
        return Bn(e), !1;
      } catch {
        return !0;
      }
    }
    function Bn(e) {
      return "" + e;
    }
    function In(e, t) {
      if (rr(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Bn(e);
    }
    function $r(e) {
      if (rr(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Rn(e)), Bn(e);
    }
    function ci(e, t) {
      if (rr(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Bn(e);
    }
    function sa(e, t) {
      if (rr(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Bn(e);
    }
    function Kn(e) {
      if (rr(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Rn(e)), Bn(e);
    }
    function Tn(e) {
      if (rr(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Rn(e)), Bn(e);
    }
    var Yn = 0, Sr = 1, $a = 2, Ln = 3, Er = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", se = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Ae = new RegExp("^[" + fi + "][" + se + "]*$"), ct = {}, Bt = {};
    function nn(e) {
      return br.call(Bt, e) ? !0 : br.call(ct, e) ? !1 : Ae.test(e) ? (Bt[e] = !0, !0) : (ct[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function hn(e, t, a) {
      return t !== null ? t.type === Yn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function sn(e, t, a, i) {
      if (a !== null && a.type === Yn)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Xn(e, t, a, i) {
      if (t === null || typeof t > "u" || sn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Ln:
            return !t;
          case Er:
            return t === !1;
          case ca:
            return isNaN(t);
          case Qa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function rn(e) {
      return Wt.hasOwnProperty(e) ? Wt[e] : null;
    }
    function Qt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Ln || t === Er, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Wt = {}, fa = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    fa.forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Yn,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Wt[t] = new Qt(
        t,
        Sr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        $a,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        $a,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Ln,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Ln,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Er,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Qa,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        ca,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Cr = /[\-\:]([a-z])/g, xa = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Cr, xa);
      Wt[t] = new Qt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Cr, xa);
      Wt[t] = new Qt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Cr, xa);
      Wt[t] = new Qt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Sr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Hi = "xlinkHref";
    Wt[Hi] = new Qt(
      "xlinkHref",
      Sr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Sr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Jl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, eu = !1;
    function pl(e) {
      !eu && Jl.test(e) && (eu = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function vl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        In(a, t), i.sanitizeURL && pl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Er) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Xn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Xn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Ln)
            return a;
          f = e.getAttribute(s);
        }
        return Xn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function tu(e, t, a, i) {
      {
        if (!nn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return In(a, t), u === "" + a ? a : u;
      }
    }
    function _r(e, t, a, i) {
      var u = rn(t);
      if (!hn(t, u, i)) {
        if (Xn(t, a, u, i) && (a = null), i || u === null) {
          if (nn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (In(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === Ln ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, S = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var b = u.type, x;
          b === Ln || b === Er && a === !0 ? x = "" : (In(a, y), x = "" + a, u.sanitizeURL && pl(x.toString())), S ? e.setAttributeNS(S, y, x) : e.setAttribute(y, x);
        }
      }
    }
    var Dr = Symbol.for("react.element"), ar = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), R = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), xe = Symbol.for("react.suspense_list"), rt = Symbol.for("react.memo"), Je = Symbol.for("react.lazy"), gt = Symbol.for("react.scope"), mt = Symbol.for("react.debug_trace_mode"), xn = Symbol.for("react.offscreen"), an = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), ir = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function at(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var ut = Object.assign, Ka = 0, nu, ru, hl, Wu, ml, Qr, $o;
    function kr() {
    }
    kr.__reactDisabledLog = !0;
    function lc() {
      {
        if (Ka === 0) {
          nu = console.log, ru = console.info, hl = console.warn, Wu = console.error, ml = console.group, Qr = console.groupCollapsed, $o = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: kr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Ka++;
      }
    }
    function uc() {
      {
        if (Ka--, Ka === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ut({}, e, {
              value: nu
            }),
            info: ut({}, e, {
              value: ru
            }),
            warn: ut({}, e, {
              value: hl
            }),
            error: ut({}, e, {
              value: Wu
            }),
            group: ut({}, e, {
              value: ml
            }),
            groupCollapsed: ut({}, e, {
              value: Qr
            }),
            groupEnd: ut({}, e, {
              value: $o
            })
          });
        }
        Ka < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Gu = D.ReactCurrentDispatcher, yl;
    function da(e, t, a) {
      {
        if (yl === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            yl = i && i[1] || "";
          }
        return `
` + yl + e;
      }
    }
    var Xa = !1, Za;
    {
      var qu = typeof WeakMap == "function" ? WeakMap : Map;
      Za = new qu();
    }
    function au(e, t) {
      if (!e || Xa)
        return "";
      {
        var a = Za.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Xa = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Gu.current, Gu.current = null, lc();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (j) {
              i = j;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (j) {
              i = j;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (j) {
            i = j;
          }
          e();
        }
      } catch (j) {
        if (j && i && typeof j.stack == "string") {
          for (var p = j.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, S = v.length - 1; y >= 1 && S >= 0 && p[y] !== v[S]; )
            S--;
          for (; y >= 1 && S >= 0; y--, S--)
            if (p[y] !== v[S]) {
              if (y !== 1 || S !== 1)
                do
                  if (y--, S--, S < 0 || p[y] !== v[S]) {
                    var b = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", e.displayName)), typeof e == "function" && Za.set(e, b), b;
                  }
                while (y >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, Gu.current = s, uc(), Error.prepareStackTrace = u;
      }
      var x = e ? e.displayName || e.name : "", z = x ? da(x) : "";
      return typeof e == "function" && Za.set(e, z), z;
    }
    function gl(e, t, a) {
      return au(e, !0);
    }
    function Ku(e, t, a) {
      return au(e, !1);
    }
    function Xu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Pi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return au(e, Xu(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case pe:
          return da("Suspense");
        case xe:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case W:
            return Ku(e.render);
          case rt:
            return Pi(e.type, t, a);
          case Je: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Wf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ne:
          return da(e.type);
        case pt:
          return da("Lazy");
        case J:
          return da("Suspense");
        case on:
          return da("SuspenseList");
        case Y:
        case Re:
        case ve:
          return Ku(e.type);
        case Ke:
          return Ku(e.type.render);
        case Z:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += Wf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function At(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Zu(e) {
      return e.displayName || "Context";
    }
    function kt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case ar:
          return "Portal";
        case pi:
          return "Profiler";
        case Wa:
          return "StrictMode";
        case pe:
          return "Suspense";
        case xe:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Zu(t) + ".Consumer";
          case vi:
            var a = e;
            return Zu(a._context) + ".Provider";
          case W:
            return At(e, e.render, "ForwardRef");
          case rt:
            var i = e.displayName || null;
            return i !== null ? i : kt(e.type) || "Memo";
          case Je: {
            var u = e, s = u._payload, f = u._init;
            try {
              return kt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Qo(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function hi(e) {
      return e.displayName || "Context";
    }
    function Ze(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Lt:
          return "Cache";
        case tn:
          var i = a;
          return hi(i) + ".Consumer";
        case dt:
          var u = a;
          return hi(u._context) + ".Provider";
        case Ct:
          return "DehydratedFragment";
        case Ke:
          return Qo(a, a.render, "ForwardRef");
        case Me:
          return "Fragment";
        case ne:
          return a;
        case ue:
          return "Portal";
        case B:
          return "Root";
        case ie:
          return "Text";
        case pt:
          return kt(a);
        case nt:
          return a === Wa ? "StrictMode" : "Mode";
        case Pe:
          return "Offscreen";
        case le:
          return "Profiler";
        case Mt:
          return "Scope";
        case J:
          return "Suspense";
        case on:
          return "SuspenseList";
        case zt:
          return "TracingMarker";
        case Z:
        case Y:
        case Tt:
        case Re:
        case Ne:
        case ve:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Ju = D.ReactDebugCurrentFrame, lr = null, mi = !1;
    function Or() {
      {
        if (lr === null)
          return null;
        var e = lr._debugOwner;
        if (e !== null && typeof e < "u")
          return Ze(e);
      }
      return null;
    }
    function yi() {
      return lr === null ? "" : Vi(lr);
    }
    function fn() {
      Ju.getCurrentStack = null, lr = null, mi = !1;
    }
    function Gt(e) {
      Ju.getCurrentStack = e === null ? null : yi, lr = e, mi = !1;
    }
    function Sl() {
      return lr;
    }
    function $n(e) {
      mi = e;
    }
    function Mr(e) {
      return "" + e;
    }
    function wa(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Tn(e), e;
        default:
          return "";
      }
    }
    var iu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Wo(e, t) {
      iu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Go(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function El(e) {
      return e._valueTracker;
    }
    function lu(e) {
      e._valueTracker = null;
    }
    function Gf(e) {
      var t = "";
      return e && (Go(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ba(e) {
      var t = Go(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Tn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            Tn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            Tn(p), i = "" + p;
          },
          stopTracking: function() {
            lu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Ja(e) {
      El(e) || (e._valueTracker = ba(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = El(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Gf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function _a(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var eo = !1, to = !1, Cl = !1, uu = !1;
    function no(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ro(e, t) {
      var a = e, i = t.checked, u = ut({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ei(e, t) {
      Wo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !to && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), to = !0), t.value !== void 0 && t.defaultValue !== void 0 && !eo && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), eo = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: wa(t.value != null ? t.value : i),
        controlled: no(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && _r(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = no(t);
        !a._wrapperState.controlled && i && !uu && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uu = !0), a._wrapperState.controlled && !i && !Cl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Cl = !0);
      }
      h(e, t);
      var u = wa(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Mr(u)) : a.value !== Mr(u) && (a.value = Mr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ve(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ve(a, t.type, wa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function A(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Mr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function H(e, t) {
      var a = e;
      C(a, t), re(a, t);
    }
    function re(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        In(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Lh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), C(f, p);
          }
        }
      }
    }
    function Ve(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Mr(e._wrapperState.initialValue) : e.defaultValue !== Mr(a) && (e.defaultValue = Mr(a)));
    }
    var de = !1, Ye = !1, St = !1;
    function Ot(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? F.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Ye || (Ye = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (St || (St = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !de && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), de = !0);
    }
    function ln(e, t) {
      t.value != null && e.setAttribute("value", Mr(wa(t.value)));
    }
    var qt = Array.isArray;
    function ft(e) {
      return qt(e);
    }
    var Kt;
    Kt = !1;
    function mn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Rl = ["value", "defaultValue"];
    function qo(e) {
      {
        Wo("select", e);
        for (var t = 0; t < Rl.length; t++) {
          var a = Rl[t];
          if (e[a] != null) {
            var i = ft(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, mn()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, mn());
          }
        }
      }
    }
    function Bi(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var y = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== y && (u[v].selected = y), y && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var S = Mr(wa(a)), b = null, x = 0; x < u.length; x++) {
          if (u[x].value === S) {
            u[x].selected = !0, i && (u[x].defaultSelected = !0);
            return;
          }
          b === null && !u[x].disabled && (b = u[x]);
        }
        b !== null && (b.selected = !0);
      }
    }
    function Ko(e, t) {
      return ut({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      qo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Kt && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Kt = !0);
    }
    function qf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Bi(a, !!t.multiple, i, !1) : t.defaultValue != null && Bi(a, !!t.multiple, t.defaultValue, !0);
    }
    function oc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Bi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Bi(a, !!t.multiple, t.defaultValue, !0) : Bi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Kf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var tv = !1;
    function Xf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = ut({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Mr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Zf(e, t) {
      var a = e;
      Wo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !tv && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), tv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (ft(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: wa(i)
      };
    }
    function nv(e, t) {
      var a = e, i = wa(t.value), u = wa(t.defaultValue);
      if (i != null) {
        var s = Mr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Mr(u));
    }
    function rv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Zm(e, t) {
      nv(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", Jf = "http://www.w3.org/1998/Math/MathML", ed = "http://www.w3.org/2000/svg";
    function td(e) {
      switch (e) {
        case "svg":
          return ed;
        case "math":
          return Jf;
        default:
          return Ii;
      }
    }
    function nd(e, t) {
      return e == null || e === Ii ? td(t) : e === ed && t === "foreignObject" ? Ii : e;
    }
    var av = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, sc, iv = av(function(e, t) {
      if (e.namespaceURI === ed && !("innerHTML" in e)) {
        sc = sc || document.createElement("div"), sc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = sc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, Nn = 8, $i = 9, rd = 11, ao = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Xo = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Zo = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function lv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var uv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Zo).forEach(function(e) {
      uv.forEach(function(t) {
        Zo[lv(t, e)] = Zo[e];
      });
    });
    function cc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Zo.hasOwnProperty(e) && Zo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var ov = /([A-Z])/g, sv = /^ms-/;
    function io(e) {
      return e.replace(ov, "-$1").toLowerCase().replace(sv, "-ms-");
    }
    var cv = function() {
    };
    {
      var Jm = /^(?:webkit|moz|o)[A-Z]/, ey = /^-ms-/, fv = /-(.)/g, ad = /;\s*$/, Si = {}, su = {}, dv = !1, Jo = !1, ty = function(e) {
        return e.replace(fv, function(t, a) {
          return a.toUpperCase();
        });
      }, pv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ty(e.replace(ey, "ms-"))
        ));
      }, id = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, ld = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(ad, "")));
      }, vv = function(e, t) {
        dv || (dv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, hv = function(e, t) {
        Jo || (Jo = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      cv = function(e, t) {
        e.indexOf("-") > -1 ? pv(e) : Jm.test(e) ? id(e) : ad.test(t) && ld(e, t), typeof t == "number" && (isNaN(t) ? vv(e, t) : isFinite(t) || hv(e, t));
      };
    }
    var mv = cv;
    function ny(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : io(i)) + ":", t += cc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function yv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || mv(i, t[i]);
          var s = cc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ry(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function gv(e) {
      var t = {};
      for (var a in e)
        for (var i = Xo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function ay(e, t) {
      {
        if (!t)
          return;
        var a = gv(e), i = gv(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ry(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var ti = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, es = ut({
      menuitem: !0
    }, ti), Sv = "__html";
    function fc(e, t) {
      if (t) {
        if (es[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Sv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Tl(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var ts = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, dc = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, lo = {}, iy = new RegExp("^(aria)-[" + se + "]*$"), uo = new RegExp("^(aria)[A-Z][" + se + "]*$");
    function ud(e, t) {
      {
        if (br.call(lo, t) && lo[t])
          return !0;
        if (uo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = dc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), lo[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), lo[t] = !0, !0;
        }
        if (iy.test(t)) {
          var u = t.toLowerCase(), s = dc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return lo[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), lo[t] = !0, !0;
        }
      }
      return !0;
    }
    function ns(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = ud(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function od(e, t) {
      Tl(e, t) || ns(e, t);
    }
    var sd = !1;
    function pc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !sd && (sd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var ur = {}, cd = /^on./, vc = /^on[^A-Z]/, Ev = new RegExp("^(aria)-[" + se + "]*$"), Cv = new RegExp("^(aria)[A-Z][" + se + "]*$");
      cu = function(e, t, a, i) {
        if (br.call(ur, t) && ur[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), ur[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, p), ur[t] = !0, !0;
          if (cd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), ur[t] = !0, !0;
        } else if (cd.test(t))
          return vc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ur[t] = !0, !0;
        if (Ev.test(t) || Cv.test(t))
          return !0;
        if (u === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), ur[t] = !0, !0;
        if (u === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), ur[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), ur[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), ur[t] = !0, !0;
        var v = rn(t), y = v !== null && v.type === Yn;
        if (ts.hasOwnProperty(u)) {
          var S = ts[u];
          if (S !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, S), ur[t] = !0, !0;
        } else if (!y && t !== u)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), ur[t] = !0, !0;
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ur[t] = !0, !0) : y ? !0 : sn(t, a, v, !1) ? (ur[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ur[t] = !0), !0);
      };
    }
    var Rv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = cu(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? g("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && g("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Tv(e, t, a) {
      Tl(e, t) || Rv(e, t, a);
    }
    var fd = 1, hc = 2, Da = 4, dd = fd | hc | Da, fu = null;
    function ly(e) {
      fu !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function uy() {
      fu === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function rs(e) {
      return e === fu;
    }
    function pd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var mc = null, du = null, It = null;
    function yc(e) {
      var t = ko(e);
      if (t) {
        if (typeof mc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Lh(a);
          mc(t.stateNode, t.type, i);
        }
      }
    }
    function gc(e) {
      mc = e;
    }
    function oo(e) {
      du ? It ? It.push(e) : It = [e] : du = e;
    }
    function xv() {
      return du !== null || It !== null;
    }
    function Sc() {
      if (du) {
        var e = du, t = It;
        if (du = null, It = null, yc(e), t)
          for (var a = 0; a < t.length; a++)
            yc(t[a]);
      }
    }
    var so = function(e, t) {
      return e(t);
    }, as = function() {
    }, xl = !1;
    function wv() {
      var e = xv();
      e && (as(), Sc());
    }
    function bv(e, t, a) {
      if (xl)
        return e(t, a);
      xl = !0;
      try {
        return so(e, t, a);
      } finally {
        xl = !1, wv();
      }
    }
    function oy(e, t, a) {
      so = e, as = a;
    }
    function _v(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Ec(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && _v(t));
        default:
          return !1;
      }
    }
    function wl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Lh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Ec(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var is = !1;
    if (Mn)
      try {
        var pu = {};
        Object.defineProperty(pu, "passive", {
          get: function() {
            is = !0;
          }
        }), window.addEventListener("test", pu, pu), window.removeEventListener("test", pu, pu);
      } catch {
        is = !1;
      }
    function Cc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (S) {
        this.onError(S);
      }
    }
    var Rc = Cc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var vd = document.createElement("react");
      Rc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var S = document.createEvent("Event"), b = !1, x = !0, z = window.event, j = Object.getOwnPropertyDescriptor(window, "event");
        function P() {
          vd.removeEventListener(V, Be, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = z);
        }
        var me = Array.prototype.slice.call(arguments, 3);
        function Be() {
          b = !0, P(), a.apply(i, me), x = !1;
        }
        var Ue, _t = !1, Et = !1;
        function M(L) {
          if (Ue = L.error, _t = !0, Ue === null && L.colno === 0 && L.lineno === 0 && (Et = !0), L.defaultPrevented && Ue != null && typeof Ue == "object")
            try {
              Ue._suppressLogging = !0;
            } catch {
            }
        }
        var V = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", M), vd.addEventListener(V, Be, !1), S.initEvent(V, !1, !1), vd.dispatchEvent(S), j && Object.defineProperty(window, "event", j), b && x && (_t ? Et && (Ue = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ue = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ue)), window.removeEventListener("error", M), !b)
          return P(), Cc.apply(this, arguments);
      };
    }
    var Dv = Rc, co = !1, Tc = null, fo = !1, Ei = null, kv = {
      onError: function(e) {
        co = !0, Tc = e;
      }
    };
    function bl(e, t, a, i, u, s, f, p, v) {
      co = !1, Tc = null, Dv.apply(kv, arguments);
    }
    function Ci(e, t, a, i, u, s, f, p, v) {
      if (bl.apply(this, arguments), co) {
        var y = us();
        fo || (fo = !0, Ei = y);
      }
    }
    function ls() {
      if (fo) {
        var e = Ei;
        throw fo = !1, Ei = null, e;
      }
    }
    function Qi() {
      return co;
    }
    function us() {
      if (co) {
        var e = Tc;
        return co = !1, Tc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function po(e) {
      return e._reactInternals;
    }
    function sy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var Fe = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), yn = (
      /*                    */
      2
    ), xt = (
      /*                       */
      4
    ), ka = (
      /*                */
      16
    ), Oa = (
      /*                 */
      32
    ), un = (
      /*                     */
      64
    ), je = (
      /*                   */
      128
    ), Rr = (
      /*            */
      256
    ), Cn = (
      /*                          */
      512
    ), Qn = (
      /*                     */
      1024
    ), Gr = (
      /*                      */
      2048
    ), qr = (
      /*                    */
      4096
    ), zn = (
      /*                   */
      8192
    ), vo = (
      /*             */
      16384
    ), Ov = (
      /*               */
      32767
    ), os = (
      /*                   */
      32768
    ), Zn = (
      /*                */
      65536
    ), xc = (
      /* */
      131072
    ), Ri = (
      /*                       */
      1048576
    ), ho = (
      /*                    */
      2097152
    ), Wi = (
      /*                 */
      4194304
    ), wc = (
      /*                */
      8388608
    ), _l = (
      /*               */
      16777216
    ), Ti = (
      /*              */
      33554432
    ), Dl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      xt | Qn | 0
    ), kl = yn | xt | ka | Oa | Cn | qr | zn, Ol = xt | un | Cn | zn, Gi = Gr | ka, An = Wi | wc | ho, Ma = D.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yn | qr)) !== Fe && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === B ? a : null;
    }
    function xi(e) {
      if (e.tag === J) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function wi(e) {
      return e.tag === B ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function Mv(e) {
      {
        var t = Ma.current;
        if (t !== null && t.tag === Z) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ze(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = po(e);
      return u ? pa(u) === u : !1;
    }
    function bc(e) {
      if (pa(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function _c(e) {
      var t = e.alternate;
      if (!t) {
        var a = pa(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = u = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return bc(s), e;
            if (v === u)
              return bc(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var y = !1, S = s.child; S; ) {
            if (S === i) {
              y = !0, i = s, u = f;
              break;
            }
            if (S === u) {
              y = !0, u = s, i = f;
              break;
            }
            S = S.sibling;
          }
          if (!y) {
            for (S = f.child; S; ) {
              if (S === i) {
                y = !0, i = f, u = s;
                break;
              }
              if (S === u) {
                y = !0, u = f, i = s;
                break;
              }
              S = S.sibling;
            }
            if (!y)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== B)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = _c(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === ne || e.tag === ie)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Xr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function pn(e) {
      var t = _c(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === ne || e.tag === ie)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== ue) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var hd = k.unstable_scheduleCallback, Lv = k.unstable_cancelCallback, md = k.unstable_shouldYield, yd = k.unstable_requestPaint, Wn = k.unstable_now, Dc = k.unstable_getCurrentPriorityLevel, ss = k.unstable_ImmediatePriority, Ml = k.unstable_UserBlockingPriority, qi = k.unstable_NormalPriority, cy = k.unstable_LowPriority, mu = k.unstable_IdlePriority, kc = k.unstable_yieldValue, Nv = k.unstable_setDisableYieldValue, yu = null, wn = null, he = null, va = !1, Zr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function mo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ge && (e = ut({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Na
        })), yu = t.inject(e), wn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function gd(e, t) {
      if (wn && typeof wn.onScheduleFiberRoot == "function")
        try {
          wn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Sd(e, t) {
      if (wn && typeof wn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & je) === je;
          if (Qe) {
            var i;
            switch (t) {
              case Lr:
                i = ss;
                break;
              case _i:
                i = Ml;
                break;
              case za:
                i = qi;
                break;
              case Aa:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            wn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, g("React instrumentation encountered an error: %s", u));
        }
    }
    function Ed(e) {
      if (wn && typeof wn.onPostCommitFiberRoot == "function")
        try {
          wn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Cd(e) {
      if (wn && typeof wn.onCommitFiberUnmount == "function")
        try {
          wn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function gn(e) {
      if (typeof kc == "function" && (Nv(e), oe(e)), wn && typeof wn.setStrictMode == "function")
        try {
          wn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Na(e) {
      he = e;
    }
    function gu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Cu; a++) {
          var i = jv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Rd(e) {
      he !== null && typeof he.markCommitStarted == "function" && he.markCommitStarted(e);
    }
    function Td() {
      he !== null && typeof he.markCommitStopped == "function" && he.markCommitStopped();
    }
    function ha(e) {
      he !== null && typeof he.markComponentRenderStarted == "function" && he.markComponentRenderStarted(e);
    }
    function ma() {
      he !== null && typeof he.markComponentRenderStopped == "function" && he.markComponentRenderStopped();
    }
    function xd(e) {
      he !== null && typeof he.markComponentPassiveEffectMountStarted == "function" && he.markComponentPassiveEffectMountStarted(e);
    }
    function zv() {
      he !== null && typeof he.markComponentPassiveEffectMountStopped == "function" && he.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      he !== null && typeof he.markComponentPassiveEffectUnmountStarted == "function" && he.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      he !== null && typeof he.markComponentPassiveEffectUnmountStopped == "function" && he.markComponentPassiveEffectUnmountStopped();
    }
    function Oc(e) {
      he !== null && typeof he.markComponentLayoutEffectMountStarted == "function" && he.markComponentLayoutEffectMountStarted(e);
    }
    function Av() {
      he !== null && typeof he.markComponentLayoutEffectMountStopped == "function" && he.markComponentLayoutEffectMountStopped();
    }
    function cs(e) {
      he !== null && typeof he.markComponentLayoutEffectUnmountStarted == "function" && he.markComponentLayoutEffectUnmountStarted(e);
    }
    function wd() {
      he !== null && typeof he.markComponentLayoutEffectUnmountStopped == "function" && he.markComponentLayoutEffectUnmountStopped();
    }
    function fs(e, t, a) {
      he !== null && typeof he.markComponentErrored == "function" && he.markComponentErrored(e, t, a);
    }
    function bi(e, t, a) {
      he !== null && typeof he.markComponentSuspended == "function" && he.markComponentSuspended(e, t, a);
    }
    function ds(e) {
      he !== null && typeof he.markLayoutEffectsStarted == "function" && he.markLayoutEffectsStarted(e);
    }
    function ps() {
      he !== null && typeof he.markLayoutEffectsStopped == "function" && he.markLayoutEffectsStopped();
    }
    function Su(e) {
      he !== null && typeof he.markPassiveEffectsStarted == "function" && he.markPassiveEffectsStarted(e);
    }
    function bd() {
      he !== null && typeof he.markPassiveEffectsStopped == "function" && he.markPassiveEffectsStopped();
    }
    function Eu(e) {
      he !== null && typeof he.markRenderStarted == "function" && he.markRenderStarted(e);
    }
    function Uv() {
      he !== null && typeof he.markRenderYielded == "function" && he.markRenderYielded();
    }
    function Mc() {
      he !== null && typeof he.markRenderStopped == "function" && he.markRenderStopped();
    }
    function Sn(e) {
      he !== null && typeof he.markRenderScheduled == "function" && he.markRenderScheduled(e);
    }
    function Lc(e, t) {
      he !== null && typeof he.markForceUpdateScheduled == "function" && he.markForceUpdateScheduled(e, t);
    }
    function vs(e, t) {
      he !== null && typeof he.markStateUpdateScheduled == "function" && he.markStateUpdateScheduled(e, t);
    }
    var He = (
      /*                         */
      0
    ), yt = (
      /*                 */
      1
    ), Ut = (
      /*                    */
      2
    ), Xt = (
      /*               */
      8
    ), jt = (
      /*              */
      16
    ), Un = Math.clz32 ? Math.clz32 : hs, Jn = Math.log, Nc = Math.LN2;
    function hs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jn(t) / Nc | 0) | 0;
    }
    var Cu = 31, G = (
      /*                        */
      0
    ), Nt = (
      /*                          */
      0
    ), We = (
      /*                        */
      1
    ), Nl = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), Tr = (
      /*            */
      8
    ), bn = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), zl = (
      /*                       */
      4194240
    ), Ru = (
      /*                        */
      64
    ), zc = (
      /*                        */
      128
    ), Ac = (
      /*                        */
      256
    ), Uc = (
      /*                        */
      512
    ), jc = (
      /*                        */
      1024
    ), Fc = (
      /*                        */
      2048
    ), Hc = (
      /*                        */
      4096
    ), Pc = (
      /*                        */
      8192
    ), Vc = (
      /*                        */
      16384
    ), Tu = (
      /*                       */
      32768
    ), Bc = (
      /*                       */
      65536
    ), yo = (
      /*                       */
      131072
    ), go = (
      /*                       */
      262144
    ), Ic = (
      /*                       */
      524288
    ), ms = (
      /*                       */
      1048576
    ), Yc = (
      /*                       */
      2097152
    ), ys = (
      /*                            */
      130023424
    ), xu = (
      /*                             */
      4194304
    ), $c = (
      /*                             */
      8388608
    ), gs = (
      /*                             */
      16777216
    ), Qc = (
      /*                             */
      33554432
    ), Wc = (
      /*                             */
      67108864
    ), _d = xu, Ss = (
      /*          */
      134217728
    ), Dd = (
      /*                          */
      268435455
    ), Es = (
      /*               */
      268435456
    ), wu = (
      /*                        */
      536870912
    ), Jr = (
      /*                   */
      1073741824
    );
    function jv(e) {
      {
        if (e & We)
          return "Sync";
        if (e & Nl)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & Tr)
          return "DefaultHydration";
        if (e & bn)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & zl)
          return "Transition";
        if (e & ys)
          return "Retry";
        if (e & Ss)
          return "SelectiveHydration";
        if (e & Es)
          return "IdleHydration";
        if (e & wu)
          return "Idle";
        if (e & Jr)
          return "Offscreen";
      }
    }
    var en = -1, bu = Ru, Gc = xu;
    function Cs(e) {
      switch (Al(e)) {
        case We:
          return We;
        case Nl:
          return Nl;
        case ri:
          return ri;
        case Tr:
          return Tr;
        case bn:
          return bn;
        case Xi:
          return Xi;
        case Ru:
        case zc:
        case Ac:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Tu:
        case Bc:
        case yo:
        case go:
        case Ic:
        case ms:
        case Yc:
          return e & zl;
        case xu:
        case $c:
        case gs:
        case Qc:
        case Wc:
          return e & ys;
        case Ss:
          return Ss;
        case Es:
          return Es;
        case wu:
          return wu;
        case Jr:
          return Jr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function qc(e, t) {
      var a = e.pendingLanes;
      if (a === G)
        return G;
      var i = G, u = e.suspendedLanes, s = e.pingedLanes, f = a & Dd;
      if (f !== G) {
        var p = f & ~u;
        if (p !== G)
          i = Cs(p);
        else {
          var v = f & s;
          v !== G && (i = Cs(v));
        }
      } else {
        var y = a & ~u;
        y !== G ? i = Cs(y) : s !== G && (i = Cs(s));
      }
      if (i === G)
        return G;
      if (t !== G && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === G) {
        var S = Al(i), b = Al(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          S >= b || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          S === bn && (b & zl) !== G
        )
          return t;
      }
      (i & ri) !== G && (i |= a & bn);
      var x = e.entangledLanes;
      if (x !== G)
        for (var z = e.entanglements, j = i & x; j > 0; ) {
          var P = jn(j), me = 1 << P;
          i |= z[P], j &= ~me;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = en; t > 0; ) {
        var u = jn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function kd(e, t) {
      switch (e) {
        case We:
        case Nl:
        case ri:
          return t + 250;
        case Tr:
        case bn:
        case Xi:
        case Ru:
        case zc:
        case Ac:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Tu:
        case Bc:
        case yo:
        case go:
        case Ic:
        case ms:
        case Yc:
          return t + 5e3;
        case xu:
        case $c:
        case gs:
        case Qc:
        case Wc:
          return en;
        case Ss:
        case Es:
        case wu:
        case Jr:
          return en;
        default:
          return g("Should have found matching lanes. This is a bug in React."), en;
      }
    }
    function Kc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p, y = s[p];
        y === en ? ((v & i) === G || (v & u) !== G) && (s[p] = kd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Fv(e) {
      return Cs(e.pendingLanes);
    }
    function Xc(e) {
      var t = e.pendingLanes & ~Jr;
      return t !== G ? t : t & Jr ? Jr : G;
    }
    function Hv(e) {
      return (e & We) !== G;
    }
    function Rs(e) {
      return (e & Dd) !== G;
    }
    function _u(e) {
      return (e & ys) === e;
    }
    function Od(e) {
      var t = We | ri | bn;
      return (e & t) === G;
    }
    function Md(e) {
      return (e & zl) === e;
    }
    function Zc(e, t) {
      var a = Nl | ri | Tr | bn;
      return (t & a) !== G;
    }
    function Pv(e, t) {
      return (t & e.expiredLanes) !== G;
    }
    function Ld(e) {
      return (e & zl) !== G;
    }
    function Nd() {
      var e = bu;
      return bu <<= 1, (bu & zl) === G && (bu = Ru), e;
    }
    function Vv() {
      var e = Gc;
      return Gc <<= 1, (Gc & ys) === G && (Gc = xu), e;
    }
    function Al(e) {
      return e & -e;
    }
    function Ts(e) {
      return Al(e);
    }
    function jn(e) {
      return 31 - Un(e);
    }
    function or(e) {
      return jn(e);
    }
    function ea(e, t) {
      return (e & t) !== G;
    }
    function Du(e, t) {
      return (e & t) === t;
    }
    function it(e, t) {
      return e | t;
    }
    function xs(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function Bv(e) {
      return e;
    }
    function Iv(e, t) {
      return e !== Nt && e < t ? e : t;
    }
    function ws(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function So(e, t, a) {
      e.pendingLanes |= t, t !== wu && (e.suspendedLanes = G, e.pingedLanes = G);
      var i = e.eventTimes, u = or(t);
      i[u] = a;
    }
    function Yv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = jn(i), s = 1 << u;
        a[u] = en, i &= ~s;
      }
    }
    function Jc(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ad(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = G, e.pingedLanes = G, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p;
        i[p] = G, u[p] = en, s[p] = en, f &= ~v;
      }
    }
    function ef(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = jn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Ud(e, t) {
      var a = Al(t), i;
      switch (a) {
        case ri:
          i = Nl;
          break;
        case bn:
          i = Tr;
          break;
        case Ru:
        case zc:
        case Ac:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Tu:
        case Bc:
        case yo:
        case go:
        case Ic:
        case ms:
        case Yc:
        case xu:
        case $c:
        case gs:
        case Qc:
        case Wc:
          i = Xi;
          break;
        case wu:
          i = Es;
          break;
        default:
          i = Nt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Nt ? Nt : i;
    }
    function bs(e, t, a) {
      if (Zr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = or(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function $v(e, t) {
      if (Zr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = or(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function jd(e, t) {
      return null;
    }
    var Lr = We, _i = ri, za = bn, Aa = wu, _s = Nt;
    function Ua() {
      return _s;
    }
    function Fn(e) {
      _s = e;
    }
    function Qv(e, t) {
      var a = _s;
      try {
        return _s = e, t();
      } finally {
        _s = a;
      }
    }
    function Wv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ds(e, t) {
      return e > t ? e : t;
    }
    function er(e, t) {
      return e !== 0 && e < t;
    }
    function Gv(e) {
      var t = Al(e);
      return er(Lr, t) ? er(_i, t) ? Rs(t) ? za : Aa : _i : Lr;
    }
    function tf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var ks;
    function xr(e) {
      ks = e;
    }
    function fy(e) {
      ks(e);
    }
    var Te;
    function Eo(e) {
      Te = e;
    }
    var nf;
    function qv(e) {
      nf = e;
    }
    var Kv;
    function Os(e) {
      Kv = e;
    }
    var Ms;
    function Fd(e) {
      Ms = e;
    }
    var rf = !1, Ls = [], Zi = null, Di = null, ki = null, _n = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), zr = [], Xv = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function Zv(e) {
      return Xv.indexOf(e) > -1;
    }
    function ii(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function Hd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Zi = null;
          break;
        case "dragenter":
        case "dragleave":
          Di = null;
          break;
        case "mouseover":
        case "mouseout":
          ki = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          _n.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Nr.delete(i);
          break;
        }
      }
    }
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = ko(t);
          p !== null && Te(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function dy(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Zi = ta(Zi, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return Di = ta(Di, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return ki = ta(ki, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return _n.set(y, ta(_n.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var S = u, b = S.pointerId;
          return Nr.set(b, ta(Nr.get(b) || null, e, t, a, i, S)), !0;
        }
      }
      return !1;
    }
    function Pd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === J) {
            var u = xi(a);
            if (u !== null) {
              e.blockedOn = u, Ms(e.priority, function() {
                nf(a);
              });
              return;
            }
          } else if (i === B) {
            var s = a.stateNode;
            if (tf(s)) {
              e.blockedOn = wi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Jv(e) {
      for (var t = Kv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < zr.length && er(t, zr[i].priority); i++)
        ;
      zr.splice(i, 0, a), i === 0 && Pd(a);
    }
    function Ns(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Ro(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          ly(s), u.target.dispatchEvent(s), uy();
        } else {
          var f = ko(i);
          return f !== null && Te(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Vd(e, t, a) {
      Ns(e) && a.delete(t);
    }
    function py() {
      rf = !1, Zi !== null && Ns(Zi) && (Zi = null), Di !== null && Ns(Di) && (Di = null), ki !== null && Ns(ki) && (ki = null), _n.forEach(Vd), Nr.forEach(Vd);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, rf || (rf = !0, k.unstable_scheduleCallback(k.unstable_NormalPriority, py)));
    }
    function ku(e) {
      if (Ls.length > 0) {
        Ul(Ls[0], e);
        for (var t = 1; t < Ls.length; t++) {
          var a = Ls[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Zi !== null && Ul(Zi, e), Di !== null && Ul(Di, e), ki !== null && Ul(ki, e);
      var i = function(p) {
        return Ul(p, e);
      };
      _n.forEach(i), Nr.forEach(i);
      for (var u = 0; u < zr.length; u++) {
        var s = zr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; zr.length > 0; ) {
        var f = zr[0];
        if (f.blockedOn !== null)
          break;
        Pd(f), f.blockedOn === null && zr.shift();
      }
    }
    var sr = D.ReactCurrentBatchConfig, wt = !0;
    function Gn(e) {
      wt = !!e;
    }
    function Hn() {
      return wt;
    }
    function cr(e, t, a) {
      var i = af(t), u;
      switch (i) {
        case Lr:
          u = ya;
          break;
        case _i:
          u = Co;
          break;
        case za:
        default:
          u = Dn;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = Ua(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(Lr), Dn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = Ua(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(_i), Dn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Dn(e, t, a, i) {
      wt && zs(e, t, a, i);
    }
    function zs(e, t, a, i) {
      var u = Ro(e, t, a, i);
      if (u === null) {
        Oy(e, t, i, Oi, a), Hd(e, i);
        return;
      }
      if (dy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Hd(e, i), t & Da && Zv(e)) {
        for (; u !== null; ) {
          var s = ko(u);
          s !== null && fy(s);
          var f = Ro(e, t, a, i);
          if (f === null && Oy(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Oy(e, t, i, null, a);
    }
    var Oi = null;
    function Ro(e, t, a, i) {
      Oi = null;
      var u = pd(i), s = Ys(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === J) {
            var v = xi(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === B) {
            var y = f.stateNode;
            if (tf(y))
              return wi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Oi = s, null;
    }
    function af(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return Lr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return _i;
        case "message": {
          var t = Dc();
          switch (t) {
            case ss:
              return Lr;
            case Ml:
              return _i;
            case qi:
            case cy:
              return za;
            case mu:
              return Aa;
            default:
              return za;
          }
        }
        default:
          return za;
      }
    }
    function As(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Bd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function To(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ga = null, xo = null, Ou = null;
    function jl(e) {
      return ga = e, xo = Us(), !0;
    }
    function lf() {
      ga = null, xo = null, Ou = null;
    }
    function Ji() {
      if (Ou)
        return Ou;
      var e, t = xo, a = t.length, i, u = Us(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Ou = u.slice(e, p), Ou;
    }
    function Us() {
      return "value" in ga ? ga.value : ga.textContent;
    }
    function Fl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function wo() {
      return !0;
    }
    function js() {
      return !1;
    }
    function wr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = wo : this.isDefaultPrevented = js, this.isPropagationStopped = js, this;
      }
      return ut(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = wo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = wo);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: wo
      }), t;
    }
    var Pn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Mi = wr(Pn), Ar = ut({}, Pn, {
      view: 0,
      detail: 0
    }), ra = wr(Ar), uf, Fs, Mu;
    function vy(e) {
      e !== Mu && (Mu && e.type === "mousemove" ? (uf = e.screenX - Mu.screenX, Fs = e.screenY - Mu.screenY) : (uf = 0, Fs = 0), Mu = e);
    }
    var li = ut({}, Ar, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: vn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (vy(e), uf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Fs;
      }
    }), Id = wr(li), Yd = ut({}, li, {
      dataTransfer: 0
    }), Lu = wr(Yd), $d = ut({}, Ar, {
      relatedTarget: 0
    }), el = wr($d), eh = ut({}, Pn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), th = wr(eh), Qd = ut({}, Pn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), of = wr(Qd), hy = ut({}, Pn, {
      data: 0
    }), nh = wr(hy), rh = nh, ah = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Nu = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function my(e) {
      if (e.key) {
        var t = ah[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Nu[e.keyCode] || "Unidentified" : "";
    }
    var bo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function ih(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = bo[e];
      return i ? !!a[i] : !1;
    }
    function vn(e) {
      return ih;
    }
    var yy = ut({}, Ar, {
      key: my,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: vn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Fl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Fl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), lh = wr(yy), gy = ut({}, li, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), uh = wr(gy), oh = ut({}, Ar, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), sh = wr(oh), Sy = ut({}, Pn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ja = wr(Sy), Wd = ut({}, li, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Ey = wr(Wd), Hl = [9, 13, 27, 32], Hs = 229, tl = Mn && "CompositionEvent" in window, Pl = null;
    Mn && "documentMode" in document && (Pl = document.documentMode);
    var Gd = Mn && "TextEvent" in window && !Pl, sf = Mn && (!tl || Pl && Pl > 8 && Pl <= 11), ch = 32, cf = String.fromCharCode(ch);
    function Cy() {
      ht("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), ht("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), ht("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), ht("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var qd = !1;
    function fh(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function ff(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function df(e, t) {
      return e === "keydown" && t.keyCode === Hs;
    }
    function Kd(e, t) {
      switch (e) {
        case "keyup":
          return Hl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Hs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function pf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function dh(e) {
      return e.locale === "ko";
    }
    var zu = !1;
    function Xd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = ff(t) : zu ? Kd(t, i) && (s = "onCompositionEnd") : df(t, i) && (s = "onCompositionStart"), !s)
        return null;
      sf && !dh(i) && (!zu && s === "onCompositionStart" ? zu = jl(u) : s === "onCompositionEnd" && zu && (f = Ji()));
      var p = Sh(a, s);
      if (p.length > 0) {
        var v = new nh(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = pf(i);
          y !== null && (v.data = y);
        }
      }
    }
    function vf(e, t) {
      switch (e) {
        case "compositionend":
          return pf(t);
        case "keypress":
          var a = t.which;
          return a !== ch ? null : (qd = !0, cf);
        case "textInput":
          var i = t.data;
          return i === cf && qd ? null : i;
        default:
          return null;
      }
    }
    function Zd(e, t) {
      if (zu) {
        if (e === "compositionend" || !tl && Kd(e, t)) {
          var a = Ji();
          return lf(), zu = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!fh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return sf && !dh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function hf(e, t, a, i, u) {
      var s;
      if (Gd ? s = vf(t, i) : s = Zd(t, i), !s)
        return null;
      var f = Sh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new rh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function ph(e, t, a, i, u, s, f) {
      Xd(e, t, a, i, u), hf(e, t, a, i, u);
    }
    var Ry = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Ps(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Ry[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Ty(e) {
      if (!Mn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      ht("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function vh(e, t, a, i) {
      oo(i);
      var u = Sh(t, "onChange");
      if (u.length > 0) {
        var s = new Mi("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Vl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      vh(t, n, e, pd(e)), bv(o, t);
    }
    function o(e) {
      ME(e, 0);
    }
    function c(e) {
      var t = Cf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    Mn && (m = Ty("input") && (!document.documentMode || document.documentMode > 9));
    function E(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", U);
    }
    function T() {
      Vl && (Vl.detachEvent("onpropertychange", U), Vl = null, n = null);
    }
    function U(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function K(e, t, a) {
      e === "focusin" ? (T(), E(t, a)) : e === "focusout" && T();
    }
    function ee(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function q(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Se(e, t) {
      if (e === "click")
        return c(t);
    }
    function be(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function ke(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ve(e, "number", e.value);
    }
    function kn(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window, v, y;
      if (r(p) ? v = d : Ps(p) ? m ? v = be : (v = ee, y = K) : q(p) && (v = Se), v) {
        var S = v(t, a);
        if (S) {
          vh(e, S, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && ke(p);
    }
    function O() {
      $t("onMouseEnter", ["mouseout", "mouseover"]), $t("onMouseLeave", ["mouseout", "mouseover"]), $t("onPointerEnter", ["pointerout", "pointerover"]), $t("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function w(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !rs(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ys(y) || dp(y)))
          return;
      }
      if (!(!v && !p)) {
        var S;
        if (u.window === u)
          S = u;
        else {
          var b = u.ownerDocument;
          b ? S = b.defaultView || b.parentWindow : S = window;
        }
        var x, z;
        if (v) {
          var j = i.relatedTarget || i.toElement;
          if (x = a, z = j ? Ys(j) : null, z !== null) {
            var P = pa(z);
            (z !== P || z.tag !== ne && z.tag !== ie) && (z = null);
          }
        } else
          x = null, z = a;
        if (x !== z) {
          var me = Id, Be = "onMouseLeave", Ue = "onMouseEnter", _t = "mouse";
          (t === "pointerout" || t === "pointerover") && (me = uh, Be = "onPointerLeave", Ue = "onPointerEnter", _t = "pointer");
          var Et = x == null ? S : Cf(x), M = z == null ? S : Cf(z), V = new me(Be, _t + "leave", x, i, u);
          V.target = Et, V.relatedTarget = M;
          var L = null, te = Ys(u);
          if (te === a) {
            var Ce = new me(Ue, _t + "enter", z, i, u);
            Ce.target = M, Ce.relatedTarget = Et, L = Ce;
          }
          NT(e, V, L, x, z);
        }
      }
    }
    function N(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var X = typeof Object.is == "function" ? Object.is : N;
    function _e(e, t) {
      if (X(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!br.call(t, s) || !X(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Ie(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function $e(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Xe(e, t) {
      for (var a = Ie(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Ie($e(a));
      }
    }
    function tr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Ft(e, u, s, f, p);
    }
    function Ft(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, S = e, b = null;
      e: for (; ; ) {
        for (var x = null; S === t && (a === 0 || S.nodeType === Yi) && (f = s + a), S === i && (u === 0 || S.nodeType === Yi) && (p = s + u), S.nodeType === Yi && (s += S.nodeValue.length), (x = S.firstChild) !== null; )
          b = S, S = x;
        for (; ; ) {
          if (S === e)
            break e;
          if (b === t && ++v === a && (f = s), b === i && ++y === u && (p = s), (x = S.nextSibling) !== null)
            break;
          S = b, b = S.parentNode;
        }
        S = x;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function Bl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var y = Xe(e, f), S = Xe(e, p);
        if (y && S) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === S.node && u.focusOffset === S.offset)
            return;
          var b = a.createRange();
          b.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(b), u.extend(S.node, S.offset)) : (b.setEnd(S.node, S.offset), u.addRange(b));
        }
      }
    }
    function hh(e) {
      return e && e.nodeType === Yi;
    }
    function EE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : hh(e) ? !1 : hh(t) ? EE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function hT(e) {
      return e && e.ownerDocument && EE(e.ownerDocument.documentElement, e);
    }
    function mT(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function CE() {
      for (var e = window, t = _a(); t instanceof e.HTMLIFrameElement; ) {
        if (mT(t))
          e = t.contentWindow;
        else
          return t;
        t = _a(e.document);
      }
      return t;
    }
    function xy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function yT() {
      var e = CE();
      return {
        focusedElem: e,
        selectionRange: xy(e) ? ST(e) : null
      };
    }
    function gT(e) {
      var t = CE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && hT(a)) {
        i !== null && xy(a) && ET(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Wr && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < u.length; f++) {
          var p = u[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function ST(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = tr(e), t || {
        start: 0,
        end: 0
      };
    }
    function ET(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var CT = Mn && "documentMode" in document && document.documentMode <= 11;
    function RT() {
      ht("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var mf = null, wy = null, Jd = null, by = !1;
    function TT(e) {
      if ("selectionStart" in e && xy(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function xT(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function RE(e, t, a) {
      var i = xT(a);
      if (!(by || mf == null || mf !== _a(i))) {
        var u = TT(mf);
        if (!Jd || !_e(Jd, u)) {
          Jd = u;
          var s = Sh(wy, "onSelect");
          if (s.length > 0) {
            var f = new Mi("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = mf;
          }
        }
      }
    }
    function wT(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window;
      switch (t) {
        case "focusin":
          (Ps(p) || p.contentEditable === "true") && (mf = p, wy = a, Jd = null);
          break;
        case "focusout":
          mf = null, wy = null, Jd = null;
          break;
        case "mousedown":
          by = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          by = !1, RE(e, i, u);
          break;
        case "selectionchange":
          if (CT)
            break;
        case "keydown":
        case "keyup":
          RE(e, i, u);
      }
    }
    function mh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var yf = {
      animationend: mh("Animation", "AnimationEnd"),
      animationiteration: mh("Animation", "AnimationIteration"),
      animationstart: mh("Animation", "AnimationStart"),
      transitionend: mh("Transition", "TransitionEnd")
    }, _y = {}, TE = {};
    Mn && (TE = document.createElement("div").style, "AnimationEvent" in window || (delete yf.animationend.animation, delete yf.animationiteration.animation, delete yf.animationstart.animation), "TransitionEvent" in window || delete yf.transitionend.transition);
    function yh(e) {
      if (_y[e])
        return _y[e];
      if (!yf[e])
        return e;
      var t = yf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in TE)
          return _y[e] = t[a];
      return e;
    }
    var xE = yh("animationend"), wE = yh("animationiteration"), bE = yh("animationstart"), _E = yh("transitionend"), DE = /* @__PURE__ */ new Map(), kE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function _o(e, t) {
      DE.set(e, t), ht(t, [e]);
    }
    function bT() {
      for (var e = 0; e < kE.length; e++) {
        var t = kE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        _o(a, "on" + i);
      }
      _o(xE, "onAnimationEnd"), _o(wE, "onAnimationIteration"), _o(bE, "onAnimationStart"), _o("dblclick", "onDoubleClick"), _o("focusin", "onFocus"), _o("focusout", "onBlur"), _o(_E, "onTransitionEnd");
    }
    function _T(e, t, a, i, u, s, f) {
      var p = DE.get(t);
      if (p !== void 0) {
        var v = Mi, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = lh;
            break;
          case "focusin":
            y = "focus", v = el;
            break;
          case "focusout":
            y = "blur", v = el;
            break;
          case "beforeblur":
          case "afterblur":
            v = el;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Id;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Lu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = sh;
            break;
          case xE:
          case wE:
          case bE:
            v = th;
            break;
          case _E:
            v = ja;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = Ey;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = of;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = uh;
            break;
        }
        var S = (s & Da) !== 0;
        {
          var b = !S && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", x = MT(a, p, i.type, S, b);
          if (x.length > 0) {
            var z = new v(p, y, null, i, u);
            e.push({
              event: z,
              listeners: x
            });
          }
        }
      }
    }
    bT(), O(), Vs(), RT(), Cy();
    function DT(e, t, a, i, u, s, f) {
      _T(e, t, a, i, u, s);
      var p = (s & dd) === 0;
      p && (w(e, t, a, i, u), kn(e, t, a, i, u), wT(e, t, a, i, u), ph(e, t, a, i, u));
    }
    var ep = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Dy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(ep));
    function OE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function kT(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          OE(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var S = t[y], b = S.instance, x = S.currentTarget, z = S.listener;
          if (b !== i && e.isPropagationStopped())
            return;
          OE(e, z, x), i = b;
        }
    }
    function ME(e, t) {
      for (var a = (t & Da) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        kT(s, f, a);
      }
      ls();
    }
    function OT(e, t, a, i, u) {
      var s = pd(a), f = [];
      DT(f, e, i, a, s, t), ME(f, t);
    }
    function En(e, t) {
      Dy.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = lw(t), u = zT(e);
      i.has(u) || (LE(t, e, hc, a), i.add(u));
    }
    function ky(e, t, a) {
      Dy.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Da), LE(a, e, i, t);
    }
    var gh = "_reactListening" + Math.random().toString(36).slice(2);
    function tp(e) {
      if (!e[gh]) {
        e[gh] = !0, ot.forEach(function(a) {
          a !== "selectionchange" && (Dy.has(a) || ky(a, !1, e), ky(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[gh] || (t[gh] = !0, ky("selectionchange", !1, t)));
      }
    }
    function LE(e, t, a, i, u) {
      var s = cr(e, t, a), f = void 0;
      is && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Bd(e, t, s, f) : na(e, t, s) : f !== void 0 ? To(e, t, s, f) : As(e, t, s);
    }
    function NE(e, t) {
      return e === t || e.nodeType === Nn && e.parentNode === t;
    }
    function Oy(e, t, a, i, u) {
      var s = i;
      if (!(t & fd) && !(t & hc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === B || v === ue) {
              var y = p.stateNode.containerInfo;
              if (NE(y, f))
                break;
              if (v === ue)
                for (var S = p.return; S !== null; ) {
                  var b = S.tag;
                  if (b === B || b === ue) {
                    var x = S.stateNode.containerInfo;
                    if (NE(x, f))
                      return;
                  }
                  S = S.return;
                }
              for (; y !== null; ) {
                var z = Ys(y);
                if (z === null)
                  return;
                var j = z.tag;
                if (j === ne || j === ie) {
                  p = s = z;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      bv(function() {
        return OT(e, t, a, s);
      });
    }
    function np(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function MT(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, S = null; y !== null; ) {
        var b = y, x = b.stateNode, z = b.tag;
        if (z === ne && x !== null && (S = x, p !== null)) {
          var j = wl(y, p);
          j != null && v.push(np(y, j, S));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function Sh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === ne && f !== null) {
          var v = f, y = wl(u, a);
          y != null && i.unshift(np(u, y, v));
          var S = wl(u, t);
          S != null && i.push(np(u, S, v));
        }
        u = u.return;
      }
      return i;
    }
    function gf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ne);
      return e || null;
    }
    function LT(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = gf(s))
        u++;
      for (var f = 0, p = i; p; p = gf(p))
        f++;
      for (; u - f > 0; )
        a = gf(a), u--;
      for (; f - u > 0; )
        i = gf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = gf(a), i = gf(i);
      }
      return null;
    }
    function zE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, S = v.stateNode, b = v.tag;
        if (y !== null && y === i)
          break;
        if (b === ne && S !== null) {
          var x = S;
          if (u) {
            var z = wl(p, s);
            z != null && f.unshift(np(p, z, x));
          } else if (!u) {
            var j = wl(p, s);
            j != null && f.push(np(p, j, x));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function NT(e, t, a, i, u) {
      var s = i && u ? LT(i, u) : null;
      i !== null && zE(e, t, i, s, !1), u !== null && a !== null && zE(e, a, u, s, !0);
    }
    function zT(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, rp = "dangerouslySetInnerHTML", Eh = "suppressContentEditableWarning", Do = "suppressHydrationWarning", AE = "autoFocus", Bs = "children", Is = "style", Ch = "__html", My, Rh, ap, UE, Th, jE, FE;
    My = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Rh = function(e, t) {
      od(e, t), pc(e, t), Tv(e, t, {
        registrationNameDependencies: lt,
        possibleRegistrationNames: st
      });
    }, jE = Mn && !document.documentMode, ap = function(e, t, a) {
      if (!Fa) {
        var i = xh(a), u = xh(t);
        u !== i && (Fa = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, UE = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, Th = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, FE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var AT = /\r\n?/g, UT = /\u0000|\uFFFD/g;
    function xh(e) {
      Kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(AT, `
`).replace(UT, "");
    }
    function wh(e, t, a, i) {
      var u = xh(t), s = xh(e);
      if (s !== u && (i && (Fa || (Fa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Le))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function HE(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function jT() {
    }
    function bh(e) {
      e.onclick = jT;
    }
    function FT(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Is)
            f && Object.freeze(f), yv(t, f);
          else if (s === rp) {
            var p = f ? f[Ch] : void 0;
            p != null && iv(t, p);
          } else if (s === Bs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ao(t, f);
            } else typeof f == "number" && ao(t, "" + f);
          else s === Eh || s === Do || s === AE || (lt.hasOwnProperty(s) ? f != null && (typeof f != "function" && Th(s, f), s === "onScroll" && En("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function HT(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Is ? yv(e, f) : s === rp ? iv(e, f) : s === Bs ? ao(e, f) : _r(e, s, f, i);
      }
    }
    function PT(e, t, a, i) {
      var u, s = HE(a), f, p = i;
      if (p === Ii && (p = td(e)), p === Ii) {
        if (u = Tl(e, t), !u && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var y = v.firstChild;
          f = v.removeChild(y);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var S = f;
          t.multiple ? S.multiple = !0 : t.size && (S.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(My, e) && (My[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function VT(e, t) {
      return HE(t).createTextNode(e);
    }
    function BT(e, t, a, i) {
      var u = Tl(t, a);
      Rh(t, a);
      var s;
      switch (t) {
        case "dialog":
          En("cancel", e), En("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          En("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < ep.length; f++)
            En(ep[f], e);
          s = a;
          break;
        case "source":
          En("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          En("error", e), En("load", e), s = a;
          break;
        case "details":
          En("toggle", e), s = a;
          break;
        case "input":
          ei(e, a), s = ro(e, a), En("invalid", e);
          break;
        case "option":
          Ot(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Ko(e, a), En("invalid", e);
          break;
        case "textarea":
          Zf(e, a), s = Xf(e, a), En("invalid", e);
          break;
        default:
          s = a;
      }
      switch (fc(t, s), FT(t, e, i, s, u), t) {
        case "input":
          Ja(e), A(e, a, !1);
          break;
        case "textarea":
          Ja(e), rv(e);
          break;
        case "option":
          ln(e, a);
          break;
        case "select":
          qf(e, a);
          break;
        default:
          typeof s.onClick == "function" && bh(e);
          break;
      }
    }
    function IT(e, t, a, i, u) {
      Rh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ro(e, a), p = ro(e, i), s = [];
          break;
        case "select":
          f = Ko(e, a), p = Ko(e, i), s = [];
          break;
        case "textarea":
          f = Xf(e, a), p = Xf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && bh(e);
          break;
      }
      fc(t, p);
      var v, y, S = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Is) {
            var b = f[v];
            for (y in b)
              b.hasOwnProperty(y) && (S || (S = {}), S[y] = "");
          } else v === rp || v === Bs || v === Eh || v === Do || v === AE || (lt.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var x = p[v], z = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || x === z || x == null && z == null))
          if (v === Is)
            if (x && Object.freeze(x), z) {
              for (y in z)
                z.hasOwnProperty(y) && (!x || !x.hasOwnProperty(y)) && (S || (S = {}), S[y] = "");
              for (y in x)
                x.hasOwnProperty(y) && z[y] !== x[y] && (S || (S = {}), S[y] = x[y]);
            } else
              S || (s || (s = []), s.push(v, S)), S = x;
          else if (v === rp) {
            var j = x ? x[Ch] : void 0, P = z ? z[Ch] : void 0;
            j != null && P !== j && (s = s || []).push(v, j);
          } else v === Bs ? (typeof x == "string" || typeof x == "number") && (s = s || []).push(v, "" + x) : v === Eh || v === Do || (lt.hasOwnProperty(v) ? (x != null && (typeof x != "function" && Th(v, x), v === "onScroll" && En("scroll", e)), !s && z !== x && (s = [])) : (s = s || []).push(v, x));
      }
      return S && (ay(S, p[Is]), (s = s || []).push(Is, S)), s;
    }
    function YT(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = Tl(a, i), f = Tl(a, u);
      switch (HT(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          nv(e, u);
          break;
        case "select":
          oc(e, u);
          break;
      }
    }
    function $T(e) {
      {
        var t = e.toLowerCase();
        return ts.hasOwnProperty(t) && ts[t] || null;
      }
    }
    function QT(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Tl(t, a), Rh(t, a), t) {
        case "dialog":
          En("cancel", e), En("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          En("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < ep.length; y++)
            En(ep[y], e);
          break;
        case "source":
          En("error", e);
          break;
        case "img":
        case "image":
        case "link":
          En("error", e), En("load", e);
          break;
        case "details":
          En("toggle", e);
          break;
        case "input":
          ei(e, a), En("invalid", e);
          break;
        case "option":
          Ot(e, a);
          break;
        case "select":
          ou(e, a), En("invalid", e);
          break;
        case "textarea":
          Zf(e, a), En("invalid", e);
          break;
      }
      fc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var S = e.attributes, b = 0; b < S.length; b++) {
          var x = S[b].name.toLowerCase();
          switch (x) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(S[b].name);
          }
        }
      }
      var z = null;
      for (var j in a)
        if (a.hasOwnProperty(j)) {
          var P = a[j];
          if (j === Bs)
            typeof P == "string" ? e.textContent !== P && (a[Do] !== !0 && wh(e.textContent, P, s, f), z = [Bs, P]) : typeof P == "number" && e.textContent !== "" + P && (a[Do] !== !0 && wh(e.textContent, P, s, f), z = [Bs, "" + P]);
          else if (lt.hasOwnProperty(j))
            P != null && (typeof P != "function" && Th(j, P), j === "onScroll" && En("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var me = void 0, Be = rn(j);
            if (a[Do] !== !0) {
              if (!(j === Eh || j === Do || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              j === "value" || j === "checked" || j === "selected")) {
                if (j === rp) {
                  var Ue = e.innerHTML, _t = P ? P[Ch] : void 0;
                  if (_t != null) {
                    var Et = FE(e, _t);
                    Et !== Ue && ap(j, Ue, Et);
                  }
                } else if (j === Is) {
                  if (v.delete(j), jE) {
                    var M = ny(P);
                    me = e.getAttribute("style"), M !== me && ap(j, me, M);
                  }
                } else if (p && !_)
                  v.delete(j.toLowerCase()), me = tu(e, j, P), P !== me && ap(j, me, P);
                else if (!hn(j, Be, p) && !Xn(j, P, Be, p)) {
                  var V = !1;
                  if (Be !== null)
                    v.delete(Be.attributeName), me = vl(e, j, P, Be);
                  else {
                    var L = i;
                    if (L === Ii && (L = td(t)), L === Ii)
                      v.delete(j.toLowerCase());
                    else {
                      var te = $T(j);
                      te !== null && te !== j && (V = !0, v.delete(te)), v.delete(j);
                    }
                    me = tu(e, j, P);
                  }
                  var Ce = _;
                  !Ce && P !== me && !V && ap(j, me, P);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Do] !== !0 && UE(v), t) {
        case "input":
          Ja(e), A(e, a, !0);
          break;
        case "textarea":
          Ja(e), rv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && bh(e);
          break;
      }
      return z;
    }
    function WT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Ly(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function zy(e, t, a) {
      {
        if (Fa)
          return;
        Fa = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Ay(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function GT(e, t, a) {
      switch (t) {
        case "input":
          H(e, a);
          return;
        case "textarea":
          Zm(e, a);
          return;
        case "select":
          Kf(e, a);
          return;
      }
    }
    var ip = function() {
    }, lp = function() {
    };
    {
      var qT = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], PE = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], KT = PE.concat(["button"]), XT = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], VE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      lp = function(e, t) {
        var a = ut({}, e || VE), i = {
          tag: t
        };
        return PE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), KT.indexOf(t) !== -1 && (a.pTagInButtonScope = null), qT.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var ZT = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return XT.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, JT = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, BE = {};
      ip = function(e, t, a) {
        a = a || VE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = ZT(e, u) ? null : i, f = s ? null : JT(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!BE[y]) {
            BE[y] = !0;
            var S = e, b = "";
            if (e === "#text" ? /\S/.test(t) ? S = "Text nodes" : (S = "Whitespace text nodes", b = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : S = "<" + e + ">", s) {
              var x = "";
              v === "table" && e === "tr" && (x += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", S, v, b, x);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", S, v);
          }
        }
      };
    }
    var _h = "suppressHydrationWarning", Dh = "$", kh = "/$", up = "$?", op = "$!", ex = "style", Uy = null, jy = null;
    function tx(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case rd: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : nd(null, "");
          break;
        }
        default: {
          var s = i === Nn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = nd(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = lp(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function nx(e, t, a) {
      {
        var i = e, u = nd(i.namespace, t), s = lp(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function HD(e) {
      return e;
    }
    function rx(e) {
      Uy = Hn(), jy = yT();
      var t = null;
      return Gn(!1), t;
    }
    function ax(e) {
      gT(jy), Gn(Uy), Uy = null, jy = null;
    }
    function ix(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (ip(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = lp(f.ancestorInfo, e);
          ip(null, p, v);
        }
        s = f.namespace;
      }
      var y = PT(e, t, a, s);
      return fp(u, y), $y(y, t), y;
    }
    function lx(e, t) {
      e.appendChild(t);
    }
    function ux(e, t, a, i, u) {
      switch (BT(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function ox(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = lp(f.ancestorInfo, t);
          ip(null, p, v);
        }
      }
      return IT(e, t, a, i);
    }
    function Fy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function sx(e, t, a, i) {
      {
        var u = a;
        ip(null, e, u.ancestorInfo);
      }
      var s = VT(e, t);
      return fp(i, s), s;
    }
    function cx() {
      var e = window.event;
      return e === void 0 ? za : af(e.type);
    }
    var Hy = typeof setTimeout == "function" ? setTimeout : void 0, fx = typeof clearTimeout == "function" ? clearTimeout : void 0, Py = -1, IE = typeof Promise == "function" ? Promise : void 0, dx = typeof queueMicrotask == "function" ? queueMicrotask : typeof IE < "u" ? function(e) {
      return IE.resolve(null).then(e).catch(px);
    } : Hy;
    function px(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function vx(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function hx(e, t, a, i, u, s) {
      YT(e, t, a, i, u), $y(e, u);
    }
    function YE(e) {
      ao(e, "");
    }
    function mx(e, t, a) {
      e.nodeValue = a;
    }
    function yx(e, t) {
      e.appendChild(t);
    }
    function gx(e, t) {
      var a;
      e.nodeType === Nn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && bh(a);
    }
    function Sx(e, t, a) {
      e.insertBefore(t, a);
    }
    function Ex(e, t, a) {
      e.nodeType === Nn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Cx(e, t) {
      e.removeChild(t);
    }
    function Rx(e, t) {
      e.nodeType === Nn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Vy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Nn) {
          var s = u.data;
          if (s === kh)
            if (i === 0) {
              e.removeChild(u), ku(t);
              return;
            } else
              i--;
          else (s === Dh || s === up || s === op) && i++;
        }
        a = u;
      } while (a);
      ku(t);
    }
    function Tx(e, t) {
      e.nodeType === Nn ? Vy(e.parentNode, t) : e.nodeType === Wr && Vy(e, t), ku(e);
    }
    function xx(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function wx(e) {
      e.nodeValue = "";
    }
    function bx(e, t) {
      e = e;
      var a = t[ex], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = cc("display", i);
    }
    function _x(e, t) {
      e.nodeValue = t;
    }
    function Dx(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function kx(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Ox(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function Mx(e) {
      return e.nodeType !== Nn ? null : e;
    }
    function $E(e) {
      return e.data === up;
    }
    function By(e) {
      return e.data === op;
    }
    function Lx(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Nx(e, t) {
      e._reactRetry = t;
    }
    function Oh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === Nn) {
          var a = e.data;
          if (a === Dh || a === op || a === up)
            break;
          if (a === kh)
            return null;
        }
      }
      return e;
    }
    function sp(e) {
      return Oh(e.nextSibling);
    }
    function zx(e) {
      return Oh(e.firstChild);
    }
    function Ax(e) {
      return Oh(e.firstChild);
    }
    function Ux(e) {
      return Oh(e.nextSibling);
    }
    function jx(e, t, a, i, u, s, f) {
      fp(s, e), $y(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & yt) !== He;
      return QT(e, t, a, p, i, y, f);
    }
    function Fx(e, t, a, i) {
      return fp(a, e), a.mode & yt, WT(e, t);
    }
    function Hx(e, t) {
      fp(t, e);
    }
    function Px(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Nn) {
          var i = t.data;
          if (i === kh) {
            if (a === 0)
              return sp(t);
            a--;
          } else (i === Dh || i === op || i === up) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function QE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Nn) {
          var i = t.data;
          if (i === Dh || i === op || i === up) {
            if (a === 0)
              return t;
            a--;
          } else i === kh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Vx(e) {
      ku(e);
    }
    function Bx(e) {
      ku(e);
    }
    function Ix(e) {
      return e !== "head" && e !== "body";
    }
    function Yx(e, t, a, i) {
      var u = !0;
      wh(t.nodeValue, a, i, u);
    }
    function $x(e, t, a, i, u, s) {
      if (t[_h] !== !0) {
        var f = !0;
        wh(i.nodeValue, u, s, f);
      }
    }
    function Qx(e, t) {
      t.nodeType === Wr ? Ly(e, t) : t.nodeType === Nn || Ny(e, t);
    }
    function Wx(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? Ly(a, t) : t.nodeType === Nn || Ny(a, t));
      }
    }
    function Gx(e, t, a, i, u) {
      (u || t[_h] !== !0) && (i.nodeType === Wr ? Ly(a, i) : i.nodeType === Nn || Ny(a, i));
    }
    function qx(e, t, a) {
      zy(e, t);
    }
    function Kx(e, t) {
      Ay(e, t);
    }
    function Xx(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && zy(i, t);
      }
    }
    function Zx(e, t) {
      {
        var a = e.parentNode;
        a !== null && Ay(a, t);
      }
    }
    function Jx(e, t, a, i, u, s) {
      (s || t[_h] !== !0) && zy(a, i);
    }
    function ew(e, t, a, i, u) {
      (u || t[_h] !== !0) && Ay(a, i);
    }
    function tw(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function nw(e) {
      tp(e);
    }
    var Sf = Math.random().toString(36).slice(2), Ef = "__reactFiber$" + Sf, Iy = "__reactProps$" + Sf, cp = "__reactContainer$" + Sf, Yy = "__reactEvents$" + Sf, rw = "__reactListeners$" + Sf, aw = "__reactHandles$" + Sf;
    function iw(e) {
      delete e[Ef], delete e[Iy], delete e[Yy], delete e[rw], delete e[aw];
    }
    function fp(e, t) {
      t[Ef] = e;
    }
    function Mh(e, t) {
      t[cp] = e;
    }
    function WE(e) {
      e[cp] = null;
    }
    function dp(e) {
      return !!e[cp];
    }
    function Ys(e) {
      var t = e[Ef];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[cp] || a[Ef], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = QE(e); u !== null; ) {
              var s = u[Ef];
              if (s)
                return s;
              u = QE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function ko(e) {
      var t = e[Ef] || e[cp];
      return t && (t.tag === ne || t.tag === ie || t.tag === J || t.tag === B) ? t : null;
    }
    function Cf(e) {
      if (e.tag === ne || e.tag === ie)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Lh(e) {
      return e[Iy] || null;
    }
    function $y(e, t) {
      e[Iy] = t;
    }
    function lw(e) {
      var t = e[Yy];
      return t === void 0 && (t = e[Yy] = /* @__PURE__ */ new Set()), t;
    }
    var GE = {}, qE = D.ReactDebugCurrentFrame;
    function Nh(e) {
      if (e) {
        var t = e._owner, a = Pi(e.type, e._source, t ? t.type : null);
        qE.setExtraStackFrame(a);
      } else
        qE.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, u) {
      {
        var s = Function.call.bind(br);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (y) {
              p = y;
            }
            p && !(p instanceof Error) && (Nh(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Nh(null)), p instanceof Error && !(p.message in GE) && (GE[p.message] = !0, Nh(u), g("Failed %s type: %s", a, p.message), Nh(null));
          }
      }
    }
    var Qy = [], zh;
    zh = [];
    var Au = -1;
    function Oo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (Au < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== zh[Au] && g("Unexpected Fiber popped."), e.current = Qy[Au], Qy[Au] = null, zh[Au] = null, Au--;
    }
    function ia(e, t, a) {
      Au++, Qy[Au] = e.current, zh[Au] = a, e.current = t;
    }
    var Wy;
    Wy = {};
    var ui = {};
    Object.freeze(ui);
    var Uu = Oo(ui), Il = Oo(!1), Gy = ui;
    function Rf(e, t, a) {
      return a && Yl(t) ? Gy : Uu.current;
    }
    function KE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Tf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return ui;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = Ze(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && KE(e, t, s), s;
      }
    }
    function Ah() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Uh(e) {
      aa(Il, e), aa(Uu, e);
    }
    function qy(e) {
      aa(Il, e), aa(Uu, e);
    }
    function XE(e, t, a) {
      {
        if (Uu.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Uu, t, e), ia(Il, a, e);
      }
    }
    function ZE(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Ze(e) || "Unknown";
            Wy[s] || (Wy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Ze(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Ze(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return ut({}, a, f);
      }
    }
    function jh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Gy = Uu.current, ia(Uu, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function JE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = ZE(e, t, Gy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Uu, e), ia(Uu, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function uw(e) {
      {
        if (!hu(e) || e.tag !== Z)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case B:
              return t.stateNode.context;
            case Z: {
              var a = t.type;
              if (Yl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Mo = 0, Fh = 1, ju = null, Ky = !1, Xy = !1;
    function eC(e) {
      ju === null ? ju = [e] : ju.push(e);
    }
    function ow(e) {
      Ky = !0, eC(e);
    }
    function tC() {
      Ky && Lo();
    }
    function Lo() {
      if (!Xy && ju !== null) {
        Xy = !0;
        var e = 0, t = Ua();
        try {
          var a = !0, i = ju;
          for (Fn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          ju = null, Ky = !1;
        } catch (s) {
          throw ju !== null && (ju = ju.slice(e + 1)), hd(ss, Lo), s;
        } finally {
          Fn(t), Xy = !1;
        }
      }
      return null;
    }
    var xf = [], wf = 0, Hh = null, Ph = 0, Li = [], Ni = 0, $s = null, Fu = 1, Hu = "";
    function sw(e) {
      return Ws(), (e.flags & Ri) !== Fe;
    }
    function cw(e) {
      return Ws(), Ph;
    }
    function fw() {
      var e = Hu, t = Fu, a = t & ~dw(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Ws(), xf[wf++] = Ph, xf[wf++] = Hh, Hh = e, Ph = t;
    }
    function nC(e, t, a) {
      Ws(), Li[Ni++] = Fu, Li[Ni++] = Hu, Li[Ni++] = $s, $s = e;
      var i = Fu, u = Hu, s = Vh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Vh(t) + s;
      if (v > 30) {
        var y = s - s % 5, S = (1 << y) - 1, b = (f & S).toString(32), x = f >> y, z = s - y, j = Vh(t) + z, P = p << z, me = P | x, Be = b + u;
        Fu = 1 << j | me, Hu = Be;
      } else {
        var Ue = p << s, _t = Ue | f, Et = u;
        Fu = 1 << v | _t, Hu = Et;
      }
    }
    function Zy(e) {
      Ws();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), nC(e, a, i);
      }
    }
    function Vh(e) {
      return 32 - Un(e);
    }
    function dw(e) {
      return 1 << Vh(e) - 1;
    }
    function Jy(e) {
      for (; e === Hh; )
        Hh = xf[--wf], xf[wf] = null, Ph = xf[--wf], xf[wf] = null;
      for (; e === $s; )
        $s = Li[--Ni], Li[Ni] = null, Hu = Li[--Ni], Li[Ni] = null, Fu = Li[--Ni], Li[Ni] = null;
    }
    function pw() {
      return Ws(), $s !== null ? {
        id: Fu,
        overflow: Hu
      } : null;
    }
    function vw(e, t) {
      Ws(), Li[Ni++] = Fu, Li[Ni++] = Hu, Li[Ni++] = $s, Fu = t.id, Hu = t.overflow, $s = e;
    }
    function Ws() {
      jr() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ur = null, zi = null, rl = !1, Gs = !1, No = null;
    function hw() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function rC() {
      Gs = !0;
    }
    function mw() {
      return Gs;
    }
    function yw(e) {
      var t = e.stateNode.containerInfo;
      return zi = Ax(t), Ur = e, rl = !0, No = null, Gs = !1, !0;
    }
    function gw(e, t, a) {
      return zi = Ux(t), Ur = e, rl = !0, No = null, Gs = !1, a !== null && vw(e, a), !0;
    }
    function aC(e, t) {
      switch (e.tag) {
        case B: {
          Qx(e.stateNode.containerInfo, t);
          break;
        }
        case ne: {
          var a = (e.mode & yt) !== He;
          Gx(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case J: {
          var i = e.memoizedState;
          i.dehydrated !== null && Wx(i.dehydrated, t);
          break;
        }
      }
    }
    function iC(e, t) {
      aC(e, t);
      var a = R_();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= ka) : i.push(a);
    }
    function eg(e, t) {
      {
        if (Gs)
          return;
        switch (e.tag) {
          case B: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ne:
                var i = t.type;
                t.pendingProps, qx(a, i);
                break;
              case ie:
                var u = t.pendingProps;
                Kx(a, u);
                break;
            }
            break;
          }
          case ne: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ne: {
                var v = t.type, y = t.pendingProps, S = (e.mode & yt) !== He;
                Jx(
                  s,
                  f,
                  p,
                  v,
                  y,
                  // TODO: Delete this argument when we remove the legacy root API.
                  S
                );
                break;
              }
              case ie: {
                var b = t.pendingProps, x = (e.mode & yt) !== He;
                ew(
                  s,
                  f,
                  p,
                  b,
                  // TODO: Delete this argument when we remove the legacy root API.
                  x
                );
                break;
              }
            }
            break;
          }
          case J: {
            var z = e.memoizedState, j = z.dehydrated;
            if (j !== null) switch (t.tag) {
              case ne:
                var P = t.type;
                t.pendingProps, Xx(j, P);
                break;
              case ie:
                var me = t.pendingProps;
                Zx(j, me);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function lC(e, t) {
      t.flags = t.flags & ~qr | yn, eg(e, t);
    }
    function uC(e, t) {
      switch (e.tag) {
        case ne: {
          var a = e.type;
          e.pendingProps;
          var i = kx(t, a);
          return i !== null ? (e.stateNode = i, Ur = e, zi = zx(i), !0) : !1;
        }
        case ie: {
          var u = e.pendingProps, s = Ox(t, u);
          return s !== null ? (e.stateNode = s, Ur = e, zi = null, !0) : !1;
        }
        case J: {
          var f = Mx(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: pw(),
              retryLane: Jr
            };
            e.memoizedState = p;
            var v = T_(f);
            return v.return = e, e.child = v, Ur = e, zi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function tg(e) {
      return (e.mode & yt) !== He && (e.flags & je) === Fe;
    }
    function ng(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function rg(e) {
      if (rl) {
        var t = zi;
        if (!t) {
          tg(e) && (eg(Ur, e), ng()), lC(Ur, e), rl = !1, Ur = e;
          return;
        }
        var a = t;
        if (!uC(e, t)) {
          tg(e) && (eg(Ur, e), ng()), t = sp(a);
          var i = Ur;
          if (!t || !uC(e, t)) {
            lC(Ur, e), rl = !1, Ur = e;
            return;
          }
          iC(i, a);
        }
      }
    }
    function Sw(e, t, a) {
      var i = e.stateNode, u = !Gs, s = jx(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function Ew(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Fx(t, a, e);
      if (i) {
        var u = Ur;
        if (u !== null)
          switch (u.tag) {
            case B: {
              var s = u.stateNode.containerInfo, f = (u.mode & yt) !== He;
              Yx(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ne: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, S = (u.mode & yt) !== He;
              $x(
                p,
                v,
                y,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                S
              );
              break;
            }
          }
      }
      return i;
    }
    function Cw(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Hx(a, e);
    }
    function Rw(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Px(a);
    }
    function oC(e) {
      for (var t = e.return; t !== null && t.tag !== ne && t.tag !== B && t.tag !== J; )
        t = t.return;
      Ur = t;
    }
    function Bh(e) {
      if (e !== Ur)
        return !1;
      if (!rl)
        return oC(e), rl = !0, !1;
      if (e.tag !== B && (e.tag !== ne || Ix(e.type) && !Fy(e.type, e.memoizedProps))) {
        var t = zi;
        if (t)
          if (tg(e))
            sC(e), ng();
          else
            for (; t; )
              iC(e, t), t = sp(t);
      }
      return oC(e), e.tag === J ? zi = Rw(e) : zi = Ur ? sp(e.stateNode) : null, !0;
    }
    function Tw() {
      return rl && zi !== null;
    }
    function sC(e) {
      for (var t = zi; t; )
        aC(e, t), t = sp(t);
    }
    function bf() {
      Ur = null, zi = null, rl = !1, Gs = !1;
    }
    function cC() {
      No !== null && (rR(No), No = null);
    }
    function jr() {
      return rl;
    }
    function ag(e) {
      No === null ? No = [e] : No.push(e);
    }
    var xw = D.ReactCurrentBatchConfig, ww = null;
    function bw() {
      return xw.transition;
    }
    var al = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var _w = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Xt && (t = a), a = a.return;
        return t;
      }, qs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, pp = [], vp = [], hp = [], mp = [], yp = [], gp = [], Ks = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && pp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillMount == "function" && vp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && hp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillReceiveProps == "function" && mp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && yp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillUpdate == "function" && gp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        pp.length > 0 && (pp.forEach(function(x) {
          e.add(Ze(x) || "Component"), Ks.add(x.type);
        }), pp = []);
        var t = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(x) {
          t.add(Ze(x) || "Component"), Ks.add(x.type);
        }), vp = []);
        var a = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(x) {
          a.add(Ze(x) || "Component"), Ks.add(x.type);
        }), hp = []);
        var i = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(x) {
          i.add(Ze(x) || "Component"), Ks.add(x.type);
        }), mp = []);
        var u = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(x) {
          u.add(Ze(x) || "Component"), Ks.add(x.type);
        }), yp = []);
        var s = /* @__PURE__ */ new Set();
        if (gp.length > 0 && (gp.forEach(function(x) {
          s.add(Ze(x) || "Component"), Ks.add(x.type);
        }), gp = []), t.size > 0) {
          var f = qs(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = qs(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = qs(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = qs(e);
          ye(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var S = qs(a);
          ye(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (u.size > 0) {
          var b = qs(u);
          ye(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, b);
        }
      };
      var Ih = /* @__PURE__ */ new Map(), fC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = _w(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!fC.has(e.type)) {
          var i = Ih.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Ih.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        Ih.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Ze(s) || "Component"), fC.add(s.type);
            });
            var u = qs(i);
            try {
              Gt(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              fn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        pp = [], vp = [], hp = [], mp = [], yp = [], gp = [], Ih = /* @__PURE__ */ new Map();
      };
    }
    var ig, lg, ug, og, sg, dC = function(e, t) {
    };
    ig = !1, lg = !1, ug = {}, og = {}, sg = {}, dC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Ze(t) || "Component";
        og[a] || (og[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Dw(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Sp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Xt || I) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== Z) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Dw(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = Ze(e) || "Component";
          ug[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), ug[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== Z)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          ci(i, "ref");
          var y = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === y)
            return t.ref;
          var S = function(b) {
            var x = v.refs;
            b === null ? delete x[y] : x[y] = b;
          };
          return S._stringRef = y, S;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function Yh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function $h(e) {
      {
        var t = Ze(e) || "Component";
        if (sg[t])
          return;
        sg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function pC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function vC(e) {
      function t(M, V) {
        if (e) {
          var L = M.deletions;
          L === null ? (M.deletions = [V], M.flags |= ka) : L.push(V);
        }
      }
      function a(M, V) {
        if (!e)
          return null;
        for (var L = V; L !== null; )
          t(M, L), L = L.sibling;
        return null;
      }
      function i(M, V) {
        for (var L = /* @__PURE__ */ new Map(), te = V; te !== null; )
          te.key !== null ? L.set(te.key, te) : L.set(te.index, te), te = te.sibling;
        return L;
      }
      function u(M, V) {
        var L = ic(M, V);
        return L.index = 0, L.sibling = null, L;
      }
      function s(M, V, L) {
        if (M.index = L, !e)
          return M.flags |= Ri, V;
        var te = M.alternate;
        if (te !== null) {
          var Ce = te.index;
          return Ce < V ? (M.flags |= yn, V) : Ce;
        } else
          return M.flags |= yn, V;
      }
      function f(M) {
        return e && M.alternate === null && (M.flags |= yn), M;
      }
      function p(M, V, L, te) {
        if (V === null || V.tag !== ie) {
          var Ce = aE(L, M.mode, te);
          return Ce.return = M, Ce;
        } else {
          var ge = u(V, L);
          return ge.return = M, ge;
        }
      }
      function v(M, V, L, te) {
        var Ce = L.type;
        if (Ce === di)
          return S(M, V, L.props.children, te, L.key);
        if (V !== null && (V.elementType === Ce || // Keep this check inline so it only runs on the false path:
        SR(V, L) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Ce == "object" && Ce !== null && Ce.$$typeof === Je && pC(Ce) === V.type)) {
          var ge = u(V, L.props);
          return ge.ref = Sp(M, V, L), ge.return = M, ge._debugSource = L._source, ge._debugOwner = L._owner, ge;
        }
        var qe = rE(L, M.mode, te);
        return qe.ref = Sp(M, V, L), qe.return = M, qe;
      }
      function y(M, V, L, te) {
        if (V === null || V.tag !== ue || V.stateNode.containerInfo !== L.containerInfo || V.stateNode.implementation !== L.implementation) {
          var Ce = iE(L, M.mode, te);
          return Ce.return = M, Ce;
        } else {
          var ge = u(V, L.children || []);
          return ge.return = M, ge;
        }
      }
      function S(M, V, L, te, Ce) {
        if (V === null || V.tag !== Me) {
          var ge = Yo(L, M.mode, te, Ce);
          return ge.return = M, ge;
        } else {
          var qe = u(V, L);
          return qe.return = M, qe;
        }
      }
      function b(M, V, L) {
        if (typeof V == "string" && V !== "" || typeof V == "number") {
          var te = aE("" + V, M.mode, L);
          return te.return = M, te;
        }
        if (typeof V == "object" && V !== null) {
          switch (V.$$typeof) {
            case Dr: {
              var Ce = rE(V, M.mode, L);
              return Ce.ref = Sp(M, null, V), Ce.return = M, Ce;
            }
            case ar: {
              var ge = iE(V, M.mode, L);
              return ge.return = M, ge;
            }
            case Je: {
              var qe = V._payload, tt = V._init;
              return b(M, tt(qe), L);
            }
          }
          if (ft(V) || at(V)) {
            var Jt = Yo(V, M.mode, L, null);
            return Jt.return = M, Jt;
          }
          Yh(M, V);
        }
        return typeof V == "function" && $h(M), null;
      }
      function x(M, V, L, te) {
        var Ce = V !== null ? V.key : null;
        if (typeof L == "string" && L !== "" || typeof L == "number")
          return Ce !== null ? null : p(M, V, "" + L, te);
        if (typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case Dr:
              return L.key === Ce ? v(M, V, L, te) : null;
            case ar:
              return L.key === Ce ? y(M, V, L, te) : null;
            case Je: {
              var ge = L._payload, qe = L._init;
              return x(M, V, qe(ge), te);
            }
          }
          if (ft(L) || at(L))
            return Ce !== null ? null : S(M, V, L, te, null);
          Yh(M, L);
        }
        return typeof L == "function" && $h(M), null;
      }
      function z(M, V, L, te, Ce) {
        if (typeof te == "string" && te !== "" || typeof te == "number") {
          var ge = M.get(L) || null;
          return p(V, ge, "" + te, Ce);
        }
        if (typeof te == "object" && te !== null) {
          switch (te.$$typeof) {
            case Dr: {
              var qe = M.get(te.key === null ? L : te.key) || null;
              return v(V, qe, te, Ce);
            }
            case ar: {
              var tt = M.get(te.key === null ? L : te.key) || null;
              return y(V, tt, te, Ce);
            }
            case Je:
              var Jt = te._payload, Ht = te._init;
              return z(M, V, L, Ht(Jt), Ce);
          }
          if (ft(te) || at(te)) {
            var qn = M.get(L) || null;
            return S(V, qn, te, Ce, null);
          }
          Yh(V, te);
        }
        return typeof te == "function" && $h(V), null;
      }
      function j(M, V, L) {
        {
          if (typeof M != "object" || M === null)
            return V;
          switch (M.$$typeof) {
            case Dr:
            case ar:
              dC(M, L);
              var te = M.key;
              if (typeof te != "string")
                break;
              if (V === null) {
                V = /* @__PURE__ */ new Set(), V.add(te);
                break;
              }
              if (!V.has(te)) {
                V.add(te);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", te);
              break;
            case Je:
              var Ce = M._payload, ge = M._init;
              j(ge(Ce), V, L);
              break;
          }
        }
        return V;
      }
      function P(M, V, L, te) {
        for (var Ce = null, ge = 0; ge < L.length; ge++) {
          var qe = L[ge];
          Ce = j(qe, Ce, M);
        }
        for (var tt = null, Jt = null, Ht = V, qn = 0, Pt = 0, Vn = null; Ht !== null && Pt < L.length; Pt++) {
          Ht.index > Pt ? (Vn = Ht, Ht = null) : Vn = Ht.sibling;
          var ua = x(M, Ht, L[Pt], te);
          if (ua === null) {
            Ht === null && (Ht = Vn);
            break;
          }
          e && Ht && ua.alternate === null && t(M, Ht), qn = s(ua, qn, Pt), Jt === null ? tt = ua : Jt.sibling = ua, Jt = ua, Ht = Vn;
        }
        if (Pt === L.length) {
          if (a(M, Ht), jr()) {
            var Yr = Pt;
            Qs(M, Yr);
          }
          return tt;
        }
        if (Ht === null) {
          for (; Pt < L.length; Pt++) {
            var si = b(M, L[Pt], te);
            si !== null && (qn = s(si, qn, Pt), Jt === null ? tt = si : Jt.sibling = si, Jt = si);
          }
          if (jr()) {
            var Ra = Pt;
            Qs(M, Ra);
          }
          return tt;
        }
        for (var Ta = i(M, Ht); Pt < L.length; Pt++) {
          var oa = z(Ta, M, Pt, L[Pt], te);
          oa !== null && (e && oa.alternate !== null && Ta.delete(oa.key === null ? Pt : oa.key), qn = s(oa, qn, Pt), Jt === null ? tt = oa : Jt.sibling = oa, Jt = oa);
        }
        if (e && Ta.forEach(function($f) {
          return t(M, $f);
        }), jr()) {
          var Qu = Pt;
          Qs(M, Qu);
        }
        return tt;
      }
      function me(M, V, L, te) {
        var Ce = at(L);
        if (typeof Ce != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          L[Symbol.toStringTag] === "Generator" && (lg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), lg = !0), L.entries === Ce && (ig || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ig = !0);
          var ge = Ce.call(L);
          if (ge)
            for (var qe = null, tt = ge.next(); !tt.done; tt = ge.next()) {
              var Jt = tt.value;
              qe = j(Jt, qe, M);
            }
        }
        var Ht = Ce.call(L);
        if (Ht == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qn = null, Pt = null, Vn = V, ua = 0, Yr = 0, si = null, Ra = Ht.next(); Vn !== null && !Ra.done; Yr++, Ra = Ht.next()) {
          Vn.index > Yr ? (si = Vn, Vn = null) : si = Vn.sibling;
          var Ta = x(M, Vn, Ra.value, te);
          if (Ta === null) {
            Vn === null && (Vn = si);
            break;
          }
          e && Vn && Ta.alternate === null && t(M, Vn), ua = s(Ta, ua, Yr), Pt === null ? qn = Ta : Pt.sibling = Ta, Pt = Ta, Vn = si;
        }
        if (Ra.done) {
          if (a(M, Vn), jr()) {
            var oa = Yr;
            Qs(M, oa);
          }
          return qn;
        }
        if (Vn === null) {
          for (; !Ra.done; Yr++, Ra = Ht.next()) {
            var Qu = b(M, Ra.value, te);
            Qu !== null && (ua = s(Qu, ua, Yr), Pt === null ? qn = Qu : Pt.sibling = Qu, Pt = Qu);
          }
          if (jr()) {
            var $f = Yr;
            Qs(M, $f);
          }
          return qn;
        }
        for (var Xp = i(M, Vn); !Ra.done; Yr++, Ra = Ht.next()) {
          var Zl = z(Xp, M, Yr, Ra.value, te);
          Zl !== null && (e && Zl.alternate !== null && Xp.delete(Zl.key === null ? Yr : Zl.key), ua = s(Zl, ua, Yr), Pt === null ? qn = Zl : Pt.sibling = Zl, Pt = Zl);
        }
        if (e && Xp.forEach(function(eD) {
          return t(M, eD);
        }), jr()) {
          var J_ = Yr;
          Qs(M, J_);
        }
        return qn;
      }
      function Be(M, V, L, te) {
        if (V !== null && V.tag === ie) {
          a(M, V.sibling);
          var Ce = u(V, L);
          return Ce.return = M, Ce;
        }
        a(M, V);
        var ge = aE(L, M.mode, te);
        return ge.return = M, ge;
      }
      function Ue(M, V, L, te) {
        for (var Ce = L.key, ge = V; ge !== null; ) {
          if (ge.key === Ce) {
            var qe = L.type;
            if (qe === di) {
              if (ge.tag === Me) {
                a(M, ge.sibling);
                var tt = u(ge, L.props.children);
                return tt.return = M, tt._debugSource = L._source, tt._debugOwner = L._owner, tt;
              }
            } else if (ge.elementType === qe || // Keep this check inline so it only runs on the false path:
            SR(ge, L) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof qe == "object" && qe !== null && qe.$$typeof === Je && pC(qe) === ge.type) {
              a(M, ge.sibling);
              var Jt = u(ge, L.props);
              return Jt.ref = Sp(M, ge, L), Jt.return = M, Jt._debugSource = L._source, Jt._debugOwner = L._owner, Jt;
            }
            a(M, ge);
            break;
          } else
            t(M, ge);
          ge = ge.sibling;
        }
        if (L.type === di) {
          var Ht = Yo(L.props.children, M.mode, te, L.key);
          return Ht.return = M, Ht;
        } else {
          var qn = rE(L, M.mode, te);
          return qn.ref = Sp(M, V, L), qn.return = M, qn;
        }
      }
      function _t(M, V, L, te) {
        for (var Ce = L.key, ge = V; ge !== null; ) {
          if (ge.key === Ce)
            if (ge.tag === ue && ge.stateNode.containerInfo === L.containerInfo && ge.stateNode.implementation === L.implementation) {
              a(M, ge.sibling);
              var qe = u(ge, L.children || []);
              return qe.return = M, qe;
            } else {
              a(M, ge);
              break;
            }
          else
            t(M, ge);
          ge = ge.sibling;
        }
        var tt = iE(L, M.mode, te);
        return tt.return = M, tt;
      }
      function Et(M, V, L, te) {
        var Ce = typeof L == "object" && L !== null && L.type === di && L.key === null;
        if (Ce && (L = L.props.children), typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case Dr:
              return f(Ue(M, V, L, te));
            case ar:
              return f(_t(M, V, L, te));
            case Je:
              var ge = L._payload, qe = L._init;
              return Et(M, V, qe(ge), te);
          }
          if (ft(L))
            return P(M, V, L, te);
          if (at(L))
            return me(M, V, L, te);
          Yh(M, L);
        }
        return typeof L == "string" && L !== "" || typeof L == "number" ? f(Be(M, V, "" + L, te)) : (typeof L == "function" && $h(M), a(M, V));
      }
      return Et;
    }
    var _f = vC(!0), hC = vC(!1);
    function kw(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ic(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ic(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Ow(e, t) {
      for (var a = e.child; a !== null; )
        y_(a, t), a = a.sibling;
    }
    var cg = Oo(null), fg;
    fg = {};
    var Qh = null, Df = null, dg = null, Wh = !1;
    function Gh() {
      Qh = null, Df = null, dg = null, Wh = !1;
    }
    function mC() {
      Wh = !0;
    }
    function yC() {
      Wh = !1;
    }
    function gC(e, t, a) {
      ia(cg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== fg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = fg;
    }
    function pg(e, t) {
      var a = cg.current;
      aa(cg, t), e._currentValue = a;
    }
    function vg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Du(i.childLanes, t) ? u !== null && !Du(u.childLanes, t) && (u.childLanes = it(u.childLanes, t)) : (i.childLanes = it(i.childLanes, t), u !== null && (u.childLanes = it(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Mw(e, t, a) {
      Lw(e, t, a);
    }
    function Lw(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === Z) {
                var p = Ts(a), v = Pu(en, p);
                v.tag = Kh;
                var y = i.updateQueue;
                if (y !== null) {
                  var S = y.shared, b = S.pending;
                  b === null ? v.next = v : (v.next = b.next, b.next = v), S.pending = v;
                }
              }
              i.lanes = it(i.lanes, a);
              var x = i.alternate;
              x !== null && (x.lanes = it(x.lanes, a)), vg(i.return, a, e), s.lanes = it(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === dt)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Ct) {
          var z = i.return;
          if (z === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          z.lanes = it(z.lanes, a);
          var j = z.alternate;
          j !== null && (j.lanes = it(j.lanes, a)), vg(z, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var P = u.sibling;
            if (P !== null) {
              P.return = u.return, u = P;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function kf(e, t) {
      Qh = e, Df = null, dg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function nr(e) {
      Wh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (dg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (Qh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, Qh.dependencies = {
            lanes: G,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Xs = null;
    function hg(e) {
      Xs === null ? Xs = [e] : Xs.push(e);
    }
    function Nw() {
      if (Xs !== null) {
        for (var e = 0; e < Xs.length; e++) {
          var t = Xs[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        Xs = null;
      }
    }
    function SC(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, qh(e, i);
    }
    function zw(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Aw(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, qh(e, i);
    }
    function Ha(e, t) {
      return qh(e, t);
    }
    var Uw = qh;
    function qh(e, t) {
      e.lanes = it(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = it(a.lanes, t)), a === null && (e.flags & (yn | qr)) !== Fe && hR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = it(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = it(a.childLanes, t) : (u.flags & (yn | qr)) !== Fe && hR(e), i = u, u = u.return;
      if (i.tag === B) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var EC = 0, CC = 1, Kh = 2, mg = 3, Xh = !1, yg, Zh;
    yg = !1, Zh = null;
    function gg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: G
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function RC(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Pu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: EC,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function zo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (Zh === u && !yg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), yg = !0), z1()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Uw(e, a);
      } else
        return Aw(e, u, t, a);
    }
    function Jh(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Ld(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = it(s, a);
          u.lanes = f, ef(e, f);
        }
      }
    }
    function Sg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var y = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = y : (f.next = y, f = y), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var S = a.lastBaseUpdate;
      S === null ? a.firstBaseUpdate = t : S.next = t, a.lastBaseUpdate = t;
    }
    function jw(e, t, a, i, u, s) {
      switch (a.tag) {
        case CC: {
          var f = a.payload;
          if (typeof f == "function") {
            mC();
            var p = f.call(s, i, u);
            {
              if (e.mode & Xt) {
                gn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              yC();
            }
            return p;
          }
          return f;
        }
        case mg:
          e.flags = e.flags & ~Zn | je;
        case EC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            mC(), y = v.call(s, i, u);
            {
              if (e.mode & Xt) {
                gn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              yC();
            }
          } else
            y = v;
          return y == null ? i : ut({}, i, y);
        }
        case Kh:
          return Xh = !0, i;
      }
      return i;
    }
    function em(e, t, a, i) {
      var u = e.updateQueue;
      Xh = !1, Zh = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var S = e.alternate;
        if (S !== null) {
          var b = S.updateQueue, x = b.lastBaseUpdate;
          x !== f && (x === null ? b.firstBaseUpdate = y : x.next = y, b.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var z = u.baseState, j = G, P = null, me = null, Be = null, Ue = s;
        do {
          var _t = Ue.lane, Et = Ue.eventTime;
          if (Du(i, _t)) {
            if (Be !== null) {
              var V = {
                eventTime: Et,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Nt,
                tag: Ue.tag,
                payload: Ue.payload,
                callback: Ue.callback,
                next: null
              };
              Be = Be.next = V;
            }
            z = jw(e, u, Ue, z, t, a);
            var L = Ue.callback;
            if (L !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ue.lane !== Nt) {
              e.flags |= un;
              var te = u.effects;
              te === null ? u.effects = [Ue] : te.push(Ue);
            }
          } else {
            var M = {
              eventTime: Et,
              lane: _t,
              tag: Ue.tag,
              payload: Ue.payload,
              callback: Ue.callback,
              next: null
            };
            Be === null ? (me = Be = M, P = z) : Be = Be.next = M, j = it(j, _t);
          }
          if (Ue = Ue.next, Ue === null) {
            if (p = u.shared.pending, p === null)
              break;
            var Ce = p, ge = Ce.next;
            Ce.next = null, Ue = ge, u.lastBaseUpdate = Ce, u.shared.pending = null;
          }
        } while (!0);
        Be === null && (P = z), u.baseState = P, u.firstBaseUpdate = me, u.lastBaseUpdate = Be;
        var qe = u.shared.interleaved;
        if (qe !== null) {
          var tt = qe;
          do
            j = it(j, tt.lane), tt = tt.next;
          while (tt !== qe);
        } else s === null && (u.shared.lanes = G);
        Qp(j), e.lanes = j, e.memoizedState = z;
      }
      Zh = null;
    }
    function Fw(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function TC() {
      Xh = !1;
    }
    function tm() {
      return Xh;
    }
    function xC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Fw(f, a));
        }
    }
    var Ep = {}, Ao = Oo(Ep), Cp = Oo(Ep), nm = Oo(Ep);
    function rm(e) {
      if (e === Ep)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function wC() {
      var e = rm(nm.current);
      return e;
    }
    function Eg(e, t) {
      ia(nm, t, e), ia(Cp, e, e), ia(Ao, Ep, e);
      var a = tx(t);
      aa(Ao, e), ia(Ao, a, e);
    }
    function Of(e) {
      aa(Ao, e), aa(Cp, e), aa(nm, e);
    }
    function Cg() {
      var e = rm(Ao.current);
      return e;
    }
    function bC(e) {
      rm(nm.current);
      var t = rm(Ao.current), a = nx(t, e.type);
      t !== a && (ia(Cp, e, e), ia(Ao, a, e));
    }
    function Rg(e) {
      Cp.current === e && (aa(Ao, e), aa(Cp, e));
    }
    var Hw = 0, _C = 1, DC = 1, Rp = 2, il = Oo(Hw);
    function Tg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & _C;
    }
    function xg(e, t) {
      return e & _C | t;
    }
    function Pw(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      ia(il, t, e);
    }
    function Lf(e) {
      aa(il, e);
    }
    function Vw(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function am(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === J) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || $E(i) || By(i))
              return t;
          }
        } else if (t.tag === on && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & je) !== Fe;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Pa = (
      /*   */
      0
    ), fr = (
      /* */
      1
    ), $l = (
      /*  */
      2
    ), dr = (
      /*    */
      4
    ), Fr = (
      /*   */
      8
    ), wg = [];
    function bg() {
      for (var e = 0; e < wg.length; e++) {
        var t = wg[e];
        t._workInProgressVersionPrimary = null;
      }
      wg.length = 0;
    }
    function Bw(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Ee = D.ReactCurrentDispatcher, Tp = D.ReactCurrentBatchConfig, _g, Nf;
    _g = /* @__PURE__ */ new Set();
    var Zs = G, Zt = null, pr = null, vr = null, im = !1, xp = !1, wp = 0, Iw = 0, Yw = 25, $ = null, Ai = null, jo = -1, Dg = !1;
    function Yt() {
      {
        var e = $;
        Ai === null ? Ai = [e] : Ai.push(e);
      }
    }
    function ce() {
      {
        var e = $;
        Ai !== null && (jo++, Ai[jo] !== e && $w(e));
      }
    }
    function zf(e) {
      e != null && !ft(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", $, typeof e);
    }
    function $w(e) {
      {
        var t = Ze(Zt);
        if (!_g.has(t) && (_g.add(t), Ai !== null)) {
          for (var a = "", i = 30, u = 0; u <= jo; u++) {
            for (var s = Ai[u], f = u === jo ? e : s, p = u + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          g(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function la() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function kg(e, t) {
      if (Dg)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", $), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, $, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!X(e[a], t[a]))
          return !1;
      return !0;
    }
    function Af(e, t, a, i, u, s) {
      Zs = s, Zt = t, Ai = e !== null ? e._debugHookTypes : null, jo = -1, Dg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = G, e !== null && e.memoizedState !== null ? Ee.current = KC : Ai !== null ? Ee.current = qC : Ee.current = GC;
      var f = a(i, u);
      if (xp) {
        var p = 0;
        do {
          if (xp = !1, wp = 0, p >= Yw)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Dg = !1, pr = null, vr = null, t.updateQueue = null, jo = -1, Ee.current = XC, f = a(i, u);
        } while (xp);
      }
      Ee.current = gm, t._debugHookTypes = Ai;
      var v = pr !== null && pr.next !== null;
      if (Zs = G, Zt = null, pr = null, vr = null, $ = null, Ai = null, jo = -1, e !== null && (e.flags & An) !== (t.flags & An) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & yt) !== He && g("Internal React error: Expected static flag was missing. Please notify the React team."), im = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Uf() {
      var e = wp !== 0;
      return wp = 0, e;
    }
    function kC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & jt) !== He ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = xs(e.lanes, a);
    }
    function OC() {
      if (Ee.current = gm, im) {
        for (var e = Zt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        im = !1;
      }
      Zs = G, Zt = null, pr = null, vr = null, Ai = null, jo = -1, $ = null, IC = !1, xp = !1, wp = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return vr === null ? Zt.memoizedState = vr = e : vr = vr.next = e, vr;
    }
    function Ui() {
      var e;
      if (pr === null) {
        var t = Zt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = pr.next;
      var a;
      if (vr === null ? a = Zt.memoizedState : a = vr.next, a !== null)
        vr = a, a = vr.next, pr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        pr = e;
        var i = {
          memoizedState: pr.memoizedState,
          baseState: pr.baseState,
          baseQueue: pr.baseQueue,
          queue: pr.queue,
          next: null
        };
        vr === null ? Zt.memoizedState = vr = i : vr = vr.next = i;
      }
      return vr;
    }
    function MC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Og(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Mg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: G,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = qw.bind(null, Zt, s);
      return [i.memoizedState, f];
    }
    function Lg(e, t, a) {
      var i = Ui(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = pr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var S = f.next, b = s.baseState, x = null, z = null, j = null, P = S;
        do {
          var me = P.lane;
          if (Du(Zs, me)) {
            if (j !== null) {
              var Ue = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Nt,
                action: P.action,
                hasEagerState: P.hasEagerState,
                eagerState: P.eagerState,
                next: null
              };
              j = j.next = Ue;
            }
            if (P.hasEagerState)
              b = P.eagerState;
            else {
              var _t = P.action;
              b = e(b, _t);
            }
          } else {
            var Be = {
              lane: me,
              action: P.action,
              hasEagerState: P.hasEagerState,
              eagerState: P.eagerState,
              next: null
            };
            j === null ? (z = j = Be, x = b) : j = j.next = Be, Zt.lanes = it(Zt.lanes, me), Qp(me);
          }
          P = P.next;
        } while (P !== null && P !== S);
        j === null ? x = b : j.next = z, X(b, i.memoizedState) || zp(), i.memoizedState = b, i.baseState = x, i.baseQueue = j, u.lastRenderedState = b;
      }
      var Et = u.interleaved;
      if (Et !== null) {
        var M = Et;
        do {
          var V = M.lane;
          Zt.lanes = it(Zt.lanes, V), Qp(V), M = M.next;
        } while (M !== Et);
      } else f === null && (u.lanes = G);
      var L = u.dispatch;
      return [i.memoizedState, L];
    }
    function Ng(e, t, a) {
      var i = Ui(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, y = v;
        do {
          var S = y.action;
          p = e(p, S), y = y.next;
        } while (y !== v);
        X(p, i.memoizedState) || zp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function PD(e, t, a) {
    }
    function VD(e, t, a) {
    }
    function zg(e, t, a) {
      var i = Zt, u = Ql(), s, f = jr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Nf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), Nf = !0);
      } else {
        if (s = t(), !Nf) {
          var p = t();
          X(s, p) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Nf = !0);
        }
        var v = jm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Zs) || LC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, cm(zC.bind(null, i, y, e), [e]), i.flags |= Gr, bp(fr | Fr, NC.bind(null, i, y, s, t), void 0, null), s;
    }
    function lm(e, t, a) {
      var i = Zt, u = Ui(), s = t();
      if (!Nf) {
        var f = t();
        X(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Nf = !0);
      }
      var p = u.memoizedState, v = !X(p, s);
      v && (u.memoizedState = s, zp());
      var y = u.queue;
      if (Dp(zC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      vr !== null && vr.memoizedState.tag & fr) {
        i.flags |= Gr, bp(fr | Fr, NC.bind(null, i, y, s, t), void 0, null);
        var S = jm();
        if (S === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(S, Zs) || LC(i, t, s);
      }
      return s;
    }
    function LC(e, t, a) {
      e.flags |= vo;
      var i = {
        getSnapshot: t,
        value: a
      }, u = Zt.updateQueue;
      if (u === null)
        u = MC(), Zt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function NC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, AC(t) && UC(e);
    }
    function zC(e, t, a) {
      var i = function() {
        AC(t) && UC(e);
      };
      return a(i);
    }
    function AC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !X(a, i);
      } catch {
        return !0;
      }
    }
    function UC(e) {
      var t = Ha(e, We);
      t !== null && gr(t, e, We, en);
    }
    function um(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: G,
        dispatch: null,
        lastRenderedReducer: Og,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Kw.bind(null, Zt, a);
      return [t.memoizedState, i];
    }
    function Ag(e) {
      return Lg(Og);
    }
    function Ug(e) {
      return Ng(Og);
    }
    function bp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = Zt.updateQueue;
      if (s === null)
        s = MC(), Zt.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = u.next = u;
        else {
          var p = f.next;
          f.next = u, u.next = p, s.lastEffect = u;
        }
      }
      return u;
    }
    function jg(e) {
      var t = Ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function om(e) {
      var t = Ui();
      return t.memoizedState;
    }
    function _p(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      Zt.flags |= e, u.memoizedState = bp(fr | t, a, void 0, s);
    }
    function sm(e, t, a, i) {
      var u = Ui(), s = i === void 0 ? null : i, f = void 0;
      if (pr !== null) {
        var p = pr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (kg(s, v)) {
            u.memoizedState = bp(t, a, f, s);
            return;
          }
        }
      }
      Zt.flags |= e, u.memoizedState = bp(fr | t, a, f, s);
    }
    function cm(e, t) {
      return (Zt.mode & jt) !== He ? _p(Ti | Gr | wc, Fr, e, t) : _p(Gr | wc, Fr, e, t);
    }
    function Dp(e, t) {
      return sm(Gr, Fr, e, t);
    }
    function Fg(e, t) {
      return _p(xt, $l, e, t);
    }
    function fm(e, t) {
      return sm(xt, $l, e, t);
    }
    function Hg(e, t) {
      var a = xt;
      return a |= Wi, (Zt.mode & jt) !== He && (a |= _l), _p(a, dr, e, t);
    }
    function dm(e, t) {
      return sm(xt, dr, e, t);
    }
    function jC(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || g("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function Pg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = xt;
      return u |= Wi, (Zt.mode & jt) !== He && (u |= _l), _p(u, dr, jC.bind(null, t, e), i);
    }
    function pm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return sm(xt, dr, jC.bind(null, t, e), i);
    }
    function Qw(e, t) {
    }
    var vm = Qw;
    function Vg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function hm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (kg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Bg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function mm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (kg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Ig(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function FC(e) {
      var t = Ui(), a = pr, i = a.memoizedState;
      return PC(t, i, e);
    }
    function HC(e) {
      var t = Ui();
      if (pr === null)
        return t.memoizedState = e, e;
      var a = pr.memoizedState;
      return PC(t, a, e);
    }
    function PC(e, t, a) {
      var i = !Od(Zs);
      if (i) {
        if (!X(a, t)) {
          var u = Nd();
          Zt.lanes = it(Zt.lanes, u), Qp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function Ww(e, t, a) {
      var i = Ua();
      Fn(Wv(i, _i)), e(!0);
      var u = Tp.transition;
      Tp.transition = {};
      var s = Tp.transition;
      Tp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Fn(i), Tp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && ye("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Yg() {
      var e = um(!1), t = e[0], a = e[1], i = Ww.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function VC() {
      var e = Ag(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    function BC() {
      var e = Ug(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    var IC = !1;
    function Gw() {
      return IC;
    }
    function $g() {
      var e = Ql(), t = jm(), a = t.identifierPrefix, i;
      if (jr()) {
        var u = fw();
        i = ":" + a + "R" + u;
        var s = wp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Iw++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function ym() {
      var e = Ui(), t = e.memoizedState;
      return t;
    }
    function qw(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (YC(e))
        $C(t, u);
      else {
        var s = SC(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          gr(s, e, i, f), QC(s, t, i);
        }
      }
      WC(e, i);
    }
    function Kw(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (YC(e))
        $C(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === G && (s === null || s.lanes === G)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = Ee.current, Ee.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, X(y, v)) {
                zw(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              Ee.current = p;
            }
          }
        }
        var S = SC(e, t, u, i);
        if (S !== null) {
          var b = Ca();
          gr(S, e, i, b), QC(S, t, i);
        }
      }
      WC(e, i);
    }
    function YC(e) {
      var t = e.alternate;
      return e === Zt || t !== null && t === Zt;
    }
    function $C(e, t) {
      xp = im = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function QC(e, t, a) {
      if (Ld(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = it(i, a);
        t.lanes = u, ef(e, u);
      }
    }
    function WC(e, t, a) {
      vs(e, t);
    }
    var gm = {
      readContext: nr,
      useCallback: la,
      useContext: la,
      useEffect: la,
      useImperativeHandle: la,
      useInsertionEffect: la,
      useLayoutEffect: la,
      useMemo: la,
      useReducer: la,
      useRef: la,
      useState: la,
      useDebugValue: la,
      useDeferredValue: la,
      useTransition: la,
      useMutableSource: la,
      useSyncExternalStore: la,
      useId: la,
      unstable_isNewReconciler: ae
    }, GC = null, qC = null, KC = null, XC = null, Wl = null, ll = null, Sm = null;
    {
      var Qg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, et = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      GC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", Yt(), zf(t), Vg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", Yt(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", Yt(), zf(t), cm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", Yt(), zf(a), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", Yt(), zf(t), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", Yt(), zf(t), Hg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", Yt(), zf(t);
          var a = Ee.current;
          Ee.current = Wl;
          try {
            return Bg(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", Yt();
          var i = Ee.current;
          Ee.current = Wl;
          try {
            return Mg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", Yt(), jg(e);
        },
        useState: function(e) {
          $ = "useState", Yt();
          var t = Ee.current;
          Ee.current = Wl;
          try {
            return um(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", Yt(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", Yt(), Ig(e);
        },
        useTransition: function() {
          return $ = "useTransition", Yt(), Yg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", Yt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", Yt(), zg(e, t, a);
        },
        useId: function() {
          return $ = "useId", Yt(), $g();
        },
        unstable_isNewReconciler: ae
      }, qC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ce(), Vg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ce(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ce(), cm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ce(), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ce(), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ce(), Hg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ce();
          var a = Ee.current;
          Ee.current = Wl;
          try {
            return Bg(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ce();
          var i = Ee.current;
          Ee.current = Wl;
          try {
            return Mg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ce(), jg(e);
        },
        useState: function(e) {
          $ = "useState", ce();
          var t = Ee.current;
          Ee.current = Wl;
          try {
            return um(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ce(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ce(), Ig(e);
        },
        useTransition: function() {
          return $ = "useTransition", ce(), Yg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ce(), zg(e, t, a);
        },
        useId: function() {
          return $ = "useId", ce(), $g();
        },
        unstable_isNewReconciler: ae
      }, KC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ce(), hm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ce(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ce(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ce(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ce(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ce(), dm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ce();
          var a = Ee.current;
          Ee.current = ll;
          try {
            return mm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ce();
          var i = Ee.current;
          Ee.current = ll;
          try {
            return Lg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ce(), om();
        },
        useState: function(e) {
          $ = "useState", ce();
          var t = Ee.current;
          Ee.current = ll;
          try {
            return Ag(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ce(), vm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ce(), FC(e);
        },
        useTransition: function() {
          return $ = "useTransition", ce(), VC();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ce(), lm(e, t);
        },
        useId: function() {
          return $ = "useId", ce(), ym();
        },
        unstable_isNewReconciler: ae
      }, XC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ce(), hm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ce(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ce(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ce(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ce(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ce(), dm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ce();
          var a = Ee.current;
          Ee.current = Sm;
          try {
            return mm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ce();
          var i = Ee.current;
          Ee.current = Sm;
          try {
            return Ng(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ce(), om();
        },
        useState: function(e) {
          $ = "useState", ce();
          var t = Ee.current;
          Ee.current = Sm;
          try {
            return Ug(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ce(), vm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ce(), HC(e);
        },
        useTransition: function() {
          return $ = "useTransition", ce(), BC();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ce(), lm(e, t);
        },
        useId: function() {
          return $ = "useId", ce(), ym();
        },
        unstable_isNewReconciler: ae
      }, Wl = {
        readContext: function(e) {
          return Qg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", et(), Yt(), Vg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", et(), Yt(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", et(), Yt(), cm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", et(), Yt(), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", et(), Yt(), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", et(), Yt(), Hg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", et(), Yt();
          var a = Ee.current;
          Ee.current = Wl;
          try {
            return Bg(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", et(), Yt();
          var i = Ee.current;
          Ee.current = Wl;
          try {
            return Mg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", et(), Yt(), jg(e);
        },
        useState: function(e) {
          $ = "useState", et(), Yt();
          var t = Ee.current;
          Ee.current = Wl;
          try {
            return um(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", et(), Yt(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", et(), Yt(), Ig(e);
        },
        useTransition: function() {
          return $ = "useTransition", et(), Yt(), Yg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", et(), Yt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", et(), Yt(), zg(e, t, a);
        },
        useId: function() {
          return $ = "useId", et(), Yt(), $g();
        },
        unstable_isNewReconciler: ae
      }, ll = {
        readContext: function(e) {
          return Qg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", et(), ce(), hm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", et(), ce(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", et(), ce(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", et(), ce(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", et(), ce(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", et(), ce(), dm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", et(), ce();
          var a = Ee.current;
          Ee.current = ll;
          try {
            return mm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", et(), ce();
          var i = Ee.current;
          Ee.current = ll;
          try {
            return Lg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", et(), ce(), om();
        },
        useState: function(e) {
          $ = "useState", et(), ce();
          var t = Ee.current;
          Ee.current = ll;
          try {
            return Ag(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", et(), ce(), vm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", et(), ce(), FC(e);
        },
        useTransition: function() {
          return $ = "useTransition", et(), ce(), VC();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", et(), ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", et(), ce(), lm(e, t);
        },
        useId: function() {
          return $ = "useId", et(), ce(), ym();
        },
        unstable_isNewReconciler: ae
      }, Sm = {
        readContext: function(e) {
          return Qg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", et(), ce(), hm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", et(), ce(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", et(), ce(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", et(), ce(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", et(), ce(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", et(), ce(), dm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", et(), ce();
          var a = Ee.current;
          Ee.current = ll;
          try {
            return mm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", et(), ce();
          var i = Ee.current;
          Ee.current = ll;
          try {
            return Ng(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", et(), ce(), om();
        },
        useState: function(e) {
          $ = "useState", et(), ce();
          var t = Ee.current;
          Ee.current = ll;
          try {
            return Ug(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", et(), ce(), vm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", et(), ce(), HC(e);
        },
        useTransition: function() {
          return $ = "useTransition", et(), ce(), BC();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", et(), ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", et(), ce(), lm(e, t);
        },
        useId: function() {
          return $ = "useId", et(), ce(), ym();
        },
        unstable_isNewReconciler: ae
      };
    }
    var Fo = k.unstable_now, ZC = 0, Em = -1, kp = -1, Cm = -1, Wg = !1, Rm = !1;
    function JC() {
      return Wg;
    }
    function Xw() {
      Rm = !0;
    }
    function Zw() {
      Wg = !1, Rm = !1;
    }
    function Jw() {
      Wg = Rm, Rm = !1;
    }
    function e0() {
      return ZC;
    }
    function t0() {
      ZC = Fo();
    }
    function Gg(e) {
      kp = Fo(), e.actualStartTime < 0 && (e.actualStartTime = Fo());
    }
    function n0(e) {
      kp = -1;
    }
    function Tm(e, t) {
      if (kp >= 0) {
        var a = Fo() - kp;
        e.actualDuration += a, t && (e.selfBaseDuration = a), kp = -1;
      }
    }
    function Gl(e) {
      if (Em >= 0) {
        var t = Fo() - Em;
        Em = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case B:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case le:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function qg(e) {
      if (Cm >= 0) {
        var t = Fo() - Cm;
        Cm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case B:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case le:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      Em = Fo();
    }
    function Kg() {
      Cm = Fo();
    }
    function Xg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = ut({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Zg = {}, Jg, eS, tS, nS, rS, r0, xm, aS, iS, lS, Op;
    {
      Jg = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), Op = /* @__PURE__ */ new Set();
      var a0 = /* @__PURE__ */ new Set();
      xm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          a0.has(a) || (a0.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, r0 = function(e, t) {
        if (t === void 0) {
          var a = kt(e) || "Component";
          rS.has(a) || (rS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Zg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Zg);
    }
    function uS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Xt) {
          gn(!0);
          try {
            s = a(i, u);
          } finally {
            gn(!1);
          }
        }
        r0(t, s);
      }
      var f = s == null ? u : ut({}, u, s);
      if (e.memoizedState = f, e.lanes === G) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var oS = {
      isMounted: Mv,
      enqueueSetState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.payload = t, a != null && (xm(a, "setState"), f.callback = a);
        var p = zo(i, f, s);
        p !== null && (gr(p, i, s, u), Jh(p, i, s)), vs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.tag = CC, f.payload = t, a != null && (xm(a, "replaceState"), f.callback = a);
        var p = zo(i, f, s);
        p !== null && (gr(p, i, s, u), Jh(p, i, s)), vs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = po(e), i = Ca(), u = Bo(a), s = Pu(i, u);
        s.tag = Kh, t != null && (xm(t, "forceUpdate"), s.callback = t);
        var f = zo(a, s, u);
        f !== null && (gr(f, a, u, i), Jh(f, a, u)), Lc(a, u);
      }
    };
    function i0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Xt) {
            gn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              gn(!1);
            }
          }
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", kt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !_e(a, i) || !_e(u, s) : !0;
    }
    function eb(e, t, a) {
      var i = e.stateNode;
      {
        var u = kt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Op.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Xt) === He && (Op.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Op.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Xt) === He && (Op.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !iS.has(t) && (iS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", kt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !tS.has(t) && (tS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", kt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || ft(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function l0(e, t) {
      t.updater = oS, e.stateNode = t, vu(t, e), t._reactInternalInstance = Zg;
    }
    function u0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !lS.has(t)) {
          lS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", kt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = nr(f);
      else {
        u = Rf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? Tf(e, u) : ui;
      }
      var S = new t(a, s);
      if (e.mode & Xt) {
        gn(!0);
        try {
          S = new t(a, s);
        } finally {
          gn(!1);
        }
      }
      var b = e.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null;
      l0(e, S);
      {
        if (typeof t.getDerivedStateFromProps == "function" && b === null) {
          var x = kt(t) || "Component";
          eS.has(x) || (eS.add(x), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", x, S.state === null ? "null" : "undefined", x));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof S.getSnapshotBeforeUpdate == "function") {
          var z = null, j = null, P = null;
          if (typeof S.componentWillMount == "function" && S.componentWillMount.__suppressDeprecationWarning !== !0 ? z = "componentWillMount" : typeof S.UNSAFE_componentWillMount == "function" && (z = "UNSAFE_componentWillMount"), typeof S.componentWillReceiveProps == "function" && S.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? j = "componentWillReceiveProps" : typeof S.UNSAFE_componentWillReceiveProps == "function" && (j = "UNSAFE_componentWillReceiveProps"), typeof S.componentWillUpdate == "function" && S.componentWillUpdate.__suppressDeprecationWarning !== !0 ? P = "componentWillUpdate" : typeof S.UNSAFE_componentWillUpdate == "function" && (P = "UNSAFE_componentWillUpdate"), z !== null || j !== null || P !== null) {
            var me = kt(t) || "Component", Be = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            nS.has(me) || (nS.add(me), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, me, Be, z !== null ? `
  ` + z : "", j !== null ? `
  ` + j : "", P !== null ? `
  ` + P : ""));
          }
        }
      }
      return i && KE(e, u, s), S;
    }
    function tb(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Ze(e) || "Component"), oS.enqueueReplaceState(t, t.state, null));
    }
    function o0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Ze(e) || "Component";
          Jg.has(s) || (Jg.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        oS.enqueueReplaceState(t, t.state, null);
      }
    }
    function sS(e, t, a, i) {
      eb(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, gg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nr(s);
      else {
        var f = Rf(e, t, !0);
        u.context = Tf(e, f);
      }
      {
        if (u.state === a) {
          var p = kt(t) || "Component";
          aS.has(p) || (aS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Xt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (uS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (tb(e, u), em(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = xt;
        y |= Wi, (e.mode & jt) !== He && (y |= _l), e.flags |= y;
      }
    }
    function nb(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = nr(p);
      else {
        var y = Rf(e, t, !0);
        v = Tf(e, y);
      }
      var S = t.getDerivedStateFromProps, b = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !b && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && o0(e, u, a, v), TC();
      var x = e.memoizedState, z = u.state = x;
      if (em(e, a, u, i), z = e.memoizedState, s === a && x === z && !Ah() && !tm()) {
        if (typeof u.componentDidMount == "function") {
          var j = xt;
          j |= Wi, (e.mode & jt) !== He && (j |= _l), e.flags |= j;
        }
        return !1;
      }
      typeof S == "function" && (uS(e, t, S, a), z = e.memoizedState);
      var P = tm() || i0(e, t, s, a, x, z, v);
      if (P) {
        if (!b && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var me = xt;
          me |= Wi, (e.mode & jt) !== He && (me |= _l), e.flags |= me;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Be = xt;
          Be |= Wi, (e.mode & jt) !== He && (Be |= _l), e.flags |= Be;
        }
        e.memoizedProps = a, e.memoizedState = z;
      }
      return u.props = a, u.state = z, u.context = v, P;
    }
    function rb(e, t, a, i, u) {
      var s = t.stateNode;
      RC(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, S = a.contextType, b = ui;
      if (typeof S == "object" && S !== null)
        b = nr(S);
      else {
        var x = Rf(t, a, !0);
        b = Tf(t, x);
      }
      var z = a.getDerivedStateFromProps, j = typeof z == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !j && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== b) && o0(t, s, i, b), TC();
      var P = t.memoizedState, me = s.state = P;
      if (em(t, i, s, u), me = t.memoizedState, f === v && P === me && !Ah() && !tm() && !ze)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= xt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= Qn), !1;
      typeof z == "function" && (uS(t, a, z, i), me = t.memoizedState);
      var Be = tm() || i0(t, a, p, i, P, me, b) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      ze;
      return Be ? (!j && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, me, b), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, me, b)), typeof s.componentDidUpdate == "function" && (t.flags |= xt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Qn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= xt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= Qn), t.memoizedProps = i, t.memoizedState = me), s.props = i, s.state = me, s.context = b, Be;
    }
    function Js(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function cS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function ab(e, t) {
      return !0;
    }
    function fS(e, t) {
      try {
        var a = ab(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === Z)
            return;
          console.error(i);
        }
        var p = u ? Ze(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === B)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var S = Ze(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + S + ".");
        }
        var b = v + `
` + f + `

` + ("" + y);
        console.error(b);
      } catch (x) {
        setTimeout(function() {
          throw x;
        });
      }
    }
    var ib = typeof WeakMap == "function" ? WeakMap : Map;
    function s0(e, t, a) {
      var i = Pu(en, a);
      i.tag = mg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        X1(u), fS(e, t);
      }, i;
    }
    function dS(e, t, a) {
      var i = Pu(en, a);
      i.tag = mg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          ER(e), fS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        ER(e), fS(e, t), typeof u != "function" && q1(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, We) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Ze(e) || "Unknown"));
      }), i;
    }
    function c0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new ib(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = Z1.bind(null, e, t, a);
        Zr && Wp(e, a), t.then(s, s);
      }
    }
    function lb(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function ub(e, t) {
      var a = e.tag;
      if ((e.mode & yt) === He && (a === Y || a === Ke || a === ve)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function f0(e) {
      var t = e;
      do {
        if (t.tag === J && Vw(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function d0(e, t, a, i, u) {
      if ((e.mode & yt) === He) {
        if (e === t)
          e.flags |= Zn;
        else {
          if (e.flags |= je, a.flags |= xc, a.flags &= -52805, a.tag === Z) {
            var s = a.alternate;
            if (s === null)
              a.tag = Tt;
            else {
              var f = Pu(en, We);
              f.tag = Kh, zo(a, f, We);
            }
          }
          a.lanes = it(a.lanes, We);
        }
        return e;
      }
      return e.flags |= Zn, e.lanes = u, e;
    }
    function ob(e, t, a, i, u) {
      if (a.flags |= os, Zr && Wp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        ub(a), jr() && a.mode & yt && rC();
        var f = f0(t);
        if (f !== null) {
          f.flags &= ~Rr, d0(f, t, a, e, u), f.mode & yt && c0(e, s, u), lb(f, e, s);
          return;
        } else {
          if (!Hv(u)) {
            c0(e, s, u), $S();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (jr() && a.mode & yt) {
        rC();
        var v = f0(t);
        if (v !== null) {
          (v.flags & Zn) === Fe && (v.flags |= Rr), d0(v, t, a, e, u), ag(Js(i, a));
          return;
        }
      }
      i = Js(i, a), V1(i);
      var y = t;
      do {
        switch (y.tag) {
          case B: {
            var S = i;
            y.flags |= Zn;
            var b = Ts(u);
            y.lanes = it(y.lanes, b);
            var x = s0(y, S, b);
            Sg(y, x);
            return;
          }
          case Z:
            var z = i, j = y.type, P = y.stateNode;
            if ((y.flags & je) === Fe && (typeof j.getDerivedStateFromError == "function" || P !== null && typeof P.componentDidCatch == "function" && !fR(P))) {
              y.flags |= Zn;
              var me = Ts(u);
              y.lanes = it(y.lanes, me);
              var Be = dS(y, z, me);
              Sg(y, Be);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function sb() {
      return null;
    }
    var Mp = D.ReactCurrentOwner, ol = !1, pS, Lp, vS, hS, mS, ec, yS, wm, Np;
    pS = {}, Lp = {}, vS = {}, hS = {}, mS = {}, ec = !1, yS = {}, wm = {}, Np = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = hC(t, null, a, i) : t.child = _f(t, e.child, a, i);
    }
    function cb(e, t, a, i) {
      t.child = _f(t, e.child, null, i), t.child = _f(t, null, a, i);
    }
    function p0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          kt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      kf(t, u), ha(t);
      {
        if (Mp.current = t, $n(!0), v = Af(e, t, f, i, p, u), y = Uf(), t.mode & Xt) {
          gn(!0);
          try {
            v = Af(e, t, f, i, p, u), y = Uf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (kC(e, t, u), Vu(e, t, u)) : (jr() && y && Zy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function v0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (h_(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Yf(s), t.tag = ve, t.type = f, ES(t, s), h0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            kt(s)
          ), a.defaultProps !== void 0) {
            var v = kt(s) || "Unknown";
            Np[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Np[v] = !0);
          }
        }
        var y = nE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var S = a.type, b = S.propTypes;
        b && nl(
          b,
          i,
          // Resolved props
          "prop",
          kt(S)
        );
      }
      var x = e.child, z = bS(e, u);
      if (!z) {
        var j = x.memoizedProps, P = a.compare;
        if (P = P !== null ? P : _e, P(j, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var me = ic(x, i);
      return me.ref = t.ref, me.return = t, t.child = me, me;
    }
    function h0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Je) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var y = s && s.propTypes;
          y && nl(
            y,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            kt(s)
          );
        }
      }
      if (e !== null) {
        var S = e.memoizedProps;
        if (_e(S, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = S, bS(e, u))
            (e.flags & xc) !== Fe && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return gS(e, t, a, i, u);
    }
    function m0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || fe)
        if ((t.mode & yt) === He) {
          var f = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Fm(t, a);
        } else if (ea(a, Jr)) {
          var b = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = b;
          var x = s !== null ? s.baseLanes : a;
          Fm(t, x);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = it(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Jr;
          var S = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = S, t.updateQueue = null, Fm(t, v), null;
        }
      else {
        var z;
        s !== null ? (z = it(s.baseLanes, a), t.memoizedState = null) : z = a, Fm(t, z);
      }
      return Sa(e, t, u, a), t.child;
    }
    function fb(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function db(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function pb(e, t, a) {
      {
        t.flags |= xt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function y0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Cn, t.flags |= ho);
    }
    function gS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          kt(a)
        );
      }
      var f;
      {
        var p = Rf(t, a, !0);
        f = Tf(t, p);
      }
      var v, y;
      kf(t, u), ha(t);
      {
        if (Mp.current = t, $n(!0), v = Af(e, t, a, i, f, u), y = Uf(), t.mode & Xt) {
          gn(!0);
          try {
            v = Af(e, t, a, i, f, u), y = Uf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (kC(e, t, u), Vu(e, t, u)) : (jr() && y && Zy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function g0(e, t, a, i, u) {
      {
        switch (O_(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= je, t.flags |= Zn;
            var y = new Error("Simulated error coming from DevTools"), S = Ts(u);
            t.lanes = it(t.lanes, S);
            var b = dS(t, Js(y, t), S);
            Sg(t, b);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var x = a.propTypes;
          x && nl(
            x,
            i,
            // Resolved props
            "prop",
            kt(a)
          );
        }
      }
      var z;
      Yl(a) ? (z = !0, jh(t)) : z = !1, kf(t, u);
      var j = t.stateNode, P;
      j === null ? (_m(e, t), u0(t, a, i), sS(t, a, i, u), P = !0) : e === null ? P = nb(t, a, i, u) : P = rb(e, t, a, i, u);
      var me = SS(e, t, a, P, z, u);
      {
        var Be = t.stateNode;
        P && Be.props !== i && (ec || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Ze(t) || "a component"), ec = !0);
      }
      return me;
    }
    function SS(e, t, a, i, u, s) {
      y0(e, t);
      var f = (t.flags & je) !== Fe;
      if (!i && !f)
        return u && JE(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Mp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, n0();
      else {
        ha(t);
        {
          if ($n(!0), v = p.render(), t.mode & Xt) {
            gn(!0);
            try {
              p.render();
            } finally {
              gn(!1);
            }
          }
          $n(!1);
        }
        ma();
      }
      return t.flags |= ni, e !== null && f ? cb(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && JE(t, a, !0), t.child;
    }
    function S0(e) {
      var t = e.stateNode;
      t.pendingContext ? XE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && XE(e, t.context, !1), Eg(e, t.containerInfo);
    }
    function vb(e, t, a) {
      if (S0(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      RC(e, t), em(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (u.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, y = t.updateQueue;
        if (y.baseState = v, t.memoizedState = v, t.flags & Rr) {
          var S = Js(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return E0(e, t, p, a, S);
        } else if (p !== s) {
          var b = Js(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return E0(e, t, p, a, b);
        } else {
          yw(t);
          var x = hC(t, null, p, a);
          t.child = x;
          for (var z = x; z; )
            z.flags = z.flags & ~yn | qr, z = z.sibling;
        }
      } else {
        if (bf(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function E0(e, t, a, i, u) {
      return bf(), ag(u), t.flags |= Rr, Sa(e, t, a, i), t.child;
    }
    function hb(e, t, a) {
      bC(t), e === null && rg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Fy(i, u);
      return p ? f = null : s !== null && Fy(i, s) && (t.flags |= Oa), y0(e, t), Sa(e, t, f, a), t.child;
    }
    function mb(e, t) {
      return e === null && rg(t), null;
    }
    function yb(e, t, a, i) {
      _m(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = m_(v), S = ul(v, u), b;
      switch (y) {
        case Y:
          return ES(t, v), t.type = v = Yf(v), b = gS(null, t, v, S, i), b;
        case Z:
          return t.type = v = KS(v), b = g0(null, t, v, S, i), b;
        case Ke:
          return t.type = v = XS(v), b = p0(null, t, v, S, i), b;
        case Ne: {
          if (t.type !== t.elementType) {
            var x = v.propTypes;
            x && nl(
              x,
              S,
              // Resolved for outer only
              "prop",
              kt(v)
            );
          }
          return b = v0(
            null,
            t,
            v,
            ul(v.type, S),
            // The inner type can have defaults too
            i
          ), b;
        }
      }
      var z = "";
      throw v !== null && typeof v == "object" && v.$$typeof === Je && (z = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + z));
    }
    function gb(e, t, a, i, u) {
      _m(e, t), t.tag = Z;
      var s;
      return Yl(a) ? (s = !0, jh(t)) : s = !1, kf(t, u), u0(t, a, i), sS(t, a, i, u), SS(null, t, a, !0, s, u);
    }
    function Sb(e, t, a, i) {
      _m(e, t);
      var u = t.pendingProps, s;
      {
        var f = Rf(t, a, !1);
        s = Tf(t, f);
      }
      kf(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = kt(a) || "Unknown";
          pS[y] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), pS[y] = !0);
        }
        t.mode & Xt && al.recordLegacyContextWarning(t, null), $n(!0), Mp.current = t, p = Af(null, t, a, u, s, i), v = Uf(), $n(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var S = kt(a) || "Unknown";
        Lp[S] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", S, S, S), Lp[S] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var b = kt(a) || "Unknown";
          Lp[b] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", b, b, b), Lp[b] = !0);
        }
        t.tag = Z, t.memoizedState = null, t.updateQueue = null;
        var x = !1;
        return Yl(a) ? (x = !0, jh(t)) : x = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, gg(t), l0(t, p), sS(t, a, u, i), SS(null, t, a, !0, x, i);
      } else {
        if (t.tag = Y, t.mode & Xt) {
          gn(!0);
          try {
            p = Af(null, t, a, u, s, i), v = Uf();
          } finally {
            gn(!1);
          }
        }
        return jr() && v && Zy(t), Sa(null, t, p, i), ES(t, a), t.child;
      }
    }
    function ES(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), mS[u] || (mS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = kt(t) || "Unknown";
          Np[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Np[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = kt(t) || "Unknown";
          hS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), hS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = kt(t) || "Unknown";
          vS[v] || (g("%s: Function components do not support contextType.", v), vS[v] = !0);
        }
      }
    }
    var CS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Nt
    };
    function RS(e) {
      return {
        baseLanes: e,
        cachePool: sb(),
        transitions: null
      };
    }
    function Eb(e, t) {
      var a = null;
      return {
        baseLanes: it(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function Cb(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Tg(e, Rp);
    }
    function Rb(e, t) {
      return xs(e.childLanes, t);
    }
    function C0(e, t, a) {
      var i = t.pendingProps;
      M_(t) && (t.flags |= je);
      var u = il.current, s = !1, f = (t.flags & je) !== Fe;
      if (f || Cb(u, e) ? (s = !0, t.flags &= ~je) : (e === null || e.memoizedState !== null) && (u = Pw(u, DC)), u = Mf(u), Uo(t, u), e === null) {
        rg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return _b(t, v);
        }
        var y = i.children, S = i.fallback;
        if (s) {
          var b = Tb(t, y, S, a), x = t.child;
          return x.memoizedState = RS(a), t.memoizedState = CS, b;
        } else
          return TS(t, y);
      } else {
        var z = e.memoizedState;
        if (z !== null) {
          var j = z.dehydrated;
          if (j !== null)
            return Db(e, t, f, i, j, z, a);
        }
        if (s) {
          var P = i.fallback, me = i.children, Be = wb(e, t, me, P, a), Ue = t.child, _t = e.child.memoizedState;
          return Ue.memoizedState = _t === null ? RS(a) : Eb(_t, a), Ue.childLanes = Rb(e, a), t.memoizedState = CS, Be;
        } else {
          var Et = i.children, M = xb(e, t, Et, a);
          return t.memoizedState = null, M;
        }
      }
    }
    function TS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = xS(u, i);
      return s.return = e, e.child = s, s;
    }
    function Tb(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & yt) === He && s !== null ? (p = s, p.childLanes = G, p.pendingProps = f, e.mode & Ut && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = xS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function xS(e, t, a) {
      return RR(e, t, G, null);
    }
    function R0(e, t) {
      return ic(e, t);
    }
    function xb(e, t, a, i) {
      var u = e.child, s = u.sibling, f = R0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & yt) === He && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= ka) : p.push(s);
      }
      return t.child = f, f;
    }
    function wb(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & yt) === He && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var S = t.child;
        y = S, y.childLanes = G, y.pendingProps = v, t.mode & Ut && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = R0(f, v), y.subtreeFlags = f.subtreeFlags & An;
      var b;
      return p !== null ? b = ic(p, i) : (b = Yo(i, s, u, null), b.flags |= yn), b.return = t, y.return = t, y.sibling = b, t.child = y, b;
    }
    function bm(e, t, a, i) {
      i !== null && ag(i), _f(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = TS(t, s);
      return f.flags |= yn, t.memoizedState = null, f;
    }
    function bb(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = xS(f, s), v = Yo(i, s, u, null);
      return v.flags |= yn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & yt) !== He && _f(t, e.child, null, u), v;
    }
    function _b(e, t, a) {
      return (e.mode & yt) === He ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = We) : By(t) ? e.lanes = Tr : e.lanes = Jr, null;
    }
    function Db(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Rr) {
          t.flags &= ~Rr;
          var M = cS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return bm(e, t, f, M);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= je, null;
          var V = i.children, L = i.fallback, te = bb(e, t, V, L, f), Ce = t.child;
          return Ce.memoizedState = RS(f), t.memoizedState = CS, te;
        }
      else {
        if (hw(), (t.mode & yt) === He)
          return bm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (By(u)) {
          var p, v, y;
          {
            var S = Lx(u);
            p = S.digest, v = S.message, y = S.stack;
          }
          var b;
          v ? b = new Error(v) : b = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var x = cS(b, p, y);
          return bm(e, t, f, x);
        }
        var z = ea(f, e.childLanes);
        if (ol || z) {
          var j = jm();
          if (j !== null) {
            var P = Ud(j, f);
            if (P !== Nt && P !== s.retryLane) {
              s.retryLane = P;
              var me = en;
              Ha(e, P), gr(j, e, P, me);
            }
          }
          $S();
          var Be = cS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return bm(e, t, f, Be);
        } else if ($E(u)) {
          t.flags |= je, t.child = e.child;
          var Ue = J1.bind(null, e);
          return Nx(u, Ue), null;
        } else {
          gw(t, u, s.treeContext);
          var _t = i.children, Et = TS(t, _t);
          return Et.flags |= qr, Et;
        }
      }
    }
    function T0(e, t, a) {
      e.lanes = it(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = it(i.lanes, t)), vg(e.return, t, a);
    }
    function kb(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === J) {
          var u = i.memoizedState;
          u !== null && T0(i, a, e);
        } else if (i.tag === on)
          T0(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function Ob(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && am(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function Mb(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !yS[e])
        if (yS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              g('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              g('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              g('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          g('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function Lb(e, t) {
      e !== void 0 && !wm[e] && (e !== "collapsed" && e !== "hidden" ? (wm[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (wm[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function x0(e, t) {
      {
        var a = ft(e), i = !a && typeof at(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Nb(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (ft(e)) {
          for (var a = 0; a < e.length; a++)
            if (!x0(e[a], a))
              return;
        } else {
          var i = at(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!x0(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function wS(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function w0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Mb(u), Lb(s, u), Nb(f, u), Sa(e, t, f, a);
      var p = il.current, v = Tg(p, Rp);
      if (v)
        p = xg(p, Rp), t.flags |= je;
      else {
        var y = e !== null && (e.flags & je) !== Fe;
        y && kb(t, t.child, a), p = Mf(p);
      }
      if (Uo(t, p), (t.mode & yt) === He)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var S = Ob(t.child), b;
            S === null ? (b = t.child, t.child = null) : (b = S.sibling, S.sibling = null), wS(
              t,
              !1,
              // isBackwards
              b,
              S,
              s
            );
            break;
          }
          case "backwards": {
            var x = null, z = t.child;
            for (t.child = null; z !== null; ) {
              var j = z.alternate;
              if (j !== null && am(j) === null) {
                t.child = z;
                break;
              }
              var P = z.sibling;
              z.sibling = x, x = z, z = P;
            }
            wS(
              t,
              !0,
              // isBackwards
              x,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            wS(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function zb(e, t, a) {
      Eg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = _f(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var b0 = !1;
    function Ab(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || b0 || (b0 = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (gC(t, u, p), f !== null) {
        var y = f.value;
        if (X(y, p)) {
          if (f.children === s.children && !Ah())
            return Vu(e, t, a);
        } else
          Mw(t, u, a);
      }
      var S = s.children;
      return Sa(e, t, S, a), t.child;
    }
    var _0 = !1;
    function Ub(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (_0 || (_0 = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), kf(t, a);
      var f = nr(i);
      ha(t);
      var p;
      return Mp.current = t, $n(!0), p = s(f), $n(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function zp() {
      ol = !0;
    }
    function _m(e, t) {
      (t.mode & yt) === He && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), n0(), Qp(t.lanes), ea(a, t.childLanes) ? (kw(e, t), t.child) : null;
    }
    function jb(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= ka) : s.push(e), a.flags |= yn, a;
      }
    }
    function bS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function Fb(e, t, a) {
      switch (t.tag) {
        case B:
          S0(t), t.stateNode, bf();
          break;
        case ne:
          bC(t);
          break;
        case Z: {
          var i = t.type;
          Yl(i) && jh(t);
          break;
        }
        case ue:
          Eg(t, t.stateNode.containerInfo);
          break;
        case dt: {
          var u = t.memoizedProps.value, s = t.type._context;
          gC(t, s, u);
          break;
        }
        case le:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= xt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case J: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Mf(il.current)), t.flags |= je, null;
            var y = t.child, S = y.childLanes;
            if (ea(a, S))
              return C0(e, t, a);
            Uo(t, Mf(il.current));
            var b = Vu(e, t, a);
            return b !== null ? b.sibling : null;
          } else
            Uo(t, Mf(il.current));
          break;
        }
        case on: {
          var x = (e.flags & je) !== Fe, z = ea(a, t.childLanes);
          if (x) {
            if (z)
              return w0(e, t, a);
            t.flags |= je;
          }
          var j = t.memoizedState;
          if (j !== null && (j.rendering = null, j.tail = null, j.lastEffect = null), Uo(t, il.current), z)
            break;
          return null;
        }
        case Pe:
        case Vt:
          return t.lanes = G, m0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function D0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return jb(e, t, nE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Ah() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = bS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & je) === Fe)
            return ol = !1, Fb(e, t, a);
          (e.flags & xc) !== Fe ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, jr() && sw(t)) {
        var f = t.index, p = cw();
        nC(t, p, f);
      }
      switch (t.lanes = G, t.tag) {
        case Re:
          return Sb(e, t, t.type, a);
        case pt: {
          var v = t.elementType;
          return yb(e, t, v, a);
        }
        case Y: {
          var y = t.type, S = t.pendingProps, b = t.elementType === y ? S : ul(y, S);
          return gS(e, t, y, b, a);
        }
        case Z: {
          var x = t.type, z = t.pendingProps, j = t.elementType === x ? z : ul(x, z);
          return g0(e, t, x, j, a);
        }
        case B:
          return vb(e, t, a);
        case ne:
          return hb(e, t, a);
        case ie:
          return mb(e, t);
        case J:
          return C0(e, t, a);
        case ue:
          return zb(e, t, a);
        case Ke: {
          var P = t.type, me = t.pendingProps, Be = t.elementType === P ? me : ul(P, me);
          return p0(e, t, P, Be, a);
        }
        case Me:
          return fb(e, t, a);
        case nt:
          return db(e, t, a);
        case le:
          return pb(e, t, a);
        case dt:
          return Ab(e, t, a);
        case tn:
          return Ub(e, t, a);
        case Ne: {
          var Ue = t.type, _t = t.pendingProps, Et = ul(Ue, _t);
          if (t.type !== t.elementType) {
            var M = Ue.propTypes;
            M && nl(
              M,
              Et,
              // Resolved for outer only
              "prop",
              kt(Ue)
            );
          }
          return Et = ul(Ue.type, Et), v0(e, t, Ue, Et, a);
        }
        case ve:
          return h0(e, t, t.type, t.pendingProps, a);
        case Tt: {
          var V = t.type, L = t.pendingProps, te = t.elementType === V ? L : ul(V, L);
          return gb(e, t, V, te, a);
        }
        case on:
          return w0(e, t, a);
        case Mt:
          break;
        case Pe:
          return m0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function jf(e) {
      e.flags |= xt;
    }
    function k0(e) {
      e.flags |= Cn, e.flags |= ho;
    }
    var O0, _S, M0, L0;
    O0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ne || u.tag === ie)
          lx(e, u.stateNode);
        else if (u.tag !== ue) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, _S = function(e, t) {
    }, M0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Cg(), v = ox(f, a, s, i, u, p);
        t.updateQueue = v, v && jf(t);
      }
    }, L0 = function(e, t, a, i) {
      a !== i && jf(t);
    };
    function Ap(e, t) {
      if (!jr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Hr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = G, i = Fe;
      if (t) {
        if ((e.mode & Ut) !== He) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = it(a, it(y.lanes, y.childLanes)), i |= y.subtreeFlags & An, i |= y.flags & An, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var S = e.child; S !== null; )
            a = it(a, it(S.lanes, S.childLanes)), i |= S.subtreeFlags & An, i |= S.flags & An, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ut) !== He) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = it(a, it(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = it(a, it(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Hb(e, t, a) {
      if (Tw() && (t.mode & yt) !== He && (t.flags & je) === Fe)
        return sC(t), bf(), t.flags |= Rr | os | Zn, !1;
      var i = Bh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (Cw(t), Hr(t), (t.mode & Ut) !== He) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (bf(), (t.flags & je) === Fe && (t.memoizedState = null), t.flags |= xt, Hr(t), (t.mode & Ut) !== He) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return cC(), !0;
    }
    function N0(e, t, a) {
      var i = t.pendingProps;
      switch (Jy(t), t.tag) {
        case Re:
        case pt:
        case ve:
        case Y:
        case Ke:
        case Me:
        case nt:
        case le:
        case tn:
        case Ne:
          return Hr(t), null;
        case Z: {
          var u = t.type;
          return Yl(u) && Uh(t), Hr(t), null;
        }
        case B: {
          var s = t.stateNode;
          if (Of(t), qy(t), bg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Bh(t);
            if (f)
              jf(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Rr) !== Fe) && (t.flags |= Qn, cC());
            }
          }
          return _S(e, t), Hr(t), null;
        }
        case ne: {
          Rg(t);
          var v = wC(), y = t.type;
          if (e !== null && t.stateNode != null)
            M0(e, t, y, i, v), e.ref !== t.ref && k0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Hr(t), null;
            }
            var S = Cg(), b = Bh(t);
            if (b)
              Sw(t, v, S) && jf(t);
            else {
              var x = ix(y, i, v, S, t);
              O0(x, t, !1, !1), t.stateNode = x, ux(x, y, i, v) && jf(t);
            }
            t.ref !== null && k0(t);
          }
          return Hr(t), null;
        }
        case ie: {
          var z = i;
          if (e && t.stateNode != null) {
            var j = e.memoizedProps;
            L0(e, t, j, z);
          } else {
            if (typeof z != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var P = wC(), me = Cg(), Be = Bh(t);
            Be ? Ew(t) && jf(t) : t.stateNode = sx(z, P, me, t);
          }
          return Hr(t), null;
        }
        case J: {
          Lf(t);
          var Ue = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var _t = Hb(e, t, Ue);
            if (!_t)
              return t.flags & Zn ? t : null;
          }
          if ((t.flags & je) !== Fe)
            return t.lanes = a, (t.mode & Ut) !== He && Xg(t), t;
          var Et = Ue !== null, M = e !== null && e.memoizedState !== null;
          if (Et !== M && Et) {
            var V = t.child;
            if (V.flags |= zn, (t.mode & yt) !== He) {
              var L = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              L || Tg(il.current, DC) ? P1() : $S();
            }
          }
          var te = t.updateQueue;
          if (te !== null && (t.flags |= xt), Hr(t), (t.mode & Ut) !== He && Et) {
            var Ce = t.child;
            Ce !== null && (t.treeBaseDuration -= Ce.treeBaseDuration);
          }
          return null;
        }
        case ue:
          return Of(t), _S(e, t), e === null && nw(t.stateNode.containerInfo), Hr(t), null;
        case dt:
          var ge = t.type._context;
          return pg(ge, t), Hr(t), null;
        case Tt: {
          var qe = t.type;
          return Yl(qe) && Uh(t), Hr(t), null;
        }
        case on: {
          Lf(t);
          var tt = t.memoizedState;
          if (tt === null)
            return Hr(t), null;
          var Jt = (t.flags & je) !== Fe, Ht = tt.rendering;
          if (Ht === null)
            if (Jt)
              Ap(tt, !1);
            else {
              var qn = B1() && (e === null || (e.flags & je) === Fe);
              if (!qn)
                for (var Pt = t.child; Pt !== null; ) {
                  var Vn = am(Pt);
                  if (Vn !== null) {
                    Jt = !0, t.flags |= je, Ap(tt, !1);
                    var ua = Vn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= xt), t.subtreeFlags = Fe, Ow(t, a), Uo(t, xg(il.current, Rp)), t.child;
                  }
                  Pt = Pt.sibling;
                }
              tt.tail !== null && Wn() > eR() && (t.flags |= je, Jt = !0, Ap(tt, !1), t.lanes = _d);
            }
          else {
            if (!Jt) {
              var Yr = am(Ht);
              if (Yr !== null) {
                t.flags |= je, Jt = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= xt), Ap(tt, !0), tt.tail === null && tt.tailMode === "hidden" && !Ht.alternate && !jr())
                  return Hr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wn() * 2 - tt.renderingStartTime > eR() && a !== Jr && (t.flags |= je, Jt = !0, Ap(tt, !1), t.lanes = _d);
            }
            if (tt.isBackwards)
              Ht.sibling = t.child, t.child = Ht;
            else {
              var Ra = tt.last;
              Ra !== null ? Ra.sibling = Ht : t.child = Ht, tt.last = Ht;
            }
          }
          if (tt.tail !== null) {
            var Ta = tt.tail;
            tt.rendering = Ta, tt.tail = Ta.sibling, tt.renderingStartTime = Wn(), Ta.sibling = null;
            var oa = il.current;
            return Jt ? oa = xg(oa, Rp) : oa = Mf(oa), Uo(t, oa), Ta;
          }
          return Hr(t), null;
        }
        case Mt:
          break;
        case Pe:
        case Vt: {
          YS(t);
          var Qu = t.memoizedState, $f = Qu !== null;
          if (e !== null) {
            var Xp = e.memoizedState, Zl = Xp !== null;
            Zl !== $f && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !fe && (t.flags |= zn);
          }
          return !$f || (t.mode & yt) === He ? Hr(t) : ea(Xl, Jr) && (Hr(t), t.subtreeFlags & (yn | xt) && (t.flags |= zn)), null;
        }
        case Lt:
          return null;
        case zt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Pb(e, t, a) {
      switch (Jy(t), t.tag) {
        case Z: {
          var i = t.type;
          Yl(i) && Uh(t);
          var u = t.flags;
          return u & Zn ? (t.flags = u & ~Zn | je, (t.mode & Ut) !== He && Xg(t), t) : null;
        }
        case B: {
          t.stateNode, Of(t), qy(t), bg();
          var s = t.flags;
          return (s & Zn) !== Fe && (s & je) === Fe ? (t.flags = s & ~Zn | je, t) : null;
        }
        case ne:
          return Rg(t), null;
        case J: {
          Lf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            bf();
          }
          var p = t.flags;
          return p & Zn ? (t.flags = p & ~Zn | je, (t.mode & Ut) !== He && Xg(t), t) : null;
        }
        case on:
          return Lf(t), null;
        case ue:
          return Of(t), null;
        case dt:
          var v = t.type._context;
          return pg(v, t), null;
        case Pe:
        case Vt:
          return YS(t), null;
        case Lt:
          return null;
        default:
          return null;
      }
    }
    function z0(e, t, a) {
      switch (Jy(t), t.tag) {
        case Z: {
          var i = t.type.childContextTypes;
          i != null && Uh(t);
          break;
        }
        case B: {
          t.stateNode, Of(t), qy(t), bg();
          break;
        }
        case ne: {
          Rg(t);
          break;
        }
        case ue:
          Of(t);
          break;
        case J:
          Lf(t);
          break;
        case on:
          Lf(t);
          break;
        case dt:
          var u = t.type._context;
          pg(u, t);
          break;
        case Pe:
        case Vt:
          YS(t);
          break;
      }
    }
    var A0 = null;
    A0 = /* @__PURE__ */ new Set();
    var Dm = !1, Pr = !1, Vb = typeof WeakSet == "function" ? WeakSet : Set, De = null, Ff = null, Hf = null;
    function Bb(e) {
      bl(null, function() {
        throw e;
      }), us();
    }
    var Ib = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ut)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function U0(e, t) {
      try {
        Ho(dr, e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function DS(e, t, a) {
      try {
        Ib(e, a);
      } catch (i) {
        dn(e, t, i);
      }
    }
    function Yb(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        dn(e, t, i);
      }
    }
    function j0(e, t) {
      try {
        H0(e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function Pf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Qe && vt && e.mode & Ut)
              try {
                ql(), i = a(null);
              } finally {
                Gl(e);
              }
            else
              i = a(null);
          } catch (u) {
            dn(e, t, u);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ze(e));
        } else
          a.current = null;
    }
    function km(e, t, a) {
      try {
        a();
      } catch (i) {
        dn(e, t, i);
      }
    }
    var F0 = !1;
    function $b(e, t) {
      rx(e.containerInfo), De = t, Qb();
      var a = F0;
      return F0 = !1, a;
    }
    function Qb() {
      for (; De !== null; ) {
        var e = De, t = e.child;
        (e.subtreeFlags & Dl) !== Fe && t !== null ? (t.return = e, De = t) : Wb();
      }
    }
    function Wb() {
      for (; De !== null; ) {
        var e = De;
        Gt(e);
        try {
          Gb(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, De = t;
          return;
        }
        De = e.return;
      }
    }
    function Gb(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Qn) !== Fe) {
        switch (Gt(e), e.tag) {
          case Y:
          case Ke:
          case ve:
            break;
          case Z: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ec && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ze(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ze(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = A0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Ze(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case B: {
            {
              var v = e.stateNode;
              Dx(v.containerInfo);
            }
            break;
          }
          case ne:
          case ie:
          case ue:
          case Tt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        fn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Pa ? Ki(t) : (e & dr) !== Pa && cs(t), (e & $l) !== Pa && Gp(!0), km(t, a, p), (e & $l) !== Pa && Gp(!1), (e & Fr) !== Pa ? Ll() : (e & dr) !== Pa && wd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Ho(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Fr) !== Pa ? xd(t) : (e & dr) !== Pa && Oc(t);
            var f = s.create;
            (e & $l) !== Pa && Gp(!0), s.destroy = f(), (e & $l) !== Pa && Gp(!1), (e & Fr) !== Pa ? zv() : (e & dr) !== Pa && Av();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & dr) !== Fe ? v = "useLayoutEffect" : (s.tag & $l) !== Fe ? v = "useInsertionEffect" : v = "useEffect";
                var y = void 0;
                p === null ? y = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? y = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : y = " You returned: " + p, g("%s must not return anything besides a function, which is used for clean-up.%s", v, y);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function qb(e, t) {
      if ((t.flags & xt) !== Fe)
        switch (t.tag) {
          case le: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = e0(), p = t.alternate === null ? "mount" : "update";
            JC() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case B:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case le:
                  var S = v.stateNode;
                  S.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function Kb(e, t, a, i) {
      if ((a.flags & Ol) !== Fe)
        switch (a.tag) {
          case Y:
          case Ke:
          case ve: {
            if (!Pr)
              if (a.mode & Ut)
                try {
                  ql(), Ho(dr | fr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(dr | fr, a);
            break;
          }
          case Z: {
            var u = a.stateNode;
            if (a.flags & xt && !Pr)
              if (t === null)
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ze(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ze(a) || "instance")), a.mode & Ut)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ze(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ze(a) || "instance")), a.mode & Ut)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ze(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ze(a) || "instance")), xC(a, p, u));
            break;
          }
          case B: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ne:
                    y = a.child.stateNode;
                    break;
                  case Z:
                    y = a.child.stateNode;
                    break;
                }
              xC(a, v, y);
            }
            break;
          }
          case ne: {
            var S = a.stateNode;
            if (t === null && a.flags & xt) {
              var b = a.type, x = a.memoizedProps;
              vx(S, b, x);
            }
            break;
          }
          case ie:
            break;
          case ue:
            break;
          case le: {
            {
              var z = a.memoizedProps, j = z.onCommit, P = z.onRender, me = a.stateNode.effectDuration, Be = e0(), Ue = t === null ? "mount" : "update";
              JC() && (Ue = "nested-update"), typeof P == "function" && P(a.memoizedProps.id, Ue, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Be);
              {
                typeof j == "function" && j(a.memoizedProps.id, Ue, me, Be), W1(a);
                var _t = a.return;
                e: for (; _t !== null; ) {
                  switch (_t.tag) {
                    case B:
                      var Et = _t.stateNode;
                      Et.effectDuration += me;
                      break e;
                    case le:
                      var M = _t.stateNode;
                      M.effectDuration += me;
                      break e;
                  }
                  _t = _t.return;
                }
              }
            }
            break;
          }
          case J: {
            a1(e, a);
            break;
          }
          case on:
          case Tt:
          case Mt:
          case Pe:
          case Vt:
          case zt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Pr || a.flags & Cn && H0(a);
    }
    function Xb(e) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve: {
          if (e.mode & Ut)
            try {
              ql(), U0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            U0(e, e.return);
          break;
        }
        case Z: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Yb(e, e.return, t), j0(e, e.return);
          break;
        }
        case ne: {
          j0(e, e.return);
          break;
        }
      }
    }
    function Zb(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ne) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? xx(u) : bx(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === ie) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? wx(s) : _x(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === Pe || i.tag === Vt) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function H0(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ne:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Ut)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ze(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Ze(e)), t.current = i;
      }
    }
    function Jb(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function P0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, P0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ne) {
          var a = e.stateNode;
          a !== null && iw(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function e1(e) {
      for (var t = e.return; t !== null; ) {
        if (V0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function V0(e) {
      return e.tag === ne || e.tag === B || e.tag === ue;
    }
    function B0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || V0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ne && t.tag !== ie && t.tag !== Ct; ) {
          if (t.flags & yn || t.child === null || t.tag === ue)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & yn))
          return t.stateNode;
      }
    }
    function t1(e) {
      var t = e1(e);
      switch (t.tag) {
        case ne: {
          var a = t.stateNode;
          t.flags & Oa && (YE(a), t.flags &= ~Oa);
          var i = B0(e);
          OS(e, i, a);
          break;
        }
        case B:
        case ue: {
          var u = t.stateNode.containerInfo, s = B0(e);
          kS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function kS(e, t, a) {
      var i = e.tag, u = i === ne || i === ie;
      if (u) {
        var s = e.stateNode;
        t ? Ex(a, s, t) : gx(a, s);
      } else if (i !== ue) {
        var f = e.child;
        if (f !== null) {
          kS(f, t, a);
          for (var p = f.sibling; p !== null; )
            kS(p, t, a), p = p.sibling;
        }
      }
    }
    function OS(e, t, a) {
      var i = e.tag, u = i === ne || i === ie;
      if (u) {
        var s = e.stateNode;
        t ? Sx(a, s, t) : yx(a, s);
      } else if (i !== ue) {
        var f = e.child;
        if (f !== null) {
          OS(f, t, a);
          for (var p = f.sibling; p !== null; )
            OS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function n1(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ne: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case B: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case ue: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        I0(e, t, a), Vr = null, cl = !1;
      }
      Jb(a);
    }
    function Po(e, t, a) {
      for (var i = a.child; i !== null; )
        I0(e, t, i), i = i.sibling;
    }
    function I0(e, t, a) {
      switch (Cd(a), a.tag) {
        case ne:
          Pr || Pf(a, t);
        case ie: {
          {
            var i = Vr, u = cl;
            Vr = null, Po(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? Rx(Vr, a.stateNode) : Cx(Vr, a.stateNode));
          }
          return;
        }
        case Ct: {
          Vr !== null && (cl ? Tx(Vr, a.stateNode) : Vy(Vr, a.stateNode));
          return;
        }
        case ue: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Po(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case Y:
        case Ke:
        case Ne:
        case ve: {
          if (!Pr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, S = y;
                do {
                  var b = S, x = b.destroy, z = b.tag;
                  x !== void 0 && ((z & $l) !== Pa ? km(a, t, x) : (z & dr) !== Pa && (cs(a), a.mode & Ut ? (ql(), km(a, t, x), Gl(a)) : km(a, t, x), wd())), S = S.next;
                } while (S !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case Z: {
          if (!Pr) {
            Pf(a, t);
            var j = a.stateNode;
            typeof j.componentWillUnmount == "function" && DS(a, t, j);
          }
          Po(e, t, a);
          return;
        }
        case Mt: {
          Po(e, t, a);
          return;
        }
        case Pe: {
          if (
            // TODO: Remove this dead flag
            a.mode & yt
          ) {
            var P = Pr;
            Pr = P || a.memoizedState !== null, Po(e, t, a), Pr = P;
          } else
            Po(e, t, a);
          break;
        }
        default: {
          Po(e, t, a);
          return;
        }
      }
    }
    function r1(e) {
      e.memoizedState;
    }
    function a1(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && Bx(s);
          }
        }
      }
    }
    function Y0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new Vb()), t.forEach(function(i) {
          var u = e_.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Zr)
              if (Ff !== null && Hf !== null)
                Wp(Hf, Ff);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function i1(e, t, a) {
      Ff = a, Hf = e, Gt(t), $0(t, e), Gt(t), Ff = null, Hf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            n1(e, t, s);
          } catch (v) {
            dn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & kl)
        for (var p = t.child; p !== null; )
          Gt(p), $0(p, e), p = p.sibling;
      Gt(f);
    }
    function $0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case Y:
        case Ke:
        case Ne:
        case ve: {
          if (fl(t, e), Kl(e), u & xt) {
            try {
              sl($l | fr, e, e.return), Ho($l | fr, e);
            } catch (qe) {
              dn(e, e.return, qe);
            }
            if (e.mode & Ut) {
              try {
                ql(), sl(dr | fr, e, e.return);
              } catch (qe) {
                dn(e, e.return, qe);
              }
              Gl(e);
            } else
              try {
                sl(dr | fr, e, e.return);
              } catch (qe) {
                dn(e, e.return, qe);
              }
          }
          return;
        }
        case Z: {
          fl(t, e), Kl(e), u & Cn && i !== null && Pf(i, i.return);
          return;
        }
        case ne: {
          fl(t, e), Kl(e), u & Cn && i !== null && Pf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                YE(s);
              } catch (qe) {
                dn(e, e.return, qe);
              }
            }
            if (u & xt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, S = e.updateQueue;
                if (e.updateQueue = null, S !== null)
                  try {
                    hx(f, S, y, v, p, e);
                  } catch (qe) {
                    dn(e, e.return, qe);
                  }
              }
            }
          }
          return;
        }
        case ie: {
          if (fl(t, e), Kl(e), u & xt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var b = e.stateNode, x = e.memoizedProps, z = i !== null ? i.memoizedProps : x;
            try {
              mx(b, z, x);
            } catch (qe) {
              dn(e, e.return, qe);
            }
          }
          return;
        }
        case B: {
          if (fl(t, e), Kl(e), u & xt && i !== null) {
            var j = i.memoizedState;
            if (j.isDehydrated)
              try {
                Vx(t.containerInfo);
              } catch (qe) {
                dn(e, e.return, qe);
              }
          }
          return;
        }
        case ue: {
          fl(t, e), Kl(e);
          return;
        }
        case J: {
          fl(t, e), Kl(e);
          var P = e.child;
          if (P.flags & zn) {
            var me = P.stateNode, Be = P.memoizedState, Ue = Be !== null;
            if (me.isHidden = Ue, Ue) {
              var _t = P.alternate !== null && P.alternate.memoizedState !== null;
              _t || H1();
            }
          }
          if (u & xt) {
            try {
              r1(e);
            } catch (qe) {
              dn(e, e.return, qe);
            }
            Y0(e);
          }
          return;
        }
        case Pe: {
          var Et = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & yt
          ) {
            var M = Pr;
            Pr = M || Et, fl(t, e), Pr = M;
          } else
            fl(t, e);
          if (Kl(e), u & zn) {
            var V = e.stateNode, L = e.memoizedState, te = L !== null, Ce = e;
            if (V.isHidden = te, te && !Et && (Ce.mode & yt) !== He) {
              De = Ce;
              for (var ge = Ce.child; ge !== null; )
                De = ge, u1(ge), ge = ge.sibling;
            }
            Zb(Ce, te);
          }
          return;
        }
        case on: {
          fl(t, e), Kl(e), u & xt && Y0(e);
          return;
        }
        case Mt:
          return;
        default: {
          fl(t, e), Kl(e);
          return;
        }
      }
    }
    function Kl(e) {
      var t = e.flags;
      if (t & yn) {
        try {
          t1(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        e.flags &= ~yn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function l1(e, t, a) {
      Ff = a, Hf = t, De = e, Q0(e, t, a), Ff = null, Hf = null;
    }
    function Q0(e, t, a) {
      for (var i = (e.mode & yt) !== He; De !== null; ) {
        var u = De, s = u.child;
        if (u.tag === Pe && i) {
          var f = u.memoizedState !== null, p = f || Dm;
          if (p) {
            MS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, S = y || Pr, b = Dm, x = Pr;
            Dm = p, Pr = S, Pr && !x && (De = u, o1(u));
            for (var z = s; z !== null; )
              De = z, Q0(
                z,
                // New root; bubble back up to here and stop.
                t,
                a
              ), z = z.sibling;
            De = u, Dm = b, Pr = x, MS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== Fe && s !== null ? (s.return = u, De = s) : MS(e, t, a);
      }
    }
    function MS(e, t, a) {
      for (; De !== null; ) {
        var i = De;
        if ((i.flags & Ol) !== Fe) {
          var u = i.alternate;
          Gt(i);
          try {
            Kb(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          De = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, De = s;
          return;
        }
        De = i.return;
      }
    }
    function u1(e) {
      for (; De !== null; ) {
        var t = De, a = t.child;
        switch (t.tag) {
          case Y:
          case Ke:
          case Ne:
          case ve: {
            if (t.mode & Ut)
              try {
                ql(), sl(dr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(dr, t, t.return);
            break;
          }
          case Z: {
            Pf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && DS(t, t.return, i);
            break;
          }
          case ne: {
            Pf(t, t.return);
            break;
          }
          case Pe: {
            var u = t.memoizedState !== null;
            if (u) {
              W0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, De = a) : W0(e);
      }
    }
    function W0(e) {
      for (; De !== null; ) {
        var t = De;
        if (t === e) {
          De = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, De = a;
          return;
        }
        De = t.return;
      }
    }
    function o1(e) {
      for (; De !== null; ) {
        var t = De, a = t.child;
        if (t.tag === Pe) {
          var i = t.memoizedState !== null;
          if (i) {
            G0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, De = a) : G0(e);
      }
    }
    function G0(e) {
      for (; De !== null; ) {
        var t = De;
        Gt(t);
        try {
          Xb(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          De = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, De = a;
          return;
        }
        De = t.return;
      }
    }
    function s1(e, t, a, i) {
      De = t, c1(t, e, a, i);
    }
    function c1(e, t, a, i) {
      for (; De !== null; ) {
        var u = De, s = u.child;
        (u.subtreeFlags & Gi) !== Fe && s !== null ? (s.return = u, De = s) : f1(e, t, a, i);
      }
    }
    function f1(e, t, a, i) {
      for (; De !== null; ) {
        var u = De;
        if ((u.flags & Gr) !== Fe) {
          Gt(u);
          try {
            d1(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          De = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, De = s;
          return;
        }
        De = u.return;
      }
    }
    function d1(e, t, a, i) {
      switch (t.tag) {
        case Y:
        case Ke:
        case ve: {
          if (t.mode & Ut) {
            Kg();
            try {
              Ho(Fr | fr, t);
            } finally {
              qg(t);
            }
          } else
            Ho(Fr | fr, t);
          break;
        }
      }
    }
    function p1(e) {
      De = e, v1();
    }
    function v1() {
      for (; De !== null; ) {
        var e = De, t = e.child;
        if ((De.flags & ka) !== Fe) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              De = u, y1(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            De = e;
          }
        }
        (e.subtreeFlags & Gi) !== Fe && t !== null ? (t.return = e, De = t) : h1();
      }
    }
    function h1() {
      for (; De !== null; ) {
        var e = De;
        (e.flags & Gr) !== Fe && (Gt(e), m1(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, De = t;
          return;
        }
        De = e.return;
      }
    }
    function m1(e) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve: {
          e.mode & Ut ? (Kg(), sl(Fr | fr, e, e.return), qg(e)) : sl(Fr | fr, e, e.return);
          break;
        }
      }
    }
    function y1(e, t) {
      for (; De !== null; ) {
        var a = De;
        Gt(a), S1(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, De = i) : g1(e);
      }
    }
    function g1(e) {
      for (; De !== null; ) {
        var t = De, a = t.sibling, i = t.return;
        if (P0(t), t === e) {
          De = null;
          return;
        }
        if (a !== null) {
          a.return = i, De = a;
          return;
        }
        De = i;
      }
    }
    function S1(e, t) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve: {
          e.mode & Ut ? (Kg(), sl(Fr, e, t), qg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function E1(e) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve: {
          try {
            Ho(dr | fr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case Z: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
      }
    }
    function C1(e) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve: {
          try {
            Ho(Fr | fr, e);
          } catch (t) {
            dn(e, e.return, t);
          }
          break;
        }
      }
    }
    function R1(e) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve: {
          try {
            sl(dr | fr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case Z: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && DS(e, e.return, t);
          break;
        }
      }
    }
    function T1(e) {
      switch (e.tag) {
        case Y:
        case Ke:
        case ve:
          try {
            sl(Fr | fr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Up = Symbol.for;
      Up("selector.component"), Up("selector.has_pseudo_class"), Up("selector.role"), Up("selector.test_id"), Up("selector.text");
    }
    var x1 = [];
    function w1() {
      x1.forEach(function(e) {
        return e();
      });
    }
    var b1 = D.ReactCurrentActQueue;
    function _1(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function q0() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && b1.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var D1 = Math.ceil, LS = D.ReactCurrentDispatcher, NS = D.ReactCurrentOwner, Br = D.ReactCurrentBatchConfig, dl = D.ReactCurrentActQueue, hr = (
      /*             */
      0
    ), K0 = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Bu = 0, jp = 1, tc = 2, Om = 3, Fp = 4, X0 = 5, zS = 6, bt = hr, Ea = null, On = null, mr = G, Xl = G, AS = Oo(G), yr = Bu, Hp = null, Mm = G, Pp = G, Lm = G, Vp = null, Va = null, US = 0, Z0 = 500, J0 = 1 / 0, k1 = 500, Iu = null;
    function Bp() {
      J0 = Wn() + k1;
    }
    function eR() {
      return J0;
    }
    var Nm = !1, jS = null, Vf = null, nc = !1, Vo = null, Ip = G, FS = [], HS = null, O1 = 50, Yp = 0, PS = null, VS = !1, zm = !1, M1 = 50, Bf = 0, Am = null, $p = en, Um = G, tR = !1;
    function jm() {
      return Ea;
    }
    function Ca() {
      return (bt & (Ir | ji)) !== hr ? Wn() : ($p !== en || ($p = Wn()), $p);
    }
    function Bo(e) {
      var t = e.mode;
      if ((t & yt) === He)
        return We;
      if ((bt & Ir) !== hr && mr !== G)
        return Ts(mr);
      var a = bw() !== ww;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Um === Nt && (Um = Nd()), Um;
      }
      var u = Ua();
      if (u !== Nt)
        return u;
      var s = cx();
      return s;
    }
    function L1(e) {
      var t = e.mode;
      return (t & yt) === He ? We : Vv();
    }
    function gr(e, t, a, i) {
      n_(), tR && g("useInsertionEffect must not schedule updates."), VS && (zm = !0), So(e, a, i), (bt & Ir) !== G && e === Ea ? i_(t) : (Zr && bs(e, t, a), l_(t), e === Ea && ((bt & Ir) === hr && (Pp = it(Pp, a)), yr === Fp && Io(e, mr)), Ba(e, i), a === We && bt === hr && (t.mode & yt) === He && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Bp(), tC()));
    }
    function N1(e, t, a) {
      var i = e.current;
      i.lanes = t, So(e, t, a), Ba(e, a);
    }
    function z1(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (bt & Ir) !== hr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Kc(e, t);
      var i = qc(e, e === Ea ? mr : G);
      if (i === G) {
        a !== null && yR(a), e.callbackNode = null, e.callbackPriority = Nt;
        return;
      }
      var u = Al(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== GS)) {
        a == null && s !== We && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && yR(a);
      var f;
      if (u === We)
        e.tag === Mo ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), ow(aR.bind(null, e))) : eC(aR.bind(null, e)), dl.current !== null ? dl.current.push(Lo) : dx(function() {
          (bt & (Ir | ji)) === hr && Lo();
        }), f = null;
      else {
        var p;
        switch (Gv(i)) {
          case Lr:
            p = ss;
            break;
          case _i:
            p = Ml;
            break;
          case za:
            p = qi;
            break;
          case Aa:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = qS(p, nR.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function nR(e, t) {
      if (Zw(), $p = en, Um = G, (bt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = qc(e, e === Ea ? mr : G);
      if (u === G)
        return null;
      var s = !Zc(e, u) && !Pv(e, u) && !t, f = s ? Y1(e, u) : Hm(e, u);
      if (f !== Bu) {
        if (f === tc) {
          var p = Xc(e);
          p !== G && (u = p, f = BS(e, p));
        }
        if (f === jp) {
          var v = Hp;
          throw rc(e, G), Io(e, u), Ba(e, Wn()), v;
        }
        if (f === zS)
          Io(e, u);
        else {
          var y = !Zc(e, u), S = e.current.alternate;
          if (y && !U1(S)) {
            if (f = Hm(e, u), f === tc) {
              var b = Xc(e);
              b !== G && (u = b, f = BS(e, b));
            }
            if (f === jp) {
              var x = Hp;
              throw rc(e, G), Io(e, u), Ba(e, Wn()), x;
            }
          }
          e.finishedWork = S, e.finishedLanes = u, A1(e, f, u);
        }
      }
      return Ba(e, Wn()), e.callbackNode === a ? nR.bind(null, e) : null;
    }
    function BS(e, t) {
      var a = Vp;
      if (tf(e)) {
        var i = rc(e, t);
        i.flags |= Rr, tw(e.containerInfo);
      }
      var u = Hm(e, t);
      if (u !== tc) {
        var s = Va;
        Va = a, s !== null && rR(s);
      }
      return u;
    }
    function rR(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function A1(e, t, a) {
      switch (t) {
        case Bu:
        case jp:
          throw new Error("Root did not complete. This is a bug in React.");
        case tc: {
          ac(e, Va, Iu);
          break;
        }
        case Om: {
          if (Io(e, a), _u(a) && // do not delay if we're inside an act() scope
          !gR()) {
            var i = US + Z0 - Wn();
            if (i > 10) {
              var u = qc(e, G);
              if (u !== G)
                break;
              var s = e.suspendedLanes;
              if (!Du(s, a)) {
                Ca(), Jc(e, s);
                break;
              }
              e.timeoutHandle = Hy(ac.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case Fp: {
          if (Io(e, a), Md(a))
            break;
          if (!gR()) {
            var f = ai(e, a), p = f, v = Wn() - p, y = t_(v) - v;
            if (y > 10) {
              e.timeoutHandle = Hy(ac.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case X0: {
          ac(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function U1(e) {
      for (var t = e; ; ) {
        if (t.flags & vo) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!X(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & vo && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function Io(e, t) {
      t = xs(t, Lm), t = xs(t, Pp), Yv(e, t);
    }
    function aR(e) {
      if (Jw(), (bt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      $u();
      var t = qc(e, G);
      if (!ea(t, We))
        return Ba(e, Wn()), null;
      var a = Hm(e, t);
      if (e.tag !== Mo && a === tc) {
        var i = Xc(e);
        i !== G && (t = i, a = BS(e, i));
      }
      if (a === jp) {
        var u = Hp;
        throw rc(e, G), Io(e, t), Ba(e, Wn()), u;
      }
      if (a === zS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ac(e, Va, Iu), Ba(e, Wn()), null;
    }
    function j1(e, t) {
      t !== G && (ef(e, it(t, We)), Ba(e, Wn()), (bt & (Ir | ji)) === hr && (Bp(), Lo()));
    }
    function IS(e, t) {
      var a = bt;
      bt |= K0;
      try {
        return e(t);
      } finally {
        bt = a, bt === hr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Bp(), tC());
      }
    }
    function F1(e, t, a, i, u) {
      var s = Ua(), f = Br.transition;
      try {
        return Br.transition = null, Fn(Lr), e(t, a, i, u);
      } finally {
        Fn(s), Br.transition = f, bt === hr && Bp();
      }
    }
    function Yu(e) {
      Vo !== null && Vo.tag === Mo && (bt & (Ir | ji)) === hr && $u();
      var t = bt;
      bt |= K0;
      var a = Br.transition, i = Ua();
      try {
        return Br.transition = null, Fn(Lr), e ? e() : void 0;
      } finally {
        Fn(i), Br.transition = a, bt = t, (bt & (Ir | ji)) === hr && Lo();
      }
    }
    function iR() {
      return (bt & (Ir | ji)) !== hr;
    }
    function Fm(e, t) {
      ia(AS, Xl, e), Xl = it(Xl, t);
    }
    function YS(e) {
      Xl = AS.current, aa(AS, e);
    }
    function rc(e, t) {
      e.finishedWork = null, e.finishedLanes = G;
      var a = e.timeoutHandle;
      if (a !== Py && (e.timeoutHandle = Py, fx(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          z0(u, i), i = i.return;
        }
      Ea = e;
      var s = ic(e.current, null);
      return On = s, mr = Xl = t, yr = Bu, Hp = null, Mm = G, Pp = G, Lm = G, Vp = null, Va = null, Nw(), al.discardPendingWarnings(), s;
    }
    function lR(e, t) {
      do {
        var a = On;
        try {
          if (Gh(), OC(), fn(), NS.current = null, a === null || a.return === null) {
            yr = jp, Hp = t, On = null;
            return;
          }
          if (Qe && a.mode & Ut && Tm(a, !0), Ge)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              bi(a, i, mr);
            } else
              fs(a, t, mr);
          ob(e, a.return, a, t, mr), cR(a);
        } catch (u) {
          t = u, On === a && a !== null ? (a = a.return, On = a) : a = On;
          continue;
        }
        return;
      } while (!0);
    }
    function uR() {
      var e = LS.current;
      return LS.current = gm, e === null ? gm : e;
    }
    function oR(e) {
      LS.current = e;
    }
    function H1() {
      US = Wn();
    }
    function Qp(e) {
      Mm = it(e, Mm);
    }
    function P1() {
      yr === Bu && (yr = Om);
    }
    function $S() {
      (yr === Bu || yr === Om || yr === tc) && (yr = Fp), Ea !== null && (Rs(Mm) || Rs(Pp)) && Io(Ea, mr);
    }
    function V1(e) {
      yr !== Fp && (yr = tc), Vp === null ? Vp = [e] : Vp.push(e);
    }
    function B1() {
      return yr === Bu;
    }
    function Hm(e, t) {
      var a = bt;
      bt |= Ir;
      var i = uR();
      if (Ea !== e || mr !== t) {
        if (Zr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Wp(e, mr), u.clear()), $v(e, t);
        }
        Iu = jd(), rc(e, t);
      }
      Eu(t);
      do
        try {
          I1();
          break;
        } catch (s) {
          lR(e, s);
        }
      while (!0);
      if (Gh(), bt = a, oR(i), On !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), Ea = null, mr = G, yr;
    }
    function I1() {
      for (; On !== null; )
        sR(On);
    }
    function Y1(e, t) {
      var a = bt;
      bt |= Ir;
      var i = uR();
      if (Ea !== e || mr !== t) {
        if (Zr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Wp(e, mr), u.clear()), $v(e, t);
        }
        Iu = jd(), Bp(), rc(e, t);
      }
      Eu(t);
      do
        try {
          $1();
          break;
        } catch (s) {
          lR(e, s);
        }
      while (!0);
      return Gh(), oR(i), bt = a, On !== null ? (Uv(), Bu) : (Mc(), Ea = null, mr = G, yr);
    }
    function $1() {
      for (; On !== null && !md(); )
        sR(On);
    }
    function sR(e) {
      var t = e.alternate;
      Gt(e);
      var a;
      (e.mode & Ut) !== He ? (Gg(e), a = QS(t, e, Xl), Tm(e, !0)) : a = QS(t, e, Xl), fn(), e.memoizedProps = e.pendingProps, a === null ? cR(e) : On = a, NS.current = null;
    }
    function cR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & os) === Fe) {
          Gt(t);
          var u = void 0;
          if ((t.mode & Ut) === He ? u = N0(a, t, Xl) : (Gg(t), u = N0(a, t, Xl), Tm(t, !1)), fn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = Pb(a, t);
          if (s !== null) {
            s.flags &= Ov, On = s;
            return;
          }
          if ((t.mode & Ut) !== He) {
            Tm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= os, i.subtreeFlags = Fe, i.deletions = null;
          else {
            yr = zS, On = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          On = v;
          return;
        }
        t = i, On = t;
      } while (t !== null);
      yr === Bu && (yr = X0);
    }
    function ac(e, t, a) {
      var i = Ua(), u = Br.transition;
      try {
        Br.transition = null, Fn(Lr), Q1(e, t, a, i);
      } finally {
        Br.transition = u, Fn(i);
      }
      return null;
    }
    function Q1(e, t, a, i) {
      do
        $u();
      while (Vo !== null);
      if (r_(), (bt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Rd(s), u === null)
        return Td(), null;
      if (s === G && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = G, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Nt;
      var f = it(u.lanes, u.childLanes);
      Ad(e, f), e === Ea && (Ea = null, On = null, mr = G), ((u.subtreeFlags & Gi) !== Fe || (u.flags & Gi) !== Fe) && (nc || (nc = !0, HS = a, qS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (Dl | kl | Ol | Gi)) !== Fe, v = (u.flags & (Dl | kl | Ol | Gi)) !== Fe;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var S = Ua();
        Fn(Lr);
        var b = bt;
        bt |= ji, NS.current = null, $b(e, u), t0(), i1(e, u, s), ax(e.containerInfo), e.current = u, ds(s), l1(u, e, s), ps(), yd(), bt = b, Fn(S), Br.transition = y;
      } else
        e.current = u, t0();
      var x = nc;
      if (nc ? (nc = !1, Vo = e, Ip = s) : (Bf = 0, Am = null), f = e.pendingLanes, f === G && (Vf = null), x || vR(e.current, !1), Sd(u.stateNode, i), Zr && e.memoizedUpdaters.clear(), w1(), Ba(e, Wn()), t !== null)
        for (var z = e.onRecoverableError, j = 0; j < t.length; j++) {
          var P = t[j], me = P.stack, Be = P.digest;
          z(P.value, {
            componentStack: me,
            digest: Be
          });
        }
      if (Nm) {
        Nm = !1;
        var Ue = jS;
        throw jS = null, Ue;
      }
      return ea(Ip, We) && e.tag !== Mo && $u(), f = e.pendingLanes, ea(f, We) ? (Xw(), e === PS ? Yp++ : (Yp = 0, PS = e)) : Yp = 0, Lo(), Td(), null;
    }
    function $u() {
      if (Vo !== null) {
        var e = Gv(Ip), t = Ds(za, e), a = Br.transition, i = Ua();
        try {
          return Br.transition = null, Fn(t), G1();
        } finally {
          Fn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function W1(e) {
      FS.push(e), nc || (nc = !0, qS(qi, function() {
        return $u(), null;
      }));
    }
    function G1() {
      if (Vo === null)
        return !1;
      var e = HS;
      HS = null;
      var t = Vo, a = Ip;
      if (Vo = null, Ip = G, (bt & (Ir | ji)) !== hr)
        throw new Error("Cannot flush passive effects while already rendering.");
      VS = !0, zm = !1, Su(a);
      var i = bt;
      bt |= ji, p1(t.current), s1(t, t.current, a, e);
      {
        var u = FS;
        FS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          qb(t, f);
        }
      }
      bd(), vR(t.current, !0), bt = i, Lo(), zm ? t === Am ? Bf++ : (Bf = 0, Am = t) : Bf = 0, VS = !1, zm = !1, Ed(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function fR(e) {
      return Vf !== null && Vf.has(e);
    }
    function q1(e) {
      Vf === null ? Vf = /* @__PURE__ */ new Set([e]) : Vf.add(e);
    }
    function K1(e) {
      Nm || (Nm = !0, jS = e);
    }
    var X1 = K1;
    function dR(e, t, a) {
      var i = Js(a, t), u = s0(e, i, We), s = zo(e, u, We), f = Ca();
      s !== null && (So(s, We, f), Ba(s, f));
    }
    function dn(e, t, a) {
      if (Bb(a), Gp(!1), e.tag === B) {
        dR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === B) {
          dR(i, e, a);
          return;
        } else if (i.tag === Z) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !fR(s)) {
            var f = Js(a, e), p = dS(i, f, We), v = zo(i, p, We), y = Ca();
            v !== null && (So(v, We, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function Z1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      Jc(e, a), u_(e), Ea === e && Du(mr, a) && (yr === Fp || yr === Om && _u(mr) && Wn() - US < Z0 ? rc(e, G) : Lm = it(Lm, a)), Ba(e, u);
    }
    function pR(e, t) {
      t === Nt && (t = L1(e));
      var a = Ca(), i = Ha(e, t);
      i !== null && (So(i, t, a), Ba(i, a));
    }
    function J1(e) {
      var t = e.memoizedState, a = Nt;
      t !== null && (a = t.retryLane), pR(e, a);
    }
    function e_(e, t) {
      var a = Nt, i;
      switch (e.tag) {
        case J:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case on:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), pR(e, a);
    }
    function t_(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : D1(e / 1960) * 1960;
    }
    function n_() {
      if (Yp > O1)
        throw Yp = 0, PS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Bf > M1 && (Bf = 0, Am = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function r_() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function vR(e, t) {
      Gt(e), Pm(e, _l, R1), t && Pm(e, Ti, T1), Pm(e, _l, E1), t && Pm(e, Ti, C1), fn();
    }
    function Pm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Fe ? i = i.child : ((i.flags & t) !== Fe && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Vm = null;
    function hR(e) {
      {
        if ((bt & Ir) !== hr || !(e.mode & yt))
          return;
        var t = e.tag;
        if (t !== Re && t !== B && t !== Z && t !== Y && t !== Ke && t !== Ne && t !== ve)
          return;
        var a = Ze(e) || "ReactComponent";
        if (Vm !== null) {
          if (Vm.has(a))
            return;
          Vm.add(a);
        } else
          Vm = /* @__PURE__ */ new Set([a]);
        var i = lr;
        try {
          Gt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Gt(e) : fn();
        }
      }
    }
    var QS;
    {
      var a_ = null;
      QS = function(e, t, a) {
        var i = TR(a_, t);
        try {
          return D0(e, t, a);
        } catch (s) {
          if (mw() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Gh(), OC(), z0(e, t), TR(t, i), t.mode & Ut && Gg(t), bl(null, D0, null, e, t, a), Qi()) {
            var u = us();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var mR = !1, WS;
    WS = /* @__PURE__ */ new Set();
    function i_(e) {
      if (mi && !Gw())
        switch (e.tag) {
          case Y:
          case Ke:
          case ve: {
            var t = On && Ze(On) || "Unknown", a = t;
            if (!WS.has(a)) {
              WS.add(a);
              var i = Ze(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case Z: {
            mR || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), mR = !0);
            break;
          }
        }
    }
    function Wp(e, t) {
      if (Zr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          bs(e, i, t);
        });
      }
    }
    var GS = {};
    function qS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), GS) : hd(e, t);
      }
    }
    function yR(e) {
      if (e !== GS)
        return Lv(e);
    }
    function gR() {
      return dl.current !== null;
    }
    function l_(e) {
      {
        if (e.mode & yt) {
          if (!q0())
            return;
        } else if (!_1() || bt !== hr || e.tag !== Y && e.tag !== Ke && e.tag !== ve)
          return;
        if (dl.current === null) {
          var t = lr;
          try {
            Gt(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Ze(e));
          } finally {
            t ? Gt(e) : fn();
          }
        }
      }
    }
    function u_(e) {
      e.tag !== Mo && q0() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Gp(e) {
      tR = e;
    }
    var Fi = null, If = null, o_ = function(e) {
      Fi = e;
    };
    function Yf(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function KS(e) {
      return Yf(e);
    }
    function XS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Yf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: W,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function SR(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case Z: {
            typeof i == "function" && (u = !0);
            break;
          }
          case Y: {
            (typeof i == "function" || s === Je) && (u = !0);
            break;
          }
          case Ke: {
            (s === W || s === Je) && (u = !0);
            break;
          }
          case Ne:
          case ve: {
            (s === rt || s === Je) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = Fi(a);
          if (f !== void 0 && f === Fi(i))
            return !0;
        }
        return !1;
      }
    }
    function ER(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        If === null && (If = /* @__PURE__ */ new WeakSet()), If.add(e);
      }
    }
    var s_ = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          ZS(e.current, i, a);
        });
      }
    }, c_ = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          qp(t, e, null, null);
        });
      }
    };
    function ZS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case Y:
          case ve:
          case Z:
            v = p;
            break;
          case Ke:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, S = !1;
        if (v !== null) {
          var b = Fi(v);
          b !== void 0 && (a.has(b) ? S = !0 : t.has(b) && (f === Z ? S = !0 : y = !0));
        }
        if (If !== null && (If.has(e) || i !== null && If.has(i)) && (S = !0), S && (e._debugNeedsRemount = !0), S || y) {
          var x = Ha(e, We);
          x !== null && gr(x, e, We, en);
        }
        u !== null && !S && ZS(u, t, a), s !== null && ZS(s, t, a);
      }
    }
    var f_ = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return JS(e.current, i, a), a;
      }
    };
    function JS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case Y:
          case ve:
          case Z:
            p = f;
            break;
          case Ke:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? d_(e, a) : i !== null && JS(i, t, a), u !== null && JS(u, t, a);
      }
    }
    function d_(e, t) {
      {
        var a = p_(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ne:
              t.add(i.stateNode);
              return;
            case ue:
              t.add(i.stateNode.containerInfo);
              return;
            case B:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function p_(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ne)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var eE;
    {
      eE = !1;
      try {
        var CR = Object.preventExtensions({});
      } catch {
        eE = !0;
      }
    }
    function v_(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Fe, this.subtreeFlags = Fe, this.deletions = null, this.lanes = G, this.childLanes = G, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !eE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new v_(e, t, a, i);
    };
    function tE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function h_(e) {
      return typeof e == "function" && !tE(e) && e.defaultProps === void 0;
    }
    function m_(e) {
      if (typeof e == "function")
        return tE(e) ? Z : Y;
      if (e != null) {
        var t = e.$$typeof;
        if (t === W)
          return Ke;
        if (t === rt)
          return Ne;
      }
      return Re;
    }
    function ic(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Fe, a.subtreeFlags = Fe, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & An, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Re:
        case Y:
        case ve:
          a.type = Yf(e.type);
          break;
        case Z:
          a.type = KS(e.type);
          break;
        case Ke:
          a.type = XS(e.type);
          break;
      }
      return a;
    }
    function y_(e, t) {
      e.flags &= An | yn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = G, e.lanes = t, e.child = null, e.subtreeFlags = Fe, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Fe, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function g_(e, t, a) {
      var i;
      return e === Fh ? (i = yt, t === !0 && (i |= Xt, i |= jt)) : i = He, Zr && (i |= Ut), oi(B, null, null, i);
    }
    function nE(e, t, a, i, u, s) {
      var f = Re, p = e;
      if (typeof e == "function")
        tE(e) ? (f = Z, p = KS(p)) : p = Yf(p);
      else if (typeof e == "string")
        f = ne;
      else
        e: switch (e) {
          case di:
            return Yo(a.children, u, s, t);
          case Wa:
            f = nt, u |= Xt, (u & yt) !== He && (u |= jt);
            break;
          case pi:
            return S_(a, u, s, t);
          case pe:
            return E_(a, u, s, t);
          case xe:
            return C_(a, u, s, t);
          case xn:
            return RR(a, u, s, t);
          case an:
          case gt:
          case cn:
          case ir:
          case mt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = dt;
                  break e;
                case R:
                  f = tn;
                  break e;
                case W:
                  f = Ke, p = XS(p);
                  break e;
                case rt:
                  f = Ne;
                  break e;
                case Je:
                  f = pt, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? Ze(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var S = oi(f, a, t, u);
      return S.elementType = e, S.type = p, S.lanes = s, S._debugOwner = i, S;
    }
    function rE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = nE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = oi(Me, e, i, t);
      return u.lanes = a, u;
    }
    function S_(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(le, e, i, t | Ut);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function E_(e, t, a, i) {
      var u = oi(J, e, i, t);
      return u.elementType = pe, u.lanes = a, u;
    }
    function C_(e, t, a, i) {
      var u = oi(on, e, i, t);
      return u.elementType = xe, u.lanes = a, u;
    }
    function RR(e, t, a, i) {
      var u = oi(Pe, e, i, t);
      u.elementType = xn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function aE(e, t, a) {
      var i = oi(ie, e, null, t);
      return i.lanes = a, i;
    }
    function R_() {
      var e = oi(ne, null, null, He);
      return e.elementType = "DELETED", e;
    }
    function T_(e) {
      var t = oi(Ct, null, null, He);
      return t.stateNode = e, t;
    }
    function iE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(ue, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function TR(e, t) {
      return e === null && (e = oi(Re, null, null, He)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function x_(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Py, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Nt, this.eventTimes = ws(G), this.expirationTimes = ws(en), this.pendingLanes = G, this.suspendedLanes = G, this.pingedLanes = G, this.expiredLanes = G, this.mutableReadLanes = G, this.finishedLanes = G, this.entangledLanes = G, this.entanglements = ws(G), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Fh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Mo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function xR(e, t, a, i, u, s, f, p, v, y) {
      var S = new x_(e, t, a, p, v), b = g_(t, s);
      S.current = b, b.stateNode = S;
      {
        var x = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        b.memoizedState = x;
      }
      return gg(b), S;
    }
    var lE = "18.3.1";
    function w_(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return $r(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: ar,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var uE, oE;
    uE = !1, oE = {};
    function wR(e) {
      if (!e)
        return ui;
      var t = po(e), a = uw(t);
      if (t.tag === Z) {
        var i = t.type;
        if (Yl(i))
          return ZE(t, i, a);
      }
      return a;
    }
    function b_(e, t) {
      {
        var a = po(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Kr(a);
        if (u === null)
          return null;
        if (u.mode & Xt) {
          var s = Ze(a) || "Component";
          if (!oE[s]) {
            oE[s] = !0;
            var f = lr;
            try {
              Gt(u), a.mode & Xt ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Gt(f) : fn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function bR(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return xR(e, t, v, y, a, i, u, s, f);
    }
    function _R(e, t, a, i, u, s, f, p, v, y) {
      var S = !0, b = xR(a, i, S, e, u, s, f, p, v);
      b.context = wR(null);
      var x = b.current, z = Ca(), j = Bo(x), P = Pu(z, j);
      return P.callback = t ?? null, zo(x, P, j), N1(b, j, z), b;
    }
    function qp(e, t, a, i) {
      gd(t, e);
      var u = t.current, s = Ca(), f = Bo(u);
      Sn(f);
      var p = wR(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && lr !== null && !uE && (uE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Ze(lr) || "Unknown"));
      var v = Pu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = zo(u, v, f);
      return y !== null && (gr(y, u, f, s), Jh(y, u, f)), f;
    }
    function Bm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ne:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function __(e) {
      switch (e.tag) {
        case B: {
          var t = e.stateNode;
          if (tf(t)) {
            var a = Fv(t);
            j1(t, a);
          }
          break;
        }
        case J: {
          Yu(function() {
            var u = Ha(e, We);
            if (u !== null) {
              var s = Ca();
              gr(u, e, We, s);
            }
          });
          var i = We;
          sE(e, i);
          break;
        }
      }
    }
    function DR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Iv(a.retryLane, t));
    }
    function sE(e, t) {
      DR(e, t);
      var a = e.alternate;
      a && DR(a, t);
    }
    function D_(e) {
      if (e.tag === J) {
        var t = Ss, a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        sE(e, t);
      }
    }
    function k_(e) {
      if (e.tag === J) {
        var t = Bo(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        sE(e, t);
      }
    }
    function kR(e) {
      var t = pn(e);
      return t === null ? null : t.stateNode;
    }
    var OR = function(e) {
      return null;
    };
    function O_(e) {
      return OR(e);
    }
    var MR = function(e) {
      return !1;
    };
    function M_(e) {
      return MR(e);
    }
    var LR = null, NR = null, zR = null, AR = null, UR = null, jR = null, FR = null, HR = null, PR = null;
    {
      var VR = function(e, t, a) {
        var i = t[a], u = ft(e) ? e.slice() : ut({}, e);
        return a + 1 === t.length ? (ft(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = VR(e[i], t, a + 1), u);
      }, BR = function(e, t) {
        return VR(e, t, 0);
      }, IR = function(e, t, a, i) {
        var u = t[i], s = ft(e) ? e.slice() : ut({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], ft(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = IR(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, YR = function(e, t, a) {
        if (t.length !== a.length) {
          ye("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              ye("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return IR(e, t, a, 0);
      }, $R = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = ft(e) ? e.slice() : ut({}, e);
        return s[u] = $R(e[u], t, a + 1, i), s;
      }, QR = function(e, t, a) {
        return $R(e, t, 0, a);
      }, cE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      LR = function(e, t, a, i) {
        var u = cE(e, t);
        if (u !== null) {
          var s = QR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = ut({}, e.memoizedProps);
          var f = Ha(e, We);
          f !== null && gr(f, e, We, en);
        }
      }, NR = function(e, t, a) {
        var i = cE(e, t);
        if (i !== null) {
          var u = BR(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = ut({}, e.memoizedProps);
          var s = Ha(e, We);
          s !== null && gr(s, e, We, en);
        }
      }, zR = function(e, t, a, i) {
        var u = cE(e, t);
        if (u !== null) {
          var s = YR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = ut({}, e.memoizedProps);
          var f = Ha(e, We);
          f !== null && gr(f, e, We, en);
        }
      }, AR = function(e, t, a) {
        e.pendingProps = QR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, We);
        i !== null && gr(i, e, We, en);
      }, UR = function(e, t) {
        e.pendingProps = BR(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, We);
        a !== null && gr(a, e, We, en);
      }, jR = function(e, t, a) {
        e.pendingProps = YR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, We);
        i !== null && gr(i, e, We, en);
      }, FR = function(e) {
        var t = Ha(e, We);
        t !== null && gr(t, e, We, en);
      }, HR = function(e) {
        OR = e;
      }, PR = function(e) {
        MR = e;
      };
    }
    function L_(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function N_(e) {
      return null;
    }
    function z_() {
      return lr;
    }
    function A_(e) {
      var t = e.findFiberByHostInstance, a = D.ReactCurrentDispatcher;
      return mo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: LR,
        overrideHookStateDeletePath: NR,
        overrideHookStateRenamePath: zR,
        overrideProps: AR,
        overridePropsDeletePath: UR,
        overridePropsRenamePath: jR,
        setErrorHandler: HR,
        setSuspenseHandler: PR,
        scheduleUpdate: FR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: L_,
        findFiberByHostInstance: t || N_,
        // React Refresh
        findHostInstancesForRefresh: f_,
        scheduleRefresh: s_,
        scheduleRoot: c_,
        setRefreshHandler: o_,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: z_,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: lE
      });
    }
    var WR = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function fE(e) {
      this._internalRoot = e;
    }
    Im.prototype.render = fE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Ym(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Nn) {
          var i = kR(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      qp(e, t, null, null);
    }, Im.prototype.unmount = fE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        iR() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          qp(null, e, null, null);
        }), WE(t);
      }
    };
    function U_(e, t) {
      if (!Ym(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      GR(e);
      var a = !1, i = !1, u = "", s = WR;
      t != null && (t.hydrate ? ye("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Dr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = bR(e, Fh, null, a, i, u, s);
      Mh(f.current, e);
      var p = e.nodeType === Nn ? e.parentNode : e;
      return tp(p), new fE(f);
    }
    function Im(e) {
      this._internalRoot = e;
    }
    function j_(e) {
      e && Jv(e);
    }
    Im.prototype.unstable_scheduleHydration = j_;
    function F_(e, t, a) {
      if (!Ym(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      GR(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = WR;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = _R(t, null, e, Fh, i, s, f, p, v);
      if (Mh(y.current, e), tp(e), u)
        for (var S = 0; S < u.length; S++) {
          var b = u[S];
          Bw(y, b);
        }
      return new Im(y);
    }
    function Ym(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === rd));
    }
    function Kp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === rd || e.nodeType === Nn && e.nodeValue === " react-mount-point-unstable "));
    }
    function GR(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), dp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var H_ = D.ReactCurrentOwner, qR;
    qR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Nn) {
        var t = kR(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = dE(e), u = !!(i && ko(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function dE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function KR() {
    }
    function P_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var x = Bm(f);
            s.call(x);
          };
        }
        var f = _R(
          t,
          i,
          e,
          Mo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          KR
        );
        e._reactRootContainer = f, Mh(f.current, e);
        var p = e.nodeType === Nn ? e.parentNode : e;
        return tp(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var x = Bm(S);
            y.call(x);
          };
        }
        var S = bR(
          e,
          Mo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          KR
        );
        e._reactRootContainer = S, Mh(S.current, e);
        var b = e.nodeType === Nn ? e.parentNode : e;
        return tp(b), Yu(function() {
          qp(t, S, a, i);
        }), S;
      }
    }
    function V_(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function $m(e, t, a, i, u) {
      qR(a), V_(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = P_(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Bm(f);
            p.call(v);
          };
        }
        qp(t, f, e, u);
      }
      return Bm(f);
    }
    var XR = !1;
    function B_(e) {
      {
        XR || (XR = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = H_.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", kt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : b_(e, "findDOMNode");
    }
    function I_(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = dp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return $m(null, e, t, !0, a);
    }
    function Y_(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = dp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return $m(null, e, t, !1, a);
    }
    function $_(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !sy(e))
        throw new Error("parentComponent must be a valid React Component");
      return $m(e, t, a, !1, i);
    }
    var ZR = !1;
    function Q_(e) {
      if (ZR || (ZR = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Kp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = dp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = dE(e), i = a && !ko(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          $m(null, null, e, !1, function() {
            e._reactRootContainer = null, WE(e);
          });
        }), !0;
      } else {
        {
          var u = dE(e), s = !!(u && ko(u)), f = e.nodeType === Wr && Kp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    xr(__), Eo(D_), qv(k_), Os(Ua), Fd(Qv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), gc(GT), oy(IS, F1, Yu);
    function W_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Ym(t))
        throw new Error("Target container is not a DOM element.");
      return w_(e, t, null, a);
    }
    function G_(e, t, a, i) {
      return $_(e, t, a, i);
    }
    var pE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [ko, Cf, Lh, oo, Sc, IS]
    };
    function q_(e, t) {
      return pE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), U_(e, t);
    }
    function K_(e, t, a) {
      return pE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), F_(e, t, a);
    }
    function X_(e) {
      return iR() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var Z_ = A_({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: lE,
      rendererPackageName: "react-dom"
    });
    if (!Z_ && Mn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var JR = window.location.protocol;
      /^(https?|file):$/.test(JR) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (JR === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = pE, Ya.createPortal = W_, Ya.createRoot = q_, Ya.findDOMNode = B_, Ya.flushSync = X_, Ya.hydrate = I_, Ya.hydrateRoot = K_, Ya.render = Y_, Ya.unmountComponentAtNode = Q_, Ya.unstable_batchedUpdates = IS, Ya.unstable_renderSubtreeIntoContainer = G_, Ya.version = lE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ya;
}
function dT() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(dT);
    } catch (F) {
      console.error(F);
    }
  }
}
process.env.NODE_ENV === "production" ? (dT(), gE.exports = uD()) : gE.exports = oD();
var Km = gE.exports, SE, Wm = Km;
if (process.env.NODE_ENV === "production")
  SE = Wm.createRoot, Wm.hydrateRoot;
else {
  var sT = Wm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  SE = function(F, k) {
    sT.usingClientEntryPoint = !0;
    try {
      return Wm.createRoot(F, k);
    } finally {
      sT.usingClientEntryPoint = !1;
    }
  };
}
const Gm = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, sD = {
  activeEdition: Gm,
  setEdition: () => {
  },
  supportedEditions: [Gm],
  characterCreationData: void 0,
  reloadEditionData: async () => {
  },
  isLoading: !1,
  error: void 0
}, pT = Dt.createContext(sD);
function cD({ children: F }) {
  const [k, D] = Dt.useState(Gm), [we, oe] = Dt.useState({}), ye = Dt.useMemo(
    () => [
      Gm,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), g = Dt.useCallback(
    async (Y) => {
      const Z = Y ?? k.key;
      if (oe((Re) => {
        var B;
        return {
          ...Re,
          [Z]: {
            data: (B = Re[Z]) == null ? void 0 : B.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        oe((Re) => {
          var B;
          return {
            ...Re,
            [Z]: {
              data: (B = Re[Z]) == null ? void 0 : B.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Re = await fetch(`/api/editions/${Z}/character-creation`);
        if (!Re.ok)
          throw new Error(`Failed to load edition data (${Re.status})`);
        const B = await Re.json(), ue = (B == null ? void 0 : B.character_creation) ?? B;
        oe((ne) => ({
          ...ne,
          [Z]: {
            data: ue,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Re) {
        const B = Re instanceof Error ? Re.message : "Unknown error loading edition data";
        oe((ue) => {
          var ne;
          return {
            ...ue,
            [Z]: {
              data: (ne = ue[Z]) == null ? void 0 : ne.data,
              loading: !1,
              error: B
            }
          };
        });
      }
    },
    [k.key]
  ), Oe = Dt.useMemo(() => {
    const Y = we[k.key];
    return {
      activeEdition: k,
      supportedEditions: ye,
      setEdition: (Z) => {
        const Re = ye.find((B) => B.key === Z);
        Re ? D(Re) : console.warn(`Edition '${Z}' is not registered; keeping current edition.`);
      },
      characterCreationData: Y == null ? void 0 : Y.data,
      reloadEditionData: g,
      isLoading: (Y == null ? void 0 : Y.loading) ?? !1,
      error: Y == null ? void 0 : Y.error
    };
  }, [k, we, g, ye]);
  return Dt.useEffect(() => {
    const Y = we[k.key];
    !(Y != null && Y.data) && !(Y != null && Y.loading) && g(k.key);
  }, [k.key, we, g]), Dt.useEffect(() => {
    var Z, Re;
    const Y = we[k.key];
    Y != null && Y.data && typeof window < "u" && ((Re = (Z = window.ShadowmasterLegacyApp) == null ? void 0 : Z.setEditionData) == null || Re.call(Z, k.key, Y.data));
  }, [k.key, we]), /* @__PURE__ */ Q.jsx(pT.Provider, { value: Oe, children: F });
}
function fD() {
  const F = Dt.useContext(pT);
  if (!F)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return F;
}
function Xm() {
  return fD();
}
const Qf = [
  "magic",
  "metatype",
  "attributes",
  "skills",
  "resources"
], qm = ["A", "B", "C", "D", "E"], dD = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function pD(F) {
  return dD[F];
}
function vD(F, k) {
  var we;
  const D = (we = F == null ? void 0 : F.priorities) == null ? void 0 : we[k];
  return D ? qm.map((oe) => {
    const ye = D[oe] ?? { label: `Priority ${oe}` };
    return { code: oe, option: ye };
  }) : qm.map((oe) => ({
    code: oe,
    option: { label: `Priority ${oe}` }
  }));
}
function hD() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function vT(F) {
  return Qf.reduce((k, D) => {
    const we = F[D];
    return we && k.push(we), k;
  }, []);
}
function cT(F) {
  const k = new Set(vT(F));
  return qm.filter((D) => !k.has(D));
}
function mD(F) {
  return vT(F).length === qm.length;
}
function yD(F) {
  return F ? F.summary || F.description || F.label || "" : "Drag a priority letter from the pool into this category.";
}
function gD(F) {
  return Object.fromEntries(
    Object.entries(F).map(([k, D]) => [k, D || null])
  );
}
function SD() {
  var we, oe;
  const F = hD();
  if (typeof window > "u")
    return F;
  const k = (oe = (we = window.ShadowmasterLegacyApp) == null ? void 0 : we.getPriorities) == null ? void 0 : oe.call(we);
  if (!k)
    return F;
  const D = { ...F };
  for (const ye of Qf) {
    const g = k[ye];
    typeof g == "string" && g.length === 1 && (D[ye] = g);
  }
  return D;
}
function ED() {
  const { characterCreationData: F, activeEdition: k, isLoading: D, error: we } = Xm(), [oe, ye] = Dt.useState(() => SD()), [g, Oe] = Dt.useState(null), Y = Dt.useRef({});
  Dt.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), Dt.useEffect(() => {
    var J;
    const le = (J = window.ShadowmasterLegacyApp) == null ? void 0 : J.setPriorities;
    le && le(gD(oe));
  }, [oe]);
  const Z = Dt.useMemo(() => cT(oe), [oe]), Re = mD(oe);
  function B(le) {
    ye((J) => {
      const Ne = { ...J };
      for (const ve of Qf)
        Ne[ve] === le && (Ne[ve] = "");
      return Ne;
    });
  }
  function ue(le, J) {
    J.dataTransfer.effectAllowed = "move", Oe({ source: "pool", priority: le }), J.dataTransfer.setData("text/plain", le);
  }
  function ne(le, J, Ne) {
    Ne.dataTransfer.effectAllowed = "move", Oe({ source: "dropzone", category: le, priority: J }), Ne.dataTransfer.setData("text/plain", J);
  }
  function ie() {
    Oe(null);
  }
  function Me(le, J) {
    J.preventDefault();
    const Ne = J.dataTransfer.getData("text/plain") || (g == null ? void 0 : g.priority) || "";
    if (!Ne) {
      ie();
      return;
    }
    ye((ve) => {
      const pt = { ...ve };
      for (const Tt of Qf)
        pt[Tt] === Ne && (pt[Tt] = "");
      return pt[le] = Ne, pt;
    }), ie();
  }
  function nt(le, J) {
    J.preventDefault();
    const Ne = Y.current[le];
    Ne && Ne.classList.add("active");
  }
  function tn(le) {
    const J = Y.current[le];
    J && J.classList.remove("active");
  }
  function dt(le) {
    const J = Y.current[le];
    J && J.classList.remove("active");
  }
  function Ke(le) {
    const J = Z[0];
    if (!J) {
      B(le);
      return;
    }
    ye((Ne) => {
      const ve = { ...Ne };
      for (const pt of Qf)
        ve[pt] === le && (ve[pt] = "");
      return ve[J] = le, ve;
    });
  }
  return /* @__PURE__ */ Q.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ Q.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ Q.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ Q.jsx("strong", { children: k.label })
      ] }),
      /* @__PURE__ */ Q.jsx("span", { children: D ? "Loading priority data…" : we ? `Error: ${we}` : "Drag letters into categories" })
    ] }),
    /* @__PURE__ */ Q.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ Q.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ Q.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ Q.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (le) => {
              le.preventDefault(), Oe((J) => J && { ...J, category: void 0 });
            },
            onDrop: (le) => {
              le.preventDefault();
              const J = le.dataTransfer.getData("text/plain") || (g == null ? void 0 : g.priority) || "";
              J && B(J), ie();
            },
            children: /* @__PURE__ */ Q.jsx("div", { className: "react-priority-chips", children: ["A", "B", "C", "D", "E"].map((le) => {
              const J = cT(oe).includes(le) === !1, Ne = (g == null ? void 0 : g.priority) === le && g.source === "pool";
              return /* @__PURE__ */ Q.jsx(
                "div",
                {
                  className: `react-priority-chip ${J ? "used" : ""} ${Ne ? "dragging" : ""}`,
                  draggable: !J,
                  onDragStart: (ve) => !J && ue(le, ve),
                  onDragEnd: ie,
                  onClick: () => Ke(le),
                  role: "button",
                  tabIndex: J ? -1 : 0,
                  onKeyDown: (ve) => {
                    !J && (ve.key === "Enter" || ve.key === " ") && (ve.preventDefault(), Ke(le));
                  },
                  children: le
                },
                le
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ Q.jsx("section", { className: "react-priority-dropzones", children: Qf.map((le) => {
        const J = pD(le), Ne = vD(F, le), ve = oe[le], pt = Ne.find((Ct) => Ct.code === ve), Tt = (g == null ? void 0 : g.source) === "dropzone" && g.category === le;
        return /* @__PURE__ */ Q.jsxs(
          "div",
          {
            ref: (Ct) => {
              Y.current[le] = Ct;
            },
            className: `react-priority-dropzone ${ve ? "filled" : ""}`,
            onDragOver: (Ct) => nt(le, Ct),
            onDragLeave: () => tn(le),
            onDrop: (Ct) => {
              Me(le, Ct), dt(le);
            },
            children: [
              /* @__PURE__ */ Q.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ Q.jsx("span", { children: J }),
                ve && /* @__PURE__ */ Q.jsxs("span", { children: [
                  ve,
                  " — ",
                  (pt == null ? void 0 : pt.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ Q.jsx("div", { className: "react-priority-description", children: yD(pt == null ? void 0 : pt.option) }),
              ve ? /* @__PURE__ */ Q.jsx(
                "div",
                {
                  className: `react-priority-chip ${Tt ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (Ct) => ne(le, ve, Ct),
                  onDragEnd: ie,
                  onDoubleClick: () => B(ve),
                  children: ve
                }
              ) : /* @__PURE__ */ Q.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          le
        );
      }) })
    ] }),
    /* @__PURE__ */ Q.jsx(
      "div",
      {
        className: `react-priority-status ${Re ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: Re ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${Z.join(", ")}`
      }
    )
  ] });
}
const CD = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function RD(F, k) {
  if (!F)
    return [];
  const D = k || "E";
  return F.metatypes.map((we) => {
    var oe;
    return {
      ...we,
      priorityAllowed: ((oe = we.priority_tiers) == null ? void 0 : oe.includes(D)) ?? !1
    };
  }).filter((we) => we.priorityAllowed);
}
function TD(F) {
  return F === 0 ? "+0" : F > 0 ? `+${F}` : `${F}`;
}
function xD(F) {
  const k = F.toLowerCase();
  return CD[k] ?? F;
}
function wD({ priority: F, selectedMetatype: k, onSelect: D }) {
  const { characterCreationData: we, isLoading: oe, error: ye, activeEdition: g } = Xm();
  Dt.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const Oe = Dt.useMemo(() => RD(we, F), [
    we,
    F
  ]), Y = !!k, Z = () => {
    var B, ue;
    (ue = (B = window.ShadowmasterLegacyApp) == null ? void 0 : B.showWizardStep) == null || ue.call(B, 1);
  }, Re = () => {
    var B, ue;
    k && ((ue = (B = window.ShadowmasterLegacyApp) == null ? void 0 : B.showWizardStep) == null || ue.call(B, 3));
  };
  return oe ? /* @__PURE__ */ Q.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : ye ? /* @__PURE__ */ Q.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    ye
  ] }) : Oe.length ? /* @__PURE__ */ Q.jsxs(Q.Fragment, { children: [
    /* @__PURE__ */ Q.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ Q.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ Q.jsxs("span", { children: [
        "Priority: ",
        F || "—"
      ] })
    ] }),
    /* @__PURE__ */ Q.jsx("div", { className: "react-metatype-grid", children: Oe.map((B) => /* @__PURE__ */ Q.jsxs(
      "article",
      {
        className: `react-metatype-card ${k === B.id ? "selected" : ""}`,
        onClick: () => D(B.id),
        children: [
          /* @__PURE__ */ Q.jsx("h4", { children: B.name }),
          /* @__PURE__ */ Q.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ Q.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const ue = B.attribute_modifiers ? Object.entries(B.attribute_modifiers).filter(([, ne]) => ne !== 0) : [];
              return ue.length === 0 ? /* @__PURE__ */ Q.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : ue.map(([ne, ie]) => /* @__PURE__ */ Q.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ Q.jsx("span", { children: xD(ne) }),
                /* @__PURE__ */ Q.jsx("span", { className: ie > 0 ? "positive" : "negative", children: TD(ie) })
              ] }, ne));
            })()
          ] }),
          g.key === "sr5" && B.special_attribute_points && Object.keys(B.special_attribute_points).length > 0 && /* @__PURE__ */ Q.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ Q.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(B.special_attribute_points).map(([ue, ne]) => /* @__PURE__ */ Q.jsx("div", { className: "ability", children: /* @__PURE__ */ Q.jsxs("span", { children: [
              "Priority ",
              ue,
              ": ",
              ne
            ] }) }, ue))
          ] }),
          B.abilities && B.abilities.length > 0 && /* @__PURE__ */ Q.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ Q.jsx("strong", { children: "Special Abilities" }),
            B.abilities.map((ue, ne) => /* @__PURE__ */ Q.jsx("div", { className: "ability", children: /* @__PURE__ */ Q.jsx("span", { children: ue }) }, ne))
          ] }),
          (!B.abilities || B.abilities.length === 0) && /* @__PURE__ */ Q.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ Q.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ Q.jsx("div", { className: "ability", children: /* @__PURE__ */ Q.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      B.id
    )) }),
    /* @__PURE__ */ Q.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ Q.jsx("button", { type: "button", className: "btn btn-secondary", onClick: Z, children: "Back" }),
      /* @__PURE__ */ Q.jsx("div", { className: `react-metatype-status ${Y ? "ready" : ""}`, children: Y ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ Q.jsx("button", { type: "button", className: "btn btn-primary", disabled: !Y, onClick: Re, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ Q.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const bD = ["Hermetic", "Shamanic"], _D = [
  {
    id: "Bear",
    name: "Bear",
    description: "The Bear totem represents strength, healing, and the protective nature of the forest. Bear shamans draw power from the wilderness and have a deep connection to natural healing.",
    notes: [
      "+2 dice for Health spells",
      "+2 dice for Forest spirits",
      "Risk of berserk rage when wounded in combat"
    ]
  }
];
function DD(F) {
  return (F || "").toUpperCase();
}
function kD({ priority: F, selection: k, onChange: D }) {
  var ne;
  const { characterCreationData: we, activeEdition: oe } = Xm(), ye = DD(F), g = ((ne = we == null ? void 0 : we.priorities) == null ? void 0 : ne.magic) ?? null, Oe = Dt.useMemo(() => g && g[ye] || null, [g, ye]);
  Dt.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), Dt.useEffect(() => {
    if (!ye) {
      (k.type !== "Mundane" || k.tradition || k.totem) && D({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (ye === "A") {
      const ie = k.tradition ?? "Hermetic", Me = ie === "Shamanic" ? k.totem : null;
      (k.type !== "Full Magician" || k.tradition !== ie || k.totem !== Me) && D({ type: "Full Magician", tradition: ie, totem: Me });
    } else if (ye === "B") {
      let ie = k.type;
      k.type !== "Adept" && k.type !== "Aspected Magician" && (ie = "Adept");
      let Me = k.tradition, nt = k.totem;
      ie === "Aspected Magician" ? (Me = Me ?? "Hermetic", Me !== "Shamanic" && (nt = null)) : (Me = null, nt = null), (k.type !== ie || k.tradition !== Me || k.totem !== nt) && D({ type: ie, tradition: Me, totem: nt });
    } else
      (k.type !== "Mundane" || k.tradition || k.totem) && D({ type: "Mundane", tradition: null, totem: null });
  }, [ye]);
  const Y = (ie) => {
    const Me = {
      type: ie.type !== void 0 ? ie.type : k.type,
      tradition: ie.tradition !== void 0 ? ie.tradition : k.tradition,
      totem: ie.totem !== void 0 ? ie.totem : k.totem
    };
    Me.type !== "Full Magician" && Me.type !== "Aspected Magician" && (Me.tradition = null, Me.totem = null), Me.tradition !== "Shamanic" && (Me.totem = null), !(Me.type === k.type && Me.tradition === k.tradition && Me.totem === k.totem) && D(Me);
  }, Z = () => !ye || ["C", "D", "E", ""].includes(ye) ? /* @__PURE__ */ Q.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ Q.jsxs(
    "article",
    {
      className: `react-magic-card ${k.type === "Mundane" ? "selected" : ""}`,
      onClick: () => Y({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ Q.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ Q.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : ye === "A" ? /* @__PURE__ */ Q.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ Q.jsxs(
    "article",
    {
      className: `react-magic-card ${k.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => Y({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ Q.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ Q.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ Q.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : ye === "B" ? /* @__PURE__ */ Q.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ Q.jsxs(
      "article",
      {
        className: `react-magic-card ${k.type === "Adept" ? "selected" : ""}`,
        onClick: () => Y({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ Q.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ Q.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ Q.jsxs(
      "article",
      {
        className: `react-magic-card ${k.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => Y({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ Q.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ Q.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ Q.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, Re = () => !k.type || !["Full Magician", "Aspected Magician"].includes(k.type) ? null : /* @__PURE__ */ Q.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ Q.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ Q.jsx("div", { className: "tradition-options", children: bD.map((ie) => /* @__PURE__ */ Q.jsxs("label", { className: `tradition-option ${k.tradition === ie ? "selected" : ""}`, children: [
      /* @__PURE__ */ Q.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: ie,
          checked: k.tradition === ie,
          onChange: () => Y({ tradition: ie })
        }
      ),
      /* @__PURE__ */ Q.jsx("span", { children: ie })
    ] }, ie)) })
  ] }), B = () => k.tradition !== "Shamanic" ? null : /* @__PURE__ */ Q.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ Q.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ Q.jsx("div", { className: "totem-grid", children: _D.map((ie) => /* @__PURE__ */ Q.jsxs(
      "article",
      {
        className: `totem-card ${k.totem === ie.id ? "selected" : ""}`,
        onClick: () => Y({ totem: ie.id }),
        children: [
          /* @__PURE__ */ Q.jsx("h5", { children: ie.name }),
          /* @__PURE__ */ Q.jsx("p", { children: ie.description }),
          /* @__PURE__ */ Q.jsx("ul", { children: ie.notes.map((Me) => /* @__PURE__ */ Q.jsx("li", { children: Me }, Me)) })
        ]
      },
      ie.id
    )) })
  ] }), ue = () => {
    if (!k.type)
      return /* @__PURE__ */ Q.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (k.type === "Full Magician" || k.type === "Aspected Magician") {
      if (!k.tradition)
        return /* @__PURE__ */ Q.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (k.tradition === "Shamanic" && !k.totem)
        return /* @__PURE__ */ Q.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ Q.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ Q.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ Q.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ Q.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ Q.jsxs("span", { children: [
        "Priority ",
        ye || "—",
        " ",
        Oe != null && Oe.summary ? `— ${Oe.summary}` : ""
      ] })
    ] }),
    Z(),
    Re(),
    B(),
    ue(),
    /* @__PURE__ */ Q.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ Q.jsxs("small", { children: [
      "Edition: ",
      oe.label
    ] }) })
  ] });
}
function OD() {
  const [F, k] = Dt.useState(null);
  return Dt.useEffect(() => {
    k(document.getElementById("priority-assignment-react-root"));
  }, []), F ? Km.createPortal(/* @__PURE__ */ Q.jsx(ED, {}), F) : null;
}
function MD() {
  const [F, k] = Dt.useState(null), [D, we] = Dt.useState(""), [oe, ye] = Dt.useState(null);
  return Dt.useEffect(() => {
    k(document.getElementById("metatype-selection-react-root"));
  }, []), Dt.useEffect(() => {
    var Y;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const Oe = () => {
      var Z, Re;
      we(((Z = g.getMetatypePriority) == null ? void 0 : Z.call(g)) ?? ""), ye(((Re = g.getMetatypeSelection) == null ? void 0 : Re.call(g)) ?? null);
    };
    return Oe(), (Y = g.subscribeMetatypeState) == null || Y.call(g, Oe), () => {
      var Z;
      (Z = g.unsubscribeMetatypeState) == null || Z.call(g, Oe);
    };
  }, []), F ? Km.createPortal(
    /* @__PURE__ */ Q.jsx(
      wD,
      {
        priority: D,
        selectedMetatype: oe,
        onSelect: (g) => {
          var Oe, Y;
          ye(g), (Y = (Oe = window.ShadowmasterLegacyApp) == null ? void 0 : Oe.setMetatypeSelection) == null || Y.call(Oe, g);
        }
      }
    ),
    F
  ) : null;
}
function LD() {
  const [F, k] = Dt.useState(null), [D, we] = Dt.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return Dt.useEffect(() => {
    k(document.getElementById("magical-abilities-react-root"));
  }, []), Dt.useEffect(() => {
    var g;
    const oe = window.ShadowmasterLegacyApp;
    if (!oe) return;
    const ye = () => {
      var Y;
      const Oe = (Y = oe.getMagicState) == null ? void 0 : Y.call(oe);
      Oe && we({
        priority: Oe.priority || "",
        type: Oe.type || null,
        tradition: Oe.tradition || null,
        totem: Oe.totem || null
      });
    };
    return ye(), (g = oe.subscribeMagicState) == null || g.call(oe, ye), () => {
      var Oe;
      (Oe = oe.unsubscribeMagicState) == null || Oe.call(oe, ye);
    };
  }, []), F ? Km.createPortal(
    /* @__PURE__ */ Q.jsx(
      kD,
      {
        priority: D.priority,
        selection: { type: D.type, tradition: D.tradition, totem: D.totem },
        onChange: (oe) => {
          var ye, g;
          (g = (ye = window.ShadowmasterLegacyApp) == null ? void 0 : ye.setMagicState) == null || g.call(ye, oe);
        }
      }
    ),
    F
  ) : null;
}
function ND() {
  const { activeEdition: F, isLoading: k, error: D, characterCreationData: we } = Xm();
  let oe = "· data pending";
  return k ? oe = "· loading edition data…" : D ? oe = `· failed to load data: ${D}` : we && (oe = "· edition data loaded"), /* @__PURE__ */ Q.jsxs(Q.Fragment, { children: [
    /* @__PURE__ */ Q.jsx("div", { className: "react-banner", "data-active-edition": F.key, children: /* @__PURE__ */ Q.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ Q.jsx("strong", { children: F.label }),
      " ",
      oe
    ] }) }),
    /* @__PURE__ */ Q.jsx(OD, {}),
    /* @__PURE__ */ Q.jsx(MD, {}),
    /* @__PURE__ */ Q.jsx(LD, {})
  ] });
}
const zD = document.getElementById("shadowmaster-react-root"), AD = zD ?? UD();
function UD() {
  const F = document.createElement("div");
  return F.id = "shadowmaster-react-root", F.dataset.controller = "react-shell", F.style.display = "contents", document.body.appendChild(F), F;
}
function jD() {
  return Dt.useEffect(() => {
    var F, k, D;
    (F = window.ShadowmasterLegacyApp) != null && F.initialize && !((D = (k = window.ShadowmasterLegacyApp).isInitialized) != null && D.call(k)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ Q.jsx(Dt.StrictMode, { children: /* @__PURE__ */ Q.jsx(cD, { children: /* @__PURE__ */ Q.jsx(ND, {}) }) });
}
const FD = SE(AD);
FD.render(/* @__PURE__ */ Q.jsx(jD, {}));
