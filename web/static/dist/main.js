var SE = { exports: {} }, Zp = {}, EE = { exports: {} }, xt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rT;
function ak() {
  if (rT) return xt;
  rT = 1;
  var N = Symbol.for("react.element"), x = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), ue = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), ee = Symbol.for("react.provider"), g = Symbol.for("react.context"), ye = Symbol.for("react.forward_ref"), Y = Symbol.for("react.suspense"), W = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), V = Symbol.iterator;
  function de(D) {
    return D === null || typeof D != "object" ? null : (D = V && D[V] || D["@@iterator"], typeof D == "function" ? D : null);
  }
  var re = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ce = Object.assign, Ne = {};
  function Ze(D, $, Ke) {
    this.props = D, this.context = $, this.refs = Ne, this.updater = Ke || re;
  }
  Ze.prototype.isReactComponent = {}, Ze.prototype.setState = function(D, $) {
    if (typeof D != "object" && typeof D != "function" && D != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, D, $, "setState");
  }, Ze.prototype.forceUpdate = function(D) {
    this.updater.enqueueForceUpdate(this, D, "forceUpdate");
  };
  function Qt() {
  }
  Qt.prototype = Ze.prototype;
  function at(D, $, Ke) {
    this.props = D, this.context = $, this.refs = Ne, this.updater = Ke || re;
  }
  var We = at.prototype = new Qt();
  We.constructor = at, ce(We, Ze.prototype), We.isPureReactComponent = !0;
  var fe = Array.isArray, Z = Object.prototype.hasOwnProperty, Ae = { current: null }, he = { key: !0, ref: !0, __self: !0, __source: !0 };
  function it(D, $, Ke) {
    var Ge, ht = {}, ft = null, st = null;
    if ($ != null) for (Ge in $.ref !== void 0 && (st = $.ref), $.key !== void 0 && (ft = "" + $.key), $) Z.call($, Ge) && !he.hasOwnProperty(Ge) && (ht[Ge] = $[Ge]);
    var dt = arguments.length - 2;
    if (dt === 1) ht.children = Ke;
    else if (1 < dt) {
      for (var mt = Array(dt), $t = 0; $t < dt; $t++) mt[$t] = arguments[$t + 2];
      ht.children = mt;
    }
    if (D && D.defaultProps) for (Ge in dt = D.defaultProps, dt) ht[Ge] === void 0 && (ht[Ge] = dt[Ge]);
    return { $$typeof: N, type: D, key: ft, ref: st, props: ht, _owner: Ae.current };
  }
  function Rt(D, $) {
    return { $$typeof: N, type: D.type, key: $, ref: D.ref, props: D.props, _owner: D._owner };
  }
  function St(D) {
    return typeof D == "object" && D !== null && D.$$typeof === N;
  }
  function Wt(D) {
    var $ = { "=": "=0", ":": "=2" };
    return "$" + D.replace(/[=:]/g, function(Ke) {
      return $[Ke];
    });
  }
  var wt = /\/+/g;
  function He(D, $) {
    return typeof D == "object" && D !== null && D.key != null ? Wt("" + D.key) : $.toString(36);
  }
  function At(D, $, Ke, Ge, ht) {
    var ft = typeof D;
    (ft === "undefined" || ft === "boolean") && (D = null);
    var st = !1;
    if (D === null) st = !0;
    else switch (ft) {
      case "string":
      case "number":
        st = !0;
        break;
      case "object":
        switch (D.$$typeof) {
          case N:
          case x:
            st = !0;
        }
    }
    if (st) return st = D, ht = ht(st), D = Ge === "" ? "." + He(st, 0) : Ge, fe(ht) ? (Ke = "", D != null && (Ke = D.replace(wt, "$&/") + "/"), At(ht, $, Ke, "", function($t) {
      return $t;
    })) : ht != null && (St(ht) && (ht = Rt(ht, Ke + (!ht.key || st && st.key === ht.key ? "" : ("" + ht.key).replace(wt, "$&/") + "/") + D)), $.push(ht)), 1;
    if (st = 0, Ge = Ge === "" ? "." : Ge + ":", fe(D)) for (var dt = 0; dt < D.length; dt++) {
      ft = D[dt];
      var mt = Ge + He(ft, dt);
      st += At(ft, $, Ke, mt, ht);
    }
    else if (mt = de(D), typeof mt == "function") for (D = mt.call(D), dt = 0; !(ft = D.next()).done; ) ft = ft.value, mt = Ge + He(ft, dt++), st += At(ft, $, Ke, mt, ht);
    else if (ft === "object") throw $ = String(D), Error("Objects are not valid as a React child (found: " + ($ === "[object Object]" ? "object with keys {" + Object.keys(D).join(", ") + "}" : $) + "). If you meant to render a collection of children, use an array instead.");
    return st;
  }
  function bt(D, $, Ke) {
    if (D == null) return D;
    var Ge = [], ht = 0;
    return At(D, Ge, "", "", function(ft) {
      return $.call(Ke, ft, ht++);
    }), Ge;
  }
  function Nt(D) {
    if (D._status === -1) {
      var $ = D._result;
      $ = $(), $.then(function(Ke) {
        (D._status === 0 || D._status === -1) && (D._status = 1, D._result = Ke);
      }, function(Ke) {
        (D._status === 0 || D._status === -1) && (D._status = 2, D._result = Ke);
      }), D._status === -1 && (D._status = 0, D._result = $);
    }
    if (D._status === 1) return D._result.default;
    throw D._result;
  }
  var Me = { current: null }, oe = { transition: null }, se = { ReactCurrentDispatcher: Me, ReactCurrentBatchConfig: oe, ReactCurrentOwner: Ae };
  function ie() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return xt.Children = { map: bt, forEach: function(D, $, Ke) {
    bt(D, function() {
      $.apply(this, arguments);
    }, Ke);
  }, count: function(D) {
    var $ = 0;
    return bt(D, function() {
      $++;
    }), $;
  }, toArray: function(D) {
    return bt(D, function($) {
      return $;
    }) || [];
  }, only: function(D) {
    if (!St(D)) throw Error("React.Children.only expected to receive a single React element child.");
    return D;
  } }, xt.Component = Ze, xt.Fragment = w, xt.Profiler = ae, xt.PureComponent = at, xt.StrictMode = ue, xt.Suspense = Y, xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = se, xt.act = ie, xt.cloneElement = function(D, $, Ke) {
    if (D == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + D + ".");
    var Ge = ce({}, D.props), ht = D.key, ft = D.ref, st = D._owner;
    if ($ != null) {
      if ($.ref !== void 0 && (ft = $.ref, st = Ae.current), $.key !== void 0 && (ht = "" + $.key), D.type && D.type.defaultProps) var dt = D.type.defaultProps;
      for (mt in $) Z.call($, mt) && !he.hasOwnProperty(mt) && (Ge[mt] = $[mt] === void 0 && dt !== void 0 ? dt[mt] : $[mt]);
    }
    var mt = arguments.length - 2;
    if (mt === 1) Ge.children = Ke;
    else if (1 < mt) {
      dt = Array(mt);
      for (var $t = 0; $t < mt; $t++) dt[$t] = arguments[$t + 2];
      Ge.children = dt;
    }
    return { $$typeof: N, type: D.type, key: ht, ref: ft, props: Ge, _owner: st };
  }, xt.createContext = function(D) {
    return D = { $$typeof: g, _currentValue: D, _currentValue2: D, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, D.Provider = { $$typeof: ee, _context: D }, D.Consumer = D;
  }, xt.createElement = it, xt.createFactory = function(D) {
    var $ = it.bind(null, D);
    return $.type = D, $;
  }, xt.createRef = function() {
    return { current: null };
  }, xt.forwardRef = function(D) {
    return { $$typeof: ye, render: D };
  }, xt.isValidElement = St, xt.lazy = function(D) {
    return { $$typeof: Re, _payload: { _status: -1, _result: D }, _init: Nt };
  }, xt.memo = function(D, $) {
    return { $$typeof: W, type: D, compare: $ === void 0 ? null : $ };
  }, xt.startTransition = function(D) {
    var $ = oe.transition;
    oe.transition = {};
    try {
      D();
    } finally {
      oe.transition = $;
    }
  }, xt.unstable_act = ie, xt.useCallback = function(D, $) {
    return Me.current.useCallback(D, $);
  }, xt.useContext = function(D) {
    return Me.current.useContext(D);
  }, xt.useDebugValue = function() {
  }, xt.useDeferredValue = function(D) {
    return Me.current.useDeferredValue(D);
  }, xt.useEffect = function(D, $) {
    return Me.current.useEffect(D, $);
  }, xt.useId = function() {
    return Me.current.useId();
  }, xt.useImperativeHandle = function(D, $, Ke) {
    return Me.current.useImperativeHandle(D, $, Ke);
  }, xt.useInsertionEffect = function(D, $) {
    return Me.current.useInsertionEffect(D, $);
  }, xt.useLayoutEffect = function(D, $) {
    return Me.current.useLayoutEffect(D, $);
  }, xt.useMemo = function(D, $) {
    return Me.current.useMemo(D, $);
  }, xt.useReducer = function(D, $, Ke) {
    return Me.current.useReducer(D, $, Ke);
  }, xt.useRef = function(D) {
    return Me.current.useRef(D);
  }, xt.useState = function(D) {
    return Me.current.useState(D);
  }, xt.useSyncExternalStore = function(D, $, Ke) {
    return Me.current.useSyncExternalStore(D, $, Ke);
  }, xt.useTransition = function() {
    return Me.current.useTransition();
  }, xt.version = "18.3.1", xt;
}
var nv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
nv.exports;
var aT;
function ik() {
  return aT || (aT = 1, function(N, x) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var w = "18.3.1", ue = Symbol.for("react.element"), ae = Symbol.for("react.portal"), ee = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), ye = Symbol.for("react.profiler"), Y = Symbol.for("react.provider"), W = Symbol.for("react.context"), Re = Symbol.for("react.forward_ref"), V = Symbol.for("react.suspense"), de = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), ce = Symbol.for("react.lazy"), Ne = Symbol.for("react.offscreen"), Ze = Symbol.iterator, Qt = "@@iterator";
      function at(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = Ze && h[Ze] || h[Qt];
        return typeof C == "function" ? C : null;
      }
      var We = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, fe = {
        transition: null
      }, Z = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Ae = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, he = {}, it = null;
      function Rt(h) {
        it = h;
      }
      he.setExtraStackFrame = function(h) {
        it = h;
      }, he.getCurrentStack = null, he.getStackAddendum = function() {
        var h = "";
        it && (h += it);
        var C = he.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var St = !1, Wt = !1, wt = !1, He = !1, At = !1, bt = {
        ReactCurrentDispatcher: We,
        ReactCurrentBatchConfig: fe,
        ReactCurrentOwner: Ae
      };
      bt.ReactDebugCurrentFrame = he, bt.ReactCurrentActQueue = Z;
      function Nt(h) {
        {
          for (var C = arguments.length, j = new Array(C > 1 ? C - 1 : 0), P = 1; P < C; P++)
            j[P - 1] = arguments[P];
          oe("warn", h, j);
        }
      }
      function Me(h) {
        {
          for (var C = arguments.length, j = new Array(C > 1 ? C - 1 : 0), P = 1; P < C; P++)
            j[P - 1] = arguments[P];
          oe("error", h, j);
        }
      }
      function oe(h, C, j) {
        {
          var P = bt.ReactDebugCurrentFrame, le = P.getStackAddendum();
          le !== "" && (C += "%s", j = j.concat([le]));
          var Be = j.map(function(me) {
            return String(me);
          });
          Be.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Be);
        }
      }
      var se = {};
      function ie(h, C) {
        {
          var j = h.constructor, P = j && (j.displayName || j.name) || "ReactClass", le = P + "." + C;
          if (se[le])
            return;
          Me("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, P), se[le] = !0;
        }
      }
      var D = {
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
        enqueueForceUpdate: function(h, C, j) {
          ie(h, "forceUpdate");
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
        enqueueReplaceState: function(h, C, j, P) {
          ie(h, "replaceState");
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
        enqueueSetState: function(h, C, j, P) {
          ie(h, "setState");
        }
      }, $ = Object.assign, Ke = {};
      Object.freeze(Ke);
      function Ge(h, C, j) {
        this.props = h, this.context = C, this.refs = Ke, this.updater = j || D;
      }
      Ge.prototype.isReactComponent = {}, Ge.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, Ge.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var ht = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, ft = function(h, C) {
          Object.defineProperty(Ge.prototype, h, {
            get: function() {
              Nt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var st in ht)
          ht.hasOwnProperty(st) && ft(st, ht[st]);
      }
      function dt() {
      }
      dt.prototype = Ge.prototype;
      function mt(h, C, j) {
        this.props = h, this.context = C, this.refs = Ke, this.updater = j || D;
      }
      var $t = mt.prototype = new dt();
      $t.constructor = mt, $($t, Ge.prototype), $t.isPureReactComponent = !0;
      function Nn() {
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
          var C = typeof Symbol == "function" && Symbol.toStringTag, j = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return j;
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
          return Me("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rr(h)), In(h);
      }
      function ci(h, C, j) {
        var P = h.displayName;
        if (P)
          return P;
        var le = C.displayName || C.name || "";
        return le !== "" ? j + "(" + le + ")" : j;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Me("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case ee:
            return "Fragment";
          case ae:
            return "Portal";
          case ye:
            return "Profiler";
          case g:
            return "StrictMode";
          case V:
            return "Suspense";
          case de:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case W:
              var C = h;
              return sa(C) + ".Consumer";
            case Y:
              var j = h;
              return sa(j._context) + ".Provider";
            case Re:
              return ci(h, h.render, "ForwardRef");
            case re:
              var P = h.displayName || null;
              return P !== null ? P : Kn(h.type) || "Memo";
            case ce: {
              var le = h, Be = le._payload, me = le._init;
              try {
                return Kn(me(Be));
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
      }, Sr, $a, Mn;
      Mn = {};
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
        var j = function() {
          Sr || (Sr = !0, Me("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        j.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: j,
          configurable: !0
        });
      }
      function fi(h, C) {
        var j = function() {
          $a || ($a = !0, Me("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        j.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: j,
          configurable: !0
        });
      }
      function pe(h) {
        if (typeof h.ref == "string" && Ae.current && h.__self && Ae.current.stateNode !== h.__self) {
          var C = Kn(Ae.current.type);
          Mn[C] || (Me('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Mn[C] = !0);
        }
      }
      var Ue = function(h, C, j, P, le, Be, me) {
        var $e = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: ue,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: j,
          props: me,
          // Record the component responsible for creating this element.
          _owner: Be
        };
        return $e._store = {}, Object.defineProperty($e._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty($e, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: P
        }), Object.defineProperty($e, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: le
        }), Object.freeze && (Object.freeze($e.props), Object.freeze($e)), $e;
      };
      function pt(h, C, j) {
        var P, le = {}, Be = null, me = null, $e = null, Ct = null;
        if (C != null) {
          Er(C) && (me = C.ref, pe(C)), ca(C) && ($r(C.key), Be = "" + C.key), $e = C.__self === void 0 ? null : C.__self, Ct = C.__source === void 0 ? null : C.__source;
          for (P in C)
            Tn.call(C, P) && !Yn.hasOwnProperty(P) && (le[P] = C[P]);
        }
        var Lt = arguments.length - 2;
        if (Lt === 1)
          le.children = j;
        else if (Lt > 1) {
          for (var un = Array(Lt), Xt = 0; Xt < Lt; Xt++)
            un[Xt] = arguments[Xt + 2];
          Object.freeze && Object.freeze(un), le.children = un;
        }
        if (h && h.defaultProps) {
          var vt = h.defaultProps;
          for (P in vt)
            le[P] === void 0 && (le[P] = vt[P]);
        }
        if (Be || me) {
          var Jt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Be && Qa(le, Jt), me && fi(le, Jt);
        }
        return Ue(h, Be, me, $e, Ct, Ae.current, le);
      }
      function Bt(h, C) {
        var j = Ue(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return j;
      }
      function rn(h, C, j) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var P, le = $({}, h.props), Be = h.key, me = h.ref, $e = h._self, Ct = h._source, Lt = h._owner;
        if (C != null) {
          Er(C) && (me = C.ref, Lt = Ae.current), ca(C) && ($r(C.key), Be = "" + C.key);
          var un;
          h.type && h.type.defaultProps && (un = h.type.defaultProps);
          for (P in C)
            Tn.call(C, P) && !Yn.hasOwnProperty(P) && (C[P] === void 0 && un !== void 0 ? le[P] = un[P] : le[P] = C[P]);
        }
        var Xt = arguments.length - 2;
        if (Xt === 1)
          le.children = j;
        else if (Xt > 1) {
          for (var vt = Array(Xt), Jt = 0; Jt < Xt; Jt++)
            vt[Jt] = arguments[Jt + 2];
          le.children = vt;
        }
        return Ue(h.type, Be, me, $e, Ct, Lt, le);
      }
      function hn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === ue;
      }
      var sn = ".", Xn = ":";
      function an(h) {
        var C = /[=:]/g, j = {
          "=": "=0",
          ":": "=2"
        }, P = h.replace(C, function(le) {
          return j[le];
        });
        return "$" + P;
      }
      var Gt = !1, qt = /\/+/g;
      function fa(h) {
        return h.replace(qt, "$&/");
      }
      function Cr(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), an("" + h.key)) : C.toString(36);
      }
      function wa(h, C, j, P, le) {
        var Be = typeof h;
        (Be === "undefined" || Be === "boolean") && (h = null);
        var me = !1;
        if (h === null)
          me = !0;
        else
          switch (Be) {
            case "string":
            case "number":
              me = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case ue:
                case ae:
                  me = !0;
              }
          }
        if (me) {
          var $e = h, Ct = le($e), Lt = P === "" ? sn + Cr($e, 0) : P;
          if (Rn(Ct)) {
            var un = "";
            Lt != null && (un = fa(Lt) + "/"), wa(Ct, C, un, "", function(Xf) {
              return Xf;
            });
          } else Ct != null && (hn(Ct) && (Ct.key && (!$e || $e.key !== Ct.key) && $r(Ct.key), Ct = Bt(
            Ct,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            j + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Ct.key && (!$e || $e.key !== Ct.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + Ct.key) + "/"
            ) : "") + Lt
          )), C.push(Ct));
          return 1;
        }
        var Xt, vt, Jt = 0, mn = P === "" ? sn : P + Xn;
        if (Rn(h))
          for (var Rl = 0; Rl < h.length; Rl++)
            Xt = h[Rl], vt = mn + Cr(Xt, Rl), Jt += wa(Xt, C, j, vt, le);
        else {
          var qo = at(h);
          if (typeof qo == "function") {
            var Bi = h;
            qo === Bi.entries && (Gt || Nt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Gt = !0);
            for (var Ko = qo.call(Bi), ou, Kf = 0; !(ou = Ko.next()).done; )
              Xt = ou.value, vt = mn + Cr(Xt, Kf++), Jt += wa(Xt, C, j, vt, le);
          } else if (Be === "object") {
            var sc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (sc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : sc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Jt;
      }
      function Hi(h, C, j) {
        if (h == null)
          return h;
        var P = [], le = 0;
        return wa(h, P, "", "", function(Be) {
          return C.call(j, Be, le++);
        }), P;
      }
      function Zl(h) {
        var C = 0;
        return Hi(h, function() {
          C++;
        }), C;
      }
      function eu(h, C, j) {
        Hi(h, function() {
          C.apply(this, arguments);
        }, j);
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
          $$typeof: W,
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
        var j = !1, P = !1, le = !1;
        {
          var Be = {
            $$typeof: W,
            _context: C
          };
          Object.defineProperties(Be, {
            Provider: {
              get: function() {
                return P || (P = !0, Me("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(me) {
                C.Provider = me;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(me) {
                C._currentValue = me;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(me) {
                C._currentValue2 = me;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(me) {
                C._threadCount = me;
              }
            },
            Consumer: {
              get: function() {
                return j || (j = !0, Me("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(me) {
                le || (Nt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", me), le = !0);
              }
            }
          }), C.Consumer = Be;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var _r = -1, kr = 0, ar = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var C = h._result, j = C();
          if (j.then(function(Be) {
            if (h._status === kr || h._status === _r) {
              var me = h;
              me._status = ar, me._result = Be;
            }
          }, function(Be) {
            if (h._status === kr || h._status === _r) {
              var me = h;
              me._status = di, me._result = Be;
            }
          }), h._status === _r) {
            var P = h;
            P._status = kr, P._result = j;
          }
        }
        if (h._status === ar) {
          var le = h._result;
          return le === void 0 && Me(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, le), "default" in le || Me(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, le), le.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, j = {
          $$typeof: ce,
          _payload: C,
          _init: Wa
        };
        {
          var P, le;
          Object.defineProperties(j, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return P;
              },
              set: function(Be) {
                Me("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), P = Be, Object.defineProperty(j, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return le;
              },
              set: function(Be) {
                Me("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), le = Be, Object.defineProperty(j, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return j;
      }
      function vi(h) {
        h != null && h.$$typeof === re ? Me("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Me("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Me("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Me("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: Re,
          render: h
        };
        {
          var j;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return j;
            },
            set: function(P) {
              j = P, !h.name && !h.displayName && (h.displayName = P);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function G(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === ee || h === ye || At || h === g || h === V || h === de || He || h === Ne || St || Wt || wt || typeof h == "object" && h !== null && (h.$$typeof === ce || h.$$typeof === re || h.$$typeof === Y || h.$$typeof === W || h.$$typeof === Re || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function ge(h, C) {
        G(h) || Me("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var j = {
          $$typeof: re,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var P;
          Object.defineProperty(j, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return P;
            },
            set: function(le) {
              P = le, !h.name && !h.displayName && (h.displayName = le);
            }
          });
        }
        return j;
      }
      function _e() {
        var h = We.current;
        return h === null && Me(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function lt(h) {
        var C = _e();
        if (h._context !== void 0) {
          var j = h._context;
          j.Consumer === h ? Me("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : j.Provider === h && Me("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function tt(h) {
        var C = _e();
        return C.useState(h);
      }
      function Et(h, C, j) {
        var P = _e();
        return P.useReducer(h, C, j);
      }
      function yt(h) {
        var C = _e();
        return C.useRef(h);
      }
      function wn(h, C) {
        var j = _e();
        return j.useEffect(h, C);
      }
      function ln(h, C) {
        var j = _e();
        return j.useInsertionEffect(h, C);
      }
      function cn(h, C) {
        var j = _e();
        return j.useLayoutEffect(h, C);
      }
      function ir(h, C) {
        var j = _e();
        return j.useCallback(h, C);
      }
      function Ga(h, C) {
        var j = _e();
        return j.useMemo(h, C);
      }
      function qa(h, C, j) {
        var P = _e();
        return P.useImperativeHandle(h, C, j);
      }
      function ut(h, C) {
        {
          var j = _e();
          return j.useDebugValue(h, C);
        }
      }
      function ct() {
        var h = _e();
        return h.useTransition();
      }
      function Ka(h) {
        var C = _e();
        return C.useDeferredValue(h);
      }
      function nu() {
        var h = _e();
        return h.useId();
      }
      function ru(h, C, j) {
        var P = _e();
        return P.useSyncExternalStore(h, C, j);
      }
      var hl = 0, Wu, ml, Qr, $o, Dr, uc, oc;
      function Gu() {
      }
      Gu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Wu = console.log, ml = console.info, Qr = console.warn, $o = console.error, Dr = console.group, uc = console.groupCollapsed, oc = console.groupEnd;
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
              log: $({}, h, {
                value: Wu
              }),
              info: $({}, h, {
                value: ml
              }),
              warn: $({}, h, {
                value: Qr
              }),
              error: $({}, h, {
                value: $o
              }),
              group: $({}, h, {
                value: Dr
              }),
              groupCollapsed: $({}, h, {
                value: uc
              }),
              groupEnd: $({}, h, {
                value: oc
              })
            });
          }
          hl < 0 && Me("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = bt.ReactCurrentDispatcher, Ja;
      function qu(h, C, j) {
        {
          if (Ja === void 0)
            try {
              throw Error();
            } catch (le) {
              var P = le.stack.trim().match(/\n( *(at )?)/);
              Ja = P && P[1] || "";
            }
          return `
` + Ja + h;
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
          var j = gl.get(h);
          if (j !== void 0)
            return j;
        }
        var P;
        au = !0;
        var le = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Be;
        Be = Xa.current, Xa.current = null, yl();
        try {
          if (C) {
            var me = function() {
              throw Error();
            };
            if (Object.defineProperty(me.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(me, []);
              } catch (mn) {
                P = mn;
              }
              Reflect.construct(h, [], me);
            } else {
              try {
                me.call();
              } catch (mn) {
                P = mn;
              }
              h.call(me.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (mn) {
              P = mn;
            }
            h();
          }
        } catch (mn) {
          if (mn && P && typeof mn.stack == "string") {
            for (var $e = mn.stack.split(`
`), Ct = P.stack.split(`
`), Lt = $e.length - 1, un = Ct.length - 1; Lt >= 1 && un >= 0 && $e[Lt] !== Ct[un]; )
              un--;
            for (; Lt >= 1 && un >= 0; Lt--, un--)
              if ($e[Lt] !== Ct[un]) {
                if (Lt !== 1 || un !== 1)
                  do
                    if (Lt--, un--, un < 0 || $e[Lt] !== Ct[un]) {
                      var Xt = `
` + $e[Lt].replace(" at new ", " at ");
                      return h.displayName && Xt.includes("<anonymous>") && (Xt = Xt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Xt), Xt;
                    }
                  while (Lt >= 1 && un >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = Be, da(), Error.prepareStackTrace = le;
        }
        var vt = h ? h.displayName || h.name : "", Jt = vt ? qu(vt) : "";
        return typeof h == "function" && gl.set(h, Jt), Jt;
      }
      function Pi(h, C, j) {
        return Xu(h, !1);
      }
      function Gf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, j) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Xu(h, Gf(h));
        if (typeof h == "string")
          return qu(h);
        switch (h) {
          case V:
            return qu("Suspense");
          case de:
            return qu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Re:
              return Pi(h.render);
            case re:
              return Vi(h.type, C, j);
            case ce: {
              var P = h, le = P._payload, Be = P._init;
              try {
                return Vi(Be(le), C, j);
              } catch {
              }
            }
          }
        return "";
      }
      var Ut = {}, Ju = bt.ReactDebugCurrentFrame;
      function Mt(h) {
        if (h) {
          var C = h._owner, j = Vi(h.type, h._source, C ? C.type : null);
          Ju.setExtraStackFrame(j);
        } else
          Ju.setExtraStackFrame(null);
      }
      function Qo(h, C, j, P, le) {
        {
          var Be = Function.call.bind(Tn);
          for (var me in h)
            if (Be(h, me)) {
              var $e = void 0;
              try {
                if (typeof h[me] != "function") {
                  var Ct = Error((P || "React class") + ": " + j + " type `" + me + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[me] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Ct.name = "Invariant Violation", Ct;
                }
                $e = h[me](C, me, P, j, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Lt) {
                $e = Lt;
              }
              $e && !($e instanceof Error) && (Mt(le), Me("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", P || "React class", j, me, typeof $e), Mt(null)), $e instanceof Error && !($e.message in Ut) && (Ut[$e.message] = !0, Mt(le), Me("Failed %s type: %s", j, $e.message), Mt(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, j = Vi(h.type, h._source, C ? C.type : null);
          Rt(j);
        } else
          Rt(null);
      }
      var et;
      et = !1;
      function Zu() {
        if (Ae.current) {
          var h = Kn(Ae.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function lr(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), j = h.lineNumber;
          return `

Check your code at ` + C + ":" + j + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? lr(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var C = Zu();
        if (!C) {
          var j = typeof h == "string" ? h : h.displayName || h.name;
          j && (C = `

Check the top-level render call using <` + j + ">.");
        }
        return C;
      }
      function fn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var j = yi(C);
          if (!Or[j]) {
            Or[j] = !0;
            var P = "";
            h && h._owner && h._owner !== Ae.current && (P = " It was passed a child from " + Kn(h._owner.type) + "."), hi(h), Me('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', j, P), hi(null);
          }
        }
      }
      function Kt(h, C) {
        if (typeof h == "object") {
          if (Rn(h))
            for (var j = 0; j < h.length; j++) {
              var P = h[j];
              hn(P) && fn(P, C);
            }
          else if (hn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var le = at(h);
            if (typeof le == "function" && le !== h.entries)
              for (var Be = le.call(h), me; !(me = Be.next()).done; )
                hn(me.value) && fn(me.value, C);
          }
        }
      }
      function Sl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var j;
          if (typeof C == "function")
            j = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === Re || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === re))
            j = C.propTypes;
          else
            return;
          if (j) {
            var P = Kn(C);
            Qo(j, h.props, "prop", P, h);
          } else if (C.PropTypes !== void 0 && !et) {
            et = !0;
            var le = Kn(C);
            Me("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", le || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Me("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function $n(h) {
        {
          for (var C = Object.keys(h.props), j = 0; j < C.length; j++) {
            var P = C[j];
            if (P !== "children" && P !== "key") {
              hi(h), Me("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", P), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Me("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Nr(h, C, j) {
        var P = G(h);
        if (!P) {
          var le = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (le += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Be = mi(C);
          Be ? le += Be : le += Zu();
          var me;
          h === null ? me = "null" : Rn(h) ? me = "array" : h !== void 0 && h.$$typeof === ue ? (me = "<" + (Kn(h.type) || "Unknown") + " />", le = " Did you accidentally export a JSX literal instead of a component?") : me = typeof h, Me("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", me, le);
        }
        var $e = pt.apply(this, arguments);
        if ($e == null)
          return $e;
        if (P)
          for (var Ct = 2; Ct < arguments.length; Ct++)
            Kt(arguments[Ct], h);
        return h === ee ? $n($e) : Sl($e), $e;
      }
      var xa = !1;
      function iu(h) {
        var C = Nr.bind(null, h);
        return C.type = h, xa || (xa = !0, Nt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Nt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Wo(h, C, j) {
        for (var P = rn.apply(this, arguments), le = 2; le < arguments.length; le++)
          Kt(arguments[le], P.type);
        return Sl(P), P;
      }
      function Go(h, C) {
        var j = fe.transition;
        fe.transition = {};
        var P = fe.transition;
        fe.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (fe.transition = j, j === null && P._updatedFibers) {
            var le = P._updatedFibers.size;
            le > 10 && Nt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), P._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function qf(h) {
        if (lu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), j = N && N[C];
            lu = j.call(N, "timers").setImmediate;
          } catch {
            lu = function(le) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && Me("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Be = new MessageChannel();
              Be.port1.onmessage = le, Be.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var ba = 0, Za = !1;
      function gi(h) {
        {
          var C = ba;
          ba++, Z.current === null && (Z.current = []);
          var j = Z.isBatchingLegacy, P;
          try {
            if (Z.isBatchingLegacy = !0, P = h(), !j && Z.didScheduleLegacyUpdate) {
              var le = Z.current;
              le !== null && (Z.didScheduleLegacyUpdate = !1, Cl(le));
            }
          } catch (vt) {
            throw _a(C), vt;
          } finally {
            Z.isBatchingLegacy = j;
          }
          if (P !== null && typeof P == "object" && typeof P.then == "function") {
            var Be = P, me = !1, $e = {
              then: function(vt, Jt) {
                me = !0, Be.then(function(mn) {
                  _a(C), ba === 0 ? eo(mn, vt, Jt) : vt(mn);
                }, function(mn) {
                  _a(C), Jt(mn);
                });
              }
            };
            return !Za && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              me || (Za = !0, Me("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), $e;
          } else {
            var Ct = P;
            if (_a(C), ba === 0) {
              var Lt = Z.current;
              Lt !== null && (Cl(Lt), Z.current = null);
              var un = {
                then: function(vt, Jt) {
                  Z.current === null ? (Z.current = [], eo(Ct, vt, Jt)) : vt(Ct);
                }
              };
              return un;
            } else {
              var Xt = {
                then: function(vt, Jt) {
                  vt(Ct);
                }
              };
              return Xt;
            }
          }
        }
      }
      function _a(h) {
        h !== ba - 1 && Me("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function eo(h, C, j) {
        {
          var P = Z.current;
          if (P !== null)
            try {
              Cl(P), qf(function() {
                P.length === 0 ? (Z.current = null, C(h)) : eo(h, C, j);
              });
            } catch (le) {
              j(le);
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
              var j = h[C];
              do
                j = j(!0);
              while (j !== null);
            }
            h.length = 0;
          } catch (P) {
            throw h = h.slice(C + 1), P;
          } finally {
            to = !1;
          }
        }
      }
      var uu = Nr, no = Wo, ro = iu, ei = {
        map: Hi,
        forEach: eu,
        count: Zl,
        toArray: pl,
        only: vl
      };
      x.Children = ei, x.Component = Ge, x.Fragment = ee, x.Profiler = ye, x.PureComponent = mt, x.StrictMode = g, x.Suspense = V, x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = bt, x.act = gi, x.cloneElement = no, x.createContext = tu, x.createElement = uu, x.createFactory = ro, x.createRef = Nn, x.forwardRef = vi, x.isValidElement = hn, x.lazy = pi, x.memo = ge, x.startTransition = Go, x.unstable_act = gi, x.useCallback = ir, x.useContext = lt, x.useDebugValue = ut, x.useDeferredValue = Ka, x.useEffect = wn, x.useId = nu, x.useImperativeHandle = qa, x.useInsertionEffect = ln, x.useLayoutEffect = cn, x.useMemo = Ga, x.useReducer = Et, x.useRef = yt, x.useState = tt, x.useSyncExternalStore = ru, x.useTransition = ct, x.version = w, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(nv, nv.exports)), nv.exports;
}
process.env.NODE_ENV === "production" ? EE.exports = ak() : EE.exports = ik();
var Le = EE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var iT;
function lk() {
  if (iT) return Zp;
  iT = 1;
  var N = Le, x = Symbol.for("react.element"), w = Symbol.for("react.fragment"), ue = Object.prototype.hasOwnProperty, ae = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(ye, Y, W) {
    var Re, V = {}, de = null, re = null;
    W !== void 0 && (de = "" + W), Y.key !== void 0 && (de = "" + Y.key), Y.ref !== void 0 && (re = Y.ref);
    for (Re in Y) ue.call(Y, Re) && !ee.hasOwnProperty(Re) && (V[Re] = Y[Re]);
    if (ye && ye.defaultProps) for (Re in Y = ye.defaultProps, Y) V[Re] === void 0 && (V[Re] = Y[Re]);
    return { $$typeof: x, type: ye, key: de, ref: re, props: V, _owner: ae.current };
  }
  return Zp.Fragment = w, Zp.jsx = g, Zp.jsxs = g, Zp;
}
var ev = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lT;
function uk() {
  return lT || (lT = 1, process.env.NODE_ENV !== "production" && function() {
    var N = Le, x = Symbol.for("react.element"), w = Symbol.for("react.portal"), ue = Symbol.for("react.fragment"), ae = Symbol.for("react.strict_mode"), ee = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), ye = Symbol.for("react.context"), Y = Symbol.for("react.forward_ref"), W = Symbol.for("react.suspense"), Re = Symbol.for("react.suspense_list"), V = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), re = Symbol.for("react.offscreen"), ce = Symbol.iterator, Ne = "@@iterator";
    function Ze(R) {
      if (R === null || typeof R != "object")
        return null;
      var G = ce && R[ce] || R[Ne];
      return typeof G == "function" ? G : null;
    }
    var Qt = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function at(R) {
      {
        for (var G = arguments.length, ge = new Array(G > 1 ? G - 1 : 0), _e = 1; _e < G; _e++)
          ge[_e - 1] = arguments[_e];
        We("error", R, ge);
      }
    }
    function We(R, G, ge) {
      {
        var _e = Qt.ReactDebugCurrentFrame, lt = _e.getStackAddendum();
        lt !== "" && (G += "%s", ge = ge.concat([lt]));
        var tt = ge.map(function(Et) {
          return String(Et);
        });
        tt.unshift("Warning: " + G), Function.prototype.apply.call(console[R], console, tt);
      }
    }
    var fe = !1, Z = !1, Ae = !1, he = !1, it = !1, Rt;
    Rt = Symbol.for("react.module.reference");
    function St(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === ue || R === ee || it || R === ae || R === W || R === Re || he || R === re || fe || Z || Ae || typeof R == "object" && R !== null && (R.$$typeof === de || R.$$typeof === V || R.$$typeof === g || R.$$typeof === ye || R.$$typeof === Y || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Rt || R.getModuleId !== void 0));
    }
    function Wt(R, G, ge) {
      var _e = R.displayName;
      if (_e)
        return _e;
      var lt = G.displayName || G.name || "";
      return lt !== "" ? ge + "(" + lt + ")" : ge;
    }
    function wt(R) {
      return R.displayName || "Context";
    }
    function He(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && at("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case ue:
          return "Fragment";
        case w:
          return "Portal";
        case ee:
          return "Profiler";
        case ae:
          return "StrictMode";
        case W:
          return "Suspense";
        case Re:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case ye:
            var G = R;
            return wt(G) + ".Consumer";
          case g:
            var ge = R;
            return wt(ge._context) + ".Provider";
          case Y:
            return Wt(R, R.render, "ForwardRef");
          case V:
            var _e = R.displayName || null;
            return _e !== null ? _e : He(R.type) || "Memo";
          case de: {
            var lt = R, tt = lt._payload, Et = lt._init;
            try {
              return He(Et(tt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var At = Object.assign, bt = 0, Nt, Me, oe, se, ie, D, $;
    function Ke() {
    }
    Ke.__reactDisabledLog = !0;
    function Ge() {
      {
        if (bt === 0) {
          Nt = console.log, Me = console.info, oe = console.warn, se = console.error, ie = console.group, D = console.groupCollapsed, $ = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Ke,
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
        bt++;
      }
    }
    function ht() {
      {
        if (bt--, bt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: At({}, R, {
              value: Nt
            }),
            info: At({}, R, {
              value: Me
            }),
            warn: At({}, R, {
              value: oe
            }),
            error: At({}, R, {
              value: se
            }),
            group: At({}, R, {
              value: ie
            }),
            groupCollapsed: At({}, R, {
              value: D
            }),
            groupEnd: At({}, R, {
              value: $
            })
          });
        }
        bt < 0 && at("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ft = Qt.ReactCurrentDispatcher, st;
    function dt(R, G, ge) {
      {
        if (st === void 0)
          try {
            throw Error();
          } catch (lt) {
            var _e = lt.stack.trim().match(/\n( *(at )?)/);
            st = _e && _e[1] || "";
          }
        return `
` + st + R;
      }
    }
    var mt = !1, $t;
    {
      var Nn = typeof WeakMap == "function" ? WeakMap : Map;
      $t = new Nn();
    }
    function br(R, G) {
      if (!R || mt)
        return "";
      {
        var ge = $t.get(R);
        if (ge !== void 0)
          return ge;
      }
      var _e;
      mt = !0;
      var lt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var tt;
      tt = ft.current, ft.current = null, Ge();
      try {
        if (G) {
          var Et = function() {
            throw Error();
          };
          if (Object.defineProperty(Et.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Et, []);
            } catch (ut) {
              _e = ut;
            }
            Reflect.construct(R, [], Et);
          } else {
            try {
              Et.call();
            } catch (ut) {
              _e = ut;
            }
            R.call(Et.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (ut) {
            _e = ut;
          }
          R();
        }
      } catch (ut) {
        if (ut && _e && typeof ut.stack == "string") {
          for (var yt = ut.stack.split(`
`), wn = _e.stack.split(`
`), ln = yt.length - 1, cn = wn.length - 1; ln >= 1 && cn >= 0 && yt[ln] !== wn[cn]; )
            cn--;
          for (; ln >= 1 && cn >= 0; ln--, cn--)
            if (yt[ln] !== wn[cn]) {
              if (ln !== 1 || cn !== 1)
                do
                  if (ln--, cn--, cn < 0 || yt[ln] !== wn[cn]) {
                    var ir = `
` + yt[ln].replace(" at new ", " at ");
                    return R.displayName && ir.includes("<anonymous>") && (ir = ir.replace("<anonymous>", R.displayName)), typeof R == "function" && $t.set(R, ir), ir;
                  }
                while (ln >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        mt = !1, ft.current = tt, ht(), Error.prepareStackTrace = lt;
      }
      var Ga = R ? R.displayName || R.name : "", qa = Ga ? dt(Ga) : "";
      return typeof R == "function" && $t.set(R, qa), qa;
    }
    function Rn(R, G, ge) {
      return br(R, !1);
    }
    function rr(R) {
      var G = R.prototype;
      return !!(G && G.isReactComponent);
    }
    function Bn(R, G, ge) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return br(R, rr(R));
      if (typeof R == "string")
        return dt(R);
      switch (R) {
        case W:
          return dt("Suspense");
        case Re:
          return dt("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Y:
            return Rn(R.render);
          case V:
            return Bn(R.type, G, ge);
          case de: {
            var _e = R, lt = _e._payload, tt = _e._init;
            try {
              return Bn(tt(lt), G, ge);
            } catch {
            }
          }
        }
      return "";
    }
    var In = Object.prototype.hasOwnProperty, $r = {}, ci = Qt.ReactDebugCurrentFrame;
    function sa(R) {
      if (R) {
        var G = R._owner, ge = Bn(R.type, R._source, G ? G.type : null);
        ci.setExtraStackFrame(ge);
      } else
        ci.setExtraStackFrame(null);
    }
    function Kn(R, G, ge, _e, lt) {
      {
        var tt = Function.call.bind(In);
        for (var Et in R)
          if (tt(R, Et)) {
            var yt = void 0;
            try {
              if (typeof R[Et] != "function") {
                var wn = Error((_e || "React class") + ": " + ge + " type `" + Et + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[Et] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw wn.name = "Invariant Violation", wn;
              }
              yt = R[Et](G, Et, _e, ge, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ln) {
              yt = ln;
            }
            yt && !(yt instanceof Error) && (sa(lt), at("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", _e || "React class", ge, Et, typeof yt), sa(null)), yt instanceof Error && !(yt.message in $r) && ($r[yt.message] = !0, sa(lt), at("Failed %s type: %s", ge, yt.message), sa(null));
          }
      }
    }
    var Tn = Array.isArray;
    function Yn(R) {
      return Tn(R);
    }
    function Sr(R) {
      {
        var G = typeof Symbol == "function" && Symbol.toStringTag, ge = G && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return ge;
      }
    }
    function $a(R) {
      try {
        return Mn(R), !1;
      } catch {
        return !0;
      }
    }
    function Mn(R) {
      return "" + R;
    }
    function Er(R) {
      if ($a(R))
        return at("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Sr(R)), Mn(R);
    }
    var ca = Qt.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, pe;
    function Ue(R) {
      if (In.call(R, "ref")) {
        var G = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (G && G.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function pt(R) {
      if (In.call(R, "key")) {
        var G = Object.getOwnPropertyDescriptor(R, "key").get;
        if (G && G.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Bt(R, G) {
      typeof R.ref == "string" && ca.current;
    }
    function rn(R, G) {
      {
        var ge = function() {
          fi || (fi = !0, at("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", G));
        };
        ge.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: ge,
          configurable: !0
        });
      }
    }
    function hn(R, G) {
      {
        var ge = function() {
          pe || (pe = !0, at("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", G));
        };
        ge.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: ge,
          configurable: !0
        });
      }
    }
    var sn = function(R, G, ge, _e, lt, tt, Et) {
      var yt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: x,
        // Built-in properties that belong on the element
        type: R,
        key: G,
        ref: ge,
        props: Et,
        // Record the component responsible for creating this element.
        _owner: tt
      };
      return yt._store = {}, Object.defineProperty(yt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(yt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: _e
      }), Object.defineProperty(yt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: lt
      }), Object.freeze && (Object.freeze(yt.props), Object.freeze(yt)), yt;
    };
    function Xn(R, G, ge, _e, lt) {
      {
        var tt, Et = {}, yt = null, wn = null;
        ge !== void 0 && (Er(ge), yt = "" + ge), pt(G) && (Er(G.key), yt = "" + G.key), Ue(G) && (wn = G.ref, Bt(G, lt));
        for (tt in G)
          In.call(G, tt) && !Qa.hasOwnProperty(tt) && (Et[tt] = G[tt]);
        if (R && R.defaultProps) {
          var ln = R.defaultProps;
          for (tt in ln)
            Et[tt] === void 0 && (Et[tt] = ln[tt]);
        }
        if (yt || wn) {
          var cn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          yt && rn(Et, cn), wn && hn(Et, cn);
        }
        return sn(R, yt, wn, lt, _e, ca.current, Et);
      }
    }
    var an = Qt.ReactCurrentOwner, Gt = Qt.ReactDebugCurrentFrame;
    function qt(R) {
      if (R) {
        var G = R._owner, ge = Bn(R.type, R._source, G ? G.type : null);
        Gt.setExtraStackFrame(ge);
      } else
        Gt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Cr(R) {
      return typeof R == "object" && R !== null && R.$$typeof === x;
    }
    function wa() {
      {
        if (an.current) {
          var R = He(an.current.type);
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
    var Zl = {};
    function eu(R) {
      {
        var G = wa();
        if (!G) {
          var ge = typeof R == "string" ? R : R.displayName || R.name;
          ge && (G = `

Check the top-level render call using <` + ge + ">.");
        }
        return G;
      }
    }
    function pl(R, G) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var ge = eu(G);
        if (Zl[ge])
          return;
        Zl[ge] = !0;
        var _e = "";
        R && R._owner && R._owner !== an.current && (_e = " It was passed a child from " + He(R._owner.type) + "."), qt(R), at('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ge, _e), qt(null);
      }
    }
    function vl(R, G) {
      {
        if (typeof R != "object")
          return;
        if (Yn(R))
          for (var ge = 0; ge < R.length; ge++) {
            var _e = R[ge];
            Cr(_e) && pl(_e, G);
          }
        else if (Cr(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var lt = Ze(R);
          if (typeof lt == "function" && lt !== R.entries)
            for (var tt = lt.call(R), Et; !(Et = tt.next()).done; )
              Cr(Et.value) && pl(Et.value, G);
        }
      }
    }
    function tu(R) {
      {
        var G = R.type;
        if (G == null || typeof G == "string")
          return;
        var ge;
        if (typeof G == "function")
          ge = G.propTypes;
        else if (typeof G == "object" && (G.$$typeof === Y || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        G.$$typeof === V))
          ge = G.propTypes;
        else
          return;
        if (ge) {
          var _e = He(G);
          Kn(ge, R.props, "prop", _e, R);
        } else if (G.PropTypes !== void 0 && !fa) {
          fa = !0;
          var lt = He(G);
          at("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", lt || "Unknown");
        }
        typeof G.getDefaultProps == "function" && !G.getDefaultProps.isReactClassApproved && at("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(R) {
      {
        for (var G = Object.keys(R.props), ge = 0; ge < G.length; ge++) {
          var _e = G[ge];
          if (_e !== "children" && _e !== "key") {
            qt(R), at("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", _e), qt(null);
            break;
          }
        }
        R.ref !== null && (qt(R), at("Invalid attribute `ref` supplied to `React.Fragment`."), qt(null));
      }
    }
    var kr = {};
    function ar(R, G, ge, _e, lt, tt) {
      {
        var Et = St(R);
        if (!Et) {
          var yt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (yt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var wn = Hi();
          wn ? yt += wn : yt += wa();
          var ln;
          R === null ? ln = "null" : Yn(R) ? ln = "array" : R !== void 0 && R.$$typeof === x ? (ln = "<" + (He(R.type) || "Unknown") + " />", yt = " Did you accidentally export a JSX literal instead of a component?") : ln = typeof R, at("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ln, yt);
        }
        var cn = Xn(R, G, ge, lt, tt);
        if (cn == null)
          return cn;
        if (Et) {
          var ir = G.children;
          if (ir !== void 0)
            if (_e)
              if (Yn(ir)) {
                for (var Ga = 0; Ga < ir.length; Ga++)
                  vl(ir[Ga], R);
                Object.freeze && Object.freeze(ir);
              } else
                at("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ir, R);
        }
        if (In.call(G, "key")) {
          var qa = He(R), ut = Object.keys(G).filter(function(nu) {
            return nu !== "key";
          }), ct = ut.length > 0 ? "{key: someKey, " + ut.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kr[qa + ct]) {
            var Ka = ut.length > 0 ? "{" + ut.join(": ..., ") + ": ...}" : "{}";
            at(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ct, qa, Ka, qa), kr[qa + ct] = !0;
          }
        }
        return R === ue ? _r(cn) : tu(cn), cn;
      }
    }
    function di(R, G, ge) {
      return ar(R, G, ge, !0);
    }
    function Wa(R, G, ge) {
      return ar(R, G, ge, !1);
    }
    var pi = Wa, vi = di;
    ev.Fragment = ue, ev.jsx = pi, ev.jsxs = vi;
  }()), ev;
}
process.env.NODE_ENV === "production" ? SE.exports = lk() : SE.exports = uk();
var O = SE.exports, CE = { exports: {} }, Ia = {}, Gm = { exports: {} }, mE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uT;
function ok() {
  return uT || (uT = 1, function(N) {
    function x(oe, se) {
      var ie = oe.length;
      oe.push(se);
      e: for (; 0 < ie; ) {
        var D = ie - 1 >>> 1, $ = oe[D];
        if (0 < ae($, se)) oe[D] = se, oe[ie] = $, ie = D;
        else break e;
      }
    }
    function w(oe) {
      return oe.length === 0 ? null : oe[0];
    }
    function ue(oe) {
      if (oe.length === 0) return null;
      var se = oe[0], ie = oe.pop();
      if (ie !== se) {
        oe[0] = ie;
        e: for (var D = 0, $ = oe.length, Ke = $ >>> 1; D < Ke; ) {
          var Ge = 2 * (D + 1) - 1, ht = oe[Ge], ft = Ge + 1, st = oe[ft];
          if (0 > ae(ht, ie)) ft < $ && 0 > ae(st, ht) ? (oe[D] = st, oe[ft] = ie, D = ft) : (oe[D] = ht, oe[Ge] = ie, D = Ge);
          else if (ft < $ && 0 > ae(st, ie)) oe[D] = st, oe[ft] = ie, D = ft;
          else break e;
        }
      }
      return se;
    }
    function ae(oe, se) {
      var ie = oe.sortIndex - se.sortIndex;
      return ie !== 0 ? ie : oe.id - se.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var ee = performance;
      N.unstable_now = function() {
        return ee.now();
      };
    } else {
      var g = Date, ye = g.now();
      N.unstable_now = function() {
        return g.now() - ye;
      };
    }
    var Y = [], W = [], Re = 1, V = null, de = 3, re = !1, ce = !1, Ne = !1, Ze = typeof setTimeout == "function" ? setTimeout : null, Qt = typeof clearTimeout == "function" ? clearTimeout : null, at = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function We(oe) {
      for (var se = w(W); se !== null; ) {
        if (se.callback === null) ue(W);
        else if (se.startTime <= oe) ue(W), se.sortIndex = se.expirationTime, x(Y, se);
        else break;
        se = w(W);
      }
    }
    function fe(oe) {
      if (Ne = !1, We(oe), !ce) if (w(Y) !== null) ce = !0, Nt(Z);
      else {
        var se = w(W);
        se !== null && Me(fe, se.startTime - oe);
      }
    }
    function Z(oe, se) {
      ce = !1, Ne && (Ne = !1, Qt(it), it = -1), re = !0;
      var ie = de;
      try {
        for (We(se), V = w(Y); V !== null && (!(V.expirationTime > se) || oe && !Wt()); ) {
          var D = V.callback;
          if (typeof D == "function") {
            V.callback = null, de = V.priorityLevel;
            var $ = D(V.expirationTime <= se);
            se = N.unstable_now(), typeof $ == "function" ? V.callback = $ : V === w(Y) && ue(Y), We(se);
          } else ue(Y);
          V = w(Y);
        }
        if (V !== null) var Ke = !0;
        else {
          var Ge = w(W);
          Ge !== null && Me(fe, Ge.startTime - se), Ke = !1;
        }
        return Ke;
      } finally {
        V = null, de = ie, re = !1;
      }
    }
    var Ae = !1, he = null, it = -1, Rt = 5, St = -1;
    function Wt() {
      return !(N.unstable_now() - St < Rt);
    }
    function wt() {
      if (he !== null) {
        var oe = N.unstable_now();
        St = oe;
        var se = !0;
        try {
          se = he(!0, oe);
        } finally {
          se ? He() : (Ae = !1, he = null);
        }
      } else Ae = !1;
    }
    var He;
    if (typeof at == "function") He = function() {
      at(wt);
    };
    else if (typeof MessageChannel < "u") {
      var At = new MessageChannel(), bt = At.port2;
      At.port1.onmessage = wt, He = function() {
        bt.postMessage(null);
      };
    } else He = function() {
      Ze(wt, 0);
    };
    function Nt(oe) {
      he = oe, Ae || (Ae = !0, He());
    }
    function Me(oe, se) {
      it = Ze(function() {
        oe(N.unstable_now());
      }, se);
    }
    N.unstable_IdlePriority = 5, N.unstable_ImmediatePriority = 1, N.unstable_LowPriority = 4, N.unstable_NormalPriority = 3, N.unstable_Profiling = null, N.unstable_UserBlockingPriority = 2, N.unstable_cancelCallback = function(oe) {
      oe.callback = null;
    }, N.unstable_continueExecution = function() {
      ce || re || (ce = !0, Nt(Z));
    }, N.unstable_forceFrameRate = function(oe) {
      0 > oe || 125 < oe ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Rt = 0 < oe ? Math.floor(1e3 / oe) : 5;
    }, N.unstable_getCurrentPriorityLevel = function() {
      return de;
    }, N.unstable_getFirstCallbackNode = function() {
      return w(Y);
    }, N.unstable_next = function(oe) {
      switch (de) {
        case 1:
        case 2:
        case 3:
          var se = 3;
          break;
        default:
          se = de;
      }
      var ie = de;
      de = se;
      try {
        return oe();
      } finally {
        de = ie;
      }
    }, N.unstable_pauseExecution = function() {
    }, N.unstable_requestPaint = function() {
    }, N.unstable_runWithPriority = function(oe, se) {
      switch (oe) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          oe = 3;
      }
      var ie = de;
      de = oe;
      try {
        return se();
      } finally {
        de = ie;
      }
    }, N.unstable_scheduleCallback = function(oe, se, ie) {
      var D = N.unstable_now();
      switch (typeof ie == "object" && ie !== null ? (ie = ie.delay, ie = typeof ie == "number" && 0 < ie ? D + ie : D) : ie = D, oe) {
        case 1:
          var $ = -1;
          break;
        case 2:
          $ = 250;
          break;
        case 5:
          $ = 1073741823;
          break;
        case 4:
          $ = 1e4;
          break;
        default:
          $ = 5e3;
      }
      return $ = ie + $, oe = { id: Re++, callback: se, priorityLevel: oe, startTime: ie, expirationTime: $, sortIndex: -1 }, ie > D ? (oe.sortIndex = ie, x(W, oe), w(Y) === null && oe === w(W) && (Ne ? (Qt(it), it = -1) : Ne = !0, Me(fe, ie - D))) : (oe.sortIndex = $, x(Y, oe), ce || re || (ce = !0, Nt(Z))), oe;
    }, N.unstable_shouldYield = Wt, N.unstable_wrapCallback = function(oe) {
      var se = de;
      return function() {
        var ie = de;
        de = se;
        try {
          return oe.apply(this, arguments);
        } finally {
          de = ie;
        }
      };
    };
  }(mE)), mE;
}
var yE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oT;
function sk() {
  return oT || (oT = 1, function(N) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var x = !1, w = 5;
      function ue(pe, Ue) {
        var pt = pe.length;
        pe.push(Ue), g(pe, Ue, pt);
      }
      function ae(pe) {
        return pe.length === 0 ? null : pe[0];
      }
      function ee(pe) {
        if (pe.length === 0)
          return null;
        var Ue = pe[0], pt = pe.pop();
        return pt !== Ue && (pe[0] = pt, ye(pe, pt, 0)), Ue;
      }
      function g(pe, Ue, pt) {
        for (var Bt = pt; Bt > 0; ) {
          var rn = Bt - 1 >>> 1, hn = pe[rn];
          if (Y(hn, Ue) > 0)
            pe[rn] = Ue, pe[Bt] = hn, Bt = rn;
          else
            return;
        }
      }
      function ye(pe, Ue, pt) {
        for (var Bt = pt, rn = pe.length, hn = rn >>> 1; Bt < hn; ) {
          var sn = (Bt + 1) * 2 - 1, Xn = pe[sn], an = sn + 1, Gt = pe[an];
          if (Y(Xn, Ue) < 0)
            an < rn && Y(Gt, Xn) < 0 ? (pe[Bt] = Gt, pe[an] = Ue, Bt = an) : (pe[Bt] = Xn, pe[sn] = Ue, Bt = sn);
          else if (an < rn && Y(Gt, Ue) < 0)
            pe[Bt] = Gt, pe[an] = Ue, Bt = an;
          else
            return;
        }
      }
      function Y(pe, Ue) {
        var pt = pe.sortIndex - Ue.sortIndex;
        return pt !== 0 ? pt : pe.id - Ue.id;
      }
      var W = 1, Re = 2, V = 3, de = 4, re = 5;
      function ce(pe, Ue) {
      }
      var Ne = typeof performance == "object" && typeof performance.now == "function";
      if (Ne) {
        var Ze = performance;
        N.unstable_now = function() {
          return Ze.now();
        };
      } else {
        var Qt = Date, at = Qt.now();
        N.unstable_now = function() {
          return Qt.now() - at;
        };
      }
      var We = 1073741823, fe = -1, Z = 250, Ae = 5e3, he = 1e4, it = We, Rt = [], St = [], Wt = 1, wt = null, He = V, At = !1, bt = !1, Nt = !1, Me = typeof setTimeout == "function" ? setTimeout : null, oe = typeof clearTimeout == "function" ? clearTimeout : null, se = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ie(pe) {
        for (var Ue = ae(St); Ue !== null; ) {
          if (Ue.callback === null)
            ee(St);
          else if (Ue.startTime <= pe)
            ee(St), Ue.sortIndex = Ue.expirationTime, ue(Rt, Ue);
          else
            return;
          Ue = ae(St);
        }
      }
      function D(pe) {
        if (Nt = !1, ie(pe), !bt)
          if (ae(Rt) !== null)
            bt = !0, Mn($);
          else {
            var Ue = ae(St);
            Ue !== null && Er(D, Ue.startTime - pe);
          }
      }
      function $(pe, Ue) {
        bt = !1, Nt && (Nt = !1, ca()), At = !0;
        var pt = He;
        try {
          var Bt;
          if (!x) return Ke(pe, Ue);
        } finally {
          wt = null, He = pt, At = !1;
        }
      }
      function Ke(pe, Ue) {
        var pt = Ue;
        for (ie(pt), wt = ae(Rt); wt !== null && !(wt.expirationTime > pt && (!pe || ci())); ) {
          var Bt = wt.callback;
          if (typeof Bt == "function") {
            wt.callback = null, He = wt.priorityLevel;
            var rn = wt.expirationTime <= pt, hn = Bt(rn);
            pt = N.unstable_now(), typeof hn == "function" ? wt.callback = hn : wt === ae(Rt) && ee(Rt), ie(pt);
          } else
            ee(Rt);
          wt = ae(Rt);
        }
        if (wt !== null)
          return !0;
        var sn = ae(St);
        return sn !== null && Er(D, sn.startTime - pt), !1;
      }
      function Ge(pe, Ue) {
        switch (pe) {
          case W:
          case Re:
          case V:
          case de:
          case re:
            break;
          default:
            pe = V;
        }
        var pt = He;
        He = pe;
        try {
          return Ue();
        } finally {
          He = pt;
        }
      }
      function ht(pe) {
        var Ue;
        switch (He) {
          case W:
          case Re:
          case V:
            Ue = V;
            break;
          default:
            Ue = He;
            break;
        }
        var pt = He;
        He = Ue;
        try {
          return pe();
        } finally {
          He = pt;
        }
      }
      function ft(pe) {
        var Ue = He;
        return function() {
          var pt = He;
          He = Ue;
          try {
            return pe.apply(this, arguments);
          } finally {
            He = pt;
          }
        };
      }
      function st(pe, Ue, pt) {
        var Bt = N.unstable_now(), rn;
        if (typeof pt == "object" && pt !== null) {
          var hn = pt.delay;
          typeof hn == "number" && hn > 0 ? rn = Bt + hn : rn = Bt;
        } else
          rn = Bt;
        var sn;
        switch (pe) {
          case W:
            sn = fe;
            break;
          case Re:
            sn = Z;
            break;
          case re:
            sn = it;
            break;
          case de:
            sn = he;
            break;
          case V:
          default:
            sn = Ae;
            break;
        }
        var Xn = rn + sn, an = {
          id: Wt++,
          callback: Ue,
          priorityLevel: pe,
          startTime: rn,
          expirationTime: Xn,
          sortIndex: -1
        };
        return rn > Bt ? (an.sortIndex = rn, ue(St, an), ae(Rt) === null && an === ae(St) && (Nt ? ca() : Nt = !0, Er(D, rn - Bt))) : (an.sortIndex = Xn, ue(Rt, an), !bt && !At && (bt = !0, Mn($))), an;
      }
      function dt() {
      }
      function mt() {
        !bt && !At && (bt = !0, Mn($));
      }
      function $t() {
        return ae(Rt);
      }
      function Nn(pe) {
        pe.callback = null;
      }
      function br() {
        return He;
      }
      var Rn = !1, rr = null, Bn = -1, In = w, $r = -1;
      function ci() {
        var pe = N.unstable_now() - $r;
        return !(pe < In);
      }
      function sa() {
      }
      function Kn(pe) {
        if (pe < 0 || pe > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        pe > 0 ? In = Math.floor(1e3 / pe) : In = w;
      }
      var Tn = function() {
        if (rr !== null) {
          var pe = N.unstable_now();
          $r = pe;
          var Ue = !0, pt = !0;
          try {
            pt = rr(Ue, pe);
          } finally {
            pt ? Yn() : (Rn = !1, rr = null);
          }
        } else
          Rn = !1;
      }, Yn;
      if (typeof se == "function")
        Yn = function() {
          se(Tn);
        };
      else if (typeof MessageChannel < "u") {
        var Sr = new MessageChannel(), $a = Sr.port2;
        Sr.port1.onmessage = Tn, Yn = function() {
          $a.postMessage(null);
        };
      } else
        Yn = function() {
          Me(Tn, 0);
        };
      function Mn(pe) {
        rr = pe, Rn || (Rn = !0, Yn());
      }
      function Er(pe, Ue) {
        Bn = Me(function() {
          pe(N.unstable_now());
        }, Ue);
      }
      function ca() {
        oe(Bn), Bn = -1;
      }
      var Qa = sa, fi = null;
      N.unstable_IdlePriority = re, N.unstable_ImmediatePriority = W, N.unstable_LowPriority = de, N.unstable_NormalPriority = V, N.unstable_Profiling = fi, N.unstable_UserBlockingPriority = Re, N.unstable_cancelCallback = Nn, N.unstable_continueExecution = mt, N.unstable_forceFrameRate = Kn, N.unstable_getCurrentPriorityLevel = br, N.unstable_getFirstCallbackNode = $t, N.unstable_next = ht, N.unstable_pauseExecution = dt, N.unstable_requestPaint = Qa, N.unstable_runWithPriority = Ge, N.unstable_scheduleCallback = st, N.unstable_shouldYield = ci, N.unstable_wrapCallback = ft, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(yE)), yE;
}
var sT;
function vT() {
  return sT || (sT = 1, process.env.NODE_ENV === "production" ? Gm.exports = ok() : Gm.exports = sk()), Gm.exports;
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
var cT;
function ck() {
  if (cT) return Ia;
  cT = 1;
  var N = Le, x = vT();
  function w(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var ue = /* @__PURE__ */ new Set(), ae = {};
  function ee(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (ae[n] = r, n = 0; n < r.length; n++) ue.add(r[n]);
  }
  var ye = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Y = Object.prototype.hasOwnProperty, W = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Re = {}, V = {};
  function de(n) {
    return Y.call(V, n) ? !0 : Y.call(Re, n) ? !1 : W.test(n) ? V[n] = !0 : (Re[n] = !0, !1);
  }
  function re(n, r, l, o) {
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
  function ce(n, r, l, o) {
    if (r === null || typeof r > "u" || re(n, r, l, o)) return !0;
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
  function Ne(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var Ze = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Ze[n] = new Ne(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Ze[r] = new Ne(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Ze[n] = new Ne(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Ze[n] = new Ne(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Ze[n] = new Ne(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Ze[n] = new Ne(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Ze[n] = new Ne(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Ze[n] = new Ne(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Ze[n] = new Ne(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Qt = /[\-:]([a-z])/g;
  function at(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Qt,
      at
    );
    Ze[r] = new Ne(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Qt, at);
    Ze[r] = new Ne(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Qt, at);
    Ze[r] = new Ne(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Ze[n] = new Ne(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Ze.xlinkHref = new Ne("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Ze[n] = new Ne(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function We(n, r, l, o) {
    var c = Ze.hasOwnProperty(r) ? Ze[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ce(r, l, c, o) && (l = null), o || c === null ? de(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var fe = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Z = Symbol.for("react.element"), Ae = Symbol.for("react.portal"), he = Symbol.for("react.fragment"), it = Symbol.for("react.strict_mode"), Rt = Symbol.for("react.profiler"), St = Symbol.for("react.provider"), Wt = Symbol.for("react.context"), wt = Symbol.for("react.forward_ref"), He = Symbol.for("react.suspense"), At = Symbol.for("react.suspense_list"), bt = Symbol.for("react.memo"), Nt = Symbol.for("react.lazy"), Me = Symbol.for("react.offscreen"), oe = Symbol.iterator;
  function se(n) {
    return n === null || typeof n != "object" ? null : (n = oe && n[oe] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ie = Object.assign, D;
  function $(n) {
    if (D === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      D = r && r[1] || "";
    }
    return `
` + D + n;
  }
  var Ke = !1;
  function Ge(n, r) {
    if (!n || Ke) return "";
    Ke = !0;
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
        } catch (F) {
          var o = F;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (F) {
          o = F;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (F) {
          o = F;
        }
        n();
      }
    } catch (F) {
      if (F && o && typeof F.stack == "string") {
        for (var c = F.stack.split(`
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
      Ke = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? $(n) : "";
  }
  function ht(n) {
    switch (n.tag) {
      case 5:
        return $(n.type);
      case 16:
        return $("Lazy");
      case 13:
        return $("Suspense");
      case 19:
        return $("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Ge(n.type, !1), n;
      case 11:
        return n = Ge(n.type.render, !1), n;
      case 1:
        return n = Ge(n.type, !0), n;
      default:
        return "";
    }
  }
  function ft(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case he:
        return "Fragment";
      case Ae:
        return "Portal";
      case Rt:
        return "Profiler";
      case it:
        return "StrictMode";
      case He:
        return "Suspense";
      case At:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Wt:
        return (n.displayName || "Context") + ".Consumer";
      case St:
        return (n._context.displayName || "Context") + ".Provider";
      case wt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case bt:
        return r = n.displayName || null, r !== null ? r : ft(n.type) || "Memo";
      case Nt:
        r = n._payload, n = n._init;
        try {
          return ft(n(r));
        } catch {
        }
    }
    return null;
  }
  function st(n) {
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
        return ft(r);
      case 8:
        return r === it ? "StrictMode" : "Mode";
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
  function dt(n) {
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
  function mt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function $t(n) {
    var r = mt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
  function Nn(n) {
    n._valueTracker || (n._valueTracker = $t(n));
  }
  function br(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = mt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
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
    return ie({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Bn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = dt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function In(n, r) {
    r = r.checked, r != null && We(n, "checked", r, !1);
  }
  function $r(n, r) {
    In(n, r);
    var l = dt(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, dt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
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
      for (l = "" + dt(l), r = null, c = 0; c < n.length; c++) {
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
    if (r.dangerouslySetInnerHTML != null) throw Error(w(91));
    return ie({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Sr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(w(92));
        if (Kn(l)) {
          if (1 < l.length) throw Error(w(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: dt(l) };
  }
  function $a(n, r) {
    var l = dt(r.value), o = dt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Mn(n) {
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
  function pe(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Ue = {
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
  }, pt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ue).forEach(function(n) {
    pt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Ue[r] = Ue[n];
    });
  });
  function Bt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Ue.hasOwnProperty(n) && Ue[n] ? ("" + r).trim() : r + "px";
  }
  function rn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Bt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var hn = ie({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (hn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(w(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(w(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(w(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(w(62));
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
  var an = null;
  function Gt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var qt = null, fa = null, Cr = null;
  function wa(n) {
    if (n = Pe(n)) {
      if (typeof qt != "function") throw Error(w(280));
      var r = n.stateNode;
      r && (r = yn(r), qt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? Cr ? Cr.push(n) : Cr = [n] : fa = n;
  }
  function Zl() {
    if (fa) {
      var n = fa, r = Cr;
      if (Cr = fa = null, wa(n), r) for (n = 0; n < r.length; n++) wa(r[n]);
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
      vl = !1, (fa !== null || Cr !== null) && (pl(), Zl());
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
    if (l && typeof l != "function") throw Error(w(231, r, typeof l));
    return l;
  }
  var kr = !1;
  if (ye) try {
    var ar = {};
    Object.defineProperty(ar, "passive", { get: function() {
      kr = !0;
    } }), window.addEventListener("test", ar, ar), window.removeEventListener("test", ar, ar);
  } catch {
    kr = !1;
  }
  function di(n, r, l, o, c, d, m, E, T) {
    var F = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, F);
    } catch (X) {
      this.onError(X);
    }
  }
  var Wa = !1, pi = null, vi = !1, R = null, G = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function ge(n, r, l, o, c, d, m, E, T) {
    Wa = !1, pi = null, di.apply(G, arguments);
  }
  function _e(n, r, l, o, c, d, m, E, T) {
    if (ge.apply(this, arguments), Wa) {
      if (Wa) {
        var F = pi;
        Wa = !1, pi = null;
      } else throw Error(w(198));
      vi || (vi = !0, R = F);
    }
  }
  function lt(n) {
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
  function tt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Et(n) {
    if (lt(n) !== n) throw Error(w(188));
  }
  function yt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = lt(n), r === null) throw Error(w(188));
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
          if (d === l) return Et(c), n;
          if (d === o) return Et(c), r;
          d = d.sibling;
        }
        throw Error(w(188));
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
          if (!m) throw Error(w(189));
        }
      }
      if (l.alternate !== o) throw Error(w(190));
    }
    if (l.tag !== 3) throw Error(w(188));
    return l.stateNode.current === l ? n : r;
  }
  function wn(n) {
    return n = yt(n), n !== null ? ln(n) : null;
  }
  function ln(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = ln(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var cn = x.unstable_scheduleCallback, ir = x.unstable_cancelCallback, Ga = x.unstable_shouldYield, qa = x.unstable_requestPaint, ut = x.unstable_now, ct = x.unstable_getCurrentPriorityLevel, Ka = x.unstable_ImmediatePriority, nu = x.unstable_UserBlockingPriority, ru = x.unstable_NormalPriority, hl = x.unstable_LowPriority, Wu = x.unstable_IdlePriority, ml = null, Qr = null;
  function $o(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dr = Math.clz32 ? Math.clz32 : Gu, uc = Math.log, oc = Math.LN2;
  function Gu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (uc(n) / oc | 0) | 0;
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
  function Ja(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = Xa(E) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Dr(r), c = 1 << l, o |= n[l], r &= ~c;
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
      var m = 31 - Dr(d), E = 1 << m, T = c[m];
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
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Dr(r), n[r] = l;
  }
  function Gf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Dr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - Dr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Ut = 0;
  function Ju(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Mt, Qo, hi, et, Zu, lr = !1, mi = [], Or = null, yi = null, fn = null, Kt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), $n = [], Nr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function xa(n, r) {
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
        Kt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Pe(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
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
        return Kt.set(d, iu(Kt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Go(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = lt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = tt(l), r !== null) {
            n.blockedOn = r, Zu(n.priority, function() {
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
        an = o, l.target.dispatchEvent(o), an = null;
      } else return r = Pe(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function qf() {
    lr = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), fn !== null && El(fn) && (fn = null), Kt.forEach(lu), Sl.forEach(lu);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, lr || (lr = !0, x.unstable_scheduleCallback(x.unstable_NormalPriority, qf)));
  }
  function Za(n) {
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
    for (Or !== null && ba(Or, n), yi !== null && ba(yi, n), fn !== null && ba(fn, n), Kt.forEach(r), Sl.forEach(r), l = 0; l < $n.length; l++) o = $n[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < $n.length && (l = $n[0], l.blockedOn === null); ) Go(l), l.blockedOn === null && $n.shift();
  }
  var gi = fe.ReactCurrentBatchConfig, _a = !0;
  function eo(n, r, l, o) {
    var c = Ut, d = gi.transition;
    gi.transition = null;
    try {
      Ut = 1, Cl(n, r, l, o);
    } finally {
      Ut = c, gi.transition = d;
    }
  }
  function to(n, r, l, o) {
    var c = Ut, d = gi.transition;
    gi.transition = null;
    try {
      Ut = 4, Cl(n, r, l, o);
    } finally {
      Ut = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = no(n, r, l, o);
      if (c === null) Ec(n, r, o, uu, l), xa(n, o);
      else if (Wo(c, n, r, l, o)) o.stopPropagation();
      else if (xa(n, o), r & 4 && -1 < Nr.indexOf(n)) {
        for (; c !== null; ) {
          var d = Pe(c);
          if (d !== null && Mt(d), d = no(n, r, l, o), d === null && Ec(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Ec(n, r, o, null, l);
    }
  }
  var uu = null;
  function no(n, r, l, o) {
    if (uu = null, n = Gt(o), n = vu(n), n !== null) if (r = lt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = tt(r), n !== null) return n;
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
        switch (ct()) {
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
  function j() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function P(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function le() {
    return !0;
  }
  function Be() {
    return !1;
  }
  function me(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? le : Be, this.isPropagationStopped = Be, this;
    }
    return ie(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = le);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = le);
    }, persist: function() {
    }, isPersistent: le }), r;
  }
  var $e = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ct = me($e), Lt = ie({}, $e, { view: 0, detail: 0 }), un = me(Lt), Xt, vt, Jt, mn = ie({}, Lt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ed, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Jt && (Jt && n.type === "mousemove" ? (Xt = n.screenX - Jt.screenX, vt = n.screenY - Jt.screenY) : vt = Xt = 0, Jt = n), Xt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : vt;
  } }), Rl = me(mn), qo = ie({}, mn, { dataTransfer: 0 }), Bi = me(qo), Ko = ie({}, Lt, { relatedTarget: 0 }), ou = me(Ko), Kf = ie({}, $e, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), sc = me(Kf), Xf = ie({}, $e, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), rv = me(Xf), Jf = ie({}, $e, { data: 0 }), Zf = me(Jf), av = {
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
  }, iv = {
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
  }, ey = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ey[n]) ? !!r[n] : !1;
  }
  function ed() {
    return Ii;
  }
  var td = ie({}, Lt, { key: function(n) {
    if (n.key) {
      var r = av[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = P(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? iv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ed, charCode: function(n) {
    return n.type === "keypress" ? P(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? P(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), nd = me(td), rd = ie({}, mn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), lv = me(rd), cc = ie({}, Lt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ed }), uv = me(cc), Wr = ie({}, $e, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = me(Wr), Ln = ie({}, mn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = me(Ln), ad = [9, 13, 27, 32], ao = ye && "CompositionEvent" in window, Xo = null;
  ye && "documentMode" in document && (Xo = document.documentMode);
  var Jo = ye && "TextEvent" in window && !Xo, ov = ye && (!ao || Xo && 8 < Xo && 11 >= Xo), sv = " ", fc = !1;
  function cv(n, r) {
    switch (n) {
      case "keyup":
        return ad.indexOf(r.keyCode) !== -1;
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
  function fv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var io = !1;
  function dv(n, r) {
    switch (n) {
      case "compositionend":
        return fv(r);
      case "keypress":
        return r.which !== 32 ? null : (fc = !0, sv);
      case "textInput":
        return n = r.data, n === sv && fc ? null : n;
      default:
        return null;
    }
  }
  function ty(n, r) {
    if (io) return n === "compositionend" || !ao && cv(n, r) ? (n = j(), C = h = ei = null, io = !1, n) : null;
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
        return ov && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ny = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function pv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ny[n.type] : r === "textarea";
  }
  function id(n, r, l, o) {
    Hi(o), r = as(r, "onChange"), 0 < r.length && (l = new Ct("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function vv(n) {
    du(n, 0);
  }
  function Zo(n) {
    var r = ni(n);
    if (br(r)) return n;
  }
  function ry(n, r) {
    if (n === "change") return r;
  }
  var hv = !1;
  if (ye) {
    var ld;
    if (ye) {
      var ud = "oninput" in document;
      if (!ud) {
        var mv = document.createElement("div");
        mv.setAttribute("oninput", "return;"), ud = typeof mv.oninput == "function";
      }
      ld = ud;
    } else ld = !1;
    hv = ld && (!document.documentMode || 9 < document.documentMode);
  }
  function yv() {
    Si && (Si.detachEvent("onpropertychange", gv), su = Si = null);
  }
  function gv(n) {
    if (n.propertyName === "value" && Zo(su)) {
      var r = [];
      id(r, su, n, Gt(n)), tu(vv, r);
    }
  }
  function ay(n, r, l) {
    n === "focusin" ? (yv(), Si = r, su = l, Si.attachEvent("onpropertychange", gv)) : n === "focusout" && yv();
  }
  function Sv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Zo(su);
  }
  function iy(n, r) {
    if (n === "click") return Zo(r);
  }
  function Ev(n, r) {
    if (n === "input" || n === "change") return Zo(r);
  }
  function ly(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : ly;
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
  function Cv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function dc(n, r) {
    var l = Cv(n);
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
      l = Cv(l);
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
  function pc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function lo(n) {
    var r = ts(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Tl(l.ownerDocument.documentElement, l)) {
      if (o !== null && pc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = dc(l, d);
          var m = dc(
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
  var uy = ye && "documentMode" in document && 11 >= document.documentMode, uo = null, od = null, ns = null, sd = !1;
  function cd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    sd || uo == null || uo !== Rn(o) || (o = uo, "selectionStart" in o && pc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ns && es(ns, o) || (ns = o, o = as(od, "onSelect"), 0 < o.length && (r = new Ct("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = uo)));
  }
  function vc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: vc("Animation", "AnimationEnd"), animationiteration: vc("Animation", "AnimationIteration"), animationstart: vc("Animation", "AnimationStart"), transitionend: vc("Transition", "TransitionEnd") }, ur = {}, fd = {};
  ye && (fd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function hc(n) {
    if (ur[n]) return ur[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in fd) return ur[n] = r[l];
    return n;
  }
  var Rv = hc("animationend"), Tv = hc("animationiteration"), wv = hc("animationstart"), xv = hc("transitionend"), dd = /* @__PURE__ */ new Map(), mc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ka(n, r) {
    dd.set(n, r), ee(r, [n]);
  }
  for (var pd = 0; pd < mc.length; pd++) {
    var fu = mc[pd], oy = fu.toLowerCase(), sy = fu[0].toUpperCase() + fu.slice(1);
    ka(oy, "on" + sy);
  }
  ka(Rv, "onAnimationEnd"), ka(Tv, "onAnimationIteration"), ka(wv, "onAnimationStart"), ka("dblclick", "onDoubleClick"), ka("focusin", "onFocus"), ka("focusout", "onBlur"), ka(xv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), ee("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), ee("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), ee("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), ee("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), ee("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), ee("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("cancel close invalid load scroll toggle".split(" ").concat(rs));
  function yc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, _e(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var E = o[m], T = E.instance, F = E.currentTarget;
          if (E = E.listener, T !== d && c.isPropagationStopped()) break e;
          yc(c, E, F), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (E = o[m], T = E.instance, F = E.currentTarget, E = E.listener, T !== d && c.isPropagationStopped()) break e;
          yc(c, E, F), d = T;
        }
      }
    }
    if (vi) throw n = R, vi = !1, R = null, n;
  }
  function It(n, r) {
    var l = r[us];
    l === void 0 && (l = r[us] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (bv(r, n, 2, !1), l.add(o));
  }
  function gc(n, r, l) {
    var o = 0;
    r && (o |= 4), bv(l, n, o, r);
  }
  var Sc = "_reactListening" + Math.random().toString(36).slice(2);
  function oo(n) {
    if (!n[Sc]) {
      n[Sc] = !0, ue.forEach(function(l) {
        l !== "selectionchange" && (vd.has(l) || gc(l, !1, n), gc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Sc] || (r[Sc] = !0, gc("selectionchange", !1, r));
    }
  }
  function bv(n, r, l, o) {
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
    l = c.bind(null, r, l, n), c = void 0, !kr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Ec(n, r, l, o, c) {
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
      var F = d, X = Gt(l), te = [];
      e: {
        var K = dd.get(n);
        if (K !== void 0) {
          var Te = Ct, ke = n;
          switch (n) {
            case "keypress":
              if (P(l) === 0) break e;
            case "keydown":
            case "keyup":
              Te = nd;
              break;
            case "focusin":
              ke = "focus", Te = ou;
              break;
            case "focusout":
              ke = "blur", Te = ou;
              break;
            case "beforeblur":
            case "afterblur":
              Te = ou;
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
              Te = Rl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Te = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Te = uv;
              break;
            case Rv:
            case Tv:
            case wv:
              Te = sc;
              break;
            case xv:
              Te = Yi;
              break;
            case "scroll":
              Te = un;
              break;
            case "wheel":
              Te = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              Te = rv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Te = lv;
          }
          var ze = (r & 4) !== 0, Dn = !ze && n === "scroll", M = ze ? K !== null ? K + "Capture" : null : K;
          ze = [];
          for (var _ = F, z; _ !== null; ) {
            z = _;
            var J = z.stateNode;
            if (z.tag === 5 && J !== null && (z = J, M !== null && (J = _r(_, M), J != null && ze.push(so(_, J, z)))), Dn) break;
            _ = _.return;
          }
          0 < ze.length && (K = new Te(K, ke, null, l, X), te.push({ event: K, listeners: ze }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (K = n === "mouseover" || n === "pointerover", Te = n === "mouseout" || n === "pointerout", K && l !== an && (ke = l.relatedTarget || l.fromElement) && (vu(ke) || ke[Qi])) break e;
          if ((Te || K) && (K = X.window === X ? X : (K = X.ownerDocument) ? K.defaultView || K.parentWindow : window, Te ? (ke = l.relatedTarget || l.toElement, Te = F, ke = ke ? vu(ke) : null, ke !== null && (Dn = lt(ke), ke !== Dn || ke.tag !== 5 && ke.tag !== 6) && (ke = null)) : (Te = null, ke = F), Te !== ke)) {
            if (ze = Rl, J = "onMouseLeave", M = "onMouseEnter", _ = "mouse", (n === "pointerout" || n === "pointerover") && (ze = lv, J = "onPointerLeave", M = "onPointerEnter", _ = "pointer"), Dn = Te == null ? K : ni(Te), z = ke == null ? K : ni(ke), K = new ze(J, _ + "leave", Te, l, X), K.target = Dn, K.relatedTarget = z, J = null, vu(X) === F && (ze = new ze(M, _ + "enter", ke, l, X), ze.target = z, ze.relatedTarget = Dn, J = ze), Dn = J, Te && ke) t: {
              for (ze = Te, M = ke, _ = 0, z = ze; z; z = wl(z)) _++;
              for (z = 0, J = M; J; J = wl(J)) z++;
              for (; 0 < _ - z; ) ze = wl(ze), _--;
              for (; 0 < z - _; ) M = wl(M), z--;
              for (; _--; ) {
                if (ze === M || M !== null && ze === M.alternate) break t;
                ze = wl(ze), M = wl(M);
              }
              ze = null;
            }
            else ze = null;
            Te !== null && _v(te, K, Te, ze, !1), ke !== null && Dn !== null && _v(te, Dn, ke, ze, !0);
          }
        }
        e: {
          if (K = F ? ni(F) : window, Te = K.nodeName && K.nodeName.toLowerCase(), Te === "select" || Te === "input" && K.type === "file") var De = ry;
          else if (pv(K)) if (hv) De = Ev;
          else {
            De = Sv;
            var Ye = ay;
          }
          else (Te = K.nodeName) && Te.toLowerCase() === "input" && (K.type === "checkbox" || K.type === "radio") && (De = iy);
          if (De && (De = De(n, F))) {
            id(te, De, l, X);
            break e;
          }
          Ye && Ye(n, K, F), n === "focusout" && (Ye = K._wrapperState) && Ye.controlled && K.type === "number" && sa(K, "number", K.value);
        }
        switch (Ye = F ? ni(F) : window, n) {
          case "focusin":
            (pv(Ye) || Ye.contentEditable === "true") && (uo = Ye, od = F, ns = null);
            break;
          case "focusout":
            ns = od = uo = null;
            break;
          case "mousedown":
            sd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            sd = !1, cd(te, l, X);
            break;
          case "selectionchange":
            if (uy) break;
          case "keydown":
          case "keyup":
            cd(te, l, X);
        }
        var Qe;
        if (ao) e: {
          switch (n) {
            case "compositionstart":
              var Je = "onCompositionStart";
              break e;
            case "compositionend":
              Je = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Je = "onCompositionUpdate";
              break e;
          }
          Je = void 0;
        }
        else io ? cv(n, l) && (Je = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Je = "onCompositionStart");
        Je && (ov && l.locale !== "ko" && (io || Je !== "onCompositionStart" ? Je === "onCompositionEnd" && io && (Qe = j()) : (ei = X, h = "value" in ei ? ei.value : ei.textContent, io = !0)), Ye = as(F, Je), 0 < Ye.length && (Je = new Zf(Je, n, null, l, X), te.push({ event: Je, listeners: Ye }), Qe ? Je.data = Qe : (Qe = fv(l), Qe !== null && (Je.data = Qe)))), (Qe = Jo ? dv(n, l) : ty(n, l)) && (F = as(F, "onBeforeInput"), 0 < F.length && (X = new Zf("onBeforeInput", "beforeinput", null, l, X), te.push({ event: X, listeners: F }), X.data = Qe));
      }
      du(te, r);
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
  function wl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function _v(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, T = E.alternate, F = E.stateNode;
      if (T !== null && T === o) break;
      E.tag === 5 && F !== null && (E = F, c ? (T = _r(l, d), T != null && m.unshift(so(l, T, E))) : c || (T = _r(l, d), T != null && m.push(so(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var kv = /\r\n?/g, cy = /\u0000|\uFFFD/g;
  function Dv(n) {
    return (typeof n == "string" ? n : "" + n).replace(kv, `
`).replace(cy, "");
  }
  function Cc(n, r, l) {
    if (r = Dv(r), Dv(n) !== r && l) throw Error(w(425));
  }
  function xl() {
  }
  var is = null, pu = null;
  function Rc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, hd = typeof clearTimeout == "function" ? clearTimeout : void 0, Ov = typeof Promise == "function" ? Promise : void 0, co = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ov < "u" ? function(n) {
    return Ov.resolve(null).then(n).catch(wc);
  } : Tc;
  function wc(n) {
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
          n.removeChild(c), Za(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Za(r);
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
  function Nv(n) {
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
  var bl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + bl, ls = "__reactProps$" + bl, Qi = "__reactContainer$" + bl, us = "__reactEvents$" + bl, po = "__reactListeners$" + bl, fy = "__reactHandles$" + bl;
  function vu(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Nv(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = Nv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function Pe(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(w(33));
  }
  function yn(n) {
    return n[ls] || null;
  }
  var _t = [], Da = -1;
  function Oa(n) {
    return { current: n };
  }
  function on(n) {
    0 > Da || (n.current = _t[Da], _t[Da] = null, Da--);
  }
  function Fe(n, r) {
    Da++, _t[Da] = n.current, n.current = r;
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
  function An(n) {
    return n = n.childContextTypes, n != null;
  }
  function vo() {
    on(Qn), on(Cn);
  }
  function Mv(n, r, l) {
    if (Cn.current !== Rr) throw Error(w(168));
    Fe(Cn, r), Fe(Qn, l);
  }
  function os(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(w(108, st(n) || "Unknown", c));
    return ie({}, l, o);
  }
  function Jn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Rr, Gr = Cn.current, Fe(Cn, n), Fe(Qn, Qn.current), !0;
  }
  function xc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(w(169));
    l ? (n = os(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, on(Qn), on(Cn), Fe(Cn, n)) : on(Qn), Fe(Qn, l);
  }
  var Ri = null, ho = !1, Wi = !1;
  function bc(n) {
    Ri === null ? Ri = [n] : Ri.push(n);
  }
  function _l(n) {
    ho = !0, bc(n);
  }
  function Ti() {
    if (!Wi && Ri !== null) {
      Wi = !0;
      var n = 0, r = Ut;
      try {
        var l = Ri;
        for (Ut = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ri = null, ho = !1;
      } catch (c) {
        throw Ri !== null && (Ri = Ri.slice(n + 1)), cn(Ka, Ti), c;
      } finally {
        Ut = r, Wi = !1;
      }
    }
    return null;
  }
  var kl = [], Dl = 0, Ol = null, Gi = 0, zn = [], Na = 0, pa = null, wi = 1, xi = "";
  function hu(n, r) {
    kl[Dl++] = Gi, kl[Dl++] = Ol, Ol = n, Gi = r;
  }
  function Lv(n, r, l) {
    zn[Na++] = wi, zn[Na++] = xi, zn[Na++] = pa, pa = n;
    var o = wi;
    n = xi;
    var c = 32 - Dr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Dr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, wi = 1 << 32 - Dr(r) + c | l << c | o, xi = d + n;
    } else wi = 1 << d | l << c | o, xi = n;
  }
  function _c(n) {
    n.return !== null && (hu(n, 1), Lv(n, 1, 0));
  }
  function kc(n) {
    for (; n === Ol; ) Ol = kl[--Dl], kl[Dl] = null, Gi = kl[--Dl], kl[Dl] = null;
    for (; n === pa; ) pa = zn[--Na], zn[Na] = null, xi = zn[--Na], zn[Na] = null, wi = zn[--Na], zn[Na] = null;
  }
  var Kr = null, Xr = null, pn = !1, Ma = null;
  function md(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Av(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = Ei(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: wi, overflow: xi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function yd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function gd(n) {
    if (pn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Av(n, r)) {
          if (yd(n)) throw Error(w(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && Av(n, r) ? md(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Kr = n);
        }
      } else {
        if (yd(n)) throw Error(w(418));
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
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Rc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (yd(n)) throw ss(), Error(w(418));
      for (; r; ) md(n, r), r = Ei(r.nextSibling);
    }
    if (Wn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(w(317));
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
  function Nl() {
    Xr = Kr = null, pn = !1;
  }
  function qi(n) {
    Ma === null ? Ma = [n] : Ma.push(n);
  }
  var dy = fe.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(w(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(w(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(w(284));
      if (!l._owner) throw Error(w(290, n));
    }
    return n;
  }
  function Oc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(w(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function zv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(M, _) {
      if (n) {
        var z = M.deletions;
        z === null ? (M.deletions = [_], M.flags |= 16) : z.push(_);
      }
    }
    function l(M, _) {
      if (!n) return null;
      for (; _ !== null; ) r(M, _), _ = _.sibling;
      return null;
    }
    function o(M, _) {
      for (M = /* @__PURE__ */ new Map(); _ !== null; ) _.key !== null ? M.set(_.key, _) : M.set(_.index, _), _ = _.sibling;
      return M;
    }
    function c(M, _) {
      return M = Hl(M, _), M.index = 0, M.sibling = null, M;
    }
    function d(M, _, z) {
      return M.index = z, n ? (z = M.alternate, z !== null ? (z = z.index, z < _ ? (M.flags |= 2, _) : z) : (M.flags |= 2, _)) : (M.flags |= 1048576, _);
    }
    function m(M) {
      return n && M.alternate === null && (M.flags |= 2), M;
    }
    function E(M, _, z, J) {
      return _ === null || _.tag !== 6 ? (_ = qd(z, M.mode, J), _.return = M, _) : (_ = c(_, z), _.return = M, _);
    }
    function T(M, _, z, J) {
      var De = z.type;
      return De === he ? X(M, _, z.props.children, J, z.key) : _ !== null && (_.elementType === De || typeof De == "object" && De !== null && De.$$typeof === Nt && zv(De) === _.type) ? (J = c(_, z.props), J.ref = mu(M, _, z), J.return = M, J) : (J = Hs(z.type, z.key, z.props, null, M.mode, J), J.ref = mu(M, _, z), J.return = M, J);
    }
    function F(M, _, z, J) {
      return _ === null || _.tag !== 4 || _.stateNode.containerInfo !== z.containerInfo || _.stateNode.implementation !== z.implementation ? (_ = cf(z, M.mode, J), _.return = M, _) : (_ = c(_, z.children || []), _.return = M, _);
    }
    function X(M, _, z, J, De) {
      return _ === null || _.tag !== 7 ? (_ = tl(z, M.mode, J, De), _.return = M, _) : (_ = c(_, z), _.return = M, _);
    }
    function te(M, _, z) {
      if (typeof _ == "string" && _ !== "" || typeof _ == "number") return _ = qd("" + _, M.mode, z), _.return = M, _;
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case Z:
            return z = Hs(_.type, _.key, _.props, null, M.mode, z), z.ref = mu(M, null, _), z.return = M, z;
          case Ae:
            return _ = cf(_, M.mode, z), _.return = M, _;
          case Nt:
            var J = _._init;
            return te(M, J(_._payload), z);
        }
        if (Kn(_) || se(_)) return _ = tl(_, M.mode, z, null), _.return = M, _;
        Oc(M, _);
      }
      return null;
    }
    function K(M, _, z, J) {
      var De = _ !== null ? _.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return De !== null ? null : E(M, _, "" + z, J);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case Z:
            return z.key === De ? T(M, _, z, J) : null;
          case Ae:
            return z.key === De ? F(M, _, z, J) : null;
          case Nt:
            return De = z._init, K(
              M,
              _,
              De(z._payload),
              J
            );
        }
        if (Kn(z) || se(z)) return De !== null ? null : X(M, _, z, J, null);
        Oc(M, z);
      }
      return null;
    }
    function Te(M, _, z, J, De) {
      if (typeof J == "string" && J !== "" || typeof J == "number") return M = M.get(z) || null, E(_, M, "" + J, De);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case Z:
            return M = M.get(J.key === null ? z : J.key) || null, T(_, M, J, De);
          case Ae:
            return M = M.get(J.key === null ? z : J.key) || null, F(_, M, J, De);
          case Nt:
            var Ye = J._init;
            return Te(M, _, z, Ye(J._payload), De);
        }
        if (Kn(J) || se(J)) return M = M.get(z) || null, X(_, M, J, De, null);
        Oc(_, J);
      }
      return null;
    }
    function ke(M, _, z, J) {
      for (var De = null, Ye = null, Qe = _, Je = _ = 0, tr = null; Qe !== null && Je < z.length; Je++) {
        Qe.index > Je ? (tr = Qe, Qe = null) : tr = Qe.sibling;
        var Ht = K(M, Qe, z[Je], J);
        if (Ht === null) {
          Qe === null && (Qe = tr);
          break;
        }
        n && Qe && Ht.alternate === null && r(M, Qe), _ = d(Ht, _, Je), Ye === null ? De = Ht : Ye.sibling = Ht, Ye = Ht, Qe = tr;
      }
      if (Je === z.length) return l(M, Qe), pn && hu(M, Je), De;
      if (Qe === null) {
        for (; Je < z.length; Je++) Qe = te(M, z[Je], J), Qe !== null && (_ = d(Qe, _, Je), Ye === null ? De = Qe : Ye.sibling = Qe, Ye = Qe);
        return pn && hu(M, Je), De;
      }
      for (Qe = o(M, Qe); Je < z.length; Je++) tr = Te(Qe, M, Je, z[Je], J), tr !== null && (n && tr.alternate !== null && Qe.delete(tr.key === null ? Je : tr.key), _ = d(tr, _, Je), Ye === null ? De = tr : Ye.sibling = tr, Ye = tr);
      return n && Qe.forEach(function(Bl) {
        return r(M, Bl);
      }), pn && hu(M, Je), De;
    }
    function ze(M, _, z, J) {
      var De = se(z);
      if (typeof De != "function") throw Error(w(150));
      if (z = De.call(z), z == null) throw Error(w(151));
      for (var Ye = De = null, Qe = _, Je = _ = 0, tr = null, Ht = z.next(); Qe !== null && !Ht.done; Je++, Ht = z.next()) {
        Qe.index > Je ? (tr = Qe, Qe = null) : tr = Qe.sibling;
        var Bl = K(M, Qe, Ht.value, J);
        if (Bl === null) {
          Qe === null && (Qe = tr);
          break;
        }
        n && Qe && Bl.alternate === null && r(M, Qe), _ = d(Bl, _, Je), Ye === null ? De = Bl : Ye.sibling = Bl, Ye = Bl, Qe = tr;
      }
      if (Ht.done) return l(
        M,
        Qe
      ), pn && hu(M, Je), De;
      if (Qe === null) {
        for (; !Ht.done; Je++, Ht = z.next()) Ht = te(M, Ht.value, J), Ht !== null && (_ = d(Ht, _, Je), Ye === null ? De = Ht : Ye.sibling = Ht, Ye = Ht);
        return pn && hu(M, Je), De;
      }
      for (Qe = o(M, Qe); !Ht.done; Je++, Ht = z.next()) Ht = Te(Qe, M, Je, Ht.value, J), Ht !== null && (n && Ht.alternate !== null && Qe.delete(Ht.key === null ? Je : Ht.key), _ = d(Ht, _, Je), Ye === null ? De = Ht : Ye.sibling = Ht, Ye = Ht);
      return n && Qe.forEach(function(yh) {
        return r(M, yh);
      }), pn && hu(M, Je), De;
    }
    function Dn(M, _, z, J) {
      if (typeof z == "object" && z !== null && z.type === he && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case Z:
            e: {
              for (var De = z.key, Ye = _; Ye !== null; ) {
                if (Ye.key === De) {
                  if (De = z.type, De === he) {
                    if (Ye.tag === 7) {
                      l(M, Ye.sibling), _ = c(Ye, z.props.children), _.return = M, M = _;
                      break e;
                    }
                  } else if (Ye.elementType === De || typeof De == "object" && De !== null && De.$$typeof === Nt && zv(De) === Ye.type) {
                    l(M, Ye.sibling), _ = c(Ye, z.props), _.ref = mu(M, Ye, z), _.return = M, M = _;
                    break e;
                  }
                  l(M, Ye);
                  break;
                } else r(M, Ye);
                Ye = Ye.sibling;
              }
              z.type === he ? (_ = tl(z.props.children, M.mode, J, z.key), _.return = M, M = _) : (J = Hs(z.type, z.key, z.props, null, M.mode, J), J.ref = mu(M, _, z), J.return = M, M = J);
            }
            return m(M);
          case Ae:
            e: {
              for (Ye = z.key; _ !== null; ) {
                if (_.key === Ye) if (_.tag === 4 && _.stateNode.containerInfo === z.containerInfo && _.stateNode.implementation === z.implementation) {
                  l(M, _.sibling), _ = c(_, z.children || []), _.return = M, M = _;
                  break e;
                } else {
                  l(M, _);
                  break;
                }
                else r(M, _);
                _ = _.sibling;
              }
              _ = cf(z, M.mode, J), _.return = M, M = _;
            }
            return m(M);
          case Nt:
            return Ye = z._init, Dn(M, _, Ye(z._payload), J);
        }
        if (Kn(z)) return ke(M, _, z, J);
        if (se(z)) return ze(M, _, z, J);
        Oc(M, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, _ !== null && _.tag === 6 ? (l(M, _.sibling), _ = c(_, z), _.return = M, M = _) : (l(M, _), _ = qd(z, M.mode, J), _.return = M, M = _), m(M)) : l(M, _);
    }
    return Dn;
  }
  var xn = yu(!0), Se = yu(!1), va = Oa(null), Jr = null, mo = null, Sd = null;
  function Ed() {
    Sd = mo = Jr = null;
  }
  function Cd(n) {
    var r = va.current;
    on(va), n._currentValue = r;
  }
  function Rd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function gn(n, r) {
    Jr = n, Sd = mo = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (jn = !0), n.firstContext = null);
  }
  function La(n) {
    var r = n._currentValue;
    if (Sd !== n) if (n = { context: n, memoizedValue: r, next: null }, mo === null) {
      if (Jr === null) throw Error(w(308));
      mo = n, Jr.dependencies = { lanes: 0, firstContext: n };
    } else mo = mo.next = n;
    return r;
  }
  var gu = null;
  function Td(n) {
    gu === null ? gu = [n] : gu.push(n);
  }
  function wd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
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
  function Uv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ml(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, kt & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Td(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Nc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function jv(n, r) {
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
      var T = E, F = T.next;
      T.next = null, m === null ? d = F : m.next = F, m = T;
      var X = n.alternate;
      X !== null && (X = X.updateQueue, E = X.lastBaseUpdate, E !== m && (E === null ? X.firstBaseUpdate = F : E.next = F, X.lastBaseUpdate = T));
    }
    if (d !== null) {
      var te = c.baseState;
      m = 0, X = F = T = null, E = d;
      do {
        var K = E.lane, Te = E.eventTime;
        if ((o & K) === K) {
          X !== null && (X = X.next = {
            eventTime: Te,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var ke = n, ze = E;
            switch (K = r, Te = l, ze.tag) {
              case 1:
                if (ke = ze.payload, typeof ke == "function") {
                  te = ke.call(Te, te, K);
                  break e;
                }
                te = ke;
                break e;
              case 3:
                ke.flags = ke.flags & -65537 | 128;
              case 0:
                if (ke = ze.payload, K = typeof ke == "function" ? ke.call(Te, te, K) : ke, K == null) break e;
                te = ie({}, te, K);
                break e;
              case 2:
                ma = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, K = c.effects, K === null ? c.effects = [E] : K.push(E));
        } else Te = { eventTime: Te, lane: K, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, X === null ? (F = X = Te, T = te) : X = X.next = Te, m |= K;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          K = E, E = K.next, K.next = null, c.lastBaseUpdate = K, c.shared.pending = null;
        }
      } while (!0);
      if (X === null && (T = te), c.baseState = T, c.firstBaseUpdate = F, c.lastBaseUpdate = X, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = te;
    }
  }
  function bd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(w(191, c));
        c.call(o);
      }
    }
  }
  var fs = {}, bi = Oa(fs), ds = Oa(fs), ps = Oa(fs);
  function Su(n) {
    if (n === fs) throw Error(w(174));
    return n;
  }
  function _d(n, r) {
    switch (Fe(ps, r), Fe(ds, n), Fe(bi, fs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    on(bi), Fe(bi, r);
  }
  function Eu() {
    on(bi), on(ds), on(ps);
  }
  function Fv(n) {
    Su(ps.current);
    var r = Su(bi.current), l = ca(r, n.type);
    r !== l && (Fe(ds, n), Fe(bi, l));
  }
  function Mc(n) {
    ds.current === n && (on(bi), on(ds));
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
  function Ve() {
    for (var n = 0; n < vs.length; n++) vs[n]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var gt = fe.ReactCurrentDispatcher, jt = fe.ReactCurrentBatchConfig, Zt = 0, Ft = null, Un = null, Zn = null, Ac = !1, hs = !1, Cu = 0, q = 0;
  function zt() {
    throw Error(w(321));
  }
  function qe(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Ll(n, r, l, o, c, d) {
    if (Zt = d, Ft = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, gt.current = n === null || n.memoizedState === null ? qc : Cs, n = l(o, c), hs) {
      d = 0;
      do {
        if (hs = !1, Cu = 0, 25 <= d) throw Error(w(301));
        d += 1, Zn = Un = null, r.updateQueue = null, gt.current = Kc, n = l(o, c);
      } while (hs);
    }
    if (gt.current = bu, r = Un !== null && Un.next !== null, Zt = 0, Zn = Un = Ft = null, Ac = !1, r) throw Error(w(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function Tr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Zn === null ? Ft.memoizedState = Zn = n : Zn = Zn.next = n, Zn;
  }
  function bn() {
    if (Un === null) {
      var n = Ft.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Un.next;
    var r = Zn === null ? Ft.memoizedState : Zn.next;
    if (r !== null) Zn = r, Un = n;
    else {
      if (n === null) throw Error(w(310));
      Un = n, n = { memoizedState: Un.memoizedState, baseState: Un.baseState, baseQueue: Un.baseQueue, queue: Un.queue, next: null }, Zn === null ? Ft.memoizedState = Zn = n : Zn = Zn.next = n;
    }
    return Zn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Al(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(w(311));
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
      var E = m = null, T = null, F = d;
      do {
        var X = F.lane;
        if ((Zt & X) === X) T !== null && (T = T.next = { lane: 0, action: F.action, hasEagerState: F.hasEagerState, eagerState: F.eagerState, next: null }), o = F.hasEagerState ? F.eagerState : n(o, F.action);
        else {
          var te = {
            lane: X,
            action: F.action,
            hasEagerState: F.hasEagerState,
            eagerState: F.eagerState,
            next: null
          };
          T === null ? (E = T = te, m = o) : T = T.next = te, Ft.lanes |= X, Oi |= X;
        }
        F = F.next;
      } while (F !== null && F !== d);
      T === null ? m = o : T.next = E, ti(o, r.memoizedState) || (jn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Ft.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Ru(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(w(311));
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
  function Uc(n, r) {
    var l = Ft, o = bn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, jn = !0), o = o.queue, ms(Hc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Zn !== null && Zn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Tu(9, Fc.bind(null, l, o, c, r), void 0, null), Gn === null) throw Error(w(349));
      Zt & 30 || jc(l, r, c);
    }
    return c;
  }
  function jc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Ft.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ft.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Fc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Pc(r) && Vc(n);
  }
  function Hc(n, r, l) {
    return l(function() {
      Pc(r) && Vc(n);
    });
  }
  function Pc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ti(n, l);
    } catch {
      return !0;
    }
  }
  function Vc(n) {
    var r = ha(n, 1);
    r !== null && zr(r, n, 1, -1);
  }
  function Bc(n) {
    var r = Tr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = xu.bind(null, Ft, n), [r.memoizedState, n];
  }
  function Tu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Ft.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ft.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Ic() {
    return bn().memoizedState;
  }
  function yo(n, r, l, o) {
    var c = Tr();
    Ft.flags |= n, c.memoizedState = Tu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function go(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Un !== null) {
      var m = Un.memoizedState;
      if (d = m.destroy, o !== null && qe(o, m.deps)) {
        c.memoizedState = Tu(r, l, d, o);
        return;
      }
    }
    Ft.flags |= n, c.memoizedState = Tu(1 | r, l, d, o);
  }
  function Yc(n, r) {
    return yo(8390656, 8, n, r);
  }
  function ms(n, r) {
    return go(2048, 8, n, r);
  }
  function $c(n, r) {
    return go(4, 2, n, r);
  }
  function ys(n, r) {
    return go(4, 4, n, r);
  }
  function wu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Qc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(4, 4, wu.bind(null, r, n), l);
  }
  function gs() {
  }
  function Wc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && qe(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Gc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && qe(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function kd(n, r, l) {
    return Zt & 21 ? (ti(l, r) || (l = Ku(), Ft.lanes |= l, Oi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, jn = !0), n.memoizedState = l);
  }
  function Ss(n, r) {
    var l = Ut;
    Ut = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = jt.transition;
    jt.transition = {};
    try {
      n(!1), r();
    } finally {
      Ut = l, jt.transition = o;
    }
  }
  function Dd() {
    return bn().memoizedState;
  }
  function Es(n, r, l) {
    var o = Ni(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Zr(n)) Hv(r, l);
    else if (l = wd(n, r, l, o), l !== null) {
      var c = Pn();
      zr(l, n, o, c), nn(l, r, o);
    }
  }
  function xu(n, r, l) {
    var o = Ni(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Zr(n)) Hv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, E = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = E, ti(E, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Td(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = wd(n, r, c, o), l !== null && (c = Pn(), zr(l, n, o, c), nn(l, r, o));
    }
  }
  function Zr(n) {
    var r = n.alternate;
    return n === Ft || r !== null && r === Ft;
  }
  function Hv(n, r) {
    hs = Ac = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function nn(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var bu = { readContext: La, useCallback: zt, useContext: zt, useEffect: zt, useImperativeHandle: zt, useInsertionEffect: zt, useLayoutEffect: zt, useMemo: zt, useReducer: zt, useRef: zt, useState: zt, useDebugValue: zt, useDeferredValue: zt, useTransition: zt, useMutableSource: zt, useSyncExternalStore: zt, useId: zt, unstable_isNewReconciler: !1 }, qc = { readContext: La, useCallback: function(n, r) {
    return Tr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: La, useEffect: Yc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(
      4194308,
      4,
      wu.bind(null, r, n),
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
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Es.bind(null, Ft, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Tr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Bc, useDebugValue: gs, useDeferredValue: function(n) {
    return Tr().memoizedState = n;
  }, useTransition: function() {
    var n = Bc(!1), r = n[0];
    return n = Ss.bind(null, n[1]), Tr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Ft, c = Tr();
    if (pn) {
      if (l === void 0) throw Error(w(407));
      l = l();
    } else {
      if (l = r(), Gn === null) throw Error(w(349));
      Zt & 30 || jc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Yc(Hc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Tu(9, Fc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Tr(), r = Gn.identifierPrefix;
    if (pn) {
      var l = xi, o = wi;
      l = (o & ~(1 << 32 - Dr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = q++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Cs = {
    readContext: La,
    useCallback: Wc,
    useContext: La,
    useEffect: ms,
    useImperativeHandle: Qc,
    useInsertionEffect: $c,
    useLayoutEffect: ys,
    useMemo: Gc,
    useReducer: Al,
    useRef: Ic,
    useState: function() {
      return Al(Xi);
    },
    useDebugValue: gs,
    useDeferredValue: function(n) {
      var r = bn();
      return kd(r, Un.memoizedState, n);
    },
    useTransition: function() {
      var n = Al(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: zc,
    useSyncExternalStore: Uc,
    useId: Dd,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: La, useCallback: Wc, useContext: La, useEffect: ms, useImperativeHandle: Qc, useInsertionEffect: $c, useLayoutEffect: ys, useMemo: Gc, useReducer: Ru, useRef: Ic, useState: function() {
    return Ru(Xi);
  }, useDebugValue: gs, useDeferredValue: function(n) {
    var r = bn();
    return Un === null ? r.memoizedState = n : kd(r, Un.memoizedState, n);
  }, useTransition: function() {
    var n = Ru(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: zc, useSyncExternalStore: Uc, useId: Dd, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = ie({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Od(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ie({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? lt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Ni(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ml(n, d, c), r !== null && (zr(r, n, c, o), Nc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Ni(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ml(n, d, c), r !== null && (zr(r, n, c, o), Nc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Pn(), o = Ni(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ml(n, c, o), r !== null && (zr(r, n, o, l), Nc(r, n, o));
  } };
  function Pv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !es(l, o) || !es(c, d) : !0;
  }
  function Jc(n, r, l) {
    var o = !1, c = Rr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = La(d) : (c = An(r) ? Gr : Cn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : Rr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Vv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function Rs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, xd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = La(d) : (d = An(r) ? Gr : Cn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), cs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += ht(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Nd(n, r, l) {
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
  function Bv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      wo || (wo = !0, Ou = o), Md(n, r);
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
  function Ad(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Zc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = Sy.bind(null, n, r, l), r.then(n, n));
  }
  function Iv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function zl(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ml(l, r, 1))), l.lanes |= 1), n);
  }
  var Ts = fe.ReactCurrentOwner, jn = !1;
  function or(n, r, l, o) {
    r.child = n === null ? Se(r, null, l, o) : xn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gn(r, c), o = Ll(n, r, l, o, d, c), l = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (pn && l && _c(r), r.flags |= 1, or(n, r, o, c), r.child);
  }
  function ku(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Gd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, ot(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref) return za(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function ot(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref) if (jn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (jn = !0);
      else return r.lanes = n.lanes, za(n, r, c);
    }
    return Yv(n, r, l, o, c);
  }
  function ws(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Fe(Co, ya), ya |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Fe(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Fe(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Fe(Co, ya), ya |= o;
    return or(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Yv(n, r, l, o, c) {
    var d = An(l) ? Gr : Cn.current;
    return d = qr(r, d), gn(r, c), l = Ll(n, r, l, o, d, c), o = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (pn && o && _c(r), r.flags |= 1, or(n, r, l, c), r.child);
  }
  function $v(n, r, l, o, c) {
    if (An(l)) {
      var d = !0;
      Jn(r);
    } else d = !1;
    if (gn(r, c), r.stateNode === null) Aa(n, r), Jc(r, l, o), Rs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var T = m.context, F = l.contextType;
      typeof F == "object" && F !== null ? F = La(F) : (F = An(l) ? Gr : Cn.current, F = qr(r, F));
      var X = l.getDerivedStateFromProps, te = typeof X == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      te || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== F) && Vv(r, m, o, F), ma = !1;
      var K = r.memoizedState;
      m.state = K, cs(r, o, m, c), T = r.memoizedState, E !== o || K !== T || Qn.current || ma ? (typeof X == "function" && (Od(r, l, X, o), T = r.memoizedState), (E = ma || Pv(r, l, E, o, K, T, F)) ? (te || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = F, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Uv(n, r), E = r.memoizedProps, F = r.type === r.elementType ? E : ai(r.type, E), m.props = F, te = r.pendingProps, K = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = La(T) : (T = An(l) ? Gr : Cn.current, T = qr(r, T));
      var Te = l.getDerivedStateFromProps;
      (X = typeof Te == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== te || K !== T) && Vv(r, m, o, T), ma = !1, K = r.memoizedState, m.state = K, cs(r, o, m, c);
      var ke = r.memoizedState;
      E !== te || K !== ke || Qn.current || ma ? (typeof Te == "function" && (Od(r, l, Te, o), ke = r.memoizedState), (F = ma || Pv(r, l, F, o, K, ke, T) || !1) ? (X || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, ke, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, ke, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && K === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && K === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = ke), m.props = o, m.state = ke, m.context = T, o = F) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && K === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && K === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return xs(n, r, l, o, d, c);
  }
  function xs(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && xc(r, l, !1), za(n, r, d);
    o = r.stateNode, Ts.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = xn(r, n.child, null, d), r.child = xn(r, null, E, d)) : or(n, r, E, d), r.memoizedState = o.state, c && xc(r, l, !0), r.child;
  }
  function So(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), _d(n, r.containerInfo);
  }
  function Qv(n, r, l, o, c) {
    return Nl(), qi(c), r.flags |= 256, or(n, r, l, o), r.child;
  }
  var ef = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ud(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tf(n, r, l) {
    var o = r.pendingProps, c = Sn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Fe(Sn, c & 1), n === null)
      return gd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ud(l), r.memoizedState = ef, n) : jd(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return Wv(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Hl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Hl(E, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ud(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = ef, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function jd(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function bs(n, r, l, o) {
    return o !== null && qi(o), xn(r, n.child, null, l), n = jd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Wv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Nd(Error(w(422))), bs(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && xn(r, n.child, null, m), r.child.memoizedState = Ud(m), r.memoizedState = ef, d);
    if (!(r.mode & 1)) return bs(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(w(419)), o = Nd(d, o, void 0), bs(n, r, m, o);
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
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), zr(o, n, c, -1));
      }
      return Wd(), o = Nd(Error(w(421))), bs(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Ey.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, pn = !0, Ma = null, n !== null && (zn[Na++] = wi, zn[Na++] = xi, zn[Na++] = pa, wi = n.id, xi = n.overflow, pa = r), r = jd(r, o.children), r.flags |= 4096, r);
  }
  function Fd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Rd(n.return, r, l);
  }
  function Mr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function _i(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (or(n, r, o.children, l), o = Sn.current, o & 2) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Fd(n, l, r);
        else if (n.tag === 19) Fd(n, l, r);
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
    if (Fe(Sn, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Lc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Mr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Lc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Mr(r, !0, l, null, d);
        break;
      case "together":
        Mr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Aa(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function za(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(w(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function _s(n, r, l) {
    switch (r.tag) {
      case 3:
        So(r), Nl();
        break;
      case 5:
        Fv(r);
        break;
      case 1:
        An(r.type) && Jn(r);
        break;
      case 4:
        _d(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Fe(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Fe(Sn, Sn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? tf(n, r, l) : (Fe(Sn, Sn.current & 1), n = za(n, r, l), n !== null ? n.sibling : null);
        Fe(Sn, Sn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Fe(Sn, Sn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, ws(n, r, l);
    }
    return za(n, r, l);
  }
  var Ua, Fn, Gv, qv;
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
  }, Gv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(bi.current);
      var d = null;
      switch (l) {
        case "input":
          c = rr(n, c), o = rr(n, o), d = [];
          break;
        case "select":
          c = ie({}, c, { value: void 0 }), o = ie({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = xl);
      }
      sn(l, o);
      var m;
      l = null;
      for (F in c) if (!o.hasOwnProperty(F) && c.hasOwnProperty(F) && c[F] != null) if (F === "style") {
        var E = c[F];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else F !== "dangerouslySetInnerHTML" && F !== "children" && F !== "suppressContentEditableWarning" && F !== "suppressHydrationWarning" && F !== "autoFocus" && (ae.hasOwnProperty(F) ? d || (d = []) : (d = d || []).push(F, null));
      for (F in o) {
        var T = o[F];
        if (E = c != null ? c[F] : void 0, o.hasOwnProperty(F) && T !== E && (T != null || E != null)) if (F === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          F,
          l
        )), l = T;
        else F === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(F, T)) : F === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(F, "" + T) : F !== "suppressContentEditableWarning" && F !== "suppressHydrationWarning" && (ae.hasOwnProperty(F) ? (T != null && F === "onScroll" && It("scroll", n), d || E === T || (d = [])) : (d = d || []).push(F, T));
      }
      l && (d = d || []).push("style", l);
      var F = d;
      (r.updateQueue = F) && (r.flags |= 4);
    }
  }, qv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function ks(n, r) {
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
  function Kv(n, r, l) {
    var o = r.pendingProps;
    switch (kc(r), r.tag) {
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
        return An(r.type) && vo(), er(r), null;
      case 3:
        return o = r.stateNode, Eu(), on(Qn), on(Cn), Ve(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ma !== null && (Nu(Ma), Ma = null))), Fn(n, r), er(r), null;
      case 5:
        Mc(r);
        var c = Su(ps.current);
        if (l = r.type, n !== null && r.stateNode != null) Gv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(w(166));
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
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Cc(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Cc(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : ae.hasOwnProperty(m) && E != null && m === "onScroll" && It("scroll", o);
            }
            switch (l) {
              case "input":
                Nn(o), ci(o, d, !0);
                break;
              case "textarea":
                Nn(o), Mn(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = xl);
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
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ie({}, o, { value: void 0 }), It("invalid", n);
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
                d === "style" ? rn(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && fi(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && pe(n, T) : typeof T == "number" && pe(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (ae.hasOwnProperty(d) ? T != null && d === "onScroll" && It("scroll", n) : T != null && We(n, d, T, m));
              }
              switch (l) {
                case "input":
                  Nn(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Nn(n), Mn(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + dt(o.value));
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
                  typeof c.onClick == "function" && (n.onclick = xl);
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
        if (n && r.stateNode != null) qv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(w(166));
          if (l = Su(ps.current), Su(bi.current), Dc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ci] = r, (d = o.nodeValue !== l) && (n = Kr, n !== null)) switch (n.tag) {
              case 3:
                Cc(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Cc(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ci] = r, r.stateNode = o;
        }
        return er(r), null;
      case 13:
        if (on(Sn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (pn && Xr !== null && r.mode & 1 && !(r.flags & 128)) ss(), Nl(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(w(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(w(317));
              d[Ci] = r;
            } else Nl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            er(r), d = !1;
          } else Ma !== null && (Nu(Ma), Ma = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || Sn.current & 1 ? kn === 0 && (kn = 3) : Wd())), r.updateQueue !== null && (r.flags |= 4), er(r), null);
      case 4:
        return Eu(), Fn(n, r), n === null && oo(r.stateNode.containerInfo), er(r), null;
      case 10:
        return Cd(r.type._context), er(r), null;
      case 17:
        return An(r.type) && vo(), er(r), null;
      case 19:
        if (on(Sn), d = r.memoizedState, d === null) return er(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) ks(d, !1);
        else {
          if (kn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (m = Lc(n), m !== null) {
              for (r.flags |= 128, ks(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return Fe(Sn, Sn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && ut() > To && (r.flags |= 128, o = !0, ks(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Lc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), ks(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return er(r), null;
          } else 2 * ut() - d.renderingStartTime > To && l !== 1073741824 && (r.flags |= 128, o = !0, ks(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = ut(), r.sibling = null, l = Sn.current, Fe(Sn, o ? l & 1 | 2 : l & 1), r) : (er(r), null);
      case 22:
      case 23:
        return Qd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ya & 1073741824 && (er(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : er(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(w(156, r.tag));
  }
  function nf(n, r) {
    switch (kc(r), r.tag) {
      case 1:
        return An(r.type) && vo(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), on(Qn), on(Cn), Ve(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (on(Sn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(w(340));
          Nl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return on(Sn), null;
      case 4:
        return Eu(), null;
      case 10:
        return Cd(r.type._context), null;
      case 22:
      case 23:
        return Qd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ds = !1, wr = !1, py = typeof WeakSet == "function" ? WeakSet : Set, be = null;
  function Eo(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      vn(n, r, o);
    }
    else l.current = null;
  }
  function rf(n, r, l) {
    try {
      l();
    } catch (o) {
      vn(n, r, o);
    }
  }
  var Xv = !1;
  function Jv(n, r) {
    if (is = _a, n = ts(), pc(n)) {
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
          var m = 0, E = -1, T = -1, F = 0, X = 0, te = n, K = null;
          t: for (; ; ) {
            for (var Te; te !== l || c !== 0 && te.nodeType !== 3 || (E = m + c), te !== d || o !== 0 && te.nodeType !== 3 || (T = m + o), te.nodeType === 3 && (m += te.nodeValue.length), (Te = te.firstChild) !== null; )
              K = te, te = Te;
            for (; ; ) {
              if (te === n) break t;
              if (K === l && ++F === c && (E = m), K === d && ++X === o && (T = m), (Te = te.nextSibling) !== null) break;
              te = K, K = te.parentNode;
            }
            te = Te;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, be = r; be !== null; ) if (r = be, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, be = n;
    else for (; be !== null; ) {
      r = be;
      try {
        var ke = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (ke !== null) {
              var ze = ke.memoizedProps, Dn = ke.memoizedState, M = r.stateNode, _ = M.getSnapshotBeforeUpdate(r.elementType === r.type ? ze : ai(r.type, ze), Dn);
              M.__reactInternalSnapshotBeforeUpdate = _;
            }
            break;
          case 3:
            var z = r.stateNode.containerInfo;
            z.nodeType === 1 ? z.textContent = "" : z.nodeType === 9 && z.documentElement && z.removeChild(z.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(w(163));
        }
      } catch (J) {
        vn(r, r.return, J);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, be = n;
        break;
      }
      be = r.return;
    }
    return ke = Xv, Xv = !1, ke;
  }
  function Os(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && rf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Ns(n, r) {
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
  function Hd(n) {
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
  function af(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, af(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[ls], delete r[us], delete r[po], delete r[fy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ms(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ji(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ms(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function ki(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = xl));
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var _n = null, Lr = !1;
  function Ar(n, r, l) {
    for (l = l.child; l !== null; ) Zv(n, r, l), l = l.sibling;
  }
  function Zv(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        wr || Eo(l, r);
      case 6:
        var o = _n, c = Lr;
        _n = null, Ar(n, r, l), _n = o, Lr = c, _n !== null && (Lr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : _n.removeChild(l.stateNode));
        break;
      case 18:
        _n !== null && (Lr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? fo(n.parentNode, l) : n.nodeType === 1 && fo(n, l), Za(n)) : fo(_n, l.stateNode));
        break;
      case 4:
        o = _n, c = Lr, _n = l.stateNode.containerInfo, Lr = !0, Ar(n, r, l), _n = o, Lr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!wr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && rf(l, r, m), c = c.next;
          } while (c !== o);
        }
        Ar(n, r, l);
        break;
      case 1:
        if (!wr && (Eo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (E) {
          vn(l, r, E);
        }
        Ar(n, r, l);
        break;
      case 21:
        Ar(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (wr = (o = wr) || l.memoizedState !== null, Ar(n, r, l), wr = o) : Ar(n, r, l);
        break;
      default:
        Ar(n, r, l);
    }
  }
  function eh(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new py()), r.forEach(function(o) {
        var c = sh.bind(null, n, o);
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
              _n = E.stateNode, Lr = !1;
              break e;
            case 3:
              _n = E.stateNode.containerInfo, Lr = !0;
              break e;
            case 4:
              _n = E.stateNode.containerInfo, Lr = !0;
              break e;
          }
          E = E.return;
        }
        if (_n === null) throw Error(w(160));
        Zv(d, m, c), _n = null, Lr = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (F) {
        vn(c, r, F);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Pd(r, n), r = r.sibling;
  }
  function Pd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Os(3, n, n.return), Ns(3, n);
          } catch (ze) {
            vn(n, n.return, ze);
          }
          try {
            Os(5, n, n.return);
          } catch (ze) {
            vn(n, n.return, ze);
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
            pe(c, "");
          } catch (ze) {
            vn(n, n.return, ze);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && In(c, d), Xn(E, m);
            var F = Xn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var X = T[m], te = T[m + 1];
              X === "style" ? rn(c, te) : X === "dangerouslySetInnerHTML" ? fi(c, te) : X === "children" ? pe(c, te) : We(c, X, te, F);
            }
            switch (E) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var K = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var Te = d.value;
                Te != null ? Tn(c, !!d.multiple, Te, !1) : K !== !!d.multiple && (d.defaultValue != null ? Tn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Tn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[ls] = d;
          } catch (ze) {
            vn(n, n.return, ze);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(w(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (ze) {
            vn(n, n.return, ze);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Za(r.containerInfo);
        } catch (ze) {
          vn(n, n.return, ze);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Id = ut())), o & 4 && eh(n);
        break;
      case 22:
        if (X = l !== null && l.memoizedState !== null, n.mode & 1 ? (wr = (F = wr) || X, ii(r, n), wr = F) : ii(r, n), ta(n), o & 8192) {
          if (F = n.memoizedState !== null, (n.stateNode.isHidden = F) && !X && n.mode & 1) for (be = n, X = n.child; X !== null; ) {
            for (te = be = X; be !== null; ) {
              switch (K = be, Te = K.child, K.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, K, K.return);
                  break;
                case 1:
                  Eo(K, K.return);
                  var ke = K.stateNode;
                  if (typeof ke.componentWillUnmount == "function") {
                    o = K, l = K.return;
                    try {
                      r = o, ke.props = r.memoizedProps, ke.state = r.memoizedState, ke.componentWillUnmount();
                    } catch (ze) {
                      vn(o, l, ze);
                    }
                  }
                  break;
                case 5:
                  Eo(K, K.return);
                  break;
                case 22:
                  if (K.memoizedState !== null) {
                    Ls(te);
                    continue;
                  }
              }
              Te !== null ? (Te.return = K, be = Te) : Ls(te);
            }
            X = X.sibling;
          }
          e: for (X = null, te = n; ; ) {
            if (te.tag === 5) {
              if (X === null) {
                X = te;
                try {
                  c = te.stateNode, F ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = te.stateNode, T = te.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = Bt("display", m));
                } catch (ze) {
                  vn(n, n.return, ze);
                }
              }
            } else if (te.tag === 6) {
              if (X === null) try {
                te.stateNode.nodeValue = F ? "" : te.memoizedProps;
              } catch (ze) {
                vn(n, n.return, ze);
              }
            } else if ((te.tag !== 22 && te.tag !== 23 || te.memoizedState === null || te === n) && te.child !== null) {
              te.child.return = te, te = te.child;
              continue;
            }
            if (te === n) break e;
            for (; te.sibling === null; ) {
              if (te.return === null || te.return === n) break e;
              X === te && (X = null), te = te.return;
            }
            X === te && (X = null), te.sibling.return = te.return, te = te.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && eh(n);
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
            if (Ms(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(w(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (pe(c, ""), o.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Ji(n);
            ki(n, E, m);
            break;
          default:
            throw Error(w(161));
        }
      } catch (T) {
        vn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function vy(n, r, l) {
    be = n, Vd(n);
  }
  function Vd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; be !== null; ) {
      var c = be, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Ds;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || wr;
          E = Ds;
          var F = wr;
          if (Ds = m, (wr = T) && !F) for (be = c; be !== null; ) m = be, T = m.child, m.tag === 22 && m.memoizedState !== null ? Bd(c) : T !== null ? (T.return = m, be = T) : Bd(c);
          for (; d !== null; ) be = d, Vd(d), d = d.sibling;
          be = c, Ds = E, wr = F;
        }
        th(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, be = d) : th(n);
    }
  }
  function th(n) {
    for (; be !== null; ) {
      var r = be;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              wr || Ns(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !wr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && bd(r, d, o);
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
                bd(r, m, l);
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
                var F = r.alternate;
                if (F !== null) {
                  var X = F.memoizedState;
                  if (X !== null) {
                    var te = X.dehydrated;
                    te !== null && Za(te);
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
              throw Error(w(163));
          }
          wr || r.flags & 512 && Hd(r);
        } catch (K) {
          vn(r, r.return, K);
        }
      }
      if (r === n) {
        be = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, be = l;
        break;
      }
      be = r.return;
    }
  }
  function Ls(n) {
    for (; be !== null; ) {
      var r = be;
      if (r === n) {
        be = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, be = l;
        break;
      }
      be = r.return;
    }
  }
  function Bd(n) {
    for (; be !== null; ) {
      var r = be;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ns(4, r);
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
              Hd(r);
            } catch (T) {
              vn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Hd(r);
            } catch (T) {
              vn(r, m, T);
            }
        }
      } catch (T) {
        vn(r, r.return, T);
      }
      if (r === n) {
        be = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, be = E;
        break;
      }
      be = r.return;
    }
  }
  var hy = Math.ceil, Ul = fe.ReactCurrentDispatcher, Du = fe.ReactCurrentOwner, sr = fe.ReactCurrentBatchConfig, kt = 0, Gn = null, Hn = null, cr = 0, ya = 0, Co = Oa(0), kn = 0, As = null, Oi = 0, Ro = 0, lf = 0, zs = null, na = null, Id = 0, To = 1 / 0, ga = null, wo = !1, Ou = null, jl = null, uf = !1, Zi = null, Us = 0, Fl = 0, xo = null, js = -1, xr = 0;
  function Pn() {
    return kt & 6 ? ut() : js !== -1 ? js : js = ut();
  }
  function Ni(n) {
    return n.mode & 1 ? kt & 2 && cr !== 0 ? cr & -cr : dy.transition !== null ? (xr === 0 && (xr = Ku()), xr) : (n = Ut, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ro(n.type)), n) : 1;
  }
  function zr(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, xo = null, Error(w(185));
    Pi(n, l, o), (!(kt & 2) || n !== Gn) && (n === Gn && (!(kt & 2) && (Ro |= l), kn === 4 && li(n, cr)), ra(n, o), l === 1 && kt === 0 && !(r.mode & 1) && (To = ut() + 500, ho && Ti()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Ja(n, n === Gn ? cr : 0);
    if (o === 0) l !== null && ir(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ir(l), r === 1) n.tag === 0 ? _l(Yd.bind(null, n)) : bc(Yd.bind(null, n)), co(function() {
        !(kt & 6) && Ti();
      }), l = null;
      else {
        switch (Ju(o)) {
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
        l = fh(l, of.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function of(n, r) {
    if (js = -1, xr = 0, kt & 6) throw Error(w(327));
    var l = n.callbackNode;
    if (bo() && n.callbackNode !== l) return null;
    var o = Ja(n, n === Gn ? cr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = sf(n, o);
    else {
      r = o;
      var c = kt;
      kt |= 2;
      var d = rh();
      (Gn !== n || cr !== r) && (ga = null, To = ut() + 500, el(n, r));
      do
        try {
          ah();
          break;
        } catch (E) {
          nh(n, E);
        }
      while (!0);
      Ed(), Ul.current = d, kt = c, Hn !== null ? r = 0 : (Gn = null, cr = 0, r = kn);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Fs(n, c))), r === 1) throw l = As, el(n, 0), li(n, o), ra(n, ut()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !my(c) && (r = sf(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Fs(n, d))), r === 1)) throw l = As, el(n, 0), li(n, o), ra(n, ut()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(w(345));
          case 2:
            Lu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Id + 500 - ut(), 10 < r)) {
              if (Ja(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Pn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Tc(Lu.bind(null, n, na, ga), r);
              break;
            }
            Lu(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Dr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = ut() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * hy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Tc(Lu.bind(null, n, na, ga), o);
              break;
            }
            Lu(n, na, ga);
            break;
          case 5:
            Lu(n, na, ga);
            break;
          default:
            throw Error(w(329));
        }
      }
    }
    return ra(n, ut()), n.callbackNode === l ? of.bind(null, n) : null;
  }
  function Fs(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = sf(n, r), n !== 2 && (r = na, na = l, r !== null && Nu(r)), n;
  }
  function Nu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function my(n) {
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
    for (r &= ~lf, r &= ~Ro, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Dr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Yd(n) {
    if (kt & 6) throw Error(w(327));
    bo();
    var r = Ja(n, 0);
    if (!(r & 1)) return ra(n, ut()), null;
    var l = sf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Fs(n, o));
    }
    if (l === 1) throw l = As, el(n, 0), li(n, r), ra(n, ut()), l;
    if (l === 6) throw Error(w(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Lu(n, na, ga), ra(n, ut()), null;
  }
  function $d(n, r) {
    var l = kt;
    kt |= 1;
    try {
      return n(r);
    } finally {
      kt = l, kt === 0 && (To = ut() + 500, ho && Ti());
    }
  }
  function Mu(n) {
    Zi !== null && Zi.tag === 0 && !(kt & 6) && bo();
    var r = kt;
    kt |= 1;
    var l = sr.transition, o = Ut;
    try {
      if (sr.transition = null, Ut = 1, n) return n();
    } finally {
      Ut = o, sr.transition = l, kt = r, !(kt & 6) && Ti();
    }
  }
  function Qd() {
    ya = Co.current, on(Co);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, hd(l)), Hn !== null) for (l = Hn.return; l !== null; ) {
      var o = l;
      switch (kc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && vo();
          break;
        case 3:
          Eu(), on(Qn), on(Cn), Ve();
          break;
        case 5:
          Mc(o);
          break;
        case 4:
          Eu();
          break;
        case 13:
          on(Sn);
          break;
        case 19:
          on(Sn);
          break;
        case 10:
          Cd(o.type._context);
          break;
        case 22:
        case 23:
          Qd();
      }
      l = l.return;
    }
    if (Gn = n, Hn = n = Hl(n.current, null), cr = ya = r, kn = 0, As = null, lf = Ro = Oi = 0, na = zs = null, gu !== null) {
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
  function nh(n, r) {
    do {
      var l = Hn;
      try {
        if (Ed(), gt.current = bu, Ac) {
          for (var o = Ft.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Ac = !1;
        }
        if (Zt = 0, Zn = Un = Ft = null, hs = !1, Cu = 0, Du.current = null, l === null || l.return === null) {
          kn = 1, As = r, Hn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = cr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var F = T, X = E, te = X.tag;
            if (!(X.mode & 1) && (te === 0 || te === 11 || te === 15)) {
              var K = X.alternate;
              K ? (X.updateQueue = K.updateQueue, X.memoizedState = K.memoizedState, X.lanes = K.lanes) : (X.updateQueue = null, X.memoizedState = null);
            }
            var Te = Iv(m);
            if (Te !== null) {
              Te.flags &= -257, zl(Te, m, E, d, r), Te.mode & 1 && Ad(d, F, r), r = Te, T = F;
              var ke = r.updateQueue;
              if (ke === null) {
                var ze = /* @__PURE__ */ new Set();
                ze.add(T), r.updateQueue = ze;
              } else ke.add(T);
              break e;
            } else {
              if (!(r & 1)) {
                Ad(d, F, r), Wd();
                break e;
              }
              T = Error(w(426));
            }
          } else if (pn && E.mode & 1) {
            var Dn = Iv(m);
            if (Dn !== null) {
              !(Dn.flags & 65536) && (Dn.flags |= 256), zl(Dn, m, E, d, r), qi(_u(T, E));
              break e;
            }
          }
          d = T = _u(T, E), kn !== 4 && (kn = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var M = Bv(d, T, r);
                jv(d, M);
                break e;
              case 1:
                E = T;
                var _ = d.type, z = d.stateNode;
                if (!(d.flags & 128) && (typeof _.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (jl === null || !jl.has(z)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var J = Ld(d, E, r);
                  jv(d, J);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        lh(l);
      } catch (De) {
        r = De, Hn === l && l !== null && (Hn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function rh() {
    var n = Ul.current;
    return Ul.current = bu, n === null ? bu : n;
  }
  function Wd() {
    (kn === 0 || kn === 3 || kn === 2) && (kn = 4), Gn === null || !(Oi & 268435455) && !(Ro & 268435455) || li(Gn, cr);
  }
  function sf(n, r) {
    var l = kt;
    kt |= 2;
    var o = rh();
    (Gn !== n || cr !== r) && (ga = null, el(n, r));
    do
      try {
        yy();
        break;
      } catch (c) {
        nh(n, c);
      }
    while (!0);
    if (Ed(), kt = l, Ul.current = o, Hn !== null) throw Error(w(261));
    return Gn = null, cr = 0, kn;
  }
  function yy() {
    for (; Hn !== null; ) ih(Hn);
  }
  function ah() {
    for (; Hn !== null && !Ga(); ) ih(Hn);
  }
  function ih(n) {
    var r = ch(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? lh(n) : Hn = r, Du.current = null;
  }
  function lh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = nf(l, r), l !== null) {
          l.flags &= 32767, Hn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          kn = 6, Hn = null;
          return;
        }
      } else if (l = Kv(l, r, ya), l !== null) {
        Hn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Hn = r;
        return;
      }
      Hn = r = n;
    } while (r !== null);
    kn === 0 && (kn = 5);
  }
  function Lu(n, r, l) {
    var o = Ut, c = sr.transition;
    try {
      sr.transition = null, Ut = 1, gy(n, r, l, o);
    } finally {
      sr.transition = c, Ut = o;
    }
    return null;
  }
  function gy(n, r, l, o) {
    do
      bo();
    while (Zi !== null);
    if (kt & 6) throw Error(w(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(w(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Gf(n, d), n === Gn && (Hn = Gn = null, cr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || uf || (uf = !0, fh(ru, function() {
      return bo(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = sr.transition, sr.transition = null;
      var m = Ut;
      Ut = 1;
      var E = kt;
      kt |= 4, Du.current = null, Jv(n, l), Pd(l, n), lo(pu), _a = !!is, pu = is = null, n.current = l, vy(l), qa(), kt = E, Ut = m, sr.transition = d;
    } else n.current = l;
    if (uf && (uf = !1, Zi = n, Us = c), d = n.pendingLanes, d === 0 && (jl = null), $o(l.stateNode), ra(n, ut()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (wo) throw wo = !1, n = Ou, Ou = null, n;
    return Us & 1 && n.tag !== 0 && bo(), d = n.pendingLanes, d & 1 ? n === xo ? Fl++ : (Fl = 0, xo = n) : Fl = 0, Ti(), null;
  }
  function bo() {
    if (Zi !== null) {
      var n = Ju(Us), r = sr.transition, l = Ut;
      try {
        if (sr.transition = null, Ut = 16 > n ? 16 : n, Zi === null) var o = !1;
        else {
          if (n = Zi, Zi = null, Us = 0, kt & 6) throw Error(w(331));
          var c = kt;
          for (kt |= 4, be = n.current; be !== null; ) {
            var d = be, m = d.child;
            if (be.flags & 16) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var F = E[T];
                  for (be = F; be !== null; ) {
                    var X = be;
                    switch (X.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, X, d);
                    }
                    var te = X.child;
                    if (te !== null) te.return = X, be = te;
                    else for (; be !== null; ) {
                      X = be;
                      var K = X.sibling, Te = X.return;
                      if (af(X), X === F) {
                        be = null;
                        break;
                      }
                      if (K !== null) {
                        K.return = Te, be = K;
                        break;
                      }
                      be = Te;
                    }
                  }
                }
                var ke = d.alternate;
                if (ke !== null) {
                  var ze = ke.child;
                  if (ze !== null) {
                    ke.child = null;
                    do {
                      var Dn = ze.sibling;
                      ze.sibling = null, ze = Dn;
                    } while (ze !== null);
                  }
                }
                be = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, be = m;
            else e: for (; be !== null; ) {
              if (d = be, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var M = d.sibling;
              if (M !== null) {
                M.return = d.return, be = M;
                break e;
              }
              be = d.return;
            }
          }
          var _ = n.current;
          for (be = _; be !== null; ) {
            m = be;
            var z = m.child;
            if (m.subtreeFlags & 2064 && z !== null) z.return = m, be = z;
            else e: for (m = _; be !== null; ) {
              if (E = be, E.flags & 2048) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ns(9, E);
                }
              } catch (De) {
                vn(E, E.return, De);
              }
              if (E === m) {
                be = null;
                break e;
              }
              var J = E.sibling;
              if (J !== null) {
                J.return = E.return, be = J;
                break e;
              }
              be = E.return;
            }
          }
          if (kt = c, Ti(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ut = l, sr.transition = r;
      }
    }
    return !1;
  }
  function uh(n, r, l) {
    r = _u(l, r), r = Bv(n, r, 1), n = Ml(n, r, 1), r = Pn(), n !== null && (Pi(n, 1, r), ra(n, r));
  }
  function vn(n, r, l) {
    if (n.tag === 3) uh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        uh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (jl === null || !jl.has(o))) {
          n = _u(l, n), n = Ld(r, n, 1), r = Ml(r, n, 1), n = Pn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Sy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Pn(), n.pingedLanes |= n.suspendedLanes & l, Gn === n && (cr & l) === l && (kn === 4 || kn === 3 && (cr & 130023424) === cr && 500 > ut() - Id ? el(n, 0) : lf |= l), ra(n, r);
  }
  function oh(n, r) {
    r === 0 && (n.mode & 1 ? (r = da, da <<= 1, !(da & 130023424) && (da = 4194304)) : r = 1);
    var l = Pn();
    n = ha(n, r), n !== null && (Pi(n, r, l), ra(n, l));
  }
  function Ey(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), oh(n, l);
  }
  function sh(n, r) {
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
        throw Error(w(314));
    }
    o !== null && o.delete(r), oh(n, l);
  }
  var ch;
  ch = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Qn.current) jn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return jn = !1, _s(n, r, l);
      jn = !!(n.flags & 131072);
    }
    else jn = !1, pn && r.flags & 1048576 && Lv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        Aa(n, r), n = r.pendingProps;
        var c = qr(r, Cn.current);
        gn(r, l), c = Ll(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, An(o) ? (d = !0, Jn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, xd(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, Rs(r, o, n, l), r = xs(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && _c(r), or(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (Aa(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Ry(o), n = ai(o, n), c) {
            case 0:
              r = Yv(null, r, o, n, l);
              break e;
            case 1:
              r = $v(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = ku(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(w(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Yv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 3:
        e: {
          if (So(r), n === null) throw Error(w(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Uv(n, r), cs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(w(423)), r), r = Qv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(w(424)), r), r = Qv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, pn = !0, Ma = null, l = Se(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Nl(), o === c) {
              r = za(n, r, l);
              break e;
            }
            or(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Fv(r), n === null && gd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Rc(o, c) ? m = null : d !== null && Rc(o, d) && (r.flags |= 32), zd(n, r), or(n, r, m, l), r.child;
      case 6:
        return n === null && gd(r), null;
      case 13:
        return tf(n, r, l);
      case 4:
        return _d(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = xn(r, null, o, l) : or(n, r, o, l), r.child;
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
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Fe(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Qn.current) {
              r = za(n, r, l);
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
                    var F = d.updateQueue;
                    if (F !== null) {
                      F = F.shared;
                      var X = F.pending;
                      X === null ? T.next = T : (T.next = X.next, X.next = T), F.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), Rd(
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
              if (m = d.return, m === null) throw Error(w(341));
              m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), Rd(m, l, r), m = d.sibling;
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
        return c = r.type, o = r.pendingProps.children, gn(r, l), c = La(c), o = o(c), r.flags |= 1, or(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), ku(n, r, o, c, l);
      case 15:
        return ot(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Aa(n, r), r.tag = 1, An(o) ? (n = !0, Jn(r)) : n = !1, gn(r, l), Jc(r, o, c), Rs(r, o, c, l), xs(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return ws(n, r, l);
    }
    throw Error(w(156, r.tag));
  };
  function fh(n, r) {
    return cn(n, r);
  }
  function Cy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new Cy(n, r, l, o);
  }
  function Gd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ry(n) {
    if (typeof n == "function") return Gd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === wt) return 11;
      if (n === bt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Gd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case he:
        return tl(l.children, c, d, r);
      case it:
        m = 8, c |= 8;
        break;
      case Rt:
        return n = ja(12, l, r, c | 2), n.elementType = Rt, n.lanes = d, n;
      case He:
        return n = ja(13, l, r, c), n.elementType = He, n.lanes = d, n;
      case At:
        return n = ja(19, l, r, c), n.elementType = At, n.lanes = d, n;
      case Me:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case St:
            m = 10;
            break e;
          case Wt:
            m = 9;
            break e;
          case wt:
            m = 11;
            break e;
          case bt:
            m = 14;
            break e;
          case Nt:
            m = 16, o = null;
            break e;
        }
        throw Error(w(130, n == null ? n : typeof n, ""));
    }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = Me, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function qd(n, r, l) {
    return n = ja(6, n, null, r), n.lanes = l, n;
  }
  function cf(n, r, l) {
    return r = ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function dh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xu(0), this.expirationTimes = Xu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ff(n, r, l, o, c, d, m, E, T) {
    return n = new dh(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, xd(d), n;
  }
  function Ty(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Ae, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Kd(n) {
    if (!n) return Rr;
    n = n._reactInternals;
    e: {
      if (lt(n) !== n || n.tag !== 1) throw Error(w(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (An(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(w(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (An(l)) return os(n, l, r);
    }
    return r;
  }
  function ph(n, r, l, o, c, d, m, E, T) {
    return n = ff(l, o, !0, n, c, d, m, E, T), n.context = Kd(null), l = n.current, o = Pn(), c = Ni(l), d = Ki(o, c), d.callback = r ?? null, Ml(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function df(n, r, l, o) {
    var c = r.current, d = Pn(), m = Ni(c);
    return l = Kd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ml(c, r, m), n !== null && (zr(n, c, m, d), Nc(n, c, m)), m;
  }
  function pf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Xd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function vf(n, r) {
    Xd(n, r), (n = n.alternate) && Xd(n, r);
  }
  function vh() {
    return null;
  }
  var Au = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Jd(n) {
    this._internalRoot = n;
  }
  hf.prototype.render = Jd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(w(409));
    df(n, r, null, null);
  }, hf.prototype.unmount = Jd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Mu(function() {
        df(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function hf(n) {
    this._internalRoot = n;
  }
  hf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = et();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < $n.length && r !== 0 && r < $n[l].priority; l++) ;
      $n.splice(l, 0, n), l === 0 && Go(n);
    }
  };
  function Zd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function mf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function hh() {
  }
  function wy(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var F = pf(m);
          d.call(F);
        };
      }
      var m = ph(r, o, n, 0, null, !1, !1, "", hh);
      return n._reactRootContainer = m, n[Qi] = m.current, oo(n.nodeType === 8 ? n.parentNode : n), Mu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var F = pf(T);
        E.call(F);
      };
    }
    var T = ff(n, 0, !1, null, null, !1, !1, "", hh);
    return n._reactRootContainer = T, n[Qi] = T.current, oo(n.nodeType === 8 ? n.parentNode : n), Mu(function() {
      df(r, T, l, o);
    }), T;
  }
  function Ps(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var T = pf(m);
          E.call(T);
        };
      }
      df(r, m, n, c);
    } else m = wy(l, r, n, c, o);
    return pf(m);
  }
  Mt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, ut()), !(kt & 6) && (To = ut() + 500, Ti()));
        }
        break;
      case 13:
        Mu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Pn();
            zr(o, n, 1, c);
          }
        }), vf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Pn();
        zr(r, n, 134217728, l);
      }
      vf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Ni(n), l = ha(n, r);
      if (l !== null) {
        var o = Pn();
        zr(l, n, r, o);
      }
      vf(n, r);
    }
  }, et = function() {
    return Ut;
  }, Zu = function(n, r) {
    var l = Ut;
    try {
      return Ut = n, r();
    } finally {
      Ut = l;
    }
  }, qt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = yn(o);
              if (!c) throw Error(w(90));
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
  }, eu = $d, pl = Mu;
  var xy = { usingClientEntryPoint: !1, Events: [Pe, ni, yn, Hi, Zl, $d] }, Vs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, mh = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: fe.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = wn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || vh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(mh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = xy, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zd(r)) throw Error(w(200));
    return Ty(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!Zd(n)) throw Error(w(299));
    var l = !1, o = "", c = Au;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ff(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, oo(n.nodeType === 8 ? n.parentNode : n), new Jd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(w(188)) : (n = Object.keys(n).join(","), Error(w(268, n)));
    return n = wn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Mu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!mf(r)) throw Error(w(200));
    return Ps(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!Zd(n)) throw Error(w(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Au;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = ph(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, oo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new hf(r);
  }, Ia.render = function(n, r, l) {
    if (!mf(r)) throw Error(w(200));
    return Ps(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!mf(n)) throw Error(w(40));
    return n._reactRootContainer ? (Mu(function() {
      Ps(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = $d, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!mf(l)) throw Error(w(200));
    if (n == null || n._reactInternals === void 0) throw Error(w(38));
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
var fT;
function fk() {
  return fT || (fT = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var N = Le, x = vT(), w = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ue = !1;
    function ae(e) {
      ue = e;
    }
    function ee(e) {
      if (!ue) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        ye("warn", e, a);
      }
    }
    function g(e) {
      if (!ue) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        ye("error", e, a);
      }
    }
    function ye(e, t, a) {
      {
        var i = w.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var Y = 0, W = 1, Re = 2, V = 3, de = 4, re = 5, ce = 6, Ne = 7, Ze = 8, Qt = 9, at = 10, We = 11, fe = 12, Z = 13, Ae = 14, he = 15, it = 16, Rt = 17, St = 18, Wt = 19, wt = 21, He = 22, At = 23, bt = 24, Nt = 25, Me = !0, oe = !1, se = !1, ie = !1, D = !1, $ = !0, Ke = !0, Ge = !0, ht = !0, ft = /* @__PURE__ */ new Set(), st = {}, dt = {};
    function mt(e, t) {
      $t(e, t), $t(e + "Capture", t);
    }
    function $t(e, t) {
      st[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), st[e] = t;
      {
        var a = e.toLowerCase();
        dt[a] = e, e === "onDoubleClick" && (dt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        ft.add(t[i]);
    }
    var Nn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
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
    var Yn = 0, Sr = 1, $a = 2, Mn = 3, Er = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", pe = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Ue = new RegExp("^[" + fi + "][" + pe + "]*$"), pt = {}, Bt = {};
    function rn(e) {
      return br.call(Bt, e) ? !0 : br.call(pt, e) ? !1 : Ue.test(e) ? (Bt[e] = !0, !0) : (pt[e] = !0, g("Invalid attribute name: `%s`", e), !1);
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
          case Mn:
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
    function an(e) {
      return qt.hasOwnProperty(e) ? qt[e] : null;
    }
    function Gt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Mn || t === Er, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var qt = {}, fa = [
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
      qt[e] = new Gt(
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
      qt[t] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
        e,
        Mn,
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
      qt[e] = new Gt(
        e,
        Mn,
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
    var Cr = /[\-\:]([a-z])/g, wa = function(e) {
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
      var t = e.replace(Cr, wa);
      qt[t] = new Gt(
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
      var t = e.replace(Cr, wa);
      qt[t] = new Gt(
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
      var t = e.replace(Cr, wa);
      qt[t] = new Gt(
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
      qt[e] = new Gt(
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
    qt[Hi] = new Gt(
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
      qt[e] = new Gt(
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
    var Zl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, eu = !1;
    function pl(e) {
      !eu && Zl.test(e) && (eu = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
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
          if (i.type === Mn)
            return a;
          f = e.getAttribute(s);
        }
        return Xn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function tu(e, t, a, i) {
      {
        if (!rn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return In(a, t), u === "" + a ? a : u;
      }
    }
    function _r(e, t, a, i) {
      var u = an(t);
      if (!hn(t, u, i)) {
        if (Xn(t, a, u, i) && (a = null), i || u === null) {
          if (rn(t)) {
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
            e[p] = v === Mn ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, S = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var k = u.type, b;
          k === Mn || k === Er && a === !0 ? b = "" : (In(a, y), b = "" + a, u.sanitizeURL && pl(b.toString())), S ? e.setAttributeNS(S, y, b) : e.setAttribute(y, b);
        }
      }
    }
    var kr = Symbol.for("react.element"), ar = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), R = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), ge = Symbol.for("react.suspense"), _e = Symbol.for("react.suspense_list"), lt = Symbol.for("react.memo"), tt = Symbol.for("react.lazy"), Et = Symbol.for("react.scope"), yt = Symbol.for("react.debug_trace_mode"), wn = Symbol.for("react.offscreen"), ln = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), ir = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function ut(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var ct = Object.assign, Ka = 0, nu, ru, hl, Wu, ml, Qr, $o;
    function Dr() {
    }
    Dr.__reactDisabledLog = !0;
    function uc() {
      {
        if (Ka === 0) {
          nu = console.log, ru = console.info, hl = console.warn, Wu = console.error, ml = console.group, Qr = console.groupCollapsed, $o = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Dr,
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
    function oc() {
      {
        if (Ka--, Ka === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ct({}, e, {
              value: nu
            }),
            info: ct({}, e, {
              value: ru
            }),
            warn: ct({}, e, {
              value: hl
            }),
            error: ct({}, e, {
              value: Wu
            }),
            group: ct({}, e, {
              value: ml
            }),
            groupCollapsed: ct({}, e, {
              value: Qr
            }),
            groupEnd: ct({}, e, {
              value: $o
            })
          });
        }
        Ka < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Gu = w.ReactCurrentDispatcher, yl;
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
    var Xa = !1, Ja;
    {
      var qu = typeof WeakMap == "function" ? WeakMap : Map;
      Ja = new qu();
    }
    function au(e, t) {
      if (!e || Xa)
        return "";
      {
        var a = Ja.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Xa = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Gu.current, Gu.current = null, uc();
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
            } catch (H) {
              i = H;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (H) {
              i = H;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (H) {
            i = H;
          }
          e();
        }
      } catch (H) {
        if (H && i && typeof H.stack == "string") {
          for (var p = H.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, S = v.length - 1; y >= 1 && S >= 0 && p[y] !== v[S]; )
            S--;
          for (; y >= 1 && S >= 0; y--, S--)
            if (p[y] !== v[S]) {
              if (y !== 1 || S !== 1)
                do
                  if (y--, S--, S < 0 || p[y] !== v[S]) {
                    var k = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), typeof e == "function" && Ja.set(e, k), k;
                  }
                while (y >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, Gu.current = s, oc(), Error.prepareStackTrace = u;
      }
      var b = e ? e.displayName || e.name : "", U = b ? da(b) : "";
      return typeof e == "function" && Ja.set(e, U), U;
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
        case ge:
          return da("Suspense");
        case _e:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case G:
            return Ku(e.render);
          case lt:
            return Pi(e.type, t, a);
          case tt: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Gf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case re:
          return da(e.type);
        case it:
          return da("Lazy");
        case Z:
          return da("Suspense");
        case Wt:
          return da("SuspenseList");
        case Y:
        case Re:
        case he:
          return Ku(e.type);
        case We:
          return Ku(e.type.render);
        case W:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += Gf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ut(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Ju(e) {
      return e.displayName || "Context";
    }
    function Mt(e) {
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
        case ge:
          return "Suspense";
        case _e:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Ju(t) + ".Consumer";
          case vi:
            var a = e;
            return Ju(a._context) + ".Provider";
          case G:
            return Ut(e, e.render, "ForwardRef");
          case lt:
            var i = e.displayName || null;
            return i !== null ? i : Mt(e.type) || "Memo";
          case tt: {
            var u = e, s = u._payload, f = u._init;
            try {
              return Mt(f(s));
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
    function et(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case bt:
          return "Cache";
        case Qt:
          var i = a;
          return hi(i) + ".Consumer";
        case at:
          var u = a;
          return hi(u._context) + ".Provider";
        case St:
          return "DehydratedFragment";
        case We:
          return Qo(a, a.render, "ForwardRef");
        case Ne:
          return "Fragment";
        case re:
          return a;
        case de:
          return "Portal";
        case V:
          return "Root";
        case ce:
          return "Text";
        case it:
          return Mt(a);
        case Ze:
          return a === Wa ? "StrictMode" : "Mode";
        case He:
          return "Offscreen";
        case fe:
          return "Profiler";
        case wt:
          return "Scope";
        case Z:
          return "Suspense";
        case Wt:
          return "SuspenseList";
        case Nt:
          return "TracingMarker";
        case W:
        case Y:
        case Rt:
        case Re:
        case Ae:
        case he:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Zu = w.ReactDebugCurrentFrame, lr = null, mi = !1;
    function Or() {
      {
        if (lr === null)
          return null;
        var e = lr._debugOwner;
        if (e !== null && typeof e < "u")
          return et(e);
      }
      return null;
    }
    function yi() {
      return lr === null ? "" : Vi(lr);
    }
    function fn() {
      Zu.getCurrentStack = null, lr = null, mi = !1;
    }
    function Kt(e) {
      Zu.getCurrentStack = e === null ? null : yi, lr = e, mi = !1;
    }
    function Sl() {
      return lr;
    }
    function $n(e) {
      mi = e;
    }
    function Nr(e) {
      return "" + e;
    }
    function xa(e) {
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
    function qf(e) {
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
    function Za(e) {
      El(e) || (e._valueTracker = ba(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = El(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = qf(e);
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
      var a = e, i = t.checked, u = ct({}, t, {
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
        initialValue: xa(t.value != null ? t.value : i),
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
      var u = xa(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Nr(u)) : a.value !== Nr(u) && (a.value = Nr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Be(a, t.type, u) : t.hasOwnProperty("defaultValue") && Be(a, t.type, xa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function j(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Nr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function P(e, t) {
      var a = e;
      C(a, t), le(a, t);
    }
    function le(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        In(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Ah(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), C(f, p);
          }
        }
      }
    }
    function Be(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Nr(e._wrapperState.initialValue) : e.defaultValue !== Nr(a) && (e.defaultValue = Nr(a)));
    }
    var me = !1, $e = !1, Ct = !1;
    function Lt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? N.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || $e || ($e = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Ct || (Ct = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !me && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), me = !0);
    }
    function un(e, t) {
      t.value != null && e.setAttribute("value", Nr(xa(t.value)));
    }
    var Xt = Array.isArray;
    function vt(e) {
      return Xt(e);
    }
    var Jt;
    Jt = !1;
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
            var i = vt(e[a]);
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
        for (var S = Nr(xa(a)), k = null, b = 0; b < u.length; b++) {
          if (u[b].value === S) {
            u[b].selected = !0, i && (u[b].defaultSelected = !0);
            return;
          }
          k === null && !u[b].disabled && (k = u[b]);
        }
        k !== null && (k.selected = !0);
      }
    }
    function Ko(e, t) {
      return ct({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      qo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Jt && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Jt = !0);
    }
    function Kf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Bi(a, !!t.multiple, i, !1) : t.defaultValue != null && Bi(a, !!t.multiple, t.defaultValue, !0);
    }
    function sc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Bi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Bi(a, !!t.multiple, t.defaultValue, !0) : Bi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Xf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var rv = !1;
    function Jf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = ct({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Nr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Zf(e, t) {
      var a = e;
      Wo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !rv && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), rv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (vt(u)) {
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
        initialValue: xa(i)
      };
    }
    function av(e, t) {
      var a = e, i = xa(t.value), u = xa(t.defaultValue);
      if (i != null) {
        var s = Nr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Nr(u));
    }
    function iv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ey(e, t) {
      av(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", ed = "http://www.w3.org/1998/Math/MathML", td = "http://www.w3.org/2000/svg";
    function nd(e) {
      switch (e) {
        case "svg":
          return td;
        case "math":
          return ed;
        default:
          return Ii;
      }
    }
    function rd(e, t) {
      return e == null || e === Ii ? nd(t) : e === td && t === "foreignObject" ? Ii : e;
    }
    var lv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, cc, uv = lv(function(e, t) {
      if (e.namespaceURI === td && !("innerHTML" in e)) {
        cc = cc || document.createElement("div"), cc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = cc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, Ln = 8, $i = 9, ad = 11, ao = function(e, t) {
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
    }, Jo = {
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
    function ov(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var sv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Jo).forEach(function(e) {
      sv.forEach(function(t) {
        Jo[ov(t, e)] = Jo[e];
      });
    });
    function fc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Jo.hasOwnProperty(e) && Jo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var cv = /([A-Z])/g, fv = /^ms-/;
    function io(e) {
      return e.replace(cv, "-$1").toLowerCase().replace(fv, "-ms-");
    }
    var dv = function() {
    };
    {
      var ty = /^(?:webkit|moz|o)[A-Z]/, ny = /^-ms-/, pv = /-(.)/g, id = /;\s*$/, Si = {}, su = {}, vv = !1, Zo = !1, ry = function(e) {
        return e.replace(pv, function(t, a) {
          return a.toUpperCase();
        });
      }, hv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ry(e.replace(ny, "ms-"))
        ));
      }, ld = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, ud = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(id, "")));
      }, mv = function(e, t) {
        vv || (vv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, yv = function(e, t) {
        Zo || (Zo = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      dv = function(e, t) {
        e.indexOf("-") > -1 ? hv(e) : ty.test(e) ? ld(e) : id.test(t) && ud(e, t), typeof t == "number" && (isNaN(t) ? mv(e, t) : isFinite(t) || yv(e, t));
      };
    }
    var gv = dv;
    function ay(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : io(i)) + ":", t += fc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function Sv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || gv(i, t[i]);
          var s = fc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function iy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Ev(e) {
      var t = {};
      for (var a in e)
        for (var i = Xo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function ly(e, t) {
      {
        if (!t)
          return;
        var a = Ev(e), i = Ev(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", iy(e[f]) ? "Removing" : "Updating", f, p);
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
    }, es = ct({
      menuitem: !0
    }, ti), Cv = "__html";
    function dc(e, t) {
      if (t) {
        if (es[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Cv in t.dangerouslySetInnerHTML))
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
    }, pc = {
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
    }, lo = {}, uy = new RegExp("^(aria)-[" + pe + "]*$"), uo = new RegExp("^(aria)[A-Z][" + pe + "]*$");
    function od(e, t) {
      {
        if (br.call(lo, t) && lo[t])
          return !0;
        if (uo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), lo[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), lo[t] = !0, !0;
        }
        if (uy.test(t)) {
          var u = t.toLowerCase(), s = pc.hasOwnProperty(u) ? u : null;
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
          var u = od(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function sd(e, t) {
      Tl(e, t) || ns(e, t);
    }
    var cd = !1;
    function vc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !cd && (cd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var ur = {}, fd = /^on./, hc = /^on[^A-Z]/, Rv = new RegExp("^(aria)-[" + pe + "]*$"), Tv = new RegExp("^(aria)[A-Z][" + pe + "]*$");
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
          if (fd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), ur[t] = !0, !0;
        } else if (fd.test(t))
          return hc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ur[t] = !0, !0;
        if (Rv.test(t) || Tv.test(t))
          return !0;
        if (u === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), ur[t] = !0, !0;
        if (u === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), ur[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), ur[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), ur[t] = !0, !0;
        var v = an(t), y = v !== null && v.type === Yn;
        if (ts.hasOwnProperty(u)) {
          var S = ts[u];
          if (S !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, S), ur[t] = !0, !0;
        } else if (!y && t !== u)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), ur[t] = !0, !0;
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ur[t] = !0, !0) : y ? !0 : sn(t, a, v, !1) ? (ur[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Mn && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ur[t] = !0), !0);
      };
    }
    var wv = function(e, t, a) {
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
    function xv(e, t, a) {
      Tl(e, t) || wv(e, t, a);
    }
    var dd = 1, mc = 2, ka = 4, pd = dd | mc | ka, fu = null;
    function oy(e) {
      fu !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function sy() {
      fu === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function rs(e) {
      return e === fu;
    }
    function vd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var yc = null, du = null, It = null;
    function gc(e) {
      var t = Do(e);
      if (t) {
        if (typeof yc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Ah(a);
          yc(t.stateNode, t.type, i);
        }
      }
    }
    function Sc(e) {
      yc = e;
    }
    function oo(e) {
      du ? It ? It.push(e) : It = [e] : du = e;
    }
    function bv() {
      return du !== null || It !== null;
    }
    function Ec() {
      if (du) {
        var e = du, t = It;
        if (du = null, It = null, gc(e), t)
          for (var a = 0; a < t.length; a++)
            gc(t[a]);
      }
    }
    var so = function(e, t) {
      return e(t);
    }, as = function() {
    }, wl = !1;
    function _v() {
      var e = bv();
      e && (as(), Ec());
    }
    function kv(e, t, a) {
      if (wl)
        return e(t, a);
      wl = !0;
      try {
        return so(e, t, a);
      } finally {
        wl = !1, _v();
      }
    }
    function cy(e, t, a) {
      so = e, as = a;
    }
    function Dv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Cc(e, t, a) {
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
          return !!(a.disabled && Dv(t));
        default:
          return !1;
      }
    }
    function xl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Ah(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Cc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var is = !1;
    if (Nn)
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
    function Rc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (S) {
        this.onError(S);
      }
    }
    var Tc = Rc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var hd = document.createElement("react");
      Tc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var S = document.createEvent("Event"), k = !1, b = !0, U = window.event, H = Object.getOwnPropertyDescriptor(window, "event");
        function B() {
          hd.removeEventListener(I, Ie, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = U);
        }
        var Ee = Array.prototype.slice.call(arguments, 3);
        function Ie() {
          k = !0, B(), a.apply(i, Ee), b = !1;
        }
        var je, Ot = !1, Tt = !1;
        function L(A) {
          if (je = A.error, Ot = !0, je === null && A.colno === 0 && A.lineno === 0 && (Tt = !0), A.defaultPrevented && je != null && typeof je == "object")
            try {
              je._suppressLogging = !0;
            } catch {
            }
        }
        var I = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", L), hd.addEventListener(I, Ie, !1), S.initEvent(I, !1, !1), hd.dispatchEvent(S), H && Object.defineProperty(window, "event", H), k && b && (Ot ? Tt && (je = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : je = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(je)), window.removeEventListener("error", L), !k)
          return B(), Rc.apply(this, arguments);
      };
    }
    var Ov = Tc, co = !1, wc = null, fo = !1, Ei = null, Nv = {
      onError: function(e) {
        co = !0, wc = e;
      }
    };
    function bl(e, t, a, i, u, s, f, p, v) {
      co = !1, wc = null, Ov.apply(Nv, arguments);
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
        var e = wc;
        return co = !1, wc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function po(e) {
      return e._reactInternals;
    }
    function fy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var Pe = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), yn = (
      /*                    */
      2
    ), _t = (
      /*                       */
      4
    ), Da = (
      /*                */
      16
    ), Oa = (
      /*                 */
      32
    ), on = (
      /*                     */
      64
    ), Fe = (
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
    ), An = (
      /*                   */
      8192
    ), vo = (
      /*             */
      16384
    ), Mv = (
      /*               */
      32767
    ), os = (
      /*                   */
      32768
    ), Jn = (
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
    ), bc = (
      /*                */
      8388608
    ), _l = (
      /*               */
      16777216
    ), Ti = (
      /*              */
      33554432
    ), kl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      _t | Qn | 0
    ), Dl = yn | _t | Da | Oa | Cn | qr | An, Ol = _t | on | Cn | An, Gi = Gr | Da, zn = Wi | bc | ho, Na = w.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yn | qr)) !== Pe && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === V ? a : null;
    }
    function wi(e) {
      if (e.tag === Z) {
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
    function xi(e) {
      return e.tag === V ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function Lv(e) {
      {
        var t = Na.current;
        if (t !== null && t.tag === W) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", et(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = po(e);
      return u ? pa(u) === u : !1;
    }
    function _c(e) {
      if (pa(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function kc(e) {
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
              return _c(s), e;
            if (v === u)
              return _c(s), t;
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
      if (i.tag !== V)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = kc(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === re || e.tag === ce)
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
      var t = kc(e);
      return t !== null ? Ma(t) : null;
    }
    function Ma(e) {
      if (e.tag === re || e.tag === ce)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== de) {
          var a = Ma(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var md = x.unstable_scheduleCallback, Av = x.unstable_cancelCallback, yd = x.unstable_shouldYield, gd = x.unstable_requestPaint, Wn = x.unstable_now, Dc = x.unstable_getCurrentPriorityLevel, ss = x.unstable_ImmediatePriority, Nl = x.unstable_UserBlockingPriority, qi = x.unstable_NormalPriority, dy = x.unstable_LowPriority, mu = x.unstable_IdlePriority, Oc = x.unstable_yieldValue, zv = x.unstable_setDisableYieldValue, yu = null, xn = null, Se = null, va = !1, Jr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function mo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ke && (e = ct({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: La
        })), yu = t.inject(e), xn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Sd(e, t) {
      if (xn && typeof xn.onScheduleFiberRoot == "function")
        try {
          xn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Ed(e, t) {
      if (xn && typeof xn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Fe) === Fe;
          if (Ge) {
            var i;
            switch (t) {
              case Mr:
                i = ss;
                break;
              case _i:
                i = Nl;
                break;
              case Aa:
                i = qi;
                break;
              case za:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            xn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, g("React instrumentation encountered an error: %s", u));
        }
    }
    function Cd(e) {
      if (xn && typeof xn.onPostCommitFiberRoot == "function")
        try {
          xn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Rd(e) {
      if (xn && typeof xn.onCommitFiberUnmount == "function")
        try {
          xn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function gn(e) {
      if (typeof Oc == "function" && (zv(e), ae(e)), xn && typeof xn.setStrictMode == "function")
        try {
          xn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function La(e) {
      Se = e;
    }
    function gu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Cu; a++) {
          var i = Hv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Td(e) {
      Se !== null && typeof Se.markCommitStarted == "function" && Se.markCommitStarted(e);
    }
    function wd() {
      Se !== null && typeof Se.markCommitStopped == "function" && Se.markCommitStopped();
    }
    function ha(e) {
      Se !== null && typeof Se.markComponentRenderStarted == "function" && Se.markComponentRenderStarted(e);
    }
    function ma() {
      Se !== null && typeof Se.markComponentRenderStopped == "function" && Se.markComponentRenderStopped();
    }
    function xd(e) {
      Se !== null && typeof Se.markComponentPassiveEffectMountStarted == "function" && Se.markComponentPassiveEffectMountStarted(e);
    }
    function Uv() {
      Se !== null && typeof Se.markComponentPassiveEffectMountStopped == "function" && Se.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      Se !== null && typeof Se.markComponentPassiveEffectUnmountStarted == "function" && Se.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ml() {
      Se !== null && typeof Se.markComponentPassiveEffectUnmountStopped == "function" && Se.markComponentPassiveEffectUnmountStopped();
    }
    function Nc(e) {
      Se !== null && typeof Se.markComponentLayoutEffectMountStarted == "function" && Se.markComponentLayoutEffectMountStarted(e);
    }
    function jv() {
      Se !== null && typeof Se.markComponentLayoutEffectMountStopped == "function" && Se.markComponentLayoutEffectMountStopped();
    }
    function cs(e) {
      Se !== null && typeof Se.markComponentLayoutEffectUnmountStarted == "function" && Se.markComponentLayoutEffectUnmountStarted(e);
    }
    function bd() {
      Se !== null && typeof Se.markComponentLayoutEffectUnmountStopped == "function" && Se.markComponentLayoutEffectUnmountStopped();
    }
    function fs(e, t, a) {
      Se !== null && typeof Se.markComponentErrored == "function" && Se.markComponentErrored(e, t, a);
    }
    function bi(e, t, a) {
      Se !== null && typeof Se.markComponentSuspended == "function" && Se.markComponentSuspended(e, t, a);
    }
    function ds(e) {
      Se !== null && typeof Se.markLayoutEffectsStarted == "function" && Se.markLayoutEffectsStarted(e);
    }
    function ps() {
      Se !== null && typeof Se.markLayoutEffectsStopped == "function" && Se.markLayoutEffectsStopped();
    }
    function Su(e) {
      Se !== null && typeof Se.markPassiveEffectsStarted == "function" && Se.markPassiveEffectsStarted(e);
    }
    function _d() {
      Se !== null && typeof Se.markPassiveEffectsStopped == "function" && Se.markPassiveEffectsStopped();
    }
    function Eu(e) {
      Se !== null && typeof Se.markRenderStarted == "function" && Se.markRenderStarted(e);
    }
    function Fv() {
      Se !== null && typeof Se.markRenderYielded == "function" && Se.markRenderYielded();
    }
    function Mc() {
      Se !== null && typeof Se.markRenderStopped == "function" && Se.markRenderStopped();
    }
    function Sn(e) {
      Se !== null && typeof Se.markRenderScheduled == "function" && Se.markRenderScheduled(e);
    }
    function Lc(e, t) {
      Se !== null && typeof Se.markForceUpdateScheduled == "function" && Se.markForceUpdateScheduled(e, t);
    }
    function vs(e, t) {
      Se !== null && typeof Se.markStateUpdateScheduled == "function" && Se.markStateUpdateScheduled(e, t);
    }
    var Ve = (
      /*                         */
      0
    ), gt = (
      /*                 */
      1
    ), jt = (
      /*                    */
      2
    ), Zt = (
      /*               */
      8
    ), Ft = (
      /*              */
      16
    ), Un = Math.clz32 ? Math.clz32 : hs, Zn = Math.log, Ac = Math.LN2;
    function hs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Zn(t) / Ac | 0) | 0;
    }
    var Cu = 31, q = (
      /*                        */
      0
    ), zt = (
      /*                          */
      0
    ), qe = (
      /*                        */
      1
    ), Ll = (
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
    ), Al = (
      /*                       */
      4194240
    ), Ru = (
      /*                        */
      64
    ), zc = (
      /*                        */
      128
    ), Uc = (
      /*                        */
      256
    ), jc = (
      /*                        */
      512
    ), Fc = (
      /*                        */
      1024
    ), Hc = (
      /*                        */
      2048
    ), Pc = (
      /*                        */
      4096
    ), Vc = (
      /*                        */
      8192
    ), Bc = (
      /*                        */
      16384
    ), Tu = (
      /*                       */
      32768
    ), Ic = (
      /*                       */
      65536
    ), yo = (
      /*                       */
      131072
    ), go = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), ms = (
      /*                       */
      1048576
    ), $c = (
      /*                       */
      2097152
    ), ys = (
      /*                            */
      130023424
    ), wu = (
      /*                             */
      4194304
    ), Qc = (
      /*                             */
      8388608
    ), gs = (
      /*                             */
      16777216
    ), Wc = (
      /*                             */
      33554432
    ), Gc = (
      /*                             */
      67108864
    ), kd = wu, Ss = (
      /*          */
      134217728
    ), Dd = (
      /*                          */
      268435455
    ), Es = (
      /*               */
      268435456
    ), xu = (
      /*                        */
      536870912
    ), Zr = (
      /*                   */
      1073741824
    );
    function Hv(e) {
      {
        if (e & qe)
          return "Sync";
        if (e & Ll)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & Tr)
          return "DefaultHydration";
        if (e & bn)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & Al)
          return "Transition";
        if (e & ys)
          return "Retry";
        if (e & Ss)
          return "SelectiveHydration";
        if (e & Es)
          return "IdleHydration";
        if (e & xu)
          return "Idle";
        if (e & Zr)
          return "Offscreen";
      }
    }
    var nn = -1, bu = Ru, qc = wu;
    function Cs(e) {
      switch (zl(e)) {
        case qe:
          return qe;
        case Ll:
          return Ll;
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
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
          return e & Al;
        case wu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          return e & ys;
        case Ss:
          return Ss;
        case Es:
          return Es;
        case xu:
          return xu;
        case Zr:
          return Zr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === q)
        return q;
      var i = q, u = e.suspendedLanes, s = e.pingedLanes, f = a & Dd;
      if (f !== q) {
        var p = f & ~u;
        if (p !== q)
          i = Cs(p);
        else {
          var v = f & s;
          v !== q && (i = Cs(v));
        }
      } else {
        var y = a & ~u;
        y !== q ? i = Cs(y) : s !== q && (i = Cs(s));
      }
      if (i === q)
        return q;
      if (t !== q && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === q) {
        var S = zl(i), k = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          S >= k || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          S === bn && (k & Al) !== q
        )
          return t;
      }
      (i & ri) !== q && (i |= a & bn);
      var b = e.entangledLanes;
      if (b !== q)
        for (var U = e.entanglements, H = i & b; H > 0; ) {
          var B = jn(H), Ee = 1 << B;
          i |= U[B], H &= ~Ee;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = nn; t > 0; ) {
        var u = jn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case qe:
        case Ll:
        case ri:
          return t + 250;
        case Tr:
        case bn:
        case Xi:
        case Ru:
        case zc:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
          return t + 5e3;
        case wu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          return nn;
        case Ss:
        case Es:
        case xu:
        case Zr:
          return nn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), nn;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p, y = s[p];
        y === nn ? ((v & i) === q || (v & u) !== q) && (s[p] = Od(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Pv(e) {
      return Cs(e.pendingLanes);
    }
    function Jc(e) {
      var t = e.pendingLanes & ~Zr;
      return t !== q ? t : t & Zr ? Zr : q;
    }
    function Vv(e) {
      return (e & qe) !== q;
    }
    function Rs(e) {
      return (e & Dd) !== q;
    }
    function _u(e) {
      return (e & ys) === e;
    }
    function Nd(e) {
      var t = qe | ri | bn;
      return (e & t) === q;
    }
    function Md(e) {
      return (e & Al) === e;
    }
    function Zc(e, t) {
      var a = Ll | ri | Tr | bn;
      return (t & a) !== q;
    }
    function Bv(e, t) {
      return (t & e.expiredLanes) !== q;
    }
    function Ld(e) {
      return (e & Al) !== q;
    }
    function Ad() {
      var e = bu;
      return bu <<= 1, (bu & Al) === q && (bu = Ru), e;
    }
    function Iv() {
      var e = qc;
      return qc <<= 1, (qc & ys) === q && (qc = wu), e;
    }
    function zl(e) {
      return e & -e;
    }
    function Ts(e) {
      return zl(e);
    }
    function jn(e) {
      return 31 - Un(e);
    }
    function or(e) {
      return jn(e);
    }
    function ea(e, t) {
      return (e & t) !== q;
    }
    function ku(e, t) {
      return (e & t) === t;
    }
    function ot(e, t) {
      return e | t;
    }
    function ws(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function Yv(e) {
      return e;
    }
    function $v(e, t) {
      return e !== zt && e < t ? e : t;
    }
    function xs(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function So(e, t, a) {
      e.pendingLanes |= t, t !== xu && (e.suspendedLanes = q, e.pingedLanes = q);
      var i = e.eventTimes, u = or(t);
      i[u] = a;
    }
    function Qv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = jn(i), s = 1 << u;
        a[u] = nn, i &= ~s;
      }
    }
    function ef(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ud(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = q, e.pingedLanes = q, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p;
        i[p] = q, u[p] = nn, s[p] = nn, f &= ~v;
      }
    }
    function tf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = jn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function jd(e, t) {
      var a = zl(t), i;
      switch (a) {
        case ri:
          i = Ll;
          break;
        case bn:
          i = Tr;
          break;
        case Ru:
        case zc:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
        case wu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          i = Xi;
          break;
        case xu:
          i = Es;
          break;
        default:
          i = zt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== zt ? zt : i;
    }
    function bs(e, t, a) {
      if (Jr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = or(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Wv(e, t) {
      if (Jr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = or(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Fd(e, t) {
      return null;
    }
    var Mr = qe, _i = ri, Aa = bn, za = xu, _s = zt;
    function Ua() {
      return _s;
    }
    function Fn(e) {
      _s = e;
    }
    function Gv(e, t) {
      var a = _s;
      try {
        return _s = e, t();
      } finally {
        _s = a;
      }
    }
    function qv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function ks(e, t) {
      return e > t ? e : t;
    }
    function er(e, t) {
      return e !== 0 && e < t;
    }
    function Kv(e) {
      var t = zl(e);
      return er(Mr, t) ? er(_i, t) ? Rs(t) ? Aa : za : _i : Mr;
    }
    function nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ds;
    function wr(e) {
      Ds = e;
    }
    function py(e) {
      Ds(e);
    }
    var be;
    function Eo(e) {
      be = e;
    }
    var rf;
    function Xv(e) {
      rf = e;
    }
    var Jv;
    function Os(e) {
      Jv = e;
    }
    var Ns;
    function Hd(e) {
      Ns = e;
    }
    var af = !1, Ms = [], Ji = null, ki = null, Di = null, _n = /* @__PURE__ */ new Map(), Lr = /* @__PURE__ */ new Map(), Ar = [], Zv = [
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
    function eh(e) {
      return Zv.indexOf(e) > -1;
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
    function Pd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ji = null;
          break;
        case "dragenter":
        case "dragleave":
          ki = null;
          break;
        case "mouseover":
        case "mouseout":
          Di = null;
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
          Lr.delete(i);
          break;
        }
      }
    }
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = Do(t);
          p !== null && be(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function vy(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Ji = ta(Ji, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return ki = ta(ki, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Di = ta(Di, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return _n.set(y, ta(_n.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var S = u, k = S.pointerId;
          return Lr.set(k, ta(Lr.get(k) || null, e, t, a, i, S)), !0;
        }
      }
      return !1;
    }
    function Vd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === Z) {
            var u = wi(a);
            if (u !== null) {
              e.blockedOn = u, Ns(e.priority, function() {
                rf(a);
              });
              return;
            }
          } else if (i === V) {
            var s = a.stateNode;
            if (nf(s)) {
              e.blockedOn = xi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function th(e) {
      for (var t = Jv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Ar.length && er(t, Ar[i].priority); i++)
        ;
      Ar.splice(i, 0, a), i === 0 && Vd(a);
    }
    function Ls(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Ro(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          oy(s), u.target.dispatchEvent(s), sy();
        } else {
          var f = Do(i);
          return f !== null && be(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Bd(e, t, a) {
      Ls(e) && a.delete(t);
    }
    function hy() {
      af = !1, Ji !== null && Ls(Ji) && (Ji = null), ki !== null && Ls(ki) && (ki = null), Di !== null && Ls(Di) && (Di = null), _n.forEach(Bd), Lr.forEach(Bd);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, x.unstable_scheduleCallback(x.unstable_NormalPriority, hy)));
    }
    function Du(e) {
      if (Ms.length > 0) {
        Ul(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && Ul(Ji, e), ki !== null && Ul(ki, e), Di !== null && Ul(Di, e);
      var i = function(p) {
        return Ul(p, e);
      };
      _n.forEach(i), Lr.forEach(i);
      for (var u = 0; u < Ar.length; u++) {
        var s = Ar[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Ar.length > 0; ) {
        var f = Ar[0];
        if (f.blockedOn !== null)
          break;
        Vd(f), f.blockedOn === null && Ar.shift();
      }
    }
    var sr = w.ReactCurrentBatchConfig, kt = !0;
    function Gn(e) {
      kt = !!e;
    }
    function Hn() {
      return kt;
    }
    function cr(e, t, a) {
      var i = lf(t), u;
      switch (i) {
        case Mr:
          u = ya;
          break;
        case _i:
          u = Co;
          break;
        case Aa:
        default:
          u = kn;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = Ua(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(Mr), kn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = Ua(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(_i), kn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function kn(e, t, a, i) {
      kt && As(e, t, a, i);
    }
    function As(e, t, a, i) {
      var u = Ro(e, t, a, i);
      if (u === null) {
        My(e, t, i, Oi, a), Pd(e, i);
        return;
      }
      if (vy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Pd(e, i), t & ka && eh(e)) {
        for (; u !== null; ) {
          var s = Do(u);
          s !== null && py(s);
          var f = Ro(e, t, a, i);
          if (f === null && My(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      My(e, t, i, null, a);
    }
    var Oi = null;
    function Ro(e, t, a, i) {
      Oi = null;
      var u = vd(i), s = Ys(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === Z) {
            var v = wi(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === V) {
            var y = f.stateNode;
            if (nf(y))
              return xi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Oi = s, null;
    }
    function lf(e) {
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
          return Mr;
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
              return Mr;
            case Nl:
              return _i;
            case qi:
            case dy:
              return Aa;
            case mu:
              return za;
            default:
              return Aa;
          }
        }
        default:
          return Aa;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Id(e, t, a, i) {
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
    var ga = null, wo = null, Ou = null;
    function jl(e) {
      return ga = e, wo = Us(), !0;
    }
    function uf() {
      ga = null, wo = null, Ou = null;
    }
    function Zi() {
      if (Ou)
        return Ou;
      var e, t = wo, a = t.length, i, u = Us(), s = u.length;
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
    function xo() {
      return !0;
    }
    function js() {
      return !1;
    }
    function xr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = xo : this.isDefaultPrevented = js, this.isPropagationStopped = js, this;
      }
      return ct(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = xo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = xo);
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
        isPersistent: xo
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
    }, Ni = xr(Pn), zr = ct({}, Pn, {
      view: 0,
      detail: 0
    }), ra = xr(zr), of, Fs, Nu;
    function my(e) {
      e !== Nu && (Nu && e.type === "mousemove" ? (of = e.screenX - Nu.screenX, Fs = e.screenY - Nu.screenY) : (of = 0, Fs = 0), Nu = e);
    }
    var li = ct({}, zr, {
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
        return "movementX" in e ? e.movementX : (my(e), of);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Fs;
      }
    }), Yd = xr(li), $d = ct({}, li, {
      dataTransfer: 0
    }), Mu = xr($d), Qd = ct({}, zr, {
      relatedTarget: 0
    }), el = xr(Qd), nh = ct({}, Pn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), rh = xr(nh), Wd = ct({}, Pn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), sf = xr(Wd), yy = ct({}, Pn, {
      data: 0
    }), ah = xr(yy), ih = ah, lh = {
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
    }, Lu = {
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
    function gy(e) {
      if (e.key) {
        var t = lh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Lu[e.keyCode] || "Unidentified" : "";
    }
    var bo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function uh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = bo[e];
      return i ? !!a[i] : !1;
    }
    function vn(e) {
      return uh;
    }
    var Sy = ct({}, zr, {
      key: gy,
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
    }), oh = xr(Sy), Ey = ct({}, li, {
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
    }), sh = xr(Ey), ch = ct({}, zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), fh = xr(ch), Cy = ct({}, Pn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ja = xr(Cy), Gd = ct({}, li, {
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
    }), Ry = xr(Gd), Hl = [9, 13, 27, 32], Hs = 229, tl = Nn && "CompositionEvent" in window, Pl = null;
    Nn && "documentMode" in document && (Pl = document.documentMode);
    var qd = Nn && "TextEvent" in window && !Pl, cf = Nn && (!tl || Pl && Pl > 8 && Pl <= 11), dh = 32, ff = String.fromCharCode(dh);
    function Ty() {
      mt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), mt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), mt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), mt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Kd = !1;
    function ph(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function df(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function pf(e, t) {
      return e === "keydown" && t.keyCode === Hs;
    }
    function Xd(e, t) {
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
    function vf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function vh(e) {
      return e.locale === "ko";
    }
    var Au = !1;
    function Jd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = df(t) : Au ? Xd(t, i) && (s = "onCompositionEnd") : pf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      cf && !vh(i) && (!Au && s === "onCompositionStart" ? Au = jl(u) : s === "onCompositionEnd" && Au && (f = Zi()));
      var p = Ch(a, s);
      if (p.length > 0) {
        var v = new ah(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = vf(i);
          y !== null && (v.data = y);
        }
      }
    }
    function hf(e, t) {
      switch (e) {
        case "compositionend":
          return vf(t);
        case "keypress":
          var a = t.which;
          return a !== dh ? null : (Kd = !0, ff);
        case "textInput":
          var i = t.data;
          return i === ff && Kd ? null : i;
        default:
          return null;
      }
    }
    function Zd(e, t) {
      if (Au) {
        if (e === "compositionend" || !tl && Xd(e, t)) {
          var a = Zi();
          return uf(), Au = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!ph(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return cf && !vh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function mf(e, t, a, i, u) {
      var s;
      if (qd ? s = hf(t, i) : s = Zd(t, i), !s)
        return null;
      var f = Ch(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new ih("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function hh(e, t, a, i, u, s, f) {
      Jd(e, t, a, i, u), mf(e, t, a, i, u);
    }
    var wy = {
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
      return t === "input" ? !!wy[e.type] : t === "textarea";
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
    function xy(e) {
      if (!Nn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      mt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function mh(e, t, a, i) {
      oo(i);
      var u = Ch(t, "onChange");
      if (u.length > 0) {
        var s = new Ni("onChange", "change", null, a, i);
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
      mh(t, n, e, vd(e)), kv(o, t);
    }
    function o(e) {
      AE(e, 0);
    }
    function c(e) {
      var t = Rf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    Nn && (m = xy("input") && (!document.documentMode || document.documentMode > 9));
    function E(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", F);
    }
    function T() {
      Vl && (Vl.detachEvent("onpropertychange", F), Vl = null, n = null);
    }
    function F(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function X(e, t, a) {
      e === "focusin" ? (T(), E(t, a)) : e === "focusout" && T();
    }
    function te(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function K(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Te(e, t) {
      if (e === "click")
        return c(t);
    }
    function ke(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function ze(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Be(e, "number", e.value);
    }
    function Dn(e, t, a, i, u, s, f) {
      var p = a ? Rf(a) : window, v, y;
      if (r(p) ? v = d : Ps(p) ? m ? v = ke : (v = te, y = X) : K(p) && (v = Te), v) {
        var S = v(t, a);
        if (S) {
          mh(e, S, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && ze(p);
    }
    function M() {
      $t("onMouseEnter", ["mouseout", "mouseover"]), $t("onMouseLeave", ["mouseout", "mouseover"]), $t("onPointerEnter", ["pointerout", "pointerover"]), $t("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function _(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !rs(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ys(y) || pp(y)))
          return;
      }
      if (!(!v && !p)) {
        var S;
        if (u.window === u)
          S = u;
        else {
          var k = u.ownerDocument;
          k ? S = k.defaultView || k.parentWindow : S = window;
        }
        var b, U;
        if (v) {
          var H = i.relatedTarget || i.toElement;
          if (b = a, U = H ? Ys(H) : null, U !== null) {
            var B = pa(U);
            (U !== B || U.tag !== re && U.tag !== ce) && (U = null);
          }
        } else
          b = null, U = a;
        if (b !== U) {
          var Ee = Yd, Ie = "onMouseLeave", je = "onMouseEnter", Ot = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ee = sh, Ie = "onPointerLeave", je = "onPointerEnter", Ot = "pointer");
          var Tt = b == null ? S : Rf(b), L = U == null ? S : Rf(U), I = new Ee(Ie, Ot + "leave", b, i, u);
          I.target = Tt, I.relatedTarget = L;
          var A = null, ne = Ys(u);
          if (ne === a) {
            var xe = new Ee(je, Ot + "enter", U, i, u);
            xe.target = L, xe.relatedTarget = Tt, A = xe;
          }
          UT(e, I, A, b, U);
        }
      }
    }
    function z(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var J = typeof Object.is == "function" ? Object.is : z;
    function De(e, t) {
      if (J(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!br.call(t, s) || !J(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Ye(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Qe(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Je(e, t) {
      for (var a = Ye(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Ye(Qe(a));
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
      return Ht(e, u, s, f, p);
    }
    function Ht(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, S = e, k = null;
      e: for (; ; ) {
        for (var b = null; S === t && (a === 0 || S.nodeType === Yi) && (f = s + a), S === i && (u === 0 || S.nodeType === Yi) && (p = s + u), S.nodeType === Yi && (s += S.nodeValue.length), (b = S.firstChild) !== null; )
          k = S, S = b;
        for (; ; ) {
          if (S === e)
            break e;
          if (k === t && ++v === a && (f = s), k === i && ++y === u && (p = s), (b = S.nextSibling) !== null)
            break;
          S = k, k = S.parentNode;
        }
        S = b;
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
        var y = Je(e, f), S = Je(e, p);
        if (y && S) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === S.node && u.focusOffset === S.offset)
            return;
          var k = a.createRange();
          k.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(k), u.extend(S.node, S.offset)) : (k.setEnd(S.node, S.offset), u.addRange(k));
        }
      }
    }
    function yh(e) {
      return e && e.nodeType === Yi;
    }
    function TE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : yh(e) ? !1 : yh(t) ? TE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function gT(e) {
      return e && e.ownerDocument && TE(e.ownerDocument.documentElement, e);
    }
    function ST(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function wE() {
      for (var e = window, t = _a(); t instanceof e.HTMLIFrameElement; ) {
        if (ST(t))
          e = t.contentWindow;
        else
          return t;
        t = _a(e.document);
      }
      return t;
    }
    function by(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function ET() {
      var e = wE();
      return {
        focusedElem: e,
        selectionRange: by(e) ? RT(e) : null
      };
    }
    function CT(e) {
      var t = wE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && gT(a)) {
        i !== null && by(a) && TT(a, i);
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
    function RT(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = tr(e), t || {
        start: 0,
        end: 0
      };
    }
    function TT(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var wT = Nn && "documentMode" in document && document.documentMode <= 11;
    function xT() {
      mt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var yf = null, _y = null, ep = null, ky = !1;
    function bT(e) {
      if ("selectionStart" in e && by(e))
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
    function _T(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function xE(e, t, a) {
      var i = _T(a);
      if (!(ky || yf == null || yf !== _a(i))) {
        var u = bT(yf);
        if (!ep || !De(ep, u)) {
          ep = u;
          var s = Ch(_y, "onSelect");
          if (s.length > 0) {
            var f = new Ni("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = yf;
          }
        }
      }
    }
    function kT(e, t, a, i, u, s, f) {
      var p = a ? Rf(a) : window;
      switch (t) {
        case "focusin":
          (Ps(p) || p.contentEditable === "true") && (yf = p, _y = a, ep = null);
          break;
        case "focusout":
          yf = null, _y = null, ep = null;
          break;
        case "mousedown":
          ky = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ky = !1, xE(e, i, u);
          break;
        case "selectionchange":
          if (wT)
            break;
        case "keydown":
        case "keyup":
          xE(e, i, u);
      }
    }
    function gh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var gf = {
      animationend: gh("Animation", "AnimationEnd"),
      animationiteration: gh("Animation", "AnimationIteration"),
      animationstart: gh("Animation", "AnimationStart"),
      transitionend: gh("Transition", "TransitionEnd")
    }, Dy = {}, bE = {};
    Nn && (bE = document.createElement("div").style, "AnimationEvent" in window || (delete gf.animationend.animation, delete gf.animationiteration.animation, delete gf.animationstart.animation), "TransitionEvent" in window || delete gf.transitionend.transition);
    function Sh(e) {
      if (Dy[e])
        return Dy[e];
      if (!gf[e])
        return e;
      var t = gf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in bE)
          return Dy[e] = t[a];
      return e;
    }
    var _E = Sh("animationend"), kE = Sh("animationiteration"), DE = Sh("animationstart"), OE = Sh("transitionend"), NE = /* @__PURE__ */ new Map(), ME = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function _o(e, t) {
      NE.set(e, t), mt(t, [e]);
    }
    function DT() {
      for (var e = 0; e < ME.length; e++) {
        var t = ME[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        _o(a, "on" + i);
      }
      _o(_E, "onAnimationEnd"), _o(kE, "onAnimationIteration"), _o(DE, "onAnimationStart"), _o("dblclick", "onDoubleClick"), _o("focusin", "onFocus"), _o("focusout", "onBlur"), _o(OE, "onTransitionEnd");
    }
    function OT(e, t, a, i, u, s, f) {
      var p = NE.get(t);
      if (p !== void 0) {
        var v = Ni, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = oh;
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
            v = Yd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Mu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = fh;
            break;
          case _E:
          case kE:
          case DE:
            v = rh;
            break;
          case OE:
            v = ja;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = Ry;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = sf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = sh;
            break;
        }
        var S = (s & ka) !== 0;
        {
          var k = !S && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", b = AT(a, p, i.type, S, k);
          if (b.length > 0) {
            var U = new v(p, y, null, i, u);
            e.push({
              event: U,
              listeners: b
            });
          }
        }
      }
    }
    DT(), M(), Vs(), xT(), Ty();
    function NT(e, t, a, i, u, s, f) {
      OT(e, t, a, i, u, s);
      var p = (s & pd) === 0;
      p && (_(e, t, a, i, u), Dn(e, t, a, i, u), kT(e, t, a, i, u), hh(e, t, a, i, u));
    }
    var tp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Oy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(tp));
    function LE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function MT(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          LE(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var S = t[y], k = S.instance, b = S.currentTarget, U = S.listener;
          if (k !== i && e.isPropagationStopped())
            return;
          LE(e, U, b), i = k;
        }
    }
    function AE(e, t) {
      for (var a = (t & ka) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        MT(s, f, a);
      }
      ls();
    }
    function LT(e, t, a, i, u) {
      var s = vd(a), f = [];
      NT(f, e, i, a, s, t), AE(f, t);
    }
    function En(e, t) {
      Oy.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = sx(t), u = jT(e);
      i.has(u) || (zE(t, e, mc, a), i.add(u));
    }
    function Ny(e, t, a) {
      Oy.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= ka), zE(a, e, i, t);
    }
    var Eh = "_reactListening" + Math.random().toString(36).slice(2);
    function np(e) {
      if (!e[Eh]) {
        e[Eh] = !0, ft.forEach(function(a) {
          a !== "selectionchange" && (Oy.has(a) || Ny(a, !1, e), Ny(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[Eh] || (t[Eh] = !0, Ny("selectionchange", !1, t)));
      }
    }
    function zE(e, t, a, i, u) {
      var s = cr(e, t, a), f = void 0;
      is && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Id(e, t, s, f) : na(e, t, s) : f !== void 0 ? To(e, t, s, f) : zs(e, t, s);
    }
    function UE(e, t) {
      return e === t || e.nodeType === Ln && e.parentNode === t;
    }
    function My(e, t, a, i, u) {
      var s = i;
      if (!(t & dd) && !(t & mc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === V || v === de) {
              var y = p.stateNode.containerInfo;
              if (UE(y, f))
                break;
              if (v === de)
                for (var S = p.return; S !== null; ) {
                  var k = S.tag;
                  if (k === V || k === de) {
                    var b = S.stateNode.containerInfo;
                    if (UE(b, f))
                      return;
                  }
                  S = S.return;
                }
              for (; y !== null; ) {
                var U = Ys(y);
                if (U === null)
                  return;
                var H = U.tag;
                if (H === re || H === ce) {
                  p = s = U;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      kv(function() {
        return LT(e, t, a, s);
      });
    }
    function rp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function AT(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, S = null; y !== null; ) {
        var k = y, b = k.stateNode, U = k.tag;
        if (U === re && b !== null && (S = b, p !== null)) {
          var H = xl(y, p);
          H != null && v.push(rp(y, H, S));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function Ch(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === re && f !== null) {
          var v = f, y = xl(u, a);
          y != null && i.unshift(rp(u, y, v));
          var S = xl(u, t);
          S != null && i.push(rp(u, S, v));
        }
        u = u.return;
      }
      return i;
    }
    function Sf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== re);
      return e || null;
    }
    function zT(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = Sf(s))
        u++;
      for (var f = 0, p = i; p; p = Sf(p))
        f++;
      for (; u - f > 0; )
        a = Sf(a), u--;
      for (; f - u > 0; )
        i = Sf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Sf(a), i = Sf(i);
      }
      return null;
    }
    function jE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, S = v.stateNode, k = v.tag;
        if (y !== null && y === i)
          break;
        if (k === re && S !== null) {
          var b = S;
          if (u) {
            var U = xl(p, s);
            U != null && f.unshift(rp(p, U, b));
          } else if (!u) {
            var H = xl(p, s);
            H != null && f.push(rp(p, H, b));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function UT(e, t, a, i, u) {
      var s = i && u ? zT(i, u) : null;
      i !== null && jE(e, t, i, s, !1), u !== null && a !== null && jE(e, a, u, s, !0);
    }
    function jT(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, ap = "dangerouslySetInnerHTML", Rh = "suppressContentEditableWarning", ko = "suppressHydrationWarning", FE = "autoFocus", Bs = "children", Is = "style", Th = "__html", Ly, wh, ip, HE, xh, PE, VE;
    Ly = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, wh = function(e, t) {
      sd(e, t), vc(e, t), xv(e, t, {
        registrationNameDependencies: st,
        possibleRegistrationNames: dt
      });
    }, PE = Nn && !document.documentMode, ip = function(e, t, a) {
      if (!Fa) {
        var i = bh(a), u = bh(t);
        u !== i && (Fa = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, HE = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, xh = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, VE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var FT = /\r\n?/g, HT = /\u0000|\uFFFD/g;
    function bh(e) {
      Kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(FT, `
`).replace(HT, "");
    }
    function _h(e, t, a, i) {
      var u = bh(t), s = bh(e);
      if (s !== u && (i && (Fa || (Fa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Me))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function BE(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function PT() {
    }
    function kh(e) {
      e.onclick = PT;
    }
    function VT(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Is)
            f && Object.freeze(f), Sv(t, f);
          else if (s === ap) {
            var p = f ? f[Th] : void 0;
            p != null && uv(t, p);
          } else if (s === Bs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ao(t, f);
            } else typeof f == "number" && ao(t, "" + f);
          else s === Rh || s === ko || s === FE || (st.hasOwnProperty(s) ? f != null && (typeof f != "function" && xh(s, f), s === "onScroll" && En("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function BT(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Is ? Sv(e, f) : s === ap ? uv(e, f) : s === Bs ? ao(e, f) : _r(e, s, f, i);
      }
    }
    function IT(e, t, a, i) {
      var u, s = BE(a), f, p = i;
      if (p === Ii && (p = nd(e)), p === Ii) {
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
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(Ly, e) && (Ly[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function YT(e, t) {
      return BE(t).createTextNode(e);
    }
    function $T(e, t, a, i) {
      var u = Tl(t, a);
      wh(t, a);
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
          for (var f = 0; f < tp.length; f++)
            En(tp[f], e);
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
          Lt(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Ko(e, a), En("invalid", e);
          break;
        case "textarea":
          Zf(e, a), s = Jf(e, a), En("invalid", e);
          break;
        default:
          s = a;
      }
      switch (dc(t, s), VT(t, e, i, s, u), t) {
        case "input":
          Za(e), j(e, a, !1);
          break;
        case "textarea":
          Za(e), iv(e);
          break;
        case "option":
          un(e, a);
          break;
        case "select":
          Kf(e, a);
          break;
        default:
          typeof s.onClick == "function" && kh(e);
          break;
      }
    }
    function QT(e, t, a, i, u) {
      wh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ro(e, a), p = ro(e, i), s = [];
          break;
        case "select":
          f = Ko(e, a), p = Ko(e, i), s = [];
          break;
        case "textarea":
          f = Jf(e, a), p = Jf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && kh(e);
          break;
      }
      dc(t, p);
      var v, y, S = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Is) {
            var k = f[v];
            for (y in k)
              k.hasOwnProperty(y) && (S || (S = {}), S[y] = "");
          } else v === ap || v === Bs || v === Rh || v === ko || v === FE || (st.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var b = p[v], U = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || b === U || b == null && U == null))
          if (v === Is)
            if (b && Object.freeze(b), U) {
              for (y in U)
                U.hasOwnProperty(y) && (!b || !b.hasOwnProperty(y)) && (S || (S = {}), S[y] = "");
              for (y in b)
                b.hasOwnProperty(y) && U[y] !== b[y] && (S || (S = {}), S[y] = b[y]);
            } else
              S || (s || (s = []), s.push(v, S)), S = b;
          else if (v === ap) {
            var H = b ? b[Th] : void 0, B = U ? U[Th] : void 0;
            H != null && B !== H && (s = s || []).push(v, H);
          } else v === Bs ? (typeof b == "string" || typeof b == "number") && (s = s || []).push(v, "" + b) : v === Rh || v === ko || (st.hasOwnProperty(v) ? (b != null && (typeof b != "function" && xh(v, b), v === "onScroll" && En("scroll", e)), !s && U !== b && (s = [])) : (s = s || []).push(v, b));
      }
      return S && (ly(S, p[Is]), (s = s || []).push(Is, S)), s;
    }
    function WT(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = Tl(a, i), f = Tl(a, u);
      switch (BT(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          av(e, u);
          break;
        case "select":
          sc(e, u);
          break;
      }
    }
    function GT(e) {
      {
        var t = e.toLowerCase();
        return ts.hasOwnProperty(t) && ts[t] || null;
      }
    }
    function qT(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Tl(t, a), wh(t, a), t) {
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
          for (var y = 0; y < tp.length; y++)
            En(tp[y], e);
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
          Lt(e, a);
          break;
        case "select":
          ou(e, a), En("invalid", e);
          break;
        case "textarea":
          Zf(e, a), En("invalid", e);
          break;
      }
      dc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var S = e.attributes, k = 0; k < S.length; k++) {
          var b = S[k].name.toLowerCase();
          switch (b) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(S[k].name);
          }
        }
      }
      var U = null;
      for (var H in a)
        if (a.hasOwnProperty(H)) {
          var B = a[H];
          if (H === Bs)
            typeof B == "string" ? e.textContent !== B && (a[ko] !== !0 && _h(e.textContent, B, s, f), U = [Bs, B]) : typeof B == "number" && e.textContent !== "" + B && (a[ko] !== !0 && _h(e.textContent, B, s, f), U = [Bs, "" + B]);
          else if (st.hasOwnProperty(H))
            B != null && (typeof B != "function" && xh(H, B), H === "onScroll" && En("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var Ee = void 0, Ie = an(H);
            if (a[ko] !== !0) {
              if (!(H === Rh || H === ko || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              H === "value" || H === "checked" || H === "selected")) {
                if (H === ap) {
                  var je = e.innerHTML, Ot = B ? B[Th] : void 0;
                  if (Ot != null) {
                    var Tt = VE(e, Ot);
                    Tt !== je && ip(H, je, Tt);
                  }
                } else if (H === Is) {
                  if (v.delete(H), PE) {
                    var L = ay(B);
                    Ee = e.getAttribute("style"), L !== Ee && ip(H, Ee, L);
                  }
                } else if (p && !D)
                  v.delete(H.toLowerCase()), Ee = tu(e, H, B), B !== Ee && ip(H, Ee, B);
                else if (!hn(H, Ie, p) && !Xn(H, B, Ie, p)) {
                  var I = !1;
                  if (Ie !== null)
                    v.delete(Ie.attributeName), Ee = vl(e, H, B, Ie);
                  else {
                    var A = i;
                    if (A === Ii && (A = nd(t)), A === Ii)
                      v.delete(H.toLowerCase());
                    else {
                      var ne = GT(H);
                      ne !== null && ne !== H && (I = !0, v.delete(ne)), v.delete(H);
                    }
                    Ee = tu(e, H, B);
                  }
                  var xe = D;
                  !xe && B !== Ee && !I && ip(H, Ee, B);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[ko] !== !0 && HE(v), t) {
        case "input":
          Za(e), j(e, a, !0);
          break;
        case "textarea":
          Za(e), iv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && kh(e);
          break;
      }
      return U;
    }
    function KT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Ay(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function zy(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t, a) {
      {
        if (Fa)
          return;
        Fa = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function jy(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function XT(e, t, a) {
      switch (t) {
        case "input":
          P(e, a);
          return;
        case "textarea":
          ey(e, a);
          return;
        case "select":
          Xf(e, a);
          return;
      }
    }
    var lp = function() {
    }, up = function() {
    };
    {
      var JT = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], IE = [
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
      ], ZT = IE.concat(["button"]), ew = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], YE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      up = function(e, t) {
        var a = ct({}, e || YE), i = {
          tag: t
        };
        return IE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), ZT.indexOf(t) !== -1 && (a.pTagInButtonScope = null), JT.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var tw = function(e, t) {
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
            return ew.indexOf(t) === -1;
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
      }, nw = function(e, t) {
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
      }, $E = {};
      lp = function(e, t, a) {
        a = a || YE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = tw(e, u) ? null : i, f = s ? null : nw(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!$E[y]) {
            $E[y] = !0;
            var S = e, k = "";
            if (e === "#text" ? /\S/.test(t) ? S = "Text nodes" : (S = "Whitespace text nodes", k = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : S = "<" + e + ">", s) {
              var b = "";
              v === "table" && e === "tr" && (b += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", S, v, k, b);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", S, v);
          }
        }
      };
    }
    var Dh = "suppressHydrationWarning", Oh = "$", Nh = "/$", op = "$?", sp = "$!", rw = "style", Fy = null, Hy = null;
    function aw(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case ad: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : rd(null, "");
          break;
        }
        default: {
          var s = i === Ln ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = rd(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = up(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function iw(e, t, a) {
      {
        var i = e, u = rd(i.namespace, t), s = up(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function qk(e) {
      return e;
    }
    function lw(e) {
      Fy = Hn(), Hy = ET();
      var t = null;
      return Gn(!1), t;
    }
    function uw(e) {
      CT(Hy), Gn(Fy), Fy = null, Hy = null;
    }
    function ow(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (lp(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = up(f.ancestorInfo, e);
          lp(null, p, v);
        }
        s = f.namespace;
      }
      var y = IT(e, t, a, s);
      return dp(u, y), Wy(y, t), y;
    }
    function sw(e, t) {
      e.appendChild(t);
    }
    function cw(e, t, a, i, u) {
      switch ($T(e, t, a, i), t) {
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
    function fw(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = up(f.ancestorInfo, t);
          lp(null, p, v);
        }
      }
      return QT(e, t, a, i);
    }
    function Py(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function dw(e, t, a, i) {
      {
        var u = a;
        lp(null, e, u.ancestorInfo);
      }
      var s = YT(e, t);
      return dp(i, s), s;
    }
    function pw() {
      var e = window.event;
      return e === void 0 ? Aa : lf(e.type);
    }
    var Vy = typeof setTimeout == "function" ? setTimeout : void 0, vw = typeof clearTimeout == "function" ? clearTimeout : void 0, By = -1, QE = typeof Promise == "function" ? Promise : void 0, hw = typeof queueMicrotask == "function" ? queueMicrotask : typeof QE < "u" ? function(e) {
      return QE.resolve(null).then(e).catch(mw);
    } : Vy;
    function mw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function yw(e, t, a, i) {
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
    function gw(e, t, a, i, u, s) {
      WT(e, t, a, i, u), Wy(e, u);
    }
    function WE(e) {
      ao(e, "");
    }
    function Sw(e, t, a) {
      e.nodeValue = a;
    }
    function Ew(e, t) {
      e.appendChild(t);
    }
    function Cw(e, t) {
      var a;
      e.nodeType === Ln ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && kh(a);
    }
    function Rw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Tw(e, t, a) {
      e.nodeType === Ln ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function ww(e, t) {
      e.removeChild(t);
    }
    function xw(e, t) {
      e.nodeType === Ln ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Iy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Ln) {
          var s = u.data;
          if (s === Nh)
            if (i === 0) {
              e.removeChild(u), Du(t);
              return;
            } else
              i--;
          else (s === Oh || s === op || s === sp) && i++;
        }
        a = u;
      } while (a);
      Du(t);
    }
    function bw(e, t) {
      e.nodeType === Ln ? Iy(e.parentNode, t) : e.nodeType === Wr && Iy(e, t), Du(e);
    }
    function _w(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function kw(e) {
      e.nodeValue = "";
    }
    function Dw(e, t) {
      e = e;
      var a = t[rw], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = fc("display", i);
    }
    function Ow(e, t) {
      e.nodeValue = t;
    }
    function Nw(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function Mw(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Lw(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function Aw(e) {
      return e.nodeType !== Ln ? null : e;
    }
    function GE(e) {
      return e.data === op;
    }
    function Yy(e) {
      return e.data === sp;
    }
    function zw(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Uw(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === Ln) {
          var a = e.data;
          if (a === Oh || a === sp || a === op)
            break;
          if (a === Nh)
            return null;
        }
      }
      return e;
    }
    function cp(e) {
      return Mh(e.nextSibling);
    }
    function jw(e) {
      return Mh(e.firstChild);
    }
    function Fw(e) {
      return Mh(e.firstChild);
    }
    function Hw(e) {
      return Mh(e.nextSibling);
    }
    function Pw(e, t, a, i, u, s, f) {
      dp(s, e), Wy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & gt) !== Ve;
      return qT(e, t, a, p, i, y, f);
    }
    function Vw(e, t, a, i) {
      return dp(a, e), a.mode & gt, KT(e, t);
    }
    function Bw(e, t) {
      dp(t, e);
    }
    function Iw(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Ln) {
          var i = t.data;
          if (i === Nh) {
            if (a === 0)
              return cp(t);
            a--;
          } else (i === Oh || i === sp || i === op) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function qE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Ln) {
          var i = t.data;
          if (i === Oh || i === sp || i === op) {
            if (a === 0)
              return t;
            a--;
          } else i === Nh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Yw(e) {
      Du(e);
    }
    function $w(e) {
      Du(e);
    }
    function Qw(e) {
      return e !== "head" && e !== "body";
    }
    function Ww(e, t, a, i) {
      var u = !0;
      _h(t.nodeValue, a, i, u);
    }
    function Gw(e, t, a, i, u, s) {
      if (t[Dh] !== !0) {
        var f = !0;
        _h(i.nodeValue, u, s, f);
      }
    }
    function qw(e, t) {
      t.nodeType === Wr ? Ay(e, t) : t.nodeType === Ln || zy(e, t);
    }
    function Kw(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? Ay(a, t) : t.nodeType === Ln || zy(a, t));
      }
    }
    function Xw(e, t, a, i, u) {
      (u || t[Dh] !== !0) && (i.nodeType === Wr ? Ay(a, i) : i.nodeType === Ln || zy(a, i));
    }
    function Jw(e, t, a) {
      Uy(e, t);
    }
    function Zw(e, t) {
      jy(e, t);
    }
    function ex(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Uy(i, t);
      }
    }
    function tx(e, t) {
      {
        var a = e.parentNode;
        a !== null && jy(a, t);
      }
    }
    function nx(e, t, a, i, u, s) {
      (s || t[Dh] !== !0) && Uy(a, i);
    }
    function rx(e, t, a, i, u) {
      (u || t[Dh] !== !0) && jy(a, i);
    }
    function ax(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function ix(e) {
      np(e);
    }
    var Ef = Math.random().toString(36).slice(2), Cf = "__reactFiber$" + Ef, $y = "__reactProps$" + Ef, fp = "__reactContainer$" + Ef, Qy = "__reactEvents$" + Ef, lx = "__reactListeners$" + Ef, ux = "__reactHandles$" + Ef;
    function ox(e) {
      delete e[Cf], delete e[$y], delete e[Qy], delete e[lx], delete e[ux];
    }
    function dp(e, t) {
      t[Cf] = e;
    }
    function Lh(e, t) {
      t[fp] = e;
    }
    function KE(e) {
      e[fp] = null;
    }
    function pp(e) {
      return !!e[fp];
    }
    function Ys(e) {
      var t = e[Cf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[fp] || a[Cf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = qE(e); u !== null; ) {
              var s = u[Cf];
              if (s)
                return s;
              u = qE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Do(e) {
      var t = e[Cf] || e[fp];
      return t && (t.tag === re || t.tag === ce || t.tag === Z || t.tag === V) ? t : null;
    }
    function Rf(e) {
      if (e.tag === re || e.tag === ce)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Ah(e) {
      return e[$y] || null;
    }
    function Wy(e, t) {
      e[$y] = t;
    }
    function sx(e) {
      var t = e[Qy];
      return t === void 0 && (t = e[Qy] = /* @__PURE__ */ new Set()), t;
    }
    var XE = {}, JE = w.ReactDebugCurrentFrame;
    function zh(e) {
      if (e) {
        var t = e._owner, a = Pi(e.type, e._source, t ? t.type : null);
        JE.setExtraStackFrame(a);
      } else
        JE.setExtraStackFrame(null);
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
            p && !(p instanceof Error) && (zh(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), zh(null)), p instanceof Error && !(p.message in XE) && (XE[p.message] = !0, zh(u), g("Failed %s type: %s", a, p.message), zh(null));
          }
      }
    }
    var Gy = [], Uh;
    Uh = [];
    var zu = -1;
    function Oo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (zu < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Uh[zu] && g("Unexpected Fiber popped."), e.current = Gy[zu], Gy[zu] = null, Uh[zu] = null, zu--;
    }
    function ia(e, t, a) {
      zu++, Gy[zu] = e.current, Uh[zu] = a, e.current = t;
    }
    var qy;
    qy = {};
    var ui = {};
    Object.freeze(ui);
    var Uu = Oo(ui), Il = Oo(!1), Ky = ui;
    function Tf(e, t, a) {
      return a && Yl(t) ? Ky : Uu.current;
    }
    function ZE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function wf(e, t) {
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
          var p = et(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && ZE(e, t, s), s;
      }
    }
    function jh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Fh(e) {
      aa(Il, e), aa(Uu, e);
    }
    function Xy(e) {
      aa(Il, e), aa(Uu, e);
    }
    function eC(e, t, a) {
      {
        if (Uu.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Uu, t, e), ia(Il, a, e);
      }
    }
    function tC(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = et(e) || "Unknown";
            qy[s] || (qy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((et(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = et(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return ct({}, a, f);
      }
    }
    function Hh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Ky = Uu.current, ia(Uu, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function nC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = tC(e, t, Ky);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Uu, e), ia(Uu, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function cx(e) {
      {
        if (!hu(e) || e.tag !== W)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case V:
              return t.stateNode.context;
            case W: {
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
    var No = 0, Ph = 1, ju = null, Jy = !1, Zy = !1;
    function rC(e) {
      ju === null ? ju = [e] : ju.push(e);
    }
    function fx(e) {
      Jy = !0, rC(e);
    }
    function aC() {
      Jy && Mo();
    }
    function Mo() {
      if (!Zy && ju !== null) {
        Zy = !0;
        var e = 0, t = Ua();
        try {
          var a = !0, i = ju;
          for (Fn(Mr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          ju = null, Jy = !1;
        } catch (s) {
          throw ju !== null && (ju = ju.slice(e + 1)), md(ss, Mo), s;
        } finally {
          Fn(t), Zy = !1;
        }
      }
      return null;
    }
    var xf = [], bf = 0, Vh = null, Bh = 0, Mi = [], Li = 0, $s = null, Fu = 1, Hu = "";
    function dx(e) {
      return Ws(), (e.flags & Ri) !== Pe;
    }
    function px(e) {
      return Ws(), Bh;
    }
    function vx() {
      var e = Hu, t = Fu, a = t & ~hx(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Ws(), xf[bf++] = Bh, xf[bf++] = Vh, Vh = e, Bh = t;
    }
    function iC(e, t, a) {
      Ws(), Mi[Li++] = Fu, Mi[Li++] = Hu, Mi[Li++] = $s, $s = e;
      var i = Fu, u = Hu, s = Ih(i) - 1, f = i & ~(1 << s), p = a + 1, v = Ih(t) + s;
      if (v > 30) {
        var y = s - s % 5, S = (1 << y) - 1, k = (f & S).toString(32), b = f >> y, U = s - y, H = Ih(t) + U, B = p << U, Ee = B | b, Ie = k + u;
        Fu = 1 << H | Ee, Hu = Ie;
      } else {
        var je = p << s, Ot = je | f, Tt = u;
        Fu = 1 << v | Ot, Hu = Tt;
      }
    }
    function eg(e) {
      Ws();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), iC(e, a, i);
      }
    }
    function Ih(e) {
      return 32 - Un(e);
    }
    function hx(e) {
      return 1 << Ih(e) - 1;
    }
    function tg(e) {
      for (; e === Vh; )
        Vh = xf[--bf], xf[bf] = null, Bh = xf[--bf], xf[bf] = null;
      for (; e === $s; )
        $s = Mi[--Li], Mi[Li] = null, Hu = Mi[--Li], Mi[Li] = null, Fu = Mi[--Li], Mi[Li] = null;
    }
    function mx() {
      return Ws(), $s !== null ? {
        id: Fu,
        overflow: Hu
      } : null;
    }
    function yx(e, t) {
      Ws(), Mi[Li++] = Fu, Mi[Li++] = Hu, Mi[Li++] = $s, Fu = t.id, Hu = t.overflow, $s = e;
    }
    function Ws() {
      jr() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ur = null, Ai = null, rl = !1, Gs = !1, Lo = null;
    function gx() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function lC() {
      Gs = !0;
    }
    function Sx() {
      return Gs;
    }
    function Ex(e) {
      var t = e.stateNode.containerInfo;
      return Ai = Fw(t), Ur = e, rl = !0, Lo = null, Gs = !1, !0;
    }
    function Cx(e, t, a) {
      return Ai = Hw(t), Ur = e, rl = !0, Lo = null, Gs = !1, a !== null && yx(e, a), !0;
    }
    function uC(e, t) {
      switch (e.tag) {
        case V: {
          qw(e.stateNode.containerInfo, t);
          break;
        }
        case re: {
          var a = (e.mode & gt) !== Ve;
          Xw(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case Z: {
          var i = e.memoizedState;
          i.dehydrated !== null && Kw(i.dehydrated, t);
          break;
        }
      }
    }
    function oC(e, t) {
      uC(e, t);
      var a = x1();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function ng(e, t) {
      {
        if (Gs)
          return;
        switch (e.tag) {
          case V: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case re:
                var i = t.type;
                t.pendingProps, Jw(a, i);
                break;
              case ce:
                var u = t.pendingProps;
                Zw(a, u);
                break;
            }
            break;
          }
          case re: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case re: {
                var v = t.type, y = t.pendingProps, S = (e.mode & gt) !== Ve;
                nx(
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
              case ce: {
                var k = t.pendingProps, b = (e.mode & gt) !== Ve;
                rx(
                  s,
                  f,
                  p,
                  k,
                  // TODO: Delete this argument when we remove the legacy root API.
                  b
                );
                break;
              }
            }
            break;
          }
          case Z: {
            var U = e.memoizedState, H = U.dehydrated;
            if (H !== null) switch (t.tag) {
              case re:
                var B = t.type;
                t.pendingProps, ex(H, B);
                break;
              case ce:
                var Ee = t.pendingProps;
                tx(H, Ee);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function sC(e, t) {
      t.flags = t.flags & ~qr | yn, ng(e, t);
    }
    function cC(e, t) {
      switch (e.tag) {
        case re: {
          var a = e.type;
          e.pendingProps;
          var i = Mw(t, a);
          return i !== null ? (e.stateNode = i, Ur = e, Ai = jw(i), !0) : !1;
        }
        case ce: {
          var u = e.pendingProps, s = Lw(t, u);
          return s !== null ? (e.stateNode = s, Ur = e, Ai = null, !0) : !1;
        }
        case Z: {
          var f = Aw(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: mx(),
              retryLane: Zr
            };
            e.memoizedState = p;
            var v = b1(f);
            return v.return = e, e.child = v, Ur = e, Ai = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function rg(e) {
      return (e.mode & gt) !== Ve && (e.flags & Fe) === Pe;
    }
    function ag(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function ig(e) {
      if (rl) {
        var t = Ai;
        if (!t) {
          rg(e) && (ng(Ur, e), ag()), sC(Ur, e), rl = !1, Ur = e;
          return;
        }
        var a = t;
        if (!cC(e, t)) {
          rg(e) && (ng(Ur, e), ag()), t = cp(a);
          var i = Ur;
          if (!t || !cC(e, t)) {
            sC(Ur, e), rl = !1, Ur = e;
            return;
          }
          oC(i, a);
        }
      }
    }
    function Rx(e, t, a) {
      var i = e.stateNode, u = !Gs, s = Pw(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function Tx(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Vw(t, a, e);
      if (i) {
        var u = Ur;
        if (u !== null)
          switch (u.tag) {
            case V: {
              var s = u.stateNode.containerInfo, f = (u.mode & gt) !== Ve;
              Ww(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case re: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, S = (u.mode & gt) !== Ve;
              Gw(
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
    function wx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Bw(a, e);
    }
    function xx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Iw(a);
    }
    function fC(e) {
      for (var t = e.return; t !== null && t.tag !== re && t.tag !== V && t.tag !== Z; )
        t = t.return;
      Ur = t;
    }
    function Yh(e) {
      if (e !== Ur)
        return !1;
      if (!rl)
        return fC(e), rl = !0, !1;
      if (e.tag !== V && (e.tag !== re || Qw(e.type) && !Py(e.type, e.memoizedProps))) {
        var t = Ai;
        if (t)
          if (rg(e))
            dC(e), ag();
          else
            for (; t; )
              oC(e, t), t = cp(t);
      }
      return fC(e), e.tag === Z ? Ai = xx(e) : Ai = Ur ? cp(e.stateNode) : null, !0;
    }
    function bx() {
      return rl && Ai !== null;
    }
    function dC(e) {
      for (var t = Ai; t; )
        uC(e, t), t = cp(t);
    }
    function _f() {
      Ur = null, Ai = null, rl = !1, Gs = !1;
    }
    function pC() {
      Lo !== null && (lR(Lo), Lo = null);
    }
    function jr() {
      return rl;
    }
    function lg(e) {
      Lo === null ? Lo = [e] : Lo.push(e);
    }
    var _x = w.ReactCurrentBatchConfig, kx = null;
    function Dx() {
      return _x.transition;
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
      var Ox = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Zt && (t = a), a = a.return;
        return t;
      }, qs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, vp = [], hp = [], mp = [], yp = [], gp = [], Sp = [], Ks = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && vp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillMount == "function" && hp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillReceiveProps == "function" && yp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillUpdate == "function" && Sp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(b) {
          e.add(et(b) || "Component"), Ks.add(b.type);
        }), vp = []);
        var t = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(b) {
          t.add(et(b) || "Component"), Ks.add(b.type);
        }), hp = []);
        var a = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(b) {
          a.add(et(b) || "Component"), Ks.add(b.type);
        }), mp = []);
        var i = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(b) {
          i.add(et(b) || "Component"), Ks.add(b.type);
        }), yp = []);
        var u = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(b) {
          u.add(et(b) || "Component"), Ks.add(b.type);
        }), gp = []);
        var s = /* @__PURE__ */ new Set();
        if (Sp.length > 0 && (Sp.forEach(function(b) {
          s.add(et(b) || "Component"), Ks.add(b.type);
        }), Sp = []), t.size > 0) {
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
          ee(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var S = qs(a);
          ee(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (u.size > 0) {
          var k = qs(u);
          ee(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, k);
        }
      };
      var $h = /* @__PURE__ */ new Map(), vC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = Ox(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!vC.has(e.type)) {
          var i = $h.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], $h.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        $h.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(et(s) || "Component"), vC.add(s.type);
            });
            var u = qs(i);
            try {
              Kt(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              fn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        vp = [], hp = [], mp = [], yp = [], gp = [], Sp = [], $h = /* @__PURE__ */ new Map();
      };
    }
    var ug, og, sg, cg, fg, hC = function(e, t) {
    };
    ug = !1, og = !1, sg = {}, cg = {}, fg = {}, hC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = et(t) || "Component";
        cg[a] || (cg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Nx(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Ep(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Zt || $) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== W) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Nx(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = et(e) || "Component";
          sg[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), sg[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== W)
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
          var S = function(k) {
            var b = v.refs;
            k === null ? delete b[y] : b[y] = k;
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
    function Qh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Wh(e) {
      {
        var t = et(e) || "Component";
        if (fg[t])
          return;
        fg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function mC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function yC(e) {
      function t(L, I) {
        if (e) {
          var A = L.deletions;
          A === null ? (L.deletions = [I], L.flags |= Da) : A.push(I);
        }
      }
      function a(L, I) {
        if (!e)
          return null;
        for (var A = I; A !== null; )
          t(L, A), A = A.sibling;
        return null;
      }
      function i(L, I) {
        for (var A = /* @__PURE__ */ new Map(), ne = I; ne !== null; )
          ne.key !== null ? A.set(ne.key, ne) : A.set(ne.index, ne), ne = ne.sibling;
        return A;
      }
      function u(L, I) {
        var A = ic(L, I);
        return A.index = 0, A.sibling = null, A;
      }
      function s(L, I, A) {
        if (L.index = A, !e)
          return L.flags |= Ri, I;
        var ne = L.alternate;
        if (ne !== null) {
          var xe = ne.index;
          return xe < I ? (L.flags |= yn, I) : xe;
        } else
          return L.flags |= yn, I;
      }
      function f(L) {
        return e && L.alternate === null && (L.flags |= yn), L;
      }
      function p(L, I, A, ne) {
        if (I === null || I.tag !== ce) {
          var xe = lE(A, L.mode, ne);
          return xe.return = L, xe;
        } else {
          var Ce = u(I, A);
          return Ce.return = L, Ce;
        }
      }
      function v(L, I, A, ne) {
        var xe = A.type;
        if (xe === di)
          return S(L, I, A.props.children, ne, A.key);
        if (I !== null && (I.elementType === xe || // Keep this check inline so it only runs on the false path:
        RR(I, A) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof xe == "object" && xe !== null && xe.$$typeof === tt && mC(xe) === I.type)) {
          var Ce = u(I, A.props);
          return Ce.ref = Ep(L, I, A), Ce.return = L, Ce._debugSource = A._source, Ce._debugOwner = A._owner, Ce;
        }
        var Xe = iE(A, L.mode, ne);
        return Xe.ref = Ep(L, I, A), Xe.return = L, Xe;
      }
      function y(L, I, A, ne) {
        if (I === null || I.tag !== de || I.stateNode.containerInfo !== A.containerInfo || I.stateNode.implementation !== A.implementation) {
          var xe = uE(A, L.mode, ne);
          return xe.return = L, xe;
        } else {
          var Ce = u(I, A.children || []);
          return Ce.return = L, Ce;
        }
      }
      function S(L, I, A, ne, xe) {
        if (I === null || I.tag !== Ne) {
          var Ce = Yo(A, L.mode, ne, xe);
          return Ce.return = L, Ce;
        } else {
          var Xe = u(I, A);
          return Xe.return = L, Xe;
        }
      }
      function k(L, I, A) {
        if (typeof I == "string" && I !== "" || typeof I == "number") {
          var ne = lE("" + I, L.mode, A);
          return ne.return = L, ne;
        }
        if (typeof I == "object" && I !== null) {
          switch (I.$$typeof) {
            case kr: {
              var xe = iE(I, L.mode, A);
              return xe.ref = Ep(L, null, I), xe.return = L, xe;
            }
            case ar: {
              var Ce = uE(I, L.mode, A);
              return Ce.return = L, Ce;
            }
            case tt: {
              var Xe = I._payload, rt = I._init;
              return k(L, rt(Xe), A);
            }
          }
          if (vt(I) || ut(I)) {
            var tn = Yo(I, L.mode, A, null);
            return tn.return = L, tn;
          }
          Qh(L, I);
        }
        return typeof I == "function" && Wh(L), null;
      }
      function b(L, I, A, ne) {
        var xe = I !== null ? I.key : null;
        if (typeof A == "string" && A !== "" || typeof A == "number")
          return xe !== null ? null : p(L, I, "" + A, ne);
        if (typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case kr:
              return A.key === xe ? v(L, I, A, ne) : null;
            case ar:
              return A.key === xe ? y(L, I, A, ne) : null;
            case tt: {
              var Ce = A._payload, Xe = A._init;
              return b(L, I, Xe(Ce), ne);
            }
          }
          if (vt(A) || ut(A))
            return xe !== null ? null : S(L, I, A, ne, null);
          Qh(L, A);
        }
        return typeof A == "function" && Wh(L), null;
      }
      function U(L, I, A, ne, xe) {
        if (typeof ne == "string" && ne !== "" || typeof ne == "number") {
          var Ce = L.get(A) || null;
          return p(I, Ce, "" + ne, xe);
        }
        if (typeof ne == "object" && ne !== null) {
          switch (ne.$$typeof) {
            case kr: {
              var Xe = L.get(ne.key === null ? A : ne.key) || null;
              return v(I, Xe, ne, xe);
            }
            case ar: {
              var rt = L.get(ne.key === null ? A : ne.key) || null;
              return y(I, rt, ne, xe);
            }
            case tt:
              var tn = ne._payload, Pt = ne._init;
              return U(L, I, A, Pt(tn), xe);
          }
          if (vt(ne) || ut(ne)) {
            var qn = L.get(A) || null;
            return S(I, qn, ne, xe, null);
          }
          Qh(I, ne);
        }
        return typeof ne == "function" && Wh(I), null;
      }
      function H(L, I, A) {
        {
          if (typeof L != "object" || L === null)
            return I;
          switch (L.$$typeof) {
            case kr:
            case ar:
              hC(L, A);
              var ne = L.key;
              if (typeof ne != "string")
                break;
              if (I === null) {
                I = /* @__PURE__ */ new Set(), I.add(ne);
                break;
              }
              if (!I.has(ne)) {
                I.add(ne);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ne);
              break;
            case tt:
              var xe = L._payload, Ce = L._init;
              H(Ce(xe), I, A);
              break;
          }
        }
        return I;
      }
      function B(L, I, A, ne) {
        for (var xe = null, Ce = 0; Ce < A.length; Ce++) {
          var Xe = A[Ce];
          xe = H(Xe, xe, L);
        }
        for (var rt = null, tn = null, Pt = I, qn = 0, Vt = 0, Vn = null; Pt !== null && Vt < A.length; Vt++) {
          Pt.index > Vt ? (Vn = Pt, Pt = null) : Vn = Pt.sibling;
          var ua = b(L, Pt, A[Vt], ne);
          if (ua === null) {
            Pt === null && (Pt = Vn);
            break;
          }
          e && Pt && ua.alternate === null && t(L, Pt), qn = s(ua, qn, Vt), tn === null ? rt = ua : tn.sibling = ua, tn = ua, Pt = Vn;
        }
        if (Vt === A.length) {
          if (a(L, Pt), jr()) {
            var Yr = Vt;
            Qs(L, Yr);
          }
          return rt;
        }
        if (Pt === null) {
          for (; Vt < A.length; Vt++) {
            var si = k(L, A[Vt], ne);
            si !== null && (qn = s(si, qn, Vt), tn === null ? rt = si : tn.sibling = si, tn = si);
          }
          if (jr()) {
            var Ra = Vt;
            Qs(L, Ra);
          }
          return rt;
        }
        for (var Ta = i(L, Pt); Vt < A.length; Vt++) {
          var oa = U(Ta, L, Vt, A[Vt], ne);
          oa !== null && (e && oa.alternate !== null && Ta.delete(oa.key === null ? Vt : oa.key), qn = s(oa, qn, Vt), tn === null ? rt = oa : tn.sibling = oa, tn = oa);
        }
        if (e && Ta.forEach(function(Qf) {
          return t(L, Qf);
        }), jr()) {
          var Qu = Vt;
          Qs(L, Qu);
        }
        return rt;
      }
      function Ee(L, I, A, ne) {
        var xe = ut(A);
        if (typeof xe != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          A[Symbol.toStringTag] === "Generator" && (og || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), og = !0), A.entries === xe && (ug || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ug = !0);
          var Ce = xe.call(A);
          if (Ce)
            for (var Xe = null, rt = Ce.next(); !rt.done; rt = Ce.next()) {
              var tn = rt.value;
              Xe = H(tn, Xe, L);
            }
        }
        var Pt = xe.call(A);
        if (Pt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qn = null, Vt = null, Vn = I, ua = 0, Yr = 0, si = null, Ra = Pt.next(); Vn !== null && !Ra.done; Yr++, Ra = Pt.next()) {
          Vn.index > Yr ? (si = Vn, Vn = null) : si = Vn.sibling;
          var Ta = b(L, Vn, Ra.value, ne);
          if (Ta === null) {
            Vn === null && (Vn = si);
            break;
          }
          e && Vn && Ta.alternate === null && t(L, Vn), ua = s(Ta, ua, Yr), Vt === null ? qn = Ta : Vt.sibling = Ta, Vt = Ta, Vn = si;
        }
        if (Ra.done) {
          if (a(L, Vn), jr()) {
            var oa = Yr;
            Qs(L, oa);
          }
          return qn;
        }
        if (Vn === null) {
          for (; !Ra.done; Yr++, Ra = Pt.next()) {
            var Qu = k(L, Ra.value, ne);
            Qu !== null && (ua = s(Qu, ua, Yr), Vt === null ? qn = Qu : Vt.sibling = Qu, Vt = Qu);
          }
          if (jr()) {
            var Qf = Yr;
            Qs(L, Qf);
          }
          return qn;
        }
        for (var Jp = i(L, Vn); !Ra.done; Yr++, Ra = Pt.next()) {
          var Jl = U(Jp, L, Yr, Ra.value, ne);
          Jl !== null && (e && Jl.alternate !== null && Jp.delete(Jl.key === null ? Yr : Jl.key), ua = s(Jl, ua, Yr), Vt === null ? qn = Jl : Vt.sibling = Jl, Vt = Jl);
        }
        if (e && Jp.forEach(function(rk) {
          return t(L, rk);
        }), jr()) {
          var nk = Yr;
          Qs(L, nk);
        }
        return qn;
      }
      function Ie(L, I, A, ne) {
        if (I !== null && I.tag === ce) {
          a(L, I.sibling);
          var xe = u(I, A);
          return xe.return = L, xe;
        }
        a(L, I);
        var Ce = lE(A, L.mode, ne);
        return Ce.return = L, Ce;
      }
      function je(L, I, A, ne) {
        for (var xe = A.key, Ce = I; Ce !== null; ) {
          if (Ce.key === xe) {
            var Xe = A.type;
            if (Xe === di) {
              if (Ce.tag === Ne) {
                a(L, Ce.sibling);
                var rt = u(Ce, A.props.children);
                return rt.return = L, rt._debugSource = A._source, rt._debugOwner = A._owner, rt;
              }
            } else if (Ce.elementType === Xe || // Keep this check inline so it only runs on the false path:
            RR(Ce, A) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Xe == "object" && Xe !== null && Xe.$$typeof === tt && mC(Xe) === Ce.type) {
              a(L, Ce.sibling);
              var tn = u(Ce, A.props);
              return tn.ref = Ep(L, Ce, A), tn.return = L, tn._debugSource = A._source, tn._debugOwner = A._owner, tn;
            }
            a(L, Ce);
            break;
          } else
            t(L, Ce);
          Ce = Ce.sibling;
        }
        if (A.type === di) {
          var Pt = Yo(A.props.children, L.mode, ne, A.key);
          return Pt.return = L, Pt;
        } else {
          var qn = iE(A, L.mode, ne);
          return qn.ref = Ep(L, I, A), qn.return = L, qn;
        }
      }
      function Ot(L, I, A, ne) {
        for (var xe = A.key, Ce = I; Ce !== null; ) {
          if (Ce.key === xe)
            if (Ce.tag === de && Ce.stateNode.containerInfo === A.containerInfo && Ce.stateNode.implementation === A.implementation) {
              a(L, Ce.sibling);
              var Xe = u(Ce, A.children || []);
              return Xe.return = L, Xe;
            } else {
              a(L, Ce);
              break;
            }
          else
            t(L, Ce);
          Ce = Ce.sibling;
        }
        var rt = uE(A, L.mode, ne);
        return rt.return = L, rt;
      }
      function Tt(L, I, A, ne) {
        var xe = typeof A == "object" && A !== null && A.type === di && A.key === null;
        if (xe && (A = A.props.children), typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case kr:
              return f(je(L, I, A, ne));
            case ar:
              return f(Ot(L, I, A, ne));
            case tt:
              var Ce = A._payload, Xe = A._init;
              return Tt(L, I, Xe(Ce), ne);
          }
          if (vt(A))
            return B(L, I, A, ne);
          if (ut(A))
            return Ee(L, I, A, ne);
          Qh(L, A);
        }
        return typeof A == "string" && A !== "" || typeof A == "number" ? f(Ie(L, I, "" + A, ne)) : (typeof A == "function" && Wh(L), a(L, I));
      }
      return Tt;
    }
    var kf = yC(!0), gC = yC(!1);
    function Mx(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ic(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ic(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Lx(e, t) {
      for (var a = e.child; a !== null; )
        E1(a, t), a = a.sibling;
    }
    var dg = Oo(null), pg;
    pg = {};
    var Gh = null, Df = null, vg = null, qh = !1;
    function Kh() {
      Gh = null, Df = null, vg = null, qh = !1;
    }
    function SC() {
      qh = !0;
    }
    function EC() {
      qh = !1;
    }
    function CC(e, t, a) {
      ia(dg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== pg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = pg;
    }
    function hg(e, t) {
      var a = dg.current;
      aa(dg, t), e._currentValue = a;
    }
    function mg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (ku(i.childLanes, t) ? u !== null && !ku(u.childLanes, t) && (u.childLanes = ot(u.childLanes, t)) : (i.childLanes = ot(i.childLanes, t), u !== null && (u.childLanes = ot(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ax(e, t, a) {
      zx(e, t, a);
    }
    function zx(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === W) {
                var p = Ts(a), v = Pu(nn, p);
                v.tag = Jh;
                var y = i.updateQueue;
                if (y !== null) {
                  var S = y.shared, k = S.pending;
                  k === null ? v.next = v : (v.next = k.next, k.next = v), S.pending = v;
                }
              }
              i.lanes = ot(i.lanes, a);
              var b = i.alternate;
              b !== null && (b.lanes = ot(b.lanes, a)), mg(i.return, a, e), s.lanes = ot(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === at)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === St) {
          var U = i.return;
          if (U === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          U.lanes = ot(U.lanes, a);
          var H = U.alternate;
          H !== null && (H.lanes = ot(H.lanes, a)), mg(U, a, e), u = i.sibling;
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
            var B = u.sibling;
            if (B !== null) {
              B.return = u.return, u = B;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Of(e, t) {
      Gh = e, Df = null, vg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function nr(e) {
      qh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (vg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (Gh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, Gh.dependencies = {
            lanes: q,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Xs = null;
    function yg(e) {
      Xs === null ? Xs = [e] : Xs.push(e);
    }
    function Ux() {
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
    function RC(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, yg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Xh(e, i);
    }
    function jx(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, yg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Fx(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, yg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Xh(e, i);
    }
    function Ha(e, t) {
      return Xh(e, t);
    }
    var Hx = Xh;
    function Xh(e, t) {
      e.lanes = ot(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = ot(a.lanes, t)), a === null && (e.flags & (yn | qr)) !== Pe && gR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = ot(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = ot(a.childLanes, t) : (u.flags & (yn | qr)) !== Pe && gR(e), i = u, u = u.return;
      if (i.tag === V) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var TC = 0, wC = 1, Jh = 2, gg = 3, Zh = !1, Sg, em;
    Sg = !1, em = null;
    function Eg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: q
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function xC(e, t) {
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
        tag: TC,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Ao(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (em === u && !Sg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Sg = !0), j_()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Hx(e, a);
      } else
        return Fx(e, u, t, a);
    }
    function tm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Ld(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = ot(s, a);
          u.lanes = f, tf(e, f);
        }
      }
    }
    function Cg(e, t) {
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
    function Px(e, t, a, i, u, s) {
      switch (a.tag) {
        case wC: {
          var f = a.payload;
          if (typeof f == "function") {
            SC();
            var p = f.call(s, i, u);
            {
              if (e.mode & Zt) {
                gn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              EC();
            }
            return p;
          }
          return f;
        }
        case gg:
          e.flags = e.flags & ~Jn | Fe;
        case TC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            SC(), y = v.call(s, i, u);
            {
              if (e.mode & Zt) {
                gn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              EC();
            }
          } else
            y = v;
          return y == null ? i : ct({}, i, y);
        }
        case Jh:
          return Zh = !0, i;
      }
      return i;
    }
    function nm(e, t, a, i) {
      var u = e.updateQueue;
      Zh = !1, em = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var S = e.alternate;
        if (S !== null) {
          var k = S.updateQueue, b = k.lastBaseUpdate;
          b !== f && (b === null ? k.firstBaseUpdate = y : b.next = y, k.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var U = u.baseState, H = q, B = null, Ee = null, Ie = null, je = s;
        do {
          var Ot = je.lane, Tt = je.eventTime;
          if (ku(i, Ot)) {
            if (Ie !== null) {
              var I = {
                eventTime: Tt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: zt,
                tag: je.tag,
                payload: je.payload,
                callback: je.callback,
                next: null
              };
              Ie = Ie.next = I;
            }
            U = Px(e, u, je, U, t, a);
            var A = je.callback;
            if (A !== null && // If the update was already committed, we should not queue its
            // callback again.
            je.lane !== zt) {
              e.flags |= on;
              var ne = u.effects;
              ne === null ? u.effects = [je] : ne.push(je);
            }
          } else {
            var L = {
              eventTime: Tt,
              lane: Ot,
              tag: je.tag,
              payload: je.payload,
              callback: je.callback,
              next: null
            };
            Ie === null ? (Ee = Ie = L, B = U) : Ie = Ie.next = L, H = ot(H, Ot);
          }
          if (je = je.next, je === null) {
            if (p = u.shared.pending, p === null)
              break;
            var xe = p, Ce = xe.next;
            xe.next = null, je = Ce, u.lastBaseUpdate = xe, u.shared.pending = null;
          }
        } while (!0);
        Ie === null && (B = U), u.baseState = B, u.firstBaseUpdate = Ee, u.lastBaseUpdate = Ie;
        var Xe = u.shared.interleaved;
        if (Xe !== null) {
          var rt = Xe;
          do
            H = ot(H, rt.lane), rt = rt.next;
          while (rt !== Xe);
        } else s === null && (u.shared.lanes = q);
        Wp(H), e.lanes = H, e.memoizedState = U;
      }
      em = null;
    }
    function Vx(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function bC() {
      Zh = !1;
    }
    function rm() {
      return Zh;
    }
    function _C(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Vx(f, a));
        }
    }
    var Cp = {}, zo = Oo(Cp), Rp = Oo(Cp), am = Oo(Cp);
    function im(e) {
      if (e === Cp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function kC() {
      var e = im(am.current);
      return e;
    }
    function Rg(e, t) {
      ia(am, t, e), ia(Rp, e, e), ia(zo, Cp, e);
      var a = aw(t);
      aa(zo, e), ia(zo, a, e);
    }
    function Nf(e) {
      aa(zo, e), aa(Rp, e), aa(am, e);
    }
    function Tg() {
      var e = im(zo.current);
      return e;
    }
    function DC(e) {
      im(am.current);
      var t = im(zo.current), a = iw(t, e.type);
      t !== a && (ia(Rp, e, e), ia(zo, a, e));
    }
    function wg(e) {
      Rp.current === e && (aa(zo, e), aa(Rp, e));
    }
    var Bx = 0, OC = 1, NC = 1, Tp = 2, il = Oo(Bx);
    function xg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & OC;
    }
    function bg(e, t) {
      return e & OC | t;
    }
    function Ix(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      ia(il, t, e);
    }
    function Lf(e) {
      aa(il, e);
    }
    function Yx(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function lm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === Z) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || GE(i) || Yy(i))
              return t;
          }
        } else if (t.tag === Wt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Fe) !== Pe;
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
    ), _g = [];
    function kg() {
      for (var e = 0; e < _g.length; e++) {
        var t = _g[e];
        t._workInProgressVersionPrimary = null;
      }
      _g.length = 0;
    }
    function $x(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var we = w.ReactCurrentDispatcher, wp = w.ReactCurrentBatchConfig, Dg, Af;
    Dg = /* @__PURE__ */ new Set();
    var Js = q, en = null, pr = null, vr = null, um = !1, xp = !1, bp = 0, Qx = 0, Wx = 25, Q = null, zi = null, jo = -1, Og = !1;
    function Yt() {
      {
        var e = Q;
        zi === null ? zi = [e] : zi.push(e);
      }
    }
    function ve() {
      {
        var e = Q;
        zi !== null && (jo++, zi[jo] !== e && Gx(e));
      }
    }
    function zf(e) {
      e != null && !vt(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Q, typeof e);
    }
    function Gx(e) {
      {
        var t = et(en);
        if (!Dg.has(t) && (Dg.add(t), zi !== null)) {
          for (var a = "", i = 30, u = 0; u <= jo; u++) {
            for (var s = zi[u], f = u === jo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function Ng(e, t) {
      if (Og)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Q), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, Q, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!J(e[a], t[a]))
          return !1;
      return !0;
    }
    function Uf(e, t, a, i, u, s) {
      Js = s, en = t, zi = e !== null ? e._debugHookTypes : null, jo = -1, Og = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = q, e !== null && e.memoizedState !== null ? we.current = ZC : zi !== null ? we.current = JC : we.current = XC;
      var f = a(i, u);
      if (xp) {
        var p = 0;
        do {
          if (xp = !1, bp = 0, p >= Wx)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Og = !1, pr = null, vr = null, t.updateQueue = null, jo = -1, we.current = e0, f = a(i, u);
        } while (xp);
      }
      we.current = Em, t._debugHookTypes = zi;
      var v = pr !== null && pr.next !== null;
      if (Js = q, en = null, pr = null, vr = null, Q = null, zi = null, jo = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & gt) !== Ve && g("Internal React error: Expected static flag was missing. Please notify the React team."), um = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function jf() {
      var e = bp !== 0;
      return bp = 0, e;
    }
    function MC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Ft) !== Ve ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = ws(e.lanes, a);
    }
    function LC() {
      if (we.current = Em, um) {
        for (var e = en.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        um = !1;
      }
      Js = q, en = null, pr = null, vr = null, zi = null, jo = -1, Q = null, QC = !1, xp = !1, bp = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return vr === null ? en.memoizedState = vr = e : vr = vr.next = e, vr;
    }
    function Ui() {
      var e;
      if (pr === null) {
        var t = en.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = pr.next;
      var a;
      if (vr === null ? a = en.memoizedState : a = vr.next, a !== null)
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
        vr === null ? en.memoizedState = vr = i : vr = vr.next = i;
      }
      return vr;
    }
    function AC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Mg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Lg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: q,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = Jx.bind(null, en, s);
      return [i.memoizedState, f];
    }
    function Ag(e, t, a) {
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
        var S = f.next, k = s.baseState, b = null, U = null, H = null, B = S;
        do {
          var Ee = B.lane;
          if (ku(Js, Ee)) {
            if (H !== null) {
              var je = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: zt,
                action: B.action,
                hasEagerState: B.hasEagerState,
                eagerState: B.eagerState,
                next: null
              };
              H = H.next = je;
            }
            if (B.hasEagerState)
              k = B.eagerState;
            else {
              var Ot = B.action;
              k = e(k, Ot);
            }
          } else {
            var Ie = {
              lane: Ee,
              action: B.action,
              hasEagerState: B.hasEagerState,
              eagerState: B.eagerState,
              next: null
            };
            H === null ? (U = H = Ie, b = k) : H = H.next = Ie, en.lanes = ot(en.lanes, Ee), Wp(Ee);
          }
          B = B.next;
        } while (B !== null && B !== S);
        H === null ? b = k : H.next = U, J(k, i.memoizedState) || zp(), i.memoizedState = k, i.baseState = b, i.baseQueue = H, u.lastRenderedState = k;
      }
      var Tt = u.interleaved;
      if (Tt !== null) {
        var L = Tt;
        do {
          var I = L.lane;
          en.lanes = ot(en.lanes, I), Wp(I), L = L.next;
        } while (L !== Tt);
      } else f === null && (u.lanes = q);
      var A = u.dispatch;
      return [i.memoizedState, A];
    }
    function zg(e, t, a) {
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
        J(p, i.memoizedState) || zp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function Kk(e, t, a) {
    }
    function Xk(e, t, a) {
    }
    function Ug(e, t, a) {
      var i = en, u = Ql(), s, f = jr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Af || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), Af = !0);
      } else {
        if (s = t(), !Af) {
          var p = t();
          J(s, p) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Af = !0);
        }
        var v = Hm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Js) || zC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, dm(jC.bind(null, i, y, e), [e]), i.flags |= Gr, _p(fr | Fr, UC.bind(null, i, y, s, t), void 0, null), s;
    }
    function om(e, t, a) {
      var i = en, u = Ui(), s = t();
      if (!Af) {
        var f = t();
        J(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Af = !0);
      }
      var p = u.memoizedState, v = !J(p, s);
      v && (u.memoizedState = s, zp());
      var y = u.queue;
      if (Dp(jC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      vr !== null && vr.memoizedState.tag & fr) {
        i.flags |= Gr, _p(fr | Fr, UC.bind(null, i, y, s, t), void 0, null);
        var S = Hm();
        if (S === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(S, Js) || zC(i, t, s);
      }
      return s;
    }
    function zC(e, t, a) {
      e.flags |= vo;
      var i = {
        getSnapshot: t,
        value: a
      }, u = en.updateQueue;
      if (u === null)
        u = AC(), en.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function UC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, FC(t) && HC(e);
    }
    function jC(e, t, a) {
      var i = function() {
        FC(t) && HC(e);
      };
      return a(i);
    }
    function FC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !J(a, i);
      } catch {
        return !0;
      }
    }
    function HC(e) {
      var t = Ha(e, qe);
      t !== null && gr(t, e, qe, nn);
    }
    function sm(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: q,
        dispatch: null,
        lastRenderedReducer: Mg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Zx.bind(null, en, a);
      return [t.memoizedState, i];
    }
    function jg(e) {
      return Ag(Mg);
    }
    function Fg(e) {
      return zg(Mg);
    }
    function _p(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = en.updateQueue;
      if (s === null)
        s = AC(), en.updateQueue = s, s.lastEffect = u.next = u;
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
    function Hg(e) {
      var t = Ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function cm(e) {
      var t = Ui();
      return t.memoizedState;
    }
    function kp(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      en.flags |= e, u.memoizedState = _p(fr | t, a, void 0, s);
    }
    function fm(e, t, a, i) {
      var u = Ui(), s = i === void 0 ? null : i, f = void 0;
      if (pr !== null) {
        var p = pr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Ng(s, v)) {
            u.memoizedState = _p(t, a, f, s);
            return;
          }
        }
      }
      en.flags |= e, u.memoizedState = _p(fr | t, a, f, s);
    }
    function dm(e, t) {
      return (en.mode & Ft) !== Ve ? kp(Ti | Gr | bc, Fr, e, t) : kp(Gr | bc, Fr, e, t);
    }
    function Dp(e, t) {
      return fm(Gr, Fr, e, t);
    }
    function Pg(e, t) {
      return kp(_t, $l, e, t);
    }
    function pm(e, t) {
      return fm(_t, $l, e, t);
    }
    function Vg(e, t) {
      var a = _t;
      return a |= Wi, (en.mode & Ft) !== Ve && (a |= _l), kp(a, dr, e, t);
    }
    function vm(e, t) {
      return fm(_t, dr, e, t);
    }
    function PC(e, t) {
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
    function Bg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = _t;
      return u |= Wi, (en.mode & Ft) !== Ve && (u |= _l), kp(u, dr, PC.bind(null, t, e), i);
    }
    function hm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return fm(_t, dr, PC.bind(null, t, e), i);
    }
    function qx(e, t) {
    }
    var mm = qx;
    function Ig(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function ym(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Ng(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Yg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function gm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Ng(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function $g(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function VC(e) {
      var t = Ui(), a = pr, i = a.memoizedState;
      return IC(t, i, e);
    }
    function BC(e) {
      var t = Ui();
      if (pr === null)
        return t.memoizedState = e, e;
      var a = pr.memoizedState;
      return IC(t, a, e);
    }
    function IC(e, t, a) {
      var i = !Nd(Js);
      if (i) {
        if (!J(a, t)) {
          var u = Ad();
          en.lanes = ot(en.lanes, u), Wp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function Kx(e, t, a) {
      var i = Ua();
      Fn(qv(i, _i)), e(!0);
      var u = wp.transition;
      wp.transition = {};
      var s = wp.transition;
      wp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Fn(i), wp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && ee("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Qg() {
      var e = sm(!1), t = e[0], a = e[1], i = Kx.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function YC() {
      var e = jg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    function $C() {
      var e = Fg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    var QC = !1;
    function Xx() {
      return QC;
    }
    function Wg() {
      var e = Ql(), t = Hm(), a = t.identifierPrefix, i;
      if (jr()) {
        var u = vx();
        i = ":" + a + "R" + u;
        var s = bp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Qx++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Sm() {
      var e = Ui(), t = e.memoizedState;
      return t;
    }
    function Jx(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (WC(e))
        GC(t, u);
      else {
        var s = RC(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          gr(s, e, i, f), qC(s, t, i);
        }
      }
      KC(e, i);
    }
    function Zx(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (WC(e))
        GC(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === q && (s === null || s.lanes === q)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = we.current, we.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, J(y, v)) {
                jx(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              we.current = p;
            }
          }
        }
        var S = RC(e, t, u, i);
        if (S !== null) {
          var k = Ca();
          gr(S, e, i, k), qC(S, t, i);
        }
      }
      KC(e, i);
    }
    function WC(e) {
      var t = e.alternate;
      return e === en || t !== null && t === en;
    }
    function GC(e, t) {
      xp = um = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function qC(e, t, a) {
      if (Ld(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = ot(i, a);
        t.lanes = u, tf(e, u);
      }
    }
    function KC(e, t, a) {
      vs(e, t);
    }
    var Em = {
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
      unstable_isNewReconciler: oe
    }, XC = null, JC = null, ZC = null, e0 = null, Wl = null, ll = null, Cm = null;
    {
      var Gg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, nt = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      XC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", Yt(), zf(t), Ig(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", Yt(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", Yt(), zf(t), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", Yt(), zf(a), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", Yt(), zf(t), Pg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", Yt(), zf(t), Vg(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", Yt(), zf(t);
          var a = we.current;
          we.current = Wl;
          try {
            return Yg(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", Yt();
          var i = we.current;
          we.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", Yt(), Hg(e);
        },
        useState: function(e) {
          Q = "useState", Yt();
          var t = we.current;
          we.current = Wl;
          try {
            return sm(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", Yt(), void 0;
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", Yt(), $g(e);
        },
        useTransition: function() {
          return Q = "useTransition", Yt(), Qg();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", Yt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", Yt(), Ug(e, t, a);
        },
        useId: function() {
          return Q = "useId", Yt(), Wg();
        },
        unstable_isNewReconciler: oe
      }, JC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", ve(), Ig(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", ve(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", ve(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", ve(), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", ve(), Pg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", ve(), Vg(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", ve();
          var a = we.current;
          we.current = Wl;
          try {
            return Yg(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", ve();
          var i = we.current;
          we.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", ve(), Hg(e);
        },
        useState: function(e) {
          Q = "useState", ve();
          var t = we.current;
          we.current = Wl;
          try {
            return sm(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", ve(), void 0;
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", ve(), $g(e);
        },
        useTransition: function() {
          return Q = "useTransition", ve(), Qg();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", ve(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", ve(), Ug(e, t, a);
        },
        useId: function() {
          return Q = "useId", ve(), Wg();
        },
        unstable_isNewReconciler: oe
      }, ZC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", ve(), ym(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", ve(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", ve(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", ve(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", ve(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", ve(), vm(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", ve();
          var a = we.current;
          we.current = ll;
          try {
            return gm(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", ve();
          var i = we.current;
          we.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", ve(), cm();
        },
        useState: function(e) {
          Q = "useState", ve();
          var t = we.current;
          we.current = ll;
          try {
            return jg(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", ve(), mm();
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", ve(), VC(e);
        },
        useTransition: function() {
          return Q = "useTransition", ve(), YC();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", ve(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", ve(), om(e, t);
        },
        useId: function() {
          return Q = "useId", ve(), Sm();
        },
        unstable_isNewReconciler: oe
      }, e0 = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", ve(), ym(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", ve(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", ve(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", ve(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", ve(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", ve(), vm(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", ve();
          var a = we.current;
          we.current = Cm;
          try {
            return gm(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", ve();
          var i = we.current;
          we.current = Cm;
          try {
            return zg(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", ve(), cm();
        },
        useState: function(e) {
          Q = "useState", ve();
          var t = we.current;
          we.current = Cm;
          try {
            return Fg(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", ve(), mm();
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", ve(), BC(e);
        },
        useTransition: function() {
          return Q = "useTransition", ve(), $C();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", ve(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", ve(), om(e, t);
        },
        useId: function() {
          return Q = "useId", ve(), Sm();
        },
        unstable_isNewReconciler: oe
      }, Wl = {
        readContext: function(e) {
          return Gg(), nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", nt(), Yt(), Ig(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", nt(), Yt(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", nt(), Yt(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", nt(), Yt(), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", nt(), Yt(), Pg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", nt(), Yt(), Vg(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", nt(), Yt();
          var a = we.current;
          we.current = Wl;
          try {
            return Yg(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", nt(), Yt();
          var i = we.current;
          we.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", nt(), Yt(), Hg(e);
        },
        useState: function(e) {
          Q = "useState", nt(), Yt();
          var t = we.current;
          we.current = Wl;
          try {
            return sm(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", nt(), Yt(), void 0;
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", nt(), Yt(), $g(e);
        },
        useTransition: function() {
          return Q = "useTransition", nt(), Yt(), Qg();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", nt(), Yt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", nt(), Yt(), Ug(e, t, a);
        },
        useId: function() {
          return Q = "useId", nt(), Yt(), Wg();
        },
        unstable_isNewReconciler: oe
      }, ll = {
        readContext: function(e) {
          return Gg(), nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", nt(), ve(), ym(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", nt(), ve(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", nt(), ve(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", nt(), ve(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", nt(), ve(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", nt(), ve(), vm(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", nt(), ve();
          var a = we.current;
          we.current = ll;
          try {
            return gm(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", nt(), ve();
          var i = we.current;
          we.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", nt(), ve(), cm();
        },
        useState: function(e) {
          Q = "useState", nt(), ve();
          var t = we.current;
          we.current = ll;
          try {
            return jg(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", nt(), ve(), mm();
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", nt(), ve(), VC(e);
        },
        useTransition: function() {
          return Q = "useTransition", nt(), ve(), YC();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", nt(), ve(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", nt(), ve(), om(e, t);
        },
        useId: function() {
          return Q = "useId", nt(), ve(), Sm();
        },
        unstable_isNewReconciler: oe
      }, Cm = {
        readContext: function(e) {
          return Gg(), nr(e);
        },
        useCallback: function(e, t) {
          return Q = "useCallback", nt(), ve(), ym(e, t);
        },
        useContext: function(e) {
          return Q = "useContext", nt(), ve(), nr(e);
        },
        useEffect: function(e, t) {
          return Q = "useEffect", nt(), ve(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Q = "useImperativeHandle", nt(), ve(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Q = "useInsertionEffect", nt(), ve(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Q = "useLayoutEffect", nt(), ve(), vm(e, t);
        },
        useMemo: function(e, t) {
          Q = "useMemo", nt(), ve();
          var a = we.current;
          we.current = ll;
          try {
            return gm(e, t);
          } finally {
            we.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Q = "useReducer", nt(), ve();
          var i = we.current;
          we.current = ll;
          try {
            return zg(e, t, a);
          } finally {
            we.current = i;
          }
        },
        useRef: function(e) {
          return Q = "useRef", nt(), ve(), cm();
        },
        useState: function(e) {
          Q = "useState", nt(), ve();
          var t = we.current;
          we.current = ll;
          try {
            return Fg(e);
          } finally {
            we.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Q = "useDebugValue", nt(), ve(), mm();
        },
        useDeferredValue: function(e) {
          return Q = "useDeferredValue", nt(), ve(), BC(e);
        },
        useTransition: function() {
          return Q = "useTransition", nt(), ve(), $C();
        },
        useMutableSource: function(e, t, a) {
          return Q = "useMutableSource", nt(), ve(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Q = "useSyncExternalStore", nt(), ve(), om(e, t);
        },
        useId: function() {
          return Q = "useId", nt(), ve(), Sm();
        },
        unstable_isNewReconciler: oe
      };
    }
    var Fo = x.unstable_now, t0 = 0, Rm = -1, Op = -1, Tm = -1, qg = !1, wm = !1;
    function n0() {
      return qg;
    }
    function eb() {
      wm = !0;
    }
    function tb() {
      qg = !1, wm = !1;
    }
    function nb() {
      qg = wm, wm = !1;
    }
    function r0() {
      return t0;
    }
    function a0() {
      t0 = Fo();
    }
    function Kg(e) {
      Op = Fo(), e.actualStartTime < 0 && (e.actualStartTime = Fo());
    }
    function i0(e) {
      Op = -1;
    }
    function xm(e, t) {
      if (Op >= 0) {
        var a = Fo() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Gl(e) {
      if (Rm >= 0) {
        var t = Fo() - Rm;
        Rm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case V:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case fe:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Xg(e) {
      if (Tm >= 0) {
        var t = Fo() - Tm;
        Tm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case V:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case fe:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      Rm = Fo();
    }
    function Jg() {
      Tm = Fo();
    }
    function Zg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = ct({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var eS = {}, tS, nS, rS, aS, iS, l0, bm, lS, uS, oS, Np;
    {
      tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), Np = /* @__PURE__ */ new Set();
      var u0 = /* @__PURE__ */ new Set();
      bm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          u0.has(a) || (u0.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, l0 = function(e, t) {
        if (t === void 0) {
          var a = Mt(e) || "Component";
          iS.has(a) || (iS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(eS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(eS);
    }
    function sS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Zt) {
          gn(!0);
          try {
            s = a(i, u);
          } finally {
            gn(!1);
          }
        }
        l0(t, s);
      }
      var f = s == null ? u : ct({}, u, s);
      if (e.memoizedState = f, e.lanes === q) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var cS = {
      isMounted: Lv,
      enqueueSetState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.payload = t, a != null && (bm(a, "setState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (gr(p, i, s, u), tm(p, i, s)), vs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.tag = wC, f.payload = t, a != null && (bm(a, "replaceState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (gr(p, i, s, u), tm(p, i, s)), vs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = po(e), i = Ca(), u = Bo(a), s = Pu(i, u);
        s.tag = Jh, t != null && (bm(t, "forceUpdate"), s.callback = t);
        var f = Ao(a, s, u);
        f !== null && (gr(f, a, u, i), tm(f, a, u)), Lc(a, u);
      }
    };
    function o0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Zt) {
            gn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              gn(!1);
            }
          }
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Mt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !De(a, i) || !De(u, s) : !0;
    }
    function rb(e, t, a) {
      var i = e.stateNode;
      {
        var u = Mt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Np.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Zt) === Ve && (Np.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Np.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Zt) === Ve && (Np.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !uS.has(t) && (uS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Mt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !rS.has(t) && (rS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Mt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || vt(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function s0(e, t) {
      t.updater = cS, e.stateNode = t, vu(t, e), t._reactInternalInstance = eS;
    }
    function c0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !oS.has(t)) {
          oS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Mt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = nr(f);
      else {
        u = Tf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? wf(e, u) : ui;
      }
      var S = new t(a, s);
      if (e.mode & Zt) {
        gn(!0);
        try {
          S = new t(a, s);
        } finally {
          gn(!1);
        }
      }
      var k = e.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null;
      s0(e, S);
      {
        if (typeof t.getDerivedStateFromProps == "function" && k === null) {
          var b = Mt(t) || "Component";
          nS.has(b) || (nS.add(b), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", b, S.state === null ? "null" : "undefined", b));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof S.getSnapshotBeforeUpdate == "function") {
          var U = null, H = null, B = null;
          if (typeof S.componentWillMount == "function" && S.componentWillMount.__suppressDeprecationWarning !== !0 ? U = "componentWillMount" : typeof S.UNSAFE_componentWillMount == "function" && (U = "UNSAFE_componentWillMount"), typeof S.componentWillReceiveProps == "function" && S.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? H = "componentWillReceiveProps" : typeof S.UNSAFE_componentWillReceiveProps == "function" && (H = "UNSAFE_componentWillReceiveProps"), typeof S.componentWillUpdate == "function" && S.componentWillUpdate.__suppressDeprecationWarning !== !0 ? B = "componentWillUpdate" : typeof S.UNSAFE_componentWillUpdate == "function" && (B = "UNSAFE_componentWillUpdate"), U !== null || H !== null || B !== null) {
            var Ee = Mt(t) || "Component", Ie = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            aS.has(Ee) || (aS.add(Ee), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ee, Ie, U !== null ? `
  ` + U : "", H !== null ? `
  ` + H : "", B !== null ? `
  ` + B : ""));
          }
        }
      }
      return i && ZE(e, u, s), S;
    }
    function ab(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", et(e) || "Component"), cS.enqueueReplaceState(t, t.state, null));
    }
    function f0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = et(e) || "Component";
          tS.has(s) || (tS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        cS.enqueueReplaceState(t, t.state, null);
      }
    }
    function fS(e, t, a, i) {
      rb(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, Eg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nr(s);
      else {
        var f = Tf(e, t, !0);
        u.context = wf(e, f);
      }
      {
        if (u.state === a) {
          var p = Mt(t) || "Component";
          lS.has(p) || (lS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Zt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (sS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (ab(e, u), nm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = _t;
        y |= Wi, (e.mode & Ft) !== Ve && (y |= _l), e.flags |= y;
      }
    }
    function ib(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = nr(p);
      else {
        var y = Tf(e, t, !0);
        v = wf(e, y);
      }
      var S = t.getDerivedStateFromProps, k = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !k && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && f0(e, u, a, v), bC();
      var b = e.memoizedState, U = u.state = b;
      if (nm(e, a, u, i), U = e.memoizedState, s === a && b === U && !jh() && !rm()) {
        if (typeof u.componentDidMount == "function") {
          var H = _t;
          H |= Wi, (e.mode & Ft) !== Ve && (H |= _l), e.flags |= H;
        }
        return !1;
      }
      typeof S == "function" && (sS(e, t, S, a), U = e.memoizedState);
      var B = rm() || o0(e, t, s, a, b, U, v);
      if (B) {
        if (!k && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var Ee = _t;
          Ee |= Wi, (e.mode & Ft) !== Ve && (Ee |= _l), e.flags |= Ee;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Ie = _t;
          Ie |= Wi, (e.mode & Ft) !== Ve && (Ie |= _l), e.flags |= Ie;
        }
        e.memoizedProps = a, e.memoizedState = U;
      }
      return u.props = a, u.state = U, u.context = v, B;
    }
    function lb(e, t, a, i, u) {
      var s = t.stateNode;
      xC(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, S = a.contextType, k = ui;
      if (typeof S == "object" && S !== null)
        k = nr(S);
      else {
        var b = Tf(t, a, !0);
        k = wf(t, b);
      }
      var U = a.getDerivedStateFromProps, H = typeof U == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !H && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== k) && f0(t, s, i, k), bC();
      var B = t.memoizedState, Ee = s.state = B;
      if (nm(t, i, s, u), Ee = t.memoizedState, f === v && B === Ee && !jh() && !rm() && !se)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || B !== e.memoizedState) && (t.flags |= _t), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || B !== e.memoizedState) && (t.flags |= Qn), !1;
      typeof U == "function" && (sS(t, a, U, i), Ee = t.memoizedState);
      var Ie = rm() || o0(t, a, p, i, B, Ee, k) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      se;
      return Ie ? (!H && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Ee, k), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Ee, k)), typeof s.componentDidUpdate == "function" && (t.flags |= _t), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Qn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || B !== e.memoizedState) && (t.flags |= _t), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || B !== e.memoizedState) && (t.flags |= Qn), t.memoizedProps = i, t.memoizedState = Ee), s.props = i, s.state = Ee, s.context = k, Ie;
    }
    function Zs(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function dS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function ub(e, t) {
      return !0;
    }
    function pS(e, t) {
      try {
        var a = ub(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === W)
            return;
          console.error(i);
        }
        var p = u ? et(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === V)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var S = et(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + S + ".");
        }
        var k = v + `
` + f + `

` + ("" + y);
        console.error(k);
      } catch (b) {
        setTimeout(function() {
          throw b;
        });
      }
    }
    var ob = typeof WeakMap == "function" ? WeakMap : Map;
    function d0(e, t, a) {
      var i = Pu(nn, a);
      i.tag = gg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        e1(u), pS(e, t);
      }, i;
    }
    function vS(e, t, a) {
      var i = Pu(nn, a);
      i.tag = gg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          TR(e), pS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        TR(e), pS(e, t), typeof u != "function" && J_(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, qe) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", et(e) || "Unknown"));
      }), i;
    }
    function p0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new ob(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = t1.bind(null, e, t, a);
        Jr && Gp(e, a), t.then(s, s);
      }
    }
    function sb(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function cb(e, t) {
      var a = e.tag;
      if ((e.mode & gt) === Ve && (a === Y || a === We || a === he)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function v0(e) {
      var t = e;
      do {
        if (t.tag === Z && Yx(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function h0(e, t, a, i, u) {
      if ((e.mode & gt) === Ve) {
        if (e === t)
          e.flags |= Jn;
        else {
          if (e.flags |= Fe, a.flags |= xc, a.flags &= -52805, a.tag === W) {
            var s = a.alternate;
            if (s === null)
              a.tag = Rt;
            else {
              var f = Pu(nn, qe);
              f.tag = Jh, Ao(a, f, qe);
            }
          }
          a.lanes = ot(a.lanes, qe);
        }
        return e;
      }
      return e.flags |= Jn, e.lanes = u, e;
    }
    function fb(e, t, a, i, u) {
      if (a.flags |= os, Jr && Gp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        cb(a), jr() && a.mode & gt && lC();
        var f = v0(t);
        if (f !== null) {
          f.flags &= ~Rr, h0(f, t, a, e, u), f.mode & gt && p0(e, s, u), sb(f, e, s);
          return;
        } else {
          if (!Vv(u)) {
            p0(e, s, u), WS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (jr() && a.mode & gt) {
        lC();
        var v = v0(t);
        if (v !== null) {
          (v.flags & Jn) === Pe && (v.flags |= Rr), h0(v, t, a, e, u), lg(Zs(i, a));
          return;
        }
      }
      i = Zs(i, a), Y_(i);
      var y = t;
      do {
        switch (y.tag) {
          case V: {
            var S = i;
            y.flags |= Jn;
            var k = Ts(u);
            y.lanes = ot(y.lanes, k);
            var b = d0(y, S, k);
            Cg(y, b);
            return;
          }
          case W:
            var U = i, H = y.type, B = y.stateNode;
            if ((y.flags & Fe) === Pe && (typeof H.getDerivedStateFromError == "function" || B !== null && typeof B.componentDidCatch == "function" && !vR(B))) {
              y.flags |= Jn;
              var Ee = Ts(u);
              y.lanes = ot(y.lanes, Ee);
              var Ie = vS(y, U, Ee);
              Cg(y, Ie);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function db() {
      return null;
    }
    var Mp = w.ReactCurrentOwner, ol = !1, hS, Lp, mS, yS, gS, ec, SS, _m, Ap;
    hS = {}, Lp = {}, mS = {}, yS = {}, gS = {}, ec = !1, SS = {}, _m = {}, Ap = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = gC(t, null, a, i) : t.child = kf(t, e.child, a, i);
    }
    function pb(e, t, a, i) {
      t.child = kf(t, e.child, null, i), t.child = kf(t, null, a, i);
    }
    function m0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Mt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, $n(!0), v = Uf(e, t, f, i, p, u), y = jf(), t.mode & Zt) {
          gn(!0);
          try {
            v = Uf(e, t, f, i, p, u), y = jf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (MC(e, t, u), Vu(e, t, u)) : (jr() && y && eg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function y0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (g1(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = $f(s), t.tag = he, t.type = f, RS(t, s), g0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            Mt(s)
          ), a.defaultProps !== void 0) {
            var v = Mt(s) || "Unknown";
            Ap[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Ap[v] = !0);
          }
        }
        var y = aE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var S = a.type, k = S.propTypes;
        k && nl(
          k,
          i,
          // Resolved props
          "prop",
          Mt(S)
        );
      }
      var b = e.child, U = kS(e, u);
      if (!U) {
        var H = b.memoizedProps, B = a.compare;
        if (B = B !== null ? B : De, B(H, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var Ee = ic(b, i);
      return Ee.ref = t.ref, Ee.return = t, t.child = Ee, Ee;
    }
    function g0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === tt) {
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
            Mt(s)
          );
        }
      }
      if (e !== null) {
        var S = e.memoizedProps;
        if (De(S, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = S, kS(e, u))
            (e.flags & xc) !== Pe && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return ES(e, t, a, i, u);
    }
    function S0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ie)
        if ((t.mode & gt) === Ve) {
          var f = {
            baseLanes: q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Pm(t, a);
        } else if (ea(a, Zr)) {
          var k = {
            baseLanes: q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = k;
          var b = s !== null ? s.baseLanes : a;
          Pm(t, b);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = ot(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Zr;
          var S = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = S, t.updateQueue = null, Pm(t, v), null;
        }
      else {
        var U;
        s !== null ? (U = ot(s.baseLanes, a), t.memoizedState = null) : U = a, Pm(t, U);
      }
      return Sa(e, t, u, a), t.child;
    }
    function vb(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function hb(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function mb(e, t, a) {
      {
        t.flags |= _t;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function E0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Cn, t.flags |= ho);
    }
    function ES(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Mt(a)
        );
      }
      var f;
      {
        var p = Tf(t, a, !0);
        f = wf(t, p);
      }
      var v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, $n(!0), v = Uf(e, t, a, i, f, u), y = jf(), t.mode & Zt) {
          gn(!0);
          try {
            v = Uf(e, t, a, i, f, u), y = jf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (MC(e, t, u), Vu(e, t, u)) : (jr() && y && eg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function C0(e, t, a, i, u) {
      {
        switch (L1(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Fe, t.flags |= Jn;
            var y = new Error("Simulated error coming from DevTools"), S = Ts(u);
            t.lanes = ot(t.lanes, S);
            var k = vS(t, Zs(y, t), S);
            Cg(t, k);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var b = a.propTypes;
          b && nl(
            b,
            i,
            // Resolved props
            "prop",
            Mt(a)
          );
        }
      }
      var U;
      Yl(a) ? (U = !0, Hh(t)) : U = !1, Of(t, u);
      var H = t.stateNode, B;
      H === null ? (Dm(e, t), c0(t, a, i), fS(t, a, i, u), B = !0) : e === null ? B = ib(t, a, i, u) : B = lb(e, t, a, i, u);
      var Ee = CS(e, t, a, B, U, u);
      {
        var Ie = t.stateNode;
        B && Ie.props !== i && (ec || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", et(t) || "a component"), ec = !0);
      }
      return Ee;
    }
    function CS(e, t, a, i, u, s) {
      E0(e, t);
      var f = (t.flags & Fe) !== Pe;
      if (!i && !f)
        return u && nC(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Mp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, i0();
      else {
        ha(t);
        {
          if ($n(!0), v = p.render(), t.mode & Zt) {
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
      return t.flags |= ni, e !== null && f ? pb(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && nC(t, a, !0), t.child;
    }
    function R0(e) {
      var t = e.stateNode;
      t.pendingContext ? eC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && eC(e, t.context, !1), Rg(e, t.containerInfo);
    }
    function yb(e, t, a) {
      if (R0(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      xC(e, t), nm(t, i, null, a);
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
          var S = Zs(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return T0(e, t, p, a, S);
        } else if (p !== s) {
          var k = Zs(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return T0(e, t, p, a, k);
        } else {
          Ex(t);
          var b = gC(t, null, p, a);
          t.child = b;
          for (var U = b; U; )
            U.flags = U.flags & ~yn | qr, U = U.sibling;
        }
      } else {
        if (_f(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function T0(e, t, a, i, u) {
      return _f(), lg(u), t.flags |= Rr, Sa(e, t, a, i), t.child;
    }
    function gb(e, t, a) {
      DC(t), e === null && ig(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Py(i, u);
      return p ? f = null : s !== null && Py(i, s) && (t.flags |= Oa), E0(e, t), Sa(e, t, f, a), t.child;
    }
    function Sb(e, t) {
      return e === null && ig(t), null;
    }
    function Eb(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = S1(v), S = ul(v, u), k;
      switch (y) {
        case Y:
          return RS(t, v), t.type = v = $f(v), k = ES(null, t, v, S, i), k;
        case W:
          return t.type = v = JS(v), k = C0(null, t, v, S, i), k;
        case We:
          return t.type = v = ZS(v), k = m0(null, t, v, S, i), k;
        case Ae: {
          if (t.type !== t.elementType) {
            var b = v.propTypes;
            b && nl(
              b,
              S,
              // Resolved for outer only
              "prop",
              Mt(v)
            );
          }
          return k = y0(
            null,
            t,
            v,
            ul(v.type, S),
            // The inner type can have defaults too
            i
          ), k;
        }
      }
      var U = "";
      throw v !== null && typeof v == "object" && v.$$typeof === tt && (U = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + U));
    }
    function Cb(e, t, a, i, u) {
      Dm(e, t), t.tag = W;
      var s;
      return Yl(a) ? (s = !0, Hh(t)) : s = !1, Of(t, u), c0(t, a, i), fS(t, a, i, u), CS(null, t, a, !0, s, u);
    }
    function Rb(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s;
      {
        var f = Tf(t, a, !1);
        s = wf(t, f);
      }
      Of(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = Mt(a) || "Unknown";
          hS[y] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), hS[y] = !0);
        }
        t.mode & Zt && al.recordLegacyContextWarning(t, null), $n(!0), Mp.current = t, p = Uf(null, t, a, u, s, i), v = jf(), $n(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var S = Mt(a) || "Unknown";
        Lp[S] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", S, S, S), Lp[S] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var k = Mt(a) || "Unknown";
          Lp[k] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", k, k, k), Lp[k] = !0);
        }
        t.tag = W, t.memoizedState = null, t.updateQueue = null;
        var b = !1;
        return Yl(a) ? (b = !0, Hh(t)) : b = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Eg(t), s0(t, p), fS(t, a, u, i), CS(null, t, a, !0, b, i);
      } else {
        if (t.tag = Y, t.mode & Zt) {
          gn(!0);
          try {
            p = Uf(null, t, a, u, s, i), v = jf();
          } finally {
            gn(!1);
          }
        }
        return jr() && v && eg(t), Sa(null, t, p, i), RS(t, a), t.child;
      }
    }
    function RS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), gS[u] || (gS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Mt(t) || "Unknown";
          Ap[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Ap[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = Mt(t) || "Unknown";
          yS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), yS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Mt(t) || "Unknown";
          mS[v] || (g("%s: Function components do not support contextType.", v), mS[v] = !0);
        }
      }
    }
    var TS = {
      dehydrated: null,
      treeContext: null,
      retryLane: zt
    };
    function wS(e) {
      return {
        baseLanes: e,
        cachePool: db(),
        transitions: null
      };
    }
    function Tb(e, t) {
      var a = null;
      return {
        baseLanes: ot(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function wb(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return xg(e, Tp);
    }
    function xb(e, t) {
      return ws(e.childLanes, t);
    }
    function w0(e, t, a) {
      var i = t.pendingProps;
      A1(t) && (t.flags |= Fe);
      var u = il.current, s = !1, f = (t.flags & Fe) !== Pe;
      if (f || wb(u, e) ? (s = !0, t.flags &= ~Fe) : (e === null || e.memoizedState !== null) && (u = Ix(u, NC)), u = Mf(u), Uo(t, u), e === null) {
        ig(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Ob(t, v);
        }
        var y = i.children, S = i.fallback;
        if (s) {
          var k = bb(t, y, S, a), b = t.child;
          return b.memoizedState = wS(a), t.memoizedState = TS, k;
        } else
          return xS(t, y);
      } else {
        var U = e.memoizedState;
        if (U !== null) {
          var H = U.dehydrated;
          if (H !== null)
            return Nb(e, t, f, i, H, U, a);
        }
        if (s) {
          var B = i.fallback, Ee = i.children, Ie = kb(e, t, Ee, B, a), je = t.child, Ot = e.child.memoizedState;
          return je.memoizedState = Ot === null ? wS(a) : Tb(Ot, a), je.childLanes = xb(e, a), t.memoizedState = TS, Ie;
        } else {
          var Tt = i.children, L = _b(e, t, Tt, a);
          return t.memoizedState = null, L;
        }
      }
    }
    function xS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = bS(u, i);
      return s.return = e, e.child = s, s;
    }
    function bb(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & gt) === Ve && s !== null ? (p = s, p.childLanes = q, p.pendingProps = f, e.mode & jt && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = bS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function bS(e, t, a) {
      return xR(e, t, q, null);
    }
    function x0(e, t) {
      return ic(e, t);
    }
    function _b(e, t, a, i) {
      var u = e.child, s = u.sibling, f = x0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & gt) === Ve && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function kb(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & gt) === Ve && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var S = t.child;
        y = S, y.childLanes = q, y.pendingProps = v, t.mode & jt && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = x0(f, v), y.subtreeFlags = f.subtreeFlags & zn;
      var k;
      return p !== null ? k = ic(p, i) : (k = Yo(i, s, u, null), k.flags |= yn), k.return = t, y.return = t, y.sibling = k, t.child = y, k;
    }
    function km(e, t, a, i) {
      i !== null && lg(i), kf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = xS(t, s);
      return f.flags |= yn, t.memoizedState = null, f;
    }
    function Db(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = bS(f, s), v = Yo(i, s, u, null);
      return v.flags |= yn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & gt) !== Ve && kf(t, e.child, null, u), v;
    }
    function Ob(e, t, a) {
      return (e.mode & gt) === Ve ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = qe) : Yy(t) ? e.lanes = Tr : e.lanes = Zr, null;
    }
    function Nb(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Rr) {
          t.flags &= ~Rr;
          var L = dS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return km(e, t, f, L);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Fe, null;
          var I = i.children, A = i.fallback, ne = Db(e, t, I, A, f), xe = t.child;
          return xe.memoizedState = wS(f), t.memoizedState = TS, ne;
        }
      else {
        if (gx(), (t.mode & gt) === Ve)
          return km(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Yy(u)) {
          var p, v, y;
          {
            var S = zw(u);
            p = S.digest, v = S.message, y = S.stack;
          }
          var k;
          v ? k = new Error(v) : k = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var b = dS(k, p, y);
          return km(e, t, f, b);
        }
        var U = ea(f, e.childLanes);
        if (ol || U) {
          var H = Hm();
          if (H !== null) {
            var B = jd(H, f);
            if (B !== zt && B !== s.retryLane) {
              s.retryLane = B;
              var Ee = nn;
              Ha(e, B), gr(H, e, B, Ee);
            }
          }
          WS();
          var Ie = dS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return km(e, t, f, Ie);
        } else if (GE(u)) {
          t.flags |= Fe, t.child = e.child;
          var je = n1.bind(null, e);
          return Uw(u, je), null;
        } else {
          Cx(t, u, s.treeContext);
          var Ot = i.children, Tt = xS(t, Ot);
          return Tt.flags |= qr, Tt;
        }
      }
    }
    function b0(e, t, a) {
      e.lanes = ot(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = ot(i.lanes, t)), mg(e.return, t, a);
    }
    function Mb(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === Z) {
          var u = i.memoizedState;
          u !== null && b0(i, a, e);
        } else if (i.tag === Wt)
          b0(i, a, e);
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
    function Lb(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && lm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function Ab(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !SS[e])
        if (SS[e] = !0, typeof e == "string")
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
    function zb(e, t) {
      e !== void 0 && !_m[e] && (e !== "collapsed" && e !== "hidden" ? (_m[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (_m[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function _0(e, t) {
      {
        var a = vt(e), i = !a && typeof ut(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Ub(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (vt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!_0(e[a], a))
              return;
        } else {
          var i = ut(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!_0(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function _S(e, t, a, i, u) {
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
    function k0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Ab(u), zb(s, u), Ub(f, u), Sa(e, t, f, a);
      var p = il.current, v = xg(p, Tp);
      if (v)
        p = bg(p, Tp), t.flags |= Fe;
      else {
        var y = e !== null && (e.flags & Fe) !== Pe;
        y && Mb(t, t.child, a), p = Mf(p);
      }
      if (Uo(t, p), (t.mode & gt) === Ve)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var S = Lb(t.child), k;
            S === null ? (k = t.child, t.child = null) : (k = S.sibling, S.sibling = null), _S(
              t,
              !1,
              // isBackwards
              k,
              S,
              s
            );
            break;
          }
          case "backwards": {
            var b = null, U = t.child;
            for (t.child = null; U !== null; ) {
              var H = U.alternate;
              if (H !== null && lm(H) === null) {
                t.child = U;
                break;
              }
              var B = U.sibling;
              U.sibling = b, b = U, U = B;
            }
            _S(
              t,
              !0,
              // isBackwards
              b,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            _S(
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
    function jb(e, t, a) {
      Rg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = kf(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var D0 = !1;
    function Fb(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || D0 || (D0 = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (CC(t, u, p), f !== null) {
        var y = f.value;
        if (J(y, p)) {
          if (f.children === s.children && !jh())
            return Vu(e, t, a);
        } else
          Ax(t, u, a);
      }
      var S = s.children;
      return Sa(e, t, S, a), t.child;
    }
    var O0 = !1;
    function Hb(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (O0 || (O0 = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = nr(i);
      ha(t);
      var p;
      return Mp.current = t, $n(!0), p = s(f), $n(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function zp() {
      ol = !0;
    }
    function Dm(e, t) {
      (t.mode & gt) === Ve && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), i0(), Wp(t.lanes), ea(a, t.childLanes) ? (Mx(e, t), t.child) : null;
    }
    function Pb(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= Da) : s.push(e), a.flags |= yn, a;
      }
    }
    function kS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function Vb(e, t, a) {
      switch (t.tag) {
        case V:
          R0(t), t.stateNode, _f();
          break;
        case re:
          DC(t);
          break;
        case W: {
          var i = t.type;
          Yl(i) && Hh(t);
          break;
        }
        case de:
          Rg(t, t.stateNode.containerInfo);
          break;
        case at: {
          var u = t.memoizedProps.value, s = t.type._context;
          CC(t, s, u);
          break;
        }
        case fe:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= _t);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case Z: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Mf(il.current)), t.flags |= Fe, null;
            var y = t.child, S = y.childLanes;
            if (ea(a, S))
              return w0(e, t, a);
            Uo(t, Mf(il.current));
            var k = Vu(e, t, a);
            return k !== null ? k.sibling : null;
          } else
            Uo(t, Mf(il.current));
          break;
        }
        case Wt: {
          var b = (e.flags & Fe) !== Pe, U = ea(a, t.childLanes);
          if (b) {
            if (U)
              return k0(e, t, a);
            t.flags |= Fe;
          }
          var H = t.memoizedState;
          if (H !== null && (H.rendering = null, H.tail = null, H.lastEffect = null), Uo(t, il.current), U)
            break;
          return null;
        }
        case He:
        case At:
          return t.lanes = q, S0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function N0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Pb(e, t, aE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || jh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = kS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Fe) === Pe)
            return ol = !1, Vb(e, t, a);
          (e.flags & xc) !== Pe ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, jr() && dx(t)) {
        var f = t.index, p = px();
        iC(t, p, f);
      }
      switch (t.lanes = q, t.tag) {
        case Re:
          return Rb(e, t, t.type, a);
        case it: {
          var v = t.elementType;
          return Eb(e, t, v, a);
        }
        case Y: {
          var y = t.type, S = t.pendingProps, k = t.elementType === y ? S : ul(y, S);
          return ES(e, t, y, k, a);
        }
        case W: {
          var b = t.type, U = t.pendingProps, H = t.elementType === b ? U : ul(b, U);
          return C0(e, t, b, H, a);
        }
        case V:
          return yb(e, t, a);
        case re:
          return gb(e, t, a);
        case ce:
          return Sb(e, t);
        case Z:
          return w0(e, t, a);
        case de:
          return jb(e, t, a);
        case We: {
          var B = t.type, Ee = t.pendingProps, Ie = t.elementType === B ? Ee : ul(B, Ee);
          return m0(e, t, B, Ie, a);
        }
        case Ne:
          return vb(e, t, a);
        case Ze:
          return hb(e, t, a);
        case fe:
          return mb(e, t, a);
        case at:
          return Fb(e, t, a);
        case Qt:
          return Hb(e, t, a);
        case Ae: {
          var je = t.type, Ot = t.pendingProps, Tt = ul(je, Ot);
          if (t.type !== t.elementType) {
            var L = je.propTypes;
            L && nl(
              L,
              Tt,
              // Resolved for outer only
              "prop",
              Mt(je)
            );
          }
          return Tt = ul(je.type, Tt), y0(e, t, je, Tt, a);
        }
        case he:
          return g0(e, t, t.type, t.pendingProps, a);
        case Rt: {
          var I = t.type, A = t.pendingProps, ne = t.elementType === I ? A : ul(I, A);
          return Cb(e, t, I, ne, a);
        }
        case Wt:
          return k0(e, t, a);
        case wt:
          break;
        case He:
          return S0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ff(e) {
      e.flags |= _t;
    }
    function M0(e) {
      e.flags |= Cn, e.flags |= ho;
    }
    var L0, DS, A0, z0;
    L0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === re || u.tag === ce)
          sw(e, u.stateNode);
        else if (u.tag !== de) {
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
    }, DS = function(e, t) {
    }, A0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Tg(), v = fw(f, a, s, i, u, p);
        t.updateQueue = v, v && Ff(t);
      }
    }, z0 = function(e, t, a, i) {
      a !== i && Ff(t);
    };
    function Up(e, t) {
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
      var t = e.alternate !== null && e.alternate.child === e.child, a = q, i = Pe;
      if (t) {
        if ((e.mode & jt) !== Ve) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = ot(a, ot(y.lanes, y.childLanes)), i |= y.subtreeFlags & zn, i |= y.flags & zn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var S = e.child; S !== null; )
            a = ot(a, ot(S.lanes, S.childLanes)), i |= S.subtreeFlags & zn, i |= S.flags & zn, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & jt) !== Ve) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = ot(a, ot(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = ot(a, ot(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Bb(e, t, a) {
      if (bx() && (t.mode & gt) !== Ve && (t.flags & Fe) === Pe)
        return dC(t), _f(), t.flags |= Rr | os | Jn, !1;
      var i = Yh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (wx(t), Hr(t), (t.mode & jt) !== Ve) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (_f(), (t.flags & Fe) === Pe && (t.memoizedState = null), t.flags |= _t, Hr(t), (t.mode & jt) !== Ve) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return pC(), !0;
    }
    function U0(e, t, a) {
      var i = t.pendingProps;
      switch (tg(t), t.tag) {
        case Re:
        case it:
        case he:
        case Y:
        case We:
        case Ne:
        case Ze:
        case fe:
        case Qt:
        case Ae:
          return Hr(t), null;
        case W: {
          var u = t.type;
          return Yl(u) && Fh(t), Hr(t), null;
        }
        case V: {
          var s = t.stateNode;
          if (Nf(t), Xy(t), kg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Yh(t);
            if (f)
              Ff(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Rr) !== Pe) && (t.flags |= Qn, pC());
            }
          }
          return DS(e, t), Hr(t), null;
        }
        case re: {
          wg(t);
          var v = kC(), y = t.type;
          if (e !== null && t.stateNode != null)
            A0(e, t, y, i, v), e.ref !== t.ref && M0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Hr(t), null;
            }
            var S = Tg(), k = Yh(t);
            if (k)
              Rx(t, v, S) && Ff(t);
            else {
              var b = ow(y, i, v, S, t);
              L0(b, t, !1, !1), t.stateNode = b, cw(b, y, i, v) && Ff(t);
            }
            t.ref !== null && M0(t);
          }
          return Hr(t), null;
        }
        case ce: {
          var U = i;
          if (e && t.stateNode != null) {
            var H = e.memoizedProps;
            z0(e, t, H, U);
          } else {
            if (typeof U != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var B = kC(), Ee = Tg(), Ie = Yh(t);
            Ie ? Tx(t) && Ff(t) : t.stateNode = dw(U, B, Ee, t);
          }
          return Hr(t), null;
        }
        case Z: {
          Lf(t);
          var je = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Ot = Bb(e, t, je);
            if (!Ot)
              return t.flags & Jn ? t : null;
          }
          if ((t.flags & Fe) !== Pe)
            return t.lanes = a, (t.mode & jt) !== Ve && Zg(t), t;
          var Tt = je !== null, L = e !== null && e.memoizedState !== null;
          if (Tt !== L && Tt) {
            var I = t.child;
            if (I.flags |= An, (t.mode & gt) !== Ve) {
              var A = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              A || xg(il.current, NC) ? I_() : WS();
            }
          }
          var ne = t.updateQueue;
          if (ne !== null && (t.flags |= _t), Hr(t), (t.mode & jt) !== Ve && Tt) {
            var xe = t.child;
            xe !== null && (t.treeBaseDuration -= xe.treeBaseDuration);
          }
          return null;
        }
        case de:
          return Nf(t), DS(e, t), e === null && ix(t.stateNode.containerInfo), Hr(t), null;
        case at:
          var Ce = t.type._context;
          return hg(Ce, t), Hr(t), null;
        case Rt: {
          var Xe = t.type;
          return Yl(Xe) && Fh(t), Hr(t), null;
        }
        case Wt: {
          Lf(t);
          var rt = t.memoizedState;
          if (rt === null)
            return Hr(t), null;
          var tn = (t.flags & Fe) !== Pe, Pt = rt.rendering;
          if (Pt === null)
            if (tn)
              Up(rt, !1);
            else {
              var qn = $_() && (e === null || (e.flags & Fe) === Pe);
              if (!qn)
                for (var Vt = t.child; Vt !== null; ) {
                  var Vn = lm(Vt);
                  if (Vn !== null) {
                    tn = !0, t.flags |= Fe, Up(rt, !1);
                    var ua = Vn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= _t), t.subtreeFlags = Pe, Lx(t, a), Uo(t, bg(il.current, Tp)), t.child;
                  }
                  Vt = Vt.sibling;
                }
              rt.tail !== null && Wn() > rR() && (t.flags |= Fe, tn = !0, Up(rt, !1), t.lanes = kd);
            }
          else {
            if (!tn) {
              var Yr = lm(Pt);
              if (Yr !== null) {
                t.flags |= Fe, tn = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= _t), Up(rt, !0), rt.tail === null && rt.tailMode === "hidden" && !Pt.alternate && !jr())
                  return Hr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wn() * 2 - rt.renderingStartTime > rR() && a !== Zr && (t.flags |= Fe, tn = !0, Up(rt, !1), t.lanes = kd);
            }
            if (rt.isBackwards)
              Pt.sibling = t.child, t.child = Pt;
            else {
              var Ra = rt.last;
              Ra !== null ? Ra.sibling = Pt : t.child = Pt, rt.last = Pt;
            }
          }
          if (rt.tail !== null) {
            var Ta = rt.tail;
            rt.rendering = Ta, rt.tail = Ta.sibling, rt.renderingStartTime = Wn(), Ta.sibling = null;
            var oa = il.current;
            return tn ? oa = bg(oa, Tp) : oa = Mf(oa), Uo(t, oa), Ta;
          }
          return Hr(t), null;
        }
        case wt:
          break;
        case He:
        case At: {
          QS(t);
          var Qu = t.memoizedState, Qf = Qu !== null;
          if (e !== null) {
            var Jp = e.memoizedState, Jl = Jp !== null;
            Jl !== Qf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ie && (t.flags |= An);
          }
          return !Qf || (t.mode & gt) === Ve ? Hr(t) : ea(Xl, Zr) && (Hr(t), t.subtreeFlags & (yn | _t) && (t.flags |= An)), null;
        }
        case bt:
          return null;
        case Nt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ib(e, t, a) {
      switch (tg(t), t.tag) {
        case W: {
          var i = t.type;
          Yl(i) && Fh(t);
          var u = t.flags;
          return u & Jn ? (t.flags = u & ~Jn | Fe, (t.mode & jt) !== Ve && Zg(t), t) : null;
        }
        case V: {
          t.stateNode, Nf(t), Xy(t), kg();
          var s = t.flags;
          return (s & Jn) !== Pe && (s & Fe) === Pe ? (t.flags = s & ~Jn | Fe, t) : null;
        }
        case re:
          return wg(t), null;
        case Z: {
          Lf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            _f();
          }
          var p = t.flags;
          return p & Jn ? (t.flags = p & ~Jn | Fe, (t.mode & jt) !== Ve && Zg(t), t) : null;
        }
        case Wt:
          return Lf(t), null;
        case de:
          return Nf(t), null;
        case at:
          var v = t.type._context;
          return hg(v, t), null;
        case He:
        case At:
          return QS(t), null;
        case bt:
          return null;
        default:
          return null;
      }
    }
    function j0(e, t, a) {
      switch (tg(t), t.tag) {
        case W: {
          var i = t.type.childContextTypes;
          i != null && Fh(t);
          break;
        }
        case V: {
          t.stateNode, Nf(t), Xy(t), kg();
          break;
        }
        case re: {
          wg(t);
          break;
        }
        case de:
          Nf(t);
          break;
        case Z:
          Lf(t);
          break;
        case Wt:
          Lf(t);
          break;
        case at:
          var u = t.type._context;
          hg(u, t);
          break;
        case He:
        case At:
          QS(t);
          break;
      }
    }
    var F0 = null;
    F0 = /* @__PURE__ */ new Set();
    var Om = !1, Pr = !1, Yb = typeof WeakSet == "function" ? WeakSet : Set, Oe = null, Hf = null, Pf = null;
    function $b(e) {
      bl(null, function() {
        throw e;
      }), us();
    }
    var Qb = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & jt)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function H0(e, t) {
      try {
        Ho(dr, e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function OS(e, t, a) {
      try {
        Qb(e, a);
      } catch (i) {
        dn(e, t, i);
      }
    }
    function Wb(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        dn(e, t, i);
      }
    }
    function P0(e, t) {
      try {
        B0(e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function Vf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Ge && ht && e.mode & jt)
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
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", et(e));
        } else
          a.current = null;
    }
    function Nm(e, t, a) {
      try {
        a();
      } catch (i) {
        dn(e, t, i);
      }
    }
    var V0 = !1;
    function Gb(e, t) {
      lw(e.containerInfo), Oe = t, qb();
      var a = V0;
      return V0 = !1, a;
    }
    function qb() {
      for (; Oe !== null; ) {
        var e = Oe, t = e.child;
        (e.subtreeFlags & kl) !== Pe && t !== null ? (t.return = e, Oe = t) : Kb();
      }
    }
    function Kb() {
      for (; Oe !== null; ) {
        var e = Oe;
        Kt(e);
        try {
          Xb(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Oe = t;
          return;
        }
        Oe = e.return;
      }
    }
    function Xb(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Qn) !== Pe) {
        switch (Kt(e), e.tag) {
          case Y:
          case We:
          case he:
            break;
          case W: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ec && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = F0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", et(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case V: {
            {
              var v = e.stateNode;
              Nw(v.containerInfo);
            }
            break;
          }
          case re:
          case ce:
          case de:
          case Rt:
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
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Pa ? Ki(t) : (e & dr) !== Pa && cs(t), (e & $l) !== Pa && qp(!0), Nm(t, a, p), (e & $l) !== Pa && qp(!1), (e & Fr) !== Pa ? Ml() : (e & dr) !== Pa && bd());
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
            (e & Fr) !== Pa ? xd(t) : (e & dr) !== Pa && Nc(t);
            var f = s.create;
            (e & $l) !== Pa && qp(!0), s.destroy = f(), (e & $l) !== Pa && qp(!1), (e & Fr) !== Pa ? Uv() : (e & dr) !== Pa && jv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & dr) !== Pe ? v = "useLayoutEffect" : (s.tag & $l) !== Pe ? v = "useInsertionEffect" : v = "useEffect";
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
    function Jb(e, t) {
      if ((t.flags & _t) !== Pe)
        switch (t.tag) {
          case fe: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = r0(), p = t.alternate === null ? "mount" : "update";
            n0() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case V:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case fe:
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
    function Zb(e, t, a, i) {
      if ((a.flags & Ol) !== Pe)
        switch (a.tag) {
          case Y:
          case We:
          case he: {
            if (!Pr)
              if (a.mode & jt)
                try {
                  ql(), Ho(dr | fr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(dr | fr, a);
            break;
          }
          case W: {
            var u = a.stateNode;
            if (a.flags & _t && !Pr)
              if (t === null)
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(a) || "instance")), a.mode & jt)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(a) || "instance")), a.mode & jt)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(a) || "instance")), _C(a, p, u));
            break;
          }
          case V: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case re:
                    y = a.child.stateNode;
                    break;
                  case W:
                    y = a.child.stateNode;
                    break;
                }
              _C(a, v, y);
            }
            break;
          }
          case re: {
            var S = a.stateNode;
            if (t === null && a.flags & _t) {
              var k = a.type, b = a.memoizedProps;
              yw(S, k, b);
            }
            break;
          }
          case ce:
            break;
          case de:
            break;
          case fe: {
            {
              var U = a.memoizedProps, H = U.onCommit, B = U.onRender, Ee = a.stateNode.effectDuration, Ie = r0(), je = t === null ? "mount" : "update";
              n0() && (je = "nested-update"), typeof B == "function" && B(a.memoizedProps.id, je, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Ie);
              {
                typeof H == "function" && H(a.memoizedProps.id, je, Ee, Ie), K_(a);
                var Ot = a.return;
                e: for (; Ot !== null; ) {
                  switch (Ot.tag) {
                    case V:
                      var Tt = Ot.stateNode;
                      Tt.effectDuration += Ee;
                      break e;
                    case fe:
                      var L = Ot.stateNode;
                      L.effectDuration += Ee;
                      break e;
                  }
                  Ot = Ot.return;
                }
              }
            }
            break;
          }
          case Z: {
            u_(e, a);
            break;
          }
          case Wt:
          case Rt:
          case wt:
          case He:
          case At:
          case Nt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Pr || a.flags & Cn && B0(a);
    }
    function e_(e) {
      switch (e.tag) {
        case Y:
        case We:
        case he: {
          if (e.mode & jt)
            try {
              ql(), H0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            H0(e, e.return);
          break;
        }
        case W: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Wb(e, e.return, t), P0(e, e.return);
          break;
        }
        case re: {
          P0(e, e.return);
          break;
        }
      }
    }
    function t_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === re) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? _w(u) : Dw(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === ce) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? kw(s) : Ow(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === He || i.tag === At) && i.memoizedState !== null && i !== e)) {
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
    function B0(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case re:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & jt)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", et(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", et(e)), t.current = i;
      }
    }
    function n_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function I0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, I0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === re) {
          var a = e.stateNode;
          a !== null && ox(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function r_(e) {
      for (var t = e.return; t !== null; ) {
        if (Y0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Y0(e) {
      return e.tag === re || e.tag === V || e.tag === de;
    }
    function $0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Y0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== re && t.tag !== ce && t.tag !== St; ) {
          if (t.flags & yn || t.child === null || t.tag === de)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & yn))
          return t.stateNode;
      }
    }
    function a_(e) {
      var t = r_(e);
      switch (t.tag) {
        case re: {
          var a = t.stateNode;
          t.flags & Oa && (WE(a), t.flags &= ~Oa);
          var i = $0(e);
          MS(e, i, a);
          break;
        }
        case V:
        case de: {
          var u = t.stateNode.containerInfo, s = $0(e);
          NS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function NS(e, t, a) {
      var i = e.tag, u = i === re || i === ce;
      if (u) {
        var s = e.stateNode;
        t ? Tw(a, s, t) : Cw(a, s);
      } else if (i !== de) {
        var f = e.child;
        if (f !== null) {
          NS(f, t, a);
          for (var p = f.sibling; p !== null; )
            NS(p, t, a), p = p.sibling;
        }
      }
    }
    function MS(e, t, a) {
      var i = e.tag, u = i === re || i === ce;
      if (u) {
        var s = e.stateNode;
        t ? Rw(a, s, t) : Ew(a, s);
      } else if (i !== de) {
        var f = e.child;
        if (f !== null) {
          MS(f, t, a);
          for (var p = f.sibling; p !== null; )
            MS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function i_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case re: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case V: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case de: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        Q0(e, t, a), Vr = null, cl = !1;
      }
      n_(a);
    }
    function Po(e, t, a) {
      for (var i = a.child; i !== null; )
        Q0(e, t, i), i = i.sibling;
    }
    function Q0(e, t, a) {
      switch (Rd(a), a.tag) {
        case re:
          Pr || Vf(a, t);
        case ce: {
          {
            var i = Vr, u = cl;
            Vr = null, Po(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? xw(Vr, a.stateNode) : ww(Vr, a.stateNode));
          }
          return;
        }
        case St: {
          Vr !== null && (cl ? bw(Vr, a.stateNode) : Iy(Vr, a.stateNode));
          return;
        }
        case de: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Po(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case Y:
        case We:
        case Ae:
        case he: {
          if (!Pr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, S = y;
                do {
                  var k = S, b = k.destroy, U = k.tag;
                  b !== void 0 && ((U & $l) !== Pa ? Nm(a, t, b) : (U & dr) !== Pa && (cs(a), a.mode & jt ? (ql(), Nm(a, t, b), Gl(a)) : Nm(a, t, b), bd())), S = S.next;
                } while (S !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case W: {
          if (!Pr) {
            Vf(a, t);
            var H = a.stateNode;
            typeof H.componentWillUnmount == "function" && OS(a, t, H);
          }
          Po(e, t, a);
          return;
        }
        case wt: {
          Po(e, t, a);
          return;
        }
        case He: {
          if (
            // TODO: Remove this dead flag
            a.mode & gt
          ) {
            var B = Pr;
            Pr = B || a.memoizedState !== null, Po(e, t, a), Pr = B;
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
    function l_(e) {
      e.memoizedState;
    }
    function u_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && $w(s);
          }
        }
      }
    }
    function W0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new Yb()), t.forEach(function(i) {
          var u = r1.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Jr)
              if (Hf !== null && Pf !== null)
                Gp(Pf, Hf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function o_(e, t, a) {
      Hf = a, Pf = e, Kt(t), G0(t, e), Kt(t), Hf = null, Pf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            i_(e, t, s);
          } catch (v) {
            dn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Kt(p), G0(p, e), p = p.sibling;
      Kt(f);
    }
    function G0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case Y:
        case We:
        case Ae:
        case he: {
          if (fl(t, e), Kl(e), u & _t) {
            try {
              sl($l | fr, e, e.return), Ho($l | fr, e);
            } catch (Xe) {
              dn(e, e.return, Xe);
            }
            if (e.mode & jt) {
              try {
                ql(), sl(dr | fr, e, e.return);
              } catch (Xe) {
                dn(e, e.return, Xe);
              }
              Gl(e);
            } else
              try {
                sl(dr | fr, e, e.return);
              } catch (Xe) {
                dn(e, e.return, Xe);
              }
          }
          return;
        }
        case W: {
          fl(t, e), Kl(e), u & Cn && i !== null && Vf(i, i.return);
          return;
        }
        case re: {
          fl(t, e), Kl(e), u & Cn && i !== null && Vf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                WE(s);
              } catch (Xe) {
                dn(e, e.return, Xe);
              }
            }
            if (u & _t) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, S = e.updateQueue;
                if (e.updateQueue = null, S !== null)
                  try {
                    gw(f, S, y, v, p, e);
                  } catch (Xe) {
                    dn(e, e.return, Xe);
                  }
              }
            }
          }
          return;
        }
        case ce: {
          if (fl(t, e), Kl(e), u & _t) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var k = e.stateNode, b = e.memoizedProps, U = i !== null ? i.memoizedProps : b;
            try {
              Sw(k, U, b);
            } catch (Xe) {
              dn(e, e.return, Xe);
            }
          }
          return;
        }
        case V: {
          if (fl(t, e), Kl(e), u & _t && i !== null) {
            var H = i.memoizedState;
            if (H.isDehydrated)
              try {
                Yw(t.containerInfo);
              } catch (Xe) {
                dn(e, e.return, Xe);
              }
          }
          return;
        }
        case de: {
          fl(t, e), Kl(e);
          return;
        }
        case Z: {
          fl(t, e), Kl(e);
          var B = e.child;
          if (B.flags & An) {
            var Ee = B.stateNode, Ie = B.memoizedState, je = Ie !== null;
            if (Ee.isHidden = je, je) {
              var Ot = B.alternate !== null && B.alternate.memoizedState !== null;
              Ot || B_();
            }
          }
          if (u & _t) {
            try {
              l_(e);
            } catch (Xe) {
              dn(e, e.return, Xe);
            }
            W0(e);
          }
          return;
        }
        case He: {
          var Tt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & gt
          ) {
            var L = Pr;
            Pr = L || Tt, fl(t, e), Pr = L;
          } else
            fl(t, e);
          if (Kl(e), u & An) {
            var I = e.stateNode, A = e.memoizedState, ne = A !== null, xe = e;
            if (I.isHidden = ne, ne && !Tt && (xe.mode & gt) !== Ve) {
              Oe = xe;
              for (var Ce = xe.child; Ce !== null; )
                Oe = Ce, c_(Ce), Ce = Ce.sibling;
            }
            t_(xe, ne);
          }
          return;
        }
        case Wt: {
          fl(t, e), Kl(e), u & _t && W0(e);
          return;
        }
        case wt:
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
          a_(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        e.flags &= ~yn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function s_(e, t, a) {
      Hf = a, Pf = t, Oe = e, q0(e, t, a), Hf = null, Pf = null;
    }
    function q0(e, t, a) {
      for (var i = (e.mode & gt) !== Ve; Oe !== null; ) {
        var u = Oe, s = u.child;
        if (u.tag === He && i) {
          var f = u.memoizedState !== null, p = f || Om;
          if (p) {
            LS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, S = y || Pr, k = Om, b = Pr;
            Om = p, Pr = S, Pr && !b && (Oe = u, f_(u));
            for (var U = s; U !== null; )
              Oe = U, q0(
                U,
                // New root; bubble back up to here and stop.
                t,
                a
              ), U = U.sibling;
            Oe = u, Om = k, Pr = b, LS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== Pe && s !== null ? (s.return = u, Oe = s) : LS(e, t, a);
      }
    }
    function LS(e, t, a) {
      for (; Oe !== null; ) {
        var i = Oe;
        if ((i.flags & Ol) !== Pe) {
          var u = i.alternate;
          Kt(i);
          try {
            Zb(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          Oe = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Oe = s;
          return;
        }
        Oe = i.return;
      }
    }
    function c_(e) {
      for (; Oe !== null; ) {
        var t = Oe, a = t.child;
        switch (t.tag) {
          case Y:
          case We:
          case Ae:
          case he: {
            if (t.mode & jt)
              try {
                ql(), sl(dr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(dr, t, t.return);
            break;
          }
          case W: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && OS(t, t.return, i);
            break;
          }
          case re: {
            Vf(t, t.return);
            break;
          }
          case He: {
            var u = t.memoizedState !== null;
            if (u) {
              K0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Oe = a) : K0(e);
      }
    }
    function K0(e) {
      for (; Oe !== null; ) {
        var t = Oe;
        if (t === e) {
          Oe = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Oe = a;
          return;
        }
        Oe = t.return;
      }
    }
    function f_(e) {
      for (; Oe !== null; ) {
        var t = Oe, a = t.child;
        if (t.tag === He) {
          var i = t.memoizedState !== null;
          if (i) {
            X0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Oe = a) : X0(e);
      }
    }
    function X0(e) {
      for (; Oe !== null; ) {
        var t = Oe;
        Kt(t);
        try {
          e_(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          Oe = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Oe = a;
          return;
        }
        Oe = t.return;
      }
    }
    function d_(e, t, a, i) {
      Oe = t, p_(t, e, a, i);
    }
    function p_(e, t, a, i) {
      for (; Oe !== null; ) {
        var u = Oe, s = u.child;
        (u.subtreeFlags & Gi) !== Pe && s !== null ? (s.return = u, Oe = s) : v_(e, t, a, i);
      }
    }
    function v_(e, t, a, i) {
      for (; Oe !== null; ) {
        var u = Oe;
        if ((u.flags & Gr) !== Pe) {
          Kt(u);
          try {
            h_(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          Oe = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, Oe = s;
          return;
        }
        Oe = u.return;
      }
    }
    function h_(e, t, a, i) {
      switch (t.tag) {
        case Y:
        case We:
        case he: {
          if (t.mode & jt) {
            Jg();
            try {
              Ho(Fr | fr, t);
            } finally {
              Xg(t);
            }
          } else
            Ho(Fr | fr, t);
          break;
        }
      }
    }
    function m_(e) {
      Oe = e, y_();
    }
    function y_() {
      for (; Oe !== null; ) {
        var e = Oe, t = e.child;
        if ((Oe.flags & Da) !== Pe) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Oe = u, E_(u, e);
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
            Oe = e;
          }
        }
        (e.subtreeFlags & Gi) !== Pe && t !== null ? (t.return = e, Oe = t) : g_();
      }
    }
    function g_() {
      for (; Oe !== null; ) {
        var e = Oe;
        (e.flags & Gr) !== Pe && (Kt(e), S_(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Oe = t;
          return;
        }
        Oe = e.return;
      }
    }
    function S_(e) {
      switch (e.tag) {
        case Y:
        case We:
        case he: {
          e.mode & jt ? (Jg(), sl(Fr | fr, e, e.return), Xg(e)) : sl(Fr | fr, e, e.return);
          break;
        }
      }
    }
    function E_(e, t) {
      for (; Oe !== null; ) {
        var a = Oe;
        Kt(a), R_(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, Oe = i) : C_(e);
      }
    }
    function C_(e) {
      for (; Oe !== null; ) {
        var t = Oe, a = t.sibling, i = t.return;
        if (I0(t), t === e) {
          Oe = null;
          return;
        }
        if (a !== null) {
          a.return = i, Oe = a;
          return;
        }
        Oe = i;
      }
    }
    function R_(e, t) {
      switch (e.tag) {
        case Y:
        case We:
        case he: {
          e.mode & jt ? (Jg(), sl(Fr, e, t), Xg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function T_(e) {
      switch (e.tag) {
        case Y:
        case We:
        case he: {
          try {
            Ho(dr | fr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case W: {
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
    function w_(e) {
      switch (e.tag) {
        case Y:
        case We:
        case he: {
          try {
            Ho(Fr | fr, e);
          } catch (t) {
            dn(e, e.return, t);
          }
          break;
        }
      }
    }
    function x_(e) {
      switch (e.tag) {
        case Y:
        case We:
        case he: {
          try {
            sl(dr | fr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case W: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && OS(e, e.return, t);
          break;
        }
      }
    }
    function b_(e) {
      switch (e.tag) {
        case Y:
        case We:
        case he:
          try {
            sl(Fr | fr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var jp = Symbol.for;
      jp("selector.component"), jp("selector.has_pseudo_class"), jp("selector.role"), jp("selector.test_id"), jp("selector.text");
    }
    var __ = [];
    function k_() {
      __.forEach(function(e) {
        return e();
      });
    }
    var D_ = w.ReactCurrentActQueue;
    function O_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function J0() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && D_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var N_ = Math.ceil, AS = w.ReactCurrentDispatcher, zS = w.ReactCurrentOwner, Br = w.ReactCurrentBatchConfig, dl = w.ReactCurrentActQueue, hr = (
      /*             */
      0
    ), Z0 = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Bu = 0, Fp = 1, tc = 2, Mm = 3, Hp = 4, eR = 5, US = 6, Dt = hr, Ea = null, On = null, mr = q, Xl = q, jS = Oo(q), yr = Bu, Pp = null, Lm = q, Vp = q, Am = q, Bp = null, Va = null, FS = 0, tR = 500, nR = 1 / 0, M_ = 500, Iu = null;
    function Ip() {
      nR = Wn() + M_;
    }
    function rR() {
      return nR;
    }
    var zm = !1, HS = null, Bf = null, nc = !1, Vo = null, Yp = q, PS = [], VS = null, L_ = 50, $p = 0, BS = null, IS = !1, Um = !1, A_ = 50, If = 0, jm = null, Qp = nn, Fm = q, aR = !1;
    function Hm() {
      return Ea;
    }
    function Ca() {
      return (Dt & (Ir | ji)) !== hr ? Wn() : (Qp !== nn || (Qp = Wn()), Qp);
    }
    function Bo(e) {
      var t = e.mode;
      if ((t & gt) === Ve)
        return qe;
      if ((Dt & Ir) !== hr && mr !== q)
        return Ts(mr);
      var a = Dx() !== kx;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Fm === zt && (Fm = Ad()), Fm;
      }
      var u = Ua();
      if (u !== zt)
        return u;
      var s = pw();
      return s;
    }
    function z_(e) {
      var t = e.mode;
      return (t & gt) === Ve ? qe : Iv();
    }
    function gr(e, t, a, i) {
      i1(), aR && g("useInsertionEffect must not schedule updates."), IS && (Um = !0), So(e, a, i), (Dt & Ir) !== q && e === Ea ? o1(t) : (Jr && bs(e, t, a), s1(t), e === Ea && ((Dt & Ir) === hr && (Vp = ot(Vp, a)), yr === Hp && Io(e, mr)), Ba(e, i), a === qe && Dt === hr && (t.mode & gt) === Ve && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Ip(), aC()));
    }
    function U_(e, t, a) {
      var i = e.current;
      i.lanes = t, So(e, t, a), Ba(e, a);
    }
    function j_(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Dt & Ir) !== hr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = Kc(e, e === Ea ? mr : q);
      if (i === q) {
        a !== null && ER(a), e.callbackNode = null, e.callbackPriority = zt;
        return;
      }
      var u = zl(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== KS)) {
        a == null && s !== qe && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && ER(a);
      var f;
      if (u === qe)
        e.tag === No ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), fx(uR.bind(null, e))) : rC(uR.bind(null, e)), dl.current !== null ? dl.current.push(Mo) : hw(function() {
          (Dt & (Ir | ji)) === hr && Mo();
        }), f = null;
      else {
        var p;
        switch (Kv(i)) {
          case Mr:
            p = ss;
            break;
          case _i:
            p = Nl;
            break;
          case Aa:
            p = qi;
            break;
          case za:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = XS(p, iR.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function iR(e, t) {
      if (tb(), Qp = nn, Fm = q, (Dt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === Ea ? mr : q);
      if (u === q)
        return null;
      var s = !Zc(e, u) && !Bv(e, u) && !t, f = s ? W_(e, u) : Vm(e, u);
      if (f !== Bu) {
        if (f === tc) {
          var p = Jc(e);
          p !== q && (u = p, f = YS(e, p));
        }
        if (f === Fp) {
          var v = Pp;
          throw rc(e, q), Io(e, u), Ba(e, Wn()), v;
        }
        if (f === US)
          Io(e, u);
        else {
          var y = !Zc(e, u), S = e.current.alternate;
          if (y && !H_(S)) {
            if (f = Vm(e, u), f === tc) {
              var k = Jc(e);
              k !== q && (u = k, f = YS(e, k));
            }
            if (f === Fp) {
              var b = Pp;
              throw rc(e, q), Io(e, u), Ba(e, Wn()), b;
            }
          }
          e.finishedWork = S, e.finishedLanes = u, F_(e, f, u);
        }
      }
      return Ba(e, Wn()), e.callbackNode === a ? iR.bind(null, e) : null;
    }
    function YS(e, t) {
      var a = Bp;
      if (nf(e)) {
        var i = rc(e, t);
        i.flags |= Rr, ax(e.containerInfo);
      }
      var u = Vm(e, t);
      if (u !== tc) {
        var s = Va;
        Va = a, s !== null && lR(s);
      }
      return u;
    }
    function lR(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function F_(e, t, a) {
      switch (t) {
        case Bu:
        case Fp:
          throw new Error("Root did not complete. This is a bug in React.");
        case tc: {
          ac(e, Va, Iu);
          break;
        }
        case Mm: {
          if (Io(e, a), _u(a) && // do not delay if we're inside an act() scope
          !CR()) {
            var i = FS + tR - Wn();
            if (i > 10) {
              var u = Kc(e, q);
              if (u !== q)
                break;
              var s = e.suspendedLanes;
              if (!ku(s, a)) {
                Ca(), ef(e, s);
                break;
              }
              e.timeoutHandle = Vy(ac.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case Hp: {
          if (Io(e, a), Md(a))
            break;
          if (!CR()) {
            var f = ai(e, a), p = f, v = Wn() - p, y = a1(v) - v;
            if (y > 10) {
              e.timeoutHandle = Vy(ac.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case eR: {
          ac(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function H_(e) {
      for (var t = e; ; ) {
        if (t.flags & vo) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!J(f(), p))
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
      t = ws(t, Am), t = ws(t, Vp), Qv(e, t);
    }
    function uR(e) {
      if (nb(), (Dt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      $u();
      var t = Kc(e, q);
      if (!ea(t, qe))
        return Ba(e, Wn()), null;
      var a = Vm(e, t);
      if (e.tag !== No && a === tc) {
        var i = Jc(e);
        i !== q && (t = i, a = YS(e, i));
      }
      if (a === Fp) {
        var u = Pp;
        throw rc(e, q), Io(e, t), Ba(e, Wn()), u;
      }
      if (a === US)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ac(e, Va, Iu), Ba(e, Wn()), null;
    }
    function P_(e, t) {
      t !== q && (tf(e, ot(t, qe)), Ba(e, Wn()), (Dt & (Ir | ji)) === hr && (Ip(), Mo()));
    }
    function $S(e, t) {
      var a = Dt;
      Dt |= Z0;
      try {
        return e(t);
      } finally {
        Dt = a, Dt === hr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Ip(), aC());
      }
    }
    function V_(e, t, a, i, u) {
      var s = Ua(), f = Br.transition;
      try {
        return Br.transition = null, Fn(Mr), e(t, a, i, u);
      } finally {
        Fn(s), Br.transition = f, Dt === hr && Ip();
      }
    }
    function Yu(e) {
      Vo !== null && Vo.tag === No && (Dt & (Ir | ji)) === hr && $u();
      var t = Dt;
      Dt |= Z0;
      var a = Br.transition, i = Ua();
      try {
        return Br.transition = null, Fn(Mr), e ? e() : void 0;
      } finally {
        Fn(i), Br.transition = a, Dt = t, (Dt & (Ir | ji)) === hr && Mo();
      }
    }
    function oR() {
      return (Dt & (Ir | ji)) !== hr;
    }
    function Pm(e, t) {
      ia(jS, Xl, e), Xl = ot(Xl, t);
    }
    function QS(e) {
      Xl = jS.current, aa(jS, e);
    }
    function rc(e, t) {
      e.finishedWork = null, e.finishedLanes = q;
      var a = e.timeoutHandle;
      if (a !== By && (e.timeoutHandle = By, vw(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          j0(u, i), i = i.return;
        }
      Ea = e;
      var s = ic(e.current, null);
      return On = s, mr = Xl = t, yr = Bu, Pp = null, Lm = q, Vp = q, Am = q, Bp = null, Va = null, Ux(), al.discardPendingWarnings(), s;
    }
    function sR(e, t) {
      do {
        var a = On;
        try {
          if (Kh(), LC(), fn(), zS.current = null, a === null || a.return === null) {
            yr = Fp, Pp = t, On = null;
            return;
          }
          if (Ge && a.mode & jt && xm(a, !0), Ke)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              bi(a, i, mr);
            } else
              fs(a, t, mr);
          fb(e, a.return, a, t, mr), pR(a);
        } catch (u) {
          t = u, On === a && a !== null ? (a = a.return, On = a) : a = On;
          continue;
        }
        return;
      } while (!0);
    }
    function cR() {
      var e = AS.current;
      return AS.current = Em, e === null ? Em : e;
    }
    function fR(e) {
      AS.current = e;
    }
    function B_() {
      FS = Wn();
    }
    function Wp(e) {
      Lm = ot(e, Lm);
    }
    function I_() {
      yr === Bu && (yr = Mm);
    }
    function WS() {
      (yr === Bu || yr === Mm || yr === tc) && (yr = Hp), Ea !== null && (Rs(Lm) || Rs(Vp)) && Io(Ea, mr);
    }
    function Y_(e) {
      yr !== Hp && (yr = tc), Bp === null ? Bp = [e] : Bp.push(e);
    }
    function $_() {
      return yr === Bu;
    }
    function Vm(e, t) {
      var a = Dt;
      Dt |= Ir;
      var i = cR();
      if (Ea !== e || mr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Gp(e, mr), u.clear()), Wv(e, t);
        }
        Iu = Fd(), rc(e, t);
      }
      Eu(t);
      do
        try {
          Q_();
          break;
        } catch (s) {
          sR(e, s);
        }
      while (!0);
      if (Kh(), Dt = a, fR(i), On !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), Ea = null, mr = q, yr;
    }
    function Q_() {
      for (; On !== null; )
        dR(On);
    }
    function W_(e, t) {
      var a = Dt;
      Dt |= Ir;
      var i = cR();
      if (Ea !== e || mr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Gp(e, mr), u.clear()), Wv(e, t);
        }
        Iu = Fd(), Ip(), rc(e, t);
      }
      Eu(t);
      do
        try {
          G_();
          break;
        } catch (s) {
          sR(e, s);
        }
      while (!0);
      return Kh(), fR(i), Dt = a, On !== null ? (Fv(), Bu) : (Mc(), Ea = null, mr = q, yr);
    }
    function G_() {
      for (; On !== null && !yd(); )
        dR(On);
    }
    function dR(e) {
      var t = e.alternate;
      Kt(e);
      var a;
      (e.mode & jt) !== Ve ? (Kg(e), a = GS(t, e, Xl), xm(e, !0)) : a = GS(t, e, Xl), fn(), e.memoizedProps = e.pendingProps, a === null ? pR(e) : On = a, zS.current = null;
    }
    function pR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & os) === Pe) {
          Kt(t);
          var u = void 0;
          if ((t.mode & jt) === Ve ? u = U0(a, t, Xl) : (Kg(t), u = U0(a, t, Xl), xm(t, !1)), fn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = Ib(a, t);
          if (s !== null) {
            s.flags &= Mv, On = s;
            return;
          }
          if ((t.mode & jt) !== Ve) {
            xm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= os, i.subtreeFlags = Pe, i.deletions = null;
          else {
            yr = US, On = null;
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
      yr === Bu && (yr = eR);
    }
    function ac(e, t, a) {
      var i = Ua(), u = Br.transition;
      try {
        Br.transition = null, Fn(Mr), q_(e, t, a, i);
      } finally {
        Br.transition = u, Fn(i);
      }
      return null;
    }
    function q_(e, t, a, i) {
      do
        $u();
      while (Vo !== null);
      if (l1(), (Dt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Td(s), u === null)
        return wd(), null;
      if (s === q && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = q, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = zt;
      var f = ot(u.lanes, u.childLanes);
      Ud(e, f), e === Ea && (Ea = null, On = null, mr = q), ((u.subtreeFlags & Gi) !== Pe || (u.flags & Gi) !== Pe) && (nc || (nc = !0, VS = a, XS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (kl | Dl | Ol | Gi)) !== Pe, v = (u.flags & (kl | Dl | Ol | Gi)) !== Pe;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var S = Ua();
        Fn(Mr);
        var k = Dt;
        Dt |= ji, zS.current = null, Gb(e, u), a0(), o_(e, u, s), uw(e.containerInfo), e.current = u, ds(s), s_(u, e, s), ps(), gd(), Dt = k, Fn(S), Br.transition = y;
      } else
        e.current = u, a0();
      var b = nc;
      if (nc ? (nc = !1, Vo = e, Yp = s) : (If = 0, jm = null), f = e.pendingLanes, f === q && (Bf = null), b || yR(e.current, !1), Ed(u.stateNode, i), Jr && e.memoizedUpdaters.clear(), k_(), Ba(e, Wn()), t !== null)
        for (var U = e.onRecoverableError, H = 0; H < t.length; H++) {
          var B = t[H], Ee = B.stack, Ie = B.digest;
          U(B.value, {
            componentStack: Ee,
            digest: Ie
          });
        }
      if (zm) {
        zm = !1;
        var je = HS;
        throw HS = null, je;
      }
      return ea(Yp, qe) && e.tag !== No && $u(), f = e.pendingLanes, ea(f, qe) ? (eb(), e === BS ? $p++ : ($p = 0, BS = e)) : $p = 0, Mo(), wd(), null;
    }
    function $u() {
      if (Vo !== null) {
        var e = Kv(Yp), t = ks(Aa, e), a = Br.transition, i = Ua();
        try {
          return Br.transition = null, Fn(t), X_();
        } finally {
          Fn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function K_(e) {
      PS.push(e), nc || (nc = !0, XS(qi, function() {
        return $u(), null;
      }));
    }
    function X_() {
      if (Vo === null)
        return !1;
      var e = VS;
      VS = null;
      var t = Vo, a = Yp;
      if (Vo = null, Yp = q, (Dt & (Ir | ji)) !== hr)
        throw new Error("Cannot flush passive effects while already rendering.");
      IS = !0, Um = !1, Su(a);
      var i = Dt;
      Dt |= ji, m_(t.current), d_(t, t.current, a, e);
      {
        var u = PS;
        PS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          Jb(t, f);
        }
      }
      _d(), yR(t.current, !0), Dt = i, Mo(), Um ? t === jm ? If++ : (If = 0, jm = t) : If = 0, IS = !1, Um = !1, Cd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function vR(e) {
      return Bf !== null && Bf.has(e);
    }
    function J_(e) {
      Bf === null ? Bf = /* @__PURE__ */ new Set([e]) : Bf.add(e);
    }
    function Z_(e) {
      zm || (zm = !0, HS = e);
    }
    var e1 = Z_;
    function hR(e, t, a) {
      var i = Zs(a, t), u = d0(e, i, qe), s = Ao(e, u, qe), f = Ca();
      s !== null && (So(s, qe, f), Ba(s, f));
    }
    function dn(e, t, a) {
      if ($b(a), qp(!1), e.tag === V) {
        hR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === V) {
          hR(i, e, a);
          return;
        } else if (i.tag === W) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !vR(s)) {
            var f = Zs(a, e), p = vS(i, f, qe), v = Ao(i, p, qe), y = Ca();
            v !== null && (So(v, qe, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function t1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      ef(e, a), c1(e), Ea === e && ku(mr, a) && (yr === Hp || yr === Mm && _u(mr) && Wn() - FS < tR ? rc(e, q) : Am = ot(Am, a)), Ba(e, u);
    }
    function mR(e, t) {
      t === zt && (t = z_(e));
      var a = Ca(), i = Ha(e, t);
      i !== null && (So(i, t, a), Ba(i, a));
    }
    function n1(e) {
      var t = e.memoizedState, a = zt;
      t !== null && (a = t.retryLane), mR(e, a);
    }
    function r1(e, t) {
      var a = zt, i;
      switch (e.tag) {
        case Z:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case Wt:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), mR(e, a);
    }
    function a1(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : N_(e / 1960) * 1960;
    }
    function i1() {
      if ($p > L_)
        throw $p = 0, BS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      If > A_ && (If = 0, jm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function l1() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function yR(e, t) {
      Kt(e), Bm(e, _l, x_), t && Bm(e, Ti, b_), Bm(e, _l, T_), t && Bm(e, Ti, w_), fn();
    }
    function Bm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Pe ? i = i.child : ((i.flags & t) !== Pe && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Im = null;
    function gR(e) {
      {
        if ((Dt & Ir) !== hr || !(e.mode & gt))
          return;
        var t = e.tag;
        if (t !== Re && t !== V && t !== W && t !== Y && t !== We && t !== Ae && t !== he)
          return;
        var a = et(e) || "ReactComponent";
        if (Im !== null) {
          if (Im.has(a))
            return;
          Im.add(a);
        } else
          Im = /* @__PURE__ */ new Set([a]);
        var i = lr;
        try {
          Kt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Kt(e) : fn();
        }
      }
    }
    var GS;
    {
      var u1 = null;
      GS = function(e, t, a) {
        var i = bR(u1, t);
        try {
          return N0(e, t, a);
        } catch (s) {
          if (Sx() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Kh(), LC(), j0(e, t), bR(t, i), t.mode & jt && Kg(t), bl(null, N0, null, e, t, a), Qi()) {
            var u = us();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var SR = !1, qS;
    qS = /* @__PURE__ */ new Set();
    function o1(e) {
      if (mi && !Xx())
        switch (e.tag) {
          case Y:
          case We:
          case he: {
            var t = On && et(On) || "Unknown", a = t;
            if (!qS.has(a)) {
              qS.add(a);
              var i = et(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case W: {
            SR || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), SR = !0);
            break;
          }
        }
    }
    function Gp(e, t) {
      if (Jr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          bs(e, i, t);
        });
      }
    }
    var KS = {};
    function XS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), KS) : md(e, t);
      }
    }
    function ER(e) {
      if (e !== KS)
        return Av(e);
    }
    function CR() {
      return dl.current !== null;
    }
    function s1(e) {
      {
        if (e.mode & gt) {
          if (!J0())
            return;
        } else if (!O_() || Dt !== hr || e.tag !== Y && e.tag !== We && e.tag !== he)
          return;
        if (dl.current === null) {
          var t = lr;
          try {
            Kt(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, et(e));
          } finally {
            t ? Kt(e) : fn();
          }
        }
      }
    }
    function c1(e) {
      e.tag !== No && J0() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function qp(e) {
      aR = e;
    }
    var Fi = null, Yf = null, f1 = function(e) {
      Fi = e;
    };
    function $f(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function JS(e) {
      return $f(e);
    }
    function ZS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = $f(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: G,
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
    function RR(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case W: {
            typeof i == "function" && (u = !0);
            break;
          }
          case Y: {
            (typeof i == "function" || s === tt) && (u = !0);
            break;
          }
          case We: {
            (s === G || s === tt) && (u = !0);
            break;
          }
          case Ae:
          case he: {
            (s === lt || s === tt) && (u = !0);
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
    function TR(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Yf === null && (Yf = /* @__PURE__ */ new WeakSet()), Yf.add(e);
      }
    }
    var d1 = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          eE(e.current, i, a);
        });
      }
    }, p1 = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          Kp(t, e, null, null);
        });
      }
    };
    function eE(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case Y:
          case he:
          case W:
            v = p;
            break;
          case We:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, S = !1;
        if (v !== null) {
          var k = Fi(v);
          k !== void 0 && (a.has(k) ? S = !0 : t.has(k) && (f === W ? S = !0 : y = !0));
        }
        if (Yf !== null && (Yf.has(e) || i !== null && Yf.has(i)) && (S = !0), S && (e._debugNeedsRemount = !0), S || y) {
          var b = Ha(e, qe);
          b !== null && gr(b, e, qe, nn);
        }
        u !== null && !S && eE(u, t, a), s !== null && eE(s, t, a);
      }
    }
    var v1 = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return tE(e.current, i, a), a;
      }
    };
    function tE(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case Y:
          case he:
          case W:
            p = f;
            break;
          case We:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? h1(e, a) : i !== null && tE(i, t, a), u !== null && tE(u, t, a);
      }
    }
    function h1(e, t) {
      {
        var a = m1(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case re:
              t.add(i.stateNode);
              return;
            case de:
              t.add(i.stateNode.containerInfo);
              return;
            case V:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function m1(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === re)
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
    var nE;
    {
      nE = !1;
      try {
        var wR = Object.preventExtensions({});
      } catch {
        nE = !0;
      }
    }
    function y1(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Pe, this.subtreeFlags = Pe, this.deletions = null, this.lanes = q, this.childLanes = q, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !nE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new y1(e, t, a, i);
    };
    function rE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function g1(e) {
      return typeof e == "function" && !rE(e) && e.defaultProps === void 0;
    }
    function S1(e) {
      if (typeof e == "function")
        return rE(e) ? W : Y;
      if (e != null) {
        var t = e.$$typeof;
        if (t === G)
          return We;
        if (t === lt)
          return Ae;
      }
      return Re;
    }
    function ic(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Pe, a.subtreeFlags = Pe, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Re:
        case Y:
        case he:
          a.type = $f(e.type);
          break;
        case W:
          a.type = JS(e.type);
          break;
        case We:
          a.type = ZS(e.type);
          break;
      }
      return a;
    }
    function E1(e, t) {
      e.flags &= zn | yn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = q, e.lanes = t, e.child = null, e.subtreeFlags = Pe, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Pe, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function C1(e, t, a) {
      var i;
      return e === Ph ? (i = gt, t === !0 && (i |= Zt, i |= Ft)) : i = Ve, Jr && (i |= jt), oi(V, null, null, i);
    }
    function aE(e, t, a, i, u, s) {
      var f = Re, p = e;
      if (typeof e == "function")
        rE(e) ? (f = W, p = JS(p)) : p = $f(p);
      else if (typeof e == "string")
        f = re;
      else
        e: switch (e) {
          case di:
            return Yo(a.children, u, s, t);
          case Wa:
            f = Ze, u |= Zt, (u & gt) !== Ve && (u |= Ft);
            break;
          case pi:
            return R1(a, u, s, t);
          case ge:
            return T1(a, u, s, t);
          case _e:
            return w1(a, u, s, t);
          case wn:
            return xR(a, u, s, t);
          case ln:
          case Et:
          case cn:
          case ir:
          case yt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = at;
                  break e;
                case R:
                  f = Qt;
                  break e;
                case G:
                  f = We, p = ZS(p);
                  break e;
                case lt:
                  f = Ae;
                  break e;
                case tt:
                  f = it, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? et(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var S = oi(f, a, t, u);
      return S.elementType = e, S.type = p, S.lanes = s, S._debugOwner = i, S;
    }
    function iE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = aE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = oi(Ne, e, i, t);
      return u.lanes = a, u;
    }
    function R1(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(fe, e, i, t | jt);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function T1(e, t, a, i) {
      var u = oi(Z, e, i, t);
      return u.elementType = ge, u.lanes = a, u;
    }
    function w1(e, t, a, i) {
      var u = oi(Wt, e, i, t);
      return u.elementType = _e, u.lanes = a, u;
    }
    function xR(e, t, a, i) {
      var u = oi(He, e, i, t);
      u.elementType = wn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function lE(e, t, a) {
      var i = oi(ce, e, null, t);
      return i.lanes = a, i;
    }
    function x1() {
      var e = oi(re, null, null, Ve);
      return e.elementType = "DELETED", e;
    }
    function b1(e) {
      var t = oi(St, null, null, Ve);
      return t.stateNode = e, t;
    }
    function uE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(de, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function bR(e, t) {
      return e === null && (e = oi(Re, null, null, Ve)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function _1(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = By, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = zt, this.eventTimes = xs(q), this.expirationTimes = xs(nn), this.pendingLanes = q, this.suspendedLanes = q, this.pingedLanes = q, this.expiredLanes = q, this.mutableReadLanes = q, this.finishedLanes = q, this.entangledLanes = q, this.entanglements = xs(q), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Ph:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case No:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function _R(e, t, a, i, u, s, f, p, v, y) {
      var S = new _1(e, t, a, p, v), k = C1(t, s);
      S.current = k, k.stateNode = S;
      {
        var b = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        k.memoizedState = b;
      }
      return Eg(k), S;
    }
    var oE = "18.3.1";
    function k1(e, t, a) {
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
    var sE, cE;
    sE = !1, cE = {};
    function kR(e) {
      if (!e)
        return ui;
      var t = po(e), a = cx(t);
      if (t.tag === W) {
        var i = t.type;
        if (Yl(i))
          return tC(t, i, a);
      }
      return a;
    }
    function D1(e, t) {
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
        if (u.mode & Zt) {
          var s = et(a) || "Component";
          if (!cE[s]) {
            cE[s] = !0;
            var f = lr;
            try {
              Kt(u), a.mode & Zt ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Kt(f) : fn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function DR(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return _R(e, t, v, y, a, i, u, s, f);
    }
    function OR(e, t, a, i, u, s, f, p, v, y) {
      var S = !0, k = _R(a, i, S, e, u, s, f, p, v);
      k.context = kR(null);
      var b = k.current, U = Ca(), H = Bo(b), B = Pu(U, H);
      return B.callback = t ?? null, Ao(b, B, H), U_(k, H, U), k;
    }
    function Kp(e, t, a, i) {
      Sd(t, e);
      var u = t.current, s = Ca(), f = Bo(u);
      Sn(f);
      var p = kR(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && lr !== null && !sE && (sE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, et(lr) || "Unknown"));
      var v = Pu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Ao(u, v, f);
      return y !== null && (gr(y, u, f, s), tm(y, u, f)), f;
    }
    function Ym(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case re:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function O1(e) {
      switch (e.tag) {
        case V: {
          var t = e.stateNode;
          if (nf(t)) {
            var a = Pv(t);
            P_(t, a);
          }
          break;
        }
        case Z: {
          Yu(function() {
            var u = Ha(e, qe);
            if (u !== null) {
              var s = Ca();
              gr(u, e, qe, s);
            }
          });
          var i = qe;
          fE(e, i);
          break;
        }
      }
    }
    function NR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = $v(a.retryLane, t));
    }
    function fE(e, t) {
      NR(e, t);
      var a = e.alternate;
      a && NR(a, t);
    }
    function N1(e) {
      if (e.tag === Z) {
        var t = Ss, a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        fE(e, t);
      }
    }
    function M1(e) {
      if (e.tag === Z) {
        var t = Bo(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        fE(e, t);
      }
    }
    function MR(e) {
      var t = pn(e);
      return t === null ? null : t.stateNode;
    }
    var LR = function(e) {
      return null;
    };
    function L1(e) {
      return LR(e);
    }
    var AR = function(e) {
      return !1;
    };
    function A1(e) {
      return AR(e);
    }
    var zR = null, UR = null, jR = null, FR = null, HR = null, PR = null, VR = null, BR = null, IR = null;
    {
      var YR = function(e, t, a) {
        var i = t[a], u = vt(e) ? e.slice() : ct({}, e);
        return a + 1 === t.length ? (vt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = YR(e[i], t, a + 1), u);
      }, $R = function(e, t) {
        return YR(e, t, 0);
      }, QR = function(e, t, a, i) {
        var u = t[i], s = vt(e) ? e.slice() : ct({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], vt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = QR(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, WR = function(e, t, a) {
        if (t.length !== a.length) {
          ee("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              ee("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return QR(e, t, a, 0);
      }, GR = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = vt(e) ? e.slice() : ct({}, e);
        return s[u] = GR(e[u], t, a + 1, i), s;
      }, qR = function(e, t, a) {
        return GR(e, t, 0, a);
      }, dE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      zR = function(e, t, a, i) {
        var u = dE(e, t);
        if (u !== null) {
          var s = qR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = ct({}, e.memoizedProps);
          var f = Ha(e, qe);
          f !== null && gr(f, e, qe, nn);
        }
      }, UR = function(e, t, a) {
        var i = dE(e, t);
        if (i !== null) {
          var u = $R(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = ct({}, e.memoizedProps);
          var s = Ha(e, qe);
          s !== null && gr(s, e, qe, nn);
        }
      }, jR = function(e, t, a, i) {
        var u = dE(e, t);
        if (u !== null) {
          var s = WR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = ct({}, e.memoizedProps);
          var f = Ha(e, qe);
          f !== null && gr(f, e, qe, nn);
        }
      }, FR = function(e, t, a) {
        e.pendingProps = qR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, qe);
        i !== null && gr(i, e, qe, nn);
      }, HR = function(e, t) {
        e.pendingProps = $R(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, qe);
        a !== null && gr(a, e, qe, nn);
      }, PR = function(e, t, a) {
        e.pendingProps = WR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, qe);
        i !== null && gr(i, e, qe, nn);
      }, VR = function(e) {
        var t = Ha(e, qe);
        t !== null && gr(t, e, qe, nn);
      }, BR = function(e) {
        LR = e;
      }, IR = function(e) {
        AR = e;
      };
    }
    function z1(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function U1(e) {
      return null;
    }
    function j1() {
      return lr;
    }
    function F1(e) {
      var t = e.findFiberByHostInstance, a = w.ReactCurrentDispatcher;
      return mo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: zR,
        overrideHookStateDeletePath: UR,
        overrideHookStateRenamePath: jR,
        overrideProps: FR,
        overridePropsDeletePath: HR,
        overridePropsRenamePath: PR,
        setErrorHandler: BR,
        setSuspenseHandler: IR,
        scheduleUpdate: VR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: z1,
        findFiberByHostInstance: t || U1,
        // React Refresh
        findHostInstancesForRefresh: v1,
        scheduleRefresh: d1,
        scheduleRoot: p1,
        setRefreshHandler: f1,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: j1,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: oE
      });
    }
    var KR = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function pE(e) {
      this._internalRoot = e;
    }
    $m.prototype.render = pE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Qm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Ln) {
          var i = MR(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Kp(e, t, null, null);
    }, $m.prototype.unmount = pE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        oR() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          Kp(null, e, null, null);
        }), KE(t);
      }
    };
    function H1(e, t) {
      if (!Qm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      XR(e);
      var a = !1, i = !1, u = "", s = KR;
      t != null && (t.hydrate ? ee("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === kr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = DR(e, Ph, null, a, i, u, s);
      Lh(f.current, e);
      var p = e.nodeType === Ln ? e.parentNode : e;
      return np(p), new pE(f);
    }
    function $m(e) {
      this._internalRoot = e;
    }
    function P1(e) {
      e && th(e);
    }
    $m.prototype.unstable_scheduleHydration = P1;
    function V1(e, t, a) {
      if (!Qm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      XR(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = KR;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = OR(t, null, e, Ph, i, s, f, p, v);
      if (Lh(y.current, e), np(e), u)
        for (var S = 0; S < u.length; S++) {
          var k = u[S];
          $x(y, k);
        }
      return new $m(y);
    }
    function Qm(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === ad));
    }
    function Xp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === ad || e.nodeType === Ln && e.nodeValue === " react-mount-point-unstable "));
    }
    function XR(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), pp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var B1 = w.ReactCurrentOwner, JR;
    JR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Ln) {
        var t = MR(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = vE(e), u = !!(i && Do(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function vE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function ZR() {
    }
    function I1(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var b = Ym(f);
            s.call(b);
          };
        }
        var f = OR(
          t,
          i,
          e,
          No,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          ZR
        );
        e._reactRootContainer = f, Lh(f.current, e);
        var p = e.nodeType === Ln ? e.parentNode : e;
        return np(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var b = Ym(S);
            y.call(b);
          };
        }
        var S = DR(
          e,
          No,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          ZR
        );
        e._reactRootContainer = S, Lh(S.current, e);
        var k = e.nodeType === Ln ? e.parentNode : e;
        return np(k), Yu(function() {
          Kp(t, S, a, i);
        }), S;
      }
    }
    function Y1(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Wm(e, t, a, i, u) {
      JR(a), Y1(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = I1(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Ym(f);
            p.call(v);
          };
        }
        Kp(t, f, e, u);
      }
      return Ym(f);
    }
    var eT = !1;
    function $1(e) {
      {
        eT || (eT = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = B1.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Mt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : D1(e, "findDOMNode");
    }
    function Q1(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = pp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Wm(null, e, t, !0, a);
    }
    function W1(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = pp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Wm(null, e, t, !1, a);
    }
    function G1(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !fy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Wm(e, t, a, !1, i);
    }
    var tT = !1;
    function q1(e) {
      if (tT || (tT = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Xp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = pp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = vE(e), i = a && !Do(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Wm(null, null, e, !1, function() {
            e._reactRootContainer = null, KE(e);
          });
        }), !0;
      } else {
        {
          var u = vE(e), s = !!(u && Do(u)), f = e.nodeType === Wr && Xp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    wr(O1), Eo(N1), Xv(M1), Os(Ua), Hd(Gv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Sc(XT), cy($S, V_, Yu);
    function K1(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Qm(t))
        throw new Error("Target container is not a DOM element.");
      return k1(e, t, null, a);
    }
    function X1(e, t, a, i) {
      return G1(e, t, a, i);
    }
    var hE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Do, Rf, Ah, oo, Ec, $S]
    };
    function J1(e, t) {
      return hE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), H1(e, t);
    }
    function Z1(e, t, a) {
      return hE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), V1(e, t, a);
    }
    function ek(e) {
      return oR() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var tk = F1({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: oE,
      rendererPackageName: "react-dom"
    });
    if (!tk && Nn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var nT = window.location.protocol;
      /^(https?|file):$/.test(nT) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (nT === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = hE, Ya.createPortal = K1, Ya.createRoot = J1, Ya.findDOMNode = $1, Ya.flushSync = ek, Ya.hydrate = Q1, Ya.hydrateRoot = Z1, Ya.render = W1, Ya.unmountComponentAtNode = q1, Ya.unstable_batchedUpdates = $S, Ya.unstable_renderSubtreeIntoContainer = X1, Ya.version = oE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ya;
}
function hT() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(hT);
    } catch (N) {
      console.error(N);
    }
  }
}
process.env.NODE_ENV === "production" ? (hT(), CE.exports = ck()) : CE.exports = fk();
var lc = CE.exports, RE, qm = lc;
if (process.env.NODE_ENV === "production")
  RE = qm.createRoot, qm.hydrateRoot;
else {
  var dT = qm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  RE = function(N, x) {
    dT.usingClientEntryPoint = !0;
    try {
      return qm.createRoot(N, x);
    } finally {
      dT.usingClientEntryPoint = !1;
    }
  };
}
const Km = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, dk = {
  activeEdition: Km,
  setEdition: () => {
  },
  supportedEditions: [Km],
  characterCreationData: void 0,
  reloadEditionData: async () => {
  },
  isLoading: !1,
  error: void 0
}, mT = Le.createContext(dk);
function pk({ children: N }) {
  const [x, w] = Le.useState(Km), [ue, ae] = Le.useState({}), ee = Le.useMemo(
    () => [
      Km,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), g = Le.useCallback(
    async (Y) => {
      const W = Y ?? x.key;
      if (ae((Re) => {
        var V;
        return {
          ...Re,
          [W]: {
            data: (V = Re[W]) == null ? void 0 : V.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        ae((Re) => {
          var V;
          return {
            ...Re,
            [W]: {
              data: (V = Re[W]) == null ? void 0 : V.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Re = await fetch(`/api/editions/${W}/character-creation`);
        if (!Re.ok)
          throw new Error(`Failed to load edition data (${Re.status})`);
        const V = await Re.json(), de = (V == null ? void 0 : V.character_creation) ?? V;
        ae((re) => ({
          ...re,
          [W]: {
            data: de,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Re) {
        const V = Re instanceof Error ? Re.message : "Unknown error loading edition data";
        ae((de) => {
          var re;
          return {
            ...de,
            [W]: {
              data: (re = de[W]) == null ? void 0 : re.data,
              loading: !1,
              error: V
            }
          };
        });
      }
    },
    [x.key]
  ), ye = Le.useMemo(() => {
    const Y = ue[x.key];
    return {
      activeEdition: x,
      supportedEditions: ee,
      setEdition: (W) => {
        const Re = ee.find((V) => V.key === W);
        Re ? w(Re) : console.warn(`Edition '${W}' is not registered; keeping current edition.`);
      },
      characterCreationData: Y == null ? void 0 : Y.data,
      reloadEditionData: g,
      isLoading: (Y == null ? void 0 : Y.loading) ?? !1,
      error: Y == null ? void 0 : Y.error
    };
  }, [x, ue, g, ee]);
  return Le.useEffect(() => {
    const Y = ue[x.key];
    !(Y != null && Y.data) && !(Y != null && Y.loading) && g(x.key);
  }, [x.key, ue, g]), Le.useEffect(() => {
    var W, Re;
    const Y = ue[x.key];
    Y != null && Y.data && typeof window < "u" && ((Re = (W = window.ShadowmasterLegacyApp) == null ? void 0 : W.setEditionData) == null || Re.call(W, x.key, Y.data));
  }, [x.key, ue]), /* @__PURE__ */ O.jsx(mT.Provider, { value: ye, children: N });
}
function vk() {
  const N = Le.useContext(mT);
  if (!N)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return N;
}
function gE(N, x) {
  return !!(N != null && N.roles.some((w) => w.toLowerCase() === x.toLowerCase()));
}
async function tv(N, x = {}) {
  const w = new Headers(x.headers || {});
  x.body && !w.has("Content-Type") && w.set("Content-Type", "application/json");
  const ue = await fetch(N, {
    ...x,
    headers: w,
    credentials: "include"
  });
  if (ue.status === 204)
    return {};
  const ae = await ue.text(), ee = () => {
    try {
      return ae ? JSON.parse(ae) : {};
    } catch {
      return {};
    }
  };
  if (!ue.ok) {
    const g = ee(), ye = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : ue.statusText;
    throw new Error(ye);
  }
  return ee();
}
function hk() {
  const [N, x] = Le.useState("login"), [w, ue] = Le.useState(null), [ae, ee] = Le.useState(!1), [g, ye] = Le.useState(null), [Y, W] = Le.useState(null), [Re, V] = Le.useState(""), [de, re] = Le.useState(""), [ce, Ne] = Le.useState(""), [Ze, Qt] = Le.useState(""), [at, We] = Le.useState(""), [fe, Z] = Le.useState(""), [Ae, he] = Le.useState(""), [it, Rt] = Le.useState(""), [St, Wt] = Le.useState(""), wt = Le.useRef(!1);
  Le.useEffect(() => {
    wt.current || (wt.current = !0, He());
  }, []), Le.useEffect(() => {
    window.ShadowmasterAuth = {
      user: w,
      isAdministrator: gE(w, "administrator"),
      isGamemaster: gE(w, "gamemaster"),
      isPlayer: gE(w, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [w]);
  async function He() {
    try {
      ee(!0), ye(null);
      const se = await tv("/api/auth/me");
      ue(se.user), x("login");
    } catch {
      ue(null);
    } finally {
      ee(!1);
    }
  }
  async function At(se) {
    se.preventDefault(), ee(!0), ye(null), W(null);
    try {
      const ie = await tv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: Re,
          password: de
        })
      });
      ue(ie.user), x("login"), re(""), W("Welcome back!");
    } catch (ie) {
      ye(ie instanceof Error ? ie.message : "Login failed");
    } finally {
      ee(!1);
    }
  }
  async function bt(se) {
    if (se.preventDefault(), at !== fe) {
      ye("Passwords do not match");
      return;
    }
    ee(!0), ye(null), W(null);
    try {
      const ie = await tv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: ce,
          username: Ze,
          password: at
        })
      });
      ue(ie.user), x("login"), W("Account created successfully."), We(""), Z("");
    } catch (ie) {
      ye(ie instanceof Error ? ie.message : "Registration failed");
    } finally {
      ee(!1);
    }
  }
  async function Nt() {
    ee(!0), ye(null), W(null);
    try {
      await tv("/api/auth/logout", { method: "POST" }), ue(null), x("login");
    } catch (se) {
      ye(se instanceof Error ? se.message : "Logout failed");
    } finally {
      ee(!1);
    }
  }
  async function Me(se) {
    if (se.preventDefault(), it !== St) {
      ye("New passwords do not match");
      return;
    }
    ee(!0), ye(null), W(null);
    try {
      await tv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: Ae,
          new_password: it
        })
      }), W("Password updated successfully."), he(""), Rt(""), Wt(""), x("login");
    } catch (ie) {
      ye(ie instanceof Error ? ie.message : "Password update failed");
    } finally {
      ee(!1);
    }
  }
  const oe = Le.useMemo(() => w ? w.roles.join(", ") : "", [w]);
  return /* @__PURE__ */ O.jsxs("section", { className: "auth-panel", children: [
    /* @__PURE__ */ O.jsxs("header", { className: "auth-panel__header", children: [
      /* @__PURE__ */ O.jsx("h2", { children: w ? `Welcome, ${w.username}` : "Account Access" }),
      w && /* @__PURE__ */ O.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ O.jsx("span", { className: "auth-tag", children: oe || "Player" }) })
    ] }),
    g && /* @__PURE__ */ O.jsx("div", { className: "auth-alert auth-alert--error", children: g }),
    Y && /* @__PURE__ */ O.jsx("div", { className: "auth-alert auth-alert--success", children: Y }),
    w ? /* @__PURE__ */ O.jsxs("div", { className: "auth-panel__content", children: [
      /* @__PURE__ */ O.jsxs("p", { className: "auth-panel__status", children: [
        "You are signed in as ",
        /* @__PURE__ */ O.jsx("strong", { children: w.email }),
        "."
      ] }),
      /* @__PURE__ */ O.jsxs("div", { className: "auth-panel__actions", children: [
        /* @__PURE__ */ O.jsx("button", { className: "btn btn-secondary", onClick: () => x(N === "password" ? "login" : "password"), children: N === "password" ? "Hide Password Form" : "Change Password" }),
        /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", onClick: Nt, disabled: ae, children: "Logout" })
      ] }),
      N === "password" && /* @__PURE__ */ O.jsxs("form", { className: "auth-form", onSubmit: Me, children: [
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "current-password",
              type: "password",
              value: Ae,
              onChange: (se) => he(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "new-password", children: "New Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "new-password",
              type: "password",
              value: it,
              onChange: (se) => Rt(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "confirm-password",
              type: "password",
              value: St,
              onChange: (se) => Wt(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ae, children: "Update Password" })
      ] })
    ] }) : /* @__PURE__ */ O.jsxs("div", { className: "auth-panel__content", children: [
      N === "login" && /* @__PURE__ */ O.jsxs("form", { className: "auth-form", onSubmit: At, children: [
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "login-email", children: "Email" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "login-email",
              type: "email",
              value: Re,
              onChange: (se) => V(se.target.value),
              required: !0,
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "login-password", children: "Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "login-password",
              type: "password",
              value: de,
              onChange: (se) => re(se.target.value),
              required: !0,
              autoComplete: "current-password"
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "auth-form__footer", children: [
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ae, children: "Sign In" }),
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-link", type: "button", onClick: () => x("register"), children: "Need an account?" })
        ] })
      ] }),
      N === "register" && /* @__PURE__ */ O.jsxs("form", { className: "auth-form", onSubmit: bt, children: [
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-email", children: "Email" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-email",
              type: "email",
              value: ce,
              onChange: (se) => Ne(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-username", children: "Username" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-username",
              value: Ze,
              onChange: (se) => Qt(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-password", children: "Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-password",
              type: "password",
              value: at,
              onChange: (se) => We(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-confirm",
              type: "password",
              value: fe,
              onChange: (se) => Z(se.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "auth-form__footer", children: [
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ae, children: "Create Account" }),
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-link", type: "button", onClick: () => x("login"), children: "Sign in instead" })
        ] })
      ] })
    ] })
  ] });
}
function mk() {
  var x, w;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (w = (x = window.ShadowmasterLegacyApp) == null ? void 0 : x.showWizardStep) == null || w.call(x, 1);
  const N = document.getElementById("character-modal");
  N && (N.style.display = "block");
}
function yk() {
  const [N, x] = Le.useState(null);
  return Le.useEffect(() => {
    x(document.getElementById("characters-actions"));
  }, []), N ? lc.createPortal(
    /* @__PURE__ */ O.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ O.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ O.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ O.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ O.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ O.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: mk,
          children: "Create Character"
        }
      ) })
    ] }),
    N
  ) : null;
}
const Xm = [
  {
    key: "characters",
    label: "Characters",
    description: "Review your roster, build new runners, and edit existing sheets.",
    targetId: "characters-view"
  },
  {
    key: "campaigns",
    label: "Campaigns",
    description: "Manage campaign notes, participant lists, and session planning.",
    targetId: "campaigns-view"
  },
  {
    key: "sessions",
    label: "Sessions",
    description: "Track upcoming runs, agendas, and after-action reports.",
    targetId: "sessions-view"
  }
];
function gk() {
  const N = window.location.hash.replace("#", "").toLowerCase(), x = Xm.find((w) => w.key === N);
  return (x == null ? void 0 : x.key) ?? "characters";
}
function Sk(N) {
  Le.useEffect(() => {
    Xm.forEach(({ key: x, targetId: w }) => {
      const ue = document.getElementById(w);
      ue && (x === N ? (ue.removeAttribute("hidden"), ue.classList.add("main-tab-panel--active"), ue.style.display = "", ue.setAttribute("data-active-tab", x)) : (ue.setAttribute("hidden", "true"), ue.classList.remove("main-tab-panel--active"), ue.style.display = "none", ue.removeAttribute("data-active-tab")));
    });
  }, [N]);
}
function Ek() {
  const [N, x] = Le.useState(null), [w, ue] = Le.useState(() => gk());
  Le.useEffect(() => {
    x(document.getElementById("main-navigation-root"));
  }, []), Sk(w), Le.useEffect(() => {
    window.history.replaceState(null, "", `#${w}`);
  }, [w]);
  const ae = Le.useMemo(
    () => {
      var ee;
      return ((ee = Xm.find((g) => g.key === w)) == null ? void 0 : ee.description) ?? "";
    },
    [w]
  );
  return N ? lc.createPortal(
    /* @__PURE__ */ O.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ O.jsx("div", { className: "main-tabs__list", children: Xm.map((ee) => {
        const g = ee.key === w;
        return /* @__PURE__ */ O.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${ee.key}`,
            "aria-selected": g,
            "aria-controls": ee.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => ue(ee.key),
            type: "button",
            children: ee.label
          },
          ee.key
        );
      }) }),
      /* @__PURE__ */ O.jsx("p", { className: "main-tabs__summary", role: "status", children: ae })
    ] }),
    N
  ) : null;
}
function Zm() {
  return vk();
}
const Wf = [
  "magic",
  "metatype",
  "attributes",
  "skills",
  "resources"
], Jm = ["A", "B", "C", "D", "E"], Ck = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function Rk(N) {
  return Ck[N];
}
function Tk(N, x) {
  var ue;
  const w = (ue = N == null ? void 0 : N.priorities) == null ? void 0 : ue[x];
  return w ? Jm.map((ae) => {
    const ee = w[ae] ?? { label: `Priority ${ae}` };
    return { code: ae, option: ee };
  }) : Jm.map((ae) => ({
    code: ae,
    option: { label: `Priority ${ae}` }
  }));
}
function wk() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function yT(N) {
  return Wf.reduce((x, w) => {
    const ue = N[w];
    return ue && x.push(ue), x;
  }, []);
}
function pT(N) {
  const x = new Set(yT(N));
  return Jm.filter((w) => !x.has(w));
}
function xk(N) {
  return yT(N).length === Jm.length;
}
function bk(N) {
  return N ? N.summary || N.description || N.label || "" : "Drag a priority letter from the pool into this category.";
}
function _k(N) {
  return Object.fromEntries(
    Object.entries(N).map(([x, w]) => [x, w || null])
  );
}
function kk() {
  var ue, ae;
  const N = wk();
  if (typeof window > "u")
    return N;
  const x = (ae = (ue = window.ShadowmasterLegacyApp) == null ? void 0 : ue.getPriorities) == null ? void 0 : ae.call(ue);
  if (!x)
    return N;
  const w = { ...N };
  for (const ee of Wf) {
    const g = x[ee];
    typeof g == "string" && g.length === 1 && (w[ee] = g);
  }
  return w;
}
function Dk() {
  const { characterCreationData: N, activeEdition: x, isLoading: w, error: ue } = Zm(), [ae, ee] = Le.useState(() => kk()), [g, ye] = Le.useState(null), Y = Le.useRef({});
  Le.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), Le.useEffect(() => {
    var Z;
    const fe = (Z = window.ShadowmasterLegacyApp) == null ? void 0 : Z.setPriorities;
    fe && fe(_k(ae));
  }, [ae]);
  const W = Le.useMemo(() => pT(ae), [ae]), Re = xk(ae);
  function V(fe) {
    ee((Z) => {
      const Ae = { ...Z };
      for (const he of Wf)
        Ae[he] === fe && (Ae[he] = "");
      return Ae;
    });
  }
  function de(fe, Z) {
    Z.dataTransfer.effectAllowed = "move", ye({ source: "pool", priority: fe }), Z.dataTransfer.setData("text/plain", fe);
  }
  function re(fe, Z, Ae) {
    Ae.dataTransfer.effectAllowed = "move", ye({ source: "dropzone", category: fe, priority: Z }), Ae.dataTransfer.setData("text/plain", Z);
  }
  function ce() {
    ye(null);
  }
  function Ne(fe, Z) {
    Z.preventDefault();
    const Ae = Z.dataTransfer.getData("text/plain") || (g == null ? void 0 : g.priority) || "";
    if (!Ae) {
      ce();
      return;
    }
    ee((he) => {
      const it = { ...he };
      for (const Rt of Wf)
        it[Rt] === Ae && (it[Rt] = "");
      return it[fe] = Ae, it;
    }), ce();
  }
  function Ze(fe, Z) {
    Z.preventDefault();
    const Ae = Y.current[fe];
    Ae && Ae.classList.add("active");
  }
  function Qt(fe) {
    const Z = Y.current[fe];
    Z && Z.classList.remove("active");
  }
  function at(fe) {
    const Z = Y.current[fe];
    Z && Z.classList.remove("active");
  }
  function We(fe) {
    const Z = W[0];
    if (!Z) {
      V(fe);
      return;
    }
    ee((Ae) => {
      const he = { ...Ae };
      for (const it of Wf)
        he[it] === fe && (he[it] = "");
      return he[Z] = fe, he;
    });
  }
  return /* @__PURE__ */ O.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ O.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ O.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ O.jsx("strong", { children: x.label })
      ] }),
      /* @__PURE__ */ O.jsx("span", { children: w ? "Loading priority data…" : ue ? `Error: ${ue}` : "Drag letters into categories" })
    ] }),
    /* @__PURE__ */ O.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ O.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ O.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ O.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (fe) => {
              fe.preventDefault(), ye((Z) => Z && { ...Z, category: void 0 });
            },
            onDrop: (fe) => {
              fe.preventDefault();
              const Z = fe.dataTransfer.getData("text/plain") || (g == null ? void 0 : g.priority) || "";
              Z && V(Z), ce();
            },
            children: /* @__PURE__ */ O.jsx("div", { className: "react-priority-chips", children: ["A", "B", "C", "D", "E"].map((fe) => {
              const Z = pT(ae).includes(fe) === !1, Ae = (g == null ? void 0 : g.priority) === fe && g.source === "pool";
              return /* @__PURE__ */ O.jsx(
                "div",
                {
                  className: `react-priority-chip ${Z ? "used" : ""} ${Ae ? "dragging" : ""}`,
                  draggable: !Z,
                  onDragStart: (he) => !Z && de(fe, he),
                  onDragEnd: ce,
                  onClick: () => We(fe),
                  role: "button",
                  tabIndex: Z ? -1 : 0,
                  onKeyDown: (he) => {
                    !Z && (he.key === "Enter" || he.key === " ") && (he.preventDefault(), We(fe));
                  },
                  children: fe
                },
                fe
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ O.jsx("section", { className: "react-priority-dropzones", children: Wf.map((fe) => {
        const Z = Rk(fe), Ae = Tk(N, fe), he = ae[fe], it = Ae.find((St) => St.code === he), Rt = (g == null ? void 0 : g.source) === "dropzone" && g.category === fe;
        return /* @__PURE__ */ O.jsxs(
          "div",
          {
            ref: (St) => {
              Y.current[fe] = St;
            },
            className: `react-priority-dropzone ${he ? "filled" : ""}`,
            onDragOver: (St) => Ze(fe, St),
            onDragLeave: () => Qt(fe),
            onDrop: (St) => {
              Ne(fe, St), at(fe);
            },
            children: [
              /* @__PURE__ */ O.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ O.jsx("span", { children: Z }),
                he && /* @__PURE__ */ O.jsxs("span", { children: [
                  he,
                  " — ",
                  (it == null ? void 0 : it.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ O.jsx("div", { className: "react-priority-description", children: bk(it == null ? void 0 : it.option) }),
              he ? /* @__PURE__ */ O.jsx(
                "div",
                {
                  className: `react-priority-chip ${Rt ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (St) => re(fe, he, St),
                  onDragEnd: ce,
                  onDoubleClick: () => V(he),
                  children: he
                }
              ) : /* @__PURE__ */ O.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          fe
        );
      }) })
    ] }),
    /* @__PURE__ */ O.jsx(
      "div",
      {
        className: `react-priority-status ${Re ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: Re ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${W.join(", ")}`
      }
    )
  ] });
}
const Ok = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function Nk(N, x) {
  if (!N)
    return [];
  const w = x || "E";
  return N.metatypes.map((ue) => {
    var ae;
    return {
      ...ue,
      priorityAllowed: ((ae = ue.priority_tiers) == null ? void 0 : ae.includes(w)) ?? !1
    };
  }).filter((ue) => ue.priorityAllowed);
}
function Mk(N) {
  return N === 0 ? "+0" : N > 0 ? `+${N}` : `${N}`;
}
function Lk(N) {
  const x = N.toLowerCase();
  return Ok[x] ?? N;
}
function Ak({ priority: N, selectedMetatype: x, onSelect: w }) {
  const { characterCreationData: ue, isLoading: ae, error: ee, activeEdition: g } = Zm();
  Le.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const ye = Le.useMemo(() => Nk(ue, N), [
    ue,
    N
  ]), Y = !!x, W = () => {
    var V, de;
    (de = (V = window.ShadowmasterLegacyApp) == null ? void 0 : V.showWizardStep) == null || de.call(V, 1);
  }, Re = () => {
    var V, de;
    x && ((de = (V = window.ShadowmasterLegacyApp) == null ? void 0 : V.showWizardStep) == null || de.call(V, 3));
  };
  return ae ? /* @__PURE__ */ O.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : ee ? /* @__PURE__ */ O.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    ee
  ] }) : ye.length ? /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
    /* @__PURE__ */ O.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ O.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ O.jsxs("span", { children: [
        "Priority: ",
        N || "—"
      ] })
    ] }),
    /* @__PURE__ */ O.jsx("div", { className: "react-metatype-grid", children: ye.map((V) => /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `react-metatype-card ${x === V.id ? "selected" : ""}`,
        onClick: () => w(V.id),
        children: [
          /* @__PURE__ */ O.jsx("h4", { children: V.name }),
          /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const de = V.attribute_modifiers ? Object.entries(V.attribute_modifiers).filter(([, re]) => re !== 0) : [];
              return de.length === 0 ? /* @__PURE__ */ O.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : de.map(([re, ce]) => /* @__PURE__ */ O.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ O.jsx("span", { children: Lk(re) }),
                /* @__PURE__ */ O.jsx("span", { className: ce > 0 ? "positive" : "negative", children: Mk(ce) })
              ] }, re));
            })()
          ] }),
          g.key === "sr5" && V.special_attribute_points && Object.keys(V.special_attribute_points).length > 0 && /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(V.special_attribute_points).map(([de, re]) => /* @__PURE__ */ O.jsx("div", { className: "ability", children: /* @__PURE__ */ O.jsxs("span", { children: [
              "Priority ",
              de,
              ": ",
              re
            ] }) }, de))
          ] }),
          V.abilities && V.abilities.length > 0 && /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Special Abilities" }),
            V.abilities.map((de, re) => /* @__PURE__ */ O.jsx("div", { className: "ability", children: /* @__PURE__ */ O.jsx("span", { children: de }) }, re))
          ] }),
          (!V.abilities || V.abilities.length === 0) && /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ O.jsx("div", { className: "ability", children: /* @__PURE__ */ O.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      V.id
    )) }),
    /* @__PURE__ */ O.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ O.jsx("button", { type: "button", className: "btn btn-secondary", onClick: W, children: "Back" }),
      /* @__PURE__ */ O.jsx("div", { className: `react-metatype-status ${Y ? "ready" : ""}`, children: Y ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ O.jsx("button", { type: "button", className: "btn btn-primary", disabled: !Y, onClick: Re, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ O.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const zk = ["Hermetic", "Shamanic"], Uk = [
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
function jk(N) {
  return (N || "").toUpperCase();
}
function Fk({ priority: N, selection: x, onChange: w }) {
  var re;
  const { characterCreationData: ue, activeEdition: ae } = Zm(), ee = jk(N), g = ((re = ue == null ? void 0 : ue.priorities) == null ? void 0 : re.magic) ?? null, ye = Le.useMemo(() => g && g[ee] || null, [g, ee]);
  Le.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), Le.useEffect(() => {
    if (!ee) {
      (x.type !== "Mundane" || x.tradition || x.totem) && w({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (ee === "A") {
      const ce = x.tradition ?? "Hermetic", Ne = ce === "Shamanic" ? x.totem : null;
      (x.type !== "Full Magician" || x.tradition !== ce || x.totem !== Ne) && w({ type: "Full Magician", tradition: ce, totem: Ne });
    } else if (ee === "B") {
      let ce = x.type;
      x.type !== "Adept" && x.type !== "Aspected Magician" && (ce = "Adept");
      let Ne = x.tradition, Ze = x.totem;
      ce === "Aspected Magician" ? (Ne = Ne ?? "Hermetic", Ne !== "Shamanic" && (Ze = null)) : (Ne = null, Ze = null), (x.type !== ce || x.tradition !== Ne || x.totem !== Ze) && w({ type: ce, tradition: Ne, totem: Ze });
    } else
      (x.type !== "Mundane" || x.tradition || x.totem) && w({ type: "Mundane", tradition: null, totem: null });
  }, [ee]);
  const Y = (ce) => {
    const Ne = {
      type: ce.type !== void 0 ? ce.type : x.type,
      tradition: ce.tradition !== void 0 ? ce.tradition : x.tradition,
      totem: ce.totem !== void 0 ? ce.totem : x.totem
    };
    Ne.type !== "Full Magician" && Ne.type !== "Aspected Magician" && (Ne.tradition = null, Ne.totem = null), Ne.tradition !== "Shamanic" && (Ne.totem = null), !(Ne.type === x.type && Ne.tradition === x.tradition && Ne.totem === x.totem) && w(Ne);
  }, W = () => !ee || ["C", "D", "E", ""].includes(ee) ? /* @__PURE__ */ O.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ O.jsxs(
    "article",
    {
      className: `react-magic-card ${x.type === "Mundane" ? "selected" : ""}`,
      onClick: () => Y({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ O.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ O.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : ee === "A" ? /* @__PURE__ */ O.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ O.jsxs(
    "article",
    {
      className: `react-magic-card ${x.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => Y({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ O.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ O.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ O.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : ee === "B" ? /* @__PURE__ */ O.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `react-magic-card ${x.type === "Adept" ? "selected" : ""}`,
        onClick: () => Y({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ O.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ O.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `react-magic-card ${x.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => Y({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ O.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ O.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ O.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, Re = () => !x.type || !["Full Magician", "Aspected Magician"].includes(x.type) ? null : /* @__PURE__ */ O.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ O.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ O.jsx("div", { className: "tradition-options", children: zk.map((ce) => /* @__PURE__ */ O.jsxs("label", { className: `tradition-option ${x.tradition === ce ? "selected" : ""}`, children: [
      /* @__PURE__ */ O.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: ce,
          checked: x.tradition === ce,
          onChange: () => Y({ tradition: ce })
        }
      ),
      /* @__PURE__ */ O.jsx("span", { children: ce })
    ] }, ce)) })
  ] }), V = () => x.tradition !== "Shamanic" ? null : /* @__PURE__ */ O.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ O.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ O.jsx("div", { className: "totem-grid", children: Uk.map((ce) => /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `totem-card ${x.totem === ce.id ? "selected" : ""}`,
        onClick: () => Y({ totem: ce.id }),
        children: [
          /* @__PURE__ */ O.jsx("h5", { children: ce.name }),
          /* @__PURE__ */ O.jsx("p", { children: ce.description }),
          /* @__PURE__ */ O.jsx("ul", { children: ce.notes.map((Ne) => /* @__PURE__ */ O.jsx("li", { children: Ne }, Ne)) })
        ]
      },
      ce.id
    )) })
  ] }), de = () => {
    if (!x.type)
      return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (x.type === "Full Magician" || x.type === "Aspected Magician") {
      if (!x.tradition)
        return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (x.tradition === "Shamanic" && !x.totem)
        return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ O.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ O.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ O.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ O.jsxs("span", { children: [
        "Priority ",
        ee || "—",
        " ",
        ye != null && ye.summary ? `— ${ye.summary}` : ""
      ] })
    ] }),
    W(),
    Re(),
    V(),
    de(),
    /* @__PURE__ */ O.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ O.jsxs("small", { children: [
      "Edition: ",
      ae.label
    ] }) })
  ] });
}
function Hk() {
  const [N, x] = Le.useState(null);
  return Le.useEffect(() => {
    x(document.getElementById("auth-root"));
  }, []), N ? lc.createPortal(/* @__PURE__ */ O.jsx(hk, {}), N) : null;
}
function Pk() {
  const [N, x] = Le.useState(null);
  return Le.useEffect(() => {
    x(document.getElementById("priority-assignment-react-root"));
  }, []), N ? lc.createPortal(/* @__PURE__ */ O.jsx(Dk, {}), N) : null;
}
function Vk() {
  const [N, x] = Le.useState(null), [w, ue] = Le.useState(""), [ae, ee] = Le.useState(null);
  return Le.useEffect(() => {
    x(document.getElementById("metatype-selection-react-root"));
  }, []), Le.useEffect(() => {
    var Y;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const ye = () => {
      var W, Re;
      ue(((W = g.getMetatypePriority) == null ? void 0 : W.call(g)) ?? ""), ee(((Re = g.getMetatypeSelection) == null ? void 0 : Re.call(g)) ?? null);
    };
    return ye(), (Y = g.subscribeMetatypeState) == null || Y.call(g, ye), () => {
      var W;
      (W = g.unsubscribeMetatypeState) == null || W.call(g, ye);
    };
  }, []), N ? lc.createPortal(
    /* @__PURE__ */ O.jsx(
      Ak,
      {
        priority: w,
        selectedMetatype: ae,
        onSelect: (g) => {
          var ye, Y;
          ee(g), (Y = (ye = window.ShadowmasterLegacyApp) == null ? void 0 : ye.setMetatypeSelection) == null || Y.call(ye, g);
        }
      }
    ),
    N
  ) : null;
}
function Bk() {
  const [N, x] = Le.useState(null), [w, ue] = Le.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return Le.useEffect(() => {
    x(document.getElementById("magical-abilities-react-root"));
  }, []), Le.useEffect(() => {
    var g;
    const ae = window.ShadowmasterLegacyApp;
    if (!ae) return;
    const ee = () => {
      var Y;
      const ye = (Y = ae.getMagicState) == null ? void 0 : Y.call(ae);
      ye && ue({
        priority: ye.priority || "",
        type: ye.type || null,
        tradition: ye.tradition || null,
        totem: ye.totem || null
      });
    };
    return ee(), (g = ae.subscribeMagicState) == null || g.call(ae, ee), () => {
      var ye;
      (ye = ae.unsubscribeMagicState) == null || ye.call(ae, ee);
    };
  }, []), N ? lc.createPortal(
    /* @__PURE__ */ O.jsx(
      Fk,
      {
        priority: w.priority,
        selection: { type: w.type, tradition: w.tradition, totem: w.totem },
        onChange: (ae) => {
          var ee, g;
          (g = (ee = window.ShadowmasterLegacyApp) == null ? void 0 : ee.setMagicState) == null || g.call(ee, ae);
        }
      }
    ),
    N
  ) : null;
}
function Ik() {
  const { activeEdition: N, isLoading: x, error: w, characterCreationData: ue } = Zm();
  let ae = "· data pending";
  return x ? ae = "· loading edition data…" : w ? ae = `· failed to load data: ${w}` : ue && (ae = "· edition data loaded"), /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
    /* @__PURE__ */ O.jsx("div", { className: "react-banner", "data-active-edition": N.key, children: /* @__PURE__ */ O.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ O.jsx("strong", { children: N.label }),
      " ",
      ae
    ] }) }),
    /* @__PURE__ */ O.jsx(Hk, {}),
    /* @__PURE__ */ O.jsx(Ek, {}),
    /* @__PURE__ */ O.jsx(yk, {}),
    /* @__PURE__ */ O.jsx(Pk, {}),
    /* @__PURE__ */ O.jsx(Vk, {}),
    /* @__PURE__ */ O.jsx(Bk, {})
  ] });
}
const Yk = document.getElementById("shadowmaster-react-root"), $k = Yk ?? Qk();
function Qk() {
  const N = document.createElement("div");
  return N.id = "shadowmaster-react-root", N.dataset.controller = "react-shell", N.style.display = "contents", document.body.appendChild(N), N;
}
function Wk() {
  return Le.useEffect(() => {
    var N, x, w;
    (N = window.ShadowmasterLegacyApp) != null && N.initialize && !((w = (x = window.ShadowmasterLegacyApp).isInitialized) != null && w.call(x)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ O.jsx(Le.StrictMode, { children: /* @__PURE__ */ O.jsx(pk, { children: /* @__PURE__ */ O.jsx(Ik, {}) }) });
}
const Gk = RE($k);
Gk.render(/* @__PURE__ */ O.jsx(Wk, {}));
