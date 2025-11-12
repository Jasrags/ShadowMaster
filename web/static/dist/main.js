var kx = { exports: {} }, rv = {}, jx = { exports: {} }, Ht = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pw;
function Rj() {
  if (pw) return Ht;
  pw = 1;
  var x = Symbol.for("react.element"), S = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), X = Symbol.for("react.strict_mode"), J = Symbol.for("react.profiler"), R = Symbol.for("react.provider"), g = Symbol.for("react.context"), K = Symbol.for("react.forward_ref"), O = Symbol.for("react.suspense"), U = Symbol.for("react.memo"), be = Symbol.for("react.lazy"), z = Symbol.iterator;
  function Y(D) {
    return D === null || typeof D != "object" ? null : (D = z && D[z] || D["@@iterator"], typeof D == "function" ? D : null);
  }
  var ae = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, se = Object.assign, re = {};
  function Se(D, P, ee) {
    this.props = D, this.context = P, this.refs = re, this.updater = ee || ae;
  }
  Se.prototype.isReactComponent = {}, Se.prototype.setState = function(D, P) {
    if (typeof D != "object" && typeof D != "function" && D != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, D, P, "setState");
  }, Se.prototype.forceUpdate = function(D) {
    this.updater.enqueueForceUpdate(this, D, "forceUpdate");
  };
  function He() {
  }
  He.prototype = Se.prototype;
  function ue(D, P, ee) {
    this.props = D, this.context = P, this.refs = re, this.updater = ee || ae;
  }
  var _e = ue.prototype = new He();
  _e.constructor = ue, se(_e, Se.prototype), _e.isPureReactComponent = !0;
  var xe = Array.isArray, fe = Object.prototype.hasOwnProperty, pe = { current: null }, W = { key: !0, ref: !0, __self: !0, __source: !0 };
  function we(D, P, ee) {
    var ve, wt = {}, kt = null, St = null;
    if (P != null) for (ve in P.ref !== void 0 && (St = P.ref), P.key !== void 0 && (kt = "" + P.key), P) fe.call(P, ve) && !W.hasOwnProperty(ve) && (wt[ve] = P[ve]);
    var yt = arguments.length - 2;
    if (yt === 1) wt.children = ee;
    else if (1 < yt) {
      for (var xt = Array(yt), Bt = 0; Bt < yt; Bt++) xt[Bt] = arguments[Bt + 2];
      wt.children = xt;
    }
    if (D && D.defaultProps) for (ve in yt = D.defaultProps, yt) wt[ve] === void 0 && (wt[ve] = yt[ve]);
    return { $$typeof: x, type: D, key: kt, ref: St, props: wt, _owner: pe.current };
  }
  function de(D, P) {
    return { $$typeof: x, type: D.type, key: P, ref: D.ref, props: D.props, _owner: D._owner };
  }
  function Te(D) {
    return typeof D == "object" && D !== null && D.$$typeof === x;
  }
  function Le(D) {
    var P = { "=": "=0", ":": "=2" };
    return "$" + D.replace(/[=:]/g, function(ee) {
      return P[ee];
    });
  }
  var Ke = /\/+/g;
  function te(D, P) {
    return typeof D == "object" && D !== null && D.key != null ? Le("" + D.key) : P.toString(36);
  }
  function Ae(D, P, ee, ve, wt) {
    var kt = typeof D;
    (kt === "undefined" || kt === "boolean") && (D = null);
    var St = !1;
    if (D === null) St = !0;
    else switch (kt) {
      case "string":
      case "number":
        St = !0;
        break;
      case "object":
        switch (D.$$typeof) {
          case x:
          case S:
            St = !0;
        }
    }
    if (St) return St = D, wt = wt(St), D = ve === "" ? "." + te(St, 0) : ve, xe(wt) ? (ee = "", D != null && (ee = D.replace(Ke, "$&/") + "/"), Ae(wt, P, ee, "", function(Bt) {
      return Bt;
    })) : wt != null && (Te(wt) && (wt = de(wt, ee + (!wt.key || St && St.key === wt.key ? "" : ("" + wt.key).replace(Ke, "$&/") + "/") + D)), P.push(wt)), 1;
    if (St = 0, ve = ve === "" ? "." : ve + ":", xe(D)) for (var yt = 0; yt < D.length; yt++) {
      kt = D[yt];
      var xt = ve + te(kt, yt);
      St += Ae(kt, P, ee, xt, wt);
    }
    else if (xt = Y(D), typeof xt == "function") for (D = xt.call(D), yt = 0; !(kt = D.next()).done; ) kt = kt.value, xt = ve + te(kt, yt++), St += Ae(kt, P, ee, xt, wt);
    else if (kt === "object") throw P = String(D), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(D).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
    return St;
  }
  function at(D, P, ee) {
    if (D == null) return D;
    var ve = [], wt = 0;
    return Ae(D, ve, "", "", function(kt) {
      return P.call(ee, kt, wt++);
    }), ve;
  }
  function ct(D) {
    if (D._status === -1) {
      var P = D._result;
      P = P(), P.then(function(ee) {
        (D._status === 0 || D._status === -1) && (D._status = 1, D._result = ee);
      }, function(ee) {
        (D._status === 0 || D._status === -1) && (D._status = 2, D._result = ee);
      }), D._status === -1 && (D._status = 0, D._result = P);
    }
    if (D._status === 1) return D._result.default;
    throw D._result;
  }
  var Ne = { current: null }, ye = { transition: null }, Ve = { ReactCurrentDispatcher: Ne, ReactCurrentBatchConfig: ye, ReactCurrentOwner: pe };
  function je() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Ht.Children = { map: at, forEach: function(D, P, ee) {
    at(D, function() {
      P.apply(this, arguments);
    }, ee);
  }, count: function(D) {
    var P = 0;
    return at(D, function() {
      P++;
    }), P;
  }, toArray: function(D) {
    return at(D, function(P) {
      return P;
    }) || [];
  }, only: function(D) {
    if (!Te(D)) throw Error("React.Children.only expected to receive a single React element child.");
    return D;
  } }, Ht.Component = Se, Ht.Fragment = b, Ht.Profiler = J, Ht.PureComponent = ue, Ht.StrictMode = X, Ht.Suspense = O, Ht.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ve, Ht.act = je, Ht.cloneElement = function(D, P, ee) {
    if (D == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + D + ".");
    var ve = se({}, D.props), wt = D.key, kt = D.ref, St = D._owner;
    if (P != null) {
      if (P.ref !== void 0 && (kt = P.ref, St = pe.current), P.key !== void 0 && (wt = "" + P.key), D.type && D.type.defaultProps) var yt = D.type.defaultProps;
      for (xt in P) fe.call(P, xt) && !W.hasOwnProperty(xt) && (ve[xt] = P[xt] === void 0 && yt !== void 0 ? yt[xt] : P[xt]);
    }
    var xt = arguments.length - 2;
    if (xt === 1) ve.children = ee;
    else if (1 < xt) {
      yt = Array(xt);
      for (var Bt = 0; Bt < xt; Bt++) yt[Bt] = arguments[Bt + 2];
      ve.children = yt;
    }
    return { $$typeof: x, type: D.type, key: wt, ref: kt, props: ve, _owner: St };
  }, Ht.createContext = function(D) {
    return D = { $$typeof: g, _currentValue: D, _currentValue2: D, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, D.Provider = { $$typeof: R, _context: D }, D.Consumer = D;
  }, Ht.createElement = we, Ht.createFactory = function(D) {
    var P = we.bind(null, D);
    return P.type = D, P;
  }, Ht.createRef = function() {
    return { current: null };
  }, Ht.forwardRef = function(D) {
    return { $$typeof: K, render: D };
  }, Ht.isValidElement = Te, Ht.lazy = function(D) {
    return { $$typeof: be, _payload: { _status: -1, _result: D }, _init: ct };
  }, Ht.memo = function(D, P) {
    return { $$typeof: U, type: D, compare: P === void 0 ? null : P };
  }, Ht.startTransition = function(D) {
    var P = ye.transition;
    ye.transition = {};
    try {
      D();
    } finally {
      ye.transition = P;
    }
  }, Ht.unstable_act = je, Ht.useCallback = function(D, P) {
    return Ne.current.useCallback(D, P);
  }, Ht.useContext = function(D) {
    return Ne.current.useContext(D);
  }, Ht.useDebugValue = function() {
  }, Ht.useDeferredValue = function(D) {
    return Ne.current.useDeferredValue(D);
  }, Ht.useEffect = function(D, P) {
    return Ne.current.useEffect(D, P);
  }, Ht.useId = function() {
    return Ne.current.useId();
  }, Ht.useImperativeHandle = function(D, P, ee) {
    return Ne.current.useImperativeHandle(D, P, ee);
  }, Ht.useInsertionEffect = function(D, P) {
    return Ne.current.useInsertionEffect(D, P);
  }, Ht.useLayoutEffect = function(D, P) {
    return Ne.current.useLayoutEffect(D, P);
  }, Ht.useMemo = function(D, P) {
    return Ne.current.useMemo(D, P);
  }, Ht.useReducer = function(D, P, ee) {
    return Ne.current.useReducer(D, P, ee);
  }, Ht.useRef = function(D) {
    return Ne.current.useRef(D);
  }, Ht.useState = function(D) {
    return Ne.current.useState(D);
  }, Ht.useSyncExternalStore = function(D, P, ee) {
    return Ne.current.useSyncExternalStore(D, P, ee);
  }, Ht.useTransition = function() {
    return Ne.current.useTransition();
  }, Ht.version = "18.3.1", Ht;
}
var uv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
uv.exports;
var vw;
function kj() {
  return vw || (vw = 1, function(x, S) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var b = "18.3.1", X = Symbol.for("react.element"), J = Symbol.for("react.portal"), R = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), K = Symbol.for("react.profiler"), O = Symbol.for("react.provider"), U = Symbol.for("react.context"), be = Symbol.for("react.forward_ref"), z = Symbol.for("react.suspense"), Y = Symbol.for("react.suspense_list"), ae = Symbol.for("react.memo"), se = Symbol.for("react.lazy"), re = Symbol.for("react.offscreen"), Se = Symbol.iterator, He = "@@iterator";
      function ue(h) {
        if (h === null || typeof h != "object")
          return null;
        var _ = Se && h[Se] || h[He];
        return typeof _ == "function" ? _ : null;
      }
      var _e = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, xe = {
        transition: null
      }, fe = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, pe = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, W = {}, we = null;
      function de(h) {
        we = h;
      }
      W.setExtraStackFrame = function(h) {
        we = h;
      }, W.getCurrentStack = null, W.getStackAddendum = function() {
        var h = "";
        we && (h += we);
        var _ = W.getCurrentStack;
        return _ && (h += _() || ""), h;
      };
      var Te = !1, Le = !1, Ke = !1, te = !1, Ae = !1, at = {
        ReactCurrentDispatcher: _e,
        ReactCurrentBatchConfig: xe,
        ReactCurrentOwner: pe
      };
      at.ReactDebugCurrentFrame = W, at.ReactCurrentActQueue = fe;
      function ct(h) {
        {
          for (var _ = arguments.length, Q = new Array(_ > 1 ? _ - 1 : 0), ne = 1; ne < _; ne++)
            Q[ne - 1] = arguments[ne];
          ye("warn", h, Q);
        }
      }
      function Ne(h) {
        {
          for (var _ = arguments.length, Q = new Array(_ > 1 ? _ - 1 : 0), ne = 1; ne < _; ne++)
            Q[ne - 1] = arguments[ne];
          ye("error", h, Q);
        }
      }
      function ye(h, _, Q) {
        {
          var ne = at.ReactDebugCurrentFrame, De = ne.getStackAddendum();
          De !== "" && (_ += "%s", Q = Q.concat([De]));
          var ft = Q.map(function(ze) {
            return String(ze);
          });
          ft.unshift("Warning: " + _), Function.prototype.apply.call(console[h], console, ft);
        }
      }
      var Ve = {};
      function je(h, _) {
        {
          var Q = h.constructor, ne = Q && (Q.displayName || Q.name) || "ReactClass", De = ne + "." + _;
          if (Ve[De])
            return;
          Ne("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", _, ne), Ve[De] = !0;
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
        enqueueForceUpdate: function(h, _, Q) {
          je(h, "forceUpdate");
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
        enqueueReplaceState: function(h, _, Q, ne) {
          je(h, "replaceState");
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
        enqueueSetState: function(h, _, Q, ne) {
          je(h, "setState");
        }
      }, P = Object.assign, ee = {};
      Object.freeze(ee);
      function ve(h, _, Q) {
        this.props = h, this.context = _, this.refs = ee, this.updater = Q || D;
      }
      ve.prototype.isReactComponent = {}, ve.prototype.setState = function(h, _) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, _, "setState");
      }, ve.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var wt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, kt = function(h, _) {
          Object.defineProperty(ve.prototype, h, {
            get: function() {
              ct("%s(...) is deprecated in plain JavaScript React classes. %s", _[0], _[1]);
            }
          });
        };
        for (var St in wt)
          wt.hasOwnProperty(St) && kt(St, wt[St]);
      }
      function yt() {
      }
      yt.prototype = ve.prototype;
      function xt(h, _, Q) {
        this.props = h, this.context = _, this.refs = ee, this.updater = Q || D;
      }
      var Bt = xt.prototype = new yt();
      Bt.constructor = xt, P(Bt, ve.prototype), Bt.isPureReactComponent = !0;
      function _n() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var Wn = Array.isArray;
      function yn(h) {
        return Wn(h);
      }
      function gn(h) {
        {
          var _ = typeof Symbol == "function" && Symbol.toStringTag, Q = _ && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return Q;
        }
      }
      function Tn(h) {
        try {
          return _t(h), !1;
        } catch {
          return !0;
        }
      }
      function _t(h) {
        return "" + h;
      }
      function En(h) {
        if (Tn(h))
          return Ne("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", gn(h)), _t(h);
      }
      function Rn(h, _, Q) {
        var ne = h.displayName;
        if (ne)
          return ne;
        var De = _.displayName || _.name || "";
        return De !== "" ? Q + "(" + De + ")" : Q;
      }
      function $n(h) {
        return h.displayName || "Context";
      }
      function kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Ne("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case R:
            return "Fragment";
          case J:
            return "Portal";
          case K:
            return "Profiler";
          case g:
            return "StrictMode";
          case z:
            return "Suspense";
          case Y:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case U:
              var _ = h;
              return $n(_) + ".Consumer";
            case O:
              var Q = h;
              return $n(Q._context) + ".Provider";
            case be:
              return Rn(h, h.render, "ForwardRef");
            case ae:
              var ne = h.displayName || null;
              return ne !== null ? ne : kn(h.type) || "Memo";
            case se: {
              var De = h, ft = De._payload, ze = De._init;
              try {
                return kn(ze(ft));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Sn = Object.prototype.hasOwnProperty, Cn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, V, Ye, Et;
      Et = {};
      function Ct(h) {
        if (Sn.call(h, "ref")) {
          var _ = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (_ && _.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function Mr(h) {
        if (Sn.call(h, "key")) {
          var _ = Object.getOwnPropertyDescriptor(h, "key").get;
          if (_ && _.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function ra(h, _) {
        var Q = function() {
          V || (V = !0, Ne("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", _));
        };
        Q.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: Q,
          configurable: !0
        });
      }
      function wa(h, _) {
        var Q = function() {
          Ye || (Ye = !0, Ne("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", _));
        };
        Q.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: Q,
          configurable: !0
        });
      }
      function Oe(h) {
        if (typeof h.ref == "string" && pe.current && h.__self && pe.current.stateNode !== h.__self) {
          var _ = kn(pe.current.type);
          Et[_] || (Ne('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', _, h.ref), Et[_] = !0);
        }
      }
      var nt = function(h, _, Q, ne, De, ft, ze) {
        var mt = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: X,
          // Built-in properties that belong on the element
          type: h,
          key: _,
          ref: Q,
          props: ze,
          // Record the component responsible for creating this element.
          _owner: ft
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
          value: ne
        }), Object.defineProperty(mt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: De
        }), Object.freeze && (Object.freeze(mt.props), Object.freeze(mt)), mt;
      };
      function ot(h, _, Q) {
        var ne, De = {}, ft = null, ze = null, mt = null, Ft = null;
        if (_ != null) {
          Ct(_) && (ze = _.ref, Oe(_)), Mr(_) && (En(_.key), ft = "" + _.key), mt = _.__self === void 0 ? null : _.__self, Ft = _.__source === void 0 ? null : _.__source;
          for (ne in _)
            Sn.call(_, ne) && !Cn.hasOwnProperty(ne) && (De[ne] = _[ne]);
        }
        var Kt = arguments.length - 2;
        if (Kt === 1)
          De.children = Q;
        else if (Kt > 1) {
          for (var bn = Array(Kt), dn = 0; dn < Kt; dn++)
            bn[dn] = arguments[dn + 2];
          Object.freeze && Object.freeze(bn), De.children = bn;
        }
        if (h && h.defaultProps) {
          var Mt = h.defaultProps;
          for (ne in Mt)
            De[ne] === void 0 && (De[ne] = Mt[ne]);
        }
        if (ft || ze) {
          var pn = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          ft && ra(De, pn), ze && wa(De, pn);
        }
        return nt(h, ft, ze, mt, Ft, pe.current, De);
      }
      function Wt(h, _) {
        var Q = nt(h.type, _, h.ref, h._self, h._source, h._owner, h.props);
        return Q;
      }
      function sn(h, _, Q) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var ne, De = P({}, h.props), ft = h.key, ze = h.ref, mt = h._self, Ft = h._source, Kt = h._owner;
        if (_ != null) {
          Ct(_) && (ze = _.ref, Kt = pe.current), Mr(_) && (En(_.key), ft = "" + _.key);
          var bn;
          h.type && h.type.defaultProps && (bn = h.type.defaultProps);
          for (ne in _)
            Sn.call(_, ne) && !Cn.hasOwnProperty(ne) && (_[ne] === void 0 && bn !== void 0 ? De[ne] = bn[ne] : De[ne] = _[ne]);
        }
        var dn = arguments.length - 2;
        if (dn === 1)
          De.children = Q;
        else if (dn > 1) {
          for (var Mt = Array(dn), pn = 0; pn < dn; pn++)
            Mt[pn] = arguments[pn + 2];
          De.children = Mt;
        }
        return nt(h.type, ft, ze, mt, Ft, Kt, De);
      }
      function jn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === X;
      }
      var cn = ".", Nn = ":";
      function ln(h) {
        var _ = /[=:]/g, Q = {
          "=": "=0",
          ":": "=2"
        }, ne = h.replace(_, function(De) {
          return Q[De];
        });
        return "$" + ne;
      }
      var qt = !1, Xt = /\/+/g;
      function Hr(h) {
        return h.replace(Xt, "$&/");
      }
      function Qn(h, _) {
        return typeof h == "object" && h !== null && h.key != null ? (En(h.key), ln("" + h.key)) : _.toString(36);
      }
      function aa(h, _, Q, ne, De) {
        var ft = typeof h;
        (ft === "undefined" || ft === "boolean") && (h = null);
        var ze = !1;
        if (h === null)
          ze = !0;
        else
          switch (ft) {
            case "string":
            case "number":
              ze = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case X:
                case J:
                  ze = !0;
              }
          }
        if (ze) {
          var mt = h, Ft = De(mt), Kt = ne === "" ? cn + Qn(mt, 0) : ne;
          if (yn(Ft)) {
            var bn = "";
            Kt != null && (bn = Hr(Kt) + "/"), aa(Ft, _, bn, "", function(td) {
              return td;
            });
          } else Ft != null && (jn(Ft) && (Ft.key && (!mt || mt.key !== Ft.key) && En(Ft.key), Ft = Wt(
            Ft,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            Q + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Ft.key && (!mt || mt.key !== Ft.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              Hr("" + Ft.key) + "/"
            ) : "") + Kt
          )), _.push(Ft));
          return 1;
        }
        var dn, Mt, pn = 0, Pn = ne === "" ? cn : ne + Nn;
        if (yn(h))
          for (var kl = 0; kl < h.length; kl++)
            dn = h[kl], Mt = Pn + Qn(dn, kl), pn += aa(dn, _, Q, Mt, De);
        else {
          var Xu = ue(h);
          if (typeof Xu == "function") {
            var qi = h;
            Xu === qi.entries && (qt || ct("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), qt = !0);
            for (var Ju = Xu.call(qi), co, ed = 0; !(co = Ju.next()).done; )
              dn = co.value, Mt = Pn + Qn(dn, ed++), pn += aa(dn, _, Q, Mt, De);
          } else if (ft === "object") {
            var dc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (dc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : dc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return pn;
      }
      function za(h, _, Q) {
        if (h == null)
          return h;
        var ne = [], De = 0;
        return aa(h, ne, "", "", function(ft) {
          return _.call(Q, ft, De++);
        }), ne;
      }
      function xi(h) {
        var _ = 0;
        return za(h, function() {
          _++;
        }), _;
      }
      function li(h, _, Q) {
        za(h, function() {
          _.apply(this, arguments);
        }, Q);
      }
      function Ei(h) {
        return za(h, function(_) {
          return _;
        }) || [];
      }
      function Ci(h) {
        if (!jn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function ia(h) {
        var _ = {
          $$typeof: U,
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
        _.Provider = {
          $$typeof: O,
          _context: _
        };
        var Q = !1, ne = !1, De = !1;
        {
          var ft = {
            $$typeof: U,
            _context: _
          };
          Object.defineProperties(ft, {
            Provider: {
              get: function() {
                return ne || (ne = !0, Ne("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), _.Provider;
              },
              set: function(ze) {
                _.Provider = ze;
              }
            },
            _currentValue: {
              get: function() {
                return _._currentValue;
              },
              set: function(ze) {
                _._currentValue = ze;
              }
            },
            _currentValue2: {
              get: function() {
                return _._currentValue2;
              },
              set: function(ze) {
                _._currentValue2 = ze;
              }
            },
            _threadCount: {
              get: function() {
                return _._threadCount;
              },
              set: function(ze) {
                _._threadCount = ze;
              }
            },
            Consumer: {
              get: function() {
                return Q || (Q = !0, Ne("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), _.Consumer;
              }
            },
            displayName: {
              get: function() {
                return _.displayName;
              },
              set: function(ze) {
                De || (ct("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ze), De = !0);
              }
            }
          }), _.Consumer = ft;
        }
        return _._currentRenderer = null, _._currentRenderer2 = null, _;
      }
      var Er = -1, Un = 0, sr = 1, la = 2;
      function zn(h) {
        if (h._status === Er) {
          var _ = h._result, Q = _();
          if (Q.then(function(ft) {
            if (h._status === Un || h._status === Er) {
              var ze = h;
              ze._status = sr, ze._result = ft;
            }
          }, function(ft) {
            if (h._status === Un || h._status === Er) {
              var ze = h;
              ze._status = la, ze._result = ft;
            }
          }), h._status === Er) {
            var ne = h;
            ne._status = Un, ne._result = Q;
          }
        }
        if (h._status === sr) {
          var De = h._result;
          return De === void 0 && Ne(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, De), "default" in De || Ne(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, De), De.default;
        } else
          throw h._result;
      }
      function Fa(h) {
        var _ = {
          // We use these fields to store the result.
          _status: Er,
          _result: h
        }, Q = {
          $$typeof: se,
          _payload: _,
          _init: zn
        };
        {
          var ne, De;
          Object.defineProperties(Q, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return ne;
              },
              set: function(ft) {
                Ne("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ne = ft, Object.defineProperty(Q, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return De;
              },
              set: function(ft) {
                Ne("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), De = ft, Object.defineProperty(Q, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return Q;
      }
      function Pa(h) {
        h != null && h.$$typeof === ae ? Ne("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Ne("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Ne("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Ne("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var _ = {
          $$typeof: be,
          render: h
        };
        {
          var Q;
          Object.defineProperty(_, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return Q;
            },
            set: function(ne) {
              Q = ne, !h.name && !h.displayName && (h.displayName = ne);
            }
          });
        }
        return _;
      }
      var T;
      T = Symbol.for("react.module.reference");
      function me(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === R || h === K || Ae || h === g || h === z || h === Y || te || h === re || Te || Le || Ke || typeof h == "object" && h !== null && (h.$$typeof === se || h.$$typeof === ae || h.$$typeof === O || h.$$typeof === U || h.$$typeof === be || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === T || h.getModuleId !== void 0));
      }
      function Me(h, _) {
        me(h) || Ne("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var Q = {
          $$typeof: ae,
          type: h,
          compare: _ === void 0 ? null : _
        };
        {
          var ne;
          Object.defineProperty(Q, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ne;
            },
            set: function(De) {
              ne = De, !h.name && !h.displayName && (h.displayName = De);
            }
          });
        }
        return Q;
      }
      function We() {
        var h = _e.current;
        return h === null && Ne(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function Nt(h) {
        var _ = We();
        if (h._context !== void 0) {
          var Q = h._context;
          Q.Consumer === h ? Ne("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : Q.Provider === h && Ne("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return _.useContext(h);
      }
      function Tt(h) {
        var _ = We();
        return _.useState(h);
      }
      function At(h, _, Q) {
        var ne = We();
        return ne.useReducer(h, _, Q);
      }
      function Z(h) {
        var _ = We();
        return _.useRef(h);
      }
      function k(h, _) {
        var Q = We();
        return Q.useEffect(h, _);
      }
      function oe(h, _) {
        var Q = We();
        return Q.useInsertionEffect(h, _);
      }
      function et(h, _) {
        var Q = We();
        return Q.useLayoutEffect(h, _);
      }
      function vt(h, _) {
        var Q = We();
        return Q.useCallback(h, _);
      }
      function zt(h, _) {
        var Q = We();
        return Q.useMemo(h, _);
      }
      function Qt(h, _, Q) {
        var ne = We();
        return ne.useImperativeHandle(h, _, Q);
      }
      function rt(h, _) {
        {
          var Q = We();
          return Q.useDebugValue(h, _);
        }
      }
      function qe() {
        var h = We();
        return h.useTransition();
      }
      function Fn(h) {
        var _ = We();
        return _.useDeferredValue(h);
      }
      function Ln() {
        var h = We();
        return h.useId();
      }
      function cr(h, _, Q) {
        var ne = We();
        return ne.useSyncExternalStore(h, _, Q);
      }
      var bi = 0, qo, Cl, oa, Qu, Br, cc, fc;
      function Xo() {
      }
      Xo.__reactDisabledLog = !0;
      function bl() {
        {
          if (bi === 0) {
            qo = console.log, Cl = console.info, oa = console.warn, Qu = console.error, Br = console.group, cc = console.groupCollapsed, fc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Xo,
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
          bi++;
        }
      }
      function _a() {
        {
          if (bi--, bi === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: P({}, h, {
                value: qo
              }),
              info: P({}, h, {
                value: Cl
              }),
              warn: P({}, h, {
                value: oa
              }),
              error: P({}, h, {
                value: Qu
              }),
              group: P({}, h, {
                value: Br
              }),
              groupCollapsed: P({}, h, {
                value: cc
              }),
              groupEnd: P({}, h, {
                value: fc
              })
            });
          }
          bi < 0 && Ne("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var oi = at.ReactCurrentDispatcher, ui;
      function Jo(h, _, Q) {
        {
          if (ui === void 0)
            try {
              throw Error();
            } catch (De) {
              var ne = De.stack.trim().match(/\n( *(at )?)/);
              ui = ne && ne[1] || "";
            }
          return `
` + ui + h;
        }
      }
      var lo = !1, wl;
      {
        var Zo = typeof WeakMap == "function" ? WeakMap : Map;
        wl = new Zo();
      }
      function eu(h, _) {
        if (!h || lo)
          return "";
        {
          var Q = wl.get(h);
          if (Q !== void 0)
            return Q;
        }
        var ne;
        lo = !0;
        var De = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var ft;
        ft = oi.current, oi.current = null, bl();
        try {
          if (_) {
            var ze = function() {
              throw Error();
            };
            if (Object.defineProperty(ze.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ze, []);
              } catch (Pn) {
                ne = Pn;
              }
              Reflect.construct(h, [], ze);
            } else {
              try {
                ze.call();
              } catch (Pn) {
                ne = Pn;
              }
              h.call(ze.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Pn) {
              ne = Pn;
            }
            h();
          }
        } catch (Pn) {
          if (Pn && ne && typeof Pn.stack == "string") {
            for (var mt = Pn.stack.split(`
`), Ft = ne.stack.split(`
`), Kt = mt.length - 1, bn = Ft.length - 1; Kt >= 1 && bn >= 0 && mt[Kt] !== Ft[bn]; )
              bn--;
            for (; Kt >= 1 && bn >= 0; Kt--, bn--)
              if (mt[Kt] !== Ft[bn]) {
                if (Kt !== 1 || bn !== 1)
                  do
                    if (Kt--, bn--, bn < 0 || mt[Kt] !== Ft[bn]) {
                      var dn = `
` + mt[Kt].replace(" at new ", " at ");
                      return h.displayName && dn.includes("<anonymous>") && (dn = dn.replace("<anonymous>", h.displayName)), typeof h == "function" && wl.set(h, dn), dn;
                    }
                  while (Kt >= 1 && bn >= 0);
                break;
              }
          }
        } finally {
          lo = !1, oi.current = ft, _a(), Error.prepareStackTrace = De;
        }
        var Mt = h ? h.displayName || h.name : "", pn = Mt ? Jo(Mt) : "";
        return typeof h == "function" && wl.set(h, pn), pn;
      }
      function Gi(h, _, Q) {
        return eu(h, !1);
      }
      function Jf(h) {
        var _ = h.prototype;
        return !!(_ && _.isReactComponent);
      }
      function Ki(h, _, Q) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return eu(h, Jf(h));
        if (typeof h == "string")
          return Jo(h);
        switch (h) {
          case z:
            return Jo("Suspense");
          case Y:
            return Jo("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case be:
              return Gi(h.render);
            case ae:
              return Ki(h.type, _, Q);
            case se: {
              var ne = h, De = ne._payload, ft = ne._init;
              try {
                return Ki(ft(De), _, Q);
              } catch {
              }
            }
          }
        return "";
      }
      var Zt = {}, tu = at.ReactDebugCurrentFrame;
      function Gt(h) {
        if (h) {
          var _ = h._owner, Q = Ki(h.type, h._source, _ ? _.type : null);
          tu.setExtraStackFrame(Q);
        } else
          tu.setExtraStackFrame(null);
      }
      function Gu(h, _, Q, ne, De) {
        {
          var ft = Function.call.bind(Sn);
          for (var ze in h)
            if (ft(h, ze)) {
              var mt = void 0;
              try {
                if (typeof h[ze] != "function") {
                  var Ft = Error((ne || "React class") + ": " + Q + " type `" + ze + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[ze] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Ft.name = "Invariant Violation", Ft;
                }
                mt = h[ze](_, ze, ne, Q, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Kt) {
                mt = Kt;
              }
              mt && !(mt instanceof Error) && (Gt(De), Ne("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ne || "React class", Q, ze, typeof mt), Gt(null)), mt instanceof Error && !(mt.message in Zt) && (Zt[mt.message] = !0, Gt(De), Ne("Failed %s type: %s", Q, mt.message), Gt(null));
            }
        }
      }
      function wi(h) {
        if (h) {
          var _ = h._owner, Q = Ki(h.type, h._source, _ ? _.type : null);
          de(Q);
        } else
          de(null);
      }
      var jt;
      jt = !1;
      function nu() {
        if (pe.current) {
          var h = kn(pe.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function Cr(h) {
        if (h !== void 0) {
          var _ = h.fileName.replace(/^.*[\\\/]/, ""), Q = h.lineNumber;
          return `

Check your code at ` + _ + ":" + Q + ".";
        }
        return "";
      }
      function _i(h) {
        return h != null ? Cr(h.__source) : "";
      }
      var Vr = {};
      function Ti(h) {
        var _ = nu();
        if (!_) {
          var Q = typeof h == "string" ? h : h.displayName || h.name;
          Q && (_ = `

Check the top-level render call using <` + Q + ">.");
        }
        return _;
      }
      function Dn(h, _) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var Q = Ti(_);
          if (!Vr[Q]) {
            Vr[Q] = !0;
            var ne = "";
            h && h._owner && h._owner !== pe.current && (ne = " It was passed a child from " + kn(h._owner.type) + "."), wi(h), Ne('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Q, ne), wi(null);
          }
        }
      }
      function fn(h, _) {
        if (typeof h == "object") {
          if (yn(h))
            for (var Q = 0; Q < h.length; Q++) {
              var ne = h[Q];
              jn(ne) && Dn(ne, _);
            }
          else if (jn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var De = ue(h);
            if (typeof De == "function" && De !== h.entries)
              for (var ft = De.call(h), ze; !(ze = ft.next()).done; )
                jn(ze.value) && Dn(ze.value, _);
          }
        }
      }
      function _l(h) {
        {
          var _ = h.type;
          if (_ == null || typeof _ == "string")
            return;
          var Q;
          if (typeof _ == "function")
            Q = _.propTypes;
          else if (typeof _ == "object" && (_.$$typeof === be || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          _.$$typeof === ae))
            Q = _.propTypes;
          else
            return;
          if (Q) {
            var ne = kn(_);
            Gu(Q, h.props, "prop", ne, h);
          } else if (_.PropTypes !== void 0 && !jt) {
            jt = !0;
            var De = kn(_);
            Ne("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", De || "Unknown");
          }
          typeof _.getDefaultProps == "function" && !_.getDefaultProps.isReactClassApproved && Ne("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function fr(h) {
        {
          for (var _ = Object.keys(h.props), Q = 0; Q < _.length; Q++) {
            var ne = _[Q];
            if (ne !== "children" && ne !== "key") {
              wi(h), Ne("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ne), wi(null);
              break;
            }
          }
          h.ref !== null && (wi(h), Ne("Invalid attribute `ref` supplied to `React.Fragment`."), wi(null));
        }
      }
      function Ir(h, _, Q) {
        var ne = me(h);
        if (!ne) {
          var De = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (De += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ft = _i(_);
          ft ? De += ft : De += nu();
          var ze;
          h === null ? ze = "null" : yn(h) ? ze = "array" : h !== void 0 && h.$$typeof === X ? (ze = "<" + (kn(h.type) || "Unknown") + " />", De = " Did you accidentally export a JSX literal instead of a component?") : ze = typeof h, Ne("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ze, De);
        }
        var mt = ot.apply(this, arguments);
        if (mt == null)
          return mt;
        if (ne)
          for (var Ft = 2; Ft < arguments.length; Ft++)
            fn(arguments[Ft], h);
        return h === R ? fr(mt) : _l(mt), mt;
      }
      var Ha = !1;
      function oo(h) {
        var _ = Ir.bind(null, h);
        return _.type = h, Ha || (Ha = !0, ct("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(_, "type", {
          enumerable: !1,
          get: function() {
            return ct("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), _;
      }
      function Ku(h, _, Q) {
        for (var ne = sn.apply(this, arguments), De = 2; De < arguments.length; De++)
          fn(arguments[De], ne.type);
        return _l(ne), ne;
      }
      function qu(h, _) {
        var Q = xe.transition;
        xe.transition = {};
        var ne = xe.transition;
        xe.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (xe.transition = Q, Q === null && ne._updatedFibers) {
            var De = ne._updatedFibers.size;
            De > 10 && ct("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), ne._updatedFibers.clear();
          }
        }
      }
      var Tl = !1, uo = null;
      function Zf(h) {
        if (uo === null)
          try {
            var _ = ("require" + Math.random()).slice(0, 7), Q = x && x[_];
            uo = Q.call(x, "timers").setImmediate;
          } catch {
            uo = function(De) {
              Tl === !1 && (Tl = !0, typeof MessageChannel > "u" && Ne("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var ft = new MessageChannel();
              ft.port1.onmessage = De, ft.port2.postMessage(void 0);
            };
          }
        return uo(h);
      }
      var Ba = 0, si = !1;
      function Ri(h) {
        {
          var _ = Ba;
          Ba++, fe.current === null && (fe.current = []);
          var Q = fe.isBatchingLegacy, ne;
          try {
            if (fe.isBatchingLegacy = !0, ne = h(), !Q && fe.didScheduleLegacyUpdate) {
              var De = fe.current;
              De !== null && (fe.didScheduleLegacyUpdate = !1, Rl(De));
            }
          } catch (Mt) {
            throw Va(_), Mt;
          } finally {
            fe.isBatchingLegacy = Q;
          }
          if (ne !== null && typeof ne == "object" && typeof ne.then == "function") {
            var ft = ne, ze = !1, mt = {
              then: function(Mt, pn) {
                ze = !0, ft.then(function(Pn) {
                  Va(_), Ba === 0 ? ru(Pn, Mt, pn) : Mt(Pn);
                }, function(Pn) {
                  Va(_), pn(Pn);
                });
              }
            };
            return !si && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ze || (si = !0, Ne("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), mt;
          } else {
            var Ft = ne;
            if (Va(_), Ba === 0) {
              var Kt = fe.current;
              Kt !== null && (Rl(Kt), fe.current = null);
              var bn = {
                then: function(Mt, pn) {
                  fe.current === null ? (fe.current = [], ru(Ft, Mt, pn)) : Mt(Ft);
                }
              };
              return bn;
            } else {
              var dn = {
                then: function(Mt, pn) {
                  Mt(Ft);
                }
              };
              return dn;
            }
          }
        }
      }
      function Va(h) {
        h !== Ba - 1 && Ne("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Ba = h;
      }
      function ru(h, _, Q) {
        {
          var ne = fe.current;
          if (ne !== null)
            try {
              Rl(ne), Zf(function() {
                ne.length === 0 ? (fe.current = null, _(h)) : ru(h, _, Q);
              });
            } catch (De) {
              Q(De);
            }
          else
            _(h);
        }
      }
      var au = !1;
      function Rl(h) {
        if (!au) {
          au = !0;
          var _ = 0;
          try {
            for (; _ < h.length; _++) {
              var Q = h[_];
              do
                Q = Q(!0);
              while (Q !== null);
            }
            h.length = 0;
          } catch (ne) {
            throw h = h.slice(_ + 1), ne;
          } finally {
            au = !1;
          }
        }
      }
      var so = Ir, iu = Ku, lu = oo, ci = {
        map: za,
        forEach: li,
        count: xi,
        toArray: Ei,
        only: Ci
      };
      S.Children = ci, S.Component = ve, S.Fragment = R, S.Profiler = K, S.PureComponent = xt, S.StrictMode = g, S.Suspense = z, S.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = at, S.act = Ri, S.cloneElement = iu, S.createContext = ia, S.createElement = so, S.createFactory = lu, S.createRef = _n, S.forwardRef = Pa, S.isValidElement = jn, S.lazy = Fa, S.memo = Me, S.startTransition = qu, S.unstable_act = Ri, S.useCallback = vt, S.useContext = Nt, S.useDebugValue = rt, S.useDeferredValue = Fn, S.useEffect = k, S.useId = Ln, S.useImperativeHandle = Qt, S.useInsertionEffect = oe, S.useLayoutEffect = et, S.useMemo = zt, S.useReducer = At, S.useRef = Z, S.useState = Tt, S.useSyncExternalStore = cr, S.useTransition = qe, S.version = b, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(uv, uv.exports)), uv.exports;
}
process.env.NODE_ENV === "production" ? jx.exports = Rj() : jx.exports = kj();
var N = jx.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mw;
function jj() {
  if (mw) return rv;
  mw = 1;
  var x = N, S = Symbol.for("react.element"), b = Symbol.for("react.fragment"), X = Object.prototype.hasOwnProperty, J = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(K, O, U) {
    var be, z = {}, Y = null, ae = null;
    U !== void 0 && (Y = "" + U), O.key !== void 0 && (Y = "" + O.key), O.ref !== void 0 && (ae = O.ref);
    for (be in O) X.call(O, be) && !R.hasOwnProperty(be) && (z[be] = O[be]);
    if (K && K.defaultProps) for (be in O = K.defaultProps, O) z[be] === void 0 && (z[be] = O[be]);
    return { $$typeof: S, type: K, key: Y, ref: ae, props: z, _owner: J.current };
  }
  return rv.Fragment = b, rv.jsx = g, rv.jsxs = g, rv;
}
var av = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hw;
function Nj() {
  return hw || (hw = 1, process.env.NODE_ENV !== "production" && function() {
    var x = N, S = Symbol.for("react.element"), b = Symbol.for("react.portal"), X = Symbol.for("react.fragment"), J = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), K = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), be = Symbol.for("react.suspense_list"), z = Symbol.for("react.memo"), Y = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), se = Symbol.iterator, re = "@@iterator";
    function Se(T) {
      if (T === null || typeof T != "object")
        return null;
      var me = se && T[se] || T[re];
      return typeof me == "function" ? me : null;
    }
    var He = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ue(T) {
      {
        for (var me = arguments.length, Me = new Array(me > 1 ? me - 1 : 0), We = 1; We < me; We++)
          Me[We - 1] = arguments[We];
        _e("error", T, Me);
      }
    }
    function _e(T, me, Me) {
      {
        var We = He.ReactDebugCurrentFrame, Nt = We.getStackAddendum();
        Nt !== "" && (me += "%s", Me = Me.concat([Nt]));
        var Tt = Me.map(function(At) {
          return String(At);
        });
        Tt.unshift("Warning: " + me), Function.prototype.apply.call(console[T], console, Tt);
      }
    }
    var xe = !1, fe = !1, pe = !1, W = !1, we = !1, de;
    de = Symbol.for("react.module.reference");
    function Te(T) {
      return !!(typeof T == "string" || typeof T == "function" || T === X || T === R || we || T === J || T === U || T === be || W || T === ae || xe || fe || pe || typeof T == "object" && T !== null && (T.$$typeof === Y || T.$$typeof === z || T.$$typeof === g || T.$$typeof === K || T.$$typeof === O || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      T.$$typeof === de || T.getModuleId !== void 0));
    }
    function Le(T, me, Me) {
      var We = T.displayName;
      if (We)
        return We;
      var Nt = me.displayName || me.name || "";
      return Nt !== "" ? Me + "(" + Nt + ")" : Me;
    }
    function Ke(T) {
      return T.displayName || "Context";
    }
    function te(T) {
      if (T == null)
        return null;
      if (typeof T.tag == "number" && ue("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof T == "function")
        return T.displayName || T.name || null;
      if (typeof T == "string")
        return T;
      switch (T) {
        case X:
          return "Fragment";
        case b:
          return "Portal";
        case R:
          return "Profiler";
        case J:
          return "StrictMode";
        case U:
          return "Suspense";
        case be:
          return "SuspenseList";
      }
      if (typeof T == "object")
        switch (T.$$typeof) {
          case K:
            var me = T;
            return Ke(me) + ".Consumer";
          case g:
            var Me = T;
            return Ke(Me._context) + ".Provider";
          case O:
            return Le(T, T.render, "ForwardRef");
          case z:
            var We = T.displayName || null;
            return We !== null ? We : te(T.type) || "Memo";
          case Y: {
            var Nt = T, Tt = Nt._payload, At = Nt._init;
            try {
              return te(At(Tt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Ae = Object.assign, at = 0, ct, Ne, ye, Ve, je, D, P;
    function ee() {
    }
    ee.__reactDisabledLog = !0;
    function ve() {
      {
        if (at === 0) {
          ct = console.log, Ne = console.info, ye = console.warn, Ve = console.error, je = console.group, D = console.groupCollapsed, P = console.groupEnd;
          var T = {
            configurable: !0,
            enumerable: !0,
            value: ee,
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
        at++;
      }
    }
    function wt() {
      {
        if (at--, at === 0) {
          var T = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ae({}, T, {
              value: ct
            }),
            info: Ae({}, T, {
              value: Ne
            }),
            warn: Ae({}, T, {
              value: ye
            }),
            error: Ae({}, T, {
              value: Ve
            }),
            group: Ae({}, T, {
              value: je
            }),
            groupCollapsed: Ae({}, T, {
              value: D
            }),
            groupEnd: Ae({}, T, {
              value: P
            })
          });
        }
        at < 0 && ue("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var kt = He.ReactCurrentDispatcher, St;
    function yt(T, me, Me) {
      {
        if (St === void 0)
          try {
            throw Error();
          } catch (Nt) {
            var We = Nt.stack.trim().match(/\n( *(at )?)/);
            St = We && We[1] || "";
          }
        return `
` + St + T;
      }
    }
    var xt = !1, Bt;
    {
      var _n = typeof WeakMap == "function" ? WeakMap : Map;
      Bt = new _n();
    }
    function Wn(T, me) {
      if (!T || xt)
        return "";
      {
        var Me = Bt.get(T);
        if (Me !== void 0)
          return Me;
      }
      var We;
      xt = !0;
      var Nt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Tt;
      Tt = kt.current, kt.current = null, ve();
      try {
        if (me) {
          var At = function() {
            throw Error();
          };
          if (Object.defineProperty(At.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(At, []);
            } catch (rt) {
              We = rt;
            }
            Reflect.construct(T, [], At);
          } else {
            try {
              At.call();
            } catch (rt) {
              We = rt;
            }
            T.call(At.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (rt) {
            We = rt;
          }
          T();
        }
      } catch (rt) {
        if (rt && We && typeof rt.stack == "string") {
          for (var Z = rt.stack.split(`
`), k = We.stack.split(`
`), oe = Z.length - 1, et = k.length - 1; oe >= 1 && et >= 0 && Z[oe] !== k[et]; )
            et--;
          for (; oe >= 1 && et >= 0; oe--, et--)
            if (Z[oe] !== k[et]) {
              if (oe !== 1 || et !== 1)
                do
                  if (oe--, et--, et < 0 || Z[oe] !== k[et]) {
                    var vt = `
` + Z[oe].replace(" at new ", " at ");
                    return T.displayName && vt.includes("<anonymous>") && (vt = vt.replace("<anonymous>", T.displayName)), typeof T == "function" && Bt.set(T, vt), vt;
                  }
                while (oe >= 1 && et >= 0);
              break;
            }
        }
      } finally {
        xt = !1, kt.current = Tt, wt(), Error.prepareStackTrace = Nt;
      }
      var zt = T ? T.displayName || T.name : "", Qt = zt ? yt(zt) : "";
      return typeof T == "function" && Bt.set(T, Qt), Qt;
    }
    function yn(T, me, Me) {
      return Wn(T, !1);
    }
    function gn(T) {
      var me = T.prototype;
      return !!(me && me.isReactComponent);
    }
    function Tn(T, me, Me) {
      if (T == null)
        return "";
      if (typeof T == "function")
        return Wn(T, gn(T));
      if (typeof T == "string")
        return yt(T);
      switch (T) {
        case U:
          return yt("Suspense");
        case be:
          return yt("SuspenseList");
      }
      if (typeof T == "object")
        switch (T.$$typeof) {
          case O:
            return yn(T.render);
          case z:
            return Tn(T.type, me, Me);
          case Y: {
            var We = T, Nt = We._payload, Tt = We._init;
            try {
              return Tn(Tt(Nt), me, Me);
            } catch {
            }
          }
        }
      return "";
    }
    var _t = Object.prototype.hasOwnProperty, En = {}, Rn = He.ReactDebugCurrentFrame;
    function $n(T) {
      if (T) {
        var me = T._owner, Me = Tn(T.type, T._source, me ? me.type : null);
        Rn.setExtraStackFrame(Me);
      } else
        Rn.setExtraStackFrame(null);
    }
    function kn(T, me, Me, We, Nt) {
      {
        var Tt = Function.call.bind(_t);
        for (var At in T)
          if (Tt(T, At)) {
            var Z = void 0;
            try {
              if (typeof T[At] != "function") {
                var k = Error((We || "React class") + ": " + Me + " type `" + At + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof T[At] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw k.name = "Invariant Violation", k;
              }
              Z = T[At](me, At, We, Me, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (oe) {
              Z = oe;
            }
            Z && !(Z instanceof Error) && ($n(Nt), ue("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", We || "React class", Me, At, typeof Z), $n(null)), Z instanceof Error && !(Z.message in En) && (En[Z.message] = !0, $n(Nt), ue("Failed %s type: %s", Me, Z.message), $n(null));
          }
      }
    }
    var Sn = Array.isArray;
    function Cn(T) {
      return Sn(T);
    }
    function V(T) {
      {
        var me = typeof Symbol == "function" && Symbol.toStringTag, Me = me && T[Symbol.toStringTag] || T.constructor.name || "Object";
        return Me;
      }
    }
    function Ye(T) {
      try {
        return Et(T), !1;
      } catch {
        return !0;
      }
    }
    function Et(T) {
      return "" + T;
    }
    function Ct(T) {
      if (Ye(T))
        return ue("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", V(T)), Et(T);
    }
    var Mr = He.ReactCurrentOwner, ra = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, wa, Oe;
    function nt(T) {
      if (_t.call(T, "ref")) {
        var me = Object.getOwnPropertyDescriptor(T, "ref").get;
        if (me && me.isReactWarning)
          return !1;
      }
      return T.ref !== void 0;
    }
    function ot(T) {
      if (_t.call(T, "key")) {
        var me = Object.getOwnPropertyDescriptor(T, "key").get;
        if (me && me.isReactWarning)
          return !1;
      }
      return T.key !== void 0;
    }
    function Wt(T, me) {
      typeof T.ref == "string" && Mr.current;
    }
    function sn(T, me) {
      {
        var Me = function() {
          wa || (wa = !0, ue("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", me));
        };
        Me.isReactWarning = !0, Object.defineProperty(T, "key", {
          get: Me,
          configurable: !0
        });
      }
    }
    function jn(T, me) {
      {
        var Me = function() {
          Oe || (Oe = !0, ue("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", me));
        };
        Me.isReactWarning = !0, Object.defineProperty(T, "ref", {
          get: Me,
          configurable: !0
        });
      }
    }
    var cn = function(T, me, Me, We, Nt, Tt, At) {
      var Z = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: S,
        // Built-in properties that belong on the element
        type: T,
        key: me,
        ref: Me,
        props: At,
        // Record the component responsible for creating this element.
        _owner: Tt
      };
      return Z._store = {}, Object.defineProperty(Z._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Z, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: We
      }), Object.defineProperty(Z, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Nt
      }), Object.freeze && (Object.freeze(Z.props), Object.freeze(Z)), Z;
    };
    function Nn(T, me, Me, We, Nt) {
      {
        var Tt, At = {}, Z = null, k = null;
        Me !== void 0 && (Ct(Me), Z = "" + Me), ot(me) && (Ct(me.key), Z = "" + me.key), nt(me) && (k = me.ref, Wt(me, Nt));
        for (Tt in me)
          _t.call(me, Tt) && !ra.hasOwnProperty(Tt) && (At[Tt] = me[Tt]);
        if (T && T.defaultProps) {
          var oe = T.defaultProps;
          for (Tt in oe)
            At[Tt] === void 0 && (At[Tt] = oe[Tt]);
        }
        if (Z || k) {
          var et = typeof T == "function" ? T.displayName || T.name || "Unknown" : T;
          Z && sn(At, et), k && jn(At, et);
        }
        return cn(T, Z, k, Nt, We, Mr.current, At);
      }
    }
    var ln = He.ReactCurrentOwner, qt = He.ReactDebugCurrentFrame;
    function Xt(T) {
      if (T) {
        var me = T._owner, Me = Tn(T.type, T._source, me ? me.type : null);
        qt.setExtraStackFrame(Me);
      } else
        qt.setExtraStackFrame(null);
    }
    var Hr;
    Hr = !1;
    function Qn(T) {
      return typeof T == "object" && T !== null && T.$$typeof === S;
    }
    function aa() {
      {
        if (ln.current) {
          var T = te(ln.current.type);
          if (T)
            return `

Check the render method of \`` + T + "`.";
        }
        return "";
      }
    }
    function za(T) {
      return "";
    }
    var xi = {};
    function li(T) {
      {
        var me = aa();
        if (!me) {
          var Me = typeof T == "string" ? T : T.displayName || T.name;
          Me && (me = `

Check the top-level render call using <` + Me + ">.");
        }
        return me;
      }
    }
    function Ei(T, me) {
      {
        if (!T._store || T._store.validated || T.key != null)
          return;
        T._store.validated = !0;
        var Me = li(me);
        if (xi[Me])
          return;
        xi[Me] = !0;
        var We = "";
        T && T._owner && T._owner !== ln.current && (We = " It was passed a child from " + te(T._owner.type) + "."), Xt(T), ue('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Me, We), Xt(null);
      }
    }
    function Ci(T, me) {
      {
        if (typeof T != "object")
          return;
        if (Cn(T))
          for (var Me = 0; Me < T.length; Me++) {
            var We = T[Me];
            Qn(We) && Ei(We, me);
          }
        else if (Qn(T))
          T._store && (T._store.validated = !0);
        else if (T) {
          var Nt = Se(T);
          if (typeof Nt == "function" && Nt !== T.entries)
            for (var Tt = Nt.call(T), At; !(At = Tt.next()).done; )
              Qn(At.value) && Ei(At.value, me);
        }
      }
    }
    function ia(T) {
      {
        var me = T.type;
        if (me == null || typeof me == "string")
          return;
        var Me;
        if (typeof me == "function")
          Me = me.propTypes;
        else if (typeof me == "object" && (me.$$typeof === O || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        me.$$typeof === z))
          Me = me.propTypes;
        else
          return;
        if (Me) {
          var We = te(me);
          kn(Me, T.props, "prop", We, T);
        } else if (me.PropTypes !== void 0 && !Hr) {
          Hr = !0;
          var Nt = te(me);
          ue("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Nt || "Unknown");
        }
        typeof me.getDefaultProps == "function" && !me.getDefaultProps.isReactClassApproved && ue("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Er(T) {
      {
        for (var me = Object.keys(T.props), Me = 0; Me < me.length; Me++) {
          var We = me[Me];
          if (We !== "children" && We !== "key") {
            Xt(T), ue("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", We), Xt(null);
            break;
          }
        }
        T.ref !== null && (Xt(T), ue("Invalid attribute `ref` supplied to `React.Fragment`."), Xt(null));
      }
    }
    var Un = {};
    function sr(T, me, Me, We, Nt, Tt) {
      {
        var At = Te(T);
        if (!At) {
          var Z = "";
          (T === void 0 || typeof T == "object" && T !== null && Object.keys(T).length === 0) && (Z += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var k = za();
          k ? Z += k : Z += aa();
          var oe;
          T === null ? oe = "null" : Cn(T) ? oe = "array" : T !== void 0 && T.$$typeof === S ? (oe = "<" + (te(T.type) || "Unknown") + " />", Z = " Did you accidentally export a JSX literal instead of a component?") : oe = typeof T, ue("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", oe, Z);
        }
        var et = Nn(T, me, Me, Nt, Tt);
        if (et == null)
          return et;
        if (At) {
          var vt = me.children;
          if (vt !== void 0)
            if (We)
              if (Cn(vt)) {
                for (var zt = 0; zt < vt.length; zt++)
                  Ci(vt[zt], T);
                Object.freeze && Object.freeze(vt);
              } else
                ue("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ci(vt, T);
        }
        if (_t.call(me, "key")) {
          var Qt = te(T), rt = Object.keys(me).filter(function(Ln) {
            return Ln !== "key";
          }), qe = rt.length > 0 ? "{key: someKey, " + rt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Un[Qt + qe]) {
            var Fn = rt.length > 0 ? "{" + rt.join(": ..., ") + ": ...}" : "{}";
            ue(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, qe, Qt, Fn, Qt), Un[Qt + qe] = !0;
          }
        }
        return T === X ? Er(et) : ia(et), et;
      }
    }
    function la(T, me, Me) {
      return sr(T, me, Me, !0);
    }
    function zn(T, me, Me) {
      return sr(T, me, Me, !1);
    }
    var Fa = zn, Pa = la;
    av.Fragment = X, av.jsx = Fa, av.jsxs = Pa;
  }()), av;
}
process.env.NODE_ENV === "production" ? kx.exports = jj() : kx.exports = Nj();
var c = kx.exports, Nx = { exports: {} }, ai = {}, ey = { exports: {} }, Cx = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yw;
function Dj() {
  return yw || (yw = 1, function(x) {
    function S(ye, Ve) {
      var je = ye.length;
      ye.push(Ve);
      e: for (; 0 < je; ) {
        var D = je - 1 >>> 1, P = ye[D];
        if (0 < J(P, Ve)) ye[D] = Ve, ye[je] = P, je = D;
        else break e;
      }
    }
    function b(ye) {
      return ye.length === 0 ? null : ye[0];
    }
    function X(ye) {
      if (ye.length === 0) return null;
      var Ve = ye[0], je = ye.pop();
      if (je !== Ve) {
        ye[0] = je;
        e: for (var D = 0, P = ye.length, ee = P >>> 1; D < ee; ) {
          var ve = 2 * (D + 1) - 1, wt = ye[ve], kt = ve + 1, St = ye[kt];
          if (0 > J(wt, je)) kt < P && 0 > J(St, wt) ? (ye[D] = St, ye[kt] = je, D = kt) : (ye[D] = wt, ye[ve] = je, D = ve);
          else if (kt < P && 0 > J(St, je)) ye[D] = St, ye[kt] = je, D = kt;
          else break e;
        }
      }
      return Ve;
    }
    function J(ye, Ve) {
      var je = ye.sortIndex - Ve.sortIndex;
      return je !== 0 ? je : ye.id - Ve.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var R = performance;
      x.unstable_now = function() {
        return R.now();
      };
    } else {
      var g = Date, K = g.now();
      x.unstable_now = function() {
        return g.now() - K;
      };
    }
    var O = [], U = [], be = 1, z = null, Y = 3, ae = !1, se = !1, re = !1, Se = typeof setTimeout == "function" ? setTimeout : null, He = typeof clearTimeout == "function" ? clearTimeout : null, ue = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function _e(ye) {
      for (var Ve = b(U); Ve !== null; ) {
        if (Ve.callback === null) X(U);
        else if (Ve.startTime <= ye) X(U), Ve.sortIndex = Ve.expirationTime, S(O, Ve);
        else break;
        Ve = b(U);
      }
    }
    function xe(ye) {
      if (re = !1, _e(ye), !se) if (b(O) !== null) se = !0, ct(fe);
      else {
        var Ve = b(U);
        Ve !== null && Ne(xe, Ve.startTime - ye);
      }
    }
    function fe(ye, Ve) {
      se = !1, re && (re = !1, He(we), we = -1), ae = !0;
      var je = Y;
      try {
        for (_e(Ve), z = b(O); z !== null && (!(z.expirationTime > Ve) || ye && !Le()); ) {
          var D = z.callback;
          if (typeof D == "function") {
            z.callback = null, Y = z.priorityLevel;
            var P = D(z.expirationTime <= Ve);
            Ve = x.unstable_now(), typeof P == "function" ? z.callback = P : z === b(O) && X(O), _e(Ve);
          } else X(O);
          z = b(O);
        }
        if (z !== null) var ee = !0;
        else {
          var ve = b(U);
          ve !== null && Ne(xe, ve.startTime - Ve), ee = !1;
        }
        return ee;
      } finally {
        z = null, Y = je, ae = !1;
      }
    }
    var pe = !1, W = null, we = -1, de = 5, Te = -1;
    function Le() {
      return !(x.unstable_now() - Te < de);
    }
    function Ke() {
      if (W !== null) {
        var ye = x.unstable_now();
        Te = ye;
        var Ve = !0;
        try {
          Ve = W(!0, ye);
        } finally {
          Ve ? te() : (pe = !1, W = null);
        }
      } else pe = !1;
    }
    var te;
    if (typeof ue == "function") te = function() {
      ue(Ke);
    };
    else if (typeof MessageChannel < "u") {
      var Ae = new MessageChannel(), at = Ae.port2;
      Ae.port1.onmessage = Ke, te = function() {
        at.postMessage(null);
      };
    } else te = function() {
      Se(Ke, 0);
    };
    function ct(ye) {
      W = ye, pe || (pe = !0, te());
    }
    function Ne(ye, Ve) {
      we = Se(function() {
        ye(x.unstable_now());
      }, Ve);
    }
    x.unstable_IdlePriority = 5, x.unstable_ImmediatePriority = 1, x.unstable_LowPriority = 4, x.unstable_NormalPriority = 3, x.unstable_Profiling = null, x.unstable_UserBlockingPriority = 2, x.unstable_cancelCallback = function(ye) {
      ye.callback = null;
    }, x.unstable_continueExecution = function() {
      se || ae || (se = !0, ct(fe));
    }, x.unstable_forceFrameRate = function(ye) {
      0 > ye || 125 < ye ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : de = 0 < ye ? Math.floor(1e3 / ye) : 5;
    }, x.unstable_getCurrentPriorityLevel = function() {
      return Y;
    }, x.unstable_getFirstCallbackNode = function() {
      return b(O);
    }, x.unstable_next = function(ye) {
      switch (Y) {
        case 1:
        case 2:
        case 3:
          var Ve = 3;
          break;
        default:
          Ve = Y;
      }
      var je = Y;
      Y = Ve;
      try {
        return ye();
      } finally {
        Y = je;
      }
    }, x.unstable_pauseExecution = function() {
    }, x.unstable_requestPaint = function() {
    }, x.unstable_runWithPriority = function(ye, Ve) {
      switch (ye) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          ye = 3;
      }
      var je = Y;
      Y = ye;
      try {
        return Ve();
      } finally {
        Y = je;
      }
    }, x.unstable_scheduleCallback = function(ye, Ve, je) {
      var D = x.unstable_now();
      switch (typeof je == "object" && je !== null ? (je = je.delay, je = typeof je == "number" && 0 < je ? D + je : D) : je = D, ye) {
        case 1:
          var P = -1;
          break;
        case 2:
          P = 250;
          break;
        case 5:
          P = 1073741823;
          break;
        case 4:
          P = 1e4;
          break;
        default:
          P = 5e3;
      }
      return P = je + P, ye = { id: be++, callback: Ve, priorityLevel: ye, startTime: je, expirationTime: P, sortIndex: -1 }, je > D ? (ye.sortIndex = je, S(U, ye), b(O) === null && ye === b(U) && (re ? (He(we), we = -1) : re = !0, Ne(xe, je - D))) : (ye.sortIndex = P, S(O, ye), se || ae || (se = !0, ct(fe))), ye;
    }, x.unstable_shouldYield = Le, x.unstable_wrapCallback = function(ye) {
      var Ve = Y;
      return function() {
        var je = Y;
        Y = Ve;
        try {
          return ye.apply(this, arguments);
        } finally {
          Y = je;
        }
      };
    };
  }(Cx)), Cx;
}
var bx = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gw;
function Oj() {
  return gw || (gw = 1, function(x) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var S = !1, b = 5;
      function X(Oe, nt) {
        var ot = Oe.length;
        Oe.push(nt), g(Oe, nt, ot);
      }
      function J(Oe) {
        return Oe.length === 0 ? null : Oe[0];
      }
      function R(Oe) {
        if (Oe.length === 0)
          return null;
        var nt = Oe[0], ot = Oe.pop();
        return ot !== nt && (Oe[0] = ot, K(Oe, ot, 0)), nt;
      }
      function g(Oe, nt, ot) {
        for (var Wt = ot; Wt > 0; ) {
          var sn = Wt - 1 >>> 1, jn = Oe[sn];
          if (O(jn, nt) > 0)
            Oe[sn] = nt, Oe[Wt] = jn, Wt = sn;
          else
            return;
        }
      }
      function K(Oe, nt, ot) {
        for (var Wt = ot, sn = Oe.length, jn = sn >>> 1; Wt < jn; ) {
          var cn = (Wt + 1) * 2 - 1, Nn = Oe[cn], ln = cn + 1, qt = Oe[ln];
          if (O(Nn, nt) < 0)
            ln < sn && O(qt, Nn) < 0 ? (Oe[Wt] = qt, Oe[ln] = nt, Wt = ln) : (Oe[Wt] = Nn, Oe[cn] = nt, Wt = cn);
          else if (ln < sn && O(qt, nt) < 0)
            Oe[Wt] = qt, Oe[ln] = nt, Wt = ln;
          else
            return;
        }
      }
      function O(Oe, nt) {
        var ot = Oe.sortIndex - nt.sortIndex;
        return ot !== 0 ? ot : Oe.id - nt.id;
      }
      var U = 1, be = 2, z = 3, Y = 4, ae = 5;
      function se(Oe, nt) {
      }
      var re = typeof performance == "object" && typeof performance.now == "function";
      if (re) {
        var Se = performance;
        x.unstable_now = function() {
          return Se.now();
        };
      } else {
        var He = Date, ue = He.now();
        x.unstable_now = function() {
          return He.now() - ue;
        };
      }
      var _e = 1073741823, xe = -1, fe = 250, pe = 5e3, W = 1e4, we = _e, de = [], Te = [], Le = 1, Ke = null, te = z, Ae = !1, at = !1, ct = !1, Ne = typeof setTimeout == "function" ? setTimeout : null, ye = typeof clearTimeout == "function" ? clearTimeout : null, Ve = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function je(Oe) {
        for (var nt = J(Te); nt !== null; ) {
          if (nt.callback === null)
            R(Te);
          else if (nt.startTime <= Oe)
            R(Te), nt.sortIndex = nt.expirationTime, X(de, nt);
          else
            return;
          nt = J(Te);
        }
      }
      function D(Oe) {
        if (ct = !1, je(Oe), !at)
          if (J(de) !== null)
            at = !0, Et(P);
          else {
            var nt = J(Te);
            nt !== null && Ct(D, nt.startTime - Oe);
          }
      }
      function P(Oe, nt) {
        at = !1, ct && (ct = !1, Mr()), Ae = !0;
        var ot = te;
        try {
          var Wt;
          if (!S) return ee(Oe, nt);
        } finally {
          Ke = null, te = ot, Ae = !1;
        }
      }
      function ee(Oe, nt) {
        var ot = nt;
        for (je(ot), Ke = J(de); Ke !== null && !(Ke.expirationTime > ot && (!Oe || Rn())); ) {
          var Wt = Ke.callback;
          if (typeof Wt == "function") {
            Ke.callback = null, te = Ke.priorityLevel;
            var sn = Ke.expirationTime <= ot, jn = Wt(sn);
            ot = x.unstable_now(), typeof jn == "function" ? Ke.callback = jn : Ke === J(de) && R(de), je(ot);
          } else
            R(de);
          Ke = J(de);
        }
        if (Ke !== null)
          return !0;
        var cn = J(Te);
        return cn !== null && Ct(D, cn.startTime - ot), !1;
      }
      function ve(Oe, nt) {
        switch (Oe) {
          case U:
          case be:
          case z:
          case Y:
          case ae:
            break;
          default:
            Oe = z;
        }
        var ot = te;
        te = Oe;
        try {
          return nt();
        } finally {
          te = ot;
        }
      }
      function wt(Oe) {
        var nt;
        switch (te) {
          case U:
          case be:
          case z:
            nt = z;
            break;
          default:
            nt = te;
            break;
        }
        var ot = te;
        te = nt;
        try {
          return Oe();
        } finally {
          te = ot;
        }
      }
      function kt(Oe) {
        var nt = te;
        return function() {
          var ot = te;
          te = nt;
          try {
            return Oe.apply(this, arguments);
          } finally {
            te = ot;
          }
        };
      }
      function St(Oe, nt, ot) {
        var Wt = x.unstable_now(), sn;
        if (typeof ot == "object" && ot !== null) {
          var jn = ot.delay;
          typeof jn == "number" && jn > 0 ? sn = Wt + jn : sn = Wt;
        } else
          sn = Wt;
        var cn;
        switch (Oe) {
          case U:
            cn = xe;
            break;
          case be:
            cn = fe;
            break;
          case ae:
            cn = we;
            break;
          case Y:
            cn = W;
            break;
          case z:
          default:
            cn = pe;
            break;
        }
        var Nn = sn + cn, ln = {
          id: Le++,
          callback: nt,
          priorityLevel: Oe,
          startTime: sn,
          expirationTime: Nn,
          sortIndex: -1
        };
        return sn > Wt ? (ln.sortIndex = sn, X(Te, ln), J(de) === null && ln === J(Te) && (ct ? Mr() : ct = !0, Ct(D, sn - Wt))) : (ln.sortIndex = Nn, X(de, ln), !at && !Ae && (at = !0, Et(P))), ln;
      }
      function yt() {
      }
      function xt() {
        !at && !Ae && (at = !0, Et(P));
      }
      function Bt() {
        return J(de);
      }
      function _n(Oe) {
        Oe.callback = null;
      }
      function Wn() {
        return te;
      }
      var yn = !1, gn = null, Tn = -1, _t = b, En = -1;
      function Rn() {
        var Oe = x.unstable_now() - En;
        return !(Oe < _t);
      }
      function $n() {
      }
      function kn(Oe) {
        if (Oe < 0 || Oe > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        Oe > 0 ? _t = Math.floor(1e3 / Oe) : _t = b;
      }
      var Sn = function() {
        if (gn !== null) {
          var Oe = x.unstable_now();
          En = Oe;
          var nt = !0, ot = !0;
          try {
            ot = gn(nt, Oe);
          } finally {
            ot ? Cn() : (yn = !1, gn = null);
          }
        } else
          yn = !1;
      }, Cn;
      if (typeof Ve == "function")
        Cn = function() {
          Ve(Sn);
        };
      else if (typeof MessageChannel < "u") {
        var V = new MessageChannel(), Ye = V.port2;
        V.port1.onmessage = Sn, Cn = function() {
          Ye.postMessage(null);
        };
      } else
        Cn = function() {
          Ne(Sn, 0);
        };
      function Et(Oe) {
        gn = Oe, yn || (yn = !0, Cn());
      }
      function Ct(Oe, nt) {
        Tn = Ne(function() {
          Oe(x.unstable_now());
        }, nt);
      }
      function Mr() {
        ye(Tn), Tn = -1;
      }
      var ra = $n, wa = null;
      x.unstable_IdlePriority = ae, x.unstable_ImmediatePriority = U, x.unstable_LowPriority = Y, x.unstable_NormalPriority = z, x.unstable_Profiling = wa, x.unstable_UserBlockingPriority = be, x.unstable_cancelCallback = _n, x.unstable_continueExecution = xt, x.unstable_forceFrameRate = kn, x.unstable_getCurrentPriorityLevel = Wn, x.unstable_getFirstCallbackNode = Bt, x.unstable_next = wt, x.unstable_pauseExecution = yt, x.unstable_requestPaint = ra, x.unstable_runWithPriority = ve, x.unstable_scheduleCallback = St, x.unstable_shouldYield = Rn, x.unstable_wrapCallback = kt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(bx)), bx;
}
var Sw;
function jw() {
  return Sw || (Sw = 1, process.env.NODE_ENV === "production" ? ey.exports = Dj() : ey.exports = Oj()), ey.exports;
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
var xw;
function Lj() {
  if (xw) return ai;
  xw = 1;
  var x = N, S = jw();
  function b(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var X = /* @__PURE__ */ new Set(), J = {};
  function R(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (J[n] = r, n = 0; n < r.length; n++) X.add(r[n]);
  }
  var K = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), O = Object.prototype.hasOwnProperty, U = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, be = {}, z = {};
  function Y(n) {
    return O.call(z, n) ? !0 : O.call(be, n) ? !1 : U.test(n) ? z[n] = !0 : (be[n] = !0, !1);
  }
  function ae(n, r, l, u) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return u ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function se(n, r, l, u) {
    if (r === null || typeof r > "u" || ae(n, r, l, u)) return !0;
    if (u) return !1;
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
  function re(n, r, l, u, f, p, y) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = u, this.attributeNamespace = f, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = p, this.removeEmptyString = y;
  }
  var Se = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Se[n] = new re(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Se[r] = new re(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Se[n] = new re(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Se[n] = new re(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Se[n] = new re(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Se[n] = new re(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Se[n] = new re(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Se[n] = new re(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Se[n] = new re(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var He = /[\-:]([a-z])/g;
  function ue(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      He,
      ue
    );
    Se[r] = new re(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(He, ue);
    Se[r] = new re(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(He, ue);
    Se[r] = new re(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Se[n] = new re(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Se.xlinkHref = new re("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Se[n] = new re(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function _e(n, r, l, u) {
    var f = Se.hasOwnProperty(r) ? Se[r] : null;
    (f !== null ? f.type !== 0 : u || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (se(r, l, f, u) && (l = null), u || f === null ? Y(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : f.mustUseProperty ? n[f.propertyName] = l === null ? f.type === 3 ? !1 : "" : l : (r = f.attributeName, u = f.attributeNamespace, l === null ? n.removeAttribute(r) : (f = f.type, l = f === 3 || f === 4 && l === !0 ? "" : "" + l, u ? n.setAttributeNS(u, r, l) : n.setAttribute(r, l))));
  }
  var xe = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, fe = Symbol.for("react.element"), pe = Symbol.for("react.portal"), W = Symbol.for("react.fragment"), we = Symbol.for("react.strict_mode"), de = Symbol.for("react.profiler"), Te = Symbol.for("react.provider"), Le = Symbol.for("react.context"), Ke = Symbol.for("react.forward_ref"), te = Symbol.for("react.suspense"), Ae = Symbol.for("react.suspense_list"), at = Symbol.for("react.memo"), ct = Symbol.for("react.lazy"), Ne = Symbol.for("react.offscreen"), ye = Symbol.iterator;
  function Ve(n) {
    return n === null || typeof n != "object" ? null : (n = ye && n[ye] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var je = Object.assign, D;
  function P(n) {
    if (D === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      D = r && r[1] || "";
    }
    return `
` + D + n;
  }
  var ee = !1;
  function ve(n, r) {
    if (!n || ee) return "";
    ee = !0;
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
        } catch (G) {
          var u = G;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (G) {
          u = G;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (G) {
          u = G;
        }
        n();
      }
    } catch (G) {
      if (G && u && typeof G.stack == "string") {
        for (var f = G.stack.split(`
`), p = u.stack.split(`
`), y = f.length - 1, w = p.length - 1; 1 <= y && 0 <= w && f[y] !== p[w]; ) w--;
        for (; 1 <= y && 0 <= w; y--, w--) if (f[y] !== p[w]) {
          if (y !== 1 || w !== 1)
            do
              if (y--, w--, 0 > w || f[y] !== p[w]) {
                var j = `
` + f[y].replace(" at new ", " at ");
                return n.displayName && j.includes("<anonymous>") && (j = j.replace("<anonymous>", n.displayName)), j;
              }
            while (1 <= y && 0 <= w);
          break;
        }
      }
    } finally {
      ee = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? P(n) : "";
  }
  function wt(n) {
    switch (n.tag) {
      case 5:
        return P(n.type);
      case 16:
        return P("Lazy");
      case 13:
        return P("Suspense");
      case 19:
        return P("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = ve(n.type, !1), n;
      case 11:
        return n = ve(n.type.render, !1), n;
      case 1:
        return n = ve(n.type, !0), n;
      default:
        return "";
    }
  }
  function kt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case W:
        return "Fragment";
      case pe:
        return "Portal";
      case de:
        return "Profiler";
      case we:
        return "StrictMode";
      case te:
        return "Suspense";
      case Ae:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Le:
        return (n.displayName || "Context") + ".Consumer";
      case Te:
        return (n._context.displayName || "Context") + ".Provider";
      case Ke:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case at:
        return r = n.displayName || null, r !== null ? r : kt(n.type) || "Memo";
      case ct:
        r = n._payload, n = n._init;
        try {
          return kt(n(r));
        } catch {
        }
    }
    return null;
  }
  function St(n) {
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
        return kt(r);
      case 8:
        return r === we ? "StrictMode" : "Mode";
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
  function yt(n) {
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
  function xt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Bt(n) {
    var r = xt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), u = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var f = l.get, p = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return f.call(this);
      }, set: function(y) {
        u = "" + y, p.call(this, y);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return u;
      }, setValue: function(y) {
        u = "" + y;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function _n(n) {
    n._valueTracker || (n._valueTracker = Bt(n));
  }
  function Wn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), u = "";
    return n && (u = xt(n) ? n.checked ? "true" : "false" : n.value), n = u, n !== l ? (r.setValue(n), !0) : !1;
  }
  function yn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function gn(n, r) {
    var l = r.checked;
    return je({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Tn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, u = r.checked != null ? r.checked : r.defaultChecked;
    l = yt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: u, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function _t(n, r) {
    r = r.checked, r != null && _e(n, "checked", r, !1);
  }
  function En(n, r) {
    _t(n, r);
    var l = yt(r.value), u = r.type;
    if (l != null) u === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (u === "submit" || u === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? $n(n, r.type, l) : r.hasOwnProperty("defaultValue") && $n(n, r.type, yt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Rn(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var u = r.type;
      if (!(u !== "submit" && u !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function $n(n, r, l) {
    (r !== "number" || yn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var kn = Array.isArray;
  function Sn(n, r, l, u) {
    if (n = n.options, r) {
      r = {};
      for (var f = 0; f < l.length; f++) r["$" + l[f]] = !0;
      for (l = 0; l < n.length; l++) f = r.hasOwnProperty("$" + n[l].value), n[l].selected !== f && (n[l].selected = f), f && u && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + yt(l), r = null, f = 0; f < n.length; f++) {
        if (n[f].value === l) {
          n[f].selected = !0, u && (n[f].defaultSelected = !0);
          return;
        }
        r !== null || n[f].disabled || (r = n[f]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Cn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(b(91));
    return je({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function V(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(b(92));
        if (kn(l)) {
          if (1 < l.length) throw Error(b(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: yt(l) };
  }
  function Ye(n, r) {
    var l = yt(r.value), u = yt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), u != null && (n.defaultValue = "" + u);
  }
  function Et(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Ct(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Mr(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Ct(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ra, wa = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, u, f) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, u, f);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ra = ra || document.createElement("div"), ra.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ra.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function Oe(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var nt = {
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
  }, ot = ["Webkit", "ms", "Moz", "O"];
  Object.keys(nt).forEach(function(n) {
    ot.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), nt[r] = nt[n];
    });
  });
  function Wt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || nt.hasOwnProperty(n) && nt[n] ? ("" + r).trim() : r + "px";
  }
  function sn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var u = l.indexOf("--") === 0, f = Wt(l, r[l], u);
      l === "float" && (l = "cssFloat"), u ? n.setProperty(l, f) : n[l] = f;
    }
  }
  var jn = je({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function cn(n, r) {
    if (r) {
      if (jn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(b(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(b(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(b(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(b(62));
    }
  }
  function Nn(n, r) {
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
  var ln = null;
  function qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Xt = null, Hr = null, Qn = null;
  function aa(n) {
    if (n = ut(n)) {
      if (typeof Xt != "function") throw Error(b(280));
      var r = n.stateNode;
      r && (r = Hn(r), Xt(n.stateNode, n.type, r));
    }
  }
  function za(n) {
    Hr ? Qn ? Qn.push(n) : Qn = [n] : Hr = n;
  }
  function xi() {
    if (Hr) {
      var n = Hr, r = Qn;
      if (Qn = Hr = null, aa(n), r) for (n = 0; n < r.length; n++) aa(r[n]);
    }
  }
  function li(n, r) {
    return n(r);
  }
  function Ei() {
  }
  var Ci = !1;
  function ia(n, r, l) {
    if (Ci) return n(r, l);
    Ci = !0;
    try {
      return li(n, r, l);
    } finally {
      Ci = !1, (Hr !== null || Qn !== null) && (Ei(), xi());
    }
  }
  function Er(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var u = Hn(l);
    if (u === null) return null;
    l = u[r];
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
        (u = !u.disabled) || (n = n.type, u = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !u;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(b(231, r, typeof l));
    return l;
  }
  var Un = !1;
  if (K) try {
    var sr = {};
    Object.defineProperty(sr, "passive", { get: function() {
      Un = !0;
    } }), window.addEventListener("test", sr, sr), window.removeEventListener("test", sr, sr);
  } catch {
    Un = !1;
  }
  function la(n, r, l, u, f, p, y, w, j) {
    var G = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, G);
    } catch (Ee) {
      this.onError(Ee);
    }
  }
  var zn = !1, Fa = null, Pa = !1, T = null, me = { onError: function(n) {
    zn = !0, Fa = n;
  } };
  function Me(n, r, l, u, f, p, y, w, j) {
    zn = !1, Fa = null, la.apply(me, arguments);
  }
  function We(n, r, l, u, f, p, y, w, j) {
    if (Me.apply(this, arguments), zn) {
      if (zn) {
        var G = Fa;
        zn = !1, Fa = null;
      } else throw Error(b(198));
      Pa || (Pa = !0, T = G);
    }
  }
  function Nt(n) {
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
  function Tt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function At(n) {
    if (Nt(n) !== n) throw Error(b(188));
  }
  function Z(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Nt(n), r === null) throw Error(b(188));
      return r !== n ? null : n;
    }
    for (var l = n, u = r; ; ) {
      var f = l.return;
      if (f === null) break;
      var p = f.alternate;
      if (p === null) {
        if (u = f.return, u !== null) {
          l = u;
          continue;
        }
        break;
      }
      if (f.child === p.child) {
        for (p = f.child; p; ) {
          if (p === l) return At(f), n;
          if (p === u) return At(f), r;
          p = p.sibling;
        }
        throw Error(b(188));
      }
      if (l.return !== u.return) l = f, u = p;
      else {
        for (var y = !1, w = f.child; w; ) {
          if (w === l) {
            y = !0, l = f, u = p;
            break;
          }
          if (w === u) {
            y = !0, u = f, l = p;
            break;
          }
          w = w.sibling;
        }
        if (!y) {
          for (w = p.child; w; ) {
            if (w === l) {
              y = !0, l = p, u = f;
              break;
            }
            if (w === u) {
              y = !0, u = p, l = f;
              break;
            }
            w = w.sibling;
          }
          if (!y) throw Error(b(189));
        }
      }
      if (l.alternate !== u) throw Error(b(190));
    }
    if (l.tag !== 3) throw Error(b(188));
    return l.stateNode.current === l ? n : r;
  }
  function k(n) {
    return n = Z(n), n !== null ? oe(n) : null;
  }
  function oe(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = oe(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var et = S.unstable_scheduleCallback, vt = S.unstable_cancelCallback, zt = S.unstable_shouldYield, Qt = S.unstable_requestPaint, rt = S.unstable_now, qe = S.unstable_getCurrentPriorityLevel, Fn = S.unstable_ImmediatePriority, Ln = S.unstable_UserBlockingPriority, cr = S.unstable_NormalPriority, bi = S.unstable_LowPriority, qo = S.unstable_IdlePriority, Cl = null, oa = null;
  function Qu(n) {
    if (oa && typeof oa.onCommitFiberRoot == "function") try {
      oa.onCommitFiberRoot(Cl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Br = Math.clz32 ? Math.clz32 : Xo, cc = Math.log, fc = Math.LN2;
  function Xo(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (cc(n) / fc | 0) | 0;
  }
  var bl = 64, _a = 4194304;
  function oi(n) {
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
  function ui(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var u = 0, f = n.suspendedLanes, p = n.pingedLanes, y = l & 268435455;
    if (y !== 0) {
      var w = y & ~f;
      w !== 0 ? u = oi(w) : (p &= y, p !== 0 && (u = oi(p)));
    } else y = l & ~f, y !== 0 ? u = oi(y) : p !== 0 && (u = oi(p));
    if (u === 0) return 0;
    if (r !== 0 && r !== u && !(r & f) && (f = u & -u, p = r & -r, f >= p || f === 16 && (p & 4194240) !== 0)) return r;
    if (u & 4 && (u |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= u; 0 < r; ) l = 31 - Br(r), f = 1 << l, u |= n[l], r &= ~f;
    return u;
  }
  function Jo(n, r) {
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
  function lo(n, r) {
    for (var l = n.suspendedLanes, u = n.pingedLanes, f = n.expirationTimes, p = n.pendingLanes; 0 < p; ) {
      var y = 31 - Br(p), w = 1 << y, j = f[y];
      j === -1 ? (!(w & l) || w & u) && (f[y] = Jo(w, r)) : j <= r && (n.expiredLanes |= w), p &= ~w;
    }
  }
  function wl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Zo() {
    var n = bl;
    return bl <<= 1, !(bl & 4194240) && (bl = 64), n;
  }
  function eu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Gi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Br(r), n[r] = l;
  }
  function Jf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var u = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var f = 31 - Br(l), p = 1 << f;
      r[f] = 0, u[f] = -1, n[f] = -1, l &= ~p;
    }
  }
  function Ki(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var u = 31 - Br(l), f = 1 << u;
      f & r | n[u] & r && (n[u] |= r), l &= ~f;
    }
  }
  var Zt = 0;
  function tu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Gt, Gu, wi, jt, nu, Cr = !1, _i = [], Vr = null, Ti = null, Dn = null, fn = /* @__PURE__ */ new Map(), _l = /* @__PURE__ */ new Map(), fr = [], Ir = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ha(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Vr = null;
        break;
      case "dragenter":
      case "dragleave":
        Ti = null;
        break;
      case "mouseover":
      case "mouseout":
        Dn = null;
        break;
      case "pointerover":
      case "pointerout":
        fn.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        _l.delete(r.pointerId);
    }
  }
  function oo(n, r, l, u, f, p) {
    return n === null || n.nativeEvent !== p ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: u, nativeEvent: p, targetContainers: [f] }, r !== null && (r = ut(r), r !== null && Gu(r)), n) : (n.eventSystemFlags |= u, r = n.targetContainers, f !== null && r.indexOf(f) === -1 && r.push(f), n);
  }
  function Ku(n, r, l, u, f) {
    switch (r) {
      case "focusin":
        return Vr = oo(Vr, n, r, l, u, f), !0;
      case "dragenter":
        return Ti = oo(Ti, n, r, l, u, f), !0;
      case "mouseover":
        return Dn = oo(Dn, n, r, l, u, f), !0;
      case "pointerover":
        var p = f.pointerId;
        return fn.set(p, oo(fn.get(p) || null, n, r, l, u, f)), !0;
      case "gotpointercapture":
        return p = f.pointerId, _l.set(p, oo(_l.get(p) || null, n, r, l, u, f)), !0;
    }
    return !1;
  }
  function qu(n) {
    var r = yo(n.target);
    if (r !== null) {
      var l = Nt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Tt(l), r !== null) {
            n.blockedOn = r, nu(n.priority, function() {
              wi(l);
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
  function Tl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = iu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var u = new l.constructor(l.type, l);
        ln = u, l.target.dispatchEvent(u), ln = null;
      } else return r = ut(l), r !== null && Gu(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function uo(n, r, l) {
    Tl(n) && l.delete(r);
  }
  function Zf() {
    Cr = !1, Vr !== null && Tl(Vr) && (Vr = null), Ti !== null && Tl(Ti) && (Ti = null), Dn !== null && Tl(Dn) && (Dn = null), fn.forEach(uo), _l.forEach(uo);
  }
  function Ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, Cr || (Cr = !0, S.unstable_scheduleCallback(S.unstable_NormalPriority, Zf)));
  }
  function si(n) {
    function r(f) {
      return Ba(f, n);
    }
    if (0 < _i.length) {
      Ba(_i[0], n);
      for (var l = 1; l < _i.length; l++) {
        var u = _i[l];
        u.blockedOn === n && (u.blockedOn = null);
      }
    }
    for (Vr !== null && Ba(Vr, n), Ti !== null && Ba(Ti, n), Dn !== null && Ba(Dn, n), fn.forEach(r), _l.forEach(r), l = 0; l < fr.length; l++) u = fr[l], u.blockedOn === n && (u.blockedOn = null);
    for (; 0 < fr.length && (l = fr[0], l.blockedOn === null); ) qu(l), l.blockedOn === null && fr.shift();
  }
  var Ri = xe.ReactCurrentBatchConfig, Va = !0;
  function ru(n, r, l, u) {
    var f = Zt, p = Ri.transition;
    Ri.transition = null;
    try {
      Zt = 1, Rl(n, r, l, u);
    } finally {
      Zt = f, Ri.transition = p;
    }
  }
  function au(n, r, l, u) {
    var f = Zt, p = Ri.transition;
    Ri.transition = null;
    try {
      Zt = 4, Rl(n, r, l, u);
    } finally {
      Zt = f, Ri.transition = p;
    }
  }
  function Rl(n, r, l, u) {
    if (Va) {
      var f = iu(n, r, l, u);
      if (f === null) bc(n, r, u, so, l), Ha(n, u);
      else if (Ku(f, n, r, l, u)) u.stopPropagation();
      else if (Ha(n, u), r & 4 && -1 < Ir.indexOf(n)) {
        for (; f !== null; ) {
          var p = ut(f);
          if (p !== null && Gt(p), p = iu(n, r, l, u), p === null && bc(n, r, u, so, l), p === f) break;
          f = p;
        }
        f !== null && u.stopPropagation();
      } else bc(n, r, u, null, l);
    }
  }
  var so = null;
  function iu(n, r, l, u) {
    if (so = null, n = qt(u), n = yo(n), n !== null) if (r = Nt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Tt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return so = n, null;
  }
  function lu(n) {
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
        switch (qe()) {
          case Fn:
            return 1;
          case Ln:
            return 4;
          case cr:
          case bi:
            return 16;
          case qo:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ci = null, h = null, _ = null;
  function Q() {
    if (_) return _;
    var n, r = h, l = r.length, u, f = "value" in ci ? ci.value : ci.textContent, p = f.length;
    for (n = 0; n < l && r[n] === f[n]; n++) ;
    var y = l - n;
    for (u = 1; u <= y && r[l - u] === f[p - u]; u++) ;
    return _ = f.slice(n, 1 < u ? 1 - u : void 0);
  }
  function ne(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function De() {
    return !0;
  }
  function ft() {
    return !1;
  }
  function ze(n) {
    function r(l, u, f, p, y) {
      this._reactName = l, this._targetInst = f, this.type = u, this.nativeEvent = p, this.target = y, this.currentTarget = null;
      for (var w in n) n.hasOwnProperty(w) && (l = n[w], this[w] = l ? l(p) : p[w]);
      return this.isDefaultPrevented = (p.defaultPrevented != null ? p.defaultPrevented : p.returnValue === !1) ? De : ft, this.isPropagationStopped = ft, this;
    }
    return je(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = De);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = De);
    }, persist: function() {
    }, isPersistent: De }), r;
  }
  var mt = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ft = ze(mt), Kt = je({}, mt, { view: 0, detail: 0 }), bn = ze(Kt), dn, Mt, pn, Pn = je({}, Kt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ad, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== pn && (pn && n.type === "mousemove" ? (dn = n.screenX - pn.screenX, Mt = n.screenY - pn.screenY) : Mt = dn = 0, pn = n), dn);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Mt;
  } }), kl = ze(Pn), Xu = je({}, Pn, { dataTransfer: 0 }), qi = ze(Xu), Ju = je({}, Kt, { relatedTarget: 0 }), co = ze(Ju), ed = je({}, mt, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), dc = ze(ed), td = je({}, mt, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), sv = ze(td), nd = je({}, mt, { data: 0 }), rd = ze(nd), cv = {
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
  }, fv = {
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
  }, ly = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Xi(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ly[n]) ? !!r[n] : !1;
  }
  function ad() {
    return Xi;
  }
  var id = je({}, Kt, { key: function(n) {
    if (n.key) {
      var r = cv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = ne(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? fv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ad, charCode: function(n) {
    return n.type === "keypress" ? ne(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? ne(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ld = ze(id), od = je({}, Pn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), dv = ze(od), pc = je({}, Kt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ad }), pv = ze(pc), ua = je({}, mt, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Ji = ze(ua), er = je({}, Pn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zi = ze(er), ud = [9, 13, 27, 32], ou = K && "CompositionEvent" in window, Zu = null;
  K && "documentMode" in document && (Zu = document.documentMode);
  var es = K && "TextEvent" in window && !Zu, vv = K && (!ou || Zu && 8 < Zu && 11 >= Zu), mv = " ", vc = !1;
  function hv(n, r) {
    switch (n) {
      case "keyup":
        return ud.indexOf(r.keyCode) !== -1;
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
  function yv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var uu = !1;
  function gv(n, r) {
    switch (n) {
      case "compositionend":
        return yv(r);
      case "keypress":
        return r.which !== 32 ? null : (vc = !0, mv);
      case "textInput":
        return n = r.data, n === mv && vc ? null : n;
      default:
        return null;
    }
  }
  function oy(n, r) {
    if (uu) return n === "compositionend" || !ou && hv(n, r) ? (n = Q(), _ = h = ci = null, uu = !1, n) : null;
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
        return vv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var uy = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Sv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!uy[n.type] : r === "textarea";
  }
  function sd(n, r, l, u) {
    za(u), r = ls(r, "onChange"), 0 < r.length && (l = new Ft("onChange", "change", null, l, u), n.push({ event: l, listeners: r }));
  }
  var ki = null, fo = null;
  function xv(n) {
    mo(n, 0);
  }
  function ts(n) {
    var r = di(n);
    if (Wn(r)) return n;
  }
  function sy(n, r) {
    if (n === "change") return r;
  }
  var Ev = !1;
  if (K) {
    var cd;
    if (K) {
      var fd = "oninput" in document;
      if (!fd) {
        var Cv = document.createElement("div");
        Cv.setAttribute("oninput", "return;"), fd = typeof Cv.oninput == "function";
      }
      cd = fd;
    } else cd = !1;
    Ev = cd && (!document.documentMode || 9 < document.documentMode);
  }
  function bv() {
    ki && (ki.detachEvent("onpropertychange", wv), fo = ki = null);
  }
  function wv(n) {
    if (n.propertyName === "value" && ts(fo)) {
      var r = [];
      sd(r, fo, n, qt(n)), ia(xv, r);
    }
  }
  function cy(n, r, l) {
    n === "focusin" ? (bv(), ki = r, fo = l, ki.attachEvent("onpropertychange", wv)) : n === "focusout" && bv();
  }
  function _v(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return ts(fo);
  }
  function fy(n, r) {
    if (n === "click") return ts(r);
  }
  function Tv(n, r) {
    if (n === "input" || n === "change") return ts(r);
  }
  function dy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var fi = typeof Object.is == "function" ? Object.is : dy;
  function ns(n, r) {
    if (fi(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), u = Object.keys(r);
    if (l.length !== u.length) return !1;
    for (u = 0; u < l.length; u++) {
      var f = l[u];
      if (!O.call(r, f) || !fi(n[f], r[f])) return !1;
    }
    return !0;
  }
  function Rv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function mc(n, r) {
    var l = Rv(n);
    n = 0;
    for (var u; l; ) {
      if (l.nodeType === 3) {
        if (u = n + l.textContent.length, n <= r && u >= r) return { node: l, offset: r - n };
        n = u;
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
      l = Rv(l);
    }
  }
  function jl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? jl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function rs() {
    for (var n = window, r = yn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = yn(n.document);
    }
    return r;
  }
  function hc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function su(n) {
    var r = rs(), l = n.focusedElem, u = n.selectionRange;
    if (r !== l && l && l.ownerDocument && jl(l.ownerDocument.documentElement, l)) {
      if (u !== null && hc(l)) {
        if (r = u.start, n = u.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var f = l.textContent.length, p = Math.min(u.start, f);
          u = u.end === void 0 ? p : Math.min(u.end, f), !n.extend && p > u && (f = u, u = p, p = f), f = mc(l, p);
          var y = mc(
            l,
            u
          );
          f && y && (n.rangeCount !== 1 || n.anchorNode !== f.node || n.anchorOffset !== f.offset || n.focusNode !== y.node || n.focusOffset !== y.offset) && (r = r.createRange(), r.setStart(f.node, f.offset), n.removeAllRanges(), p > u ? (n.addRange(r), n.extend(y.node, y.offset)) : (r.setEnd(y.node, y.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var py = K && "documentMode" in document && 11 >= document.documentMode, cu = null, dd = null, as = null, pd = !1;
  function vd(n, r, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    pd || cu == null || cu !== yn(u) || (u = cu, "selectionStart" in u && hc(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), as && ns(as, u) || (as = u, u = ls(dd, "onSelect"), 0 < u.length && (r = new Ft("onSelect", "select", null, r, l), n.push({ event: r, listeners: u }), r.target = cu)));
  }
  function yc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var po = { animationend: yc("Animation", "AnimationEnd"), animationiteration: yc("Animation", "AnimationIteration"), animationstart: yc("Animation", "AnimationStart"), transitionend: yc("Transition", "TransitionEnd") }, br = {}, md = {};
  K && (md = document.createElement("div").style, "AnimationEvent" in window || (delete po.animationend.animation, delete po.animationiteration.animation, delete po.animationstart.animation), "TransitionEvent" in window || delete po.transitionend.transition);
  function gc(n) {
    if (br[n]) return br[n];
    if (!po[n]) return n;
    var r = po[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in md) return br[n] = r[l];
    return n;
  }
  var kv = gc("animationend"), jv = gc("animationiteration"), Nv = gc("animationstart"), Dv = gc("transitionend"), hd = /* @__PURE__ */ new Map(), Sc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Ia(n, r) {
    hd.set(n, r), R(r, [n]);
  }
  for (var yd = 0; yd < Sc.length; yd++) {
    var vo = Sc[yd], vy = vo.toLowerCase(), my = vo[0].toUpperCase() + vo.slice(1);
    Ia(vy, "on" + my);
  }
  Ia(kv, "onAnimationEnd"), Ia(jv, "onAnimationIteration"), Ia(Nv, "onAnimationStart"), Ia("dblclick", "onDoubleClick"), Ia("focusin", "onFocus"), Ia("focusout", "onBlur"), Ia(Dv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), R("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), R("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), R("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), R("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), R("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), R("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var is = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), gd = new Set("cancel close invalid load scroll toggle".split(" ").concat(is));
  function xc(n, r, l) {
    var u = n.type || "unknown-event";
    n.currentTarget = l, We(u, r, void 0, n), n.currentTarget = null;
  }
  function mo(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var u = n[l], f = u.event;
      u = u.listeners;
      e: {
        var p = void 0;
        if (r) for (var y = u.length - 1; 0 <= y; y--) {
          var w = u[y], j = w.instance, G = w.currentTarget;
          if (w = w.listener, j !== p && f.isPropagationStopped()) break e;
          xc(f, w, G), p = j;
        }
        else for (y = 0; y < u.length; y++) {
          if (w = u[y], j = w.instance, G = w.currentTarget, w = w.listener, j !== p && f.isPropagationStopped()) break e;
          xc(f, w, G), p = j;
        }
      }
    }
    if (Pa) throw n = T, Pa = !1, T = null, n;
  }
  function on(n, r) {
    var l = r[ss];
    l === void 0 && (l = r[ss] = /* @__PURE__ */ new Set());
    var u = n + "__bubble";
    l.has(u) || (Ov(r, n, 2, !1), l.add(u));
  }
  function Ec(n, r, l) {
    var u = 0;
    r && (u |= 4), Ov(l, n, u, r);
  }
  var Cc = "_reactListening" + Math.random().toString(36).slice(2);
  function fu(n) {
    if (!n[Cc]) {
      n[Cc] = !0, X.forEach(function(l) {
        l !== "selectionchange" && (gd.has(l) || Ec(l, !1, n), Ec(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Cc] || (r[Cc] = !0, Ec("selectionchange", !1, r));
    }
  }
  function Ov(n, r, l, u) {
    switch (lu(r)) {
      case 1:
        var f = ru;
        break;
      case 4:
        f = au;
        break;
      default:
        f = Rl;
    }
    l = f.bind(null, r, l, n), f = void 0, !Un || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (f = !0), u ? f !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: f }) : n.addEventListener(r, l, !0) : f !== void 0 ? n.addEventListener(r, l, { passive: f }) : n.addEventListener(r, l, !1);
  }
  function bc(n, r, l, u, f) {
    var p = u;
    if (!(r & 1) && !(r & 2) && u !== null) e: for (; ; ) {
      if (u === null) return;
      var y = u.tag;
      if (y === 3 || y === 4) {
        var w = u.stateNode.containerInfo;
        if (w === f || w.nodeType === 8 && w.parentNode === f) break;
        if (y === 4) for (y = u.return; y !== null; ) {
          var j = y.tag;
          if ((j === 3 || j === 4) && (j = y.stateNode.containerInfo, j === f || j.nodeType === 8 && j.parentNode === f)) return;
          y = y.return;
        }
        for (; w !== null; ) {
          if (y = yo(w), y === null) return;
          if (j = y.tag, j === 5 || j === 6) {
            u = p = y;
            continue e;
          }
          w = w.parentNode;
        }
      }
      u = u.return;
    }
    ia(function() {
      var G = p, Ee = qt(l), Re = [];
      e: {
        var ge = hd.get(n);
        if (ge !== void 0) {
          var Ie = Ft, Xe = n;
          switch (n) {
            case "keypress":
              if (ne(l) === 0) break e;
            case "keydown":
            case "keyup":
              Ie = ld;
              break;
            case "focusin":
              Xe = "focus", Ie = co;
              break;
            case "focusout":
              Xe = "blur", Ie = co;
              break;
            case "beforeblur":
            case "afterblur":
              Ie = co;
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
              Ie = kl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Ie = qi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Ie = pv;
              break;
            case kv:
            case jv:
            case Nv:
              Ie = dc;
              break;
            case Dv:
              Ie = Ji;
              break;
            case "scroll":
              Ie = bn;
              break;
            case "wheel":
              Ie = Zi;
              break;
            case "copy":
            case "cut":
            case "paste":
              Ie = sv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Ie = dv;
          }
          var tt = (r & 4) !== 0, Jn = !tt && n === "scroll", F = tt ? ge !== null ? ge + "Capture" : null : ge;
          tt = [];
          for (var A = G, I; A !== null; ) {
            I = A;
            var Ce = I.stateNode;
            if (I.tag === 5 && Ce !== null && (I = Ce, F !== null && (Ce = Er(A, F), Ce != null && tt.push(du(A, Ce, I)))), Jn) break;
            A = A.return;
          }
          0 < tt.length && (ge = new Ie(ge, Xe, null, l, Ee), Re.push({ event: ge, listeners: tt }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ge = n === "mouseover" || n === "pointerover", Ie = n === "mouseout" || n === "pointerout", ge && l !== ln && (Xe = l.relatedTarget || l.fromElement) && (yo(Xe) || Xe[el])) break e;
          if ((Ie || ge) && (ge = Ee.window === Ee ? Ee : (ge = Ee.ownerDocument) ? ge.defaultView || ge.parentWindow : window, Ie ? (Xe = l.relatedTarget || l.toElement, Ie = G, Xe = Xe ? yo(Xe) : null, Xe !== null && (Jn = Nt(Xe), Xe !== Jn || Xe.tag !== 5 && Xe.tag !== 6) && (Xe = null)) : (Ie = null, Xe = G), Ie !== Xe)) {
            if (tt = kl, Ce = "onMouseLeave", F = "onMouseEnter", A = "mouse", (n === "pointerout" || n === "pointerover") && (tt = dv, Ce = "onPointerLeave", F = "onPointerEnter", A = "pointer"), Jn = Ie == null ? ge : di(Ie), I = Xe == null ? ge : di(Xe), ge = new tt(Ce, A + "leave", Ie, l, Ee), ge.target = Jn, ge.relatedTarget = I, Ce = null, yo(Ee) === G && (tt = new tt(F, A + "enter", Xe, l, Ee), tt.target = I, tt.relatedTarget = Jn, Ce = tt), Jn = Ce, Ie && Xe) t: {
              for (tt = Ie, F = Xe, A = 0, I = tt; I; I = Nl(I)) A++;
              for (I = 0, Ce = F; Ce; Ce = Nl(Ce)) I++;
              for (; 0 < A - I; ) tt = Nl(tt), A--;
              for (; 0 < I - A; ) F = Nl(F), I--;
              for (; A--; ) {
                if (tt === F || F !== null && tt === F.alternate) break t;
                tt = Nl(tt), F = Nl(F);
              }
              tt = null;
            }
            else tt = null;
            Ie !== null && Lv(Re, ge, Ie, tt, !1), Xe !== null && Jn !== null && Lv(Re, Jn, Xe, tt, !0);
          }
        }
        e: {
          if (ge = G ? di(G) : window, Ie = ge.nodeName && ge.nodeName.toLowerCase(), Ie === "select" || Ie === "input" && ge.type === "file") var Je = sy;
          else if (Sv(ge)) if (Ev) Je = Tv;
          else {
            Je = _v;
            var pt = cy;
          }
          else (Ie = ge.nodeName) && Ie.toLowerCase() === "input" && (ge.type === "checkbox" || ge.type === "radio") && (Je = fy);
          if (Je && (Je = Je(n, G))) {
            sd(Re, Je, l, Ee);
            break e;
          }
          pt && pt(n, ge, G), n === "focusout" && (pt = ge._wrapperState) && pt.controlled && ge.type === "number" && $n(ge, "number", ge.value);
        }
        switch (pt = G ? di(G) : window, n) {
          case "focusin":
            (Sv(pt) || pt.contentEditable === "true") && (cu = pt, dd = G, as = null);
            break;
          case "focusout":
            as = dd = cu = null;
            break;
          case "mousedown":
            pd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            pd = !1, vd(Re, l, Ee);
            break;
          case "selectionchange":
            if (py) break;
          case "keydown":
          case "keyup":
            vd(Re, l, Ee);
        }
        var ht;
        if (ou) e: {
          switch (n) {
            case "compositionstart":
              var Rt = "onCompositionStart";
              break e;
            case "compositionend":
              Rt = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Rt = "onCompositionUpdate";
              break e;
          }
          Rt = void 0;
        }
        else uu ? hv(n, l) && (Rt = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Rt = "onCompositionStart");
        Rt && (vv && l.locale !== "ko" && (uu || Rt !== "onCompositionStart" ? Rt === "onCompositionEnd" && uu && (ht = Q()) : (ci = Ee, h = "value" in ci ? ci.value : ci.textContent, uu = !0)), pt = ls(G, Rt), 0 < pt.length && (Rt = new rd(Rt, n, null, l, Ee), Re.push({ event: Rt, listeners: pt }), ht ? Rt.data = ht : (ht = yv(l), ht !== null && (Rt.data = ht)))), (ht = es ? gv(n, l) : oy(n, l)) && (G = ls(G, "onBeforeInput"), 0 < G.length && (Ee = new rd("onBeforeInput", "beforeinput", null, l, Ee), Re.push({ event: Ee, listeners: G }), Ee.data = ht));
      }
      mo(Re, r);
    });
  }
  function du(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function ls(n, r) {
    for (var l = r + "Capture", u = []; n !== null; ) {
      var f = n, p = f.stateNode;
      f.tag === 5 && p !== null && (f = p, p = Er(n, l), p != null && u.unshift(du(n, p, f)), p = Er(n, r), p != null && u.push(du(n, p, f))), n = n.return;
    }
    return u;
  }
  function Nl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Lv(n, r, l, u, f) {
    for (var p = r._reactName, y = []; l !== null && l !== u; ) {
      var w = l, j = w.alternate, G = w.stateNode;
      if (j !== null && j === u) break;
      w.tag === 5 && G !== null && (w = G, f ? (j = Er(l, p), j != null && y.unshift(du(l, j, w))) : f || (j = Er(l, p), j != null && y.push(du(l, j, w)))), l = l.return;
    }
    y.length !== 0 && n.push({ event: r, listeners: y });
  }
  var Av = /\r\n?/g, hy = /\u0000|\uFFFD/g;
  function Mv(n) {
    return (typeof n == "string" ? n : "" + n).replace(Av, `
`).replace(hy, "");
  }
  function wc(n, r, l) {
    if (r = Mv(r), Mv(n) !== r && l) throw Error(b(425));
  }
  function Dl() {
  }
  var os = null, ho = null;
  function _c(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, Sd = typeof clearTimeout == "function" ? clearTimeout : void 0, Uv = typeof Promise == "function" ? Promise : void 0, pu = typeof queueMicrotask == "function" ? queueMicrotask : typeof Uv < "u" ? function(n) {
    return Uv.resolve(null).then(n).catch(Rc);
  } : Tc;
  function Rc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function vu(n, r) {
    var l = r, u = 0;
    do {
      var f = l.nextSibling;
      if (n.removeChild(l), f && f.nodeType === 8) if (l = f.data, l === "/$") {
        if (u === 0) {
          n.removeChild(f), si(r);
          return;
        }
        u--;
      } else l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = f;
    } while (l);
    si(r);
  }
  function ji(n) {
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
  function zv(n) {
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
  var Ol = Math.random().toString(36).slice(2), Ni = "__reactFiber$" + Ol, us = "__reactProps$" + Ol, el = "__reactContainer$" + Ol, ss = "__reactEvents$" + Ol, mu = "__reactListeners$" + Ol, yy = "__reactHandles$" + Ol;
  function yo(n) {
    var r = n[Ni];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[el] || l[Ni]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = zv(n); n !== null; ) {
          if (l = n[Ni]) return l;
          n = zv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function ut(n) {
    return n = n[Ni] || n[el], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function di(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(b(33));
  }
  function Hn(n) {
    return n[us] || null;
  }
  var Vt = [], $a = -1;
  function Ya(n) {
    return { current: n };
  }
  function wn(n) {
    0 > $a || (n.current = Vt[$a], Vt[$a] = null, $a--);
  }
  function lt(n, r) {
    $a++, Vt[$a] = n.current, n.current = r;
  }
  var Ur = {}, Yn = Ya(Ur), dr = Ya(!1), sa = Ur;
  function ca(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Ur;
    var u = n.stateNode;
    if (u && u.__reactInternalMemoizedUnmaskedChildContext === r) return u.__reactInternalMemoizedMaskedChildContext;
    var f = {}, p;
    for (p in l) f[p] = r[p];
    return u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = f), f;
  }
  function tr(n) {
    return n = n.childContextTypes, n != null;
  }
  function hu() {
    wn(dr), wn(Yn);
  }
  function Fv(n, r, l) {
    if (Yn.current !== Ur) throw Error(b(168));
    lt(Yn, r), lt(dr, l);
  }
  function cs(n, r, l) {
    var u = n.stateNode;
    if (r = r.childContextTypes, typeof u.getChildContext != "function") return l;
    u = u.getChildContext();
    for (var f in u) if (!(f in r)) throw Error(b(108, St(n) || "Unknown", f));
    return je({}, l, u);
  }
  function hr(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Ur, sa = Yn.current, lt(Yn, n), lt(dr, dr.current), !0;
  }
  function kc(n, r, l) {
    var u = n.stateNode;
    if (!u) throw Error(b(169));
    l ? (n = cs(n, r, sa), u.__reactInternalMemoizedMergedChildContext = n, wn(dr), wn(Yn), lt(Yn, n)) : wn(dr), lt(dr, l);
  }
  var Di = null, yu = !1, tl = !1;
  function jc(n) {
    Di === null ? Di = [n] : Di.push(n);
  }
  function Ll(n) {
    yu = !0, jc(n);
  }
  function Oi() {
    if (!tl && Di !== null) {
      tl = !0;
      var n = 0, r = Zt;
      try {
        var l = Di;
        for (Zt = 1; n < l.length; n++) {
          var u = l[n];
          do
            u = u(!0);
          while (u !== null);
        }
        Di = null, yu = !1;
      } catch (f) {
        throw Di !== null && (Di = Di.slice(n + 1)), et(Fn, Oi), f;
      } finally {
        Zt = r, tl = !1;
      }
    }
    return null;
  }
  var Al = [], Ml = 0, Ul = null, nl = 0, nr = [], Wa = 0, Ta = null, Li = 1, Ai = "";
  function go(n, r) {
    Al[Ml++] = nl, Al[Ml++] = Ul, Ul = n, nl = r;
  }
  function Pv(n, r, l) {
    nr[Wa++] = Li, nr[Wa++] = Ai, nr[Wa++] = Ta, Ta = n;
    var u = Li;
    n = Ai;
    var f = 32 - Br(u) - 1;
    u &= ~(1 << f), l += 1;
    var p = 32 - Br(r) + f;
    if (30 < p) {
      var y = f - f % 5;
      p = (u & (1 << y) - 1).toString(32), u >>= y, f -= y, Li = 1 << 32 - Br(r) + f | l << f | u, Ai = p + n;
    } else Li = 1 << p | l << f | u, Ai = n;
  }
  function Nc(n) {
    n.return !== null && (go(n, 1), Pv(n, 1, 0));
  }
  function Dc(n) {
    for (; n === Ul; ) Ul = Al[--Ml], Al[Ml] = null, nl = Al[--Ml], Al[Ml] = null;
    for (; n === Ta; ) Ta = nr[--Wa], nr[Wa] = null, Ai = nr[--Wa], nr[Wa] = null, Li = nr[--Wa], nr[Wa] = null;
  }
  var fa = null, da = null, An = !1, Qa = null;
  function xd(n, r) {
    var l = Ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Hv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, fa = n, da = ji(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, fa = n, da = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = Ta !== null ? { id: Li, overflow: Ai } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, fa = n, da = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ed(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Cd(n) {
    if (An) {
      var r = da;
      if (r) {
        var l = r;
        if (!Hv(n, r)) {
          if (Ed(n)) throw Error(b(418));
          r = ji(l.nextSibling);
          var u = fa;
          r && Hv(n, r) ? xd(u, l) : (n.flags = n.flags & -4097 | 2, An = !1, fa = n);
        }
      } else {
        if (Ed(n)) throw Error(b(418));
        n.flags = n.flags & -4097 | 2, An = !1, fa = n;
      }
    }
  }
  function pr(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    fa = n;
  }
  function Oc(n) {
    if (n !== fa) return !1;
    if (!An) return pr(n), An = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !_c(n.type, n.memoizedProps)), r && (r = da)) {
      if (Ed(n)) throw fs(), Error(b(418));
      for (; r; ) xd(n, r), r = ji(r.nextSibling);
    }
    if (pr(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(b(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                da = ji(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        da = null;
      }
    } else da = fa ? ji(n.stateNode.nextSibling) : null;
    return !0;
  }
  function fs() {
    for (var n = da; n; ) n = ji(n.nextSibling);
  }
  function zl() {
    da = fa = null, An = !1;
  }
  function rl(n) {
    Qa === null ? Qa = [n] : Qa.push(n);
  }
  var gy = xe.ReactCurrentBatchConfig;
  function So(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(b(309));
          var u = l.stateNode;
        }
        if (!u) throw Error(b(147, n));
        var f = u, p = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === p ? r.ref : (r = function(y) {
          var w = f.refs;
          y === null ? delete w[p] : w[p] = y;
        }, r._stringRef = p, r);
      }
      if (typeof n != "string") throw Error(b(284));
      if (!l._owner) throw Error(b(290, n));
    }
    return n;
  }
  function Lc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(b(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Bv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function xo(n) {
    function r(F, A) {
      if (n) {
        var I = F.deletions;
        I === null ? (F.deletions = [A], F.flags |= 16) : I.push(A);
      }
    }
    function l(F, A) {
      if (!n) return null;
      for (; A !== null; ) r(F, A), A = A.sibling;
      return null;
    }
    function u(F, A) {
      for (F = /* @__PURE__ */ new Map(); A !== null; ) A.key !== null ? F.set(A.key, A) : F.set(A.index, A), A = A.sibling;
      return F;
    }
    function f(F, A) {
      return F = Yl(F, A), F.index = 0, F.sibling = null, F;
    }
    function p(F, A, I) {
      return F.index = I, n ? (I = F.alternate, I !== null ? (I = I.index, I < A ? (F.flags |= 2, A) : I) : (F.flags |= 2, A)) : (F.flags |= 1048576, A);
    }
    function y(F) {
      return n && F.alternate === null && (F.flags |= 2), F;
    }
    function w(F, A, I, Ce) {
      return A === null || A.tag !== 6 ? (A = Zd(I, F.mode, Ce), A.return = F, A) : (A = f(A, I), A.return = F, A);
    }
    function j(F, A, I, Ce) {
      var Je = I.type;
      return Je === W ? Ee(F, A, I.props.children, Ce, I.key) : A !== null && (A.elementType === Je || typeof Je == "object" && Je !== null && Je.$$typeof === ct && Bv(Je) === A.type) ? (Ce = f(A, I.props), Ce.ref = So(F, A, I), Ce.return = F, Ce) : (Ce = Bs(I.type, I.key, I.props, null, F.mode, Ce), Ce.ref = So(F, A, I), Ce.return = F, Ce);
    }
    function G(F, A, I, Ce) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== I.containerInfo || A.stateNode.implementation !== I.implementation ? (A = pf(I, F.mode, Ce), A.return = F, A) : (A = f(A, I.children || []), A.return = F, A);
    }
    function Ee(F, A, I, Ce, Je) {
      return A === null || A.tag !== 7 ? (A = sl(I, F.mode, Ce, Je), A.return = F, A) : (A = f(A, I), A.return = F, A);
    }
    function Re(F, A, I) {
      if (typeof A == "string" && A !== "" || typeof A == "number") return A = Zd("" + A, F.mode, I), A.return = F, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case fe:
            return I = Bs(A.type, A.key, A.props, null, F.mode, I), I.ref = So(F, null, A), I.return = F, I;
          case pe:
            return A = pf(A, F.mode, I), A.return = F, A;
          case ct:
            var Ce = A._init;
            return Re(F, Ce(A._payload), I);
        }
        if (kn(A) || Ve(A)) return A = sl(A, F.mode, I, null), A.return = F, A;
        Lc(F, A);
      }
      return null;
    }
    function ge(F, A, I, Ce) {
      var Je = A !== null ? A.key : null;
      if (typeof I == "string" && I !== "" || typeof I == "number") return Je !== null ? null : w(F, A, "" + I, Ce);
      if (typeof I == "object" && I !== null) {
        switch (I.$$typeof) {
          case fe:
            return I.key === Je ? j(F, A, I, Ce) : null;
          case pe:
            return I.key === Je ? G(F, A, I, Ce) : null;
          case ct:
            return Je = I._init, ge(
              F,
              A,
              Je(I._payload),
              Ce
            );
        }
        if (kn(I) || Ve(I)) return Je !== null ? null : Ee(F, A, I, Ce, null);
        Lc(F, I);
      }
      return null;
    }
    function Ie(F, A, I, Ce, Je) {
      if (typeof Ce == "string" && Ce !== "" || typeof Ce == "number") return F = F.get(I) || null, w(A, F, "" + Ce, Je);
      if (typeof Ce == "object" && Ce !== null) {
        switch (Ce.$$typeof) {
          case fe:
            return F = F.get(Ce.key === null ? I : Ce.key) || null, j(A, F, Ce, Je);
          case pe:
            return F = F.get(Ce.key === null ? I : Ce.key) || null, G(A, F, Ce, Je);
          case ct:
            var pt = Ce._init;
            return Ie(F, A, I, pt(Ce._payload), Je);
        }
        if (kn(Ce) || Ve(Ce)) return F = F.get(I) || null, Ee(A, F, Ce, Je, null);
        Lc(A, Ce);
      }
      return null;
    }
    function Xe(F, A, I, Ce) {
      for (var Je = null, pt = null, ht = A, Rt = A = 0, Sr = null; ht !== null && Rt < I.length; Rt++) {
        ht.index > Rt ? (Sr = ht, ht = null) : Sr = ht.sibling;
        var nn = ge(F, ht, I[Rt], Ce);
        if (nn === null) {
          ht === null && (ht = Sr);
          break;
        }
        n && ht && nn.alternate === null && r(F, ht), A = p(nn, A, Rt), pt === null ? Je = nn : pt.sibling = nn, pt = nn, ht = Sr;
      }
      if (Rt === I.length) return l(F, ht), An && go(F, Rt), Je;
      if (ht === null) {
        for (; Rt < I.length; Rt++) ht = Re(F, I[Rt], Ce), ht !== null && (A = p(ht, A, Rt), pt === null ? Je = ht : pt.sibling = ht, pt = ht);
        return An && go(F, Rt), Je;
      }
      for (ht = u(F, ht); Rt < I.length; Rt++) Sr = Ie(ht, F, Rt, I[Rt], Ce), Sr !== null && (n && Sr.alternate !== null && ht.delete(Sr.key === null ? Rt : Sr.key), A = p(Sr, A, Rt), pt === null ? Je = Sr : pt.sibling = Sr, pt = Sr);
      return n && ht.forEach(function(Gl) {
        return r(F, Gl);
      }), An && go(F, Rt), Je;
    }
    function tt(F, A, I, Ce) {
      var Je = Ve(I);
      if (typeof Je != "function") throw Error(b(150));
      if (I = Je.call(I), I == null) throw Error(b(151));
      for (var pt = Je = null, ht = A, Rt = A = 0, Sr = null, nn = I.next(); ht !== null && !nn.done; Rt++, nn = I.next()) {
        ht.index > Rt ? (Sr = ht, ht = null) : Sr = ht.sibling;
        var Gl = ge(F, ht, nn.value, Ce);
        if (Gl === null) {
          ht === null && (ht = Sr);
          break;
        }
        n && ht && Gl.alternate === null && r(F, ht), A = p(Gl, A, Rt), pt === null ? Je = Gl : pt.sibling = Gl, pt = Gl, ht = Sr;
      }
      if (nn.done) return l(
        F,
        ht
      ), An && go(F, Rt), Je;
      if (ht === null) {
        for (; !nn.done; Rt++, nn = I.next()) nn = Re(F, nn.value, Ce), nn !== null && (A = p(nn, A, Rt), pt === null ? Je = nn : pt.sibling = nn, pt = nn);
        return An && go(F, Rt), Je;
      }
      for (ht = u(F, ht); !nn.done; Rt++, nn = I.next()) nn = Ie(ht, F, Rt, nn.value, Ce), nn !== null && (n && nn.alternate !== null && ht.delete(nn.key === null ? Rt : nn.key), A = p(nn, A, Rt), pt === null ? Je = nn : pt.sibling = nn, pt = nn);
      return n && ht.forEach(function(bm) {
        return r(F, bm);
      }), An && go(F, Rt), Je;
    }
    function Jn(F, A, I, Ce) {
      if (typeof I == "object" && I !== null && I.type === W && I.key === null && (I = I.props.children), typeof I == "object" && I !== null) {
        switch (I.$$typeof) {
          case fe:
            e: {
              for (var Je = I.key, pt = A; pt !== null; ) {
                if (pt.key === Je) {
                  if (Je = I.type, Je === W) {
                    if (pt.tag === 7) {
                      l(F, pt.sibling), A = f(pt, I.props.children), A.return = F, F = A;
                      break e;
                    }
                  } else if (pt.elementType === Je || typeof Je == "object" && Je !== null && Je.$$typeof === ct && Bv(Je) === pt.type) {
                    l(F, pt.sibling), A = f(pt, I.props), A.ref = So(F, pt, I), A.return = F, F = A;
                    break e;
                  }
                  l(F, pt);
                  break;
                } else r(F, pt);
                pt = pt.sibling;
              }
              I.type === W ? (A = sl(I.props.children, F.mode, Ce, I.key), A.return = F, F = A) : (Ce = Bs(I.type, I.key, I.props, null, F.mode, Ce), Ce.ref = So(F, A, I), Ce.return = F, F = Ce);
            }
            return y(F);
          case pe:
            e: {
              for (pt = I.key; A !== null; ) {
                if (A.key === pt) if (A.tag === 4 && A.stateNode.containerInfo === I.containerInfo && A.stateNode.implementation === I.implementation) {
                  l(F, A.sibling), A = f(A, I.children || []), A.return = F, F = A;
                  break e;
                } else {
                  l(F, A);
                  break;
                }
                else r(F, A);
                A = A.sibling;
              }
              A = pf(I, F.mode, Ce), A.return = F, F = A;
            }
            return y(F);
          case ct:
            return pt = I._init, Jn(F, A, pt(I._payload), Ce);
        }
        if (kn(I)) return Xe(F, A, I, Ce);
        if (Ve(I)) return tt(F, A, I, Ce);
        Lc(F, I);
      }
      return typeof I == "string" && I !== "" || typeof I == "number" ? (I = "" + I, A !== null && A.tag === 6 ? (l(F, A.sibling), A = f(A, I), A.return = F, F = A) : (l(F, A), A = Zd(I, F.mode, Ce), A.return = F, F = A), y(F)) : l(F, A);
    }
    return Jn;
  }
  var Gn = xo(!0), Fe = xo(!1), Ra = Ya(null), pa = null, gu = null, bd = null;
  function wd() {
    bd = gu = pa = null;
  }
  function _d(n) {
    var r = Ra.current;
    wn(Ra), n._currentValue = r;
  }
  function Td(n, r, l) {
    for (; n !== null; ) {
      var u = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, u !== null && (u.childLanes |= r)) : u !== null && (u.childLanes & r) !== r && (u.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function Bn(n, r) {
    pa = n, bd = gu = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (ar = !0), n.firstContext = null);
  }
  function Ga(n) {
    var r = n._currentValue;
    if (bd !== n) if (n = { context: n, memoizedValue: r, next: null }, gu === null) {
      if (pa === null) throw Error(b(308));
      gu = n, pa.dependencies = { lanes: 0, firstContext: n };
    } else gu = gu.next = n;
    return r;
  }
  var Eo = null;
  function Rd(n) {
    Eo === null ? Eo = [n] : Eo.push(n);
  }
  function kd(n, r, l, u) {
    var f = r.interleaved;
    return f === null ? (l.next = l, Rd(r)) : (l.next = f.next, f.next = l), r.interleaved = l, ka(n, u);
  }
  function ka(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ja = !1;
  function jd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Vv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function al(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Fl(n, r, l) {
    var u = n.updateQueue;
    if (u === null) return null;
    if (u = u.shared, It & 2) {
      var f = u.pending;
      return f === null ? r.next = r : (r.next = f.next, f.next = r), u.pending = r, ka(n, l);
    }
    return f = u.interleaved, f === null ? (r.next = r, Rd(u)) : (r.next = f.next, f.next = r), u.interleaved = r, ka(n, l);
  }
  function Ac(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Ki(n, l);
    }
  }
  function Iv(n, r) {
    var l = n.updateQueue, u = n.alternate;
    if (u !== null && (u = u.updateQueue, l === u)) {
      var f = null, p = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var y = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          p === null ? f = p = y : p = p.next = y, l = l.next;
        } while (l !== null);
        p === null ? f = p = r : p = p.next = r;
      } else f = p = r;
      l = { baseState: u.baseState, firstBaseUpdate: f, lastBaseUpdate: p, shared: u.shared, effects: u.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function ds(n, r, l, u) {
    var f = n.updateQueue;
    ja = !1;
    var p = f.firstBaseUpdate, y = f.lastBaseUpdate, w = f.shared.pending;
    if (w !== null) {
      f.shared.pending = null;
      var j = w, G = j.next;
      j.next = null, y === null ? p = G : y.next = G, y = j;
      var Ee = n.alternate;
      Ee !== null && (Ee = Ee.updateQueue, w = Ee.lastBaseUpdate, w !== y && (w === null ? Ee.firstBaseUpdate = G : w.next = G, Ee.lastBaseUpdate = j));
    }
    if (p !== null) {
      var Re = f.baseState;
      y = 0, Ee = G = j = null, w = p;
      do {
        var ge = w.lane, Ie = w.eventTime;
        if ((u & ge) === ge) {
          Ee !== null && (Ee = Ee.next = {
            eventTime: Ie,
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          });
          e: {
            var Xe = n, tt = w;
            switch (ge = r, Ie = l, tt.tag) {
              case 1:
                if (Xe = tt.payload, typeof Xe == "function") {
                  Re = Xe.call(Ie, Re, ge);
                  break e;
                }
                Re = Xe;
                break e;
              case 3:
                Xe.flags = Xe.flags & -65537 | 128;
              case 0:
                if (Xe = tt.payload, ge = typeof Xe == "function" ? Xe.call(Ie, Re, ge) : Xe, ge == null) break e;
                Re = je({}, Re, ge);
                break e;
              case 2:
                ja = !0;
            }
          }
          w.callback !== null && w.lane !== 0 && (n.flags |= 64, ge = f.effects, ge === null ? f.effects = [w] : ge.push(w));
        } else Ie = { eventTime: Ie, lane: ge, tag: w.tag, payload: w.payload, callback: w.callback, next: null }, Ee === null ? (G = Ee = Ie, j = Re) : Ee = Ee.next = Ie, y |= ge;
        if (w = w.next, w === null) {
          if (w = f.shared.pending, w === null) break;
          ge = w, w = ge.next, ge.next = null, f.lastBaseUpdate = ge, f.shared.pending = null;
        }
      } while (!0);
      if (Ee === null && (j = Re), f.baseState = j, f.firstBaseUpdate = G, f.lastBaseUpdate = Ee, r = f.shared.interleaved, r !== null) {
        f = r;
        do
          y |= f.lane, f = f.next;
        while (f !== r);
      } else p === null && (f.shared.lanes = 0);
      Pi |= y, n.lanes = y, n.memoizedState = Re;
    }
  }
  function Nd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var u = n[r], f = u.callback;
      if (f !== null) {
        if (u.callback = null, u = l, typeof f != "function") throw Error(b(191, f));
        f.call(u);
      }
    }
  }
  var ps = {}, Mi = Ya(ps), vs = Ya(ps), ms = Ya(ps);
  function Co(n) {
    if (n === ps) throw Error(b(174));
    return n;
  }
  function Dd(n, r) {
    switch (lt(ms, r), lt(vs, n), lt(Mi, ps), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : Mr(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = Mr(r, n);
    }
    wn(Mi), lt(Mi, r);
  }
  function bo() {
    wn(Mi), wn(vs), wn(ms);
  }
  function $v(n) {
    Co(ms.current);
    var r = Co(Mi.current), l = Mr(r, n.type);
    r !== l && (lt(vs, n), lt(Mi, l));
  }
  function Mc(n) {
    vs.current === n && (wn(Mi), wn(vs));
  }
  var Vn = Ya(0);
  function Uc(n) {
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
  function st() {
    for (var n = 0; n < hs.length; n++) hs[n]._workInProgressVersionPrimary = null;
    hs.length = 0;
  }
  var Ut = xe.ReactCurrentDispatcher, en = xe.ReactCurrentBatchConfig, vn = 0, tn = null, rr = null, yr = null, zc = !1, ys = !1, wo = 0, he = 0;
  function Jt() {
    throw Error(b(321));
  }
  function gt(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!fi(n[l], r[l])) return !1;
    return !0;
  }
  function Pl(n, r, l, u, f, p) {
    if (vn = p, tn = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Ut.current = n === null || n.memoizedState === null ? Jc : bs, n = l(u, f), ys) {
      p = 0;
      do {
        if (ys = !1, wo = 0, 25 <= p) throw Error(b(301));
        p += 1, yr = rr = null, r.updateQueue = null, Ut.current = Zc, n = l(u, f);
      } while (ys);
    }
    if (Ut.current = jo, r = rr !== null && rr.next !== null, vn = 0, yr = rr = tn = null, zc = !1, r) throw Error(b(300));
    return n;
  }
  function pi() {
    var n = wo !== 0;
    return wo = 0, n;
  }
  function zr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return yr === null ? tn.memoizedState = yr = n : yr = yr.next = n, yr;
  }
  function Kn() {
    if (rr === null) {
      var n = tn.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = rr.next;
    var r = yr === null ? tn.memoizedState : yr.next;
    if (r !== null) yr = r, rr = n;
    else {
      if (n === null) throw Error(b(310));
      rr = n, n = { memoizedState: rr.memoizedState, baseState: rr.baseState, baseQueue: rr.baseQueue, queue: rr.queue, next: null }, yr === null ? tn.memoizedState = yr = n : yr = yr.next = n;
    }
    return yr;
  }
  function il(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Hl(n) {
    var r = Kn(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = rr, f = u.baseQueue, p = l.pending;
    if (p !== null) {
      if (f !== null) {
        var y = f.next;
        f.next = p.next, p.next = y;
      }
      u.baseQueue = f = p, l.pending = null;
    }
    if (f !== null) {
      p = f.next, u = u.baseState;
      var w = y = null, j = null, G = p;
      do {
        var Ee = G.lane;
        if ((vn & Ee) === Ee) j !== null && (j = j.next = { lane: 0, action: G.action, hasEagerState: G.hasEagerState, eagerState: G.eagerState, next: null }), u = G.hasEagerState ? G.eagerState : n(u, G.action);
        else {
          var Re = {
            lane: Ee,
            action: G.action,
            hasEagerState: G.hasEagerState,
            eagerState: G.eagerState,
            next: null
          };
          j === null ? (w = j = Re, y = u) : j = j.next = Re, tn.lanes |= Ee, Pi |= Ee;
        }
        G = G.next;
      } while (G !== null && G !== p);
      j === null ? y = u : j.next = w, fi(u, r.memoizedState) || (ar = !0), r.memoizedState = u, r.baseState = y, r.baseQueue = j, l.lastRenderedState = u;
    }
    if (n = l.interleaved, n !== null) {
      f = n;
      do
        p = f.lane, tn.lanes |= p, Pi |= p, f = f.next;
      while (f !== n);
    } else f === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function _o(n) {
    var r = Kn(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = l.dispatch, f = l.pending, p = r.memoizedState;
    if (f !== null) {
      l.pending = null;
      var y = f = f.next;
      do
        p = n(p, y.action), y = y.next;
      while (y !== f);
      fi(p, r.memoizedState) || (ar = !0), r.memoizedState = p, r.baseQueue === null && (r.baseState = p), l.lastRenderedState = p;
    }
    return [p, u];
  }
  function Fc() {
  }
  function Pc(n, r) {
    var l = tn, u = Kn(), f = r(), p = !fi(u.memoizedState, f);
    if (p && (u.memoizedState = f, ar = !0), u = u.queue, gs(Vc.bind(null, l, u, n), [n]), u.getSnapshot !== r || p || yr !== null && yr.memoizedState.tag & 1) {
      if (l.flags |= 2048, To(9, Bc.bind(null, l, u, f, r), void 0, null), vr === null) throw Error(b(349));
      vn & 30 || Hc(l, r, f);
    }
    return f;
  }
  function Hc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = tn.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, tn.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Bc(n, r, l, u) {
    r.value = l, r.getSnapshot = u, Ic(r) && $c(n);
  }
  function Vc(n, r, l) {
    return l(function() {
      Ic(r) && $c(n);
    });
  }
  function Ic(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !fi(n, l);
    } catch {
      return !0;
    }
  }
  function $c(n) {
    var r = ka(n, 1);
    r !== null && Qr(r, n, 1, -1);
  }
  function Yc(n) {
    var r = zr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: il, lastRenderedState: n }, r.queue = n, n = n.dispatch = ko.bind(null, tn, n), [r.memoizedState, n];
  }
  function To(n, r, l, u) {
    return n = { tag: n, create: r, destroy: l, deps: u, next: null }, r = tn.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, tn.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (u = l.next, l.next = n, n.next = u, r.lastEffect = n)), n;
  }
  function Wc() {
    return Kn().memoizedState;
  }
  function Su(n, r, l, u) {
    var f = zr();
    tn.flags |= n, f.memoizedState = To(1 | r, l, void 0, u === void 0 ? null : u);
  }
  function xu(n, r, l, u) {
    var f = Kn();
    u = u === void 0 ? null : u;
    var p = void 0;
    if (rr !== null) {
      var y = rr.memoizedState;
      if (p = y.destroy, u !== null && gt(u, y.deps)) {
        f.memoizedState = To(r, l, p, u);
        return;
      }
    }
    tn.flags |= n, f.memoizedState = To(1 | r, l, p, u);
  }
  function Qc(n, r) {
    return Su(8390656, 8, n, r);
  }
  function gs(n, r) {
    return xu(2048, 8, n, r);
  }
  function Gc(n, r) {
    return xu(4, 2, n, r);
  }
  function Ss(n, r) {
    return xu(4, 4, n, r);
  }
  function Ro(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Kc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, xu(4, 4, Ro.bind(null, r, n), l);
  }
  function xs() {
  }
  function qc(n, r) {
    var l = Kn();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && gt(r, u[1]) ? u[0] : (l.memoizedState = [n, r], n);
  }
  function Xc(n, r) {
    var l = Kn();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && gt(r, u[1]) ? u[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Od(n, r, l) {
    return vn & 21 ? (fi(l, r) || (l = Zo(), tn.lanes |= l, Pi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, ar = !0), n.memoizedState = l);
  }
  function Es(n, r) {
    var l = Zt;
    Zt = l !== 0 && 4 > l ? l : 4, n(!0);
    var u = en.transition;
    en.transition = {};
    try {
      n(!1), r();
    } finally {
      Zt = l, en.transition = u;
    }
  }
  function Ld() {
    return Kn().memoizedState;
  }
  function Cs(n, r, l) {
    var u = Hi(n);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, va(n)) Yv(r, l);
    else if (l = kd(n, r, l, u), l !== null) {
      var f = or();
      Qr(l, n, u, f), xn(l, r, u);
    }
  }
  function ko(n, r, l) {
    var u = Hi(n), f = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (va(n)) Yv(r, f);
    else {
      var p = n.alternate;
      if (n.lanes === 0 && (p === null || p.lanes === 0) && (p = r.lastRenderedReducer, p !== null)) try {
        var y = r.lastRenderedState, w = p(y, l);
        if (f.hasEagerState = !0, f.eagerState = w, fi(w, y)) {
          var j = r.interleaved;
          j === null ? (f.next = f, Rd(r)) : (f.next = j.next, j.next = f), r.interleaved = f;
          return;
        }
      } catch {
      } finally {
      }
      l = kd(n, r, f, u), l !== null && (f = or(), Qr(l, n, u, f), xn(l, r, u));
    }
  }
  function va(n) {
    var r = n.alternate;
    return n === tn || r !== null && r === tn;
  }
  function Yv(n, r) {
    ys = zc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function xn(n, r, l) {
    if (l & 4194240) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Ki(n, l);
    }
  }
  var jo = { readContext: Ga, useCallback: Jt, useContext: Jt, useEffect: Jt, useImperativeHandle: Jt, useInsertionEffect: Jt, useLayoutEffect: Jt, useMemo: Jt, useReducer: Jt, useRef: Jt, useState: Jt, useDebugValue: Jt, useDeferredValue: Jt, useTransition: Jt, useMutableSource: Jt, useSyncExternalStore: Jt, useId: Jt, unstable_isNewReconciler: !1 }, Jc = { readContext: Ga, useCallback: function(n, r) {
    return zr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ga, useEffect: Qc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Su(
      4194308,
      4,
      Ro.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return Su(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Su(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = zr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var u = zr();
    return r = l !== void 0 ? l(r) : r, u.memoizedState = u.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, u.queue = n, n = n.dispatch = Cs.bind(null, tn, n), [u.memoizedState, n];
  }, useRef: function(n) {
    var r = zr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Yc, useDebugValue: xs, useDeferredValue: function(n) {
    return zr().memoizedState = n;
  }, useTransition: function() {
    var n = Yc(!1), r = n[0];
    return n = Es.bind(null, n[1]), zr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var u = tn, f = zr();
    if (An) {
      if (l === void 0) throw Error(b(407));
      l = l();
    } else {
      if (l = r(), vr === null) throw Error(b(349));
      vn & 30 || Hc(u, r, l);
    }
    f.memoizedState = l;
    var p = { value: l, getSnapshot: r };
    return f.queue = p, Qc(Vc.bind(
      null,
      u,
      p,
      n
    ), [n]), u.flags |= 2048, To(9, Bc.bind(null, u, p, l, r), void 0, null), l;
  }, useId: function() {
    var n = zr(), r = vr.identifierPrefix;
    if (An) {
      var l = Ai, u = Li;
      l = (u & ~(1 << 32 - Br(u) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = wo++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = he++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, bs = {
    readContext: Ga,
    useCallback: qc,
    useContext: Ga,
    useEffect: gs,
    useImperativeHandle: Kc,
    useInsertionEffect: Gc,
    useLayoutEffect: Ss,
    useMemo: Xc,
    useReducer: Hl,
    useRef: Wc,
    useState: function() {
      return Hl(il);
    },
    useDebugValue: xs,
    useDeferredValue: function(n) {
      var r = Kn();
      return Od(r, rr.memoizedState, n);
    },
    useTransition: function() {
      var n = Hl(il)[0], r = Kn().memoizedState;
      return [n, r];
    },
    useMutableSource: Fc,
    useSyncExternalStore: Pc,
    useId: Ld,
    unstable_isNewReconciler: !1
  }, Zc = { readContext: Ga, useCallback: qc, useContext: Ga, useEffect: gs, useImperativeHandle: Kc, useInsertionEffect: Gc, useLayoutEffect: Ss, useMemo: Xc, useReducer: _o, useRef: Wc, useState: function() {
    return _o(il);
  }, useDebugValue: xs, useDeferredValue: function(n) {
    var r = Kn();
    return rr === null ? r.memoizedState = n : Od(r, rr.memoizedState, n);
  }, useTransition: function() {
    var n = _o(il)[0], r = Kn().memoizedState;
    return [n, r];
  }, useMutableSource: Fc, useSyncExternalStore: Pc, useId: Ld, unstable_isNewReconciler: !1 };
  function vi(n, r) {
    if (n && n.defaultProps) {
      r = je({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Ad(n, r, l, u) {
    r = n.memoizedState, l = l(u, r), l = l == null ? r : je({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var ef = { isMounted: function(n) {
    return (n = n._reactInternals) ? Nt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var u = or(), f = Hi(n), p = al(u, f);
    p.payload = r, l != null && (p.callback = l), r = Fl(n, p, f), r !== null && (Qr(r, n, f, u), Ac(r, n, f));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var u = or(), f = Hi(n), p = al(u, f);
    p.tag = 1, p.payload = r, l != null && (p.callback = l), r = Fl(n, p, f), r !== null && (Qr(r, n, f, u), Ac(r, n, f));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = or(), u = Hi(n), f = al(l, u);
    f.tag = 2, r != null && (f.callback = r), r = Fl(n, f, u), r !== null && (Qr(r, n, u, l), Ac(r, n, u));
  } };
  function Wv(n, r, l, u, f, p, y) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(u, p, y) : r.prototype && r.prototype.isPureReactComponent ? !ns(l, u) || !ns(f, p) : !0;
  }
  function tf(n, r, l) {
    var u = !1, f = Ur, p = r.contextType;
    return typeof p == "object" && p !== null ? p = Ga(p) : (f = tr(r) ? sa : Yn.current, u = r.contextTypes, p = (u = u != null) ? ca(n, f) : Ur), r = new r(l, p), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = ef, n.stateNode = r, r._reactInternals = n, u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = f, n.__reactInternalMemoizedMaskedChildContext = p), r;
  }
  function Qv(n, r, l, u) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, u), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, u), r.state !== n && ef.enqueueReplaceState(r, r.state, null);
  }
  function ws(n, r, l, u) {
    var f = n.stateNode;
    f.props = l, f.state = n.memoizedState, f.refs = {}, jd(n);
    var p = r.contextType;
    typeof p == "object" && p !== null ? f.context = Ga(p) : (p = tr(r) ? sa : Yn.current, f.context = ca(n, p)), f.state = n.memoizedState, p = r.getDerivedStateFromProps, typeof p == "function" && (Ad(n, r, p, l), f.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof f.getSnapshotBeforeUpdate == "function" || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (r = f.state, typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount(), r !== f.state && ef.enqueueReplaceState(f, f.state, null), ds(n, l, f, u), f.state = n.memoizedState), typeof f.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function No(n, r) {
    try {
      var l = "", u = r;
      do
        l += wt(u), u = u.return;
      while (u);
      var f = l;
    } catch (p) {
      f = `
Error generating stack: ` + p.message + `
` + p.stack;
    }
    return { value: n, source: r, stack: f, digest: null };
  }
  function Md(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Ud(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var nf = typeof WeakMap == "function" ? WeakMap : Map;
  function Gv(n, r, l) {
    l = al(-1, l), l.tag = 3, l.payload = { element: null };
    var u = r.value;
    return l.callback = function() {
      Tu || (Tu = !0, Lo = u), Ud(n, r);
    }, l;
  }
  function zd(n, r, l) {
    l = al(-1, l), l.tag = 3;
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var f = r.value;
      l.payload = function() {
        return u(f);
      }, l.callback = function() {
        Ud(n, r);
      };
    }
    var p = n.stateNode;
    return p !== null && typeof p.componentDidCatch == "function" && (l.callback = function() {
      Ud(n, r), typeof u != "function" && (Il === null ? Il = /* @__PURE__ */ new Set([this]) : Il.add(this));
      var y = r.stack;
      this.componentDidCatch(r.value, { componentStack: y !== null ? y : "" });
    }), l;
  }
  function Fd(n, r, l) {
    var u = n.pingCache;
    if (u === null) {
      u = n.pingCache = new nf();
      var f = /* @__PURE__ */ new Set();
      u.set(r, f);
    } else f = u.get(r), f === void 0 && (f = /* @__PURE__ */ new Set(), u.set(r, f));
    f.has(l) || (f.add(l), n = _y.bind(null, n, r, l), r.then(n, n));
  }
  function Kv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Bl(n, r, l, u, f) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = f, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = al(-1, 1), r.tag = 2, Fl(l, r, 1))), l.lanes |= 1), n);
  }
  var _s = xe.ReactCurrentOwner, ar = !1;
  function wr(n, r, l, u) {
    r.child = n === null ? Fe(r, null, l, u) : Gn(r, n.child, l, u);
  }
  function ma(n, r, l, u, f) {
    l = l.render;
    var p = r.ref;
    return Bn(r, f), u = Pl(n, r, l, u, p, f), l = pi(), n !== null && !ar ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~f, qa(n, r, f)) : (An && l && Nc(r), r.flags |= 1, wr(n, r, u, f), r.child);
  }
  function Do(n, r, l, u, f) {
    if (n === null) {
      var p = l.type;
      return typeof p == "function" && !Jd(p) && p.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = p, Lt(n, r, p, u, f)) : (n = Bs(l.type, null, u, r, r.mode, f), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (p = n.child, !(n.lanes & f)) {
      var y = p.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ns, l(y, u) && n.ref === r.ref) return qa(n, r, f);
    }
    return r.flags |= 1, n = Yl(p, u), n.ref = r.ref, n.return = r, r.child = n;
  }
  function Lt(n, r, l, u, f) {
    if (n !== null) {
      var p = n.memoizedProps;
      if (ns(p, u) && n.ref === r.ref) if (ar = !1, r.pendingProps = u = p, (n.lanes & f) !== 0) n.flags & 131072 && (ar = !0);
      else return r.lanes = n.lanes, qa(n, r, f);
    }
    return qv(n, r, l, u, f);
  }
  function Ts(n, r, l) {
    var u = r.pendingProps, f = u.children, p = n !== null ? n.memoizedState : null;
    if (u.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, lt(bu, Na), Na |= l;
    else {
      if (!(l & 1073741824)) return n = p !== null ? p.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, lt(bu, Na), Na |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = p !== null ? p.baseLanes : l, lt(bu, Na), Na |= u;
    }
    else p !== null ? (u = p.baseLanes | l, r.memoizedState = null) : u = l, lt(bu, Na), Na |= u;
    return wr(n, r, f, l), r.child;
  }
  function Pd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function qv(n, r, l, u, f) {
    var p = tr(l) ? sa : Yn.current;
    return p = ca(r, p), Bn(r, f), l = Pl(n, r, l, u, p, f), u = pi(), n !== null && !ar ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~f, qa(n, r, f)) : (An && u && Nc(r), r.flags |= 1, wr(n, r, l, f), r.child);
  }
  function Xv(n, r, l, u, f) {
    if (tr(l)) {
      var p = !0;
      hr(r);
    } else p = !1;
    if (Bn(r, f), r.stateNode === null) Ka(n, r), tf(r, l, u), ws(r, l, u, f), u = !0;
    else if (n === null) {
      var y = r.stateNode, w = r.memoizedProps;
      y.props = w;
      var j = y.context, G = l.contextType;
      typeof G == "object" && G !== null ? G = Ga(G) : (G = tr(l) ? sa : Yn.current, G = ca(r, G));
      var Ee = l.getDerivedStateFromProps, Re = typeof Ee == "function" || typeof y.getSnapshotBeforeUpdate == "function";
      Re || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== u || j !== G) && Qv(r, y, u, G), ja = !1;
      var ge = r.memoizedState;
      y.state = ge, ds(r, u, y, f), j = r.memoizedState, w !== u || ge !== j || dr.current || ja ? (typeof Ee == "function" && (Ad(r, l, Ee, u), j = r.memoizedState), (w = ja || Wv(r, l, w, u, ge, j, G)) ? (Re || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount()), typeof y.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = u, r.memoizedState = j), y.props = u, y.state = j, y.context = G, u = w) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), u = !1);
    } else {
      y = r.stateNode, Vv(n, r), w = r.memoizedProps, G = r.type === r.elementType ? w : vi(r.type, w), y.props = G, Re = r.pendingProps, ge = y.context, j = l.contextType, typeof j == "object" && j !== null ? j = Ga(j) : (j = tr(l) ? sa : Yn.current, j = ca(r, j));
      var Ie = l.getDerivedStateFromProps;
      (Ee = typeof Ie == "function" || typeof y.getSnapshotBeforeUpdate == "function") || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== Re || ge !== j) && Qv(r, y, u, j), ja = !1, ge = r.memoizedState, y.state = ge, ds(r, u, y, f);
      var Xe = r.memoizedState;
      w !== Re || ge !== Xe || dr.current || ja ? (typeof Ie == "function" && (Ad(r, l, Ie, u), Xe = r.memoizedState), (G = ja || Wv(r, l, G, u, ge, Xe, j) || !1) ? (Ee || typeof y.UNSAFE_componentWillUpdate != "function" && typeof y.componentWillUpdate != "function" || (typeof y.componentWillUpdate == "function" && y.componentWillUpdate(u, Xe, j), typeof y.UNSAFE_componentWillUpdate == "function" && y.UNSAFE_componentWillUpdate(u, Xe, j)), typeof y.componentDidUpdate == "function" && (r.flags |= 4), typeof y.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ge === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ge === n.memoizedState || (r.flags |= 1024), r.memoizedProps = u, r.memoizedState = Xe), y.props = u, y.state = Xe, y.context = j, u = G) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ge === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ge === n.memoizedState || (r.flags |= 1024), u = !1);
    }
    return Rs(n, r, l, u, p, f);
  }
  function Rs(n, r, l, u, f, p) {
    Pd(n, r);
    var y = (r.flags & 128) !== 0;
    if (!u && !y) return f && kc(r, l, !1), qa(n, r, p);
    u = r.stateNode, _s.current = r;
    var w = y && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return r.flags |= 1, n !== null && y ? (r.child = Gn(r, n.child, null, p), r.child = Gn(r, null, w, p)) : wr(n, r, w, p), r.memoizedState = u.state, f && kc(r, l, !0), r.child;
  }
  function Eu(n) {
    var r = n.stateNode;
    r.pendingContext ? Fv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Fv(n, r.context, !1), Dd(n, r.containerInfo);
  }
  function Jv(n, r, l, u, f) {
    return zl(), rl(f), r.flags |= 256, wr(n, r, l, u), r.child;
  }
  var rf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Hd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function af(n, r, l) {
    var u = r.pendingProps, f = Vn.current, p = !1, y = (r.flags & 128) !== 0, w;
    if ((w = y) || (w = n !== null && n.memoizedState === null ? !1 : (f & 2) !== 0), w ? (p = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (f |= 1), lt(Vn, f & 1), n === null)
      return Cd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (y = u.children, n = u.fallback, p ? (u = r.mode, p = r.child, y = { mode: "hidden", children: y }, !(u & 1) && p !== null ? (p.childLanes = 0, p.pendingProps = y) : p = Wl(y, u, 0, null), n = sl(n, u, l, null), p.return = r, n.return = r, p.sibling = n, r.child = p, r.child.memoizedState = Hd(l), r.memoizedState = rf, n) : Bd(r, y));
    if (f = n.memoizedState, f !== null && (w = f.dehydrated, w !== null)) return Zv(n, r, y, u, w, f, l);
    if (p) {
      p = u.fallback, y = r.mode, f = n.child, w = f.sibling;
      var j = { mode: "hidden", children: u.children };
      return !(y & 1) && r.child !== f ? (u = r.child, u.childLanes = 0, u.pendingProps = j, r.deletions = null) : (u = Yl(f, j), u.subtreeFlags = f.subtreeFlags & 14680064), w !== null ? p = Yl(w, p) : (p = sl(p, y, l, null), p.flags |= 2), p.return = r, u.return = r, u.sibling = p, r.child = u, u = p, p = r.child, y = n.child.memoizedState, y = y === null ? Hd(l) : { baseLanes: y.baseLanes | l, cachePool: null, transitions: y.transitions }, p.memoizedState = y, p.childLanes = n.childLanes & ~l, r.memoizedState = rf, u;
    }
    return p = n.child, n = p.sibling, u = Yl(p, { mode: "visible", children: u.children }), !(r.mode & 1) && (u.lanes = l), u.return = r, u.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = u, r.memoizedState = null, u;
  }
  function Bd(n, r) {
    return r = Wl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ks(n, r, l, u) {
    return u !== null && rl(u), Gn(r, n.child, null, l), n = Bd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Zv(n, r, l, u, f, p, y) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, u = Md(Error(b(422))), ks(n, r, y, u)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (p = u.fallback, f = r.mode, u = Wl({ mode: "visible", children: u.children }, f, 0, null), p = sl(p, f, y, null), p.flags |= 2, u.return = r, p.return = r, u.sibling = p, r.child = u, r.mode & 1 && Gn(r, n.child, null, y), r.child.memoizedState = Hd(y), r.memoizedState = rf, p);
    if (!(r.mode & 1)) return ks(n, r, y, null);
    if (f.data === "$!") {
      if (u = f.nextSibling && f.nextSibling.dataset, u) var w = u.dgst;
      return u = w, p = Error(b(419)), u = Md(p, u, void 0), ks(n, r, y, u);
    }
    if (w = (y & n.childLanes) !== 0, ar || w) {
      if (u = vr, u !== null) {
        switch (y & -y) {
          case 4:
            f = 2;
            break;
          case 16:
            f = 8;
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
            f = 32;
            break;
          case 536870912:
            f = 268435456;
            break;
          default:
            f = 0;
        }
        f = f & (u.suspendedLanes | y) ? 0 : f, f !== 0 && f !== p.retryLane && (p.retryLane = f, ka(n, f), Qr(u, n, f, -1));
      }
      return Xd(), u = Md(Error(b(421))), ks(n, r, y, u);
    }
    return f.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Ty.bind(null, n), f._reactRetry = r, null) : (n = p.treeContext, da = ji(f.nextSibling), fa = r, An = !0, Qa = null, n !== null && (nr[Wa++] = Li, nr[Wa++] = Ai, nr[Wa++] = Ta, Li = n.id, Ai = n.overflow, Ta = r), r = Bd(r, u.children), r.flags |= 4096, r);
  }
  function Vd(n, r, l) {
    n.lanes |= r;
    var u = n.alternate;
    u !== null && (u.lanes |= r), Td(n.return, r, l);
  }
  function $r(n, r, l, u, f) {
    var p = n.memoizedState;
    p === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: f } : (p.isBackwards = r, p.rendering = null, p.renderingStartTime = 0, p.last = u, p.tail = l, p.tailMode = f);
  }
  function Ui(n, r, l) {
    var u = r.pendingProps, f = u.revealOrder, p = u.tail;
    if (wr(n, r, u.children, l), u = Vn.current, u & 2) u = u & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Vd(n, l, r);
        else if (n.tag === 19) Vd(n, l, r);
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
      u &= 1;
    }
    if (lt(Vn, u), !(r.mode & 1)) r.memoizedState = null;
    else switch (f) {
      case "forwards":
        for (l = r.child, f = null; l !== null; ) n = l.alternate, n !== null && Uc(n) === null && (f = l), l = l.sibling;
        l = f, l === null ? (f = r.child, r.child = null) : (f = l.sibling, l.sibling = null), $r(r, !1, f, l, p);
        break;
      case "backwards":
        for (l = null, f = r.child, r.child = null; f !== null; ) {
          if (n = f.alternate, n !== null && Uc(n) === null) {
            r.child = f;
            break;
          }
          n = f.sibling, f.sibling = l, l = f, f = n;
        }
        $r(r, !0, l, null, p);
        break;
      case "together":
        $r(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Ka(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function qa(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Pi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(b(153));
    if (r.child !== null) {
      for (n = r.child, l = Yl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Yl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function js(n, r, l) {
    switch (r.tag) {
      case 3:
        Eu(r), zl();
        break;
      case 5:
        $v(r);
        break;
      case 1:
        tr(r.type) && hr(r);
        break;
      case 4:
        Dd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var u = r.type._context, f = r.memoizedProps.value;
        lt(Ra, u._currentValue), u._currentValue = f;
        break;
      case 13:
        if (u = r.memoizedState, u !== null)
          return u.dehydrated !== null ? (lt(Vn, Vn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? af(n, r, l) : (lt(Vn, Vn.current & 1), n = qa(n, r, l), n !== null ? n.sibling : null);
        lt(Vn, Vn.current & 1);
        break;
      case 19:
        if (u = (l & r.childLanes) !== 0, n.flags & 128) {
          if (u) return Ui(n, r, l);
          r.flags |= 128;
        }
        if (f = r.memoizedState, f !== null && (f.rendering = null, f.tail = null, f.lastEffect = null), lt(Vn, Vn.current), u) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Ts(n, r, l);
    }
    return qa(n, r, l);
  }
  var Xa, ir, em, tm;
  Xa = function(n, r) {
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
  }, ir = function() {
  }, em = function(n, r, l, u) {
    var f = n.memoizedProps;
    if (f !== u) {
      n = r.stateNode, Co(Mi.current);
      var p = null;
      switch (l) {
        case "input":
          f = gn(n, f), u = gn(n, u), p = [];
          break;
        case "select":
          f = je({}, f, { value: void 0 }), u = je({}, u, { value: void 0 }), p = [];
          break;
        case "textarea":
          f = Cn(n, f), u = Cn(n, u), p = [];
          break;
        default:
          typeof f.onClick != "function" && typeof u.onClick == "function" && (n.onclick = Dl);
      }
      cn(l, u);
      var y;
      l = null;
      for (G in f) if (!u.hasOwnProperty(G) && f.hasOwnProperty(G) && f[G] != null) if (G === "style") {
        var w = f[G];
        for (y in w) w.hasOwnProperty(y) && (l || (l = {}), l[y] = "");
      } else G !== "dangerouslySetInnerHTML" && G !== "children" && G !== "suppressContentEditableWarning" && G !== "suppressHydrationWarning" && G !== "autoFocus" && (J.hasOwnProperty(G) ? p || (p = []) : (p = p || []).push(G, null));
      for (G in u) {
        var j = u[G];
        if (w = f != null ? f[G] : void 0, u.hasOwnProperty(G) && j !== w && (j != null || w != null)) if (G === "style") if (w) {
          for (y in w) !w.hasOwnProperty(y) || j && j.hasOwnProperty(y) || (l || (l = {}), l[y] = "");
          for (y in j) j.hasOwnProperty(y) && w[y] !== j[y] && (l || (l = {}), l[y] = j[y]);
        } else l || (p || (p = []), p.push(
          G,
          l
        )), l = j;
        else G === "dangerouslySetInnerHTML" ? (j = j ? j.__html : void 0, w = w ? w.__html : void 0, j != null && w !== j && (p = p || []).push(G, j)) : G === "children" ? typeof j != "string" && typeof j != "number" || (p = p || []).push(G, "" + j) : G !== "suppressContentEditableWarning" && G !== "suppressHydrationWarning" && (J.hasOwnProperty(G) ? (j != null && G === "onScroll" && on("scroll", n), p || w === j || (p = [])) : (p = p || []).push(G, j));
      }
      l && (p = p || []).push("style", l);
      var G = p;
      (r.updateQueue = G) && (r.flags |= 4);
    }
  }, tm = function(n, r, l, u) {
    l !== u && (r.flags |= 4);
  };
  function Ns(n, r) {
    if (!An) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var u = null; l !== null; ) l.alternate !== null && (u = l), l = l.sibling;
        u === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : u.sibling = null;
    }
  }
  function gr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, u = 0;
    if (r) for (var f = n.child; f !== null; ) l |= f.lanes | f.childLanes, u |= f.subtreeFlags & 14680064, u |= f.flags & 14680064, f.return = n, f = f.sibling;
    else for (f = n.child; f !== null; ) l |= f.lanes | f.childLanes, u |= f.subtreeFlags, u |= f.flags, f.return = n, f = f.sibling;
    return n.subtreeFlags |= u, n.childLanes = l, r;
  }
  function nm(n, r, l) {
    var u = r.pendingProps;
    switch (Dc(r), r.tag) {
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
        return gr(r), null;
      case 1:
        return tr(r.type) && hu(), gr(r), null;
      case 3:
        return u = r.stateNode, bo(), wn(dr), wn(Yn), st(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (n === null || n.child === null) && (Oc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Qa !== null && (Ao(Qa), Qa = null))), ir(n, r), gr(r), null;
      case 5:
        Mc(r);
        var f = Co(ms.current);
        if (l = r.type, n !== null && r.stateNode != null) em(n, r, l, u, f), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!u) {
            if (r.stateNode === null) throw Error(b(166));
            return gr(r), null;
          }
          if (n = Co(Mi.current), Oc(r)) {
            u = r.stateNode, l = r.type;
            var p = r.memoizedProps;
            switch (u[Ni] = r, u[us] = p, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                on("cancel", u), on("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                on("load", u);
                break;
              case "video":
              case "audio":
                for (f = 0; f < is.length; f++) on(is[f], u);
                break;
              case "source":
                on("error", u);
                break;
              case "img":
              case "image":
              case "link":
                on(
                  "error",
                  u
                ), on("load", u);
                break;
              case "details":
                on("toggle", u);
                break;
              case "input":
                Tn(u, p), on("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!p.multiple }, on("invalid", u);
                break;
              case "textarea":
                V(u, p), on("invalid", u);
            }
            cn(l, p), f = null;
            for (var y in p) if (p.hasOwnProperty(y)) {
              var w = p[y];
              y === "children" ? typeof w == "string" ? u.textContent !== w && (p.suppressHydrationWarning !== !0 && wc(u.textContent, w, n), f = ["children", w]) : typeof w == "number" && u.textContent !== "" + w && (p.suppressHydrationWarning !== !0 && wc(
                u.textContent,
                w,
                n
              ), f = ["children", "" + w]) : J.hasOwnProperty(y) && w != null && y === "onScroll" && on("scroll", u);
            }
            switch (l) {
              case "input":
                _n(u), Rn(u, p, !0);
                break;
              case "textarea":
                _n(u), Et(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof p.onClick == "function" && (u.onclick = Dl);
            }
            u = f, r.updateQueue = u, u !== null && (r.flags |= 4);
          } else {
            y = f.nodeType === 9 ? f : f.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Ct(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = y.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof u.is == "string" ? n = y.createElement(l, { is: u.is }) : (n = y.createElement(l), l === "select" && (y = n, u.multiple ? y.multiple = !0 : u.size && (y.size = u.size))) : n = y.createElementNS(n, l), n[Ni] = r, n[us] = u, Xa(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (y = Nn(l, u), l) {
                case "dialog":
                  on("cancel", n), on("close", n), f = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  on("load", n), f = u;
                  break;
                case "video":
                case "audio":
                  for (f = 0; f < is.length; f++) on(is[f], n);
                  f = u;
                  break;
                case "source":
                  on("error", n), f = u;
                  break;
                case "img":
                case "image":
                case "link":
                  on(
                    "error",
                    n
                  ), on("load", n), f = u;
                  break;
                case "details":
                  on("toggle", n), f = u;
                  break;
                case "input":
                  Tn(n, u), f = gn(n, u), on("invalid", n);
                  break;
                case "option":
                  f = u;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!u.multiple }, f = je({}, u, { value: void 0 }), on("invalid", n);
                  break;
                case "textarea":
                  V(n, u), f = Cn(n, u), on("invalid", n);
                  break;
                default:
                  f = u;
              }
              cn(l, f), w = f;
              for (p in w) if (w.hasOwnProperty(p)) {
                var j = w[p];
                p === "style" ? sn(n, j) : p === "dangerouslySetInnerHTML" ? (j = j ? j.__html : void 0, j != null && wa(n, j)) : p === "children" ? typeof j == "string" ? (l !== "textarea" || j !== "") && Oe(n, j) : typeof j == "number" && Oe(n, "" + j) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (J.hasOwnProperty(p) ? j != null && p === "onScroll" && on("scroll", n) : j != null && _e(n, p, j, y));
              }
              switch (l) {
                case "input":
                  _n(n), Rn(n, u, !1);
                  break;
                case "textarea":
                  _n(n), Et(n);
                  break;
                case "option":
                  u.value != null && n.setAttribute("value", "" + yt(u.value));
                  break;
                case "select":
                  n.multiple = !!u.multiple, p = u.value, p != null ? Sn(n, !!u.multiple, p, !1) : u.defaultValue != null && Sn(
                    n,
                    !!u.multiple,
                    u.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof f.onClick == "function" && (n.onclick = Dl);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u = !!u.autoFocus;
                  break e;
                case "img":
                  u = !0;
                  break e;
                default:
                  u = !1;
              }
            }
            u && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return gr(r), null;
      case 6:
        if (n && r.stateNode != null) tm(n, r, n.memoizedProps, u);
        else {
          if (typeof u != "string" && r.stateNode === null) throw Error(b(166));
          if (l = Co(ms.current), Co(Mi.current), Oc(r)) {
            if (u = r.stateNode, l = r.memoizedProps, u[Ni] = r, (p = u.nodeValue !== l) && (n = fa, n !== null)) switch (n.tag) {
              case 3:
                wc(u.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && wc(u.nodeValue, l, (n.mode & 1) !== 0);
            }
            p && (r.flags |= 4);
          } else u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[Ni] = r, r.stateNode = u;
        }
        return gr(r), null;
      case 13:
        if (wn(Vn), u = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (An && da !== null && r.mode & 1 && !(r.flags & 128)) fs(), zl(), r.flags |= 98560, p = !1;
          else if (p = Oc(r), u !== null && u.dehydrated !== null) {
            if (n === null) {
              if (!p) throw Error(b(318));
              if (p = r.memoizedState, p = p !== null ? p.dehydrated : null, !p) throw Error(b(317));
              p[Ni] = r;
            } else zl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            gr(r), p = !1;
          } else Qa !== null && (Ao(Qa), Qa = null), p = !0;
          if (!p) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (u = u !== null, u !== (n !== null && n.memoizedState !== null) && u && (r.child.flags |= 8192, r.mode & 1 && (n === null || Vn.current & 1 ? Xn === 0 && (Xn = 3) : Xd())), r.updateQueue !== null && (r.flags |= 4), gr(r), null);
      case 4:
        return bo(), ir(n, r), n === null && fu(r.stateNode.containerInfo), gr(r), null;
      case 10:
        return _d(r.type._context), gr(r), null;
      case 17:
        return tr(r.type) && hu(), gr(r), null;
      case 19:
        if (wn(Vn), p = r.memoizedState, p === null) return gr(r), null;
        if (u = (r.flags & 128) !== 0, y = p.rendering, y === null) if (u) Ns(p, !1);
        else {
          if (Xn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (y = Uc(n), y !== null) {
              for (r.flags |= 128, Ns(p, !1), u = y.updateQueue, u !== null && (r.updateQueue = u, r.flags |= 4), r.subtreeFlags = 0, u = l, l = r.child; l !== null; ) p = l, n = u, p.flags &= 14680066, y = p.alternate, y === null ? (p.childLanes = 0, p.lanes = n, p.child = null, p.subtreeFlags = 0, p.memoizedProps = null, p.memoizedState = null, p.updateQueue = null, p.dependencies = null, p.stateNode = null) : (p.childLanes = y.childLanes, p.lanes = y.lanes, p.child = y.child, p.subtreeFlags = 0, p.deletions = null, p.memoizedProps = y.memoizedProps, p.memoizedState = y.memoizedState, p.updateQueue = y.updateQueue, p.type = y.type, n = y.dependencies, p.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return lt(Vn, Vn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          p.tail !== null && rt() > _u && (r.flags |= 128, u = !0, Ns(p, !1), r.lanes = 4194304);
        }
        else {
          if (!u) if (n = Uc(y), n !== null) {
            if (r.flags |= 128, u = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ns(p, !0), p.tail === null && p.tailMode === "hidden" && !y.alternate && !An) return gr(r), null;
          } else 2 * rt() - p.renderingStartTime > _u && l !== 1073741824 && (r.flags |= 128, u = !0, Ns(p, !1), r.lanes = 4194304);
          p.isBackwards ? (y.sibling = r.child, r.child = y) : (l = p.last, l !== null ? l.sibling = y : r.child = y, p.last = y);
        }
        return p.tail !== null ? (r = p.tail, p.rendering = r, p.tail = r.sibling, p.renderingStartTime = rt(), r.sibling = null, l = Vn.current, lt(Vn, u ? l & 1 | 2 : l & 1), r) : (gr(r), null);
      case 22:
      case 23:
        return qd(), u = r.memoizedState !== null, n !== null && n.memoizedState !== null !== u && (r.flags |= 8192), u && r.mode & 1 ? Na & 1073741824 && (gr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : gr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(b(156, r.tag));
  }
  function lf(n, r) {
    switch (Dc(r), r.tag) {
      case 1:
        return tr(r.type) && hu(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return bo(), wn(dr), wn(Yn), st(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (wn(Vn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(b(340));
          zl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return wn(Vn), null;
      case 4:
        return bo(), null;
      case 10:
        return _d(r.type._context), null;
      case 22:
      case 23:
        return qd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ds = !1, Fr = !1, Sy = typeof WeakSet == "function" ? WeakSet : Set, Ge = null;
  function Cu(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (u) {
      Mn(n, r, u);
    }
    else l.current = null;
  }
  function of(n, r, l) {
    try {
      l();
    } catch (u) {
      Mn(n, r, u);
    }
  }
  var rm = !1;
  function am(n, r) {
    if (os = Va, n = rs(), hc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var u = l.getSelection && l.getSelection();
        if (u && u.rangeCount !== 0) {
          l = u.anchorNode;
          var f = u.anchorOffset, p = u.focusNode;
          u = u.focusOffset;
          try {
            l.nodeType, p.nodeType;
          } catch {
            l = null;
            break e;
          }
          var y = 0, w = -1, j = -1, G = 0, Ee = 0, Re = n, ge = null;
          t: for (; ; ) {
            for (var Ie; Re !== l || f !== 0 && Re.nodeType !== 3 || (w = y + f), Re !== p || u !== 0 && Re.nodeType !== 3 || (j = y + u), Re.nodeType === 3 && (y += Re.nodeValue.length), (Ie = Re.firstChild) !== null; )
              ge = Re, Re = Ie;
            for (; ; ) {
              if (Re === n) break t;
              if (ge === l && ++G === f && (w = y), ge === p && ++Ee === u && (j = y), (Ie = Re.nextSibling) !== null) break;
              Re = ge, ge = Re.parentNode;
            }
            Re = Ie;
          }
          l = w === -1 || j === -1 ? null : { start: w, end: j };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (ho = { focusedElem: n, selectionRange: l }, Va = !1, Ge = r; Ge !== null; ) if (r = Ge, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Ge = n;
    else for (; Ge !== null; ) {
      r = Ge;
      try {
        var Xe = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Xe !== null) {
              var tt = Xe.memoizedProps, Jn = Xe.memoizedState, F = r.stateNode, A = F.getSnapshotBeforeUpdate(r.elementType === r.type ? tt : vi(r.type, tt), Jn);
              F.__reactInternalSnapshotBeforeUpdate = A;
            }
            break;
          case 3:
            var I = r.stateNode.containerInfo;
            I.nodeType === 1 ? I.textContent = "" : I.nodeType === 9 && I.documentElement && I.removeChild(I.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(b(163));
        }
      } catch (Ce) {
        Mn(r, r.return, Ce);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Ge = n;
        break;
      }
      Ge = r.return;
    }
    return Xe = rm, rm = !1, Xe;
  }
  function Os(n, r, l) {
    var u = r.updateQueue;
    if (u = u !== null ? u.lastEffect : null, u !== null) {
      var f = u = u.next;
      do {
        if ((f.tag & n) === n) {
          var p = f.destroy;
          f.destroy = void 0, p !== void 0 && of(r, l, p);
        }
        f = f.next;
      } while (f !== u);
    }
  }
  function Ls(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var u = l.create;
          l.destroy = u();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Id(n) {
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
  function uf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, uf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ni], delete r[us], delete r[ss], delete r[mu], delete r[yy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function As(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function ll(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || As(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function zi(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Dl));
    else if (u !== 4 && (n = n.child, n !== null)) for (zi(n, r, l), n = n.sibling; n !== null; ) zi(n, r, l), n = n.sibling;
  }
  function Fi(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (u !== 4 && (n = n.child, n !== null)) for (Fi(n, r, l), n = n.sibling; n !== null; ) Fi(n, r, l), n = n.sibling;
  }
  var qn = null, Yr = !1;
  function Wr(n, r, l) {
    for (l = l.child; l !== null; ) im(n, r, l), l = l.sibling;
  }
  function im(n, r, l) {
    if (oa && typeof oa.onCommitFiberUnmount == "function") try {
      oa.onCommitFiberUnmount(Cl, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Fr || Cu(l, r);
      case 6:
        var u = qn, f = Yr;
        qn = null, Wr(n, r, l), qn = u, Yr = f, qn !== null && (Yr ? (n = qn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : qn.removeChild(l.stateNode));
        break;
      case 18:
        qn !== null && (Yr ? (n = qn, l = l.stateNode, n.nodeType === 8 ? vu(n.parentNode, l) : n.nodeType === 1 && vu(n, l), si(n)) : vu(qn, l.stateNode));
        break;
      case 4:
        u = qn, f = Yr, qn = l.stateNode.containerInfo, Yr = !0, Wr(n, r, l), qn = u, Yr = f;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Fr && (u = l.updateQueue, u !== null && (u = u.lastEffect, u !== null))) {
          f = u = u.next;
          do {
            var p = f, y = p.destroy;
            p = p.tag, y !== void 0 && (p & 2 || p & 4) && of(l, r, y), f = f.next;
          } while (f !== u);
        }
        Wr(n, r, l);
        break;
      case 1:
        if (!Fr && (Cu(l, r), u = l.stateNode, typeof u.componentWillUnmount == "function")) try {
          u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
        } catch (w) {
          Mn(l, r, w);
        }
        Wr(n, r, l);
        break;
      case 21:
        Wr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Fr = (u = Fr) || l.memoizedState !== null, Wr(n, r, l), Fr = u) : Wr(n, r, l);
        break;
      default:
        Wr(n, r, l);
    }
  }
  function lm(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new Sy()), r.forEach(function(u) {
        var f = mm.bind(null, n, u);
        l.has(u) || (l.add(u), u.then(f, f));
      });
    }
  }
  function mi(n, r) {
    var l = r.deletions;
    if (l !== null) for (var u = 0; u < l.length; u++) {
      var f = l[u];
      try {
        var p = n, y = r, w = y;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 5:
              qn = w.stateNode, Yr = !1;
              break e;
            case 3:
              qn = w.stateNode.containerInfo, Yr = !0;
              break e;
            case 4:
              qn = w.stateNode.containerInfo, Yr = !0;
              break e;
          }
          w = w.return;
        }
        if (qn === null) throw Error(b(160));
        im(p, y, f), qn = null, Yr = !1;
        var j = f.alternate;
        j !== null && (j.return = null), f.return = null;
      } catch (G) {
        Mn(f, r, G);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) $d(r, n), r = r.sibling;
  }
  function $d(n, r) {
    var l = n.alternate, u = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (mi(r, n), ha(n), u & 4) {
          try {
            Os(3, n, n.return), Ls(3, n);
          } catch (tt) {
            Mn(n, n.return, tt);
          }
          try {
            Os(5, n, n.return);
          } catch (tt) {
            Mn(n, n.return, tt);
          }
        }
        break;
      case 1:
        mi(r, n), ha(n), u & 512 && l !== null && Cu(l, l.return);
        break;
      case 5:
        if (mi(r, n), ha(n), u & 512 && l !== null && Cu(l, l.return), n.flags & 32) {
          var f = n.stateNode;
          try {
            Oe(f, "");
          } catch (tt) {
            Mn(n, n.return, tt);
          }
        }
        if (u & 4 && (f = n.stateNode, f != null)) {
          var p = n.memoizedProps, y = l !== null ? l.memoizedProps : p, w = n.type, j = n.updateQueue;
          if (n.updateQueue = null, j !== null) try {
            w === "input" && p.type === "radio" && p.name != null && _t(f, p), Nn(w, y);
            var G = Nn(w, p);
            for (y = 0; y < j.length; y += 2) {
              var Ee = j[y], Re = j[y + 1];
              Ee === "style" ? sn(f, Re) : Ee === "dangerouslySetInnerHTML" ? wa(f, Re) : Ee === "children" ? Oe(f, Re) : _e(f, Ee, Re, G);
            }
            switch (w) {
              case "input":
                En(f, p);
                break;
              case "textarea":
                Ye(f, p);
                break;
              case "select":
                var ge = f._wrapperState.wasMultiple;
                f._wrapperState.wasMultiple = !!p.multiple;
                var Ie = p.value;
                Ie != null ? Sn(f, !!p.multiple, Ie, !1) : ge !== !!p.multiple && (p.defaultValue != null ? Sn(
                  f,
                  !!p.multiple,
                  p.defaultValue,
                  !0
                ) : Sn(f, !!p.multiple, p.multiple ? [] : "", !1));
            }
            f[us] = p;
          } catch (tt) {
            Mn(n, n.return, tt);
          }
        }
        break;
      case 6:
        if (mi(r, n), ha(n), u & 4) {
          if (n.stateNode === null) throw Error(b(162));
          f = n.stateNode, p = n.memoizedProps;
          try {
            f.nodeValue = p;
          } catch (tt) {
            Mn(n, n.return, tt);
          }
        }
        break;
      case 3:
        if (mi(r, n), ha(n), u & 4 && l !== null && l.memoizedState.isDehydrated) try {
          si(r.containerInfo);
        } catch (tt) {
          Mn(n, n.return, tt);
        }
        break;
      case 4:
        mi(r, n), ha(n);
        break;
      case 13:
        mi(r, n), ha(n), f = n.child, f.flags & 8192 && (p = f.memoizedState !== null, f.stateNode.isHidden = p, !p || f.alternate !== null && f.alternate.memoizedState !== null || (Qd = rt())), u & 4 && lm(n);
        break;
      case 22:
        if (Ee = l !== null && l.memoizedState !== null, n.mode & 1 ? (Fr = (G = Fr) || Ee, mi(r, n), Fr = G) : mi(r, n), ha(n), u & 8192) {
          if (G = n.memoizedState !== null, (n.stateNode.isHidden = G) && !Ee && n.mode & 1) for (Ge = n, Ee = n.child; Ee !== null; ) {
            for (Re = Ge = Ee; Ge !== null; ) {
              switch (ge = Ge, Ie = ge.child, ge.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, ge, ge.return);
                  break;
                case 1:
                  Cu(ge, ge.return);
                  var Xe = ge.stateNode;
                  if (typeof Xe.componentWillUnmount == "function") {
                    u = ge, l = ge.return;
                    try {
                      r = u, Xe.props = r.memoizedProps, Xe.state = r.memoizedState, Xe.componentWillUnmount();
                    } catch (tt) {
                      Mn(u, l, tt);
                    }
                  }
                  break;
                case 5:
                  Cu(ge, ge.return);
                  break;
                case 22:
                  if (ge.memoizedState !== null) {
                    Ms(Re);
                    continue;
                  }
              }
              Ie !== null ? (Ie.return = ge, Ge = Ie) : Ms(Re);
            }
            Ee = Ee.sibling;
          }
          e: for (Ee = null, Re = n; ; ) {
            if (Re.tag === 5) {
              if (Ee === null) {
                Ee = Re;
                try {
                  f = Re.stateNode, G ? (p = f.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none") : (w = Re.stateNode, j = Re.memoizedProps.style, y = j != null && j.hasOwnProperty("display") ? j.display : null, w.style.display = Wt("display", y));
                } catch (tt) {
                  Mn(n, n.return, tt);
                }
              }
            } else if (Re.tag === 6) {
              if (Ee === null) try {
                Re.stateNode.nodeValue = G ? "" : Re.memoizedProps;
              } catch (tt) {
                Mn(n, n.return, tt);
              }
            } else if ((Re.tag !== 22 && Re.tag !== 23 || Re.memoizedState === null || Re === n) && Re.child !== null) {
              Re.child.return = Re, Re = Re.child;
              continue;
            }
            if (Re === n) break e;
            for (; Re.sibling === null; ) {
              if (Re.return === null || Re.return === n) break e;
              Ee === Re && (Ee = null), Re = Re.return;
            }
            Ee === Re && (Ee = null), Re.sibling.return = Re.return, Re = Re.sibling;
          }
        }
        break;
      case 19:
        mi(r, n), ha(n), u & 4 && lm(n);
        break;
      case 21:
        break;
      default:
        mi(
          r,
          n
        ), ha(n);
    }
  }
  function ha(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (As(l)) {
              var u = l;
              break e;
            }
            l = l.return;
          }
          throw Error(b(160));
        }
        switch (u.tag) {
          case 5:
            var f = u.stateNode;
            u.flags & 32 && (Oe(f, ""), u.flags &= -33);
            var p = ll(n);
            Fi(n, p, f);
            break;
          case 3:
          case 4:
            var y = u.stateNode.containerInfo, w = ll(n);
            zi(n, w, y);
            break;
          default:
            throw Error(b(161));
        }
      } catch (j) {
        Mn(n, n.return, j);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function xy(n, r, l) {
    Ge = n, Yd(n);
  }
  function Yd(n, r, l) {
    for (var u = (n.mode & 1) !== 0; Ge !== null; ) {
      var f = Ge, p = f.child;
      if (f.tag === 22 && u) {
        var y = f.memoizedState !== null || Ds;
        if (!y) {
          var w = f.alternate, j = w !== null && w.memoizedState !== null || Fr;
          w = Ds;
          var G = Fr;
          if (Ds = y, (Fr = j) && !G) for (Ge = f; Ge !== null; ) y = Ge, j = y.child, y.tag === 22 && y.memoizedState !== null ? Wd(f) : j !== null ? (j.return = y, Ge = j) : Wd(f);
          for (; p !== null; ) Ge = p, Yd(p), p = p.sibling;
          Ge = f, Ds = w, Fr = G;
        }
        om(n);
      } else f.subtreeFlags & 8772 && p !== null ? (p.return = f, Ge = p) : om(n);
    }
  }
  function om(n) {
    for (; Ge !== null; ) {
      var r = Ge;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Fr || Ls(5, r);
              break;
            case 1:
              var u = r.stateNode;
              if (r.flags & 4 && !Fr) if (l === null) u.componentDidMount();
              else {
                var f = r.elementType === r.type ? l.memoizedProps : vi(r.type, l.memoizedProps);
                u.componentDidUpdate(f, l.memoizedState, u.__reactInternalSnapshotBeforeUpdate);
              }
              var p = r.updateQueue;
              p !== null && Nd(r, p, u);
              break;
            case 3:
              var y = r.updateQueue;
              if (y !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                Nd(r, y, l);
              }
              break;
            case 5:
              var w = r.stateNode;
              if (l === null && r.flags & 4) {
                l = w;
                var j = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    j.autoFocus && l.focus();
                    break;
                  case "img":
                    j.src && (l.src = j.src);
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
                var G = r.alternate;
                if (G !== null) {
                  var Ee = G.memoizedState;
                  if (Ee !== null) {
                    var Re = Ee.dehydrated;
                    Re !== null && si(Re);
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
              throw Error(b(163));
          }
          Fr || r.flags & 512 && Id(r);
        } catch (ge) {
          Mn(r, r.return, ge);
        }
      }
      if (r === n) {
        Ge = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Ge = l;
        break;
      }
      Ge = r.return;
    }
  }
  function Ms(n) {
    for (; Ge !== null; ) {
      var r = Ge;
      if (r === n) {
        Ge = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Ge = l;
        break;
      }
      Ge = r.return;
    }
  }
  function Wd(n) {
    for (; Ge !== null; ) {
      var r = Ge;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (j) {
              Mn(r, l, j);
            }
            break;
          case 1:
            var u = r.stateNode;
            if (typeof u.componentDidMount == "function") {
              var f = r.return;
              try {
                u.componentDidMount();
              } catch (j) {
                Mn(r, f, j);
              }
            }
            var p = r.return;
            try {
              Id(r);
            } catch (j) {
              Mn(r, p, j);
            }
            break;
          case 5:
            var y = r.return;
            try {
              Id(r);
            } catch (j) {
              Mn(r, y, j);
            }
        }
      } catch (j) {
        Mn(r, r.return, j);
      }
      if (r === n) {
        Ge = null;
        break;
      }
      var w = r.sibling;
      if (w !== null) {
        w.return = r.return, Ge = w;
        break;
      }
      Ge = r.return;
    }
  }
  var Ey = Math.ceil, Vl = xe.ReactCurrentDispatcher, Oo = xe.ReactCurrentOwner, _r = xe.ReactCurrentBatchConfig, It = 0, vr = null, lr = null, Tr = 0, Na = 0, bu = Ya(0), Xn = 0, Us = null, Pi = 0, wu = 0, sf = 0, zs = null, ya = null, Qd = 0, _u = 1 / 0, Da = null, Tu = !1, Lo = null, Il = null, cf = !1, ol = null, Fs = 0, $l = 0, Ru = null, Ps = -1, Pr = 0;
  function or() {
    return It & 6 ? rt() : Ps !== -1 ? Ps : Ps = rt();
  }
  function Hi(n) {
    return n.mode & 1 ? It & 2 && Tr !== 0 ? Tr & -Tr : gy.transition !== null ? (Pr === 0 && (Pr = Zo()), Pr) : (n = Zt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : lu(n.type)), n) : 1;
  }
  function Qr(n, r, l, u) {
    if (50 < $l) throw $l = 0, Ru = null, Error(b(185));
    Gi(n, l, u), (!(It & 2) || n !== vr) && (n === vr && (!(It & 2) && (wu |= l), Xn === 4 && hi(n, Tr)), ga(n, u), l === 1 && It === 0 && !(r.mode & 1) && (_u = rt() + 500, yu && Oi()));
  }
  function ga(n, r) {
    var l = n.callbackNode;
    lo(n, r);
    var u = ui(n, n === vr ? Tr : 0);
    if (u === 0) l !== null && vt(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = u & -u, n.callbackPriority !== r) {
      if (l != null && vt(l), r === 1) n.tag === 0 ? Ll(Gd.bind(null, n)) : jc(Gd.bind(null, n)), pu(function() {
        !(It & 6) && Oi();
      }), l = null;
      else {
        switch (tu(u)) {
          case 1:
            l = Fn;
            break;
          case 4:
            l = Ln;
            break;
          case 16:
            l = cr;
            break;
          case 536870912:
            l = qo;
            break;
          default:
            l = cr;
        }
        l = ym(l, ff.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function ff(n, r) {
    if (Ps = -1, Pr = 0, It & 6) throw Error(b(327));
    var l = n.callbackNode;
    if (ku() && n.callbackNode !== l) return null;
    var u = ui(n, n === vr ? Tr : 0);
    if (u === 0) return null;
    if (u & 30 || u & n.expiredLanes || r) r = df(n, u);
    else {
      r = u;
      var f = It;
      It |= 2;
      var p = sm();
      (vr !== n || Tr !== r) && (Da = null, _u = rt() + 500, ul(n, r));
      do
        try {
          cm();
          break;
        } catch (w) {
          um(n, w);
        }
      while (!0);
      wd(), Vl.current = p, It = f, lr !== null ? r = 0 : (vr = null, Tr = 0, r = Xn);
    }
    if (r !== 0) {
      if (r === 2 && (f = wl(n), f !== 0 && (u = f, r = Hs(n, f))), r === 1) throw l = Us, ul(n, 0), hi(n, u), ga(n, rt()), l;
      if (r === 6) hi(n, u);
      else {
        if (f = n.current.alternate, !(u & 30) && !Cy(f) && (r = df(n, u), r === 2 && (p = wl(n), p !== 0 && (u = p, r = Hs(n, p))), r === 1)) throw l = Us, ul(n, 0), hi(n, u), ga(n, rt()), l;
        switch (n.finishedWork = f, n.finishedLanes = u, r) {
          case 0:
          case 1:
            throw Error(b(345));
          case 2:
            Uo(n, ya, Da);
            break;
          case 3:
            if (hi(n, u), (u & 130023424) === u && (r = Qd + 500 - rt(), 10 < r)) {
              if (ui(n, 0) !== 0) break;
              if (f = n.suspendedLanes, (f & u) !== u) {
                or(), n.pingedLanes |= n.suspendedLanes & f;
                break;
              }
              n.timeoutHandle = Tc(Uo.bind(null, n, ya, Da), r);
              break;
            }
            Uo(n, ya, Da);
            break;
          case 4:
            if (hi(n, u), (u & 4194240) === u) break;
            for (r = n.eventTimes, f = -1; 0 < u; ) {
              var y = 31 - Br(u);
              p = 1 << y, y = r[y], y > f && (f = y), u &= ~p;
            }
            if (u = f, u = rt() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * Ey(u / 1960)) - u, 10 < u) {
              n.timeoutHandle = Tc(Uo.bind(null, n, ya, Da), u);
              break;
            }
            Uo(n, ya, Da);
            break;
          case 5:
            Uo(n, ya, Da);
            break;
          default:
            throw Error(b(329));
        }
      }
    }
    return ga(n, rt()), n.callbackNode === l ? ff.bind(null, n) : null;
  }
  function Hs(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (ul(n, r).flags |= 256), n = df(n, r), n !== 2 && (r = ya, ya = l, r !== null && Ao(r)), n;
  }
  function Ao(n) {
    ya === null ? ya = n : ya.push.apply(ya, n);
  }
  function Cy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var u = 0; u < l.length; u++) {
          var f = l[u], p = f.getSnapshot;
          f = f.value;
          try {
            if (!fi(p(), f)) return !1;
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
  function hi(n, r) {
    for (r &= ~sf, r &= ~wu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Br(r), u = 1 << l;
      n[l] = -1, r &= ~u;
    }
  }
  function Gd(n) {
    if (It & 6) throw Error(b(327));
    ku();
    var r = ui(n, 0);
    if (!(r & 1)) return ga(n, rt()), null;
    var l = df(n, r);
    if (n.tag !== 0 && l === 2) {
      var u = wl(n);
      u !== 0 && (r = u, l = Hs(n, u));
    }
    if (l === 1) throw l = Us, ul(n, 0), hi(n, r), ga(n, rt()), l;
    if (l === 6) throw Error(b(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Uo(n, ya, Da), ga(n, rt()), null;
  }
  function Kd(n, r) {
    var l = It;
    It |= 1;
    try {
      return n(r);
    } finally {
      It = l, It === 0 && (_u = rt() + 500, yu && Oi());
    }
  }
  function Mo(n) {
    ol !== null && ol.tag === 0 && !(It & 6) && ku();
    var r = It;
    It |= 1;
    var l = _r.transition, u = Zt;
    try {
      if (_r.transition = null, Zt = 1, n) return n();
    } finally {
      Zt = u, _r.transition = l, It = r, !(It & 6) && Oi();
    }
  }
  function qd() {
    Na = bu.current, wn(bu);
  }
  function ul(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Sd(l)), lr !== null) for (l = lr.return; l !== null; ) {
      var u = l;
      switch (Dc(u), u.tag) {
        case 1:
          u = u.type.childContextTypes, u != null && hu();
          break;
        case 3:
          bo(), wn(dr), wn(Yn), st();
          break;
        case 5:
          Mc(u);
          break;
        case 4:
          bo();
          break;
        case 13:
          wn(Vn);
          break;
        case 19:
          wn(Vn);
          break;
        case 10:
          _d(u.type._context);
          break;
        case 22:
        case 23:
          qd();
      }
      l = l.return;
    }
    if (vr = n, lr = n = Yl(n.current, null), Tr = Na = r, Xn = 0, Us = null, sf = wu = Pi = 0, ya = zs = null, Eo !== null) {
      for (r = 0; r < Eo.length; r++) if (l = Eo[r], u = l.interleaved, u !== null) {
        l.interleaved = null;
        var f = u.next, p = l.pending;
        if (p !== null) {
          var y = p.next;
          p.next = f, u.next = y;
        }
        l.pending = u;
      }
      Eo = null;
    }
    return n;
  }
  function um(n, r) {
    do {
      var l = lr;
      try {
        if (wd(), Ut.current = jo, zc) {
          for (var u = tn.memoizedState; u !== null; ) {
            var f = u.queue;
            f !== null && (f.pending = null), u = u.next;
          }
          zc = !1;
        }
        if (vn = 0, yr = rr = tn = null, ys = !1, wo = 0, Oo.current = null, l === null || l.return === null) {
          Xn = 1, Us = r, lr = null;
          break;
        }
        e: {
          var p = n, y = l.return, w = l, j = r;
          if (r = Tr, w.flags |= 32768, j !== null && typeof j == "object" && typeof j.then == "function") {
            var G = j, Ee = w, Re = Ee.tag;
            if (!(Ee.mode & 1) && (Re === 0 || Re === 11 || Re === 15)) {
              var ge = Ee.alternate;
              ge ? (Ee.updateQueue = ge.updateQueue, Ee.memoizedState = ge.memoizedState, Ee.lanes = ge.lanes) : (Ee.updateQueue = null, Ee.memoizedState = null);
            }
            var Ie = Kv(y);
            if (Ie !== null) {
              Ie.flags &= -257, Bl(Ie, y, w, p, r), Ie.mode & 1 && Fd(p, G, r), r = Ie, j = G;
              var Xe = r.updateQueue;
              if (Xe === null) {
                var tt = /* @__PURE__ */ new Set();
                tt.add(j), r.updateQueue = tt;
              } else Xe.add(j);
              break e;
            } else {
              if (!(r & 1)) {
                Fd(p, G, r), Xd();
                break e;
              }
              j = Error(b(426));
            }
          } else if (An && w.mode & 1) {
            var Jn = Kv(y);
            if (Jn !== null) {
              !(Jn.flags & 65536) && (Jn.flags |= 256), Bl(Jn, y, w, p, r), rl(No(j, w));
              break e;
            }
          }
          p = j = No(j, w), Xn !== 4 && (Xn = 2), zs === null ? zs = [p] : zs.push(p), p = y;
          do {
            switch (p.tag) {
              case 3:
                p.flags |= 65536, r &= -r, p.lanes |= r;
                var F = Gv(p, j, r);
                Iv(p, F);
                break e;
              case 1:
                w = j;
                var A = p.type, I = p.stateNode;
                if (!(p.flags & 128) && (typeof A.getDerivedStateFromError == "function" || I !== null && typeof I.componentDidCatch == "function" && (Il === null || !Il.has(I)))) {
                  p.flags |= 65536, r &= -r, p.lanes |= r;
                  var Ce = zd(p, w, r);
                  Iv(p, Ce);
                  break e;
                }
            }
            p = p.return;
          } while (p !== null);
        }
        dm(l);
      } catch (Je) {
        r = Je, lr === l && l !== null && (lr = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function sm() {
    var n = Vl.current;
    return Vl.current = jo, n === null ? jo : n;
  }
  function Xd() {
    (Xn === 0 || Xn === 3 || Xn === 2) && (Xn = 4), vr === null || !(Pi & 268435455) && !(wu & 268435455) || hi(vr, Tr);
  }
  function df(n, r) {
    var l = It;
    It |= 2;
    var u = sm();
    (vr !== n || Tr !== r) && (Da = null, ul(n, r));
    do
      try {
        by();
        break;
      } catch (f) {
        um(n, f);
      }
    while (!0);
    if (wd(), It = l, Vl.current = u, lr !== null) throw Error(b(261));
    return vr = null, Tr = 0, Xn;
  }
  function by() {
    for (; lr !== null; ) fm(lr);
  }
  function cm() {
    for (; lr !== null && !zt(); ) fm(lr);
  }
  function fm(n) {
    var r = hm(n.alternate, n, Na);
    n.memoizedProps = n.pendingProps, r === null ? dm(n) : lr = r, Oo.current = null;
  }
  function dm(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = lf(l, r), l !== null) {
          l.flags &= 32767, lr = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Xn = 6, lr = null;
          return;
        }
      } else if (l = nm(l, r, Na), l !== null) {
        lr = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        lr = r;
        return;
      }
      lr = r = n;
    } while (r !== null);
    Xn === 0 && (Xn = 5);
  }
  function Uo(n, r, l) {
    var u = Zt, f = _r.transition;
    try {
      _r.transition = null, Zt = 1, wy(n, r, l, u);
    } finally {
      _r.transition = f, Zt = u;
    }
    return null;
  }
  function wy(n, r, l, u) {
    do
      ku();
    while (ol !== null);
    if (It & 6) throw Error(b(327));
    l = n.finishedWork;
    var f = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(b(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var p = l.lanes | l.childLanes;
    if (Jf(n, p), n === vr && (lr = vr = null, Tr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || cf || (cf = !0, ym(cr, function() {
      return ku(), null;
    })), p = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || p) {
      p = _r.transition, _r.transition = null;
      var y = Zt;
      Zt = 1;
      var w = It;
      It |= 4, Oo.current = null, am(n, l), $d(l, n), su(ho), Va = !!os, ho = os = null, n.current = l, xy(l), Qt(), It = w, Zt = y, _r.transition = p;
    } else n.current = l;
    if (cf && (cf = !1, ol = n, Fs = f), p = n.pendingLanes, p === 0 && (Il = null), Qu(l.stateNode), ga(n, rt()), r !== null) for (u = n.onRecoverableError, l = 0; l < r.length; l++) f = r[l], u(f.value, { componentStack: f.stack, digest: f.digest });
    if (Tu) throw Tu = !1, n = Lo, Lo = null, n;
    return Fs & 1 && n.tag !== 0 && ku(), p = n.pendingLanes, p & 1 ? n === Ru ? $l++ : ($l = 0, Ru = n) : $l = 0, Oi(), null;
  }
  function ku() {
    if (ol !== null) {
      var n = tu(Fs), r = _r.transition, l = Zt;
      try {
        if (_r.transition = null, Zt = 16 > n ? 16 : n, ol === null) var u = !1;
        else {
          if (n = ol, ol = null, Fs = 0, It & 6) throw Error(b(331));
          var f = It;
          for (It |= 4, Ge = n.current; Ge !== null; ) {
            var p = Ge, y = p.child;
            if (Ge.flags & 16) {
              var w = p.deletions;
              if (w !== null) {
                for (var j = 0; j < w.length; j++) {
                  var G = w[j];
                  for (Ge = G; Ge !== null; ) {
                    var Ee = Ge;
                    switch (Ee.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, Ee, p);
                    }
                    var Re = Ee.child;
                    if (Re !== null) Re.return = Ee, Ge = Re;
                    else for (; Ge !== null; ) {
                      Ee = Ge;
                      var ge = Ee.sibling, Ie = Ee.return;
                      if (uf(Ee), Ee === G) {
                        Ge = null;
                        break;
                      }
                      if (ge !== null) {
                        ge.return = Ie, Ge = ge;
                        break;
                      }
                      Ge = Ie;
                    }
                  }
                }
                var Xe = p.alternate;
                if (Xe !== null) {
                  var tt = Xe.child;
                  if (tt !== null) {
                    Xe.child = null;
                    do {
                      var Jn = tt.sibling;
                      tt.sibling = null, tt = Jn;
                    } while (tt !== null);
                  }
                }
                Ge = p;
              }
            }
            if (p.subtreeFlags & 2064 && y !== null) y.return = p, Ge = y;
            else e: for (; Ge !== null; ) {
              if (p = Ge, p.flags & 2048) switch (p.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, p, p.return);
              }
              var F = p.sibling;
              if (F !== null) {
                F.return = p.return, Ge = F;
                break e;
              }
              Ge = p.return;
            }
          }
          var A = n.current;
          for (Ge = A; Ge !== null; ) {
            y = Ge;
            var I = y.child;
            if (y.subtreeFlags & 2064 && I !== null) I.return = y, Ge = I;
            else e: for (y = A; Ge !== null; ) {
              if (w = Ge, w.flags & 2048) try {
                switch (w.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, w);
                }
              } catch (Je) {
                Mn(w, w.return, Je);
              }
              if (w === y) {
                Ge = null;
                break e;
              }
              var Ce = w.sibling;
              if (Ce !== null) {
                Ce.return = w.return, Ge = Ce;
                break e;
              }
              Ge = w.return;
            }
          }
          if (It = f, Oi(), oa && typeof oa.onPostCommitFiberRoot == "function") try {
            oa.onPostCommitFiberRoot(Cl, n);
          } catch {
          }
          u = !0;
        }
        return u;
      } finally {
        Zt = l, _r.transition = r;
      }
    }
    return !1;
  }
  function pm(n, r, l) {
    r = No(l, r), r = Gv(n, r, 1), n = Fl(n, r, 1), r = or(), n !== null && (Gi(n, 1, r), ga(n, r));
  }
  function Mn(n, r, l) {
    if (n.tag === 3) pm(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        pm(r, n, l);
        break;
      } else if (r.tag === 1) {
        var u = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Il === null || !Il.has(u))) {
          n = No(l, n), n = zd(r, n, 1), r = Fl(r, n, 1), n = or(), r !== null && (Gi(r, 1, n), ga(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function _y(n, r, l) {
    var u = n.pingCache;
    u !== null && u.delete(r), r = or(), n.pingedLanes |= n.suspendedLanes & l, vr === n && (Tr & l) === l && (Xn === 4 || Xn === 3 && (Tr & 130023424) === Tr && 500 > rt() - Qd ? ul(n, 0) : sf |= l), ga(n, r);
  }
  function vm(n, r) {
    r === 0 && (n.mode & 1 ? (r = _a, _a <<= 1, !(_a & 130023424) && (_a = 4194304)) : r = 1);
    var l = or();
    n = ka(n, r), n !== null && (Gi(n, r, l), ga(n, l));
  }
  function Ty(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), vm(n, l);
  }
  function mm(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var u = n.stateNode, f = n.memoizedState;
        f !== null && (l = f.retryLane);
        break;
      case 19:
        u = n.stateNode;
        break;
      default:
        throw Error(b(314));
    }
    u !== null && u.delete(r), vm(n, l);
  }
  var hm;
  hm = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || dr.current) ar = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return ar = !1, js(n, r, l);
      ar = !!(n.flags & 131072);
    }
    else ar = !1, An && r.flags & 1048576 && Pv(r, nl, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var u = r.type;
        Ka(n, r), n = r.pendingProps;
        var f = ca(r, Yn.current);
        Bn(r, l), f = Pl(null, r, u, n, f, l);
        var p = pi();
        return r.flags |= 1, typeof f == "object" && f !== null && typeof f.render == "function" && f.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, tr(u) ? (p = !0, hr(r)) : p = !1, r.memoizedState = f.state !== null && f.state !== void 0 ? f.state : null, jd(r), f.updater = ef, r.stateNode = f, f._reactInternals = r, ws(r, u, n, l), r = Rs(null, r, u, !0, p, l)) : (r.tag = 0, An && p && Nc(r), wr(null, r, f, l), r = r.child), r;
      case 16:
        u = r.elementType;
        e: {
          switch (Ka(n, r), n = r.pendingProps, f = u._init, u = f(u._payload), r.type = u, f = r.tag = ky(u), n = vi(u, n), f) {
            case 0:
              r = qv(null, r, u, n, l);
              break e;
            case 1:
              r = Xv(null, r, u, n, l);
              break e;
            case 11:
              r = ma(null, r, u, n, l);
              break e;
            case 14:
              r = Do(null, r, u, vi(u.type, n), l);
              break e;
          }
          throw Error(b(
            306,
            u,
            ""
          ));
        }
        return r;
      case 0:
        return u = r.type, f = r.pendingProps, f = r.elementType === u ? f : vi(u, f), qv(n, r, u, f, l);
      case 1:
        return u = r.type, f = r.pendingProps, f = r.elementType === u ? f : vi(u, f), Xv(n, r, u, f, l);
      case 3:
        e: {
          if (Eu(r), n === null) throw Error(b(387));
          u = r.pendingProps, p = r.memoizedState, f = p.element, Vv(n, r), ds(r, u, null, l);
          var y = r.memoizedState;
          if (u = y.element, p.isDehydrated) if (p = { element: u, isDehydrated: !1, cache: y.cache, pendingSuspenseBoundaries: y.pendingSuspenseBoundaries, transitions: y.transitions }, r.updateQueue.baseState = p, r.memoizedState = p, r.flags & 256) {
            f = No(Error(b(423)), r), r = Jv(n, r, u, l, f);
            break e;
          } else if (u !== f) {
            f = No(Error(b(424)), r), r = Jv(n, r, u, l, f);
            break e;
          } else for (da = ji(r.stateNode.containerInfo.firstChild), fa = r, An = !0, Qa = null, l = Fe(r, null, u, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (zl(), u === f) {
              r = qa(n, r, l);
              break e;
            }
            wr(n, r, u, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return $v(r), n === null && Cd(r), u = r.type, f = r.pendingProps, p = n !== null ? n.memoizedProps : null, y = f.children, _c(u, f) ? y = null : p !== null && _c(u, p) && (r.flags |= 32), Pd(n, r), wr(n, r, y, l), r.child;
      case 6:
        return n === null && Cd(r), null;
      case 13:
        return af(n, r, l);
      case 4:
        return Dd(r, r.stateNode.containerInfo), u = r.pendingProps, n === null ? r.child = Gn(r, null, u, l) : wr(n, r, u, l), r.child;
      case 11:
        return u = r.type, f = r.pendingProps, f = r.elementType === u ? f : vi(u, f), ma(n, r, u, f, l);
      case 7:
        return wr(n, r, r.pendingProps, l), r.child;
      case 8:
        return wr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return wr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (u = r.type._context, f = r.pendingProps, p = r.memoizedProps, y = f.value, lt(Ra, u._currentValue), u._currentValue = y, p !== null) if (fi(p.value, y)) {
            if (p.children === f.children && !dr.current) {
              r = qa(n, r, l);
              break e;
            }
          } else for (p = r.child, p !== null && (p.return = r); p !== null; ) {
            var w = p.dependencies;
            if (w !== null) {
              y = p.child;
              for (var j = w.firstContext; j !== null; ) {
                if (j.context === u) {
                  if (p.tag === 1) {
                    j = al(-1, l & -l), j.tag = 2;
                    var G = p.updateQueue;
                    if (G !== null) {
                      G = G.shared;
                      var Ee = G.pending;
                      Ee === null ? j.next = j : (j.next = Ee.next, Ee.next = j), G.pending = j;
                    }
                  }
                  p.lanes |= l, j = p.alternate, j !== null && (j.lanes |= l), Td(
                    p.return,
                    l,
                    r
                  ), w.lanes |= l;
                  break;
                }
                j = j.next;
              }
            } else if (p.tag === 10) y = p.type === r.type ? null : p.child;
            else if (p.tag === 18) {
              if (y = p.return, y === null) throw Error(b(341));
              y.lanes |= l, w = y.alternate, w !== null && (w.lanes |= l), Td(y, l, r), y = p.sibling;
            } else y = p.child;
            if (y !== null) y.return = p;
            else for (y = p; y !== null; ) {
              if (y === r) {
                y = null;
                break;
              }
              if (p = y.sibling, p !== null) {
                p.return = y.return, y = p;
                break;
              }
              y = y.return;
            }
            p = y;
          }
          wr(n, r, f.children, l), r = r.child;
        }
        return r;
      case 9:
        return f = r.type, u = r.pendingProps.children, Bn(r, l), f = Ga(f), u = u(f), r.flags |= 1, wr(n, r, u, l), r.child;
      case 14:
        return u = r.type, f = vi(u, r.pendingProps), f = vi(u.type, f), Do(n, r, u, f, l);
      case 15:
        return Lt(n, r, r.type, r.pendingProps, l);
      case 17:
        return u = r.type, f = r.pendingProps, f = r.elementType === u ? f : vi(u, f), Ka(n, r), r.tag = 1, tr(u) ? (n = !0, hr(r)) : n = !1, Bn(r, l), tf(r, u, f), ws(r, u, f, l), Rs(null, r, u, !0, n, l);
      case 19:
        return Ui(n, r, l);
      case 22:
        return Ts(n, r, l);
    }
    throw Error(b(156, r.tag));
  };
  function ym(n, r) {
    return et(n, r);
  }
  function Ry(n, r, l, u) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ja(n, r, l, u) {
    return new Ry(n, r, l, u);
  }
  function Jd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function ky(n) {
    if (typeof n == "function") return Jd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Ke) return 11;
      if (n === at) return 14;
    }
    return 2;
  }
  function Yl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Bs(n, r, l, u, f, p) {
    var y = 2;
    if (u = n, typeof n == "function") Jd(n) && (y = 1);
    else if (typeof n == "string") y = 5;
    else e: switch (n) {
      case W:
        return sl(l.children, f, p, r);
      case we:
        y = 8, f |= 8;
        break;
      case de:
        return n = Ja(12, l, r, f | 2), n.elementType = de, n.lanes = p, n;
      case te:
        return n = Ja(13, l, r, f), n.elementType = te, n.lanes = p, n;
      case Ae:
        return n = Ja(19, l, r, f), n.elementType = Ae, n.lanes = p, n;
      case Ne:
        return Wl(l, f, p, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Te:
            y = 10;
            break e;
          case Le:
            y = 9;
            break e;
          case Ke:
            y = 11;
            break e;
          case at:
            y = 14;
            break e;
          case ct:
            y = 16, u = null;
            break e;
        }
        throw Error(b(130, n == null ? n : typeof n, ""));
    }
    return r = Ja(y, l, r, f), r.elementType = n, r.type = u, r.lanes = p, r;
  }
  function sl(n, r, l, u) {
    return n = Ja(7, n, u, r), n.lanes = l, n;
  }
  function Wl(n, r, l, u) {
    return n = Ja(22, n, u, r), n.elementType = Ne, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Zd(n, r, l) {
    return n = Ja(6, n, null, r), n.lanes = l, n;
  }
  function pf(n, r, l) {
    return r = Ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function gm(n, r, l, u, f) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = eu(0), this.expirationTimes = eu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = eu(0), this.identifierPrefix = u, this.onRecoverableError = f, this.mutableSourceEagerHydrationData = null;
  }
  function vf(n, r, l, u, f, p, y, w, j) {
    return n = new gm(n, r, l, w, j), r === 1 ? (r = 1, p === !0 && (r |= 8)) : r = 0, p = Ja(3, null, null, r), n.current = p, p.stateNode = n, p.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, jd(p), n;
  }
  function jy(n, r, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: pe, key: u == null ? null : "" + u, children: n, containerInfo: r, implementation: l };
  }
  function ep(n) {
    if (!n) return Ur;
    n = n._reactInternals;
    e: {
      if (Nt(n) !== n || n.tag !== 1) throw Error(b(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (tr(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(b(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (tr(l)) return cs(n, l, r);
    }
    return r;
  }
  function Sm(n, r, l, u, f, p, y, w, j) {
    return n = vf(l, u, !0, n, f, p, y, w, j), n.context = ep(null), l = n.current, u = or(), f = Hi(l), p = al(u, f), p.callback = r ?? null, Fl(l, p, f), n.current.lanes = f, Gi(n, f, u), ga(n, u), n;
  }
  function mf(n, r, l, u) {
    var f = r.current, p = or(), y = Hi(f);
    return l = ep(l), r.context === null ? r.context = l : r.pendingContext = l, r = al(p, y), r.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (r.callback = u), n = Fl(f, r, y), n !== null && (Qr(n, f, y, p), Ac(n, f, y)), y;
  }
  function hf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function tp(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function yf(n, r) {
    tp(n, r), (n = n.alternate) && tp(n, r);
  }
  function xm() {
    return null;
  }
  var zo = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function np(n) {
    this._internalRoot = n;
  }
  gf.prototype.render = np.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(b(409));
    mf(n, r, null, null);
  }, gf.prototype.unmount = np.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Mo(function() {
        mf(null, n, null, null);
      }), r[el] = null;
    }
  };
  function gf(n) {
    this._internalRoot = n;
  }
  gf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = jt();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < fr.length && r !== 0 && r < fr[l].priority; l++) ;
      fr.splice(l, 0, n), l === 0 && qu(n);
    }
  };
  function rp(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Sf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Em() {
  }
  function Ny(n, r, l, u, f) {
    if (f) {
      if (typeof u == "function") {
        var p = u;
        u = function() {
          var G = hf(y);
          p.call(G);
        };
      }
      var y = Sm(r, u, n, 0, null, !1, !1, "", Em);
      return n._reactRootContainer = y, n[el] = y.current, fu(n.nodeType === 8 ? n.parentNode : n), Mo(), y;
    }
    for (; f = n.lastChild; ) n.removeChild(f);
    if (typeof u == "function") {
      var w = u;
      u = function() {
        var G = hf(j);
        w.call(G);
      };
    }
    var j = vf(n, 0, !1, null, null, !1, !1, "", Em);
    return n._reactRootContainer = j, n[el] = j.current, fu(n.nodeType === 8 ? n.parentNode : n), Mo(function() {
      mf(r, j, l, u);
    }), j;
  }
  function Vs(n, r, l, u, f) {
    var p = l._reactRootContainer;
    if (p) {
      var y = p;
      if (typeof f == "function") {
        var w = f;
        f = function() {
          var j = hf(y);
          w.call(j);
        };
      }
      mf(r, y, n, f);
    } else y = Ny(l, r, n, f, u);
    return hf(y);
  }
  Gt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = oi(r.pendingLanes);
          l !== 0 && (Ki(r, l | 1), ga(r, rt()), !(It & 6) && (_u = rt() + 500, Oi()));
        }
        break;
      case 13:
        Mo(function() {
          var u = ka(n, 1);
          if (u !== null) {
            var f = or();
            Qr(u, n, 1, f);
          }
        }), yf(n, 1);
    }
  }, Gu = function(n) {
    if (n.tag === 13) {
      var r = ka(n, 134217728);
      if (r !== null) {
        var l = or();
        Qr(r, n, 134217728, l);
      }
      yf(n, 134217728);
    }
  }, wi = function(n) {
    if (n.tag === 13) {
      var r = Hi(n), l = ka(n, r);
      if (l !== null) {
        var u = or();
        Qr(l, n, r, u);
      }
      yf(n, r);
    }
  }, jt = function() {
    return Zt;
  }, nu = function(n, r) {
    var l = Zt;
    try {
      return Zt = n, r();
    } finally {
      Zt = l;
    }
  }, Xt = function(n, r, l) {
    switch (r) {
      case "input":
        if (En(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var u = l[r];
            if (u !== n && u.form === n.form) {
              var f = Hn(u);
              if (!f) throw Error(b(90));
              Wn(u), En(u, f);
            }
          }
        }
        break;
      case "textarea":
        Ye(n, l);
        break;
      case "select":
        r = l.value, r != null && Sn(n, !!l.multiple, r, !1);
    }
  }, li = Kd, Ei = Mo;
  var Dy = { usingClientEntryPoint: !1, Events: [ut, di, Hn, za, xi, Kd] }, Is = { findFiberByHostInstance: yo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Cm = { bundleType: Is.bundleType, version: Is.version, rendererPackageName: Is.rendererPackageName, rendererConfig: Is.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: xe.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = k(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Is.findFiberByHostInstance || xm, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ql = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ql.isDisabled && Ql.supportsFiber) try {
      Cl = Ql.inject(Cm), oa = Ql;
    } catch {
    }
  }
  return ai.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Dy, ai.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!rp(r)) throw Error(b(200));
    return jy(n, r, null, l);
  }, ai.createRoot = function(n, r) {
    if (!rp(n)) throw Error(b(299));
    var l = !1, u = "", f = zo;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (f = r.onRecoverableError)), r = vf(n, 1, !1, null, null, l, !1, u, f), n[el] = r.current, fu(n.nodeType === 8 ? n.parentNode : n), new np(r);
  }, ai.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(b(188)) : (n = Object.keys(n).join(","), Error(b(268, n)));
    return n = k(r), n = n === null ? null : n.stateNode, n;
  }, ai.flushSync = function(n) {
    return Mo(n);
  }, ai.hydrate = function(n, r, l) {
    if (!Sf(r)) throw Error(b(200));
    return Vs(null, n, r, !0, l);
  }, ai.hydrateRoot = function(n, r, l) {
    if (!rp(n)) throw Error(b(405));
    var u = l != null && l.hydratedSources || null, f = !1, p = "", y = zo;
    if (l != null && (l.unstable_strictMode === !0 && (f = !0), l.identifierPrefix !== void 0 && (p = l.identifierPrefix), l.onRecoverableError !== void 0 && (y = l.onRecoverableError)), r = Sm(r, null, n, 1, l ?? null, f, !1, p, y), n[el] = r.current, fu(n), u) for (n = 0; n < u.length; n++) l = u[n], f = l._getVersion, f = f(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, f] : r.mutableSourceEagerHydrationData.push(
      l,
      f
    );
    return new gf(r);
  }, ai.render = function(n, r, l) {
    if (!Sf(r)) throw Error(b(200));
    return Vs(null, n, r, !1, l);
  }, ai.unmountComponentAtNode = function(n) {
    if (!Sf(n)) throw Error(b(40));
    return n._reactRootContainer ? (Mo(function() {
      Vs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[el] = null;
      });
    }), !0) : !1;
  }, ai.unstable_batchedUpdates = Kd, ai.unstable_renderSubtreeIntoContainer = function(n, r, l, u) {
    if (!Sf(l)) throw Error(b(200));
    if (n == null || n._reactInternals === void 0) throw Error(b(38));
    return Vs(n, r, l, !1, u);
  }, ai.version = "18.3.1-next-f1338f8080-20240426", ai;
}
var ii = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ew;
function Aj() {
  return Ew || (Ew = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var x = N, S = jw(), b = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, X = !1;
    function J(e) {
      X = e;
    }
    function R(e) {
      if (!X) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        K("warn", e, a);
      }
    }
    function g(e) {
      if (!X) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        K("error", e, a);
      }
    }
    function K(e, t, a) {
      {
        var i = b.ReactDebugCurrentFrame, o = i.getStackAddendum();
        o !== "" && (t += "%s", a = a.concat([o]));
        var s = a.map(function(d) {
          return String(d);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var O = 0, U = 1, be = 2, z = 3, Y = 4, ae = 5, se = 6, re = 7, Se = 8, He = 9, ue = 10, _e = 11, xe = 12, fe = 13, pe = 14, W = 15, we = 16, de = 17, Te = 18, Le = 19, Ke = 21, te = 22, Ae = 23, at = 24, ct = 25, Ne = !0, ye = !1, Ve = !1, je = !1, D = !1, P = !0, ee = !0, ve = !0, wt = !0, kt = /* @__PURE__ */ new Set(), St = {}, yt = {};
    function xt(e, t) {
      Bt(e, t), Bt(e + "Capture", t);
    }
    function Bt(e, t) {
      St[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), St[e] = t;
      {
        var a = e.toLowerCase();
        yt[a] = e, e === "onDoubleClick" && (yt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        kt.add(t[i]);
    }
    var _n = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Wn = Object.prototype.hasOwnProperty;
    function yn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function gn(e) {
      try {
        return Tn(e), !1;
      } catch {
        return !0;
      }
    }
    function Tn(e) {
      return "" + e;
    }
    function _t(e, t) {
      if (gn(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, yn(e)), Tn(e);
    }
    function En(e) {
      if (gn(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", yn(e)), Tn(e);
    }
    function Rn(e, t) {
      if (gn(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, yn(e)), Tn(e);
    }
    function $n(e, t) {
      if (gn(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, yn(e)), Tn(e);
    }
    function kn(e) {
      if (gn(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", yn(e)), Tn(e);
    }
    function Sn(e) {
      if (gn(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", yn(e)), Tn(e);
    }
    var Cn = 0, V = 1, Ye = 2, Et = 3, Ct = 4, Mr = 5, ra = 6, wa = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", Oe = wa + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", nt = new RegExp("^[" + wa + "][" + Oe + "]*$"), ot = {}, Wt = {};
    function sn(e) {
      return Wn.call(Wt, e) ? !0 : Wn.call(ot, e) ? !1 : nt.test(e) ? (Wt[e] = !0, !0) : (ot[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function jn(e, t, a) {
      return t !== null ? t.type === Cn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function cn(e, t, a, i) {
      if (a !== null && a.type === Cn)
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
          var o = e.toLowerCase().slice(0, 5);
          return o !== "data-" && o !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Nn(e, t, a, i) {
      if (t === null || typeof t > "u" || cn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Et:
            return !t;
          case Ct:
            return t === !1;
          case Mr:
            return isNaN(t);
          case ra:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function ln(e) {
      return Xt.hasOwnProperty(e) ? Xt[e] : null;
    }
    function qt(e, t, a, i, o, s, d) {
      this.acceptsBooleans = t === Ye || t === Et || t === Ct, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = d;
    }
    var Xt = {}, Hr = [
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
    Hr.forEach(function(e) {
      Xt[e] = new qt(
        e,
        Cn,
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
      Xt[t] = new qt(
        t,
        V,
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
      Xt[e] = new qt(
        e,
        Ye,
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
      Xt[e] = new qt(
        e,
        Ye,
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
      Xt[e] = new qt(
        e,
        Et,
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
      Xt[e] = new qt(
        e,
        Et,
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
      Xt[e] = new qt(
        e,
        Ct,
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
      Xt[e] = new qt(
        e,
        ra,
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
      Xt[e] = new qt(
        e,
        Mr,
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
    var Qn = /[\-\:]([a-z])/g, aa = function(e) {
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
      var t = e.replace(Qn, aa);
      Xt[t] = new qt(
        t,
        V,
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
      var t = e.replace(Qn, aa);
      Xt[t] = new qt(
        t,
        V,
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
      var t = e.replace(Qn, aa);
      Xt[t] = new qt(
        t,
        V,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        V,
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
    var za = "xlinkHref";
    Xt[za] = new qt(
      "xlinkHref",
      V,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Xt[e] = new qt(
        e,
        V,
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
    var xi = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, li = !1;
    function Ei(e) {
      !li && xi.test(e) && (li = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function Ci(e, t, a, i) {
      if (i.mustUseProperty) {
        var o = i.propertyName;
        return e[o];
      } else {
        _t(a, t), i.sanitizeURL && Ei("" + a);
        var s = i.attributeName, d = null;
        if (i.type === Ct) {
          if (e.hasAttribute(s)) {
            var v = e.getAttribute(s);
            return v === "" ? !0 : Nn(t, a, i, !1) ? v : v === "" + a ? a : v;
          }
        } else if (e.hasAttribute(s)) {
          if (Nn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Et)
            return a;
          d = e.getAttribute(s);
        }
        return Nn(t, a, i, !1) ? d === null ? a : d : d === "" + a ? a : d;
      }
    }
    function ia(e, t, a, i) {
      {
        if (!sn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return _t(a, t), o === "" + a ? a : o;
      }
    }
    function Er(e, t, a, i) {
      var o = ln(t);
      if (!jn(t, o, i)) {
        if (Nn(t, a, o, i) && (a = null), i || o === null) {
          if (sn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (_t(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var d = o.mustUseProperty;
        if (d) {
          var v = o.propertyName;
          if (a === null) {
            var m = o.type;
            e[v] = m === Et ? !1 : "";
          } else
            e[v] = a;
          return;
        }
        var E = o.attributeName, C = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(E);
        else {
          var M = o.type, L;
          M === Et || M === Ct && a === !0 ? L = "" : (_t(a, E), L = "" + a, o.sanitizeURL && Ei(L.toString())), C ? e.setAttributeNS(C, E, L) : e.setAttribute(E, L);
        }
      }
    }
    var Un = Symbol.for("react.element"), sr = Symbol.for("react.portal"), la = Symbol.for("react.fragment"), zn = Symbol.for("react.strict_mode"), Fa = Symbol.for("react.profiler"), Pa = Symbol.for("react.provider"), T = Symbol.for("react.context"), me = Symbol.for("react.forward_ref"), Me = Symbol.for("react.suspense"), We = Symbol.for("react.suspense_list"), Nt = Symbol.for("react.memo"), Tt = Symbol.for("react.lazy"), At = Symbol.for("react.scope"), Z = Symbol.for("react.debug_trace_mode"), k = Symbol.for("react.offscreen"), oe = Symbol.for("react.legacy_hidden"), et = Symbol.for("react.cache"), vt = Symbol.for("react.tracing_marker"), zt = Symbol.iterator, Qt = "@@iterator";
    function rt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = zt && e[zt] || e[Qt];
      return typeof t == "function" ? t : null;
    }
    var qe = Object.assign, Fn = 0, Ln, cr, bi, qo, Cl, oa, Qu;
    function Br() {
    }
    Br.__reactDisabledLog = !0;
    function cc() {
      {
        if (Fn === 0) {
          Ln = console.log, cr = console.info, bi = console.warn, qo = console.error, Cl = console.group, oa = console.groupCollapsed, Qu = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Br,
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
        Fn++;
      }
    }
    function fc() {
      {
        if (Fn--, Fn === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: qe({}, e, {
              value: Ln
            }),
            info: qe({}, e, {
              value: cr
            }),
            warn: qe({}, e, {
              value: bi
            }),
            error: qe({}, e, {
              value: qo
            }),
            group: qe({}, e, {
              value: Cl
            }),
            groupCollapsed: qe({}, e, {
              value: oa
            }),
            groupEnd: qe({}, e, {
              value: Qu
            })
          });
        }
        Fn < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Xo = b.ReactCurrentDispatcher, bl;
    function _a(e, t, a) {
      {
        if (bl === void 0)
          try {
            throw Error();
          } catch (o) {
            var i = o.stack.trim().match(/\n( *(at )?)/);
            bl = i && i[1] || "";
          }
        return `
` + bl + e;
      }
    }
    var oi = !1, ui;
    {
      var Jo = typeof WeakMap == "function" ? WeakMap : Map;
      ui = new Jo();
    }
    function lo(e, t) {
      if (!e || oi)
        return "";
      {
        var a = ui.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      oi = !0;
      var o = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Xo.current, Xo.current = null, cc();
      try {
        if (t) {
          var d = function() {
            throw Error();
          };
          if (Object.defineProperty(d.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(d, []);
            } catch (q) {
              i = q;
            }
            Reflect.construct(e, [], d);
          } else {
            try {
              d.call();
            } catch (q) {
              i = q;
            }
            e.call(d.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (q) {
            i = q;
          }
          e();
        }
      } catch (q) {
        if (q && i && typeof q.stack == "string") {
          for (var v = q.stack.split(`
`), m = i.stack.split(`
`), E = v.length - 1, C = m.length - 1; E >= 1 && C >= 0 && v[E] !== m[C]; )
            C--;
          for (; E >= 1 && C >= 0; E--, C--)
            if (v[E] !== m[C]) {
              if (E !== 1 || C !== 1)
                do
                  if (E--, C--, C < 0 || v[E] !== m[C]) {
                    var M = `
` + v[E].replace(" at new ", " at ");
                    return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), typeof e == "function" && ui.set(e, M), M;
                  }
                while (E >= 1 && C >= 0);
              break;
            }
        }
      } finally {
        oi = !1, Xo.current = s, fc(), Error.prepareStackTrace = o;
      }
      var L = e ? e.displayName || e.name : "", $ = L ? _a(L) : "";
      return typeof e == "function" && ui.set(e, $), $;
    }
    function wl(e, t, a) {
      return lo(e, !0);
    }
    function Zo(e, t, a) {
      return lo(e, !1);
    }
    function eu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Gi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return lo(e, eu(e));
      if (typeof e == "string")
        return _a(e);
      switch (e) {
        case Me:
          return _a("Suspense");
        case We:
          return _a("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case me:
            return Zo(e.render);
          case Nt:
            return Gi(e.type, t, a);
          case Tt: {
            var i = e, o = i._payload, s = i._init;
            try {
              return Gi(s(o), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Jf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ae:
          return _a(e.type);
        case we:
          return _a("Lazy");
        case fe:
          return _a("Suspense");
        case Le:
          return _a("SuspenseList");
        case O:
        case be:
        case W:
          return Zo(e.type);
        case _e:
          return Zo(e.type.render);
        case U:
          return wl(e.type);
        default:
          return "";
      }
    }
    function Ki(e) {
      try {
        var t = "", a = e;
        do
          t += Jf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Zt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function tu(e) {
      return e.displayName || "Context";
    }
    function Gt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case la:
          return "Fragment";
        case sr:
          return "Portal";
        case Fa:
          return "Profiler";
        case zn:
          return "StrictMode";
        case Me:
          return "Suspense";
        case We:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case T:
            var t = e;
            return tu(t) + ".Consumer";
          case Pa:
            var a = e;
            return tu(a._context) + ".Provider";
          case me:
            return Zt(e, e.render, "ForwardRef");
          case Nt:
            var i = e.displayName || null;
            return i !== null ? i : Gt(e.type) || "Memo";
          case Tt: {
            var o = e, s = o._payload, d = o._init;
            try {
              return Gt(d(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Gu(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function wi(e) {
      return e.displayName || "Context";
    }
    function jt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case at:
          return "Cache";
        case He:
          var i = a;
          return wi(i) + ".Consumer";
        case ue:
          var o = a;
          return wi(o._context) + ".Provider";
        case Te:
          return "DehydratedFragment";
        case _e:
          return Gu(a, a.render, "ForwardRef");
        case re:
          return "Fragment";
        case ae:
          return a;
        case Y:
          return "Portal";
        case z:
          return "Root";
        case se:
          return "Text";
        case we:
          return Gt(a);
        case Se:
          return a === zn ? "StrictMode" : "Mode";
        case te:
          return "Offscreen";
        case xe:
          return "Profiler";
        case Ke:
          return "Scope";
        case fe:
          return "Suspense";
        case Le:
          return "SuspenseList";
        case ct:
          return "TracingMarker";
        case U:
        case O:
        case de:
        case be:
        case pe:
        case W:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var nu = b.ReactDebugCurrentFrame, Cr = null, _i = !1;
    function Vr() {
      {
        if (Cr === null)
          return null;
        var e = Cr._debugOwner;
        if (e !== null && typeof e < "u")
          return jt(e);
      }
      return null;
    }
    function Ti() {
      return Cr === null ? "" : Ki(Cr);
    }
    function Dn() {
      nu.getCurrentStack = null, Cr = null, _i = !1;
    }
    function fn(e) {
      nu.getCurrentStack = e === null ? null : Ti, Cr = e, _i = !1;
    }
    function _l() {
      return Cr;
    }
    function fr(e) {
      _i = e;
    }
    function Ir(e) {
      return "" + e;
    }
    function Ha(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Sn(e), e;
        default:
          return "";
      }
    }
    var oo = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Ku(e, t) {
      oo[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qu(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Tl(e) {
      return e._valueTracker;
    }
    function uo(e) {
      e._valueTracker = null;
    }
    function Zf(e) {
      var t = "";
      return e && (qu(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Ba(e) {
      var t = qu(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Sn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(v) {
            Sn(v), i = "" + v, s.call(this, v);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var d = {
          getValue: function() {
            return i;
          },
          setValue: function(v) {
            Sn(v), i = "" + v;
          },
          stopTracking: function() {
            uo(e), delete e[t];
          }
        };
        return d;
      }
    }
    function si(e) {
      Tl(e) || (e._valueTracker = Ba(e));
    }
    function Ri(e) {
      if (!e)
        return !1;
      var t = Tl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Zf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Va(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var ru = !1, au = !1, Rl = !1, so = !1;
    function iu(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function lu(e, t) {
      var a = e, i = t.checked, o = qe({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return o;
    }
    function ci(e, t) {
      Ku("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !au && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Vr() || "A component", t.type), au = !0), t.value !== void 0 && t.defaultValue !== void 0 && !ru && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Vr() || "A component", t.type), ru = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Ha(t.value != null ? t.value : i),
        controlled: iu(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && Er(a, "checked", i, !1);
    }
    function _(e, t) {
      var a = e;
      {
        var i = iu(t);
        !a._wrapperState.controlled && i && !so && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), so = !0), a._wrapperState.controlled && !i && !Rl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Rl = !0);
      }
      h(e, t);
      var o = Ha(t.value), s = t.type;
      if (o != null)
        s === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = Ir(o)) : a.value !== Ir(o) && (a.value = Ir(o));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? ft(a, t.type, o) : t.hasOwnProperty("defaultValue") && ft(a, t.type, Ha(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function Q(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, s = o === "submit" || o === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var d = Ir(i._wrapperState.initialValue);
        a || d !== i.value && (i.value = d), i.defaultValue = d;
      }
      var v = i.name;
      v !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, v !== "" && (i.name = v);
    }
    function ne(e, t) {
      var a = e;
      _(a, t), De(a, t);
    }
    function De(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        _t(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < o.length; s++) {
          var d = o[s];
          if (!(d === e || d.form !== e.form)) {
            var v = Hm(d);
            if (!v)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Ri(d), _(d, v);
          }
        }
      }
    }
    function ft(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Va(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Ir(e._wrapperState.initialValue) : e.defaultValue !== Ir(a) && (e.defaultValue = Ir(a)));
    }
    var ze = !1, mt = !1, Ft = !1;
    function Kt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? x.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || mt || (mt = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Ft || (Ft = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ze && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ze = !0);
    }
    function bn(e, t) {
      t.value != null && e.setAttribute("value", Ir(Ha(t.value)));
    }
    var dn = Array.isArray;
    function Mt(e) {
      return dn(e);
    }
    var pn;
    pn = !1;
    function Pn() {
      var e = Vr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var kl = ["value", "defaultValue"];
    function Xu(e) {
      {
        Ku("select", e);
        for (var t = 0; t < kl.length; t++) {
          var a = kl[t];
          if (e[a] != null) {
            var i = Mt(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Pn()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Pn());
          }
        }
      }
    }
    function qi(e, t, a, i) {
      var o = e.options;
      if (t) {
        for (var s = a, d = {}, v = 0; v < s.length; v++)
          d["$" + s[v]] = !0;
        for (var m = 0; m < o.length; m++) {
          var E = d.hasOwnProperty("$" + o[m].value);
          o[m].selected !== E && (o[m].selected = E), E && i && (o[m].defaultSelected = !0);
        }
      } else {
        for (var C = Ir(Ha(a)), M = null, L = 0; L < o.length; L++) {
          if (o[L].value === C) {
            o[L].selected = !0, i && (o[L].defaultSelected = !0);
            return;
          }
          M === null && !o[L].disabled && (M = o[L]);
        }
        M !== null && (M.selected = !0);
      }
    }
    function Ju(e, t) {
      return qe({}, t, {
        value: void 0
      });
    }
    function co(e, t) {
      var a = e;
      Xu(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !pn && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), pn = !0);
    }
    function ed(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? qi(a, !!t.multiple, i, !1) : t.defaultValue != null && qi(a, !!t.multiple, t.defaultValue, !0);
    }
    function dc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var o = t.value;
      o != null ? qi(a, !!t.multiple, o, !1) : i !== !!t.multiple && (t.defaultValue != null ? qi(a, !!t.multiple, t.defaultValue, !0) : qi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function td(e, t) {
      var a = e, i = t.value;
      i != null && qi(a, !!t.multiple, i, !1);
    }
    var sv = !1;
    function nd(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = qe({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Ir(a._wrapperState.initialValue)
      });
      return i;
    }
    function rd(e, t) {
      var a = e;
      Ku("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !sv && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Vr() || "A component"), sv = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, s = t.defaultValue;
        if (o != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Mt(o)) {
              if (o.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              o = o[0];
            }
            s = o;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: Ha(i)
      };
    }
    function cv(e, t) {
      var a = e, i = Ha(t.value), o = Ha(t.defaultValue);
      if (i != null) {
        var s = Ir(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      o != null && (a.defaultValue = Ir(o));
    }
    function fv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ly(e, t) {
      cv(e, t);
    }
    var Xi = "http://www.w3.org/1999/xhtml", ad = "http://www.w3.org/1998/Math/MathML", id = "http://www.w3.org/2000/svg";
    function ld(e) {
      switch (e) {
        case "svg":
          return id;
        case "math":
          return ad;
        default:
          return Xi;
      }
    }
    function od(e, t) {
      return e == null || e === Xi ? ld(t) : e === id && t === "foreignObject" ? Xi : e;
    }
    var dv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, o) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, o);
        });
      } : e;
    }, pc, pv = dv(function(e, t) {
      if (e.namespaceURI === id && !("innerHTML" in e)) {
        pc = pc || document.createElement("div"), pc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = pc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), ua = 1, Ji = 3, er = 8, Zi = 9, ud = 11, ou = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Ji) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Zu = {
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
    }, es = {
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
    function vv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var mv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(es).forEach(function(e) {
      mv.forEach(function(t) {
        es[vv(t, e)] = es[e];
      });
    });
    function vc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(es.hasOwnProperty(e) && es[e]) ? t + "px" : ($n(t, e), ("" + t).trim());
    }
    var hv = /([A-Z])/g, yv = /^ms-/;
    function uu(e) {
      return e.replace(hv, "-$1").toLowerCase().replace(yv, "-ms-");
    }
    var gv = function() {
    };
    {
      var oy = /^(?:webkit|moz|o)[A-Z]/, uy = /^-ms-/, Sv = /-(.)/g, sd = /;\s*$/, ki = {}, fo = {}, xv = !1, ts = !1, sy = function(e) {
        return e.replace(Sv, function(t, a) {
          return a.toUpperCase();
        });
      }, Ev = function(e) {
        ki.hasOwnProperty(e) && ki[e] || (ki[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          sy(e.replace(uy, "ms-"))
        ));
      }, cd = function(e) {
        ki.hasOwnProperty(e) && ki[e] || (ki[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, fd = function(e, t) {
        fo.hasOwnProperty(t) && fo[t] || (fo[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(sd, "")));
      }, Cv = function(e, t) {
        xv || (xv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, bv = function(e, t) {
        ts || (ts = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      gv = function(e, t) {
        e.indexOf("-") > -1 ? Ev(e) : oy.test(e) ? cd(e) : sd.test(t) && fd(e, t), typeof t == "number" && (isNaN(t) ? Cv(e, t) : isFinite(t) || bv(e, t));
      };
    }
    var wv = gv;
    function cy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var o = e[i];
            if (o != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : uu(i)) + ":", t += vc(i, o, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function _v(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var o = i.indexOf("--") === 0;
          o || wv(i, t[i]);
          var s = vc(i, t[i], o);
          i === "float" && (i = "cssFloat"), o ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function fy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Tv(e) {
      var t = {};
      for (var a in e)
        for (var i = Zu[a] || [a], o = 0; o < i.length; o++)
          t[i[o]] = a;
      return t;
    }
    function dy(e, t) {
      {
        if (!t)
          return;
        var a = Tv(e), i = Tv(t), o = {};
        for (var s in a) {
          var d = a[s], v = i[s];
          if (v && d !== v) {
            var m = d + "," + v;
            if (o[m])
              continue;
            o[m] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", fy(e[d]) ? "Removing" : "Updating", d, v);
          }
        }
      }
    }
    var fi = {
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
    }, ns = qe({
      menuitem: !0
    }, fi), Rv = "__html";
    function mc(e, t) {
      if (t) {
        if (ns[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Rv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function jl(e, t) {
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
    var rs = {
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
    }, hc = {
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
    }, su = {}, py = new RegExp("^(aria)-[" + Oe + "]*$"), cu = new RegExp("^(aria)[A-Z][" + Oe + "]*$");
    function dd(e, t) {
      {
        if (Wn.call(su, t) && su[t])
          return !0;
        if (cu.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = hc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), su[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), su[t] = !0, !0;
        }
        if (py.test(t)) {
          var o = t.toLowerCase(), s = hc.hasOwnProperty(o) ? o : null;
          if (s == null)
            return su[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), su[t] = !0, !0;
        }
      }
      return !0;
    }
    function as(e, t) {
      {
        var a = [];
        for (var i in t) {
          var o = dd(e, i);
          o || a.push(i);
        }
        var s = a.map(function(d) {
          return "`" + d + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function pd(e, t) {
      jl(e, t) || as(e, t);
    }
    var vd = !1;
    function yc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !vd && (vd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var po = function() {
    };
    {
      var br = {}, md = /^on./, gc = /^on[^A-Z]/, kv = new RegExp("^(aria)-[" + Oe + "]*$"), jv = new RegExp("^(aria)[A-Z][" + Oe + "]*$");
      po = function(e, t, a, i) {
        if (Wn.call(br, t) && br[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), br[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, d = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var v = d.hasOwnProperty(o) ? d[o] : null;
          if (v != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, v), br[t] = !0, !0;
          if (md.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), br[t] = !0, !0;
        } else if (md.test(t))
          return gc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), br[t] = !0, !0;
        if (kv.test(t) || jv.test(t))
          return !0;
        if (o === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), br[t] = !0, !0;
        if (o === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), br[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), br[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), br[t] = !0, !0;
        var m = ln(t), E = m !== null && m.type === Cn;
        if (rs.hasOwnProperty(o)) {
          var C = rs[o];
          if (C !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, C), br[t] = !0, !0;
        } else if (!E && t !== o)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), br[t] = !0, !0;
        return typeof a == "boolean" && cn(t, a, m, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), br[t] = !0, !0) : E ? !0 : cn(t, a, m, !1) ? (br[t] = !0, !1) : ((a === "false" || a === "true") && m !== null && m.type === Et && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), br[t] = !0), !0);
      };
    }
    var Nv = function(e, t, a) {
      {
        var i = [];
        for (var o in t) {
          var s = po(e, o, t[o], a);
          s || i.push(o);
        }
        var d = i.map(function(v) {
          return "`" + v + "`";
        }).join(", ");
        i.length === 1 ? g("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", d, e) : i.length > 1 && g("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", d, e);
      }
    };
    function Dv(e, t, a) {
      jl(e, t) || Nv(e, t, a);
    }
    var hd = 1, Sc = 2, Ia = 4, yd = hd | Sc | Ia, vo = null;
    function vy(e) {
      vo !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), vo = e;
    }
    function my() {
      vo === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), vo = null;
    }
    function is(e) {
      return e === vo;
    }
    function gd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Ji ? t.parentNode : t;
    }
    var xc = null, mo = null, on = null;
    function Ec(e) {
      var t = Du(e);
      if (t) {
        if (typeof xc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Hm(a);
          xc(t.stateNode, t.type, i);
        }
      }
    }
    function Cc(e) {
      xc = e;
    }
    function fu(e) {
      mo ? on ? on.push(e) : on = [e] : mo = e;
    }
    function Ov() {
      return mo !== null || on !== null;
    }
    function bc() {
      if (mo) {
        var e = mo, t = on;
        if (mo = null, on = null, Ec(e), t)
          for (var a = 0; a < t.length; a++)
            Ec(t[a]);
      }
    }
    var du = function(e, t) {
      return e(t);
    }, ls = function() {
    }, Nl = !1;
    function Lv() {
      var e = Ov();
      e && (ls(), bc());
    }
    function Av(e, t, a) {
      if (Nl)
        return e(t, a);
      Nl = !0;
      try {
        return du(e, t, a);
      } finally {
        Nl = !1, Lv();
      }
    }
    function hy(e, t, a) {
      du = e, ls = a;
    }
    function Mv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function wc(e, t, a) {
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
          return !!(a.disabled && Mv(t));
        default:
          return !1;
      }
    }
    function Dl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Hm(a);
      if (i === null)
        return null;
      var o = i[t];
      if (wc(t, e.type, i))
        return null;
      if (o && typeof o != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof o + "` type.");
      return o;
    }
    var os = !1;
    if (_n)
      try {
        var ho = {};
        Object.defineProperty(ho, "passive", {
          get: function() {
            os = !0;
          }
        }), window.addEventListener("test", ho, ho), window.removeEventListener("test", ho, ho);
      } catch {
        os = !1;
      }
    function _c(e, t, a, i, o, s, d, v, m) {
      var E = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, E);
      } catch (C) {
        this.onError(C);
      }
    }
    var Tc = _c;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var Sd = document.createElement("react");
      Tc = function(t, a, i, o, s, d, v, m, E) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var C = document.createEvent("Event"), M = !1, L = !0, $ = window.event, q = Object.getOwnPropertyDescriptor(window, "event");
        function ie() {
          Sd.removeEventListener(le, dt, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = $);
        }
        var Pe = Array.prototype.slice.call(arguments, 3);
        function dt() {
          M = !0, ie(), a.apply(i, Pe), L = !1;
        }
        var it, Yt = !1, Pt = !1;
        function H(B) {
          if (it = B.error, Yt = !0, it === null && B.colno === 0 && B.lineno === 0 && (Pt = !0), B.defaultPrevented && it != null && typeof it == "object")
            try {
              it._suppressLogging = !0;
            } catch {
            }
        }
        var le = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", H), Sd.addEventListener(le, dt, !1), C.initEvent(le, !1, !1), Sd.dispatchEvent(C), q && Object.defineProperty(window, "event", q), M && L && (Yt ? Pt && (it = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : it = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(it)), window.removeEventListener("error", H), !M)
          return ie(), _c.apply(this, arguments);
      };
    }
    var Uv = Tc, pu = !1, Rc = null, vu = !1, ji = null, zv = {
      onError: function(e) {
        pu = !0, Rc = e;
      }
    };
    function Ol(e, t, a, i, o, s, d, v, m) {
      pu = !1, Rc = null, Uv.apply(zv, arguments);
    }
    function Ni(e, t, a, i, o, s, d, v, m) {
      if (Ol.apply(this, arguments), pu) {
        var E = ss();
        vu || (vu = !0, ji = E);
      }
    }
    function us() {
      if (vu) {
        var e = ji;
        throw vu = !1, ji = null, e;
      }
    }
    function el() {
      return pu;
    }
    function ss() {
      if (pu) {
        var e = Rc;
        return pu = !1, Rc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function mu(e) {
      return e._reactInternals;
    }
    function yy(e) {
      return e._reactInternals !== void 0;
    }
    function yo(e, t) {
      e._reactInternals = t;
    }
    var ut = (
      /*                      */
      0
    ), di = (
      /*                */
      1
    ), Hn = (
      /*                    */
      2
    ), Vt = (
      /*                       */
      4
    ), $a = (
      /*                */
      16
    ), Ya = (
      /*                 */
      32
    ), wn = (
      /*                     */
      64
    ), lt = (
      /*                   */
      128
    ), Ur = (
      /*            */
      256
    ), Yn = (
      /*                          */
      512
    ), dr = (
      /*                     */
      1024
    ), sa = (
      /*                      */
      2048
    ), ca = (
      /*                    */
      4096
    ), tr = (
      /*                   */
      8192
    ), hu = (
      /*             */
      16384
    ), Fv = (
      /*               */
      32767
    ), cs = (
      /*                   */
      32768
    ), hr = (
      /*                */
      65536
    ), kc = (
      /* */
      131072
    ), Di = (
      /*                       */
      1048576
    ), yu = (
      /*                    */
      2097152
    ), tl = (
      /*                 */
      4194304
    ), jc = (
      /*                */
      8388608
    ), Ll = (
      /*               */
      16777216
    ), Oi = (
      /*              */
      33554432
    ), Al = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Vt | dr | 0
    ), Ml = Hn | Vt | $a | Ya | Yn | ca | tr, Ul = Vt | wn | Yn | tr, nl = sa | $a, nr = tl | jc | yu, Wa = b.ReactCurrentOwner;
    function Ta(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (Hn | ca)) !== ut && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === z ? a : null;
    }
    function Li(e) {
      if (e.tag === fe) {
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
    function Ai(e) {
      return e.tag === z ? e.stateNode.containerInfo : null;
    }
    function go(e) {
      return Ta(e) === e;
    }
    function Pv(e) {
      {
        var t = Wa.current;
        if (t !== null && t.tag === U) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", jt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = mu(e);
      return o ? Ta(o) === o : !1;
    }
    function Nc(e) {
      if (Ta(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Dc(e) {
      var t = e.alternate;
      if (!t) {
        var a = Ta(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, o = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var d = s.alternate;
        if (d === null) {
          var v = s.return;
          if (v !== null) {
            i = o = v;
            continue;
          }
          break;
        }
        if (s.child === d.child) {
          for (var m = s.child; m; ) {
            if (m === i)
              return Nc(s), e;
            if (m === o)
              return Nc(s), t;
            m = m.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== o.return)
          i = s, o = d;
        else {
          for (var E = !1, C = s.child; C; ) {
            if (C === i) {
              E = !0, i = s, o = d;
              break;
            }
            if (C === o) {
              E = !0, o = s, i = d;
              break;
            }
            C = C.sibling;
          }
          if (!E) {
            for (C = d.child; C; ) {
              if (C === i) {
                E = !0, i = d, o = s;
                break;
              }
              if (C === o) {
                E = !0, o = d, i = s;
                break;
              }
              C = C.sibling;
            }
            if (!E)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== o)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== z)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function fa(e) {
      var t = Dc(e);
      return t !== null ? da(t) : null;
    }
    function da(e) {
      if (e.tag === ae || e.tag === se)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = da(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function An(e) {
      var t = Dc(e);
      return t !== null ? Qa(t) : null;
    }
    function Qa(e) {
      if (e.tag === ae || e.tag === se)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== Y) {
          var a = Qa(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var xd = S.unstable_scheduleCallback, Hv = S.unstable_cancelCallback, Ed = S.unstable_shouldYield, Cd = S.unstable_requestPaint, pr = S.unstable_now, Oc = S.unstable_getCurrentPriorityLevel, fs = S.unstable_ImmediatePriority, zl = S.unstable_UserBlockingPriority, rl = S.unstable_NormalPriority, gy = S.unstable_LowPriority, So = S.unstable_IdlePriority, Lc = S.unstable_yieldValue, Bv = S.unstable_setDisableYieldValue, xo = null, Gn = null, Fe = null, Ra = !1, pa = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function gu(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        ee && (e = qe({}, e, {
          getLaneLabelMap: Eo,
          injectProfilingHooks: Ga
        })), xo = t.inject(e), Gn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function bd(e, t) {
      if (Gn && typeof Gn.onScheduleFiberRoot == "function")
        try {
          Gn.onScheduleFiberRoot(xo, e, t);
        } catch (a) {
          Ra || (Ra = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function wd(e, t) {
      if (Gn && typeof Gn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & lt) === lt;
          if (ve) {
            var i;
            switch (t) {
              case $r:
                i = fs;
                break;
              case Ui:
                i = zl;
                break;
              case Ka:
                i = rl;
                break;
              case qa:
                i = So;
                break;
              default:
                i = rl;
                break;
            }
            Gn.onCommitFiberRoot(xo, e, i, a);
          }
        } catch (o) {
          Ra || (Ra = !0, g("React instrumentation encountered an error: %s", o));
        }
    }
    function _d(e) {
      if (Gn && typeof Gn.onPostCommitFiberRoot == "function")
        try {
          Gn.onPostCommitFiberRoot(xo, e);
        } catch (t) {
          Ra || (Ra = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Td(e) {
      if (Gn && typeof Gn.onCommitFiberUnmount == "function")
        try {
          Gn.onCommitFiberUnmount(xo, e);
        } catch (t) {
          Ra || (Ra = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Bn(e) {
      if (typeof Lc == "function" && (Bv(e), J(e)), Gn && typeof Gn.setStrictMode == "function")
        try {
          Gn.setStrictMode(xo, e);
        } catch (t) {
          Ra || (Ra = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Ga(e) {
      Fe = e;
    }
    function Eo() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < wo; a++) {
          var i = Yv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Rd(e) {
      Fe !== null && typeof Fe.markCommitStarted == "function" && Fe.markCommitStarted(e);
    }
    function kd() {
      Fe !== null && typeof Fe.markCommitStopped == "function" && Fe.markCommitStopped();
    }
    function ka(e) {
      Fe !== null && typeof Fe.markComponentRenderStarted == "function" && Fe.markComponentRenderStarted(e);
    }
    function ja() {
      Fe !== null && typeof Fe.markComponentRenderStopped == "function" && Fe.markComponentRenderStopped();
    }
    function jd(e) {
      Fe !== null && typeof Fe.markComponentPassiveEffectMountStarted == "function" && Fe.markComponentPassiveEffectMountStarted(e);
    }
    function Vv() {
      Fe !== null && typeof Fe.markComponentPassiveEffectMountStopped == "function" && Fe.markComponentPassiveEffectMountStopped();
    }
    function al(e) {
      Fe !== null && typeof Fe.markComponentPassiveEffectUnmountStarted == "function" && Fe.markComponentPassiveEffectUnmountStarted(e);
    }
    function Fl() {
      Fe !== null && typeof Fe.markComponentPassiveEffectUnmountStopped == "function" && Fe.markComponentPassiveEffectUnmountStopped();
    }
    function Ac(e) {
      Fe !== null && typeof Fe.markComponentLayoutEffectMountStarted == "function" && Fe.markComponentLayoutEffectMountStarted(e);
    }
    function Iv() {
      Fe !== null && typeof Fe.markComponentLayoutEffectMountStopped == "function" && Fe.markComponentLayoutEffectMountStopped();
    }
    function ds(e) {
      Fe !== null && typeof Fe.markComponentLayoutEffectUnmountStarted == "function" && Fe.markComponentLayoutEffectUnmountStarted(e);
    }
    function Nd() {
      Fe !== null && typeof Fe.markComponentLayoutEffectUnmountStopped == "function" && Fe.markComponentLayoutEffectUnmountStopped();
    }
    function ps(e, t, a) {
      Fe !== null && typeof Fe.markComponentErrored == "function" && Fe.markComponentErrored(e, t, a);
    }
    function Mi(e, t, a) {
      Fe !== null && typeof Fe.markComponentSuspended == "function" && Fe.markComponentSuspended(e, t, a);
    }
    function vs(e) {
      Fe !== null && typeof Fe.markLayoutEffectsStarted == "function" && Fe.markLayoutEffectsStarted(e);
    }
    function ms() {
      Fe !== null && typeof Fe.markLayoutEffectsStopped == "function" && Fe.markLayoutEffectsStopped();
    }
    function Co(e) {
      Fe !== null && typeof Fe.markPassiveEffectsStarted == "function" && Fe.markPassiveEffectsStarted(e);
    }
    function Dd() {
      Fe !== null && typeof Fe.markPassiveEffectsStopped == "function" && Fe.markPassiveEffectsStopped();
    }
    function bo(e) {
      Fe !== null && typeof Fe.markRenderStarted == "function" && Fe.markRenderStarted(e);
    }
    function $v() {
      Fe !== null && typeof Fe.markRenderYielded == "function" && Fe.markRenderYielded();
    }
    function Mc() {
      Fe !== null && typeof Fe.markRenderStopped == "function" && Fe.markRenderStopped();
    }
    function Vn(e) {
      Fe !== null && typeof Fe.markRenderScheduled == "function" && Fe.markRenderScheduled(e);
    }
    function Uc(e, t) {
      Fe !== null && typeof Fe.markForceUpdateScheduled == "function" && Fe.markForceUpdateScheduled(e, t);
    }
    function hs(e, t) {
      Fe !== null && typeof Fe.markStateUpdateScheduled == "function" && Fe.markStateUpdateScheduled(e, t);
    }
    var st = (
      /*                         */
      0
    ), Ut = (
      /*                 */
      1
    ), en = (
      /*                    */
      2
    ), vn = (
      /*               */
      8
    ), tn = (
      /*              */
      16
    ), rr = Math.clz32 ? Math.clz32 : ys, yr = Math.log, zc = Math.LN2;
    function ys(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (yr(t) / zc | 0) | 0;
    }
    var wo = 31, he = (
      /*                        */
      0
    ), Jt = (
      /*                          */
      0
    ), gt = (
      /*                        */
      1
    ), Pl = (
      /*    */
      2
    ), pi = (
      /*             */
      4
    ), zr = (
      /*            */
      8
    ), Kn = (
      /*                     */
      16
    ), il = (
      /*                */
      32
    ), Hl = (
      /*                       */
      4194240
    ), _o = (
      /*                        */
      64
    ), Fc = (
      /*                        */
      128
    ), Pc = (
      /*                        */
      256
    ), Hc = (
      /*                        */
      512
    ), Bc = (
      /*                        */
      1024
    ), Vc = (
      /*                        */
      2048
    ), Ic = (
      /*                        */
      4096
    ), $c = (
      /*                        */
      8192
    ), Yc = (
      /*                        */
      16384
    ), To = (
      /*                       */
      32768
    ), Wc = (
      /*                       */
      65536
    ), Su = (
      /*                       */
      131072
    ), xu = (
      /*                       */
      262144
    ), Qc = (
      /*                       */
      524288
    ), gs = (
      /*                       */
      1048576
    ), Gc = (
      /*                       */
      2097152
    ), Ss = (
      /*                            */
      130023424
    ), Ro = (
      /*                             */
      4194304
    ), Kc = (
      /*                             */
      8388608
    ), xs = (
      /*                             */
      16777216
    ), qc = (
      /*                             */
      33554432
    ), Xc = (
      /*                             */
      67108864
    ), Od = Ro, Es = (
      /*          */
      134217728
    ), Ld = (
      /*                          */
      268435455
    ), Cs = (
      /*               */
      268435456
    ), ko = (
      /*                        */
      536870912
    ), va = (
      /*                   */
      1073741824
    );
    function Yv(e) {
      {
        if (e & gt)
          return "Sync";
        if (e & Pl)
          return "InputContinuousHydration";
        if (e & pi)
          return "InputContinuous";
        if (e & zr)
          return "DefaultHydration";
        if (e & Kn)
          return "Default";
        if (e & il)
          return "TransitionHydration";
        if (e & Hl)
          return "Transition";
        if (e & Ss)
          return "Retry";
        if (e & Es)
          return "SelectiveHydration";
        if (e & Cs)
          return "IdleHydration";
        if (e & ko)
          return "Idle";
        if (e & va)
          return "Offscreen";
      }
    }
    var xn = -1, jo = _o, Jc = Ro;
    function bs(e) {
      switch (Bl(e)) {
        case gt:
          return gt;
        case Pl:
          return Pl;
        case pi:
          return pi;
        case zr:
          return zr;
        case Kn:
          return Kn;
        case il:
          return il;
        case _o:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Yc:
        case To:
        case Wc:
        case Su:
        case xu:
        case Qc:
        case gs:
        case Gc:
          return e & Hl;
        case Ro:
        case Kc:
        case xs:
        case qc:
        case Xc:
          return e & Ss;
        case Es:
          return Es;
        case Cs:
          return Cs;
        case ko:
          return ko;
        case va:
          return va;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Zc(e, t) {
      var a = e.pendingLanes;
      if (a === he)
        return he;
      var i = he, o = e.suspendedLanes, s = e.pingedLanes, d = a & Ld;
      if (d !== he) {
        var v = d & ~o;
        if (v !== he)
          i = bs(v);
        else {
          var m = d & s;
          m !== he && (i = bs(m));
        }
      } else {
        var E = a & ~o;
        E !== he ? i = bs(E) : s !== he && (i = bs(s));
      }
      if (i === he)
        return he;
      if (t !== he && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & o) === he) {
        var C = Bl(i), M = Bl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          C >= M || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          C === Kn && (M & Hl) !== he
        )
          return t;
      }
      (i & pi) !== he && (i |= a & Kn);
      var L = e.entangledLanes;
      if (L !== he)
        for (var $ = e.entanglements, q = i & L; q > 0; ) {
          var ie = ar(q), Pe = 1 << ie;
          i |= $[ie], q &= ~Pe;
        }
      return i;
    }
    function vi(e, t) {
      for (var a = e.eventTimes, i = xn; t > 0; ) {
        var o = ar(t), s = 1 << o, d = a[o];
        d > i && (i = d), t &= ~s;
      }
      return i;
    }
    function Ad(e, t) {
      switch (e) {
        case gt:
        case Pl:
        case pi:
          return t + 250;
        case zr:
        case Kn:
        case il:
        case _o:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Yc:
        case To:
        case Wc:
        case Su:
        case xu:
        case Qc:
        case gs:
        case Gc:
          return t + 5e3;
        case Ro:
        case Kc:
        case xs:
        case qc:
        case Xc:
          return xn;
        case Es:
        case Cs:
        case ko:
        case va:
          return xn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), xn;
      }
    }
    function ef(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, s = e.expirationTimes, d = a; d > 0; ) {
        var v = ar(d), m = 1 << v, E = s[v];
        E === xn ? ((m & i) === he || (m & o) !== he) && (s[v] = Ad(m, t)) : E <= t && (e.expiredLanes |= m), d &= ~m;
      }
    }
    function Wv(e) {
      return bs(e.pendingLanes);
    }
    function tf(e) {
      var t = e.pendingLanes & ~va;
      return t !== he ? t : t & va ? va : he;
    }
    function Qv(e) {
      return (e & gt) !== he;
    }
    function ws(e) {
      return (e & Ld) !== he;
    }
    function No(e) {
      return (e & Ss) === e;
    }
    function Md(e) {
      var t = gt | pi | Kn;
      return (e & t) === he;
    }
    function Ud(e) {
      return (e & Hl) === e;
    }
    function nf(e, t) {
      var a = Pl | pi | zr | Kn;
      return (t & a) !== he;
    }
    function Gv(e, t) {
      return (t & e.expiredLanes) !== he;
    }
    function zd(e) {
      return (e & Hl) !== he;
    }
    function Fd() {
      var e = jo;
      return jo <<= 1, (jo & Hl) === he && (jo = _o), e;
    }
    function Kv() {
      var e = Jc;
      return Jc <<= 1, (Jc & Ss) === he && (Jc = Ro), e;
    }
    function Bl(e) {
      return e & -e;
    }
    function _s(e) {
      return Bl(e);
    }
    function ar(e) {
      return 31 - rr(e);
    }
    function wr(e) {
      return ar(e);
    }
    function ma(e, t) {
      return (e & t) !== he;
    }
    function Do(e, t) {
      return (e & t) === t;
    }
    function Lt(e, t) {
      return e | t;
    }
    function Ts(e, t) {
      return e & ~t;
    }
    function Pd(e, t) {
      return e & t;
    }
    function qv(e) {
      return e;
    }
    function Xv(e, t) {
      return e !== Jt && e < t ? e : t;
    }
    function Rs(e) {
      for (var t = [], a = 0; a < wo; a++)
        t.push(e);
      return t;
    }
    function Eu(e, t, a) {
      e.pendingLanes |= t, t !== ko && (e.suspendedLanes = he, e.pingedLanes = he);
      var i = e.eventTimes, o = wr(t);
      i[o] = a;
    }
    function Jv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = ar(i), s = 1 << o;
        a[o] = xn, i &= ~s;
      }
    }
    function rf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Hd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = he, e.pingedLanes = he, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, o = e.eventTimes, s = e.expirationTimes, d = a; d > 0; ) {
        var v = ar(d), m = 1 << v;
        i[v] = he, o[v] = xn, s[v] = xn, d &= ~m;
      }
    }
    function af(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, o = a; o; ) {
        var s = ar(o), d = 1 << s;
        // Is this one of the newly entangled lanes?
        d & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), o &= ~d;
      }
    }
    function Bd(e, t) {
      var a = Bl(t), i;
      switch (a) {
        case pi:
          i = Pl;
          break;
        case Kn:
          i = zr;
          break;
        case _o:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Yc:
        case To:
        case Wc:
        case Su:
        case xu:
        case Qc:
        case gs:
        case Gc:
        case Ro:
        case Kc:
        case xs:
        case qc:
        case Xc:
          i = il;
          break;
        case ko:
          i = Cs;
          break;
        default:
          i = Jt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Jt ? Jt : i;
    }
    function ks(e, t, a) {
      if (pa)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = wr(a), s = 1 << o, d = i[o];
          d.add(t), a &= ~s;
        }
    }
    function Zv(e, t) {
      if (pa)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = wr(t), s = 1 << o, d = a[o];
          d.size > 0 && (d.forEach(function(v) {
            var m = v.alternate;
            (m === null || !i.has(m)) && i.add(v);
          }), d.clear()), t &= ~s;
        }
    }
    function Vd(e, t) {
      return null;
    }
    var $r = gt, Ui = pi, Ka = Kn, qa = ko, js = Jt;
    function Xa() {
      return js;
    }
    function ir(e) {
      js = e;
    }
    function em(e, t) {
      var a = js;
      try {
        return js = e, t();
      } finally {
        js = a;
      }
    }
    function tm(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ns(e, t) {
      return e > t ? e : t;
    }
    function gr(e, t) {
      return e !== 0 && e < t;
    }
    function nm(e) {
      var t = Bl(e);
      return gr($r, t) ? gr(Ui, t) ? ws(t) ? Ka : qa : Ui : $r;
    }
    function lf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ds;
    function Fr(e) {
      Ds = e;
    }
    function Sy(e) {
      Ds(e);
    }
    var Ge;
    function Cu(e) {
      Ge = e;
    }
    var of;
    function rm(e) {
      of = e;
    }
    var am;
    function Os(e) {
      am = e;
    }
    var Ls;
    function Id(e) {
      Ls = e;
    }
    var uf = !1, As = [], ll = null, zi = null, Fi = null, qn = /* @__PURE__ */ new Map(), Yr = /* @__PURE__ */ new Map(), Wr = [], im = [
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
    function lm(e) {
      return im.indexOf(e) > -1;
    }
    function mi(e, t, a, i, o) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: o,
        targetContainers: [i]
      };
    }
    function $d(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          ll = null;
          break;
        case "dragenter":
        case "dragleave":
          zi = null;
          break;
        case "mouseover":
        case "mouseout":
          Fi = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          qn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Yr.delete(i);
          break;
        }
      }
    }
    function ha(e, t, a, i, o, s) {
      if (e === null || e.nativeEvent !== s) {
        var d = mi(t, a, i, o, s);
        if (t !== null) {
          var v = Du(t);
          v !== null && Ge(v);
        }
        return d;
      }
      e.eventSystemFlags |= i;
      var m = e.targetContainers;
      return o !== null && m.indexOf(o) === -1 && m.push(o), e;
    }
    function xy(e, t, a, i, o) {
      switch (t) {
        case "focusin": {
          var s = o;
          return ll = ha(ll, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var d = o;
          return zi = ha(zi, e, t, a, i, d), !0;
        }
        case "mouseover": {
          var v = o;
          return Fi = ha(Fi, e, t, a, i, v), !0;
        }
        case "pointerover": {
          var m = o, E = m.pointerId;
          return qn.set(E, ha(qn.get(E) || null, e, t, a, i, m)), !0;
        }
        case "gotpointercapture": {
          var C = o, M = C.pointerId;
          return Yr.set(M, ha(Yr.get(M) || null, e, t, a, i, C)), !0;
        }
      }
      return !1;
    }
    function Yd(e) {
      var t = Ws(e.target);
      if (t !== null) {
        var a = Ta(t);
        if (a !== null) {
          var i = a.tag;
          if (i === fe) {
            var o = Li(a);
            if (o !== null) {
              e.blockedOn = o, Ls(e.priority, function() {
                of(a);
              });
              return;
            }
          } else if (i === z) {
            var s = a.stateNode;
            if (lf(s)) {
              e.blockedOn = Ai(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function om(e) {
      for (var t = am(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Wr.length && gr(t, Wr[i].priority); i++)
        ;
      Wr.splice(i, 0, a), i === 0 && Yd(a);
    }
    function Ms(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = wu(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var o = e.nativeEvent, s = new o.constructor(o.type, o);
          vy(s), o.target.dispatchEvent(s), my();
        } else {
          var d = Du(i);
          return d !== null && Ge(d), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Wd(e, t, a) {
      Ms(e) && a.delete(t);
    }
    function Ey() {
      uf = !1, ll !== null && Ms(ll) && (ll = null), zi !== null && Ms(zi) && (zi = null), Fi !== null && Ms(Fi) && (Fi = null), qn.forEach(Wd), Yr.forEach(Wd);
    }
    function Vl(e, t) {
      e.blockedOn === t && (e.blockedOn = null, uf || (uf = !0, S.unstable_scheduleCallback(S.unstable_NormalPriority, Ey)));
    }
    function Oo(e) {
      if (As.length > 0) {
        Vl(As[0], e);
        for (var t = 1; t < As.length; t++) {
          var a = As[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      ll !== null && Vl(ll, e), zi !== null && Vl(zi, e), Fi !== null && Vl(Fi, e);
      var i = function(v) {
        return Vl(v, e);
      };
      qn.forEach(i), Yr.forEach(i);
      for (var o = 0; o < Wr.length; o++) {
        var s = Wr[o];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Wr.length > 0; ) {
        var d = Wr[0];
        if (d.blockedOn !== null)
          break;
        Yd(d), d.blockedOn === null && Wr.shift();
      }
    }
    var _r = b.ReactCurrentBatchConfig, It = !0;
    function vr(e) {
      It = !!e;
    }
    function lr() {
      return It;
    }
    function Tr(e, t, a) {
      var i = sf(t), o;
      switch (i) {
        case $r:
          o = Na;
          break;
        case Ui:
          o = bu;
          break;
        case Ka:
        default:
          o = Xn;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function Na(e, t, a, i) {
      var o = Xa(), s = _r.transition;
      _r.transition = null;
      try {
        ir($r), Xn(e, t, a, i);
      } finally {
        ir(o), _r.transition = s;
      }
    }
    function bu(e, t, a, i) {
      var o = Xa(), s = _r.transition;
      _r.transition = null;
      try {
        ir(Ui), Xn(e, t, a, i);
      } finally {
        ir(o), _r.transition = s;
      }
    }
    function Xn(e, t, a, i) {
      It && Us(e, t, a, i);
    }
    function Us(e, t, a, i) {
      var o = wu(e, t, a, i);
      if (o === null) {
        Fy(e, t, i, Pi, a), $d(e, i);
        return;
      }
      if (xy(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if ($d(e, i), t & Ia && lm(e)) {
        for (; o !== null; ) {
          var s = Du(o);
          s !== null && Sy(s);
          var d = wu(e, t, a, i);
          if (d === null && Fy(e, t, i, Pi, a), d === o)
            break;
          o = d;
        }
        o !== null && i.stopPropagation();
        return;
      }
      Fy(e, t, i, null, a);
    }
    var Pi = null;
    function wu(e, t, a, i) {
      Pi = null;
      var o = gd(i), s = Ws(o);
      if (s !== null) {
        var d = Ta(s);
        if (d === null)
          s = null;
        else {
          var v = d.tag;
          if (v === fe) {
            var m = Li(d);
            if (m !== null)
              return m;
            s = null;
          } else if (v === z) {
            var E = d.stateNode;
            if (lf(E))
              return Ai(d);
            s = null;
          } else d !== s && (s = null);
        }
      }
      return Pi = s, null;
    }
    function sf(e) {
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
          return $r;
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
          return Ui;
        case "message": {
          var t = Oc();
          switch (t) {
            case fs:
              return $r;
            case zl:
              return Ui;
            case rl:
            case gy:
              return Ka;
            case So:
              return qa;
            default:
              return Ka;
          }
        }
        default:
          return Ka;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ya(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Qd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function _u(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Da = null, Tu = null, Lo = null;
    function Il(e) {
      return Da = e, Tu = Fs(), !0;
    }
    function cf() {
      Da = null, Tu = null, Lo = null;
    }
    function ol() {
      if (Lo)
        return Lo;
      var e, t = Tu, a = t.length, i, o = Fs(), s = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++)
        ;
      var d = a - e;
      for (i = 1; i <= d && t[a - i] === o[s - i]; i++)
        ;
      var v = i > 1 ? 1 - i : void 0;
      return Lo = o.slice(e, v), Lo;
    }
    function Fs() {
      return "value" in Da ? Da.value : Da.textContent;
    }
    function $l(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Ru() {
      return !0;
    }
    function Ps() {
      return !1;
    }
    function Pr(e) {
      function t(a, i, o, s, d) {
        this._reactName = a, this._targetInst = o, this.type = i, this.nativeEvent = s, this.target = d, this.currentTarget = null;
        for (var v in e)
          if (e.hasOwnProperty(v)) {
            var m = e[v];
            m ? this[v] = m(s) : this[v] = s[v];
          }
        var E = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return E ? this.isDefaultPrevented = Ru : this.isDefaultPrevented = Ps, this.isPropagationStopped = Ps, this;
      }
      return qe(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Ru);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Ru);
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
        isPersistent: Ru
      }), t;
    }
    var or = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Hi = Pr(or), Qr = qe({}, or, {
      view: 0,
      detail: 0
    }), ga = Pr(Qr), ff, Hs, Ao;
    function Cy(e) {
      e !== Ao && (Ao && e.type === "mousemove" ? (ff = e.screenX - Ao.screenX, Hs = e.screenY - Ao.screenY) : (ff = 0, Hs = 0), Ao = e);
    }
    var hi = qe({}, Qr, {
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
      getModifierState: Mn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Cy(e), ff);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Hs;
      }
    }), Gd = Pr(hi), Kd = qe({}, hi, {
      dataTransfer: 0
    }), Mo = Pr(Kd), qd = qe({}, Qr, {
      relatedTarget: 0
    }), ul = Pr(qd), um = qe({}, or, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), sm = Pr(um), Xd = qe({}, or, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), df = Pr(Xd), by = qe({}, or, {
      data: 0
    }), cm = Pr(by), fm = cm, dm = {
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
    }, Uo = {
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
    function wy(e) {
      if (e.key) {
        var t = dm[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = $l(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Uo[e.keyCode] || "Unidentified" : "";
    }
    var ku = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function pm(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = ku[e];
      return i ? !!a[i] : !1;
    }
    function Mn(e) {
      return pm;
    }
    var _y = qe({}, Qr, {
      key: wy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Mn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? $l(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? $l(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), vm = Pr(_y), Ty = qe({}, hi, {
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
    }), mm = Pr(Ty), hm = qe({}, Qr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Mn
    }), ym = Pr(hm), Ry = qe({}, or, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Ja = Pr(Ry), Jd = qe({}, hi, {
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
    }), ky = Pr(Jd), Yl = [9, 13, 27, 32], Bs = 229, sl = _n && "CompositionEvent" in window, Wl = null;
    _n && "documentMode" in document && (Wl = document.documentMode);
    var Zd = _n && "TextEvent" in window && !Wl, pf = _n && (!sl || Wl && Wl > 8 && Wl <= 11), gm = 32, vf = String.fromCharCode(gm);
    function jy() {
      xt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), xt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), xt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), xt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var ep = !1;
    function Sm(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function mf(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function hf(e, t) {
      return e === "keydown" && t.keyCode === Bs;
    }
    function tp(e, t) {
      switch (e) {
        case "keyup":
          return Yl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Bs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function yf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function xm(e) {
      return e.locale === "ko";
    }
    var zo = !1;
    function np(e, t, a, i, o) {
      var s, d;
      if (sl ? s = mf(t) : zo ? tp(t, i) && (s = "onCompositionEnd") : hf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      pf && !xm(i) && (!zo && s === "onCompositionStart" ? zo = Il(o) : s === "onCompositionEnd" && zo && (d = ol()));
      var v = Rm(a, s);
      if (v.length > 0) {
        var m = new cm(s, t, null, i, o);
        if (e.push({
          event: m,
          listeners: v
        }), d)
          m.data = d;
        else {
          var E = yf(i);
          E !== null && (m.data = E);
        }
      }
    }
    function gf(e, t) {
      switch (e) {
        case "compositionend":
          return yf(t);
        case "keypress":
          var a = t.which;
          return a !== gm ? null : (ep = !0, vf);
        case "textInput":
          var i = t.data;
          return i === vf && ep ? null : i;
        default:
          return null;
      }
    }
    function rp(e, t) {
      if (zo) {
        if (e === "compositionend" || !sl && tp(e, t)) {
          var a = ol();
          return cf(), zo = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Sm(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return pf && !xm(t) ? null : t.data;
        default:
          return null;
      }
    }
    function Sf(e, t, a, i, o) {
      var s;
      if (Zd ? s = gf(t, i) : s = rp(t, i), !s)
        return null;
      var d = Rm(a, "onBeforeInput");
      if (d.length > 0) {
        var v = new fm("onBeforeInput", "beforeinput", null, i, o);
        e.push({
          event: v,
          listeners: d
        }), v.data = s;
      }
    }
    function Em(e, t, a, i, o, s, d) {
      np(e, t, a, i, o), Sf(e, t, a, i, o);
    }
    var Ny = {
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
      return t === "input" ? !!Ny[e.type] : t === "textarea";
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
    function Dy(e) {
      if (!_n)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Is() {
      xt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function Cm(e, t, a, i) {
      fu(i);
      var o = Rm(t, "onChange");
      if (o.length > 0) {
        var s = new Hi("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: o
        });
      }
    }
    var Ql = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      Cm(t, n, e, gd(e)), Av(u, t);
    }
    function u(e) {
      $x(e, 0);
    }
    function f(e) {
      var t = _f(e);
      if (Ri(t))
        return e;
    }
    function p(e, t) {
      if (e === "change")
        return t;
    }
    var y = !1;
    _n && (y = Dy("input") && (!document.documentMode || document.documentMode > 9));
    function w(e, t) {
      Ql = e, n = t, Ql.attachEvent("onpropertychange", G);
    }
    function j() {
      Ql && (Ql.detachEvent("onpropertychange", G), Ql = null, n = null);
    }
    function G(e) {
      e.propertyName === "value" && f(n) && l(e);
    }
    function Ee(e, t, a) {
      e === "focusin" ? (j(), w(t, a)) : e === "focusout" && j();
    }
    function Re(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return f(n);
    }
    function ge(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Ie(e, t) {
      if (e === "click")
        return f(t);
    }
    function Xe(e, t) {
      if (e === "input" || e === "change")
        return f(t);
    }
    function tt(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || ft(e, "number", e.value);
    }
    function Jn(e, t, a, i, o, s, d) {
      var v = a ? _f(a) : window, m, E;
      if (r(v) ? m = p : Vs(v) ? y ? m = Xe : (m = Re, E = Ee) : ge(v) && (m = Ie), m) {
        var C = m(t, a);
        if (C) {
          Cm(e, C, i, o);
          return;
        }
      }
      E && E(t, v, a), t === "focusout" && tt(v);
    }
    function F() {
      Bt("onMouseEnter", ["mouseout", "mouseover"]), Bt("onMouseLeave", ["mouseout", "mouseover"]), Bt("onPointerEnter", ["pointerout", "pointerover"]), Bt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function A(e, t, a, i, o, s, d) {
      var v = t === "mouseover" || t === "pointerover", m = t === "mouseout" || t === "pointerout";
      if (v && !is(i)) {
        var E = i.relatedTarget || i.fromElement;
        if (E && (Ws(E) || yp(E)))
          return;
      }
      if (!(!m && !v)) {
        var C;
        if (o.window === o)
          C = o;
        else {
          var M = o.ownerDocument;
          M ? C = M.defaultView || M.parentWindow : C = window;
        }
        var L, $;
        if (m) {
          var q = i.relatedTarget || i.toElement;
          if (L = a, $ = q ? Ws(q) : null, $ !== null) {
            var ie = Ta($);
            ($ !== ie || $.tag !== ae && $.tag !== se) && ($ = null);
          }
        } else
          L = null, $ = a;
        if (L !== $) {
          var Pe = Gd, dt = "onMouseLeave", it = "onMouseEnter", Yt = "mouse";
          (t === "pointerout" || t === "pointerover") && (Pe = mm, dt = "onPointerLeave", it = "onPointerEnter", Yt = "pointer");
          var Pt = L == null ? C : _f(L), H = $ == null ? C : _f($), le = new Pe(dt, Yt + "leave", L, i, o);
          le.target = Pt, le.relatedTarget = H;
          var B = null, ke = Ws(o);
          if (ke === a) {
            var Qe = new Pe(it, Yt + "enter", $, i, o);
            Qe.target = H, Qe.relatedTarget = Pt, B = Qe;
          }
          i0(e, le, B, L, $);
        }
      }
    }
    function I(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Ce = typeof Object.is == "function" ? Object.is : I;
    function Je(e, t) {
      if (Ce(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var s = a[o];
        if (!Wn.call(t, s) || !Ce(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function pt(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ht(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Rt(e, t) {
      for (var a = pt(e), i = 0, o = 0; a; ) {
        if (a.nodeType === Ji) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = pt(ht(a));
      }
    }
    function Sr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var o = i.anchorNode, s = i.anchorOffset, d = i.focusNode, v = i.focusOffset;
      try {
        o.nodeType, d.nodeType;
      } catch {
        return null;
      }
      return nn(e, o, s, d, v);
    }
    function nn(e, t, a, i, o) {
      var s = 0, d = -1, v = -1, m = 0, E = 0, C = e, M = null;
      e: for (; ; ) {
        for (var L = null; C === t && (a === 0 || C.nodeType === Ji) && (d = s + a), C === i && (o === 0 || C.nodeType === Ji) && (v = s + o), C.nodeType === Ji && (s += C.nodeValue.length), (L = C.firstChild) !== null; )
          M = C, C = L;
        for (; ; ) {
          if (C === e)
            break e;
          if (M === t && ++m === a && (d = s), M === i && ++E === o && (v = s), (L = C.nextSibling) !== null)
            break;
          C = M, M = C.parentNode;
        }
        C = L;
      }
      return d === -1 || v === -1 ? null : {
        start: d,
        end: v
      };
    }
    function Gl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var o = i.getSelection(), s = e.textContent.length, d = Math.min(t.start, s), v = t.end === void 0 ? d : Math.min(t.end, s);
        if (!o.extend && d > v) {
          var m = v;
          v = d, d = m;
        }
        var E = Rt(e, d), C = Rt(e, v);
        if (E && C) {
          if (o.rangeCount === 1 && o.anchorNode === E.node && o.anchorOffset === E.offset && o.focusNode === C.node && o.focusOffset === C.offset)
            return;
          var M = a.createRange();
          M.setStart(E.node, E.offset), o.removeAllRanges(), d > v ? (o.addRange(M), o.extend(C.node, C.offset)) : (M.setEnd(C.node, C.offset), o.addRange(M));
        }
      }
    }
    function bm(e) {
      return e && e.nodeType === Ji;
    }
    function Lx(e, t) {
      return !e || !t ? !1 : e === t ? !0 : bm(e) ? !1 : bm(t) ? Lx(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Bw(e) {
      return e && e.ownerDocument && Lx(e.ownerDocument.documentElement, e);
    }
    function Vw(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function Ax() {
      for (var e = window, t = Va(); t instanceof e.HTMLIFrameElement; ) {
        if (Vw(t))
          e = t.contentWindow;
        else
          return t;
        t = Va(e.document);
      }
      return t;
    }
    function Oy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Iw() {
      var e = Ax();
      return {
        focusedElem: e,
        selectionRange: Oy(e) ? Yw(e) : null
      };
    }
    function $w(e) {
      var t = Ax(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Bw(a)) {
        i !== null && Oy(a) && Ww(a, i);
        for (var o = [], s = a; s = s.parentNode; )
          s.nodeType === ua && o.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var d = 0; d < o.length; d++) {
          var v = o[d];
          v.element.scrollLeft = v.left, v.element.scrollTop = v.top;
        }
      }
    }
    function Yw(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = Sr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Ww(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Gl(e, t);
    }
    var Qw = _n && "documentMode" in document && document.documentMode <= 11;
    function Gw() {
      xt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var xf = null, Ly = null, ap = null, Ay = !1;
    function Kw(e) {
      if ("selectionStart" in e && Oy(e))
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
    function qw(e) {
      return e.window === e ? e.document : e.nodeType === Zi ? e : e.ownerDocument;
    }
    function Mx(e, t, a) {
      var i = qw(a);
      if (!(Ay || xf == null || xf !== Va(i))) {
        var o = Kw(xf);
        if (!ap || !Je(ap, o)) {
          ap = o;
          var s = Rm(Ly, "onSelect");
          if (s.length > 0) {
            var d = new Hi("onSelect", "select", null, t, a);
            e.push({
              event: d,
              listeners: s
            }), d.target = xf;
          }
        }
      }
    }
    function Xw(e, t, a, i, o, s, d) {
      var v = a ? _f(a) : window;
      switch (t) {
        case "focusin":
          (Vs(v) || v.contentEditable === "true") && (xf = v, Ly = a, ap = null);
          break;
        case "focusout":
          xf = null, Ly = null, ap = null;
          break;
        case "mousedown":
          Ay = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Ay = !1, Mx(e, i, o);
          break;
        case "selectionchange":
          if (Qw)
            break;
        case "keydown":
        case "keyup":
          Mx(e, i, o);
      }
    }
    function wm(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Ef = {
      animationend: wm("Animation", "AnimationEnd"),
      animationiteration: wm("Animation", "AnimationIteration"),
      animationstart: wm("Animation", "AnimationStart"),
      transitionend: wm("Transition", "TransitionEnd")
    }, My = {}, Ux = {};
    _n && (Ux = document.createElement("div").style, "AnimationEvent" in window || (delete Ef.animationend.animation, delete Ef.animationiteration.animation, delete Ef.animationstart.animation), "TransitionEvent" in window || delete Ef.transitionend.transition);
    function _m(e) {
      if (My[e])
        return My[e];
      if (!Ef[e])
        return e;
      var t = Ef[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in Ux)
          return My[e] = t[a];
      return e;
    }
    var zx = _m("animationend"), Fx = _m("animationiteration"), Px = _m("animationstart"), Hx = _m("transitionend"), Bx = /* @__PURE__ */ new Map(), Vx = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ju(e, t) {
      Bx.set(e, t), xt(t, [e]);
    }
    function Jw() {
      for (var e = 0; e < Vx.length; e++) {
        var t = Vx[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ju(a, "on" + i);
      }
      ju(zx, "onAnimationEnd"), ju(Fx, "onAnimationIteration"), ju(Px, "onAnimationStart"), ju("dblclick", "onDoubleClick"), ju("focusin", "onFocus"), ju("focusout", "onBlur"), ju(Hx, "onTransitionEnd");
    }
    function Zw(e, t, a, i, o, s, d) {
      var v = Bx.get(t);
      if (v !== void 0) {
        var m = Hi, E = t;
        switch (t) {
          case "keypress":
            if ($l(i) === 0)
              return;
          case "keydown":
          case "keyup":
            m = vm;
            break;
          case "focusin":
            E = "focus", m = ul;
            break;
          case "focusout":
            E = "blur", m = ul;
            break;
          case "beforeblur":
          case "afterblur":
            m = ul;
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
            m = Gd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            m = Mo;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            m = ym;
            break;
          case zx:
          case Fx:
          case Px:
            m = sm;
            break;
          case Hx:
            m = Ja;
            break;
          case "scroll":
            m = ga;
            break;
          case "wheel":
            m = ky;
            break;
          case "copy":
          case "cut":
          case "paste":
            m = df;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            m = mm;
            break;
        }
        var C = (s & Ia) !== 0;
        {
          var M = !C && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", L = r0(a, v, i.type, C, M);
          if (L.length > 0) {
            var $ = new m(v, E, null, i, o);
            e.push({
              event: $,
              listeners: L
            });
          }
        }
      }
    }
    Jw(), F(), Is(), Gw(), jy();
    function e0(e, t, a, i, o, s, d) {
      Zw(e, t, a, i, o, s);
      var v = (s & yd) === 0;
      v && (A(e, t, a, i, o), Jn(e, t, a, i, o), Xw(e, t, a, i, o), Em(e, t, a, i, o));
    }
    var ip = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Uy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(ip));
    function Ix(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ni(i, t, void 0, e), e.currentTarget = null;
    }
    function t0(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var s = t[o], d = s.instance, v = s.currentTarget, m = s.listener;
          if (d !== i && e.isPropagationStopped())
            return;
          Ix(e, m, v), i = d;
        }
      else
        for (var E = 0; E < t.length; E++) {
          var C = t[E], M = C.instance, L = C.currentTarget, $ = C.listener;
          if (M !== i && e.isPropagationStopped())
            return;
          Ix(e, $, L), i = M;
        }
    }
    function $x(e, t) {
      for (var a = (t & Ia) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], s = o.event, d = o.listeners;
        t0(s, d, a);
      }
      us();
    }
    function n0(e, t, a, i, o) {
      var s = gd(a), d = [];
      e0(d, e, i, a, s, t), $x(d, t);
    }
    function In(e, t) {
      Uy.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = O_(t), o = l0(e);
      i.has(o) || (Yx(t, e, Sc, a), i.add(o));
    }
    function zy(e, t, a) {
      Uy.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Ia), Yx(a, e, i, t);
    }
    var Tm = "_reactListening" + Math.random().toString(36).slice(2);
    function lp(e) {
      if (!e[Tm]) {
        e[Tm] = !0, kt.forEach(function(a) {
          a !== "selectionchange" && (Uy.has(a) || zy(a, !1, e), zy(a, !0, e));
        });
        var t = e.nodeType === Zi ? e : e.ownerDocument;
        t !== null && (t[Tm] || (t[Tm] = !0, zy("selectionchange", !1, t)));
      }
    }
    function Yx(e, t, a, i, o) {
      var s = Tr(e, t, a), d = void 0;
      os && (t === "touchstart" || t === "touchmove" || t === "wheel") && (d = !0), e = e, i ? d !== void 0 ? Qd(e, t, s, d) : ya(e, t, s) : d !== void 0 ? _u(e, t, s, d) : zs(e, t, s);
    }
    function Wx(e, t) {
      return e === t || e.nodeType === er && e.parentNode === t;
    }
    function Fy(e, t, a, i, o) {
      var s = i;
      if (!(t & hd) && !(t & Sc)) {
        var d = o;
        if (i !== null) {
          var v = i;
          e: for (; ; ) {
            if (v === null)
              return;
            var m = v.tag;
            if (m === z || m === Y) {
              var E = v.stateNode.containerInfo;
              if (Wx(E, d))
                break;
              if (m === Y)
                for (var C = v.return; C !== null; ) {
                  var M = C.tag;
                  if (M === z || M === Y) {
                    var L = C.stateNode.containerInfo;
                    if (Wx(L, d))
                      return;
                  }
                  C = C.return;
                }
              for (; E !== null; ) {
                var $ = Ws(E);
                if ($ === null)
                  return;
                var q = $.tag;
                if (q === ae || q === se) {
                  v = s = $;
                  continue e;
                }
                E = E.parentNode;
              }
            }
            v = v.return;
          }
        }
      }
      Av(function() {
        return n0(e, t, a, s);
      });
    }
    function op(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function r0(e, t, a, i, o, s) {
      for (var d = t !== null ? t + "Capture" : null, v = i ? d : t, m = [], E = e, C = null; E !== null; ) {
        var M = E, L = M.stateNode, $ = M.tag;
        if ($ === ae && L !== null && (C = L, v !== null)) {
          var q = Dl(E, v);
          q != null && m.push(op(E, q, C));
        }
        if (o)
          break;
        E = E.return;
      }
      return m;
    }
    function Rm(e, t) {
      for (var a = t + "Capture", i = [], o = e; o !== null; ) {
        var s = o, d = s.stateNode, v = s.tag;
        if (v === ae && d !== null) {
          var m = d, E = Dl(o, a);
          E != null && i.unshift(op(o, E, m));
          var C = Dl(o, t);
          C != null && i.push(op(o, C, m));
        }
        o = o.return;
      }
      return i;
    }
    function Cf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ae);
      return e || null;
    }
    function a0(e, t) {
      for (var a = e, i = t, o = 0, s = a; s; s = Cf(s))
        o++;
      for (var d = 0, v = i; v; v = Cf(v))
        d++;
      for (; o - d > 0; )
        a = Cf(a), o--;
      for (; d - o > 0; )
        i = Cf(i), d--;
      for (var m = o; m--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Cf(a), i = Cf(i);
      }
      return null;
    }
    function Qx(e, t, a, i, o) {
      for (var s = t._reactName, d = [], v = a; v !== null && v !== i; ) {
        var m = v, E = m.alternate, C = m.stateNode, M = m.tag;
        if (E !== null && E === i)
          break;
        if (M === ae && C !== null) {
          var L = C;
          if (o) {
            var $ = Dl(v, s);
            $ != null && d.unshift(op(v, $, L));
          } else if (!o) {
            var q = Dl(v, s);
            q != null && d.push(op(v, q, L));
          }
        }
        v = v.return;
      }
      d.length !== 0 && e.push({
        event: t,
        listeners: d
      });
    }
    function i0(e, t, a, i, o) {
      var s = i && o ? a0(i, o) : null;
      i !== null && Qx(e, t, i, s, !1), o !== null && a !== null && Qx(e, a, o, s, !0);
    }
    function l0(e, t) {
      return e + "__bubble";
    }
    var Za = !1, up = "dangerouslySetInnerHTML", km = "suppressContentEditableWarning", Nu = "suppressHydrationWarning", Gx = "autoFocus", $s = "children", Ys = "style", jm = "__html", Py, Nm, sp, Kx, Dm, qx, Xx;
    Py = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Nm = function(e, t) {
      pd(e, t), yc(e, t), Dv(e, t, {
        registrationNameDependencies: St,
        possibleRegistrationNames: yt
      });
    }, qx = _n && !document.documentMode, sp = function(e, t, a) {
      if (!Za) {
        var i = Om(a), o = Om(t);
        o !== i && (Za = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, Kx = function(e) {
      if (!Za) {
        Za = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, Dm = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, Xx = function(e, t) {
      var a = e.namespaceURI === Xi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var o0 = /\r\n?/g, u0 = /\u0000|\uFFFD/g;
    function Om(e) {
      kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(o0, `
`).replace(u0, "");
    }
    function Lm(e, t, a, i) {
      var o = Om(t), s = Om(e);
      if (s !== o && (i && (Za || (Za = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, o))), a && Ne))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function Jx(e) {
      return e.nodeType === Zi ? e : e.ownerDocument;
    }
    function s0() {
    }
    function Am(e) {
      e.onclick = s0;
    }
    function c0(e, t, a, i, o) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var d = i[s];
          if (s === Ys)
            d && Object.freeze(d), _v(t, d);
          else if (s === up) {
            var v = d ? d[jm] : void 0;
            v != null && pv(t, v);
          } else if (s === $s)
            if (typeof d == "string") {
              var m = e !== "textarea" || d !== "";
              m && ou(t, d);
            } else typeof d == "number" && ou(t, "" + d);
          else s === km || s === Nu || s === Gx || (St.hasOwnProperty(s) ? d != null && (typeof d != "function" && Dm(s, d), s === "onScroll" && In("scroll", t)) : d != null && Er(t, s, d, o));
        }
    }
    function f0(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var s = t[o], d = t[o + 1];
        s === Ys ? _v(e, d) : s === up ? pv(e, d) : s === $s ? ou(e, d) : Er(e, s, d, i);
      }
    }
    function d0(e, t, a, i) {
      var o, s = Jx(a), d, v = i;
      if (v === Xi && (v = ld(e)), v === Xi) {
        if (o = jl(e, t), !o && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var m = s.createElement("div");
          m.innerHTML = "<script><\/script>";
          var E = m.firstChild;
          d = m.removeChild(E);
        } else if (typeof t.is == "string")
          d = s.createElement(e, {
            is: t.is
          });
        else if (d = s.createElement(e), e === "select") {
          var C = d;
          t.multiple ? C.multiple = !0 : t.size && (C.size = t.size);
        }
      } else
        d = s.createElementNS(v, e);
      return v === Xi && !o && Object.prototype.toString.call(d) === "[object HTMLUnknownElement]" && !Wn.call(Py, e) && (Py[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), d;
    }
    function p0(e, t) {
      return Jx(t).createTextNode(e);
    }
    function v0(e, t, a, i) {
      var o = jl(t, a);
      Nm(t, a);
      var s;
      switch (t) {
        case "dialog":
          In("cancel", e), In("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          In("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var d = 0; d < ip.length; d++)
            In(ip[d], e);
          s = a;
          break;
        case "source":
          In("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          In("error", e), In("load", e), s = a;
          break;
        case "details":
          In("toggle", e), s = a;
          break;
        case "input":
          ci(e, a), s = lu(e, a), In("invalid", e);
          break;
        case "option":
          Kt(e, a), s = a;
          break;
        case "select":
          co(e, a), s = Ju(e, a), In("invalid", e);
          break;
        case "textarea":
          rd(e, a), s = nd(e, a), In("invalid", e);
          break;
        default:
          s = a;
      }
      switch (mc(t, s), c0(t, e, i, s, o), t) {
        case "input":
          si(e), Q(e, a, !1);
          break;
        case "textarea":
          si(e), fv(e);
          break;
        case "option":
          bn(e, a);
          break;
        case "select":
          ed(e, a);
          break;
        default:
          typeof s.onClick == "function" && Am(e);
          break;
      }
    }
    function m0(e, t, a, i, o) {
      Nm(t, i);
      var s = null, d, v;
      switch (t) {
        case "input":
          d = lu(e, a), v = lu(e, i), s = [];
          break;
        case "select":
          d = Ju(e, a), v = Ju(e, i), s = [];
          break;
        case "textarea":
          d = nd(e, a), v = nd(e, i), s = [];
          break;
        default:
          d = a, v = i, typeof d.onClick != "function" && typeof v.onClick == "function" && Am(e);
          break;
      }
      mc(t, v);
      var m, E, C = null;
      for (m in d)
        if (!(v.hasOwnProperty(m) || !d.hasOwnProperty(m) || d[m] == null))
          if (m === Ys) {
            var M = d[m];
            for (E in M)
              M.hasOwnProperty(E) && (C || (C = {}), C[E] = "");
          } else m === up || m === $s || m === km || m === Nu || m === Gx || (St.hasOwnProperty(m) ? s || (s = []) : (s = s || []).push(m, null));
      for (m in v) {
        var L = v[m], $ = d != null ? d[m] : void 0;
        if (!(!v.hasOwnProperty(m) || L === $ || L == null && $ == null))
          if (m === Ys)
            if (L && Object.freeze(L), $) {
              for (E in $)
                $.hasOwnProperty(E) && (!L || !L.hasOwnProperty(E)) && (C || (C = {}), C[E] = "");
              for (E in L)
                L.hasOwnProperty(E) && $[E] !== L[E] && (C || (C = {}), C[E] = L[E]);
            } else
              C || (s || (s = []), s.push(m, C)), C = L;
          else if (m === up) {
            var q = L ? L[jm] : void 0, ie = $ ? $[jm] : void 0;
            q != null && ie !== q && (s = s || []).push(m, q);
          } else m === $s ? (typeof L == "string" || typeof L == "number") && (s = s || []).push(m, "" + L) : m === km || m === Nu || (St.hasOwnProperty(m) ? (L != null && (typeof L != "function" && Dm(m, L), m === "onScroll" && In("scroll", e)), !s && $ !== L && (s = [])) : (s = s || []).push(m, L));
      }
      return C && (dy(C, v[Ys]), (s = s || []).push(Ys, C)), s;
    }
    function h0(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && h(e, o);
      var s = jl(a, i), d = jl(a, o);
      switch (f0(e, t, s, d), a) {
        case "input":
          _(e, o);
          break;
        case "textarea":
          cv(e, o);
          break;
        case "select":
          dc(e, o);
          break;
      }
    }
    function y0(e) {
      {
        var t = e.toLowerCase();
        return rs.hasOwnProperty(t) && rs[t] || null;
      }
    }
    function g0(e, t, a, i, o, s, d) {
      var v, m;
      switch (v = jl(t, a), Nm(t, a), t) {
        case "dialog":
          In("cancel", e), In("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          In("load", e);
          break;
        case "video":
        case "audio":
          for (var E = 0; E < ip.length; E++)
            In(ip[E], e);
          break;
        case "source":
          In("error", e);
          break;
        case "img":
        case "image":
        case "link":
          In("error", e), In("load", e);
          break;
        case "details":
          In("toggle", e);
          break;
        case "input":
          ci(e, a), In("invalid", e);
          break;
        case "option":
          Kt(e, a);
          break;
        case "select":
          co(e, a), In("invalid", e);
          break;
        case "textarea":
          rd(e, a), In("invalid", e);
          break;
      }
      mc(t, a);
      {
        m = /* @__PURE__ */ new Set();
        for (var C = e.attributes, M = 0; M < C.length; M++) {
          var L = C[M].name.toLowerCase();
          switch (L) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              m.add(C[M].name);
          }
        }
      }
      var $ = null;
      for (var q in a)
        if (a.hasOwnProperty(q)) {
          var ie = a[q];
          if (q === $s)
            typeof ie == "string" ? e.textContent !== ie && (a[Nu] !== !0 && Lm(e.textContent, ie, s, d), $ = [$s, ie]) : typeof ie == "number" && e.textContent !== "" + ie && (a[Nu] !== !0 && Lm(e.textContent, ie, s, d), $ = [$s, "" + ie]);
          else if (St.hasOwnProperty(q))
            ie != null && (typeof ie != "function" && Dm(q, ie), q === "onScroll" && In("scroll", e));
          else if (d && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof v == "boolean") {
            var Pe = void 0, dt = ln(q);
            if (a[Nu] !== !0) {
              if (!(q === km || q === Nu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              q === "value" || q === "checked" || q === "selected")) {
                if (q === up) {
                  var it = e.innerHTML, Yt = ie ? ie[jm] : void 0;
                  if (Yt != null) {
                    var Pt = Xx(e, Yt);
                    Pt !== it && sp(q, it, Pt);
                  }
                } else if (q === Ys) {
                  if (m.delete(q), qx) {
                    var H = cy(ie);
                    Pe = e.getAttribute("style"), H !== Pe && sp(q, Pe, H);
                  }
                } else if (v && !D)
                  m.delete(q.toLowerCase()), Pe = ia(e, q, ie), ie !== Pe && sp(q, Pe, ie);
                else if (!jn(q, dt, v) && !Nn(q, ie, dt, v)) {
                  var le = !1;
                  if (dt !== null)
                    m.delete(dt.attributeName), Pe = Ci(e, q, ie, dt);
                  else {
                    var B = i;
                    if (B === Xi && (B = ld(t)), B === Xi)
                      m.delete(q.toLowerCase());
                    else {
                      var ke = y0(q);
                      ke !== null && ke !== q && (le = !0, m.delete(ke)), m.delete(q);
                    }
                    Pe = ia(e, q, ie);
                  }
                  var Qe = D;
                  !Qe && ie !== Pe && !le && sp(q, Pe, ie);
                }
              }
            }
          }
        }
      switch (d && // $FlowFixMe - Should be inferred as not undefined.
      m.size > 0 && a[Nu] !== !0 && Kx(m), t) {
        case "input":
          si(e), Q(e, a, !0);
          break;
        case "textarea":
          si(e), fv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Am(e);
          break;
      }
      return $;
    }
    function S0(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Hy(e, t) {
      {
        if (Za)
          return;
        Za = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function By(e, t) {
      {
        if (Za)
          return;
        Za = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Vy(e, t, a) {
      {
        if (Za)
          return;
        Za = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Iy(e, t) {
      {
        if (t === "" || Za)
          return;
        Za = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function x0(e, t, a) {
      switch (t) {
        case "input":
          ne(e, a);
          return;
        case "textarea":
          ly(e, a);
          return;
        case "select":
          td(e, a);
          return;
      }
    }
    var cp = function() {
    }, fp = function() {
    };
    {
      var E0 = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], Zx = [
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
      ], C0 = Zx.concat(["button"]), b0 = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], eE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      fp = function(e, t) {
        var a = qe({}, e || eE), i = {
          tag: t
        };
        return Zx.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), C0.indexOf(t) !== -1 && (a.pTagInButtonScope = null), E0.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var w0 = function(e, t) {
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
            return b0.indexOf(t) === -1;
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
      }, _0 = function(e, t) {
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
      }, tE = {};
      cp = function(e, t, a) {
        a = a || eE;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = w0(e, o) ? null : i, d = s ? null : _0(e, a), v = s || d;
        if (v) {
          var m = v.tag, E = !!s + "|" + e + "|" + m;
          if (!tE[E]) {
            tE[E] = !0;
            var C = e, M = "";
            if (e === "#text" ? /\S/.test(t) ? C = "Text nodes" : (C = "Whitespace text nodes", M = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : C = "<" + e + ">", s) {
              var L = "";
              m === "table" && e === "tr" && (L += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", C, m, M, L);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", C, m);
          }
        }
      };
    }
    var Mm = "suppressHydrationWarning", Um = "$", zm = "/$", dp = "$?", pp = "$!", T0 = "style", $y = null, Yy = null;
    function R0(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Zi:
        case ud: {
          t = i === Zi ? "#document" : "#fragment";
          var o = e.documentElement;
          a = o ? o.namespaceURI : od(null, "");
          break;
        }
        default: {
          var s = i === er ? e.parentNode : e, d = s.namespaceURI || null;
          t = s.tagName, a = od(d, t);
          break;
        }
      }
      {
        var v = t.toLowerCase(), m = fp(null, v);
        return {
          namespace: a,
          ancestorInfo: m
        };
      }
    }
    function k0(e, t, a) {
      {
        var i = e, o = od(i.namespace, t), s = fp(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: s
        };
      }
    }
    function UN(e) {
      return e;
    }
    function j0(e) {
      $y = lr(), Yy = Iw();
      var t = null;
      return vr(!1), t;
    }
    function N0(e) {
      $w(Yy), vr($y), $y = null, Yy = null;
    }
    function D0(e, t, a, i, o) {
      var s;
      {
        var d = i;
        if (cp(e, null, d.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var v = "" + t.children, m = fp(d.ancestorInfo, e);
          cp(null, v, m);
        }
        s = d.namespace;
      }
      var E = d0(e, t, a, s);
      return hp(o, E), Zy(E, t), E;
    }
    function O0(e, t) {
      e.appendChild(t);
    }
    function L0(e, t, a, i, o) {
      switch (v0(e, t, a, i), t) {
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
    function A0(e, t, a, i, o, s) {
      {
        var d = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var v = "" + i.children, m = fp(d.ancestorInfo, t);
          cp(null, v, m);
        }
      }
      return m0(e, t, a, i);
    }
    function Wy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function M0(e, t, a, i) {
      {
        var o = a;
        cp(null, e, o.ancestorInfo);
      }
      var s = p0(e, t);
      return hp(i, s), s;
    }
    function U0() {
      var e = window.event;
      return e === void 0 ? Ka : sf(e.type);
    }
    var Qy = typeof setTimeout == "function" ? setTimeout : void 0, z0 = typeof clearTimeout == "function" ? clearTimeout : void 0, Gy = -1, nE = typeof Promise == "function" ? Promise : void 0, F0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof nE < "u" ? function(e) {
      return nE.resolve(null).then(e).catch(P0);
    } : Qy;
    function P0(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function H0(e, t, a, i) {
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
    function B0(e, t, a, i, o, s) {
      h0(e, t, a, i, o), Zy(e, o);
    }
    function rE(e) {
      ou(e, "");
    }
    function V0(e, t, a) {
      e.nodeValue = a;
    }
    function I0(e, t) {
      e.appendChild(t);
    }
    function $0(e, t) {
      var a;
      e.nodeType === er ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Am(a);
    }
    function Y0(e, t, a) {
      e.insertBefore(t, a);
    }
    function W0(e, t, a) {
      e.nodeType === er ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Q0(e, t) {
      e.removeChild(t);
    }
    function G0(e, t) {
      e.nodeType === er ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Ky(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === er) {
          var s = o.data;
          if (s === zm)
            if (i === 0) {
              e.removeChild(o), Oo(t);
              return;
            } else
              i--;
          else (s === Um || s === dp || s === pp) && i++;
        }
        a = o;
      } while (a);
      Oo(t);
    }
    function K0(e, t) {
      e.nodeType === er ? Ky(e.parentNode, t) : e.nodeType === ua && Ky(e, t), Oo(e);
    }
    function q0(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function X0(e) {
      e.nodeValue = "";
    }
    function J0(e, t) {
      e = e;
      var a = t[T0], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = vc("display", i);
    }
    function Z0(e, t) {
      e.nodeValue = t;
    }
    function e_(e) {
      e.nodeType === ua ? e.textContent = "" : e.nodeType === Zi && e.documentElement && e.removeChild(e.documentElement);
    }
    function t_(e, t, a) {
      return e.nodeType !== ua || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function n_(e, t) {
      return t === "" || e.nodeType !== Ji ? null : e;
    }
    function r_(e) {
      return e.nodeType !== er ? null : e;
    }
    function aE(e) {
      return e.data === dp;
    }
    function qy(e) {
      return e.data === pp;
    }
    function a_(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function i_(e, t) {
      e._reactRetry = t;
    }
    function Fm(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === ua || t === Ji)
          break;
        if (t === er) {
          var a = e.data;
          if (a === Um || a === pp || a === dp)
            break;
          if (a === zm)
            return null;
        }
      }
      return e;
    }
    function vp(e) {
      return Fm(e.nextSibling);
    }
    function l_(e) {
      return Fm(e.firstChild);
    }
    function o_(e) {
      return Fm(e.firstChild);
    }
    function u_(e) {
      return Fm(e.nextSibling);
    }
    function s_(e, t, a, i, o, s, d) {
      hp(s, e), Zy(e, a);
      var v;
      {
        var m = o;
        v = m.namespace;
      }
      var E = (s.mode & Ut) !== st;
      return g0(e, t, a, v, i, E, d);
    }
    function c_(e, t, a, i) {
      return hp(a, e), a.mode & Ut, S0(e, t);
    }
    function f_(e, t) {
      hp(t, e);
    }
    function d_(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === er) {
          var i = t.data;
          if (i === zm) {
            if (a === 0)
              return vp(t);
            a--;
          } else (i === Um || i === pp || i === dp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function iE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === er) {
          var i = t.data;
          if (i === Um || i === pp || i === dp) {
            if (a === 0)
              return t;
            a--;
          } else i === zm && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function p_(e) {
      Oo(e);
    }
    function v_(e) {
      Oo(e);
    }
    function m_(e) {
      return e !== "head" && e !== "body";
    }
    function h_(e, t, a, i) {
      var o = !0;
      Lm(t.nodeValue, a, i, o);
    }
    function y_(e, t, a, i, o, s) {
      if (t[Mm] !== !0) {
        var d = !0;
        Lm(i.nodeValue, o, s, d);
      }
    }
    function g_(e, t) {
      t.nodeType === ua ? Hy(e, t) : t.nodeType === er || By(e, t);
    }
    function S_(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === ua ? Hy(a, t) : t.nodeType === er || By(a, t));
      }
    }
    function x_(e, t, a, i, o) {
      (o || t[Mm] !== !0) && (i.nodeType === ua ? Hy(a, i) : i.nodeType === er || By(a, i));
    }
    function E_(e, t, a) {
      Vy(e, t);
    }
    function C_(e, t) {
      Iy(e, t);
    }
    function b_(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Vy(i, t);
      }
    }
    function w_(e, t) {
      {
        var a = e.parentNode;
        a !== null && Iy(a, t);
      }
    }
    function __(e, t, a, i, o, s) {
      (s || t[Mm] !== !0) && Vy(a, i);
    }
    function T_(e, t, a, i, o) {
      (o || t[Mm] !== !0) && Iy(a, i);
    }
    function R_(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function k_(e) {
      lp(e);
    }
    var bf = Math.random().toString(36).slice(2), wf = "__reactFiber$" + bf, Xy = "__reactProps$" + bf, mp = "__reactContainer$" + bf, Jy = "__reactEvents$" + bf, j_ = "__reactListeners$" + bf, N_ = "__reactHandles$" + bf;
    function D_(e) {
      delete e[wf], delete e[Xy], delete e[Jy], delete e[j_], delete e[N_];
    }
    function hp(e, t) {
      t[wf] = e;
    }
    function Pm(e, t) {
      t[mp] = e;
    }
    function lE(e) {
      e[mp] = null;
    }
    function yp(e) {
      return !!e[mp];
    }
    function Ws(e) {
      var t = e[wf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[mp] || a[wf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var o = iE(e); o !== null; ) {
              var s = o[wf];
              if (s)
                return s;
              o = iE(o);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Du(e) {
      var t = e[wf] || e[mp];
      return t && (t.tag === ae || t.tag === se || t.tag === fe || t.tag === z) ? t : null;
    }
    function _f(e) {
      if (e.tag === ae || e.tag === se)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Hm(e) {
      return e[Xy] || null;
    }
    function Zy(e, t) {
      e[Xy] = t;
    }
    function O_(e) {
      var t = e[Jy];
      return t === void 0 && (t = e[Jy] = /* @__PURE__ */ new Set()), t;
    }
    var oE = {}, uE = b.ReactDebugCurrentFrame;
    function Bm(e) {
      if (e) {
        var t = e._owner, a = Gi(e.type, e._source, t ? t.type : null);
        uE.setExtraStackFrame(a);
      } else
        uE.setExtraStackFrame(null);
    }
    function cl(e, t, a, i, o) {
      {
        var s = Function.call.bind(Wn);
        for (var d in e)
          if (s(e, d)) {
            var v = void 0;
            try {
              if (typeof e[d] != "function") {
                var m = Error((i || "React class") + ": " + a + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw m.name = "Invariant Violation", m;
              }
              v = e[d](t, d, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (E) {
              v = E;
            }
            v && !(v instanceof Error) && (Bm(o), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, d, typeof v), Bm(null)), v instanceof Error && !(v.message in oE) && (oE[v.message] = !0, Bm(o), g("Failed %s type: %s", a, v.message), Bm(null));
          }
      }
    }
    var eg = [], Vm;
    Vm = [];
    var Fo = -1;
    function Ou(e) {
      return {
        current: e
      };
    }
    function Sa(e, t) {
      if (Fo < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Vm[Fo] && g("Unexpected Fiber popped."), e.current = eg[Fo], eg[Fo] = null, Vm[Fo] = null, Fo--;
    }
    function xa(e, t, a) {
      Fo++, eg[Fo] = e.current, Vm[Fo] = a, e.current = t;
    }
    var tg;
    tg = {};
    var yi = {};
    Object.freeze(yi);
    var Po = Ou(yi), Kl = Ou(!1), ng = yi;
    function Tf(e, t, a) {
      return a && ql(t) ? ng : Po.current;
    }
    function sE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return yi;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var d in i)
          s[d] = t[d];
        {
          var v = jt(e) || "Unknown";
          cl(i, s, "context", v);
        }
        return o && sE(e, t, s), s;
      }
    }
    function Im() {
      return Kl.current;
    }
    function ql(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function $m(e) {
      Sa(Kl, e), Sa(Po, e);
    }
    function rg(e) {
      Sa(Kl, e), Sa(Po, e);
    }
    function cE(e, t, a) {
      {
        if (Po.current !== yi)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        xa(Po, t, e), xa(Kl, a, e);
      }
    }
    function fE(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = jt(e) || "Unknown";
            tg[s] || (tg[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var d = i.getChildContext();
        for (var v in d)
          if (!(v in o))
            throw new Error((jt(e) || "Unknown") + '.getChildContext(): key "' + v + '" is not defined in childContextTypes.');
        {
          var m = jt(e) || "Unknown";
          cl(o, d, "child context", m);
        }
        return qe({}, a, d);
      }
    }
    function Ym(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || yi;
        return ng = Po.current, xa(Po, a, e), xa(Kl, Kl.current, e), !0;
      }
    }
    function dE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = fE(e, t, ng);
          i.__reactInternalMemoizedMergedChildContext = o, Sa(Kl, e), Sa(Po, e), xa(Po, o, e), xa(Kl, a, e);
        } else
          Sa(Kl, e), xa(Kl, a, e);
      }
    }
    function L_(e) {
      {
        if (!go(e) || e.tag !== U)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case z:
              return t.stateNode.context;
            case U: {
              var a = t.type;
              if (ql(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Lu = 0, Wm = 1, Ho = null, ag = !1, ig = !1;
    function pE(e) {
      Ho === null ? Ho = [e] : Ho.push(e);
    }
    function A_(e) {
      ag = !0, pE(e);
    }
    function vE() {
      ag && Au();
    }
    function Au() {
      if (!ig && Ho !== null) {
        ig = !0;
        var e = 0, t = Xa();
        try {
          var a = !0, i = Ho;
          for (ir($r); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          Ho = null, ag = !1;
        } catch (s) {
          throw Ho !== null && (Ho = Ho.slice(e + 1)), xd(fs, Au), s;
        } finally {
          ir(t), ig = !1;
        }
      }
      return null;
    }
    var kf = [], jf = 0, Qm = null, Gm = 0, Bi = [], Vi = 0, Qs = null, Bo = 1, Vo = "";
    function M_(e) {
      return Ks(), (e.flags & Di) !== ut;
    }
    function U_(e) {
      return Ks(), Gm;
    }
    function z_() {
      var e = Vo, t = Bo, a = t & ~F_(t);
      return a.toString(32) + e;
    }
    function Gs(e, t) {
      Ks(), kf[jf++] = Gm, kf[jf++] = Qm, Qm = e, Gm = t;
    }
    function mE(e, t, a) {
      Ks(), Bi[Vi++] = Bo, Bi[Vi++] = Vo, Bi[Vi++] = Qs, Qs = e;
      var i = Bo, o = Vo, s = Km(i) - 1, d = i & ~(1 << s), v = a + 1, m = Km(t) + s;
      if (m > 30) {
        var E = s - s % 5, C = (1 << E) - 1, M = (d & C).toString(32), L = d >> E, $ = s - E, q = Km(t) + $, ie = v << $, Pe = ie | L, dt = M + o;
        Bo = 1 << q | Pe, Vo = dt;
      } else {
        var it = v << s, Yt = it | d, Pt = o;
        Bo = 1 << m | Yt, Vo = Pt;
      }
    }
    function lg(e) {
      Ks();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Gs(e, a), mE(e, a, i);
      }
    }
    function Km(e) {
      return 32 - rr(e);
    }
    function F_(e) {
      return 1 << Km(e) - 1;
    }
    function og(e) {
      for (; e === Qm; )
        Qm = kf[--jf], kf[jf] = null, Gm = kf[--jf], kf[jf] = null;
      for (; e === Qs; )
        Qs = Bi[--Vi], Bi[Vi] = null, Vo = Bi[--Vi], Bi[Vi] = null, Bo = Bi[--Vi], Bi[Vi] = null;
    }
    function P_() {
      return Ks(), Qs !== null ? {
        id: Bo,
        overflow: Vo
      } : null;
    }
    function H_(e, t) {
      Ks(), Bi[Vi++] = Bo, Bi[Vi++] = Vo, Bi[Vi++] = Qs, Bo = t.id, Vo = t.overflow, Qs = e;
    }
    function Ks() {
      Kr() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Gr = null, Ii = null, fl = !1, qs = !1, Mu = null;
    function B_() {
      fl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function hE() {
      qs = !0;
    }
    function V_() {
      return qs;
    }
    function I_(e) {
      var t = e.stateNode.containerInfo;
      return Ii = o_(t), Gr = e, fl = !0, Mu = null, qs = !1, !0;
    }
    function $_(e, t, a) {
      return Ii = u_(t), Gr = e, fl = !0, Mu = null, qs = !1, a !== null && H_(e, a), !0;
    }
    function yE(e, t) {
      switch (e.tag) {
        case z: {
          g_(e.stateNode.containerInfo, t);
          break;
        }
        case ae: {
          var a = (e.mode & Ut) !== st;
          x_(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case fe: {
          var i = e.memoizedState;
          i.dehydrated !== null && S_(i.dehydrated, t);
          break;
        }
      }
    }
    function gE(e, t) {
      yE(e, t);
      var a = Gk();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= $a) : i.push(a);
    }
    function ug(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case z: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ae:
                var i = t.type;
                t.pendingProps, E_(a, i);
                break;
              case se:
                var o = t.pendingProps;
                C_(a, o);
                break;
            }
            break;
          }
          case ae: {
            var s = e.type, d = e.memoizedProps, v = e.stateNode;
            switch (t.tag) {
              case ae: {
                var m = t.type, E = t.pendingProps, C = (e.mode & Ut) !== st;
                __(
                  s,
                  d,
                  v,
                  m,
                  E,
                  // TODO: Delete this argument when we remove the legacy root API.
                  C
                );
                break;
              }
              case se: {
                var M = t.pendingProps, L = (e.mode & Ut) !== st;
                T_(
                  s,
                  d,
                  v,
                  M,
                  // TODO: Delete this argument when we remove the legacy root API.
                  L
                );
                break;
              }
            }
            break;
          }
          case fe: {
            var $ = e.memoizedState, q = $.dehydrated;
            if (q !== null) switch (t.tag) {
              case ae:
                var ie = t.type;
                t.pendingProps, b_(q, ie);
                break;
              case se:
                var Pe = t.pendingProps;
                w_(q, Pe);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function SE(e, t) {
      t.flags = t.flags & ~ca | Hn, ug(e, t);
    }
    function xE(e, t) {
      switch (e.tag) {
        case ae: {
          var a = e.type;
          e.pendingProps;
          var i = t_(t, a);
          return i !== null ? (e.stateNode = i, Gr = e, Ii = l_(i), !0) : !1;
        }
        case se: {
          var o = e.pendingProps, s = n_(t, o);
          return s !== null ? (e.stateNode = s, Gr = e, Ii = null, !0) : !1;
        }
        case fe: {
          var d = r_(t);
          if (d !== null) {
            var v = {
              dehydrated: d,
              treeContext: P_(),
              retryLane: va
            };
            e.memoizedState = v;
            var m = Kk(d);
            return m.return = e, e.child = m, Gr = e, Ii = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function sg(e) {
      return (e.mode & Ut) !== st && (e.flags & lt) === ut;
    }
    function cg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function fg(e) {
      if (fl) {
        var t = Ii;
        if (!t) {
          sg(e) && (ug(Gr, e), cg()), SE(Gr, e), fl = !1, Gr = e;
          return;
        }
        var a = t;
        if (!xE(e, t)) {
          sg(e) && (ug(Gr, e), cg()), t = vp(a);
          var i = Gr;
          if (!t || !xE(e, t)) {
            SE(Gr, e), fl = !1, Gr = e;
            return;
          }
          gE(i, a);
        }
      }
    }
    function Y_(e, t, a) {
      var i = e.stateNode, o = !qs, s = s_(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = s, s !== null;
    }
    function W_(e) {
      var t = e.stateNode, a = e.memoizedProps, i = c_(t, a, e);
      if (i) {
        var o = Gr;
        if (o !== null)
          switch (o.tag) {
            case z: {
              var s = o.stateNode.containerInfo, d = (o.mode & Ut) !== st;
              h_(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                d
              );
              break;
            }
            case ae: {
              var v = o.type, m = o.memoizedProps, E = o.stateNode, C = (o.mode & Ut) !== st;
              y_(
                v,
                m,
                E,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                C
              );
              break;
            }
          }
      }
      return i;
    }
    function Q_(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      f_(a, e);
    }
    function G_(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return d_(a);
    }
    function EE(e) {
      for (var t = e.return; t !== null && t.tag !== ae && t.tag !== z && t.tag !== fe; )
        t = t.return;
      Gr = t;
    }
    function qm(e) {
      if (e !== Gr)
        return !1;
      if (!fl)
        return EE(e), fl = !0, !1;
      if (e.tag !== z && (e.tag !== ae || m_(e.type) && !Wy(e.type, e.memoizedProps))) {
        var t = Ii;
        if (t)
          if (sg(e))
            CE(e), cg();
          else
            for (; t; )
              gE(e, t), t = vp(t);
      }
      return EE(e), e.tag === fe ? Ii = G_(e) : Ii = Gr ? vp(e.stateNode) : null, !0;
    }
    function K_() {
      return fl && Ii !== null;
    }
    function CE(e) {
      for (var t = Ii; t; )
        yE(e, t), t = vp(t);
    }
    function Nf() {
      Gr = null, Ii = null, fl = !1, qs = !1;
    }
    function bE() {
      Mu !== null && (hb(Mu), Mu = null);
    }
    function Kr() {
      return fl;
    }
    function dg(e) {
      Mu === null ? Mu = [e] : Mu.push(e);
    }
    var q_ = b.ReactCurrentBatchConfig, X_ = null;
    function J_() {
      return q_.transition;
    }
    var dl = {
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
      var Z_ = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & vn && (t = a), a = a.return;
        return t;
      }, Xs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, gp = [], Sp = [], xp = [], Ep = [], Cp = [], bp = [], Js = /* @__PURE__ */ new Set();
      dl.recordUnsafeLifecycleWarnings = function(e, t) {
        Js.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & vn && typeof t.UNSAFE_componentWillMount == "function" && Sp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && xp.push(e), e.mode & vn && typeof t.UNSAFE_componentWillReceiveProps == "function" && Ep.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Cp.push(e), e.mode & vn && typeof t.UNSAFE_componentWillUpdate == "function" && bp.push(e));
      }, dl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(L) {
          e.add(jt(L) || "Component"), Js.add(L.type);
        }), gp = []);
        var t = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(L) {
          t.add(jt(L) || "Component"), Js.add(L.type);
        }), Sp = []);
        var a = /* @__PURE__ */ new Set();
        xp.length > 0 && (xp.forEach(function(L) {
          a.add(jt(L) || "Component"), Js.add(L.type);
        }), xp = []);
        var i = /* @__PURE__ */ new Set();
        Ep.length > 0 && (Ep.forEach(function(L) {
          i.add(jt(L) || "Component"), Js.add(L.type);
        }), Ep = []);
        var o = /* @__PURE__ */ new Set();
        Cp.length > 0 && (Cp.forEach(function(L) {
          o.add(jt(L) || "Component"), Js.add(L.type);
        }), Cp = []);
        var s = /* @__PURE__ */ new Set();
        if (bp.length > 0 && (bp.forEach(function(L) {
          s.add(jt(L) || "Component"), Js.add(L.type);
        }), bp = []), t.size > 0) {
          var d = Xs(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, d);
        }
        if (i.size > 0) {
          var v = Xs(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, v);
        }
        if (s.size > 0) {
          var m = Xs(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, m);
        }
        if (e.size > 0) {
          var E = Xs(e);
          R(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, E);
        }
        if (a.size > 0) {
          var C = Xs(a);
          R(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, C);
        }
        if (o.size > 0) {
          var M = Xs(o);
          R(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, M);
        }
      };
      var Xm = /* @__PURE__ */ new Map(), wE = /* @__PURE__ */ new Set();
      dl.recordLegacyContextWarning = function(e, t) {
        var a = Z_(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!wE.has(e.type)) {
          var i = Xm.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Xm.set(a, i)), i.push(e));
        }
      }, dl.flushLegacyContextWarning = function() {
        Xm.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(jt(s) || "Component"), wE.add(s.type);
            });
            var o = Xs(i);
            try {
              fn(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              Dn();
            }
          }
        });
      }, dl.discardPendingWarnings = function() {
        gp = [], Sp = [], xp = [], Ep = [], Cp = [], bp = [], Xm = /* @__PURE__ */ new Map();
      };
    }
    var pg, vg, mg, hg, yg, _E = function(e, t) {
    };
    pg = !1, vg = !1, mg = {}, hg = {}, yg = {}, _E = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = jt(t) || "Component";
        hg[a] || (hg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function eT(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function wp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & vn || P) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== U) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !eT(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var o = jt(e) || "Component";
          mg[o] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o, i), mg[o] = !0);
        }
        if (a._owner) {
          var s = a._owner, d;
          if (s) {
            var v = s;
            if (v.tag !== U)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            d = v.stateNode;
          }
          if (!d)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var m = d;
          Rn(i, "ref");
          var E = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === E)
            return t.ref;
          var C = function(M) {
            var L = m.refs;
            M === null ? delete L[E] : L[E] = M;
          };
          return C._stringRef = E, C;
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
    function Jm(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Zm(e) {
      {
        var t = jt(e) || "Component";
        if (yg[t])
          return;
        yg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function TE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function RE(e) {
      function t(H, le) {
        if (e) {
          var B = H.deletions;
          B === null ? (H.deletions = [le], H.flags |= $a) : B.push(le);
        }
      }
      function a(H, le) {
        if (!e)
          return null;
        for (var B = le; B !== null; )
          t(H, B), B = B.sibling;
        return null;
      }
      function i(H, le) {
        for (var B = /* @__PURE__ */ new Map(), ke = le; ke !== null; )
          ke.key !== null ? B.set(ke.key, ke) : B.set(ke.index, ke), ke = ke.sibling;
        return B;
      }
      function o(H, le) {
        var B = oc(H, le);
        return B.index = 0, B.sibling = null, B;
      }
      function s(H, le, B) {
        if (H.index = B, !e)
          return H.flags |= Di, le;
        var ke = H.alternate;
        if (ke !== null) {
          var Qe = ke.index;
          return Qe < le ? (H.flags |= Hn, le) : Qe;
        } else
          return H.flags |= Hn, le;
      }
      function d(H) {
        return e && H.alternate === null && (H.flags |= Hn), H;
      }
      function v(H, le, B, ke) {
        if (le === null || le.tag !== se) {
          var Qe = dx(B, H.mode, ke);
          return Qe.return = H, Qe;
        } else {
          var Be = o(le, B);
          return Be.return = H, Be;
        }
      }
      function m(H, le, B, ke) {
        var Qe = B.type;
        if (Qe === la)
          return C(H, le, B.props.children, ke, B.key);
        if (le !== null && (le.elementType === Qe || // Keep this check inline so it only runs on the false path:
        Ob(le, B) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Qe == "object" && Qe !== null && Qe.$$typeof === Tt && TE(Qe) === le.type)) {
          var Be = o(le, B.props);
          return Be.ref = wp(H, le, B), Be.return = H, Be._debugSource = B._source, Be._debugOwner = B._owner, Be;
        }
        var bt = fx(B, H.mode, ke);
        return bt.ref = wp(H, le, B), bt.return = H, bt;
      }
      function E(H, le, B, ke) {
        if (le === null || le.tag !== Y || le.stateNode.containerInfo !== B.containerInfo || le.stateNode.implementation !== B.implementation) {
          var Qe = px(B, H.mode, ke);
          return Qe.return = H, Qe;
        } else {
          var Be = o(le, B.children || []);
          return Be.return = H, Be;
        }
      }
      function C(H, le, B, ke, Qe) {
        if (le === null || le.tag !== re) {
          var Be = Wu(B, H.mode, ke, Qe);
          return Be.return = H, Be;
        } else {
          var bt = o(le, B);
          return bt.return = H, bt;
        }
      }
      function M(H, le, B) {
        if (typeof le == "string" && le !== "" || typeof le == "number") {
          var ke = dx("" + le, H.mode, B);
          return ke.return = H, ke;
        }
        if (typeof le == "object" && le !== null) {
          switch (le.$$typeof) {
            case Un: {
              var Qe = fx(le, H.mode, B);
              return Qe.ref = wp(H, null, le), Qe.return = H, Qe;
            }
            case sr: {
              var Be = px(le, H.mode, B);
              return Be.return = H, Be;
            }
            case Tt: {
              var bt = le._payload, Ot = le._init;
              return M(H, Ot(bt), B);
            }
          }
          if (Mt(le) || rt(le)) {
            var hn = Wu(le, H.mode, B, null);
            return hn.return = H, hn;
          }
          Jm(H, le);
        }
        return typeof le == "function" && Zm(H), null;
      }
      function L(H, le, B, ke) {
        var Qe = le !== null ? le.key : null;
        if (typeof B == "string" && B !== "" || typeof B == "number")
          return Qe !== null ? null : v(H, le, "" + B, ke);
        if (typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case Un:
              return B.key === Qe ? m(H, le, B, ke) : null;
            case sr:
              return B.key === Qe ? E(H, le, B, ke) : null;
            case Tt: {
              var Be = B._payload, bt = B._init;
              return L(H, le, bt(Be), ke);
            }
          }
          if (Mt(B) || rt(B))
            return Qe !== null ? null : C(H, le, B, ke, null);
          Jm(H, B);
        }
        return typeof B == "function" && Zm(H), null;
      }
      function $(H, le, B, ke, Qe) {
        if (typeof ke == "string" && ke !== "" || typeof ke == "number") {
          var Be = H.get(B) || null;
          return v(le, Be, "" + ke, Qe);
        }
        if (typeof ke == "object" && ke !== null) {
          switch (ke.$$typeof) {
            case Un: {
              var bt = H.get(ke.key === null ? B : ke.key) || null;
              return m(le, bt, ke, Qe);
            }
            case sr: {
              var Ot = H.get(ke.key === null ? B : ke.key) || null;
              return E(le, Ot, ke, Qe);
            }
            case Tt:
              var hn = ke._payload, rn = ke._init;
              return $(H, le, B, rn(hn), Qe);
          }
          if (Mt(ke) || rt(ke)) {
            var mr = H.get(B) || null;
            return C(le, mr, ke, Qe, null);
          }
          Jm(le, ke);
        }
        return typeof ke == "function" && Zm(le), null;
      }
      function q(H, le, B) {
        {
          if (typeof H != "object" || H === null)
            return le;
          switch (H.$$typeof) {
            case Un:
            case sr:
              _E(H, B);
              var ke = H.key;
              if (typeof ke != "string")
                break;
              if (le === null) {
                le = /* @__PURE__ */ new Set(), le.add(ke);
                break;
              }
              if (!le.has(ke)) {
                le.add(ke);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ke);
              break;
            case Tt:
              var Qe = H._payload, Be = H._init;
              q(Be(Qe), le, B);
              break;
          }
        }
        return le;
      }
      function ie(H, le, B, ke) {
        for (var Qe = null, Be = 0; Be < B.length; Be++) {
          var bt = B[Be];
          Qe = q(bt, Qe, H);
        }
        for (var Ot = null, hn = null, rn = le, mr = 0, an = 0, ur = null; rn !== null && an < B.length; an++) {
          rn.index > an ? (ur = rn, rn = null) : ur = rn.sibling;
          var Ca = L(H, rn, B[an], ke);
          if (Ca === null) {
            rn === null && (rn = ur);
            break;
          }
          e && rn && Ca.alternate === null && t(H, rn), mr = s(Ca, mr, an), hn === null ? Ot = Ca : hn.sibling = Ca, hn = Ca, rn = ur;
        }
        if (an === B.length) {
          if (a(H, rn), Kr()) {
            var na = an;
            Gs(H, na);
          }
          return Ot;
        }
        if (rn === null) {
          for (; an < B.length; an++) {
            var Si = M(H, B[an], ke);
            Si !== null && (mr = s(Si, mr, an), hn === null ? Ot = Si : hn.sibling = Si, hn = Si);
          }
          if (Kr()) {
            var Ma = an;
            Gs(H, Ma);
          }
          return Ot;
        }
        for (var Ua = i(H, rn); an < B.length; an++) {
          var ba = $(Ua, H, an, B[an], ke);
          ba !== null && (e && ba.alternate !== null && Ua.delete(ba.key === null ? an : ba.key), mr = s(ba, mr, an), hn === null ? Ot = ba : hn.sibling = ba, hn = ba);
        }
        if (e && Ua.forEach(function(Kf) {
          return t(H, Kf);
        }), Kr()) {
          var Ko = an;
          Gs(H, Ko);
        }
        return Ot;
      }
      function Pe(H, le, B, ke) {
        var Qe = rt(B);
        if (typeof Qe != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          B[Symbol.toStringTag] === "Generator" && (vg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), vg = !0), B.entries === Qe && (pg || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), pg = !0);
          var Be = Qe.call(B);
          if (Be)
            for (var bt = null, Ot = Be.next(); !Ot.done; Ot = Be.next()) {
              var hn = Ot.value;
              bt = q(hn, bt, H);
            }
        }
        var rn = Qe.call(B);
        if (rn == null)
          throw new Error("An iterable object provided no iterator.");
        for (var mr = null, an = null, ur = le, Ca = 0, na = 0, Si = null, Ma = rn.next(); ur !== null && !Ma.done; na++, Ma = rn.next()) {
          ur.index > na ? (Si = ur, ur = null) : Si = ur.sibling;
          var Ua = L(H, ur, Ma.value, ke);
          if (Ua === null) {
            ur === null && (ur = Si);
            break;
          }
          e && ur && Ua.alternate === null && t(H, ur), Ca = s(Ua, Ca, na), an === null ? mr = Ua : an.sibling = Ua, an = Ua, ur = Si;
        }
        if (Ma.done) {
          if (a(H, ur), Kr()) {
            var ba = na;
            Gs(H, ba);
          }
          return mr;
        }
        if (ur === null) {
          for (; !Ma.done; na++, Ma = rn.next()) {
            var Ko = M(H, Ma.value, ke);
            Ko !== null && (Ca = s(Ko, Ca, na), an === null ? mr = Ko : an.sibling = Ko, an = Ko);
          }
          if (Kr()) {
            var Kf = na;
            Gs(H, Kf);
          }
          return mr;
        }
        for (var nv = i(H, ur); !Ma.done; na++, Ma = rn.next()) {
          var ao = $(nv, H, na, Ma.value, ke);
          ao !== null && (e && ao.alternate !== null && nv.delete(ao.key === null ? na : ao.key), Ca = s(ao, Ca, na), an === null ? mr = ao : an.sibling = ao, an = ao);
        }
        if (e && nv.forEach(function(Tj) {
          return t(H, Tj);
        }), Kr()) {
          var _j = na;
          Gs(H, _j);
        }
        return mr;
      }
      function dt(H, le, B, ke) {
        if (le !== null && le.tag === se) {
          a(H, le.sibling);
          var Qe = o(le, B);
          return Qe.return = H, Qe;
        }
        a(H, le);
        var Be = dx(B, H.mode, ke);
        return Be.return = H, Be;
      }
      function it(H, le, B, ke) {
        for (var Qe = B.key, Be = le; Be !== null; ) {
          if (Be.key === Qe) {
            var bt = B.type;
            if (bt === la) {
              if (Be.tag === re) {
                a(H, Be.sibling);
                var Ot = o(Be, B.props.children);
                return Ot.return = H, Ot._debugSource = B._source, Ot._debugOwner = B._owner, Ot;
              }
            } else if (Be.elementType === bt || // Keep this check inline so it only runs on the false path:
            Ob(Be, B) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof bt == "object" && bt !== null && bt.$$typeof === Tt && TE(bt) === Be.type) {
              a(H, Be.sibling);
              var hn = o(Be, B.props);
              return hn.ref = wp(H, Be, B), hn.return = H, hn._debugSource = B._source, hn._debugOwner = B._owner, hn;
            }
            a(H, Be);
            break;
          } else
            t(H, Be);
          Be = Be.sibling;
        }
        if (B.type === la) {
          var rn = Wu(B.props.children, H.mode, ke, B.key);
          return rn.return = H, rn;
        } else {
          var mr = fx(B, H.mode, ke);
          return mr.ref = wp(H, le, B), mr.return = H, mr;
        }
      }
      function Yt(H, le, B, ke) {
        for (var Qe = B.key, Be = le; Be !== null; ) {
          if (Be.key === Qe)
            if (Be.tag === Y && Be.stateNode.containerInfo === B.containerInfo && Be.stateNode.implementation === B.implementation) {
              a(H, Be.sibling);
              var bt = o(Be, B.children || []);
              return bt.return = H, bt;
            } else {
              a(H, Be);
              break;
            }
          else
            t(H, Be);
          Be = Be.sibling;
        }
        var Ot = px(B, H.mode, ke);
        return Ot.return = H, Ot;
      }
      function Pt(H, le, B, ke) {
        var Qe = typeof B == "object" && B !== null && B.type === la && B.key === null;
        if (Qe && (B = B.props.children), typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case Un:
              return d(it(H, le, B, ke));
            case sr:
              return d(Yt(H, le, B, ke));
            case Tt:
              var Be = B._payload, bt = B._init;
              return Pt(H, le, bt(Be), ke);
          }
          if (Mt(B))
            return ie(H, le, B, ke);
          if (rt(B))
            return Pe(H, le, B, ke);
          Jm(H, B);
        }
        return typeof B == "string" && B !== "" || typeof B == "number" ? d(dt(H, le, "" + B, ke)) : (typeof B == "function" && Zm(H), a(H, le));
      }
      return Pt;
    }
    var Df = RE(!0), kE = RE(!1);
    function tT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = oc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = oc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function nT(e, t) {
      for (var a = e.child; a !== null; )
        Ik(a, t), a = a.sibling;
    }
    var gg = Ou(null), Sg;
    Sg = {};
    var eh = null, Of = null, xg = null, th = !1;
    function nh() {
      eh = null, Of = null, xg = null, th = !1;
    }
    function jE() {
      th = !0;
    }
    function NE() {
      th = !1;
    }
    function DE(e, t, a) {
      xa(gg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== Sg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = Sg;
    }
    function Eg(e, t) {
      var a = gg.current;
      Sa(gg, t), e._currentValue = a;
    }
    function Cg(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (Do(i.childLanes, t) ? o !== null && !Do(o.childLanes, t) && (o.childLanes = Lt(o.childLanes, t)) : (i.childLanes = Lt(i.childLanes, t), o !== null && (o.childLanes = Lt(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function rT(e, t, a) {
      aT(e, t, a);
    }
    function aT(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, s = i.dependencies;
        if (s !== null) {
          o = i.child;
          for (var d = s.firstContext; d !== null; ) {
            if (d.context === t) {
              if (i.tag === U) {
                var v = _s(a), m = Io(xn, v);
                m.tag = ah;
                var E = i.updateQueue;
                if (E !== null) {
                  var C = E.shared, M = C.pending;
                  M === null ? m.next = m : (m.next = M.next, M.next = m), C.pending = m;
                }
              }
              i.lanes = Lt(i.lanes, a);
              var L = i.alternate;
              L !== null && (L.lanes = Lt(L.lanes, a)), Cg(i.return, a, e), s.lanes = Lt(s.lanes, a);
              break;
            }
            d = d.next;
          }
        } else if (i.tag === ue)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === Te) {
          var $ = i.return;
          if ($ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          $.lanes = Lt($.lanes, a);
          var q = $.alternate;
          q !== null && (q.lanes = Lt(q.lanes, a)), Cg($, a, e), o = i.sibling;
        } else
          o = i.child;
        if (o !== null)
          o.return = i;
        else
          for (o = i; o !== null; ) {
            if (o === e) {
              o = null;
              break;
            }
            var ie = o.sibling;
            if (ie !== null) {
              ie.return = o.return, o = ie;
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function Lf(e, t) {
      eh = e, Of = null, xg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ma(a.lanes, t) && Pp(), a.firstContext = null);
      }
    }
    function xr(e) {
      th && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (xg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Of === null) {
          if (eh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Of = a, eh.dependencies = {
            lanes: he,
            firstContext: a
          };
        } else
          Of = Of.next = a;
      }
      return t;
    }
    var Zs = null;
    function bg(e) {
      Zs === null ? Zs = [e] : Zs.push(e);
    }
    function iT() {
      if (Zs !== null) {
        for (var e = 0; e < Zs.length; e++) {
          var t = Zs[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, o = t.pending;
            if (o !== null) {
              var s = o.next;
              o.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        Zs = null;
      }
    }
    function OE(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, bg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, rh(e, i);
    }
    function lT(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, bg(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function oT(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, bg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, rh(e, i);
    }
    function ei(e, t) {
      return rh(e, t);
    }
    var uT = rh;
    function rh(e, t) {
      e.lanes = Lt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Lt(a.lanes, t)), a === null && (e.flags & (Hn | ca)) !== ut && kb(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = Lt(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = Lt(a.childLanes, t) : (o.flags & (Hn | ca)) !== ut && kb(e), i = o, o = o.return;
      if (i.tag === z) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var LE = 0, AE = 1, ah = 2, wg = 3, ih = !1, _g, lh;
    _g = !1, lh = null;
    function Tg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: he
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function ME(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var o = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = o;
      }
    }
    function Io(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: LE,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Uu(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var o = i.shared;
      if (lh === o && !_g && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), _g = !0), lk()) {
        var s = o.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), o.pending = t, uT(e, a);
      } else
        return oT(e, o, t, a);
    }
    function oh(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (zd(a)) {
          var s = o.lanes;
          s = Pd(s, e.pendingLanes);
          var d = Lt(s, a);
          o.lanes = d, af(e, d);
        }
      }
    }
    function Rg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var o = i.updateQueue;
        if (a === o) {
          var s = null, d = null, v = a.firstBaseUpdate;
          if (v !== null) {
            var m = v;
            do {
              var E = {
                eventTime: m.eventTime,
                lane: m.lane,
                tag: m.tag,
                payload: m.payload,
                callback: m.callback,
                next: null
              };
              d === null ? s = d = E : (d.next = E, d = E), m = m.next;
            } while (m !== null);
            d === null ? s = d = t : (d.next = t, d = t);
          } else
            s = d = t;
          a = {
            baseState: o.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: d,
            shared: o.shared,
            effects: o.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var C = a.lastBaseUpdate;
      C === null ? a.firstBaseUpdate = t : C.next = t, a.lastBaseUpdate = t;
    }
    function sT(e, t, a, i, o, s) {
      switch (a.tag) {
        case AE: {
          var d = a.payload;
          if (typeof d == "function") {
            jE();
            var v = d.call(s, i, o);
            {
              if (e.mode & vn) {
                Bn(!0);
                try {
                  d.call(s, i, o);
                } finally {
                  Bn(!1);
                }
              }
              NE();
            }
            return v;
          }
          return d;
        }
        case wg:
          e.flags = e.flags & ~hr | lt;
        case LE: {
          var m = a.payload, E;
          if (typeof m == "function") {
            jE(), E = m.call(s, i, o);
            {
              if (e.mode & vn) {
                Bn(!0);
                try {
                  m.call(s, i, o);
                } finally {
                  Bn(!1);
                }
              }
              NE();
            }
          } else
            E = m;
          return E == null ? i : qe({}, i, E);
        }
        case ah:
          return ih = !0, i;
      }
      return i;
    }
    function uh(e, t, a, i) {
      var o = e.updateQueue;
      ih = !1, lh = o.shared;
      var s = o.firstBaseUpdate, d = o.lastBaseUpdate, v = o.shared.pending;
      if (v !== null) {
        o.shared.pending = null;
        var m = v, E = m.next;
        m.next = null, d === null ? s = E : d.next = E, d = m;
        var C = e.alternate;
        if (C !== null) {
          var M = C.updateQueue, L = M.lastBaseUpdate;
          L !== d && (L === null ? M.firstBaseUpdate = E : L.next = E, M.lastBaseUpdate = m);
        }
      }
      if (s !== null) {
        var $ = o.baseState, q = he, ie = null, Pe = null, dt = null, it = s;
        do {
          var Yt = it.lane, Pt = it.eventTime;
          if (Do(i, Yt)) {
            if (dt !== null) {
              var le = {
                eventTime: Pt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Jt,
                tag: it.tag,
                payload: it.payload,
                callback: it.callback,
                next: null
              };
              dt = dt.next = le;
            }
            $ = sT(e, o, it, $, t, a);
            var B = it.callback;
            if (B !== null && // If the update was already committed, we should not queue its
            // callback again.
            it.lane !== Jt) {
              e.flags |= wn;
              var ke = o.effects;
              ke === null ? o.effects = [it] : ke.push(it);
            }
          } else {
            var H = {
              eventTime: Pt,
              lane: Yt,
              tag: it.tag,
              payload: it.payload,
              callback: it.callback,
              next: null
            };
            dt === null ? (Pe = dt = H, ie = $) : dt = dt.next = H, q = Lt(q, Yt);
          }
          if (it = it.next, it === null) {
            if (v = o.shared.pending, v === null)
              break;
            var Qe = v, Be = Qe.next;
            Qe.next = null, it = Be, o.lastBaseUpdate = Qe, o.shared.pending = null;
          }
        } while (!0);
        dt === null && (ie = $), o.baseState = ie, o.firstBaseUpdate = Pe, o.lastBaseUpdate = dt;
        var bt = o.shared.interleaved;
        if (bt !== null) {
          var Ot = bt;
          do
            q = Lt(q, Ot.lane), Ot = Ot.next;
          while (Ot !== bt);
        } else s === null && (o.shared.lanes = he);
        Xp(q), e.lanes = q, e.memoizedState = $;
      }
      lh = null;
    }
    function cT(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function UE() {
      ih = !1;
    }
    function sh() {
      return ih;
    }
    function zE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o], d = s.callback;
          d !== null && (s.callback = null, cT(d, a));
        }
    }
    var _p = {}, zu = Ou(_p), Tp = Ou(_p), ch = Ou(_p);
    function fh(e) {
      if (e === _p)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function FE() {
      var e = fh(ch.current);
      return e;
    }
    function kg(e, t) {
      xa(ch, t, e), xa(Tp, e, e), xa(zu, _p, e);
      var a = R0(t);
      Sa(zu, e), xa(zu, a, e);
    }
    function Af(e) {
      Sa(zu, e), Sa(Tp, e), Sa(ch, e);
    }
    function jg() {
      var e = fh(zu.current);
      return e;
    }
    function PE(e) {
      fh(ch.current);
      var t = fh(zu.current), a = k0(t, e.type);
      t !== a && (xa(Tp, e, e), xa(zu, a, e));
    }
    function Ng(e) {
      Tp.current === e && (Sa(zu, e), Sa(Tp, e));
    }
    var fT = 0, HE = 1, BE = 1, Rp = 2, pl = Ou(fT);
    function Dg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & HE;
    }
    function Og(e, t) {
      return e & HE | t;
    }
    function dT(e, t) {
      return e | t;
    }
    function Fu(e, t) {
      xa(pl, t, e);
    }
    function Uf(e) {
      Sa(pl, e);
    }
    function pT(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function dh(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === fe) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || aE(i) || qy(i))
              return t;
          }
        } else if (t.tag === Le && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & lt) !== ut;
          if (o)
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
    var ti = (
      /*   */
      0
    ), Rr = (
      /* */
      1
    ), Xl = (
      /*  */
      2
    ), kr = (
      /*    */
      4
    ), qr = (
      /*   */
      8
    ), Lg = [];
    function Ag() {
      for (var e = 0; e < Lg.length; e++) {
        var t = Lg[e];
        t._workInProgressVersionPrimary = null;
      }
      Lg.length = 0;
    }
    function vT(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var $e = b.ReactCurrentDispatcher, kp = b.ReactCurrentBatchConfig, Mg, zf;
    Mg = /* @__PURE__ */ new Set();
    var ec = he, mn = null, jr = null, Nr = null, ph = !1, jp = !1, Np = 0, mT = 0, hT = 25, ce = null, $i = null, Pu = -1, Ug = !1;
    function un() {
      {
        var e = ce;
        $i === null ? $i = [e] : $i.push(e);
      }
    }
    function Ue() {
      {
        var e = ce;
        $i !== null && (Pu++, $i[Pu] !== e && yT(e));
      }
    }
    function Ff(e) {
      e != null && !Mt(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", ce, typeof e);
    }
    function yT(e) {
      {
        var t = jt(mn);
        if (!Mg.has(t) && (Mg.add(t), $i !== null)) {
          for (var a = "", i = 30, o = 0; o <= Pu; o++) {
            for (var s = $i[o], d = o === Pu ? e : s, v = o + 1 + ". " + s; v.length < i; )
              v += " ";
            v += d + `
`, a += v;
          }
          g(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function Ea() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function zg(e, t) {
      if (Ug)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", ce), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, ce, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Ce(e[a], t[a]))
          return !1;
      return !0;
    }
    function Pf(e, t, a, i, o, s) {
      ec = s, mn = t, $i = e !== null ? e._debugHookTypes : null, Pu = -1, Ug = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = he, e !== null && e.memoizedState !== null ? $e.current = sC : $i !== null ? $e.current = uC : $e.current = oC;
      var d = a(i, o);
      if (jp) {
        var v = 0;
        do {
          if (jp = !1, Np = 0, v >= hT)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          v += 1, Ug = !1, jr = null, Nr = null, t.updateQueue = null, Pu = -1, $e.current = cC, d = a(i, o);
        } while (jp);
      }
      $e.current = Th, t._debugHookTypes = $i;
      var m = jr !== null && jr.next !== null;
      if (ec = he, mn = null, jr = null, Nr = null, ce = null, $i = null, Pu = -1, e !== null && (e.flags & nr) !== (t.flags & nr) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Ut) !== st && g("Internal React error: Expected static flag was missing. Please notify the React team."), ph = !1, m)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return d;
    }
    function Hf() {
      var e = Np !== 0;
      return Np = 0, e;
    }
    function VE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & tn) !== st ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ts(e.lanes, a);
    }
    function IE() {
      if ($e.current = Th, ph) {
        for (var e = mn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        ph = !1;
      }
      ec = he, mn = null, jr = null, Nr = null, $i = null, Pu = -1, ce = null, nC = !1, jp = !1, Np = 0;
    }
    function Jl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Nr === null ? mn.memoizedState = Nr = e : Nr = Nr.next = e, Nr;
    }
    function Yi() {
      var e;
      if (jr === null) {
        var t = mn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = jr.next;
      var a;
      if (Nr === null ? a = mn.memoizedState : a = Nr.next, a !== null)
        Nr = a, a = Nr.next, jr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        jr = e;
        var i = {
          memoizedState: jr.memoizedState,
          baseState: jr.baseState,
          baseQueue: jr.baseQueue,
          queue: jr.queue,
          next: null
        };
        Nr === null ? mn.memoizedState = Nr = i : Nr = Nr.next = i;
      }
      return Nr;
    }
    function $E() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Fg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Pg(e, t, a) {
      var i = Jl(), o;
      a !== void 0 ? o = a(t) : o = t, i.memoizedState = i.baseState = o;
      var s = {
        pending: null,
        interleaved: null,
        lanes: he,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      };
      i.queue = s;
      var d = s.dispatch = ET.bind(null, mn, s);
      return [i.memoizedState, d];
    }
    function Hg(e, t, a) {
      var i = Yi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = jr, d = s.baseQueue, v = o.pending;
      if (v !== null) {
        if (d !== null) {
          var m = d.next, E = v.next;
          d.next = E, v.next = m;
        }
        s.baseQueue !== d && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = d = v, o.pending = null;
      }
      if (d !== null) {
        var C = d.next, M = s.baseState, L = null, $ = null, q = null, ie = C;
        do {
          var Pe = ie.lane;
          if (Do(ec, Pe)) {
            if (q !== null) {
              var it = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Jt,
                action: ie.action,
                hasEagerState: ie.hasEagerState,
                eagerState: ie.eagerState,
                next: null
              };
              q = q.next = it;
            }
            if (ie.hasEagerState)
              M = ie.eagerState;
            else {
              var Yt = ie.action;
              M = e(M, Yt);
            }
          } else {
            var dt = {
              lane: Pe,
              action: ie.action,
              hasEagerState: ie.hasEagerState,
              eagerState: ie.eagerState,
              next: null
            };
            q === null ? ($ = q = dt, L = M) : q = q.next = dt, mn.lanes = Lt(mn.lanes, Pe), Xp(Pe);
          }
          ie = ie.next;
        } while (ie !== null && ie !== C);
        q === null ? L = M : q.next = $, Ce(M, i.memoizedState) || Pp(), i.memoizedState = M, i.baseState = L, i.baseQueue = q, o.lastRenderedState = M;
      }
      var Pt = o.interleaved;
      if (Pt !== null) {
        var H = Pt;
        do {
          var le = H.lane;
          mn.lanes = Lt(mn.lanes, le), Xp(le), H = H.next;
        } while (H !== Pt);
      } else d === null && (o.lanes = he);
      var B = o.dispatch;
      return [i.memoizedState, B];
    }
    function Bg(e, t, a) {
      var i = Yi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = o.dispatch, d = o.pending, v = i.memoizedState;
      if (d !== null) {
        o.pending = null;
        var m = d.next, E = m;
        do {
          var C = E.action;
          v = e(v, C), E = E.next;
        } while (E !== m);
        Ce(v, i.memoizedState) || Pp(), i.memoizedState = v, i.baseQueue === null && (i.baseState = v), o.lastRenderedState = v;
      }
      return [v, s];
    }
    function zN(e, t, a) {
    }
    function FN(e, t, a) {
    }
    function Vg(e, t, a) {
      var i = mn, o = Jl(), s, d = Kr();
      if (d) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), zf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), zf = !0);
      } else {
        if (s = t(), !zf) {
          var v = t();
          Ce(s, v) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
        }
        var m = Yh();
        if (m === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        nf(m, ec) || YE(i, t, s);
      }
      o.memoizedState = s;
      var E = {
        value: s,
        getSnapshot: t
      };
      return o.queue = E, gh(QE.bind(null, i, E, e), [e]), i.flags |= sa, Dp(Rr | qr, WE.bind(null, i, E, s, t), void 0, null), s;
    }
    function vh(e, t, a) {
      var i = mn, o = Yi(), s = t();
      if (!zf) {
        var d = t();
        Ce(s, d) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
      }
      var v = o.memoizedState, m = !Ce(v, s);
      m && (o.memoizedState = s, Pp());
      var E = o.queue;
      if (Lp(QE.bind(null, i, E, e), [e]), E.getSnapshot !== t || m || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Nr !== null && Nr.memoizedState.tag & Rr) {
        i.flags |= sa, Dp(Rr | qr, WE.bind(null, i, E, s, t), void 0, null);
        var C = Yh();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        nf(C, ec) || YE(i, t, s);
      }
      return s;
    }
    function YE(e, t, a) {
      e.flags |= hu;
      var i = {
        getSnapshot: t,
        value: a
      }, o = mn.updateQueue;
      if (o === null)
        o = $E(), mn.updateQueue = o, o.stores = [i];
      else {
        var s = o.stores;
        s === null ? o.stores = [i] : s.push(i);
      }
    }
    function WE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, GE(t) && KE(e);
    }
    function QE(e, t, a) {
      var i = function() {
        GE(t) && KE(e);
      };
      return a(i);
    }
    function GE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Ce(a, i);
      } catch {
        return !0;
      }
    }
    function KE(e) {
      var t = ei(e, gt);
      t !== null && Ar(t, e, gt, xn);
    }
    function mh(e) {
      var t = Jl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: he,
        dispatch: null,
        lastRenderedReducer: Fg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = CT.bind(null, mn, a);
      return [t.memoizedState, i];
    }
    function Ig(e) {
      return Hg(Fg);
    }
    function $g(e) {
      return Bg(Fg);
    }
    function Dp(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = mn.updateQueue;
      if (s === null)
        s = $E(), mn.updateQueue = s, s.lastEffect = o.next = o;
      else {
        var d = s.lastEffect;
        if (d === null)
          s.lastEffect = o.next = o;
        else {
          var v = d.next;
          d.next = o, o.next = v, s.lastEffect = o;
        }
      }
      return o;
    }
    function Yg(e) {
      var t = Jl();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function hh(e) {
      var t = Yi();
      return t.memoizedState;
    }
    function Op(e, t, a, i) {
      var o = Jl(), s = i === void 0 ? null : i;
      mn.flags |= e, o.memoizedState = Dp(Rr | t, a, void 0, s);
    }
    function yh(e, t, a, i) {
      var o = Yi(), s = i === void 0 ? null : i, d = void 0;
      if (jr !== null) {
        var v = jr.memoizedState;
        if (d = v.destroy, s !== null) {
          var m = v.deps;
          if (zg(s, m)) {
            o.memoizedState = Dp(t, a, d, s);
            return;
          }
        }
      }
      mn.flags |= e, o.memoizedState = Dp(Rr | t, a, d, s);
    }
    function gh(e, t) {
      return (mn.mode & tn) !== st ? Op(Oi | sa | jc, qr, e, t) : Op(sa | jc, qr, e, t);
    }
    function Lp(e, t) {
      return yh(sa, qr, e, t);
    }
    function Wg(e, t) {
      return Op(Vt, Xl, e, t);
    }
    function Sh(e, t) {
      return yh(Vt, Xl, e, t);
    }
    function Qg(e, t) {
      var a = Vt;
      return a |= tl, (mn.mode & tn) !== st && (a |= Ll), Op(a, kr, e, t);
    }
    function xh(e, t) {
      return yh(Vt, kr, e, t);
    }
    function qE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var o = t;
        o.hasOwnProperty("current") || g("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(o).join(", ") + "}");
        var s = e();
        return o.current = s, function() {
          o.current = null;
        };
      }
    }
    function Gg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, o = Vt;
      return o |= tl, (mn.mode & tn) !== st && (o |= Ll), Op(o, kr, qE.bind(null, t, e), i);
    }
    function Eh(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return yh(Vt, kr, qE.bind(null, t, e), i);
    }
    function gT(e, t) {
    }
    var Ch = gT;
    function Kg(e, t) {
      var a = Jl(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function bh(e, t) {
      var a = Yi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (zg(i, s))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function qg(e, t) {
      var a = Jl(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function wh(e, t) {
      var a = Yi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (zg(i, s))
          return o[0];
      }
      var d = e();
      return a.memoizedState = [d, i], d;
    }
    function Xg(e) {
      var t = Jl();
      return t.memoizedState = e, e;
    }
    function XE(e) {
      var t = Yi(), a = jr, i = a.memoizedState;
      return ZE(t, i, e);
    }
    function JE(e) {
      var t = Yi();
      if (jr === null)
        return t.memoizedState = e, e;
      var a = jr.memoizedState;
      return ZE(t, a, e);
    }
    function ZE(e, t, a) {
      var i = !Md(ec);
      if (i) {
        if (!Ce(a, t)) {
          var o = Fd();
          mn.lanes = Lt(mn.lanes, o), Xp(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Pp()), e.memoizedState = a, a;
    }
    function ST(e, t, a) {
      var i = Xa();
      ir(tm(i, Ui)), e(!0);
      var o = kp.transition;
      kp.transition = {};
      var s = kp.transition;
      kp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (ir(i), kp.transition = o, o === null && s._updatedFibers) {
          var d = s._updatedFibers.size;
          d > 10 && R("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Jg() {
      var e = mh(!1), t = e[0], a = e[1], i = ST.bind(null, a), o = Jl();
      return o.memoizedState = i, [t, i];
    }
    function eC() {
      var e = Ig(), t = e[0], a = Yi(), i = a.memoizedState;
      return [t, i];
    }
    function tC() {
      var e = $g(), t = e[0], a = Yi(), i = a.memoizedState;
      return [t, i];
    }
    var nC = !1;
    function xT() {
      return nC;
    }
    function Zg() {
      var e = Jl(), t = Yh(), a = t.identifierPrefix, i;
      if (Kr()) {
        var o = z_();
        i = ":" + a + "R" + o;
        var s = Np++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var d = mT++;
        i = ":" + a + "r" + d.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function _h() {
      var e = Yi(), t = e.memoizedState;
      return t;
    }
    function ET(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (rC(e))
        aC(t, o);
      else {
        var s = OE(e, t, o, i);
        if (s !== null) {
          var d = Aa();
          Ar(s, e, i, d), iC(s, t, i);
        }
      }
      lC(e, i);
    }
    function CT(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (rC(e))
        aC(t, o);
      else {
        var s = e.alternate;
        if (e.lanes === he && (s === null || s.lanes === he)) {
          var d = t.lastRenderedReducer;
          if (d !== null) {
            var v;
            v = $e.current, $e.current = vl;
            try {
              var m = t.lastRenderedState, E = d(m, a);
              if (o.hasEagerState = !0, o.eagerState = E, Ce(E, m)) {
                lT(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              $e.current = v;
            }
          }
        }
        var C = OE(e, t, o, i);
        if (C !== null) {
          var M = Aa();
          Ar(C, e, i, M), iC(C, t, i);
        }
      }
      lC(e, i);
    }
    function rC(e) {
      var t = e.alternate;
      return e === mn || t !== null && t === mn;
    }
    function aC(e, t) {
      jp = ph = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function iC(e, t, a) {
      if (zd(a)) {
        var i = t.lanes;
        i = Pd(i, e.pendingLanes);
        var o = Lt(i, a);
        t.lanes = o, af(e, o);
      }
    }
    function lC(e, t, a) {
      hs(e, t);
    }
    var Th = {
      readContext: xr,
      useCallback: Ea,
      useContext: Ea,
      useEffect: Ea,
      useImperativeHandle: Ea,
      useInsertionEffect: Ea,
      useLayoutEffect: Ea,
      useMemo: Ea,
      useReducer: Ea,
      useRef: Ea,
      useState: Ea,
      useDebugValue: Ea,
      useDeferredValue: Ea,
      useTransition: Ea,
      useMutableSource: Ea,
      useSyncExternalStore: Ea,
      useId: Ea,
      unstable_isNewReconciler: ye
    }, oC = null, uC = null, sC = null, cC = null, Zl = null, vl = null, Rh = null;
    {
      var eS = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Dt = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      oC = {
        readContext: function(e) {
          return xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", un(), Ff(t), Kg(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", un(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", un(), Ff(t), gh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", un(), Ff(a), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", un(), Ff(t), Wg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", un(), Ff(t), Qg(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", un(), Ff(t);
          var a = $e.current;
          $e.current = Zl;
          try {
            return qg(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", un();
          var i = $e.current;
          $e.current = Zl;
          try {
            return Pg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", un(), Yg(e);
        },
        useState: function(e) {
          ce = "useState", un();
          var t = $e.current;
          $e.current = Zl;
          try {
            return mh(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", un(), void 0;
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", un(), Xg(e);
        },
        useTransition: function() {
          return ce = "useTransition", un(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", un(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", un(), Vg(e, t, a);
        },
        useId: function() {
          return ce = "useId", un(), Zg();
        },
        unstable_isNewReconciler: ye
      }, uC = {
        readContext: function(e) {
          return xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", Ue(), Kg(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", Ue(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", Ue(), gh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", Ue(), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", Ue(), Wg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", Ue(), Qg(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", Ue();
          var a = $e.current;
          $e.current = Zl;
          try {
            return qg(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", Ue();
          var i = $e.current;
          $e.current = Zl;
          try {
            return Pg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", Ue(), Yg(e);
        },
        useState: function(e) {
          ce = "useState", Ue();
          var t = $e.current;
          $e.current = Zl;
          try {
            return mh(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", Ue(), void 0;
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", Ue(), Xg(e);
        },
        useTransition: function() {
          return ce = "useTransition", Ue(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", Ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", Ue(), Vg(e, t, a);
        },
        useId: function() {
          return ce = "useId", Ue(), Zg();
        },
        unstable_isNewReconciler: ye
      }, sC = {
        readContext: function(e) {
          return xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", Ue(), bh(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", Ue(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", Ue(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", Ue(), Eh(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", Ue(), Sh(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", Ue(), xh(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", Ue();
          var a = $e.current;
          $e.current = vl;
          try {
            return wh(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", Ue();
          var i = $e.current;
          $e.current = vl;
          try {
            return Hg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", Ue(), hh();
        },
        useState: function(e) {
          ce = "useState", Ue();
          var t = $e.current;
          $e.current = vl;
          try {
            return Ig(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", Ue(), Ch();
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", Ue(), XE(e);
        },
        useTransition: function() {
          return ce = "useTransition", Ue(), eC();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", Ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", Ue(), vh(e, t);
        },
        useId: function() {
          return ce = "useId", Ue(), _h();
        },
        unstable_isNewReconciler: ye
      }, cC = {
        readContext: function(e) {
          return xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", Ue(), bh(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", Ue(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", Ue(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", Ue(), Eh(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", Ue(), Sh(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", Ue(), xh(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", Ue();
          var a = $e.current;
          $e.current = Rh;
          try {
            return wh(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", Ue();
          var i = $e.current;
          $e.current = Rh;
          try {
            return Bg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", Ue(), hh();
        },
        useState: function(e) {
          ce = "useState", Ue();
          var t = $e.current;
          $e.current = Rh;
          try {
            return $g(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", Ue(), Ch();
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", Ue(), JE(e);
        },
        useTransition: function() {
          return ce = "useTransition", Ue(), tC();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", Ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", Ue(), vh(e, t);
        },
        useId: function() {
          return ce = "useId", Ue(), _h();
        },
        unstable_isNewReconciler: ye
      }, Zl = {
        readContext: function(e) {
          return eS(), xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", Dt(), un(), Kg(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", Dt(), un(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", Dt(), un(), gh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", Dt(), un(), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", Dt(), un(), Wg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", Dt(), un(), Qg(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", Dt(), un();
          var a = $e.current;
          $e.current = Zl;
          try {
            return qg(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", Dt(), un();
          var i = $e.current;
          $e.current = Zl;
          try {
            return Pg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", Dt(), un(), Yg(e);
        },
        useState: function(e) {
          ce = "useState", Dt(), un();
          var t = $e.current;
          $e.current = Zl;
          try {
            return mh(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", Dt(), un(), void 0;
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", Dt(), un(), Xg(e);
        },
        useTransition: function() {
          return ce = "useTransition", Dt(), un(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", Dt(), un(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", Dt(), un(), Vg(e, t, a);
        },
        useId: function() {
          return ce = "useId", Dt(), un(), Zg();
        },
        unstable_isNewReconciler: ye
      }, vl = {
        readContext: function(e) {
          return eS(), xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", Dt(), Ue(), bh(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", Dt(), Ue(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", Dt(), Ue(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", Dt(), Ue(), Eh(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", Dt(), Ue(), Sh(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", Dt(), Ue(), xh(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", Dt(), Ue();
          var a = $e.current;
          $e.current = vl;
          try {
            return wh(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", Dt(), Ue();
          var i = $e.current;
          $e.current = vl;
          try {
            return Hg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", Dt(), Ue(), hh();
        },
        useState: function(e) {
          ce = "useState", Dt(), Ue();
          var t = $e.current;
          $e.current = vl;
          try {
            return Ig(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", Dt(), Ue(), Ch();
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", Dt(), Ue(), XE(e);
        },
        useTransition: function() {
          return ce = "useTransition", Dt(), Ue(), eC();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", Dt(), Ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", Dt(), Ue(), vh(e, t);
        },
        useId: function() {
          return ce = "useId", Dt(), Ue(), _h();
        },
        unstable_isNewReconciler: ye
      }, Rh = {
        readContext: function(e) {
          return eS(), xr(e);
        },
        useCallback: function(e, t) {
          return ce = "useCallback", Dt(), Ue(), bh(e, t);
        },
        useContext: function(e) {
          return ce = "useContext", Dt(), Ue(), xr(e);
        },
        useEffect: function(e, t) {
          return ce = "useEffect", Dt(), Ue(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ce = "useImperativeHandle", Dt(), Ue(), Eh(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ce = "useInsertionEffect", Dt(), Ue(), Sh(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ce = "useLayoutEffect", Dt(), Ue(), xh(e, t);
        },
        useMemo: function(e, t) {
          ce = "useMemo", Dt(), Ue();
          var a = $e.current;
          $e.current = vl;
          try {
            return wh(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ce = "useReducer", Dt(), Ue();
          var i = $e.current;
          $e.current = vl;
          try {
            return Bg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return ce = "useRef", Dt(), Ue(), hh();
        },
        useState: function(e) {
          ce = "useState", Dt(), Ue();
          var t = $e.current;
          $e.current = vl;
          try {
            return $g(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ce = "useDebugValue", Dt(), Ue(), Ch();
        },
        useDeferredValue: function(e) {
          return ce = "useDeferredValue", Dt(), Ue(), JE(e);
        },
        useTransition: function() {
          return ce = "useTransition", Dt(), Ue(), tC();
        },
        useMutableSource: function(e, t, a) {
          return ce = "useMutableSource", Dt(), Ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ce = "useSyncExternalStore", Dt(), Ue(), vh(e, t);
        },
        useId: function() {
          return ce = "useId", Dt(), Ue(), _h();
        },
        unstable_isNewReconciler: ye
      };
    }
    var Hu = S.unstable_now, fC = 0, kh = -1, Ap = -1, jh = -1, tS = !1, Nh = !1;
    function dC() {
      return tS;
    }
    function bT() {
      Nh = !0;
    }
    function wT() {
      tS = !1, Nh = !1;
    }
    function _T() {
      tS = Nh, Nh = !1;
    }
    function pC() {
      return fC;
    }
    function vC() {
      fC = Hu();
    }
    function nS(e) {
      Ap = Hu(), e.actualStartTime < 0 && (e.actualStartTime = Hu());
    }
    function mC(e) {
      Ap = -1;
    }
    function Dh(e, t) {
      if (Ap >= 0) {
        var a = Hu() - Ap;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Ap = -1;
      }
    }
    function eo(e) {
      if (kh >= 0) {
        var t = Hu() - kh;
        kh = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case z:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case xe:
              var o = a.stateNode;
              o.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function rS(e) {
      if (jh >= 0) {
        var t = Hu() - jh;
        jh = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case z:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case xe:
              var o = a.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function to() {
      kh = Hu();
    }
    function aS() {
      jh = Hu();
    }
    function iS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ml(e, t) {
      if (e && e.defaultProps) {
        var a = qe({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var lS = {}, oS, uS, sS, cS, fS, hC, Oh, dS, pS, vS, Mp;
    {
      oS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), cS = /* @__PURE__ */ new Set(), dS = /* @__PURE__ */ new Set(), fS = /* @__PURE__ */ new Set(), pS = /* @__PURE__ */ new Set(), vS = /* @__PURE__ */ new Set(), Mp = /* @__PURE__ */ new Set();
      var yC = /* @__PURE__ */ new Set();
      Oh = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          yC.has(a) || (yC.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, hC = function(e, t) {
        if (t === void 0) {
          var a = Gt(e) || "Component";
          fS.has(a) || (fS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(lS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(lS);
    }
    function mS(e, t, a, i) {
      var o = e.memoizedState, s = a(i, o);
      {
        if (e.mode & vn) {
          Bn(!0);
          try {
            s = a(i, o);
          } finally {
            Bn(!1);
          }
        }
        hC(t, s);
      }
      var d = s == null ? o : qe({}, o, s);
      if (e.memoizedState = d, e.lanes === he) {
        var v = e.updateQueue;
        v.baseState = d;
      }
    }
    var hS = {
      isMounted: Pv,
      enqueueSetState: function(e, t, a) {
        var i = mu(e), o = Aa(), s = $u(i), d = Io(o, s);
        d.payload = t, a != null && (Oh(a, "setState"), d.callback = a);
        var v = Uu(i, d, s);
        v !== null && (Ar(v, i, s, o), oh(v, i, s)), hs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = mu(e), o = Aa(), s = $u(i), d = Io(o, s);
        d.tag = AE, d.payload = t, a != null && (Oh(a, "replaceState"), d.callback = a);
        var v = Uu(i, d, s);
        v !== null && (Ar(v, i, s, o), oh(v, i, s)), hs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = mu(e), i = Aa(), o = $u(a), s = Io(i, o);
        s.tag = ah, t != null && (Oh(t, "forceUpdate"), s.callback = t);
        var d = Uu(a, s, o);
        d !== null && (Ar(d, a, o, i), oh(d, a, o)), Uc(a, o);
      }
    };
    function gC(e, t, a, i, o, s, d) {
      var v = e.stateNode;
      if (typeof v.shouldComponentUpdate == "function") {
        var m = v.shouldComponentUpdate(i, s, d);
        {
          if (e.mode & vn) {
            Bn(!0);
            try {
              m = v.shouldComponentUpdate(i, s, d);
            } finally {
              Bn(!1);
            }
          }
          m === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Gt(t) || "Component");
        }
        return m;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Je(a, i) || !Je(o, s) : !0;
    }
    function TT(e, t, a) {
      var i = e.stateNode;
      {
        var o = Gt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), t.childContextTypes && !Mp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & vn) === st && (Mp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), t.contextTypes && !Mp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & vn) === st && (Mp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !pS.has(t) && (pS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Gt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var d = i.props !== a;
        i.props !== void 0 && d && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !sS.has(t) && (sS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Gt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var v = i.state;
        v && (typeof v != "object" || Mt(v)) && g("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function SC(e, t) {
      t.updater = hS, e.stateNode = t, yo(t, e), t._reactInternalInstance = lS;
    }
    function xC(e, t, a) {
      var i = !1, o = yi, s = yi, d = t.contextType;
      if ("contextType" in t) {
        var v = (
          // Allow null for conditional declaration
          d === null || d !== void 0 && d.$$typeof === T && d._context === void 0
        );
        if (!v && !vS.has(t)) {
          vS.add(t);
          var m = "";
          d === void 0 ? m = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof d != "object" ? m = " However, it is set to a " + typeof d + "." : d.$$typeof === Pa ? m = " Did you accidentally pass the Context.Provider instead?" : d._context !== void 0 ? m = " Did you accidentally pass the Context.Consumer instead?" : m = " However, it is set to an object with keys {" + Object.keys(d).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Gt(t) || "Component", m);
        }
      }
      if (typeof d == "object" && d !== null)
        s = xr(d);
      else {
        o = Tf(e, t, !0);
        var E = t.contextTypes;
        i = E != null, s = i ? Rf(e, o) : yi;
      }
      var C = new t(a, s);
      if (e.mode & vn) {
        Bn(!0);
        try {
          C = new t(a, s);
        } finally {
          Bn(!1);
        }
      }
      var M = e.memoizedState = C.state !== null && C.state !== void 0 ? C.state : null;
      SC(e, C);
      {
        if (typeof t.getDerivedStateFromProps == "function" && M === null) {
          var L = Gt(t) || "Component";
          uS.has(L) || (uS.add(L), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", L, C.state === null ? "null" : "undefined", L));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof C.getSnapshotBeforeUpdate == "function") {
          var $ = null, q = null, ie = null;
          if (typeof C.componentWillMount == "function" && C.componentWillMount.__suppressDeprecationWarning !== !0 ? $ = "componentWillMount" : typeof C.UNSAFE_componentWillMount == "function" && ($ = "UNSAFE_componentWillMount"), typeof C.componentWillReceiveProps == "function" && C.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? q = "componentWillReceiveProps" : typeof C.UNSAFE_componentWillReceiveProps == "function" && (q = "UNSAFE_componentWillReceiveProps"), typeof C.componentWillUpdate == "function" && C.componentWillUpdate.__suppressDeprecationWarning !== !0 ? ie = "componentWillUpdate" : typeof C.UNSAFE_componentWillUpdate == "function" && (ie = "UNSAFE_componentWillUpdate"), $ !== null || q !== null || ie !== null) {
            var Pe = Gt(t) || "Component", dt = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            cS.has(Pe) || (cS.add(Pe), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Pe, dt, $ !== null ? `
  ` + $ : "", q !== null ? `
  ` + q : "", ie !== null ? `
  ` + ie : ""));
          }
        }
      }
      return i && sE(e, o, s), C;
    }
    function RT(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", jt(e) || "Component"), hS.enqueueReplaceState(t, t.state, null));
    }
    function EC(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var s = jt(e) || "Component";
          oS.has(s) || (oS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        hS.enqueueReplaceState(t, t.state, null);
      }
    }
    function yS(e, t, a, i) {
      TT(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = {}, Tg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        o.context = xr(s);
      else {
        var d = Tf(e, t, !0);
        o.context = Rf(e, d);
      }
      {
        if (o.state === a) {
          var v = Gt(t) || "Component";
          dS.has(v) || (dS.add(v), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", v));
        }
        e.mode & vn && dl.recordLegacyContextWarning(e, o), dl.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var m = t.getDerivedStateFromProps;
      if (typeof m == "function" && (mS(e, t, m, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (RT(e, o), uh(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var E = Vt;
        E |= tl, (e.mode & tn) !== st && (E |= Ll), e.flags |= E;
      }
    }
    function kT(e, t, a, i) {
      var o = e.stateNode, s = e.memoizedProps;
      o.props = s;
      var d = o.context, v = t.contextType, m = yi;
      if (typeof v == "object" && v !== null)
        m = xr(v);
      else {
        var E = Tf(e, t, !0);
        m = Rf(e, E);
      }
      var C = t.getDerivedStateFromProps, M = typeof C == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !M && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (s !== a || d !== m) && EC(e, o, a, m), UE();
      var L = e.memoizedState, $ = o.state = L;
      if (uh(e, a, o, i), $ = e.memoizedState, s === a && L === $ && !Im() && !sh()) {
        if (typeof o.componentDidMount == "function") {
          var q = Vt;
          q |= tl, (e.mode & tn) !== st && (q |= Ll), e.flags |= q;
        }
        return !1;
      }
      typeof C == "function" && (mS(e, t, C, a), $ = e.memoizedState);
      var ie = sh() || gC(e, t, s, a, L, $, m);
      if (ie) {
        if (!M && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var Pe = Vt;
          Pe |= tl, (e.mode & tn) !== st && (Pe |= Ll), e.flags |= Pe;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var dt = Vt;
          dt |= tl, (e.mode & tn) !== st && (dt |= Ll), e.flags |= dt;
        }
        e.memoizedProps = a, e.memoizedState = $;
      }
      return o.props = a, o.state = $, o.context = m, ie;
    }
    function jT(e, t, a, i, o) {
      var s = t.stateNode;
      ME(e, t);
      var d = t.memoizedProps, v = t.type === t.elementType ? d : ml(t.type, d);
      s.props = v;
      var m = t.pendingProps, E = s.context, C = a.contextType, M = yi;
      if (typeof C == "object" && C !== null)
        M = xr(C);
      else {
        var L = Tf(t, a, !0);
        M = Rf(t, L);
      }
      var $ = a.getDerivedStateFromProps, q = typeof $ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !q && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (d !== m || E !== M) && EC(t, s, i, M), UE();
      var ie = t.memoizedState, Pe = s.state = ie;
      if (uh(t, i, s, o), Pe = t.memoizedState, d === m && ie === Pe && !Im() && !sh() && !Ve)
        return typeof s.componentDidUpdate == "function" && (d !== e.memoizedProps || ie !== e.memoizedState) && (t.flags |= Vt), typeof s.getSnapshotBeforeUpdate == "function" && (d !== e.memoizedProps || ie !== e.memoizedState) && (t.flags |= dr), !1;
      typeof $ == "function" && (mS(t, a, $, i), Pe = t.memoizedState);
      var dt = sh() || gC(t, a, v, i, ie, Pe, M) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Ve;
      return dt ? (!q && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Pe, M), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Pe, M)), typeof s.componentDidUpdate == "function" && (t.flags |= Vt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= dr)) : (typeof s.componentDidUpdate == "function" && (d !== e.memoizedProps || ie !== e.memoizedState) && (t.flags |= Vt), typeof s.getSnapshotBeforeUpdate == "function" && (d !== e.memoizedProps || ie !== e.memoizedState) && (t.flags |= dr), t.memoizedProps = i, t.memoizedState = Pe), s.props = i, s.state = Pe, s.context = M, dt;
    }
    function tc(e, t) {
      return {
        value: e,
        source: t,
        stack: Ki(t),
        digest: null
      };
    }
    function gS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function NT(e, t) {
      return !0;
    }
    function SS(e, t) {
      try {
        var a = NT(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, s = t.stack, d = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === U)
            return;
          console.error(i);
        }
        var v = o ? jt(o) : null, m = v ? "The above error occurred in the <" + v + "> component:" : "The above error occurred in one of your React components:", E;
        if (e.tag === z)
          E = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var C = jt(e) || "Anonymous";
          E = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + C + ".");
        }
        var M = m + `
` + d + `

` + ("" + E);
        console.error(M);
      } catch (L) {
        setTimeout(function() {
          throw L;
        });
      }
    }
    var DT = typeof WeakMap == "function" ? WeakMap : Map;
    function CC(e, t, a) {
      var i = Io(xn, a);
      i.tag = wg, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        bk(o), SS(e, t);
      }, i;
    }
    function xS(e, t, a) {
      var i = Io(xn, a);
      i.tag = wg;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var s = t.value;
        i.payload = function() {
          return o(s);
        }, i.callback = function() {
          Lb(e), SS(e, t);
        };
      }
      var d = e.stateNode;
      return d !== null && typeof d.componentDidCatch == "function" && (i.callback = function() {
        Lb(e), SS(e, t), typeof o != "function" && Ek(this);
        var m = t.value, E = t.stack;
        this.componentDidCatch(m, {
          componentStack: E !== null ? E : ""
        }), typeof o != "function" && (ma(e.lanes, gt) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", jt(e) || "Unknown"));
      }), i;
    }
    function bC(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new DT(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var s = wk.bind(null, e, t, a);
        pa && Jp(e, a), t.then(s, s);
      }
    }
    function OT(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        o.add(a);
    }
    function LT(e, t) {
      var a = e.tag;
      if ((e.mode & Ut) === st && (a === O || a === _e || a === W)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function wC(e) {
      var t = e;
      do {
        if (t.tag === fe && pT(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function _C(e, t, a, i, o) {
      if ((e.mode & Ut) === st) {
        if (e === t)
          e.flags |= hr;
        else {
          if (e.flags |= lt, a.flags |= kc, a.flags &= -52805, a.tag === U) {
            var s = a.alternate;
            if (s === null)
              a.tag = de;
            else {
              var d = Io(xn, gt);
              d.tag = ah, Uu(a, d, gt);
            }
          }
          a.lanes = Lt(a.lanes, gt);
        }
        return e;
      }
      return e.flags |= hr, e.lanes = o, e;
    }
    function AT(e, t, a, i, o) {
      if (a.flags |= cs, pa && Jp(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        LT(a), Kr() && a.mode & Ut && hE();
        var d = wC(t);
        if (d !== null) {
          d.flags &= ~Ur, _C(d, t, a, e, o), d.mode & Ut && bC(e, s, o), OT(d, e, s);
          return;
        } else {
          if (!Qv(o)) {
            bC(e, s, o), ZS();
            return;
          }
          var v = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = v;
        }
      } else if (Kr() && a.mode & Ut) {
        hE();
        var m = wC(t);
        if (m !== null) {
          (m.flags & hr) === ut && (m.flags |= Ur), _C(m, t, a, e, o), dg(tc(i, a));
          return;
        }
      }
      i = tc(i, a), pk(i);
      var E = t;
      do {
        switch (E.tag) {
          case z: {
            var C = i;
            E.flags |= hr;
            var M = _s(o);
            E.lanes = Lt(E.lanes, M);
            var L = CC(E, C, M);
            Rg(E, L);
            return;
          }
          case U:
            var $ = i, q = E.type, ie = E.stateNode;
            if ((E.flags & lt) === ut && (typeof q.getDerivedStateFromError == "function" || ie !== null && typeof ie.componentDidCatch == "function" && !wb(ie))) {
              E.flags |= hr;
              var Pe = _s(o);
              E.lanes = Lt(E.lanes, Pe);
              var dt = xS(E, $, Pe);
              Rg(E, dt);
              return;
            }
            break;
        }
        E = E.return;
      } while (E !== null);
    }
    function MT() {
      return null;
    }
    var Up = b.ReactCurrentOwner, hl = !1, ES, zp, CS, bS, wS, nc, _S, Lh, Fp;
    ES = {}, zp = {}, CS = {}, bS = {}, wS = {}, nc = !1, _S = {}, Lh = {}, Fp = {};
    function Oa(e, t, a, i) {
      e === null ? t.child = kE(t, null, a, i) : t.child = Df(t, e.child, a, i);
    }
    function UT(e, t, a, i) {
      t.child = Df(t, e.child, null, i), t.child = Df(t, null, a, i);
    }
    function TC(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && cl(
          s,
          i,
          // Resolved props
          "prop",
          Gt(a)
        );
      }
      var d = a.render, v = t.ref, m, E;
      Lf(t, o), ka(t);
      {
        if (Up.current = t, fr(!0), m = Pf(e, t, d, i, v, o), E = Hf(), t.mode & vn) {
          Bn(!0);
          try {
            m = Pf(e, t, d, i, v, o), E = Hf();
          } finally {
            Bn(!1);
          }
        }
        fr(!1);
      }
      return ja(), e !== null && !hl ? (VE(e, t, o), $o(e, t, o)) : (Kr() && E && lg(t), t.flags |= di, Oa(e, t, m, o), t.child);
    }
    function RC(e, t, a, i, o) {
      if (e === null) {
        var s = a.type;
        if (Bk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var d = s;
          return d = Gf(s), t.tag = W, t.type = d, kS(t, s), kC(e, t, d, i, o);
        }
        {
          var v = s.propTypes;
          if (v && cl(
            v,
            i,
            // Resolved props
            "prop",
            Gt(s)
          ), a.defaultProps !== void 0) {
            var m = Gt(s) || "Unknown";
            Fp[m] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", m), Fp[m] = !0);
          }
        }
        var E = cx(a.type, null, i, t, t.mode, o);
        return E.ref = t.ref, E.return = t, t.child = E, E;
      }
      {
        var C = a.type, M = C.propTypes;
        M && cl(
          M,
          i,
          // Resolved props
          "prop",
          Gt(C)
        );
      }
      var L = e.child, $ = AS(e, o);
      if (!$) {
        var q = L.memoizedProps, ie = a.compare;
        if (ie = ie !== null ? ie : Je, ie(q, i) && e.ref === t.ref)
          return $o(e, t, o);
      }
      t.flags |= di;
      var Pe = oc(L, i);
      return Pe.ref = t.ref, Pe.return = t, t.child = Pe, Pe;
    }
    function kC(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Tt) {
          var d = s, v = d._payload, m = d._init;
          try {
            s = m(v);
          } catch {
            s = null;
          }
          var E = s && s.propTypes;
          E && cl(
            E,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Gt(s)
          );
        }
      }
      if (e !== null) {
        var C = e.memoizedProps;
        if (Je(C, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (hl = !1, t.pendingProps = i = C, AS(e, o))
            (e.flags & kc) !== ut && (hl = !0);
          else return t.lanes = e.lanes, $o(e, t, o);
      }
      return TS(e, t, a, i, o);
    }
    function jC(e, t, a) {
      var i = t.pendingProps, o = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || je)
        if ((t.mode & Ut) === st) {
          var d = {
            baseLanes: he,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = d, Wh(t, a);
        } else if (ma(a, va)) {
          var M = {
            baseLanes: he,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = M;
          var L = s !== null ? s.baseLanes : a;
          Wh(t, L);
        } else {
          var v = null, m;
          if (s !== null) {
            var E = s.baseLanes;
            m = Lt(E, a);
          } else
            m = a;
          t.lanes = t.childLanes = va;
          var C = {
            baseLanes: m,
            cachePool: v,
            transitions: null
          };
          return t.memoizedState = C, t.updateQueue = null, Wh(t, m), null;
        }
      else {
        var $;
        s !== null ? ($ = Lt(s.baseLanes, a), t.memoizedState = null) : $ = a, Wh(t, $);
      }
      return Oa(e, t, o, a), t.child;
    }
    function zT(e, t, a) {
      var i = t.pendingProps;
      return Oa(e, t, i, a), t.child;
    }
    function FT(e, t, a) {
      var i = t.pendingProps.children;
      return Oa(e, t, i, a), t.child;
    }
    function PT(e, t, a) {
      {
        t.flags |= Vt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, s = o.children;
      return Oa(e, t, s, a), t.child;
    }
    function NC(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Yn, t.flags |= yu);
    }
    function TS(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && cl(
          s,
          i,
          // Resolved props
          "prop",
          Gt(a)
        );
      }
      var d;
      {
        var v = Tf(t, a, !0);
        d = Rf(t, v);
      }
      var m, E;
      Lf(t, o), ka(t);
      {
        if (Up.current = t, fr(!0), m = Pf(e, t, a, i, d, o), E = Hf(), t.mode & vn) {
          Bn(!0);
          try {
            m = Pf(e, t, a, i, d, o), E = Hf();
          } finally {
            Bn(!1);
          }
        }
        fr(!1);
      }
      return ja(), e !== null && !hl ? (VE(e, t, o), $o(e, t, o)) : (Kr() && E && lg(t), t.flags |= di, Oa(e, t, m, o), t.child);
    }
    function DC(e, t, a, i, o) {
      {
        switch (nj(t)) {
          case !1: {
            var s = t.stateNode, d = t.type, v = new d(t.memoizedProps, s.context), m = v.state;
            s.updater.enqueueSetState(s, m, null);
            break;
          }
          case !0: {
            t.flags |= lt, t.flags |= hr;
            var E = new Error("Simulated error coming from DevTools"), C = _s(o);
            t.lanes = Lt(t.lanes, C);
            var M = xS(t, tc(E, t), C);
            Rg(t, M);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var L = a.propTypes;
          L && cl(
            L,
            i,
            // Resolved props
            "prop",
            Gt(a)
          );
        }
      }
      var $;
      ql(a) ? ($ = !0, Ym(t)) : $ = !1, Lf(t, o);
      var q = t.stateNode, ie;
      q === null ? (Mh(e, t), xC(t, a, i), yS(t, a, i, o), ie = !0) : e === null ? ie = kT(t, a, i, o) : ie = jT(e, t, a, i, o);
      var Pe = RS(e, t, a, ie, $, o);
      {
        var dt = t.stateNode;
        ie && dt.props !== i && (nc || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", jt(t) || "a component"), nc = !0);
      }
      return Pe;
    }
    function RS(e, t, a, i, o, s) {
      NC(e, t);
      var d = (t.flags & lt) !== ut;
      if (!i && !d)
        return o && dE(t, a, !1), $o(e, t, s);
      var v = t.stateNode;
      Up.current = t;
      var m;
      if (d && typeof a.getDerivedStateFromError != "function")
        m = null, mC();
      else {
        ka(t);
        {
          if (fr(!0), m = v.render(), t.mode & vn) {
            Bn(!0);
            try {
              v.render();
            } finally {
              Bn(!1);
            }
          }
          fr(!1);
        }
        ja();
      }
      return t.flags |= di, e !== null && d ? UT(e, t, m, s) : Oa(e, t, m, s), t.memoizedState = v.state, o && dE(t, a, !0), t.child;
    }
    function OC(e) {
      var t = e.stateNode;
      t.pendingContext ? cE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && cE(e, t.context, !1), kg(e, t.containerInfo);
    }
    function HT(e, t, a) {
      if (OC(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, s = o.element;
      ME(e, t), uh(t, i, null, a);
      var d = t.memoizedState;
      t.stateNode;
      var v = d.element;
      if (o.isDehydrated) {
        var m = {
          element: v,
          isDehydrated: !1,
          cache: d.cache,
          pendingSuspenseBoundaries: d.pendingSuspenseBoundaries,
          transitions: d.transitions
        }, E = t.updateQueue;
        if (E.baseState = m, t.memoizedState = m, t.flags & Ur) {
          var C = tc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return LC(e, t, v, a, C);
        } else if (v !== s) {
          var M = tc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return LC(e, t, v, a, M);
        } else {
          I_(t);
          var L = kE(t, null, v, a);
          t.child = L;
          for (var $ = L; $; )
            $.flags = $.flags & ~Hn | ca, $ = $.sibling;
        }
      } else {
        if (Nf(), v === s)
          return $o(e, t, a);
        Oa(e, t, v, a);
      }
      return t.child;
    }
    function LC(e, t, a, i, o) {
      return Nf(), dg(o), t.flags |= Ur, Oa(e, t, a, i), t.child;
    }
    function BT(e, t, a) {
      PE(t), e === null && fg(t);
      var i = t.type, o = t.pendingProps, s = e !== null ? e.memoizedProps : null, d = o.children, v = Wy(i, o);
      return v ? d = null : s !== null && Wy(i, s) && (t.flags |= Ya), NC(e, t), Oa(e, t, d, a), t.child;
    }
    function VT(e, t) {
      return e === null && fg(t), null;
    }
    function IT(e, t, a, i) {
      Mh(e, t);
      var o = t.pendingProps, s = a, d = s._payload, v = s._init, m = v(d);
      t.type = m;
      var E = t.tag = Vk(m), C = ml(m, o), M;
      switch (E) {
        case O:
          return kS(t, m), t.type = m = Gf(m), M = TS(null, t, m, C, i), M;
        case U:
          return t.type = m = ax(m), M = DC(null, t, m, C, i), M;
        case _e:
          return t.type = m = ix(m), M = TC(null, t, m, C, i), M;
        case pe: {
          if (t.type !== t.elementType) {
            var L = m.propTypes;
            L && cl(
              L,
              C,
              // Resolved for outer only
              "prop",
              Gt(m)
            );
          }
          return M = RC(
            null,
            t,
            m,
            ml(m.type, C),
            // The inner type can have defaults too
            i
          ), M;
        }
      }
      var $ = "";
      throw m !== null && typeof m == "object" && m.$$typeof === Tt && ($ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + m + ". " + ("Lazy element type must resolve to a class or function." + $));
    }
    function $T(e, t, a, i, o) {
      Mh(e, t), t.tag = U;
      var s;
      return ql(a) ? (s = !0, Ym(t)) : s = !1, Lf(t, o), xC(t, a, i), yS(t, a, i, o), RS(null, t, a, !0, s, o);
    }
    function YT(e, t, a, i) {
      Mh(e, t);
      var o = t.pendingProps, s;
      {
        var d = Tf(t, a, !1);
        s = Rf(t, d);
      }
      Lf(t, i);
      var v, m;
      ka(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var E = Gt(a) || "Unknown";
          ES[E] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", E, E), ES[E] = !0);
        }
        t.mode & vn && dl.recordLegacyContextWarning(t, null), fr(!0), Up.current = t, v = Pf(null, t, a, o, s, i), m = Hf(), fr(!1);
      }
      if (ja(), t.flags |= di, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0) {
        var C = Gt(a) || "Unknown";
        zp[C] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", C, C, C), zp[C] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0
      ) {
        {
          var M = Gt(a) || "Unknown";
          zp[M] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", M, M, M), zp[M] = !0);
        }
        t.tag = U, t.memoizedState = null, t.updateQueue = null;
        var L = !1;
        return ql(a) ? (L = !0, Ym(t)) : L = !1, t.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, Tg(t), SC(t, v), yS(t, a, o, i), RS(null, t, a, !0, L, i);
      } else {
        if (t.tag = O, t.mode & vn) {
          Bn(!0);
          try {
            v = Pf(null, t, a, o, s, i), m = Hf();
          } finally {
            Bn(!1);
          }
        }
        return Kr() && m && lg(t), Oa(null, t, v, i), kS(t, a), t.child;
      }
    }
    function kS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Vr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", s = e._debugSource;
          s && (o = s.fileName + ":" + s.lineNumber), wS[o] || (wS[o] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var d = Gt(t) || "Unknown";
          Fp[d] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", d), Fp[d] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var v = Gt(t) || "Unknown";
          bS[v] || (g("%s: Function components do not support getDerivedStateFromProps.", v), bS[v] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var m = Gt(t) || "Unknown";
          CS[m] || (g("%s: Function components do not support contextType.", m), CS[m] = !0);
        }
      }
    }
    var jS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Jt
    };
    function NS(e) {
      return {
        baseLanes: e,
        cachePool: MT(),
        transitions: null
      };
    }
    function WT(e, t) {
      var a = null;
      return {
        baseLanes: Lt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function QT(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return Dg(e, Rp);
    }
    function GT(e, t) {
      return Ts(e.childLanes, t);
    }
    function AC(e, t, a) {
      var i = t.pendingProps;
      rj(t) && (t.flags |= lt);
      var o = pl.current, s = !1, d = (t.flags & lt) !== ut;
      if (d || QT(o, e) ? (s = !0, t.flags &= ~lt) : (e === null || e.memoizedState !== null) && (o = dT(o, BE)), o = Mf(o), Fu(t, o), e === null) {
        fg(t);
        var v = t.memoizedState;
        if (v !== null) {
          var m = v.dehydrated;
          if (m !== null)
            return ZT(t, m);
        }
        var E = i.children, C = i.fallback;
        if (s) {
          var M = KT(t, E, C, a), L = t.child;
          return L.memoizedState = NS(a), t.memoizedState = jS, M;
        } else
          return DS(t, E);
      } else {
        var $ = e.memoizedState;
        if ($ !== null) {
          var q = $.dehydrated;
          if (q !== null)
            return eR(e, t, d, i, q, $, a);
        }
        if (s) {
          var ie = i.fallback, Pe = i.children, dt = XT(e, t, Pe, ie, a), it = t.child, Yt = e.child.memoizedState;
          return it.memoizedState = Yt === null ? NS(a) : WT(Yt, a), it.childLanes = GT(e, a), t.memoizedState = jS, dt;
        } else {
          var Pt = i.children, H = qT(e, t, Pt, a);
          return t.memoizedState = null, H;
        }
      }
    }
    function DS(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, s = OS(o, i);
      return s.return = e, e.child = s, s;
    }
    function KT(e, t, a, i) {
      var o = e.mode, s = e.child, d = {
        mode: "hidden",
        children: t
      }, v, m;
      return (o & Ut) === st && s !== null ? (v = s, v.childLanes = he, v.pendingProps = d, e.mode & en && (v.actualDuration = 0, v.actualStartTime = -1, v.selfBaseDuration = 0, v.treeBaseDuration = 0), m = Wu(a, o, i, null)) : (v = OS(d, o), m = Wu(a, o, i, null)), v.return = e, m.return = e, v.sibling = m, e.child = v, m;
    }
    function OS(e, t, a) {
      return Mb(e, t, he, null);
    }
    function MC(e, t) {
      return oc(e, t);
    }
    function qT(e, t, a, i) {
      var o = e.child, s = o.sibling, d = MC(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Ut) === st && (d.lanes = i), d.return = t, d.sibling = null, s !== null) {
        var v = t.deletions;
        v === null ? (t.deletions = [s], t.flags |= $a) : v.push(s);
      }
      return t.child = d, d;
    }
    function XT(e, t, a, i, o) {
      var s = t.mode, d = e.child, v = d.sibling, m = {
        mode: "hidden",
        children: a
      }, E;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Ut) === st && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== d
      ) {
        var C = t.child;
        E = C, E.childLanes = he, E.pendingProps = m, t.mode & en && (E.actualDuration = 0, E.actualStartTime = -1, E.selfBaseDuration = d.selfBaseDuration, E.treeBaseDuration = d.treeBaseDuration), t.deletions = null;
      } else
        E = MC(d, m), E.subtreeFlags = d.subtreeFlags & nr;
      var M;
      return v !== null ? M = oc(v, i) : (M = Wu(i, s, o, null), M.flags |= Hn), M.return = t, E.return = t, E.sibling = M, t.child = E, M;
    }
    function Ah(e, t, a, i) {
      i !== null && dg(i), Df(t, e.child, null, a);
      var o = t.pendingProps, s = o.children, d = DS(t, s);
      return d.flags |= Hn, t.memoizedState = null, d;
    }
    function JT(e, t, a, i, o) {
      var s = t.mode, d = {
        mode: "visible",
        children: a
      }, v = OS(d, s), m = Wu(i, s, o, null);
      return m.flags |= Hn, v.return = t, m.return = t, v.sibling = m, t.child = v, (t.mode & Ut) !== st && Df(t, e.child, null, o), m;
    }
    function ZT(e, t, a) {
      return (e.mode & Ut) === st ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = gt) : qy(t) ? e.lanes = zr : e.lanes = va, null;
    }
    function eR(e, t, a, i, o, s, d) {
      if (a)
        if (t.flags & Ur) {
          t.flags &= ~Ur;
          var H = gS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Ah(e, t, d, H);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= lt, null;
          var le = i.children, B = i.fallback, ke = JT(e, t, le, B, d), Qe = t.child;
          return Qe.memoizedState = NS(d), t.memoizedState = jS, ke;
        }
      else {
        if (B_(), (t.mode & Ut) === st)
          return Ah(
            e,
            t,
            d,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (qy(o)) {
          var v, m, E;
          {
            var C = a_(o);
            v = C.digest, m = C.message, E = C.stack;
          }
          var M;
          m ? M = new Error(m) : M = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var L = gS(M, v, E);
          return Ah(e, t, d, L);
        }
        var $ = ma(d, e.childLanes);
        if (hl || $) {
          var q = Yh();
          if (q !== null) {
            var ie = Bd(q, d);
            if (ie !== Jt && ie !== s.retryLane) {
              s.retryLane = ie;
              var Pe = xn;
              ei(e, ie), Ar(q, e, ie, Pe);
            }
          }
          ZS();
          var dt = gS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Ah(e, t, d, dt);
        } else if (aE(o)) {
          t.flags |= lt, t.child = e.child;
          var it = _k.bind(null, e);
          return i_(o, it), null;
        } else {
          $_(t, o, s.treeContext);
          var Yt = i.children, Pt = DS(t, Yt);
          return Pt.flags |= ca, Pt;
        }
      }
    }
    function UC(e, t, a) {
      e.lanes = Lt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Lt(i.lanes, t)), Cg(e.return, t, a);
    }
    function tR(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === fe) {
          var o = i.memoizedState;
          o !== null && UC(i, a, e);
        } else if (i.tag === Le)
          UC(i, a, e);
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
    function nR(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && dh(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function rR(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !_S[e])
        if (_S[e] = !0, typeof e == "string")
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
    function aR(e, t) {
      e !== void 0 && !Lh[e] && (e !== "collapsed" && e !== "hidden" ? (Lh[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Lh[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function zC(e, t) {
      {
        var a = Mt(e), i = !a && typeof rt(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function iR(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Mt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!zC(e[a], a))
              return;
        } else {
          var i = rt(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var s = o.next(), d = 0; !s.done; s = o.next()) {
                if (!zC(s.value, d))
                  return;
                d++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function LS(e, t, a, i, o) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: o
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = o);
    }
    function FC(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, s = i.tail, d = i.children;
      rR(o), aR(s, o), iR(d, o), Oa(e, t, d, a);
      var v = pl.current, m = Dg(v, Rp);
      if (m)
        v = Og(v, Rp), t.flags |= lt;
      else {
        var E = e !== null && (e.flags & lt) !== ut;
        E && tR(t, t.child, a), v = Mf(v);
      }
      if (Fu(t, v), (t.mode & Ut) === st)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var C = nR(t.child), M;
            C === null ? (M = t.child, t.child = null) : (M = C.sibling, C.sibling = null), LS(
              t,
              !1,
              // isBackwards
              M,
              C,
              s
            );
            break;
          }
          case "backwards": {
            var L = null, $ = t.child;
            for (t.child = null; $ !== null; ) {
              var q = $.alternate;
              if (q !== null && dh(q) === null) {
                t.child = $;
                break;
              }
              var ie = $.sibling;
              $.sibling = L, L = $, $ = ie;
            }
            LS(
              t,
              !0,
              // isBackwards
              L,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            LS(
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
    function lR(e, t, a) {
      kg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Df(t, null, i, a) : Oa(e, t, i, a), t.child;
    }
    var PC = !1;
    function oR(e, t, a) {
      var i = t.type, o = i._context, s = t.pendingProps, d = t.memoizedProps, v = s.value;
      {
        "value" in s || PC || (PC = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var m = t.type.propTypes;
        m && cl(m, s, "prop", "Context.Provider");
      }
      if (DE(t, o, v), d !== null) {
        var E = d.value;
        if (Ce(E, v)) {
          if (d.children === s.children && !Im())
            return $o(e, t, a);
        } else
          rT(t, o, a);
      }
      var C = s.children;
      return Oa(e, t, C, a), t.child;
    }
    var HC = !1;
    function uR(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (HC || (HC = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, s = o.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Lf(t, a);
      var d = xr(i);
      ka(t);
      var v;
      return Up.current = t, fr(!0), v = s(d), fr(!1), ja(), t.flags |= di, Oa(e, t, v, a), t.child;
    }
    function Pp() {
      hl = !0;
    }
    function Mh(e, t) {
      (t.mode & Ut) === st && e !== null && (e.alternate = null, t.alternate = null, t.flags |= Hn);
    }
    function $o(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), mC(), Xp(t.lanes), ma(a, t.childLanes) ? (tT(e, t), t.child) : null;
    }
    function sR(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var o = i.child;
          if (o === null)
            throw new Error("Expected parent to have a child.");
          for (; o.sibling !== t; )
            if (o = o.sibling, o === null)
              throw new Error("Expected to find the previous sibling.");
          o.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= $a) : s.push(e), a.flags |= Hn, a;
      }
    }
    function AS(e, t) {
      var a = e.lanes;
      return !!ma(a, t);
    }
    function cR(e, t, a) {
      switch (t.tag) {
        case z:
          OC(t), t.stateNode, Nf();
          break;
        case ae:
          PE(t);
          break;
        case U: {
          var i = t.type;
          ql(i) && Ym(t);
          break;
        }
        case Y:
          kg(t, t.stateNode.containerInfo);
          break;
        case ue: {
          var o = t.memoizedProps.value, s = t.type._context;
          DE(t, s, o);
          break;
        }
        case xe:
          {
            var d = ma(a, t.childLanes);
            d && (t.flags |= Vt);
            {
              var v = t.stateNode;
              v.effectDuration = 0, v.passiveEffectDuration = 0;
            }
          }
          break;
        case fe: {
          var m = t.memoizedState;
          if (m !== null) {
            if (m.dehydrated !== null)
              return Fu(t, Mf(pl.current)), t.flags |= lt, null;
            var E = t.child, C = E.childLanes;
            if (ma(a, C))
              return AC(e, t, a);
            Fu(t, Mf(pl.current));
            var M = $o(e, t, a);
            return M !== null ? M.sibling : null;
          } else
            Fu(t, Mf(pl.current));
          break;
        }
        case Le: {
          var L = (e.flags & lt) !== ut, $ = ma(a, t.childLanes);
          if (L) {
            if ($)
              return FC(e, t, a);
            t.flags |= lt;
          }
          var q = t.memoizedState;
          if (q !== null && (q.rendering = null, q.tail = null, q.lastEffect = null), Fu(t, pl.current), $)
            break;
          return null;
        }
        case te:
        case Ae:
          return t.lanes = he, jC(e, t, a);
      }
      return $o(e, t, a);
    }
    function BC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return sR(e, t, cx(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || Im() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          hl = !0;
        else {
          var s = AS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & lt) === ut)
            return hl = !1, cR(e, t, a);
          (e.flags & kc) !== ut ? hl = !0 : hl = !1;
        }
      } else if (hl = !1, Kr() && M_(t)) {
        var d = t.index, v = U_();
        mE(t, v, d);
      }
      switch (t.lanes = he, t.tag) {
        case be:
          return YT(e, t, t.type, a);
        case we: {
          var m = t.elementType;
          return IT(e, t, m, a);
        }
        case O: {
          var E = t.type, C = t.pendingProps, M = t.elementType === E ? C : ml(E, C);
          return TS(e, t, E, M, a);
        }
        case U: {
          var L = t.type, $ = t.pendingProps, q = t.elementType === L ? $ : ml(L, $);
          return DC(e, t, L, q, a);
        }
        case z:
          return HT(e, t, a);
        case ae:
          return BT(e, t, a);
        case se:
          return VT(e, t);
        case fe:
          return AC(e, t, a);
        case Y:
          return lR(e, t, a);
        case _e: {
          var ie = t.type, Pe = t.pendingProps, dt = t.elementType === ie ? Pe : ml(ie, Pe);
          return TC(e, t, ie, dt, a);
        }
        case re:
          return zT(e, t, a);
        case Se:
          return FT(e, t, a);
        case xe:
          return PT(e, t, a);
        case ue:
          return oR(e, t, a);
        case He:
          return uR(e, t, a);
        case pe: {
          var it = t.type, Yt = t.pendingProps, Pt = ml(it, Yt);
          if (t.type !== t.elementType) {
            var H = it.propTypes;
            H && cl(
              H,
              Pt,
              // Resolved for outer only
              "prop",
              Gt(it)
            );
          }
          return Pt = ml(it.type, Pt), RC(e, t, it, Pt, a);
        }
        case W:
          return kC(e, t, t.type, t.pendingProps, a);
        case de: {
          var le = t.type, B = t.pendingProps, ke = t.elementType === le ? B : ml(le, B);
          return $T(e, t, le, ke, a);
        }
        case Le:
          return FC(e, t, a);
        case Ke:
          break;
        case te:
          return jC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Bf(e) {
      e.flags |= Vt;
    }
    function VC(e) {
      e.flags |= Yn, e.flags |= yu;
    }
    var IC, MS, $C, YC;
    IC = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === ae || o.tag === se)
          O0(e, o.stateNode);
        else if (o.tag !== Y) {
          if (o.child !== null) {
            o.child.return = o, o = o.child;
            continue;
          }
        }
        if (o === t)
          return;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === t)
            return;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }, MS = function(e, t) {
    }, $C = function(e, t, a, i, o) {
      var s = e.memoizedProps;
      if (s !== i) {
        var d = t.stateNode, v = jg(), m = A0(d, a, s, i, o, v);
        t.updateQueue = m, m && Bf(t);
      }
    }, YC = function(e, t, a, i) {
      a !== i && Bf(t);
    };
    function Hp(e, t) {
      if (!Kr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var o = e.tail, s = null; o !== null; )
              o.alternate !== null && (s = o), o = o.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Xr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = he, i = ut;
      if (t) {
        if ((e.mode & en) !== st) {
          for (var m = e.selfBaseDuration, E = e.child; E !== null; )
            a = Lt(a, Lt(E.lanes, E.childLanes)), i |= E.subtreeFlags & nr, i |= E.flags & nr, m += E.treeBaseDuration, E = E.sibling;
          e.treeBaseDuration = m;
        } else
          for (var C = e.child; C !== null; )
            a = Lt(a, Lt(C.lanes, C.childLanes)), i |= C.subtreeFlags & nr, i |= C.flags & nr, C.return = e, C = C.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & en) !== st) {
          for (var o = e.actualDuration, s = e.selfBaseDuration, d = e.child; d !== null; )
            a = Lt(a, Lt(d.lanes, d.childLanes)), i |= d.subtreeFlags, i |= d.flags, o += d.actualDuration, s += d.treeBaseDuration, d = d.sibling;
          e.actualDuration = o, e.treeBaseDuration = s;
        } else
          for (var v = e.child; v !== null; )
            a = Lt(a, Lt(v.lanes, v.childLanes)), i |= v.subtreeFlags, i |= v.flags, v.return = e, v = v.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function fR(e, t, a) {
      if (K_() && (t.mode & Ut) !== st && (t.flags & lt) === ut)
        return CE(t), Nf(), t.flags |= Ur | cs | hr, !1;
      var i = qm(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (Q_(t), Xr(t), (t.mode & en) !== st) {
            var o = a !== null;
            if (o) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Nf(), (t.flags & lt) === ut && (t.memoizedState = null), t.flags |= Vt, Xr(t), (t.mode & en) !== st) {
            var d = a !== null;
            if (d) {
              var v = t.child;
              v !== null && (t.treeBaseDuration -= v.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return bE(), !0;
    }
    function WC(e, t, a) {
      var i = t.pendingProps;
      switch (og(t), t.tag) {
        case be:
        case we:
        case W:
        case O:
        case _e:
        case re:
        case Se:
        case xe:
        case He:
        case pe:
          return Xr(t), null;
        case U: {
          var o = t.type;
          return ql(o) && $m(t), Xr(t), null;
        }
        case z: {
          var s = t.stateNode;
          if (Af(t), rg(t), Ag(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var d = qm(t);
            if (d)
              Bf(t);
            else if (e !== null) {
              var v = e.memoizedState;
              // Check if this is a client root
              (!v.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Ur) !== ut) && (t.flags |= dr, bE());
            }
          }
          return MS(e, t), Xr(t), null;
        }
        case ae: {
          Ng(t);
          var m = FE(), E = t.type;
          if (e !== null && t.stateNode != null)
            $C(e, t, E, i, m), e.ref !== t.ref && VC(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Xr(t), null;
            }
            var C = jg(), M = qm(t);
            if (M)
              Y_(t, m, C) && Bf(t);
            else {
              var L = D0(E, i, m, C, t);
              IC(L, t, !1, !1), t.stateNode = L, L0(L, E, i, m) && Bf(t);
            }
            t.ref !== null && VC(t);
          }
          return Xr(t), null;
        }
        case se: {
          var $ = i;
          if (e && t.stateNode != null) {
            var q = e.memoizedProps;
            YC(e, t, q, $);
          } else {
            if (typeof $ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var ie = FE(), Pe = jg(), dt = qm(t);
            dt ? W_(t) && Bf(t) : t.stateNode = M0($, ie, Pe, t);
          }
          return Xr(t), null;
        }
        case fe: {
          Uf(t);
          var it = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Yt = fR(e, t, it);
            if (!Yt)
              return t.flags & hr ? t : null;
          }
          if ((t.flags & lt) !== ut)
            return t.lanes = a, (t.mode & en) !== st && iS(t), t;
          var Pt = it !== null, H = e !== null && e.memoizedState !== null;
          if (Pt !== H && Pt) {
            var le = t.child;
            if (le.flags |= tr, (t.mode & Ut) !== st) {
              var B = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              B || Dg(pl.current, BE) ? dk() : ZS();
            }
          }
          var ke = t.updateQueue;
          if (ke !== null && (t.flags |= Vt), Xr(t), (t.mode & en) !== st && Pt) {
            var Qe = t.child;
            Qe !== null && (t.treeBaseDuration -= Qe.treeBaseDuration);
          }
          return null;
        }
        case Y:
          return Af(t), MS(e, t), e === null && k_(t.stateNode.containerInfo), Xr(t), null;
        case ue:
          var Be = t.type._context;
          return Eg(Be, t), Xr(t), null;
        case de: {
          var bt = t.type;
          return ql(bt) && $m(t), Xr(t), null;
        }
        case Le: {
          Uf(t);
          var Ot = t.memoizedState;
          if (Ot === null)
            return Xr(t), null;
          var hn = (t.flags & lt) !== ut, rn = Ot.rendering;
          if (rn === null)
            if (hn)
              Hp(Ot, !1);
            else {
              var mr = vk() && (e === null || (e.flags & lt) === ut);
              if (!mr)
                for (var an = t.child; an !== null; ) {
                  var ur = dh(an);
                  if (ur !== null) {
                    hn = !0, t.flags |= lt, Hp(Ot, !1);
                    var Ca = ur.updateQueue;
                    return Ca !== null && (t.updateQueue = Ca, t.flags |= Vt), t.subtreeFlags = ut, nT(t, a), Fu(t, Og(pl.current, Rp)), t.child;
                  }
                  an = an.sibling;
                }
              Ot.tail !== null && pr() > pb() && (t.flags |= lt, hn = !0, Hp(Ot, !1), t.lanes = Od);
            }
          else {
            if (!hn) {
              var na = dh(rn);
              if (na !== null) {
                t.flags |= lt, hn = !0;
                var Si = na.updateQueue;
                if (Si !== null && (t.updateQueue = Si, t.flags |= Vt), Hp(Ot, !0), Ot.tail === null && Ot.tailMode === "hidden" && !rn.alternate && !Kr())
                  return Xr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              pr() * 2 - Ot.renderingStartTime > pb() && a !== va && (t.flags |= lt, hn = !0, Hp(Ot, !1), t.lanes = Od);
            }
            if (Ot.isBackwards)
              rn.sibling = t.child, t.child = rn;
            else {
              var Ma = Ot.last;
              Ma !== null ? Ma.sibling = rn : t.child = rn, Ot.last = rn;
            }
          }
          if (Ot.tail !== null) {
            var Ua = Ot.tail;
            Ot.rendering = Ua, Ot.tail = Ua.sibling, Ot.renderingStartTime = pr(), Ua.sibling = null;
            var ba = pl.current;
            return hn ? ba = Og(ba, Rp) : ba = Mf(ba), Fu(t, ba), Ua;
          }
          return Xr(t), null;
        }
        case Ke:
          break;
        case te:
        case Ae: {
          JS(t);
          var Ko = t.memoizedState, Kf = Ko !== null;
          if (e !== null) {
            var nv = e.memoizedState, ao = nv !== null;
            ao !== Kf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !je && (t.flags |= tr);
          }
          return !Kf || (t.mode & Ut) === st ? Xr(t) : ma(ro, va) && (Xr(t), t.subtreeFlags & (Hn | Vt) && (t.flags |= tr)), null;
        }
        case at:
          return null;
        case ct:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function dR(e, t, a) {
      switch (og(t), t.tag) {
        case U: {
          var i = t.type;
          ql(i) && $m(t);
          var o = t.flags;
          return o & hr ? (t.flags = o & ~hr | lt, (t.mode & en) !== st && iS(t), t) : null;
        }
        case z: {
          t.stateNode, Af(t), rg(t), Ag();
          var s = t.flags;
          return (s & hr) !== ut && (s & lt) === ut ? (t.flags = s & ~hr | lt, t) : null;
        }
        case ae:
          return Ng(t), null;
        case fe: {
          Uf(t);
          var d = t.memoizedState;
          if (d !== null && d.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Nf();
          }
          var v = t.flags;
          return v & hr ? (t.flags = v & ~hr | lt, (t.mode & en) !== st && iS(t), t) : null;
        }
        case Le:
          return Uf(t), null;
        case Y:
          return Af(t), null;
        case ue:
          var m = t.type._context;
          return Eg(m, t), null;
        case te:
        case Ae:
          return JS(t), null;
        case at:
          return null;
        default:
          return null;
      }
    }
    function QC(e, t, a) {
      switch (og(t), t.tag) {
        case U: {
          var i = t.type.childContextTypes;
          i != null && $m(t);
          break;
        }
        case z: {
          t.stateNode, Af(t), rg(t), Ag();
          break;
        }
        case ae: {
          Ng(t);
          break;
        }
        case Y:
          Af(t);
          break;
        case fe:
          Uf(t);
          break;
        case Le:
          Uf(t);
          break;
        case ue:
          var o = t.type._context;
          Eg(o, t);
          break;
        case te:
        case Ae:
          JS(t);
          break;
      }
    }
    var GC = null;
    GC = /* @__PURE__ */ new Set();
    var Uh = !1, Jr = !1, pR = typeof WeakSet == "function" ? WeakSet : Set, Ze = null, Vf = null, If = null;
    function vR(e) {
      Ol(null, function() {
        throw e;
      }), ss();
    }
    var mR = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & en)
        try {
          to(), t.componentWillUnmount();
        } finally {
          eo(e);
        }
      else
        t.componentWillUnmount();
    };
    function KC(e, t) {
      try {
        Bu(kr, e);
      } catch (a) {
        On(e, t, a);
      }
    }
    function US(e, t, a) {
      try {
        mR(e, a);
      } catch (i) {
        On(e, t, i);
      }
    }
    function hR(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        On(e, t, i);
      }
    }
    function qC(e, t) {
      try {
        JC(e);
      } catch (a) {
        On(e, t, a);
      }
    }
    function $f(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (ve && wt && e.mode & en)
              try {
                to(), i = a(null);
              } finally {
                eo(e);
              }
            else
              i = a(null);
          } catch (o) {
            On(e, t, o);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", jt(e));
        } else
          a.current = null;
    }
    function zh(e, t, a) {
      try {
        a();
      } catch (i) {
        On(e, t, i);
      }
    }
    var XC = !1;
    function yR(e, t) {
      j0(e.containerInfo), Ze = t, gR();
      var a = XC;
      return XC = !1, a;
    }
    function gR() {
      for (; Ze !== null; ) {
        var e = Ze, t = e.child;
        (e.subtreeFlags & Al) !== ut && t !== null ? (t.return = e, Ze = t) : SR();
      }
    }
    function SR() {
      for (; Ze !== null; ) {
        var e = Ze;
        fn(e);
        try {
          xR(e);
        } catch (a) {
          On(e, e.return, a);
        }
        Dn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ze = t;
          return;
        }
        Ze = e.return;
      }
    }
    function xR(e) {
      var t = e.alternate, a = e.flags;
      if ((a & dr) !== ut) {
        switch (fn(e), e.tag) {
          case O:
          case _e:
          case W:
            break;
          case U: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !nc && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(e) || "instance"));
              var d = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ml(e.type, i), o);
              {
                var v = GC;
                d === void 0 && !v.has(e.type) && (v.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", jt(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = d;
            }
            break;
          }
          case z: {
            {
              var m = e.stateNode;
              e_(m.containerInfo);
            }
            break;
          }
          case ae:
          case se:
          case Y:
          case de:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        Dn();
      }
    }
    function yl(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var s = o.next, d = s;
        do {
          if ((d.tag & e) === e) {
            var v = d.destroy;
            d.destroy = void 0, v !== void 0 && ((e & qr) !== ti ? al(t) : (e & kr) !== ti && ds(t), (e & Xl) !== ti && Zp(!0), zh(t, a, v), (e & Xl) !== ti && Zp(!1), (e & qr) !== ti ? Fl() : (e & kr) !== ti && Nd());
          }
          d = d.next;
        } while (d !== s);
      }
    }
    function Bu(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next, s = o;
        do {
          if ((s.tag & e) === e) {
            (e & qr) !== ti ? jd(t) : (e & kr) !== ti && Ac(t);
            var d = s.create;
            (e & Xl) !== ti && Zp(!0), s.destroy = d(), (e & Xl) !== ti && Zp(!1), (e & qr) !== ti ? Vv() : (e & kr) !== ti && Iv();
            {
              var v = s.destroy;
              if (v !== void 0 && typeof v != "function") {
                var m = void 0;
                (s.tag & kr) !== ut ? m = "useLayoutEffect" : (s.tag & Xl) !== ut ? m = "useInsertionEffect" : m = "useEffect";
                var E = void 0;
                v === null ? E = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof v.then == "function" ? E = `

It looks like you wrote ` + m + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + m + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : E = " You returned: " + v, g("%s must not return anything besides a function, which is used for clean-up.%s", m, E);
              }
            }
          }
          s = s.next;
        } while (s !== o);
      }
    }
    function ER(e, t) {
      if ((t.flags & Vt) !== ut)
        switch (t.tag) {
          case xe: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, s = i.onPostCommit, d = pC(), v = t.alternate === null ? "mount" : "update";
            dC() && (v = "nested-update"), typeof s == "function" && s(o, v, a, d);
            var m = t.return;
            e: for (; m !== null; ) {
              switch (m.tag) {
                case z:
                  var E = m.stateNode;
                  E.passiveEffectDuration += a;
                  break e;
                case xe:
                  var C = m.stateNode;
                  C.passiveEffectDuration += a;
                  break e;
              }
              m = m.return;
            }
            break;
          }
        }
    }
    function CR(e, t, a, i) {
      if ((a.flags & Ul) !== ut)
        switch (a.tag) {
          case O:
          case _e:
          case W: {
            if (!Jr)
              if (a.mode & en)
                try {
                  to(), Bu(kr | Rr, a);
                } finally {
                  eo(a);
                }
              else
                Bu(kr | Rr, a);
            break;
          }
          case U: {
            var o = a.stateNode;
            if (a.flags & Vt && !Jr)
              if (t === null)
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(a) || "instance")), a.mode & en)
                  try {
                    to(), o.componentDidMount();
                  } finally {
                    eo(a);
                  }
                else
                  o.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ml(a.type, t.memoizedProps), d = t.memoizedState;
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(a) || "instance")), a.mode & en)
                  try {
                    to(), o.componentDidUpdate(s, d, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    eo(a);
                  }
                else
                  o.componentDidUpdate(s, d, o.__reactInternalSnapshotBeforeUpdate);
              }
            var v = a.updateQueue;
            v !== null && (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(a) || "instance")), zE(a, v, o));
            break;
          }
          case z: {
            var m = a.updateQueue;
            if (m !== null) {
              var E = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ae:
                    E = a.child.stateNode;
                    break;
                  case U:
                    E = a.child.stateNode;
                    break;
                }
              zE(a, m, E);
            }
            break;
          }
          case ae: {
            var C = a.stateNode;
            if (t === null && a.flags & Vt) {
              var M = a.type, L = a.memoizedProps;
              H0(C, M, L);
            }
            break;
          }
          case se:
            break;
          case Y:
            break;
          case xe: {
            {
              var $ = a.memoizedProps, q = $.onCommit, ie = $.onRender, Pe = a.stateNode.effectDuration, dt = pC(), it = t === null ? "mount" : "update";
              dC() && (it = "nested-update"), typeof ie == "function" && ie(a.memoizedProps.id, it, a.actualDuration, a.treeBaseDuration, a.actualStartTime, dt);
              {
                typeof q == "function" && q(a.memoizedProps.id, it, Pe, dt), Sk(a);
                var Yt = a.return;
                e: for (; Yt !== null; ) {
                  switch (Yt.tag) {
                    case z:
                      var Pt = Yt.stateNode;
                      Pt.effectDuration += Pe;
                      break e;
                    case xe:
                      var H = Yt.stateNode;
                      H.effectDuration += Pe;
                      break e;
                  }
                  Yt = Yt.return;
                }
              }
            }
            break;
          }
          case fe: {
            NR(e, a);
            break;
          }
          case Le:
          case de:
          case Ke:
          case te:
          case Ae:
          case ct:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Jr || a.flags & Yn && JC(a);
    }
    function bR(e) {
      switch (e.tag) {
        case O:
        case _e:
        case W: {
          if (e.mode & en)
            try {
              to(), KC(e, e.return);
            } finally {
              eo(e);
            }
          else
            KC(e, e.return);
          break;
        }
        case U: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && hR(e, e.return, t), qC(e, e.return);
          break;
        }
        case ae: {
          qC(e, e.return);
          break;
        }
      }
    }
    function wR(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ae) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? q0(o) : J0(i.stateNode, i.memoizedProps);
            } catch (d) {
              On(e, e.return, d);
            }
          }
        } else if (i.tag === se) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? X0(s) : Z0(s, i.memoizedProps);
            } catch (d) {
              On(e, e.return, d);
            }
        } else if (!((i.tag === te || i.tag === Ae) && i.memoizedState !== null && i !== e)) {
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
    function JC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ae:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var o;
          if (e.mode & en)
            try {
              to(), o = t(i);
            } finally {
              eo(e);
            }
          else
            o = t(i);
          typeof o == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", jt(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", jt(e)), t.current = i;
      }
    }
    function _R(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function ZC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, ZC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ae) {
          var a = e.stateNode;
          a !== null && D_(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function TR(e) {
      for (var t = e.return; t !== null; ) {
        if (eb(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function eb(e) {
      return e.tag === ae || e.tag === z || e.tag === Y;
    }
    function tb(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || eb(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ae && t.tag !== se && t.tag !== Te; ) {
          if (t.flags & Hn || t.child === null || t.tag === Y)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & Hn))
          return t.stateNode;
      }
    }
    function RR(e) {
      var t = TR(e);
      switch (t.tag) {
        case ae: {
          var a = t.stateNode;
          t.flags & Ya && (rE(a), t.flags &= ~Ya);
          var i = tb(e);
          FS(e, i, a);
          break;
        }
        case z:
        case Y: {
          var o = t.stateNode.containerInfo, s = tb(e);
          zS(e, s, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function zS(e, t, a) {
      var i = e.tag, o = i === ae || i === se;
      if (o) {
        var s = e.stateNode;
        t ? W0(a, s, t) : $0(a, s);
      } else if (i !== Y) {
        var d = e.child;
        if (d !== null) {
          zS(d, t, a);
          for (var v = d.sibling; v !== null; )
            zS(v, t, a), v = v.sibling;
        }
      }
    }
    function FS(e, t, a) {
      var i = e.tag, o = i === ae || i === se;
      if (o) {
        var s = e.stateNode;
        t ? Y0(a, s, t) : I0(a, s);
      } else if (i !== Y) {
        var d = e.child;
        if (d !== null) {
          FS(d, t, a);
          for (var v = d.sibling; v !== null; )
            FS(v, t, a), v = v.sibling;
        }
      }
    }
    var Zr = null, gl = !1;
    function kR(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ae: {
              Zr = i.stateNode, gl = !1;
              break e;
            }
            case z: {
              Zr = i.stateNode.containerInfo, gl = !0;
              break e;
            }
            case Y: {
              Zr = i.stateNode.containerInfo, gl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Zr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        nb(e, t, a), Zr = null, gl = !1;
      }
      _R(a);
    }
    function Vu(e, t, a) {
      for (var i = a.child; i !== null; )
        nb(e, t, i), i = i.sibling;
    }
    function nb(e, t, a) {
      switch (Td(a), a.tag) {
        case ae:
          Jr || $f(a, t);
        case se: {
          {
            var i = Zr, o = gl;
            Zr = null, Vu(e, t, a), Zr = i, gl = o, Zr !== null && (gl ? G0(Zr, a.stateNode) : Q0(Zr, a.stateNode));
          }
          return;
        }
        case Te: {
          Zr !== null && (gl ? K0(Zr, a.stateNode) : Ky(Zr, a.stateNode));
          return;
        }
        case Y: {
          {
            var s = Zr, d = gl;
            Zr = a.stateNode.containerInfo, gl = !0, Vu(e, t, a), Zr = s, gl = d;
          }
          return;
        }
        case O:
        case _e:
        case pe:
        case W: {
          if (!Jr) {
            var v = a.updateQueue;
            if (v !== null) {
              var m = v.lastEffect;
              if (m !== null) {
                var E = m.next, C = E;
                do {
                  var M = C, L = M.destroy, $ = M.tag;
                  L !== void 0 && (($ & Xl) !== ti ? zh(a, t, L) : ($ & kr) !== ti && (ds(a), a.mode & en ? (to(), zh(a, t, L), eo(a)) : zh(a, t, L), Nd())), C = C.next;
                } while (C !== E);
              }
            }
          }
          Vu(e, t, a);
          return;
        }
        case U: {
          if (!Jr) {
            $f(a, t);
            var q = a.stateNode;
            typeof q.componentWillUnmount == "function" && US(a, t, q);
          }
          Vu(e, t, a);
          return;
        }
        case Ke: {
          Vu(e, t, a);
          return;
        }
        case te: {
          if (
            // TODO: Remove this dead flag
            a.mode & Ut
          ) {
            var ie = Jr;
            Jr = ie || a.memoizedState !== null, Vu(e, t, a), Jr = ie;
          } else
            Vu(e, t, a);
          break;
        }
        default: {
          Vu(e, t, a);
          return;
        }
      }
    }
    function jR(e) {
      e.memoizedState;
    }
    function NR(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var s = o.dehydrated;
            s !== null && v_(s);
          }
        }
      }
    }
    function rb(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new pR()), t.forEach(function(i) {
          var o = Tk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), pa)
              if (Vf !== null && If !== null)
                Jp(If, Vf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function DR(e, t, a) {
      Vf = a, If = e, fn(t), ab(t, e), fn(t), Vf = null, If = null;
    }
    function Sl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o];
          try {
            kR(e, t, s);
          } catch (m) {
            On(s, t, m);
          }
        }
      var d = _l();
      if (t.subtreeFlags & Ml)
        for (var v = t.child; v !== null; )
          fn(v), ab(v, e), v = v.sibling;
      fn(d);
    }
    function ab(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case O:
        case _e:
        case pe:
        case W: {
          if (Sl(t, e), no(e), o & Vt) {
            try {
              yl(Xl | Rr, e, e.return), Bu(Xl | Rr, e);
            } catch (bt) {
              On(e, e.return, bt);
            }
            if (e.mode & en) {
              try {
                to(), yl(kr | Rr, e, e.return);
              } catch (bt) {
                On(e, e.return, bt);
              }
              eo(e);
            } else
              try {
                yl(kr | Rr, e, e.return);
              } catch (bt) {
                On(e, e.return, bt);
              }
          }
          return;
        }
        case U: {
          Sl(t, e), no(e), o & Yn && i !== null && $f(i, i.return);
          return;
        }
        case ae: {
          Sl(t, e), no(e), o & Yn && i !== null && $f(i, i.return);
          {
            if (e.flags & Ya) {
              var s = e.stateNode;
              try {
                rE(s);
              } catch (bt) {
                On(e, e.return, bt);
              }
            }
            if (o & Vt) {
              var d = e.stateNode;
              if (d != null) {
                var v = e.memoizedProps, m = i !== null ? i.memoizedProps : v, E = e.type, C = e.updateQueue;
                if (e.updateQueue = null, C !== null)
                  try {
                    B0(d, C, E, m, v, e);
                  } catch (bt) {
                    On(e, e.return, bt);
                  }
              }
            }
          }
          return;
        }
        case se: {
          if (Sl(t, e), no(e), o & Vt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var M = e.stateNode, L = e.memoizedProps, $ = i !== null ? i.memoizedProps : L;
            try {
              V0(M, $, L);
            } catch (bt) {
              On(e, e.return, bt);
            }
          }
          return;
        }
        case z: {
          if (Sl(t, e), no(e), o & Vt && i !== null) {
            var q = i.memoizedState;
            if (q.isDehydrated)
              try {
                p_(t.containerInfo);
              } catch (bt) {
                On(e, e.return, bt);
              }
          }
          return;
        }
        case Y: {
          Sl(t, e), no(e);
          return;
        }
        case fe: {
          Sl(t, e), no(e);
          var ie = e.child;
          if (ie.flags & tr) {
            var Pe = ie.stateNode, dt = ie.memoizedState, it = dt !== null;
            if (Pe.isHidden = it, it) {
              var Yt = ie.alternate !== null && ie.alternate.memoizedState !== null;
              Yt || fk();
            }
          }
          if (o & Vt) {
            try {
              jR(e);
            } catch (bt) {
              On(e, e.return, bt);
            }
            rb(e);
          }
          return;
        }
        case te: {
          var Pt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Ut
          ) {
            var H = Jr;
            Jr = H || Pt, Sl(t, e), Jr = H;
          } else
            Sl(t, e);
          if (no(e), o & tr) {
            var le = e.stateNode, B = e.memoizedState, ke = B !== null, Qe = e;
            if (le.isHidden = ke, ke && !Pt && (Qe.mode & Ut) !== st) {
              Ze = Qe;
              for (var Be = Qe.child; Be !== null; )
                Ze = Be, LR(Be), Be = Be.sibling;
            }
            wR(Qe, ke);
          }
          return;
        }
        case Le: {
          Sl(t, e), no(e), o & Vt && rb(e);
          return;
        }
        case Ke:
          return;
        default: {
          Sl(t, e), no(e);
          return;
        }
      }
    }
    function no(e) {
      var t = e.flags;
      if (t & Hn) {
        try {
          RR(e);
        } catch (a) {
          On(e, e.return, a);
        }
        e.flags &= ~Hn;
      }
      t & ca && (e.flags &= ~ca);
    }
    function OR(e, t, a) {
      Vf = a, If = t, Ze = e, ib(e, t, a), Vf = null, If = null;
    }
    function ib(e, t, a) {
      for (var i = (e.mode & Ut) !== st; Ze !== null; ) {
        var o = Ze, s = o.child;
        if (o.tag === te && i) {
          var d = o.memoizedState !== null, v = d || Uh;
          if (v) {
            PS(e, t, a);
            continue;
          } else {
            var m = o.alternate, E = m !== null && m.memoizedState !== null, C = E || Jr, M = Uh, L = Jr;
            Uh = v, Jr = C, Jr && !L && (Ze = o, AR(o));
            for (var $ = s; $ !== null; )
              Ze = $, ib(
                $,
                // New root; bubble back up to here and stop.
                t,
                a
              ), $ = $.sibling;
            Ze = o, Uh = M, Jr = L, PS(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & Ul) !== ut && s !== null ? (s.return = o, Ze = s) : PS(e, t, a);
      }
    }
    function PS(e, t, a) {
      for (; Ze !== null; ) {
        var i = Ze;
        if ((i.flags & Ul) !== ut) {
          var o = i.alternate;
          fn(i);
          try {
            CR(t, o, i, a);
          } catch (d) {
            On(i, i.return, d);
          }
          Dn();
        }
        if (i === e) {
          Ze = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ze = s;
          return;
        }
        Ze = i.return;
      }
    }
    function LR(e) {
      for (; Ze !== null; ) {
        var t = Ze, a = t.child;
        switch (t.tag) {
          case O:
          case _e:
          case pe:
          case W: {
            if (t.mode & en)
              try {
                to(), yl(kr, t, t.return);
              } finally {
                eo(t);
              }
            else
              yl(kr, t, t.return);
            break;
          }
          case U: {
            $f(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && US(t, t.return, i);
            break;
          }
          case ae: {
            $f(t, t.return);
            break;
          }
          case te: {
            var o = t.memoizedState !== null;
            if (o) {
              lb(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ze = a) : lb(e);
      }
    }
    function lb(e) {
      for (; Ze !== null; ) {
        var t = Ze;
        if (t === e) {
          Ze = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ze = a;
          return;
        }
        Ze = t.return;
      }
    }
    function AR(e) {
      for (; Ze !== null; ) {
        var t = Ze, a = t.child;
        if (t.tag === te) {
          var i = t.memoizedState !== null;
          if (i) {
            ob(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ze = a) : ob(e);
      }
    }
    function ob(e) {
      for (; Ze !== null; ) {
        var t = Ze;
        fn(t);
        try {
          bR(t);
        } catch (i) {
          On(t, t.return, i);
        }
        if (Dn(), t === e) {
          Ze = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ze = a;
          return;
        }
        Ze = t.return;
      }
    }
    function MR(e, t, a, i) {
      Ze = t, UR(t, e, a, i);
    }
    function UR(e, t, a, i) {
      for (; Ze !== null; ) {
        var o = Ze, s = o.child;
        (o.subtreeFlags & nl) !== ut && s !== null ? (s.return = o, Ze = s) : zR(e, t, a, i);
      }
    }
    function zR(e, t, a, i) {
      for (; Ze !== null; ) {
        var o = Ze;
        if ((o.flags & sa) !== ut) {
          fn(o);
          try {
            FR(t, o, a, i);
          } catch (d) {
            On(o, o.return, d);
          }
          Dn();
        }
        if (o === e) {
          Ze = null;
          return;
        }
        var s = o.sibling;
        if (s !== null) {
          s.return = o.return, Ze = s;
          return;
        }
        Ze = o.return;
      }
    }
    function FR(e, t, a, i) {
      switch (t.tag) {
        case O:
        case _e:
        case W: {
          if (t.mode & en) {
            aS();
            try {
              Bu(qr | Rr, t);
            } finally {
              rS(t);
            }
          } else
            Bu(qr | Rr, t);
          break;
        }
      }
    }
    function PR(e) {
      Ze = e, HR();
    }
    function HR() {
      for (; Ze !== null; ) {
        var e = Ze, t = e.child;
        if ((Ze.flags & $a) !== ut) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              Ze = o, IR(o, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var d = s.child;
                if (d !== null) {
                  s.child = null;
                  do {
                    var v = d.sibling;
                    d.sibling = null, d = v;
                  } while (d !== null);
                }
              }
            }
            Ze = e;
          }
        }
        (e.subtreeFlags & nl) !== ut && t !== null ? (t.return = e, Ze = t) : BR();
      }
    }
    function BR() {
      for (; Ze !== null; ) {
        var e = Ze;
        (e.flags & sa) !== ut && (fn(e), VR(e), Dn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ze = t;
          return;
        }
        Ze = e.return;
      }
    }
    function VR(e) {
      switch (e.tag) {
        case O:
        case _e:
        case W: {
          e.mode & en ? (aS(), yl(qr | Rr, e, e.return), rS(e)) : yl(qr | Rr, e, e.return);
          break;
        }
      }
    }
    function IR(e, t) {
      for (; Ze !== null; ) {
        var a = Ze;
        fn(a), YR(a, t), Dn();
        var i = a.child;
        i !== null ? (i.return = a, Ze = i) : $R(e);
      }
    }
    function $R(e) {
      for (; Ze !== null; ) {
        var t = Ze, a = t.sibling, i = t.return;
        if (ZC(t), t === e) {
          Ze = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ze = a;
          return;
        }
        Ze = i;
      }
    }
    function YR(e, t) {
      switch (e.tag) {
        case O:
        case _e:
        case W: {
          e.mode & en ? (aS(), yl(qr, e, t), rS(e)) : yl(qr, e, t);
          break;
        }
      }
    }
    function WR(e) {
      switch (e.tag) {
        case O:
        case _e:
        case W: {
          try {
            Bu(kr | Rr, e);
          } catch (a) {
            On(e, e.return, a);
          }
          break;
        }
        case U: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            On(e, e.return, a);
          }
          break;
        }
      }
    }
    function QR(e) {
      switch (e.tag) {
        case O:
        case _e:
        case W: {
          try {
            Bu(qr | Rr, e);
          } catch (t) {
            On(e, e.return, t);
          }
          break;
        }
      }
    }
    function GR(e) {
      switch (e.tag) {
        case O:
        case _e:
        case W: {
          try {
            yl(kr | Rr, e, e.return);
          } catch (a) {
            On(e, e.return, a);
          }
          break;
        }
        case U: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && US(e, e.return, t);
          break;
        }
      }
    }
    function KR(e) {
      switch (e.tag) {
        case O:
        case _e:
        case W:
          try {
            yl(qr | Rr, e, e.return);
          } catch (t) {
            On(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Bp = Symbol.for;
      Bp("selector.component"), Bp("selector.has_pseudo_class"), Bp("selector.role"), Bp("selector.test_id"), Bp("selector.text");
    }
    var qR = [];
    function XR() {
      qR.forEach(function(e) {
        return e();
      });
    }
    var JR = b.ReactCurrentActQueue;
    function ZR(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function ub() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && JR.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var ek = Math.ceil, HS = b.ReactCurrentDispatcher, BS = b.ReactCurrentOwner, ea = b.ReactCurrentBatchConfig, xl = b.ReactCurrentActQueue, Dr = (
      /*             */
      0
    ), sb = (
      /*               */
      1
    ), ta = (
      /*                */
      2
    ), Wi = (
      /*                */
      4
    ), Yo = 0, Vp = 1, rc = 2, Fh = 3, Ip = 4, cb = 5, VS = 6, $t = Dr, La = null, Zn = null, Or = he, ro = he, IS = Ou(he), Lr = Yo, $p = null, Ph = he, Yp = he, Hh = he, Wp = null, ni = null, $S = 0, fb = 500, db = 1 / 0, tk = 500, Wo = null;
    function Qp() {
      db = pr() + tk;
    }
    function pb() {
      return db;
    }
    var Bh = !1, YS = null, Yf = null, ac = !1, Iu = null, Gp = he, WS = [], QS = null, nk = 50, Kp = 0, GS = null, KS = !1, Vh = !1, rk = 50, Wf = 0, Ih = null, qp = xn, $h = he, vb = !1;
    function Yh() {
      return La;
    }
    function Aa() {
      return ($t & (ta | Wi)) !== Dr ? pr() : (qp !== xn || (qp = pr()), qp);
    }
    function $u(e) {
      var t = e.mode;
      if ((t & Ut) === st)
        return gt;
      if (($t & ta) !== Dr && Or !== he)
        return _s(Or);
      var a = J_() !== X_;
      if (a) {
        if (ea.transition !== null) {
          var i = ea.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return $h === Jt && ($h = Fd()), $h;
      }
      var o = Xa();
      if (o !== Jt)
        return o;
      var s = U0();
      return s;
    }
    function ak(e) {
      var t = e.mode;
      return (t & Ut) === st ? gt : Kv();
    }
    function Ar(e, t, a, i) {
      kk(), vb && g("useInsertionEffect must not schedule updates."), KS && (Vh = !0), Eu(e, a, i), ($t & ta) !== he && e === La ? Dk(t) : (pa && ks(e, t, a), Ok(t), e === La && (($t & ta) === Dr && (Yp = Lt(Yp, a)), Lr === Ip && Yu(e, Or)), ri(e, i), a === gt && $t === Dr && (t.mode & Ut) === st && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !xl.isBatchingLegacy && (Qp(), vE()));
    }
    function ik(e, t, a) {
      var i = e.current;
      i.lanes = t, Eu(e, t, a), ri(e, a);
    }
    function lk(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        ($t & ta) !== Dr
      );
    }
    function ri(e, t) {
      var a = e.callbackNode;
      ef(e, t);
      var i = Zc(e, e === La ? Or : he);
      if (i === he) {
        a !== null && Nb(a), e.callbackNode = null, e.callbackPriority = Jt;
        return;
      }
      var o = Bl(i), s = e.callbackPriority;
      if (s === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(xl.current !== null && a !== nx)) {
        a == null && s !== gt && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && Nb(a);
      var d;
      if (o === gt)
        e.tag === Lu ? (xl.isBatchingLegacy !== null && (xl.didScheduleLegacyUpdate = !0), A_(yb.bind(null, e))) : pE(yb.bind(null, e)), xl.current !== null ? xl.current.push(Au) : F0(function() {
          ($t & (ta | Wi)) === Dr && Au();
        }), d = null;
      else {
        var v;
        switch (nm(i)) {
          case $r:
            v = fs;
            break;
          case Ui:
            v = zl;
            break;
          case Ka:
            v = rl;
            break;
          case qa:
            v = So;
            break;
          default:
            v = rl;
            break;
        }
        d = rx(v, mb.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = d;
    }
    function mb(e, t) {
      if (wT(), qp = xn, $h = he, ($t & (ta | Wi)) !== Dr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Go();
      if (i && e.callbackNode !== a)
        return null;
      var o = Zc(e, e === La ? Or : he);
      if (o === he)
        return null;
      var s = !nf(e, o) && !Gv(e, o) && !t, d = s ? hk(e, o) : Qh(e, o);
      if (d !== Yo) {
        if (d === rc) {
          var v = tf(e);
          v !== he && (o = v, d = qS(e, v));
        }
        if (d === Vp) {
          var m = $p;
          throw ic(e, he), Yu(e, o), ri(e, pr()), m;
        }
        if (d === VS)
          Yu(e, o);
        else {
          var E = !nf(e, o), C = e.current.alternate;
          if (E && !uk(C)) {
            if (d = Qh(e, o), d === rc) {
              var M = tf(e);
              M !== he && (o = M, d = qS(e, M));
            }
            if (d === Vp) {
              var L = $p;
              throw ic(e, he), Yu(e, o), ri(e, pr()), L;
            }
          }
          e.finishedWork = C, e.finishedLanes = o, ok(e, d, o);
        }
      }
      return ri(e, pr()), e.callbackNode === a ? mb.bind(null, e) : null;
    }
    function qS(e, t) {
      var a = Wp;
      if (lf(e)) {
        var i = ic(e, t);
        i.flags |= Ur, R_(e.containerInfo);
      }
      var o = Qh(e, t);
      if (o !== rc) {
        var s = ni;
        ni = a, s !== null && hb(s);
      }
      return o;
    }
    function hb(e) {
      ni === null ? ni = e : ni.push.apply(ni, e);
    }
    function ok(e, t, a) {
      switch (t) {
        case Yo:
        case Vp:
          throw new Error("Root did not complete. This is a bug in React.");
        case rc: {
          lc(e, ni, Wo);
          break;
        }
        case Fh: {
          if (Yu(e, a), No(a) && // do not delay if we're inside an act() scope
          !Db()) {
            var i = $S + fb - pr();
            if (i > 10) {
              var o = Zc(e, he);
              if (o !== he)
                break;
              var s = e.suspendedLanes;
              if (!Do(s, a)) {
                Aa(), rf(e, s);
                break;
              }
              e.timeoutHandle = Qy(lc.bind(null, e, ni, Wo), i);
              break;
            }
          }
          lc(e, ni, Wo);
          break;
        }
        case Ip: {
          if (Yu(e, a), Ud(a))
            break;
          if (!Db()) {
            var d = vi(e, a), v = d, m = pr() - v, E = Rk(m) - m;
            if (E > 10) {
              e.timeoutHandle = Qy(lc.bind(null, e, ni, Wo), E);
              break;
            }
          }
          lc(e, ni, Wo);
          break;
        }
        case cb: {
          lc(e, ni, Wo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function uk(e) {
      for (var t = e; ; ) {
        if (t.flags & hu) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var o = 0; o < i.length; o++) {
                var s = i[o], d = s.getSnapshot, v = s.value;
                try {
                  if (!Ce(d(), v))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var m = t.child;
        if (t.subtreeFlags & hu && m !== null) {
          m.return = t, t = m;
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
    function Yu(e, t) {
      t = Ts(t, Hh), t = Ts(t, Yp), Jv(e, t);
    }
    function yb(e) {
      if (_T(), ($t & (ta | Wi)) !== Dr)
        throw new Error("Should not already be working.");
      Go();
      var t = Zc(e, he);
      if (!ma(t, gt))
        return ri(e, pr()), null;
      var a = Qh(e, t);
      if (e.tag !== Lu && a === rc) {
        var i = tf(e);
        i !== he && (t = i, a = qS(e, i));
      }
      if (a === Vp) {
        var o = $p;
        throw ic(e, he), Yu(e, t), ri(e, pr()), o;
      }
      if (a === VS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, lc(e, ni, Wo), ri(e, pr()), null;
    }
    function sk(e, t) {
      t !== he && (af(e, Lt(t, gt)), ri(e, pr()), ($t & (ta | Wi)) === Dr && (Qp(), Au()));
    }
    function XS(e, t) {
      var a = $t;
      $t |= sb;
      try {
        return e(t);
      } finally {
        $t = a, $t === Dr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !xl.isBatchingLegacy && (Qp(), vE());
      }
    }
    function ck(e, t, a, i, o) {
      var s = Xa(), d = ea.transition;
      try {
        return ea.transition = null, ir($r), e(t, a, i, o);
      } finally {
        ir(s), ea.transition = d, $t === Dr && Qp();
      }
    }
    function Qo(e) {
      Iu !== null && Iu.tag === Lu && ($t & (ta | Wi)) === Dr && Go();
      var t = $t;
      $t |= sb;
      var a = ea.transition, i = Xa();
      try {
        return ea.transition = null, ir($r), e ? e() : void 0;
      } finally {
        ir(i), ea.transition = a, $t = t, ($t & (ta | Wi)) === Dr && Au();
      }
    }
    function gb() {
      return ($t & (ta | Wi)) !== Dr;
    }
    function Wh(e, t) {
      xa(IS, ro, e), ro = Lt(ro, t);
    }
    function JS(e) {
      ro = IS.current, Sa(IS, e);
    }
    function ic(e, t) {
      e.finishedWork = null, e.finishedLanes = he;
      var a = e.timeoutHandle;
      if (a !== Gy && (e.timeoutHandle = Gy, z0(a)), Zn !== null)
        for (var i = Zn.return; i !== null; ) {
          var o = i.alternate;
          QC(o, i), i = i.return;
        }
      La = e;
      var s = oc(e.current, null);
      return Zn = s, Or = ro = t, Lr = Yo, $p = null, Ph = he, Yp = he, Hh = he, Wp = null, ni = null, iT(), dl.discardPendingWarnings(), s;
    }
    function Sb(e, t) {
      do {
        var a = Zn;
        try {
          if (nh(), IE(), Dn(), BS.current = null, a === null || a.return === null) {
            Lr = Vp, $p = t, Zn = null;
            return;
          }
          if (ve && a.mode & en && Dh(a, !0), ee)
            if (ja(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Mi(a, i, Or);
            } else
              ps(a, t, Or);
          AT(e, a.return, a, t, Or), bb(a);
        } catch (o) {
          t = o, Zn === a && a !== null ? (a = a.return, Zn = a) : a = Zn;
          continue;
        }
        return;
      } while (!0);
    }
    function xb() {
      var e = HS.current;
      return HS.current = Th, e === null ? Th : e;
    }
    function Eb(e) {
      HS.current = e;
    }
    function fk() {
      $S = pr();
    }
    function Xp(e) {
      Ph = Lt(e, Ph);
    }
    function dk() {
      Lr === Yo && (Lr = Fh);
    }
    function ZS() {
      (Lr === Yo || Lr === Fh || Lr === rc) && (Lr = Ip), La !== null && (ws(Ph) || ws(Yp)) && Yu(La, Or);
    }
    function pk(e) {
      Lr !== Ip && (Lr = rc), Wp === null ? Wp = [e] : Wp.push(e);
    }
    function vk() {
      return Lr === Yo;
    }
    function Qh(e, t) {
      var a = $t;
      $t |= ta;
      var i = xb();
      if (La !== e || Or !== t) {
        if (pa) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (Jp(e, Or), o.clear()), Zv(e, t);
        }
        Wo = Vd(), ic(e, t);
      }
      bo(t);
      do
        try {
          mk();
          break;
        } catch (s) {
          Sb(e, s);
        }
      while (!0);
      if (nh(), $t = a, Eb(i), Zn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), La = null, Or = he, Lr;
    }
    function mk() {
      for (; Zn !== null; )
        Cb(Zn);
    }
    function hk(e, t) {
      var a = $t;
      $t |= ta;
      var i = xb();
      if (La !== e || Or !== t) {
        if (pa) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (Jp(e, Or), o.clear()), Zv(e, t);
        }
        Wo = Vd(), Qp(), ic(e, t);
      }
      bo(t);
      do
        try {
          yk();
          break;
        } catch (s) {
          Sb(e, s);
        }
      while (!0);
      return nh(), Eb(i), $t = a, Zn !== null ? ($v(), Yo) : (Mc(), La = null, Or = he, Lr);
    }
    function yk() {
      for (; Zn !== null && !Ed(); )
        Cb(Zn);
    }
    function Cb(e) {
      var t = e.alternate;
      fn(e);
      var a;
      (e.mode & en) !== st ? (nS(e), a = ex(t, e, ro), Dh(e, !0)) : a = ex(t, e, ro), Dn(), e.memoizedProps = e.pendingProps, a === null ? bb(e) : Zn = a, BS.current = null;
    }
    function bb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & cs) === ut) {
          fn(t);
          var o = void 0;
          if ((t.mode & en) === st ? o = WC(a, t, ro) : (nS(t), o = WC(a, t, ro), Dh(t, !1)), Dn(), o !== null) {
            Zn = o;
            return;
          }
        } else {
          var s = dR(a, t);
          if (s !== null) {
            s.flags &= Fv, Zn = s;
            return;
          }
          if ((t.mode & en) !== st) {
            Dh(t, !1);
            for (var d = t.actualDuration, v = t.child; v !== null; )
              d += v.actualDuration, v = v.sibling;
            t.actualDuration = d;
          }
          if (i !== null)
            i.flags |= cs, i.subtreeFlags = ut, i.deletions = null;
          else {
            Lr = VS, Zn = null;
            return;
          }
        }
        var m = t.sibling;
        if (m !== null) {
          Zn = m;
          return;
        }
        t = i, Zn = t;
      } while (t !== null);
      Lr === Yo && (Lr = cb);
    }
    function lc(e, t, a) {
      var i = Xa(), o = ea.transition;
      try {
        ea.transition = null, ir($r), gk(e, t, a, i);
      } finally {
        ea.transition = o, ir(i);
      }
      return null;
    }
    function gk(e, t, a, i) {
      do
        Go();
      while (Iu !== null);
      if (jk(), ($t & (ta | Wi)) !== Dr)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, s = e.finishedLanes;
      if (Rd(s), o === null)
        return kd(), null;
      if (s === he && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = he, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Jt;
      var d = Lt(o.lanes, o.childLanes);
      Hd(e, d), e === La && (La = null, Zn = null, Or = he), ((o.subtreeFlags & nl) !== ut || (o.flags & nl) !== ut) && (ac || (ac = !0, QS = a, rx(rl, function() {
        return Go(), null;
      })));
      var v = (o.subtreeFlags & (Al | Ml | Ul | nl)) !== ut, m = (o.flags & (Al | Ml | Ul | nl)) !== ut;
      if (v || m) {
        var E = ea.transition;
        ea.transition = null;
        var C = Xa();
        ir($r);
        var M = $t;
        $t |= Wi, BS.current = null, yR(e, o), vC(), DR(e, o, s), N0(e.containerInfo), e.current = o, vs(s), OR(o, e, s), ms(), Cd(), $t = M, ir(C), ea.transition = E;
      } else
        e.current = o, vC();
      var L = ac;
      if (ac ? (ac = !1, Iu = e, Gp = s) : (Wf = 0, Ih = null), d = e.pendingLanes, d === he && (Yf = null), L || Rb(e.current, !1), wd(o.stateNode, i), pa && e.memoizedUpdaters.clear(), XR(), ri(e, pr()), t !== null)
        for (var $ = e.onRecoverableError, q = 0; q < t.length; q++) {
          var ie = t[q], Pe = ie.stack, dt = ie.digest;
          $(ie.value, {
            componentStack: Pe,
            digest: dt
          });
        }
      if (Bh) {
        Bh = !1;
        var it = YS;
        throw YS = null, it;
      }
      return ma(Gp, gt) && e.tag !== Lu && Go(), d = e.pendingLanes, ma(d, gt) ? (bT(), e === GS ? Kp++ : (Kp = 0, GS = e)) : Kp = 0, Au(), kd(), null;
    }
    function Go() {
      if (Iu !== null) {
        var e = nm(Gp), t = Ns(Ka, e), a = ea.transition, i = Xa();
        try {
          return ea.transition = null, ir(t), xk();
        } finally {
          ir(i), ea.transition = a;
        }
      }
      return !1;
    }
    function Sk(e) {
      WS.push(e), ac || (ac = !0, rx(rl, function() {
        return Go(), null;
      }));
    }
    function xk() {
      if (Iu === null)
        return !1;
      var e = QS;
      QS = null;
      var t = Iu, a = Gp;
      if (Iu = null, Gp = he, ($t & (ta | Wi)) !== Dr)
        throw new Error("Cannot flush passive effects while already rendering.");
      KS = !0, Vh = !1, Co(a);
      var i = $t;
      $t |= Wi, PR(t.current), MR(t, t.current, a, e);
      {
        var o = WS;
        WS = [];
        for (var s = 0; s < o.length; s++) {
          var d = o[s];
          ER(t, d);
        }
      }
      Dd(), Rb(t.current, !0), $t = i, Au(), Vh ? t === Ih ? Wf++ : (Wf = 0, Ih = t) : Wf = 0, KS = !1, Vh = !1, _d(t);
      {
        var v = t.current.stateNode;
        v.effectDuration = 0, v.passiveEffectDuration = 0;
      }
      return !0;
    }
    function wb(e) {
      return Yf !== null && Yf.has(e);
    }
    function Ek(e) {
      Yf === null ? Yf = /* @__PURE__ */ new Set([e]) : Yf.add(e);
    }
    function Ck(e) {
      Bh || (Bh = !0, YS = e);
    }
    var bk = Ck;
    function _b(e, t, a) {
      var i = tc(a, t), o = CC(e, i, gt), s = Uu(e, o, gt), d = Aa();
      s !== null && (Eu(s, gt, d), ri(s, d));
    }
    function On(e, t, a) {
      if (vR(a), Zp(!1), e.tag === z) {
        _b(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === z) {
          _b(i, e, a);
          return;
        } else if (i.tag === U) {
          var o = i.type, s = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !wb(s)) {
            var d = tc(a, e), v = xS(i, d, gt), m = Uu(i, v, gt), E = Aa();
            m !== null && (Eu(m, gt, E), ri(m, E));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function wk(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = Aa();
      rf(e, a), Lk(e), La === e && Do(Or, a) && (Lr === Ip || Lr === Fh && No(Or) && pr() - $S < fb ? ic(e, he) : Hh = Lt(Hh, a)), ri(e, o);
    }
    function Tb(e, t) {
      t === Jt && (t = ak(e));
      var a = Aa(), i = ei(e, t);
      i !== null && (Eu(i, t, a), ri(i, a));
    }
    function _k(e) {
      var t = e.memoizedState, a = Jt;
      t !== null && (a = t.retryLane), Tb(e, a);
    }
    function Tk(e, t) {
      var a = Jt, i;
      switch (e.tag) {
        case fe:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case Le:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), Tb(e, a);
    }
    function Rk(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : ek(e / 1960) * 1960;
    }
    function kk() {
      if (Kp > nk)
        throw Kp = 0, GS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Wf > rk && (Wf = 0, Ih = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function jk() {
      dl.flushLegacyContextWarning(), dl.flushPendingUnsafeLifecycleWarnings();
    }
    function Rb(e, t) {
      fn(e), Gh(e, Ll, GR), t && Gh(e, Oi, KR), Gh(e, Ll, WR), t && Gh(e, Oi, QR), Dn();
    }
    function Gh(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== o && i.child !== null && s !== ut ? i = i.child : ((i.flags & t) !== ut && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var Kh = null;
    function kb(e) {
      {
        if (($t & ta) !== Dr || !(e.mode & Ut))
          return;
        var t = e.tag;
        if (t !== be && t !== z && t !== U && t !== O && t !== _e && t !== pe && t !== W)
          return;
        var a = jt(e) || "ReactComponent";
        if (Kh !== null) {
          if (Kh.has(a))
            return;
          Kh.add(a);
        } else
          Kh = /* @__PURE__ */ new Set([a]);
        var i = Cr;
        try {
          fn(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? fn(e) : Dn();
        }
      }
    }
    var ex;
    {
      var Nk = null;
      ex = function(e, t, a) {
        var i = Ub(Nk, t);
        try {
          return BC(e, t, a);
        } catch (s) {
          if (V_() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (nh(), IE(), QC(e, t), Ub(t, i), t.mode & en && nS(t), Ol(null, BC, null, e, t, a), el()) {
            var o = ss();
            typeof o == "object" && o !== null && o._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var jb = !1, tx;
    tx = /* @__PURE__ */ new Set();
    function Dk(e) {
      if (_i && !xT())
        switch (e.tag) {
          case O:
          case _e:
          case W: {
            var t = Zn && jt(Zn) || "Unknown", a = t;
            if (!tx.has(a)) {
              tx.add(a);
              var i = jt(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case U: {
            jb || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), jb = !0);
            break;
          }
        }
    }
    function Jp(e, t) {
      if (pa) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ks(e, i, t);
        });
      }
    }
    var nx = {};
    function rx(e, t) {
      {
        var a = xl.current;
        return a !== null ? (a.push(t), nx) : xd(e, t);
      }
    }
    function Nb(e) {
      if (e !== nx)
        return Hv(e);
    }
    function Db() {
      return xl.current !== null;
    }
    function Ok(e) {
      {
        if (e.mode & Ut) {
          if (!ub())
            return;
        } else if (!ZR() || $t !== Dr || e.tag !== O && e.tag !== _e && e.tag !== W)
          return;
        if (xl.current === null) {
          var t = Cr;
          try {
            fn(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, jt(e));
          } finally {
            t ? fn(e) : Dn();
          }
        }
      }
    }
    function Lk(e) {
      e.tag !== Lu && ub() && xl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Zp(e) {
      vb = e;
    }
    var Qi = null, Qf = null, Ak = function(e) {
      Qi = e;
    };
    function Gf(e) {
      {
        if (Qi === null)
          return e;
        var t = Qi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function ax(e) {
      return Gf(e);
    }
    function ix(e) {
      {
        if (Qi === null)
          return e;
        var t = Qi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Gf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: me,
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
    function Ob(e, t) {
      {
        if (Qi === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case U: {
            typeof i == "function" && (o = !0);
            break;
          }
          case O: {
            (typeof i == "function" || s === Tt) && (o = !0);
            break;
          }
          case _e: {
            (s === me || s === Tt) && (o = !0);
            break;
          }
          case pe:
          case W: {
            (s === Nt || s === Tt) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var d = Qi(a);
          if (d !== void 0 && d === Qi(i))
            return !0;
        }
        return !1;
      }
    }
    function Lb(e) {
      {
        if (Qi === null || typeof WeakSet != "function")
          return;
        Qf === null && (Qf = /* @__PURE__ */ new WeakSet()), Qf.add(e);
      }
    }
    var Mk = function(e, t) {
      {
        if (Qi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Go(), Qo(function() {
          lx(e.current, i, a);
        });
      }
    }, Uk = function(e, t) {
      {
        if (e.context !== yi)
          return;
        Go(), Qo(function() {
          ev(t, e, null, null);
        });
      }
    };
    function lx(e, t, a) {
      {
        var i = e.alternate, o = e.child, s = e.sibling, d = e.tag, v = e.type, m = null;
        switch (d) {
          case O:
          case W:
          case U:
            m = v;
            break;
          case _e:
            m = v.render;
            break;
        }
        if (Qi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var E = !1, C = !1;
        if (m !== null) {
          var M = Qi(m);
          M !== void 0 && (a.has(M) ? C = !0 : t.has(M) && (d === U ? C = !0 : E = !0));
        }
        if (Qf !== null && (Qf.has(e) || i !== null && Qf.has(i)) && (C = !0), C && (e._debugNeedsRemount = !0), C || E) {
          var L = ei(e, gt);
          L !== null && Ar(L, e, gt, xn);
        }
        o !== null && !C && lx(o, t, a), s !== null && lx(s, t, a);
      }
    }
    var zk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(o) {
          return o.current;
        }));
        return ox(e.current, i, a), a;
      }
    };
    function ox(e, t, a) {
      {
        var i = e.child, o = e.sibling, s = e.tag, d = e.type, v = null;
        switch (s) {
          case O:
          case W:
          case U:
            v = d;
            break;
          case _e:
            v = d.render;
            break;
        }
        var m = !1;
        v !== null && t.has(v) && (m = !0), m ? Fk(e, a) : i !== null && ox(i, t, a), o !== null && ox(o, t, a);
      }
    }
    function Fk(e, t) {
      {
        var a = Pk(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ae:
              t.add(i.stateNode);
              return;
            case Y:
              t.add(i.stateNode.containerInfo);
              return;
            case z:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function Pk(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ae)
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
    var ux;
    {
      ux = !1;
      try {
        var Ab = Object.preventExtensions({});
      } catch {
        ux = !0;
      }
    }
    function Hk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = ut, this.subtreeFlags = ut, this.deletions = null, this.lanes = he, this.childLanes = he, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !ux && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var gi = function(e, t, a, i) {
      return new Hk(e, t, a, i);
    };
    function sx(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Bk(e) {
      return typeof e == "function" && !sx(e) && e.defaultProps === void 0;
    }
    function Vk(e) {
      if (typeof e == "function")
        return sx(e) ? U : O;
      if (e != null) {
        var t = e.$$typeof;
        if (t === me)
          return _e;
        if (t === Nt)
          return pe;
      }
      return be;
    }
    function oc(e, t) {
      var a = e.alternate;
      a === null ? (a = gi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = ut, a.subtreeFlags = ut, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & nr, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case be:
        case O:
        case W:
          a.type = Gf(e.type);
          break;
        case U:
          a.type = ax(e.type);
          break;
        case _e:
          a.type = ix(e.type);
          break;
      }
      return a;
    }
    function Ik(e, t) {
      e.flags &= nr | Hn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = he, e.lanes = t, e.child = null, e.subtreeFlags = ut, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = ut, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function $k(e, t, a) {
      var i;
      return e === Wm ? (i = Ut, t === !0 && (i |= vn, i |= tn)) : i = st, pa && (i |= en), gi(z, null, null, i);
    }
    function cx(e, t, a, i, o, s) {
      var d = be, v = e;
      if (typeof e == "function")
        sx(e) ? (d = U, v = ax(v)) : v = Gf(v);
      else if (typeof e == "string")
        d = ae;
      else
        e: switch (e) {
          case la:
            return Wu(a.children, o, s, t);
          case zn:
            d = Se, o |= vn, (o & Ut) !== st && (o |= tn);
            break;
          case Fa:
            return Yk(a, o, s, t);
          case Me:
            return Wk(a, o, s, t);
          case We:
            return Qk(a, o, s, t);
          case k:
            return Mb(a, o, s, t);
          case oe:
          case At:
          case et:
          case vt:
          case Z:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Pa:
                  d = ue;
                  break e;
                case T:
                  d = He;
                  break e;
                case me:
                  d = _e, v = ix(v);
                  break e;
                case Nt:
                  d = pe;
                  break e;
                case Tt:
                  d = we, v = null;
                  break e;
              }
            var m = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (m += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var E = i ? jt(i) : null;
              E && (m += `

Check the render method of \`` + E + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + m));
          }
        }
      var C = gi(d, a, t, o);
      return C.elementType = e, C.type = v, C.lanes = s, C._debugOwner = i, C;
    }
    function fx(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, s = e.key, d = e.props, v = cx(o, s, d, i, t, a);
      return v._debugSource = e._source, v._debugOwner = e._owner, v;
    }
    function Wu(e, t, a, i) {
      var o = gi(re, e, i, t);
      return o.lanes = a, o;
    }
    function Yk(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = gi(xe, e, i, t | en);
      return o.elementType = Fa, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function Wk(e, t, a, i) {
      var o = gi(fe, e, i, t);
      return o.elementType = Me, o.lanes = a, o;
    }
    function Qk(e, t, a, i) {
      var o = gi(Le, e, i, t);
      return o.elementType = We, o.lanes = a, o;
    }
    function Mb(e, t, a, i) {
      var o = gi(te, e, i, t);
      o.elementType = k, o.lanes = a;
      var s = {
        isHidden: !1
      };
      return o.stateNode = s, o;
    }
    function dx(e, t, a) {
      var i = gi(se, e, null, t);
      return i.lanes = a, i;
    }
    function Gk() {
      var e = gi(ae, null, null, st);
      return e.elementType = "DELETED", e;
    }
    function Kk(e) {
      var t = gi(Te, null, null, st);
      return t.stateNode = e, t;
    }
    function px(e, t, a) {
      var i = e.children !== null ? e.children : [], o = gi(Y, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function Ub(e, t) {
      return e === null && (e = gi(be, null, null, st)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function qk(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Gy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Jt, this.eventTimes = Rs(he), this.expirationTimes = Rs(xn), this.pendingLanes = he, this.suspendedLanes = he, this.pingedLanes = he, this.expiredLanes = he, this.mutableReadLanes = he, this.finishedLanes = he, this.entangledLanes = he, this.entanglements = Rs(he), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], d = 0; d < wo; d++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Wm:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lu:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function zb(e, t, a, i, o, s, d, v, m, E) {
      var C = new qk(e, t, a, v, m), M = $k(t, s);
      C.current = M, M.stateNode = C;
      {
        var L = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        M.memoizedState = L;
      }
      return Tg(M), C;
    }
    var vx = "18.3.1";
    function Xk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return En(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: sr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var mx, hx;
    mx = !1, hx = {};
    function Fb(e) {
      if (!e)
        return yi;
      var t = mu(e), a = L_(t);
      if (t.tag === U) {
        var i = t.type;
        if (ql(i))
          return fE(t, i, a);
      }
      return a;
    }
    function Jk(e, t) {
      {
        var a = mu(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = fa(a);
        if (o === null)
          return null;
        if (o.mode & vn) {
          var s = jt(a) || "Component";
          if (!hx[s]) {
            hx[s] = !0;
            var d = Cr;
            try {
              fn(o), a.mode & vn ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              d ? fn(d) : Dn();
            }
          }
        }
        return o.stateNode;
      }
    }
    function Pb(e, t, a, i, o, s, d, v) {
      var m = !1, E = null;
      return zb(e, t, m, E, a, i, o, s, d);
    }
    function Hb(e, t, a, i, o, s, d, v, m, E) {
      var C = !0, M = zb(a, i, C, e, o, s, d, v, m);
      M.context = Fb(null);
      var L = M.current, $ = Aa(), q = $u(L), ie = Io($, q);
      return ie.callback = t ?? null, Uu(L, ie, q), ik(M, q, $), M;
    }
    function ev(e, t, a, i) {
      bd(t, e);
      var o = t.current, s = Aa(), d = $u(o);
      Vn(d);
      var v = Fb(a);
      t.context === null ? t.context = v : t.pendingContext = v, _i && Cr !== null && !mx && (mx = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, jt(Cr) || "Unknown"));
      var m = Io(s, d);
      m.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), m.callback = i);
      var E = Uu(o, m, d);
      return E !== null && (Ar(E, o, d, s), oh(E, o, d)), d;
    }
    function qh(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ae:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function Zk(e) {
      switch (e.tag) {
        case z: {
          var t = e.stateNode;
          if (lf(t)) {
            var a = Wv(t);
            sk(t, a);
          }
          break;
        }
        case fe: {
          Qo(function() {
            var o = ei(e, gt);
            if (o !== null) {
              var s = Aa();
              Ar(o, e, gt, s);
            }
          });
          var i = gt;
          yx(e, i);
          break;
        }
      }
    }
    function Bb(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Xv(a.retryLane, t));
    }
    function yx(e, t) {
      Bb(e, t);
      var a = e.alternate;
      a && Bb(a, t);
    }
    function ej(e) {
      if (e.tag === fe) {
        var t = Es, a = ei(e, t);
        if (a !== null) {
          var i = Aa();
          Ar(a, e, t, i);
        }
        yx(e, t);
      }
    }
    function tj(e) {
      if (e.tag === fe) {
        var t = $u(e), a = ei(e, t);
        if (a !== null) {
          var i = Aa();
          Ar(a, e, t, i);
        }
        yx(e, t);
      }
    }
    function Vb(e) {
      var t = An(e);
      return t === null ? null : t.stateNode;
    }
    var Ib = function(e) {
      return null;
    };
    function nj(e) {
      return Ib(e);
    }
    var $b = function(e) {
      return !1;
    };
    function rj(e) {
      return $b(e);
    }
    var Yb = null, Wb = null, Qb = null, Gb = null, Kb = null, qb = null, Xb = null, Jb = null, Zb = null;
    {
      var ew = function(e, t, a) {
        var i = t[a], o = Mt(e) ? e.slice() : qe({}, e);
        return a + 1 === t.length ? (Mt(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = ew(e[i], t, a + 1), o);
      }, tw = function(e, t) {
        return ew(e, t, 0);
      }, nw = function(e, t, a, i) {
        var o = t[i], s = Mt(e) ? e.slice() : qe({}, e);
        if (i + 1 === t.length) {
          var d = a[i];
          s[d] = s[o], Mt(s) ? s.splice(o, 1) : delete s[o];
        } else
          s[o] = nw(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return s;
      }, rw = function(e, t, a) {
        if (t.length !== a.length) {
          R("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              R("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return nw(e, t, a, 0);
      }, aw = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], s = Mt(e) ? e.slice() : qe({}, e);
        return s[o] = aw(e[o], t, a + 1, i), s;
      }, iw = function(e, t, a) {
        return aw(e, t, 0, a);
      }, gx = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Yb = function(e, t, a, i) {
        var o = gx(e, t);
        if (o !== null) {
          var s = iw(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = qe({}, e.memoizedProps);
          var d = ei(e, gt);
          d !== null && Ar(d, e, gt, xn);
        }
      }, Wb = function(e, t, a) {
        var i = gx(e, t);
        if (i !== null) {
          var o = tw(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = qe({}, e.memoizedProps);
          var s = ei(e, gt);
          s !== null && Ar(s, e, gt, xn);
        }
      }, Qb = function(e, t, a, i) {
        var o = gx(e, t);
        if (o !== null) {
          var s = rw(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = qe({}, e.memoizedProps);
          var d = ei(e, gt);
          d !== null && Ar(d, e, gt, xn);
        }
      }, Gb = function(e, t, a) {
        e.pendingProps = iw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = ei(e, gt);
        i !== null && Ar(i, e, gt, xn);
      }, Kb = function(e, t) {
        e.pendingProps = tw(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = ei(e, gt);
        a !== null && Ar(a, e, gt, xn);
      }, qb = function(e, t, a) {
        e.pendingProps = rw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = ei(e, gt);
        i !== null && Ar(i, e, gt, xn);
      }, Xb = function(e) {
        var t = ei(e, gt);
        t !== null && Ar(t, e, gt, xn);
      }, Jb = function(e) {
        Ib = e;
      }, Zb = function(e) {
        $b = e;
      };
    }
    function aj(e) {
      var t = fa(e);
      return t === null ? null : t.stateNode;
    }
    function ij(e) {
      return null;
    }
    function lj() {
      return Cr;
    }
    function oj(e) {
      var t = e.findFiberByHostInstance, a = b.ReactCurrentDispatcher;
      return gu({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Yb,
        overrideHookStateDeletePath: Wb,
        overrideHookStateRenamePath: Qb,
        overrideProps: Gb,
        overridePropsDeletePath: Kb,
        overridePropsRenamePath: qb,
        setErrorHandler: Jb,
        setSuspenseHandler: Zb,
        scheduleUpdate: Xb,
        currentDispatcherRef: a,
        findHostInstanceByFiber: aj,
        findFiberByHostInstance: t || ij,
        // React Refresh
        findHostInstancesForRefresh: zk,
        scheduleRefresh: Mk,
        scheduleRoot: Uk,
        setRefreshHandler: Ak,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: lj,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: vx
      });
    }
    var lw = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function Sx(e) {
      this._internalRoot = e;
    }
    Xh.prototype.render = Sx.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Jh(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== er) {
          var i = Vb(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      ev(e, t, null, null);
    }, Xh.prototype.unmount = Sx.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        gb() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Qo(function() {
          ev(null, e, null, null);
        }), lE(t);
      }
    };
    function uj(e, t) {
      if (!Jh(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      ow(e);
      var a = !1, i = !1, o = "", s = lw;
      t != null && (t.hydrate ? R("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Un && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var d = Pb(e, Wm, null, a, i, o, s);
      Pm(d.current, e);
      var v = e.nodeType === er ? e.parentNode : e;
      return lp(v), new Sx(d);
    }
    function Xh(e) {
      this._internalRoot = e;
    }
    function sj(e) {
      e && om(e);
    }
    Xh.prototype.unstable_scheduleHydration = sj;
    function cj(e, t, a) {
      if (!Jh(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      ow(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, s = !1, d = !1, v = "", m = lw;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (m = a.onRecoverableError));
      var E = Hb(t, null, e, Wm, i, s, d, v, m);
      if (Pm(E.current, e), lp(e), o)
        for (var C = 0; C < o.length; C++) {
          var M = o[C];
          vT(E, M);
        }
      return new Xh(E);
    }
    function Jh(e) {
      return !!(e && (e.nodeType === ua || e.nodeType === Zi || e.nodeType === ud));
    }
    function tv(e) {
      return !!(e && (e.nodeType === ua || e.nodeType === Zi || e.nodeType === ud || e.nodeType === er && e.nodeValue === " react-mount-point-unstable "));
    }
    function ow(e) {
      e.nodeType === ua && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), yp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var fj = b.ReactCurrentOwner, uw;
    uw = function(e) {
      if (e._reactRootContainer && e.nodeType !== er) {
        var t = Vb(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = xx(e), o = !!(i && Du(i));
      o && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === ua && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function xx(e) {
      return e ? e.nodeType === Zi ? e.documentElement : e.firstChild : null;
    }
    function sw() {
    }
    function dj(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var L = qh(d);
            s.call(L);
          };
        }
        var d = Hb(
          t,
          i,
          e,
          Lu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          sw
        );
        e._reactRootContainer = d, Pm(d.current, e);
        var v = e.nodeType === er ? e.parentNode : e;
        return lp(v), Qo(), d;
      } else {
        for (var m; m = e.lastChild; )
          e.removeChild(m);
        if (typeof i == "function") {
          var E = i;
          i = function() {
            var L = qh(C);
            E.call(L);
          };
        }
        var C = Pb(
          e,
          Lu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          sw
        );
        e._reactRootContainer = C, Pm(C.current, e);
        var M = e.nodeType === er ? e.parentNode : e;
        return lp(M), Qo(function() {
          ev(t, C, a, i);
        }), C;
      }
    }
    function pj(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Zh(e, t, a, i, o) {
      uw(a), pj(o === void 0 ? null : o, "render");
      var s = a._reactRootContainer, d;
      if (!s)
        d = dj(a, t, e, o, i);
      else {
        if (d = s, typeof o == "function") {
          var v = o;
          o = function() {
            var m = qh(d);
            v.call(m);
          };
        }
        ev(t, d, e, o);
      }
      return qh(d);
    }
    var cw = !1;
    function vj(e) {
      {
        cw || (cw = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = fj.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Gt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === ua ? e : Jk(e, "findDOMNode");
    }
    function mj(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !tv(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = yp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Zh(null, e, t, !0, a);
    }
    function hj(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !tv(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = yp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Zh(null, e, t, !1, a);
    }
    function yj(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !tv(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !yy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Zh(e, t, a, !1, i);
    }
    var fw = !1;
    function gj(e) {
      if (fw || (fw = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !tv(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = yp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = xx(e), i = a && !Du(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Qo(function() {
          Zh(null, null, e, !1, function() {
            e._reactRootContainer = null, lE(e);
          });
        }), !0;
      } else {
        {
          var o = xx(e), s = !!(o && Du(o)), d = e.nodeType === ua && tv(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", d ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Fr(Zk), Cu(ej), rm(tj), Os(Xa), Id(em), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Cc(x0), hy(XS, ck, Qo);
    function Sj(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Jh(t))
        throw new Error("Target container is not a DOM element.");
      return Xk(e, t, null, a);
    }
    function xj(e, t, a, i) {
      return yj(e, t, a, i);
    }
    var Ex = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Du, _f, Hm, fu, bc, XS]
    };
    function Ej(e, t) {
      return Ex.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), uj(e, t);
    }
    function Cj(e, t, a) {
      return Ex.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), cj(e, t, a);
    }
    function bj(e) {
      return gb() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Qo(e);
    }
    var wj = oj({
      findFiberByHostInstance: Ws,
      bundleType: 1,
      version: vx,
      rendererPackageName: "react-dom"
    });
    if (!wj && _n && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var dw = window.location.protocol;
      /^(https?|file):$/.test(dw) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (dw === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    ii.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ex, ii.createPortal = Sj, ii.createRoot = Ej, ii.findDOMNode = vj, ii.flushSync = bj, ii.hydrate = mj, ii.hydrateRoot = Cj, ii.render = hj, ii.unmountComponentAtNode = gj, ii.unstable_batchedUpdates = XS, ii.unstable_renderSubtreeIntoContainer = xj, ii.version = vx, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), ii;
}
function Nw() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Nw);
    } catch (x) {
      console.error(x);
    }
  }
}
process.env.NODE_ENV === "production" ? (Nw(), Nx.exports = Lj()) : Nx.exports = Aj();
var El = Nx.exports, Dx, ty = El;
if (process.env.NODE_ENV === "production")
  Dx = ty.createRoot, ty.hydrateRoot;
else {
  var Cw = ty.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Dx = function(x, S) {
    Cw.usingClientEntryPoint = !0;
    try {
      return ty.createRoot(x, S);
    } finally {
      Cw.usingClientEntryPoint = !1;
    }
  };
}
const ay = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, Mj = {
  activeEdition: ay,
  setEdition: () => {
  },
  supportedEditions: [ay],
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
  campaignError: void 0,
  campaignCreationMethod: void 0
}, Dw = N.createContext(Mj);
function Uj({ children: x }) {
  const [S, b] = N.useState(ay), [X, J] = N.useState({}), [R, g] = N.useState(null), K = N.useMemo(
    () => [
      ay,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), O = N.useCallback(
    async (re) => {
      const Se = re ?? S.key;
      if (J((He) => {
        var ue;
        return {
          ...He,
          [Se]: {
            data: (ue = He[Se]) == null ? void 0 : ue.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        J((He) => {
          var ue;
          return {
            ...He,
            [Se]: {
              data: (ue = He[Se]) == null ? void 0 : ue.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const He = await fetch(`/api/editions/${Se}/character-creation`);
        if (!He.ok)
          throw new Error(`Failed to load edition data (${He.status})`);
        const ue = await He.json(), _e = (ue == null ? void 0 : ue.character_creation) ?? ue;
        J((xe) => ({
          ...xe,
          [Se]: {
            data: _e,
            loading: !1,
            error: void 0
          }
        }));
      } catch (He) {
        const ue = He instanceof Error ? He.message : "Unknown error loading edition data";
        J((_e) => {
          var xe;
          return {
            ..._e,
            [Se]: {
              data: (xe = _e[Se]) == null ? void 0 : xe.data,
              loading: !1,
              error: ue
            }
          };
        });
      }
    },
    [S.key]
  ), U = N.useCallback((re) => `${new Intl.NumberFormat("en-US").format(re)}¥`, []), be = N.useCallback((re) => JSON.parse(JSON.stringify(re)), []), z = N.useCallback(
    (re, Se) => {
      var ue;
      if (!Se)
        return be(re);
      const He = be(re);
      if (Se.resources && ((ue = He.priorities) != null && ue.resources)) {
        const _e = He.priorities.resources;
        Object.entries(Se.resources).forEach(([xe, fe]) => {
          const pe = xe;
          typeof fe == "number" && _e[pe] && (_e[pe] = {
            ..._e[pe],
            label: U(fe)
          });
        });
      }
      return He;
    },
    [be, U]
  ), Y = N.useCallback(
    async (re) => {
      var Se, He;
      if (re) {
        g((ue) => (ue == null ? void 0 : ue.campaignId) === re ? { ...ue, loading: !0, error: void 0 } : {
          campaignId: re,
          edition: S.key,
          data: ue == null ? void 0 : ue.data,
          gameplayRules: ue == null ? void 0 : ue.gameplayRules,
          creationMethod: ue == null ? void 0 : ue.creationMethod,
          loading: !0,
          error: void 0
        });
        try {
          const ue = await fetch(`/api/campaigns/${re}/character-creation`);
          if (!ue.ok)
            throw new Error(`Failed to load campaign character creation (${ue.status})`);
          const _e = await ue.json(), xe = ((He = (Se = _e.edition) == null ? void 0 : Se.toLowerCase) == null ? void 0 : He.call(Se)) ?? S.key, fe = _e.edition_data;
          fe && J((pe) => {
            var W;
            return {
              ...pe,
              [xe]: {
                data: ((W = pe[xe]) == null ? void 0 : W.data) ?? fe,
                loading: !1,
                error: void 0
              }
            };
          }), g(() => ({
            campaignId: re,
            edition: xe,
            data: fe ? z(fe, _e.gameplay_rules) : void 0,
            gameplayRules: _e.gameplay_rules,
            creationMethod: _e.creation_method ?? void 0,
            loading: !1,
            error: void 0
          }));
        } catch (ue) {
          const _e = ue instanceof Error ? ue.message : "Unknown error loading campaign character creation data";
          throw g({
            campaignId: re,
            edition: S.key,
            data: void 0,
            gameplayRules: void 0,
            creationMethod: void 0,
            loading: !1,
            error: _e
          }), ue;
        }
      }
    },
    [S.key, z]
  ), ae = N.useCallback(() => {
    g(null);
  }, []), se = N.useMemo(() => {
    const re = X[S.key], Se = R && !R.loading && !R.error && R.edition === S.key, He = Se && R.data ? R.data : re == null ? void 0 : re.data, ue = Se ? R == null ? void 0 : R.creationMethod : void 0;
    return {
      activeEdition: S,
      supportedEditions: K,
      setEdition: (_e) => {
        const xe = K.find((fe) => fe.key === _e);
        xe ? b(xe) : console.warn(`Edition '${_e}' is not registered; keeping current edition.`);
      },
      characterCreationData: He,
      reloadEditionData: O,
      loadCampaignCharacterCreation: Y,
      clearCampaignCharacterCreation: ae,
      isLoading: (re == null ? void 0 : re.loading) ?? !1,
      error: re == null ? void 0 : re.error,
      campaignId: R == null ? void 0 : R.campaignId,
      campaignCharacterCreation: Se ? R == null ? void 0 : R.data : void 0,
      campaignGameplayRules: Se ? R == null ? void 0 : R.gameplayRules : void 0,
      campaignLoading: (R == null ? void 0 : R.loading) ?? !1,
      campaignError: R == null ? void 0 : R.error,
      campaignCreationMethod: ue
    };
  }, [
    S,
    R,
    ae,
    X,
    Y,
    O,
    K
  ]);
  return N.useEffect(() => {
    const re = X[S.key];
    !(re != null && re.data) && !(re != null && re.loading) && O(S.key);
  }, [S.key, X, O]), N.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: Y,
      clearCampaignCharacterCreation: ae
    }));
  }, [ae, Y]), N.useEffect(() => {
    var ue, _e, xe, fe, pe, W;
    const re = X[S.key], Se = R && !R.loading && !R.error && R.edition === S.key, He = Se && R.data ? R.data : re == null ? void 0 : re.data;
    He && typeof window < "u" && ((_e = (ue = window.ShadowmasterLegacyApp) == null ? void 0 : ue.setEditionData) == null || _e.call(ue, S.key, He)), typeof window < "u" && (Se ? (fe = (xe = window.ShadowmasterLegacyApp) == null ? void 0 : xe.applyCampaignCreationDefaults) == null || fe.call(xe, {
      campaignId: R.campaignId,
      edition: R.edition,
      gameplayRules: R.gameplayRules ?? null
    }) : (W = (pe = window.ShadowmasterLegacyApp) == null ? void 0 : pe.applyCampaignCreationDefaults) == null || W.call(pe, null));
  }, [S.key, R, X]), /* @__PURE__ */ c.jsx(Dw.Provider, { value: se, children: x });
}
function zj() {
  const x = N.useContext(Dw);
  if (!x)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return x;
}
const Ow = N.createContext(void 0);
function Fj(x) {
  if (typeof document > "u")
    return { node: null, created: !1 };
  let S = document.getElementById(x);
  const b = !S;
  return S || (S = document.createElement("div"), S.id = x, document.body.appendChild(S)), { node: S, created: b };
}
const Pj = 6e3;
function Hj() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Bj({ children: x }) {
  const [S, b] = N.useState([]), X = N.useRef(/* @__PURE__ */ new Map()), [J, R] = N.useState(null);
  N.useEffect(() => {
    const { node: U, created: be } = Fj("shadowmaster-notifications");
    R(U);
    const z = X.current;
    return () => {
      z.forEach((Y) => window.clearTimeout(Y)), z.clear(), be && (U != null && U.parentNode) && U.parentNode.removeChild(U);
    };
  }, []);
  const g = N.useCallback((U) => {
    b((z) => z.filter((Y) => Y.id !== U));
    const be = X.current.get(U);
    be && (window.clearTimeout(be), X.current.delete(U));
  }, []), K = N.useCallback(
    ({ id: U, type: be = "info", title: z, description: Y, durationMs: ae = Pj }) => {
      const se = U ?? Hj(), re = {
        id: se,
        type: be,
        title: z,
        description: Y ?? "",
        durationMs: ae,
        createdAt: Date.now()
      };
      if (b((Se) => [...Se, re]), ae > 0) {
        const Se = window.setTimeout(() => {
          g(se);
        }, ae);
        X.current.set(se, Se);
      }
      return se;
    },
    [g]
  ), O = N.useMemo(
    () => ({
      pushNotification: K,
      dismissNotification: g
    }),
    [g, K]
  );
  return N.useEffect(() => {
    if (typeof window > "u")
      return;
    const U = (be) => {
      const z = be;
      z.detail && K(z.detail);
    };
    return window.addEventListener("shadowmaster:notify", U), window.ShadowmasterNotify = K, () => {
      window.removeEventListener("shadowmaster:notify", U), window.ShadowmasterNotify === K && delete window.ShadowmasterNotify;
    };
  }, [K]), /* @__PURE__ */ c.jsxs(Ow.Provider, { value: O, children: [
    x,
    J && El.createPortal(
      /* @__PURE__ */ c.jsx("div", { className: "notification-stack", role: "status", "aria-live": "polite", children: S.map((U) => /* @__PURE__ */ c.jsxs(
        "div",
        {
          className: `notification-toast notification-toast--${U.type}`,
          "data-notification-type": U.type,
          children: [
            /* @__PURE__ */ c.jsxs("div", { className: "notification-toast__content", children: [
              /* @__PURE__ */ c.jsx("strong", { children: U.title }),
              U.description && /* @__PURE__ */ c.jsx("p", { dangerouslySetInnerHTML: { __html: U.description.replace(/\n/g, "<br />") } })
            ] }),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "notification-toast__close",
                "aria-label": "Dismiss notification",
                onClick: () => g(U.id),
                children: "×"
              }
            )
          ]
        },
        U.id
      )) }),
      J
    )
  ] });
}
function Lw() {
  const x = N.useContext(Ow);
  if (!x)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return x;
}
function wx(x, S) {
  return !!(x != null && x.roles.some((b) => b.toLowerCase() === S.toLowerCase()));
}
async function iv(x, S = {}) {
  const b = new Headers(S.headers || {});
  S.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const X = await fetch(x, {
    ...S,
    headers: b,
    credentials: "include"
  });
  if (X.status === 204)
    return {};
  const J = await X.text(), R = () => {
    try {
      return J ? JSON.parse(J) : {};
    } catch {
      return {};
    }
  };
  if (!X.ok) {
    const g = R(), K = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : X.statusText;
    throw new Error(K);
  }
  return R();
}
function Vj() {
  const [x, S] = N.useState("login"), [b, X] = N.useState(null), [J, R] = N.useState(!1), [g, K] = N.useState(!1), [O, U] = N.useState(""), [be, z] = N.useState(""), [Y, ae] = N.useState(""), [se, re] = N.useState(""), [Se, He] = N.useState(""), [ue, _e] = N.useState(""), [xe, fe] = N.useState(""), [pe, W] = N.useState(""), [we, de] = N.useState(""), Te = N.useRef(!1), Le = N.useRef(null), Ke = "auth-menu-dropdown", te = "auth-menu-heading", { pushNotification: Ae } = Lw();
  N.useEffect(() => {
    Te.current || (Te.current = !0, at());
  }, []), N.useEffect(() => {
    window.ShadowmasterAuth = {
      user: b,
      isAdministrator: wx(b, "administrator"),
      isGamemaster: wx(b, "gamemaster"),
      isPlayer: wx(b, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [b]), N.useEffect(() => {
    if (!g)
      return;
    const P = (ve) => {
      Le.current && (Le.current.contains(ve.target) || K(!1));
    }, ee = (ve) => {
      ve.key === "Escape" && K(!1);
    };
    return document.addEventListener("mousedown", P), document.addEventListener("keydown", ee), () => {
      document.removeEventListener("mousedown", P), document.removeEventListener("keydown", ee);
    };
  }, [g]), N.useEffect(() => {
    if (!g || b)
      return;
    const P = x === "register" ? "register-email" : "login-email", ee = window.setTimeout(() => {
      const ve = document.getElementById(P);
      ve == null || ve.focus();
    }, 0);
    return () => window.clearTimeout(ee);
  }, [g, b, x]);
  async function at() {
    try {
      R(!0);
      const P = await iv("/api/auth/me");
      X(P.user), S("login"), K(!P.user);
    } catch {
      X(null), K(!0);
    } finally {
      R(!1);
    }
  }
  async function ct(P) {
    P.preventDefault(), R(!0);
    try {
      const ee = await iv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: O,
          password: be
        })
      });
      X(ee.user), S("login"), z(""), K(!1), Ae({
        type: "success",
        title: "Signed in",
        description: ee.user ? `Welcome back, ${ee.user.username || ee.user.email}!` : "Signed in successfully."
      });
    } catch (ee) {
      const ve = ee instanceof Error ? ee.message : "Login failed";
      Ae({
        type: "error",
        title: "Login failed",
        description: ve
      });
    } finally {
      R(!1);
    }
  }
  async function Ne(P) {
    if (P.preventDefault(), Se !== ue) {
      Ae({
        type: "warning",
        title: "Passwords do not match",
        description: "Please confirm your password before continuing."
      });
      return;
    }
    R(!0);
    try {
      const ee = await iv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: Y,
          username: se,
          password: Se
        })
      });
      X(ee.user), S("login"), He(""), _e(""), Ae({
        type: "success",
        title: "Account created",
        description: "You can now sign in with your new credentials."
      });
    } catch (ee) {
      const ve = ee instanceof Error ? ee.message : "Registration failed";
      Ae({
        type: "error",
        title: "Registration failed",
        description: ve
      });
    } finally {
      R(!1);
    }
  }
  async function ye() {
    R(!0);
    try {
      await iv("/api/auth/logout", { method: "POST" }), X(null), S("login"), K(!0), Ae({
        type: "success",
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (P) {
      const ee = P instanceof Error ? P.message : "Logout failed";
      Ae({
        type: "error",
        title: "Logout failed",
        description: ee
      });
    } finally {
      R(!1);
    }
  }
  async function Ve(P) {
    if (P.preventDefault(), pe !== we) {
      Ae({
        type: "warning",
        title: "New passwords do not match",
        description: "Make sure both password fields match before updating."
      });
      return;
    }
    R(!0);
    try {
      await iv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: xe,
          new_password: pe
        })
      }), fe(""), W(""), de(""), S("login"), Ae({
        type: "success",
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (ee) {
      const ve = ee instanceof Error ? ee.message : "Password update failed";
      Ae({
        type: "error",
        title: "Password update failed",
        description: ve
      });
    } finally {
      R(!1);
    }
  }
  const je = N.useMemo(() => b ? b.roles.join(", ") : "", [b]), D = b ? `Signed in as ${b.email}.` : "Sign in to manage campaigns, sessions, and characters.";
  return /* @__PURE__ */ c.jsxs("section", { className: `auth-panel${g ? " auth-panel--open" : ""}`, ref: Le, children: [
    /* @__PURE__ */ c.jsxs(
      "button",
      {
        type: "button",
        className: "auth-panel__toggle",
        "aria-haspopup": "dialog",
        "aria-expanded": g,
        "aria-controls": Ke,
        onClick: () => K((P) => !P),
        children: [
          /* @__PURE__ */ c.jsxs("span", { className: "auth-panel__hamburger", "aria-hidden": "true", children: [
            /* @__PURE__ */ c.jsx("span", {}),
            /* @__PURE__ */ c.jsx("span", {}),
            /* @__PURE__ */ c.jsx("span", {})
          ] }),
          /* @__PURE__ */ c.jsx("span", { className: "auth-panel__label", children: b ? b.username : "Sign In" }),
          b && /* @__PURE__ */ c.jsx("span", { className: "auth-panel__tag", children: je || "Player" })
        ]
      }
    ),
    /* @__PURE__ */ c.jsxs(
      "div",
      {
        id: Ke,
        className: "auth-panel__dropdown",
        role: "dialog",
        "aria-modal": "false",
        "aria-hidden": !g,
        "aria-labelledby": te,
        children: [
          /* @__PURE__ */ c.jsxs("header", { className: "auth-panel__header", children: [
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { id: te, children: b ? `Welcome, ${b.username}` : "Account Access" }),
              /* @__PURE__ */ c.jsx("p", { className: "auth-panel__status", children: D })
            ] }),
            b && /* @__PURE__ */ c.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ c.jsx("span", { className: "auth-tag", children: je || "Player" }) })
          ] }),
          b ? /* @__PURE__ */ c.jsxs("div", { className: "auth-panel__content", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "auth-panel__actions", children: [
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-secondary",
                  onClick: () => {
                    S(x === "password" ? "login" : "password");
                  },
                  disabled: J,
                  children: x === "password" ? "Hide Password Form" : "Change Password"
                }
              ),
              /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "button", onClick: ye, disabled: J, children: "Logout" })
            ] }),
            x === "password" && /* @__PURE__ */ c.jsxs("form", { className: "auth-form", onSubmit: Ve, children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "current-password",
                    type: "password",
                    value: xe,
                    onChange: (P) => fe(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "new-password", children: "New Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "new-password",
                    type: "password",
                    value: pe,
                    onChange: (P) => W(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "confirm-password",
                    type: "password",
                    value: we,
                    onChange: (P) => de(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Update Password" })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "auth-panel__menu-links", children: /* @__PURE__ */ c.jsxs("span", { className: "auth-panel__menu-link auth-panel__menu-link--disabled", children: [
              "Settings ",
              /* @__PURE__ */ c.jsx("small", { children: "Coming soon" })
            ] }) })
          ] }) : /* @__PURE__ */ c.jsxs("div", { className: "auth-panel__content", children: [
            x === "login" && /* @__PURE__ */ c.jsxs("form", { className: "auth-form", onSubmit: ct, children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "login-email", children: "Email" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "login-email",
                    type: "email",
                    value: O,
                    onChange: (P) => U(P.target.value),
                    required: !0,
                    autoComplete: "email"
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "login-password", children: "Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "login-password",
                    type: "password",
                    value: be,
                    onChange: (P) => z(P.target.value),
                    required: !0,
                    autoComplete: "current-password"
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Sign In" }),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      S("register");
                    },
                    children: "Need an account?"
                  }
                )
              ] })
            ] }),
            x === "register" && /* @__PURE__ */ c.jsxs("form", { className: "auth-form", onSubmit: Ne, children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-email", children: "Email" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-email",
                    type: "email",
                    value: Y,
                    onChange: (P) => ae(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-username", children: "Username" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-username",
                    value: se,
                    onChange: (P) => re(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-password", children: "Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-password",
                    type: "password",
                    value: Se,
                    onChange: (P) => He(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-confirm",
                    type: "password",
                    value: ue,
                    onChange: (P) => _e(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Create Account" }),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      S("login");
                    },
                    children: "Sign in instead"
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function Ij() {
  var S, b;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (b = (S = window.ShadowmasterLegacyApp) == null ? void 0 : S.showWizardStep) == null || b.call(S, 1);
  const x = document.getElementById("character-modal");
  x && (x.style.display = "block");
}
function $j() {
  const [x, S] = N.useState(null);
  return N.useEffect(() => {
    S(document.getElementById("characters-actions"));
  }, []), x ? El.createPortal(
    /* @__PURE__ */ c.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ c.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ c.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ c.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: Ij,
          children: "Create Character"
        }
      ) })
    ] }),
    x
  ) : null;
}
function Xf() {
  return zj();
}
const _x = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
], Tx = ["Basics", "Roster", "World", "Automation", "Session Seed", "Review"], Yj = [
  {
    key: "initiative_automation",
    label: "Automate initiative order",
    description: "Track initiative passes and reorder combatants automatically."
  },
  {
    key: "recoil_tracking",
    label: "Track recoil and weapon heat",
    description: "Automatically apply recoil modifiers to firearms."
  },
  {
    key: "matrix_trace",
    label: "Matrix trace timers",
    description: "Monitor trace attempts and decker timers in the matrix."
  }
], Wj = [
  { value: "blank", label: "Blank session", description: "Start fresh with your own outline." },
  {
    value: "social_meetup",
    label: "Johnson meet-and-greet",
    description: "Introductory social encounter with your fixer or Johnson."
  },
  {
    value: "matrix_recon",
    label: "Matrix scoping run",
    description: "Initial matrix reconnaissance to set the stage for future runs."
  },
  {
    value: "astral_patrol",
    label: "Astral patrol",
    description: "Magically oriented scene to explore astral threats or allies."
  }
];
function uc(x) {
  return typeof crypto < "u" && crypto.randomUUID ? `${x}-${crypto.randomUUID()}` : `${x}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function lv(x) {
  return x.toLowerCase() === "sr5" ? "SR5" : x.toUpperCase();
}
function bw(x) {
  return x === "SR5" ? "Shadowrun 5th Edition" : x;
}
const ww = {
  name: "",
  description: "",
  theme: "",
  selectedPlayers: [],
  placeholders: [],
  factions: [],
  locations: [],
  houseRules: {},
  houseRuleNotes: "",
  sessionSeed: {
    title: "Session 0",
    objectives: "",
    sceneTemplate: "blank",
    skip: !1,
    summary: ""
  }
};
function Qj(x, S) {
  switch (S.type) {
    case "RESET":
      return S.payload;
    case "UPDATE_FIELD":
      return {
        ...x,
        [S.field]: S.value
      };
    case "UPDATE_PLACEHOLDER":
      return {
        ...x,
        placeholders: x.placeholders.map(
          (b) => b.id === S.id ? { ...b, [S.field]: S.value } : b
        )
      };
    case "ADD_PLACEHOLDER":
      return {
        ...x,
        placeholders: [
          ...x.placeholders,
          {
            id: uc("placeholder"),
            name: "Runner Placeholder",
            role: "Unassigned"
          }
        ]
      };
    case "REMOVE_PLACEHOLDER":
      return {
        ...x,
        placeholders: x.placeholders.filter((b) => b.id !== S.id)
      };
    case "UPDATE_FACTION":
      return {
        ...x,
        factions: x.factions.map(
          (b) => b.id === S.id ? { ...b, [S.field]: S.value } : b
        )
      };
    case "ADD_FACTION":
      return {
        ...x,
        factions: [
          ...x.factions,
          {
            id: uc("faction"),
            name: "",
            tags: "",
            notes: ""
          }
        ]
      };
    case "ADD_FACTION_WITH_ID":
      return {
        ...x,
        factions: [
          ...x.factions,
          {
            id: S.id,
            name: "",
            tags: "",
            notes: ""
          }
        ]
      };
    case "REMOVE_FACTION":
      return {
        ...x,
        factions: x.factions.filter((b) => b.id !== S.id)
      };
    case "UPDATE_LOCATION":
      return {
        ...x,
        locations: x.locations.map(
          (b) => b.id === S.id ? { ...b, [S.field]: S.value } : b
        )
      };
    case "ADD_LOCATION":
      return {
        ...x,
        locations: [
          ...x.locations,
          {
            id: uc("location"),
            name: "",
            descriptor: ""
          }
        ]
      };
    case "ADD_LOCATION_WITH_ID":
      return {
        ...x,
        locations: [
          ...x.locations,
          {
            id: S.id,
            name: "",
            descriptor: ""
          }
        ]
      };
    case "REMOVE_LOCATION":
      return {
        ...x,
        locations: x.locations.filter((b) => b.id !== S.id)
      };
    case "UPDATE_HOUSE_RULE":
      return {
        ...x,
        houseRules: {
          ...x.houseRules,
          [S.key]: S.value
        }
      };
    case "UPDATE_SESSION_SEED":
      return {
        ...x,
        sessionSeed: {
          ...x.sessionSeed,
          [S.field]: S.value
        }
      };
    default:
      return x;
  }
}
function Gj({ targetId: x = "campaign-creation-react-root", onCreated: S }) {
  var At;
  const {
    activeEdition: b,
    supportedEditions: X,
    characterCreationData: J,
    campaignCharacterCreation: R,
    reloadEditionData: g,
    setEdition: K
  } = Xf(), O = N.useMemo(() => {
    const Z = X.find((k) => k.key === "sr5");
    return Z ? Z.key : b.key;
  }, [b.key, X]), [U, be] = N.useState(null), [z, Y] = N.useState(O), [ae, se] = N.useState(J), [re, Se] = N.useState([]), [He, ue] = N.useState([]), [_e, xe] = N.useState(""), [fe, pe] = N.useState("experienced"), [W, we] = N.useState("priority"), [de, Te] = N.useState([]), [Le, Ke] = N.useState({}), [te, Ae] = N.useState(_x), [at, ct] = N.useState(!1), [Ne, ye] = N.useState(!1), [Ve, je] = N.useState(null), [D, P] = N.useState(0), [ee, ve] = N.useReducer(Qj, ww), [wt, kt] = N.useState([]), [St, yt] = N.useState(() => [lv(O)]), [xt, Bt] = N.useState(!1), [_n, Wn] = N.useState(!1), [yn, gn] = N.useState(null), { pushNotification: Tn } = Lw(), [_t, En] = N.useState({}), [Rn, $n] = N.useState({}), [kn, Sn] = N.useState(!1), [Cn, V] = N.useState(!1), Ye = N.useRef(null), Et = N.useRef(null), Ct = N.useRef(null), Mr = N.useRef(null), ra = N.useRef(null), wa = N.useRef(null), Oe = N.useRef(null), nt = Tx.length, ot = N.useMemo(() => lv(z), [z]), Wt = N.useMemo(() => {
    const Z = /* @__PURE__ */ new Map();
    return wt.forEach((k) => {
      Z.set(k.code.toUpperCase(), k.name);
    }), Z;
  }, [wt]), sn = N.useMemo(
    () => St.map((Z) => Wt.get(Z) ?? Z),
    [Wt, St]
  );
  N.useEffect(() => {
    be(document.getElementById(x));
  }, [x]), N.useEffect(() => {
    Y(O);
  }, [O]), N.useEffect(() => {
    b.key !== O && K(O);
  }, [b.key, O, K]), N.useEffect(() => {
    let Z = !1;
    async function k() {
      Wn(!0), gn(null);
      try {
        const oe = await fetch(`/api/editions/${z}/books`);
        if (!oe.ok)
          throw new Error(`Failed to load books (${oe.status})`);
        const et = await oe.json(), vt = Array.isArray(et == null ? void 0 : et.books) ? et.books : [];
        if (Z)
          return;
        const zt = vt.map((qe) => ({
          ...qe,
          code: (qe.code || "").toUpperCase()
        })).filter((qe) => qe.code), rt = zt.some((qe) => qe.code === ot) ? zt : [
          ...zt,
          {
            id: ot.toLowerCase(),
            name: bw(ot),
            code: ot
          }
        ];
        rt.sort((qe, Fn) => qe.code.localeCompare(Fn.code)), kt(rt), yt((qe) => {
          const Fn = new Set(qe.map((cr) => cr.toUpperCase()));
          Fn.add(ot);
          const Ln = new Set(rt.map((cr) => cr.code));
          return Array.from(Fn).filter((cr) => Ln.has(cr)).sort();
        });
      } catch (oe) {
        if (console.error("Failed to load source books", oe), Z)
          return;
        gn("Unable to load source books. Default core book applied.");
        const et = [
          { id: ot.toLowerCase(), name: bw(ot), code: ot }
        ];
        kt(et), yt([ot]);
      } finally {
        Z || Wn(!1);
      }
    }
    return k(), () => {
      Z = !0;
    };
  }, [ot, z]), N.useEffect(() => {
    async function Z(k) {
      var oe;
      try {
        const et = await fetch(`/api/editions/${k}/character-creation`);
        if (!et.ok)
          throw new Error(`Failed to load edition data (${et.status})`);
        const vt = await et.json(), zt = (vt == null ? void 0 : vt.character_creation) ?? vt;
        se(zt), Ke(zt.creation_methods ?? {});
        const Qt = Object.entries(zt.gameplay_levels ?? {}).map(([rt, { label: qe }]) => ({
          value: rt,
          label: qe || rt
        }));
        Se(Qt), Qt.some((rt) => rt.value === fe) || pe(((oe = Qt[0]) == null ? void 0 : oe.value) ?? "experienced");
      } catch (et) {
        console.error("Failed to load edition data", et);
      }
    }
    Z(z);
  }, [z, fe]), N.useEffect(() => {
    async function Z() {
      try {
        const k = await fetch("/api/users?role=gamemaster,administrator");
        if (!k.ok)
          throw new Error(`Failed to load users (${k.status})`);
        const oe = await k.json();
        if (!Array.isArray(oe) || oe.length === 0) {
          Te([]);
          return;
        }
        Te(oe), oe.length > 0 && xe((et) => et || oe[0].id);
      } catch (k) {
        console.error("Failed to load users", k), Te([]);
      }
    }
    Z();
  }, []), N.useEffect(() => {
    async function Z() {
      try {
        const k = await fetch("/api/characters");
        if (!k.ok)
          throw new Error(`Failed to load characters (${k.status})`);
        const oe = await k.json();
        if (!Array.isArray(oe)) {
          ue([]);
          return;
        }
        ue(oe);
      } catch (k) {
        console.error("Failed to load characters", k), ue([]);
      }
    }
    Z();
  }, []), N.useEffect(() => {
    !ae && J && (se(J), Ke(J.creation_methods ?? {}));
  }, [J, ae]), N.useEffect(() => {
    if (!ae && Object.keys(Le).length === 0) {
      Ae(_x);
      return;
    }
    if (!Le || Object.keys(Le).length === 0) {
      Ae(_x);
      return;
    }
    const Z = Object.entries(Le).map(([k, oe]) => ({
      value: k,
      label: oe.label || k
    })).sort((k, oe) => k.value === "priority" ? -1 : oe.value === "priority" ? 1 : k.label.localeCompare(oe.label));
    Ae(Z);
  }, [Le, ae]), N.useEffect(() => {
    if (te.length !== 0 && !te.some((Z) => Z.value === W)) {
      const Z = te.find((k) => k.value === "priority");
      we((Z == null ? void 0 : Z.value) ?? te[0].value);
      return;
    }
  }, [te, W]);
  const jn = N.useMemo(() => X.map((Z) => ({
    label: Z.label,
    value: Z.key
  })), [X]), cn = N.useMemo(() => de.length === 0 ? [{ label: "No gamemasters found", value: "" }] : de.map((Z) => ({
    label: `${Z.username} (${Z.email})`,
    value: Z.id
  })), [de]), Nn = N.useMemo(() => (R == null ? void 0 : R.campaign_support) ?? (J == null ? void 0 : J.campaign_support), [R == null ? void 0 : R.campaign_support, J == null ? void 0 : J.campaign_support]), ln = (Nn == null ? void 0 : Nn.factions) ?? [], qt = (Nn == null ? void 0 : Nn.locations) ?? [], [Xt, Hr] = N.useState(""), [Qn, aa] = N.useState(""), za = N.useMemo(() => {
    if (!Xt.trim())
      return ln;
    const Z = Xt.toLowerCase();
    return ln.filter((k) => k.name.toLowerCase().includes(Z) || (k.tags ?? "").toLowerCase().includes(Z) || (k.notes ?? "").toLowerCase().includes(Z));
  }, [Xt, ln]), xi = N.useMemo(() => {
    if (!Qn.trim())
      return qt;
    const Z = Qn.toLowerCase();
    return qt.filter((k) => k.name.toLowerCase().includes(Z) || (k.descriptor ?? "").toLowerCase().includes(Z));
  }, [Qn, qt]), li = N.useCallback(
    (Z) => {
      var oe, et;
      const k = Z ?? lv(z);
      ve({ type: "RESET", payload: { ...ww } }), pe("experienced"), we(((oe = te[0]) == null ? void 0 : oe.value) ?? "priority"), xe(((et = de[0]) == null ? void 0 : et.id) ?? ""), je(null), En({}), $n({}), P(0), yt([k]), Bt(!1), gn(null);
    },
    [te, z, de]
  );
  function Ei() {
    const Z = lv(b.key);
    Y(b.key), li(Z), ct(!0);
  }
  function Ci() {
    li(), ct(!1);
  }
  function ia(Z) {
    const k = {};
    let oe;
    return Z === 0 && (ee.name.trim() || (k.name = "Campaign name is required.", oe = "Provide a campaign name before continuing."), de.length > 0 && !_e && (k.gm = "Assign a gamemaster.", oe = oe ?? "Assign a gamemaster before continuing.")), Z === 1 && ee.selectedPlayers.length === 0 && ee.placeholders.length === 0 && (k.roster = "Select at least one existing character or create a placeholder runner.", oe = "Attach at least one runner before continuing."), Z === 2 && ee.factions.length === 0 && ee.locations.length === 0 && (k.backbone = "Add at least one faction or location, or use the quick-add template.", oe = "Capture at least one faction or location before continuing."), Z === 4 && !ee.sessionSeed.skip && !ee.sessionSeed.title.trim() && (k.sessionSeed = "Provide a title for the initial session or choose to skip.", oe = "Name your first session or choose to skip."), Object.keys(k).length > 0 ? (sr(Z, k, oe), !1) : (je(null), En({}), la(Z), !0);
  }
  const Er = () => {
    var k;
    if (!ia(D))
      return;
    const Z = Math.min(D + 1, Tx.length - 1);
    En({}), P(Z), (k = Rn[Z]) != null && k.length ? ia(Z) : Object.values(Rn).some((oe) => oe == null ? void 0 : oe.length) || je(null);
  }, Un = (Z) => {
    !(Z != null && Z.current) || !(Z.current instanceof HTMLElement) || (Z.current.focus({ preventScroll: !0 }), Z.current.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, sr = (Z, k, oe) => {
    const et = Object.keys(k), vt = et[0], zt = oe != null ? [
      oe,
      ...et.filter((Qt) => Qt !== vt).map((Qt) => k[Qt]).filter((Qt) => Qt && Qt !== oe)
    ] : et.map((Qt) => k[Qt]);
    if (je(zt[0] ?? null), En(k), $n((Qt) => ({
      ...Qt,
      [Z]: zt.length > 0 ? zt : ["Please resolve the highlighted fields."]
    })), vt)
      switch (vt) {
        case "name":
          Un(Ye);
          break;
        case "theme":
          Un(Et);
          break;
        case "gm":
          Un(Ct);
          break;
        case "overview":
          Un(Mr);
          break;
        case "roster":
          Un(ra);
          break;
        case "backbone":
          Un(wa);
          break;
        case "sessionSeed":
          Un(Oe);
          break;
      }
  }, la = (Z) => {
    $n((k) => {
      if (!(Z in k))
        return k;
      const { [Z]: oe, ...et } = k;
      return Object.keys(et).length === 0 && je(null), et;
    });
  }, zn = (Z, k = D) => {
    En((oe) => {
      if (!(Z in oe))
        return oe;
      const et = { ...oe };
      return delete et[Z], Object.keys(et).length === 0 && (k === D && je(null), la(k)), et;
    });
  }, Fa = N.useCallback(() => {
    const Z = uc("faction");
    ve({ type: "ADD_FACTION_WITH_ID", id: Z }), ve({ type: "UPDATE_FACTION", id: Z, field: "name", value: "Ares Macrotechnology" }), ve({ type: "UPDATE_FACTION", id: Z, field: "tags", value: "Corporate, AAA" }), ve({
      type: "UPDATE_FACTION",
      id: Z,
      field: "notes",
      value: "Megacorp interested in experimental weapons testing."
    }), zn("backbone", 2);
  }, [zn]), Pa = N.useCallback(() => {
    const Z = uc("location");
    ve({ type: "ADD_LOCATION_WITH_ID", id: Z }), ve({ type: "UPDATE_LOCATION", id: Z, field: "name", value: "Downtown Seattle Safehouse" }), ve({
      type: "UPDATE_LOCATION",
      id: Z,
      field: "descriptor",
      value: "Secure condo with rating 4 security and friendly neighbors."
    }), zn("backbone", 2);
  }, [zn]), T = () => {
    var k;
    const Z = Math.max(D - 1, 0);
    En({}), P(Z), (k = Rn[Z]) != null && k.length ? ia(Z) : Object.values(Rn).some((oe) => oe == null ? void 0 : oe.length) || je(null);
  };
  async function me(Z) {
    var oe, et;
    if (Z.preventDefault(), !ia(D))
      return;
    const k = Object.entries(Rn).find(
      ([vt, zt]) => Number(vt) !== D && (zt == null ? void 0 : zt.length)
    );
    if (k) {
      const vt = Number(k[0]);
      En({}), P(vt), ia(vt);
      return;
    }
    ye(!0), je(null), En({}), la(D);
    try {
      const vt = de.find((Ln) => Ln.id === _e), zt = ee.name.trim() || "Campaign", Qt = {
        automation: ee.houseRules,
        notes: ee.houseRuleNotes,
        theme: ee.theme,
        factions: ee.factions,
        locations: ee.locations,
        placeholders: ee.placeholders,
        session_seed: ee.sessionSeed
      }, rt = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ee.name.trim(),
          description: ee.description,
          gm_user_id: _e,
          gm_name: (vt == null ? void 0 : vt.username) ?? (vt == null ? void 0 : vt.email) ?? "",
          edition: z,
          gameplay_level: fe,
          creation_method: W,
          enabled_books: St,
          house_rules: JSON.stringify(Qt),
          status: "Active"
        })
      });
      if (!rt.ok) {
        const Ln = await rt.text();
        throw new Error(Ln || `Failed to create campaign (${rt.status})`);
      }
      const qe = await rt.json(), Fn = [];
      if (ee.placeholders.length > 0)
        try {
          await Promise.all(
            ee.placeholders.map(async (Ln) => {
              const cr = await fetch("/api/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: Ln.name,
                  player_name: Ln.role,
                  status: "Placeholder",
                  edition: z,
                  edition_data: {},
                  is_npc: !0,
                  campaign_id: qe.id
                })
              });
              if (!cr.ok) {
                const bi = await cr.text();
                throw new Error(bi || `Failed to create placeholder (${cr.status})`);
              }
            })
          );
        } catch (Ln) {
          console.error("Failed to create placeholder characters", Ln), Fn.push("Placeholder runners were not saved.");
        }
      if (!ee.sessionSeed.skip)
        try {
          const Ln = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaign_id: qe.id,
              name: ee.sessionSeed.title || "Session 0",
              description: ee.sessionSeed.objectives,
              notes: ee.sessionSeed.summary,
              session_date: (/* @__PURE__ */ new Date()).toISOString(),
              status: "Planned"
            })
          });
          if (!Ln.ok) {
            const cr = await Ln.text();
            throw new Error(cr || `Failed to create session seed (${Ln.status})`);
          }
        } catch (Ln) {
          console.error("Failed to create session seed", Ln), Fn.push("Session seed could not be created automatically.");
        }
      li(), (et = (oe = window.ShadowmasterLegacyApp) == null ? void 0 : oe.loadCampaigns) == null || et.call(oe), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), S == null || S(qe), ct(!1), Tn({
        type: "success",
        title: `${zt} created`,
        description: "Campaign is ready for onboarding."
      }), Fn.length > 0 && Tn({
        type: "warning",
        title: "Campaign created with warnings",
        description: Fn.join(`
`)
      });
    } catch (vt) {
      const zt = vt instanceof Error ? vt.message : "Failed to create campaign.";
      je(zt), Tn({
        type: "error",
        title: "Campaign creation failed",
        description: zt
      });
    } finally {
      ye(!1);
    }
  }
  const Me = Le[W], We = () => {
    var Z;
    switch (D) {
      case 0:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Campaign Essentials" }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-name", children: "Campaign Name" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  id: "campaign-name",
                  name: "campaign-name",
                  value: ee.name,
                  onChange: (k) => {
                    ve({ type: "UPDATE_FIELD", field: "name", value: k.target.value }), zn("name");
                  },
                  autoFocus: !0,
                  maxLength: 80,
                  required: !0,
                  placeholder: "e.g., Emerald City Heist",
                  ref: Ye,
                  className: _t.name ? "input--invalid" : void 0,
                  "aria-invalid": _t.name ? "true" : "false",
                  "aria-describedby": _t.name ? "campaign-name-error" : void 0
                }
              ),
              /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "This title appears in dashboards, notifications, and session summaries." }),
              _t.name && /* @__PURE__ */ c.jsx("p", { id: "campaign-name-error", className: "form-error", role: "alert", children: _t.name })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-theme", children: "Theme / Tagline" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  id: "campaign-theme",
                  name: "campaign-theme",
                  value: ee.theme,
                  onChange: (k) => ve({ type: "UPDATE_FIELD", field: "theme", value: k.target.value }),
                  placeholder: "e.g., Neo-Tokyo corporate intrigue",
                  ref: Et
                }
              ),
              /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "A short hook that sets tone for players and appears alongside the title." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-edition", children: "Edition" }),
              /* @__PURE__ */ c.jsx(
                "select",
                {
                  id: "campaign-edition",
                  name: "campaign-edition",
                  value: z,
                  onChange: (k) => {
                    const oe = k.target.value;
                    Y(oe), K(oe), yt([lv(oe)]), Bt(!1), gn(null), g(oe);
                  },
                  children: jn.map((k) => /* @__PURE__ */ c.jsx("option", { value: k.value, children: k.label }, k.value))
                }
              )
            ] }),
            re.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-gameplay-level", children: "Gameplay Level" }),
              /* @__PURE__ */ c.jsx(
                "select",
                {
                  id: "campaign-gameplay-level",
                  name: "campaign-gameplay-level",
                  value: fe,
                  onChange: (k) => pe(k.target.value),
                  children: re.map((k) => /* @__PURE__ */ c.jsx("option", { value: k.value, children: k.label }, k.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-creation-method", children: "Character Creation Method" }),
            /* @__PURE__ */ c.jsx(
              "select",
              {
                id: "campaign-creation-method",
                name: "campaign-creation-method",
                value: W,
                onChange: (k) => we(k.target.value),
                children: te.map((k) => /* @__PURE__ */ c.jsx("option", { value: k.value, children: k.label }, k.value))
              }
            ),
            /* @__PURE__ */ c.jsxs("div", { className: "form-help", children: [
              (Me == null ? void 0 : Me.description) && /* @__PURE__ */ c.jsx("p", { children: Me.description }),
              W !== "priority" && /* @__PURE__ */ c.jsx("p", { children: "Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily default to Priority until the new workflows are implemented." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "collapsible", children: [
            /* @__PURE__ */ c.jsxs(
              "button",
              {
                type: "button",
                className: "collapsible__trigger",
                "aria-expanded": xt,
                onClick: () => Bt((k) => !k),
                children: [
                  /* @__PURE__ */ c.jsx("span", { children: "Source Books" }),
                  /* @__PURE__ */ c.jsx("span", { className: "collapsible__chevron", "aria-hidden": "true", children: xt ? "▾" : "▸" })
                ]
              }
            ),
            /* @__PURE__ */ c.jsxs(
              "div",
              {
                className: `collapsible__content ${xt ? "collapsible__content--open" : ""}`,
                "aria-live": "polite",
                children: [
                  /* @__PURE__ */ c.jsxs("p", { className: "form-help", children: [
                    "Enable the references that should be legal at your table. ",
                    ot,
                    " is always required and stays selected."
                  ] }),
                  yn && /* @__PURE__ */ c.jsx("p", { className: "form-warning", children: yn }),
                  _n ? /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "Loading books…" }) : /* @__PURE__ */ c.jsx("div", { className: "book-checkboxes", children: wt.map((k) => {
                    const oe = k.code.toUpperCase(), et = St.includes(oe), vt = oe === ot;
                    return /* @__PURE__ */ c.jsxs("label", { className: `book-checkbox ${vt ? "book-checkbox--locked" : ""}`, children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: et,
                          disabled: vt,
                          onChange: (zt) => {
                            const Qt = zt.target.checked;
                            yt((rt) => {
                              const qe = new Set(rt.map((Fn) => Fn.toUpperCase()));
                              return Qt ? qe.add(oe) : qe.delete(oe), qe.has(ot) || qe.add(ot), Array.from(qe).sort();
                            });
                          }
                        }
                      ),
                      /* @__PURE__ */ c.jsxs("span", { className: "book-option", children: [
                        k.name,
                        " ",
                        /* @__PURE__ */ c.jsxs("span", { className: "book-code", children: [
                          "(",
                          oe,
                          ")"
                        ] }),
                        vt && /* @__PURE__ */ c.jsx("span", { className: "book-required", children: "(required)" })
                      ] })
                    ] }, oe);
                  }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
            /* @__PURE__ */ c.jsx(
              "select",
              {
                id: "campaign-gm",
                name: "campaign-gm",
                value: _e,
                onChange: (k) => {
                  xe(k.target.value), zn("gm");
                },
                ref: Ct,
                className: _t.gm ? "input--invalid" : void 0,
                "aria-invalid": _t.gm ? "true" : "false",
                "aria-describedby": _t.gm ? "campaign-gm-error" : void 0,
                children: cn.map((k) => /* @__PURE__ */ c.jsx("option", { value: k.value, children: k.label }, k.value))
              }
            ),
            _t.gm && /* @__PURE__ */ c.jsx("p", { id: "campaign-gm-error", className: "form-error", role: "alert", children: _t.gm })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-description", children: "Campaign Overview" }),
            /* @__PURE__ */ c.jsx(
              "textarea",
              {
                id: "campaign-description",
                name: "campaign-description",
                value: ee.description,
                onChange: (k) => {
                  ve({ type: "UPDATE_FIELD", field: "description", value: k.target.value }), zn("overview");
                },
                placeholder: "Outline the premise, tone, and first planned arc. Include touchstones players can latch onto.",
                rows: 6,
                ref: Mr,
                className: `campaign-form__textarea ${_t.overview ? "input--invalid" : ""}`.trim(),
                "aria-invalid": _t.overview ? "true" : "false",
                "aria-describedby": _t.overview ? "campaign-description-error" : void 0
              }
            ),
            /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "Use this space for the elevator pitch—players will see it at a glance when they open the campaign." }),
            _t.overview && /* @__PURE__ */ c.jsx("p", { id: "campaign-description-error", className: "form-error", role: "alert", children: _t.overview })
          ] })
        ] });
      case 1:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Roster & Roles" }),
          /* @__PURE__ */ c.jsx("p", { children: "Attach existing player characters or create placeholders to represent expected runners." }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-players", children: "Existing Characters" }),
            He.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "No characters found yet. You can create placeholders below." }) : /* @__PURE__ */ c.jsx("div", { className: "character-checkboxes", ref: ra, tabIndex: -1, children: He.map((k) => {
              const oe = k.player_name ? `${k.name} — ${k.player_name}` : k.name, et = ee.selectedPlayers.includes(k.id);
              return /* @__PURE__ */ c.jsxs("label", { className: "character-checkbox", children: [
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: et,
                    onChange: (vt) => {
                      ve({
                        type: "UPDATE_FIELD",
                        field: "selectedPlayers",
                        value: vt.target.checked ? [...ee.selectedPlayers, k.id] : ee.selectedPlayers.filter((zt) => zt !== k.id)
                      }), zn("roster");
                    }
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { children: oe }),
                k.status && /* @__PURE__ */ c.jsx("small", { className: "character-status", children: k.status })
              ] }, k.id);
            }) })
          ] }),
          _t.roster && /* @__PURE__ */ c.jsx("p", { className: "form-error", role: "alert", children: _t.roster }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { children: "Player Characters" }),
            /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "Player selection is coming soon. Use placeholders to capture your expected team composition." }),
            /* @__PURE__ */ c.jsxs("div", { className: "placeholder-list", children: [
              ee.placeholders.map((k) => /* @__PURE__ */ c.jsxs("div", { className: "placeholder-card", children: [
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    value: k.name,
                    onChange: (oe) => ve({
                      type: "UPDATE_PLACEHOLDER",
                      id: k.id,
                      field: "name",
                      value: oe.target.value
                    }),
                    placeholder: "Runner handle"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    value: k.role,
                    onChange: (oe) => ve({
                      type: "UPDATE_PLACEHOLDER",
                      id: k.id,
                      field: "role",
                      value: oe.target.value
                    }),
                    placeholder: "Role / specialty"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-link",
                    onClick: () => ve({ type: "REMOVE_PLACEHOLDER", id: k.id }),
                    children: "Remove"
                  }
                )
              ] }, k.id)),
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  className: "btn-secondary",
                  onClick: () => {
                    ve({ type: "ADD_PLACEHOLDER" }), zn("roster", 1);
                  },
                  children: "Add Placeholder"
                }
              )
            ] })
          ] })
        ] });
      case 2:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "World Backbone" }),
          /* @__PURE__ */ c.jsx("p", { children: "Capture recurring factions and key locations to anchor your campaign." }),
          /* @__PURE__ */ c.jsx("div", { ref: wa, tabIndex: -1, children: /* @__PURE__ */ c.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Factions" }),
              ln.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "backbone-library", children: [
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => Sn((k) => !k),
                    "aria-expanded": kn,
                    "aria-controls": "creation-faction-library",
                    children: kn ? "Hide library" : "Browse library"
                  }
                ),
                kn && /* @__PURE__ */ c.jsxs(
                  "div",
                  {
                    id: "creation-faction-library",
                    className: "campaign-manage__preset-panel",
                    role: "region",
                    "aria-label": "Faction library",
                    children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "search",
                          placeholder: "Search faction library…",
                          value: Xt,
                          onChange: (k) => Hr(k.target.value)
                        }
                      ),
                      /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: za.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : za.map((k) => /* @__PURE__ */ c.jsxs(
                        "button",
                        {
                          type: "button",
                          className: "campaign-manage__preset-option",
                          onClick: () => {
                            const oe = uc("faction");
                            ve({ type: "ADD_FACTION_WITH_ID", id: oe }), ve({ type: "UPDATE_FACTION", id: oe, field: "name", value: k.name }), ve({ type: "UPDATE_FACTION", id: oe, field: "tags", value: k.tags ?? "" }), ve({ type: "UPDATE_FACTION", id: oe, field: "notes", value: k.notes ?? "" }), Sn(!1);
                          },
                          children: [
                            /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: k.name }),
                            k.tags && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: k.tags })
                          ]
                        },
                        k.id
                      )) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "backbone-list", children: [
                ee.factions.map((k) => /* @__PURE__ */ c.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      value: k.name,
                      onChange: (oe) => ve({
                        type: "UPDATE_FACTION",
                        id: k.id,
                        field: "name",
                        value: oe.target.value
                      }),
                      placeholder: "Faction name"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      value: k.tags,
                      onChange: (oe) => ve({
                        type: "UPDATE_FACTION",
                        id: k.id,
                        field: "tags",
                        value: oe.target.value
                      }),
                      placeholder: "Tags (corp, gang, fixer...)"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "textarea",
                    {
                      value: k.notes,
                      onChange: (oe) => ve({
                        type: "UPDATE_FACTION",
                        id: k.id,
                        field: "notes",
                        value: oe.target.value
                      }),
                      placeholder: "Notes / agenda"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => ve({ type: "REMOVE_FACTION", id: k.id }),
                      children: "Remove"
                    }
                  )
                ] }, k.id)),
                /* @__PURE__ */ c.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: () => ve({ type: "ADD_FACTION" }), children: "Add Faction" }),
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-link", onClick: Fa, children: "Quick-add template" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Locations" }),
              qt.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "backbone-library", children: [
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => V((k) => !k),
                    "aria-expanded": Cn,
                    "aria-controls": "creation-location-library",
                    children: Cn ? "Hide library" : "Browse library"
                  }
                ),
                Cn && /* @__PURE__ */ c.jsxs(
                  "div",
                  {
                    id: "creation-location-library",
                    className: "campaign-manage__preset-panel",
                    role: "region",
                    "aria-label": "Location library",
                    children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "search",
                          placeholder: "Search location library…",
                          value: Qn,
                          onChange: (k) => aa(k.target.value)
                        }
                      ),
                      /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: xi.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : xi.map((k) => /* @__PURE__ */ c.jsxs(
                        "button",
                        {
                          type: "button",
                          className: "campaign-manage__preset-option",
                          onClick: () => {
                            const oe = uc("location");
                            ve({ type: "ADD_LOCATION_WITH_ID", id: oe }), ve({ type: "UPDATE_LOCATION", id: oe, field: "name", value: k.name }), ve({
                              type: "UPDATE_LOCATION",
                              id: oe,
                              field: "descriptor",
                              value: k.descriptor ?? ""
                            }), V(!1);
                          },
                          children: [
                            /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: k.name }),
                            k.descriptor && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: k.descriptor })
                          ]
                        },
                        k.id
                      )) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "backbone-list", children: [
                ee.locations.map((k) => /* @__PURE__ */ c.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      value: k.name,
                      onChange: (oe) => ve({
                        type: "UPDATE_LOCATION",
                        id: k.id,
                        field: "name",
                        value: oe.target.value
                      }),
                      placeholder: "Location name"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "textarea",
                    {
                      value: k.descriptor,
                      onChange: (oe) => ve({
                        type: "UPDATE_LOCATION",
                        id: k.id,
                        field: "descriptor",
                        value: oe.target.value
                      }),
                      placeholder: "Descriptor (security rating, vibe...)"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => ve({ type: "REMOVE_LOCATION", id: k.id }),
                      children: "Remove"
                    }
                  )
                ] }, k.id)),
                /* @__PURE__ */ c.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: () => ve({ type: "ADD_LOCATION" }), children: "Add Location" }),
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-link", onClick: Pa, children: "Quick-add template" })
                ] })
              ] })
            ] })
          ] }) }),
          _t.backbone && /* @__PURE__ */ c.jsx("p", { className: "form-error", role: "alert", children: _t.backbone })
        ] });
      case 3:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "House Rules & Automation" }),
          /* @__PURE__ */ c.jsx("p", { children: "Toggle planned automation modules or make notes about house rules you plan to apply." }),
          /* @__PURE__ */ c.jsx("div", { className: "automation-grid", children: Yj.map((k) => /* @__PURE__ */ c.jsxs("label", { className: "automation-toggle", children: [
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!ee.houseRules[k.key],
                onChange: (oe) => ve({
                  type: "UPDATE_HOUSE_RULE",
                  key: k.key,
                  value: oe.target.checked
                })
              }
            ),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: k.label }),
              /* @__PURE__ */ c.jsx("p", { children: k.description })
            ] })
          ] }, k.key)) }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "house-rule-notes", children: "House Rule Notes" }),
            /* @__PURE__ */ c.jsx(
              "textarea",
              {
                id: "house-rule-notes",
                value: ee.houseRuleNotes,
                onChange: (k) => ve({ type: "UPDATE_FIELD", field: "houseRuleNotes", value: k.target.value }),
                placeholder: "Describe any custom rules, optional modules, or reminders.",
                rows: 4
              }
            )
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Session Seed" }),
          /* @__PURE__ */ c.jsxs("div", { ref: Oe, tabIndex: -1, children: [
            /* @__PURE__ */ c.jsxs("label", { className: "skip-toggle", children: [
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: ee.sessionSeed.skip,
                  onChange: (k) => {
                    ve({
                      type: "UPDATE_SESSION_SEED",
                      field: "skip",
                      value: k.target.checked
                    }), k.target.checked && zn("sessionSeed", 4);
                  }
                }
              ),
              "Skip session setup for now"
            ] }),
            !ee.sessionSeed.skip && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "session-title", children: "Session Title" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "session-title",
                    value: ee.sessionSeed.title,
                    onChange: (k) => {
                      ve({
                        type: "UPDATE_SESSION_SEED",
                        field: "title",
                        value: k.target.value
                      }), zn("sessionSeed", 4);
                    },
                    placeholder: "Session 0: The job offer"
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "session-objectives", children: "Objectives / Notes" }),
                /* @__PURE__ */ c.jsx(
                  "textarea",
                  {
                    id: "session-objectives",
                    value: ee.sessionSeed.objectives,
                    onChange: (k) => ve({
                      type: "UPDATE_SESSION_SEED",
                      field: "objectives",
                      value: k.target.value
                    }),
                    placeholder: "List your opening beats, key NPCs, or complications.",
                    rows: 4
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { children: "Scene Template" }),
                /* @__PURE__ */ c.jsx("div", { className: "session-template-options", children: Wj.map((k) => /* @__PURE__ */ c.jsxs("label", { className: "session-template", children: [
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "session-template",
                      value: k.value,
                      checked: ee.sessionSeed.sceneTemplate === k.value,
                      onChange: (oe) => ve({
                        type: "UPDATE_SESSION_SEED",
                        field: "sceneTemplate",
                        value: oe.target.value
                      })
                    }
                  ),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("strong", { children: k.label }),
                    /* @__PURE__ */ c.jsx("p", { children: k.description })
                  ] })
                ] }, k.value)) })
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "session-summary", children: "Session Summary (what happened)" }),
                /* @__PURE__ */ c.jsx(
                  "textarea",
                  {
                    id: "session-summary",
                    value: ee.sessionSeed.summary,
                    onChange: (k) => ve({
                      type: "UPDATE_SESSION_SEED",
                      field: "summary",
                      value: k.target.value
                    }),
                    placeholder: "Quick notes on outcomes once the session wraps.",
                    rows: 3
                  }
                )
              ] })
            ] })
          ] }),
          _t.sessionSeed && !ee.sessionSeed.skip && /* @__PURE__ */ c.jsx("p", { className: "form-error", role: "alert", children: _t.sessionSeed })
        ] });
      case 5:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Review & Launch" }),
          /* @__PURE__ */ c.jsxs("div", { className: "review-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ c.jsx("h5", { children: "Campaign Overview" }),
              /* @__PURE__ */ c.jsxs("ul", { children: [
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Name:" }),
                  " ",
                  ee.name || "—"
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
                  " ",
                  ee.theme || "—"
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Edition:" }),
                  " ",
                  z.toUpperCase()
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Gameplay Level:" }),
                  " ",
                  fe
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Creation Method:" }),
                  " ",
                  W
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Source Books:" }),
                  " ",
                  sn.length > 0 ? sn.join(", ") : ot
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "GM:" }),
                  " ",
                  ((Z = cn.find((k) => k.value === _e)) == null ? void 0 : Z.label) ?? "Unassigned"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ c.jsx("h5", { children: "Roster & World" }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Placeholders:" }),
                " ",
                ee.placeholders.length,
                " ",
                ee.placeholders.length > 0 && `(${ee.placeholders.map((k) => k.name).join(", ")})`
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Factions:" }),
                " ",
                ee.factions.length
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Locations:" }),
                " ",
                ee.locations.length
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ c.jsx("h5", { children: "Automation & Session" }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Automation toggles:" }),
                " ",
                Object.entries(ee.houseRules).filter(([, k]) => k).map(([k]) => k.replace(/_/g, " ")).join(", ") || "None"
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "House rule notes:" }),
                " ",
                ee.houseRuleNotes || "—"
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Session seed:" }),
                " ",
                ee.sessionSeed.skip ? "Skipped for now" : `${ee.sessionSeed.title} (${ee.sessionSeed.sceneTemplate})`
              ] }),
              !ee.sessionSeed.skip && ee.sessionSeed.objectives && /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Objectives:" }),
                " ",
                ee.sessionSeed.objectives
              ] })
            ] })
          ] })
        ] });
      default:
        return null;
    }
  }, Nt = D === 0, Tt = D === nt - 1;
  return U ? El.createPortal(
    /* @__PURE__ */ c.jsx(
      "section",
      {
        className: `campaign-create-react ${at ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: at ? /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard__header", children: [
            /* @__PURE__ */ c.jsx("h3", { children: "Create Campaign" }),
            /* @__PURE__ */ c.jsx("nav", { className: "campaign-wizard__navigation", "aria-label": "Campaign creation steps", children: Tx.map((Z, k) => {
              var zt;
              const oe = D === k, et = D > k, vt = !!((zt = Rn[k]) != null && zt.length);
              return /* @__PURE__ */ c.jsxs(
                "button",
                {
                  type: "button",
                  className: `campaign-wizard__step ${oe ? "campaign-wizard__step--active" : ""} ${et ? "campaign-wizard__step--completed" : ""} ${vt ? "campaign-wizard__step--error" : ""}`,
                  onClick: () => {
                    var Qt;
                    En({}), P(k), (Qt = Rn[k]) != null && Qt.length ? ia(k) : je(null);
                  },
                  children: [
                    /* @__PURE__ */ c.jsx("span", { className: "campaign-wizard__step-index", children: k + 1 }),
                    /* @__PURE__ */ c.jsx("span", { children: Z }),
                    vt && /* @__PURE__ */ c.jsx("span", { className: "campaign-wizard__step-error-indicator", "aria-hidden": "true", children: "!" })
                  ]
                },
                Z
              );
            }) })
          ] }),
          /* @__PURE__ */ c.jsxs("form", { className: "campaign-wizard__form campaign-form", onSubmit: me, noValidate: !0, children: [
            We(),
            (((At = Rn[D]) == null ? void 0 : At.length) || Ve) && /* @__PURE__ */ c.jsx("div", { className: "form-error form-error--banner", role: "alert", "aria-live": "assertive", children: /* @__PURE__ */ c.jsx("ul", { className: "form-error__list", children: (Rn[D] ?? (Ve ? [Ve] : [])).map((Z, k) => /* @__PURE__ */ c.jsx("li", { children: Z }, `step-${D}-error-${k}`)) }) }),
            /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard__actions", children: [
              /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: Ci, disabled: Ne, children: "Cancel" }),
              /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard__actions-right", children: [
                !Nt && /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: T, disabled: Ne, children: "Back" }),
                Tt ? /* @__PURE__ */ c.jsx("button", { type: "submit", className: "btn-primary", disabled: Ne, children: Ne ? "Creating…" : "Create Campaign" }) : /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-primary", onClick: Er, disabled: Ne, children: "Next" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ c.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ c.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ c.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-primary", onClick: Ei, children: "Create Campaign" })
        ] })
      }
    ),
    U
  ) : null;
}
const Aw = N.forwardRef(
  ({ className: x, variant: S = "default", type: b = "text", ...X }, J) => {
    const R = ["form-input"];
    return S === "search" && R.push("form-input--search"), x && R.push(x), /* @__PURE__ */ c.jsx("input", { ref: J, type: b, className: R.join(" "), ...X });
  }
);
Aw.displayName = "TextInput";
function Kj(x, S, b) {
  const X = b === "asc" ? 1 : -1, J = (K) => K instanceof Date ? K.getTime() : typeof K == "number" ? K : typeof K == "boolean" ? K ? 1 : 0 : K == null ? "" : String(K).toLowerCase(), R = J(x), g = J(S);
  return R < g ? -1 * X : R > g ? 1 * X : 0;
}
function qj({
  columns: x,
  data: S,
  getRowId: b,
  loading: X = !1,
  emptyState: J,
  enableSearch: R = !0,
  searchPlaceholder: g = "Search…",
  initialSortKey: K,
  initialSortDirection: O = "asc",
  rowClassName: U
}) {
  var xe, fe;
  const be = N.useMemo(
    () => x.filter((pe) => pe.sortable),
    [x]
  ), z = K ?? ((xe = be[0]) == null ? void 0 : xe.key) ?? ((fe = x[0]) == null ? void 0 : fe.key) ?? "", [Y, ae] = N.useState(z), [se, re] = N.useState(O), [Se, He] = N.useState(""), ue = N.useMemo(() => {
    const pe = x.filter((Te) => Te.searchable !== !1), W = S.filter((Te) => !R || !Se.trim() ? !0 : pe.some((Le) => {
      const Ke = Le.accessor, te = Ke ? Ke(Te) : Te[Le.key];
      return te == null ? !1 : String(te).toLowerCase().includes(Se.toLowerCase());
    }));
    if (!Y)
      return W;
    const we = x.find((Te) => Te.key === Y);
    if (!we)
      return W;
    const de = we.accessor;
    return [...W].sort((Te, Le) => {
      const Ke = de ? de(Te) : Te[Y], te = de ? de(Le) : Le[Y];
      return Kj(Ke, te, se);
    });
  }, [x, S, R, Se, se, Y]);
  function _e(pe) {
    Y === pe ? re((W) => W === "asc" ? "desc" : "asc") : (ae(pe), re("asc"));
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "data-table-wrapper", children: [
    R && x.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ c.jsx(
      Aw,
      {
        variant: "search",
        type: "search",
        placeholder: g,
        value: Se,
        onChange: (pe) => He(pe.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ c.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsx("tr", { children: x.map((pe) => {
        const W = pe.sortable !== !1, we = pe.key === Y;
        return /* @__PURE__ */ c.jsxs(
          "th",
          {
            style: { width: pe.width },
            className: [
              pe.align ? `align-${pe.align}` : "",
              W ? "sortable" : "",
              we ? `sorted-${se}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              W && _e(pe.key);
            },
            children: [
              /* @__PURE__ */ c.jsx("span", { children: pe.header }),
              W && /* @__PURE__ */ c.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: we ? se === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          pe.key
        );
      }) }) }),
      /* @__PURE__ */ c.jsx("tbody", { children: X ? /* @__PURE__ */ c.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ c.jsx("td", { colSpan: x.length, children: "Loading…" }) }) : ue.length === 0 ? /* @__PURE__ */ c.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ c.jsx("td", { colSpan: x.length, children: J || "No records found." }) }) : ue.map((pe, W) => /* @__PURE__ */ c.jsx("tr", { className: U == null ? void 0 : U(pe), children: x.map((we) => /* @__PURE__ */ c.jsx("td", { className: we.align ? `align-${we.align}` : void 0, children: we.render ? we.render(pe) : pe[we.key] }, we.key)) }, b(pe, W))) })
    ] }) })
  ] });
}
function Xj(x) {
  if (!x)
    return "—";
  const S = Date.parse(x);
  return Number.isNaN(S) ? x : new Date(S).toLocaleDateString();
}
function Jj({
  campaigns: x,
  loading: S,
  error: b,
  onEdit: X,
  onDelete: J,
  currentUser: R,
  actionInFlightId: g
}) {
  const K = N.useMemo(
    () => [
      {
        key: "name",
        header: "Campaign",
        sortable: !0,
        accessor: (O) => O.name
      },
      {
        key: "edition",
        header: "Edition",
        sortable: !0,
        accessor: (O) => O.edition.toUpperCase()
      },
      {
        key: "gameplay_level",
        header: "Gameplay Level",
        sortable: !0,
        accessor: (O) => O.gameplay_level ?? "",
        render: (O) => {
          var U;
          return ((U = O.gameplay_level) == null ? void 0 : U.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "creation_method",
        header: "Creation Method",
        sortable: !0,
        accessor: (O) => O.creation_method,
        render: (O) => {
          var U;
          return ((U = O.creation_method) == null ? void 0 : U.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "gm_name",
        header: "Gamemaster",
        sortable: !0,
        accessor: (O) => O.gm_name ?? "",
        render: (O) => O.gm_name ?? "—"
      },
      {
        key: "status",
        header: "Status",
        sortable: !0,
        accessor: (O) => O.status ?? "",
        render: (O) => /* @__PURE__ */ c.jsx("span", { className: `status-badge status-${(O.status ?? "unknown").toLowerCase()}`, children: O.status ?? "—" })
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: !0,
        accessor: (O) => O.updated_at ? new Date(O.updated_at) : null,
        render: (O) => Xj(O.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (O) => {
          var ae, se, re;
          const U = O.can_edit || O.can_delete || (R == null ? void 0 : R.isAdministrator) || O.gm_user_id && ((ae = R == null ? void 0 : R.user) == null ? void 0 : ae.id) === O.gm_user_id, be = g === O.id, z = (O.can_edit ?? !1) || (R == null ? void 0 : R.isAdministrator) || O.gm_user_id && ((se = R == null ? void 0 : R.user) == null ? void 0 : se.id) === O.gm_user_id, Y = (O.can_delete ?? !1) || (R == null ? void 0 : R.isAdministrator) || O.gm_user_id && ((re = R == null ? void 0 : R.user) == null ? void 0 : re.id) === O.gm_user_id;
          return /* @__PURE__ */ c.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => X(O),
                disabled: be || !U || !z,
                children: "Edit"
              }
            ),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "button button--table button--danger",
                onClick: () => J(O),
                disabled: be || !U || !Y,
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [g, R, J, X]
  );
  return /* @__PURE__ */ c.jsxs("div", { className: "campaign-table", children: [
    b && /* @__PURE__ */ c.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: b }),
    /* @__PURE__ */ c.jsx(
      qj,
      {
        columns: K,
        data: x,
        loading: S,
        getRowId: (O) => O.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const Zj = ["Active", "Paused", "Completed"], Ox = [
  "initiative_automation",
  "recoil_tracking",
  "matrix_trace"
];
function ny(x) {
  return x ? x.replace(/[_-]+/g, " ").split(" ").filter(Boolean).map((S) => S.charAt(0).toUpperCase() + S.slice(1)).join(" ") : "";
}
function _w(x) {
  if (!x) return null;
  const S = new Date(x);
  return Number.isNaN(S.getTime()) ? null : new Intl.DateTimeFormat(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(S);
}
function qf(x) {
  return `${x}-${Math.random().toString(36).slice(2, 10)}`;
}
function Rx(x, S) {
  return x.map((b) => ({
    id: b.id ?? qf(S),
    ...b
  }));
}
function Tw(x) {
  if (!x)
    return {
      valid: !0,
      value: {
        automation: Object.fromEntries(Ox.map((S) => [S, !1])),
        notes: "",
        theme: "",
        factions: [],
        locations: [],
        placeholders: [],
        sessionSeed: { title: "", objectives: "", sceneTemplate: "", summary: "", skip: !1 }
      }
    };
  try {
    const S = JSON.parse(x), b = new Set(Ox);
    S.automation && typeof S.automation == "object" && Object.keys(S.automation).forEach((U) => b.add(U));
    const X = {};
    b.forEach((U) => {
      X[U] = typeof S.automation == "object" && S.automation !== null ? !!S.automation[U] : !1;
    });
    const J = Array.isArray(S.factions) ? Rx(
      S.factions.map((U) => ({
        id: typeof U.id == "string" ? U.id : void 0,
        name: typeof U.name == "string" ? U.name : "",
        tags: typeof U.tags == "string" ? U.tags : "",
        notes: typeof U.notes == "string" ? U.notes : ""
      })),
      "faction"
    ) : [], R = Array.isArray(S.locations) ? Rx(
      S.locations.map((U) => ({
        id: typeof U.id == "string" ? U.id : void 0,
        name: typeof U.name == "string" ? U.name : "",
        descriptor: typeof U.descriptor == "string" ? U.descriptor : ""
      })),
      "location"
    ) : [], g = Array.isArray(S.placeholders) ? Rx(
      S.placeholders.map((U) => ({
        id: typeof U.id == "string" ? U.id : void 0,
        name: typeof U.name == "string" ? U.name : "",
        role: typeof U.role == "string" ? U.role : ""
      })),
      "placeholder"
    ) : [], K = S.session_seed, O = {
      title: typeof (K == null ? void 0 : K.title) == "string" ? K.title : "",
      objectives: typeof (K == null ? void 0 : K.objectives) == "string" ? K.objectives : "",
      sceneTemplate: typeof (K == null ? void 0 : K.sceneTemplate) == "string" ? K.sceneTemplate : "",
      summary: typeof (K == null ? void 0 : K.summary) == "string" ? K.summary : "",
      skip: !!(K != null && K.skip)
    };
    return {
      valid: !0,
      value: {
        automation: X,
        notes: typeof S.notes == "string" ? S.notes : "",
        theme: typeof S.theme == "string" ? S.theme : "",
        factions: J,
        locations: R,
        placeholders: g,
        sessionSeed: O
      }
    };
  } catch {
    return { valid: !1, raw: x };
  }
}
function eN(x) {
  const S = {};
  S.automation = x.automation, x.theme.trim() && (S.theme = x.theme.trim()), x.notes.trim() && (S.notes = x.notes.trim());
  const b = x.factions.map((R) => {
    var g, K;
    return {
      ...R,
      name: R.name.trim(),
      tags: ((g = R.tags) == null ? void 0 : g.trim()) || void 0,
      notes: ((K = R.notes) == null ? void 0 : K.trim()) || void 0
    };
  }).filter((R) => R.name.length > 0);
  b.length > 0 && (S.factions = b);
  const X = x.locations.map((R) => {
    var g;
    return {
      ...R,
      name: R.name.trim(),
      descriptor: ((g = R.descriptor) == null ? void 0 : g.trim()) || void 0
    };
  }).filter((R) => R.name.length > 0);
  X.length > 0 && (S.locations = X);
  const J = x.placeholders.map((R) => ({
    ...R,
    name: R.name.trim(),
    role: R.role.trim()
  })).filter((R) => R.name.length > 0);
  return J.length > 0 && (S.placeholders = J), x.sessionSeed.skip ? S.session_seed = { skip: !0 } : (x.sessionSeed.title.trim() || x.sessionSeed.objectives.trim() || x.sessionSeed.sceneTemplate.trim() || x.sessionSeed.summary.trim()) && (S.session_seed = {
    title: x.sessionSeed.title.trim() || void 0,
    objectives: x.sessionSeed.objectives.trim() || void 0,
    sceneTemplate: x.sessionSeed.sceneTemplate.trim() || void 0,
    summary: x.sessionSeed.summary.trim() || void 0,
    skip: !1
  }), JSON.stringify(S, null, 2);
}
function tN({ campaign: x, gmUsers: S, gameplayRules: b, onClose: X, onSave: J }) {
  var Cn;
  const {
    loadCampaignCharacterCreation: R,
    campaignCharacterCreation: g,
    characterCreationData: K
  } = Xf(), [O, U] = N.useState(x.name), [be, z] = N.useState(x.gm_user_id ?? ""), [Y, ae] = N.useState(x.status ?? "Active"), [se, re] = N.useState(!1), [Se, He] = N.useState(null), ue = N.useMemo(() => Tw(x.house_rules), [x.house_rules]), [_e, xe] = N.useState(ue.valid ? "" : ue.raw), [fe, pe] = N.useState(ue.valid ? ue.value.theme : ""), [W, we] = N.useState(ue.valid ? ue.value.notes : ""), [de, Te] = N.useState(
    ue.valid ? ue.value.automation : {}
  ), [Le, Ke] = N.useState(ue.valid ? ue.value.factions : []), [te, Ae] = N.useState(ue.valid ? ue.value.locations : []), [at, ct] = N.useState(
    ue.valid ? ue.value.placeholders : []
  ), [Ne, ye] = N.useState(
    ue.valid ? ue.value.sessionSeed : { title: "", objectives: "", sceneTemplate: "", summary: "", skip: !1 }
  ), [Ve, je] = N.useState(""), [D, P] = N.useState(""), [ee, ve] = N.useState(!1), [wt, kt] = N.useState(!1);
  N.useEffect(() => {
    U(x.name), z(x.gm_user_id ?? ""), ae(x.status ?? "Active");
    const V = Tw(x.house_rules);
    if (!V.valid) {
      xe(V.raw), pe(""), we(""), Te({}), Ke([]), Ae([]), ct([]), ye({ title: "", objectives: "", sceneTemplate: "", summary: "", skip: !1 });
      return;
    }
    xe(""), pe(V.value.theme), we(V.value.notes), Te(V.value.automation), Ke(V.value.factions), Ae(V.value.locations), ct(V.value.placeholders), ye(V.value.sessionSeed);
  }, [x]), N.useEffect(() => {
    R(x.id);
  }, [x.id, R]);
  const St = N.useMemo(() => S.length === 0 ? [{ label: "No gamemasters found", value: "" }] : S.map((V) => ({
    label: `${V.username} (${V.email})`,
    value: V.id
  })), [S]), yt = se || O.trim().length === 0 || S.length > 0 && !be, xt = !ue.valid;
  async function Bt(V) {
    if (V.preventDefault(), !yt) {
      re(!0), He(null);
      try {
        const Ye = S.find((Ct) => Ct.id === be), Et = xt ? _e.trim() : eN({
          automation: de,
          notes: W,
          theme: fe,
          factions: Le,
          locations: te,
          placeholders: at,
          sessionSeed: Ne
        });
        await J({
          name: O.trim(),
          gm_user_id: be || void 0,
          gm_name: (Ye == null ? void 0 : Ye.username) ?? (Ye == null ? void 0 : Ye.email) ?? "",
          status: Y,
          house_rules: Et
        }), await R(x.id), X();
      } catch (Ye) {
        const Et = Ye instanceof Error ? Ye.message : "Failed to update campaign.";
        He(Et);
      } finally {
        re(!1);
      }
    }
  }
  const _n = ((Cn = x.edition) == null ? void 0 : Cn.toUpperCase()) ?? "SR5", Wn = ny(x.creation_method), yn = (b == null ? void 0 : b.label) ?? ny(x.gameplay_level ?? "Experienced"), gn = Object.entries(de), Tn = Le.length > 0 || te.length > 0, _t = N.useMemo(
    () => (g == null ? void 0 : g.campaign_support) ?? (K == null ? void 0 : K.campaign_support),
    [g == null ? void 0 : g.campaign_support, K == null ? void 0 : K.campaign_support]
  ), En = N.useMemo(() => {
    const V = /* @__PURE__ */ new Set([...Ox]);
    return gn.forEach(([Ye]) => V.add(Ye)), Array.from(V);
  }, [gn]), Rn = (_t == null ? void 0 : _t.factions) ?? [], $n = (_t == null ? void 0 : _t.locations) ?? [], kn = N.useMemo(() => {
    if (!Ve.trim())
      return Rn;
    const V = Ve.toLowerCase();
    return Rn.filter((Ye) => Ye.name.toLowerCase().includes(V) || (Ye.tags ?? "").toLowerCase().includes(V) || (Ye.notes ?? "").toLowerCase().includes(V));
  }, [Ve, Rn]), Sn = N.useMemo(() => {
    if (!D.trim())
      return $n;
    const V = D.toLowerCase();
    return $n.filter((Ye) => Ye.name.toLowerCase().includes(V) || (Ye.descriptor ?? "").toLowerCase().includes(V));
  }, [D, $n]);
  return /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage", children: [
    /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ c.jsxs(
      "section",
      {
        className: "campaign-manage__panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "campaign-manage-heading",
        children: [
          /* @__PURE__ */ c.jsxs("header", { className: "campaign-manage__header", children: [
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h3", { id: "campaign-manage-heading", children: x.name }),
              /* @__PURE__ */ c.jsxs("p", { className: "campaign-manage__subtitle", children: [
                _n,
                " · ",
                Wn,
                " · ",
                yn
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__header-actions", children: [
              /* @__PURE__ */ c.jsx("span", { className: `pill pill--status-${Y.toLowerCase()}`, children: Y }),
              /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: X, children: "Close" })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__body", children: [
            /* @__PURE__ */ c.jsxs("form", { className: "campaign-manage__form campaign-form", onSubmit: Bt, children: [
              /* @__PURE__ */ c.jsxs("section", { children: [
                /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Basics" }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ c.jsx("label", { htmlFor: "edit-campaign-name", children: "Campaign Name" }),
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      id: "edit-campaign-name",
                      name: "campaign-name",
                      value: O,
                      onChange: (V) => U(V.target.value),
                      required: !0
                    }
                  )
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ c.jsx("label", { htmlFor: "edit-campaign-gm", children: "Gamemaster" }),
                  /* @__PURE__ */ c.jsx(
                    "select",
                    {
                      id: "edit-campaign-gm",
                      name: "campaign-gm",
                      value: be,
                      onChange: (V) => z(V.target.value),
                      children: St.map((V) => /* @__PURE__ */ c.jsx("option", { value: V.value, children: V.label }, V.value))
                    }
                  )
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ c.jsx("label", { htmlFor: "edit-campaign-status", children: "Status" }),
                  /* @__PURE__ */ c.jsx(
                    "select",
                    {
                      id: "edit-campaign-status",
                      name: "campaign-status",
                      value: Y,
                      onChange: (V) => ae(V.target.value),
                      children: Zj.map((V) => /* @__PURE__ */ c.jsx("option", { value: V, children: V }, V))
                    }
                  )
                ] })
              ] }),
              xt ? /* @__PURE__ */ c.jsxs("section", { children: [
                /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "House Rules JSON" }),
                /* @__PURE__ */ c.jsx(
                  "textarea",
                  {
                    id: "edit-campaign-house-rules",
                    name: "campaign-house-rules",
                    rows: 10,
                    value: _e,
                    onChange: (V) => xe(V.target.value),
                    placeholder: "Paste house rule JSON configuration..."
                  }
                ),
                /* @__PURE__ */ c.jsx("small", { children: "We could not parse the existing house rules into structured sections. Update the JSON directly and save to keep your changes." })
              ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Table Guidance" }),
                  /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                    /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-theme", children: "Theme / Tagline" }),
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        id: "campaign-theme",
                        name: "campaign-theme",
                        value: fe,
                        onChange: (V) => pe(V.target.value),
                        placeholder: "Neo-Tokyo corporate intrigue, deep-space survival, etc."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                    /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-notes", children: "GM Notes" }),
                    /* @__PURE__ */ c.jsx(
                      "textarea",
                      {
                        id: "campaign-notes",
                        name: "campaign-notes",
                        rows: 4,
                        value: W,
                        onChange: (V) => we(V.target.value),
                        placeholder: "Session pacing tweaks, houseruled limits, table reminders..."
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Automation Toggles" }),
                  /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__toggle-grid", children: En.map((V) => /* @__PURE__ */ c.jsxs("label", { className: "campaign-manage__toggle", children: [
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: !!de[V],
                        onChange: (Ye) => Te((Et) => ({
                          ...Et,
                          [V]: Ye.target.checked
                        }))
                      }
                    ),
                    /* @__PURE__ */ c.jsx("span", { children: ny(V) })
                  ] }, V)) }),
                  /* @__PURE__ */ c.jsx("small", { className: "campaign-manage__hint", children: "These options mirror the automation helpers available in the wizard." })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__section-heading", children: [
                    /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Factions" }),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => Ke((V) => [
                          ...V,
                          { id: qf("faction"), name: "", tags: "", notes: "" }
                        ]),
                        children: "Add Faction"
                      }
                    )
                  ] }),
                  Rn.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__preset", children: [
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => ve((V) => !V),
                        "aria-expanded": ee,
                        "aria-controls": "campaign-faction-library-panel",
                        children: ee ? "Hide library" : "Browse library"
                      }
                    ),
                    ee && /* @__PURE__ */ c.jsxs(
                      "div",
                      {
                        id: "campaign-faction-library-panel",
                        className: "campaign-manage__preset-panel",
                        role: "region",
                        "aria-label": "Faction library",
                        children: [
                          /* @__PURE__ */ c.jsx(
                            "input",
                            {
                              id: "campaign-faction-filter",
                              type: "search",
                              placeholder: "Search faction library…",
                              value: Ve,
                              onChange: (V) => {
                                je(V.target.value);
                              }
                            }
                          ),
                          /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: kn.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : kn.map((V) => /* @__PURE__ */ c.jsxs(
                            "button",
                            {
                              type: "button",
                              className: "campaign-manage__preset-option",
                              onClick: () => {
                                Ke((Ye) => [
                                  ...Ye,
                                  {
                                    id: qf("faction"),
                                    name: V.name,
                                    tags: V.tags ?? "",
                                    notes: V.notes ?? ""
                                  }
                                ]), ve(!1);
                              },
                              children: [
                                /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: V.name }),
                                V.tags && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: V.tags })
                              ]
                            },
                            V.id
                          )) })
                        ]
                      }
                    )
                  ] }),
                  Le.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No factions captured yet." }) : /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__collection", children: Le.map((V) => /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-card", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-header", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Faction" }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn-secondary",
                          onClick: () => Ke((Ye) => Ye.filter((Et) => Et.id !== V.id)),
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Name" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.name,
                          onChange: (Ye) => Ke(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, name: Ye.target.value } : Ct
                            )
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Tags" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.tags ?? "",
                          onChange: (Ye) => Ke(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, tags: Ye.target.value } : Ct
                            )
                          ),
                          placeholder: "Megacorp, Syndicate, Magical society..."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Notes" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: V.notes ?? "",
                          onChange: (Ye) => Ke(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, notes: Ye.target.value } : Ct
                            )
                          )
                        }
                      )
                    ] })
                  ] }, V.id)) })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__section-heading", children: [
                    /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Locations" }),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => Ae((V) => [
                          ...V,
                          { id: qf("location"), name: "", descriptor: "" }
                        ]),
                        children: "Add Location"
                      }
                    )
                  ] }),
                  $n.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__preset", children: [
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => kt((V) => !V),
                        "aria-expanded": wt,
                        "aria-controls": "campaign-location-library-panel",
                        children: wt ? "Hide library" : "Browse library"
                      }
                    ),
                    wt && /* @__PURE__ */ c.jsxs(
                      "div",
                      {
                        id: "campaign-location-library-panel",
                        className: "campaign-manage__preset-panel",
                        role: "region",
                        "aria-label": "Location library",
                        children: [
                          /* @__PURE__ */ c.jsx(
                            "input",
                            {
                              id: "campaign-location-filter",
                              type: "search",
                              placeholder: "Search location library…",
                              value: D,
                              onChange: (V) => {
                                P(V.target.value);
                              }
                            }
                          ),
                          /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: Sn.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : Sn.map((V) => /* @__PURE__ */ c.jsxs(
                            "button",
                            {
                              type: "button",
                              className: "campaign-manage__preset-option",
                              onClick: () => {
                                Ae((Ye) => [
                                  ...Ye,
                                  {
                                    id: qf("location"),
                                    name: V.name,
                                    descriptor: V.descriptor ?? ""
                                  }
                                ]), kt(!1);
                              },
                              children: [
                                /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: V.name }),
                                V.descriptor && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: V.descriptor })
                              ]
                            },
                            V.id
                          )) })
                        ]
                      }
                    )
                  ] }),
                  te.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No safehouses or key locations yet." }) : /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__collection", children: te.map((V) => /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-card", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-header", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Location" }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn-secondary",
                          onClick: () => Ae(
                            (Ye) => Ye.filter((Et) => Et.id !== V.id)
                          ),
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Name" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.name,
                          onChange: (Ye) => Ae(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, name: Ye.target.value } : Ct
                            )
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Descriptor" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: V.descriptor ?? "",
                          onChange: (Ye) => Ae(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, descriptor: Ye.target.value } : Ct
                            )
                          ),
                          placeholder: "Security rating, vibes, hooks..."
                        }
                      )
                    ] })
                  ] }, V.id)) })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__section-heading", children: [
                    /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Placeholder Runners" }),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => ct((V) => [
                          ...V,
                          { id: qf("placeholder"), name: "", role: "" }
                        ]),
                        children: "Add Placeholder"
                      }
                    )
                  ] }),
                  at.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No placeholders yet." }) : /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__collection", children: at.map((V) => /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-card", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-header", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Runner" }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn-secondary",
                          onClick: () => ct(
                            (Ye) => Ye.filter((Et) => Et.id !== V.id)
                          ),
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Handle" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.name,
                          onChange: (Ye) => ct(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, name: Ye.target.value } : Ct
                            )
                          ),
                          placeholder: "Maverick, Cipher..."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Role" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.role,
                          onChange: (Ye) => ct(
                            (Et) => Et.map(
                              (Ct) => Ct.id === V.id ? { ...Ct, role: Ye.target.value } : Ct
                            )
                          ),
                          placeholder: "Face, Rigger, Adept..."
                        }
                      )
                    ] })
                  ] }, V.id)) })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Session Seed" }),
                  /* @__PURE__ */ c.jsxs("label", { className: "campaign-manage__checkbox", children: [
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: Ne.skip,
                        onChange: (V) => ye((Ye) => ({ ...Ye, skip: V.target.checked }))
                      }
                    ),
                    /* @__PURE__ */ c.jsx("span", { children: "Skip planning for now" })
                  ] }),
                  !Ne.skip && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__session-grid", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Title" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: Ne.title,
                          onChange: (V) => ye((Ye) => ({ ...Ye, title: V.target.value })),
                          placeholder: "Session 0, The Run, etc."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Scene Template" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: Ne.sceneTemplate,
                          onChange: (V) => ye((Ye) => ({
                            ...Ye,
                            sceneTemplate: V.target.value
                          })),
                          placeholder: "social_meetup, extraction, heist..."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Objectives" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: Ne.objectives,
                          onChange: (V) => ye((Ye) => ({
                            ...Ye,
                            objectives: V.target.value
                          }))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Summary" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: Ne.summary,
                          onChange: (V) => ye((Ye) => ({ ...Ye, summary: V.target.value }))
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }),
              Se && /* @__PURE__ */ c.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: Se }),
              /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__actions", children: [
                /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: X, children: "Cancel" }),
                /* @__PURE__ */ c.jsx("button", { type: "submit", className: "btn-primary", disabled: yt, children: se ? "Saving…" : "Save Changes" })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("aside", { className: "campaign-manage__aside", children: [
              /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "Roster" }),
                at.length > 0 ? /* @__PURE__ */ c.jsx("ul", { className: "campaign-manage__list", children: at.map((V) => /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: V.name || "Unnamed runner" }),
                  V.role && /* @__PURE__ */ c.jsxs("span", { children: [
                    " — ",
                    V.role
                  ] })
                ] }, V.id)) }) : /* @__PURE__ */ c.jsx("p", { children: "No placeholder runners captured." })
              ] }),
              /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "Campaign Overview" }),
                /* @__PURE__ */ c.jsxs("dl", { children: [
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Edition" }),
                    /* @__PURE__ */ c.jsx("dd", { children: _n })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Creation Method" }),
                    /* @__PURE__ */ c.jsx("dd", { children: Wn })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Gameplay Level" }),
                    /* @__PURE__ */ c.jsx("dd", { children: yn })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Status" }),
                    /* @__PURE__ */ c.jsx("dd", { children: Y })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Created" }),
                    /* @__PURE__ */ c.jsx("dd", { children: _w(x.created_at) ?? "Unknown" })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Last Updated" }),
                    /* @__PURE__ */ c.jsx("dd", { children: _w(x.updated_at) ?? "Unknown" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "Source Books" }),
                x.enabled_books.length > 0 ? /* @__PURE__ */ c.jsx("ul", { className: "campaign-manage__list", children: x.enabled_books.map((V) => /* @__PURE__ */ c.jsx("li", { children: /* @__PURE__ */ c.jsx("span", { className: "pill pill--muted", children: V }) }, V)) }) : /* @__PURE__ */ c.jsx("p", { children: "No additional source books enabled." }),
                /* @__PURE__ */ c.jsx("small", { className: "campaign-manage__hint", children: "Book availability is locked after creation for fairness." })
              ] }),
              !xt && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                  /* @__PURE__ */ c.jsx("h4", { children: "House Rule Snapshot" }),
                  fe.trim() && /* @__PURE__ */ c.jsxs("p", { children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
                    " ",
                    fe
                  ] }),
                  gn.some(([, V]) => V) ? /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "Automation:" }),
                    /* @__PURE__ */ c.jsx("ul", { className: "campaign-manage__list", children: gn.filter(([, V]) => V).map(([V]) => /* @__PURE__ */ c.jsx("li", { children: ny(V) }, V)) })
                  ] }) : /* @__PURE__ */ c.jsx("p", { children: "No automation modules toggled." }),
                  W.trim() && /* @__PURE__ */ c.jsxs("p", { className: "campaign-manage__notes", children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "Notes:" }),
                    " ",
                    W
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                  /* @__PURE__ */ c.jsx("h4", { children: "World Backbone" }),
                  Tn ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                    Le.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__sublist", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Factions" }),
                      /* @__PURE__ */ c.jsx("ul", { children: Le.map((V) => /* @__PURE__ */ c.jsxs("li", { children: [
                        /* @__PURE__ */ c.jsx("span", { children: V.name || "Unnamed faction" }),
                        V.tags && /* @__PURE__ */ c.jsxs("small", { children: [
                          " · ",
                          V.tags
                        ] }),
                        V.notes && /* @__PURE__ */ c.jsx("p", { children: V.notes })
                      ] }, V.id)) })
                    ] }),
                    te.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__sublist", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Locations" }),
                      /* @__PURE__ */ c.jsx("ul", { children: te.map((V) => /* @__PURE__ */ c.jsxs("li", { children: [
                        /* @__PURE__ */ c.jsx("span", { children: V.name || "Unnamed location" }),
                        V.descriptor && /* @__PURE__ */ c.jsx("p", { children: V.descriptor })
                      ] }, V.id)) })
                    ] })
                  ] }) : /* @__PURE__ */ c.jsx("p", { children: "No factions or locations captured yet." })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                  /* @__PURE__ */ c.jsx("h4", { children: "Session Seed" }),
                  Ne.skip ? /* @__PURE__ */ c.jsx("p", { children: "Session planning skipped for now." }) : /* @__PURE__ */ c.jsxs("ul", { className: "campaign-manage__list", children: [
                    /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Title:" }),
                      " ",
                      Ne.title || "Session 0"
                    ] }),
                    Ne.sceneTemplate && /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Template:" }),
                      " ",
                      Ne.sceneTemplate
                    ] }),
                    Ne.objectives && /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Objectives:" }),
                      " ",
                      Ne.objectives
                    ] }),
                    Ne.summary && /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Summary:" }),
                      " ",
                      Ne.summary
                    ] })
                  ] })
                ] })
              ] }),
              xt && /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "House Rule Snapshot" }),
                /* @__PURE__ */ c.jsx("p", { children: "House rules are stored as custom JSON. Edit the raw payload above to make changes." })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}
const nN = "campaigns-list";
async function ry(x, S = {}) {
  const b = new Headers(S.headers || {});
  S.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const X = await fetch(x, {
    ...S,
    headers: b,
    credentials: "include"
  });
  if (!X.ok) {
    const J = await X.text();
    throw new Error(J || `Request failed (${X.status})`);
  }
  return X.status === 204 ? {} : await X.json();
}
function rN({ targetId: x = nN }) {
  const [S, b] = N.useState(null), [X, J] = N.useState([]), [R, g] = N.useState(!1), [K, O] = N.useState(null), [U, be] = N.useState(null), [z, Y] = N.useState(null), [ae, se] = N.useState(null), [re, Se] = N.useState(null), [He, ue] = N.useState([]), [_e, xe] = N.useState(
    window.ShadowmasterAuth ?? null
  );
  N.useEffect(() => {
    b(document.getElementById(x));
  }, [x]), N.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const fe = N.useCallback(async () => {
    g(!0), O(null);
    try {
      const de = await ry("/api/campaigns");
      J(Array.isArray(de) ? de : []);
    } catch (de) {
      const Te = de instanceof Error ? de.message : "Failed to load campaigns.";
      O(Te), J([]);
    } finally {
      g(!1);
    }
  }, []), pe = N.useCallback(async () => {
    try {
      const de = await ry("/api/users?role=gamemaster,administrator");
      ue(Array.isArray(de) ? de : []);
    } catch (de) {
      console.warn("Failed to load gamemaster roster", de), ue([]);
    }
  }, []);
  N.useEffect(() => {
    fe(), pe();
  }, [fe, pe]), N.useEffect(() => {
    const de = () => {
      fe();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", de), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", de);
    };
  }, [fe]), N.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      fe();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [fe]), N.useEffect(() => {
    const de = (Te) => {
      const Le = Te.detail;
      xe(Le ?? null);
    };
    return window.addEventListener("shadowmaster:auth", de), () => {
      window.removeEventListener("shadowmaster:auth", de);
    };
  }, []), N.useEffect(() => {
    if (!z)
      return;
    const de = window.setTimeout(() => Y(null), 4e3);
    return () => window.clearTimeout(de);
  }, [z]);
  const W = N.useCallback(
    async (de) => {
      if (!(!de.can_delete && !(_e != null && _e.isAdministrator) || !window.confirm(
        `Delete campaign "${de.name}"? This action cannot be undone.`
      ))) {
        be(null), Y(null), se(de.id);
        try {
          await ry(`/api/campaigns/${de.id}`, { method: "DELETE" }), Y(`Campaign "${de.name}" deleted.`), await fe(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (Le) {
          const Ke = Le instanceof Error ? Le.message : "Failed to delete campaign.";
          be(Ke);
        } finally {
          se(null);
        }
      }
    },
    [_e == null ? void 0 : _e.isAdministrator, fe]
  ), we = N.useCallback(
    async (de) => {
      if (re) {
        be(null), Y(null), se(re.id);
        try {
          const Te = JSON.stringify({
            name: de.name,
            gm_name: de.gm_name,
            gm_user_id: de.gm_user_id,
            status: de.status,
            house_rules: de.house_rules,
            enabled_books: de.enabled_books
          }), Le = await ry(`/api/campaigns/${re.id}`, {
            method: "PUT",
            body: Te
          });
          J(
            (Ke) => Ke.map((te) => te.id === Le.id ? Le : te)
          ), Y(`Campaign "${Le.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), Se(null);
        } catch (Te) {
          const Le = Te instanceof Error ? Te.message : "Failed to update campaign.";
          be(Le);
        } finally {
          se(null);
        }
      }
    },
    [re]
  );
  return S ? El.createPortal(
    /* @__PURE__ */ c.jsxs("section", { className: "campaigns-react-shell", children: [
      z && /* @__PURE__ */ c.jsx("p", { className: "campaigns-table__status", children: z }),
      U && /* @__PURE__ */ c.jsx("p", { className: "campaigns-table__error", children: U }),
      /* @__PURE__ */ c.jsx(
        Jj,
        {
          campaigns: X,
          loading: R,
          error: K,
          onEdit: (de) => Se(de),
          onDelete: W,
          currentUser: _e,
          actionInFlightId: ae
        }
      ),
      re && /* @__PURE__ */ c.jsx(
        tN,
        {
          campaign: re,
          gmUsers: He,
          gameplayRules: re.gameplay_rules,
          onClose: () => Se(null),
          onSave: we
        }
      )
    ] }),
    S
  ) : null;
}
const iy = [
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
function aN() {
  const x = window.location.hash.replace("#", "").toLowerCase(), S = iy.find((b) => b.key === x);
  return (S == null ? void 0 : S.key) ?? "characters";
}
function iN(x) {
  N.useEffect(() => {
    iy.forEach(({ key: S, targetId: b }) => {
      const X = document.getElementById(b);
      X && (S === x ? (X.removeAttribute("hidden"), X.classList.add("main-tab-panel--active"), X.style.display = "", X.setAttribute("data-active-tab", S)) : (X.setAttribute("hidden", "true"), X.classList.remove("main-tab-panel--active"), X.style.display = "none", X.removeAttribute("data-active-tab")));
    });
  }, [x]);
}
function lN() {
  const [x, S] = N.useState(null), [b, X] = N.useState(() => aN());
  N.useEffect(() => {
    S(document.getElementById("main-navigation-root"));
  }, []), iN(b), N.useEffect(() => {
    window.history.replaceState(null, "", `#${b}`);
  }, [b]);
  const J = N.useMemo(
    () => {
      var R;
      return ((R = iy.find((g) => g.key === b)) == null ? void 0 : R.description) ?? "";
    },
    [b]
  );
  return x ? El.createPortal(
    /* @__PURE__ */ c.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ c.jsx("div", { className: "main-tabs__list", children: iy.map((R) => {
        const g = R.key === b;
        return /* @__PURE__ */ c.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${R.key}`,
            "aria-selected": g,
            "aria-controls": R.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => X(R.key),
            type: "button",
            children: R.label
          },
          R.key
        );
      }) }),
      /* @__PURE__ */ c.jsx("p", { className: "main-tabs__summary", role: "status", children: J })
    ] }),
    x
  ) : null;
}
const io = ["magic", "metatype", "attributes", "skills", "resources"], sc = ["A", "B", "C", "D", "E"], oN = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function Mw(x) {
  return oN[x];
}
function Uw(x, S) {
  var X;
  const b = (X = x == null ? void 0 : x.priorities) == null ? void 0 : X[S];
  return b ? sc.map((J) => {
    const R = b[J] ?? { label: `Priority ${J}` };
    return { code: J, option: R };
  }) : sc.map((J) => ({
    code: J,
    option: { label: `Priority ${J}` }
  }));
}
function uN() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function zw(x) {
  return io.reduce((S, b) => {
    const X = x[b];
    return X && S.push(X), S;
  }, []);
}
function Rw(x) {
  const S = new Set(zw(x));
  return sc.filter((b) => !S.has(b));
}
function sN(x) {
  return zw(x).length === sc.length;
}
function Fw(x) {
  return x ? x.summary || x.description || x.label || "" : "Drag a priority letter from the pool into this category.";
}
function cN(x) {
  if (!x)
    return "";
  const S = x.toLowerCase().trim().replace(/[\s-]+/g, "_");
  switch (S) {
    case "sumtotten":
    case "sum2ten":
    case "sum_to10":
      return "sum_to_ten";
    case "point_buy":
    case "pointbuy":
      return "karma";
    default:
      return S;
  }
}
function Pw(x) {
  return Object.fromEntries(
    Object.entries(x).map(([S, b]) => [S, b || null])
  );
}
function Hw() {
  var X, J;
  const x = uN();
  if (typeof window > "u")
    return x;
  const S = (J = (X = window.ShadowmasterLegacyApp) == null ? void 0 : X.getPriorities) == null ? void 0 : J.call(X);
  if (!S)
    return x;
  const b = { ...x };
  for (const R of io) {
    const g = S[R];
    typeof g == "string" && g.length === 1 && (b[R] = g);
  }
  return b;
}
function kw() {
  const x = Hw();
  return io.some((b) => x[b]) || (x.magic = "A", x.metatype = "B", x.attributes = "C", x.skills = "D", x.resources = "E"), x;
}
function fN() {
  const {
    characterCreationData: x,
    activeEdition: S,
    isLoading: b,
    error: X,
    campaignGameplayRules: J,
    campaignLoading: R,
    campaignError: g,
    campaignCreationMethod: K
  } = Xf(), O = N.useMemo(
    () => (x == null ? void 0 : x.creation_methods) ?? {},
    [x == null ? void 0 : x.creation_methods]
  ), U = N.useMemo(() => {
    const be = cN(K);
    if (be && O[be])
      return be;
    if (O.priority)
      return "priority";
    const z = Object.keys(O);
    return z.length > 0 ? z[0] : "priority";
  }, [K, O]);
  return U === "sum_to_ten" && O.sum_to_ten ? /* @__PURE__ */ c.jsx(
    vN,
    {
      characterCreationData: x,
      creationMethod: O.sum_to_ten,
      activeEditionLabel: S.label,
      isLoading: b,
      error: X,
      campaignGameplayRules: J,
      campaignLoading: R,
      campaignError: g
    }
  ) : U === "karma" && O.karma ? /* @__PURE__ */ c.jsx(
    mN,
    {
      characterCreationData: x,
      creationMethod: O.karma,
      activeEditionLabel: S.label,
      isLoading: b,
      error: X,
      campaignGameplayRules: J,
      campaignLoading: R,
      campaignError: g
    }
  ) : /* @__PURE__ */ c.jsx(
    dN,
    {
      characterCreationData: x,
      activeEditionLabel: S.label,
      isLoading: b,
      error: X,
      campaignGameplayRules: J,
      campaignLoading: R,
      campaignError: g
    }
  );
}
function dN({
  characterCreationData: x,
  activeEditionLabel: S,
  isLoading: b,
  error: X,
  campaignGameplayRules: J,
  campaignLoading: R,
  campaignError: g
}) {
  const [K, O] = N.useState(() => Hw()), [U, be] = N.useState(null), z = N.useRef({});
  N.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), N.useEffect(() => {
    var W, we;
    (we = (W = window.ShadowmasterLegacyApp) == null ? void 0 : W.setPriorities) == null || we.call(W, Pw(K));
  }, [K]);
  const Y = N.useMemo(() => Rw(K), [K]), ae = sN(K);
  function se(W) {
    O((we) => {
      const de = { ...we };
      for (const Te of io)
        de[Te] === W && (de[Te] = "");
      return de;
    });
  }
  function re(W, we) {
    we.dataTransfer.effectAllowed = "move", be({ source: "pool", priority: W }), we.dataTransfer.setData("text/plain", W);
  }
  function Se(W, we, de) {
    de.dataTransfer.effectAllowed = "move", be({ source: "dropzone", category: W, priority: we }), de.dataTransfer.setData("text/plain", we);
  }
  function He() {
    be(null);
  }
  function ue(W, we) {
    we.preventDefault();
    const de = we.dataTransfer.getData("text/plain") || (U == null ? void 0 : U.priority) || "";
    if (!de) {
      He();
      return;
    }
    O((Te) => {
      const Le = { ...Te };
      for (const Ke of io)
        Le[Ke] === de && (Le[Ke] = "");
      return Le[W] = de, Le;
    }), He();
  }
  function _e(W, we) {
    we.preventDefault();
    const de = z.current[W];
    de && de.classList.add("active");
  }
  function xe(W) {
    const we = z.current[W];
    we && we.classList.remove("active");
  }
  function fe(W) {
    const we = z.current[W];
    we && we.classList.remove("active");
  }
  function pe(W) {
    const we = Y[0];
    if (!we) {
      se(W);
      return;
    }
    O((de) => {
      const Te = { ...de };
      for (const Le of io)
        Te[Le] === W && (Te[Le] = "");
      return Te[we] = W, Te;
    });
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ c.jsx("strong", { children: S })
      ] }),
      /* @__PURE__ */ c.jsx("span", { children: g ? `Campaign defaults unavailable: ${g}` : R ? "Applying campaign defaults…" : b ? "Loading priority data…" : X ? `Error: ${X}` : "Drag letters into categories" })
    ] }),
    J && /* @__PURE__ */ c.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        J.label
      ] }),
      J.description && /* @__PURE__ */ c.jsx("p", { children: J.description })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ c.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ c.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (W) => {
              W.preventDefault(), be((we) => we && { ...we, category: void 0 });
            },
            onDrop: (W) => {
              W.preventDefault();
              const we = W.dataTransfer.getData("text/plain") || (U == null ? void 0 : U.priority) || "";
              we && se(we), He();
            },
            children: /* @__PURE__ */ c.jsx("div", { className: "react-priority-chips", children: sc.map((W) => {
              const we = !Rw(K).includes(W), de = (U == null ? void 0 : U.priority) === W && U.source === "pool";
              return /* @__PURE__ */ c.jsx(
                "div",
                {
                  className: `react-priority-chip ${we ? "used" : ""} ${de ? "dragging" : ""}`,
                  draggable: !we,
                  onDragStart: (Te) => !we && re(W, Te),
                  onDragEnd: He,
                  onClick: () => pe(W),
                  role: "button",
                  tabIndex: we ? -1 : 0,
                  onKeyDown: (Te) => {
                    !we && (Te.key === "Enter" || Te.key === " ") && (Te.preventDefault(), pe(W));
                  },
                  children: W
                },
                W
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ c.jsx("section", { className: "react-priority-dropzones", children: io.map((W) => {
        const we = Mw(W), de = Uw(x, W), Te = K[W], Le = de.find((te) => te.code === Te), Ke = (U == null ? void 0 : U.source) === "dropzone" && U.category === W;
        return /* @__PURE__ */ c.jsxs(
          "div",
          {
            ref: (te) => {
              z.current[W] = te;
            },
            className: `react-priority-dropzone ${Te ? "filled" : ""}`,
            onDragOver: (te) => _e(W, te),
            onDragLeave: () => xe(W),
            onDrop: (te) => {
              ue(W, te), fe(W);
            },
            children: [
              /* @__PURE__ */ c.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ c.jsx("span", { children: we }),
                Te && /* @__PURE__ */ c.jsxs("span", { children: [
                  Te,
                  " — ",
                  (Le == null ? void 0 : Le.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ c.jsx("div", { className: "react-priority-description", children: Fw(Le == null ? void 0 : Le.option) }),
              Te ? /* @__PURE__ */ c.jsx(
                "div",
                {
                  className: `react-priority-chip ${Ke ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (te) => Se(W, Te, te),
                  onDragEnd: He,
                  onDoubleClick: () => se(Te),
                  children: Te
                }
              ) : /* @__PURE__ */ c.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          W
        );
      }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      "div",
      {
        className: `react-priority-status ${ae ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: ae ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${Y.join(", ")}`
      }
    )
  ] });
}
const pN = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0
};
function vN({
  characterCreationData: x,
  creationMethod: S,
  activeEditionLabel: b,
  isLoading: X,
  error: J,
  campaignGameplayRules: R,
  campaignLoading: g,
  campaignError: K
}) {
  const [O, U] = N.useState(() => kw());
  N.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), N.useEffect(() => {
    var xe, fe;
    (fe = (xe = window.ShadowmasterLegacyApp) == null ? void 0 : xe.setPriorities) == null || fe.call(xe, Pw(O));
  }, [O]);
  const be = N.useMemo(() => {
    const xe = { ...pN };
    return sc.forEach((fe) => {
      var W;
      const pe = (W = S.priority_costs) == null ? void 0 : W[fe];
      typeof pe == "number" && (xe[fe] = pe);
    }), xe;
  }, [S.priority_costs]), z = S.point_budget ?? 10, Y = N.useMemo(() => io.reduce((xe, fe) => {
    const pe = O[fe];
    return xe + (pe ? be[pe] ?? 0 : 0);
  }, 0), [O, be]), ae = z - Y, se = N.useMemo(
    () => io.every((xe) => !!O[xe]),
    [O]
  ), re = se && ae === 0 ? "success" : ae < 0 ? "error" : "warning", Se = se ? ae > 0 ? `Spend the remaining ${ae} point${ae === 1 ? "" : "s"}.` : ae < 0 ? `Over budget by ${Math.abs(ae)} point${Math.abs(ae) === 1 ? "" : "s"}.` : "✓ All priorities assigned. You can proceed to metatype selection." : "Select a priority letter for each category.";
  function He(xe, fe) {
    U((pe) => ({
      ...pe,
      [xe]: fe
    }));
  }
  function ue(xe, fe) {
    const pe = fe.target.value, W = pe ? pe.toUpperCase() : "";
    He(xe, W);
  }
  function _e() {
    U(kw());
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "react-priority-wrapper sum-to-ten-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Sum-to-Ten Assignment — ",
        /* @__PURE__ */ c.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ c.jsx("span", { children: K ? `Campaign defaults unavailable: ${K}` : g ? "Applying campaign defaults…" : X ? "Loading priority data…" : J ? `Error: ${J}` : "Allocate priorities until you spend all points." })
    ] }),
    S.description && /* @__PURE__ */ c.jsx("p", { className: "sum-to-ten-description", children: S.description }),
    R && /* @__PURE__ */ c.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        R.label
      ] }),
      R.description && /* @__PURE__ */ c.jsx("p", { children: R.description })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "sum-to-ten-grid", children: io.map((xe) => {
      const fe = Mw(xe), pe = Uw(x, xe), W = O[xe], we = pe.find((Te) => Te.code === W), de = W ? be[W] ?? 0 : 0;
      return /* @__PURE__ */ c.jsxs("div", { className: "sum-to-ten-card", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "sum-to-ten-card__header", children: [
          /* @__PURE__ */ c.jsx("span", { children: fe }),
          W && /* @__PURE__ */ c.jsxs("span", { children: [
            W,
            " · ",
            de,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("select", { value: W, onChange: (Te) => ue(xe, Te), children: [
          /* @__PURE__ */ c.jsx("option", { value: "", children: "Select priority" }),
          sc.map((Te) => {
            const Le = pe.find((te) => te.code === Te), Ke = be[Te] ?? 0;
            return /* @__PURE__ */ c.jsx("option", { value: Te, children: `${Te} (${Ke} pts) — ${(Le == null ? void 0 : Le.option.label) ?? `Priority ${Te}`}` }, Te);
          })
        ] }),
        /* @__PURE__ */ c.jsx("div", { className: "sum-to-ten-card__summary", children: Fw(we == null ? void 0 : we.option) }),
        W && /* @__PURE__ */ c.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-link sum-to-ten-clear",
            onClick: () => He(xe, ""),
            children: "Clear selection"
          }
        )
      ] }, xe);
    }) }),
    /* @__PURE__ */ c.jsx(
      "div",
      {
        className: `react-priority-status sum-to-ten-status ${re}`,
        role: "status",
        "aria-live": "polite",
        children: Se
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "sum-to-ten-footer", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "sum-to-ten-metrics", children: [
        "Spent ",
        Y,
        " / ",
        z,
        " points"
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "sum-to-ten-actions", children: /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-secondary", onClick: _e, children: "Reset to default" }) })
    ] })
  ] });
}
const ov = [
  { key: "attributes", label: "Attributes" },
  { key: "skills", label: "Skills" },
  { key: "qualities", label: "Qualities" },
  { key: "gear", label: "Gear & Lifestyle" },
  { key: "contacts", label: "Contacts" },
  { key: "other", label: "Other" }
];
function mN({
  characterCreationData: x,
  creationMethod: S,
  activeEditionLabel: b,
  isLoading: X,
  error: J,
  campaignGameplayRules: R,
  campaignLoading: g,
  campaignError: K
}) {
  var de, Te, Le, Ke;
  const O = N.useMemo(() => ((x == null ? void 0 : x.metatypes) ?? []).map((Ae) => ({
    value: Ae.id,
    label: Ae.name
  })), [x == null ? void 0 : x.metatypes]), [U, be] = N.useState(() => {
    var te;
    return ((te = O[0]) == null ? void 0 : te.value) ?? "";
  }), [z, Y] = N.useState(
    () => ov.reduce((te, Ae) => (te[Ae.key] = 0, te), {})
  );
  N.useEffect(() => {
    var Ae;
    const te = ((Ae = O[0]) == null ? void 0 : Ae.value) ?? "";
    be((at) => at || te);
  }, [O]), N.useEffect(() => {
    var Ae, at;
    const te = ov.map(({ key: ct, label: Ne }) => ({
      category: ct,
      label: Ne,
      karma: z[ct] ?? 0
    }));
    (at = (Ae = window.ShadowmasterLegacyApp) == null ? void 0 : Ae.setKarmaPointBuy) == null || at.call(Ae, {
      metatype_id: U,
      entries: te
    });
  }, [z, U]);
  const ae = S.karma_budget ?? 800, se = ((Te = S.metatype_costs) == null ? void 0 : Te[((de = U == null ? void 0 : U.toLowerCase) == null ? void 0 : de.call(U)) ?? ""]) ?? ((Le = S.metatype_costs) == null ? void 0 : Le.human) ?? 0, re = se + ov.reduce((te, Ae) => te + (z[Ae.key] ?? 0), 0), Se = ae - re, He = z.gear ?? 0, ue = ((Ke = S.gear_conversion) == null ? void 0 : Ke.max_karma_for_gear) ?? null, _e = ue !== null && He > ue;
  let xe = "warning";
  Se === 0 ? xe = "success" : Se < 0 && (xe = "error");
  const fe = Se === 0 ? "✓ All Karma allocated. Review the remaining steps, then proceed." : Se < 0 ? `Over budget by ${Math.abs(Se)} Karma. Adjust your selections.` : `Spend the remaining ${Se} Karma before finalizing.`;
  function pe(te, Ae) {
    const at = Number.parseInt(Ae.target.value, 10);
    Y((ct) => ({
      ...ct,
      [te]: Number.isNaN(at) || at < 0 ? 0 : at
    }));
  }
  function W(te) {
    be(te.target.value);
  }
  function we() {
    Y(
      ov.reduce((te, Ae) => (te[Ae.key] = 0, te), {})
    ), O[0] && be(O[0].value);
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "react-priority-wrapper karma-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Karma Point-Buy — ",
        /* @__PURE__ */ c.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ c.jsx("span", { children: K ? `Campaign defaults unavailable: ${K}` : g ? "Applying campaign defaults…" : X ? "Loading karma data…" : J ? `Error: ${J}` : "Allocate your Karma budget before moving on." })
    ] }),
    S.description && /* @__PURE__ */ c.jsx("p", { className: "karma-description", children: S.description }),
    S.notes && S.notes.length > 0 && /* @__PURE__ */ c.jsx("ul", { className: "karma-notes", children: S.notes.map((te) => /* @__PURE__ */ c.jsx("li", { children: te }, te)) }),
    R && /* @__PURE__ */ c.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        R.label
      ] }),
      R.description && /* @__PURE__ */ c.jsx("p", { children: R.description })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "karma-grid", children: [
      /* @__PURE__ */ c.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Metatype" }),
        /* @__PURE__ */ c.jsxs("label", { className: "karma-field", children: [
          /* @__PURE__ */ c.jsx("span", { children: "Choose metatype" }),
          /* @__PURE__ */ c.jsx("select", { value: U, onChange: W, children: O.map((te) => {
            var at, ct, Ne, ye;
            const Ae = ((Ne = S.metatype_costs) == null ? void 0 : Ne[((ct = (at = te.value).toLowerCase) == null ? void 0 : ct.call(at)) ?? ""]) ?? ((ye = S.metatype_costs) == null ? void 0 : ye.human) ?? 0;
            return /* @__PURE__ */ c.jsxs("option", { value: te.value, children: [
              te.label,
              " (",
              Ae,
              " Karma)"
            ] }, te.value);
          }) })
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "karma-info", children: [
          "Metatype cost: ",
          /* @__PURE__ */ c.jsxs("strong", { children: [
            se,
            " Karma"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Karma Ledger" }),
        /* @__PURE__ */ c.jsx("div", { className: "karma-ledger", children: ov.map(({ key: te, label: Ae }) => {
          const at = z[te] ?? 0, ct = te === "gear" && ue !== null ? ` (max ${ue} Karma)` : "";
          return /* @__PURE__ */ c.jsxs("label", { className: "karma-field karma-ledger-row", children: [
            /* @__PURE__ */ c.jsxs("span", { children: [
              Ae,
              ct
            ] }),
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "number",
                min: 0,
                step: 5,
                value: at,
                onChange: (Ne) => pe(te, Ne)
              }
            )
          ] }, te);
        }) })
      ] }),
      /* @__PURE__ */ c.jsxs("section", { className: "karma-panel karma-summary", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Budget Summary" }),
        /* @__PURE__ */ c.jsxs("dl", { children: [
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Karma budget" }),
            /* @__PURE__ */ c.jsx("dd", { children: ae })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Metatype cost" }),
            /* @__PURE__ */ c.jsx("dd", { children: se })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Ledger spend" }),
            /* @__PURE__ */ c.jsx("dd", { children: re - se })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Total spent" }),
            /* @__PURE__ */ c.jsx("dd", { children: re })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Remaining" }),
            /* @__PURE__ */ c.jsx("dd", { children: Se })
          ] })
        ] }),
        _e && /* @__PURE__ */ c.jsxs("p", { className: "karma-warning", children: [
          "Gear conversion exceeds the campaign limit of ",
          ue,
          " Karma. Adjust your allocation."
        ] }),
        /* @__PURE__ */ c.jsx("p", { className: "karma-hint", children: "Remember: Only one Physical and one Mental attribute may start at their natural maximum. Attribute purchases should respect metatype caps." })
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: `react-priority-status karma-status ${xe}`, role: "status", "aria-live": "polite", children: fe }),
    /* @__PURE__ */ c.jsxs("div", { className: "karma-footer", children: [
      /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-secondary", onClick: we, children: "Reset allocations" }),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          type: "button",
          className: "btn btn-link",
          onClick: () => {
            var te, Ae;
            return (Ae = (te = window.ShadowmasterLegacyApp) == null ? void 0 : te.showLegacyKarmaWizard) == null ? void 0 : Ae.call(te);
          },
          children: "Open legacy point-buy wizard"
        }
      )
    ] })
  ] });
}
const hN = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function yN(x, S) {
  if (!x)
    return [];
  const b = S || "E";
  return x.metatypes.map((X) => {
    var J;
    return {
      ...X,
      priorityAllowed: ((J = X.priority_tiers) == null ? void 0 : J.includes(b)) ?? !1
    };
  }).filter((X) => X.priorityAllowed);
}
function gN(x) {
  return x === 0 ? "+0" : x > 0 ? `+${x}` : `${x}`;
}
function SN(x) {
  const S = x.toLowerCase();
  return hN[S] ?? x;
}
function xN({ priority: x, selectedMetatype: S, onSelect: b }) {
  const { characterCreationData: X, isLoading: J, error: R, activeEdition: g } = Xf();
  N.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const K = N.useMemo(() => {
    var se;
    const z = ((se = x == null ? void 0 : x.toUpperCase) == null ? void 0 : se.call(x)) ?? "", ae = ["A", "B", "C", "D", "E"].includes(z) ? z : "";
    return yN(X, ae);
  }, [X, x]), O = !!S, U = () => {
    var z, Y;
    (Y = (z = window.ShadowmasterLegacyApp) == null ? void 0 : z.showWizardStep) == null || Y.call(z, 1);
  }, be = () => {
    var z, Y;
    S && ((Y = (z = window.ShadowmasterLegacyApp) == null ? void 0 : z.showWizardStep) == null || Y.call(z, 3));
  };
  return J ? /* @__PURE__ */ c.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : R ? /* @__PURE__ */ c.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    R
  ] }) : K.length ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ c.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Priority: ",
        x || "—"
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "react-metatype-grid", children: K.map((z) => /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `react-metatype-card ${S === z.id ? "selected" : ""}`,
        onClick: () => b(z.id),
        children: [
          /* @__PURE__ */ c.jsx("h4", { children: z.name }),
          /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const Y = z.attribute_modifiers ? Object.entries(z.attribute_modifiers).filter(([, ae]) => ae !== 0) : [];
              return Y.length === 0 ? /* @__PURE__ */ c.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : Y.map(([ae, se]) => /* @__PURE__ */ c.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ c.jsx("span", { children: SN(ae) }),
                /* @__PURE__ */ c.jsx("span", { className: se > 0 ? "positive" : "negative", children: gN(se) })
              ] }, ae));
            })()
          ] }),
          g.key === "sr5" && z.special_attribute_points && Object.keys(z.special_attribute_points).length > 0 && /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(z.special_attribute_points).map(([Y, ae]) => /* @__PURE__ */ c.jsx("div", { className: "ability", children: /* @__PURE__ */ c.jsxs("span", { children: [
              "Priority ",
              Y,
              ": ",
              ae
            ] }) }, Y))
          ] }),
          z.abilities && z.abilities.length > 0 && /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Special Abilities" }),
            z.abilities.map((Y, ae) => /* @__PURE__ */ c.jsx("div", { className: "ability", children: /* @__PURE__ */ c.jsx("span", { children: Y }) }, ae))
          ] }),
          (!z.abilities || z.abilities.length === 0) && /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ c.jsx("div", { className: "ability", children: /* @__PURE__ */ c.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      z.id
    )) }),
    /* @__PURE__ */ c.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-secondary", onClick: U, children: "Back" }),
      /* @__PURE__ */ c.jsx("div", { className: `react-metatype-status ${O ? "ready" : ""}`, children: O ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-primary", disabled: !O, onClick: be, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ c.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const EN = ["Hermetic", "Shamanic"], CN = [
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
function bN(x) {
  return (x || "").toUpperCase();
}
function wN({ priority: x, selection: S, onChange: b }) {
  var ae;
  const { characterCreationData: X, activeEdition: J } = Xf(), R = bN(x), g = ((ae = X == null ? void 0 : X.priorities) == null ? void 0 : ae.magic) ?? null, K = N.useMemo(() => g && g[R] || null, [g, R]);
  N.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), N.useEffect(() => {
    if (!R) {
      (S.type !== "Mundane" || S.tradition || S.totem) && b({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (R === "A") {
      const se = S.tradition ?? "Hermetic", re = se === "Shamanic" ? S.totem : null;
      (S.type !== "Full Magician" || S.tradition !== se || S.totem !== re) && b({ type: "Full Magician", tradition: se, totem: re });
    } else if (R === "B") {
      let se = S.type;
      S.type !== "Adept" && S.type !== "Aspected Magician" && (se = "Adept");
      let re = S.tradition, Se = S.totem;
      se === "Aspected Magician" ? (re = re ?? "Hermetic", re !== "Shamanic" && (Se = null)) : (re = null, Se = null), (S.type !== se || S.tradition !== re || S.totem !== Se) && b({ type: se, tradition: re, totem: Se });
    } else
      (S.type !== "Mundane" || S.tradition || S.totem) && b({ type: "Mundane", tradition: null, totem: null });
  }, [R]);
  const O = (se) => {
    const re = {
      type: se.type !== void 0 ? se.type : S.type,
      tradition: se.tradition !== void 0 ? se.tradition : S.tradition,
      totem: se.totem !== void 0 ? se.totem : S.totem
    };
    re.type !== "Full Magician" && re.type !== "Aspected Magician" && (re.tradition = null, re.totem = null), re.tradition !== "Shamanic" && (re.totem = null), !(re.type === S.type && re.tradition === S.tradition && re.totem === S.totem) && b(re);
  }, U = () => !R || ["C", "D", "E", ""].includes(R) ? /* @__PURE__ */ c.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ c.jsxs(
    "article",
    {
      className: `react-magic-card ${S.type === "Mundane" ? "selected" : ""}`,
      onClick: () => O({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ c.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : R === "A" ? /* @__PURE__ */ c.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ c.jsxs(
    "article",
    {
      className: `react-magic-card ${S.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => O({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ c.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ c.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : R === "B" ? /* @__PURE__ */ c.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `react-magic-card ${S.type === "Adept" ? "selected" : ""}`,
        onClick: () => O({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ c.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `react-magic-card ${S.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => O({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ c.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ c.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, be = () => !S.type || !["Full Magician", "Aspected Magician"].includes(S.type) ? null : /* @__PURE__ */ c.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ c.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ c.jsx("div", { className: "tradition-options", children: EN.map((se) => /* @__PURE__ */ c.jsxs("label", { className: `tradition-option ${S.tradition === se ? "selected" : ""}`, children: [
      /* @__PURE__ */ c.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: se,
          checked: S.tradition === se,
          onChange: () => O({ tradition: se })
        }
      ),
      /* @__PURE__ */ c.jsx("span", { children: se })
    ] }, se)) })
  ] }), z = () => S.tradition !== "Shamanic" ? null : /* @__PURE__ */ c.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ c.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ c.jsx("div", { className: "totem-grid", children: CN.map((se) => /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `totem-card ${S.totem === se.id ? "selected" : ""}`,
        onClick: () => O({ totem: se.id }),
        children: [
          /* @__PURE__ */ c.jsx("h5", { children: se.name }),
          /* @__PURE__ */ c.jsx("p", { children: se.description }),
          /* @__PURE__ */ c.jsx("ul", { children: se.notes.map((re) => /* @__PURE__ */ c.jsx("li", { children: re }, re)) })
        ]
      },
      se.id
    )) })
  ] }), Y = () => {
    if (!S.type)
      return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (S.type === "Full Magician" || S.type === "Aspected Magician") {
      if (!S.tradition)
        return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (S.tradition === "Shamanic" && !S.totem)
        return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ c.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Priority ",
        R || "—",
        " ",
        K != null && K.summary ? `— ${K.summary}` : ""
      ] })
    ] }),
    U(),
    be(),
    z(),
    Y(),
    /* @__PURE__ */ c.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ c.jsxs("small", { children: [
      "Edition: ",
      J.label
    ] }) })
  ] });
}
function _N({ targetId: x = "campaign-dashboard-root", campaign: S, onClose: b }) {
  var U, be, z;
  const [X, J] = N.useState(null);
  N.useEffect(() => {
    J(document.getElementById(x));
  }, [x]);
  const R = N.useMemo(() => {
    if (!(S != null && S.house_rules))
      return {};
    try {
      return JSON.parse(S.house_rules);
    } catch (Y) {
      return console.warn("Failed to parse campaign house rules payload", Y), {};
    }
  }, [S == null ? void 0 : S.house_rules]);
  if (!X || !S)
    return null;
  const g = Object.entries(R.automation ?? {}).filter(([, Y]) => Y), K = (((U = R.factions) == null ? void 0 : U.length) ?? 0) > 0 || (((be = R.locations) == null ? void 0 : be.length) ?? 0) > 0, O = R.session_seed;
  return El.createPortal(
    /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard", children: [
      /* @__PURE__ */ c.jsxs("header", { className: "campaign-dashboard__header", children: [
        /* @__PURE__ */ c.jsxs("div", { children: [
          /* @__PURE__ */ c.jsx("h3", { children: S.name }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            S.edition.toUpperCase(),
            " · ",
            S.creation_method,
            " · ",
            S.gameplay_level ?? "experienced"
          ] })
        ] }),
        /* @__PURE__ */ c.jsx("div", { className: "campaign-dashboard__actions", children: /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: b, children: "Dismiss" }) })
      ] }),
      R.theme && /* @__PURE__ */ c.jsxs("p", { className: "campaign-dashboard__theme", children: [
        /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
        " ",
        R.theme
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "campaign-dashboard__grid", children: [
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Roster" }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Placeholders:" }),
            " ",
            (z = R.placeholders) != null && z.length ? R.placeholders.map((Y) => Y.name).join(", ") : "None captured"
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Automation" }),
          g.length > 0 ? /* @__PURE__ */ c.jsx("ul", { children: g.map(([Y]) => /* @__PURE__ */ c.jsx("li", { children: Y.replace(/_/g, " ") }, Y)) }) : /* @__PURE__ */ c.jsx("p", { children: "No automation modules selected." }),
          R.notes && /* @__PURE__ */ c.jsxs("p", { className: "campaign-dashboard__notes", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "House rule notes:" }),
            " ",
            R.notes
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "World Backbone" }),
          K ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
            R.factions && R.factions.length > 0 && /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Factions" }),
              /* @__PURE__ */ c.jsx("ul", { children: R.factions.map((Y) => /* @__PURE__ */ c.jsxs("li", { children: [
                /* @__PURE__ */ c.jsx("span", { children: Y.name }),
                Y.tags && /* @__PURE__ */ c.jsxs("small", { children: [
                  " · ",
                  Y.tags
                ] }),
                Y.notes && /* @__PURE__ */ c.jsx("p", { children: Y.notes })
              ] }, Y.id ?? Y.name)) })
            ] }),
            R.locations && R.locations.length > 0 && /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Locations" }),
              /* @__PURE__ */ c.jsx("ul", { children: R.locations.map((Y) => /* @__PURE__ */ c.jsxs("li", { children: [
                /* @__PURE__ */ c.jsx("span", { children: Y.name }),
                Y.descriptor && /* @__PURE__ */ c.jsx("p", { children: Y.descriptor })
              ] }, Y.id ?? Y.name)) })
            ] })
          ] }) : /* @__PURE__ */ c.jsx("p", { children: "No factions or locations recorded yet." })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Session Seed" }),
          O != null && O.skip ? /* @__PURE__ */ c.jsx("p", { children: "Session planning skipped for now." }) : O ? /* @__PURE__ */ c.jsxs("ul", { children: [
            /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Title:" }),
              " ",
              O.title || "Session 0"
            ] }),
            O.sceneTemplate && /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Template:" }),
              " ",
              O.sceneTemplate
            ] }),
            O.objectives && /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Objectives:" }),
              " ",
              O.objectives
            ] }),
            O.summary && /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Summary:" }),
              " ",
              O.summary
            ] })
          ] }) : /* @__PURE__ */ c.jsx("p", { children: "No session seed captured." })
        ] })
      ] })
    ] }),
    X
  );
}
function TN() {
  const [x, S] = N.useState(null);
  return N.useEffect(() => {
    S(document.getElementById("auth-root"));
  }, []), x ? El.createPortal(/* @__PURE__ */ c.jsx(Vj, {}), x) : null;
}
function RN() {
  const [x, S] = N.useState(null);
  return N.useEffect(() => {
    S(document.getElementById("priority-assignment-react-root"));
  }, []), x ? El.createPortal(/* @__PURE__ */ c.jsx(fN, {}), x) : null;
}
function kN() {
  const [x, S] = N.useState(null), [b, X] = N.useState(""), [J, R] = N.useState(null);
  return N.useEffect(() => {
    S(document.getElementById("metatype-selection-react-root"));
  }, []), N.useEffect(() => {
    var O;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const K = () => {
      var U, be;
      X(((U = g.getMetatypePriority) == null ? void 0 : U.call(g)) ?? ""), R(((be = g.getMetatypeSelection) == null ? void 0 : be.call(g)) ?? null);
    };
    return K(), (O = g.subscribeMetatypeState) == null || O.call(g, K), () => {
      var U;
      (U = g.unsubscribeMetatypeState) == null || U.call(g, K);
    };
  }, []), x ? El.createPortal(
    /* @__PURE__ */ c.jsx(
      xN,
      {
        priority: b,
        selectedMetatype: J,
        onSelect: (g) => {
          var K, O;
          R(g), (O = (K = window.ShadowmasterLegacyApp) == null ? void 0 : K.setMetatypeSelection) == null || O.call(K, g);
        }
      }
    ),
    x
  ) : null;
}
function jN() {
  const [x, S] = N.useState(null), [b, X] = N.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return N.useEffect(() => {
    S(document.getElementById("magical-abilities-react-root"));
  }, []), N.useEffect(() => {
    var g;
    const J = window.ShadowmasterLegacyApp;
    if (!J) return;
    const R = () => {
      var O;
      const K = (O = J.getMagicState) == null ? void 0 : O.call(J);
      K && X({
        priority: K.priority || "",
        type: K.type || null,
        tradition: K.tradition || null,
        totem: K.totem || null
      });
    };
    return R(), (g = J.subscribeMagicState) == null || g.call(J, R), () => {
      var K;
      (K = J.unsubscribeMagicState) == null || K.call(J, R);
    };
  }, []), x ? El.createPortal(
    /* @__PURE__ */ c.jsx(
      wN,
      {
        priority: b.priority,
        selection: { type: b.type, tradition: b.tradition, totem: b.totem },
        onChange: (J) => {
          var R, g;
          (g = (R = window.ShadowmasterLegacyApp) == null ? void 0 : R.setMagicState) == null || g.call(R, J);
        }
      }
    ),
    x
  ) : null;
}
function NN() {
  const { activeEdition: x, isLoading: S, error: b, characterCreationData: X } = Xf(), [J, R] = N.useState(null);
  let g = "· data pending";
  return S ? g = "· loading edition data…" : b ? g = `· failed to load data: ${b}` : X && (g = "· edition data loaded"), /* @__PURE__ */ c.jsxs(Bj, { children: [
    /* @__PURE__ */ c.jsx("div", { className: "react-banner", "data-active-edition": x.key, children: /* @__PURE__ */ c.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ c.jsx("strong", { children: x.label }),
      " ",
      g
    ] }) }),
    /* @__PURE__ */ c.jsx(TN, {}),
    /* @__PURE__ */ c.jsx(lN, {}),
    /* @__PURE__ */ c.jsx(Gj, { onCreated: (K) => R(K) }),
    /* @__PURE__ */ c.jsx(_N, { campaign: J, onClose: () => R(null) }),
    /* @__PURE__ */ c.jsx(rN, {}),
    /* @__PURE__ */ c.jsx($j, {}),
    /* @__PURE__ */ c.jsx(RN, {}),
    /* @__PURE__ */ c.jsx(kN, {}),
    /* @__PURE__ */ c.jsx(jN, {})
  ] });
}
const DN = document.getElementById("shadowmaster-react-root"), ON = DN ?? LN();
function LN() {
  const x = document.createElement("div");
  return x.id = "shadowmaster-react-root", x.dataset.controller = "react-shell", x.style.display = "contents", document.body.appendChild(x), x;
}
function AN() {
  return N.useEffect(() => {
    var x, S, b;
    (x = window.ShadowmasterLegacyApp) != null && x.initialize && !((b = (S = window.ShadowmasterLegacyApp).isInitialized) != null && b.call(S)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ c.jsx(N.StrictMode, { children: /* @__PURE__ */ c.jsx(Uj, { children: /* @__PURE__ */ c.jsx(NN, {}) }) });
}
const MN = Dx(ON);
MN.render(/* @__PURE__ */ c.jsx(AN, {}));
