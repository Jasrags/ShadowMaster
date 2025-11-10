var EE = { exports: {} }, ev = {}, CE = { exports: {} }, Ot = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ax;
function ik() {
  if (ax) return Ot;
  ax = 1;
  var _ = Symbol.for("react.element"), w = Symbol.for("react.portal"), R = Symbol.for("react.fragment"), J = Symbol.for("react.strict_mode"), Z = Symbol.for("react.profiler"), A = Symbol.for("react.provider"), g = Symbol.for("react.context"), le = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), Q = Symbol.for("react.memo"), ke = Symbol.for("react.lazy"), Y = Symbol.iterator;
  function ee(b) {
    return b === null || typeof b != "object" ? null : (b = Y && b[Y] || b["@@iterator"], typeof b == "function" ? b : null);
  }
  var te = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ne = Object.assign, K = {};
  function Ce(b, I, Qe) {
    this.props = b, this.context = I, this.refs = K, this.updater = Qe || te;
  }
  Ce.prototype.isReactComponent = {}, Ce.prototype.setState = function(b, I) {
    if (typeof b != "object" && typeof b != "function" && b != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, b, I, "setState");
  }, Ce.prototype.forceUpdate = function(b) {
    this.updater.enqueueForceUpdate(this, b, "forceUpdate");
  };
  function Ue() {
  }
  Ue.prototype = Ce.prototype;
  function ce(b, I, Qe) {
    this.props = b, this.context = I, this.refs = K, this.updater = Qe || te;
  }
  var ye = ce.prototype = new Ue();
  ye.constructor = ce, ne(ye, Ce.prototype), ye.isPureReactComponent = !0;
  var Le = Array.isArray, he = Object.prototype.hasOwnProperty, Ee = { current: null }, P = { key: !0, ref: !0, __self: !0, __source: !0 };
  function fe(b, I, Qe) {
    var Ae, at = {}, ut = null, ct = null;
    if (I != null) for (Ae in I.ref !== void 0 && (ct = I.ref), I.key !== void 0 && (ut = "" + I.key), I) he.call(I, Ae) && !P.hasOwnProperty(Ae) && (at[Ae] = I[Ae]);
    var ft = arguments.length - 2;
    if (ft === 1) at.children = Qe;
    else if (1 < ft) {
      for (var gt = Array(ft), Wt = 0; Wt < ft; Wt++) gt[Wt] = arguments[Wt + 2];
      at.children = gt;
    }
    if (b && b.defaultProps) for (Ae in ft = b.defaultProps, ft) at[Ae] === void 0 && (at[Ae] = ft[Ae]);
    return { $$typeof: _, type: b, key: ut, ref: ct, props: at, _owner: Ee.current };
  }
  function ue(b, I) {
    return { $$typeof: _, type: b.type, key: I, ref: b.ref, props: b.props, _owner: b._owner };
  }
  function xe(b) {
    return typeof b == "object" && b !== null && b.$$typeof === _;
  }
  function Ve(b) {
    var I = { "=": "=0", ":": "=2" };
    return "$" + b.replace(/[=:]/g, function(Qe) {
      return I[Qe];
    });
  }
  var et = /\/+/g;
  function Re(b, I) {
    return typeof b == "object" && b !== null && b.key != null ? Ve("" + b.key) : I.toString(36);
  }
  function bt(b, I, Qe, Ae, at) {
    var ut = typeof b;
    (ut === "undefined" || ut === "boolean") && (b = null);
    var ct = !1;
    if (b === null) ct = !0;
    else switch (ut) {
      case "string":
      case "number":
        ct = !0;
        break;
      case "object":
        switch (b.$$typeof) {
          case _:
          case w:
            ct = !0;
        }
    }
    if (ct) return ct = b, at = at(ct), b = Ae === "" ? "." + Re(ct, 0) : Ae, Le(at) ? (Qe = "", b != null && (Qe = b.replace(et, "$&/") + "/"), bt(at, I, Qe, "", function(Wt) {
      return Wt;
    })) : at != null && (xe(at) && (at = ue(at, Qe + (!at.key || ct && ct.key === at.key ? "" : ("" + at.key).replace(et, "$&/") + "/") + b)), I.push(at)), 1;
    if (ct = 0, Ae = Ae === "" ? "." : Ae + ":", Le(b)) for (var ft = 0; ft < b.length; ft++) {
      ut = b[ft];
      var gt = Ae + Re(ut, ft);
      ct += bt(ut, I, Qe, gt, at);
    }
    else if (gt = ee(b), typeof gt == "function") for (b = gt.call(b), ft = 0; !(ut = b.next()).done; ) ut = ut.value, gt = Ae + Re(ut, ft++), ct += bt(ut, I, Qe, gt, at);
    else if (ut === "object") throw I = String(b), Error("Objects are not valid as a React child (found: " + (I === "[object Object]" ? "object with keys {" + Object.keys(b).join(", ") + "}" : I) + "). If you meant to render a collection of children, use an array instead.");
    return ct;
  }
  function _t(b, I, Qe) {
    if (b == null) return b;
    var Ae = [], at = 0;
    return bt(b, Ae, "", "", function(ut) {
      return I.call(Qe, ut, at++);
    }), Ae;
  }
  function Dt(b) {
    if (b._status === -1) {
      var I = b._result;
      I = I(), I.then(function(Qe) {
        (b._status === 0 || b._status === -1) && (b._status = 1, b._result = Qe);
      }, function(Qe) {
        (b._status === 0 || b._status === -1) && (b._status = 2, b._result = Qe);
      }), b._status === -1 && (b._status = 0, b._result = I);
    }
    if (b._status === 1) return b._result.default;
    throw b._result;
  }
  var Pe = { current: null }, me = { transition: null }, ge = { ReactCurrentDispatcher: Pe, ReactCurrentBatchConfig: me, ReactCurrentOwner: Ee };
  function ve() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Ot.Children = { map: _t, forEach: function(b, I, Qe) {
    _t(b, function() {
      I.apply(this, arguments);
    }, Qe);
  }, count: function(b) {
    var I = 0;
    return _t(b, function() {
      I++;
    }), I;
  }, toArray: function(b) {
    return _t(b, function(I) {
      return I;
    }) || [];
  }, only: function(b) {
    if (!xe(b)) throw Error("React.Children.only expected to receive a single React element child.");
    return b;
  } }, Ot.Component = Ce, Ot.Fragment = R, Ot.Profiler = Z, Ot.PureComponent = ce, Ot.StrictMode = J, Ot.Suspense = U, Ot.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ge, Ot.act = ve, Ot.cloneElement = function(b, I, Qe) {
    if (b == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + b + ".");
    var Ae = ne({}, b.props), at = b.key, ut = b.ref, ct = b._owner;
    if (I != null) {
      if (I.ref !== void 0 && (ut = I.ref, ct = Ee.current), I.key !== void 0 && (at = "" + I.key), b.type && b.type.defaultProps) var ft = b.type.defaultProps;
      for (gt in I) he.call(I, gt) && !P.hasOwnProperty(gt) && (Ae[gt] = I[gt] === void 0 && ft !== void 0 ? ft[gt] : I[gt]);
    }
    var gt = arguments.length - 2;
    if (gt === 1) Ae.children = Qe;
    else if (1 < gt) {
      ft = Array(gt);
      for (var Wt = 0; Wt < gt; Wt++) ft[Wt] = arguments[Wt + 2];
      Ae.children = ft;
    }
    return { $$typeof: _, type: b.type, key: at, ref: ut, props: Ae, _owner: ct };
  }, Ot.createContext = function(b) {
    return b = { $$typeof: g, _currentValue: b, _currentValue2: b, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, b.Provider = { $$typeof: A, _context: b }, b.Consumer = b;
  }, Ot.createElement = fe, Ot.createFactory = function(b) {
    var I = fe.bind(null, b);
    return I.type = b, I;
  }, Ot.createRef = function() {
    return { current: null };
  }, Ot.forwardRef = function(b) {
    return { $$typeof: le, render: b };
  }, Ot.isValidElement = xe, Ot.lazy = function(b) {
    return { $$typeof: ke, _payload: { _status: -1, _result: b }, _init: Dt };
  }, Ot.memo = function(b, I) {
    return { $$typeof: Q, type: b, compare: I === void 0 ? null : I };
  }, Ot.startTransition = function(b) {
    var I = me.transition;
    me.transition = {};
    try {
      b();
    } finally {
      me.transition = I;
    }
  }, Ot.unstable_act = ve, Ot.useCallback = function(b, I) {
    return Pe.current.useCallback(b, I);
  }, Ot.useContext = function(b) {
    return Pe.current.useContext(b);
  }, Ot.useDebugValue = function() {
  }, Ot.useDeferredValue = function(b) {
    return Pe.current.useDeferredValue(b);
  }, Ot.useEffect = function(b, I) {
    return Pe.current.useEffect(b, I);
  }, Ot.useId = function() {
    return Pe.current.useId();
  }, Ot.useImperativeHandle = function(b, I, Qe) {
    return Pe.current.useImperativeHandle(b, I, Qe);
  }, Ot.useInsertionEffect = function(b, I) {
    return Pe.current.useInsertionEffect(b, I);
  }, Ot.useLayoutEffect = function(b, I) {
    return Pe.current.useLayoutEffect(b, I);
  }, Ot.useMemo = function(b, I) {
    return Pe.current.useMemo(b, I);
  }, Ot.useReducer = function(b, I, Qe) {
    return Pe.current.useReducer(b, I, Qe);
  }, Ot.useRef = function(b) {
    return Pe.current.useRef(b);
  }, Ot.useState = function(b) {
    return Pe.current.useState(b);
  }, Ot.useSyncExternalStore = function(b, I, Qe) {
    return Pe.current.useSyncExternalStore(b, I, Qe);
  }, Ot.useTransition = function() {
    return Pe.current.useTransition();
  }, Ot.version = "18.3.1", Ot;
}
var rv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
rv.exports;
var ix;
function lk() {
  return ix || (ix = 1, function(_, w) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var R = "18.3.1", J = Symbol.for("react.element"), Z = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), le = Symbol.for("react.profiler"), U = Symbol.for("react.provider"), Q = Symbol.for("react.context"), ke = Symbol.for("react.forward_ref"), Y = Symbol.for("react.suspense"), ee = Symbol.for("react.suspense_list"), te = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), K = Symbol.for("react.offscreen"), Ce = Symbol.iterator, Ue = "@@iterator";
      function ce(h) {
        if (h === null || typeof h != "object")
          return null;
        var x = Ce && h[Ce] || h[Ue];
        return typeof x == "function" ? x : null;
      }
      var ye = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Le = {
        transition: null
      }, he = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Ee = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, P = {}, fe = null;
      function ue(h) {
        fe = h;
      }
      P.setExtraStackFrame = function(h) {
        fe = h;
      }, P.getCurrentStack = null, P.getStackAddendum = function() {
        var h = "";
        fe && (h += fe);
        var x = P.getCurrentStack;
        return x && (h += x() || ""), h;
      };
      var xe = !1, Ve = !1, et = !1, Re = !1, bt = !1, _t = {
        ReactCurrentDispatcher: ye,
        ReactCurrentBatchConfig: Le,
        ReactCurrentOwner: Ee
      };
      _t.ReactDebugCurrentFrame = P, _t.ReactCurrentActQueue = he;
      function Dt(h) {
        {
          for (var x = arguments.length, H = new Array(x > 1 ? x - 1 : 0), $ = 1; $ < x; $++)
            H[$ - 1] = arguments[$];
          me("warn", h, H);
        }
      }
      function Pe(h) {
        {
          for (var x = arguments.length, H = new Array(x > 1 ? x - 1 : 0), $ = 1; $ < x; $++)
            H[$ - 1] = arguments[$];
          me("error", h, H);
        }
      }
      function me(h, x, H) {
        {
          var $ = _t.ReactDebugCurrentFrame, Se = $.getStackAddendum();
          Se !== "" && (x += "%s", H = H.concat([Se]));
          var Je = H.map(function(be) {
            return String(be);
          });
          Je.unshift("Warning: " + x), Function.prototype.apply.call(console[h], console, Je);
        }
      }
      var ge = {};
      function ve(h, x) {
        {
          var H = h.constructor, $ = H && (H.displayName || H.name) || "ReactClass", Se = $ + "." + x;
          if (ge[Se])
            return;
          Pe("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", x, $), ge[Se] = !0;
        }
      }
      var b = {
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
        enqueueForceUpdate: function(h, x, H) {
          ve(h, "forceUpdate");
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
        enqueueReplaceState: function(h, x, H, $) {
          ve(h, "replaceState");
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
        enqueueSetState: function(h, x, H, $) {
          ve(h, "setState");
        }
      }, I = Object.assign, Qe = {};
      Object.freeze(Qe);
      function Ae(h, x, H) {
        this.props = h, this.context = x, this.refs = Qe, this.updater = H || b;
      }
      Ae.prototype.isReactComponent = {}, Ae.prototype.setState = function(h, x) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, x, "setState");
      }, Ae.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var at = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, ut = function(h, x) {
          Object.defineProperty(Ae.prototype, h, {
            get: function() {
              Dt("%s(...) is deprecated in plain JavaScript React classes. %s", x[0], x[1]);
            }
          });
        };
        for (var ct in at)
          at.hasOwnProperty(ct) && ut(ct, at[ct]);
      }
      function ft() {
      }
      ft.prototype = Ae.prototype;
      function gt(h, x, H) {
        this.props = h, this.context = x, this.refs = Qe, this.updater = H || b;
      }
      var Wt = gt.prototype = new ft();
      Wt.constructor = gt, I(Wt, Ae.prototype), Wt.isPureReactComponent = !0;
      function Nn() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var br = Array.isArray;
      function wn(h) {
        return br(h);
      }
      function rr(h) {
        {
          var x = typeof Symbol == "function" && Symbol.toStringTag, H = x && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return H;
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
          return Pe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rr(h)), In(h);
      }
      function ci(h, x, H) {
        var $ = h.displayName;
        if ($)
          return $;
        var Se = x.displayName || x.name || "";
        return Se !== "" ? H + "(" + Se + ")" : H;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Pe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case A:
            return "Fragment";
          case Z:
            return "Portal";
          case le:
            return "Profiler";
          case g:
            return "StrictMode";
          case Y:
            return "Suspense";
          case ee:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Q:
              var x = h;
              return sa(x) + ".Consumer";
            case U:
              var H = h;
              return sa(H._context) + ".Provider";
            case ke:
              return ci(h, h.render, "ForwardRef");
            case te:
              var $ = h.displayName || null;
              return $ !== null ? $ : Kn(h.type) || "Memo";
            case ne: {
              var Se = h, Je = Se._payload, be = Se._init;
              try {
                return Kn(be(Je));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var xn = Object.prototype.hasOwnProperty, Yn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Sr, $a, Ln;
      Ln = {};
      function Er(h) {
        if (xn.call(h, "ref")) {
          var x = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (x && x.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (xn.call(h, "key")) {
          var x = Object.getOwnPropertyDescriptor(h, "key").get;
          if (x && x.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function Qa(h, x) {
        var H = function() {
          Sr || (Sr = !0, Pe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", x));
        };
        H.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: H,
          configurable: !0
        });
      }
      function fi(h, x) {
        var H = function() {
          $a || ($a = !0, Pe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", x));
        };
        H.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: H,
          configurable: !0
        });
      }
      function we(h) {
        if (typeof h.ref == "string" && Ee.current && h.__self && Ee.current.stateNode !== h.__self) {
          var x = Kn(Ee.current.type);
          Ln[x] || (Pe('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', x, h.ref), Ln[x] = !0);
        }
      }
      var We = function(h, x, H, $, Se, Je, be) {
        var nt = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: J,
          // Built-in properties that belong on the element
          type: h,
          key: x,
          ref: H,
          props: be,
          // Record the component responsible for creating this element.
          _owner: Je
        };
        return nt._store = {}, Object.defineProperty(nt._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(nt, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: $
        }), Object.defineProperty(nt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: Se
        }), Object.freeze && (Object.freeze(nt.props), Object.freeze(nt)), nt;
      };
      function Et(h, x, H) {
        var $, Se = {}, Je = null, be = null, nt = null, Tt = null;
        if (x != null) {
          Er(x) && (be = x.ref, we(x)), ca(x) && ($r(x.key), Je = "" + x.key), nt = x.__self === void 0 ? null : x.__self, Tt = x.__source === void 0 ? null : x.__source;
          for ($ in x)
            xn.call(x, $) && !Yn.hasOwnProperty($) && (Se[$] = x[$]);
        }
        var zt = arguments.length - 2;
        if (zt === 1)
          Se.children = H;
        else if (zt > 1) {
          for (var un = Array(zt), Xt = 0; Xt < zt; Xt++)
            un[Xt] = arguments[Xt + 2];
          Object.freeze && Object.freeze(un), Se.children = un;
        }
        if (h && h.defaultProps) {
          var Ct = h.defaultProps;
          for ($ in Ct)
            Se[$] === void 0 && (Se[$] = Ct[$]);
        }
        if (Je || be) {
          var Jt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Je && Qa(Se, Jt), be && fi(Se, Jt);
        }
        return We(h, Je, be, nt, Tt, Ee.current, Se);
      }
      function Yt(h, x) {
        var H = We(h.type, x, h.ref, h._self, h._source, h._owner, h.props);
        return H;
      }
      function rn(h, x, H) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var $, Se = I({}, h.props), Je = h.key, be = h.ref, nt = h._self, Tt = h._source, zt = h._owner;
        if (x != null) {
          Er(x) && (be = x.ref, zt = Ee.current), ca(x) && ($r(x.key), Je = "" + x.key);
          var un;
          h.type && h.type.defaultProps && (un = h.type.defaultProps);
          for ($ in x)
            xn.call(x, $) && !Yn.hasOwnProperty($) && (x[$] === void 0 && un !== void 0 ? Se[$] = un[$] : Se[$] = x[$]);
        }
        var Xt = arguments.length - 2;
        if (Xt === 1)
          Se.children = H;
        else if (Xt > 1) {
          for (var Ct = Array(Xt), Jt = 0; Jt < Xt; Jt++)
            Ct[Jt] = arguments[Jt + 2];
          Se.children = Ct;
        }
        return We(h.type, Je, be, nt, Tt, zt, Se);
      }
      function hn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === J;
      }
      var sn = ".", Xn = ":";
      function an(h) {
        var x = /[=:]/g, H = {
          "=": "=0",
          ":": "=2"
        }, $ = h.replace(x, function(Se) {
          return H[Se];
        });
        return "$" + $;
      }
      var Gt = !1, qt = /\/+/g;
      function fa(h) {
        return h.replace(qt, "$&/");
      }
      function Cr(h, x) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), an("" + h.key)) : x.toString(36);
      }
      function Ra(h, x, H, $, Se) {
        var Je = typeof h;
        (Je === "undefined" || Je === "boolean") && (h = null);
        var be = !1;
        if (h === null)
          be = !0;
        else
          switch (Je) {
            case "string":
            case "number":
              be = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case J:
                case Z:
                  be = !0;
              }
          }
        if (be) {
          var nt = h, Tt = Se(nt), zt = $ === "" ? sn + Cr(nt, 0) : $;
          if (wn(Tt)) {
            var un = "";
            zt != null && (un = fa(zt) + "/"), Ra(Tt, x, un, "", function(Jf) {
              return Jf;
            });
          } else Tt != null && (hn(Tt) && (Tt.key && (!nt || nt.key !== Tt.key) && $r(Tt.key), Tt = Yt(
            Tt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            H + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Tt.key && (!nt || nt.key !== Tt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + Tt.key) + "/"
            ) : "") + zt
          )), x.push(Tt));
          return 1;
        }
        var Xt, Ct, Jt = 0, mn = $ === "" ? sn : $ + Xn;
        if (wn(h))
          for (var wl = 0; wl < h.length; wl++)
            Xt = h[wl], Ct = mn + Cr(Xt, wl), Jt += Ra(Xt, x, H, Ct, Se);
        else {
          var Ko = ce(h);
          if (typeof Ko == "function") {
            var Bi = h;
            Ko === Bi.entries && (Gt || Dt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Gt = !0);
            for (var Xo = Ko.call(Bi), ou, Xf = 0; !(ou = Xo.next()).done; )
              Xt = ou.value, Ct = mn + Cr(Xt, Xf++), Jt += Ra(Xt, x, H, Ct, Se);
          } else if (Je === "object") {
            var sc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (sc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : sc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Jt;
      }
      function Pi(h, x, H) {
        if (h == null)
          return h;
        var $ = [], Se = 0;
        return Ra(h, $, "", "", function(Je) {
          return x.call(H, Je, Se++);
        }), $;
      }
      function Zl(h) {
        var x = 0;
        return Pi(h, function() {
          x++;
        }), x;
      }
      function eu(h, x, H) {
        Pi(h, function() {
          x.apply(this, arguments);
        }, H);
      }
      function pl(h) {
        return Pi(h, function(x) {
          return x;
        }) || [];
      }
      function vl(h) {
        if (!hn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function tu(h) {
        var x = {
          $$typeof: Q,
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
        x.Provider = {
          $$typeof: U,
          _context: x
        };
        var H = !1, $ = !1, Se = !1;
        {
          var Je = {
            $$typeof: Q,
            _context: x
          };
          Object.defineProperties(Je, {
            Provider: {
              get: function() {
                return $ || ($ = !0, Pe("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), x.Provider;
              },
              set: function(be) {
                x.Provider = be;
              }
            },
            _currentValue: {
              get: function() {
                return x._currentValue;
              },
              set: function(be) {
                x._currentValue = be;
              }
            },
            _currentValue2: {
              get: function() {
                return x._currentValue2;
              },
              set: function(be) {
                x._currentValue2 = be;
              }
            },
            _threadCount: {
              get: function() {
                return x._threadCount;
              },
              set: function(be) {
                x._threadCount = be;
              }
            },
            Consumer: {
              get: function() {
                return H || (H = !0, Pe("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), x.Consumer;
              }
            },
            displayName: {
              get: function() {
                return x.displayName;
              },
              set: function(be) {
                Se || (Dt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", be), Se = !0);
              }
            }
          }), x.Consumer = Je;
        }
        return x._currentRenderer = null, x._currentRenderer2 = null, x;
      }
      var _r = -1, kr = 0, ar = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var x = h._result, H = x();
          if (H.then(function(Je) {
            if (h._status === kr || h._status === _r) {
              var be = h;
              be._status = ar, be._result = Je;
            }
          }, function(Je) {
            if (h._status === kr || h._status === _r) {
              var be = h;
              be._status = di, be._result = Je;
            }
          }), h._status === _r) {
            var $ = h;
            $._status = kr, $._result = H;
          }
        }
        if (h._status === ar) {
          var Se = h._result;
          return Se === void 0 && Pe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, Se), "default" in Se || Pe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, Se), Se.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var x = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, H = {
          $$typeof: ne,
          _payload: x,
          _init: Wa
        };
        {
          var $, Se;
          Object.defineProperties(H, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return $;
              },
              set: function(Je) {
                Pe("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), $ = Je, Object.defineProperty(H, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return Se;
              },
              set: function(Je) {
                Pe("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), Se = Je, Object.defineProperty(H, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return H;
      }
      function vi(h) {
        h != null && h.$$typeof === te ? Pe("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Pe("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Pe("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Pe("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var x = {
          $$typeof: ke,
          render: h
        };
        {
          var H;
          Object.defineProperty(x, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return H;
            },
            set: function($) {
              H = $, !h.name && !h.displayName && (h.displayName = $);
            }
          });
        }
        return x;
      }
      var T;
      T = Symbol.for("react.module.reference");
      function re(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === A || h === le || bt || h === g || h === Y || h === ee || Re || h === K || xe || Ve || et || typeof h == "object" && h !== null && (h.$$typeof === ne || h.$$typeof === te || h.$$typeof === U || h.$$typeof === Q || h.$$typeof === ke || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === T || h.getModuleId !== void 0));
      }
      function _e(h, x) {
        re(h) || Pe("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var H = {
          $$typeof: te,
          type: h,
          compare: x === void 0 ? null : x
        };
        {
          var $;
          Object.defineProperty(H, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return $;
            },
            set: function(Se) {
              $ = Se, !h.name && !h.displayName && (h.displayName = Se);
            }
          });
        }
        return H;
      }
      function He() {
        var h = ye.current;
        return h === null && Pe(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function ht(h) {
        var x = He();
        if (h._context !== void 0) {
          var H = h._context;
          H.Consumer === h ? Pe("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : H.Provider === h && Pe("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return x.useContext(h);
      }
      function dt(h) {
        var x = He();
        return x.useState(h);
      }
      function Rt(h, x, H) {
        var $ = He();
        return $.useReducer(h, x, H);
      }
      function wt(h) {
        var x = He();
        return x.useRef(h);
      }
      function Rn(h, x) {
        var H = He();
        return H.useEffect(h, x);
      }
      function ln(h, x) {
        var H = He();
        return H.useInsertionEffect(h, x);
      }
      function cn(h, x) {
        var H = He();
        return H.useLayoutEffect(h, x);
      }
      function ir(h, x) {
        var H = He();
        return H.useCallback(h, x);
      }
      function Ga(h, x) {
        var H = He();
        return H.useMemo(h, x);
      }
      function qa(h, x, H) {
        var $ = He();
        return $.useImperativeHandle(h, x, H);
      }
      function mt(h, x) {
        {
          var H = He();
          return H.useDebugValue(h, x);
        }
      }
      function St() {
        var h = He();
        return h.useTransition();
      }
      function Ka(h) {
        var x = He();
        return x.useDeferredValue(h);
      }
      function nu() {
        var h = He();
        return h.useId();
      }
      function ru(h, x, H) {
        var $ = He();
        return $.useSyncExternalStore(h, x, H);
      }
      var hl = 0, Gu, ml, Qr, Qo, Dr, uc, oc;
      function qu() {
      }
      qu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Gu = console.log, ml = console.info, Qr = console.warn, Qo = console.error, Dr = console.group, uc = console.groupCollapsed, oc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: qu,
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
                value: Gu
              }),
              info: I({}, h, {
                value: ml
              }),
              warn: I({}, h, {
                value: Qr
              }),
              error: I({}, h, {
                value: Qo
              }),
              group: I({}, h, {
                value: Dr
              }),
              groupCollapsed: I({}, h, {
                value: uc
              }),
              groupEnd: I({}, h, {
                value: oc
              })
            });
          }
          hl < 0 && Pe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = _t.ReactCurrentDispatcher, Ja;
      function Ku(h, x, H) {
        {
          if (Ja === void 0)
            try {
              throw Error();
            } catch (Se) {
              var $ = Se.stack.trim().match(/\n( *(at )?)/);
              Ja = $ && $[1] || "";
            }
          return `
` + Ja + h;
        }
      }
      var au = !1, gl;
      {
        var Xu = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Xu();
      }
      function Ju(h, x) {
        if (!h || au)
          return "";
        {
          var H = gl.get(h);
          if (H !== void 0)
            return H;
        }
        var $;
        au = !0;
        var Se = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Je;
        Je = Xa.current, Xa.current = null, yl();
        try {
          if (x) {
            var be = function() {
              throw Error();
            };
            if (Object.defineProperty(be.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(be, []);
              } catch (mn) {
                $ = mn;
              }
              Reflect.construct(h, [], be);
            } else {
              try {
                be.call();
              } catch (mn) {
                $ = mn;
              }
              h.call(be.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (mn) {
              $ = mn;
            }
            h();
          }
        } catch (mn) {
          if (mn && $ && typeof mn.stack == "string") {
            for (var nt = mn.stack.split(`
`), Tt = $.stack.split(`
`), zt = nt.length - 1, un = Tt.length - 1; zt >= 1 && un >= 0 && nt[zt] !== Tt[un]; )
              un--;
            for (; zt >= 1 && un >= 0; zt--, un--)
              if (nt[zt] !== Tt[un]) {
                if (zt !== 1 || un !== 1)
                  do
                    if (zt--, un--, un < 0 || nt[zt] !== Tt[un]) {
                      var Xt = `
` + nt[zt].replace(" at new ", " at ");
                      return h.displayName && Xt.includes("<anonymous>") && (Xt = Xt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Xt), Xt;
                    }
                  while (zt >= 1 && un >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = Je, da(), Error.prepareStackTrace = Se;
        }
        var Ct = h ? h.displayName || h.name : "", Jt = Ct ? Ku(Ct) : "";
        return typeof h == "function" && gl.set(h, Jt), Jt;
      }
      function Hi(h, x, H) {
        return Ju(h, !1);
      }
      function qf(h) {
        var x = h.prototype;
        return !!(x && x.isReactComponent);
      }
      function Vi(h, x, H) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Ju(h, qf(h));
        if (typeof h == "string")
          return Ku(h);
        switch (h) {
          case Y:
            return Ku("Suspense");
          case ee:
            return Ku("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case ke:
              return Hi(h.render);
            case te:
              return Vi(h.type, x, H);
            case ne: {
              var $ = h, Se = $._payload, Je = $._init;
              try {
                return Vi(Je(Se), x, H);
              } catch {
              }
            }
          }
        return "";
      }
      var Ft = {}, Zu = _t.ReactDebugCurrentFrame;
      function At(h) {
        if (h) {
          var x = h._owner, H = Vi(h.type, h._source, x ? x.type : null);
          Zu.setExtraStackFrame(H);
        } else
          Zu.setExtraStackFrame(null);
      }
      function Wo(h, x, H, $, Se) {
        {
          var Je = Function.call.bind(xn);
          for (var be in h)
            if (Je(h, be)) {
              var nt = void 0;
              try {
                if (typeof h[be] != "function") {
                  var Tt = Error(($ || "React class") + ": " + H + " type `" + be + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[be] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Tt.name = "Invariant Violation", Tt;
                }
                nt = h[be](x, be, $, H, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (zt) {
                nt = zt;
              }
              nt && !(nt instanceof Error) && (At(Se), Pe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", $ || "React class", H, be, typeof nt), At(null)), nt instanceof Error && !(nt.message in Ft) && (Ft[nt.message] = !0, At(Se), Pe("Failed %s type: %s", H, nt.message), At(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var x = h._owner, H = Vi(h.type, h._source, x ? x.type : null);
          ue(H);
        } else
          ue(null);
      }
      var st;
      st = !1;
      function eo() {
        if (Ee.current) {
          var h = Kn(Ee.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function lr(h) {
        if (h !== void 0) {
          var x = h.fileName.replace(/^.*[\\\/]/, ""), H = h.lineNumber;
          return `

Check your code at ` + x + ":" + H + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? lr(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var x = eo();
        if (!x) {
          var H = typeof h == "string" ? h : h.displayName || h.name;
          H && (x = `

Check the top-level render call using <` + H + ">.");
        }
        return x;
      }
      function fn(h, x) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var H = yi(x);
          if (!Or[H]) {
            Or[H] = !0;
            var $ = "";
            h && h._owner && h._owner !== Ee.current && ($ = " It was passed a child from " + Kn(h._owner.type) + "."), hi(h), Pe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', H, $), hi(null);
          }
        }
      }
      function Kt(h, x) {
        if (typeof h == "object") {
          if (wn(h))
            for (var H = 0; H < h.length; H++) {
              var $ = h[H];
              hn($) && fn($, x);
            }
          else if (hn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var Se = ce(h);
            if (typeof Se == "function" && Se !== h.entries)
              for (var Je = Se.call(h), be; !(be = Je.next()).done; )
                hn(be.value) && fn(be.value, x);
          }
        }
      }
      function Sl(h) {
        {
          var x = h.type;
          if (x == null || typeof x == "string")
            return;
          var H;
          if (typeof x == "function")
            H = x.propTypes;
          else if (typeof x == "object" && (x.$$typeof === ke || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          x.$$typeof === te))
            H = x.propTypes;
          else
            return;
          if (H) {
            var $ = Kn(x);
            Wo(H, h.props, "prop", $, h);
          } else if (x.PropTypes !== void 0 && !st) {
            st = !0;
            var Se = Kn(x);
            Pe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Se || "Unknown");
          }
          typeof x.getDefaultProps == "function" && !x.getDefaultProps.isReactClassApproved && Pe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function $n(h) {
        {
          for (var x = Object.keys(h.props), H = 0; H < x.length; H++) {
            var $ = x[H];
            if ($ !== "children" && $ !== "key") {
              hi(h), Pe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", $), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Pe("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Nr(h, x, H) {
        var $ = re(h);
        if (!$) {
          var Se = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (Se += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Je = mi(x);
          Je ? Se += Je : Se += eo();
          var be;
          h === null ? be = "null" : wn(h) ? be = "array" : h !== void 0 && h.$$typeof === J ? (be = "<" + (Kn(h.type) || "Unknown") + " />", Se = " Did you accidentally export a JSX literal instead of a component?") : be = typeof h, Pe("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", be, Se);
        }
        var nt = Et.apply(this, arguments);
        if (nt == null)
          return nt;
        if ($)
          for (var Tt = 2; Tt < arguments.length; Tt++)
            Kt(arguments[Tt], h);
        return h === A ? $n(nt) : Sl(nt), nt;
      }
      var Ta = !1;
      function iu(h) {
        var x = Nr.bind(null, h);
        return x.type = h, Ta || (Ta = !0, Dt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(x, "type", {
          enumerable: !1,
          get: function() {
            return Dt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), x;
      }
      function Go(h, x, H) {
        for (var $ = rn.apply(this, arguments), Se = 2; Se < arguments.length; Se++)
          Kt(arguments[Se], $.type);
        return Sl($), $;
      }
      function qo(h, x) {
        var H = Le.transition;
        Le.transition = {};
        var $ = Le.transition;
        Le.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (Le.transition = H, H === null && $._updatedFibers) {
            var Se = $._updatedFibers.size;
            Se > 10 && Dt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), $._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function Kf(h) {
        if (lu === null)
          try {
            var x = ("require" + Math.random()).slice(0, 7), H = _ && _[x];
            lu = H.call(_, "timers").setImmediate;
          } catch {
            lu = function(Se) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && Pe("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Je = new MessageChannel();
              Je.port1.onmessage = Se, Je.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var ba = 0, Za = !1;
      function gi(h) {
        {
          var x = ba;
          ba++, he.current === null && (he.current = []);
          var H = he.isBatchingLegacy, $;
          try {
            if (he.isBatchingLegacy = !0, $ = h(), !H && he.didScheduleLegacyUpdate) {
              var Se = he.current;
              Se !== null && (he.didScheduleLegacyUpdate = !1, Cl(Se));
            }
          } catch (Ct) {
            throw _a(x), Ct;
          } finally {
            he.isBatchingLegacy = H;
          }
          if ($ !== null && typeof $ == "object" && typeof $.then == "function") {
            var Je = $, be = !1, nt = {
              then: function(Ct, Jt) {
                be = !0, Je.then(function(mn) {
                  _a(x), ba === 0 ? to(mn, Ct, Jt) : Ct(mn);
                }, function(mn) {
                  _a(x), Jt(mn);
                });
              }
            };
            return !Za && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              be || (Za = !0, Pe("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), nt;
          } else {
            var Tt = $;
            if (_a(x), ba === 0) {
              var zt = he.current;
              zt !== null && (Cl(zt), he.current = null);
              var un = {
                then: function(Ct, Jt) {
                  he.current === null ? (he.current = [], to(Tt, Ct, Jt)) : Ct(Tt);
                }
              };
              return un;
            } else {
              var Xt = {
                then: function(Ct, Jt) {
                  Ct(Tt);
                }
              };
              return Xt;
            }
          }
        }
      }
      function _a(h) {
        h !== ba - 1 && Pe("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function to(h, x, H) {
        {
          var $ = he.current;
          if ($ !== null)
            try {
              Cl($), Kf(function() {
                $.length === 0 ? (he.current = null, x(h)) : to(h, x, H);
              });
            } catch (Se) {
              H(Se);
            }
          else
            x(h);
        }
      }
      var no = !1;
      function Cl(h) {
        if (!no) {
          no = !0;
          var x = 0;
          try {
            for (; x < h.length; x++) {
              var H = h[x];
              do
                H = H(!0);
              while (H !== null);
            }
            h.length = 0;
          } catch ($) {
            throw h = h.slice(x + 1), $;
          } finally {
            no = !1;
          }
        }
      }
      var uu = Nr, ro = Go, ao = iu, ei = {
        map: Pi,
        forEach: eu,
        count: Zl,
        toArray: pl,
        only: vl
      };
      w.Children = ei, w.Component = Ae, w.Fragment = A, w.Profiler = le, w.PureComponent = gt, w.StrictMode = g, w.Suspense = Y, w.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _t, w.act = gi, w.cloneElement = ro, w.createContext = tu, w.createElement = uu, w.createFactory = ao, w.createRef = Nn, w.forwardRef = vi, w.isValidElement = hn, w.lazy = pi, w.memo = _e, w.startTransition = qo, w.unstable_act = gi, w.useCallback = ir, w.useContext = ht, w.useDebugValue = mt, w.useDeferredValue = Ka, w.useEffect = Rn, w.useId = nu, w.useImperativeHandle = qa, w.useInsertionEffect = ln, w.useLayoutEffect = cn, w.useMemo = Ga, w.useReducer = Rt, w.useRef = wt, w.useState = dt, w.useSyncExternalStore = ru, w.useTransition = St, w.version = R, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(rv, rv.exports)), rv.exports;
}
process.env.NODE_ENV === "production" ? CE.exports = ik() : CE.exports = lk();
var q = CE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lx;
function uk() {
  if (lx) return ev;
  lx = 1;
  var _ = q, w = Symbol.for("react.element"), R = Symbol.for("react.fragment"), J = Object.prototype.hasOwnProperty, Z = _.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, A = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(le, U, Q) {
    var ke, Y = {}, ee = null, te = null;
    Q !== void 0 && (ee = "" + Q), U.key !== void 0 && (ee = "" + U.key), U.ref !== void 0 && (te = U.ref);
    for (ke in U) J.call(U, ke) && !A.hasOwnProperty(ke) && (Y[ke] = U[ke]);
    if (le && le.defaultProps) for (ke in U = le.defaultProps, U) Y[ke] === void 0 && (Y[ke] = U[ke]);
    return { $$typeof: w, type: le, key: ee, ref: te, props: Y, _owner: Z.current };
  }
  return ev.Fragment = R, ev.jsx = g, ev.jsxs = g, ev;
}
var tv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ux;
function ok() {
  return ux || (ux = 1, process.env.NODE_ENV !== "production" && function() {
    var _ = q, w = Symbol.for("react.element"), R = Symbol.for("react.portal"), J = Symbol.for("react.fragment"), Z = Symbol.for("react.strict_mode"), A = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), le = Symbol.for("react.context"), U = Symbol.for("react.forward_ref"), Q = Symbol.for("react.suspense"), ke = Symbol.for("react.suspense_list"), Y = Symbol.for("react.memo"), ee = Symbol.for("react.lazy"), te = Symbol.for("react.offscreen"), ne = Symbol.iterator, K = "@@iterator";
    function Ce(T) {
      if (T === null || typeof T != "object")
        return null;
      var re = ne && T[ne] || T[K];
      return typeof re == "function" ? re : null;
    }
    var Ue = _.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ce(T) {
      {
        for (var re = arguments.length, _e = new Array(re > 1 ? re - 1 : 0), He = 1; He < re; He++)
          _e[He - 1] = arguments[He];
        ye("error", T, _e);
      }
    }
    function ye(T, re, _e) {
      {
        var He = Ue.ReactDebugCurrentFrame, ht = He.getStackAddendum();
        ht !== "" && (re += "%s", _e = _e.concat([ht]));
        var dt = _e.map(function(Rt) {
          return String(Rt);
        });
        dt.unshift("Warning: " + re), Function.prototype.apply.call(console[T], console, dt);
      }
    }
    var Le = !1, he = !1, Ee = !1, P = !1, fe = !1, ue;
    ue = Symbol.for("react.module.reference");
    function xe(T) {
      return !!(typeof T == "string" || typeof T == "function" || T === J || T === A || fe || T === Z || T === Q || T === ke || P || T === te || Le || he || Ee || typeof T == "object" && T !== null && (T.$$typeof === ee || T.$$typeof === Y || T.$$typeof === g || T.$$typeof === le || T.$$typeof === U || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      T.$$typeof === ue || T.getModuleId !== void 0));
    }
    function Ve(T, re, _e) {
      var He = T.displayName;
      if (He)
        return He;
      var ht = re.displayName || re.name || "";
      return ht !== "" ? _e + "(" + ht + ")" : _e;
    }
    function et(T) {
      return T.displayName || "Context";
    }
    function Re(T) {
      if (T == null)
        return null;
      if (typeof T.tag == "number" && ce("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof T == "function")
        return T.displayName || T.name || null;
      if (typeof T == "string")
        return T;
      switch (T) {
        case J:
          return "Fragment";
        case R:
          return "Portal";
        case A:
          return "Profiler";
        case Z:
          return "StrictMode";
        case Q:
          return "Suspense";
        case ke:
          return "SuspenseList";
      }
      if (typeof T == "object")
        switch (T.$$typeof) {
          case le:
            var re = T;
            return et(re) + ".Consumer";
          case g:
            var _e = T;
            return et(_e._context) + ".Provider";
          case U:
            return Ve(T, T.render, "ForwardRef");
          case Y:
            var He = T.displayName || null;
            return He !== null ? He : Re(T.type) || "Memo";
          case ee: {
            var ht = T, dt = ht._payload, Rt = ht._init;
            try {
              return Re(Rt(dt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var bt = Object.assign, _t = 0, Dt, Pe, me, ge, ve, b, I;
    function Qe() {
    }
    Qe.__reactDisabledLog = !0;
    function Ae() {
      {
        if (_t === 0) {
          Dt = console.log, Pe = console.info, me = console.warn, ge = console.error, ve = console.group, b = console.groupCollapsed, I = console.groupEnd;
          var T = {
            configurable: !0,
            enumerable: !0,
            value: Qe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: T,
            log: T,
            warn: T,
            error: T,
            group: T,
            groupCollapsed: T,
            groupEnd: T
          });
        }
        _t++;
      }
    }
    function at() {
      {
        if (_t--, _t === 0) {
          var T = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: bt({}, T, {
              value: Dt
            }),
            info: bt({}, T, {
              value: Pe
            }),
            warn: bt({}, T, {
              value: me
            }),
            error: bt({}, T, {
              value: ge
            }),
            group: bt({}, T, {
              value: ve
            }),
            groupCollapsed: bt({}, T, {
              value: b
            }),
            groupEnd: bt({}, T, {
              value: I
            })
          });
        }
        _t < 0 && ce("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ut = Ue.ReactCurrentDispatcher, ct;
    function ft(T, re, _e) {
      {
        if (ct === void 0)
          try {
            throw Error();
          } catch (ht) {
            var He = ht.stack.trim().match(/\n( *(at )?)/);
            ct = He && He[1] || "";
          }
        return `
` + ct + T;
      }
    }
    var gt = !1, Wt;
    {
      var Nn = typeof WeakMap == "function" ? WeakMap : Map;
      Wt = new Nn();
    }
    function br(T, re) {
      if (!T || gt)
        return "";
      {
        var _e = Wt.get(T);
        if (_e !== void 0)
          return _e;
      }
      var He;
      gt = !0;
      var ht = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var dt;
      dt = ut.current, ut.current = null, Ae();
      try {
        if (re) {
          var Rt = function() {
            throw Error();
          };
          if (Object.defineProperty(Rt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Rt, []);
            } catch (mt) {
              He = mt;
            }
            Reflect.construct(T, [], Rt);
          } else {
            try {
              Rt.call();
            } catch (mt) {
              He = mt;
            }
            T.call(Rt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (mt) {
            He = mt;
          }
          T();
        }
      } catch (mt) {
        if (mt && He && typeof mt.stack == "string") {
          for (var wt = mt.stack.split(`
`), Rn = He.stack.split(`
`), ln = wt.length - 1, cn = Rn.length - 1; ln >= 1 && cn >= 0 && wt[ln] !== Rn[cn]; )
            cn--;
          for (; ln >= 1 && cn >= 0; ln--, cn--)
            if (wt[ln] !== Rn[cn]) {
              if (ln !== 1 || cn !== 1)
                do
                  if (ln--, cn--, cn < 0 || wt[ln] !== Rn[cn]) {
                    var ir = `
` + wt[ln].replace(" at new ", " at ");
                    return T.displayName && ir.includes("<anonymous>") && (ir = ir.replace("<anonymous>", T.displayName)), typeof T == "function" && Wt.set(T, ir), ir;
                  }
                while (ln >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        gt = !1, ut.current = dt, at(), Error.prepareStackTrace = ht;
      }
      var Ga = T ? T.displayName || T.name : "", qa = Ga ? ft(Ga) : "";
      return typeof T == "function" && Wt.set(T, qa), qa;
    }
    function wn(T, re, _e) {
      return br(T, !1);
    }
    function rr(T) {
      var re = T.prototype;
      return !!(re && re.isReactComponent);
    }
    function Bn(T, re, _e) {
      if (T == null)
        return "";
      if (typeof T == "function")
        return br(T, rr(T));
      if (typeof T == "string")
        return ft(T);
      switch (T) {
        case Q:
          return ft("Suspense");
        case ke:
          return ft("SuspenseList");
      }
      if (typeof T == "object")
        switch (T.$$typeof) {
          case U:
            return wn(T.render);
          case Y:
            return Bn(T.type, re, _e);
          case ee: {
            var He = T, ht = He._payload, dt = He._init;
            try {
              return Bn(dt(ht), re, _e);
            } catch {
            }
          }
        }
      return "";
    }
    var In = Object.prototype.hasOwnProperty, $r = {}, ci = Ue.ReactDebugCurrentFrame;
    function sa(T) {
      if (T) {
        var re = T._owner, _e = Bn(T.type, T._source, re ? re.type : null);
        ci.setExtraStackFrame(_e);
      } else
        ci.setExtraStackFrame(null);
    }
    function Kn(T, re, _e, He, ht) {
      {
        var dt = Function.call.bind(In);
        for (var Rt in T)
          if (dt(T, Rt)) {
            var wt = void 0;
            try {
              if (typeof T[Rt] != "function") {
                var Rn = Error((He || "React class") + ": " + _e + " type `" + Rt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof T[Rt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Rn.name = "Invariant Violation", Rn;
              }
              wt = T[Rt](re, Rt, He, _e, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ln) {
              wt = ln;
            }
            wt && !(wt instanceof Error) && (sa(ht), ce("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", He || "React class", _e, Rt, typeof wt), sa(null)), wt instanceof Error && !(wt.message in $r) && ($r[wt.message] = !0, sa(ht), ce("Failed %s type: %s", _e, wt.message), sa(null));
          }
      }
    }
    var xn = Array.isArray;
    function Yn(T) {
      return xn(T);
    }
    function Sr(T) {
      {
        var re = typeof Symbol == "function" && Symbol.toStringTag, _e = re && T[Symbol.toStringTag] || T.constructor.name || "Object";
        return _e;
      }
    }
    function $a(T) {
      try {
        return Ln(T), !1;
      } catch {
        return !0;
      }
    }
    function Ln(T) {
      return "" + T;
    }
    function Er(T) {
      if ($a(T))
        return ce("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Sr(T)), Ln(T);
    }
    var ca = Ue.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, we;
    function We(T) {
      if (In.call(T, "ref")) {
        var re = Object.getOwnPropertyDescriptor(T, "ref").get;
        if (re && re.isReactWarning)
          return !1;
      }
      return T.ref !== void 0;
    }
    function Et(T) {
      if (In.call(T, "key")) {
        var re = Object.getOwnPropertyDescriptor(T, "key").get;
        if (re && re.isReactWarning)
          return !1;
      }
      return T.key !== void 0;
    }
    function Yt(T, re) {
      typeof T.ref == "string" && ca.current;
    }
    function rn(T, re) {
      {
        var _e = function() {
          fi || (fi = !0, ce("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", re));
        };
        _e.isReactWarning = !0, Object.defineProperty(T, "key", {
          get: _e,
          configurable: !0
        });
      }
    }
    function hn(T, re) {
      {
        var _e = function() {
          we || (we = !0, ce("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", re));
        };
        _e.isReactWarning = !0, Object.defineProperty(T, "ref", {
          get: _e,
          configurable: !0
        });
      }
    }
    var sn = function(T, re, _e, He, ht, dt, Rt) {
      var wt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: w,
        // Built-in properties that belong on the element
        type: T,
        key: re,
        ref: _e,
        props: Rt,
        // Record the component responsible for creating this element.
        _owner: dt
      };
      return wt._store = {}, Object.defineProperty(wt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(wt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: He
      }), Object.defineProperty(wt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ht
      }), Object.freeze && (Object.freeze(wt.props), Object.freeze(wt)), wt;
    };
    function Xn(T, re, _e, He, ht) {
      {
        var dt, Rt = {}, wt = null, Rn = null;
        _e !== void 0 && (Er(_e), wt = "" + _e), Et(re) && (Er(re.key), wt = "" + re.key), We(re) && (Rn = re.ref, Yt(re, ht));
        for (dt in re)
          In.call(re, dt) && !Qa.hasOwnProperty(dt) && (Rt[dt] = re[dt]);
        if (T && T.defaultProps) {
          var ln = T.defaultProps;
          for (dt in ln)
            Rt[dt] === void 0 && (Rt[dt] = ln[dt]);
        }
        if (wt || Rn) {
          var cn = typeof T == "function" ? T.displayName || T.name || "Unknown" : T;
          wt && rn(Rt, cn), Rn && hn(Rt, cn);
        }
        return sn(T, wt, Rn, ht, He, ca.current, Rt);
      }
    }
    var an = Ue.ReactCurrentOwner, Gt = Ue.ReactDebugCurrentFrame;
    function qt(T) {
      if (T) {
        var re = T._owner, _e = Bn(T.type, T._source, re ? re.type : null);
        Gt.setExtraStackFrame(_e);
      } else
        Gt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Cr(T) {
      return typeof T == "object" && T !== null && T.$$typeof === w;
    }
    function Ra() {
      {
        if (an.current) {
          var T = Re(an.current.type);
          if (T)
            return `

Check the render method of \`` + T + "`.";
        }
        return "";
      }
    }
    function Pi(T) {
      return "";
    }
    var Zl = {};
    function eu(T) {
      {
        var re = Ra();
        if (!re) {
          var _e = typeof T == "string" ? T : T.displayName || T.name;
          _e && (re = `

Check the top-level render call using <` + _e + ">.");
        }
        return re;
      }
    }
    function pl(T, re) {
      {
        if (!T._store || T._store.validated || T.key != null)
          return;
        T._store.validated = !0;
        var _e = eu(re);
        if (Zl[_e])
          return;
        Zl[_e] = !0;
        var He = "";
        T && T._owner && T._owner !== an.current && (He = " It was passed a child from " + Re(T._owner.type) + "."), qt(T), ce('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', _e, He), qt(null);
      }
    }
    function vl(T, re) {
      {
        if (typeof T != "object")
          return;
        if (Yn(T))
          for (var _e = 0; _e < T.length; _e++) {
            var He = T[_e];
            Cr(He) && pl(He, re);
          }
        else if (Cr(T))
          T._store && (T._store.validated = !0);
        else if (T) {
          var ht = Ce(T);
          if (typeof ht == "function" && ht !== T.entries)
            for (var dt = ht.call(T), Rt; !(Rt = dt.next()).done; )
              Cr(Rt.value) && pl(Rt.value, re);
        }
      }
    }
    function tu(T) {
      {
        var re = T.type;
        if (re == null || typeof re == "string")
          return;
        var _e;
        if (typeof re == "function")
          _e = re.propTypes;
        else if (typeof re == "object" && (re.$$typeof === U || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        re.$$typeof === Y))
          _e = re.propTypes;
        else
          return;
        if (_e) {
          var He = Re(re);
          Kn(_e, T.props, "prop", He, T);
        } else if (re.PropTypes !== void 0 && !fa) {
          fa = !0;
          var ht = Re(re);
          ce("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ht || "Unknown");
        }
        typeof re.getDefaultProps == "function" && !re.getDefaultProps.isReactClassApproved && ce("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(T) {
      {
        for (var re = Object.keys(T.props), _e = 0; _e < re.length; _e++) {
          var He = re[_e];
          if (He !== "children" && He !== "key") {
            qt(T), ce("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", He), qt(null);
            break;
          }
        }
        T.ref !== null && (qt(T), ce("Invalid attribute `ref` supplied to `React.Fragment`."), qt(null));
      }
    }
    var kr = {};
    function ar(T, re, _e, He, ht, dt) {
      {
        var Rt = xe(T);
        if (!Rt) {
          var wt = "";
          (T === void 0 || typeof T == "object" && T !== null && Object.keys(T).length === 0) && (wt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Rn = Pi();
          Rn ? wt += Rn : wt += Ra();
          var ln;
          T === null ? ln = "null" : Yn(T) ? ln = "array" : T !== void 0 && T.$$typeof === w ? (ln = "<" + (Re(T.type) || "Unknown") + " />", wt = " Did you accidentally export a JSX literal instead of a component?") : ln = typeof T, ce("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ln, wt);
        }
        var cn = Xn(T, re, _e, ht, dt);
        if (cn == null)
          return cn;
        if (Rt) {
          var ir = re.children;
          if (ir !== void 0)
            if (He)
              if (Yn(ir)) {
                for (var Ga = 0; Ga < ir.length; Ga++)
                  vl(ir[Ga], T);
                Object.freeze && Object.freeze(ir);
              } else
                ce("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ir, T);
        }
        if (In.call(re, "key")) {
          var qa = Re(T), mt = Object.keys(re).filter(function(nu) {
            return nu !== "key";
          }), St = mt.length > 0 ? "{key: someKey, " + mt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kr[qa + St]) {
            var Ka = mt.length > 0 ? "{" + mt.join(": ..., ") + ": ...}" : "{}";
            ce(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, St, qa, Ka, qa), kr[qa + St] = !0;
          }
        }
        return T === J ? _r(cn) : tu(cn), cn;
      }
    }
    function di(T, re, _e) {
      return ar(T, re, _e, !0);
    }
    function Wa(T, re, _e) {
      return ar(T, re, _e, !1);
    }
    var pi = Wa, vi = di;
    tv.Fragment = J, tv.jsx = pi, tv.jsxs = vi;
  }()), tv;
}
process.env.NODE_ENV === "production" ? EE.exports = uk() : EE.exports = ok();
var E = EE.exports, wE = { exports: {} }, Ia = {}, qm = { exports: {} }, yE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ox;
function sk() {
  return ox || (ox = 1, function(_) {
    function w(me, ge) {
      var ve = me.length;
      me.push(ge);
      e: for (; 0 < ve; ) {
        var b = ve - 1 >>> 1, I = me[b];
        if (0 < Z(I, ge)) me[b] = ge, me[ve] = I, ve = b;
        else break e;
      }
    }
    function R(me) {
      return me.length === 0 ? null : me[0];
    }
    function J(me) {
      if (me.length === 0) return null;
      var ge = me[0], ve = me.pop();
      if (ve !== ge) {
        me[0] = ve;
        e: for (var b = 0, I = me.length, Qe = I >>> 1; b < Qe; ) {
          var Ae = 2 * (b + 1) - 1, at = me[Ae], ut = Ae + 1, ct = me[ut];
          if (0 > Z(at, ve)) ut < I && 0 > Z(ct, at) ? (me[b] = ct, me[ut] = ve, b = ut) : (me[b] = at, me[Ae] = ve, b = Ae);
          else if (ut < I && 0 > Z(ct, ve)) me[b] = ct, me[ut] = ve, b = ut;
          else break e;
        }
      }
      return ge;
    }
    function Z(me, ge) {
      var ve = me.sortIndex - ge.sortIndex;
      return ve !== 0 ? ve : me.id - ge.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var A = performance;
      _.unstable_now = function() {
        return A.now();
      };
    } else {
      var g = Date, le = g.now();
      _.unstable_now = function() {
        return g.now() - le;
      };
    }
    var U = [], Q = [], ke = 1, Y = null, ee = 3, te = !1, ne = !1, K = !1, Ce = typeof setTimeout == "function" ? setTimeout : null, Ue = typeof clearTimeout == "function" ? clearTimeout : null, ce = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ye(me) {
      for (var ge = R(Q); ge !== null; ) {
        if (ge.callback === null) J(Q);
        else if (ge.startTime <= me) J(Q), ge.sortIndex = ge.expirationTime, w(U, ge);
        else break;
        ge = R(Q);
      }
    }
    function Le(me) {
      if (K = !1, ye(me), !ne) if (R(U) !== null) ne = !0, Dt(he);
      else {
        var ge = R(Q);
        ge !== null && Pe(Le, ge.startTime - me);
      }
    }
    function he(me, ge) {
      ne = !1, K && (K = !1, Ue(fe), fe = -1), te = !0;
      var ve = ee;
      try {
        for (ye(ge), Y = R(U); Y !== null && (!(Y.expirationTime > ge) || me && !Ve()); ) {
          var b = Y.callback;
          if (typeof b == "function") {
            Y.callback = null, ee = Y.priorityLevel;
            var I = b(Y.expirationTime <= ge);
            ge = _.unstable_now(), typeof I == "function" ? Y.callback = I : Y === R(U) && J(U), ye(ge);
          } else J(U);
          Y = R(U);
        }
        if (Y !== null) var Qe = !0;
        else {
          var Ae = R(Q);
          Ae !== null && Pe(Le, Ae.startTime - ge), Qe = !1;
        }
        return Qe;
      } finally {
        Y = null, ee = ve, te = !1;
      }
    }
    var Ee = !1, P = null, fe = -1, ue = 5, xe = -1;
    function Ve() {
      return !(_.unstable_now() - xe < ue);
    }
    function et() {
      if (P !== null) {
        var me = _.unstable_now();
        xe = me;
        var ge = !0;
        try {
          ge = P(!0, me);
        } finally {
          ge ? Re() : (Ee = !1, P = null);
        }
      } else Ee = !1;
    }
    var Re;
    if (typeof ce == "function") Re = function() {
      ce(et);
    };
    else if (typeof MessageChannel < "u") {
      var bt = new MessageChannel(), _t = bt.port2;
      bt.port1.onmessage = et, Re = function() {
        _t.postMessage(null);
      };
    } else Re = function() {
      Ce(et, 0);
    };
    function Dt(me) {
      P = me, Ee || (Ee = !0, Re());
    }
    function Pe(me, ge) {
      fe = Ce(function() {
        me(_.unstable_now());
      }, ge);
    }
    _.unstable_IdlePriority = 5, _.unstable_ImmediatePriority = 1, _.unstable_LowPriority = 4, _.unstable_NormalPriority = 3, _.unstable_Profiling = null, _.unstable_UserBlockingPriority = 2, _.unstable_cancelCallback = function(me) {
      me.callback = null;
    }, _.unstable_continueExecution = function() {
      ne || te || (ne = !0, Dt(he));
    }, _.unstable_forceFrameRate = function(me) {
      0 > me || 125 < me ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ue = 0 < me ? Math.floor(1e3 / me) : 5;
    }, _.unstable_getCurrentPriorityLevel = function() {
      return ee;
    }, _.unstable_getFirstCallbackNode = function() {
      return R(U);
    }, _.unstable_next = function(me) {
      switch (ee) {
        case 1:
        case 2:
        case 3:
          var ge = 3;
          break;
        default:
          ge = ee;
      }
      var ve = ee;
      ee = ge;
      try {
        return me();
      } finally {
        ee = ve;
      }
    }, _.unstable_pauseExecution = function() {
    }, _.unstable_requestPaint = function() {
    }, _.unstable_runWithPriority = function(me, ge) {
      switch (me) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          me = 3;
      }
      var ve = ee;
      ee = me;
      try {
        return ge();
      } finally {
        ee = ve;
      }
    }, _.unstable_scheduleCallback = function(me, ge, ve) {
      var b = _.unstable_now();
      switch (typeof ve == "object" && ve !== null ? (ve = ve.delay, ve = typeof ve == "number" && 0 < ve ? b + ve : b) : ve = b, me) {
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
      return I = ve + I, me = { id: ke++, callback: ge, priorityLevel: me, startTime: ve, expirationTime: I, sortIndex: -1 }, ve > b ? (me.sortIndex = ve, w(Q, me), R(U) === null && me === R(Q) && (K ? (Ue(fe), fe = -1) : K = !0, Pe(Le, ve - b))) : (me.sortIndex = I, w(U, me), ne || te || (ne = !0, Dt(he))), me;
    }, _.unstable_shouldYield = Ve, _.unstable_wrapCallback = function(me) {
      var ge = ee;
      return function() {
        var ve = ee;
        ee = ge;
        try {
          return me.apply(this, arguments);
        } finally {
          ee = ve;
        }
      };
    };
  }(yE)), yE;
}
var gE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sx;
function ck() {
  return sx || (sx = 1, function(_) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var w = !1, R = 5;
      function J(we, We) {
        var Et = we.length;
        we.push(We), g(we, We, Et);
      }
      function Z(we) {
        return we.length === 0 ? null : we[0];
      }
      function A(we) {
        if (we.length === 0)
          return null;
        var We = we[0], Et = we.pop();
        return Et !== We && (we[0] = Et, le(we, Et, 0)), We;
      }
      function g(we, We, Et) {
        for (var Yt = Et; Yt > 0; ) {
          var rn = Yt - 1 >>> 1, hn = we[rn];
          if (U(hn, We) > 0)
            we[rn] = We, we[Yt] = hn, Yt = rn;
          else
            return;
        }
      }
      function le(we, We, Et) {
        for (var Yt = Et, rn = we.length, hn = rn >>> 1; Yt < hn; ) {
          var sn = (Yt + 1) * 2 - 1, Xn = we[sn], an = sn + 1, Gt = we[an];
          if (U(Xn, We) < 0)
            an < rn && U(Gt, Xn) < 0 ? (we[Yt] = Gt, we[an] = We, Yt = an) : (we[Yt] = Xn, we[sn] = We, Yt = sn);
          else if (an < rn && U(Gt, We) < 0)
            we[Yt] = Gt, we[an] = We, Yt = an;
          else
            return;
        }
      }
      function U(we, We) {
        var Et = we.sortIndex - We.sortIndex;
        return Et !== 0 ? Et : we.id - We.id;
      }
      var Q = 1, ke = 2, Y = 3, ee = 4, te = 5;
      function ne(we, We) {
      }
      var K = typeof performance == "object" && typeof performance.now == "function";
      if (K) {
        var Ce = performance;
        _.unstable_now = function() {
          return Ce.now();
        };
      } else {
        var Ue = Date, ce = Ue.now();
        _.unstable_now = function() {
          return Ue.now() - ce;
        };
      }
      var ye = 1073741823, Le = -1, he = 250, Ee = 5e3, P = 1e4, fe = ye, ue = [], xe = [], Ve = 1, et = null, Re = Y, bt = !1, _t = !1, Dt = !1, Pe = typeof setTimeout == "function" ? setTimeout : null, me = typeof clearTimeout == "function" ? clearTimeout : null, ge = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ve(we) {
        for (var We = Z(xe); We !== null; ) {
          if (We.callback === null)
            A(xe);
          else if (We.startTime <= we)
            A(xe), We.sortIndex = We.expirationTime, J(ue, We);
          else
            return;
          We = Z(xe);
        }
      }
      function b(we) {
        if (Dt = !1, ve(we), !_t)
          if (Z(ue) !== null)
            _t = !0, Ln(I);
          else {
            var We = Z(xe);
            We !== null && Er(b, We.startTime - we);
          }
      }
      function I(we, We) {
        _t = !1, Dt && (Dt = !1, ca()), bt = !0;
        var Et = Re;
        try {
          var Yt;
          if (!w) return Qe(we, We);
        } finally {
          et = null, Re = Et, bt = !1;
        }
      }
      function Qe(we, We) {
        var Et = We;
        for (ve(Et), et = Z(ue); et !== null && !(et.expirationTime > Et && (!we || ci())); ) {
          var Yt = et.callback;
          if (typeof Yt == "function") {
            et.callback = null, Re = et.priorityLevel;
            var rn = et.expirationTime <= Et, hn = Yt(rn);
            Et = _.unstable_now(), typeof hn == "function" ? et.callback = hn : et === Z(ue) && A(ue), ve(Et);
          } else
            A(ue);
          et = Z(ue);
        }
        if (et !== null)
          return !0;
        var sn = Z(xe);
        return sn !== null && Er(b, sn.startTime - Et), !1;
      }
      function Ae(we, We) {
        switch (we) {
          case Q:
          case ke:
          case Y:
          case ee:
          case te:
            break;
          default:
            we = Y;
        }
        var Et = Re;
        Re = we;
        try {
          return We();
        } finally {
          Re = Et;
        }
      }
      function at(we) {
        var We;
        switch (Re) {
          case Q:
          case ke:
          case Y:
            We = Y;
            break;
          default:
            We = Re;
            break;
        }
        var Et = Re;
        Re = We;
        try {
          return we();
        } finally {
          Re = Et;
        }
      }
      function ut(we) {
        var We = Re;
        return function() {
          var Et = Re;
          Re = We;
          try {
            return we.apply(this, arguments);
          } finally {
            Re = Et;
          }
        };
      }
      function ct(we, We, Et) {
        var Yt = _.unstable_now(), rn;
        if (typeof Et == "object" && Et !== null) {
          var hn = Et.delay;
          typeof hn == "number" && hn > 0 ? rn = Yt + hn : rn = Yt;
        } else
          rn = Yt;
        var sn;
        switch (we) {
          case Q:
            sn = Le;
            break;
          case ke:
            sn = he;
            break;
          case te:
            sn = fe;
            break;
          case ee:
            sn = P;
            break;
          case Y:
          default:
            sn = Ee;
            break;
        }
        var Xn = rn + sn, an = {
          id: Ve++,
          callback: We,
          priorityLevel: we,
          startTime: rn,
          expirationTime: Xn,
          sortIndex: -1
        };
        return rn > Yt ? (an.sortIndex = rn, J(xe, an), Z(ue) === null && an === Z(xe) && (Dt ? ca() : Dt = !0, Er(b, rn - Yt))) : (an.sortIndex = Xn, J(ue, an), !_t && !bt && (_t = !0, Ln(I))), an;
      }
      function ft() {
      }
      function gt() {
        !_t && !bt && (_t = !0, Ln(I));
      }
      function Wt() {
        return Z(ue);
      }
      function Nn(we) {
        we.callback = null;
      }
      function br() {
        return Re;
      }
      var wn = !1, rr = null, Bn = -1, In = R, $r = -1;
      function ci() {
        var we = _.unstable_now() - $r;
        return !(we < In);
      }
      function sa() {
      }
      function Kn(we) {
        if (we < 0 || we > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        we > 0 ? In = Math.floor(1e3 / we) : In = R;
      }
      var xn = function() {
        if (rr !== null) {
          var we = _.unstable_now();
          $r = we;
          var We = !0, Et = !0;
          try {
            Et = rr(We, we);
          } finally {
            Et ? Yn() : (wn = !1, rr = null);
          }
        } else
          wn = !1;
      }, Yn;
      if (typeof ge == "function")
        Yn = function() {
          ge(xn);
        };
      else if (typeof MessageChannel < "u") {
        var Sr = new MessageChannel(), $a = Sr.port2;
        Sr.port1.onmessage = xn, Yn = function() {
          $a.postMessage(null);
        };
      } else
        Yn = function() {
          Pe(xn, 0);
        };
      function Ln(we) {
        rr = we, wn || (wn = !0, Yn());
      }
      function Er(we, We) {
        Bn = Pe(function() {
          we(_.unstable_now());
        }, We);
      }
      function ca() {
        me(Bn), Bn = -1;
      }
      var Qa = sa, fi = null;
      _.unstable_IdlePriority = te, _.unstable_ImmediatePriority = Q, _.unstable_LowPriority = ee, _.unstable_NormalPriority = Y, _.unstable_Profiling = fi, _.unstable_UserBlockingPriority = ke, _.unstable_cancelCallback = Nn, _.unstable_continueExecution = gt, _.unstable_forceFrameRate = Kn, _.unstable_getCurrentPriorityLevel = br, _.unstable_getFirstCallbackNode = Wt, _.unstable_next = at, _.unstable_pauseExecution = ft, _.unstable_requestPaint = Qa, _.unstable_runWithPriority = Ae, _.unstable_scheduleCallback = ct, _.unstable_shouldYield = ci, _.unstable_wrapCallback = ut, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(gE)), gE;
}
var cx;
function hx() {
  return cx || (cx = 1, process.env.NODE_ENV === "production" ? qm.exports = sk() : qm.exports = ck()), qm.exports;
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
var fx;
function fk() {
  if (fx) return Ia;
  fx = 1;
  var _ = q, w = hx();
  function R(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var J = /* @__PURE__ */ new Set(), Z = {};
  function A(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (Z[n] = r, n = 0; n < r.length; n++) J.add(r[n]);
  }
  var le = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), U = Object.prototype.hasOwnProperty, Q = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ke = {}, Y = {};
  function ee(n) {
    return U.call(Y, n) ? !0 : U.call(ke, n) ? !1 : Q.test(n) ? Y[n] = !0 : (ke[n] = !0, !1);
  }
  function te(n, r, l, o) {
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
  function ne(n, r, l, o) {
    if (r === null || typeof r > "u" || te(n, r, l, o)) return !0;
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
  function K(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var Ce = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Ce[n] = new K(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Ce[r] = new K(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Ce[n] = new K(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Ce[n] = new K(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Ce[n] = new K(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Ce[n] = new K(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Ce[n] = new K(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Ce[n] = new K(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Ce[n] = new K(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Ue = /[\-:]([a-z])/g;
  function ce(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Ue,
      ce
    );
    Ce[r] = new K(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Ue, ce);
    Ce[r] = new K(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Ue, ce);
    Ce[r] = new K(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Ce[n] = new K(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Ce.xlinkHref = new K("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Ce[n] = new K(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ye(n, r, l, o) {
    var c = Ce.hasOwnProperty(r) ? Ce[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ne(r, l, c, o) && (l = null), o || c === null ? ee(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var Le = _.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, he = Symbol.for("react.element"), Ee = Symbol.for("react.portal"), P = Symbol.for("react.fragment"), fe = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), xe = Symbol.for("react.provider"), Ve = Symbol.for("react.context"), et = Symbol.for("react.forward_ref"), Re = Symbol.for("react.suspense"), bt = Symbol.for("react.suspense_list"), _t = Symbol.for("react.memo"), Dt = Symbol.for("react.lazy"), Pe = Symbol.for("react.offscreen"), me = Symbol.iterator;
  function ge(n) {
    return n === null || typeof n != "object" ? null : (n = me && n[me] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ve = Object.assign, b;
  function I(n) {
    if (b === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      b = r && r[1] || "";
    }
    return `
` + b + n;
  }
  var Qe = !1;
  function Ae(n, r) {
    if (!n || Qe) return "";
    Qe = !0;
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
        } catch (V) {
          var o = V;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (V) {
          o = V;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (V) {
          o = V;
        }
        n();
      }
    } catch (V) {
      if (V && o && typeof V.stack == "string") {
        for (var c = V.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, C = d.length - 1; 1 <= m && 0 <= C && c[m] !== d[C]; ) C--;
        for (; 1 <= m && 0 <= C; m--, C--) if (c[m] !== d[C]) {
          if (m !== 1 || C !== 1)
            do
              if (m--, C--, 0 > C || c[m] !== d[C]) {
                var k = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", n.displayName)), k;
              }
            while (1 <= m && 0 <= C);
          break;
        }
      }
    } finally {
      Qe = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? I(n) : "";
  }
  function at(n) {
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
        return n = Ae(n.type, !1), n;
      case 11:
        return n = Ae(n.type.render, !1), n;
      case 1:
        return n = Ae(n.type, !0), n;
      default:
        return "";
    }
  }
  function ut(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case P:
        return "Fragment";
      case Ee:
        return "Portal";
      case ue:
        return "Profiler";
      case fe:
        return "StrictMode";
      case Re:
        return "Suspense";
      case bt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Ve:
        return (n.displayName || "Context") + ".Consumer";
      case xe:
        return (n._context.displayName || "Context") + ".Provider";
      case et:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case _t:
        return r = n.displayName || null, r !== null ? r : ut(n.type) || "Memo";
      case Dt:
        r = n._payload, n = n._init;
        try {
          return ut(n(r));
        } catch {
        }
    }
    return null;
  }
  function ct(n) {
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
        return ut(r);
      case 8:
        return r === fe ? "StrictMode" : "Mode";
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
  function ft(n) {
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
  function gt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Wt(n) {
    var r = gt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
    n._valueTracker || (n._valueTracker = Wt(n));
  }
  function br(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = gt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function wn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function rr(n, r) {
    var l = r.checked;
    return ve({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Bn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = ft(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function In(n, r) {
    r = r.checked, r != null && ye(n, "checked", r, !1);
  }
  function $r(n, r) {
    In(n, r);
    var l = ft(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, ft(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
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
    (r !== "number" || wn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Kn = Array.isArray;
  function xn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + ft(l), r = null, c = 0; c < n.length; c++) {
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
    if (r.dangerouslySetInnerHTML != null) throw Error(R(91));
    return ve({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Sr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(R(92));
        if (Kn(l)) {
          if (1 < l.length) throw Error(R(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: ft(l) };
  }
  function $a(n, r) {
    var l = ft(r.value), o = ft(r.defaultValue);
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
  function we(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var We = {
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
  }, Et = ["Webkit", "ms", "Moz", "O"];
  Object.keys(We).forEach(function(n) {
    Et.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), We[r] = We[n];
    });
  });
  function Yt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || We.hasOwnProperty(n) && We[n] ? ("" + r).trim() : r + "px";
  }
  function rn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Yt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var hn = ve({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (hn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(R(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(R(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(R(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(R(62));
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
  function Ra(n) {
    if (n = Ke(n)) {
      if (typeof qt != "function") throw Error(R(280));
      var r = n.stateNode;
      r && (r = yn(r), qt(n.stateNode, n.type, r));
    }
  }
  function Pi(n) {
    fa ? Cr ? Cr.push(n) : Cr = [n] : fa = n;
  }
  function Zl() {
    if (fa) {
      var n = fa, r = Cr;
      if (Cr = fa = null, Ra(n), r) for (n = 0; n < r.length; n++) Ra(r[n]);
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
    if (l && typeof l != "function") throw Error(R(231, r, typeof l));
    return l;
  }
  var kr = !1;
  if (le) try {
    var ar = {};
    Object.defineProperty(ar, "passive", { get: function() {
      kr = !0;
    } }), window.addEventListener("test", ar, ar), window.removeEventListener("test", ar, ar);
  } catch {
    kr = !1;
  }
  function di(n, r, l, o, c, d, m, C, k) {
    var V = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, V);
    } catch (oe) {
      this.onError(oe);
    }
  }
  var Wa = !1, pi = null, vi = !1, T = null, re = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function _e(n, r, l, o, c, d, m, C, k) {
    Wa = !1, pi = null, di.apply(re, arguments);
  }
  function He(n, r, l, o, c, d, m, C, k) {
    if (_e.apply(this, arguments), Wa) {
      if (Wa) {
        var V = pi;
        Wa = !1, pi = null;
      } else throw Error(R(198));
      vi || (vi = !0, T = V);
    }
  }
  function ht(n) {
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
  function dt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Rt(n) {
    if (ht(n) !== n) throw Error(R(188));
  }
  function wt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = ht(n), r === null) throw Error(R(188));
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
          if (d === l) return Rt(c), n;
          if (d === o) return Rt(c), r;
          d = d.sibling;
        }
        throw Error(R(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, C = c.child; C; ) {
          if (C === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (C === o) {
            m = !0, o = c, l = d;
            break;
          }
          C = C.sibling;
        }
        if (!m) {
          for (C = d.child; C; ) {
            if (C === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (C === o) {
              m = !0, o = d, l = c;
              break;
            }
            C = C.sibling;
          }
          if (!m) throw Error(R(189));
        }
      }
      if (l.alternate !== o) throw Error(R(190));
    }
    if (l.tag !== 3) throw Error(R(188));
    return l.stateNode.current === l ? n : r;
  }
  function Rn(n) {
    return n = wt(n), n !== null ? ln(n) : null;
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
  var cn = w.unstable_scheduleCallback, ir = w.unstable_cancelCallback, Ga = w.unstable_shouldYield, qa = w.unstable_requestPaint, mt = w.unstable_now, St = w.unstable_getCurrentPriorityLevel, Ka = w.unstable_ImmediatePriority, nu = w.unstable_UserBlockingPriority, ru = w.unstable_NormalPriority, hl = w.unstable_LowPriority, Gu = w.unstable_IdlePriority, ml = null, Qr = null;
  function Qo(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dr = Math.clz32 ? Math.clz32 : qu, uc = Math.log, oc = Math.LN2;
  function qu(n) {
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
      var C = m & ~c;
      C !== 0 ? o = Xa(C) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Dr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Ku(n, r) {
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
      var m = 31 - Dr(d), C = 1 << m, k = c[m];
      k === -1 ? (!(C & l) || C & o) && (c[m] = Ku(C, r)) : k <= r && (n.expiredLanes |= C), d &= ~C;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Xu() {
    var n = yl;
    return yl <<= 1, !(yl & 4194240) && (yl = 64), n;
  }
  function Ju(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Hi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Dr(r), n[r] = l;
  }
  function qf(n, r) {
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
  var Ft = 0;
  function Zu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var At, Wo, hi, st, eo, lr = !1, mi = [], Or = null, yi = null, fn = null, Kt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), $n = [], Nr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ta(n, r) {
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
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Ke(r), r !== null && Wo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Go(n, r, l, o, c) {
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
  function qo(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = ht(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = dt(l), r !== null) {
            n.blockedOn = r, eo(n.priority, function() {
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
      var l = ro(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        an = o, l.target.dispatchEvent(o), an = null;
      } else return r = Ke(l), r !== null && Wo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function Kf() {
    lr = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), fn !== null && El(fn) && (fn = null), Kt.forEach(lu), Sl.forEach(lu);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, lr || (lr = !0, w.unstable_scheduleCallback(w.unstable_NormalPriority, Kf)));
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
    for (; 0 < $n.length && (l = $n[0], l.blockedOn === null); ) qo(l), l.blockedOn === null && $n.shift();
  }
  var gi = Le.ReactCurrentBatchConfig, _a = !0;
  function to(n, r, l, o) {
    var c = Ft, d = gi.transition;
    gi.transition = null;
    try {
      Ft = 1, Cl(n, r, l, o);
    } finally {
      Ft = c, gi.transition = d;
    }
  }
  function no(n, r, l, o) {
    var c = Ft, d = gi.transition;
    gi.transition = null;
    try {
      Ft = 4, Cl(n, r, l, o);
    } finally {
      Ft = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = ro(n, r, l, o);
      if (c === null) Ec(n, r, o, uu, l), Ta(n, o);
      else if (Go(c, n, r, l, o)) o.stopPropagation();
      else if (Ta(n, o), r & 4 && -1 < Nr.indexOf(n)) {
        for (; c !== null; ) {
          var d = Ke(c);
          if (d !== null && At(d), d = ro(n, r, l, o), d === null && Ec(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Ec(n, r, o, null, l);
    }
  }
  var uu = null;
  function ro(n, r, l, o) {
    if (uu = null, n = Gt(o), n = vu(n), n !== null) if (r = ht(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = dt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return uu = n, null;
  }
  function ao(n) {
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
        switch (St()) {
          case Ka:
            return 1;
          case nu:
            return 4;
          case ru:
          case hl:
            return 16;
          case Gu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ei = null, h = null, x = null;
  function H() {
    if (x) return x;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return x = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function $(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function Se() {
    return !0;
  }
  function Je() {
    return !1;
  }
  function be(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var C in n) n.hasOwnProperty(C) && (l = n[C], this[C] = l ? l(d) : d[C]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? Se : Je, this.isPropagationStopped = Je, this;
    }
    return ve(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Se);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Se);
    }, persist: function() {
    }, isPersistent: Se }), r;
  }
  var nt = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Tt = be(nt), zt = ve({}, nt, { view: 0, detail: 0 }), un = be(zt), Xt, Ct, Jt, mn = ve({}, zt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: td, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Jt && (Jt && n.type === "mousemove" ? (Xt = n.screenX - Jt.screenX, Ct = n.screenY - Jt.screenY) : Ct = Xt = 0, Jt = n), Xt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Ct;
  } }), wl = be(mn), Ko = ve({}, mn, { dataTransfer: 0 }), Bi = be(Ko), Xo = ve({}, zt, { relatedTarget: 0 }), ou = be(Xo), Xf = ve({}, nt, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), sc = be(Xf), Jf = ve({}, nt, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), av = be(Jf), Zf = ve({}, nt, { data: 0 }), ed = be(Zf), iv = {
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
  }, lv = {
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
  }, ty = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ty[n]) ? !!r[n] : !1;
  }
  function td() {
    return Ii;
  }
  var nd = ve({}, zt, { key: function(n) {
    if (n.key) {
      var r = iv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = $(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? lv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: td, charCode: function(n) {
    return n.type === "keypress" ? $(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? $(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), rd = be(nd), ad = ve({}, mn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), uv = be(ad), cc = ve({}, zt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: td }), ov = be(cc), Wr = ve({}, nt, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = be(Wr), Mn = ve({}, mn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = be(Mn), id = [9, 13, 27, 32], io = le && "CompositionEvent" in window, Jo = null;
  le && "documentMode" in document && (Jo = document.documentMode);
  var Zo = le && "TextEvent" in window && !Jo, sv = le && (!io || Jo && 8 < Jo && 11 >= Jo), cv = " ", fc = !1;
  function fv(n, r) {
    switch (n) {
      case "keyup":
        return id.indexOf(r.keyCode) !== -1;
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
  function dv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var lo = !1;
  function pv(n, r) {
    switch (n) {
      case "compositionend":
        return dv(r);
      case "keypress":
        return r.which !== 32 ? null : (fc = !0, cv);
      case "textInput":
        return n = r.data, n === cv && fc ? null : n;
      default:
        return null;
    }
  }
  function ny(n, r) {
    if (lo) return n === "compositionend" || !io && fv(n, r) ? (n = H(), x = h = ei = null, lo = !1, n) : null;
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
        return sv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ry = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function vv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ry[n.type] : r === "textarea";
  }
  function ld(n, r, l, o) {
    Pi(o), r = is(r, "onChange"), 0 < r.length && (l = new Tt("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function hv(n) {
    du(n, 0);
  }
  function es(n) {
    var r = ni(n);
    if (br(r)) return n;
  }
  function ay(n, r) {
    if (n === "change") return r;
  }
  var mv = !1;
  if (le) {
    var ud;
    if (le) {
      var od = "oninput" in document;
      if (!od) {
        var yv = document.createElement("div");
        yv.setAttribute("oninput", "return;"), od = typeof yv.oninput == "function";
      }
      ud = od;
    } else ud = !1;
    mv = ud && (!document.documentMode || 9 < document.documentMode);
  }
  function gv() {
    Si && (Si.detachEvent("onpropertychange", Sv), su = Si = null);
  }
  function Sv(n) {
    if (n.propertyName === "value" && es(su)) {
      var r = [];
      ld(r, su, n, Gt(n)), tu(hv, r);
    }
  }
  function iy(n, r, l) {
    n === "focusin" ? (gv(), Si = r, su = l, Si.attachEvent("onpropertychange", Sv)) : n === "focusout" && gv();
  }
  function Ev(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return es(su);
  }
  function ly(n, r) {
    if (n === "click") return es(r);
  }
  function Cv(n, r) {
    if (n === "input" || n === "change") return es(r);
  }
  function uy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : uy;
  function ts(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!U.call(r, c) || !ti(n[c], r[c])) return !1;
    }
    return !0;
  }
  function wv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function dc(n, r) {
    var l = wv(n);
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
      l = wv(l);
    }
  }
  function xl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? xl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ns() {
    for (var n = window, r = wn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = wn(n.document);
    }
    return r;
  }
  function pc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function uo(n) {
    var r = ns(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && xl(l.ownerDocument.documentElement, l)) {
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
  var oy = le && "documentMode" in document && 11 >= document.documentMode, oo = null, sd = null, rs = null, cd = !1;
  function fd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    cd || oo == null || oo !== wn(o) || (o = oo, "selectionStart" in o && pc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), rs && ts(rs, o) || (rs = o, o = is(sd, "onSelect"), 0 < o.length && (r = new Tt("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = oo)));
  }
  function vc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: vc("Animation", "AnimationEnd"), animationiteration: vc("Animation", "AnimationIteration"), animationstart: vc("Animation", "AnimationStart"), transitionend: vc("Transition", "TransitionEnd") }, ur = {}, dd = {};
  le && (dd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function hc(n) {
    if (ur[n]) return ur[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in dd) return ur[n] = r[l];
    return n;
  }
  var xv = hc("animationend"), Rv = hc("animationiteration"), Tv = hc("animationstart"), bv = hc("transitionend"), pd = /* @__PURE__ */ new Map(), mc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ka(n, r) {
    pd.set(n, r), A(r, [n]);
  }
  for (var vd = 0; vd < mc.length; vd++) {
    var fu = mc[vd], sy = fu.toLowerCase(), cy = fu[0].toUpperCase() + fu.slice(1);
    ka(sy, "on" + cy);
  }
  ka(xv, "onAnimationEnd"), ka(Rv, "onAnimationIteration"), ka(Tv, "onAnimationStart"), ka("dblclick", "onDoubleClick"), ka("focusin", "onFocus"), ka("focusout", "onBlur"), ka(bv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), A("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), A("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), A("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), A("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), A("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), A("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var as = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), hd = new Set("cancel close invalid load scroll toggle".split(" ").concat(as));
  function yc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, He(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var C = o[m], k = C.instance, V = C.currentTarget;
          if (C = C.listener, k !== d && c.isPropagationStopped()) break e;
          yc(c, C, V), d = k;
        }
        else for (m = 0; m < o.length; m++) {
          if (C = o[m], k = C.instance, V = C.currentTarget, C = C.listener, k !== d && c.isPropagationStopped()) break e;
          yc(c, C, V), d = k;
        }
      }
    }
    if (vi) throw n = T, vi = !1, T = null, n;
  }
  function $t(n, r) {
    var l = r[os];
    l === void 0 && (l = r[os] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (_v(r, n, 2, !1), l.add(o));
  }
  function gc(n, r, l) {
    var o = 0;
    r && (o |= 4), _v(l, n, o, r);
  }
  var Sc = "_reactListening" + Math.random().toString(36).slice(2);
  function so(n) {
    if (!n[Sc]) {
      n[Sc] = !0, J.forEach(function(l) {
        l !== "selectionchange" && (hd.has(l) || gc(l, !1, n), gc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Sc] || (r[Sc] = !0, gc("selectionchange", !1, r));
    }
  }
  function _v(n, r, l, o) {
    switch (ao(r)) {
      case 1:
        var c = to;
        break;
      case 4:
        c = no;
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
        var C = o.stateNode.containerInfo;
        if (C === c || C.nodeType === 8 && C.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var k = m.tag;
          if ((k === 3 || k === 4) && (k = m.stateNode.containerInfo, k === c || k.nodeType === 8 && k.parentNode === c)) return;
          m = m.return;
        }
        for (; C !== null; ) {
          if (m = vu(C), m === null) return;
          if (k = m.tag, k === 5 || k === 6) {
            o = d = m;
            continue e;
          }
          C = C.parentNode;
        }
      }
      o = o.return;
    }
    tu(function() {
      var V = d, oe = Gt(l), de = [];
      e: {
        var ie = pd.get(n);
        if (ie !== void 0) {
          var Me = Tt, Be = n;
          switch (n) {
            case "keypress":
              if ($(l) === 0) break e;
            case "keydown":
            case "keyup":
              Me = rd;
              break;
            case "focusin":
              Be = "focus", Me = ou;
              break;
            case "focusout":
              Be = "blur", Me = ou;
              break;
            case "beforeblur":
            case "afterblur":
              Me = ou;
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
              Me = wl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Me = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Me = ov;
              break;
            case xv:
            case Rv:
            case Tv:
              Me = sc;
              break;
            case bv:
              Me = Yi;
              break;
            case "scroll":
              Me = un;
              break;
            case "wheel":
              Me = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              Me = av;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Me = uv;
          }
          var $e = (r & 4) !== 0, Dn = !$e && n === "scroll", L = $e ? ie !== null ? ie + "Capture" : null : ie;
          $e = [];
          for (var O = V, z; O !== null; ) {
            z = O;
            var se = z.stateNode;
            if (z.tag === 5 && se !== null && (z = se, L !== null && (se = _r(O, L), se != null && $e.push(co(O, se, z)))), Dn) break;
            O = O.return;
          }
          0 < $e.length && (ie = new Me(ie, Be, null, l, oe), de.push({ event: ie, listeners: $e }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ie = n === "mouseover" || n === "pointerover", Me = n === "mouseout" || n === "pointerout", ie && l !== an && (Be = l.relatedTarget || l.fromElement) && (vu(Be) || Be[Qi])) break e;
          if ((Me || ie) && (ie = oe.window === oe ? oe : (ie = oe.ownerDocument) ? ie.defaultView || ie.parentWindow : window, Me ? (Be = l.relatedTarget || l.toElement, Me = V, Be = Be ? vu(Be) : null, Be !== null && (Dn = ht(Be), Be !== Dn || Be.tag !== 5 && Be.tag !== 6) && (Be = null)) : (Me = null, Be = V), Me !== Be)) {
            if ($e = wl, se = "onMouseLeave", L = "onMouseEnter", O = "mouse", (n === "pointerout" || n === "pointerover") && ($e = uv, se = "onPointerLeave", L = "onPointerEnter", O = "pointer"), Dn = Me == null ? ie : ni(Me), z = Be == null ? ie : ni(Be), ie = new $e(se, O + "leave", Me, l, oe), ie.target = Dn, ie.relatedTarget = z, se = null, vu(oe) === V && ($e = new $e(L, O + "enter", Be, l, oe), $e.target = z, $e.relatedTarget = Dn, se = $e), Dn = se, Me && Be) t: {
              for ($e = Me, L = Be, O = 0, z = $e; z; z = Rl(z)) O++;
              for (z = 0, se = L; se; se = Rl(se)) z++;
              for (; 0 < O - z; ) $e = Rl($e), O--;
              for (; 0 < z - O; ) L = Rl(L), z--;
              for (; O--; ) {
                if ($e === L || L !== null && $e === L.alternate) break t;
                $e = Rl($e), L = Rl(L);
              }
              $e = null;
            }
            else $e = null;
            Me !== null && kv(de, ie, Me, $e, !1), Be !== null && Dn !== null && kv(de, Dn, Be, $e, !0);
          }
        }
        e: {
          if (ie = V ? ni(V) : window, Me = ie.nodeName && ie.nodeName.toLowerCase(), Me === "select" || Me === "input" && ie.type === "file") var Ie = ay;
          else if (vv(ie)) if (mv) Ie = Cv;
          else {
            Ie = Ev;
            var tt = iy;
          }
          else (Me = ie.nodeName) && Me.toLowerCase() === "input" && (ie.type === "checkbox" || ie.type === "radio") && (Ie = ly);
          if (Ie && (Ie = Ie(n, V))) {
            ld(de, Ie, l, oe);
            break e;
          }
          tt && tt(n, ie, V), n === "focusout" && (tt = ie._wrapperState) && tt.controlled && ie.type === "number" && sa(ie, "number", ie.value);
        }
        switch (tt = V ? ni(V) : window, n) {
          case "focusin":
            (vv(tt) || tt.contentEditable === "true") && (oo = tt, sd = V, rs = null);
            break;
          case "focusout":
            rs = sd = oo = null;
            break;
          case "mousedown":
            cd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            cd = !1, fd(de, l, oe);
            break;
          case "selectionchange":
            if (oy) break;
          case "keydown":
          case "keyup":
            fd(de, l, oe);
        }
        var rt;
        if (io) e: {
          switch (n) {
            case "compositionstart":
              var ot = "onCompositionStart";
              break e;
            case "compositionend":
              ot = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ot = "onCompositionUpdate";
              break e;
          }
          ot = void 0;
        }
        else lo ? fv(n, l) && (ot = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (ot = "onCompositionStart");
        ot && (sv && l.locale !== "ko" && (lo || ot !== "onCompositionStart" ? ot === "onCompositionEnd" && lo && (rt = H()) : (ei = oe, h = "value" in ei ? ei.value : ei.textContent, lo = !0)), tt = is(V, ot), 0 < tt.length && (ot = new ed(ot, n, null, l, oe), de.push({ event: ot, listeners: tt }), rt ? ot.data = rt : (rt = dv(l), rt !== null && (ot.data = rt)))), (rt = Zo ? pv(n, l) : ny(n, l)) && (V = is(V, "onBeforeInput"), 0 < V.length && (oe = new ed("onBeforeInput", "beforeinput", null, l, oe), de.push({ event: oe, listeners: V }), oe.data = rt));
      }
      du(de, r);
    });
  }
  function co(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function is(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = _r(n, l), d != null && o.unshift(co(n, d, c)), d = _r(n, r), d != null && o.push(co(n, d, c))), n = n.return;
    }
    return o;
  }
  function Rl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function kv(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var C = l, k = C.alternate, V = C.stateNode;
      if (k !== null && k === o) break;
      C.tag === 5 && V !== null && (C = V, c ? (k = _r(l, d), k != null && m.unshift(co(l, k, C))) : c || (k = _r(l, d), k != null && m.push(co(l, k, C)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var Dv = /\r\n?/g, fy = /\u0000|\uFFFD/g;
  function Ov(n) {
    return (typeof n == "string" ? n : "" + n).replace(Dv, `
`).replace(fy, "");
  }
  function Cc(n, r, l) {
    if (r = Ov(r), Ov(n) !== r && l) throw Error(R(425));
  }
  function Tl() {
  }
  var ls = null, pu = null;
  function wc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var xc = typeof setTimeout == "function" ? setTimeout : void 0, md = typeof clearTimeout == "function" ? clearTimeout : void 0, Nv = typeof Promise == "function" ? Promise : void 0, fo = typeof queueMicrotask == "function" ? queueMicrotask : typeof Nv < "u" ? function(n) {
    return Nv.resolve(null).then(n).catch(Rc);
  } : xc;
  function Rc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function po(n, r) {
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
  function Lv(n) {
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
  var bl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + bl, us = "__reactProps$" + bl, Qi = "__reactContainer$" + bl, os = "__reactEvents$" + bl, vo = "__reactListeners$" + bl, dy = "__reactHandles$" + bl;
  function vu(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Lv(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = Lv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function Ke(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(R(33));
  }
  function yn(n) {
    return n[us] || null;
  }
  var Nt = [], Da = -1;
  function Oa(n) {
    return { current: n };
  }
  function on(n) {
    0 > Da || (n.current = Nt[Da], Nt[Da] = null, Da--);
  }
  function qe(n, r) {
    Da++, Nt[Da] = n.current, n.current = r;
  }
  var wr = {}, Cn = Oa(wr), Qn = Oa(!1), Gr = wr;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return wr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function jn(n) {
    return n = n.childContextTypes, n != null;
  }
  function ho() {
    on(Qn), on(Cn);
  }
  function Mv(n, r, l) {
    if (Cn.current !== wr) throw Error(R(168));
    qe(Cn, r), qe(Qn, l);
  }
  function ss(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(R(108, ct(n) || "Unknown", c));
    return ve({}, l, o);
  }
  function Jn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || wr, Gr = Cn.current, qe(Cn, n), qe(Qn, Qn.current), !0;
  }
  function Tc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(R(169));
    l ? (n = ss(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, on(Qn), on(Cn), qe(Cn, n)) : on(Qn), qe(Qn, l);
  }
  var wi = null, mo = !1, Wi = !1;
  function bc(n) {
    wi === null ? wi = [n] : wi.push(n);
  }
  function _l(n) {
    mo = !0, bc(n);
  }
  function xi() {
    if (!Wi && wi !== null) {
      Wi = !0;
      var n = 0, r = Ft;
      try {
        var l = wi;
        for (Ft = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        wi = null, mo = !1;
      } catch (c) {
        throw wi !== null && (wi = wi.slice(n + 1)), cn(Ka, xi), c;
      } finally {
        Ft = r, Wi = !1;
      }
    }
    return null;
  }
  var kl = [], Dl = 0, Ol = null, Gi = 0, An = [], Na = 0, pa = null, Ri = 1, Ti = "";
  function hu(n, r) {
    kl[Dl++] = Gi, kl[Dl++] = Ol, Ol = n, Gi = r;
  }
  function jv(n, r, l) {
    An[Na++] = Ri, An[Na++] = Ti, An[Na++] = pa, pa = n;
    var o = Ri;
    n = Ti;
    var c = 32 - Dr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Dr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, Ri = 1 << 32 - Dr(r) + c | l << c | o, Ti = d + n;
    } else Ri = 1 << d | l << c | o, Ti = n;
  }
  function _c(n) {
    n.return !== null && (hu(n, 1), jv(n, 1, 0));
  }
  function kc(n) {
    for (; n === Ol; ) Ol = kl[--Dl], kl[Dl] = null, Gi = kl[--Dl], kl[Dl] = null;
    for (; n === pa; ) pa = An[--Na], An[Na] = null, Ti = An[--Na], An[Na] = null, Ri = An[--Na], An[Na] = null;
  }
  var Kr = null, Xr = null, pn = !1, La = null;
  function yd(n, r) {
    var l = Ua(5, null, null, 0);
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
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: Ri, overflow: Ti } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Ua(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function gd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Sd(n) {
    if (pn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Av(n, r)) {
          if (gd(n)) throw Error(R(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && Av(n, r) ? yd(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Kr = n);
        }
      } else {
        if (gd(n)) throw Error(R(418));
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
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !wc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (gd(n)) throw cs(), Error(R(418));
      for (; r; ) yd(n, r), r = Ei(r.nextSibling);
    }
    if (Wn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(R(317));
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
  function cs() {
    for (var n = Xr; n; ) n = Ei(n.nextSibling);
  }
  function Nl() {
    Xr = Kr = null, pn = !1;
  }
  function qi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var py = Le.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(R(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(R(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var C = c.refs;
          m === null ? delete C[d] : C[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(R(284));
      if (!l._owner) throw Error(R(290, n));
    }
    return n;
  }
  function Oc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(R(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function zv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(L, O) {
      if (n) {
        var z = L.deletions;
        z === null ? (L.deletions = [O], L.flags |= 16) : z.push(O);
      }
    }
    function l(L, O) {
      if (!n) return null;
      for (; O !== null; ) r(L, O), O = O.sibling;
      return null;
    }
    function o(L, O) {
      for (L = /* @__PURE__ */ new Map(); O !== null; ) O.key !== null ? L.set(O.key, O) : L.set(O.index, O), O = O.sibling;
      return L;
    }
    function c(L, O) {
      return L = Pl(L, O), L.index = 0, L.sibling = null, L;
    }
    function d(L, O, z) {
      return L.index = z, n ? (z = L.alternate, z !== null ? (z = z.index, z < O ? (L.flags |= 2, O) : z) : (L.flags |= 2, O)) : (L.flags |= 1048576, O);
    }
    function m(L) {
      return n && L.alternate === null && (L.flags |= 2), L;
    }
    function C(L, O, z, se) {
      return O === null || O.tag !== 6 ? (O = Kd(z, L.mode, se), O.return = L, O) : (O = c(O, z), O.return = L, O);
    }
    function k(L, O, z, se) {
      var Ie = z.type;
      return Ie === P ? oe(L, O, z.props.children, se, z.key) : O !== null && (O.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === Dt && zv(Ie) === O.type) ? (se = c(O, z.props), se.ref = mu(L, O, z), se.return = L, se) : (se = Hs(z.type, z.key, z.props, null, L.mode, se), se.ref = mu(L, O, z), se.return = L, se);
    }
    function V(L, O, z, se) {
      return O === null || O.tag !== 4 || O.stateNode.containerInfo !== z.containerInfo || O.stateNode.implementation !== z.implementation ? (O = cf(z, L.mode, se), O.return = L, O) : (O = c(O, z.children || []), O.return = L, O);
    }
    function oe(L, O, z, se, Ie) {
      return O === null || O.tag !== 7 ? (O = tl(z, L.mode, se, Ie), O.return = L, O) : (O = c(O, z), O.return = L, O);
    }
    function de(L, O, z) {
      if (typeof O == "string" && O !== "" || typeof O == "number") return O = Kd("" + O, L.mode, z), O.return = L, O;
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case he:
            return z = Hs(O.type, O.key, O.props, null, L.mode, z), z.ref = mu(L, null, O), z.return = L, z;
          case Ee:
            return O = cf(O, L.mode, z), O.return = L, O;
          case Dt:
            var se = O._init;
            return de(L, se(O._payload), z);
        }
        if (Kn(O) || ge(O)) return O = tl(O, L.mode, z, null), O.return = L, O;
        Oc(L, O);
      }
      return null;
    }
    function ie(L, O, z, se) {
      var Ie = O !== null ? O.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return Ie !== null ? null : C(L, O, "" + z, se);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case he:
            return z.key === Ie ? k(L, O, z, se) : null;
          case Ee:
            return z.key === Ie ? V(L, O, z, se) : null;
          case Dt:
            return Ie = z._init, ie(
              L,
              O,
              Ie(z._payload),
              se
            );
        }
        if (Kn(z) || ge(z)) return Ie !== null ? null : oe(L, O, z, se, null);
        Oc(L, z);
      }
      return null;
    }
    function Me(L, O, z, se, Ie) {
      if (typeof se == "string" && se !== "" || typeof se == "number") return L = L.get(z) || null, C(O, L, "" + se, Ie);
      if (typeof se == "object" && se !== null) {
        switch (se.$$typeof) {
          case he:
            return L = L.get(se.key === null ? z : se.key) || null, k(O, L, se, Ie);
          case Ee:
            return L = L.get(se.key === null ? z : se.key) || null, V(O, L, se, Ie);
          case Dt:
            var tt = se._init;
            return Me(L, O, z, tt(se._payload), Ie);
        }
        if (Kn(se) || ge(se)) return L = L.get(z) || null, oe(O, L, se, Ie, null);
        Oc(O, se);
      }
      return null;
    }
    function Be(L, O, z, se) {
      for (var Ie = null, tt = null, rt = O, ot = O = 0, tr = null; rt !== null && ot < z.length; ot++) {
        rt.index > ot ? (tr = rt, rt = null) : tr = rt.sibling;
        var Vt = ie(L, rt, z[ot], se);
        if (Vt === null) {
          rt === null && (rt = tr);
          break;
        }
        n && rt && Vt.alternate === null && r(L, rt), O = d(Vt, O, ot), tt === null ? Ie = Vt : tt.sibling = Vt, tt = Vt, rt = tr;
      }
      if (ot === z.length) return l(L, rt), pn && hu(L, ot), Ie;
      if (rt === null) {
        for (; ot < z.length; ot++) rt = de(L, z[ot], se), rt !== null && (O = d(rt, O, ot), tt === null ? Ie = rt : tt.sibling = rt, tt = rt);
        return pn && hu(L, ot), Ie;
      }
      for (rt = o(L, rt); ot < z.length; ot++) tr = Me(rt, L, ot, z[ot], se), tr !== null && (n && tr.alternate !== null && rt.delete(tr.key === null ? ot : tr.key), O = d(tr, O, ot), tt === null ? Ie = tr : tt.sibling = tr, tt = tr);
      return n && rt.forEach(function(Bl) {
        return r(L, Bl);
      }), pn && hu(L, ot), Ie;
    }
    function $e(L, O, z, se) {
      var Ie = ge(z);
      if (typeof Ie != "function") throw Error(R(150));
      if (z = Ie.call(z), z == null) throw Error(R(151));
      for (var tt = Ie = null, rt = O, ot = O = 0, tr = null, Vt = z.next(); rt !== null && !Vt.done; ot++, Vt = z.next()) {
        rt.index > ot ? (tr = rt, rt = null) : tr = rt.sibling;
        var Bl = ie(L, rt, Vt.value, se);
        if (Bl === null) {
          rt === null && (rt = tr);
          break;
        }
        n && rt && Bl.alternate === null && r(L, rt), O = d(Bl, O, ot), tt === null ? Ie = Bl : tt.sibling = Bl, tt = Bl, rt = tr;
      }
      if (Vt.done) return l(
        L,
        rt
      ), pn && hu(L, ot), Ie;
      if (rt === null) {
        for (; !Vt.done; ot++, Vt = z.next()) Vt = de(L, Vt.value, se), Vt !== null && (O = d(Vt, O, ot), tt === null ? Ie = Vt : tt.sibling = Vt, tt = Vt);
        return pn && hu(L, ot), Ie;
      }
      for (rt = o(L, rt); !Vt.done; ot++, Vt = z.next()) Vt = Me(rt, L, ot, Vt.value, se), Vt !== null && (n && Vt.alternate !== null && rt.delete(Vt.key === null ? ot : Vt.key), O = d(Vt, O, ot), tt === null ? Ie = Vt : tt.sibling = Vt, tt = Vt);
      return n && rt.forEach(function(gh) {
        return r(L, gh);
      }), pn && hu(L, ot), Ie;
    }
    function Dn(L, O, z, se) {
      if (typeof z == "object" && z !== null && z.type === P && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case he:
            e: {
              for (var Ie = z.key, tt = O; tt !== null; ) {
                if (tt.key === Ie) {
                  if (Ie = z.type, Ie === P) {
                    if (tt.tag === 7) {
                      l(L, tt.sibling), O = c(tt, z.props.children), O.return = L, L = O;
                      break e;
                    }
                  } else if (tt.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === Dt && zv(Ie) === tt.type) {
                    l(L, tt.sibling), O = c(tt, z.props), O.ref = mu(L, tt, z), O.return = L, L = O;
                    break e;
                  }
                  l(L, tt);
                  break;
                } else r(L, tt);
                tt = tt.sibling;
              }
              z.type === P ? (O = tl(z.props.children, L.mode, se, z.key), O.return = L, L = O) : (se = Hs(z.type, z.key, z.props, null, L.mode, se), se.ref = mu(L, O, z), se.return = L, L = se);
            }
            return m(L);
          case Ee:
            e: {
              for (tt = z.key; O !== null; ) {
                if (O.key === tt) if (O.tag === 4 && O.stateNode.containerInfo === z.containerInfo && O.stateNode.implementation === z.implementation) {
                  l(L, O.sibling), O = c(O, z.children || []), O.return = L, L = O;
                  break e;
                } else {
                  l(L, O);
                  break;
                }
                else r(L, O);
                O = O.sibling;
              }
              O = cf(z, L.mode, se), O.return = L, L = O;
            }
            return m(L);
          case Dt:
            return tt = z._init, Dn(L, O, tt(z._payload), se);
        }
        if (Kn(z)) return Be(L, O, z, se);
        if (ge(z)) return $e(L, O, z, se);
        Oc(L, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, O !== null && O.tag === 6 ? (l(L, O.sibling), O = c(O, z), O.return = L, L = O) : (l(L, O), O = Kd(z, L.mode, se), O.return = L, L = O), m(L)) : l(L, O);
    }
    return Dn;
  }
  var Tn = yu(!0), De = yu(!1), va = Oa(null), Jr = null, yo = null, Ed = null;
  function Cd() {
    Ed = yo = Jr = null;
  }
  function wd(n) {
    var r = va.current;
    on(va), n._currentValue = r;
  }
  function xd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function gn(n, r) {
    Jr = n, Ed = yo = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Un = !0), n.firstContext = null);
  }
  function Ma(n) {
    var r = n._currentValue;
    if (Ed !== n) if (n = { context: n, memoizedValue: r, next: null }, yo === null) {
      if (Jr === null) throw Error(R(308));
      yo = n, Jr.dependencies = { lanes: 0, firstContext: n };
    } else yo = yo.next = n;
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
  function bd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Uv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, Lt & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Rd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Nc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function Fv(n, r) {
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
  function fs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, C = c.shared.pending;
    if (C !== null) {
      c.shared.pending = null;
      var k = C, V = k.next;
      k.next = null, m === null ? d = V : m.next = V, m = k;
      var oe = n.alternate;
      oe !== null && (oe = oe.updateQueue, C = oe.lastBaseUpdate, C !== m && (C === null ? oe.firstBaseUpdate = V : C.next = V, oe.lastBaseUpdate = k));
    }
    if (d !== null) {
      var de = c.baseState;
      m = 0, oe = V = k = null, C = d;
      do {
        var ie = C.lane, Me = C.eventTime;
        if ((o & ie) === ie) {
          oe !== null && (oe = oe.next = {
            eventTime: Me,
            lane: 0,
            tag: C.tag,
            payload: C.payload,
            callback: C.callback,
            next: null
          });
          e: {
            var Be = n, $e = C;
            switch (ie = r, Me = l, $e.tag) {
              case 1:
                if (Be = $e.payload, typeof Be == "function") {
                  de = Be.call(Me, de, ie);
                  break e;
                }
                de = Be;
                break e;
              case 3:
                Be.flags = Be.flags & -65537 | 128;
              case 0:
                if (Be = $e.payload, ie = typeof Be == "function" ? Be.call(Me, de, ie) : Be, ie == null) break e;
                de = ve({}, de, ie);
                break e;
              case 2:
                ma = !0;
            }
          }
          C.callback !== null && C.lane !== 0 && (n.flags |= 64, ie = c.effects, ie === null ? c.effects = [C] : ie.push(C));
        } else Me = { eventTime: Me, lane: ie, tag: C.tag, payload: C.payload, callback: C.callback, next: null }, oe === null ? (V = oe = Me, k = de) : oe = oe.next = Me, m |= ie;
        if (C = C.next, C === null) {
          if (C = c.shared.pending, C === null) break;
          ie = C, C = ie.next, ie.next = null, c.lastBaseUpdate = ie, c.shared.pending = null;
        }
      } while (!0);
      if (oe === null && (k = de), c.baseState = k, c.firstBaseUpdate = V, c.lastBaseUpdate = oe, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = de;
    }
  }
  function _d(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(R(191, c));
        c.call(o);
      }
    }
  }
  var ds = {}, bi = Oa(ds), ps = Oa(ds), vs = Oa(ds);
  function Su(n) {
    if (n === ds) throw Error(R(174));
    return n;
  }
  function kd(n, r) {
    switch (qe(vs, r), qe(ps, n), qe(bi, ds), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    on(bi), qe(bi, r);
  }
  function Eu() {
    on(bi), on(ps), on(vs);
  }
  function Pv(n) {
    Su(vs.current);
    var r = Su(bi.current), l = ca(r, n.type);
    r !== l && (qe(ps, n), qe(bi, l));
  }
  function Lc(n) {
    ps.current === n && (on(bi), on(ps));
  }
  var Sn = Oa(0);
  function Mc(n) {
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
  var hs = [];
  function Xe() {
    for (var n = 0; n < hs.length; n++) hs[n]._workInProgressVersionPrimary = null;
    hs.length = 0;
  }
  var xt = Le.ReactCurrentDispatcher, Pt = Le.ReactCurrentBatchConfig, Zt = 0, Ht = null, zn = null, Zn = null, jc = !1, ms = !1, Cu = 0, ae = 0;
  function Ut() {
    throw Error(R(321));
  }
  function it(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, o, c, d) {
    if (Zt = d, Ht = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, xt.current = n === null || n.memoizedState === null ? qc : ws, n = l(o, c), ms) {
      d = 0;
      do {
        if (ms = !1, Cu = 0, 25 <= d) throw Error(R(301));
        d += 1, Zn = zn = null, r.updateQueue = null, xt.current = Kc, n = l(o, c);
      } while (ms);
    }
    if (xt.current = bu, r = zn !== null && zn.next !== null, Zt = 0, Zn = zn = Ht = null, jc = !1, r) throw Error(R(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function xr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Zn === null ? Ht.memoizedState = Zn = n : Zn = Zn.next = n, Zn;
  }
  function bn() {
    if (zn === null) {
      var n = Ht.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = zn.next;
    var r = Zn === null ? Ht.memoizedState : Zn.next;
    if (r !== null) Zn = r, zn = n;
    else {
      if (n === null) throw Error(R(310));
      zn = n, n = { memoizedState: zn.memoizedState, baseState: zn.baseState, baseQueue: zn.baseQueue, queue: zn.queue, next: null }, Zn === null ? Ht.memoizedState = Zn = n : Zn = Zn.next = n;
    }
    return Zn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function jl(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(R(311));
    l.lastRenderedReducer = n;
    var o = zn, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var C = m = null, k = null, V = d;
      do {
        var oe = V.lane;
        if ((Zt & oe) === oe) k !== null && (k = k.next = { lane: 0, action: V.action, hasEagerState: V.hasEagerState, eagerState: V.eagerState, next: null }), o = V.hasEagerState ? V.eagerState : n(o, V.action);
        else {
          var de = {
            lane: oe,
            action: V.action,
            hasEagerState: V.hasEagerState,
            eagerState: V.eagerState,
            next: null
          };
          k === null ? (C = k = de, m = o) : k = k.next = de, Ht.lanes |= oe, Oi |= oe;
        }
        V = V.next;
      } while (V !== null && V !== d);
      k === null ? m = o : k.next = C, ti(o, r.memoizedState) || (Un = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = k, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Ht.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function wu(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(R(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (Un = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Ac() {
  }
  function zc(n, r) {
    var l = Ht, o = bn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, Un = !0), o = o.queue, ys(Pc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Zn !== null && Zn.memoizedState.tag & 1) {
      if (l.flags |= 2048, xu(9, Fc.bind(null, l, o, c, r), void 0, null), Gn === null) throw Error(R(349));
      Zt & 30 || Uc(l, r, c);
    }
    return c;
  }
  function Uc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Ht.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ht.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Fc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Hc(r) && Vc(n);
  }
  function Pc(n, r, l) {
    return l(function() {
      Hc(r) && Vc(n);
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
  function Vc(n) {
    var r = ha(n, 1);
    r !== null && Ar(r, n, 1, -1);
  }
  function Bc(n) {
    var r = xr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = Tu.bind(null, Ht, n), [r.memoizedState, n];
  }
  function xu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Ht.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ht.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Ic() {
    return bn().memoizedState;
  }
  function go(n, r, l, o) {
    var c = xr();
    Ht.flags |= n, c.memoizedState = xu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function So(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (zn !== null) {
      var m = zn.memoizedState;
      if (d = m.destroy, o !== null && it(o, m.deps)) {
        c.memoizedState = xu(r, l, d, o);
        return;
      }
    }
    Ht.flags |= n, c.memoizedState = xu(1 | r, l, d, o);
  }
  function Yc(n, r) {
    return go(8390656, 8, n, r);
  }
  function ys(n, r) {
    return So(2048, 8, n, r);
  }
  function $c(n, r) {
    return So(4, 2, n, r);
  }
  function gs(n, r) {
    return So(4, 4, n, r);
  }
  function Ru(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Qc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, So(4, 4, Ru.bind(null, r, n), l);
  }
  function Ss() {
  }
  function Wc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && it(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Gc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && it(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Dd(n, r, l) {
    return Zt & 21 ? (ti(l, r) || (l = Xu(), Ht.lanes |= l, Oi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Un = !0), n.memoizedState = l);
  }
  function Es(n, r) {
    var l = Ft;
    Ft = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Pt.transition;
    Pt.transition = {};
    try {
      n(!1), r();
    } finally {
      Ft = l, Pt.transition = o;
    }
  }
  function Od() {
    return bn().memoizedState;
  }
  function Cs(n, r, l) {
    var o = Ni(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Zr(n)) Hv(r, l);
    else if (l = Td(n, r, l, o), l !== null) {
      var c = Hn();
      Ar(l, n, o, c), nn(l, r, o);
    }
  }
  function Tu(n, r, l) {
    var o = Ni(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Zr(n)) Hv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, C = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = C, ti(C, m)) {
          var k = r.interleaved;
          k === null ? (c.next = c, Rd(r)) : (c.next = k.next, k.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Td(n, r, c, o), l !== null && (c = Hn(), Ar(l, n, o, c), nn(l, r, o));
    }
  }
  function Zr(n) {
    var r = n.alternate;
    return n === Ht || r !== null && r === Ht;
  }
  function Hv(n, r) {
    ms = jc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function nn(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var bu = { readContext: Ma, useCallback: Ut, useContext: Ut, useEffect: Ut, useImperativeHandle: Ut, useInsertionEffect: Ut, useLayoutEffect: Ut, useMemo: Ut, useReducer: Ut, useRef: Ut, useState: Ut, useDebugValue: Ut, useDeferredValue: Ut, useTransition: Ut, useMutableSource: Ut, useSyncExternalStore: Ut, useId: Ut, unstable_isNewReconciler: !1 }, qc = { readContext: Ma, useCallback: function(n, r) {
    return xr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ma, useEffect: Yc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(
      4194308,
      4,
      Ru.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return go(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return go(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = xr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = xr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Cs.bind(null, Ht, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = xr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Bc, useDebugValue: Ss, useDeferredValue: function(n) {
    return xr().memoizedState = n;
  }, useTransition: function() {
    var n = Bc(!1), r = n[0];
    return n = Es.bind(null, n[1]), xr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Ht, c = xr();
    if (pn) {
      if (l === void 0) throw Error(R(407));
      l = l();
    } else {
      if (l = r(), Gn === null) throw Error(R(349));
      Zt & 30 || Uc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Yc(Pc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, xu(9, Fc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = xr(), r = Gn.identifierPrefix;
    if (pn) {
      var l = Ti, o = Ri;
      l = (o & ~(1 << 32 - Dr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = ae++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, ws = {
    readContext: Ma,
    useCallback: Wc,
    useContext: Ma,
    useEffect: ys,
    useImperativeHandle: Qc,
    useInsertionEffect: $c,
    useLayoutEffect: gs,
    useMemo: Gc,
    useReducer: jl,
    useRef: Ic,
    useState: function() {
      return jl(Xi);
    },
    useDebugValue: Ss,
    useDeferredValue: function(n) {
      var r = bn();
      return Dd(r, zn.memoizedState, n);
    },
    useTransition: function() {
      var n = jl(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: Ac,
    useSyncExternalStore: zc,
    useId: Od,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: Ma, useCallback: Wc, useContext: Ma, useEffect: ys, useImperativeHandle: Qc, useInsertionEffect: $c, useLayoutEffect: gs, useMemo: Gc, useReducer: wu, useRef: Ic, useState: function() {
    return wu(Xi);
  }, useDebugValue: Ss, useDeferredValue: function(n) {
    var r = bn();
    return zn === null ? r.memoizedState = n : Dd(r, zn.memoizedState, n);
  }, useTransition: function() {
    var n = wu(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: Ac, useSyncExternalStore: zc, useId: Od, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = ve({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Nd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ve({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? ht(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Ni(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Ar(r, n, c, o), Nc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Ni(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Ar(r, n, c, o), Nc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Hn(), o = Ni(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (Ar(r, n, o, l), Nc(r, n, o));
  } };
  function Vv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !ts(l, o) || !ts(c, d) : !0;
  }
  function Jc(n, r, l) {
    var o = !1, c = wr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ma(d) : (c = jn(r) ? Gr : Cn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : wr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Bv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function xs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, bd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ma(d) : (d = jn(r) ? Gr : Cn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Nd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), fs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += at(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Ld(n, r, l) {
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
  function Iv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      To || (To = !0, Ou = o), Md(n, r);
    }, l;
  }
  function jd(n, r, l) {
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
      Md(n, r), typeof o != "function" && (Ul === null ? Ul = /* @__PURE__ */ new Set([this]) : Ul.add(this));
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
    c.has(l) || (c.add(l), n = Ey.bind(null, n, r, l), r.then(n, n));
  }
  function Yv(n) {
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
  var Rs = Le.ReactCurrentOwner, Un = !1;
  function or(n, r, l, o) {
    r.child = n === null ? De(r, null, l, o) : Tn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gn(r, c), o = Ml(n, r, l, o, d, c), l = ri(), n !== null && !Un ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Aa(n, r, c)) : (pn && l && _c(r), r.flags |= 1, or(n, r, o, c), r.child);
  }
  function ku(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, yt(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ts, l(m, o) && n.ref === r.ref) return Aa(n, r, c);
    }
    return r.flags |= 1, n = Pl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function yt(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (ts(d, o) && n.ref === r.ref) if (Un = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (Un = !0);
      else return r.lanes = n.lanes, Aa(n, r, c);
    }
    return $v(n, r, l, o, c);
  }
  function Ts(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, qe(wo, ya), ya |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, qe(wo, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, qe(wo, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, qe(wo, ya), ya |= o;
    return or(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function $v(n, r, l, o, c) {
    var d = jn(l) ? Gr : Cn.current;
    return d = qr(r, d), gn(r, c), l = Ml(n, r, l, o, d, c), o = ri(), n !== null && !Un ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Aa(n, r, c)) : (pn && o && _c(r), r.flags |= 1, or(n, r, l, c), r.child);
  }
  function Qv(n, r, l, o, c) {
    if (jn(l)) {
      var d = !0;
      Jn(r);
    } else d = !1;
    if (gn(r, c), r.stateNode === null) ja(n, r), Jc(r, l, o), xs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, C = r.memoizedProps;
      m.props = C;
      var k = m.context, V = l.contextType;
      typeof V == "object" && V !== null ? V = Ma(V) : (V = jn(l) ? Gr : Cn.current, V = qr(r, V));
      var oe = l.getDerivedStateFromProps, de = typeof oe == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      de || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (C !== o || k !== V) && Bv(r, m, o, V), ma = !1;
      var ie = r.memoizedState;
      m.state = ie, fs(r, o, m, c), k = r.memoizedState, C !== o || ie !== k || Qn.current || ma ? (typeof oe == "function" && (Nd(r, l, oe, o), k = r.memoizedState), (C = ma || Vv(r, l, C, o, ie, k, V)) ? (de || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = k), m.props = o, m.state = k, m.context = V, o = C) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Uv(n, r), C = r.memoizedProps, V = r.type === r.elementType ? C : ai(r.type, C), m.props = V, de = r.pendingProps, ie = m.context, k = l.contextType, typeof k == "object" && k !== null ? k = Ma(k) : (k = jn(l) ? Gr : Cn.current, k = qr(r, k));
      var Me = l.getDerivedStateFromProps;
      (oe = typeof Me == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (C !== de || ie !== k) && Bv(r, m, o, k), ma = !1, ie = r.memoizedState, m.state = ie, fs(r, o, m, c);
      var Be = r.memoizedState;
      C !== de || ie !== Be || Qn.current || ma ? (typeof Me == "function" && (Nd(r, l, Me, o), Be = r.memoizedState), (V = ma || Vv(r, l, V, o, ie, Be, k) || !1) ? (oe || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Be, k), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Be, k)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || C === n.memoizedProps && ie === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || C === n.memoizedProps && ie === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Be), m.props = o, m.state = Be, m.context = k, o = V) : (typeof m.componentDidUpdate != "function" || C === n.memoizedProps && ie === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || C === n.memoizedProps && ie === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return bs(n, r, l, o, d, c);
  }
  function bs(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && Tc(r, l, !1), Aa(n, r, d);
    o = r.stateNode, Rs.current = r;
    var C = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = Tn(r, n.child, null, d), r.child = Tn(r, null, C, d)) : or(n, r, C, d), r.memoizedState = o.state, c && Tc(r, l, !0), r.child;
  }
  function Eo(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), kd(n, r.containerInfo);
  }
  function Wv(n, r, l, o, c) {
    return Nl(), qi(c), r.flags |= 256, or(n, r, l, o), r.child;
  }
  var ef = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ud(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tf(n, r, l) {
    var o = r.pendingProps, c = Sn.current, d = !1, m = (r.flags & 128) !== 0, C;
    if ((C = m) || (C = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), C ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), qe(Sn, c & 1), n === null)
      return Sd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Hl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ud(l), r.memoizedState = ef, n) : Fd(r, m));
    if (c = n.memoizedState, c !== null && (C = c.dehydrated, C !== null)) return Gv(n, r, m, o, C, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, C = c.sibling;
      var k = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = k, r.deletions = null) : (o = Pl(c, k), o.subtreeFlags = c.subtreeFlags & 14680064), C !== null ? d = Pl(C, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ud(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = ef, o;
    }
    return d = n.child, n = d.sibling, o = Pl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Fd(n, r) {
    return r = Hl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function _s(n, r, l, o) {
    return o !== null && qi(o), Tn(r, n.child, null, l), n = Fd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Gv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Ld(Error(R(422))), _s(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Hl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && Tn(r, n.child, null, m), r.child.memoizedState = Ud(m), r.memoizedState = ef, d);
    if (!(r.mode & 1)) return _s(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var C = o.dgst;
      return o = C, d = Error(R(419)), o = Ld(d, o, void 0), _s(n, r, m, o);
    }
    if (C = (m & n.childLanes) !== 0, Un || C) {
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
      return Gd(), o = Ld(Error(R(421))), _s(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Cy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, pn = !0, La = null, n !== null && (An[Na++] = Ri, An[Na++] = Ti, An[Na++] = pa, Ri = n.id, Ti = n.overflow, pa = r), r = Fd(r, o.children), r.flags |= 4096, r);
  }
  function Pd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), xd(n.return, r, l);
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
        if (n.tag === 13) n.memoizedState !== null && Pd(n, l, r);
        else if (n.tag === 19) Pd(n, l, r);
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
    if (qe(Sn, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Mc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Lr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Mc(n) === null) {
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
  function ja(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Aa(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(R(153));
    if (r.child !== null) {
      for (n = r.child, l = Pl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Pl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function ks(n, r, l) {
    switch (r.tag) {
      case 3:
        Eo(r), Nl();
        break;
      case 5:
        Pv(r);
        break;
      case 1:
        jn(r.type) && Jn(r);
        break;
      case 4:
        kd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        qe(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (qe(Sn, Sn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? tf(n, r, l) : (qe(Sn, Sn.current & 1), n = Aa(n, r, l), n !== null ? n.sibling : null);
        qe(Sn, Sn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), qe(Sn, Sn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Ts(n, r, l);
    }
    return Aa(n, r, l);
  }
  var za, Fn, qv, Kv;
  za = function(n, r) {
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
  }, qv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(bi.current);
      var d = null;
      switch (l) {
        case "input":
          c = rr(n, c), o = rr(n, o), d = [];
          break;
        case "select":
          c = ve({}, c, { value: void 0 }), o = ve({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = Tl);
      }
      sn(l, o);
      var m;
      l = null;
      for (V in c) if (!o.hasOwnProperty(V) && c.hasOwnProperty(V) && c[V] != null) if (V === "style") {
        var C = c[V];
        for (m in C) C.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else V !== "dangerouslySetInnerHTML" && V !== "children" && V !== "suppressContentEditableWarning" && V !== "suppressHydrationWarning" && V !== "autoFocus" && (Z.hasOwnProperty(V) ? d || (d = []) : (d = d || []).push(V, null));
      for (V in o) {
        var k = o[V];
        if (C = c != null ? c[V] : void 0, o.hasOwnProperty(V) && k !== C && (k != null || C != null)) if (V === "style") if (C) {
          for (m in C) !C.hasOwnProperty(m) || k && k.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in k) k.hasOwnProperty(m) && C[m] !== k[m] && (l || (l = {}), l[m] = k[m]);
        } else l || (d || (d = []), d.push(
          V,
          l
        )), l = k;
        else V === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, C = C ? C.__html : void 0, k != null && C !== k && (d = d || []).push(V, k)) : V === "children" ? typeof k != "string" && typeof k != "number" || (d = d || []).push(V, "" + k) : V !== "suppressContentEditableWarning" && V !== "suppressHydrationWarning" && (Z.hasOwnProperty(V) ? (k != null && V === "onScroll" && $t("scroll", n), d || C === k || (d = [])) : (d = d || []).push(V, k));
      }
      l && (d = d || []).push("style", l);
      var V = d;
      (r.updateQueue = V) && (r.flags |= 4);
    }
  }, Kv = function(n, r, l, o) {
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
  function Xv(n, r, l) {
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
        return jn(r.type) && ho(), er(r), null;
      case 3:
        return o = r.stateNode, Eu(), on(Qn), on(Cn), Xe(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, La !== null && (Nu(La), La = null))), Fn(n, r), er(r), null;
      case 5:
        Lc(r);
        var c = Su(vs.current);
        if (l = r.type, n !== null && r.stateNode != null) qv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(R(166));
            return er(r), null;
          }
          if (n = Su(bi.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[us] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                $t("cancel", o), $t("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                $t("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < as.length; c++) $t(as[c], o);
                break;
              case "source":
                $t("error", o);
                break;
              case "img":
              case "image":
              case "link":
                $t(
                  "error",
                  o
                ), $t("load", o);
                break;
              case "details":
                $t("toggle", o);
                break;
              case "input":
                Bn(o, d), $t("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, $t("invalid", o);
                break;
              case "textarea":
                Sr(o, d), $t("invalid", o);
            }
            sn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var C = d[m];
              m === "children" ? typeof C == "string" ? o.textContent !== C && (d.suppressHydrationWarning !== !0 && Cc(o.textContent, C, n), c = ["children", C]) : typeof C == "number" && o.textContent !== "" + C && (d.suppressHydrationWarning !== !0 && Cc(
                o.textContent,
                C,
                n
              ), c = ["children", "" + C]) : Z.hasOwnProperty(m) && C != null && m === "onScroll" && $t("scroll", o);
            }
            switch (l) {
              case "input":
                Nn(o), ci(o, d, !0);
                break;
              case "textarea":
                Nn(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = Tl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Er(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[us] = o, za(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Xn(l, o), l) {
                case "dialog":
                  $t("cancel", n), $t("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  $t("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < as.length; c++) $t(as[c], n);
                  c = o;
                  break;
                case "source":
                  $t("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  $t(
                    "error",
                    n
                  ), $t("load", n), c = o;
                  break;
                case "details":
                  $t("toggle", n), c = o;
                  break;
                case "input":
                  Bn(n, o), c = rr(n, o), $t("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ve({}, o, { value: void 0 }), $t("invalid", n);
                  break;
                case "textarea":
                  Sr(n, o), c = Yn(n, o), $t("invalid", n);
                  break;
                default:
                  c = o;
              }
              sn(l, c), C = c;
              for (d in C) if (C.hasOwnProperty(d)) {
                var k = C[d];
                d === "style" ? rn(n, k) : d === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && fi(n, k)) : d === "children" ? typeof k == "string" ? (l !== "textarea" || k !== "") && we(n, k) : typeof k == "number" && we(n, "" + k) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (Z.hasOwnProperty(d) ? k != null && d === "onScroll" && $t("scroll", n) : k != null && ye(n, d, k, m));
              }
              switch (l) {
                case "input":
                  Nn(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Nn(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + ft(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? xn(n, !!o.multiple, d, !1) : o.defaultValue != null && xn(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = Tl);
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
        if (n && r.stateNode != null) Kv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(R(166));
          if (l = Su(vs.current), Su(bi.current), Dc(r)) {
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
          if (pn && Xr !== null && r.mode & 1 && !(r.flags & 128)) cs(), Nl(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(R(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(R(317));
              d[Ci] = r;
            } else Nl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            er(r), d = !1;
          } else La !== null && (Nu(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || Sn.current & 1 ? kn === 0 && (kn = 3) : Gd())), r.updateQueue !== null && (r.flags |= 4), er(r), null);
      case 4:
        return Eu(), Fn(n, r), n === null && so(r.stateNode.containerInfo), er(r), null;
      case 10:
        return wd(r.type._context), er(r), null;
      case 17:
        return jn(r.type) && ho(), er(r), null;
      case 19:
        if (on(Sn), d = r.memoizedState, d === null) return er(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) Ds(d, !1);
        else {
          if (kn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (m = Mc(n), m !== null) {
              for (r.flags |= 128, Ds(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return qe(Sn, Sn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && mt() > Ro && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Mc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ds(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return er(r), null;
          } else 2 * mt() - d.renderingStartTime > Ro && l !== 1073741824 && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = mt(), r.sibling = null, l = Sn.current, qe(Sn, o ? l & 1 | 2 : l & 1), r) : (er(r), null);
      case 22:
      case 23:
        return Wd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ya & 1073741824 && (er(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : er(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(R(156, r.tag));
  }
  function nf(n, r) {
    switch (kc(r), r.tag) {
      case 1:
        return jn(r.type) && ho(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), on(Qn), on(Cn), Xe(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Lc(r), null;
      case 13:
        if (on(Sn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(R(340));
          Nl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return on(Sn), null;
      case 4:
        return Eu(), null;
      case 10:
        return wd(r.type._context), null;
      case 22:
      case 23:
        return Wd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Os = !1, Rr = !1, vy = typeof WeakSet == "function" ? WeakSet : Set, Fe = null;
  function Co(n, r) {
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
  var Jv = !1;
  function Zv(n, r) {
    if (ls = _a, n = ns(), pc(n)) {
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
          var m = 0, C = -1, k = -1, V = 0, oe = 0, de = n, ie = null;
          t: for (; ; ) {
            for (var Me; de !== l || c !== 0 && de.nodeType !== 3 || (C = m + c), de !== d || o !== 0 && de.nodeType !== 3 || (k = m + o), de.nodeType === 3 && (m += de.nodeValue.length), (Me = de.firstChild) !== null; )
              ie = de, de = Me;
            for (; ; ) {
              if (de === n) break t;
              if (ie === l && ++V === c && (C = m), ie === d && ++oe === o && (k = m), (Me = de.nextSibling) !== null) break;
              de = ie, ie = de.parentNode;
            }
            de = Me;
          }
          l = C === -1 || k === -1 ? null : { start: C, end: k };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, Fe = r; Fe !== null; ) if (r = Fe, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Fe = n;
    else for (; Fe !== null; ) {
      r = Fe;
      try {
        var Be = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Be !== null) {
              var $e = Be.memoizedProps, Dn = Be.memoizedState, L = r.stateNode, O = L.getSnapshotBeforeUpdate(r.elementType === r.type ? $e : ai(r.type, $e), Dn);
              L.__reactInternalSnapshotBeforeUpdate = O;
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
            throw Error(R(163));
        }
      } catch (se) {
        vn(r, r.return, se);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Fe = n;
        break;
      }
      Fe = r.return;
    }
    return Be = Jv, Jv = !1, Be;
  }
  function Ns(n, r, l) {
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
  function Ls(n, r) {
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
    r !== null && (n.alternate = null, af(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[us], delete r[os], delete r[vo], delete r[dy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
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
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Tl));
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var _n = null, Mr = !1;
  function jr(n, r, l) {
    for (l = l.child; l !== null; ) eh(n, r, l), l = l.sibling;
  }
  function eh(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Rr || Co(l, r);
      case 6:
        var o = _n, c = Mr;
        _n = null, jr(n, r, l), _n = o, Mr = c, _n !== null && (Mr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : _n.removeChild(l.stateNode));
        break;
      case 18:
        _n !== null && (Mr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? po(n.parentNode, l) : n.nodeType === 1 && po(n, l), Za(n)) : po(_n, l.stateNode));
        break;
      case 4:
        o = _n, c = Mr, _n = l.stateNode.containerInfo, Mr = !0, jr(n, r, l), _n = o, Mr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Rr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && rf(l, r, m), c = c.next;
          } while (c !== o);
        }
        jr(n, r, l);
        break;
      case 1:
        if (!Rr && (Co(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (C) {
          vn(l, r, C);
        }
        jr(n, r, l);
        break;
      case 21:
        jr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Rr = (o = Rr) || l.memoizedState !== null, jr(n, r, l), Rr = o) : jr(n, r, l);
        break;
      default:
        jr(n, r, l);
    }
  }
  function th(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new vy()), r.forEach(function(o) {
        var c = ch.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ii(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, C = m;
        e: for (; C !== null; ) {
          switch (C.tag) {
            case 5:
              _n = C.stateNode, Mr = !1;
              break e;
            case 3:
              _n = C.stateNode.containerInfo, Mr = !0;
              break e;
            case 4:
              _n = C.stateNode.containerInfo, Mr = !0;
              break e;
          }
          C = C.return;
        }
        if (_n === null) throw Error(R(160));
        eh(d, m, c), _n = null, Mr = !1;
        var k = c.alternate;
        k !== null && (k.return = null), c.return = null;
      } catch (V) {
        vn(c, r, V);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Vd(r, n), r = r.sibling;
  }
  function Vd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Ns(3, n, n.return), Ls(3, n);
          } catch ($e) {
            vn(n, n.return, $e);
          }
          try {
            Ns(5, n, n.return);
          } catch ($e) {
            vn(n, n.return, $e);
          }
        }
        break;
      case 1:
        ii(r, n), ta(n), o & 512 && l !== null && Co(l, l.return);
        break;
      case 5:
        if (ii(r, n), ta(n), o & 512 && l !== null && Co(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            we(c, "");
          } catch ($e) {
            vn(n, n.return, $e);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, C = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null) try {
            C === "input" && d.type === "radio" && d.name != null && In(c, d), Xn(C, m);
            var V = Xn(C, d);
            for (m = 0; m < k.length; m += 2) {
              var oe = k[m], de = k[m + 1];
              oe === "style" ? rn(c, de) : oe === "dangerouslySetInnerHTML" ? fi(c, de) : oe === "children" ? we(c, de) : ye(c, oe, de, V);
            }
            switch (C) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var ie = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var Me = d.value;
                Me != null ? xn(c, !!d.multiple, Me, !1) : ie !== !!d.multiple && (d.defaultValue != null ? xn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : xn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[us] = d;
          } catch ($e) {
            vn(n, n.return, $e);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(R(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch ($e) {
            vn(n, n.return, $e);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Za(r.containerInfo);
        } catch ($e) {
          vn(n, n.return, $e);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Yd = mt())), o & 4 && th(n);
        break;
      case 22:
        if (oe = l !== null && l.memoizedState !== null, n.mode & 1 ? (Rr = (V = Rr) || oe, ii(r, n), Rr = V) : ii(r, n), ta(n), o & 8192) {
          if (V = n.memoizedState !== null, (n.stateNode.isHidden = V) && !oe && n.mode & 1) for (Fe = n, oe = n.child; oe !== null; ) {
            for (de = Fe = oe; Fe !== null; ) {
              switch (ie = Fe, Me = ie.child, ie.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ns(4, ie, ie.return);
                  break;
                case 1:
                  Co(ie, ie.return);
                  var Be = ie.stateNode;
                  if (typeof Be.componentWillUnmount == "function") {
                    o = ie, l = ie.return;
                    try {
                      r = o, Be.props = r.memoizedProps, Be.state = r.memoizedState, Be.componentWillUnmount();
                    } catch ($e) {
                      vn(o, l, $e);
                    }
                  }
                  break;
                case 5:
                  Co(ie, ie.return);
                  break;
                case 22:
                  if (ie.memoizedState !== null) {
                    js(de);
                    continue;
                  }
              }
              Me !== null ? (Me.return = ie, Fe = Me) : js(de);
            }
            oe = oe.sibling;
          }
          e: for (oe = null, de = n; ; ) {
            if (de.tag === 5) {
              if (oe === null) {
                oe = de;
                try {
                  c = de.stateNode, V ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (C = de.stateNode, k = de.memoizedProps.style, m = k != null && k.hasOwnProperty("display") ? k.display : null, C.style.display = Yt("display", m));
                } catch ($e) {
                  vn(n, n.return, $e);
                }
              }
            } else if (de.tag === 6) {
              if (oe === null) try {
                de.stateNode.nodeValue = V ? "" : de.memoizedProps;
              } catch ($e) {
                vn(n, n.return, $e);
              }
            } else if ((de.tag !== 22 && de.tag !== 23 || de.memoizedState === null || de === n) && de.child !== null) {
              de.child.return = de, de = de.child;
              continue;
            }
            if (de === n) break e;
            for (; de.sibling === null; ) {
              if (de.return === null || de.return === n) break e;
              oe === de && (oe = null), de = de.return;
            }
            oe === de && (oe = null), de.sibling.return = de.return, de = de.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && th(n);
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
          throw Error(R(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (we(c, ""), o.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, C = Ji(n);
            ki(n, C, m);
            break;
          default:
            throw Error(R(161));
        }
      } catch (k) {
        vn(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function hy(n, r, l) {
    Fe = n, Bd(n);
  }
  function Bd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Fe !== null; ) {
      var c = Fe, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Os;
        if (!m) {
          var C = c.alternate, k = C !== null && C.memoizedState !== null || Rr;
          C = Os;
          var V = Rr;
          if (Os = m, (Rr = k) && !V) for (Fe = c; Fe !== null; ) m = Fe, k = m.child, m.tag === 22 && m.memoizedState !== null ? Id(c) : k !== null ? (k.return = m, Fe = k) : Id(c);
          for (; d !== null; ) Fe = d, Bd(d), d = d.sibling;
          Fe = c, Os = C, Rr = V;
        }
        nh(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, Fe = d) : nh(n);
    }
  }
  function nh(n) {
    for (; Fe !== null; ) {
      var r = Fe;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Rr || Ls(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Rr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && _d(r, d, o);
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
                _d(r, m, l);
              }
              break;
            case 5:
              var C = r.stateNode;
              if (l === null && r.flags & 4) {
                l = C;
                var k = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k.autoFocus && l.focus();
                    break;
                  case "img":
                    k.src && (l.src = k.src);
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
                var V = r.alternate;
                if (V !== null) {
                  var oe = V.memoizedState;
                  if (oe !== null) {
                    var de = oe.dehydrated;
                    de !== null && Za(de);
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
              throw Error(R(163));
          }
          Rr || r.flags & 512 && Hd(r);
        } catch (ie) {
          vn(r, r.return, ie);
        }
      }
      if (r === n) {
        Fe = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Fe = l;
        break;
      }
      Fe = r.return;
    }
  }
  function js(n) {
    for (; Fe !== null; ) {
      var r = Fe;
      if (r === n) {
        Fe = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Fe = l;
        break;
      }
      Fe = r.return;
    }
  }
  function Id(n) {
    for (; Fe !== null; ) {
      var r = Fe;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (k) {
              vn(r, l, k);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (k) {
                vn(r, c, k);
              }
            }
            var d = r.return;
            try {
              Hd(r);
            } catch (k) {
              vn(r, d, k);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Hd(r);
            } catch (k) {
              vn(r, m, k);
            }
        }
      } catch (k) {
        vn(r, r.return, k);
      }
      if (r === n) {
        Fe = null;
        break;
      }
      var C = r.sibling;
      if (C !== null) {
        C.return = r.return, Fe = C;
        break;
      }
      Fe = r.return;
    }
  }
  var my = Math.ceil, zl = Le.ReactCurrentDispatcher, Du = Le.ReactCurrentOwner, sr = Le.ReactCurrentBatchConfig, Lt = 0, Gn = null, Pn = null, cr = 0, ya = 0, wo = Oa(0), kn = 0, As = null, Oi = 0, xo = 0, lf = 0, zs = null, na = null, Yd = 0, Ro = 1 / 0, ga = null, To = !1, Ou = null, Ul = null, uf = !1, Zi = null, Us = 0, Fl = 0, bo = null, Fs = -1, Tr = 0;
  function Hn() {
    return Lt & 6 ? mt() : Fs !== -1 ? Fs : Fs = mt();
  }
  function Ni(n) {
    return n.mode & 1 ? Lt & 2 && cr !== 0 ? cr & -cr : py.transition !== null ? (Tr === 0 && (Tr = Xu()), Tr) : (n = Ft, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ao(n.type)), n) : 1;
  }
  function Ar(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, bo = null, Error(R(185));
    Hi(n, l, o), (!(Lt & 2) || n !== Gn) && (n === Gn && (!(Lt & 2) && (xo |= l), kn === 4 && li(n, cr)), ra(n, o), l === 1 && Lt === 0 && !(r.mode & 1) && (Ro = mt() + 500, mo && xi()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Ja(n, n === Gn ? cr : 0);
    if (o === 0) l !== null && ir(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ir(l), r === 1) n.tag === 0 ? _l($d.bind(null, n)) : bc($d.bind(null, n)), fo(function() {
        !(Lt & 6) && xi();
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
            l = Gu;
            break;
          default:
            l = ru;
        }
        l = dh(l, of.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function of(n, r) {
    if (Fs = -1, Tr = 0, Lt & 6) throw Error(R(327));
    var l = n.callbackNode;
    if (_o() && n.callbackNode !== l) return null;
    var o = Ja(n, n === Gn ? cr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = sf(n, o);
    else {
      r = o;
      var c = Lt;
      Lt |= 2;
      var d = ah();
      (Gn !== n || cr !== r) && (ga = null, Ro = mt() + 500, el(n, r));
      do
        try {
          ih();
          break;
        } catch (C) {
          rh(n, C);
        }
      while (!0);
      Cd(), zl.current = d, Lt = c, Pn !== null ? r = 0 : (Gn = null, cr = 0, r = kn);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Ps(n, c))), r === 1) throw l = As, el(n, 0), li(n, o), ra(n, mt()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !yy(c) && (r = sf(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Ps(n, d))), r === 1)) throw l = As, el(n, 0), li(n, o), ra(n, mt()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(R(345));
          case 2:
            Mu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Yd + 500 - mt(), 10 < r)) {
              if (Ja(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Hn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = xc(Mu.bind(null, n, na, ga), r);
              break;
            }
            Mu(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Dr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = mt() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * my(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = xc(Mu.bind(null, n, na, ga), o);
              break;
            }
            Mu(n, na, ga);
            break;
          case 5:
            Mu(n, na, ga);
            break;
          default:
            throw Error(R(329));
        }
      }
    }
    return ra(n, mt()), n.callbackNode === l ? of.bind(null, n) : null;
  }
  function Ps(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = sf(n, r), n !== 2 && (r = na, na = l, r !== null && Nu(r)), n;
  }
  function Nu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function yy(n) {
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
    for (r &= ~lf, r &= ~xo, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Dr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function $d(n) {
    if (Lt & 6) throw Error(R(327));
    _o();
    var r = Ja(n, 0);
    if (!(r & 1)) return ra(n, mt()), null;
    var l = sf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Ps(n, o));
    }
    if (l === 1) throw l = As, el(n, 0), li(n, r), ra(n, mt()), l;
    if (l === 6) throw Error(R(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Mu(n, na, ga), ra(n, mt()), null;
  }
  function Qd(n, r) {
    var l = Lt;
    Lt |= 1;
    try {
      return n(r);
    } finally {
      Lt = l, Lt === 0 && (Ro = mt() + 500, mo && xi());
    }
  }
  function Lu(n) {
    Zi !== null && Zi.tag === 0 && !(Lt & 6) && _o();
    var r = Lt;
    Lt |= 1;
    var l = sr.transition, o = Ft;
    try {
      if (sr.transition = null, Ft = 1, n) return n();
    } finally {
      Ft = o, sr.transition = l, Lt = r, !(Lt & 6) && xi();
    }
  }
  function Wd() {
    ya = wo.current, on(wo);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, md(l)), Pn !== null) for (l = Pn.return; l !== null; ) {
      var o = l;
      switch (kc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && ho();
          break;
        case 3:
          Eu(), on(Qn), on(Cn), Xe();
          break;
        case 5:
          Lc(o);
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
          wd(o.type._context);
          break;
        case 22:
        case 23:
          Wd();
      }
      l = l.return;
    }
    if (Gn = n, Pn = n = Pl(n.current, null), cr = ya = r, kn = 0, As = null, lf = xo = Oi = 0, na = zs = null, gu !== null) {
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
  function rh(n, r) {
    do {
      var l = Pn;
      try {
        if (Cd(), xt.current = bu, jc) {
          for (var o = Ht.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          jc = !1;
        }
        if (Zt = 0, Zn = zn = Ht = null, ms = !1, Cu = 0, Du.current = null, l === null || l.return === null) {
          kn = 1, As = r, Pn = null;
          break;
        }
        e: {
          var d = n, m = l.return, C = l, k = r;
          if (r = cr, C.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var V = k, oe = C, de = oe.tag;
            if (!(oe.mode & 1) && (de === 0 || de === 11 || de === 15)) {
              var ie = oe.alternate;
              ie ? (oe.updateQueue = ie.updateQueue, oe.memoizedState = ie.memoizedState, oe.lanes = ie.lanes) : (oe.updateQueue = null, oe.memoizedState = null);
            }
            var Me = Yv(m);
            if (Me !== null) {
              Me.flags &= -257, Al(Me, m, C, d, r), Me.mode & 1 && Ad(d, V, r), r = Me, k = V;
              var Be = r.updateQueue;
              if (Be === null) {
                var $e = /* @__PURE__ */ new Set();
                $e.add(k), r.updateQueue = $e;
              } else Be.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                Ad(d, V, r), Gd();
                break e;
              }
              k = Error(R(426));
            }
          } else if (pn && C.mode & 1) {
            var Dn = Yv(m);
            if (Dn !== null) {
              !(Dn.flags & 65536) && (Dn.flags |= 256), Al(Dn, m, C, d, r), qi(_u(k, C));
              break e;
            }
          }
          d = k = _u(k, C), kn !== 4 && (kn = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var L = Iv(d, k, r);
                Fv(d, L);
                break e;
              case 1:
                C = k;
                var O = d.type, z = d.stateNode;
                if (!(d.flags & 128) && (typeof O.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (Ul === null || !Ul.has(z)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var se = jd(d, C, r);
                  Fv(d, se);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        uh(l);
      } catch (Ie) {
        r = Ie, Pn === l && l !== null && (Pn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ah() {
    var n = zl.current;
    return zl.current = bu, n === null ? bu : n;
  }
  function Gd() {
    (kn === 0 || kn === 3 || kn === 2) && (kn = 4), Gn === null || !(Oi & 268435455) && !(xo & 268435455) || li(Gn, cr);
  }
  function sf(n, r) {
    var l = Lt;
    Lt |= 2;
    var o = ah();
    (Gn !== n || cr !== r) && (ga = null, el(n, r));
    do
      try {
        gy();
        break;
      } catch (c) {
        rh(n, c);
      }
    while (!0);
    if (Cd(), Lt = l, zl.current = o, Pn !== null) throw Error(R(261));
    return Gn = null, cr = 0, kn;
  }
  function gy() {
    for (; Pn !== null; ) lh(Pn);
  }
  function ih() {
    for (; Pn !== null && !Ga(); ) lh(Pn);
  }
  function lh(n) {
    var r = fh(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? uh(n) : Pn = r, Du.current = null;
  }
  function uh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = nf(l, r), l !== null) {
          l.flags &= 32767, Pn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          kn = 6, Pn = null;
          return;
        }
      } else if (l = Xv(l, r, ya), l !== null) {
        Pn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Pn = r;
        return;
      }
      Pn = r = n;
    } while (r !== null);
    kn === 0 && (kn = 5);
  }
  function Mu(n, r, l) {
    var o = Ft, c = sr.transition;
    try {
      sr.transition = null, Ft = 1, Sy(n, r, l, o);
    } finally {
      sr.transition = c, Ft = o;
    }
    return null;
  }
  function Sy(n, r, l, o) {
    do
      _o();
    while (Zi !== null);
    if (Lt & 6) throw Error(R(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(R(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (qf(n, d), n === Gn && (Pn = Gn = null, cr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || uf || (uf = !0, dh(ru, function() {
      return _o(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = sr.transition, sr.transition = null;
      var m = Ft;
      Ft = 1;
      var C = Lt;
      Lt |= 4, Du.current = null, Zv(n, l), Vd(l, n), uo(pu), _a = !!ls, pu = ls = null, n.current = l, hy(l), qa(), Lt = C, Ft = m, sr.transition = d;
    } else n.current = l;
    if (uf && (uf = !1, Zi = n, Us = c), d = n.pendingLanes, d === 0 && (Ul = null), Qo(l.stateNode), ra(n, mt()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (To) throw To = !1, n = Ou, Ou = null, n;
    return Us & 1 && n.tag !== 0 && _o(), d = n.pendingLanes, d & 1 ? n === bo ? Fl++ : (Fl = 0, bo = n) : Fl = 0, xi(), null;
  }
  function _o() {
    if (Zi !== null) {
      var n = Zu(Us), r = sr.transition, l = Ft;
      try {
        if (sr.transition = null, Ft = 16 > n ? 16 : n, Zi === null) var o = !1;
        else {
          if (n = Zi, Zi = null, Us = 0, Lt & 6) throw Error(R(331));
          var c = Lt;
          for (Lt |= 4, Fe = n.current; Fe !== null; ) {
            var d = Fe, m = d.child;
            if (Fe.flags & 16) {
              var C = d.deletions;
              if (C !== null) {
                for (var k = 0; k < C.length; k++) {
                  var V = C[k];
                  for (Fe = V; Fe !== null; ) {
                    var oe = Fe;
                    switch (oe.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ns(8, oe, d);
                    }
                    var de = oe.child;
                    if (de !== null) de.return = oe, Fe = de;
                    else for (; Fe !== null; ) {
                      oe = Fe;
                      var ie = oe.sibling, Me = oe.return;
                      if (af(oe), oe === V) {
                        Fe = null;
                        break;
                      }
                      if (ie !== null) {
                        ie.return = Me, Fe = ie;
                        break;
                      }
                      Fe = Me;
                    }
                  }
                }
                var Be = d.alternate;
                if (Be !== null) {
                  var $e = Be.child;
                  if ($e !== null) {
                    Be.child = null;
                    do {
                      var Dn = $e.sibling;
                      $e.sibling = null, $e = Dn;
                    } while ($e !== null);
                  }
                }
                Fe = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, Fe = m;
            else e: for (; Fe !== null; ) {
              if (d = Fe, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Ns(9, d, d.return);
              }
              var L = d.sibling;
              if (L !== null) {
                L.return = d.return, Fe = L;
                break e;
              }
              Fe = d.return;
            }
          }
          var O = n.current;
          for (Fe = O; Fe !== null; ) {
            m = Fe;
            var z = m.child;
            if (m.subtreeFlags & 2064 && z !== null) z.return = m, Fe = z;
            else e: for (m = O; Fe !== null; ) {
              if (C = Fe, C.flags & 2048) try {
                switch (C.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, C);
                }
              } catch (Ie) {
                vn(C, C.return, Ie);
              }
              if (C === m) {
                Fe = null;
                break e;
              }
              var se = C.sibling;
              if (se !== null) {
                se.return = C.return, Fe = se;
                break e;
              }
              Fe = C.return;
            }
          }
          if (Lt = c, xi(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ft = l, sr.transition = r;
      }
    }
    return !1;
  }
  function oh(n, r, l) {
    r = _u(l, r), r = Iv(n, r, 1), n = Ll(n, r, 1), r = Hn(), n !== null && (Hi(n, 1, r), ra(n, r));
  }
  function vn(n, r, l) {
    if (n.tag === 3) oh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        oh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Ul === null || !Ul.has(o))) {
          n = _u(l, n), n = jd(r, n, 1), r = Ll(r, n, 1), n = Hn(), r !== null && (Hi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Ey(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Hn(), n.pingedLanes |= n.suspendedLanes & l, Gn === n && (cr & l) === l && (kn === 4 || kn === 3 && (cr & 130023424) === cr && 500 > mt() - Yd ? el(n, 0) : lf |= l), ra(n, r);
  }
  function sh(n, r) {
    r === 0 && (n.mode & 1 ? (r = da, da <<= 1, !(da & 130023424) && (da = 4194304)) : r = 1);
    var l = Hn();
    n = ha(n, r), n !== null && (Hi(n, r, l), ra(n, l));
  }
  function Cy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), sh(n, l);
  }
  function ch(n, r) {
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
        throw Error(R(314));
    }
    o !== null && o.delete(r), sh(n, l);
  }
  var fh;
  fh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Qn.current) Un = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Un = !1, ks(n, r, l);
      Un = !!(n.flags & 131072);
    }
    else Un = !1, pn && r.flags & 1048576 && jv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        ja(n, r), n = r.pendingProps;
        var c = qr(r, Cn.current);
        gn(r, l), c = Ml(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, jn(o) ? (d = !0, Jn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, bd(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, xs(r, o, n, l), r = bs(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && _c(r), or(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (ja(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = xy(o), n = ai(o, n), c) {
            case 0:
              r = $v(null, r, o, n, l);
              break e;
            case 1:
              r = Qv(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = ku(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(R(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Qv(n, r, o, c, l);
      case 3:
        e: {
          if (Eo(r), n === null) throw Error(R(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Uv(n, r), fs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(R(423)), r), r = Wv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(R(424)), r), r = Wv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, pn = !0, La = null, l = De(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Nl(), o === c) {
              r = Aa(n, r, l);
              break e;
            }
            or(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Pv(r), n === null && Sd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, wc(o, c) ? m = null : d !== null && wc(o, d) && (r.flags |= 32), zd(n, r), or(n, r, m, l), r.child;
      case 6:
        return n === null && Sd(r), null;
      case 13:
        return tf(n, r, l);
      case 4:
        return kd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = Tn(r, null, o, l) : or(n, r, o, l), r.child;
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
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, qe(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Qn.current) {
              r = Aa(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var C = d.dependencies;
            if (C !== null) {
              m = d.child;
              for (var k = C.firstContext; k !== null; ) {
                if (k.context === o) {
                  if (d.tag === 1) {
                    k = Ki(-1, l & -l), k.tag = 2;
                    var V = d.updateQueue;
                    if (V !== null) {
                      V = V.shared;
                      var oe = V.pending;
                      oe === null ? k.next = k : (k.next = oe.next, oe.next = k), V.pending = k;
                    }
                  }
                  d.lanes |= l, k = d.alternate, k !== null && (k.lanes |= l), xd(
                    d.return,
                    l,
                    r
                  ), C.lanes |= l;
                  break;
                }
                k = k.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(R(341));
              m.lanes |= l, C = m.alternate, C !== null && (C.lanes |= l), xd(m, l, r), m = d.sibling;
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
        return c = r.type, o = r.pendingProps.children, gn(r, l), c = Ma(c), o = o(c), r.flags |= 1, or(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), ku(n, r, o, c, l);
      case 15:
        return yt(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ja(n, r), r.tag = 1, jn(o) ? (n = !0, Jn(r)) : n = !1, gn(r, l), Jc(r, o, c), xs(r, o, c, l), bs(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return Ts(n, r, l);
    }
    throw Error(R(156, r.tag));
  };
  function dh(n, r) {
    return cn(n, r);
  }
  function wy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ua(n, r, l, o) {
    return new wy(n, r, l, o);
  }
  function qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function xy(n) {
    if (typeof n == "function") return qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === et) return 11;
      if (n === _t) return 14;
    }
    return 2;
  }
  function Pl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Ua(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") qd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case P:
        return tl(l.children, c, d, r);
      case fe:
        m = 8, c |= 8;
        break;
      case ue:
        return n = Ua(12, l, r, c | 2), n.elementType = ue, n.lanes = d, n;
      case Re:
        return n = Ua(13, l, r, c), n.elementType = Re, n.lanes = d, n;
      case bt:
        return n = Ua(19, l, r, c), n.elementType = bt, n.lanes = d, n;
      case Pe:
        return Hl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case xe:
            m = 10;
            break e;
          case Ve:
            m = 9;
            break e;
          case et:
            m = 11;
            break e;
          case _t:
            m = 14;
            break e;
          case Dt:
            m = 16, o = null;
            break e;
        }
        throw Error(R(130, n == null ? n : typeof n, ""));
    }
    return r = Ua(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = Ua(7, n, o, r), n.lanes = l, n;
  }
  function Hl(n, r, l, o) {
    return n = Ua(22, n, o, r), n.elementType = Pe, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Kd(n, r, l) {
    return n = Ua(6, n, null, r), n.lanes = l, n;
  }
  function cf(n, r, l) {
    return r = Ua(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function ph(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ju(0), this.expirationTimes = Ju(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ju(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ff(n, r, l, o, c, d, m, C, k) {
    return n = new ph(n, r, l, C, k), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Ua(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, bd(d), n;
  }
  function Ry(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Ee, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Xd(n) {
    if (!n) return wr;
    n = n._reactInternals;
    e: {
      if (ht(n) !== n || n.tag !== 1) throw Error(R(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (jn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(R(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (jn(l)) return ss(n, l, r);
    }
    return r;
  }
  function vh(n, r, l, o, c, d, m, C, k) {
    return n = ff(l, o, !0, n, c, d, m, C, k), n.context = Xd(null), l = n.current, o = Hn(), c = Ni(l), d = Ki(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Hi(n, c, o), ra(n, o), n;
  }
  function df(n, r, l, o) {
    var c = r.current, d = Hn(), m = Ni(c);
    return l = Xd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (Ar(n, c, m, d), Nc(n, c, m)), m;
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
  function Jd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function vf(n, r) {
    Jd(n, r), (n = n.alternate) && Jd(n, r);
  }
  function hh() {
    return null;
  }
  var ju = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Zd(n) {
    this._internalRoot = n;
  }
  hf.prototype.render = Zd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(R(409));
    df(n, r, null, null);
  }, hf.prototype.unmount = Zd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Lu(function() {
        df(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function hf(n) {
    this._internalRoot = n;
  }
  hf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = st();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < $n.length && r !== 0 && r < $n[l].priority; l++) ;
      $n.splice(l, 0, n), l === 0 && qo(n);
    }
  };
  function ep(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function mf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function mh() {
  }
  function Ty(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var V = pf(m);
          d.call(V);
        };
      }
      var m = vh(r, o, n, 0, null, !1, !1, "", mh);
      return n._reactRootContainer = m, n[Qi] = m.current, so(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var C = o;
      o = function() {
        var V = pf(k);
        C.call(V);
      };
    }
    var k = ff(n, 0, !1, null, null, !1, !1, "", mh);
    return n._reactRootContainer = k, n[Qi] = k.current, so(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      df(r, k, l, o);
    }), k;
  }
  function Vs(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var C = c;
        c = function() {
          var k = pf(m);
          C.call(k);
        };
      }
      df(r, m, n, c);
    } else m = Ty(l, r, n, c, o);
    return pf(m);
  }
  At = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, mt()), !(Lt & 6) && (Ro = mt() + 500, xi()));
        }
        break;
      case 13:
        Lu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Hn();
            Ar(o, n, 1, c);
          }
        }), vf(n, 1);
    }
  }, Wo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Hn();
        Ar(r, n, 134217728, l);
      }
      vf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Ni(n), l = ha(n, r);
      if (l !== null) {
        var o = Hn();
        Ar(l, n, r, o);
      }
      vf(n, r);
    }
  }, st = function() {
    return Ft;
  }, eo = function(n, r) {
    var l = Ft;
    try {
      return Ft = n, r();
    } finally {
      Ft = l;
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
              if (!c) throw Error(R(90));
              br(o), $r(o, c);
            }
          }
        }
        break;
      case "textarea":
        $a(n, l);
        break;
      case "select":
        r = l.value, r != null && xn(n, !!l.multiple, r, !1);
    }
  }, eu = Qd, pl = Lu;
  var by = { usingClientEntryPoint: !1, Events: [Ke, ni, yn, Pi, Zl, Qd] }, Bs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, yh = { bundleType: Bs.bundleType, version: Bs.version, rendererPackageName: Bs.rendererPackageName, rendererConfig: Bs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Le.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Rn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Bs.findFiberByHostInstance || hh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(yh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = by, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ep(r)) throw Error(R(200));
    return Ry(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!ep(n)) throw Error(R(299));
    var l = !1, o = "", c = ju;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ff(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, so(n.nodeType === 8 ? n.parentNode : n), new Zd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(R(188)) : (n = Object.keys(n).join(","), Error(R(268, n)));
    return n = Rn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Lu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!mf(r)) throw Error(R(200));
    return Vs(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!ep(n)) throw Error(R(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = ju;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = vh(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, so(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new hf(r);
  }, Ia.render = function(n, r, l) {
    if (!mf(r)) throw Error(R(200));
    return Vs(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!mf(n)) throw Error(R(40));
    return n._reactRootContainer ? (Lu(function() {
      Vs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = Qd, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!mf(l)) throw Error(R(200));
    if (n == null || n._reactInternals === void 0) throw Error(R(38));
    return Vs(n, r, l, !1, o);
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
var dx;
function dk() {
  return dx || (dx = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var _ = q, w = hx(), R = _.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, J = !1;
    function Z(e) {
      J = e;
    }
    function A(e) {
      if (!J) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        le("warn", e, a);
      }
    }
    function g(e) {
      if (!J) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        le("error", e, a);
      }
    }
    function le(e, t, a) {
      {
        var i = R.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var U = 0, Q = 1, ke = 2, Y = 3, ee = 4, te = 5, ne = 6, K = 7, Ce = 8, Ue = 9, ce = 10, ye = 11, Le = 12, he = 13, Ee = 14, P = 15, fe = 16, ue = 17, xe = 18, Ve = 19, et = 21, Re = 22, bt = 23, _t = 24, Dt = 25, Pe = !0, me = !1, ge = !1, ve = !1, b = !1, I = !0, Qe = !0, Ae = !0, at = !0, ut = /* @__PURE__ */ new Set(), ct = {}, ft = {};
    function gt(e, t) {
      Wt(e, t), Wt(e + "Capture", t);
    }
    function Wt(e, t) {
      ct[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), ct[e] = t;
      {
        var a = e.toLowerCase();
        ft[a] = e, e === "onDoubleClick" && (ft.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        ut.add(t[i]);
    }
    var Nn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
    function wn(e) {
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
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, wn(e)), Bn(e);
    }
    function $r(e) {
      if (rr(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", wn(e)), Bn(e);
    }
    function ci(e, t) {
      if (rr(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, wn(e)), Bn(e);
    }
    function sa(e, t) {
      if (rr(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, wn(e)), Bn(e);
    }
    function Kn(e) {
      if (rr(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", wn(e)), Bn(e);
    }
    function xn(e) {
      if (rr(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", wn(e)), Bn(e);
    }
    var Yn = 0, Sr = 1, $a = 2, Ln = 3, Er = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", we = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", We = new RegExp("^[" + fi + "][" + we + "]*$"), Et = {}, Yt = {};
    function rn(e) {
      return br.call(Yt, e) ? !0 : br.call(Et, e) ? !1 : We.test(e) ? (Yt[e] = !0, !0) : (Et[e] = !0, g("Invalid attribute name: `%s`", e), !1);
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
    function an(e) {
      return qt.hasOwnProperty(e) ? qt[e] : null;
    }
    function Gt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Ln || t === Er, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
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
      qt[e] = new Gt(
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
    var Cr = /[\-\:]([a-z])/g, Ra = function(e) {
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
      var t = e.replace(Cr, Ra);
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
      var t = e.replace(Cr, Ra);
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
      var t = e.replace(Cr, Ra);
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
    var Pi = "xlinkHref";
    qt[Pi] = new Gt(
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
          if (i.type === Ln)
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
            e[p] = v === Ln ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, S = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var N = u.type, D;
          N === Ln || N === Er && a === !0 ? D = "" : (In(a, y), D = "" + a, u.sanitizeURL && pl(D.toString())), S ? e.setAttributeNS(S, y, D) : e.setAttribute(y, D);
        }
      }
    }
    var kr = Symbol.for("react.element"), ar = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), T = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), _e = Symbol.for("react.suspense"), He = Symbol.for("react.suspense_list"), ht = Symbol.for("react.memo"), dt = Symbol.for("react.lazy"), Rt = Symbol.for("react.scope"), wt = Symbol.for("react.debug_trace_mode"), Rn = Symbol.for("react.offscreen"), ln = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), ir = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function mt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var St = Object.assign, Ka = 0, nu, ru, hl, Gu, ml, Qr, Qo;
    function Dr() {
    }
    Dr.__reactDisabledLog = !0;
    function uc() {
      {
        if (Ka === 0) {
          nu = console.log, ru = console.info, hl = console.warn, Gu = console.error, ml = console.group, Qr = console.groupCollapsed, Qo = console.groupEnd;
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
            log: St({}, e, {
              value: nu
            }),
            info: St({}, e, {
              value: ru
            }),
            warn: St({}, e, {
              value: hl
            }),
            error: St({}, e, {
              value: Gu
            }),
            group: St({}, e, {
              value: ml
            }),
            groupCollapsed: St({}, e, {
              value: Qr
            }),
            groupEnd: St({}, e, {
              value: Qo
            })
          });
        }
        Ka < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var qu = R.ReactCurrentDispatcher, yl;
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
      var Ku = typeof WeakMap == "function" ? WeakMap : Map;
      Ja = new Ku();
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
      s = qu.current, qu.current = null, uc();
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
            } catch (B) {
              i = B;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (B) {
              i = B;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (B) {
            i = B;
          }
          e();
        }
      } catch (B) {
        if (B && i && typeof B.stack == "string") {
          for (var p = B.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, S = v.length - 1; y >= 1 && S >= 0 && p[y] !== v[S]; )
            S--;
          for (; y >= 1 && S >= 0; y--, S--)
            if (p[y] !== v[S]) {
              if (y !== 1 || S !== 1)
                do
                  if (y--, S--, S < 0 || p[y] !== v[S]) {
                    var N = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", e.displayName)), typeof e == "function" && Ja.set(e, N), N;
                  }
                while (y >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, qu.current = s, oc(), Error.prepareStackTrace = u;
      }
      var D = e ? e.displayName || e.name : "", F = D ? da(D) : "";
      return typeof e == "function" && Ja.set(e, F), F;
    }
    function gl(e, t, a) {
      return au(e, !0);
    }
    function Xu(e, t, a) {
      return au(e, !1);
    }
    function Ju(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Hi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return au(e, Ju(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case _e:
          return da("Suspense");
        case He:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case re:
            return Xu(e.render);
          case ht:
            return Hi(e.type, t, a);
          case dt: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Hi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case te:
          return da(e.type);
        case fe:
          return da("Lazy");
        case he:
          return da("Suspense");
        case Ve:
          return da("SuspenseList");
        case U:
        case ke:
        case P:
          return Xu(e.type);
        case ye:
          return Xu(e.type.render);
        case Q:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += qf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ft(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Zu(e) {
      return e.displayName || "Context";
    }
    function At(e) {
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
        case _e:
          return "Suspense";
        case He:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case T:
            var t = e;
            return Zu(t) + ".Consumer";
          case vi:
            var a = e;
            return Zu(a._context) + ".Provider";
          case re:
            return Ft(e, e.render, "ForwardRef");
          case ht:
            var i = e.displayName || null;
            return i !== null ? i : At(e.type) || "Memo";
          case dt: {
            var u = e, s = u._payload, f = u._init;
            try {
              return At(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Wo(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function hi(e) {
      return e.displayName || "Context";
    }
    function st(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case _t:
          return "Cache";
        case Ue:
          var i = a;
          return hi(i) + ".Consumer";
        case ce:
          var u = a;
          return hi(u._context) + ".Provider";
        case xe:
          return "DehydratedFragment";
        case ye:
          return Wo(a, a.render, "ForwardRef");
        case K:
          return "Fragment";
        case te:
          return a;
        case ee:
          return "Portal";
        case Y:
          return "Root";
        case ne:
          return "Text";
        case fe:
          return At(a);
        case Ce:
          return a === Wa ? "StrictMode" : "Mode";
        case Re:
          return "Offscreen";
        case Le:
          return "Profiler";
        case et:
          return "Scope";
        case he:
          return "Suspense";
        case Ve:
          return "SuspenseList";
        case Dt:
          return "TracingMarker";
        case Q:
        case U:
        case ue:
        case ke:
        case Ee:
        case P:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var eo = R.ReactDebugCurrentFrame, lr = null, mi = !1;
    function Or() {
      {
        if (lr === null)
          return null;
        var e = lr._debugOwner;
        if (e !== null && typeof e < "u")
          return st(e);
      }
      return null;
    }
    function yi() {
      return lr === null ? "" : Vi(lr);
    }
    function fn() {
      eo.getCurrentStack = null, lr = null, mi = !1;
    }
    function Kt(e) {
      eo.getCurrentStack = e === null ? null : yi, lr = e, mi = !1;
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
    function Ta(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return xn(e), e;
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
    function Go(e, t) {
      iu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function El(e) {
      return e._valueTracker;
    }
    function lu(e) {
      e._valueTracker = null;
    }
    function Kf(e) {
      var t = "";
      return e && (qo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ba(e) {
      var t = qo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      xn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            xn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            xn(p), i = "" + p;
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
      var a = t.getValue(), i = Kf(e);
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
    var to = !1, no = !1, Cl = !1, uu = !1;
    function ro(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ao(e, t) {
      var a = e, i = t.checked, u = St({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ei(e, t) {
      Go("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !no && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), no = !0), t.value !== void 0 && t.defaultValue !== void 0 && !to && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), to = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Ta(t.value != null ? t.value : i),
        controlled: ro(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && _r(a, "checked", i, !1);
    }
    function x(e, t) {
      var a = e;
      {
        var i = ro(t);
        !a._wrapperState.controlled && i && !uu && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uu = !0), a._wrapperState.controlled && !i && !Cl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Cl = !0);
      }
      h(e, t);
      var u = Ta(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Nr(u)) : a.value !== Nr(u) && (a.value = Nr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Je(a, t.type, u) : t.hasOwnProperty("defaultValue") && Je(a, t.type, Ta(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function H(e, t, a) {
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
    function $(e, t) {
      var a = e;
      x(a, t), Se(a, t);
    }
    function Se(e, t) {
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
            gi(f), x(f, p);
          }
        }
      }
    }
    function Je(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Nr(e._wrapperState.initialValue) : e.defaultValue !== Nr(a) && (e.defaultValue = Nr(a)));
    }
    var be = !1, nt = !1, Tt = !1;
    function zt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? _.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || nt || (nt = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Tt || (Tt = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !be && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), be = !0);
    }
    function un(e, t) {
      t.value != null && e.setAttribute("value", Nr(Ta(t.value)));
    }
    var Xt = Array.isArray;
    function Ct(e) {
      return Xt(e);
    }
    var Jt;
    Jt = !1;
    function mn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var wl = ["value", "defaultValue"];
    function Ko(e) {
      {
        Go("select", e);
        for (var t = 0; t < wl.length; t++) {
          var a = wl[t];
          if (e[a] != null) {
            var i = Ct(e[a]);
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
        for (var S = Nr(Ta(a)), N = null, D = 0; D < u.length; D++) {
          if (u[D].value === S) {
            u[D].selected = !0, i && (u[D].defaultSelected = !0);
            return;
          }
          N === null && !u[D].disabled && (N = u[D]);
        }
        N !== null && (N.selected = !0);
      }
    }
    function Xo(e, t) {
      return St({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      Ko(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Jt && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Jt = !0);
    }
    function Xf(e, t) {
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
    function Jf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var av = !1;
    function Zf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = St({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Nr(a._wrapperState.initialValue)
      });
      return i;
    }
    function ed(e, t) {
      var a = e;
      Go("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !av && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), av = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Ct(u)) {
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
        initialValue: Ta(i)
      };
    }
    function iv(e, t) {
      var a = e, i = Ta(t.value), u = Ta(t.defaultValue);
      if (i != null) {
        var s = Nr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Nr(u));
    }
    function lv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ty(e, t) {
      iv(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", td = "http://www.w3.org/1998/Math/MathML", nd = "http://www.w3.org/2000/svg";
    function rd(e) {
      switch (e) {
        case "svg":
          return nd;
        case "math":
          return td;
        default:
          return Ii;
      }
    }
    function ad(e, t) {
      return e == null || e === Ii ? rd(t) : e === nd && t === "foreignObject" ? Ii : e;
    }
    var uv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, cc, ov = uv(function(e, t) {
      if (e.namespaceURI === nd && !("innerHTML" in e)) {
        cc = cc || document.createElement("div"), cc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = cc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, Mn = 8, $i = 9, id = 11, io = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Jo = {
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
    function sv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var cv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Zo).forEach(function(e) {
      cv.forEach(function(t) {
        Zo[sv(t, e)] = Zo[e];
      });
    });
    function fc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Zo.hasOwnProperty(e) && Zo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var fv = /([A-Z])/g, dv = /^ms-/;
    function lo(e) {
      return e.replace(fv, "-$1").toLowerCase().replace(dv, "-ms-");
    }
    var pv = function() {
    };
    {
      var ny = /^(?:webkit|moz|o)[A-Z]/, ry = /^-ms-/, vv = /-(.)/g, ld = /;\s*$/, Si = {}, su = {}, hv = !1, es = !1, ay = function(e) {
        return e.replace(vv, function(t, a) {
          return a.toUpperCase();
        });
      }, mv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ay(e.replace(ry, "ms-"))
        ));
      }, ud = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, od = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(ld, "")));
      }, yv = function(e, t) {
        hv || (hv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, gv = function(e, t) {
        es || (es = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      pv = function(e, t) {
        e.indexOf("-") > -1 ? mv(e) : ny.test(e) ? ud(e) : ld.test(t) && od(e, t), typeof t == "number" && (isNaN(t) ? yv(e, t) : isFinite(t) || gv(e, t));
      };
    }
    var Sv = pv;
    function iy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : lo(i)) + ":", t += fc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function Ev(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || Sv(i, t[i]);
          var s = fc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ly(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Cv(e) {
      var t = {};
      for (var a in e)
        for (var i = Jo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function uy(e, t) {
      {
        if (!t)
          return;
        var a = Cv(e), i = Cv(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ly(e[f]) ? "Removing" : "Updating", f, p);
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
    }, ts = St({
      menuitem: !0
    }, ti), wv = "__html";
    function dc(e, t) {
      if (t) {
        if (ts[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(wv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function xl(e, t) {
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
    var ns = {
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
    }, uo = {}, oy = new RegExp("^(aria)-[" + we + "]*$"), oo = new RegExp("^(aria)[A-Z][" + we + "]*$");
    function sd(e, t) {
      {
        if (br.call(uo, t) && uo[t])
          return !0;
        if (oo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), uo[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), uo[t] = !0, !0;
        }
        if (oy.test(t)) {
          var u = t.toLowerCase(), s = pc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return uo[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), uo[t] = !0, !0;
        }
      }
      return !0;
    }
    function rs(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = sd(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function cd(e, t) {
      xl(e, t) || rs(e, t);
    }
    var fd = !1;
    function vc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !fd && (fd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var ur = {}, dd = /^on./, hc = /^on[^A-Z]/, xv = new RegExp("^(aria)-[" + we + "]*$"), Rv = new RegExp("^(aria)[A-Z][" + we + "]*$");
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
          if (dd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), ur[t] = !0, !0;
        } else if (dd.test(t))
          return hc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ur[t] = !0, !0;
        if (xv.test(t) || Rv.test(t))
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
        if (ns.hasOwnProperty(u)) {
          var S = ns[u];
          if (S !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, S), ur[t] = !0, !0;
        } else if (!y && t !== u)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), ur[t] = !0, !0;
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ur[t] = !0, !0) : y ? !0 : sn(t, a, v, !1) ? (ur[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ur[t] = !0), !0);
      };
    }
    var Tv = function(e, t, a) {
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
    function bv(e, t, a) {
      xl(e, t) || Tv(e, t, a);
    }
    var pd = 1, mc = 2, ka = 4, vd = pd | mc | ka, fu = null;
    function sy(e) {
      fu !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function cy() {
      fu === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function as(e) {
      return e === fu;
    }
    function hd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var yc = null, du = null, $t = null;
    function gc(e) {
      var t = Oo(e);
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
    function so(e) {
      du ? $t ? $t.push(e) : $t = [e] : du = e;
    }
    function _v() {
      return du !== null || $t !== null;
    }
    function Ec() {
      if (du) {
        var e = du, t = $t;
        if (du = null, $t = null, gc(e), t)
          for (var a = 0; a < t.length; a++)
            gc(t[a]);
      }
    }
    var co = function(e, t) {
      return e(t);
    }, is = function() {
    }, Rl = !1;
    function kv() {
      var e = _v();
      e && (is(), Ec());
    }
    function Dv(e, t, a) {
      if (Rl)
        return e(t, a);
      Rl = !0;
      try {
        return co(e, t, a);
      } finally {
        Rl = !1, kv();
      }
    }
    function fy(e, t, a) {
      co = e, is = a;
    }
    function Ov(e) {
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
          return !!(a.disabled && Ov(t));
        default:
          return !1;
      }
    }
    function Tl(e, t) {
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
    var ls = !1;
    if (Nn)
      try {
        var pu = {};
        Object.defineProperty(pu, "passive", {
          get: function() {
            ls = !0;
          }
        }), window.addEventListener("test", pu, pu), window.removeEventListener("test", pu, pu);
      } catch {
        ls = !1;
      }
    function wc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (S) {
        this.onError(S);
      }
    }
    var xc = wc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var md = document.createElement("react");
      xc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var S = document.createEvent("Event"), N = !1, D = !0, F = window.event, B = Object.getOwnPropertyDescriptor(window, "event");
        function W() {
          md.removeEventListener(G, Ze, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = F);
        }
        var Oe = Array.prototype.slice.call(arguments, 3);
        function Ze() {
          N = !0, W(), a.apply(i, Oe), D = !1;
        }
        var Ge, jt = !1, kt = !1;
        function M(j) {
          if (Ge = j.error, jt = !0, Ge === null && j.colno === 0 && j.lineno === 0 && (kt = !0), j.defaultPrevented && Ge != null && typeof Ge == "object")
            try {
              Ge._suppressLogging = !0;
            } catch {
            }
        }
        var G = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", M), md.addEventListener(G, Ze, !1), S.initEvent(G, !1, !1), md.dispatchEvent(S), B && Object.defineProperty(window, "event", B), N && D && (jt ? kt && (Ge = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ge = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ge)), window.removeEventListener("error", M), !N)
          return W(), wc.apply(this, arguments);
      };
    }
    var Nv = xc, fo = !1, Rc = null, po = !1, Ei = null, Lv = {
      onError: function(e) {
        fo = !0, Rc = e;
      }
    };
    function bl(e, t, a, i, u, s, f, p, v) {
      fo = !1, Rc = null, Nv.apply(Lv, arguments);
    }
    function Ci(e, t, a, i, u, s, f, p, v) {
      if (bl.apply(this, arguments), fo) {
        var y = os();
        po || (po = !0, Ei = y);
      }
    }
    function us() {
      if (po) {
        var e = Ei;
        throw po = !1, Ei = null, e;
      }
    }
    function Qi() {
      return fo;
    }
    function os() {
      if (fo) {
        var e = Rc;
        return fo = !1, Rc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function vo(e) {
      return e._reactInternals;
    }
    function dy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var Ke = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), yn = (
      /*                    */
      2
    ), Nt = (
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
    ), qe = (
      /*                   */
      128
    ), wr = (
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
    ), jn = (
      /*                   */
      8192
    ), ho = (
      /*             */
      16384
    ), Mv = (
      /*               */
      32767
    ), ss = (
      /*                   */
      32768
    ), Jn = (
      /*                */
      65536
    ), Tc = (
      /* */
      131072
    ), wi = (
      /*                       */
      1048576
    ), mo = (
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
    ), xi = (
      /*              */
      33554432
    ), kl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Nt | Qn | 0
    ), Dl = yn | Nt | Da | Oa | Cn | qr | jn, Ol = Nt | on | Cn | jn, Gi = Gr | Da, An = Wi | bc | mo, Na = R.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yn | qr)) !== Ke && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === Y ? a : null;
    }
    function Ri(e) {
      if (e.tag === he) {
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
    function Ti(e) {
      return e.tag === Y ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function jv(e) {
      {
        var t = Na.current;
        if (t !== null && t.tag === Q) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", st(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = vo(e);
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
      if (i.tag !== Y)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = kc(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === te || e.tag === ne)
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
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== ee) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var yd = w.unstable_scheduleCallback, Av = w.unstable_cancelCallback, gd = w.unstable_shouldYield, Sd = w.unstable_requestPaint, Wn = w.unstable_now, Dc = w.unstable_getCurrentPriorityLevel, cs = w.unstable_ImmediatePriority, Nl = w.unstable_UserBlockingPriority, qi = w.unstable_NormalPriority, py = w.unstable_LowPriority, mu = w.unstable_IdlePriority, Oc = w.unstable_yieldValue, zv = w.unstable_setDisableYieldValue, yu = null, Tn = null, De = null, va = !1, Jr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function yo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Qe && (e = St({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Ma
        })), yu = t.inject(e), Tn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Ed(e, t) {
      if (Tn && typeof Tn.onScheduleFiberRoot == "function")
        try {
          Tn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Cd(e, t) {
      if (Tn && typeof Tn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & qe) === qe;
          if (Ae) {
            var i;
            switch (t) {
              case Lr:
                i = cs;
                break;
              case _i:
                i = Nl;
                break;
              case ja:
                i = qi;
                break;
              case Aa:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            Tn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, g("React instrumentation encountered an error: %s", u));
        }
    }
    function wd(e) {
      if (Tn && typeof Tn.onPostCommitFiberRoot == "function")
        try {
          Tn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function xd(e) {
      if (Tn && typeof Tn.onCommitFiberUnmount == "function")
        try {
          Tn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function gn(e) {
      if (typeof Oc == "function" && (zv(e), Z(e)), Tn && typeof Tn.setStrictMode == "function")
        try {
          Tn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Ma(e) {
      De = e;
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
    function Rd(e) {
      De !== null && typeof De.markCommitStarted == "function" && De.markCommitStarted(e);
    }
    function Td() {
      De !== null && typeof De.markCommitStopped == "function" && De.markCommitStopped();
    }
    function ha(e) {
      De !== null && typeof De.markComponentRenderStarted == "function" && De.markComponentRenderStarted(e);
    }
    function ma() {
      De !== null && typeof De.markComponentRenderStopped == "function" && De.markComponentRenderStopped();
    }
    function bd(e) {
      De !== null && typeof De.markComponentPassiveEffectMountStarted == "function" && De.markComponentPassiveEffectMountStarted(e);
    }
    function Uv() {
      De !== null && typeof De.markComponentPassiveEffectMountStopped == "function" && De.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      De !== null && typeof De.markComponentPassiveEffectUnmountStarted == "function" && De.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      De !== null && typeof De.markComponentPassiveEffectUnmountStopped == "function" && De.markComponentPassiveEffectUnmountStopped();
    }
    function Nc(e) {
      De !== null && typeof De.markComponentLayoutEffectMountStarted == "function" && De.markComponentLayoutEffectMountStarted(e);
    }
    function Fv() {
      De !== null && typeof De.markComponentLayoutEffectMountStopped == "function" && De.markComponentLayoutEffectMountStopped();
    }
    function fs(e) {
      De !== null && typeof De.markComponentLayoutEffectUnmountStarted == "function" && De.markComponentLayoutEffectUnmountStarted(e);
    }
    function _d() {
      De !== null && typeof De.markComponentLayoutEffectUnmountStopped == "function" && De.markComponentLayoutEffectUnmountStopped();
    }
    function ds(e, t, a) {
      De !== null && typeof De.markComponentErrored == "function" && De.markComponentErrored(e, t, a);
    }
    function bi(e, t, a) {
      De !== null && typeof De.markComponentSuspended == "function" && De.markComponentSuspended(e, t, a);
    }
    function ps(e) {
      De !== null && typeof De.markLayoutEffectsStarted == "function" && De.markLayoutEffectsStarted(e);
    }
    function vs() {
      De !== null && typeof De.markLayoutEffectsStopped == "function" && De.markLayoutEffectsStopped();
    }
    function Su(e) {
      De !== null && typeof De.markPassiveEffectsStarted == "function" && De.markPassiveEffectsStarted(e);
    }
    function kd() {
      De !== null && typeof De.markPassiveEffectsStopped == "function" && De.markPassiveEffectsStopped();
    }
    function Eu(e) {
      De !== null && typeof De.markRenderStarted == "function" && De.markRenderStarted(e);
    }
    function Pv() {
      De !== null && typeof De.markRenderYielded == "function" && De.markRenderYielded();
    }
    function Lc() {
      De !== null && typeof De.markRenderStopped == "function" && De.markRenderStopped();
    }
    function Sn(e) {
      De !== null && typeof De.markRenderScheduled == "function" && De.markRenderScheduled(e);
    }
    function Mc(e, t) {
      De !== null && typeof De.markForceUpdateScheduled == "function" && De.markForceUpdateScheduled(e, t);
    }
    function hs(e, t) {
      De !== null && typeof De.markStateUpdateScheduled == "function" && De.markStateUpdateScheduled(e, t);
    }
    var Xe = (
      /*                         */
      0
    ), xt = (
      /*                 */
      1
    ), Pt = (
      /*                    */
      2
    ), Zt = (
      /*               */
      8
    ), Ht = (
      /*              */
      16
    ), zn = Math.clz32 ? Math.clz32 : ms, Zn = Math.log, jc = Math.LN2;
    function ms(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Zn(t) / jc | 0) | 0;
    }
    var Cu = 31, ae = (
      /*                        */
      0
    ), Ut = (
      /*                          */
      0
    ), it = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), xr = (
      /*            */
      8
    ), bn = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), jl = (
      /*                       */
      4194240
    ), wu = (
      /*                        */
      64
    ), Ac = (
      /*                        */
      128
    ), zc = (
      /*                        */
      256
    ), Uc = (
      /*                        */
      512
    ), Fc = (
      /*                        */
      1024
    ), Pc = (
      /*                        */
      2048
    ), Hc = (
      /*                        */
      4096
    ), Vc = (
      /*                        */
      8192
    ), Bc = (
      /*                        */
      16384
    ), xu = (
      /*                       */
      32768
    ), Ic = (
      /*                       */
      65536
    ), go = (
      /*                       */
      131072
    ), So = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), ys = (
      /*                       */
      1048576
    ), $c = (
      /*                       */
      2097152
    ), gs = (
      /*                            */
      130023424
    ), Ru = (
      /*                             */
      4194304
    ), Qc = (
      /*                             */
      8388608
    ), Ss = (
      /*                             */
      16777216
    ), Wc = (
      /*                             */
      33554432
    ), Gc = (
      /*                             */
      67108864
    ), Dd = Ru, Es = (
      /*          */
      134217728
    ), Od = (
      /*                          */
      268435455
    ), Cs = (
      /*               */
      268435456
    ), Tu = (
      /*                        */
      536870912
    ), Zr = (
      /*                   */
      1073741824
    );
    function Hv(e) {
      {
        if (e & it)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & xr)
          return "DefaultHydration";
        if (e & bn)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & jl)
          return "Transition";
        if (e & gs)
          return "Retry";
        if (e & Es)
          return "SelectiveHydration";
        if (e & Cs)
          return "IdleHydration";
        if (e & Tu)
          return "Idle";
        if (e & Zr)
          return "Offscreen";
      }
    }
    var nn = -1, bu = wu, qc = Ru;
    function ws(e) {
      switch (Al(e)) {
        case it:
          return it;
        case Ml:
          return Ml;
        case ri:
          return ri;
        case xr:
          return xr;
        case bn:
          return bn;
        case Xi:
          return Xi;
        case wu:
        case Ac:
        case zc:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case xu:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case $c:
          return e & jl;
        case Ru:
        case Qc:
        case Ss:
        case Wc:
        case Gc:
          return e & gs;
        case Es:
          return Es;
        case Cs:
          return Cs;
        case Tu:
          return Tu;
        case Zr:
          return Zr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === ae)
        return ae;
      var i = ae, u = e.suspendedLanes, s = e.pingedLanes, f = a & Od;
      if (f !== ae) {
        var p = f & ~u;
        if (p !== ae)
          i = ws(p);
        else {
          var v = f & s;
          v !== ae && (i = ws(v));
        }
      } else {
        var y = a & ~u;
        y !== ae ? i = ws(y) : s !== ae && (i = ws(s));
      }
      if (i === ae)
        return ae;
      if (t !== ae && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === ae) {
        var S = Al(i), N = Al(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          S >= N || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          S === bn && (N & jl) !== ae
        )
          return t;
      }
      (i & ri) !== ae && (i |= a & bn);
      var D = e.entangledLanes;
      if (D !== ae)
        for (var F = e.entanglements, B = i & D; B > 0; ) {
          var W = Un(B), Oe = 1 << W;
          i |= F[W], B &= ~Oe;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = nn; t > 0; ) {
        var u = Un(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Nd(e, t) {
      switch (e) {
        case it:
        case Ml:
        case ri:
          return t + 250;
        case xr:
        case bn:
        case Xi:
        case wu:
        case Ac:
        case zc:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case xu:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case $c:
          return t + 5e3;
        case Ru:
        case Qc:
        case Ss:
        case Wc:
        case Gc:
          return nn;
        case Es:
        case Cs:
        case Tu:
        case Zr:
          return nn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), nn;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Un(f), v = 1 << p, y = s[p];
        y === nn ? ((v & i) === ae || (v & u) !== ae) && (s[p] = Nd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Vv(e) {
      return ws(e.pendingLanes);
    }
    function Jc(e) {
      var t = e.pendingLanes & ~Zr;
      return t !== ae ? t : t & Zr ? Zr : ae;
    }
    function Bv(e) {
      return (e & it) !== ae;
    }
    function xs(e) {
      return (e & Od) !== ae;
    }
    function _u(e) {
      return (e & gs) === e;
    }
    function Ld(e) {
      var t = it | ri | bn;
      return (e & t) === ae;
    }
    function Md(e) {
      return (e & jl) === e;
    }
    function Zc(e, t) {
      var a = Ml | ri | xr | bn;
      return (t & a) !== ae;
    }
    function Iv(e, t) {
      return (t & e.expiredLanes) !== ae;
    }
    function jd(e) {
      return (e & jl) !== ae;
    }
    function Ad() {
      var e = bu;
      return bu <<= 1, (bu & jl) === ae && (bu = wu), e;
    }
    function Yv() {
      var e = qc;
      return qc <<= 1, (qc & gs) === ae && (qc = Ru), e;
    }
    function Al(e) {
      return e & -e;
    }
    function Rs(e) {
      return Al(e);
    }
    function Un(e) {
      return 31 - zn(e);
    }
    function or(e) {
      return Un(e);
    }
    function ea(e, t) {
      return (e & t) !== ae;
    }
    function ku(e, t) {
      return (e & t) === t;
    }
    function yt(e, t) {
      return e | t;
    }
    function Ts(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function $v(e) {
      return e;
    }
    function Qv(e, t) {
      return e !== Ut && e < t ? e : t;
    }
    function bs(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function Eo(e, t, a) {
      e.pendingLanes |= t, t !== Tu && (e.suspendedLanes = ae, e.pingedLanes = ae);
      var i = e.eventTimes, u = or(t);
      i[u] = a;
    }
    function Wv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Un(i), s = 1 << u;
        a[u] = nn, i &= ~s;
      }
    }
    function ef(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ud(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = ae, e.pingedLanes = ae, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Un(f), v = 1 << p;
        i[p] = ae, u[p] = nn, s[p] = nn, f &= ~v;
      }
    }
    function tf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = Un(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Fd(e, t) {
      var a = Al(t), i;
      switch (a) {
        case ri:
          i = Ml;
          break;
        case bn:
          i = xr;
          break;
        case wu:
        case Ac:
        case zc:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case xu:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case $c:
        case Ru:
        case Qc:
        case Ss:
        case Wc:
        case Gc:
          i = Xi;
          break;
        case Tu:
          i = Cs;
          break;
        default:
          i = Ut;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Ut ? Ut : i;
    }
    function _s(e, t, a) {
      if (Jr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = or(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Gv(e, t) {
      if (Jr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = or(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Pd(e, t) {
      return null;
    }
    var Lr = it, _i = ri, ja = bn, Aa = Tu, ks = Ut;
    function za() {
      return ks;
    }
    function Fn(e) {
      ks = e;
    }
    function qv(e, t) {
      var a = ks;
      try {
        return ks = e, t();
      } finally {
        ks = a;
      }
    }
    function Kv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ds(e, t) {
      return e > t ? e : t;
    }
    function er(e, t) {
      return e !== 0 && e < t;
    }
    function Xv(e) {
      var t = Al(e);
      return er(Lr, t) ? er(_i, t) ? xs(t) ? ja : Aa : _i : Lr;
    }
    function nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Os;
    function Rr(e) {
      Os = e;
    }
    function vy(e) {
      Os(e);
    }
    var Fe;
    function Co(e) {
      Fe = e;
    }
    var rf;
    function Jv(e) {
      rf = e;
    }
    var Zv;
    function Ns(e) {
      Zv = e;
    }
    var Ls;
    function Hd(e) {
      Ls = e;
    }
    var af = !1, Ms = [], Ji = null, ki = null, Di = null, _n = /* @__PURE__ */ new Map(), Mr = /* @__PURE__ */ new Map(), jr = [], eh = [
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
    function th(e) {
      return eh.indexOf(e) > -1;
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
    function Vd(e, t) {
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
          Mr.delete(i);
          break;
        }
      }
    }
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = Oo(t);
          p !== null && Fe(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function hy(e, t, a, i, u) {
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
          var S = u, N = S.pointerId;
          return Mr.set(N, ta(Mr.get(N) || null, e, t, a, i, S)), !0;
        }
      }
      return !1;
    }
    function Bd(e) {
      var t = $s(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === he) {
            var u = Ri(a);
            if (u !== null) {
              e.blockedOn = u, Ls(e.priority, function() {
                rf(a);
              });
              return;
            }
          } else if (i === Y) {
            var s = a.stateNode;
            if (nf(s)) {
              e.blockedOn = Ti(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function nh(e) {
      for (var t = Zv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < jr.length && er(t, jr[i].priority); i++)
        ;
      jr.splice(i, 0, a), i === 0 && Bd(a);
    }
    function js(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = xo(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          sy(s), u.target.dispatchEvent(s), cy();
        } else {
          var f = Oo(i);
          return f !== null && Fe(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Id(e, t, a) {
      js(e) && a.delete(t);
    }
    function my() {
      af = !1, Ji !== null && js(Ji) && (Ji = null), ki !== null && js(ki) && (ki = null), Di !== null && js(Di) && (Di = null), _n.forEach(Id), Mr.forEach(Id);
    }
    function zl(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, w.unstable_scheduleCallback(w.unstable_NormalPriority, my)));
    }
    function Du(e) {
      if (Ms.length > 0) {
        zl(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && zl(Ji, e), ki !== null && zl(ki, e), Di !== null && zl(Di, e);
      var i = function(p) {
        return zl(p, e);
      };
      _n.forEach(i), Mr.forEach(i);
      for (var u = 0; u < jr.length; u++) {
        var s = jr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; jr.length > 0; ) {
        var f = jr[0];
        if (f.blockedOn !== null)
          break;
        Bd(f), f.blockedOn === null && jr.shift();
      }
    }
    var sr = R.ReactCurrentBatchConfig, Lt = !0;
    function Gn(e) {
      Lt = !!e;
    }
    function Pn() {
      return Lt;
    }
    function cr(e, t, a) {
      var i = lf(t), u;
      switch (i) {
        case Lr:
          u = ya;
          break;
        case _i:
          u = wo;
          break;
        case ja:
        default:
          u = kn;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = za(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(Lr), kn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function wo(e, t, a, i) {
      var u = za(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(_i), kn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function kn(e, t, a, i) {
      Lt && As(e, t, a, i);
    }
    function As(e, t, a, i) {
      var u = xo(e, t, a, i);
      if (u === null) {
        My(e, t, i, Oi, a), Vd(e, i);
        return;
      }
      if (hy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Vd(e, i), t & ka && th(e)) {
        for (; u !== null; ) {
          var s = Oo(u);
          s !== null && vy(s);
          var f = xo(e, t, a, i);
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
    function xo(e, t, a, i) {
      Oi = null;
      var u = hd(i), s = $s(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === he) {
            var v = Ri(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === Y) {
            var y = f.stateNode;
            if (nf(y))
              return Ti(f);
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
            case cs:
              return Lr;
            case Nl:
              return _i;
            case qi:
            case py:
              return ja;
            case mu:
              return Aa;
            default:
              return ja;
          }
        }
        default:
          return ja;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Yd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Ro(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ga = null, To = null, Ou = null;
    function Ul(e) {
      return ga = e, To = Us(), !0;
    }
    function uf() {
      ga = null, To = null, Ou = null;
    }
    function Zi() {
      if (Ou)
        return Ou;
      var e, t = To, a = t.length, i, u = Us(), s = u.length;
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
    function bo() {
      return !0;
    }
    function Fs() {
      return !1;
    }
    function Tr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = bo : this.isDefaultPrevented = Fs, this.isPropagationStopped = Fs, this;
      }
      return St(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = bo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = bo);
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
        isPersistent: bo
      }), t;
    }
    var Hn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Ni = Tr(Hn), Ar = St({}, Hn, {
      view: 0,
      detail: 0
    }), ra = Tr(Ar), of, Ps, Nu;
    function yy(e) {
      e !== Nu && (Nu && e.type === "mousemove" ? (of = e.screenX - Nu.screenX, Ps = e.screenY - Nu.screenY) : (of = 0, Ps = 0), Nu = e);
    }
    var li = St({}, Ar, {
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
        return "movementX" in e ? e.movementX : (yy(e), of);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Ps;
      }
    }), $d = Tr(li), Qd = St({}, li, {
      dataTransfer: 0
    }), Lu = Tr(Qd), Wd = St({}, Ar, {
      relatedTarget: 0
    }), el = Tr(Wd), rh = St({}, Hn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ah = Tr(rh), Gd = St({}, Hn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), sf = Tr(Gd), gy = St({}, Hn, {
      data: 0
    }), ih = Tr(gy), lh = ih, uh = {
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
    }, Mu = {
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
    function Sy(e) {
      if (e.key) {
        var t = uh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Mu[e.keyCode] || "Unidentified" : "";
    }
    var _o = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function oh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = _o[e];
      return i ? !!a[i] : !1;
    }
    function vn(e) {
      return oh;
    }
    var Ey = St({}, Ar, {
      key: Sy,
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
    }), sh = Tr(Ey), Cy = St({}, li, {
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
    }), ch = Tr(Cy), fh = St({}, Ar, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), dh = Tr(fh), wy = St({}, Hn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Ua = Tr(wy), qd = St({}, li, {
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
    }), xy = Tr(qd), Pl = [9, 13, 27, 32], Hs = 229, tl = Nn && "CompositionEvent" in window, Hl = null;
    Nn && "documentMode" in document && (Hl = document.documentMode);
    var Kd = Nn && "TextEvent" in window && !Hl, cf = Nn && (!tl || Hl && Hl > 8 && Hl <= 11), ph = 32, ff = String.fromCharCode(ph);
    function Ry() {
      gt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), gt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), gt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), gt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Xd = !1;
    function vh(e) {
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
    function Jd(e, t) {
      switch (e) {
        case "keyup":
          return Pl.indexOf(t.keyCode) !== -1;
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
    function hh(e) {
      return e.locale === "ko";
    }
    var ju = !1;
    function Zd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = df(t) : ju ? Jd(t, i) && (s = "onCompositionEnd") : pf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      cf && !hh(i) && (!ju && s === "onCompositionStart" ? ju = Ul(u) : s === "onCompositionEnd" && ju && (f = Zi()));
      var p = wh(a, s);
      if (p.length > 0) {
        var v = new ih(s, t, null, i, u);
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
          return a !== ph ? null : (Xd = !0, ff);
        case "textInput":
          var i = t.data;
          return i === ff && Xd ? null : i;
        default:
          return null;
      }
    }
    function ep(e, t) {
      if (ju) {
        if (e === "compositionend" || !tl && Jd(e, t)) {
          var a = Zi();
          return uf(), ju = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!vh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return cf && !hh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function mf(e, t, a, i, u) {
      var s;
      if (Kd ? s = hf(t, i) : s = ep(t, i), !s)
        return null;
      var f = wh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new lh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function mh(e, t, a, i, u, s, f) {
      Zd(e, t, a, i, u), mf(e, t, a, i, u);
    }
    var Ty = {
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
    function Vs(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Ty[e.type] : t === "textarea";
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
    function by(e) {
      if (!Nn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Bs() {
      gt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function yh(e, t, a, i) {
      so(i);
      var u = wh(t, "onChange");
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
      yh(t, n, e, hd(e)), Dv(o, t);
    }
    function o(e) {
      AE(e, 0);
    }
    function c(e) {
      var t = wf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    Nn && (m = by("input") && (!document.documentMode || document.documentMode > 9));
    function C(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", V);
    }
    function k() {
      Vl && (Vl.detachEvent("onpropertychange", V), Vl = null, n = null);
    }
    function V(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function oe(e, t, a) {
      e === "focusin" ? (k(), C(t, a)) : e === "focusout" && k();
    }
    function de(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function ie(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Me(e, t) {
      if (e === "click")
        return c(t);
    }
    function Be(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function $e(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Je(e, "number", e.value);
    }
    function Dn(e, t, a, i, u, s, f) {
      var p = a ? wf(a) : window, v, y;
      if (r(p) ? v = d : Vs(p) ? m ? v = Be : (v = de, y = oe) : ie(p) && (v = Me), v) {
        var S = v(t, a);
        if (S) {
          yh(e, S, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && $e(p);
    }
    function L() {
      Wt("onMouseEnter", ["mouseout", "mouseover"]), Wt("onMouseLeave", ["mouseout", "mouseover"]), Wt("onPointerEnter", ["pointerout", "pointerover"]), Wt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function O(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !as(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && ($s(y) || vp(y)))
          return;
      }
      if (!(!v && !p)) {
        var S;
        if (u.window === u)
          S = u;
        else {
          var N = u.ownerDocument;
          N ? S = N.defaultView || N.parentWindow : S = window;
        }
        var D, F;
        if (v) {
          var B = i.relatedTarget || i.toElement;
          if (D = a, F = B ? $s(B) : null, F !== null) {
            var W = pa(F);
            (F !== W || F.tag !== te && F.tag !== ne) && (F = null);
          }
        } else
          D = null, F = a;
        if (D !== F) {
          var Oe = $d, Ze = "onMouseLeave", Ge = "onMouseEnter", jt = "mouse";
          (t === "pointerout" || t === "pointerover") && (Oe = ch, Ze = "onPointerLeave", Ge = "onPointerEnter", jt = "pointer");
          var kt = D == null ? S : wf(D), M = F == null ? S : wf(F), G = new Oe(Ze, jt + "leave", D, i, u);
          G.target = kt, G.relatedTarget = M;
          var j = null, pe = $s(u);
          if (pe === a) {
            var ze = new Oe(Ge, jt + "enter", F, i, u);
            ze.target = M, ze.relatedTarget = kt, j = ze;
          }
          Ux(e, G, j, D, F);
        }
      }
    }
    function z(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var se = typeof Object.is == "function" ? Object.is : z;
    function Ie(e, t) {
      if (se(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!br.call(t, s) || !se(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function tt(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function rt(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function ot(e, t) {
      for (var a = tt(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = tt(rt(a));
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
      return Vt(e, u, s, f, p);
    }
    function Vt(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, S = e, N = null;
      e: for (; ; ) {
        for (var D = null; S === t && (a === 0 || S.nodeType === Yi) && (f = s + a), S === i && (u === 0 || S.nodeType === Yi) && (p = s + u), S.nodeType === Yi && (s += S.nodeValue.length), (D = S.firstChild) !== null; )
          N = S, S = D;
        for (; ; ) {
          if (S === e)
            break e;
          if (N === t && ++v === a && (f = s), N === i && ++y === u && (p = s), (D = S.nextSibling) !== null)
            break;
          S = N, N = S.parentNode;
        }
        S = D;
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
        var y = ot(e, f), S = ot(e, p);
        if (y && S) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === S.node && u.focusOffset === S.offset)
            return;
          var N = a.createRange();
          N.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(N), u.extend(S.node, S.offset)) : (N.setEnd(S.node, S.offset), u.addRange(N));
        }
      }
    }
    function gh(e) {
      return e && e.nodeType === Yi;
    }
    function RE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : gh(e) ? !1 : gh(t) ? RE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Sx(e) {
      return e && e.ownerDocument && RE(e.ownerDocument.documentElement, e);
    }
    function Ex(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function TE() {
      for (var e = window, t = _a(); t instanceof e.HTMLIFrameElement; ) {
        if (Ex(t))
          e = t.contentWindow;
        else
          return t;
        t = _a(e.document);
      }
      return t;
    }
    function _y(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Cx() {
      var e = TE();
      return {
        focusedElem: e,
        selectionRange: _y(e) ? xx(e) : null
      };
    }
    function wx(e) {
      var t = TE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Sx(a)) {
        i !== null && _y(a) && Rx(a, i);
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
    function xx(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = tr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Rx(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var Tx = Nn && "documentMode" in document && document.documentMode <= 11;
    function bx() {
      gt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var yf = null, ky = null, tp = null, Dy = !1;
    function _x(e) {
      if ("selectionStart" in e && _y(e))
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
    function kx(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function bE(e, t, a) {
      var i = kx(a);
      if (!(Dy || yf == null || yf !== _a(i))) {
        var u = _x(yf);
        if (!tp || !Ie(tp, u)) {
          tp = u;
          var s = wh(ky, "onSelect");
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
    function Dx(e, t, a, i, u, s, f) {
      var p = a ? wf(a) : window;
      switch (t) {
        case "focusin":
          (Vs(p) || p.contentEditable === "true") && (yf = p, ky = a, tp = null);
          break;
        case "focusout":
          yf = null, ky = null, tp = null;
          break;
        case "mousedown":
          Dy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Dy = !1, bE(e, i, u);
          break;
        case "selectionchange":
          if (Tx)
            break;
        case "keydown":
        case "keyup":
          bE(e, i, u);
      }
    }
    function Sh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var gf = {
      animationend: Sh("Animation", "AnimationEnd"),
      animationiteration: Sh("Animation", "AnimationIteration"),
      animationstart: Sh("Animation", "AnimationStart"),
      transitionend: Sh("Transition", "TransitionEnd")
    }, Oy = {}, _E = {};
    Nn && (_E = document.createElement("div").style, "AnimationEvent" in window || (delete gf.animationend.animation, delete gf.animationiteration.animation, delete gf.animationstart.animation), "TransitionEvent" in window || delete gf.transitionend.transition);
    function Eh(e) {
      if (Oy[e])
        return Oy[e];
      if (!gf[e])
        return e;
      var t = gf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in _E)
          return Oy[e] = t[a];
      return e;
    }
    var kE = Eh("animationend"), DE = Eh("animationiteration"), OE = Eh("animationstart"), NE = Eh("transitionend"), LE = /* @__PURE__ */ new Map(), ME = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ko(e, t) {
      LE.set(e, t), gt(t, [e]);
    }
    function Ox() {
      for (var e = 0; e < ME.length; e++) {
        var t = ME[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ko(a, "on" + i);
      }
      ko(kE, "onAnimationEnd"), ko(DE, "onAnimationIteration"), ko(OE, "onAnimationStart"), ko("dblclick", "onDoubleClick"), ko("focusin", "onFocus"), ko("focusout", "onBlur"), ko(NE, "onTransitionEnd");
    }
    function Nx(e, t, a, i, u, s, f) {
      var p = LE.get(t);
      if (p !== void 0) {
        var v = Ni, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = sh;
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
            v = $d;
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
            v = dh;
            break;
          case kE:
          case DE:
          case OE:
            v = ah;
            break;
          case NE:
            v = Ua;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = xy;
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
            v = ch;
            break;
        }
        var S = (s & ka) !== 0;
        {
          var N = !S && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", D = Ax(a, p, i.type, S, N);
          if (D.length > 0) {
            var F = new v(p, y, null, i, u);
            e.push({
              event: F,
              listeners: D
            });
          }
        }
      }
    }
    Ox(), L(), Bs(), bx(), Ry();
    function Lx(e, t, a, i, u, s, f) {
      Nx(e, t, a, i, u, s);
      var p = (s & vd) === 0;
      p && (O(e, t, a, i, u), Dn(e, t, a, i, u), Dx(e, t, a, i, u), mh(e, t, a, i, u));
    }
    var np = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Ny = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(np));
    function jE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function Mx(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          jE(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var S = t[y], N = S.instance, D = S.currentTarget, F = S.listener;
          if (N !== i && e.isPropagationStopped())
            return;
          jE(e, F, D), i = N;
        }
    }
    function AE(e, t) {
      for (var a = (t & ka) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        Mx(s, f, a);
      }
      us();
    }
    function jx(e, t, a, i, u) {
      var s = hd(a), f = [];
      Lx(f, e, i, a, s, t), AE(f, t);
    }
    function En(e, t) {
      Ny.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = cT(t), u = Fx(e);
      i.has(u) || (zE(t, e, mc, a), i.add(u));
    }
    function Ly(e, t, a) {
      Ny.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= ka), zE(a, e, i, t);
    }
    var Ch = "_reactListening" + Math.random().toString(36).slice(2);
    function rp(e) {
      if (!e[Ch]) {
        e[Ch] = !0, ut.forEach(function(a) {
          a !== "selectionchange" && (Ny.has(a) || Ly(a, !1, e), Ly(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[Ch] || (t[Ch] = !0, Ly("selectionchange", !1, t)));
      }
    }
    function zE(e, t, a, i, u) {
      var s = cr(e, t, a), f = void 0;
      ls && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Yd(e, t, s, f) : na(e, t, s) : f !== void 0 ? Ro(e, t, s, f) : zs(e, t, s);
    }
    function UE(e, t) {
      return e === t || e.nodeType === Mn && e.parentNode === t;
    }
    function My(e, t, a, i, u) {
      var s = i;
      if (!(t & pd) && !(t & mc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === Y || v === ee) {
              var y = p.stateNode.containerInfo;
              if (UE(y, f))
                break;
              if (v === ee)
                for (var S = p.return; S !== null; ) {
                  var N = S.tag;
                  if (N === Y || N === ee) {
                    var D = S.stateNode.containerInfo;
                    if (UE(D, f))
                      return;
                  }
                  S = S.return;
                }
              for (; y !== null; ) {
                var F = $s(y);
                if (F === null)
                  return;
                var B = F.tag;
                if (B === te || B === ne) {
                  p = s = F;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      Dv(function() {
        return jx(e, t, a, s);
      });
    }
    function ap(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function Ax(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, S = null; y !== null; ) {
        var N = y, D = N.stateNode, F = N.tag;
        if (F === te && D !== null && (S = D, p !== null)) {
          var B = Tl(y, p);
          B != null && v.push(ap(y, B, S));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function wh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === te && f !== null) {
          var v = f, y = Tl(u, a);
          y != null && i.unshift(ap(u, y, v));
          var S = Tl(u, t);
          S != null && i.push(ap(u, S, v));
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
      while (e && e.tag !== te);
      return e || null;
    }
    function zx(e, t) {
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
    function FE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, S = v.stateNode, N = v.tag;
        if (y !== null && y === i)
          break;
        if (N === te && S !== null) {
          var D = S;
          if (u) {
            var F = Tl(p, s);
            F != null && f.unshift(ap(p, F, D));
          } else if (!u) {
            var B = Tl(p, s);
            B != null && f.push(ap(p, B, D));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function Ux(e, t, a, i, u) {
      var s = i && u ? zx(i, u) : null;
      i !== null && FE(e, t, i, s, !1), u !== null && a !== null && FE(e, a, u, s, !0);
    }
    function Fx(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, ip = "dangerouslySetInnerHTML", xh = "suppressContentEditableWarning", Do = "suppressHydrationWarning", PE = "autoFocus", Is = "children", Ys = "style", Rh = "__html", jy, Th, lp, HE, bh, VE, BE;
    jy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Th = function(e, t) {
      cd(e, t), vc(e, t), bv(e, t, {
        registrationNameDependencies: ct,
        possibleRegistrationNames: ft
      });
    }, VE = Nn && !document.documentMode, lp = function(e, t, a) {
      if (!Fa) {
        var i = _h(a), u = _h(t);
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
    }, bh = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, BE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var Px = /\r\n?/g, Hx = /\u0000|\uFFFD/g;
    function _h(e) {
      Kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(Px, `
`).replace(Hx, "");
    }
    function kh(e, t, a, i) {
      var u = _h(t), s = _h(e);
      if (s !== u && (i && (Fa || (Fa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Pe))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function IE(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function Vx() {
    }
    function Dh(e) {
      e.onclick = Vx;
    }
    function Bx(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ys)
            f && Object.freeze(f), Ev(t, f);
          else if (s === ip) {
            var p = f ? f[Rh] : void 0;
            p != null && ov(t, p);
          } else if (s === Is)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && io(t, f);
            } else typeof f == "number" && io(t, "" + f);
          else s === xh || s === Do || s === PE || (ct.hasOwnProperty(s) ? f != null && (typeof f != "function" && bh(s, f), s === "onScroll" && En("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function Ix(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Ys ? Ev(e, f) : s === ip ? ov(e, f) : s === Is ? io(e, f) : _r(e, s, f, i);
      }
    }
    function Yx(e, t, a, i) {
      var u, s = IE(a), f, p = i;
      if (p === Ii && (p = rd(e)), p === Ii) {
        if (u = xl(e, t), !u && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
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
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(jy, e) && (jy[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function $x(e, t) {
      return IE(t).createTextNode(e);
    }
    function Qx(e, t, a, i) {
      var u = xl(t, a);
      Th(t, a);
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
          for (var f = 0; f < np.length; f++)
            En(np[f], e);
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
          ei(e, a), s = ao(e, a), En("invalid", e);
          break;
        case "option":
          zt(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Xo(e, a), En("invalid", e);
          break;
        case "textarea":
          ed(e, a), s = Zf(e, a), En("invalid", e);
          break;
        default:
          s = a;
      }
      switch (dc(t, s), Bx(t, e, i, s, u), t) {
        case "input":
          Za(e), H(e, a, !1);
          break;
        case "textarea":
          Za(e), lv(e);
          break;
        case "option":
          un(e, a);
          break;
        case "select":
          Xf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Dh(e);
          break;
      }
    }
    function Wx(e, t, a, i, u) {
      Th(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ao(e, a), p = ao(e, i), s = [];
          break;
        case "select":
          f = Xo(e, a), p = Xo(e, i), s = [];
          break;
        case "textarea":
          f = Zf(e, a), p = Zf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && Dh(e);
          break;
      }
      dc(t, p);
      var v, y, S = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Ys) {
            var N = f[v];
            for (y in N)
              N.hasOwnProperty(y) && (S || (S = {}), S[y] = "");
          } else v === ip || v === Is || v === xh || v === Do || v === PE || (ct.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var D = p[v], F = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || D === F || D == null && F == null))
          if (v === Ys)
            if (D && Object.freeze(D), F) {
              for (y in F)
                F.hasOwnProperty(y) && (!D || !D.hasOwnProperty(y)) && (S || (S = {}), S[y] = "");
              for (y in D)
                D.hasOwnProperty(y) && F[y] !== D[y] && (S || (S = {}), S[y] = D[y]);
            } else
              S || (s || (s = []), s.push(v, S)), S = D;
          else if (v === ip) {
            var B = D ? D[Rh] : void 0, W = F ? F[Rh] : void 0;
            B != null && W !== B && (s = s || []).push(v, B);
          } else v === Is ? (typeof D == "string" || typeof D == "number") && (s = s || []).push(v, "" + D) : v === xh || v === Do || (ct.hasOwnProperty(v) ? (D != null && (typeof D != "function" && bh(v, D), v === "onScroll" && En("scroll", e)), !s && F !== D && (s = [])) : (s = s || []).push(v, D));
      }
      return S && (uy(S, p[Ys]), (s = s || []).push(Ys, S)), s;
    }
    function Gx(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = xl(a, i), f = xl(a, u);
      switch (Ix(e, t, s, f), a) {
        case "input":
          x(e, u);
          break;
        case "textarea":
          iv(e, u);
          break;
        case "select":
          sc(e, u);
          break;
      }
    }
    function qx(e) {
      {
        var t = e.toLowerCase();
        return ns.hasOwnProperty(t) && ns[t] || null;
      }
    }
    function Kx(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = xl(t, a), Th(t, a), t) {
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
          for (var y = 0; y < np.length; y++)
            En(np[y], e);
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
          zt(e, a);
          break;
        case "select":
          ou(e, a), En("invalid", e);
          break;
        case "textarea":
          ed(e, a), En("invalid", e);
          break;
      }
      dc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var S = e.attributes, N = 0; N < S.length; N++) {
          var D = S[N].name.toLowerCase();
          switch (D) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(S[N].name);
          }
        }
      }
      var F = null;
      for (var B in a)
        if (a.hasOwnProperty(B)) {
          var W = a[B];
          if (B === Is)
            typeof W == "string" ? e.textContent !== W && (a[Do] !== !0 && kh(e.textContent, W, s, f), F = [Is, W]) : typeof W == "number" && e.textContent !== "" + W && (a[Do] !== !0 && kh(e.textContent, W, s, f), F = [Is, "" + W]);
          else if (ct.hasOwnProperty(B))
            W != null && (typeof W != "function" && bh(B, W), B === "onScroll" && En("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var Oe = void 0, Ze = an(B);
            if (a[Do] !== !0) {
              if (!(B === xh || B === Do || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              B === "value" || B === "checked" || B === "selected")) {
                if (B === ip) {
                  var Ge = e.innerHTML, jt = W ? W[Rh] : void 0;
                  if (jt != null) {
                    var kt = BE(e, jt);
                    kt !== Ge && lp(B, Ge, kt);
                  }
                } else if (B === Ys) {
                  if (v.delete(B), VE) {
                    var M = iy(W);
                    Oe = e.getAttribute("style"), M !== Oe && lp(B, Oe, M);
                  }
                } else if (p && !b)
                  v.delete(B.toLowerCase()), Oe = tu(e, B, W), W !== Oe && lp(B, Oe, W);
                else if (!hn(B, Ze, p) && !Xn(B, W, Ze, p)) {
                  var G = !1;
                  if (Ze !== null)
                    v.delete(Ze.attributeName), Oe = vl(e, B, W, Ze);
                  else {
                    var j = i;
                    if (j === Ii && (j = rd(t)), j === Ii)
                      v.delete(B.toLowerCase());
                    else {
                      var pe = qx(B);
                      pe !== null && pe !== B && (G = !0, v.delete(pe)), v.delete(B);
                    }
                    Oe = tu(e, B, W);
                  }
                  var ze = b;
                  !ze && W !== Oe && !G && lp(B, Oe, W);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Do] !== !0 && HE(v), t) {
        case "input":
          Za(e), H(e, a, !0);
          break;
        case "textarea":
          Za(e), lv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Dh(e);
          break;
      }
      return F;
    }
    function Xx(e, t, a) {
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
    function Fy(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function Jx(e, t, a) {
      switch (t) {
        case "input":
          $(e, a);
          return;
        case "textarea":
          ty(e, a);
          return;
        case "select":
          Jf(e, a);
          return;
      }
    }
    var up = function() {
    }, op = function() {
    };
    {
      var Zx = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], YE = [
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
      ], eR = YE.concat(["button"]), tR = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], $E = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      op = function(e, t) {
        var a = St({}, e || $E), i = {
          tag: t
        };
        return YE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), eR.indexOf(t) !== -1 && (a.pTagInButtonScope = null), Zx.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var nR = function(e, t) {
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
            return tR.indexOf(t) === -1;
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
      }, rR = function(e, t) {
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
      }, QE = {};
      up = function(e, t, a) {
        a = a || $E;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = nR(e, u) ? null : i, f = s ? null : rR(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!QE[y]) {
            QE[y] = !0;
            var S = e, N = "";
            if (e === "#text" ? /\S/.test(t) ? S = "Text nodes" : (S = "Whitespace text nodes", N = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : S = "<" + e + ">", s) {
              var D = "";
              v === "table" && e === "tr" && (D += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", S, v, N, D);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", S, v);
          }
        }
      };
    }
    var Oh = "suppressHydrationWarning", Nh = "$", Lh = "/$", sp = "$?", cp = "$!", aR = "style", Py = null, Hy = null;
    function iR(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case id: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : ad(null, "");
          break;
        }
        default: {
          var s = i === Mn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = ad(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = op(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function lR(e, t, a) {
      {
        var i = e, u = ad(i.namespace, t), s = op(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function lD(e) {
      return e;
    }
    function uR(e) {
      Py = Pn(), Hy = Cx();
      var t = null;
      return Gn(!1), t;
    }
    function oR(e) {
      wx(Hy), Gn(Py), Py = null, Hy = null;
    }
    function sR(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (up(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = op(f.ancestorInfo, e);
          up(null, p, v);
        }
        s = f.namespace;
      }
      var y = Yx(e, t, a, s);
      return pp(u, y), Gy(y, t), y;
    }
    function cR(e, t) {
      e.appendChild(t);
    }
    function fR(e, t, a, i, u) {
      switch (Qx(e, t, a, i), t) {
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
    function dR(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = op(f.ancestorInfo, t);
          up(null, p, v);
        }
      }
      return Wx(e, t, a, i);
    }
    function Vy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function pR(e, t, a, i) {
      {
        var u = a;
        up(null, e, u.ancestorInfo);
      }
      var s = $x(e, t);
      return pp(i, s), s;
    }
    function vR() {
      var e = window.event;
      return e === void 0 ? ja : lf(e.type);
    }
    var By = typeof setTimeout == "function" ? setTimeout : void 0, hR = typeof clearTimeout == "function" ? clearTimeout : void 0, Iy = -1, WE = typeof Promise == "function" ? Promise : void 0, mR = typeof queueMicrotask == "function" ? queueMicrotask : typeof WE < "u" ? function(e) {
      return WE.resolve(null).then(e).catch(yR);
    } : By;
    function yR(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function gR(e, t, a, i) {
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
    function SR(e, t, a, i, u, s) {
      Gx(e, t, a, i, u), Gy(e, u);
    }
    function GE(e) {
      io(e, "");
    }
    function ER(e, t, a) {
      e.nodeValue = a;
    }
    function CR(e, t) {
      e.appendChild(t);
    }
    function wR(e, t) {
      var a;
      e.nodeType === Mn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Dh(a);
    }
    function xR(e, t, a) {
      e.insertBefore(t, a);
    }
    function RR(e, t, a) {
      e.nodeType === Mn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function TR(e, t) {
      e.removeChild(t);
    }
    function bR(e, t) {
      e.nodeType === Mn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Yy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Mn) {
          var s = u.data;
          if (s === Lh)
            if (i === 0) {
              e.removeChild(u), Du(t);
              return;
            } else
              i--;
          else (s === Nh || s === sp || s === cp) && i++;
        }
        a = u;
      } while (a);
      Du(t);
    }
    function _R(e, t) {
      e.nodeType === Mn ? Yy(e.parentNode, t) : e.nodeType === Wr && Yy(e, t), Du(e);
    }
    function kR(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function DR(e) {
      e.nodeValue = "";
    }
    function OR(e, t) {
      e = e;
      var a = t[aR], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = fc("display", i);
    }
    function NR(e, t) {
      e.nodeValue = t;
    }
    function LR(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function MR(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function jR(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function AR(e) {
      return e.nodeType !== Mn ? null : e;
    }
    function qE(e) {
      return e.data === sp;
    }
    function $y(e) {
      return e.data === cp;
    }
    function zR(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function UR(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === Mn) {
          var a = e.data;
          if (a === Nh || a === cp || a === sp)
            break;
          if (a === Lh)
            return null;
        }
      }
      return e;
    }
    function fp(e) {
      return Mh(e.nextSibling);
    }
    function FR(e) {
      return Mh(e.firstChild);
    }
    function PR(e) {
      return Mh(e.firstChild);
    }
    function HR(e) {
      return Mh(e.nextSibling);
    }
    function VR(e, t, a, i, u, s, f) {
      pp(s, e), Gy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & xt) !== Xe;
      return Kx(e, t, a, p, i, y, f);
    }
    function BR(e, t, a, i) {
      return pp(a, e), a.mode & xt, Xx(e, t);
    }
    function IR(e, t) {
      pp(t, e);
    }
    function YR(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Lh) {
            if (a === 0)
              return fp(t);
            a--;
          } else (i === Nh || i === cp || i === sp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function KE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Nh || i === cp || i === sp) {
            if (a === 0)
              return t;
            a--;
          } else i === Lh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function $R(e) {
      Du(e);
    }
    function QR(e) {
      Du(e);
    }
    function WR(e) {
      return e !== "head" && e !== "body";
    }
    function GR(e, t, a, i) {
      var u = !0;
      kh(t.nodeValue, a, i, u);
    }
    function qR(e, t, a, i, u, s) {
      if (t[Oh] !== !0) {
        var f = !0;
        kh(i.nodeValue, u, s, f);
      }
    }
    function KR(e, t) {
      t.nodeType === Wr ? Ay(e, t) : t.nodeType === Mn || zy(e, t);
    }
    function XR(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? Ay(a, t) : t.nodeType === Mn || zy(a, t));
      }
    }
    function JR(e, t, a, i, u) {
      (u || t[Oh] !== !0) && (i.nodeType === Wr ? Ay(a, i) : i.nodeType === Mn || zy(a, i));
    }
    function ZR(e, t, a) {
      Uy(e, t);
    }
    function eT(e, t) {
      Fy(e, t);
    }
    function tT(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Uy(i, t);
      }
    }
    function nT(e, t) {
      {
        var a = e.parentNode;
        a !== null && Fy(a, t);
      }
    }
    function rT(e, t, a, i, u, s) {
      (s || t[Oh] !== !0) && Uy(a, i);
    }
    function aT(e, t, a, i, u) {
      (u || t[Oh] !== !0) && Fy(a, i);
    }
    function iT(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function lT(e) {
      rp(e);
    }
    var Ef = Math.random().toString(36).slice(2), Cf = "__reactFiber$" + Ef, Qy = "__reactProps$" + Ef, dp = "__reactContainer$" + Ef, Wy = "__reactEvents$" + Ef, uT = "__reactListeners$" + Ef, oT = "__reactHandles$" + Ef;
    function sT(e) {
      delete e[Cf], delete e[Qy], delete e[Wy], delete e[uT], delete e[oT];
    }
    function pp(e, t) {
      t[Cf] = e;
    }
    function jh(e, t) {
      t[dp] = e;
    }
    function XE(e) {
      e[dp] = null;
    }
    function vp(e) {
      return !!e[dp];
    }
    function $s(e) {
      var t = e[Cf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[dp] || a[Cf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = KE(e); u !== null; ) {
              var s = u[Cf];
              if (s)
                return s;
              u = KE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Oo(e) {
      var t = e[Cf] || e[dp];
      return t && (t.tag === te || t.tag === ne || t.tag === he || t.tag === Y) ? t : null;
    }
    function wf(e) {
      if (e.tag === te || e.tag === ne)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Ah(e) {
      return e[Qy] || null;
    }
    function Gy(e, t) {
      e[Qy] = t;
    }
    function cT(e) {
      var t = e[Wy];
      return t === void 0 && (t = e[Wy] = /* @__PURE__ */ new Set()), t;
    }
    var JE = {}, ZE = R.ReactDebugCurrentFrame;
    function zh(e) {
      if (e) {
        var t = e._owner, a = Hi(e.type, e._source, t ? t.type : null);
        ZE.setExtraStackFrame(a);
      } else
        ZE.setExtraStackFrame(null);
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
            p && !(p instanceof Error) && (zh(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), zh(null)), p instanceof Error && !(p.message in JE) && (JE[p.message] = !0, zh(u), g("Failed %s type: %s", a, p.message), zh(null));
          }
      }
    }
    var qy = [], Uh;
    Uh = [];
    var Au = -1;
    function No(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (Au < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Uh[Au] && g("Unexpected Fiber popped."), e.current = qy[Au], qy[Au] = null, Uh[Au] = null, Au--;
    }
    function ia(e, t, a) {
      Au++, qy[Au] = e.current, Uh[Au] = a, e.current = t;
    }
    var Ky;
    Ky = {};
    var ui = {};
    Object.freeze(ui);
    var zu = No(ui), Il = No(!1), Xy = ui;
    function xf(e, t, a) {
      return a && Yl(t) ? Xy : zu.current;
    }
    function eC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
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
          var p = st(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && eC(e, t, s), s;
      }
    }
    function Fh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Ph(e) {
      aa(Il, e), aa(zu, e);
    }
    function Jy(e) {
      aa(Il, e), aa(zu, e);
    }
    function tC(e, t, a) {
      {
        if (zu.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(zu, t, e), ia(Il, a, e);
      }
    }
    function nC(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = st(e) || "Unknown";
            Ky[s] || (Ky[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((st(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = st(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return St({}, a, f);
      }
    }
    function Hh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Xy = zu.current, ia(zu, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function rC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = nC(e, t, Xy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(zu, e), ia(zu, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function fT(e) {
      {
        if (!hu(e) || e.tag !== Q)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case Y:
              return t.stateNode.context;
            case Q: {
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
    var Lo = 0, Vh = 1, Uu = null, Zy = !1, eg = !1;
    function aC(e) {
      Uu === null ? Uu = [e] : Uu.push(e);
    }
    function dT(e) {
      Zy = !0, aC(e);
    }
    function iC() {
      Zy && Mo();
    }
    function Mo() {
      if (!eg && Uu !== null) {
        eg = !0;
        var e = 0, t = za();
        try {
          var a = !0, i = Uu;
          for (Fn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Uu = null, Zy = !1;
        } catch (s) {
          throw Uu !== null && (Uu = Uu.slice(e + 1)), yd(cs, Mo), s;
        } finally {
          Fn(t), eg = !1;
        }
      }
      return null;
    }
    var Tf = [], bf = 0, Bh = null, Ih = 0, Li = [], Mi = 0, Qs = null, Fu = 1, Pu = "";
    function pT(e) {
      return Gs(), (e.flags & wi) !== Ke;
    }
    function vT(e) {
      return Gs(), Ih;
    }
    function hT() {
      var e = Pu, t = Fu, a = t & ~mT(t);
      return a.toString(32) + e;
    }
    function Ws(e, t) {
      Gs(), Tf[bf++] = Ih, Tf[bf++] = Bh, Bh = e, Ih = t;
    }
    function lC(e, t, a) {
      Gs(), Li[Mi++] = Fu, Li[Mi++] = Pu, Li[Mi++] = Qs, Qs = e;
      var i = Fu, u = Pu, s = Yh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Yh(t) + s;
      if (v > 30) {
        var y = s - s % 5, S = (1 << y) - 1, N = (f & S).toString(32), D = f >> y, F = s - y, B = Yh(t) + F, W = p << F, Oe = W | D, Ze = N + u;
        Fu = 1 << B | Oe, Pu = Ze;
      } else {
        var Ge = p << s, jt = Ge | f, kt = u;
        Fu = 1 << v | jt, Pu = kt;
      }
    }
    function tg(e) {
      Gs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Ws(e, a), lC(e, a, i);
      }
    }
    function Yh(e) {
      return 32 - zn(e);
    }
    function mT(e) {
      return 1 << Yh(e) - 1;
    }
    function ng(e) {
      for (; e === Bh; )
        Bh = Tf[--bf], Tf[bf] = null, Ih = Tf[--bf], Tf[bf] = null;
      for (; e === Qs; )
        Qs = Li[--Mi], Li[Mi] = null, Pu = Li[--Mi], Li[Mi] = null, Fu = Li[--Mi], Li[Mi] = null;
    }
    function yT() {
      return Gs(), Qs !== null ? {
        id: Fu,
        overflow: Pu
      } : null;
    }
    function gT(e, t) {
      Gs(), Li[Mi++] = Fu, Li[Mi++] = Pu, Li[Mi++] = Qs, Fu = t.id, Pu = t.overflow, Qs = e;
    }
    function Gs() {
      Ur() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var zr = null, ji = null, rl = !1, qs = !1, jo = null;
    function ST() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function uC() {
      qs = !0;
    }
    function ET() {
      return qs;
    }
    function CT(e) {
      var t = e.stateNode.containerInfo;
      return ji = PR(t), zr = e, rl = !0, jo = null, qs = !1, !0;
    }
    function wT(e, t, a) {
      return ji = HR(t), zr = e, rl = !0, jo = null, qs = !1, a !== null && gT(e, a), !0;
    }
    function oC(e, t) {
      switch (e.tag) {
        case Y: {
          KR(e.stateNode.containerInfo, t);
          break;
        }
        case te: {
          var a = (e.mode & xt) !== Xe;
          JR(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case he: {
          var i = e.memoizedState;
          i.dehydrated !== null && XR(i.dehydrated, t);
          break;
        }
      }
    }
    function sC(e, t) {
      oC(e, t);
      var a = b1();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function rg(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case Y: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case te:
                var i = t.type;
                t.pendingProps, ZR(a, i);
                break;
              case ne:
                var u = t.pendingProps;
                eT(a, u);
                break;
            }
            break;
          }
          case te: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case te: {
                var v = t.type, y = t.pendingProps, S = (e.mode & xt) !== Xe;
                rT(
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
              case ne: {
                var N = t.pendingProps, D = (e.mode & xt) !== Xe;
                aT(
                  s,
                  f,
                  p,
                  N,
                  // TODO: Delete this argument when we remove the legacy root API.
                  D
                );
                break;
              }
            }
            break;
          }
          case he: {
            var F = e.memoizedState, B = F.dehydrated;
            if (B !== null) switch (t.tag) {
              case te:
                var W = t.type;
                t.pendingProps, tT(B, W);
                break;
              case ne:
                var Oe = t.pendingProps;
                nT(B, Oe);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function cC(e, t) {
      t.flags = t.flags & ~qr | yn, rg(e, t);
    }
    function fC(e, t) {
      switch (e.tag) {
        case te: {
          var a = e.type;
          e.pendingProps;
          var i = MR(t, a);
          return i !== null ? (e.stateNode = i, zr = e, ji = FR(i), !0) : !1;
        }
        case ne: {
          var u = e.pendingProps, s = jR(t, u);
          return s !== null ? (e.stateNode = s, zr = e, ji = null, !0) : !1;
        }
        case he: {
          var f = AR(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: yT(),
              retryLane: Zr
            };
            e.memoizedState = p;
            var v = _1(f);
            return v.return = e, e.child = v, zr = e, ji = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ag(e) {
      return (e.mode & xt) !== Xe && (e.flags & qe) === Ke;
    }
    function ig(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function lg(e) {
      if (rl) {
        var t = ji;
        if (!t) {
          ag(e) && (rg(zr, e), ig()), cC(zr, e), rl = !1, zr = e;
          return;
        }
        var a = t;
        if (!fC(e, t)) {
          ag(e) && (rg(zr, e), ig()), t = fp(a);
          var i = zr;
          if (!t || !fC(e, t)) {
            cC(zr, e), rl = !1, zr = e;
            return;
          }
          sC(i, a);
        }
      }
    }
    function xT(e, t, a) {
      var i = e.stateNode, u = !qs, s = VR(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function RT(e) {
      var t = e.stateNode, a = e.memoizedProps, i = BR(t, a, e);
      if (i) {
        var u = zr;
        if (u !== null)
          switch (u.tag) {
            case Y: {
              var s = u.stateNode.containerInfo, f = (u.mode & xt) !== Xe;
              GR(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case te: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, S = (u.mode & xt) !== Xe;
              qR(
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
    function TT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      IR(a, e);
    }
    function bT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return YR(a);
    }
    function dC(e) {
      for (var t = e.return; t !== null && t.tag !== te && t.tag !== Y && t.tag !== he; )
        t = t.return;
      zr = t;
    }
    function $h(e) {
      if (e !== zr)
        return !1;
      if (!rl)
        return dC(e), rl = !0, !1;
      if (e.tag !== Y && (e.tag !== te || WR(e.type) && !Vy(e.type, e.memoizedProps))) {
        var t = ji;
        if (t)
          if (ag(e))
            pC(e), ig();
          else
            for (; t; )
              sC(e, t), t = fp(t);
      }
      return dC(e), e.tag === he ? ji = bT(e) : ji = zr ? fp(e.stateNode) : null, !0;
    }
    function _T() {
      return rl && ji !== null;
    }
    function pC(e) {
      for (var t = ji; t; )
        oC(e, t), t = fp(t);
    }
    function _f() {
      zr = null, ji = null, rl = !1, qs = !1;
    }
    function vC() {
      jo !== null && (uw(jo), jo = null);
    }
    function Ur() {
      return rl;
    }
    function ug(e) {
      jo === null ? jo = [e] : jo.push(e);
    }
    var kT = R.ReactCurrentBatchConfig, DT = null;
    function OT() {
      return kT.transition;
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
      var NT = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Zt && (t = a), a = a.return;
        return t;
      }, Ks = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, hp = [], mp = [], yp = [], gp = [], Sp = [], Ep = [], Xs = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Xs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && hp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillMount == "function" && mp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && yp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillReceiveProps == "function" && gp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Sp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillUpdate == "function" && Ep.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(D) {
          e.add(st(D) || "Component"), Xs.add(D.type);
        }), hp = []);
        var t = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(D) {
          t.add(st(D) || "Component"), Xs.add(D.type);
        }), mp = []);
        var a = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(D) {
          a.add(st(D) || "Component"), Xs.add(D.type);
        }), yp = []);
        var i = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(D) {
          i.add(st(D) || "Component"), Xs.add(D.type);
        }), gp = []);
        var u = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(D) {
          u.add(st(D) || "Component"), Xs.add(D.type);
        }), Sp = []);
        var s = /* @__PURE__ */ new Set();
        if (Ep.length > 0 && (Ep.forEach(function(D) {
          s.add(st(D) || "Component"), Xs.add(D.type);
        }), Ep = []), t.size > 0) {
          var f = Ks(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Ks(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Ks(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = Ks(e);
          A(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var S = Ks(a);
          A(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (u.size > 0) {
          var N = Ks(u);
          A(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, N);
        }
      };
      var Qh = /* @__PURE__ */ new Map(), hC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = NT(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!hC.has(e.type)) {
          var i = Qh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Qh.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        Qh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(st(s) || "Component"), hC.add(s.type);
            });
            var u = Ks(i);
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
        hp = [], mp = [], yp = [], gp = [], Sp = [], Ep = [], Qh = /* @__PURE__ */ new Map();
      };
    }
    var og, sg, cg, fg, dg, mC = function(e, t) {
    };
    og = !1, sg = !1, cg = {}, fg = {}, dg = {}, mC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = st(t) || "Component";
        fg[a] || (fg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function LT(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Cp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Zt || I) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== Q) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !LT(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = st(e) || "Component";
          cg[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), cg[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== Q)
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
          var S = function(N) {
            var D = v.refs;
            N === null ? delete D[y] : D[y] = N;
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
    function Wh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Gh(e) {
      {
        var t = st(e) || "Component";
        if (dg[t])
          return;
        dg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function yC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function gC(e) {
      function t(M, G) {
        if (e) {
          var j = M.deletions;
          j === null ? (M.deletions = [G], M.flags |= Da) : j.push(G);
        }
      }
      function a(M, G) {
        if (!e)
          return null;
        for (var j = G; j !== null; )
          t(M, j), j = j.sibling;
        return null;
      }
      function i(M, G) {
        for (var j = /* @__PURE__ */ new Map(), pe = G; pe !== null; )
          pe.key !== null ? j.set(pe.key, pe) : j.set(pe.index, pe), pe = pe.sibling;
        return j;
      }
      function u(M, G) {
        var j = lc(M, G);
        return j.index = 0, j.sibling = null, j;
      }
      function s(M, G, j) {
        if (M.index = j, !e)
          return M.flags |= wi, G;
        var pe = M.alternate;
        if (pe !== null) {
          var ze = pe.index;
          return ze < G ? (M.flags |= yn, G) : ze;
        } else
          return M.flags |= yn, G;
      }
      function f(M) {
        return e && M.alternate === null && (M.flags |= yn), M;
      }
      function p(M, G, j, pe) {
        if (G === null || G.tag !== ne) {
          var ze = uE(j, M.mode, pe);
          return ze.return = M, ze;
        } else {
          var Ne = u(G, j);
          return Ne.return = M, Ne;
        }
      }
      function v(M, G, j, pe) {
        var ze = j.type;
        if (ze === di)
          return S(M, G, j.props.children, pe, j.key);
        if (G !== null && (G.elementType === ze || // Keep this check inline so it only runs on the false path:
        xw(G, j) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof ze == "object" && ze !== null && ze.$$typeof === dt && yC(ze) === G.type)) {
          var Ne = u(G, j.props);
          return Ne.ref = Cp(M, G, j), Ne.return = M, Ne._debugSource = j._source, Ne._debugOwner = j._owner, Ne;
        }
        var lt = lE(j, M.mode, pe);
        return lt.ref = Cp(M, G, j), lt.return = M, lt;
      }
      function y(M, G, j, pe) {
        if (G === null || G.tag !== ee || G.stateNode.containerInfo !== j.containerInfo || G.stateNode.implementation !== j.implementation) {
          var ze = oE(j, M.mode, pe);
          return ze.return = M, ze;
        } else {
          var Ne = u(G, j.children || []);
          return Ne.return = M, Ne;
        }
      }
      function S(M, G, j, pe, ze) {
        if (G === null || G.tag !== K) {
          var Ne = $o(j, M.mode, pe, ze);
          return Ne.return = M, Ne;
        } else {
          var lt = u(G, j);
          return lt.return = M, lt;
        }
      }
      function N(M, G, j) {
        if (typeof G == "string" && G !== "" || typeof G == "number") {
          var pe = uE("" + G, M.mode, j);
          return pe.return = M, pe;
        }
        if (typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case kr: {
              var ze = lE(G, M.mode, j);
              return ze.ref = Cp(M, null, G), ze.return = M, ze;
            }
            case ar: {
              var Ne = oE(G, M.mode, j);
              return Ne.return = M, Ne;
            }
            case dt: {
              var lt = G._payload, vt = G._init;
              return N(M, vt(lt), j);
            }
          }
          if (Ct(G) || mt(G)) {
            var tn = $o(G, M.mode, j, null);
            return tn.return = M, tn;
          }
          Wh(M, G);
        }
        return typeof G == "function" && Gh(M), null;
      }
      function D(M, G, j, pe) {
        var ze = G !== null ? G.key : null;
        if (typeof j == "string" && j !== "" || typeof j == "number")
          return ze !== null ? null : p(M, G, "" + j, pe);
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case kr:
              return j.key === ze ? v(M, G, j, pe) : null;
            case ar:
              return j.key === ze ? y(M, G, j, pe) : null;
            case dt: {
              var Ne = j._payload, lt = j._init;
              return D(M, G, lt(Ne), pe);
            }
          }
          if (Ct(j) || mt(j))
            return ze !== null ? null : S(M, G, j, pe, null);
          Wh(M, j);
        }
        return typeof j == "function" && Gh(M), null;
      }
      function F(M, G, j, pe, ze) {
        if (typeof pe == "string" && pe !== "" || typeof pe == "number") {
          var Ne = M.get(j) || null;
          return p(G, Ne, "" + pe, ze);
        }
        if (typeof pe == "object" && pe !== null) {
          switch (pe.$$typeof) {
            case kr: {
              var lt = M.get(pe.key === null ? j : pe.key) || null;
              return v(G, lt, pe, ze);
            }
            case ar: {
              var vt = M.get(pe.key === null ? j : pe.key) || null;
              return y(G, vt, pe, ze);
            }
            case dt:
              var tn = pe._payload, Bt = pe._init;
              return F(M, G, j, Bt(tn), ze);
          }
          if (Ct(pe) || mt(pe)) {
            var qn = M.get(j) || null;
            return S(G, qn, pe, ze, null);
          }
          Wh(G, pe);
        }
        return typeof pe == "function" && Gh(G), null;
      }
      function B(M, G, j) {
        {
          if (typeof M != "object" || M === null)
            return G;
          switch (M.$$typeof) {
            case kr:
            case ar:
              mC(M, j);
              var pe = M.key;
              if (typeof pe != "string")
                break;
              if (G === null) {
                G = /* @__PURE__ */ new Set(), G.add(pe);
                break;
              }
              if (!G.has(pe)) {
                G.add(pe);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", pe);
              break;
            case dt:
              var ze = M._payload, Ne = M._init;
              B(Ne(ze), G, j);
              break;
          }
        }
        return G;
      }
      function W(M, G, j, pe) {
        for (var ze = null, Ne = 0; Ne < j.length; Ne++) {
          var lt = j[Ne];
          ze = B(lt, ze, M);
        }
        for (var vt = null, tn = null, Bt = G, qn = 0, It = 0, Vn = null; Bt !== null && It < j.length; It++) {
          Bt.index > It ? (Vn = Bt, Bt = null) : Vn = Bt.sibling;
          var ua = D(M, Bt, j[It], pe);
          if (ua === null) {
            Bt === null && (Bt = Vn);
            break;
          }
          e && Bt && ua.alternate === null && t(M, Bt), qn = s(ua, qn, It), tn === null ? vt = ua : tn.sibling = ua, tn = ua, Bt = Vn;
        }
        if (It === j.length) {
          if (a(M, Bt), Ur()) {
            var Yr = It;
            Ws(M, Yr);
          }
          return vt;
        }
        if (Bt === null) {
          for (; It < j.length; It++) {
            var si = N(M, j[It], pe);
            si !== null && (qn = s(si, qn, It), tn === null ? vt = si : tn.sibling = si, tn = si);
          }
          if (Ur()) {
            var wa = It;
            Ws(M, wa);
          }
          return vt;
        }
        for (var xa = i(M, Bt); It < j.length; It++) {
          var oa = F(xa, M, It, j[It], pe);
          oa !== null && (e && oa.alternate !== null && xa.delete(oa.key === null ? It : oa.key), qn = s(oa, qn, It), tn === null ? vt = oa : tn.sibling = oa, tn = oa);
        }
        if (e && xa.forEach(function(Qf) {
          return t(M, Qf);
        }), Ur()) {
          var Qu = It;
          Ws(M, Qu);
        }
        return vt;
      }
      function Oe(M, G, j, pe) {
        var ze = mt(j);
        if (typeof ze != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          j[Symbol.toStringTag] === "Generator" && (sg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), sg = !0), j.entries === ze && (og || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), og = !0);
          var Ne = ze.call(j);
          if (Ne)
            for (var lt = null, vt = Ne.next(); !vt.done; vt = Ne.next()) {
              var tn = vt.value;
              lt = B(tn, lt, M);
            }
        }
        var Bt = ze.call(j);
        if (Bt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qn = null, It = null, Vn = G, ua = 0, Yr = 0, si = null, wa = Bt.next(); Vn !== null && !wa.done; Yr++, wa = Bt.next()) {
          Vn.index > Yr ? (si = Vn, Vn = null) : si = Vn.sibling;
          var xa = D(M, Vn, wa.value, pe);
          if (xa === null) {
            Vn === null && (Vn = si);
            break;
          }
          e && Vn && xa.alternate === null && t(M, Vn), ua = s(xa, ua, Yr), It === null ? qn = xa : It.sibling = xa, It = xa, Vn = si;
        }
        if (wa.done) {
          if (a(M, Vn), Ur()) {
            var oa = Yr;
            Ws(M, oa);
          }
          return qn;
        }
        if (Vn === null) {
          for (; !wa.done; Yr++, wa = Bt.next()) {
            var Qu = N(M, wa.value, pe);
            Qu !== null && (ua = s(Qu, ua, Yr), It === null ? qn = Qu : It.sibling = Qu, It = Qu);
          }
          if (Ur()) {
            var Qf = Yr;
            Ws(M, Qf);
          }
          return qn;
        }
        for (var Zp = i(M, Vn); !wa.done; Yr++, wa = Bt.next()) {
          var Jl = F(Zp, M, Yr, wa.value, pe);
          Jl !== null && (e && Jl.alternate !== null && Zp.delete(Jl.key === null ? Yr : Jl.key), ua = s(Jl, ua, Yr), It === null ? qn = Jl : It.sibling = Jl, It = Jl);
        }
        if (e && Zp.forEach(function(ak) {
          return t(M, ak);
        }), Ur()) {
          var rk = Yr;
          Ws(M, rk);
        }
        return qn;
      }
      function Ze(M, G, j, pe) {
        if (G !== null && G.tag === ne) {
          a(M, G.sibling);
          var ze = u(G, j);
          return ze.return = M, ze;
        }
        a(M, G);
        var Ne = uE(j, M.mode, pe);
        return Ne.return = M, Ne;
      }
      function Ge(M, G, j, pe) {
        for (var ze = j.key, Ne = G; Ne !== null; ) {
          if (Ne.key === ze) {
            var lt = j.type;
            if (lt === di) {
              if (Ne.tag === K) {
                a(M, Ne.sibling);
                var vt = u(Ne, j.props.children);
                return vt.return = M, vt._debugSource = j._source, vt._debugOwner = j._owner, vt;
              }
            } else if (Ne.elementType === lt || // Keep this check inline so it only runs on the false path:
            xw(Ne, j) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof lt == "object" && lt !== null && lt.$$typeof === dt && yC(lt) === Ne.type) {
              a(M, Ne.sibling);
              var tn = u(Ne, j.props);
              return tn.ref = Cp(M, Ne, j), tn.return = M, tn._debugSource = j._source, tn._debugOwner = j._owner, tn;
            }
            a(M, Ne);
            break;
          } else
            t(M, Ne);
          Ne = Ne.sibling;
        }
        if (j.type === di) {
          var Bt = $o(j.props.children, M.mode, pe, j.key);
          return Bt.return = M, Bt;
        } else {
          var qn = lE(j, M.mode, pe);
          return qn.ref = Cp(M, G, j), qn.return = M, qn;
        }
      }
      function jt(M, G, j, pe) {
        for (var ze = j.key, Ne = G; Ne !== null; ) {
          if (Ne.key === ze)
            if (Ne.tag === ee && Ne.stateNode.containerInfo === j.containerInfo && Ne.stateNode.implementation === j.implementation) {
              a(M, Ne.sibling);
              var lt = u(Ne, j.children || []);
              return lt.return = M, lt;
            } else {
              a(M, Ne);
              break;
            }
          else
            t(M, Ne);
          Ne = Ne.sibling;
        }
        var vt = oE(j, M.mode, pe);
        return vt.return = M, vt;
      }
      function kt(M, G, j, pe) {
        var ze = typeof j == "object" && j !== null && j.type === di && j.key === null;
        if (ze && (j = j.props.children), typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case kr:
              return f(Ge(M, G, j, pe));
            case ar:
              return f(jt(M, G, j, pe));
            case dt:
              var Ne = j._payload, lt = j._init;
              return kt(M, G, lt(Ne), pe);
          }
          if (Ct(j))
            return W(M, G, j, pe);
          if (mt(j))
            return Oe(M, G, j, pe);
          Wh(M, j);
        }
        return typeof j == "string" && j !== "" || typeof j == "number" ? f(Ze(M, G, "" + j, pe)) : (typeof j == "function" && Gh(M), a(M, G));
      }
      return kt;
    }
    var kf = gC(!0), SC = gC(!1);
    function MT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = lc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = lc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function jT(e, t) {
      for (var a = e.child; a !== null; )
        C1(a, t), a = a.sibling;
    }
    var pg = No(null), vg;
    vg = {};
    var qh = null, Df = null, hg = null, Kh = !1;
    function Xh() {
      qh = null, Df = null, hg = null, Kh = !1;
    }
    function EC() {
      Kh = !0;
    }
    function CC() {
      Kh = !1;
    }
    function wC(e, t, a) {
      ia(pg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== vg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = vg;
    }
    function mg(e, t) {
      var a = pg.current;
      aa(pg, t), e._currentValue = a;
    }
    function yg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (ku(i.childLanes, t) ? u !== null && !ku(u.childLanes, t) && (u.childLanes = yt(u.childLanes, t)) : (i.childLanes = yt(i.childLanes, t), u !== null && (u.childLanes = yt(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function AT(e, t, a) {
      zT(e, t, a);
    }
    function zT(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === Q) {
                var p = Rs(a), v = Hu(nn, p);
                v.tag = Zh;
                var y = i.updateQueue;
                if (y !== null) {
                  var S = y.shared, N = S.pending;
                  N === null ? v.next = v : (v.next = N.next, N.next = v), S.pending = v;
                }
              }
              i.lanes = yt(i.lanes, a);
              var D = i.alternate;
              D !== null && (D.lanes = yt(D.lanes, a)), yg(i.return, a, e), s.lanes = yt(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === ce)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === xe) {
          var F = i.return;
          if (F === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          F.lanes = yt(F.lanes, a);
          var B = F.alternate;
          B !== null && (B.lanes = yt(B.lanes, a)), yg(F, a, e), u = i.sibling;
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
            var W = u.sibling;
            if (W !== null) {
              W.return = u.return, u = W;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Of(e, t) {
      qh = e, Df = null, hg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function nr(e) {
      Kh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (hg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (qh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, qh.dependencies = {
            lanes: ae,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Js = null;
    function gg(e) {
      Js === null ? Js = [e] : Js.push(e);
    }
    function UT() {
      if (Js !== null) {
        for (var e = 0; e < Js.length; e++) {
          var t = Js[e], a = t.interleaved;
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
        Js = null;
      }
    }
    function xC(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, gg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Jh(e, i);
    }
    function FT(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, gg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function PT(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, gg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Jh(e, i);
    }
    function Pa(e, t) {
      return Jh(e, t);
    }
    var HT = Jh;
    function Jh(e, t) {
      e.lanes = yt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = yt(a.lanes, t)), a === null && (e.flags & (yn | qr)) !== Ke && Sw(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = yt(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = yt(a.childLanes, t) : (u.flags & (yn | qr)) !== Ke && Sw(e), i = u, u = u.return;
      if (i.tag === Y) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var RC = 0, TC = 1, Zh = 2, Sg = 3, em = !1, Eg, tm;
    Eg = !1, tm = null;
    function Cg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: ae
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function bC(e, t) {
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
    function Hu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: RC,
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
      if (tm === u && !Eg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Eg = !0), F_()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, HT(e, a);
      } else
        return PT(e, u, t, a);
    }
    function nm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (jd(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = yt(s, a);
          u.lanes = f, tf(e, f);
        }
      }
    }
    function wg(e, t) {
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
    function VT(e, t, a, i, u, s) {
      switch (a.tag) {
        case TC: {
          var f = a.payload;
          if (typeof f == "function") {
            EC();
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
              CC();
            }
            return p;
          }
          return f;
        }
        case Sg:
          e.flags = e.flags & ~Jn | qe;
        case RC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            EC(), y = v.call(s, i, u);
            {
              if (e.mode & Zt) {
                gn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              CC();
            }
          } else
            y = v;
          return y == null ? i : St({}, i, y);
        }
        case Zh:
          return em = !0, i;
      }
      return i;
    }
    function rm(e, t, a, i) {
      var u = e.updateQueue;
      em = !1, tm = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var S = e.alternate;
        if (S !== null) {
          var N = S.updateQueue, D = N.lastBaseUpdate;
          D !== f && (D === null ? N.firstBaseUpdate = y : D.next = y, N.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var F = u.baseState, B = ae, W = null, Oe = null, Ze = null, Ge = s;
        do {
          var jt = Ge.lane, kt = Ge.eventTime;
          if (ku(i, jt)) {
            if (Ze !== null) {
              var G = {
                eventTime: kt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Ut,
                tag: Ge.tag,
                payload: Ge.payload,
                callback: Ge.callback,
                next: null
              };
              Ze = Ze.next = G;
            }
            F = VT(e, u, Ge, F, t, a);
            var j = Ge.callback;
            if (j !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ge.lane !== Ut) {
              e.flags |= on;
              var pe = u.effects;
              pe === null ? u.effects = [Ge] : pe.push(Ge);
            }
          } else {
            var M = {
              eventTime: kt,
              lane: jt,
              tag: Ge.tag,
              payload: Ge.payload,
              callback: Ge.callback,
              next: null
            };
            Ze === null ? (Oe = Ze = M, W = F) : Ze = Ze.next = M, B = yt(B, jt);
          }
          if (Ge = Ge.next, Ge === null) {
            if (p = u.shared.pending, p === null)
              break;
            var ze = p, Ne = ze.next;
            ze.next = null, Ge = Ne, u.lastBaseUpdate = ze, u.shared.pending = null;
          }
        } while (!0);
        Ze === null && (W = F), u.baseState = W, u.firstBaseUpdate = Oe, u.lastBaseUpdate = Ze;
        var lt = u.shared.interleaved;
        if (lt !== null) {
          var vt = lt;
          do
            B = yt(B, vt.lane), vt = vt.next;
          while (vt !== lt);
        } else s === null && (u.shared.lanes = ae);
        Gp(B), e.lanes = B, e.memoizedState = F;
      }
      tm = null;
    }
    function BT(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function _C() {
      em = !1;
    }
    function am() {
      return em;
    }
    function kC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, BT(f, a));
        }
    }
    var wp = {}, zo = No(wp), xp = No(wp), im = No(wp);
    function lm(e) {
      if (e === wp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function DC() {
      var e = lm(im.current);
      return e;
    }
    function xg(e, t) {
      ia(im, t, e), ia(xp, e, e), ia(zo, wp, e);
      var a = iR(t);
      aa(zo, e), ia(zo, a, e);
    }
    function Nf(e) {
      aa(zo, e), aa(xp, e), aa(im, e);
    }
    function Rg() {
      var e = lm(zo.current);
      return e;
    }
    function OC(e) {
      lm(im.current);
      var t = lm(zo.current), a = lR(t, e.type);
      t !== a && (ia(xp, e, e), ia(zo, a, e));
    }
    function Tg(e) {
      xp.current === e && (aa(zo, e), aa(xp, e));
    }
    var IT = 0, NC = 1, LC = 1, Rp = 2, il = No(IT);
    function bg(e, t) {
      return (e & t) !== 0;
    }
    function Lf(e) {
      return e & NC;
    }
    function _g(e, t) {
      return e & NC | t;
    }
    function YT(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      ia(il, t, e);
    }
    function Mf(e) {
      aa(il, e);
    }
    function $T(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function um(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === he) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || qE(i) || $y(i))
              return t;
          }
        } else if (t.tag === Ve && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & qe) !== Ke;
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
    var Ha = (
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
    ), kg = [];
    function Dg() {
      for (var e = 0; e < kg.length; e++) {
        var t = kg[e];
        t._workInProgressVersionPrimary = null;
      }
      kg.length = 0;
    }
    function QT(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var je = R.ReactCurrentDispatcher, Tp = R.ReactCurrentBatchConfig, Og, jf;
    Og = /* @__PURE__ */ new Set();
    var Zs = ae, en = null, pr = null, vr = null, om = !1, bp = !1, _p = 0, WT = 0, GT = 25, X = null, Ai = null, Fo = -1, Ng = !1;
    function Qt() {
      {
        var e = X;
        Ai === null ? Ai = [e] : Ai.push(e);
      }
    }
    function Te() {
      {
        var e = X;
        Ai !== null && (Fo++, Ai[Fo] !== e && qT(e));
      }
    }
    function Af(e) {
      e != null && !Ct(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", X, typeof e);
    }
    function qT(e) {
      {
        var t = st(en);
        if (!Og.has(t) && (Og.add(t), Ai !== null)) {
          for (var a = "", i = 30, u = 0; u <= Fo; u++) {
            for (var s = Ai[u], f = u === Fo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function Lg(e, t) {
      if (Ng)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", X), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, X, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!se(e[a], t[a]))
          return !1;
      return !0;
    }
    function zf(e, t, a, i, u, s) {
      Zs = s, en = t, Ai = e !== null ? e._debugHookTypes : null, Fo = -1, Ng = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = ae, e !== null && e.memoizedState !== null ? je.current = e0 : Ai !== null ? je.current = ZC : je.current = JC;
      var f = a(i, u);
      if (bp) {
        var p = 0;
        do {
          if (bp = !1, _p = 0, p >= GT)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Ng = !1, pr = null, vr = null, t.updateQueue = null, Fo = -1, je.current = t0, f = a(i, u);
        } while (bp);
      }
      je.current = Cm, t._debugHookTypes = Ai;
      var v = pr !== null && pr.next !== null;
      if (Zs = ae, en = null, pr = null, vr = null, X = null, Ai = null, Fo = -1, e !== null && (e.flags & An) !== (t.flags & An) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & xt) !== Xe && g("Internal React error: Expected static flag was missing. Please notify the React team."), om = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Uf() {
      var e = _p !== 0;
      return _p = 0, e;
    }
    function MC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Ht) !== Xe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ts(e.lanes, a);
    }
    function jC() {
      if (je.current = Cm, om) {
        for (var e = en.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        om = !1;
      }
      Zs = ae, en = null, pr = null, vr = null, Ai = null, Fo = -1, X = null, WC = !1, bp = !1, _p = 0;
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
    function zi() {
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
    function jg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: ae,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = ZT.bind(null, en, s);
      return [i.memoizedState, f];
    }
    function Ag(e, t, a) {
      var i = zi(), u = i.queue;
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
        var S = f.next, N = s.baseState, D = null, F = null, B = null, W = S;
        do {
          var Oe = W.lane;
          if (ku(Zs, Oe)) {
            if (B !== null) {
              var Ge = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Ut,
                action: W.action,
                hasEagerState: W.hasEagerState,
                eagerState: W.eagerState,
                next: null
              };
              B = B.next = Ge;
            }
            if (W.hasEagerState)
              N = W.eagerState;
            else {
              var jt = W.action;
              N = e(N, jt);
            }
          } else {
            var Ze = {
              lane: Oe,
              action: W.action,
              hasEagerState: W.hasEagerState,
              eagerState: W.eagerState,
              next: null
            };
            B === null ? (F = B = Ze, D = N) : B = B.next = Ze, en.lanes = yt(en.lanes, Oe), Gp(Oe);
          }
          W = W.next;
        } while (W !== null && W !== S);
        B === null ? D = N : B.next = F, se(N, i.memoizedState) || zp(), i.memoizedState = N, i.baseState = D, i.baseQueue = B, u.lastRenderedState = N;
      }
      var kt = u.interleaved;
      if (kt !== null) {
        var M = kt;
        do {
          var G = M.lane;
          en.lanes = yt(en.lanes, G), Gp(G), M = M.next;
        } while (M !== kt);
      } else f === null && (u.lanes = ae);
      var j = u.dispatch;
      return [i.memoizedState, j];
    }
    function zg(e, t, a) {
      var i = zi(), u = i.queue;
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
        se(p, i.memoizedState) || zp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function uD(e, t, a) {
    }
    function oD(e, t, a) {
    }
    function Ug(e, t, a) {
      var i = en, u = Ql(), s, f = Ur();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), jf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), jf = !0);
      } else {
        if (s = t(), !jf) {
          var p = t();
          se(s, p) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
        }
        var v = Hm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Zs) || zC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, pm(FC.bind(null, i, y, e), [e]), i.flags |= Gr, kp(fr | Fr, UC.bind(null, i, y, s, t), void 0, null), s;
    }
    function sm(e, t, a) {
      var i = en, u = zi(), s = t();
      if (!jf) {
        var f = t();
        se(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
      }
      var p = u.memoizedState, v = !se(p, s);
      v && (u.memoizedState = s, zp());
      var y = u.queue;
      if (Op(FC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      vr !== null && vr.memoizedState.tag & fr) {
        i.flags |= Gr, kp(fr | Fr, UC.bind(null, i, y, s, t), void 0, null);
        var S = Hm();
        if (S === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(S, Zs) || zC(i, t, s);
      }
      return s;
    }
    function zC(e, t, a) {
      e.flags |= ho;
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
      t.value = a, t.getSnapshot = i, PC(t) && HC(e);
    }
    function FC(e, t, a) {
      var i = function() {
        PC(t) && HC(e);
      };
      return a(i);
    }
    function PC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !se(a, i);
      } catch {
        return !0;
      }
    }
    function HC(e) {
      var t = Pa(e, it);
      t !== null && gr(t, e, it, nn);
    }
    function cm(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: ae,
        dispatch: null,
        lastRenderedReducer: Mg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = eb.bind(null, en, a);
      return [t.memoizedState, i];
    }
    function Fg(e) {
      return Ag(Mg);
    }
    function Pg(e) {
      return zg(Mg);
    }
    function kp(e, t, a, i) {
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
    function fm(e) {
      var t = zi();
      return t.memoizedState;
    }
    function Dp(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      en.flags |= e, u.memoizedState = kp(fr | t, a, void 0, s);
    }
    function dm(e, t, a, i) {
      var u = zi(), s = i === void 0 ? null : i, f = void 0;
      if (pr !== null) {
        var p = pr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Lg(s, v)) {
            u.memoizedState = kp(t, a, f, s);
            return;
          }
        }
      }
      en.flags |= e, u.memoizedState = kp(fr | t, a, f, s);
    }
    function pm(e, t) {
      return (en.mode & Ht) !== Xe ? Dp(xi | Gr | bc, Fr, e, t) : Dp(Gr | bc, Fr, e, t);
    }
    function Op(e, t) {
      return dm(Gr, Fr, e, t);
    }
    function Vg(e, t) {
      return Dp(Nt, $l, e, t);
    }
    function vm(e, t) {
      return dm(Nt, $l, e, t);
    }
    function Bg(e, t) {
      var a = Nt;
      return a |= Wi, (en.mode & Ht) !== Xe && (a |= _l), Dp(a, dr, e, t);
    }
    function hm(e, t) {
      return dm(Nt, dr, e, t);
    }
    function VC(e, t) {
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
    function Ig(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Nt;
      return u |= Wi, (en.mode & Ht) !== Xe && (u |= _l), Dp(u, dr, VC.bind(null, t, e), i);
    }
    function mm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return dm(Nt, dr, VC.bind(null, t, e), i);
    }
    function KT(e, t) {
    }
    var ym = KT;
    function Yg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function gm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Lg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function $g(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function Sm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Lg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Qg(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function BC(e) {
      var t = zi(), a = pr, i = a.memoizedState;
      return YC(t, i, e);
    }
    function IC(e) {
      var t = zi();
      if (pr === null)
        return t.memoizedState = e, e;
      var a = pr.memoizedState;
      return YC(t, a, e);
    }
    function YC(e, t, a) {
      var i = !Ld(Zs);
      if (i) {
        if (!se(a, t)) {
          var u = Ad();
          en.lanes = yt(en.lanes, u), Gp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function XT(e, t, a) {
      var i = za();
      Fn(Kv(i, _i)), e(!0);
      var u = Tp.transition;
      Tp.transition = {};
      var s = Tp.transition;
      Tp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Fn(i), Tp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && A("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Wg() {
      var e = cm(!1), t = e[0], a = e[1], i = XT.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function $C() {
      var e = Fg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    function QC() {
      var e = Pg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    var WC = !1;
    function JT() {
      return WC;
    }
    function Gg() {
      var e = Ql(), t = Hm(), a = t.identifierPrefix, i;
      if (Ur()) {
        var u = hT();
        i = ":" + a + "R" + u;
        var s = _p++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = WT++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Em() {
      var e = zi(), t = e.memoizedState;
      return t;
    }
    function ZT(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Io(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (GC(e))
        qC(t, u);
      else {
        var s = xC(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          gr(s, e, i, f), KC(s, t, i);
        }
      }
      XC(e, i);
    }
    function eb(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Io(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (GC(e))
        qC(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === ae && (s === null || s.lanes === ae)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = je.current, je.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, se(y, v)) {
                FT(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              je.current = p;
            }
          }
        }
        var S = xC(e, t, u, i);
        if (S !== null) {
          var N = Ca();
          gr(S, e, i, N), KC(S, t, i);
        }
      }
      XC(e, i);
    }
    function GC(e) {
      var t = e.alternate;
      return e === en || t !== null && t === en;
    }
    function qC(e, t) {
      bp = om = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function KC(e, t, a) {
      if (jd(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = yt(i, a);
        t.lanes = u, tf(e, u);
      }
    }
    function XC(e, t, a) {
      hs(e, t);
    }
    var Cm = {
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
      unstable_isNewReconciler: me
    }, JC = null, ZC = null, e0 = null, t0 = null, Wl = null, ll = null, wm = null;
    {
      var qg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, pt = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      JC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Qt(), Af(t), Yg(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Qt(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Qt(), Af(t), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Qt(), Af(a), Ig(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Qt(), Af(t), Vg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Qt(), Af(t), Bg(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Qt(), Af(t);
          var a = je.current;
          je.current = Wl;
          try {
            return $g(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Qt();
          var i = je.current;
          je.current = Wl;
          try {
            return jg(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Qt(), Hg(e);
        },
        useState: function(e) {
          X = "useState", Qt();
          var t = je.current;
          je.current = Wl;
          try {
            return cm(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Qt(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Qt(), Qg(e);
        },
        useTransition: function() {
          return X = "useTransition", Qt(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Qt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Qt(), Ug(e, t, a);
        },
        useId: function() {
          return X = "useId", Qt(), Gg();
        },
        unstable_isNewReconciler: me
      }, ZC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Te(), Yg(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Te(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Te(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Te(), Ig(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Te(), Vg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Te(), Bg(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Te();
          var a = je.current;
          je.current = Wl;
          try {
            return $g(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Te();
          var i = je.current;
          je.current = Wl;
          try {
            return jg(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Te(), Hg(e);
        },
        useState: function(e) {
          X = "useState", Te();
          var t = je.current;
          je.current = Wl;
          try {
            return cm(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Te(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Te(), Qg(e);
        },
        useTransition: function() {
          return X = "useTransition", Te(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Te(), Ug(e, t, a);
        },
        useId: function() {
          return X = "useId", Te(), Gg();
        },
        unstable_isNewReconciler: me
      }, e0 = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Te(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Te(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Te(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Te(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Te(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Te(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Te();
          var a = je.current;
          je.current = ll;
          try {
            return Sm(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Te();
          var i = je.current;
          je.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Te(), fm();
        },
        useState: function(e) {
          X = "useState", Te();
          var t = je.current;
          je.current = ll;
          try {
            return Fg(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Te(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Te(), BC(e);
        },
        useTransition: function() {
          return X = "useTransition", Te(), $C();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Te(), sm(e, t);
        },
        useId: function() {
          return X = "useId", Te(), Em();
        },
        unstable_isNewReconciler: me
      }, t0 = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Te(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Te(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Te(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Te(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Te(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Te(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Te();
          var a = je.current;
          je.current = wm;
          try {
            return Sm(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Te();
          var i = je.current;
          je.current = wm;
          try {
            return zg(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Te(), fm();
        },
        useState: function(e) {
          X = "useState", Te();
          var t = je.current;
          je.current = wm;
          try {
            return Pg(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Te(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Te(), IC(e);
        },
        useTransition: function() {
          return X = "useTransition", Te(), QC();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Te(), sm(e, t);
        },
        useId: function() {
          return X = "useId", Te(), Em();
        },
        unstable_isNewReconciler: me
      }, Wl = {
        readContext: function(e) {
          return qg(), nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", pt(), Qt(), Yg(e, t);
        },
        useContext: function(e) {
          return X = "useContext", pt(), Qt(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", pt(), Qt(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", pt(), Qt(), Ig(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", pt(), Qt(), Vg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", pt(), Qt(), Bg(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", pt(), Qt();
          var a = je.current;
          je.current = Wl;
          try {
            return $g(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", pt(), Qt();
          var i = je.current;
          je.current = Wl;
          try {
            return jg(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", pt(), Qt(), Hg(e);
        },
        useState: function(e) {
          X = "useState", pt(), Qt();
          var t = je.current;
          je.current = Wl;
          try {
            return cm(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", pt(), Qt(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", pt(), Qt(), Qg(e);
        },
        useTransition: function() {
          return X = "useTransition", pt(), Qt(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", pt(), Qt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", pt(), Qt(), Ug(e, t, a);
        },
        useId: function() {
          return X = "useId", pt(), Qt(), Gg();
        },
        unstable_isNewReconciler: me
      }, ll = {
        readContext: function(e) {
          return qg(), nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", pt(), Te(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", pt(), Te(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", pt(), Te(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", pt(), Te(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", pt(), Te(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", pt(), Te(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", pt(), Te();
          var a = je.current;
          je.current = ll;
          try {
            return Sm(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", pt(), Te();
          var i = je.current;
          je.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", pt(), Te(), fm();
        },
        useState: function(e) {
          X = "useState", pt(), Te();
          var t = je.current;
          je.current = ll;
          try {
            return Fg(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", pt(), Te(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", pt(), Te(), BC(e);
        },
        useTransition: function() {
          return X = "useTransition", pt(), Te(), $C();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", pt(), Te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", pt(), Te(), sm(e, t);
        },
        useId: function() {
          return X = "useId", pt(), Te(), Em();
        },
        unstable_isNewReconciler: me
      }, wm = {
        readContext: function(e) {
          return qg(), nr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", pt(), Te(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", pt(), Te(), nr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", pt(), Te(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", pt(), Te(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", pt(), Te(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", pt(), Te(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", pt(), Te();
          var a = je.current;
          je.current = ll;
          try {
            return Sm(e, t);
          } finally {
            je.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", pt(), Te();
          var i = je.current;
          je.current = ll;
          try {
            return zg(e, t, a);
          } finally {
            je.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", pt(), Te(), fm();
        },
        useState: function(e) {
          X = "useState", pt(), Te();
          var t = je.current;
          je.current = ll;
          try {
            return Pg(e);
          } finally {
            je.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", pt(), Te(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", pt(), Te(), IC(e);
        },
        useTransition: function() {
          return X = "useTransition", pt(), Te(), QC();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", pt(), Te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", pt(), Te(), sm(e, t);
        },
        useId: function() {
          return X = "useId", pt(), Te(), Em();
        },
        unstable_isNewReconciler: me
      };
    }
    var Po = w.unstable_now, n0 = 0, xm = -1, Np = -1, Rm = -1, Kg = !1, Tm = !1;
    function r0() {
      return Kg;
    }
    function tb() {
      Tm = !0;
    }
    function nb() {
      Kg = !1, Tm = !1;
    }
    function rb() {
      Kg = Tm, Tm = !1;
    }
    function a0() {
      return n0;
    }
    function i0() {
      n0 = Po();
    }
    function Xg(e) {
      Np = Po(), e.actualStartTime < 0 && (e.actualStartTime = Po());
    }
    function l0(e) {
      Np = -1;
    }
    function bm(e, t) {
      if (Np >= 0) {
        var a = Po() - Np;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Np = -1;
      }
    }
    function Gl(e) {
      if (xm >= 0) {
        var t = Po() - xm;
        xm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case Y:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Le:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Jg(e) {
      if (Rm >= 0) {
        var t = Po() - Rm;
        Rm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case Y:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Le:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      xm = Po();
    }
    function Zg() {
      Rm = Po();
    }
    function eS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = St({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var tS = {}, nS, rS, aS, iS, lS, u0, _m, uS, oS, sS, Lp;
    {
      nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var o0 = /* @__PURE__ */ new Set();
      _m = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          o0.has(a) || (o0.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, u0 = function(e, t) {
        if (t === void 0) {
          var a = At(e) || "Component";
          lS.has(a) || (lS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(tS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(tS);
    }
    function cS(e, t, a, i) {
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
        u0(t, s);
      }
      var f = s == null ? u : St({}, u, s);
      if (e.memoizedState = f, e.lanes === ae) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var fS = {
      isMounted: jv,
      enqueueSetState: function(e, t, a) {
        var i = vo(e), u = Ca(), s = Io(i), f = Hu(u, s);
        f.payload = t, a != null && (_m(a, "setState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (gr(p, i, s, u), nm(p, i, s)), hs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = vo(e), u = Ca(), s = Io(i), f = Hu(u, s);
        f.tag = TC, f.payload = t, a != null && (_m(a, "replaceState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (gr(p, i, s, u), nm(p, i, s)), hs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = vo(e), i = Ca(), u = Io(a), s = Hu(i, u);
        s.tag = Zh, t != null && (_m(t, "forceUpdate"), s.callback = t);
        var f = Ao(a, s, u);
        f !== null && (gr(f, a, u, i), nm(f, a, u)), Mc(a, u);
      }
    };
    function s0(e, t, a, i, u, s, f) {
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
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", At(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ie(a, i) || !Ie(u, s) : !0;
    }
    function ab(e, t, a) {
      var i = e.stateNode;
      {
        var u = At(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Zt) === Xe && (Lp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Zt) === Xe && (Lp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !oS.has(t) && (oS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", At(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !aS.has(t) && (aS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", At(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || Ct(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function c0(e, t) {
      t.updater = fS, e.stateNode = t, vu(t, e), t._reactInternalInstance = tS;
    }
    function f0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === T && f._context === void 0
        );
        if (!p && !sS.has(t)) {
          sS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", At(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = nr(f);
      else {
        u = xf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? Rf(e, u) : ui;
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
      var N = e.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null;
      c0(e, S);
      {
        if (typeof t.getDerivedStateFromProps == "function" && N === null) {
          var D = At(t) || "Component";
          rS.has(D) || (rS.add(D), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", D, S.state === null ? "null" : "undefined", D));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof S.getSnapshotBeforeUpdate == "function") {
          var F = null, B = null, W = null;
          if (typeof S.componentWillMount == "function" && S.componentWillMount.__suppressDeprecationWarning !== !0 ? F = "componentWillMount" : typeof S.UNSAFE_componentWillMount == "function" && (F = "UNSAFE_componentWillMount"), typeof S.componentWillReceiveProps == "function" && S.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? B = "componentWillReceiveProps" : typeof S.UNSAFE_componentWillReceiveProps == "function" && (B = "UNSAFE_componentWillReceiveProps"), typeof S.componentWillUpdate == "function" && S.componentWillUpdate.__suppressDeprecationWarning !== !0 ? W = "componentWillUpdate" : typeof S.UNSAFE_componentWillUpdate == "function" && (W = "UNSAFE_componentWillUpdate"), F !== null || B !== null || W !== null) {
            var Oe = At(t) || "Component", Ze = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            iS.has(Oe) || (iS.add(Oe), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Oe, Ze, F !== null ? `
  ` + F : "", B !== null ? `
  ` + B : "", W !== null ? `
  ` + W : ""));
          }
        }
      }
      return i && eC(e, u, s), S;
    }
    function ib(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", st(e) || "Component"), fS.enqueueReplaceState(t, t.state, null));
    }
    function d0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = st(e) || "Component";
          nS.has(s) || (nS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        fS.enqueueReplaceState(t, t.state, null);
      }
    }
    function dS(e, t, a, i) {
      ab(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, Cg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nr(s);
      else {
        var f = xf(e, t, !0);
        u.context = Rf(e, f);
      }
      {
        if (u.state === a) {
          var p = At(t) || "Component";
          uS.has(p) || (uS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Zt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (cS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (ib(e, u), rm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Nt;
        y |= Wi, (e.mode & Ht) !== Xe && (y |= _l), e.flags |= y;
      }
    }
    function lb(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = nr(p);
      else {
        var y = xf(e, t, !0);
        v = Rf(e, y);
      }
      var S = t.getDerivedStateFromProps, N = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !N && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && d0(e, u, a, v), _C();
      var D = e.memoizedState, F = u.state = D;
      if (rm(e, a, u, i), F = e.memoizedState, s === a && D === F && !Fh() && !am()) {
        if (typeof u.componentDidMount == "function") {
          var B = Nt;
          B |= Wi, (e.mode & Ht) !== Xe && (B |= _l), e.flags |= B;
        }
        return !1;
      }
      typeof S == "function" && (cS(e, t, S, a), F = e.memoizedState);
      var W = am() || s0(e, t, s, a, D, F, v);
      if (W) {
        if (!N && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var Oe = Nt;
          Oe |= Wi, (e.mode & Ht) !== Xe && (Oe |= _l), e.flags |= Oe;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Ze = Nt;
          Ze |= Wi, (e.mode & Ht) !== Xe && (Ze |= _l), e.flags |= Ze;
        }
        e.memoizedProps = a, e.memoizedState = F;
      }
      return u.props = a, u.state = F, u.context = v, W;
    }
    function ub(e, t, a, i, u) {
      var s = t.stateNode;
      bC(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, S = a.contextType, N = ui;
      if (typeof S == "object" && S !== null)
        N = nr(S);
      else {
        var D = xf(t, a, !0);
        N = Rf(t, D);
      }
      var F = a.getDerivedStateFromProps, B = typeof F == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !B && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== N) && d0(t, s, i, N), _C();
      var W = t.memoizedState, Oe = s.state = W;
      if (rm(t, i, s, u), Oe = t.memoizedState, f === v && W === Oe && !Fh() && !am() && !ge)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Nt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Qn), !1;
      typeof F == "function" && (cS(t, a, F, i), Oe = t.memoizedState);
      var Ze = am() || s0(t, a, p, i, W, Oe, N) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      ge;
      return Ze ? (!B && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Oe, N), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Oe, N)), typeof s.componentDidUpdate == "function" && (t.flags |= Nt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Qn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Nt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Qn), t.memoizedProps = i, t.memoizedState = Oe), s.props = i, s.state = Oe, s.context = N, Ze;
    }
    function ec(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function pS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function ob(e, t) {
      return !0;
    }
    function vS(e, t) {
      try {
        var a = ob(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === Q)
            return;
          console.error(i);
        }
        var p = u ? st(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === Y)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var S = st(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + S + ".");
        }
        var N = v + `
` + f + `

` + ("" + y);
        console.error(N);
      } catch (D) {
        setTimeout(function() {
          throw D;
        });
      }
    }
    var sb = typeof WeakMap == "function" ? WeakMap : Map;
    function p0(e, t, a) {
      var i = Hu(nn, a);
      i.tag = Sg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        t1(u), vS(e, t);
      }, i;
    }
    function hS(e, t, a) {
      var i = Hu(nn, a);
      i.tag = Sg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          Rw(e), vS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        Rw(e), vS(e, t), typeof u != "function" && Z_(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, it) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", st(e) || "Unknown"));
      }), i;
    }
    function v0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new sb(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = n1.bind(null, e, t, a);
        Jr && qp(e, a), t.then(s, s);
      }
    }
    function cb(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function fb(e, t) {
      var a = e.tag;
      if ((e.mode & xt) === Xe && (a === U || a === ye || a === P)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function h0(e) {
      var t = e;
      do {
        if (t.tag === he && $T(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function m0(e, t, a, i, u) {
      if ((e.mode & xt) === Xe) {
        if (e === t)
          e.flags |= Jn;
        else {
          if (e.flags |= qe, a.flags |= Tc, a.flags &= -52805, a.tag === Q) {
            var s = a.alternate;
            if (s === null)
              a.tag = ue;
            else {
              var f = Hu(nn, it);
              f.tag = Zh, Ao(a, f, it);
            }
          }
          a.lanes = yt(a.lanes, it);
        }
        return e;
      }
      return e.flags |= Jn, e.lanes = u, e;
    }
    function db(e, t, a, i, u) {
      if (a.flags |= ss, Jr && qp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        fb(a), Ur() && a.mode & xt && uC();
        var f = h0(t);
        if (f !== null) {
          f.flags &= ~wr, m0(f, t, a, e, u), f.mode & xt && v0(e, s, u), cb(f, e, s);
          return;
        } else {
          if (!Bv(u)) {
            v0(e, s, u), GS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Ur() && a.mode & xt) {
        uC();
        var v = h0(t);
        if (v !== null) {
          (v.flags & Jn) === Ke && (v.flags |= wr), m0(v, t, a, e, u), ug(ec(i, a));
          return;
        }
      }
      i = ec(i, a), $_(i);
      var y = t;
      do {
        switch (y.tag) {
          case Y: {
            var S = i;
            y.flags |= Jn;
            var N = Rs(u);
            y.lanes = yt(y.lanes, N);
            var D = p0(y, S, N);
            wg(y, D);
            return;
          }
          case Q:
            var F = i, B = y.type, W = y.stateNode;
            if ((y.flags & qe) === Ke && (typeof B.getDerivedStateFromError == "function" || W !== null && typeof W.componentDidCatch == "function" && !hw(W))) {
              y.flags |= Jn;
              var Oe = Rs(u);
              y.lanes = yt(y.lanes, Oe);
              var Ze = hS(y, F, Oe);
              wg(y, Ze);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function pb() {
      return null;
    }
    var Mp = R.ReactCurrentOwner, ol = !1, mS, jp, yS, gS, SS, tc, ES, km, Ap;
    mS = {}, jp = {}, yS = {}, gS = {}, SS = {}, tc = !1, ES = {}, km = {}, Ap = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = SC(t, null, a, i) : t.child = kf(t, e.child, a, i);
    }
    function vb(e, t, a, i) {
      t.child = kf(t, e.child, null, i), t.child = kf(t, null, a, i);
    }
    function y0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, $n(!0), v = zf(e, t, f, i, p, u), y = Uf(), t.mode & Zt) {
          gn(!0);
          try {
            v = zf(e, t, f, i, p, u), y = Uf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (MC(e, t, u), Vu(e, t, u)) : (Ur() && y && tg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function g0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (S1(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = $f(s), t.tag = P, t.type = f, xS(t, s), S0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            At(s)
          ), a.defaultProps !== void 0) {
            var v = At(s) || "Unknown";
            Ap[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Ap[v] = !0);
          }
        }
        var y = iE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var S = a.type, N = S.propTypes;
        N && nl(
          N,
          i,
          // Resolved props
          "prop",
          At(S)
        );
      }
      var D = e.child, F = DS(e, u);
      if (!F) {
        var B = D.memoizedProps, W = a.compare;
        if (W = W !== null ? W : Ie, W(B, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var Oe = lc(D, i);
      return Oe.ref = t.ref, Oe.return = t, t.child = Oe, Oe;
    }
    function S0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === dt) {
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
            At(s)
          );
        }
      }
      if (e !== null) {
        var S = e.memoizedProps;
        if (Ie(S, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = S, DS(e, u))
            (e.flags & Tc) !== Ke && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return CS(e, t, a, i, u);
    }
    function E0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ve)
        if ((t.mode & xt) === Xe) {
          var f = {
            baseLanes: ae,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Vm(t, a);
        } else if (ea(a, Zr)) {
          var N = {
            baseLanes: ae,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = N;
          var D = s !== null ? s.baseLanes : a;
          Vm(t, D);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = yt(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Zr;
          var S = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = S, t.updateQueue = null, Vm(t, v), null;
        }
      else {
        var F;
        s !== null ? (F = yt(s.baseLanes, a), t.memoizedState = null) : F = a, Vm(t, F);
      }
      return Sa(e, t, u, a), t.child;
    }
    function hb(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function mb(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function yb(e, t, a) {
      {
        t.flags |= Nt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function C0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Cn, t.flags |= mo);
    }
    function CS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var f;
      {
        var p = xf(t, a, !0);
        f = Rf(t, p);
      }
      var v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, $n(!0), v = zf(e, t, a, i, f, u), y = Uf(), t.mode & Zt) {
          gn(!0);
          try {
            v = zf(e, t, a, i, f, u), y = Uf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (MC(e, t, u), Vu(e, t, u)) : (Ur() && y && tg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function w0(e, t, a, i, u) {
      {
        switch (j1(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= qe, t.flags |= Jn;
            var y = new Error("Simulated error coming from DevTools"), S = Rs(u);
            t.lanes = yt(t.lanes, S);
            var N = hS(t, ec(y, t), S);
            wg(t, N);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var D = a.propTypes;
          D && nl(
            D,
            i,
            // Resolved props
            "prop",
            At(a)
          );
        }
      }
      var F;
      Yl(a) ? (F = !0, Hh(t)) : F = !1, Of(t, u);
      var B = t.stateNode, W;
      B === null ? (Om(e, t), f0(t, a, i), dS(t, a, i, u), W = !0) : e === null ? W = lb(t, a, i, u) : W = ub(e, t, a, i, u);
      var Oe = wS(e, t, a, W, F, u);
      {
        var Ze = t.stateNode;
        W && Ze.props !== i && (tc || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", st(t) || "a component"), tc = !0);
      }
      return Oe;
    }
    function wS(e, t, a, i, u, s) {
      C0(e, t);
      var f = (t.flags & qe) !== Ke;
      if (!i && !f)
        return u && rC(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Mp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, l0();
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
      return t.flags |= ni, e !== null && f ? vb(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && rC(t, a, !0), t.child;
    }
    function x0(e) {
      var t = e.stateNode;
      t.pendingContext ? tC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && tC(e, t.context, !1), xg(e, t.containerInfo);
    }
    function gb(e, t, a) {
      if (x0(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      bC(e, t), rm(t, i, null, a);
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
        if (y.baseState = v, t.memoizedState = v, t.flags & wr) {
          var S = ec(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return R0(e, t, p, a, S);
        } else if (p !== s) {
          var N = ec(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return R0(e, t, p, a, N);
        } else {
          CT(t);
          var D = SC(t, null, p, a);
          t.child = D;
          for (var F = D; F; )
            F.flags = F.flags & ~yn | qr, F = F.sibling;
        }
      } else {
        if (_f(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function R0(e, t, a, i, u) {
      return _f(), ug(u), t.flags |= wr, Sa(e, t, a, i), t.child;
    }
    function Sb(e, t, a) {
      OC(t), e === null && lg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Vy(i, u);
      return p ? f = null : s !== null && Vy(i, s) && (t.flags |= Oa), C0(e, t), Sa(e, t, f, a), t.child;
    }
    function Eb(e, t) {
      return e === null && lg(t), null;
    }
    function Cb(e, t, a, i) {
      Om(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = E1(v), S = ul(v, u), N;
      switch (y) {
        case U:
          return xS(t, v), t.type = v = $f(v), N = CS(null, t, v, S, i), N;
        case Q:
          return t.type = v = ZS(v), N = w0(null, t, v, S, i), N;
        case ye:
          return t.type = v = eE(v), N = y0(null, t, v, S, i), N;
        case Ee: {
          if (t.type !== t.elementType) {
            var D = v.propTypes;
            D && nl(
              D,
              S,
              // Resolved for outer only
              "prop",
              At(v)
            );
          }
          return N = g0(
            null,
            t,
            v,
            ul(v.type, S),
            // The inner type can have defaults too
            i
          ), N;
        }
      }
      var F = "";
      throw v !== null && typeof v == "object" && v.$$typeof === dt && (F = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + F));
    }
    function wb(e, t, a, i, u) {
      Om(e, t), t.tag = Q;
      var s;
      return Yl(a) ? (s = !0, Hh(t)) : s = !1, Of(t, u), f0(t, a, i), dS(t, a, i, u), wS(null, t, a, !0, s, u);
    }
    function xb(e, t, a, i) {
      Om(e, t);
      var u = t.pendingProps, s;
      {
        var f = xf(t, a, !1);
        s = Rf(t, f);
      }
      Of(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = At(a) || "Unknown";
          mS[y] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), mS[y] = !0);
        }
        t.mode & Zt && al.recordLegacyContextWarning(t, null), $n(!0), Mp.current = t, p = zf(null, t, a, u, s, i), v = Uf(), $n(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var S = At(a) || "Unknown";
        jp[S] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", S, S, S), jp[S] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var N = At(a) || "Unknown";
          jp[N] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", N, N, N), jp[N] = !0);
        }
        t.tag = Q, t.memoizedState = null, t.updateQueue = null;
        var D = !1;
        return Yl(a) ? (D = !0, Hh(t)) : D = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Cg(t), c0(t, p), dS(t, a, u, i), wS(null, t, a, !0, D, i);
      } else {
        if (t.tag = U, t.mode & Zt) {
          gn(!0);
          try {
            p = zf(null, t, a, u, s, i), v = Uf();
          } finally {
            gn(!1);
          }
        }
        return Ur() && v && tg(t), Sa(null, t, p, i), xS(t, a), t.child;
      }
    }
    function xS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), SS[u] || (SS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = At(t) || "Unknown";
          Ap[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Ap[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = At(t) || "Unknown";
          gS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), gS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = At(t) || "Unknown";
          yS[v] || (g("%s: Function components do not support contextType.", v), yS[v] = !0);
        }
      }
    }
    var RS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Ut
    };
    function TS(e) {
      return {
        baseLanes: e,
        cachePool: pb(),
        transitions: null
      };
    }
    function Rb(e, t) {
      var a = null;
      return {
        baseLanes: yt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function Tb(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return bg(e, Rp);
    }
    function bb(e, t) {
      return Ts(e.childLanes, t);
    }
    function T0(e, t, a) {
      var i = t.pendingProps;
      A1(t) && (t.flags |= qe);
      var u = il.current, s = !1, f = (t.flags & qe) !== Ke;
      if (f || Tb(u, e) ? (s = !0, t.flags &= ~qe) : (e === null || e.memoizedState !== null) && (u = YT(u, LC)), u = Lf(u), Uo(t, u), e === null) {
        lg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Nb(t, v);
        }
        var y = i.children, S = i.fallback;
        if (s) {
          var N = _b(t, y, S, a), D = t.child;
          return D.memoizedState = TS(a), t.memoizedState = RS, N;
        } else
          return bS(t, y);
      } else {
        var F = e.memoizedState;
        if (F !== null) {
          var B = F.dehydrated;
          if (B !== null)
            return Lb(e, t, f, i, B, F, a);
        }
        if (s) {
          var W = i.fallback, Oe = i.children, Ze = Db(e, t, Oe, W, a), Ge = t.child, jt = e.child.memoizedState;
          return Ge.memoizedState = jt === null ? TS(a) : Rb(jt, a), Ge.childLanes = bb(e, a), t.memoizedState = RS, Ze;
        } else {
          var kt = i.children, M = kb(e, t, kt, a);
          return t.memoizedState = null, M;
        }
      }
    }
    function bS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = _S(u, i);
      return s.return = e, e.child = s, s;
    }
    function _b(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & xt) === Xe && s !== null ? (p = s, p.childLanes = ae, p.pendingProps = f, e.mode & Pt && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = $o(a, u, i, null)) : (p = _S(f, u), v = $o(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function _S(e, t, a) {
      return bw(e, t, ae, null);
    }
    function b0(e, t) {
      return lc(e, t);
    }
    function kb(e, t, a, i) {
      var u = e.child, s = u.sibling, f = b0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & xt) === Xe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function Db(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & xt) === Xe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var S = t.child;
        y = S, y.childLanes = ae, y.pendingProps = v, t.mode & Pt && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = b0(f, v), y.subtreeFlags = f.subtreeFlags & An;
      var N;
      return p !== null ? N = lc(p, i) : (N = $o(i, s, u, null), N.flags |= yn), N.return = t, y.return = t, y.sibling = N, t.child = y, N;
    }
    function Dm(e, t, a, i) {
      i !== null && ug(i), kf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = bS(t, s);
      return f.flags |= yn, t.memoizedState = null, f;
    }
    function Ob(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = _S(f, s), v = $o(i, s, u, null);
      return v.flags |= yn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & xt) !== Xe && kf(t, e.child, null, u), v;
    }
    function Nb(e, t, a) {
      return (e.mode & xt) === Xe ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = it) : $y(t) ? e.lanes = xr : e.lanes = Zr, null;
    }
    function Lb(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & wr) {
          t.flags &= ~wr;
          var M = pS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Dm(e, t, f, M);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= qe, null;
          var G = i.children, j = i.fallback, pe = Ob(e, t, G, j, f), ze = t.child;
          return ze.memoizedState = TS(f), t.memoizedState = RS, pe;
        }
      else {
        if (ST(), (t.mode & xt) === Xe)
          return Dm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if ($y(u)) {
          var p, v, y;
          {
            var S = zR(u);
            p = S.digest, v = S.message, y = S.stack;
          }
          var N;
          v ? N = new Error(v) : N = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var D = pS(N, p, y);
          return Dm(e, t, f, D);
        }
        var F = ea(f, e.childLanes);
        if (ol || F) {
          var B = Hm();
          if (B !== null) {
            var W = Fd(B, f);
            if (W !== Ut && W !== s.retryLane) {
              s.retryLane = W;
              var Oe = nn;
              Pa(e, W), gr(B, e, W, Oe);
            }
          }
          GS();
          var Ze = pS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Dm(e, t, f, Ze);
        } else if (qE(u)) {
          t.flags |= qe, t.child = e.child;
          var Ge = r1.bind(null, e);
          return UR(u, Ge), null;
        } else {
          wT(t, u, s.treeContext);
          var jt = i.children, kt = bS(t, jt);
          return kt.flags |= qr, kt;
        }
      }
    }
    function _0(e, t, a) {
      e.lanes = yt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = yt(i.lanes, t)), yg(e.return, t, a);
    }
    function Mb(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === he) {
          var u = i.memoizedState;
          u !== null && _0(i, a, e);
        } else if (i.tag === Ve)
          _0(i, a, e);
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
    function jb(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && um(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function Ab(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !ES[e])
        if (ES[e] = !0, typeof e == "string")
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
      e !== void 0 && !km[e] && (e !== "collapsed" && e !== "hidden" ? (km[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (km[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function k0(e, t) {
      {
        var a = Ct(e), i = !a && typeof mt(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Ub(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Ct(e)) {
          for (var a = 0; a < e.length; a++)
            if (!k0(e[a], a))
              return;
        } else {
          var i = mt(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!k0(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function kS(e, t, a, i, u) {
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
    function D0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Ab(u), zb(s, u), Ub(f, u), Sa(e, t, f, a);
      var p = il.current, v = bg(p, Rp);
      if (v)
        p = _g(p, Rp), t.flags |= qe;
      else {
        var y = e !== null && (e.flags & qe) !== Ke;
        y && Mb(t, t.child, a), p = Lf(p);
      }
      if (Uo(t, p), (t.mode & xt) === Xe)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var S = jb(t.child), N;
            S === null ? (N = t.child, t.child = null) : (N = S.sibling, S.sibling = null), kS(
              t,
              !1,
              // isBackwards
              N,
              S,
              s
            );
            break;
          }
          case "backwards": {
            var D = null, F = t.child;
            for (t.child = null; F !== null; ) {
              var B = F.alternate;
              if (B !== null && um(B) === null) {
                t.child = F;
                break;
              }
              var W = F.sibling;
              F.sibling = D, D = F, F = W;
            }
            kS(
              t,
              !0,
              // isBackwards
              D,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            kS(
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
    function Fb(e, t, a) {
      xg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = kf(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var O0 = !1;
    function Pb(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || O0 || (O0 = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (wC(t, u, p), f !== null) {
        var y = f.value;
        if (se(y, p)) {
          if (f.children === s.children && !Fh())
            return Vu(e, t, a);
        } else
          AT(t, u, a);
      }
      var S = s.children;
      return Sa(e, t, S, a), t.child;
    }
    var N0 = !1;
    function Hb(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (N0 || (N0 = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
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
    function Om(e, t) {
      (t.mode & xt) === Xe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), l0(), Gp(t.lanes), ea(a, t.childLanes) ? (MT(e, t), t.child) : null;
    }
    function Vb(e, t, a) {
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
    function DS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function Bb(e, t, a) {
      switch (t.tag) {
        case Y:
          x0(t), t.stateNode, _f();
          break;
        case te:
          OC(t);
          break;
        case Q: {
          var i = t.type;
          Yl(i) && Hh(t);
          break;
        }
        case ee:
          xg(t, t.stateNode.containerInfo);
          break;
        case ce: {
          var u = t.memoizedProps.value, s = t.type._context;
          wC(t, s, u);
          break;
        }
        case Le:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= Nt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case he: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Lf(il.current)), t.flags |= qe, null;
            var y = t.child, S = y.childLanes;
            if (ea(a, S))
              return T0(e, t, a);
            Uo(t, Lf(il.current));
            var N = Vu(e, t, a);
            return N !== null ? N.sibling : null;
          } else
            Uo(t, Lf(il.current));
          break;
        }
        case Ve: {
          var D = (e.flags & qe) !== Ke, F = ea(a, t.childLanes);
          if (D) {
            if (F)
              return D0(e, t, a);
            t.flags |= qe;
          }
          var B = t.memoizedState;
          if (B !== null && (B.rendering = null, B.tail = null, B.lastEffect = null), Uo(t, il.current), F)
            break;
          return null;
        }
        case Re:
        case bt:
          return t.lanes = ae, E0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function L0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Vb(e, t, iE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Fh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = DS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & qe) === Ke)
            return ol = !1, Bb(e, t, a);
          (e.flags & Tc) !== Ke ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, Ur() && pT(t)) {
        var f = t.index, p = vT();
        lC(t, p, f);
      }
      switch (t.lanes = ae, t.tag) {
        case ke:
          return xb(e, t, t.type, a);
        case fe: {
          var v = t.elementType;
          return Cb(e, t, v, a);
        }
        case U: {
          var y = t.type, S = t.pendingProps, N = t.elementType === y ? S : ul(y, S);
          return CS(e, t, y, N, a);
        }
        case Q: {
          var D = t.type, F = t.pendingProps, B = t.elementType === D ? F : ul(D, F);
          return w0(e, t, D, B, a);
        }
        case Y:
          return gb(e, t, a);
        case te:
          return Sb(e, t, a);
        case ne:
          return Eb(e, t);
        case he:
          return T0(e, t, a);
        case ee:
          return Fb(e, t, a);
        case ye: {
          var W = t.type, Oe = t.pendingProps, Ze = t.elementType === W ? Oe : ul(W, Oe);
          return y0(e, t, W, Ze, a);
        }
        case K:
          return hb(e, t, a);
        case Ce:
          return mb(e, t, a);
        case Le:
          return yb(e, t, a);
        case ce:
          return Pb(e, t, a);
        case Ue:
          return Hb(e, t, a);
        case Ee: {
          var Ge = t.type, jt = t.pendingProps, kt = ul(Ge, jt);
          if (t.type !== t.elementType) {
            var M = Ge.propTypes;
            M && nl(
              M,
              kt,
              // Resolved for outer only
              "prop",
              At(Ge)
            );
          }
          return kt = ul(Ge.type, kt), g0(e, t, Ge, kt, a);
        }
        case P:
          return S0(e, t, t.type, t.pendingProps, a);
        case ue: {
          var G = t.type, j = t.pendingProps, pe = t.elementType === G ? j : ul(G, j);
          return wb(e, t, G, pe, a);
        }
        case Ve:
          return D0(e, t, a);
        case et:
          break;
        case Re:
          return E0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ff(e) {
      e.flags |= Nt;
    }
    function M0(e) {
      e.flags |= Cn, e.flags |= mo;
    }
    var j0, OS, A0, z0;
    j0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === te || u.tag === ne)
          cR(e, u.stateNode);
        else if (u.tag !== ee) {
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
    }, OS = function(e, t) {
    }, A0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Rg(), v = dR(f, a, s, i, u, p);
        t.updateQueue = v, v && Ff(t);
      }
    }, z0 = function(e, t, a, i) {
      a !== i && Ff(t);
    };
    function Up(e, t) {
      if (!Ur())
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
    function Pr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = ae, i = Ke;
      if (t) {
        if ((e.mode & Pt) !== Xe) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = yt(a, yt(y.lanes, y.childLanes)), i |= y.subtreeFlags & An, i |= y.flags & An, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var S = e.child; S !== null; )
            a = yt(a, yt(S.lanes, S.childLanes)), i |= S.subtreeFlags & An, i |= S.flags & An, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Pt) !== Xe) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = yt(a, yt(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = yt(a, yt(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Ib(e, t, a) {
      if (_T() && (t.mode & xt) !== Xe && (t.flags & qe) === Ke)
        return pC(t), _f(), t.flags |= wr | ss | Jn, !1;
      var i = $h(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (TT(t), Pr(t), (t.mode & Pt) !== Xe) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (_f(), (t.flags & qe) === Ke && (t.memoizedState = null), t.flags |= Nt, Pr(t), (t.mode & Pt) !== Xe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return vC(), !0;
    }
    function U0(e, t, a) {
      var i = t.pendingProps;
      switch (ng(t), t.tag) {
        case ke:
        case fe:
        case P:
        case U:
        case ye:
        case K:
        case Ce:
        case Le:
        case Ue:
        case Ee:
          return Pr(t), null;
        case Q: {
          var u = t.type;
          return Yl(u) && Ph(t), Pr(t), null;
        }
        case Y: {
          var s = t.stateNode;
          if (Nf(t), Jy(t), Dg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = $h(t);
            if (f)
              Ff(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & wr) !== Ke) && (t.flags |= Qn, vC());
            }
          }
          return OS(e, t), Pr(t), null;
        }
        case te: {
          Tg(t);
          var v = DC(), y = t.type;
          if (e !== null && t.stateNode != null)
            A0(e, t, y, i, v), e.ref !== t.ref && M0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Pr(t), null;
            }
            var S = Rg(), N = $h(t);
            if (N)
              xT(t, v, S) && Ff(t);
            else {
              var D = sR(y, i, v, S, t);
              j0(D, t, !1, !1), t.stateNode = D, fR(D, y, i, v) && Ff(t);
            }
            t.ref !== null && M0(t);
          }
          return Pr(t), null;
        }
        case ne: {
          var F = i;
          if (e && t.stateNode != null) {
            var B = e.memoizedProps;
            z0(e, t, B, F);
          } else {
            if (typeof F != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var W = DC(), Oe = Rg(), Ze = $h(t);
            Ze ? RT(t) && Ff(t) : t.stateNode = pR(F, W, Oe, t);
          }
          return Pr(t), null;
        }
        case he: {
          Mf(t);
          var Ge = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var jt = Ib(e, t, Ge);
            if (!jt)
              return t.flags & Jn ? t : null;
          }
          if ((t.flags & qe) !== Ke)
            return t.lanes = a, (t.mode & Pt) !== Xe && eS(t), t;
          var kt = Ge !== null, M = e !== null && e.memoizedState !== null;
          if (kt !== M && kt) {
            var G = t.child;
            if (G.flags |= jn, (t.mode & xt) !== Xe) {
              var j = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              j || bg(il.current, LC) ? Y_() : GS();
            }
          }
          var pe = t.updateQueue;
          if (pe !== null && (t.flags |= Nt), Pr(t), (t.mode & Pt) !== Xe && kt) {
            var ze = t.child;
            ze !== null && (t.treeBaseDuration -= ze.treeBaseDuration);
          }
          return null;
        }
        case ee:
          return Nf(t), OS(e, t), e === null && lT(t.stateNode.containerInfo), Pr(t), null;
        case ce:
          var Ne = t.type._context;
          return mg(Ne, t), Pr(t), null;
        case ue: {
          var lt = t.type;
          return Yl(lt) && Ph(t), Pr(t), null;
        }
        case Ve: {
          Mf(t);
          var vt = t.memoizedState;
          if (vt === null)
            return Pr(t), null;
          var tn = (t.flags & qe) !== Ke, Bt = vt.rendering;
          if (Bt === null)
            if (tn)
              Up(vt, !1);
            else {
              var qn = Q_() && (e === null || (e.flags & qe) === Ke);
              if (!qn)
                for (var It = t.child; It !== null; ) {
                  var Vn = um(It);
                  if (Vn !== null) {
                    tn = !0, t.flags |= qe, Up(vt, !1);
                    var ua = Vn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= Nt), t.subtreeFlags = Ke, jT(t, a), Uo(t, _g(il.current, Rp)), t.child;
                  }
                  It = It.sibling;
                }
              vt.tail !== null && Wn() > aw() && (t.flags |= qe, tn = !0, Up(vt, !1), t.lanes = Dd);
            }
          else {
            if (!tn) {
              var Yr = um(Bt);
              if (Yr !== null) {
                t.flags |= qe, tn = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= Nt), Up(vt, !0), vt.tail === null && vt.tailMode === "hidden" && !Bt.alternate && !Ur())
                  return Pr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wn() * 2 - vt.renderingStartTime > aw() && a !== Zr && (t.flags |= qe, tn = !0, Up(vt, !1), t.lanes = Dd);
            }
            if (vt.isBackwards)
              Bt.sibling = t.child, t.child = Bt;
            else {
              var wa = vt.last;
              wa !== null ? wa.sibling = Bt : t.child = Bt, vt.last = Bt;
            }
          }
          if (vt.tail !== null) {
            var xa = vt.tail;
            vt.rendering = xa, vt.tail = xa.sibling, vt.renderingStartTime = Wn(), xa.sibling = null;
            var oa = il.current;
            return tn ? oa = _g(oa, Rp) : oa = Lf(oa), Uo(t, oa), xa;
          }
          return Pr(t), null;
        }
        case et:
          break;
        case Re:
        case bt: {
          WS(t);
          var Qu = t.memoizedState, Qf = Qu !== null;
          if (e !== null) {
            var Zp = e.memoizedState, Jl = Zp !== null;
            Jl !== Qf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ve && (t.flags |= jn);
          }
          return !Qf || (t.mode & xt) === Xe ? Pr(t) : ea(Xl, Zr) && (Pr(t), t.subtreeFlags & (yn | Nt) && (t.flags |= jn)), null;
        }
        case _t:
          return null;
        case Dt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Yb(e, t, a) {
      switch (ng(t), t.tag) {
        case Q: {
          var i = t.type;
          Yl(i) && Ph(t);
          var u = t.flags;
          return u & Jn ? (t.flags = u & ~Jn | qe, (t.mode & Pt) !== Xe && eS(t), t) : null;
        }
        case Y: {
          t.stateNode, Nf(t), Jy(t), Dg();
          var s = t.flags;
          return (s & Jn) !== Ke && (s & qe) === Ke ? (t.flags = s & ~Jn | qe, t) : null;
        }
        case te:
          return Tg(t), null;
        case he: {
          Mf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            _f();
          }
          var p = t.flags;
          return p & Jn ? (t.flags = p & ~Jn | qe, (t.mode & Pt) !== Xe && eS(t), t) : null;
        }
        case Ve:
          return Mf(t), null;
        case ee:
          return Nf(t), null;
        case ce:
          var v = t.type._context;
          return mg(v, t), null;
        case Re:
        case bt:
          return WS(t), null;
        case _t:
          return null;
        default:
          return null;
      }
    }
    function F0(e, t, a) {
      switch (ng(t), t.tag) {
        case Q: {
          var i = t.type.childContextTypes;
          i != null && Ph(t);
          break;
        }
        case Y: {
          t.stateNode, Nf(t), Jy(t), Dg();
          break;
        }
        case te: {
          Tg(t);
          break;
        }
        case ee:
          Nf(t);
          break;
        case he:
          Mf(t);
          break;
        case Ve:
          Mf(t);
          break;
        case ce:
          var u = t.type._context;
          mg(u, t);
          break;
        case Re:
        case bt:
          WS(t);
          break;
      }
    }
    var P0 = null;
    P0 = /* @__PURE__ */ new Set();
    var Nm = !1, Hr = !1, $b = typeof WeakSet == "function" ? WeakSet : Set, Ye = null, Pf = null, Hf = null;
    function Qb(e) {
      bl(null, function() {
        throw e;
      }), os();
    }
    var Wb = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Pt)
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
    function NS(e, t, a) {
      try {
        Wb(e, a);
      } catch (i) {
        dn(e, t, i);
      }
    }
    function Gb(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        dn(e, t, i);
      }
    }
    function V0(e, t) {
      try {
        I0(e);
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
            if (Ae && at && e.mode & Pt)
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
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", st(e));
        } else
          a.current = null;
    }
    function Lm(e, t, a) {
      try {
        a();
      } catch (i) {
        dn(e, t, i);
      }
    }
    var B0 = !1;
    function qb(e, t) {
      uR(e.containerInfo), Ye = t, Kb();
      var a = B0;
      return B0 = !1, a;
    }
    function Kb() {
      for (; Ye !== null; ) {
        var e = Ye, t = e.child;
        (e.subtreeFlags & kl) !== Ke && t !== null ? (t.return = e, Ye = t) : Xb();
      }
    }
    function Xb() {
      for (; Ye !== null; ) {
        var e = Ye;
        Kt(e);
        try {
          Jb(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ye = t;
          return;
        }
        Ye = e.return;
      }
    }
    function Jb(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Qn) !== Ke) {
        switch (Kt(e), e.tag) {
          case U:
          case ye:
          case P:
            break;
          case Q: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !tc && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = P0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", st(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case Y: {
            {
              var v = e.stateNode;
              LR(v.containerInfo);
            }
            break;
          }
          case te:
          case ne:
          case ee:
          case ue:
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
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Ha ? Ki(t) : (e & dr) !== Ha && fs(t), (e & $l) !== Ha && Kp(!0), Lm(t, a, p), (e & $l) !== Ha && Kp(!1), (e & Fr) !== Ha ? Ll() : (e & dr) !== Ha && _d());
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
            (e & Fr) !== Ha ? bd(t) : (e & dr) !== Ha && Nc(t);
            var f = s.create;
            (e & $l) !== Ha && Kp(!0), s.destroy = f(), (e & $l) !== Ha && Kp(!1), (e & Fr) !== Ha ? Uv() : (e & dr) !== Ha && Fv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & dr) !== Ke ? v = "useLayoutEffect" : (s.tag & $l) !== Ke ? v = "useInsertionEffect" : v = "useEffect";
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
    function Zb(e, t) {
      if ((t.flags & Nt) !== Ke)
        switch (t.tag) {
          case Le: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = a0(), p = t.alternate === null ? "mount" : "update";
            r0() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case Y:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case Le:
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
    function e_(e, t, a, i) {
      if ((a.flags & Ol) !== Ke)
        switch (a.tag) {
          case U:
          case ye:
          case P: {
            if (!Hr)
              if (a.mode & Pt)
                try {
                  ql(), Ho(dr | fr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(dr | fr, a);
            break;
          }
          case Q: {
            var u = a.stateNode;
            if (a.flags & Nt && !Hr)
              if (t === null)
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), a.mode & Pt)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), a.mode & Pt)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), kC(a, p, u));
            break;
          }
          case Y: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case te:
                    y = a.child.stateNode;
                    break;
                  case Q:
                    y = a.child.stateNode;
                    break;
                }
              kC(a, v, y);
            }
            break;
          }
          case te: {
            var S = a.stateNode;
            if (t === null && a.flags & Nt) {
              var N = a.type, D = a.memoizedProps;
              gR(S, N, D);
            }
            break;
          }
          case ne:
            break;
          case ee:
            break;
          case Le: {
            {
              var F = a.memoizedProps, B = F.onCommit, W = F.onRender, Oe = a.stateNode.effectDuration, Ze = a0(), Ge = t === null ? "mount" : "update";
              r0() && (Ge = "nested-update"), typeof W == "function" && W(a.memoizedProps.id, Ge, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Ze);
              {
                typeof B == "function" && B(a.memoizedProps.id, Ge, Oe, Ze), X_(a);
                var jt = a.return;
                e: for (; jt !== null; ) {
                  switch (jt.tag) {
                    case Y:
                      var kt = jt.stateNode;
                      kt.effectDuration += Oe;
                      break e;
                    case Le:
                      var M = jt.stateNode;
                      M.effectDuration += Oe;
                      break e;
                  }
                  jt = jt.return;
                }
              }
            }
            break;
          }
          case he: {
            o_(e, a);
            break;
          }
          case Ve:
          case ue:
          case et:
          case Re:
          case bt:
          case Dt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Hr || a.flags & Cn && I0(a);
    }
    function t_(e) {
      switch (e.tag) {
        case U:
        case ye:
        case P: {
          if (e.mode & Pt)
            try {
              ql(), H0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            H0(e, e.return);
          break;
        }
        case Q: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Gb(e, e.return, t), V0(e, e.return);
          break;
        }
        case te: {
          V0(e, e.return);
          break;
        }
      }
    }
    function n_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === te) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? kR(u) : OR(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === ne) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? DR(s) : NR(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === Re || i.tag === bt) && i.memoizedState !== null && i !== e)) {
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
    function I0(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case te:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Pt)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", st(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", st(e)), t.current = i;
      }
    }
    function r_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function Y0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Y0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === te) {
          var a = e.stateNode;
          a !== null && sT(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function a_(e) {
      for (var t = e.return; t !== null; ) {
        if ($0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function $0(e) {
      return e.tag === te || e.tag === Y || e.tag === ee;
    }
    function Q0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || $0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== te && t.tag !== ne && t.tag !== xe; ) {
          if (t.flags & yn || t.child === null || t.tag === ee)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & yn))
          return t.stateNode;
      }
    }
    function i_(e) {
      var t = a_(e);
      switch (t.tag) {
        case te: {
          var a = t.stateNode;
          t.flags & Oa && (GE(a), t.flags &= ~Oa);
          var i = Q0(e);
          MS(e, i, a);
          break;
        }
        case Y:
        case ee: {
          var u = t.stateNode.containerInfo, s = Q0(e);
          LS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function LS(e, t, a) {
      var i = e.tag, u = i === te || i === ne;
      if (u) {
        var s = e.stateNode;
        t ? RR(a, s, t) : wR(a, s);
      } else if (i !== ee) {
        var f = e.child;
        if (f !== null) {
          LS(f, t, a);
          for (var p = f.sibling; p !== null; )
            LS(p, t, a), p = p.sibling;
        }
      }
    }
    function MS(e, t, a) {
      var i = e.tag, u = i === te || i === ne;
      if (u) {
        var s = e.stateNode;
        t ? xR(a, s, t) : CR(a, s);
      } else if (i !== ee) {
        var f = e.child;
        if (f !== null) {
          MS(f, t, a);
          for (var p = f.sibling; p !== null; )
            MS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function l_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case te: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case Y: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case ee: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        W0(e, t, a), Vr = null, cl = !1;
      }
      r_(a);
    }
    function Vo(e, t, a) {
      for (var i = a.child; i !== null; )
        W0(e, t, i), i = i.sibling;
    }
    function W0(e, t, a) {
      switch (xd(a), a.tag) {
        case te:
          Hr || Vf(a, t);
        case ne: {
          {
            var i = Vr, u = cl;
            Vr = null, Vo(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? bR(Vr, a.stateNode) : TR(Vr, a.stateNode));
          }
          return;
        }
        case xe: {
          Vr !== null && (cl ? _R(Vr, a.stateNode) : Yy(Vr, a.stateNode));
          return;
        }
        case ee: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Vo(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case U:
        case ye:
        case Ee:
        case P: {
          if (!Hr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, S = y;
                do {
                  var N = S, D = N.destroy, F = N.tag;
                  D !== void 0 && ((F & $l) !== Ha ? Lm(a, t, D) : (F & dr) !== Ha && (fs(a), a.mode & Pt ? (ql(), Lm(a, t, D), Gl(a)) : Lm(a, t, D), _d())), S = S.next;
                } while (S !== y);
              }
            }
          }
          Vo(e, t, a);
          return;
        }
        case Q: {
          if (!Hr) {
            Vf(a, t);
            var B = a.stateNode;
            typeof B.componentWillUnmount == "function" && NS(a, t, B);
          }
          Vo(e, t, a);
          return;
        }
        case et: {
          Vo(e, t, a);
          return;
        }
        case Re: {
          if (
            // TODO: Remove this dead flag
            a.mode & xt
          ) {
            var W = Hr;
            Hr = W || a.memoizedState !== null, Vo(e, t, a), Hr = W;
          } else
            Vo(e, t, a);
          break;
        }
        default: {
          Vo(e, t, a);
          return;
        }
      }
    }
    function u_(e) {
      e.memoizedState;
    }
    function o_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && QR(s);
          }
        }
      }
    }
    function G0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new $b()), t.forEach(function(i) {
          var u = a1.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Jr)
              if (Pf !== null && Hf !== null)
                qp(Hf, Pf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function s_(e, t, a) {
      Pf = a, Hf = e, Kt(t), q0(t, e), Kt(t), Pf = null, Hf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            l_(e, t, s);
          } catch (v) {
            dn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Kt(p), q0(p, e), p = p.sibling;
      Kt(f);
    }
    function q0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case U:
        case ye:
        case Ee:
        case P: {
          if (fl(t, e), Kl(e), u & Nt) {
            try {
              sl($l | fr, e, e.return), Ho($l | fr, e);
            } catch (lt) {
              dn(e, e.return, lt);
            }
            if (e.mode & Pt) {
              try {
                ql(), sl(dr | fr, e, e.return);
              } catch (lt) {
                dn(e, e.return, lt);
              }
              Gl(e);
            } else
              try {
                sl(dr | fr, e, e.return);
              } catch (lt) {
                dn(e, e.return, lt);
              }
          }
          return;
        }
        case Q: {
          fl(t, e), Kl(e), u & Cn && i !== null && Vf(i, i.return);
          return;
        }
        case te: {
          fl(t, e), Kl(e), u & Cn && i !== null && Vf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                GE(s);
              } catch (lt) {
                dn(e, e.return, lt);
              }
            }
            if (u & Nt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, S = e.updateQueue;
                if (e.updateQueue = null, S !== null)
                  try {
                    SR(f, S, y, v, p, e);
                  } catch (lt) {
                    dn(e, e.return, lt);
                  }
              }
            }
          }
          return;
        }
        case ne: {
          if (fl(t, e), Kl(e), u & Nt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var N = e.stateNode, D = e.memoizedProps, F = i !== null ? i.memoizedProps : D;
            try {
              ER(N, F, D);
            } catch (lt) {
              dn(e, e.return, lt);
            }
          }
          return;
        }
        case Y: {
          if (fl(t, e), Kl(e), u & Nt && i !== null) {
            var B = i.memoizedState;
            if (B.isDehydrated)
              try {
                $R(t.containerInfo);
              } catch (lt) {
                dn(e, e.return, lt);
              }
          }
          return;
        }
        case ee: {
          fl(t, e), Kl(e);
          return;
        }
        case he: {
          fl(t, e), Kl(e);
          var W = e.child;
          if (W.flags & jn) {
            var Oe = W.stateNode, Ze = W.memoizedState, Ge = Ze !== null;
            if (Oe.isHidden = Ge, Ge) {
              var jt = W.alternate !== null && W.alternate.memoizedState !== null;
              jt || I_();
            }
          }
          if (u & Nt) {
            try {
              u_(e);
            } catch (lt) {
              dn(e, e.return, lt);
            }
            G0(e);
          }
          return;
        }
        case Re: {
          var kt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & xt
          ) {
            var M = Hr;
            Hr = M || kt, fl(t, e), Hr = M;
          } else
            fl(t, e);
          if (Kl(e), u & jn) {
            var G = e.stateNode, j = e.memoizedState, pe = j !== null, ze = e;
            if (G.isHidden = pe, pe && !kt && (ze.mode & xt) !== Xe) {
              Ye = ze;
              for (var Ne = ze.child; Ne !== null; )
                Ye = Ne, f_(Ne), Ne = Ne.sibling;
            }
            n_(ze, pe);
          }
          return;
        }
        case Ve: {
          fl(t, e), Kl(e), u & Nt && G0(e);
          return;
        }
        case et:
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
          i_(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        e.flags &= ~yn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function c_(e, t, a) {
      Pf = a, Hf = t, Ye = e, K0(e, t, a), Pf = null, Hf = null;
    }
    function K0(e, t, a) {
      for (var i = (e.mode & xt) !== Xe; Ye !== null; ) {
        var u = Ye, s = u.child;
        if (u.tag === Re && i) {
          var f = u.memoizedState !== null, p = f || Nm;
          if (p) {
            jS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, S = y || Hr, N = Nm, D = Hr;
            Nm = p, Hr = S, Hr && !D && (Ye = u, d_(u));
            for (var F = s; F !== null; )
              Ye = F, K0(
                F,
                // New root; bubble back up to here and stop.
                t,
                a
              ), F = F.sibling;
            Ye = u, Nm = N, Hr = D, jS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== Ke && s !== null ? (s.return = u, Ye = s) : jS(e, t, a);
      }
    }
    function jS(e, t, a) {
      for (; Ye !== null; ) {
        var i = Ye;
        if ((i.flags & Ol) !== Ke) {
          var u = i.alternate;
          Kt(i);
          try {
            e_(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          Ye = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ye = s;
          return;
        }
        Ye = i.return;
      }
    }
    function f_(e) {
      for (; Ye !== null; ) {
        var t = Ye, a = t.child;
        switch (t.tag) {
          case U:
          case ye:
          case Ee:
          case P: {
            if (t.mode & Pt)
              try {
                ql(), sl(dr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(dr, t, t.return);
            break;
          }
          case Q: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && NS(t, t.return, i);
            break;
          }
          case te: {
            Vf(t, t.return);
            break;
          }
          case Re: {
            var u = t.memoizedState !== null;
            if (u) {
              X0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ye = a) : X0(e);
      }
    }
    function X0(e) {
      for (; Ye !== null; ) {
        var t = Ye;
        if (t === e) {
          Ye = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ye = a;
          return;
        }
        Ye = t.return;
      }
    }
    function d_(e) {
      for (; Ye !== null; ) {
        var t = Ye, a = t.child;
        if (t.tag === Re) {
          var i = t.memoizedState !== null;
          if (i) {
            J0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ye = a) : J0(e);
      }
    }
    function J0(e) {
      for (; Ye !== null; ) {
        var t = Ye;
        Kt(t);
        try {
          t_(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          Ye = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ye = a;
          return;
        }
        Ye = t.return;
      }
    }
    function p_(e, t, a, i) {
      Ye = t, v_(t, e, a, i);
    }
    function v_(e, t, a, i) {
      for (; Ye !== null; ) {
        var u = Ye, s = u.child;
        (u.subtreeFlags & Gi) !== Ke && s !== null ? (s.return = u, Ye = s) : h_(e, t, a, i);
      }
    }
    function h_(e, t, a, i) {
      for (; Ye !== null; ) {
        var u = Ye;
        if ((u.flags & Gr) !== Ke) {
          Kt(u);
          try {
            m_(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          Ye = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, Ye = s;
          return;
        }
        Ye = u.return;
      }
    }
    function m_(e, t, a, i) {
      switch (t.tag) {
        case U:
        case ye:
        case P: {
          if (t.mode & Pt) {
            Zg();
            try {
              Ho(Fr | fr, t);
            } finally {
              Jg(t);
            }
          } else
            Ho(Fr | fr, t);
          break;
        }
      }
    }
    function y_(e) {
      Ye = e, g_();
    }
    function g_() {
      for (; Ye !== null; ) {
        var e = Ye, t = e.child;
        if ((Ye.flags & Da) !== Ke) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Ye = u, C_(u, e);
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
            Ye = e;
          }
        }
        (e.subtreeFlags & Gi) !== Ke && t !== null ? (t.return = e, Ye = t) : S_();
      }
    }
    function S_() {
      for (; Ye !== null; ) {
        var e = Ye;
        (e.flags & Gr) !== Ke && (Kt(e), E_(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ye = t;
          return;
        }
        Ye = e.return;
      }
    }
    function E_(e) {
      switch (e.tag) {
        case U:
        case ye:
        case P: {
          e.mode & Pt ? (Zg(), sl(Fr | fr, e, e.return), Jg(e)) : sl(Fr | fr, e, e.return);
          break;
        }
      }
    }
    function C_(e, t) {
      for (; Ye !== null; ) {
        var a = Ye;
        Kt(a), x_(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, Ye = i) : w_(e);
      }
    }
    function w_(e) {
      for (; Ye !== null; ) {
        var t = Ye, a = t.sibling, i = t.return;
        if (Y0(t), t === e) {
          Ye = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ye = a;
          return;
        }
        Ye = i;
      }
    }
    function x_(e, t) {
      switch (e.tag) {
        case U:
        case ye:
        case P: {
          e.mode & Pt ? (Zg(), sl(Fr, e, t), Jg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function R_(e) {
      switch (e.tag) {
        case U:
        case ye:
        case P: {
          try {
            Ho(dr | fr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case Q: {
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
    function T_(e) {
      switch (e.tag) {
        case U:
        case ye:
        case P: {
          try {
            Ho(Fr | fr, e);
          } catch (t) {
            dn(e, e.return, t);
          }
          break;
        }
      }
    }
    function b_(e) {
      switch (e.tag) {
        case U:
        case ye:
        case P: {
          try {
            sl(dr | fr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case Q: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && NS(e, e.return, t);
          break;
        }
      }
    }
    function __(e) {
      switch (e.tag) {
        case U:
        case ye:
        case P:
          try {
            sl(Fr | fr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Fp = Symbol.for;
      Fp("selector.component"), Fp("selector.has_pseudo_class"), Fp("selector.role"), Fp("selector.test_id"), Fp("selector.text");
    }
    var k_ = [];
    function D_() {
      k_.forEach(function(e) {
        return e();
      });
    }
    var O_ = R.ReactCurrentActQueue;
    function N_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function Z0() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && O_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var L_ = Math.ceil, AS = R.ReactCurrentDispatcher, zS = R.ReactCurrentOwner, Br = R.ReactCurrentBatchConfig, dl = R.ReactCurrentActQueue, hr = (
      /*             */
      0
    ), ew = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), Ui = (
      /*                */
      4
    ), Bu = 0, Pp = 1, nc = 2, Mm = 3, Hp = 4, tw = 5, US = 6, Mt = hr, Ea = null, On = null, mr = ae, Xl = ae, FS = No(ae), yr = Bu, Vp = null, jm = ae, Bp = ae, Am = ae, Ip = null, Va = null, PS = 0, nw = 500, rw = 1 / 0, M_ = 500, Iu = null;
    function Yp() {
      rw = Wn() + M_;
    }
    function aw() {
      return rw;
    }
    var zm = !1, HS = null, Bf = null, rc = !1, Bo = null, $p = ae, VS = [], BS = null, j_ = 50, Qp = 0, IS = null, YS = !1, Um = !1, A_ = 50, If = 0, Fm = null, Wp = nn, Pm = ae, iw = !1;
    function Hm() {
      return Ea;
    }
    function Ca() {
      return (Mt & (Ir | Ui)) !== hr ? Wn() : (Wp !== nn || (Wp = Wn()), Wp);
    }
    function Io(e) {
      var t = e.mode;
      if ((t & xt) === Xe)
        return it;
      if ((Mt & Ir) !== hr && mr !== ae)
        return Rs(mr);
      var a = OT() !== DT;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Pm === Ut && (Pm = Ad()), Pm;
      }
      var u = za();
      if (u !== Ut)
        return u;
      var s = vR();
      return s;
    }
    function z_(e) {
      var t = e.mode;
      return (t & xt) === Xe ? it : Yv();
    }
    function gr(e, t, a, i) {
      l1(), iw && g("useInsertionEffect must not schedule updates."), YS && (Um = !0), Eo(e, a, i), (Mt & Ir) !== ae && e === Ea ? s1(t) : (Jr && _s(e, t, a), c1(t), e === Ea && ((Mt & Ir) === hr && (Bp = yt(Bp, a)), yr === Hp && Yo(e, mr)), Ba(e, i), a === it && Mt === hr && (t.mode & xt) === Xe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Yp(), iC()));
    }
    function U_(e, t, a) {
      var i = e.current;
      i.lanes = t, Eo(e, t, a), Ba(e, a);
    }
    function F_(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Mt & Ir) !== hr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = Kc(e, e === Ea ? mr : ae);
      if (i === ae) {
        a !== null && Cw(a), e.callbackNode = null, e.callbackPriority = Ut;
        return;
      }
      var u = Al(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== XS)) {
        a == null && s !== it && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && Cw(a);
      var f;
      if (u === it)
        e.tag === Lo ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), dT(ow.bind(null, e))) : aC(ow.bind(null, e)), dl.current !== null ? dl.current.push(Mo) : mR(function() {
          (Mt & (Ir | Ui)) === hr && Mo();
        }), f = null;
      else {
        var p;
        switch (Xv(i)) {
          case Lr:
            p = cs;
            break;
          case _i:
            p = Nl;
            break;
          case ja:
            p = qi;
            break;
          case Aa:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = JS(p, lw.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function lw(e, t) {
      if (nb(), Wp = nn, Pm = ae, (Mt & (Ir | Ui)) !== hr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === Ea ? mr : ae);
      if (u === ae)
        return null;
      var s = !Zc(e, u) && !Iv(e, u) && !t, f = s ? G_(e, u) : Bm(e, u);
      if (f !== Bu) {
        if (f === nc) {
          var p = Jc(e);
          p !== ae && (u = p, f = $S(e, p));
        }
        if (f === Pp) {
          var v = Vp;
          throw ac(e, ae), Yo(e, u), Ba(e, Wn()), v;
        }
        if (f === US)
          Yo(e, u);
        else {
          var y = !Zc(e, u), S = e.current.alternate;
          if (y && !H_(S)) {
            if (f = Bm(e, u), f === nc) {
              var N = Jc(e);
              N !== ae && (u = N, f = $S(e, N));
            }
            if (f === Pp) {
              var D = Vp;
              throw ac(e, ae), Yo(e, u), Ba(e, Wn()), D;
            }
          }
          e.finishedWork = S, e.finishedLanes = u, P_(e, f, u);
        }
      }
      return Ba(e, Wn()), e.callbackNode === a ? lw.bind(null, e) : null;
    }
    function $S(e, t) {
      var a = Ip;
      if (nf(e)) {
        var i = ac(e, t);
        i.flags |= wr, iT(e.containerInfo);
      }
      var u = Bm(e, t);
      if (u !== nc) {
        var s = Va;
        Va = a, s !== null && uw(s);
      }
      return u;
    }
    function uw(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function P_(e, t, a) {
      switch (t) {
        case Bu:
        case Pp:
          throw new Error("Root did not complete. This is a bug in React.");
        case nc: {
          ic(e, Va, Iu);
          break;
        }
        case Mm: {
          if (Yo(e, a), _u(a) && // do not delay if we're inside an act() scope
          !ww()) {
            var i = PS + nw - Wn();
            if (i > 10) {
              var u = Kc(e, ae);
              if (u !== ae)
                break;
              var s = e.suspendedLanes;
              if (!ku(s, a)) {
                Ca(), ef(e, s);
                break;
              }
              e.timeoutHandle = By(ic.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ic(e, Va, Iu);
          break;
        }
        case Hp: {
          if (Yo(e, a), Md(a))
            break;
          if (!ww()) {
            var f = ai(e, a), p = f, v = Wn() - p, y = i1(v) - v;
            if (y > 10) {
              e.timeoutHandle = By(ic.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ic(e, Va, Iu);
          break;
        }
        case tw: {
          ic(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function H_(e) {
      for (var t = e; ; ) {
        if (t.flags & ho) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!se(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & ho && v !== null) {
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
    function Yo(e, t) {
      t = Ts(t, Am), t = Ts(t, Bp), Wv(e, t);
    }
    function ow(e) {
      if (rb(), (Mt & (Ir | Ui)) !== hr)
        throw new Error("Should not already be working.");
      $u();
      var t = Kc(e, ae);
      if (!ea(t, it))
        return Ba(e, Wn()), null;
      var a = Bm(e, t);
      if (e.tag !== Lo && a === nc) {
        var i = Jc(e);
        i !== ae && (t = i, a = $S(e, i));
      }
      if (a === Pp) {
        var u = Vp;
        throw ac(e, ae), Yo(e, t), Ba(e, Wn()), u;
      }
      if (a === US)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ic(e, Va, Iu), Ba(e, Wn()), null;
    }
    function V_(e, t) {
      t !== ae && (tf(e, yt(t, it)), Ba(e, Wn()), (Mt & (Ir | Ui)) === hr && (Yp(), Mo()));
    }
    function QS(e, t) {
      var a = Mt;
      Mt |= ew;
      try {
        return e(t);
      } finally {
        Mt = a, Mt === hr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Yp(), iC());
      }
    }
    function B_(e, t, a, i, u) {
      var s = za(), f = Br.transition;
      try {
        return Br.transition = null, Fn(Lr), e(t, a, i, u);
      } finally {
        Fn(s), Br.transition = f, Mt === hr && Yp();
      }
    }
    function Yu(e) {
      Bo !== null && Bo.tag === Lo && (Mt & (Ir | Ui)) === hr && $u();
      var t = Mt;
      Mt |= ew;
      var a = Br.transition, i = za();
      try {
        return Br.transition = null, Fn(Lr), e ? e() : void 0;
      } finally {
        Fn(i), Br.transition = a, Mt = t, (Mt & (Ir | Ui)) === hr && Mo();
      }
    }
    function sw() {
      return (Mt & (Ir | Ui)) !== hr;
    }
    function Vm(e, t) {
      ia(FS, Xl, e), Xl = yt(Xl, t);
    }
    function WS(e) {
      Xl = FS.current, aa(FS, e);
    }
    function ac(e, t) {
      e.finishedWork = null, e.finishedLanes = ae;
      var a = e.timeoutHandle;
      if (a !== Iy && (e.timeoutHandle = Iy, hR(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          F0(u, i), i = i.return;
        }
      Ea = e;
      var s = lc(e.current, null);
      return On = s, mr = Xl = t, yr = Bu, Vp = null, jm = ae, Bp = ae, Am = ae, Ip = null, Va = null, UT(), al.discardPendingWarnings(), s;
    }
    function cw(e, t) {
      do {
        var a = On;
        try {
          if (Xh(), jC(), fn(), zS.current = null, a === null || a.return === null) {
            yr = Pp, Vp = t, On = null;
            return;
          }
          if (Ae && a.mode & Pt && bm(a, !0), Qe)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              bi(a, i, mr);
            } else
              ds(a, t, mr);
          db(e, a.return, a, t, mr), vw(a);
        } catch (u) {
          t = u, On === a && a !== null ? (a = a.return, On = a) : a = On;
          continue;
        }
        return;
      } while (!0);
    }
    function fw() {
      var e = AS.current;
      return AS.current = Cm, e === null ? Cm : e;
    }
    function dw(e) {
      AS.current = e;
    }
    function I_() {
      PS = Wn();
    }
    function Gp(e) {
      jm = yt(e, jm);
    }
    function Y_() {
      yr === Bu && (yr = Mm);
    }
    function GS() {
      (yr === Bu || yr === Mm || yr === nc) && (yr = Hp), Ea !== null && (xs(jm) || xs(Bp)) && Yo(Ea, mr);
    }
    function $_(e) {
      yr !== Hp && (yr = nc), Ip === null ? Ip = [e] : Ip.push(e);
    }
    function Q_() {
      return yr === Bu;
    }
    function Bm(e, t) {
      var a = Mt;
      Mt |= Ir;
      var i = fw();
      if (Ea !== e || mr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (qp(e, mr), u.clear()), Gv(e, t);
        }
        Iu = Pd(), ac(e, t);
      }
      Eu(t);
      do
        try {
          W_();
          break;
        } catch (s) {
          cw(e, s);
        }
      while (!0);
      if (Xh(), Mt = a, dw(i), On !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Lc(), Ea = null, mr = ae, yr;
    }
    function W_() {
      for (; On !== null; )
        pw(On);
    }
    function G_(e, t) {
      var a = Mt;
      Mt |= Ir;
      var i = fw();
      if (Ea !== e || mr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (qp(e, mr), u.clear()), Gv(e, t);
        }
        Iu = Pd(), Yp(), ac(e, t);
      }
      Eu(t);
      do
        try {
          q_();
          break;
        } catch (s) {
          cw(e, s);
        }
      while (!0);
      return Xh(), dw(i), Mt = a, On !== null ? (Pv(), Bu) : (Lc(), Ea = null, mr = ae, yr);
    }
    function q_() {
      for (; On !== null && !gd(); )
        pw(On);
    }
    function pw(e) {
      var t = e.alternate;
      Kt(e);
      var a;
      (e.mode & Pt) !== Xe ? (Xg(e), a = qS(t, e, Xl), bm(e, !0)) : a = qS(t, e, Xl), fn(), e.memoizedProps = e.pendingProps, a === null ? vw(e) : On = a, zS.current = null;
    }
    function vw(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & ss) === Ke) {
          Kt(t);
          var u = void 0;
          if ((t.mode & Pt) === Xe ? u = U0(a, t, Xl) : (Xg(t), u = U0(a, t, Xl), bm(t, !1)), fn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = Yb(a, t);
          if (s !== null) {
            s.flags &= Mv, On = s;
            return;
          }
          if ((t.mode & Pt) !== Xe) {
            bm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= ss, i.subtreeFlags = Ke, i.deletions = null;
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
      yr === Bu && (yr = tw);
    }
    function ic(e, t, a) {
      var i = za(), u = Br.transition;
      try {
        Br.transition = null, Fn(Lr), K_(e, t, a, i);
      } finally {
        Br.transition = u, Fn(i);
      }
      return null;
    }
    function K_(e, t, a, i) {
      do
        $u();
      while (Bo !== null);
      if (u1(), (Mt & (Ir | Ui)) !== hr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Rd(s), u === null)
        return Td(), null;
      if (s === ae && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = ae, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Ut;
      var f = yt(u.lanes, u.childLanes);
      Ud(e, f), e === Ea && (Ea = null, On = null, mr = ae), ((u.subtreeFlags & Gi) !== Ke || (u.flags & Gi) !== Ke) && (rc || (rc = !0, BS = a, JS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (kl | Dl | Ol | Gi)) !== Ke, v = (u.flags & (kl | Dl | Ol | Gi)) !== Ke;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var S = za();
        Fn(Lr);
        var N = Mt;
        Mt |= Ui, zS.current = null, qb(e, u), i0(), s_(e, u, s), oR(e.containerInfo), e.current = u, ps(s), c_(u, e, s), vs(), Sd(), Mt = N, Fn(S), Br.transition = y;
      } else
        e.current = u, i0();
      var D = rc;
      if (rc ? (rc = !1, Bo = e, $p = s) : (If = 0, Fm = null), f = e.pendingLanes, f === ae && (Bf = null), D || gw(e.current, !1), Cd(u.stateNode, i), Jr && e.memoizedUpdaters.clear(), D_(), Ba(e, Wn()), t !== null)
        for (var F = e.onRecoverableError, B = 0; B < t.length; B++) {
          var W = t[B], Oe = W.stack, Ze = W.digest;
          F(W.value, {
            componentStack: Oe,
            digest: Ze
          });
        }
      if (zm) {
        zm = !1;
        var Ge = HS;
        throw HS = null, Ge;
      }
      return ea($p, it) && e.tag !== Lo && $u(), f = e.pendingLanes, ea(f, it) ? (tb(), e === IS ? Qp++ : (Qp = 0, IS = e)) : Qp = 0, Mo(), Td(), null;
    }
    function $u() {
      if (Bo !== null) {
        var e = Xv($p), t = Ds(ja, e), a = Br.transition, i = za();
        try {
          return Br.transition = null, Fn(t), J_();
        } finally {
          Fn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function X_(e) {
      VS.push(e), rc || (rc = !0, JS(qi, function() {
        return $u(), null;
      }));
    }
    function J_() {
      if (Bo === null)
        return !1;
      var e = BS;
      BS = null;
      var t = Bo, a = $p;
      if (Bo = null, $p = ae, (Mt & (Ir | Ui)) !== hr)
        throw new Error("Cannot flush passive effects while already rendering.");
      YS = !0, Um = !1, Su(a);
      var i = Mt;
      Mt |= Ui, y_(t.current), p_(t, t.current, a, e);
      {
        var u = VS;
        VS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          Zb(t, f);
        }
      }
      kd(), gw(t.current, !0), Mt = i, Mo(), Um ? t === Fm ? If++ : (If = 0, Fm = t) : If = 0, YS = !1, Um = !1, wd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function hw(e) {
      return Bf !== null && Bf.has(e);
    }
    function Z_(e) {
      Bf === null ? Bf = /* @__PURE__ */ new Set([e]) : Bf.add(e);
    }
    function e1(e) {
      zm || (zm = !0, HS = e);
    }
    var t1 = e1;
    function mw(e, t, a) {
      var i = ec(a, t), u = p0(e, i, it), s = Ao(e, u, it), f = Ca();
      s !== null && (Eo(s, it, f), Ba(s, f));
    }
    function dn(e, t, a) {
      if (Qb(a), Kp(!1), e.tag === Y) {
        mw(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === Y) {
          mw(i, e, a);
          return;
        } else if (i.tag === Q) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !hw(s)) {
            var f = ec(a, e), p = hS(i, f, it), v = Ao(i, p, it), y = Ca();
            v !== null && (Eo(v, it, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function n1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      ef(e, a), f1(e), Ea === e && ku(mr, a) && (yr === Hp || yr === Mm && _u(mr) && Wn() - PS < nw ? ac(e, ae) : Am = yt(Am, a)), Ba(e, u);
    }
    function yw(e, t) {
      t === Ut && (t = z_(e));
      var a = Ca(), i = Pa(e, t);
      i !== null && (Eo(i, t, a), Ba(i, a));
    }
    function r1(e) {
      var t = e.memoizedState, a = Ut;
      t !== null && (a = t.retryLane), yw(e, a);
    }
    function a1(e, t) {
      var a = Ut, i;
      switch (e.tag) {
        case he:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case Ve:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), yw(e, a);
    }
    function i1(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : L_(e / 1960) * 1960;
    }
    function l1() {
      if (Qp > j_)
        throw Qp = 0, IS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      If > A_ && (If = 0, Fm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function u1() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function gw(e, t) {
      Kt(e), Im(e, _l, b_), t && Im(e, xi, __), Im(e, _l, R_), t && Im(e, xi, T_), fn();
    }
    function Im(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Ke ? i = i.child : ((i.flags & t) !== Ke && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Ym = null;
    function Sw(e) {
      {
        if ((Mt & Ir) !== hr || !(e.mode & xt))
          return;
        var t = e.tag;
        if (t !== ke && t !== Y && t !== Q && t !== U && t !== ye && t !== Ee && t !== P)
          return;
        var a = st(e) || "ReactComponent";
        if (Ym !== null) {
          if (Ym.has(a))
            return;
          Ym.add(a);
        } else
          Ym = /* @__PURE__ */ new Set([a]);
        var i = lr;
        try {
          Kt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Kt(e) : fn();
        }
      }
    }
    var qS;
    {
      var o1 = null;
      qS = function(e, t, a) {
        var i = _w(o1, t);
        try {
          return L0(e, t, a);
        } catch (s) {
          if (ET() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Xh(), jC(), F0(e, t), _w(t, i), t.mode & Pt && Xg(t), bl(null, L0, null, e, t, a), Qi()) {
            var u = os();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var Ew = !1, KS;
    KS = /* @__PURE__ */ new Set();
    function s1(e) {
      if (mi && !JT())
        switch (e.tag) {
          case U:
          case ye:
          case P: {
            var t = On && st(On) || "Unknown", a = t;
            if (!KS.has(a)) {
              KS.add(a);
              var i = st(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case Q: {
            Ew || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), Ew = !0);
            break;
          }
        }
    }
    function qp(e, t) {
      if (Jr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          _s(e, i, t);
        });
      }
    }
    var XS = {};
    function JS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), XS) : yd(e, t);
      }
    }
    function Cw(e) {
      if (e !== XS)
        return Av(e);
    }
    function ww() {
      return dl.current !== null;
    }
    function c1(e) {
      {
        if (e.mode & xt) {
          if (!Z0())
            return;
        } else if (!N_() || Mt !== hr || e.tag !== U && e.tag !== ye && e.tag !== P)
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

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, st(e));
          } finally {
            t ? Kt(e) : fn();
          }
        }
      }
    }
    function f1(e) {
      e.tag !== Lo && Z0() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Kp(e) {
      iw = e;
    }
    var Fi = null, Yf = null, d1 = function(e) {
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
    function ZS(e) {
      return $f(e);
    }
    function eE(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = $f(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: re,
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
    function xw(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case Q: {
            typeof i == "function" && (u = !0);
            break;
          }
          case U: {
            (typeof i == "function" || s === dt) && (u = !0);
            break;
          }
          case ye: {
            (s === re || s === dt) && (u = !0);
            break;
          }
          case Ee:
          case P: {
            (s === ht || s === dt) && (u = !0);
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
    function Rw(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Yf === null && (Yf = /* @__PURE__ */ new WeakSet()), Yf.add(e);
      }
    }
    var p1 = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          tE(e.current, i, a);
        });
      }
    }, v1 = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          Xp(t, e, null, null);
        });
      }
    };
    function tE(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case U:
          case P:
          case Q:
            v = p;
            break;
          case ye:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, S = !1;
        if (v !== null) {
          var N = Fi(v);
          N !== void 0 && (a.has(N) ? S = !0 : t.has(N) && (f === Q ? S = !0 : y = !0));
        }
        if (Yf !== null && (Yf.has(e) || i !== null && Yf.has(i)) && (S = !0), S && (e._debugNeedsRemount = !0), S || y) {
          var D = Pa(e, it);
          D !== null && gr(D, e, it, nn);
        }
        u !== null && !S && tE(u, t, a), s !== null && tE(s, t, a);
      }
    }
    var h1 = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return nE(e.current, i, a), a;
      }
    };
    function nE(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case U:
          case P:
          case Q:
            p = f;
            break;
          case ye:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? m1(e, a) : i !== null && nE(i, t, a), u !== null && nE(u, t, a);
      }
    }
    function m1(e, t) {
      {
        var a = y1(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case te:
              t.add(i.stateNode);
              return;
            case ee:
              t.add(i.stateNode.containerInfo);
              return;
            case Y:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function y1(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === te)
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
    var rE;
    {
      rE = !1;
      try {
        var Tw = Object.preventExtensions({});
      } catch {
        rE = !0;
      }
    }
    function g1(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Ke, this.subtreeFlags = Ke, this.deletions = null, this.lanes = ae, this.childLanes = ae, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !rE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new g1(e, t, a, i);
    };
    function aE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function S1(e) {
      return typeof e == "function" && !aE(e) && e.defaultProps === void 0;
    }
    function E1(e) {
      if (typeof e == "function")
        return aE(e) ? Q : U;
      if (e != null) {
        var t = e.$$typeof;
        if (t === re)
          return ye;
        if (t === ht)
          return Ee;
      }
      return ke;
    }
    function lc(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Ke, a.subtreeFlags = Ke, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & An, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case ke:
        case U:
        case P:
          a.type = $f(e.type);
          break;
        case Q:
          a.type = ZS(e.type);
          break;
        case ye:
          a.type = eE(e.type);
          break;
      }
      return a;
    }
    function C1(e, t) {
      e.flags &= An | yn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = ae, e.lanes = t, e.child = null, e.subtreeFlags = Ke, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Ke, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function w1(e, t, a) {
      var i;
      return e === Vh ? (i = xt, t === !0 && (i |= Zt, i |= Ht)) : i = Xe, Jr && (i |= Pt), oi(Y, null, null, i);
    }
    function iE(e, t, a, i, u, s) {
      var f = ke, p = e;
      if (typeof e == "function")
        aE(e) ? (f = Q, p = ZS(p)) : p = $f(p);
      else if (typeof e == "string")
        f = te;
      else
        e: switch (e) {
          case di:
            return $o(a.children, u, s, t);
          case Wa:
            f = Ce, u |= Zt, (u & xt) !== Xe && (u |= Ht);
            break;
          case pi:
            return x1(a, u, s, t);
          case _e:
            return R1(a, u, s, t);
          case He:
            return T1(a, u, s, t);
          case Rn:
            return bw(a, u, s, t);
          case ln:
          case Rt:
          case cn:
          case ir:
          case wt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = ce;
                  break e;
                case T:
                  f = Ue;
                  break e;
                case re:
                  f = ye, p = eE(p);
                  break e;
                case ht:
                  f = Ee;
                  break e;
                case dt:
                  f = fe, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? st(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var S = oi(f, a, t, u);
      return S.elementType = e, S.type = p, S.lanes = s, S._debugOwner = i, S;
    }
    function lE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = iE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function $o(e, t, a, i) {
      var u = oi(K, e, i, t);
      return u.lanes = a, u;
    }
    function x1(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(Le, e, i, t | Pt);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function R1(e, t, a, i) {
      var u = oi(he, e, i, t);
      return u.elementType = _e, u.lanes = a, u;
    }
    function T1(e, t, a, i) {
      var u = oi(Ve, e, i, t);
      return u.elementType = He, u.lanes = a, u;
    }
    function bw(e, t, a, i) {
      var u = oi(Re, e, i, t);
      u.elementType = Rn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function uE(e, t, a) {
      var i = oi(ne, e, null, t);
      return i.lanes = a, i;
    }
    function b1() {
      var e = oi(te, null, null, Xe);
      return e.elementType = "DELETED", e;
    }
    function _1(e) {
      var t = oi(xe, null, null, Xe);
      return t.stateNode = e, t;
    }
    function oE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(ee, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function _w(e, t) {
      return e === null && (e = oi(ke, null, null, Xe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function k1(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Iy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Ut, this.eventTimes = bs(ae), this.expirationTimes = bs(nn), this.pendingLanes = ae, this.suspendedLanes = ae, this.pingedLanes = ae, this.expiredLanes = ae, this.mutableReadLanes = ae, this.finishedLanes = ae, this.entangledLanes = ae, this.entanglements = bs(ae), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Vh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function kw(e, t, a, i, u, s, f, p, v, y) {
      var S = new k1(e, t, a, p, v), N = w1(t, s);
      S.current = N, N.stateNode = S;
      {
        var D = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        N.memoizedState = D;
      }
      return Cg(N), S;
    }
    var sE = "18.3.1";
    function D1(e, t, a) {
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
    var cE, fE;
    cE = !1, fE = {};
    function Dw(e) {
      if (!e)
        return ui;
      var t = vo(e), a = fT(t);
      if (t.tag === Q) {
        var i = t.type;
        if (Yl(i))
          return nC(t, i, a);
      }
      return a;
    }
    function O1(e, t) {
      {
        var a = vo(e);
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
          var s = st(a) || "Component";
          if (!fE[s]) {
            fE[s] = !0;
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
    function Ow(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return kw(e, t, v, y, a, i, u, s, f);
    }
    function Nw(e, t, a, i, u, s, f, p, v, y) {
      var S = !0, N = kw(a, i, S, e, u, s, f, p, v);
      N.context = Dw(null);
      var D = N.current, F = Ca(), B = Io(D), W = Hu(F, B);
      return W.callback = t ?? null, Ao(D, W, B), U_(N, B, F), N;
    }
    function Xp(e, t, a, i) {
      Ed(t, e);
      var u = t.current, s = Ca(), f = Io(u);
      Sn(f);
      var p = Dw(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && lr !== null && !cE && (cE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, st(lr) || "Unknown"));
      var v = Hu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Ao(u, v, f);
      return y !== null && (gr(y, u, f, s), nm(y, u, f)), f;
    }
    function $m(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case te:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function N1(e) {
      switch (e.tag) {
        case Y: {
          var t = e.stateNode;
          if (nf(t)) {
            var a = Vv(t);
            V_(t, a);
          }
          break;
        }
        case he: {
          Yu(function() {
            var u = Pa(e, it);
            if (u !== null) {
              var s = Ca();
              gr(u, e, it, s);
            }
          });
          var i = it;
          dE(e, i);
          break;
        }
      }
    }
    function Lw(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Qv(a.retryLane, t));
    }
    function dE(e, t) {
      Lw(e, t);
      var a = e.alternate;
      a && Lw(a, t);
    }
    function L1(e) {
      if (e.tag === he) {
        var t = Es, a = Pa(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        dE(e, t);
      }
    }
    function M1(e) {
      if (e.tag === he) {
        var t = Io(e), a = Pa(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        dE(e, t);
      }
    }
    function Mw(e) {
      var t = pn(e);
      return t === null ? null : t.stateNode;
    }
    var jw = function(e) {
      return null;
    };
    function j1(e) {
      return jw(e);
    }
    var Aw = function(e) {
      return !1;
    };
    function A1(e) {
      return Aw(e);
    }
    var zw = null, Uw = null, Fw = null, Pw = null, Hw = null, Vw = null, Bw = null, Iw = null, Yw = null;
    {
      var $w = function(e, t, a) {
        var i = t[a], u = Ct(e) ? e.slice() : St({}, e);
        return a + 1 === t.length ? (Ct(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = $w(e[i], t, a + 1), u);
      }, Qw = function(e, t) {
        return $w(e, t, 0);
      }, Ww = function(e, t, a, i) {
        var u = t[i], s = Ct(e) ? e.slice() : St({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], Ct(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = Ww(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, Gw = function(e, t, a) {
        if (t.length !== a.length) {
          A("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              A("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Ww(e, t, a, 0);
      }, qw = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = Ct(e) ? e.slice() : St({}, e);
        return s[u] = qw(e[u], t, a + 1, i), s;
      }, Kw = function(e, t, a) {
        return qw(e, t, 0, a);
      }, pE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      zw = function(e, t, a, i) {
        var u = pE(e, t);
        if (u !== null) {
          var s = Kw(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = St({}, e.memoizedProps);
          var f = Pa(e, it);
          f !== null && gr(f, e, it, nn);
        }
      }, Uw = function(e, t, a) {
        var i = pE(e, t);
        if (i !== null) {
          var u = Qw(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = St({}, e.memoizedProps);
          var s = Pa(e, it);
          s !== null && gr(s, e, it, nn);
        }
      }, Fw = function(e, t, a, i) {
        var u = pE(e, t);
        if (u !== null) {
          var s = Gw(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = St({}, e.memoizedProps);
          var f = Pa(e, it);
          f !== null && gr(f, e, it, nn);
        }
      }, Pw = function(e, t, a) {
        e.pendingProps = Kw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pa(e, it);
        i !== null && gr(i, e, it, nn);
      }, Hw = function(e, t) {
        e.pendingProps = Qw(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Pa(e, it);
        a !== null && gr(a, e, it, nn);
      }, Vw = function(e, t, a) {
        e.pendingProps = Gw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pa(e, it);
        i !== null && gr(i, e, it, nn);
      }, Bw = function(e) {
        var t = Pa(e, it);
        t !== null && gr(t, e, it, nn);
      }, Iw = function(e) {
        jw = e;
      }, Yw = function(e) {
        Aw = e;
      };
    }
    function z1(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function U1(e) {
      return null;
    }
    function F1() {
      return lr;
    }
    function P1(e) {
      var t = e.findFiberByHostInstance, a = R.ReactCurrentDispatcher;
      return yo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: zw,
        overrideHookStateDeletePath: Uw,
        overrideHookStateRenamePath: Fw,
        overrideProps: Pw,
        overridePropsDeletePath: Hw,
        overridePropsRenamePath: Vw,
        setErrorHandler: Iw,
        setSuspenseHandler: Yw,
        scheduleUpdate: Bw,
        currentDispatcherRef: a,
        findHostInstanceByFiber: z1,
        findFiberByHostInstance: t || U1,
        // React Refresh
        findHostInstancesForRefresh: h1,
        scheduleRefresh: p1,
        scheduleRoot: v1,
        setRefreshHandler: d1,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: F1,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: sE
      });
    }
    var Xw = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function vE(e) {
      this._internalRoot = e;
    }
    Qm.prototype.render = vE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Wm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Mn) {
          var i = Mw(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Xp(e, t, null, null);
    }, Qm.prototype.unmount = vE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        sw() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          Xp(null, e, null, null);
        }), XE(t);
      }
    };
    function H1(e, t) {
      if (!Wm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      Jw(e);
      var a = !1, i = !1, u = "", s = Xw;
      t != null && (t.hydrate ? A("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === kr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = Ow(e, Vh, null, a, i, u, s);
      jh(f.current, e);
      var p = e.nodeType === Mn ? e.parentNode : e;
      return rp(p), new vE(f);
    }
    function Qm(e) {
      this._internalRoot = e;
    }
    function V1(e) {
      e && nh(e);
    }
    Qm.prototype.unstable_scheduleHydration = V1;
    function B1(e, t, a) {
      if (!Wm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      Jw(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = Xw;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = Nw(t, null, e, Vh, i, s, f, p, v);
      if (jh(y.current, e), rp(e), u)
        for (var S = 0; S < u.length; S++) {
          var N = u[S];
          QT(y, N);
        }
      return new Qm(y);
    }
    function Wm(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === id));
    }
    function Jp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === id || e.nodeType === Mn && e.nodeValue === " react-mount-point-unstable "));
    }
    function Jw(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), vp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var I1 = R.ReactCurrentOwner, Zw;
    Zw = function(e) {
      if (e._reactRootContainer && e.nodeType !== Mn) {
        var t = Mw(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = hE(e), u = !!(i && Oo(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function hE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function ex() {
    }
    function Y1(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var D = $m(f);
            s.call(D);
          };
        }
        var f = Nw(
          t,
          i,
          e,
          Lo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          ex
        );
        e._reactRootContainer = f, jh(f.current, e);
        var p = e.nodeType === Mn ? e.parentNode : e;
        return rp(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var D = $m(S);
            y.call(D);
          };
        }
        var S = Ow(
          e,
          Lo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          ex
        );
        e._reactRootContainer = S, jh(S.current, e);
        var N = e.nodeType === Mn ? e.parentNode : e;
        return rp(N), Yu(function() {
          Xp(t, S, a, i);
        }), S;
      }
    }
    function $1(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Gm(e, t, a, i, u) {
      Zw(a), $1(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = Y1(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = $m(f);
            p.call(v);
          };
        }
        Xp(t, f, e, u);
      }
      return $m(f);
    }
    var tx = !1;
    function Q1(e) {
      {
        tx || (tx = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = I1.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", At(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : O1(e, "findDOMNode");
    }
    function W1(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = vp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Gm(null, e, t, !0, a);
    }
    function G1(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = vp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Gm(null, e, t, !1, a);
    }
    function q1(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !dy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Gm(e, t, a, !1, i);
    }
    var nx = !1;
    function K1(e) {
      if (nx || (nx = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Jp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = vp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = hE(e), i = a && !Oo(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Gm(null, null, e, !1, function() {
            e._reactRootContainer = null, XE(e);
          });
        }), !0;
      } else {
        {
          var u = hE(e), s = !!(u && Oo(u)), f = e.nodeType === Wr && Jp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Rr(N1), Co(L1), Jv(M1), Ns(za), Hd(qv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Sc(Jx), fy(QS, B_, Yu);
    function X1(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Wm(t))
        throw new Error("Target container is not a DOM element.");
      return D1(e, t, null, a);
    }
    function J1(e, t, a, i) {
      return q1(e, t, a, i);
    }
    var mE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Oo, wf, Ah, so, Ec, QS]
    };
    function Z1(e, t) {
      return mE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), H1(e, t);
    }
    function ek(e, t, a) {
      return mE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), B1(e, t, a);
    }
    function tk(e) {
      return sw() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var nk = P1({
      findFiberByHostInstance: $s,
      bundleType: 1,
      version: sE,
      rendererPackageName: "react-dom"
    });
    if (!nk && Nn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var rx = window.location.protocol;
      /^(https?|file):$/.test(rx) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (rx === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = mE, Ya.createPortal = X1, Ya.createRoot = Z1, Ya.findDOMNode = Q1, Ya.flushSync = tk, Ya.hydrate = W1, Ya.hydrateRoot = ek, Ya.render = G1, Ya.unmountComponentAtNode = K1, Ya.unstable_batchedUpdates = QS, Ya.unstable_renderSubtreeIntoContainer = J1, Ya.version = sE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ya;
}
function mx() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(mx);
    } catch (_) {
      console.error(_);
    }
  }
}
process.env.NODE_ENV === "production" ? (mx(), wE.exports = fk()) : wE.exports = dk();
var Wu = wE.exports, xE, Km = Wu;
if (process.env.NODE_ENV === "production")
  xE = Km.createRoot, Km.hydrateRoot;
else {
  var px = Km.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  xE = function(_, w) {
    px.usingClientEntryPoint = !0;
    try {
      return Km.createRoot(_, w);
    } finally {
      px.usingClientEntryPoint = !1;
    }
  };
}
const Jm = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, pk = {
  activeEdition: Jm,
  setEdition: () => {
  },
  supportedEditions: [Jm],
  characterCreationData: void 0,
  reloadEditionData: async () => {
  },
  loadCampaignCharacterCreation: async () => {
  },
  clearCampaignCharacterCreation: () => {
  },
  isLoading: !1,
  error: void 0,
  campaignId: void 0,
  campaignCharacterCreation: void 0,
  campaignGameplayRules: void 0,
  campaignLoading: !1,
  campaignError: void 0
}, yx = q.createContext(pk);
function vk({ children: _ }) {
  const [w, R] = q.useState(Jm), [J, Z] = q.useState({}), [A, g] = q.useState(null), le = q.useMemo(
    () => [
      Jm,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), U = q.useCallback(
    async (K) => {
      const Ce = K ?? w.key;
      if (Z((Ue) => {
        var ce;
        return {
          ...Ue,
          [Ce]: {
            data: (ce = Ue[Ce]) == null ? void 0 : ce.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        Z((Ue) => {
          var ce;
          return {
            ...Ue,
            [Ce]: {
              data: (ce = Ue[Ce]) == null ? void 0 : ce.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Ue = await fetch(`/api/editions/${Ce}/character-creation`);
        if (!Ue.ok)
          throw new Error(`Failed to load edition data (${Ue.status})`);
        const ce = await Ue.json(), ye = (ce == null ? void 0 : ce.character_creation) ?? ce;
        Z((Le) => ({
          ...Le,
          [Ce]: {
            data: ye,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Ue) {
        const ce = Ue instanceof Error ? Ue.message : "Unknown error loading edition data";
        Z((ye) => {
          var Le;
          return {
            ...ye,
            [Ce]: {
              data: (Le = ye[Ce]) == null ? void 0 : Le.data,
              loading: !1,
              error: ce
            }
          };
        });
      }
    },
    [w.key]
  ), Q = q.useCallback((K) => `${new Intl.NumberFormat("en-US").format(K)}¥`, []), ke = q.useCallback((K) => JSON.parse(JSON.stringify(K)), []), Y = q.useCallback(
    (K, Ce) => {
      var ce;
      if (!Ce)
        return ke(K);
      const Ue = ke(K);
      if (Ce.resources && ((ce = Ue.priorities) != null && ce.resources)) {
        const ye = Ue.priorities.resources;
        Object.entries(Ce.resources).forEach(([Le, he]) => {
          const Ee = Le;
          typeof he == "number" && ye[Ee] && (ye[Ee] = {
            ...ye[Ee],
            label: Q(he)
          });
        });
      }
      return Ue;
    },
    [ke, Q]
  ), ee = q.useCallback(
    async (K) => {
      var Ce, Ue;
      if (K) {
        g((ce) => (ce == null ? void 0 : ce.campaignId) === K ? { ...ce, loading: !0, error: void 0 } : {
          campaignId: K,
          edition: w.key,
          data: ce == null ? void 0 : ce.data,
          gameplayRules: ce == null ? void 0 : ce.gameplayRules,
          loading: !0,
          error: void 0
        });
        try {
          const ce = await fetch(`/api/campaigns/${K}/character-creation`);
          if (!ce.ok)
            throw new Error(`Failed to load campaign character creation (${ce.status})`);
          const ye = await ce.json(), Le = ((Ue = (Ce = ye.edition) == null ? void 0 : Ce.toLowerCase) == null ? void 0 : Ue.call(Ce)) ?? w.key, he = ye.edition_data;
          he && Z((Ee) => {
            var P;
            return {
              ...Ee,
              [Le]: {
                data: ((P = Ee[Le]) == null ? void 0 : P.data) ?? he,
                loading: !1,
                error: void 0
              }
            };
          }), g({
            campaignId: K,
            edition: Le,
            data: he ? Y(he, ye.gameplay_rules) : void 0,
            gameplayRules: ye.gameplay_rules,
            loading: !1,
            error: void 0
          });
        } catch (ce) {
          const ye = ce instanceof Error ? ce.message : "Unknown error loading campaign character creation data";
          throw g({
            campaignId: K,
            edition: w.key,
            data: void 0,
            gameplayRules: void 0,
            loading: !1,
            error: ye
          }), ce;
        }
      }
    },
    [w.key, Y]
  ), te = q.useCallback(() => {
    g(null);
  }, []), ne = q.useMemo(() => {
    const K = J[w.key], Ce = A && !A.loading && !A.error && A.edition === w.key, Ue = Ce && A.data ? A.data : K == null ? void 0 : K.data;
    return {
      activeEdition: w,
      supportedEditions: le,
      setEdition: (ce) => {
        const ye = le.find((Le) => Le.key === ce);
        ye ? R(ye) : console.warn(`Edition '${ce}' is not registered; keeping current edition.`);
      },
      characterCreationData: Ue,
      reloadEditionData: U,
      loadCampaignCharacterCreation: ee,
      clearCampaignCharacterCreation: te,
      isLoading: (K == null ? void 0 : K.loading) ?? !1,
      error: K == null ? void 0 : K.error,
      campaignId: A == null ? void 0 : A.campaignId,
      campaignCharacterCreation: Ce ? A == null ? void 0 : A.data : void 0,
      campaignGameplayRules: Ce ? A == null ? void 0 : A.gameplayRules : void 0,
      campaignLoading: (A == null ? void 0 : A.loading) ?? !1,
      campaignError: A == null ? void 0 : A.error
    };
  }, [
    w,
    A,
    te,
    J,
    ee,
    U,
    le
  ]);
  return q.useEffect(() => {
    const K = J[w.key];
    !(K != null && K.data) && !(K != null && K.loading) && U(w.key);
  }, [w.key, J, U]), q.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: ee,
      clearCampaignCharacterCreation: te
    }));
  }, [te, ee]), q.useEffect(() => {
    var ce, ye, Le, he, Ee, P;
    const K = J[w.key], Ce = A && !A.loading && !A.error && A.edition === w.key, Ue = Ce && A.data ? A.data : K == null ? void 0 : K.data;
    Ue && typeof window < "u" && ((ye = (ce = window.ShadowmasterLegacyApp) == null ? void 0 : ce.setEditionData) == null || ye.call(ce, w.key, Ue)), typeof window < "u" && (Ce ? (he = (Le = window.ShadowmasterLegacyApp) == null ? void 0 : Le.applyCampaignCreationDefaults) == null || he.call(Le, {
      campaignId: A.campaignId,
      edition: A.edition,
      gameplayRules: A.gameplayRules ?? null
    }) : (P = (Ee = window.ShadowmasterLegacyApp) == null ? void 0 : Ee.applyCampaignCreationDefaults) == null || P.call(Ee, null));
  }, [w.key, A, J]), /* @__PURE__ */ E.jsx(yx.Provider, { value: ne, children: _ });
}
function hk() {
  const _ = q.useContext(yx);
  if (!_)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return _;
}
function SE(_, w) {
  return !!(_ != null && _.roles.some((R) => R.toLowerCase() === w.toLowerCase()));
}
async function nv(_, w = {}) {
  const R = new Headers(w.headers || {});
  w.body && !R.has("Content-Type") && R.set("Content-Type", "application/json");
  const J = await fetch(_, {
    ...w,
    headers: R,
    credentials: "include"
  });
  if (J.status === 204)
    return {};
  const Z = await J.text(), A = () => {
    try {
      return Z ? JSON.parse(Z) : {};
    } catch {
      return {};
    }
  };
  if (!J.ok) {
    const g = A(), le = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : J.statusText;
    throw new Error(le);
  }
  return A();
}
function mk() {
  const [_, w] = q.useState("login"), [R, J] = q.useState(null), [Z, A] = q.useState(!1), [g, le] = q.useState(null), [U, Q] = q.useState(null), [ke, Y] = q.useState(""), [ee, te] = q.useState(""), [ne, K] = q.useState(""), [Ce, Ue] = q.useState(""), [ce, ye] = q.useState(""), [Le, he] = q.useState(""), [Ee, P] = q.useState(""), [fe, ue] = q.useState(""), [xe, Ve] = q.useState(""), et = q.useRef(!1);
  q.useEffect(() => {
    et.current || (et.current = !0, Re());
  }, []), q.useEffect(() => {
    window.ShadowmasterAuth = {
      user: R,
      isAdministrator: SE(R, "administrator"),
      isGamemaster: SE(R, "gamemaster"),
      isPlayer: SE(R, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [R]);
  async function Re() {
    try {
      A(!0), le(null);
      const ge = await nv("/api/auth/me");
      J(ge.user), w("login");
    } catch {
      J(null);
    } finally {
      A(!1);
    }
  }
  async function bt(ge) {
    ge.preventDefault(), A(!0), le(null), Q(null);
    try {
      const ve = await nv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: ke,
          password: ee
        })
      });
      J(ve.user), w("login"), te(""), Q("Welcome back!");
    } catch (ve) {
      le(ve instanceof Error ? ve.message : "Login failed");
    } finally {
      A(!1);
    }
  }
  async function _t(ge) {
    if (ge.preventDefault(), ce !== Le) {
      le("Passwords do not match");
      return;
    }
    A(!0), le(null), Q(null);
    try {
      const ve = await nv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: ne,
          username: Ce,
          password: ce
        })
      });
      J(ve.user), w("login"), Q("Account created successfully."), ye(""), he("");
    } catch (ve) {
      le(ve instanceof Error ? ve.message : "Registration failed");
    } finally {
      A(!1);
    }
  }
  async function Dt() {
    A(!0), le(null), Q(null);
    try {
      await nv("/api/auth/logout", { method: "POST" }), J(null), w("login");
    } catch (ge) {
      le(ge instanceof Error ? ge.message : "Logout failed");
    } finally {
      A(!1);
    }
  }
  async function Pe(ge) {
    if (ge.preventDefault(), fe !== xe) {
      le("New passwords do not match");
      return;
    }
    A(!0), le(null), Q(null);
    try {
      await nv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: Ee,
          new_password: fe
        })
      }), Q("Password updated successfully."), P(""), ue(""), Ve(""), w("login");
    } catch (ve) {
      le(ve instanceof Error ? ve.message : "Password update failed");
    } finally {
      A(!1);
    }
  }
  const me = q.useMemo(() => R ? R.roles.join(", ") : "", [R]);
  return /* @__PURE__ */ E.jsxs("section", { className: "auth-panel", children: [
    /* @__PURE__ */ E.jsxs("header", { className: "auth-panel__header", children: [
      /* @__PURE__ */ E.jsx("h2", { children: R ? `Welcome, ${R.username}` : "Account Access" }),
      R && /* @__PURE__ */ E.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ E.jsx("span", { className: "auth-tag", children: me || "Player" }) })
    ] }),
    g && /* @__PURE__ */ E.jsx("div", { className: "auth-alert auth-alert--error", children: g }),
    U && /* @__PURE__ */ E.jsx("div", { className: "auth-alert auth-alert--success", children: U }),
    R ? /* @__PURE__ */ E.jsxs("div", { className: "auth-panel__content", children: [
      /* @__PURE__ */ E.jsxs("p", { className: "auth-panel__status", children: [
        "You are signed in as ",
        /* @__PURE__ */ E.jsx("strong", { children: R.email }),
        "."
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "auth-panel__actions", children: [
        /* @__PURE__ */ E.jsx("button", { className: "btn btn-secondary", onClick: () => w(_ === "password" ? "login" : "password"), children: _ === "password" ? "Hide Password Form" : "Change Password" }),
        /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", onClick: Dt, disabled: Z, children: "Logout" })
      ] }),
      _ === "password" && /* @__PURE__ */ E.jsxs("form", { className: "auth-form", onSubmit: Pe, children: [
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "current-password",
              type: "password",
              value: Ee,
              onChange: (ge) => P(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "new-password", children: "New Password" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "new-password",
              type: "password",
              value: fe,
              onChange: (ge) => ue(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "confirm-password",
              type: "password",
              value: xe,
              onChange: (ge) => Ve(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "submit", disabled: Z, children: "Update Password" })
      ] })
    ] }) : /* @__PURE__ */ E.jsxs("div", { className: "auth-panel__content", children: [
      _ === "login" && /* @__PURE__ */ E.jsxs("form", { className: "auth-form", onSubmit: bt, children: [
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "login-email", children: "Email" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "login-email",
              type: "email",
              value: ke,
              onChange: (ge) => Y(ge.target.value),
              required: !0,
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "login-password", children: "Password" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "login-password",
              type: "password",
              value: ee,
              onChange: (ge) => te(ge.target.value),
              required: !0,
              autoComplete: "current-password"
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "auth-form__footer", children: [
          /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "submit", disabled: Z, children: "Sign In" }),
          /* @__PURE__ */ E.jsx("button", { className: "btn btn-link", type: "button", onClick: () => w("register"), children: "Need an account?" })
        ] })
      ] }),
      _ === "register" && /* @__PURE__ */ E.jsxs("form", { className: "auth-form", onSubmit: _t, children: [
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "register-email", children: "Email" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "register-email",
              type: "email",
              value: ne,
              onChange: (ge) => K(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "register-username", children: "Username" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "register-username",
              value: Ce,
              onChange: (ge) => Ue(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "register-password", children: "Password" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "register-password",
              type: "password",
              value: ce,
              onChange: (ge) => ye(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ E.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
          /* @__PURE__ */ E.jsx(
            "input",
            {
              id: "register-confirm",
              type: "password",
              value: Le,
              onChange: (ge) => he(ge.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "auth-form__footer", children: [
          /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "submit", disabled: Z, children: "Create Account" }),
          /* @__PURE__ */ E.jsx("button", { className: "btn btn-link", type: "button", onClick: () => w("login"), children: "Sign in instead" })
        ] })
      ] })
    ] })
  ] });
}
function yk() {
  var w, R;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (R = (w = window.ShadowmasterLegacyApp) == null ? void 0 : w.showWizardStep) == null || R.call(w, 1);
  const _ = document.getElementById("character-modal");
  _ && (_.style.display = "block");
}
function gk() {
  const [_, w] = q.useState(null);
  return q.useEffect(() => {
    w(document.getElementById("characters-actions"));
  }, []), _ ? Wu.createPortal(
    /* @__PURE__ */ E.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ E.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ E.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ E.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ E.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ E.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: yk,
          children: "Create Character"
        }
      ) })
    ] }),
    _
  ) : null;
}
function Gf() {
  return hk();
}
const Sk = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
];
function Ek({ targetId: _ = "campaign-creation-react-root", onCreated: w }) {
  const {
    activeEdition: R,
    supportedEditions: J,
    characterCreationData: Z,
    reloadEditionData: A,
    setEdition: g
  } = Gf(), [le, U] = q.useState(null), [Q, ke] = q.useState(R.key), [Y, ee] = q.useState(Z), [te, ne] = q.useState([]), [K, Ce] = q.useState(""), [Ue, ce] = q.useState(""), [ye, Le] = q.useState("experienced"), [he, Ee] = q.useState("priority"), [P, fe] = q.useState([]), [ue, xe] = q.useState(!1), [Ve, et] = q.useState(!1), [Re, bt] = q.useState(null);
  q.useEffect(() => {
    U(document.getElementById(_));
  }, [_]), q.useEffect(() => {
    if (!ue)
      return;
    const b = window.setTimeout(() => {
      const I = document.getElementById("campaign-name");
      I == null || I.focus({ preventScroll: !1 });
    }, 0);
    return () => window.clearTimeout(b);
  }, [ue]), q.useEffect(() => {
    ke(R.key);
  }, [R.key]), q.useEffect(() => {
    async function b(I) {
      var Qe;
      try {
        const Ae = await fetch(`/api/editions/${I}/character-creation`);
        if (!Ae.ok)
          throw new Error(`Failed to load edition data (${Ae.status})`);
        const at = await Ae.json(), ut = (at == null ? void 0 : at.character_creation) ?? at;
        ee(ut);
        const ct = Object.entries(ut.gameplay_levels ?? {}).map(([ft, { label: gt }]) => ({
          value: ft,
          label: gt || ft
        }));
        ne(ct), ct.some((ft) => ft.value === ye) || Le(((Qe = ct[0]) == null ? void 0 : Qe.value) ?? "experienced");
      } catch (Ae) {
        console.error("Failed to load edition data", Ae);
      }
    }
    b(Q);
  }, [Q, ye]), q.useEffect(() => {
    async function b() {
      try {
        const I = await fetch("/api/users?role=gamemaster,administrator");
        if (!I.ok)
          throw new Error(`Failed to load users (${I.status})`);
        const Qe = await I.json();
        if (!Array.isArray(Qe) || Qe.length === 0) {
          fe([]);
          return;
        }
        fe(Qe), Qe.length > 0 && ce((Ae) => Ae || Qe[0].id);
      } catch (I) {
        console.error("Failed to load users", I), fe([]);
      }
    }
    b();
  }, []), q.useEffect(() => {
    !Y && Z && ee(Z);
  }, [Z, Y]);
  const _t = q.useMemo(() => J.map((b) => ({
    label: b.label,
    value: b.key
  })), [J]), Dt = q.useMemo(() => P.length === 0 ? [{ label: "No gamemasters found", value: "" }] : P.map((b) => ({
    label: `${b.username} (${b.email})`,
    value: b.id
  })), [P]);
  function Pe() {
    var b;
    Ce(""), Le("experienced"), Ee("priority"), ce(((b = P[0]) == null ? void 0 : b.id) ?? ""), bt(null);
  }
  function me() {
    Pe(), xe(!0);
  }
  function ge() {
    Pe(), xe(!1);
  }
  async function ve(b) {
    var I, Qe;
    b.preventDefault(), et(!0), bt(null);
    try {
      const Ae = P.find((ut) => ut.id === Ue), at = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: K,
          gm_user_id: Ue,
          gm_name: (Ae == null ? void 0 : Ae.username) ?? (Ae == null ? void 0 : Ae.email) ?? "",
          edition: Q,
          gameplay_level: ye,
          creation_method: he,
          status: "Active"
        })
      });
      if (!at.ok) {
        const ut = await at.text();
        throw new Error(ut || `Failed to create campaign (${at.status})`);
      }
      Pe(), (Qe = (I = window.ShadowmasterLegacyApp) == null ? void 0 : I.loadCampaigns) == null || Qe.call(I), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), w == null || w(), xe(!1);
    } catch (Ae) {
      const at = Ae instanceof Error ? Ae.message : "Failed to create campaign.";
      bt(at);
    } finally {
      et(!1);
    }
  }
  return le ? Wu.createPortal(
    /* @__PURE__ */ E.jsx(
      "section",
      {
        className: `campaign-create-react ${ue ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: ue ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
          /* @__PURE__ */ E.jsx("h3", { children: "Create Campaign" }),
          /* @__PURE__ */ E.jsxs("form", { className: "campaign-form", onSubmit: ve, children: [
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-name", children: "Campaign Name" }),
              /* @__PURE__ */ E.jsx(
                "input",
                {
                  id: "campaign-name",
                  name: "campaign-name",
                  value: K,
                  onChange: (b) => Ce(b.target.value),
                  required: !0,
                  placeholder: "Enter campaign title"
                }
              )
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-edition", children: "Edition" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-edition",
                  name: "campaign-edition",
                  value: Q,
                  onChange: (b) => {
                    const I = b.target.value;
                    ke(I), g(I), A(I);
                  },
                  children: _t.map((b) => /* @__PURE__ */ E.jsx("option", { value: b.value, children: b.label }, b.value))
                }
              )
            ] }),
            te.length > 0 && /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-gameplay-level", children: "Gameplay Level" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-gameplay-level",
                  name: "campaign-gameplay-level",
                  value: ye,
                  onChange: (b) => Le(b.target.value),
                  children: te.map((b) => /* @__PURE__ */ E.jsx("option", { value: b.value, children: b.label }, b.value))
                }
              )
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-creation-method", children: "Character Creation Method" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-creation-method",
                  name: "campaign-creation-method",
                  value: he,
                  onChange: (b) => Ee(b.target.value),
                  children: Sk.map((b) => /* @__PURE__ */ E.jsx("option", { value: b.value, children: b.label }, b.value))
                }
              ),
              he !== "priority" && /* @__PURE__ */ E.jsx("small", { children: "Alternative creation methods are not yet implemented and will default to Priority." })
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-gm",
                  name: "campaign-gm",
                  value: Ue,
                  onChange: (b) => ce(b.target.value),
                  children: Dt.map((b) => /* @__PURE__ */ E.jsx("option", { value: b.value, children: b.label }, b.value))
                }
              )
            ] }),
            Re && /* @__PURE__ */ E.jsx("p", { className: "form-error", children: Re }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-actions", children: [
              /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn-secondary", disabled: Ve, onClick: ge, children: "Cancel" }),
              /* @__PURE__ */ E.jsx("button", { type: "submit", className: "btn-primary", disabled: Ve, children: Ve ? "Creating…" : "Create Campaign" })
            ] })
          ] })
        ] }) : /* @__PURE__ */ E.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ E.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ E.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ E.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn-primary", onClick: me, children: "Create Campaign" })
        ] })
      }
    ),
    le
  ) : null;
}
function Ck(_, w, R) {
  const J = R === "asc" ? 1 : -1, Z = (le) => le instanceof Date ? le.getTime() : typeof le == "number" ? le : typeof le == "boolean" ? le ? 1 : 0 : le == null ? "" : String(le).toLowerCase(), A = Z(_), g = Z(w);
  return A < g ? -1 * J : A > g ? 1 * J : 0;
}
function wk({
  columns: _,
  data: w,
  getRowId: R,
  loading: J = !1,
  emptyState: Z,
  enableSearch: A = !0,
  searchPlaceholder: g = "Search…",
  initialSortKey: le,
  initialSortDirection: U = "asc",
  rowClassName: Q
}) {
  var Le, he;
  const ke = q.useMemo(
    () => _.filter((Ee) => Ee.sortable),
    [_]
  ), Y = le ?? ((Le = ke[0]) == null ? void 0 : Le.key) ?? ((he = _[0]) == null ? void 0 : he.key) ?? "", [ee, te] = q.useState(Y), [ne, K] = q.useState(U), [Ce, Ue] = q.useState(""), ce = q.useMemo(() => {
    const Ee = _.filter((xe) => xe.searchable !== !1), P = w.filter((xe) => !A || !Ce.trim() ? !0 : Ee.some((Ve) => {
      const et = Ve.accessor, Re = et ? et(xe) : xe[Ve.key];
      return Re == null ? !1 : String(Re).toLowerCase().includes(Ce.toLowerCase());
    }));
    if (!ee)
      return P;
    const fe = _.find((xe) => xe.key === ee);
    if (!fe)
      return P;
    const ue = fe.accessor;
    return [...P].sort((xe, Ve) => {
      const et = ue ? ue(xe) : xe[ee], Re = ue ? ue(Ve) : Ve[ee];
      return Ck(et, Re, ne);
    });
  }, [_, w, A, Ce, ne, ee]);
  function ye(Ee) {
    ee === Ee ? K((P) => P === "asc" ? "desc" : "asc") : (te(Ee), K("asc"));
  }
  return /* @__PURE__ */ E.jsxs("div", { className: "data-table-wrapper", children: [
    A && _.length > 0 && /* @__PURE__ */ E.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ E.jsx(
      "input",
      {
        type: "search",
        placeholder: g,
        value: Ce,
        onChange: (Ee) => Ue(Ee.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ E.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ E.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ E.jsx("thead", { children: /* @__PURE__ */ E.jsx("tr", { children: _.map((Ee) => {
        const P = Ee.sortable !== !1, fe = Ee.key === ee;
        return /* @__PURE__ */ E.jsxs(
          "th",
          {
            style: { width: Ee.width },
            className: [
              Ee.align ? `align-${Ee.align}` : "",
              P ? "sortable" : "",
              fe ? `sorted-${ne}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              P && ye(Ee.key);
            },
            children: [
              /* @__PURE__ */ E.jsx("span", { children: Ee.header }),
              P && /* @__PURE__ */ E.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: fe ? ne === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          Ee.key
        );
      }) }) }),
      /* @__PURE__ */ E.jsx("tbody", { children: J ? /* @__PURE__ */ E.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ E.jsx("td", { colSpan: _.length, children: "Loading…" }) }) : ce.length === 0 ? /* @__PURE__ */ E.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ E.jsx("td", { colSpan: _.length, children: Z || "No records found." }) }) : ce.map((Ee, P) => /* @__PURE__ */ E.jsx("tr", { className: Q == null ? void 0 : Q(Ee), children: _.map((fe) => /* @__PURE__ */ E.jsx("td", { className: fe.align ? `align-${fe.align}` : void 0, children: fe.render ? fe.render(Ee) : Ee[fe.key] }, fe.key)) }, R(Ee, P))) })
    ] }) })
  ] });
}
function xk(_) {
  if (!_)
    return "—";
  const w = Date.parse(_);
  return Number.isNaN(w) ? _ : new Date(w).toLocaleDateString();
}
function Rk({
  campaigns: _,
  loading: w,
  error: R,
  onEdit: J,
  onDelete: Z,
  currentUser: A,
  actionInFlightId: g
}) {
  const le = q.useMemo(
    () => [
      {
        key: "name",
        header: "Campaign",
        sortable: !0,
        accessor: (U) => U.name
      },
      {
        key: "edition",
        header: "Edition",
        sortable: !0,
        accessor: (U) => U.edition.toUpperCase()
      },
      {
        key: "gameplay_level",
        header: "Gameplay Level",
        sortable: !0,
        accessor: (U) => U.gameplay_level ?? "",
        render: (U) => {
          var Q;
          return ((Q = U.gameplay_level) == null ? void 0 : Q.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "creation_method",
        header: "Creation Method",
        sortable: !0,
        accessor: (U) => U.creation_method,
        render: (U) => {
          var Q;
          return ((Q = U.creation_method) == null ? void 0 : Q.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "gm_name",
        header: "Gamemaster",
        sortable: !0,
        accessor: (U) => U.gm_name ?? "",
        render: (U) => U.gm_name ?? "—"
      },
      {
        key: "status",
        header: "Status",
        sortable: !0,
        accessor: (U) => U.status ?? "",
        render: (U) => /* @__PURE__ */ E.jsx("span", { className: `status-badge status-${(U.status ?? "unknown").toLowerCase()}`, children: U.status ?? "—" })
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: !0,
        accessor: (U) => U.updated_at ? new Date(U.updated_at) : null,
        render: (U) => xk(U.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (U) => {
          var te, ne, K;
          const Q = U.can_edit || U.can_delete || (A == null ? void 0 : A.isAdministrator) || U.gm_user_id && ((te = A == null ? void 0 : A.user) == null ? void 0 : te.id) === U.gm_user_id, ke = g === U.id, Y = (U.can_edit ?? !1) || (A == null ? void 0 : A.isAdministrator) || U.gm_user_id && ((ne = A == null ? void 0 : A.user) == null ? void 0 : ne.id) === U.gm_user_id, ee = (U.can_delete ?? !1) || (A == null ? void 0 : A.isAdministrator) || U.gm_user_id && ((K = A == null ? void 0 : A.user) == null ? void 0 : K.id) === U.gm_user_id;
          return /* @__PURE__ */ E.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ E.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => J(U),
                disabled: ke || !Q || !Y,
                children: "Edit"
              }
            ),
            /* @__PURE__ */ E.jsx(
              "button",
              {
                type: "button",
                className: "button button--table button--danger",
                onClick: () => Z(U),
                disabled: ke || !Q || !ee,
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [g, A, Z, J]
  );
  return /* @__PURE__ */ E.jsxs("div", { className: "campaign-table", children: [
    R && /* @__PURE__ */ E.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: R }),
    /* @__PURE__ */ E.jsx(
      wk,
      {
        columns: le,
        data: _,
        loading: w,
        getRowId: (U) => U.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const Tk = ["Active", "Paused", "Completed"];
function bk({ campaign: _, gmUsers: w, gameplayRules: R, onClose: J, onSave: Z }) {
  const { loadCampaignCharacterCreation: A } = Gf(), [g, le] = q.useState(_.name), [U, Q] = q.useState(_.gm_user_id ?? ""), [ke, Y] = q.useState(_.status ?? "Active"), [ee, te] = q.useState(_.house_rules ?? ""), [ne, K] = q.useState(_.gameplay_level ?? "experienced"), [Ce, Ue] = q.useState(!1), [ce, ye] = q.useState(null), Le = q.useMemo(() => w.length === 0 ? [{ label: "No gamemasters found", value: "" }] : w.map((P) => ({
    label: `${P.username} (${P.email})`,
    value: P.id
  })), [w]);
  q.useEffect(() => {
    le(_.name), Q(_.gm_user_id ?? ""), Y(_.status ?? "Active"), te(_.house_rules ?? ""), K(_.gameplay_level ?? "experienced");
  }, [_]);
  const he = Ce || g.trim().length === 0 || w.length > 0 && !U;
  async function Ee(P) {
    if (P.preventDefault(), !he) {
      Ue(!0), ye(null);
      try {
        const fe = w.find((ue) => ue.id === U);
        await Z({
          name: g.trim(),
          gm_user_id: U || void 0,
          gm_name: (fe == null ? void 0 : fe.username) ?? (fe == null ? void 0 : fe.email) ?? "",
          status: ke,
          house_rules: ee,
          gameplay_level: ne
        }), await A(_.id), J();
      } catch (fe) {
        const ue = fe instanceof Error ? fe.message : "Failed to update campaign.";
        ye(ue);
      } finally {
        Ue(!1);
      }
    }
  }
  return /* @__PURE__ */ E.jsx("div", { className: "modal", style: { display: "block" }, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ E.jsxs("div", { className: "modal-content", children: [
    /* @__PURE__ */ E.jsxs("header", { className: "modal-header", children: [
      /* @__PURE__ */ E.jsx("h3", { children: "Edit Campaign" }),
      /* @__PURE__ */ E.jsx("button", { type: "button", className: "modal-close", onClick: J, "aria-label": "Close edit campaign form", children: "×" })
    ] }),
    /* @__PURE__ */ E.jsxs("form", { className: "campaign-form", onSubmit: Ee, children: [
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-name", children: "Campaign Name" }),
        /* @__PURE__ */ E.jsx(
          "input",
          {
            id: "edit-campaign-name",
            name: "campaign-name",
            value: g,
            onChange: (P) => le(P.target.value),
            required: !0
          }
        )
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-gm", children: "Gamemaster" }),
        /* @__PURE__ */ E.jsx(
          "select",
          {
            id: "edit-campaign-gm",
            name: "campaign-gm",
            value: U,
            onChange: (P) => Q(P.target.value),
            children: Le.map((P) => /* @__PURE__ */ E.jsx("option", { value: P.value, children: P.label }, P.value))
          }
        )
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-status", children: "Status" }),
        /* @__PURE__ */ E.jsx(
          "select",
          {
            id: "edit-campaign-status",
            name: "campaign-status",
            value: ke,
            onChange: (P) => Y(P.target.value),
            children: Tk.map((P) => /* @__PURE__ */ E.jsx("option", { value: P, children: P }, P))
          }
        )
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-gameplay-level", children: "Gameplay Level" }),
        /* @__PURE__ */ E.jsx(
          "select",
          {
            id: "edit-campaign-gameplay-level",
            name: "campaign-gameplay-level",
            value: ne,
            onChange: (P) => K(P.target.value),
            children: /* @__PURE__ */ E.jsx("option", { value: _.gameplay_level ?? "experienced", children: (R == null ? void 0 : R.label) || _.gameplay_level || "Experienced" })
          }
        ),
        /* @__PURE__ */ E.jsx("small", { children: "Gameplay level selections are constrained by the active edition." })
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-house-rules", children: "House Rules" }),
        /* @__PURE__ */ E.jsx(
          "textarea",
          {
            id: "edit-campaign-house-rules",
            name: "campaign-house-rules",
            rows: 3,
            value: ee,
            onChange: (P) => te(P.target.value)
          }
        )
      ] }),
      ce && /* @__PURE__ */ E.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: ce }),
      /* @__PURE__ */ E.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ E.jsx("button", { type: "button", className: "button button--secondary", onClick: J, children: "Cancel" }),
        /* @__PURE__ */ E.jsx("button", { type: "submit", className: "button button--primary", disabled: he, children: Ce ? "Saving…" : "Save Changes" })
      ] })
    ] })
  ] }) });
}
const _k = "campaigns-list";
async function Xm(_, w = {}) {
  const R = new Headers(w.headers || {});
  w.body && !R.has("Content-Type") && R.set("Content-Type", "application/json");
  const J = await fetch(_, {
    ...w,
    headers: R,
    credentials: "include"
  });
  if (!J.ok) {
    const Z = await J.text();
    throw new Error(Z || `Request failed (${J.status})`);
  }
  return J.status === 204 ? {} : await J.json();
}
function kk({ targetId: _ = _k }) {
  const [w, R] = q.useState(null), [J, Z] = q.useState([]), [A, g] = q.useState(!1), [le, U] = q.useState(null), [Q, ke] = q.useState(null), [Y, ee] = q.useState(null), [te, ne] = q.useState(null), [K, Ce] = q.useState(null), [Ue, ce] = q.useState([]), [ye, Le] = q.useState(
    window.ShadowmasterAuth ?? null
  );
  q.useEffect(() => {
    R(document.getElementById(_));
  }, [_]), q.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const he = q.useCallback(async () => {
    g(!0), U(null);
    try {
      const ue = await Xm("/api/campaigns");
      Z(Array.isArray(ue) ? ue : []);
    } catch (ue) {
      const xe = ue instanceof Error ? ue.message : "Failed to load campaigns.";
      U(xe), Z([]);
    } finally {
      g(!1);
    }
  }, []), Ee = q.useCallback(async () => {
    try {
      const ue = await Xm("/api/users?role=gamemaster,administrator");
      ce(Array.isArray(ue) ? ue : []);
    } catch (ue) {
      console.warn("Failed to load gamemaster roster", ue), ce([]);
    }
  }, []);
  q.useEffect(() => {
    he(), Ee();
  }, [he, Ee]), q.useEffect(() => {
    const ue = () => {
      he();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", ue), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", ue);
    };
  }, [he]), q.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      he();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [he]), q.useEffect(() => {
    const ue = (xe) => {
      const Ve = xe.detail;
      Le(Ve ?? null);
    };
    return window.addEventListener("shadowmaster:auth", ue), () => {
      window.removeEventListener("shadowmaster:auth", ue);
    };
  }, []), q.useEffect(() => {
    if (!Y)
      return;
    const ue = window.setTimeout(() => ee(null), 4e3);
    return () => window.clearTimeout(ue);
  }, [Y]);
  const P = q.useCallback(
    async (ue) => {
      if (!(!ue.can_delete && !(ye != null && ye.isAdministrator) || !window.confirm(
        `Delete campaign "${ue.name}"? This action cannot be undone.`
      ))) {
        ke(null), ee(null), ne(ue.id);
        try {
          await Xm(`/api/campaigns/${ue.id}`, { method: "DELETE" }), ee(`Campaign "${ue.name}" deleted.`), await he(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (Ve) {
          const et = Ve instanceof Error ? Ve.message : "Failed to delete campaign.";
          ke(et);
        } finally {
          ne(null);
        }
      }
    },
    [ye == null ? void 0 : ye.isAdministrator, he]
  ), fe = q.useCallback(
    async (ue) => {
      if (K) {
        ke(null), ee(null), ne(K.id);
        try {
          const xe = JSON.stringify({
            name: ue.name,
            gm_name: ue.gm_name,
            gm_user_id: ue.gm_user_id,
            status: ue.status,
            house_rules: ue.house_rules,
            gameplay_level: ue.gameplay_level
          }), Ve = await Xm(`/api/campaigns/${K.id}`, {
            method: "PUT",
            body: xe
          });
          Z(
            (et) => et.map((Re) => Re.id === Ve.id ? Ve : Re)
          ), ee(`Campaign "${Ve.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), Ce(null);
        } catch (xe) {
          const Ve = xe instanceof Error ? xe.message : "Failed to update campaign.";
          ke(Ve);
        } finally {
          ne(null);
        }
      }
    },
    [K]
  );
  return w ? Wu.createPortal(
    /* @__PURE__ */ E.jsxs("section", { className: "campaigns-react-shell", children: [
      Y && /* @__PURE__ */ E.jsx("p", { className: "campaigns-table__status", children: Y }),
      Q && /* @__PURE__ */ E.jsx("p", { className: "campaigns-table__error", children: Q }),
      /* @__PURE__ */ E.jsx(
        Rk,
        {
          campaigns: J,
          loading: A,
          error: le,
          onEdit: (ue) => Ce(ue),
          onDelete: P,
          currentUser: ye,
          actionInFlightId: te
        }
      ),
      K && /* @__PURE__ */ E.jsx(
        bk,
        {
          campaign: K,
          gmUsers: Ue,
          gameplayRules: K.gameplay_rules,
          onClose: () => Ce(null),
          onSave: fe
        }
      )
    ] }),
    w
  ) : null;
}
const Zm = [
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
function Dk() {
  const _ = window.location.hash.replace("#", "").toLowerCase(), w = Zm.find((R) => R.key === _);
  return (w == null ? void 0 : w.key) ?? "characters";
}
function Ok(_) {
  q.useEffect(() => {
    Zm.forEach(({ key: w, targetId: R }) => {
      const J = document.getElementById(R);
      J && (w === _ ? (J.removeAttribute("hidden"), J.classList.add("main-tab-panel--active"), J.style.display = "", J.setAttribute("data-active-tab", w)) : (J.setAttribute("hidden", "true"), J.classList.remove("main-tab-panel--active"), J.style.display = "none", J.removeAttribute("data-active-tab")));
    });
  }, [_]);
}
function Nk() {
  const [_, w] = q.useState(null), [R, J] = q.useState(() => Dk());
  q.useEffect(() => {
    w(document.getElementById("main-navigation-root"));
  }, []), Ok(R), q.useEffect(() => {
    window.history.replaceState(null, "", `#${R}`);
  }, [R]);
  const Z = q.useMemo(
    () => {
      var A;
      return ((A = Zm.find((g) => g.key === R)) == null ? void 0 : A.description) ?? "";
    },
    [R]
  );
  return _ ? Wu.createPortal(
    /* @__PURE__ */ E.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ E.jsx("div", { className: "main-tabs__list", children: Zm.map((A) => {
        const g = A.key === R;
        return /* @__PURE__ */ E.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${A.key}`,
            "aria-selected": g,
            "aria-controls": A.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => J(A.key),
            type: "button",
            children: A.label
          },
          A.key
        );
      }) }),
      /* @__PURE__ */ E.jsx("p", { className: "main-tabs__summary", role: "status", children: Z })
    ] }),
    _
  ) : null;
}
const Wf = [
  "magic",
  "metatype",
  "attributes",
  "skills",
  "resources"
], ey = ["A", "B", "C", "D", "E"], Lk = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function Mk(_) {
  return Lk[_];
}
function jk(_, w) {
  var J;
  const R = (J = _ == null ? void 0 : _.priorities) == null ? void 0 : J[w];
  return R ? ey.map((Z) => {
    const A = R[Z] ?? { label: `Priority ${Z}` };
    return { code: Z, option: A };
  }) : ey.map((Z) => ({
    code: Z,
    option: { label: `Priority ${Z}` }
  }));
}
function Ak() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function gx(_) {
  return Wf.reduce((w, R) => {
    const J = _[R];
    return J && w.push(J), w;
  }, []);
}
function vx(_) {
  const w = new Set(gx(_));
  return ey.filter((R) => !w.has(R));
}
function zk(_) {
  return gx(_).length === ey.length;
}
function Uk(_) {
  return _ ? _.summary || _.description || _.label || "" : "Drag a priority letter from the pool into this category.";
}
function Fk(_) {
  return Object.fromEntries(
    Object.entries(_).map(([w, R]) => [w, R || null])
  );
}
function Pk() {
  var J, Z;
  const _ = Ak();
  if (typeof window > "u")
    return _;
  const w = (Z = (J = window.ShadowmasterLegacyApp) == null ? void 0 : J.getPriorities) == null ? void 0 : Z.call(J);
  if (!w)
    return _;
  const R = { ..._ };
  for (const A of Wf) {
    const g = w[A];
    typeof g == "string" && g.length === 1 && (R[A] = g);
  }
  return R;
}
function Hk() {
  const {
    characterCreationData: _,
    activeEdition: w,
    isLoading: R,
    error: J,
    campaignGameplayRules: Z,
    campaignLoading: A,
    campaignError: g
  } = Gf(), [le, U] = q.useState(() => Pk()), [Q, ke] = q.useState(null), Y = q.useRef({});
  q.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), q.useEffect(() => {
    var fe;
    const P = (fe = window.ShadowmasterLegacyApp) == null ? void 0 : fe.setPriorities;
    P && P(Fk(le));
  }, [le]);
  const ee = q.useMemo(() => vx(le), [le]), te = zk(le);
  function ne(P) {
    U((fe) => {
      const ue = { ...fe };
      for (const xe of Wf)
        ue[xe] === P && (ue[xe] = "");
      return ue;
    });
  }
  function K(P, fe) {
    fe.dataTransfer.effectAllowed = "move", ke({ source: "pool", priority: P }), fe.dataTransfer.setData("text/plain", P);
  }
  function Ce(P, fe, ue) {
    ue.dataTransfer.effectAllowed = "move", ke({ source: "dropzone", category: P, priority: fe }), ue.dataTransfer.setData("text/plain", fe);
  }
  function Ue() {
    ke(null);
  }
  function ce(P, fe) {
    fe.preventDefault();
    const ue = fe.dataTransfer.getData("text/plain") || (Q == null ? void 0 : Q.priority) || "";
    if (!ue) {
      Ue();
      return;
    }
    U((xe) => {
      const Ve = { ...xe };
      for (const et of Wf)
        Ve[et] === ue && (Ve[et] = "");
      return Ve[P] = ue, Ve;
    }), Ue();
  }
  function ye(P, fe) {
    fe.preventDefault();
    const ue = Y.current[P];
    ue && ue.classList.add("active");
  }
  function Le(P) {
    const fe = Y.current[P];
    fe && fe.classList.remove("active");
  }
  function he(P) {
    const fe = Y.current[P];
    fe && fe.classList.remove("active");
  }
  function Ee(P) {
    const fe = ee[0];
    if (!fe) {
      ne(P);
      return;
    }
    U((ue) => {
      const xe = { ...ue };
      for (const Ve of Wf)
        xe[Ve] === P && (xe[Ve] = "");
      return xe[fe] = P, xe;
    });
  }
  return /* @__PURE__ */ E.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ E.jsx("strong", { children: w.label })
      ] }),
      /* @__PURE__ */ E.jsx("span", { children: g ? `Campaign defaults unavailable: ${g}` : A ? "Applying campaign defaults…" : R ? "Loading priority data…" : J ? `Error: ${J}` : "Drag letters into categories" })
    ] }),
    Z && /* @__PURE__ */ E.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ E.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        Z.label
      ] }),
      Z.description && /* @__PURE__ */ E.jsx("p", { children: Z.description })
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ E.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ E.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ E.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (P) => {
              P.preventDefault(), ke((fe) => fe && { ...fe, category: void 0 });
            },
            onDrop: (P) => {
              P.preventDefault();
              const fe = P.dataTransfer.getData("text/plain") || (Q == null ? void 0 : Q.priority) || "";
              fe && ne(fe), Ue();
            },
            children: /* @__PURE__ */ E.jsx("div", { className: "react-priority-chips", children: ["A", "B", "C", "D", "E"].map((P) => {
              const fe = vx(le).includes(P) === !1, ue = (Q == null ? void 0 : Q.priority) === P && Q.source === "pool";
              return /* @__PURE__ */ E.jsx(
                "div",
                {
                  className: `react-priority-chip ${fe ? "used" : ""} ${ue ? "dragging" : ""}`,
                  draggable: !fe,
                  onDragStart: (xe) => !fe && K(P, xe),
                  onDragEnd: Ue,
                  onClick: () => Ee(P),
                  role: "button",
                  tabIndex: fe ? -1 : 0,
                  onKeyDown: (xe) => {
                    !fe && (xe.key === "Enter" || xe.key === " ") && (xe.preventDefault(), Ee(P));
                  },
                  children: P
                },
                P
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ E.jsx("section", { className: "react-priority-dropzones", children: Wf.map((P) => {
        const fe = Mk(P), ue = jk(_, P), xe = le[P], Ve = ue.find((Re) => Re.code === xe), et = (Q == null ? void 0 : Q.source) === "dropzone" && Q.category === P;
        return /* @__PURE__ */ E.jsxs(
          "div",
          {
            ref: (Re) => {
              Y.current[P] = Re;
            },
            className: `react-priority-dropzone ${xe ? "filled" : ""}`,
            onDragOver: (Re) => ye(P, Re),
            onDragLeave: () => Le(P),
            onDrop: (Re) => {
              ce(P, Re), he(P);
            },
            children: [
              /* @__PURE__ */ E.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ E.jsx("span", { children: fe }),
                xe && /* @__PURE__ */ E.jsxs("span", { children: [
                  xe,
                  " — ",
                  (Ve == null ? void 0 : Ve.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ E.jsx("div", { className: "react-priority-description", children: Uk(Ve == null ? void 0 : Ve.option) }),
              xe ? /* @__PURE__ */ E.jsx(
                "div",
                {
                  className: `react-priority-chip ${et ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (Re) => Ce(P, xe, Re),
                  onDragEnd: Ue,
                  onDoubleClick: () => ne(xe),
                  children: xe
                }
              ) : /* @__PURE__ */ E.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          P
        );
      }) })
    ] }),
    /* @__PURE__ */ E.jsx(
      "div",
      {
        className: `react-priority-status ${te ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: te ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${ee.join(", ")}`
      }
    )
  ] });
}
const Vk = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function Bk(_, w) {
  if (!_)
    return [];
  const R = w || "E";
  return _.metatypes.map((J) => {
    var Z;
    return {
      ...J,
      priorityAllowed: ((Z = J.priority_tiers) == null ? void 0 : Z.includes(R)) ?? !1
    };
  }).filter((J) => J.priorityAllowed);
}
function Ik(_) {
  return _ === 0 ? "+0" : _ > 0 ? `+${_}` : `${_}`;
}
function Yk(_) {
  const w = _.toLowerCase();
  return Vk[w] ?? _;
}
function $k({ priority: _, selectedMetatype: w, onSelect: R }) {
  const { characterCreationData: J, isLoading: Z, error: A, activeEdition: g } = Gf();
  q.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const le = q.useMemo(() => {
    var ne;
    const Y = ((ne = _ == null ? void 0 : _.toUpperCase) == null ? void 0 : ne.call(_)) ?? "", te = ["A", "B", "C", "D", "E"].includes(Y) ? Y : "";
    return Bk(J, te);
  }, [J, _]), U = !!w, Q = () => {
    var Y, ee;
    (ee = (Y = window.ShadowmasterLegacyApp) == null ? void 0 : Y.showWizardStep) == null || ee.call(Y, 1);
  }, ke = () => {
    var Y, ee;
    w && ((ee = (Y = window.ShadowmasterLegacyApp) == null ? void 0 : Y.showWizardStep) == null || ee.call(Y, 3));
  };
  return Z ? /* @__PURE__ */ E.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : A ? /* @__PURE__ */ E.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    A
  ] }) : le.length ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
    /* @__PURE__ */ E.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ E.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Priority: ",
        _ || "—"
      ] })
    ] }),
    /* @__PURE__ */ E.jsx("div", { className: "react-metatype-grid", children: le.map((Y) => /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `react-metatype-card ${w === Y.id ? "selected" : ""}`,
        onClick: () => R(Y.id),
        children: [
          /* @__PURE__ */ E.jsx("h4", { children: Y.name }),
          /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const ee = Y.attribute_modifiers ? Object.entries(Y.attribute_modifiers).filter(([, te]) => te !== 0) : [];
              return ee.length === 0 ? /* @__PURE__ */ E.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : ee.map(([te, ne]) => /* @__PURE__ */ E.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ E.jsx("span", { children: Yk(te) }),
                /* @__PURE__ */ E.jsx("span", { className: ne > 0 ? "positive" : "negative", children: Ik(ne) })
              ] }, te));
            })()
          ] }),
          g.key === "sr5" && Y.special_attribute_points && Object.keys(Y.special_attribute_points).length > 0 && /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(Y.special_attribute_points).map(([ee, te]) => /* @__PURE__ */ E.jsx("div", { className: "ability", children: /* @__PURE__ */ E.jsxs("span", { children: [
              "Priority ",
              ee,
              ": ",
              te
            ] }) }, ee))
          ] }),
          Y.abilities && Y.abilities.length > 0 && /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Special Abilities" }),
            Y.abilities.map((ee, te) => /* @__PURE__ */ E.jsx("div", { className: "ability", children: /* @__PURE__ */ E.jsx("span", { children: ee }) }, te))
          ] }),
          (!Y.abilities || Y.abilities.length === 0) && /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ E.jsx("div", { className: "ability", children: /* @__PURE__ */ E.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      Y.id
    )) }),
    /* @__PURE__ */ E.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn btn-secondary", onClick: Q, children: "Back" }),
      /* @__PURE__ */ E.jsx("div", { className: `react-metatype-status ${U ? "ready" : ""}`, children: U ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn btn-primary", disabled: !U, onClick: ke, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ E.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const Qk = ["Hermetic", "Shamanic"], Wk = [
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
function Gk(_) {
  return (_ || "").toUpperCase();
}
function qk({ priority: _, selection: w, onChange: R }) {
  var te;
  const { characterCreationData: J, activeEdition: Z } = Gf(), A = Gk(_), g = ((te = J == null ? void 0 : J.priorities) == null ? void 0 : te.magic) ?? null, le = q.useMemo(() => g && g[A] || null, [g, A]);
  q.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), q.useEffect(() => {
    if (!A) {
      (w.type !== "Mundane" || w.tradition || w.totem) && R({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (A === "A") {
      const ne = w.tradition ?? "Hermetic", K = ne === "Shamanic" ? w.totem : null;
      (w.type !== "Full Magician" || w.tradition !== ne || w.totem !== K) && R({ type: "Full Magician", tradition: ne, totem: K });
    } else if (A === "B") {
      let ne = w.type;
      w.type !== "Adept" && w.type !== "Aspected Magician" && (ne = "Adept");
      let K = w.tradition, Ce = w.totem;
      ne === "Aspected Magician" ? (K = K ?? "Hermetic", K !== "Shamanic" && (Ce = null)) : (K = null, Ce = null), (w.type !== ne || w.tradition !== K || w.totem !== Ce) && R({ type: ne, tradition: K, totem: Ce });
    } else
      (w.type !== "Mundane" || w.tradition || w.totem) && R({ type: "Mundane", tradition: null, totem: null });
  }, [A]);
  const U = (ne) => {
    const K = {
      type: ne.type !== void 0 ? ne.type : w.type,
      tradition: ne.tradition !== void 0 ? ne.tradition : w.tradition,
      totem: ne.totem !== void 0 ? ne.totem : w.totem
    };
    K.type !== "Full Magician" && K.type !== "Aspected Magician" && (K.tradition = null, K.totem = null), K.tradition !== "Shamanic" && (K.totem = null), !(K.type === w.type && K.tradition === w.tradition && K.totem === w.totem) && R(K);
  }, Q = () => !A || ["C", "D", "E", ""].includes(A) ? /* @__PURE__ */ E.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ E.jsxs(
    "article",
    {
      className: `react-magic-card ${w.type === "Mundane" ? "selected" : ""}`,
      onClick: () => U({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ E.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ E.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : A === "A" ? /* @__PURE__ */ E.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ E.jsxs(
    "article",
    {
      className: `react-magic-card ${w.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => U({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ E.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ E.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ E.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : A === "B" ? /* @__PURE__ */ E.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `react-magic-card ${w.type === "Adept" ? "selected" : ""}`,
        onClick: () => U({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ E.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ E.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `react-magic-card ${w.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => U({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ E.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ E.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ E.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, ke = () => !w.type || !["Full Magician", "Aspected Magician"].includes(w.type) ? null : /* @__PURE__ */ E.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ E.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ E.jsx("div", { className: "tradition-options", children: Qk.map((ne) => /* @__PURE__ */ E.jsxs("label", { className: `tradition-option ${w.tradition === ne ? "selected" : ""}`, children: [
      /* @__PURE__ */ E.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: ne,
          checked: w.tradition === ne,
          onChange: () => U({ tradition: ne })
        }
      ),
      /* @__PURE__ */ E.jsx("span", { children: ne })
    ] }, ne)) })
  ] }), Y = () => w.tradition !== "Shamanic" ? null : /* @__PURE__ */ E.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ E.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ E.jsx("div", { className: "totem-grid", children: Wk.map((ne) => /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `totem-card ${w.totem === ne.id ? "selected" : ""}`,
        onClick: () => U({ totem: ne.id }),
        children: [
          /* @__PURE__ */ E.jsx("h5", { children: ne.name }),
          /* @__PURE__ */ E.jsx("p", { children: ne.description }),
          /* @__PURE__ */ E.jsx("ul", { children: ne.notes.map((K) => /* @__PURE__ */ E.jsx("li", { children: K }, K)) })
        ]
      },
      ne.id
    )) })
  ] }), ee = () => {
    if (!w.type)
      return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (w.type === "Full Magician" || w.type === "Aspected Magician") {
      if (!w.tradition)
        return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (w.tradition === "Shamanic" && !w.totem)
        return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ E.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ E.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Priority ",
        A || "—",
        " ",
        le != null && le.summary ? `— ${le.summary}` : ""
      ] })
    ] }),
    Q(),
    ke(),
    Y(),
    ee(),
    /* @__PURE__ */ E.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ E.jsxs("small", { children: [
      "Edition: ",
      Z.label
    ] }) })
  ] });
}
function Kk() {
  const [_, w] = q.useState(null);
  return q.useEffect(() => {
    w(document.getElementById("auth-root"));
  }, []), _ ? Wu.createPortal(/* @__PURE__ */ E.jsx(mk, {}), _) : null;
}
function Xk() {
  const [_, w] = q.useState(null);
  return q.useEffect(() => {
    w(document.getElementById("priority-assignment-react-root"));
  }, []), _ ? Wu.createPortal(/* @__PURE__ */ E.jsx(Hk, {}), _) : null;
}
function Jk() {
  const [_, w] = q.useState(null), [R, J] = q.useState(""), [Z, A] = q.useState(null);
  return q.useEffect(() => {
    w(document.getElementById("metatype-selection-react-root"));
  }, []), q.useEffect(() => {
    var U;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const le = () => {
      var Q, ke;
      J(((Q = g.getMetatypePriority) == null ? void 0 : Q.call(g)) ?? ""), A(((ke = g.getMetatypeSelection) == null ? void 0 : ke.call(g)) ?? null);
    };
    return le(), (U = g.subscribeMetatypeState) == null || U.call(g, le), () => {
      var Q;
      (Q = g.unsubscribeMetatypeState) == null || Q.call(g, le);
    };
  }, []), _ ? Wu.createPortal(
    /* @__PURE__ */ E.jsx(
      $k,
      {
        priority: R,
        selectedMetatype: Z,
        onSelect: (g) => {
          var le, U;
          A(g), (U = (le = window.ShadowmasterLegacyApp) == null ? void 0 : le.setMetatypeSelection) == null || U.call(le, g);
        }
      }
    ),
    _
  ) : null;
}
function Zk() {
  const [_, w] = q.useState(null), [R, J] = q.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return q.useEffect(() => {
    w(document.getElementById("magical-abilities-react-root"));
  }, []), q.useEffect(() => {
    var g;
    const Z = window.ShadowmasterLegacyApp;
    if (!Z) return;
    const A = () => {
      var U;
      const le = (U = Z.getMagicState) == null ? void 0 : U.call(Z);
      le && J({
        priority: le.priority || "",
        type: le.type || null,
        tradition: le.tradition || null,
        totem: le.totem || null
      });
    };
    return A(), (g = Z.subscribeMagicState) == null || g.call(Z, A), () => {
      var le;
      (le = Z.unsubscribeMagicState) == null || le.call(Z, A);
    };
  }, []), _ ? Wu.createPortal(
    /* @__PURE__ */ E.jsx(
      qk,
      {
        priority: R.priority,
        selection: { type: R.type, tradition: R.tradition, totem: R.totem },
        onChange: (Z) => {
          var A, g;
          (g = (A = window.ShadowmasterLegacyApp) == null ? void 0 : A.setMagicState) == null || g.call(A, Z);
        }
      }
    ),
    _
  ) : null;
}
function eD() {
  const { activeEdition: _, isLoading: w, error: R, characterCreationData: J } = Gf();
  let Z = "· data pending";
  return w ? Z = "· loading edition data…" : R ? Z = `· failed to load data: ${R}` : J && (Z = "· edition data loaded"), /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
    /* @__PURE__ */ E.jsx("div", { className: "react-banner", "data-active-edition": _.key, children: /* @__PURE__ */ E.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ E.jsx("strong", { children: _.label }),
      " ",
      Z
    ] }) }),
    /* @__PURE__ */ E.jsx(Kk, {}),
    /* @__PURE__ */ E.jsx(Nk, {}),
    /* @__PURE__ */ E.jsx(Ek, {}),
    /* @__PURE__ */ E.jsx(kk, {}),
    /* @__PURE__ */ E.jsx(gk, {}),
    /* @__PURE__ */ E.jsx(Xk, {}),
    /* @__PURE__ */ E.jsx(Jk, {}),
    /* @__PURE__ */ E.jsx(Zk, {})
  ] });
}
const tD = document.getElementById("shadowmaster-react-root"), nD = tD ?? rD();
function rD() {
  const _ = document.createElement("div");
  return _.id = "shadowmaster-react-root", _.dataset.controller = "react-shell", _.style.display = "contents", document.body.appendChild(_), _;
}
function aD() {
  return q.useEffect(() => {
    var _, w, R;
    (_ = window.ShadowmasterLegacyApp) != null && _.initialize && !((R = (w = window.ShadowmasterLegacyApp).isInitialized) != null && R.call(w)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ E.jsx(q.StrictMode, { children: /* @__PURE__ */ E.jsx(vk, { children: /* @__PURE__ */ E.jsx(eD, {}) }) });
}
const iD = xE(nD);
iD.render(/* @__PURE__ */ E.jsx(aD, {}));
