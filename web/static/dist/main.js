var vE = { exports: {} }, Zp = {}, hE = { exports: {} }, Rt = {};
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
  var j = Symbol.for("react.element"), V = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), De = Symbol.for("react.strict_mode"), Se = Symbol.for("react.profiler"), Be = Symbol.for("react.provider"), g = Symbol.for("react.context"), Ke = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), G = Symbol.for("react.memo"), pe = Symbol.for("react.lazy"), q = Symbol.iterator;
  function Ee(_) {
    return _ === null || typeof _ != "object" ? null : (_ = q && _[q] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var ie = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Ie = Object.assign, St = {};
  function mt(_, I, Qe) {
    this.props = _, this.context = I, this.refs = St, this.updater = Qe || ie;
  }
  mt.prototype.isReactComponent = {}, mt.prototype.setState = function(_, I) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, I, "setState");
  }, mt.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function tn() {
  }
  tn.prototype = mt.prototype;
  function ct(_, I, Qe) {
    this.props = _, this.context = I, this.refs = St, this.updater = Qe || ie;
  }
  var Ge = ct.prototype = new tn();
  Ge.constructor = ct, Ie(Ge, mt.prototype), Ge.isPureReactComponent = !0;
  var re = Array.isArray, Z = Object.prototype.hasOwnProperty, ke = { current: null }, ce = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ft(_, I, Qe) {
    var Ye, dt = {}, lt = null, at = null;
    if (I != null) for (Ye in I.ref !== void 0 && (at = I.ref), I.key !== void 0 && (lt = "" + I.key), I) Z.call(I, Ye) && !ce.hasOwnProperty(Ye) && (dt[Ye] = I[Ye]);
    var ut = arguments.length - 2;
    if (ut === 1) dt.children = Qe;
    else if (1 < ut) {
      for (var pt = Array(ut), Yt = 0; Yt < ut; Yt++) pt[Yt] = arguments[Yt + 2];
      dt.children = pt;
    }
    if (_ && _.defaultProps) for (Ye in ut = _.defaultProps, ut) dt[Ye] === void 0 && (dt[Ye] = ut[Ye]);
    return { $$typeof: j, type: _, key: lt, ref: at, props: dt, _owner: ke.current };
  }
  function Tt(_, I) {
    return { $$typeof: j, type: _.type, key: I, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function Ct(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === j;
  }
  function on(_) {
    var I = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(Qe) {
      return I[Qe];
    });
  }
  var Ot = /\/+/g;
  function Ae(_, I) {
    return typeof _ == "object" && _ !== null && _.key != null ? on("" + _.key) : I.toString(36);
  }
  function Pt(_, I, Qe, Ye, dt) {
    var lt = typeof _;
    (lt === "undefined" || lt === "boolean") && (_ = null);
    var at = !1;
    if (_ === null) at = !0;
    else switch (lt) {
      case "string":
      case "number":
        at = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case j:
          case V:
            at = !0;
        }
    }
    if (at) return at = _, dt = dt(at), _ = Ye === "" ? "." + Ae(at, 0) : Ye, re(dt) ? (Qe = "", _ != null && (Qe = _.replace(Ot, "$&/") + "/"), Pt(dt, I, Qe, "", function(Yt) {
      return Yt;
    })) : dt != null && (Ct(dt) && (dt = Tt(dt, Qe + (!dt.key || at && at.key === dt.key ? "" : ("" + dt.key).replace(Ot, "$&/") + "/") + _)), I.push(dt)), 1;
    if (at = 0, Ye = Ye === "" ? "." : Ye + ":", re(_)) for (var ut = 0; ut < _.length; ut++) {
      lt = _[ut];
      var pt = Ye + Ae(lt, ut);
      at += Pt(lt, I, Qe, pt, dt);
    }
    else if (pt = Ee(_), typeof pt == "function") for (_ = pt.call(_), ut = 0; !(lt = _.next()).done; ) lt = lt.value, pt = Ye + Ae(lt, ut++), at += Pt(lt, I, Qe, pt, dt);
    else if (lt === "object") throw I = String(_), Error("Objects are not valid as a React child (found: " + (I === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : I) + "). If you meant to render a collection of children, use an array instead.");
    return at;
  }
  function Lt(_, I, Qe) {
    if (_ == null) return _;
    var Ye = [], dt = 0;
    return Pt(_, Ye, "", "", function(lt) {
      return I.call(Qe, lt, dt++);
    }), Ye;
  }
  function Nt(_) {
    if (_._status === -1) {
      var I = _._result;
      I = I(), I.then(function(Qe) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = Qe);
      }, function(Qe) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = Qe);
      }), _._status === -1 && (_._status = 0, _._result = I);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var be = { current: null }, ne = { transition: null }, Oe = { ReactCurrentDispatcher: be, ReactCurrentBatchConfig: ne, ReactCurrentOwner: ke };
  function ue() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Rt.Children = { map: Lt, forEach: function(_, I, Qe) {
    Lt(_, function() {
      I.apply(this, arguments);
    }, Qe);
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
  } }, Rt.Component = mt, Rt.Fragment = k, Rt.Profiler = Se, Rt.PureComponent = ct, Rt.StrictMode = De, Rt.Suspense = B, Rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Oe, Rt.act = ue, Rt.cloneElement = function(_, I, Qe) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var Ye = Ie({}, _.props), dt = _.key, lt = _.ref, at = _._owner;
    if (I != null) {
      if (I.ref !== void 0 && (lt = I.ref, at = ke.current), I.key !== void 0 && (dt = "" + I.key), _.type && _.type.defaultProps) var ut = _.type.defaultProps;
      for (pt in I) Z.call(I, pt) && !ce.hasOwnProperty(pt) && (Ye[pt] = I[pt] === void 0 && ut !== void 0 ? ut[pt] : I[pt]);
    }
    var pt = arguments.length - 2;
    if (pt === 1) Ye.children = Qe;
    else if (1 < pt) {
      ut = Array(pt);
      for (var Yt = 0; Yt < pt; Yt++) ut[Yt] = arguments[Yt + 2];
      Ye.children = ut;
    }
    return { $$typeof: j, type: _.type, key: dt, ref: lt, props: Ye, _owner: at };
  }, Rt.createContext = function(_) {
    return _ = { $$typeof: g, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: Be, _context: _ }, _.Consumer = _;
  }, Rt.createElement = ft, Rt.createFactory = function(_) {
    var I = ft.bind(null, _);
    return I.type = _, I;
  }, Rt.createRef = function() {
    return { current: null };
  }, Rt.forwardRef = function(_) {
    return { $$typeof: Ke, render: _ };
  }, Rt.isValidElement = Ct, Rt.lazy = function(_) {
    return { $$typeof: pe, _payload: { _status: -1, _result: _ }, _init: Nt };
  }, Rt.memo = function(_, I) {
    return { $$typeof: G, type: _, compare: I === void 0 ? null : I };
  }, Rt.startTransition = function(_) {
    var I = ne.transition;
    ne.transition = {};
    try {
      _();
    } finally {
      ne.transition = I;
    }
  }, Rt.unstable_act = ue, Rt.useCallback = function(_, I) {
    return be.current.useCallback(_, I);
  }, Rt.useContext = function(_) {
    return be.current.useContext(_);
  }, Rt.useDebugValue = function() {
  }, Rt.useDeferredValue = function(_) {
    return be.current.useDeferredValue(_);
  }, Rt.useEffect = function(_, I) {
    return be.current.useEffect(_, I);
  }, Rt.useId = function() {
    return be.current.useId();
  }, Rt.useImperativeHandle = function(_, I, Qe) {
    return be.current.useImperativeHandle(_, I, Qe);
  }, Rt.useInsertionEffect = function(_, I) {
    return be.current.useInsertionEffect(_, I);
  }, Rt.useLayoutEffect = function(_, I) {
    return be.current.useLayoutEffect(_, I);
  }, Rt.useMemo = function(_, I) {
    return be.current.useMemo(_, I);
  }, Rt.useReducer = function(_, I, Qe) {
    return be.current.useReducer(_, I, Qe);
  }, Rt.useRef = function(_) {
    return be.current.useRef(_);
  }, Rt.useState = function(_) {
    return be.current.useState(_);
  }, Rt.useSyncExternalStore = function(_, I, Qe) {
    return be.current.useSyncExternalStore(_, I, Qe);
  }, Rt.useTransition = function() {
    return be.current.useTransition();
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
  return tT || (tT = 1, function(j, V) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var k = "18.3.1", De = Symbol.for("react.element"), Se = Symbol.for("react.portal"), Be = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), Ke = Symbol.for("react.profiler"), B = Symbol.for("react.provider"), G = Symbol.for("react.context"), pe = Symbol.for("react.forward_ref"), q = Symbol.for("react.suspense"), Ee = Symbol.for("react.suspense_list"), ie = Symbol.for("react.memo"), Ie = Symbol.for("react.lazy"), St = Symbol.for("react.offscreen"), mt = Symbol.iterator, tn = "@@iterator";
      function ct(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = mt && h[mt] || h[tn];
        return typeof C == "function" ? C : null;
      }
      var Ge = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, re = {
        transition: null
      }, Z = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, ke = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ce = {}, ft = null;
      function Tt(h) {
        ft = h;
      }
      ce.setExtraStackFrame = function(h) {
        ft = h;
      }, ce.getCurrentStack = null, ce.getStackAddendum = function() {
        var h = "";
        ft && (h += ft);
        var C = ce.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var Ct = !1, on = !1, Ot = !1, Ae = !1, Pt = !1, Lt = {
        ReactCurrentDispatcher: Ge,
        ReactCurrentBatchConfig: re,
        ReactCurrentOwner: ke
      };
      Lt.ReactDebugCurrentFrame = ce, Lt.ReactCurrentActQueue = Z;
      function Nt(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), F = 1; F < C; F++)
            z[F - 1] = arguments[F];
          ne("warn", h, z);
        }
      }
      function be(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), F = 1; F < C; F++)
            z[F - 1] = arguments[F];
          ne("error", h, z);
        }
      }
      function ne(h, C, z) {
        {
          var F = Lt.ReactDebugCurrentFrame, te = F.getStackAddendum();
          te !== "" && (C += "%s", z = z.concat([te]));
          var je = z.map(function(oe) {
            return String(oe);
          });
          je.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, je);
        }
      }
      var Oe = {};
      function ue(h, C) {
        {
          var z = h.constructor, F = z && (z.displayName || z.name) || "ReactClass", te = F + "." + C;
          if (Oe[te])
            return;
          be("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, F), Oe[te] = !0;
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
        enqueueForceUpdate: function(h, C, z) {
          ue(h, "forceUpdate");
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
        enqueueReplaceState: function(h, C, z, F) {
          ue(h, "replaceState");
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
        enqueueSetState: function(h, C, z, F) {
          ue(h, "setState");
        }
      }, I = Object.assign, Qe = {};
      Object.freeze(Qe);
      function Ye(h, C, z) {
        this.props = h, this.context = C, this.refs = Qe, this.updater = z || _;
      }
      Ye.prototype.isReactComponent = {}, Ye.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, Ye.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var dt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, lt = function(h, C) {
          Object.defineProperty(Ye.prototype, h, {
            get: function() {
              Nt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var at in dt)
          dt.hasOwnProperty(at) && lt(at, dt[at]);
      }
      function ut() {
      }
      ut.prototype = Ye.prototype;
      function pt(h, C, z) {
        this.props = h, this.context = C, this.refs = Qe, this.updater = z || _;
      }
      var Yt = pt.prototype = new ut();
      Yt.constructor = pt, I(Yt, Ye.prototype), Yt.isPureReactComponent = !0;
      function Ln() {
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
          var C = typeof Symbol == "function" && Symbol.toStringTag, z = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return z;
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
          return be("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rr(h)), In(h);
      }
      function ci(h, C, z) {
        var F = h.displayName;
        if (F)
          return F;
        var te = C.displayName || C.name || "";
        return te !== "" ? z + "(" + te + ")" : z;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && be("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case Be:
            return "Fragment";
          case Se:
            return "Portal";
          case Ke:
            return "Profiler";
          case g:
            return "StrictMode";
          case q:
            return "Suspense";
          case Ee:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case G:
              var C = h;
              return sa(C) + ".Consumer";
            case B:
              var z = h;
              return sa(z._context) + ".Provider";
            case pe:
              return ci(h, h.render, "ForwardRef");
            case ie:
              var F = h.displayName || null;
              return F !== null ? F : Kn(h.type) || "Memo";
            case Ie: {
              var te = h, je = te._payload, oe = te._init;
              try {
                return Kn(oe(je));
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
        var z = function() {
          Sr || (Sr = !0, be("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: z,
          configurable: !0
        });
      }
      function fi(h, C) {
        var z = function() {
          $a || ($a = !0, be("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: z,
          configurable: !0
        });
      }
      function ae(h) {
        if (typeof h.ref == "string" && ke.current && h.__self && ke.current.stateNode !== h.__self) {
          var C = Kn(ke.current.type);
          Mn[C] || (be('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Mn[C] = !0);
        }
      }
      var Le = function(h, C, z, F, te, je, oe) {
        var Pe = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: De,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: z,
          props: oe,
          // Record the component responsible for creating this element.
          _owner: je
        };
        return Pe._store = {}, Object.defineProperty(Pe._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Pe, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: F
        }), Object.defineProperty(Pe, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: te
        }), Object.freeze && (Object.freeze(Pe.props), Object.freeze(Pe)), Pe;
      };
      function ot(h, C, z) {
        var F, te = {}, je = null, oe = null, Pe = null, gt = null;
        if (C != null) {
          Er(C) && (oe = C.ref, ae(C)), ca(C) && ($r(C.key), je = "" + C.key), Pe = C.__self === void 0 ? null : C.__self, gt = C.__source === void 0 ? null : C.__source;
          for (F in C)
            Tn.call(C, F) && !Yn.hasOwnProperty(F) && (te[F] = C[F]);
        }
        var kt = arguments.length - 2;
        if (kt === 1)
          te.children = z;
        else if (kt > 1) {
          for (var ln = Array(kt), Gt = 0; Gt < kt; Gt++)
            ln[Gt] = arguments[Gt + 2];
          Object.freeze && Object.freeze(ln), te.children = ln;
        }
        if (h && h.defaultProps) {
          var st = h.defaultProps;
          for (F in st)
            te[F] === void 0 && (te[F] = st[F]);
        }
        if (je || oe) {
          var qt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          je && Qa(te, qt), oe && fi(te, qt);
        }
        return Le(h, je, oe, Pe, gt, ke.current, te);
      }
      function Vt(h, C) {
        var z = Le(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return z;
      }
      function nn(h, C, z) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var F, te = I({}, h.props), je = h.key, oe = h.ref, Pe = h._self, gt = h._source, kt = h._owner;
        if (C != null) {
          Er(C) && (oe = C.ref, kt = ke.current), ca(C) && ($r(C.key), je = "" + C.key);
          var ln;
          h.type && h.type.defaultProps && (ln = h.type.defaultProps);
          for (F in C)
            Tn.call(C, F) && !Yn.hasOwnProperty(F) && (C[F] === void 0 && ln !== void 0 ? te[F] = ln[F] : te[F] = C[F]);
        }
        var Gt = arguments.length - 2;
        if (Gt === 1)
          te.children = z;
        else if (Gt > 1) {
          for (var st = Array(Gt), qt = 0; qt < Gt; qt++)
            st[qt] = arguments[qt + 2];
          te.children = st;
        }
        return Le(h.type, je, oe, Pe, gt, kt, te);
      }
      function hn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === De;
      }
      var sn = ".", Xn = ":";
      function rn(h) {
        var C = /[=:]/g, z = {
          "=": "=0",
          ":": "=2"
        }, F = h.replace(C, function(te) {
          return z[te];
        });
        return "$" + F;
      }
      var $t = !1, Qt = /\/+/g;
      function fa(h) {
        return h.replace(Qt, "$&/");
      }
      function Cr(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), rn("" + h.key)) : C.toString(36);
      }
      function wa(h, C, z, F, te) {
        var je = typeof h;
        (je === "undefined" || je === "boolean") && (h = null);
        var oe = !1;
        if (h === null)
          oe = !0;
        else
          switch (je) {
            case "string":
            case "number":
              oe = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case De:
                case Se:
                  oe = !0;
              }
          }
        if (oe) {
          var Pe = h, gt = te(Pe), kt = F === "" ? sn + Cr(Pe, 0) : F;
          if (Rn(gt)) {
            var ln = "";
            kt != null && (ln = fa(kt) + "/"), wa(gt, C, ln, "", function(Kf) {
              return Kf;
            });
          } else gt != null && (hn(gt) && (gt.key && (!Pe || Pe.key !== gt.key) && $r(gt.key), gt = Vt(
            gt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            z + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (gt.key && (!Pe || Pe.key !== gt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + gt.key) + "/"
            ) : "") + kt
          )), C.push(gt));
          return 1;
        }
        var Gt, st, qt = 0, mn = F === "" ? sn : F + Xn;
        if (Rn(h))
          for (var Rl = 0; Rl < h.length; Rl++)
            Gt = h[Rl], st = mn + Cr(Gt, Rl), qt += wa(Gt, C, z, st, te);
        else {
          var qo = ct(h);
          if (typeof qo == "function") {
            var Bi = h;
            qo === Bi.entries && ($t || Nt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), $t = !0);
            for (var Ko = qo.call(Bi), ou, qf = 0; !(ou = Ko.next()).done; )
              Gt = ou.value, st = mn + Cr(Gt, qf++), qt += wa(Gt, C, z, st, te);
          } else if (je === "object") {
            var oc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (oc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : oc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return qt;
      }
      function Hi(h, C, z) {
        if (h == null)
          return h;
        var F = [], te = 0;
        return wa(h, F, "", "", function(je) {
          return C.call(z, je, te++);
        }), F;
      }
      function Jl(h) {
        var C = 0;
        return Hi(h, function() {
          C++;
        }), C;
      }
      function eu(h, C, z) {
        Hi(h, function() {
          C.apply(this, arguments);
        }, z);
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
          $$typeof: G,
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
          $$typeof: B,
          _context: C
        };
        var z = !1, F = !1, te = !1;
        {
          var je = {
            $$typeof: G,
            _context: C
          };
          Object.defineProperties(je, {
            Provider: {
              get: function() {
                return F || (F = !0, be("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(oe) {
                C.Provider = oe;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(oe) {
                C._currentValue = oe;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(oe) {
                C._currentValue2 = oe;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(oe) {
                C._threadCount = oe;
              }
            },
            Consumer: {
              get: function() {
                return z || (z = !0, be("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(oe) {
                te || (Nt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", oe), te = !0);
              }
            }
          }), C.Consumer = je;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var _r = -1, Dr = 0, ar = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var C = h._result, z = C();
          if (z.then(function(je) {
            if (h._status === Dr || h._status === _r) {
              var oe = h;
              oe._status = ar, oe._result = je;
            }
          }, function(je) {
            if (h._status === Dr || h._status === _r) {
              var oe = h;
              oe._status = di, oe._result = je;
            }
          }), h._status === _r) {
            var F = h;
            F._status = Dr, F._result = z;
          }
        }
        if (h._status === ar) {
          var te = h._result;
          return te === void 0 && be(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, te), "default" in te || be(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, te), te.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, z = {
          $$typeof: Ie,
          _payload: C,
          _init: Wa
        };
        {
          var F, te;
          Object.defineProperties(z, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return F;
              },
              set: function(je) {
                be("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), F = je, Object.defineProperty(z, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return te;
              },
              set: function(je) {
                be("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), te = je, Object.defineProperty(z, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return z;
      }
      function vi(h) {
        h != null && h.$$typeof === ie ? be("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? be("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && be("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && be("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: pe,
          render: h
        };
        {
          var z;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return z;
            },
            set: function(F) {
              z = F, !h.name && !h.displayName && (h.displayName = F);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function $(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === Be || h === Ke || Pt || h === g || h === q || h === Ee || Ae || h === St || Ct || on || Ot || typeof h == "object" && h !== null && (h.$$typeof === Ie || h.$$typeof === ie || h.$$typeof === B || h.$$typeof === G || h.$$typeof === pe || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function se(h, C) {
        $(h) || be("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var z = {
          $$typeof: ie,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var F;
          Object.defineProperty(z, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return F;
            },
            set: function(te) {
              F = te, !h.name && !h.displayName && (h.displayName = te);
            }
          });
        }
        return z;
      }
      function Ce() {
        var h = Ge.current;
        return h === null && be(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function tt(h) {
        var C = Ce();
        if (h._context !== void 0) {
          var z = h._context;
          z.Consumer === h ? be("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : z.Provider === h && be("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function Ze(h) {
        var C = Ce();
        return C.useState(h);
      }
      function yt(h, C, z) {
        var F = Ce();
        return F.useReducer(h, C, z);
      }
      function vt(h) {
        var C = Ce();
        return C.useRef(h);
      }
      function wn(h, C) {
        var z = Ce();
        return z.useEffect(h, C);
      }
      function an(h, C) {
        var z = Ce();
        return z.useInsertionEffect(h, C);
      }
      function cn(h, C) {
        var z = Ce();
        return z.useLayoutEffect(h, C);
      }
      function ir(h, C) {
        var z = Ce();
        return z.useCallback(h, C);
      }
      function Ga(h, C) {
        var z = Ce();
        return z.useMemo(h, C);
      }
      function qa(h, C, z) {
        var F = Ce();
        return F.useImperativeHandle(h, C, z);
      }
      function nt(h, C) {
        {
          var z = Ce();
          return z.useDebugValue(h, C);
        }
      }
      function it() {
        var h = Ce();
        return h.useTransition();
      }
      function Ka(h) {
        var C = Ce();
        return C.useDeferredValue(h);
      }
      function nu() {
        var h = Ce();
        return h.useId();
      }
      function ru(h, C, z) {
        var F = Ce();
        return F.useSyncExternalStore(h, C, z);
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
          hl < 0 && be("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = Lt.ReactCurrentDispatcher, Za;
      function qu(h, C, z) {
        {
          if (Za === void 0)
            try {
              throw Error();
            } catch (te) {
              var F = te.stack.trim().match(/\n( *(at )?)/);
              Za = F && F[1] || "";
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
          var z = gl.get(h);
          if (z !== void 0)
            return z;
        }
        var F;
        au = !0;
        var te = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var je;
        je = Xa.current, Xa.current = null, yl();
        try {
          if (C) {
            var oe = function() {
              throw Error();
            };
            if (Object.defineProperty(oe.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(oe, []);
              } catch (mn) {
                F = mn;
              }
              Reflect.construct(h, [], oe);
            } else {
              try {
                oe.call();
              } catch (mn) {
                F = mn;
              }
              h.call(oe.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (mn) {
              F = mn;
            }
            h();
          }
        } catch (mn) {
          if (mn && F && typeof mn.stack == "string") {
            for (var Pe = mn.stack.split(`
`), gt = F.stack.split(`
`), kt = Pe.length - 1, ln = gt.length - 1; kt >= 1 && ln >= 0 && Pe[kt] !== gt[ln]; )
              ln--;
            for (; kt >= 1 && ln >= 0; kt--, ln--)
              if (Pe[kt] !== gt[ln]) {
                if (kt !== 1 || ln !== 1)
                  do
                    if (kt--, ln--, ln < 0 || Pe[kt] !== gt[ln]) {
                      var Gt = `
` + Pe[kt].replace(" at new ", " at ");
                      return h.displayName && Gt.includes("<anonymous>") && (Gt = Gt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Gt), Gt;
                    }
                  while (kt >= 1 && ln >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = je, da(), Error.prepareStackTrace = te;
        }
        var st = h ? h.displayName || h.name : "", qt = st ? qu(st) : "";
        return typeof h == "function" && gl.set(h, qt), qt;
      }
      function Pi(h, C, z) {
        return Xu(h, !1);
      }
      function Wf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, z) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Xu(h, Wf(h));
        if (typeof h == "string")
          return qu(h);
        switch (h) {
          case q:
            return qu("Suspense");
          case Ee:
            return qu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case pe:
              return Pi(h.render);
            case ie:
              return Vi(h.type, C, z);
            case Ie: {
              var F = h, te = F._payload, je = F._init;
              try {
                return Vi(je(te), C, z);
              } catch {
              }
            }
          }
        return "";
      }
      var zt = {}, Zu = Lt.ReactDebugCurrentFrame;
      function Dt(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Zu.setExtraStackFrame(z);
        } else
          Zu.setExtraStackFrame(null);
      }
      function Qo(h, C, z, F, te) {
        {
          var je = Function.call.bind(Tn);
          for (var oe in h)
            if (je(h, oe)) {
              var Pe = void 0;
              try {
                if (typeof h[oe] != "function") {
                  var gt = Error((F || "React class") + ": " + z + " type `" + oe + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[oe] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw gt.name = "Invariant Violation", gt;
                }
                Pe = h[oe](C, oe, F, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (kt) {
                Pe = kt;
              }
              Pe && !(Pe instanceof Error) && (Dt(te), be("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", F || "React class", z, oe, typeof Pe), Dt(null)), Pe instanceof Error && !(Pe.message in zt) && (zt[Pe.message] = !0, Dt(te), be("Failed %s type: %s", z, Pe.message), Dt(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Tt(z);
        } else
          Tt(null);
      }
      var Xe;
      Xe = !1;
      function Ju() {
        if (ke.current) {
          var h = Kn(ke.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function lr(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), z = h.lineNumber;
          return `

Check your code at ` + C + ":" + z + ".";
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
          var z = typeof h == "string" ? h : h.displayName || h.name;
          z && (C = `

Check the top-level render call using <` + z + ">.");
        }
        return C;
      }
      function fn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var z = yi(C);
          if (!Or[z]) {
            Or[z] = !0;
            var F = "";
            h && h._owner && h._owner !== ke.current && (F = " It was passed a child from " + Kn(h._owner.type) + "."), hi(h), be('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, F), hi(null);
          }
        }
      }
      function Wt(h, C) {
        if (typeof h == "object") {
          if (Rn(h))
            for (var z = 0; z < h.length; z++) {
              var F = h[z];
              hn(F) && fn(F, C);
            }
          else if (hn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var te = ct(h);
            if (typeof te == "function" && te !== h.entries)
              for (var je = te.call(h), oe; !(oe = je.next()).done; )
                hn(oe.value) && fn(oe.value, C);
          }
        }
      }
      function Sl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var z;
          if (typeof C == "function")
            z = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === pe || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ie))
            z = C.propTypes;
          else
            return;
          if (z) {
            var F = Kn(C);
            Qo(z, h.props, "prop", F, h);
          } else if (C.PropTypes !== void 0 && !Xe) {
            Xe = !0;
            var te = Kn(C);
            be("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", te || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && be("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function $n(h) {
        {
          for (var C = Object.keys(h.props), z = 0; z < C.length; z++) {
            var F = C[z];
            if (F !== "children" && F !== "key") {
              hi(h), be("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", F), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), be("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Lr(h, C, z) {
        var F = $(h);
        if (!F) {
          var te = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (te += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var je = mi(C);
          je ? te += je : te += Ju();
          var oe;
          h === null ? oe = "null" : Rn(h) ? oe = "array" : h !== void 0 && h.$$typeof === De ? (oe = "<" + (Kn(h.type) || "Unknown") + " />", te = " Did you accidentally export a JSX literal instead of a component?") : oe = typeof h, be("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", oe, te);
        }
        var Pe = ot.apply(this, arguments);
        if (Pe == null)
          return Pe;
        if (F)
          for (var gt = 2; gt < arguments.length; gt++)
            Wt(arguments[gt], h);
        return h === Be ? $n(Pe) : Sl(Pe), Pe;
      }
      var xa = !1;
      function iu(h) {
        var C = Lr.bind(null, h);
        return C.type = h, xa || (xa = !0, Nt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Nt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Wo(h, C, z) {
        for (var F = nn.apply(this, arguments), te = 2; te < arguments.length; te++)
          Wt(arguments[te], F.type);
        return Sl(F), F;
      }
      function Go(h, C) {
        var z = re.transition;
        re.transition = {};
        var F = re.transition;
        re.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (re.transition = z, z === null && F._updatedFibers) {
            var te = F._updatedFibers.size;
            te > 10 && Nt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), F._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function Gf(h) {
        if (lu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), z = j && j[C];
            lu = z.call(j, "timers").setImmediate;
          } catch {
            lu = function(te) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && be("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var je = new MessageChannel();
              je.port1.onmessage = te, je.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var ba = 0, Ja = !1;
      function gi(h) {
        {
          var C = ba;
          ba++, Z.current === null && (Z.current = []);
          var z = Z.isBatchingLegacy, F;
          try {
            if (Z.isBatchingLegacy = !0, F = h(), !z && Z.didScheduleLegacyUpdate) {
              var te = Z.current;
              te !== null && (Z.didScheduleLegacyUpdate = !1, Cl(te));
            }
          } catch (st) {
            throw _a(C), st;
          } finally {
            Z.isBatchingLegacy = z;
          }
          if (F !== null && typeof F == "object" && typeof F.then == "function") {
            var je = F, oe = !1, Pe = {
              then: function(st, qt) {
                oe = !0, je.then(function(mn) {
                  _a(C), ba === 0 ? eo(mn, st, qt) : st(mn);
                }, function(mn) {
                  _a(C), qt(mn);
                });
              }
            };
            return !Ja && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              oe || (Ja = !0, be("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Pe;
          } else {
            var gt = F;
            if (_a(C), ba === 0) {
              var kt = Z.current;
              kt !== null && (Cl(kt), Z.current = null);
              var ln = {
                then: function(st, qt) {
                  Z.current === null ? (Z.current = [], eo(gt, st, qt)) : st(gt);
                }
              };
              return ln;
            } else {
              var Gt = {
                then: function(st, qt) {
                  st(gt);
                }
              };
              return Gt;
            }
          }
        }
      }
      function _a(h) {
        h !== ba - 1 && be("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function eo(h, C, z) {
        {
          var F = Z.current;
          if (F !== null)
            try {
              Cl(F), Gf(function() {
                F.length === 0 ? (Z.current = null, C(h)) : eo(h, C, z);
              });
            } catch (te) {
              z(te);
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
              var z = h[C];
              do
                z = z(!0);
              while (z !== null);
            }
            h.length = 0;
          } catch (F) {
            throw h = h.slice(C + 1), F;
          } finally {
            to = !1;
          }
        }
      }
      var uu = Lr, no = Wo, ro = iu, ei = {
        map: Hi,
        forEach: eu,
        count: Jl,
        toArray: pl,
        only: vl
      };
      V.Children = ei, V.Component = Ye, V.Fragment = Be, V.Profiler = Ke, V.PureComponent = pt, V.StrictMode = g, V.Suspense = q, V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Lt, V.act = gi, V.cloneElement = no, V.createContext = tu, V.createElement = uu, V.createFactory = ro, V.createRef = Ln, V.forwardRef = vi, V.isValidElement = hn, V.lazy = pi, V.memo = se, V.startTransition = Go, V.unstable_act = gi, V.useCallback = ir, V.useContext = tt, V.useDebugValue = nt, V.useDeferredValue = Ka, V.useEffect = wn, V.useId = nu, V.useImperativeHandle = qa, V.useInsertionEffect = an, V.useLayoutEffect = cn, V.useMemo = Ga, V.useReducer = yt, V.useRef = vt, V.useState = Ze, V.useSyncExternalStore = ru, V.useTransition = it, V.version = k, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(ev, ev.exports)), ev.exports;
}
process.env.NODE_ENV === "production" ? hE.exports = tD() : hE.exports = nD();
var Jt = hE.exports;
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
  var j = Jt, V = Symbol.for("react.element"), k = Symbol.for("react.fragment"), De = Object.prototype.hasOwnProperty, Se = j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Be = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(Ke, B, G) {
    var pe, q = {}, Ee = null, ie = null;
    G !== void 0 && (Ee = "" + G), B.key !== void 0 && (Ee = "" + B.key), B.ref !== void 0 && (ie = B.ref);
    for (pe in B) De.call(B, pe) && !Be.hasOwnProperty(pe) && (q[pe] = B[pe]);
    if (Ke && Ke.defaultProps) for (pe in B = Ke.defaultProps, B) q[pe] === void 0 && (q[pe] = B[pe]);
    return { $$typeof: V, type: Ke, key: Ee, ref: ie, props: q, _owner: Se.current };
  }
  return Zp.Fragment = k, Zp.jsx = g, Zp.jsxs = g, Zp;
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
    var j = Jt, V = Symbol.for("react.element"), k = Symbol.for("react.portal"), De = Symbol.for("react.fragment"), Se = Symbol.for("react.strict_mode"), Be = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), Ke = Symbol.for("react.context"), B = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), pe = Symbol.for("react.suspense_list"), q = Symbol.for("react.memo"), Ee = Symbol.for("react.lazy"), ie = Symbol.for("react.offscreen"), Ie = Symbol.iterator, St = "@@iterator";
    function mt(R) {
      if (R === null || typeof R != "object")
        return null;
      var $ = Ie && R[Ie] || R[St];
      return typeof $ == "function" ? $ : null;
    }
    var tn = j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ct(R) {
      {
        for (var $ = arguments.length, se = new Array($ > 1 ? $ - 1 : 0), Ce = 1; Ce < $; Ce++)
          se[Ce - 1] = arguments[Ce];
        Ge("error", R, se);
      }
    }
    function Ge(R, $, se) {
      {
        var Ce = tn.ReactDebugCurrentFrame, tt = Ce.getStackAddendum();
        tt !== "" && ($ += "%s", se = se.concat([tt]));
        var Ze = se.map(function(yt) {
          return String(yt);
        });
        Ze.unshift("Warning: " + $), Function.prototype.apply.call(console[R], console, Ze);
      }
    }
    var re = !1, Z = !1, ke = !1, ce = !1, ft = !1, Tt;
    Tt = Symbol.for("react.module.reference");
    function Ct(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === De || R === Be || ft || R === Se || R === G || R === pe || ce || R === ie || re || Z || ke || typeof R == "object" && R !== null && (R.$$typeof === Ee || R.$$typeof === q || R.$$typeof === g || R.$$typeof === Ke || R.$$typeof === B || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Tt || R.getModuleId !== void 0));
    }
    function on(R, $, se) {
      var Ce = R.displayName;
      if (Ce)
        return Ce;
      var tt = $.displayName || $.name || "";
      return tt !== "" ? se + "(" + tt + ")" : se;
    }
    function Ot(R) {
      return R.displayName || "Context";
    }
    function Ae(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && ct("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case De:
          return "Fragment";
        case k:
          return "Portal";
        case Be:
          return "Profiler";
        case Se:
          return "StrictMode";
        case G:
          return "Suspense";
        case pe:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Ke:
            var $ = R;
            return Ot($) + ".Consumer";
          case g:
            var se = R;
            return Ot(se._context) + ".Provider";
          case B:
            return on(R, R.render, "ForwardRef");
          case q:
            var Ce = R.displayName || null;
            return Ce !== null ? Ce : Ae(R.type) || "Memo";
          case Ee: {
            var tt = R, Ze = tt._payload, yt = tt._init;
            try {
              return Ae(yt(Ze));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Pt = Object.assign, Lt = 0, Nt, be, ne, Oe, ue, _, I;
    function Qe() {
    }
    Qe.__reactDisabledLog = !0;
    function Ye() {
      {
        if (Lt === 0) {
          Nt = console.log, be = console.info, ne = console.warn, Oe = console.error, ue = console.group, _ = console.groupCollapsed, I = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Qe,
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
    function dt() {
      {
        if (Lt--, Lt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Pt({}, R, {
              value: Nt
            }),
            info: Pt({}, R, {
              value: be
            }),
            warn: Pt({}, R, {
              value: ne
            }),
            error: Pt({}, R, {
              value: Oe
            }),
            group: Pt({}, R, {
              value: ue
            }),
            groupCollapsed: Pt({}, R, {
              value: _
            }),
            groupEnd: Pt({}, R, {
              value: I
            })
          });
        }
        Lt < 0 && ct("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var lt = tn.ReactCurrentDispatcher, at;
    function ut(R, $, se) {
      {
        if (at === void 0)
          try {
            throw Error();
          } catch (tt) {
            var Ce = tt.stack.trim().match(/\n( *(at )?)/);
            at = Ce && Ce[1] || "";
          }
        return `
` + at + R;
      }
    }
    var pt = !1, Yt;
    {
      var Ln = typeof WeakMap == "function" ? WeakMap : Map;
      Yt = new Ln();
    }
    function br(R, $) {
      if (!R || pt)
        return "";
      {
        var se = Yt.get(R);
        if (se !== void 0)
          return se;
      }
      var Ce;
      pt = !0;
      var tt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Ze;
      Ze = lt.current, lt.current = null, Ye();
      try {
        if ($) {
          var yt = function() {
            throw Error();
          };
          if (Object.defineProperty(yt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(yt, []);
            } catch (nt) {
              Ce = nt;
            }
            Reflect.construct(R, [], yt);
          } else {
            try {
              yt.call();
            } catch (nt) {
              Ce = nt;
            }
            R.call(yt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (nt) {
            Ce = nt;
          }
          R();
        }
      } catch (nt) {
        if (nt && Ce && typeof nt.stack == "string") {
          for (var vt = nt.stack.split(`
`), wn = Ce.stack.split(`
`), an = vt.length - 1, cn = wn.length - 1; an >= 1 && cn >= 0 && vt[an] !== wn[cn]; )
            cn--;
          for (; an >= 1 && cn >= 0; an--, cn--)
            if (vt[an] !== wn[cn]) {
              if (an !== 1 || cn !== 1)
                do
                  if (an--, cn--, cn < 0 || vt[an] !== wn[cn]) {
                    var ir = `
` + vt[an].replace(" at new ", " at ");
                    return R.displayName && ir.includes("<anonymous>") && (ir = ir.replace("<anonymous>", R.displayName)), typeof R == "function" && Yt.set(R, ir), ir;
                  }
                while (an >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        pt = !1, lt.current = Ze, dt(), Error.prepareStackTrace = tt;
      }
      var Ga = R ? R.displayName || R.name : "", qa = Ga ? ut(Ga) : "";
      return typeof R == "function" && Yt.set(R, qa), qa;
    }
    function Rn(R, $, se) {
      return br(R, !1);
    }
    function rr(R) {
      var $ = R.prototype;
      return !!($ && $.isReactComponent);
    }
    function Bn(R, $, se) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return br(R, rr(R));
      if (typeof R == "string")
        return ut(R);
      switch (R) {
        case G:
          return ut("Suspense");
        case pe:
          return ut("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case B:
            return Rn(R.render);
          case q:
            return Bn(R.type, $, se);
          case Ee: {
            var Ce = R, tt = Ce._payload, Ze = Ce._init;
            try {
              return Bn(Ze(tt), $, se);
            } catch {
            }
          }
        }
      return "";
    }
    var In = Object.prototype.hasOwnProperty, $r = {}, ci = tn.ReactDebugCurrentFrame;
    function sa(R) {
      if (R) {
        var $ = R._owner, se = Bn(R.type, R._source, $ ? $.type : null);
        ci.setExtraStackFrame(se);
      } else
        ci.setExtraStackFrame(null);
    }
    function Kn(R, $, se, Ce, tt) {
      {
        var Ze = Function.call.bind(In);
        for (var yt in R)
          if (Ze(R, yt)) {
            var vt = void 0;
            try {
              if (typeof R[yt] != "function") {
                var wn = Error((Ce || "React class") + ": " + se + " type `" + yt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[yt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw wn.name = "Invariant Violation", wn;
              }
              vt = R[yt]($, yt, Ce, se, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (an) {
              vt = an;
            }
            vt && !(vt instanceof Error) && (sa(tt), ct("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Ce || "React class", se, yt, typeof vt), sa(null)), vt instanceof Error && !(vt.message in $r) && ($r[vt.message] = !0, sa(tt), ct("Failed %s type: %s", se, vt.message), sa(null));
          }
      }
    }
    var Tn = Array.isArray;
    function Yn(R) {
      return Tn(R);
    }
    function Sr(R) {
      {
        var $ = typeof Symbol == "function" && Symbol.toStringTag, se = $ && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return se;
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
        return ct("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Sr(R)), Mn(R);
    }
    var ca = tn.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, ae;
    function Le(R) {
      if (In.call(R, "ref")) {
        var $ = Object.getOwnPropertyDescriptor(R, "ref").get;
        if ($ && $.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function ot(R) {
      if (In.call(R, "key")) {
        var $ = Object.getOwnPropertyDescriptor(R, "key").get;
        if ($ && $.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Vt(R, $) {
      typeof R.ref == "string" && ca.current;
    }
    function nn(R, $) {
      {
        var se = function() {
          fi || (fi = !0, ct("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", $));
        };
        se.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: se,
          configurable: !0
        });
      }
    }
    function hn(R, $) {
      {
        var se = function() {
          ae || (ae = !0, ct("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", $));
        };
        se.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: se,
          configurable: !0
        });
      }
    }
    var sn = function(R, $, se, Ce, tt, Ze, yt) {
      var vt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: V,
        // Built-in properties that belong on the element
        type: R,
        key: $,
        ref: se,
        props: yt,
        // Record the component responsible for creating this element.
        _owner: Ze
      };
      return vt._store = {}, Object.defineProperty(vt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(vt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ce
      }), Object.defineProperty(vt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: tt
      }), Object.freeze && (Object.freeze(vt.props), Object.freeze(vt)), vt;
    };
    function Xn(R, $, se, Ce, tt) {
      {
        var Ze, yt = {}, vt = null, wn = null;
        se !== void 0 && (Er(se), vt = "" + se), ot($) && (Er($.key), vt = "" + $.key), Le($) && (wn = $.ref, Vt($, tt));
        for (Ze in $)
          In.call($, Ze) && !Qa.hasOwnProperty(Ze) && (yt[Ze] = $[Ze]);
        if (R && R.defaultProps) {
          var an = R.defaultProps;
          for (Ze in an)
            yt[Ze] === void 0 && (yt[Ze] = an[Ze]);
        }
        if (vt || wn) {
          var cn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          vt && nn(yt, cn), wn && hn(yt, cn);
        }
        return sn(R, vt, wn, tt, Ce, ca.current, yt);
      }
    }
    var rn = tn.ReactCurrentOwner, $t = tn.ReactDebugCurrentFrame;
    function Qt(R) {
      if (R) {
        var $ = R._owner, se = Bn(R.type, R._source, $ ? $.type : null);
        $t.setExtraStackFrame(se);
      } else
        $t.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Cr(R) {
      return typeof R == "object" && R !== null && R.$$typeof === V;
    }
    function wa() {
      {
        if (rn.current) {
          var R = Ae(rn.current.type);
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
        var $ = wa();
        if (!$) {
          var se = typeof R == "string" ? R : R.displayName || R.name;
          se && ($ = `

Check the top-level render call using <` + se + ">.");
        }
        return $;
      }
    }
    function pl(R, $) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var se = eu($);
        if (Jl[se])
          return;
        Jl[se] = !0;
        var Ce = "";
        R && R._owner && R._owner !== rn.current && (Ce = " It was passed a child from " + Ae(R._owner.type) + "."), Qt(R), ct('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', se, Ce), Qt(null);
      }
    }
    function vl(R, $) {
      {
        if (typeof R != "object")
          return;
        if (Yn(R))
          for (var se = 0; se < R.length; se++) {
            var Ce = R[se];
            Cr(Ce) && pl(Ce, $);
          }
        else if (Cr(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var tt = mt(R);
          if (typeof tt == "function" && tt !== R.entries)
            for (var Ze = tt.call(R), yt; !(yt = Ze.next()).done; )
              Cr(yt.value) && pl(yt.value, $);
        }
      }
    }
    function tu(R) {
      {
        var $ = R.type;
        if ($ == null || typeof $ == "string")
          return;
        var se;
        if (typeof $ == "function")
          se = $.propTypes;
        else if (typeof $ == "object" && ($.$$typeof === B || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        $.$$typeof === q))
          se = $.propTypes;
        else
          return;
        if (se) {
          var Ce = Ae($);
          Kn(se, R.props, "prop", Ce, R);
        } else if ($.PropTypes !== void 0 && !fa) {
          fa = !0;
          var tt = Ae($);
          ct("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", tt || "Unknown");
        }
        typeof $.getDefaultProps == "function" && !$.getDefaultProps.isReactClassApproved && ct("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(R) {
      {
        for (var $ = Object.keys(R.props), se = 0; se < $.length; se++) {
          var Ce = $[se];
          if (Ce !== "children" && Ce !== "key") {
            Qt(R), ct("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Ce), Qt(null);
            break;
          }
        }
        R.ref !== null && (Qt(R), ct("Invalid attribute `ref` supplied to `React.Fragment`."), Qt(null));
      }
    }
    var Dr = {};
    function ar(R, $, se, Ce, tt, Ze) {
      {
        var yt = Ct(R);
        if (!yt) {
          var vt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (vt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var wn = Hi();
          wn ? vt += wn : vt += wa();
          var an;
          R === null ? an = "null" : Yn(R) ? an = "array" : R !== void 0 && R.$$typeof === V ? (an = "<" + (Ae(R.type) || "Unknown") + " />", vt = " Did you accidentally export a JSX literal instead of a component?") : an = typeof R, ct("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", an, vt);
        }
        var cn = Xn(R, $, se, tt, Ze);
        if (cn == null)
          return cn;
        if (yt) {
          var ir = $.children;
          if (ir !== void 0)
            if (Ce)
              if (Yn(ir)) {
                for (var Ga = 0; Ga < ir.length; Ga++)
                  vl(ir[Ga], R);
                Object.freeze && Object.freeze(ir);
              } else
                ct("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ir, R);
        }
        if (In.call($, "key")) {
          var qa = Ae(R), nt = Object.keys($).filter(function(nu) {
            return nu !== "key";
          }), it = nt.length > 0 ? "{key: someKey, " + nt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Dr[qa + it]) {
            var Ka = nt.length > 0 ? "{" + nt.join(": ..., ") + ": ...}" : "{}";
            ct(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, it, qa, Ka, qa), Dr[qa + it] = !0;
          }
        }
        return R === De ? _r(cn) : tu(cn), cn;
      }
    }
    function di(R, $, se) {
      return ar(R, $, se, !0);
    }
    function Wa(R, $, se) {
      return ar(R, $, se, !1);
    }
    var pi = Wa, vi = di;
    Jp.Fragment = De, Jp.jsx = pi, Jp.jsxs = vi;
  }()), Jp;
}
process.env.NODE_ENV === "production" ? vE.exports = rD() : vE.exports = aD();
var _e = vE.exports, mE = { exports: {} }, Ia = {}, Qm = { exports: {} }, dE = {};
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
  return aT || (aT = 1, function(j) {
    function V(ne, Oe) {
      var ue = ne.length;
      ne.push(Oe);
      e: for (; 0 < ue; ) {
        var _ = ue - 1 >>> 1, I = ne[_];
        if (0 < Se(I, Oe)) ne[_] = Oe, ne[ue] = I, ue = _;
        else break e;
      }
    }
    function k(ne) {
      return ne.length === 0 ? null : ne[0];
    }
    function De(ne) {
      if (ne.length === 0) return null;
      var Oe = ne[0], ue = ne.pop();
      if (ue !== Oe) {
        ne[0] = ue;
        e: for (var _ = 0, I = ne.length, Qe = I >>> 1; _ < Qe; ) {
          var Ye = 2 * (_ + 1) - 1, dt = ne[Ye], lt = Ye + 1, at = ne[lt];
          if (0 > Se(dt, ue)) lt < I && 0 > Se(at, dt) ? (ne[_] = at, ne[lt] = ue, _ = lt) : (ne[_] = dt, ne[Ye] = ue, _ = Ye);
          else if (lt < I && 0 > Se(at, ue)) ne[_] = at, ne[lt] = ue, _ = lt;
          else break e;
        }
      }
      return Oe;
    }
    function Se(ne, Oe) {
      var ue = ne.sortIndex - Oe.sortIndex;
      return ue !== 0 ? ue : ne.id - Oe.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Be = performance;
      j.unstable_now = function() {
        return Be.now();
      };
    } else {
      var g = Date, Ke = g.now();
      j.unstable_now = function() {
        return g.now() - Ke;
      };
    }
    var B = [], G = [], pe = 1, q = null, Ee = 3, ie = !1, Ie = !1, St = !1, mt = typeof setTimeout == "function" ? setTimeout : null, tn = typeof clearTimeout == "function" ? clearTimeout : null, ct = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ge(ne) {
      for (var Oe = k(G); Oe !== null; ) {
        if (Oe.callback === null) De(G);
        else if (Oe.startTime <= ne) De(G), Oe.sortIndex = Oe.expirationTime, V(B, Oe);
        else break;
        Oe = k(G);
      }
    }
    function re(ne) {
      if (St = !1, Ge(ne), !Ie) if (k(B) !== null) Ie = !0, Nt(Z);
      else {
        var Oe = k(G);
        Oe !== null && be(re, Oe.startTime - ne);
      }
    }
    function Z(ne, Oe) {
      Ie = !1, St && (St = !1, tn(ft), ft = -1), ie = !0;
      var ue = Ee;
      try {
        for (Ge(Oe), q = k(B); q !== null && (!(q.expirationTime > Oe) || ne && !on()); ) {
          var _ = q.callback;
          if (typeof _ == "function") {
            q.callback = null, Ee = q.priorityLevel;
            var I = _(q.expirationTime <= Oe);
            Oe = j.unstable_now(), typeof I == "function" ? q.callback = I : q === k(B) && De(B), Ge(Oe);
          } else De(B);
          q = k(B);
        }
        if (q !== null) var Qe = !0;
        else {
          var Ye = k(G);
          Ye !== null && be(re, Ye.startTime - Oe), Qe = !1;
        }
        return Qe;
      } finally {
        q = null, Ee = ue, ie = !1;
      }
    }
    var ke = !1, ce = null, ft = -1, Tt = 5, Ct = -1;
    function on() {
      return !(j.unstable_now() - Ct < Tt);
    }
    function Ot() {
      if (ce !== null) {
        var ne = j.unstable_now();
        Ct = ne;
        var Oe = !0;
        try {
          Oe = ce(!0, ne);
        } finally {
          Oe ? Ae() : (ke = !1, ce = null);
        }
      } else ke = !1;
    }
    var Ae;
    if (typeof ct == "function") Ae = function() {
      ct(Ot);
    };
    else if (typeof MessageChannel < "u") {
      var Pt = new MessageChannel(), Lt = Pt.port2;
      Pt.port1.onmessage = Ot, Ae = function() {
        Lt.postMessage(null);
      };
    } else Ae = function() {
      mt(Ot, 0);
    };
    function Nt(ne) {
      ce = ne, ke || (ke = !0, Ae());
    }
    function be(ne, Oe) {
      ft = mt(function() {
        ne(j.unstable_now());
      }, Oe);
    }
    j.unstable_IdlePriority = 5, j.unstable_ImmediatePriority = 1, j.unstable_LowPriority = 4, j.unstable_NormalPriority = 3, j.unstable_Profiling = null, j.unstable_UserBlockingPriority = 2, j.unstable_cancelCallback = function(ne) {
      ne.callback = null;
    }, j.unstable_continueExecution = function() {
      Ie || ie || (Ie = !0, Nt(Z));
    }, j.unstable_forceFrameRate = function(ne) {
      0 > ne || 125 < ne ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Tt = 0 < ne ? Math.floor(1e3 / ne) : 5;
    }, j.unstable_getCurrentPriorityLevel = function() {
      return Ee;
    }, j.unstable_getFirstCallbackNode = function() {
      return k(B);
    }, j.unstable_next = function(ne) {
      switch (Ee) {
        case 1:
        case 2:
        case 3:
          var Oe = 3;
          break;
        default:
          Oe = Ee;
      }
      var ue = Ee;
      Ee = Oe;
      try {
        return ne();
      } finally {
        Ee = ue;
      }
    }, j.unstable_pauseExecution = function() {
    }, j.unstable_requestPaint = function() {
    }, j.unstable_runWithPriority = function(ne, Oe) {
      switch (ne) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          ne = 3;
      }
      var ue = Ee;
      Ee = ne;
      try {
        return Oe();
      } finally {
        Ee = ue;
      }
    }, j.unstable_scheduleCallback = function(ne, Oe, ue) {
      var _ = j.unstable_now();
      switch (typeof ue == "object" && ue !== null ? (ue = ue.delay, ue = typeof ue == "number" && 0 < ue ? _ + ue : _) : ue = _, ne) {
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
      return I = ue + I, ne = { id: pe++, callback: Oe, priorityLevel: ne, startTime: ue, expirationTime: I, sortIndex: -1 }, ue > _ ? (ne.sortIndex = ue, V(G, ne), k(B) === null && ne === k(G) && (St ? (tn(ft), ft = -1) : St = !0, be(re, ue - _))) : (ne.sortIndex = I, V(B, ne), Ie || ie || (Ie = !0, Nt(Z))), ne;
    }, j.unstable_shouldYield = on, j.unstable_wrapCallback = function(ne) {
      var Oe = Ee;
      return function() {
        var ue = Ee;
        Ee = Oe;
        try {
          return ne.apply(this, arguments);
        } finally {
          Ee = ue;
        }
      };
    };
  }(dE)), dE;
}
var pE = {};
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
  return iT || (iT = 1, function(j) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var V = !1, k = 5;
      function De(ae, Le) {
        var ot = ae.length;
        ae.push(Le), g(ae, Le, ot);
      }
      function Se(ae) {
        return ae.length === 0 ? null : ae[0];
      }
      function Be(ae) {
        if (ae.length === 0)
          return null;
        var Le = ae[0], ot = ae.pop();
        return ot !== Le && (ae[0] = ot, Ke(ae, ot, 0)), Le;
      }
      function g(ae, Le, ot) {
        for (var Vt = ot; Vt > 0; ) {
          var nn = Vt - 1 >>> 1, hn = ae[nn];
          if (B(hn, Le) > 0)
            ae[nn] = Le, ae[Vt] = hn, Vt = nn;
          else
            return;
        }
      }
      function Ke(ae, Le, ot) {
        for (var Vt = ot, nn = ae.length, hn = nn >>> 1; Vt < hn; ) {
          var sn = (Vt + 1) * 2 - 1, Xn = ae[sn], rn = sn + 1, $t = ae[rn];
          if (B(Xn, Le) < 0)
            rn < nn && B($t, Xn) < 0 ? (ae[Vt] = $t, ae[rn] = Le, Vt = rn) : (ae[Vt] = Xn, ae[sn] = Le, Vt = sn);
          else if (rn < nn && B($t, Le) < 0)
            ae[Vt] = $t, ae[rn] = Le, Vt = rn;
          else
            return;
        }
      }
      function B(ae, Le) {
        var ot = ae.sortIndex - Le.sortIndex;
        return ot !== 0 ? ot : ae.id - Le.id;
      }
      var G = 1, pe = 2, q = 3, Ee = 4, ie = 5;
      function Ie(ae, Le) {
      }
      var St = typeof performance == "object" && typeof performance.now == "function";
      if (St) {
        var mt = performance;
        j.unstable_now = function() {
          return mt.now();
        };
      } else {
        var tn = Date, ct = tn.now();
        j.unstable_now = function() {
          return tn.now() - ct;
        };
      }
      var Ge = 1073741823, re = -1, Z = 250, ke = 5e3, ce = 1e4, ft = Ge, Tt = [], Ct = [], on = 1, Ot = null, Ae = q, Pt = !1, Lt = !1, Nt = !1, be = typeof setTimeout == "function" ? setTimeout : null, ne = typeof clearTimeout == "function" ? clearTimeout : null, Oe = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ue(ae) {
        for (var Le = Se(Ct); Le !== null; ) {
          if (Le.callback === null)
            Be(Ct);
          else if (Le.startTime <= ae)
            Be(Ct), Le.sortIndex = Le.expirationTime, De(Tt, Le);
          else
            return;
          Le = Se(Ct);
        }
      }
      function _(ae) {
        if (Nt = !1, ue(ae), !Lt)
          if (Se(Tt) !== null)
            Lt = !0, Mn(I);
          else {
            var Le = Se(Ct);
            Le !== null && Er(_, Le.startTime - ae);
          }
      }
      function I(ae, Le) {
        Lt = !1, Nt && (Nt = !1, ca()), Pt = !0;
        var ot = Ae;
        try {
          var Vt;
          if (!V) return Qe(ae, Le);
        } finally {
          Ot = null, Ae = ot, Pt = !1;
        }
      }
      function Qe(ae, Le) {
        var ot = Le;
        for (ue(ot), Ot = Se(Tt); Ot !== null && !(Ot.expirationTime > ot && (!ae || ci())); ) {
          var Vt = Ot.callback;
          if (typeof Vt == "function") {
            Ot.callback = null, Ae = Ot.priorityLevel;
            var nn = Ot.expirationTime <= ot, hn = Vt(nn);
            ot = j.unstable_now(), typeof hn == "function" ? Ot.callback = hn : Ot === Se(Tt) && Be(Tt), ue(ot);
          } else
            Be(Tt);
          Ot = Se(Tt);
        }
        if (Ot !== null)
          return !0;
        var sn = Se(Ct);
        return sn !== null && Er(_, sn.startTime - ot), !1;
      }
      function Ye(ae, Le) {
        switch (ae) {
          case G:
          case pe:
          case q:
          case Ee:
          case ie:
            break;
          default:
            ae = q;
        }
        var ot = Ae;
        Ae = ae;
        try {
          return Le();
        } finally {
          Ae = ot;
        }
      }
      function dt(ae) {
        var Le;
        switch (Ae) {
          case G:
          case pe:
          case q:
            Le = q;
            break;
          default:
            Le = Ae;
            break;
        }
        var ot = Ae;
        Ae = Le;
        try {
          return ae();
        } finally {
          Ae = ot;
        }
      }
      function lt(ae) {
        var Le = Ae;
        return function() {
          var ot = Ae;
          Ae = Le;
          try {
            return ae.apply(this, arguments);
          } finally {
            Ae = ot;
          }
        };
      }
      function at(ae, Le, ot) {
        var Vt = j.unstable_now(), nn;
        if (typeof ot == "object" && ot !== null) {
          var hn = ot.delay;
          typeof hn == "number" && hn > 0 ? nn = Vt + hn : nn = Vt;
        } else
          nn = Vt;
        var sn;
        switch (ae) {
          case G:
            sn = re;
            break;
          case pe:
            sn = Z;
            break;
          case ie:
            sn = ft;
            break;
          case Ee:
            sn = ce;
            break;
          case q:
          default:
            sn = ke;
            break;
        }
        var Xn = nn + sn, rn = {
          id: on++,
          callback: Le,
          priorityLevel: ae,
          startTime: nn,
          expirationTime: Xn,
          sortIndex: -1
        };
        return nn > Vt ? (rn.sortIndex = nn, De(Ct, rn), Se(Tt) === null && rn === Se(Ct) && (Nt ? ca() : Nt = !0, Er(_, nn - Vt))) : (rn.sortIndex = Xn, De(Tt, rn), !Lt && !Pt && (Lt = !0, Mn(I))), rn;
      }
      function ut() {
      }
      function pt() {
        !Lt && !Pt && (Lt = !0, Mn(I));
      }
      function Yt() {
        return Se(Tt);
      }
      function Ln(ae) {
        ae.callback = null;
      }
      function br() {
        return Ae;
      }
      var Rn = !1, rr = null, Bn = -1, In = k, $r = -1;
      function ci() {
        var ae = j.unstable_now() - $r;
        return !(ae < In);
      }
      function sa() {
      }
      function Kn(ae) {
        if (ae < 0 || ae > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ae > 0 ? In = Math.floor(1e3 / ae) : In = k;
      }
      var Tn = function() {
        if (rr !== null) {
          var ae = j.unstable_now();
          $r = ae;
          var Le = !0, ot = !0;
          try {
            ot = rr(Le, ae);
          } finally {
            ot ? Yn() : (Rn = !1, rr = null);
          }
        } else
          Rn = !1;
      }, Yn;
      if (typeof Oe == "function")
        Yn = function() {
          Oe(Tn);
        };
      else if (typeof MessageChannel < "u") {
        var Sr = new MessageChannel(), $a = Sr.port2;
        Sr.port1.onmessage = Tn, Yn = function() {
          $a.postMessage(null);
        };
      } else
        Yn = function() {
          be(Tn, 0);
        };
      function Mn(ae) {
        rr = ae, Rn || (Rn = !0, Yn());
      }
      function Er(ae, Le) {
        Bn = be(function() {
          ae(j.unstable_now());
        }, Le);
      }
      function ca() {
        ne(Bn), Bn = -1;
      }
      var Qa = sa, fi = null;
      j.unstable_IdlePriority = ie, j.unstable_ImmediatePriority = G, j.unstable_LowPriority = Ee, j.unstable_NormalPriority = q, j.unstable_Profiling = fi, j.unstable_UserBlockingPriority = pe, j.unstable_cancelCallback = Ln, j.unstable_continueExecution = pt, j.unstable_forceFrameRate = Kn, j.unstable_getCurrentPriorityLevel = br, j.unstable_getFirstCallbackNode = Yt, j.unstable_next = dt, j.unstable_pauseExecution = ut, j.unstable_requestPaint = Qa, j.unstable_runWithPriority = Ye, j.unstable_scheduleCallback = at, j.unstable_shouldYield = ci, j.unstable_wrapCallback = lt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(pE)), pE;
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
  var j = Jt, V = fT();
  function k(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var De = /* @__PURE__ */ new Set(), Se = {};
  function Be(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (Se[n] = r, n = 0; n < r.length; n++) De.add(r[n]);
  }
  var Ke = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), B = Object.prototype.hasOwnProperty, G = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, pe = {}, q = {};
  function Ee(n) {
    return B.call(q, n) ? !0 : B.call(pe, n) ? !1 : G.test(n) ? q[n] = !0 : (pe[n] = !0, !1);
  }
  function ie(n, r, l, o) {
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
  function Ie(n, r, l, o) {
    if (r === null || typeof r > "u" || ie(n, r, l, o)) return !0;
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
  function St(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var mt = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    mt[n] = new St(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    mt[r] = new St(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    mt[n] = new St(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    mt[n] = new St(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    mt[n] = new St(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    mt[n] = new St(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    mt[n] = new St(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    mt[n] = new St(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    mt[n] = new St(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var tn = /[\-:]([a-z])/g;
  function ct(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      tn,
      ct
    );
    mt[r] = new St(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(tn, ct);
    mt[r] = new St(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(tn, ct);
    mt[r] = new St(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    mt[n] = new St(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), mt.xlinkHref = new St("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    mt[n] = new St(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Ge(n, r, l, o) {
    var c = mt.hasOwnProperty(r) ? mt[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (Ie(r, l, c, o) && (l = null), o || c === null ? Ee(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var re = j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Z = Symbol.for("react.element"), ke = Symbol.for("react.portal"), ce = Symbol.for("react.fragment"), ft = Symbol.for("react.strict_mode"), Tt = Symbol.for("react.profiler"), Ct = Symbol.for("react.provider"), on = Symbol.for("react.context"), Ot = Symbol.for("react.forward_ref"), Ae = Symbol.for("react.suspense"), Pt = Symbol.for("react.suspense_list"), Lt = Symbol.for("react.memo"), Nt = Symbol.for("react.lazy"), be = Symbol.for("react.offscreen"), ne = Symbol.iterator;
  function Oe(n) {
    return n === null || typeof n != "object" ? null : (n = ne && n[ne] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ue = Object.assign, _;
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
  var Qe = !1;
  function Ye(n, r) {
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
      Qe = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? I(n) : "";
  }
  function dt(n) {
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
        return n = Ye(n.type, !1), n;
      case 11:
        return n = Ye(n.type.render, !1), n;
      case 1:
        return n = Ye(n.type, !0), n;
      default:
        return "";
    }
  }
  function lt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case ce:
        return "Fragment";
      case ke:
        return "Portal";
      case Tt:
        return "Profiler";
      case ft:
        return "StrictMode";
      case Ae:
        return "Suspense";
      case Pt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case on:
        return (n.displayName || "Context") + ".Consumer";
      case Ct:
        return (n._context.displayName || "Context") + ".Provider";
      case Ot:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Lt:
        return r = n.displayName || null, r !== null ? r : lt(n.type) || "Memo";
      case Nt:
        r = n._payload, n = n._init;
        try {
          return lt(n(r));
        } catch {
        }
    }
    return null;
  }
  function at(n) {
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
        return lt(r);
      case 8:
        return r === ft ? "StrictMode" : "Mode";
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
  function ut(n) {
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
  function pt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Yt(n) {
    var r = pt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
  function Ln(n) {
    n._valueTracker || (n._valueTracker = Yt(n));
  }
  function br(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = pt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
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
    return ue({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Bn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = ut(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function In(n, r) {
    r = r.checked, r != null && Ge(n, "checked", r, !1);
  }
  function $r(n, r) {
    In(n, r);
    var l = ut(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, ut(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
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
      for (l = "" + ut(l), r = null, c = 0; c < n.length; c++) {
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
    if (r.dangerouslySetInnerHTML != null) throw Error(k(91));
    return ue({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Sr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(k(92));
        if (Kn(l)) {
          if (1 < l.length) throw Error(k(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: ut(l) };
  }
  function $a(n, r) {
    var l = ut(r.value), o = ut(r.defaultValue);
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
  function ae(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Le = {
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
  Object.keys(Le).forEach(function(n) {
    ot.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Le[r] = Le[n];
    });
  });
  function Vt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Le.hasOwnProperty(n) && Le[n] ? ("" + r).trim() : r + "px";
  }
  function nn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Vt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var hn = ue({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (hn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(k(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(k(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(k(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(k(62));
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
  function $t(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Qt = null, fa = null, Cr = null;
  function wa(n) {
    if (n = ze(n)) {
      if (typeof Qt != "function") throw Error(k(280));
      var r = n.stateNode;
      r && (r = yn(r), Qt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? Cr ? Cr.push(n) : Cr = [n] : fa = n;
  }
  function Jl() {
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
    if (l && typeof l != "function") throw Error(k(231, r, typeof l));
    return l;
  }
  var Dr = !1;
  if (Ke) try {
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
  var Wa = !1, pi = null, vi = !1, R = null, $ = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function se(n, r, l, o, c, d, m, E, T) {
    Wa = !1, pi = null, di.apply($, arguments);
  }
  function Ce(n, r, l, o, c, d, m, E, T) {
    if (se.apply(this, arguments), Wa) {
      if (Wa) {
        var U = pi;
        Wa = !1, pi = null;
      } else throw Error(k(198));
      vi || (vi = !0, R = U);
    }
  }
  function tt(n) {
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
  function Ze(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function yt(n) {
    if (tt(n) !== n) throw Error(k(188));
  }
  function vt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = tt(n), r === null) throw Error(k(188));
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
          if (d === l) return yt(c), n;
          if (d === o) return yt(c), r;
          d = d.sibling;
        }
        throw Error(k(188));
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
          if (!m) throw Error(k(189));
        }
      }
      if (l.alternate !== o) throw Error(k(190));
    }
    if (l.tag !== 3) throw Error(k(188));
    return l.stateNode.current === l ? n : r;
  }
  function wn(n) {
    return n = vt(n), n !== null ? an(n) : null;
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
  var cn = V.unstable_scheduleCallback, ir = V.unstable_cancelCallback, Ga = V.unstable_shouldYield, qa = V.unstable_requestPaint, nt = V.unstable_now, it = V.unstable_getCurrentPriorityLevel, Ka = V.unstable_ImmediatePriority, nu = V.unstable_UserBlockingPriority, ru = V.unstable_NormalPriority, hl = V.unstable_LowPriority, Wu = V.unstable_IdlePriority, ml = null, Qr = null;
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
  var zt = 0;
  function Zu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Dt, Qo, hi, Xe, Ju, lr = !1, mi = [], Or = null, yi = null, fn = null, Wt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), $n = [], Lr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
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
        Wt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = ze(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
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
        return Wt.set(d, iu(Wt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Go(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = tt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Ze(l), r !== null) {
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
      } else return r = ze(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function Gf() {
    lr = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), fn !== null && El(fn) && (fn = null), Wt.forEach(lu), Sl.forEach(lu);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, lr || (lr = !0, V.unstable_scheduleCallback(V.unstable_NormalPriority, Gf)));
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
    for (Or !== null && ba(Or, n), yi !== null && ba(yi, n), fn !== null && ba(fn, n), Wt.forEach(r), Sl.forEach(r), l = 0; l < $n.length; l++) o = $n[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < $n.length && (l = $n[0], l.blockedOn === null); ) Go(l), l.blockedOn === null && $n.shift();
  }
  var gi = re.ReactCurrentBatchConfig, _a = !0;
  function eo(n, r, l, o) {
    var c = zt, d = gi.transition;
    gi.transition = null;
    try {
      zt = 1, Cl(n, r, l, o);
    } finally {
      zt = c, gi.transition = d;
    }
  }
  function to(n, r, l, o) {
    var c = zt, d = gi.transition;
    gi.transition = null;
    try {
      zt = 4, Cl(n, r, l, o);
    } finally {
      zt = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = no(n, r, l, o);
      if (c === null) Sc(n, r, o, uu, l), xa(n, o);
      else if (Wo(c, n, r, l, o)) o.stopPropagation();
      else if (xa(n, o), r & 4 && -1 < Lr.indexOf(n)) {
        for (; c !== null; ) {
          var d = ze(c);
          if (d !== null && Dt(d), d = no(n, r, l, o), d === null && Sc(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Sc(n, r, o, null, l);
    }
  }
  var uu = null;
  function no(n, r, l, o) {
    if (uu = null, n = $t(o), n = vu(n), n !== null) if (r = tt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Ze(r), n !== null) return n;
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
        switch (it()) {
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
  function z() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function F(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function te() {
    return !0;
  }
  function je() {
    return !1;
  }
  function oe(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? te : je, this.isPropagationStopped = je, this;
    }
    return ue(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = te);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = te);
    }, persist: function() {
    }, isPersistent: te }), r;
  }
  var Pe = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, gt = oe(Pe), kt = ue({}, Pe, { view: 0, detail: 0 }), ln = oe(kt), Gt, st, qt, mn = ue({}, kt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== qt && (qt && n.type === "mousemove" ? (Gt = n.screenX - qt.screenX, st = n.screenY - qt.screenY) : st = Gt = 0, qt = n), Gt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : st;
  } }), Rl = oe(mn), qo = ue({}, mn, { dataTransfer: 0 }), Bi = oe(qo), Ko = ue({}, kt, { relatedTarget: 0 }), ou = oe(Ko), qf = ue({}, Pe, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), oc = oe(qf), Kf = ue({}, Pe, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), tv = oe(Kf), Xf = ue({}, Pe, { data: 0 }), Zf = oe(Xf), nv = {
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
  }, Km = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Km[n]) ? !!r[n] : !1;
  }
  function Jf() {
    return Ii;
  }
  var ed = ue({}, kt, { key: function(n) {
    if (n.key) {
      var r = nv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = F(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? rv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jf, charCode: function(n) {
    return n.type === "keypress" ? F(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? F(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), td = oe(ed), nd = ue({}, mn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), av = oe(nd), sc = ue({}, kt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jf }), iv = oe(sc), Wr = ue({}, Pe, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = oe(Wr), Nn = ue({}, mn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = oe(Nn), rd = [9, 13, 27, 32], ao = Ke && "CompositionEvent" in window, Xo = null;
  Ke && "documentMode" in document && (Xo = document.documentMode);
  var Zo = Ke && "TextEvent" in window && !Xo, lv = Ke && (!ao || Xo && 8 < Xo && 11 >= Xo), uv = " ", cc = !1;
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
  function Xm(n, r) {
    if (io) return n === "compositionend" || !ao && ov(n, r) ? (n = z(), C = h = ei = null, io = !1, n) : null;
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
  var Zm = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function fv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Zm[n.type] : r === "textarea";
  }
  function ad(n, r, l, o) {
    Hi(o), r = as(r, "onChange"), 0 < r.length && (l = new gt("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function dv(n) {
    du(n, 0);
  }
  function Jo(n) {
    var r = ni(n);
    if (br(r)) return n;
  }
  function Jm(n, r) {
    if (n === "change") return r;
  }
  var pv = !1;
  if (Ke) {
    var id;
    if (Ke) {
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
      ad(r, su, n, $t(n)), tu(dv, r);
    }
  }
  function ey(n, r, l) {
    n === "focusin" ? (hv(), Si = r, su = l, Si.attachEvent("onpropertychange", mv)) : n === "focusout" && hv();
  }
  function yv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Jo(su);
  }
  function ty(n, r) {
    if (n === "click") return Jo(r);
  }
  function gv(n, r) {
    if (n === "input" || n === "change") return Jo(r);
  }
  function ny(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : ny;
  function es(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!B.call(r, c) || !ti(n[c], r[c])) return !1;
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
  var ry = Ke && "documentMode" in document && 11 >= document.documentMode, uo = null, ud = null, ns = null, od = !1;
  function sd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    od || uo == null || uo !== Rn(o) || (o = uo, "selectionStart" in o && dc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ns && es(ns, o) || (ns = o, o = as(ud, "onSelect"), 0 < o.length && (r = new gt("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = uo)));
  }
  function pc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: pc("Animation", "AnimationEnd"), animationiteration: pc("Animation", "AnimationIteration"), animationstart: pc("Animation", "AnimationStart"), transitionend: pc("Transition", "TransitionEnd") }, ur = {}, cd = {};
  Ke && (cd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function vc(n) {
    if (ur[n]) return ur[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in cd) return ur[n] = r[l];
    return n;
  }
  var Ev = vc("animationend"), Cv = vc("animationiteration"), Rv = vc("animationstart"), Tv = vc("transitionend"), fd = /* @__PURE__ */ new Map(), hc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Da(n, r) {
    fd.set(n, r), Be(r, [n]);
  }
  for (var dd = 0; dd < hc.length; dd++) {
    var fu = hc[dd], ay = fu.toLowerCase(), iy = fu[0].toUpperCase() + fu.slice(1);
    Da(ay, "on" + iy);
  }
  Da(Ev, "onAnimationEnd"), Da(Cv, "onAnimationIteration"), Da(Rv, "onAnimationStart"), Da("dblclick", "onDoubleClick"), Da("focusin", "onFocus"), Da("focusout", "onBlur"), Da(Tv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), Be("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Be("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Be("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Be("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Be("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Be("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), pd = new Set("cancel close invalid load scroll toggle".split(" ").concat(rs));
  function mc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, Ce(o, r, void 0, n), n.currentTarget = null;
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
  function Bt(n, r) {
    var l = r[us];
    l === void 0 && (l = r[us] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (wv(r, n, 2, !1), l.add(o));
  }
  function yc(n, r, l) {
    var o = 0;
    r && (o |= 4), wv(l, n, o, r);
  }
  var gc = "_reactListening" + Math.random().toString(36).slice(2);
  function oo(n) {
    if (!n[gc]) {
      n[gc] = !0, De.forEach(function(l) {
        l !== "selectionchange" && (pd.has(l) || yc(l, !1, n), yc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[gc] || (r[gc] = !0, yc("selectionchange", !1, r));
    }
  }
  function wv(n, r, l, o) {
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
      var U = d, K = $t(l), J = [];
      e: {
        var W = fd.get(n);
        if (W !== void 0) {
          var he = gt, Re = n;
          switch (n) {
            case "keypress":
              if (F(l) === 0) break e;
            case "keydown":
            case "keyup":
              he = td;
              break;
            case "focusin":
              Re = "focus", he = ou;
              break;
            case "focusout":
              Re = "blur", he = ou;
              break;
            case "beforeblur":
            case "afterblur":
              he = ou;
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
              he = Rl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              he = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              he = iv;
              break;
            case Ev:
            case Cv:
            case Rv:
              he = oc;
              break;
            case Tv:
              he = Yi;
              break;
            case "scroll":
              he = ln;
              break;
            case "wheel":
              he = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              he = tv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              he = av;
          }
          var xe = (r & 4) !== 0, kn = !xe && n === "scroll", D = xe ? W !== null ? W + "Capture" : null : W;
          xe = [];
          for (var x = U, M; x !== null; ) {
            M = x;
            var X = M.stateNode;
            if (M.tag === 5 && X !== null && (M = X, D !== null && (X = _r(x, D), X != null && xe.push(so(x, X, M)))), kn) break;
            x = x.return;
          }
          0 < xe.length && (W = new he(W, Re, null, l, K), J.push({ event: W, listeners: xe }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (W = n === "mouseover" || n === "pointerover", he = n === "mouseout" || n === "pointerout", W && l !== rn && (Re = l.relatedTarget || l.fromElement) && (vu(Re) || Re[Qi])) break e;
          if ((he || W) && (W = K.window === K ? K : (W = K.ownerDocument) ? W.defaultView || W.parentWindow : window, he ? (Re = l.relatedTarget || l.toElement, he = U, Re = Re ? vu(Re) : null, Re !== null && (kn = tt(Re), Re !== kn || Re.tag !== 5 && Re.tag !== 6) && (Re = null)) : (he = null, Re = U), he !== Re)) {
            if (xe = Rl, X = "onMouseLeave", D = "onMouseEnter", x = "mouse", (n === "pointerout" || n === "pointerover") && (xe = av, X = "onPointerLeave", D = "onPointerEnter", x = "pointer"), kn = he == null ? W : ni(he), M = Re == null ? W : ni(Re), W = new xe(X, x + "leave", he, l, K), W.target = kn, W.relatedTarget = M, X = null, vu(K) === U && (xe = new xe(D, x + "enter", Re, l, K), xe.target = M, xe.relatedTarget = kn, X = xe), kn = X, he && Re) t: {
              for (xe = he, D = Re, x = 0, M = xe; M; M = wl(M)) x++;
              for (M = 0, X = D; X; X = wl(X)) M++;
              for (; 0 < x - M; ) xe = wl(xe), x--;
              for (; 0 < M - x; ) D = wl(D), M--;
              for (; x--; ) {
                if (xe === D || D !== null && xe === D.alternate) break t;
                xe = wl(xe), D = wl(D);
              }
              xe = null;
            }
            else xe = null;
            he !== null && xv(J, W, he, xe, !1), Re !== null && kn !== null && xv(J, kn, Re, xe, !0);
          }
        }
        e: {
          if (W = U ? ni(U) : window, he = W.nodeName && W.nodeName.toLowerCase(), he === "select" || he === "input" && W.type === "file") var Te = Jm;
          else if (fv(W)) if (pv) Te = gv;
          else {
            Te = yv;
            var He = ey;
          }
          else (he = W.nodeName) && he.toLowerCase() === "input" && (W.type === "checkbox" || W.type === "radio") && (Te = ty);
          if (Te && (Te = Te(n, U))) {
            ad(J, Te, l, K);
            break e;
          }
          He && He(n, W, U), n === "focusout" && (He = W._wrapperState) && He.controlled && W.type === "number" && sa(W, "number", W.value);
        }
        switch (He = U ? ni(U) : window, n) {
          case "focusin":
            (fv(He) || He.contentEditable === "true") && (uo = He, ud = U, ns = null);
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
            od = !1, sd(J, l, K);
            break;
          case "selectionchange":
            if (ry) break;
          case "keydown":
          case "keyup":
            sd(J, l, K);
        }
        var Ve;
        if (ao) e: {
          switch (n) {
            case "compositionstart":
              var qe = "onCompositionStart";
              break e;
            case "compositionend":
              qe = "onCompositionEnd";
              break e;
            case "compositionupdate":
              qe = "onCompositionUpdate";
              break e;
          }
          qe = void 0;
        }
        else io ? ov(n, l) && (qe = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (qe = "onCompositionStart");
        qe && (lv && l.locale !== "ko" && (io || qe !== "onCompositionStart" ? qe === "onCompositionEnd" && io && (Ve = z()) : (ei = K, h = "value" in ei ? ei.value : ei.textContent, io = !0)), He = as(U, qe), 0 < He.length && (qe = new Zf(qe, n, null, l, K), J.push({ event: qe, listeners: He }), Ve ? qe.data = Ve : (Ve = sv(l), Ve !== null && (qe.data = Ve)))), (Ve = Zo ? cv(n, l) : Xm(n, l)) && (U = as(U, "onBeforeInput"), 0 < U.length && (K = new Zf("onBeforeInput", "beforeinput", null, l, K), J.push({ event: K, listeners: U }), K.data = Ve));
      }
      du(J, r);
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
  function xv(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, T = E.alternate, U = E.stateNode;
      if (T !== null && T === o) break;
      E.tag === 5 && U !== null && (E = U, c ? (T = _r(l, d), T != null && m.unshift(so(l, T, E))) : c || (T = _r(l, d), T != null && m.push(so(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var bv = /\r\n?/g, ly = /\u0000|\uFFFD/g;
  function _v(n) {
    return (typeof n == "string" ? n : "" + n).replace(bv, `
`).replace(ly, "");
  }
  function Ec(n, r, l) {
    if (r = _v(r), _v(n) !== r && l) throw Error(k(425));
  }
  function xl() {
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
  var bl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + bl, ls = "__reactProps$" + bl, Qi = "__reactContainer$" + bl, us = "__reactEvents$" + bl, po = "__reactListeners$" + bl, uy = "__reactHandles$" + bl;
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
  function ze(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(k(33));
  }
  function yn(n) {
    return n[ls] || null;
  }
  var wt = [], ka = -1;
  function Oa(n) {
    return { current: n };
  }
  function un(n) {
    0 > ka || (n.current = wt[ka], wt[ka] = null, ka--);
  }
  function Ne(n, r) {
    ka++, wt[ka] = n.current, n.current = r;
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
    if (Cn.current !== Rr) throw Error(k(168));
    Ne(Cn, r), Ne(Qn, l);
  }
  function os(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(k(108, at(n) || "Unknown", c));
    return ue({}, l, o);
  }
  function Zn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Rr, Gr = Cn.current, Ne(Cn, n), Ne(Qn, Qn.current), !0;
  }
  function wc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(k(169));
    l ? (n = os(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, un(Qn), un(Cn), Ne(Cn, n)) : un(Qn), Ne(Qn, l);
  }
  var Ri = null, ho = !1, Wi = !1;
  function xc(n) {
    Ri === null ? Ri = [n] : Ri.push(n);
  }
  function _l(n) {
    ho = !0, xc(n);
  }
  function Ti() {
    if (!Wi && Ri !== null) {
      Wi = !0;
      var n = 0, r = zt;
      try {
        var l = Ri;
        for (zt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ri = null, ho = !1;
      } catch (c) {
        throw Ri !== null && (Ri = Ri.slice(n + 1)), cn(Ka, Ti), c;
      } finally {
        zt = r, Wi = !1;
      }
    }
    return null;
  }
  var Dl = [], kl = 0, Ol = null, Gi = 0, Un = [], La = 0, pa = null, wi = 1, xi = "";
  function hu(n, r) {
    Dl[kl++] = Gi, Dl[kl++] = Ol, Ol = n, Gi = r;
  }
  function Lv(n, r, l) {
    Un[La++] = wi, Un[La++] = xi, Un[La++] = pa, pa = n;
    var o = wi;
    n = xi;
    var c = 32 - kr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - kr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, wi = 1 << 32 - kr(r) + c | l << c | o, xi = d + n;
    } else wi = 1 << d | l << c | o, xi = n;
  }
  function bc(n) {
    n.return !== null && (hu(n, 1), Lv(n, 1, 0));
  }
  function _c(n) {
    for (; n === Ol; ) Ol = Dl[--kl], Dl[kl] = null, Gi = Dl[--kl], Dl[kl] = null;
    for (; n === pa; ) pa = Un[--La], Un[La] = null, xi = Un[--La], Un[La] = null, wi = Un[--La], Un[La] = null;
  }
  var Kr = null, Xr = null, pn = !1, Ma = null;
  function hd(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Mv(n, r) {
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
  function md(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function yd(n) {
    if (pn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Mv(n, r)) {
          if (md(n)) throw Error(k(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && Mv(n, r) ? hd(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Kr = n);
        }
      } else {
        if (md(n)) throw Error(k(418));
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
      if (md(n)) throw ss(), Error(k(418));
      for (; r; ) hd(n, r), r = Ei(r.nextSibling);
    }
    if (Wn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(k(317));
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
  function Ll() {
    Xr = Kr = null, pn = !1;
  }
  function qi(n) {
    Ma === null ? Ma = [n] : Ma.push(n);
  }
  var oy = re.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(k(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(k(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(k(284));
      if (!l._owner) throw Error(k(290, n));
    }
    return n;
  }
  function kc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(k(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Nv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(D, x) {
      if (n) {
        var M = D.deletions;
        M === null ? (D.deletions = [x], D.flags |= 16) : M.push(x);
      }
    }
    function l(D, x) {
      if (!n) return null;
      for (; x !== null; ) r(D, x), x = x.sibling;
      return null;
    }
    function o(D, x) {
      for (D = /* @__PURE__ */ new Map(); x !== null; ) x.key !== null ? D.set(x.key, x) : D.set(x.index, x), x = x.sibling;
      return D;
    }
    function c(D, x) {
      return D = Hl(D, x), D.index = 0, D.sibling = null, D;
    }
    function d(D, x, M) {
      return D.index = M, n ? (M = D.alternate, M !== null ? (M = M.index, M < x ? (D.flags |= 2, x) : M) : (D.flags |= 2, x)) : (D.flags |= 1048576, x);
    }
    function m(D) {
      return n && D.alternate === null && (D.flags |= 2), D;
    }
    function E(D, x, M, X) {
      return x === null || x.tag !== 6 ? (x = Gd(M, D.mode, X), x.return = D, x) : (x = c(x, M), x.return = D, x);
    }
    function T(D, x, M, X) {
      var Te = M.type;
      return Te === ce ? K(D, x, M.props.children, X, M.key) : x !== null && (x.elementType === Te || typeof Te == "object" && Te !== null && Te.$$typeof === Nt && Nv(Te) === x.type) ? (X = c(x, M.props), X.ref = mu(D, x, M), X.return = D, X) : (X = Hs(M.type, M.key, M.props, null, D.mode, X), X.ref = mu(D, x, M), X.return = D, X);
    }
    function U(D, x, M, X) {
      return x === null || x.tag !== 4 || x.stateNode.containerInfo !== M.containerInfo || x.stateNode.implementation !== M.implementation ? (x = sf(M, D.mode, X), x.return = D, x) : (x = c(x, M.children || []), x.return = D, x);
    }
    function K(D, x, M, X, Te) {
      return x === null || x.tag !== 7 ? (x = tl(M, D.mode, X, Te), x.return = D, x) : (x = c(x, M), x.return = D, x);
    }
    function J(D, x, M) {
      if (typeof x == "string" && x !== "" || typeof x == "number") return x = Gd("" + x, D.mode, M), x.return = D, x;
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case Z:
            return M = Hs(x.type, x.key, x.props, null, D.mode, M), M.ref = mu(D, null, x), M.return = D, M;
          case ke:
            return x = sf(x, D.mode, M), x.return = D, x;
          case Nt:
            var X = x._init;
            return J(D, X(x._payload), M);
        }
        if (Kn(x) || Oe(x)) return x = tl(x, D.mode, M, null), x.return = D, x;
        kc(D, x);
      }
      return null;
    }
    function W(D, x, M, X) {
      var Te = x !== null ? x.key : null;
      if (typeof M == "string" && M !== "" || typeof M == "number") return Te !== null ? null : E(D, x, "" + M, X);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case Z:
            return M.key === Te ? T(D, x, M, X) : null;
          case ke:
            return M.key === Te ? U(D, x, M, X) : null;
          case Nt:
            return Te = M._init, W(
              D,
              x,
              Te(M._payload),
              X
            );
        }
        if (Kn(M) || Oe(M)) return Te !== null ? null : K(D, x, M, X, null);
        kc(D, M);
      }
      return null;
    }
    function he(D, x, M, X, Te) {
      if (typeof X == "string" && X !== "" || typeof X == "number") return D = D.get(M) || null, E(x, D, "" + X, Te);
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case Z:
            return D = D.get(X.key === null ? M : X.key) || null, T(x, D, X, Te);
          case ke:
            return D = D.get(X.key === null ? M : X.key) || null, U(x, D, X, Te);
          case Nt:
            var He = X._init;
            return he(D, x, M, He(X._payload), Te);
        }
        if (Kn(X) || Oe(X)) return D = D.get(M) || null, K(x, D, X, Te, null);
        kc(x, X);
      }
      return null;
    }
    function Re(D, x, M, X) {
      for (var Te = null, He = null, Ve = x, qe = x = 0, tr = null; Ve !== null && qe < M.length; qe++) {
        Ve.index > qe ? (tr = Ve, Ve = null) : tr = Ve.sibling;
        var jt = W(D, Ve, M[qe], X);
        if (jt === null) {
          Ve === null && (Ve = tr);
          break;
        }
        n && Ve && jt.alternate === null && r(D, Ve), x = d(jt, x, qe), He === null ? Te = jt : He.sibling = jt, He = jt, Ve = tr;
      }
      if (qe === M.length) return l(D, Ve), pn && hu(D, qe), Te;
      if (Ve === null) {
        for (; qe < M.length; qe++) Ve = J(D, M[qe], X), Ve !== null && (x = d(Ve, x, qe), He === null ? Te = Ve : He.sibling = Ve, He = Ve);
        return pn && hu(D, qe), Te;
      }
      for (Ve = o(D, Ve); qe < M.length; qe++) tr = he(Ve, D, qe, M[qe], X), tr !== null && (n && tr.alternate !== null && Ve.delete(tr.key === null ? qe : tr.key), x = d(tr, x, qe), He === null ? Te = tr : He.sibling = tr, He = tr);
      return n && Ve.forEach(function(Bl) {
        return r(D, Bl);
      }), pn && hu(D, qe), Te;
    }
    function xe(D, x, M, X) {
      var Te = Oe(M);
      if (typeof Te != "function") throw Error(k(150));
      if (M = Te.call(M), M == null) throw Error(k(151));
      for (var He = Te = null, Ve = x, qe = x = 0, tr = null, jt = M.next(); Ve !== null && !jt.done; qe++, jt = M.next()) {
        Ve.index > qe ? (tr = Ve, Ve = null) : tr = Ve.sibling;
        var Bl = W(D, Ve, jt.value, X);
        if (Bl === null) {
          Ve === null && (Ve = tr);
          break;
        }
        n && Ve && Bl.alternate === null && r(D, Ve), x = d(Bl, x, qe), He === null ? Te = Bl : He.sibling = Bl, He = Bl, Ve = tr;
      }
      if (jt.done) return l(
        D,
        Ve
      ), pn && hu(D, qe), Te;
      if (Ve === null) {
        for (; !jt.done; qe++, jt = M.next()) jt = J(D, jt.value, X), jt !== null && (x = d(jt, x, qe), He === null ? Te = jt : He.sibling = jt, He = jt);
        return pn && hu(D, qe), Te;
      }
      for (Ve = o(D, Ve); !jt.done; qe++, jt = M.next()) jt = he(Ve, D, qe, jt.value, X), jt !== null && (n && jt.alternate !== null && Ve.delete(jt.key === null ? qe : jt.key), x = d(jt, x, qe), He === null ? Te = jt : He.sibling = jt, He = jt);
      return n && Ve.forEach(function(hh) {
        return r(D, hh);
      }), pn && hu(D, qe), Te;
    }
    function kn(D, x, M, X) {
      if (typeof M == "object" && M !== null && M.type === ce && M.key === null && (M = M.props.children), typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case Z:
            e: {
              for (var Te = M.key, He = x; He !== null; ) {
                if (He.key === Te) {
                  if (Te = M.type, Te === ce) {
                    if (He.tag === 7) {
                      l(D, He.sibling), x = c(He, M.props.children), x.return = D, D = x;
                      break e;
                    }
                  } else if (He.elementType === Te || typeof Te == "object" && Te !== null && Te.$$typeof === Nt && Nv(Te) === He.type) {
                    l(D, He.sibling), x = c(He, M.props), x.ref = mu(D, He, M), x.return = D, D = x;
                    break e;
                  }
                  l(D, He);
                  break;
                } else r(D, He);
                He = He.sibling;
              }
              M.type === ce ? (x = tl(M.props.children, D.mode, X, M.key), x.return = D, D = x) : (X = Hs(M.type, M.key, M.props, null, D.mode, X), X.ref = mu(D, x, M), X.return = D, D = X);
            }
            return m(D);
          case ke:
            e: {
              for (He = M.key; x !== null; ) {
                if (x.key === He) if (x.tag === 4 && x.stateNode.containerInfo === M.containerInfo && x.stateNode.implementation === M.implementation) {
                  l(D, x.sibling), x = c(x, M.children || []), x.return = D, D = x;
                  break e;
                } else {
                  l(D, x);
                  break;
                }
                else r(D, x);
                x = x.sibling;
              }
              x = sf(M, D.mode, X), x.return = D, D = x;
            }
            return m(D);
          case Nt:
            return He = M._init, kn(D, x, He(M._payload), X);
        }
        if (Kn(M)) return Re(D, x, M, X);
        if (Oe(M)) return xe(D, x, M, X);
        kc(D, M);
      }
      return typeof M == "string" && M !== "" || typeof M == "number" ? (M = "" + M, x !== null && x.tag === 6 ? (l(D, x.sibling), x = c(x, M), x.return = D, D = x) : (l(D, x), x = Gd(M, D.mode, X), x.return = D, D = x), m(D)) : l(D, x);
    }
    return kn;
  }
  var xn = yu(!0), fe = yu(!1), va = Oa(null), Zr = null, mo = null, gd = null;
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
      if (Zr === null) throw Error(k(308));
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
  function wd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function zv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ml(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, xt & 2) {
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
  function Uv(n, r) {
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
      var J = c.baseState;
      m = 0, K = U = T = null, E = d;
      do {
        var W = E.lane, he = E.eventTime;
        if ((o & W) === W) {
          K !== null && (K = K.next = {
            eventTime: he,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var Re = n, xe = E;
            switch (W = r, he = l, xe.tag) {
              case 1:
                if (Re = xe.payload, typeof Re == "function") {
                  J = Re.call(he, J, W);
                  break e;
                }
                J = Re;
                break e;
              case 3:
                Re.flags = Re.flags & -65537 | 128;
              case 0:
                if (Re = xe.payload, W = typeof Re == "function" ? Re.call(he, J, W) : Re, W == null) break e;
                J = ue({}, J, W);
                break e;
              case 2:
                ma = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, W = c.effects, W === null ? c.effects = [E] : W.push(E));
        } else he = { eventTime: he, lane: W, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, K === null ? (U = K = he, T = J) : K = K.next = he, m |= W;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          W = E, E = W.next, W.next = null, c.lastBaseUpdate = W, c.shared.pending = null;
        }
      } while (!0);
      if (K === null && (T = J), c.baseState = T, c.firstBaseUpdate = U, c.lastBaseUpdate = K, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = J;
    }
  }
  function xd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(k(191, c));
        c.call(o);
      }
    }
  }
  var fs = {}, bi = Oa(fs), ds = Oa(fs), ps = Oa(fs);
  function Su(n) {
    if (n === fs) throw Error(k(174));
    return n;
  }
  function bd(n, r) {
    switch (Ne(ps, r), Ne(ds, n), Ne(bi, fs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    un(bi), Ne(bi, r);
  }
  function Eu() {
    un(bi), un(ds), un(ps);
  }
  function Av(n) {
    Su(ps.current);
    var r = Su(bi.current), l = ca(r, n.type);
    r !== l && (Ne(ds, n), Ne(bi, l));
  }
  function Lc(n) {
    ds.current === n && (un(bi), un(ds));
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
  var vs = [];
  function Ue() {
    for (var n = 0; n < vs.length; n++) vs[n]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var ht = re.ReactCurrentDispatcher, Ut = re.ReactCurrentBatchConfig, Kt = 0, At = null, An = null, Jn = null, Nc = !1, hs = !1, Cu = 0, Q = 0;
  function Mt() {
    throw Error(k(321));
  }
  function $e(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Nl(n, r, l, o, c, d) {
    if (Kt = d, At = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, ht.current = n === null || n.memoizedState === null ? Gc : Cs, n = l(o, c), hs) {
      d = 0;
      do {
        if (hs = !1, Cu = 0, 25 <= d) throw Error(k(301));
        d += 1, Jn = An = null, r.updateQueue = null, ht.current = qc, n = l(o, c);
      } while (hs);
    }
    if (ht.current = bu, r = An !== null && An.next !== null, Kt = 0, Jn = An = At = null, Nc = !1, r) throw Error(k(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function Tr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jn === null ? At.memoizedState = Jn = n : Jn = Jn.next = n, Jn;
  }
  function bn() {
    if (An === null) {
      var n = At.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = An.next;
    var r = Jn === null ? At.memoizedState : Jn.next;
    if (r !== null) Jn = r, An = n;
    else {
      if (n === null) throw Error(k(310));
      An = n, n = { memoizedState: An.memoizedState, baseState: An.baseState, baseQueue: An.baseQueue, queue: An.queue, next: null }, Jn === null ? At.memoizedState = Jn = n : Jn = Jn.next = n;
    }
    return Jn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function zl(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(k(311));
    l.lastRenderedReducer = n;
    var o = An, c = o.baseQueue, d = l.pending;
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
        if ((Kt & K) === K) T !== null && (T = T.next = { lane: 0, action: U.action, hasEagerState: U.hasEagerState, eagerState: U.eagerState, next: null }), o = U.hasEagerState ? U.eagerState : n(o, U.action);
        else {
          var J = {
            lane: K,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null
          };
          T === null ? (E = T = J, m = o) : T = T.next = J, At.lanes |= K, Oi |= K;
        }
        U = U.next;
      } while (U !== null && U !== d);
      T === null ? m = o : T.next = E, ti(o, r.memoizedState) || (jn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, At.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Ru(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(k(311));
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
    var l = At, o = bn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, jn = !0), o = o.queue, ms(Fc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jn !== null && Jn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Tu(9, jc.bind(null, l, o, c, r), void 0, null), Gn === null) throw Error(k(349));
      Kt & 30 || Ac(l, r, c);
    }
    return c;
  }
  function Ac(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = At.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, At.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
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
    r !== null && Ur(r, n, 1, -1);
  }
  function Vc(n) {
    var r = Tr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = xu.bind(null, At, n), [r.memoizedState, n];
  }
  function Tu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = At.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, At.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Bc() {
    return bn().memoizedState;
  }
  function yo(n, r, l, o) {
    var c = Tr();
    At.flags |= n, c.memoizedState = Tu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function go(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (An !== null) {
      var m = An.memoizedState;
      if (d = m.destroy, o !== null && $e(o, m.deps)) {
        c.memoizedState = Tu(r, l, d, o);
        return;
      }
    }
    At.flags |= n, c.memoizedState = Tu(1 | r, l, d, o);
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
  function wu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function $c(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(4, 4, wu.bind(null, r, n), l);
  }
  function gs() {
  }
  function Qc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && $e(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Wc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && $e(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function _d(n, r, l) {
    return Kt & 21 ? (ti(l, r) || (l = Ku(), At.lanes |= l, Oi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, jn = !0), n.memoizedState = l);
  }
  function Ss(n, r) {
    var l = zt;
    zt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Ut.transition;
    Ut.transition = {};
    try {
      n(!1), r();
    } finally {
      zt = l, Ut.transition = o;
    }
  }
  function Dd() {
    return bn().memoizedState;
  }
  function Es(n, r, l) {
    var o = Li(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Jr(n)) jv(r, l);
    else if (l = Td(n, r, l, o), l !== null) {
      var c = Pn();
      Ur(l, n, o, c), en(l, r, o);
    }
  }
  function xu(n, r, l) {
    var o = Li(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
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
      l = Td(n, r, c, o), l !== null && (c = Pn(), Ur(l, n, o, c), en(l, r, o));
    }
  }
  function Jr(n) {
    var r = n.alternate;
    return n === At || r !== null && r === At;
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
  var bu = { readContext: Na, useCallback: Mt, useContext: Mt, useEffect: Mt, useImperativeHandle: Mt, useInsertionEffect: Mt, useLayoutEffect: Mt, useMemo: Mt, useReducer: Mt, useRef: Mt, useState: Mt, useDebugValue: Mt, useDeferredValue: Mt, useTransition: Mt, useMutableSource: Mt, useSyncExternalStore: Mt, useId: Mt, unstable_isNewReconciler: !1 }, Gc = { readContext: Na, useCallback: function(n, r) {
    return Tr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Na, useEffect: Ic, useImperativeHandle: function(n, r, l) {
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
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Es.bind(null, At, n), [o.memoizedState, n];
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
    var o = At, c = Tr();
    if (pn) {
      if (l === void 0) throw Error(k(407));
      l = l();
    } else {
      if (l = r(), Gn === null) throw Error(k(349));
      Kt & 30 || Ac(o, r, l);
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
      var l = xi, o = wi;
      l = (o & ~(1 << 32 - kr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = Q++, r = ":" + r + "r" + l.toString(32) + ":";
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
      return _d(r, An.memoizedState, n);
    },
    useTransition: function() {
      var n = zl(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: zc,
    useSyncExternalStore: Uc,
    useId: Dd,
    unstable_isNewReconciler: !1
  }, qc = { readContext: Na, useCallback: Qc, useContext: Na, useEffect: ms, useImperativeHandle: $c, useInsertionEffect: Yc, useLayoutEffect: ys, useMemo: Wc, useReducer: Ru, useRef: Bc, useState: function() {
    return Ru(Xi);
  }, useDebugValue: gs, useDeferredValue: function(n) {
    var r = bn();
    return An === null ? r.memoizedState = n : _d(r, An.memoizedState, n);
  }, useTransition: function() {
    var n = Ru(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: zc, useSyncExternalStore: Uc, useId: Dd, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = ue({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function kd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ue({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Kc = { isMounted: function(n) {
    return (n = n._reactInternals) ? tt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Li(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ml(n, d, c), r !== null && (Ur(r, n, c, o), Oc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Li(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ml(n, d, c), r !== null && (Ur(r, n, c, o), Oc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Pn(), o = Li(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ml(n, c, o), r !== null && (Ur(r, n, o, l), Oc(r, n, o));
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
    c.props = l, c.state = n.memoizedState, c.refs = {}, wd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Na(d) : (d = zn(r) ? Gr : Cn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (kd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Kc.enqueueReplaceState(c, c.state, null), cs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += dt(o), o = o.return;
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
  function Ld(n, r) {
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
      wo || (wo = !0, Ou = o), Ld(n, r);
    }, l;
  }
  function Md(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Ld(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Ld(n, r), typeof o != "function" && (jl === null ? jl = /* @__PURE__ */ new Set([this]) : jl.add(this));
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
    c.has(l) || (c.add(l), n = hy.bind(null, n, r, l), r.then(n, n));
  }
  function Vv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Ul(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ml(l, r, 1))), l.lanes |= 1), n);
  }
  var Ts = re.ReactCurrentOwner, jn = !1;
  function or(n, r, l, o) {
    r.child = n === null ? fe(r, null, l, o) : xn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gn(r, c), o = Nl(n, r, l, o, d, c), l = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ua(n, r, c)) : (pn && l && bc(r), r.flags |= 1, or(n, r, o, c), r.child);
  }
  function Du(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Wd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, rt(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref) return Ua(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function rt(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref) if (jn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (jn = !0);
      else return r.lanes = n.lanes, Ua(n, r, c);
    }
    return Bv(n, r, l, o, c);
  }
  function ws(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ne(Co, ya), ya |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Ne(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Ne(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Ne(Co, ya), ya |= o;
    return or(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Bv(n, r, l, o, c) {
    var d = zn(l) ? Gr : Cn.current;
    return d = qr(r, d), gn(r, c), l = Nl(n, r, l, o, d, c), o = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ua(n, r, c)) : (pn && o && bc(r), r.flags |= 1, or(n, r, l, c), r.child);
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
      var K = l.getDerivedStateFromProps, J = typeof K == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      J || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== U) && Hv(r, m, o, U), ma = !1;
      var W = r.memoizedState;
      m.state = W, cs(r, o, m, c), T = r.memoizedState, E !== o || W !== T || Qn.current || ma ? (typeof K == "function" && (kd(r, l, K, o), T = r.memoizedState), (E = ma || Fv(r, l, E, o, W, T, U)) ? (J || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = U, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, zv(n, r), E = r.memoizedProps, U = r.type === r.elementType ? E : ai(r.type, E), m.props = U, J = r.pendingProps, W = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Na(T) : (T = zn(l) ? Gr : Cn.current, T = qr(r, T));
      var he = l.getDerivedStateFromProps;
      (K = typeof he == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== J || W !== T) && Hv(r, m, o, T), ma = !1, W = r.memoizedState, m.state = W, cs(r, o, m, c);
      var Re = r.memoizedState;
      E !== J || W !== Re || Qn.current || ma ? (typeof he == "function" && (kd(r, l, he, o), Re = r.memoizedState), (U = ma || Fv(r, l, U, o, W, Re, T) || !1) ? (K || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Re, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Re, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && W === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && W === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Re), m.props = o, m.state = Re, m.context = T, o = U) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && W === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && W === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return xs(n, r, l, o, d, c);
  }
  function xs(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && wc(r, l, !1), Ua(n, r, d);
    o = r.stateNode, Ts.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = xn(r, n.child, null, d), r.child = xn(r, null, E, d)) : or(n, r, E, d), r.memoizedState = o.state, c && wc(r, l, !0), r.child;
  }
  function So(n) {
    var r = n.stateNode;
    r.pendingContext ? Ov(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Ov(n, r.context, !1), bd(n, r.containerInfo);
  }
  function Yv(n, r, l, o, c) {
    return Ll(), qi(c), r.flags |= 256, or(n, r, l, o), r.child;
  }
  var Jc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ud(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function ef(n, r, l) {
    var o = r.pendingProps, c = Sn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Ne(Sn, c & 1), n === null)
      return yd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ud(l), r.memoizedState = Jc, n) : Ad(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return $v(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Hl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Hl(E, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ud(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = Jc, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Ad(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function bs(n, r, l, o) {
    return o !== null && qi(o), xn(r, n.child, null, l), n = Ad(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function $v(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Od(Error(k(422))), bs(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && xn(r, n.child, null, m), r.child.memoizedState = Ud(m), r.memoizedState = Jc, d);
    if (!(r.mode & 1)) return bs(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(k(419)), o = Od(d, o, void 0), bs(n, r, m, o);
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
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), Ur(o, n, c, -1));
      }
      return Qd(), o = Od(Error(k(421))), bs(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = my.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, pn = !0, Ma = null, n !== null && (Un[La++] = wi, Un[La++] = xi, Un[La++] = pa, wi = n.id, xi = n.overflow, pa = r), r = Ad(r, o.children), r.flags |= 4096, r);
  }
  function jd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Cd(n.return, r, l);
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
    if (Ne(Sn, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Mc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Mr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Mc(n) === null) {
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
  function za(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ua(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(k(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function _s(n, r, l) {
    switch (r.tag) {
      case 3:
        So(r), Ll();
        break;
      case 5:
        Av(r);
        break;
      case 1:
        zn(r.type) && Zn(r);
        break;
      case 4:
        bd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Ne(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Ne(Sn, Sn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? ef(n, r, l) : (Ne(Sn, Sn.current & 1), n = Ua(n, r, l), n !== null ? n.sibling : null);
        Ne(Sn, Sn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Ne(Sn, Sn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, ws(n, r, l);
    }
    return Ua(n, r, l);
  }
  var Aa, Fn, Qv, Wv;
  Aa = function(n, r) {
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
          c = ue({}, c, { value: void 0 }), o = ue({}, o, { value: void 0 }), d = [];
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
      for (U in c) if (!o.hasOwnProperty(U) && c.hasOwnProperty(U) && c[U] != null) if (U === "style") {
        var E = c[U];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else U !== "dangerouslySetInnerHTML" && U !== "children" && U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && U !== "autoFocus" && (Se.hasOwnProperty(U) ? d || (d = []) : (d = d || []).push(U, null));
      for (U in o) {
        var T = o[U];
        if (E = c != null ? c[U] : void 0, o.hasOwnProperty(U) && T !== E && (T != null || E != null)) if (U === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          U,
          l
        )), l = T;
        else U === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(U, T)) : U === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(U, "" + T) : U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && (Se.hasOwnProperty(U) ? (T != null && U === "onScroll" && Bt("scroll", n), d || E === T || (d = [])) : (d = d || []).push(U, T));
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
        return o = r.stateNode, Eu(), un(Qn), un(Cn), Ue(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ma !== null && (Lu(Ma), Ma = null))), Fn(n, r), er(r), null;
      case 5:
        Lc(r);
        var c = Su(ps.current);
        if (l = r.type, n !== null && r.stateNode != null) Qv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(k(166));
            return er(r), null;
          }
          if (n = Su(bi.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[ls] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Bt("cancel", o), Bt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Bt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < rs.length; c++) Bt(rs[c], o);
                break;
              case "source":
                Bt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Bt(
                  "error",
                  o
                ), Bt("load", o);
                break;
              case "details":
                Bt("toggle", o);
                break;
              case "input":
                Bn(o, d), Bt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Bt("invalid", o);
                break;
              case "textarea":
                Sr(o, d), Bt("invalid", o);
            }
            sn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var E = d[m];
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Ec(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Ec(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : Se.hasOwnProperty(m) && E != null && m === "onScroll" && Bt("scroll", o);
            }
            switch (l) {
              case "input":
                Ln(o), ci(o, d, !0);
                break;
              case "textarea":
                Ln(o), Mn(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = xl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Er(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[ls] = o, Aa(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Xn(l, o), l) {
                case "dialog":
                  Bt("cancel", n), Bt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Bt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < rs.length; c++) Bt(rs[c], n);
                  c = o;
                  break;
                case "source":
                  Bt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Bt(
                    "error",
                    n
                  ), Bt("load", n), c = o;
                  break;
                case "details":
                  Bt("toggle", n), c = o;
                  break;
                case "input":
                  Bn(n, o), c = rr(n, o), Bt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ue({}, o, { value: void 0 }), Bt("invalid", n);
                  break;
                case "textarea":
                  Sr(n, o), c = Yn(n, o), Bt("invalid", n);
                  break;
                default:
                  c = o;
              }
              sn(l, c), E = c;
              for (d in E) if (E.hasOwnProperty(d)) {
                var T = E[d];
                d === "style" ? nn(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && fi(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && ae(n, T) : typeof T == "number" && ae(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (Se.hasOwnProperty(d) ? T != null && d === "onScroll" && Bt("scroll", n) : T != null && Ge(n, d, T, m));
              }
              switch (l) {
                case "input":
                  Ln(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Ln(n), Mn(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + ut(o.value));
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
        if (n && r.stateNode != null) Wv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(k(166));
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
          if (pn && Xr !== null && r.mode & 1 && !(r.flags & 128)) ss(), Ll(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(k(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(k(317));
              d[Ci] = r;
            } else Ll(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            er(r), d = !1;
          } else Ma !== null && (Lu(Ma), Ma = null), d = !0;
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
            if (m = Mc(n), m !== null) {
              for (r.flags |= 128, Ds(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return Ne(Sn, Sn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && nt() > To && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Mc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ds(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return er(r), null;
          } else 2 * nt() - d.renderingStartTime > To && l !== 1073741824 && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = nt(), r.sibling = null, l = Sn.current, Ne(Sn, o ? l & 1 | 2 : l & 1), r) : (er(r), null);
      case 22:
      case 23:
        return $d(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ya & 1073741824 && (er(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : er(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(k(156, r.tag));
  }
  function tf(n, r) {
    switch (_c(r), r.tag) {
      case 1:
        return zn(r.type) && vo(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), un(Qn), un(Cn), Ue(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Lc(r), null;
      case 13:
        if (un(Sn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(k(340));
          Ll();
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
  var ks = !1, wr = !1, sy = typeof WeakSet == "function" ? WeakSet : Set, ge = null;
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
          var m = 0, E = -1, T = -1, U = 0, K = 0, J = n, W = null;
          t: for (; ; ) {
            for (var he; J !== l || c !== 0 && J.nodeType !== 3 || (E = m + c), J !== d || o !== 0 && J.nodeType !== 3 || (T = m + o), J.nodeType === 3 && (m += J.nodeValue.length), (he = J.firstChild) !== null; )
              W = J, J = he;
            for (; ; ) {
              if (J === n) break t;
              if (W === l && ++U === c && (E = m), W === d && ++K === o && (T = m), (he = J.nextSibling) !== null) break;
              J = W, W = J.parentNode;
            }
            J = he;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, ge = r; ge !== null; ) if (r = ge, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, ge = n;
    else for (; ge !== null; ) {
      r = ge;
      try {
        var Re = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Re !== null) {
              var xe = Re.memoizedProps, kn = Re.memoizedState, D = r.stateNode, x = D.getSnapshotBeforeUpdate(r.elementType === r.type ? xe : ai(r.type, xe), kn);
              D.__reactInternalSnapshotBeforeUpdate = x;
            }
            break;
          case 3:
            var M = r.stateNode.containerInfo;
            M.nodeType === 1 ? M.textContent = "" : M.nodeType === 9 && M.documentElement && M.removeChild(M.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(k(163));
        }
      } catch (X) {
        vn(r, r.return, X);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, ge = n;
        break;
      }
      ge = r.return;
    }
    return Re = qv, qv = !1, Re;
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
    r !== null && (n.alternate = null, rf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[ls], delete r[us], delete r[po], delete r[uy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ms(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Zi(n) {
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
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = xl));
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
        wr || Eo(l, r);
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
        if (!wr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && nf(l, r, m), c = c.next;
          } while (c !== o);
        }
        zr(n, r, l);
        break;
      case 1:
        if (!wr && (Eo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
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
        l.mode & 1 ? (wr = (o = wr) || l.memoizedState !== null, zr(n, r, l), wr = o) : zr(n, r, l);
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
      l === null && (l = n.stateNode = new sy()), r.forEach(function(o) {
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
        if (_n === null) throw Error(k(160));
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
            Os(3, n, n.return), Ls(3, n);
          } catch (xe) {
            vn(n, n.return, xe);
          }
          try {
            Os(5, n, n.return);
          } catch (xe) {
            vn(n, n.return, xe);
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
            ae(c, "");
          } catch (xe) {
            vn(n, n.return, xe);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && In(c, d), Xn(E, m);
            var U = Xn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var K = T[m], J = T[m + 1];
              K === "style" ? nn(c, J) : K === "dangerouslySetInnerHTML" ? fi(c, J) : K === "children" ? ae(c, J) : Ge(c, K, J, U);
            }
            switch (E) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var W = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var he = d.value;
                he != null ? Tn(c, !!d.multiple, he, !1) : W !== !!d.multiple && (d.defaultValue != null ? Tn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Tn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[ls] = d;
          } catch (xe) {
            vn(n, n.return, xe);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(k(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (xe) {
            vn(n, n.return, xe);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Ja(r.containerInfo);
        } catch (xe) {
          vn(n, n.return, xe);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Bd = nt())), o & 4 && Zv(n);
        break;
      case 22:
        if (K = l !== null && l.memoizedState !== null, n.mode & 1 ? (wr = (U = wr) || K, ii(r, n), wr = U) : ii(r, n), ta(n), o & 8192) {
          if (U = n.memoizedState !== null, (n.stateNode.isHidden = U) && !K && n.mode & 1) for (ge = n, K = n.child; K !== null; ) {
            for (J = ge = K; ge !== null; ) {
              switch (W = ge, he = W.child, W.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, W, W.return);
                  break;
                case 1:
                  Eo(W, W.return);
                  var Re = W.stateNode;
                  if (typeof Re.componentWillUnmount == "function") {
                    o = W, l = W.return;
                    try {
                      r = o, Re.props = r.memoizedProps, Re.state = r.memoizedState, Re.componentWillUnmount();
                    } catch (xe) {
                      vn(o, l, xe);
                    }
                  }
                  break;
                case 5:
                  Eo(W, W.return);
                  break;
                case 22:
                  if (W.memoizedState !== null) {
                    Ns(J);
                    continue;
                  }
              }
              he !== null ? (he.return = W, ge = he) : Ns(J);
            }
            K = K.sibling;
          }
          e: for (K = null, J = n; ; ) {
            if (J.tag === 5) {
              if (K === null) {
                K = J;
                try {
                  c = J.stateNode, U ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = J.stateNode, T = J.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = Vt("display", m));
                } catch (xe) {
                  vn(n, n.return, xe);
                }
              }
            } else if (J.tag === 6) {
              if (K === null) try {
                J.stateNode.nodeValue = U ? "" : J.memoizedProps;
              } catch (xe) {
                vn(n, n.return, xe);
              }
            } else if ((J.tag !== 22 && J.tag !== 23 || J.memoizedState === null || J === n) && J.child !== null) {
              J.child.return = J, J = J.child;
              continue;
            }
            if (J === n) break e;
            for (; J.sibling === null; ) {
              if (J.return === null || J.return === n) break e;
              K === J && (K = null), J = J.return;
            }
            K === J && (K = null), J.sibling.return = J.return, J = J.sibling;
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
            if (Ms(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(k(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (ae(c, ""), o.flags &= -33);
            var d = Zi(n);
            ki(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Zi(n);
            Di(n, E, m);
            break;
          default:
            throw Error(k(161));
        }
      } catch (T) {
        vn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function cy(n, r, l) {
    ge = n, Pd(n);
  }
  function Pd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; ge !== null; ) {
      var c = ge, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || ks;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || wr;
          E = ks;
          var U = wr;
          if (ks = m, (wr = T) && !U) for (ge = c; ge !== null; ) m = ge, T = m.child, m.tag === 22 && m.memoizedState !== null ? Vd(c) : T !== null ? (T.return = m, ge = T) : Vd(c);
          for (; d !== null; ) ge = d, Pd(d), d = d.sibling;
          ge = c, ks = E, wr = U;
        }
        Jv(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, ge = d) : Jv(n);
    }
  }
  function Jv(n) {
    for (; ge !== null; ) {
      var r = ge;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              wr || Ls(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !wr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && xd(r, d, o);
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
                xd(r, m, l);
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
                    var J = K.dehydrated;
                    J !== null && Ja(J);
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
              throw Error(k(163));
          }
          wr || r.flags & 512 && Fd(r);
        } catch (W) {
          vn(r, r.return, W);
        }
      }
      if (r === n) {
        ge = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, ge = l;
        break;
      }
      ge = r.return;
    }
  }
  function Ns(n) {
    for (; ge !== null; ) {
      var r = ge;
      if (r === n) {
        ge = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, ge = l;
        break;
      }
      ge = r.return;
    }
  }
  function Vd(n) {
    for (; ge !== null; ) {
      var r = ge;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
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
        ge = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, ge = E;
        break;
      }
      ge = r.return;
    }
  }
  var fy = Math.ceil, Al = re.ReactCurrentDispatcher, ku = re.ReactCurrentOwner, sr = re.ReactCurrentBatchConfig, xt = 0, Gn = null, Hn = null, cr = 0, ya = 0, Co = Oa(0), Dn = 0, zs = null, Oi = 0, Ro = 0, af = 0, Us = null, na = null, Bd = 0, To = 1 / 0, ga = null, wo = !1, Ou = null, jl = null, lf = !1, Ji = null, As = 0, Fl = 0, xo = null, js = -1, xr = 0;
  function Pn() {
    return xt & 6 ? nt() : js !== -1 ? js : js = nt();
  }
  function Li(n) {
    return n.mode & 1 ? xt & 2 && cr !== 0 ? cr & -cr : oy.transition !== null ? (xr === 0 && (xr = Ku()), xr) : (n = zt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ro(n.type)), n) : 1;
  }
  function Ur(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, xo = null, Error(k(185));
    Pi(n, l, o), (!(xt & 2) || n !== Gn) && (n === Gn && (!(xt & 2) && (Ro |= l), Dn === 4 && li(n, cr)), ra(n, o), l === 1 && xt === 0 && !(r.mode & 1) && (To = nt() + 500, ho && Ti()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Za(n, n === Gn ? cr : 0);
    if (o === 0) l !== null && ir(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ir(l), r === 1) n.tag === 0 ? _l(Id.bind(null, n)) : xc(Id.bind(null, n)), co(function() {
        !(xt & 6) && Ti();
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
    if (js = -1, xr = 0, xt & 6) throw Error(k(327));
    var l = n.callbackNode;
    if (bo() && n.callbackNode !== l) return null;
    var o = Za(n, n === Gn ? cr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = of(n, o);
    else {
      r = o;
      var c = xt;
      xt |= 2;
      var d = th();
      (Gn !== n || cr !== r) && (ga = null, To = nt() + 500, el(n, r));
      do
        try {
          nh();
          break;
        } catch (E) {
          eh(n, E);
        }
      while (!0);
      Sd(), Al.current = d, xt = c, Hn !== null ? r = 0 : (Gn = null, cr = 0, r = Dn);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Fs(n, c))), r === 1) throw l = zs, el(n, 0), li(n, o), ra(n, nt()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !dy(c) && (r = of(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Fs(n, d))), r === 1)) throw l = zs, el(n, 0), li(n, o), ra(n, nt()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(k(345));
          case 2:
            Nu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Bd + 500 - nt(), 10 < r)) {
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
            if (o = c, o = nt() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * fy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Rc(Nu.bind(null, n, na, ga), o);
              break;
            }
            Nu(n, na, ga);
            break;
          case 5:
            Nu(n, na, ga);
            break;
          default:
            throw Error(k(329));
        }
      }
    }
    return ra(n, nt()), n.callbackNode === l ? uf.bind(null, n) : null;
  }
  function Fs(n, r) {
    var l = Us;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = of(n, r), n !== 2 && (r = na, na = l, r !== null && Lu(r)), n;
  }
  function Lu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function dy(n) {
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
    if (xt & 6) throw Error(k(327));
    bo();
    var r = Za(n, 0);
    if (!(r & 1)) return ra(n, nt()), null;
    var l = of(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Fs(n, o));
    }
    if (l === 1) throw l = zs, el(n, 0), li(n, r), ra(n, nt()), l;
    if (l === 6) throw Error(k(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Nu(n, na, ga), ra(n, nt()), null;
  }
  function Yd(n, r) {
    var l = xt;
    xt |= 1;
    try {
      return n(r);
    } finally {
      xt = l, xt === 0 && (To = nt() + 500, ho && Ti());
    }
  }
  function Mu(n) {
    Ji !== null && Ji.tag === 0 && !(xt & 6) && bo();
    var r = xt;
    xt |= 1;
    var l = sr.transition, o = zt;
    try {
      if (sr.transition = null, zt = 1, n) return n();
    } finally {
      zt = o, sr.transition = l, xt = r, !(xt & 6) && Ti();
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
          Eu(), un(Qn), un(Cn), Ue();
          break;
        case 5:
          Lc(o);
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
    if (Gn = n, Hn = n = Hl(n.current, null), cr = ya = r, Dn = 0, zs = null, af = Ro = Oi = 0, na = Us = null, gu !== null) {
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
        if (Sd(), ht.current = bu, Nc) {
          for (var o = At.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Nc = !1;
        }
        if (Kt = 0, Jn = An = At = null, hs = !1, Cu = 0, ku.current = null, l === null || l.return === null) {
          Dn = 1, zs = r, Hn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = cr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var U = T, K = E, J = K.tag;
            if (!(K.mode & 1) && (J === 0 || J === 11 || J === 15)) {
              var W = K.alternate;
              W ? (K.updateQueue = W.updateQueue, K.memoizedState = W.memoizedState, K.lanes = W.lanes) : (K.updateQueue = null, K.memoizedState = null);
            }
            var he = Vv(m);
            if (he !== null) {
              he.flags &= -257, Ul(he, m, E, d, r), he.mode & 1 && Nd(d, U, r), r = he, T = U;
              var Re = r.updateQueue;
              if (Re === null) {
                var xe = /* @__PURE__ */ new Set();
                xe.add(T), r.updateQueue = xe;
              } else Re.add(T);
              break e;
            } else {
              if (!(r & 1)) {
                Nd(d, U, r), Qd();
                break e;
              }
              T = Error(k(426));
            }
          } else if (pn && E.mode & 1) {
            var kn = Vv(m);
            if (kn !== null) {
              !(kn.flags & 65536) && (kn.flags |= 256), Ul(kn, m, E, d, r), qi(_u(T, E));
              break e;
            }
          }
          d = T = _u(T, E), Dn !== 4 && (Dn = 2), Us === null ? Us = [d] : Us.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var D = Pv(d, T, r);
                Uv(d, D);
                break e;
              case 1:
                E = T;
                var x = d.type, M = d.stateNode;
                if (!(d.flags & 128) && (typeof x.getDerivedStateFromError == "function" || M !== null && typeof M.componentDidCatch == "function" && (jl === null || !jl.has(M)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var X = Md(d, E, r);
                  Uv(d, X);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        ah(l);
      } catch (Te) {
        r = Te, Hn === l && l !== null && (Hn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function th() {
    var n = Al.current;
    return Al.current = bu, n === null ? bu : n;
  }
  function Qd() {
    (Dn === 0 || Dn === 3 || Dn === 2) && (Dn = 4), Gn === null || !(Oi & 268435455) && !(Ro & 268435455) || li(Gn, cr);
  }
  function of(n, r) {
    var l = xt;
    xt |= 2;
    var o = th();
    (Gn !== n || cr !== r) && (ga = null, el(n, r));
    do
      try {
        py();
        break;
      } catch (c) {
        eh(n, c);
      }
    while (!0);
    if (Sd(), xt = l, Al.current = o, Hn !== null) throw Error(k(261));
    return Gn = null, cr = 0, Dn;
  }
  function py() {
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
    var o = zt, c = sr.transition;
    try {
      sr.transition = null, zt = 1, vy(n, r, l, o);
    } finally {
      sr.transition = c, zt = o;
    }
    return null;
  }
  function vy(n, r, l, o) {
    do
      bo();
    while (Ji !== null);
    if (xt & 6) throw Error(k(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(k(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Wf(n, d), n === Gn && (Hn = Gn = null, cr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || lf || (lf = !0, sh(ru, function() {
      return bo(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = sr.transition, sr.transition = null;
      var m = zt;
      zt = 1;
      var E = xt;
      xt |= 4, ku.current = null, Kv(n, l), Hd(l, n), lo(pu), _a = !!is, pu = is = null, n.current = l, cy(l), qa(), xt = E, zt = m, sr.transition = d;
    } else n.current = l;
    if (lf && (lf = !1, Ji = n, As = c), d = n.pendingLanes, d === 0 && (jl = null), $o(l.stateNode), ra(n, nt()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (wo) throw wo = !1, n = Ou, Ou = null, n;
    return As & 1 && n.tag !== 0 && bo(), d = n.pendingLanes, d & 1 ? n === xo ? Fl++ : (Fl = 0, xo = n) : Fl = 0, Ti(), null;
  }
  function bo() {
    if (Ji !== null) {
      var n = Zu(As), r = sr.transition, l = zt;
      try {
        if (sr.transition = null, zt = 16 > n ? 16 : n, Ji === null) var o = !1;
        else {
          if (n = Ji, Ji = null, As = 0, xt & 6) throw Error(k(331));
          var c = xt;
          for (xt |= 4, ge = n.current; ge !== null; ) {
            var d = ge, m = d.child;
            if (ge.flags & 16) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var U = E[T];
                  for (ge = U; ge !== null; ) {
                    var K = ge;
                    switch (K.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, K, d);
                    }
                    var J = K.child;
                    if (J !== null) J.return = K, ge = J;
                    else for (; ge !== null; ) {
                      K = ge;
                      var W = K.sibling, he = K.return;
                      if (rf(K), K === U) {
                        ge = null;
                        break;
                      }
                      if (W !== null) {
                        W.return = he, ge = W;
                        break;
                      }
                      ge = he;
                    }
                  }
                }
                var Re = d.alternate;
                if (Re !== null) {
                  var xe = Re.child;
                  if (xe !== null) {
                    Re.child = null;
                    do {
                      var kn = xe.sibling;
                      xe.sibling = null, xe = kn;
                    } while (xe !== null);
                  }
                }
                ge = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, ge = m;
            else e: for (; ge !== null; ) {
              if (d = ge, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var D = d.sibling;
              if (D !== null) {
                D.return = d.return, ge = D;
                break e;
              }
              ge = d.return;
            }
          }
          var x = n.current;
          for (ge = x; ge !== null; ) {
            m = ge;
            var M = m.child;
            if (m.subtreeFlags & 2064 && M !== null) M.return = m, ge = M;
            else e: for (m = x; ge !== null; ) {
              if (E = ge, E.flags & 2048) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, E);
                }
              } catch (Te) {
                vn(E, E.return, Te);
              }
              if (E === m) {
                ge = null;
                break e;
              }
              var X = E.sibling;
              if (X !== null) {
                X.return = E.return, ge = X;
                break e;
              }
              ge = E.return;
            }
          }
          if (xt = c, Ti(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        zt = l, sr.transition = r;
      }
    }
    return !1;
  }
  function ih(n, r, l) {
    r = _u(l, r), r = Pv(n, r, 1), n = Ml(n, r, 1), r = Pn(), n !== null && (Pi(n, 1, r), ra(n, r));
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
          n = _u(l, n), n = Md(r, n, 1), r = Ml(r, n, 1), n = Pn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function hy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Pn(), n.pingedLanes |= n.suspendedLanes & l, Gn === n && (cr & l) === l && (Dn === 4 || Dn === 3 && (cr & 130023424) === cr && 500 > nt() - Bd ? el(n, 0) : af |= l), ra(n, r);
  }
  function lh(n, r) {
    r === 0 && (n.mode & 1 ? (r = da, da <<= 1, !(da & 130023424) && (da = 4194304)) : r = 1);
    var l = Pn();
    n = ha(n, r), n !== null && (Pi(n, r, l), ra(n, l));
  }
  function my(n) {
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
        throw Error(k(314));
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
    else jn = !1, pn && r.flags & 1048576 && Lv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        za(n, r), n = r.pendingProps;
        var c = qr(r, Cn.current);
        gn(r, l), c = Nl(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, zn(o) ? (d = !0, Zn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, wd(r), c.updater = Kc, r.stateNode = c, c._reactInternals = r, Rs(r, o, n, l), r = xs(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && bc(r), or(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (za(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = gy(o), n = ai(o, n), c) {
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
          throw Error(k(
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
          if (So(r), n === null) throw Error(k(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, zv(n, r), cs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(k(423)), r), r = Yv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(k(424)), r), r = Yv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, pn = !0, Ma = null, l = fe(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ll(), o === c) {
              r = Ua(n, r, l);
              break e;
            }
            or(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Av(r), n === null && yd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Cc(o, c) ? m = null : d !== null && Cc(o, d) && (r.flags |= 32), zd(n, r), or(n, r, m, l), r.child;
      case 6:
        return n === null && yd(r), null;
      case 13:
        return ef(n, r, l);
      case 4:
        return bd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = xn(r, null, o, l) : or(n, r, o, l), r.child;
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
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Ne(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Qn.current) {
              r = Ua(n, r, l);
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
              if (m = d.return, m === null) throw Error(k(341));
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
        return rt(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), za(n, r), r.tag = 1, zn(o) ? (n = !0, Zn(r)) : n = !1, gn(r, l), Xc(r, o, c), Rs(r, o, c, l), xs(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return ws(n, r, l);
    }
    throw Error(k(156, r.tag));
  };
  function sh(n, r) {
    return cn(n, r);
  }
  function yy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new yy(n, r, l, o);
  }
  function Wd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function gy(n) {
    if (typeof n == "function") return Wd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Ot) return 11;
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
      case ce:
        return tl(l.children, c, d, r);
      case ft:
        m = 8, c |= 8;
        break;
      case Tt:
        return n = ja(12, l, r, c | 2), n.elementType = Tt, n.lanes = d, n;
      case Ae:
        return n = ja(13, l, r, c), n.elementType = Ae, n.lanes = d, n;
      case Pt:
        return n = ja(19, l, r, c), n.elementType = Pt, n.lanes = d, n;
      case be:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Ct:
            m = 10;
            break e;
          case on:
            m = 9;
            break e;
          case Ot:
            m = 11;
            break e;
          case Lt:
            m = 14;
            break e;
          case Nt:
            m = 16, o = null;
            break e;
        }
        throw Error(k(130, n == null ? n : typeof n, ""));
    }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = be, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
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
    return n = new ch(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, wd(d), n;
  }
  function Sy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ke, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function qd(n) {
    if (!n) return Rr;
    n = n._reactInternals;
    e: {
      if (tt(n) !== n || n.tag !== 1) throw Error(k(170));
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
      throw Error(k(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (zn(l)) return os(n, l, r);
    }
    return r;
  }
  function fh(n, r, l, o, c, d, m, E, T) {
    return n = cf(l, o, !0, n, c, d, m, E, T), n.context = qd(null), l = n.current, o = Pn(), c = Li(l), d = Ki(o, c), d.callback = r ?? null, Ml(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function ff(n, r, l, o) {
    var c = r.current, d = Pn(), m = Li(c);
    return l = qd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ml(c, r, m), n !== null && (Ur(n, c, m, d), Oc(n, c, m)), m;
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
    if (r === null) throw Error(k(409));
    ff(n, r, null, null);
  }, vf.prototype.unmount = Xd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Mu(function() {
        ff(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function vf(n) {
    this._internalRoot = n;
  }
  vf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Xe();
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
  function Ey(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var U = df(m);
          d.call(U);
        };
      }
      var m = fh(r, o, n, 0, null, !1, !1, "", ph);
      return n._reactRootContainer = m, n[Qi] = m.current, oo(n.nodeType === 8 ? n.parentNode : n), Mu(), m;
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
    return n._reactRootContainer = T, n[Qi] = T.current, oo(n.nodeType === 8 ? n.parentNode : n), Mu(function() {
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
    } else m = Ey(l, r, n, c, o);
    return df(m);
  }
  Dt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, nt()), !(xt & 6) && (To = nt() + 500, Ti()));
        }
        break;
      case 13:
        Mu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Pn();
            Ur(o, n, 1, c);
          }
        }), pf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Pn();
        Ur(r, n, 134217728, l);
      }
      pf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Li(n), l = ha(n, r);
      if (l !== null) {
        var o = Pn();
        Ur(l, n, r, o);
      }
      pf(n, r);
    }
  }, Xe = function() {
    return zt;
  }, Ju = function(n, r) {
    var l = zt;
    try {
      return zt = n, r();
    } finally {
      zt = l;
    }
  }, Qt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = yn(o);
              if (!c) throw Error(k(90));
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
  }, eu = Yd, pl = Mu;
  var Cy = { usingClientEntryPoint: !1, Events: [ze, ni, yn, Hi, Jl, Yd] }, Vs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, vh = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: re.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = wn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || dh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(vh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Cy, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zd(r)) throw Error(k(200));
    return Sy(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!Zd(n)) throw Error(k(299));
    var l = !1, o = "", c = zu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = cf(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, oo(n.nodeType === 8 ? n.parentNode : n), new Xd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(k(188)) : (n = Object.keys(n).join(","), Error(k(268, n)));
    return n = wn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Mu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!hf(r)) throw Error(k(200));
    return Ps(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!Zd(n)) throw Error(k(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = zu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = fh(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, oo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new vf(r);
  }, Ia.render = function(n, r, l) {
    if (!hf(r)) throw Error(k(200));
    return Ps(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!hf(n)) throw Error(k(40));
    return n._reactRootContainer ? (Mu(function() {
      Ps(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = Yd, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!hf(l)) throw Error(k(200));
    if (n == null || n._reactInternals === void 0) throw Error(k(38));
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
    var j = Jt, V = fT(), k = j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, De = !1;
    function Se(e) {
      De = e;
    }
    function Be(e) {
      if (!De) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Ke("warn", e, a);
      }
    }
    function g(e) {
      if (!De) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Ke("error", e, a);
      }
    }
    function Ke(e, t, a) {
      {
        var i = k.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var B = 0, G = 1, pe = 2, q = 3, Ee = 4, ie = 5, Ie = 6, St = 7, mt = 8, tn = 9, ct = 10, Ge = 11, re = 12, Z = 13, ke = 14, ce = 15, ft = 16, Tt = 17, Ct = 18, on = 19, Ot = 21, Ae = 22, Pt = 23, Lt = 24, Nt = 25, be = !0, ne = !1, Oe = !1, ue = !1, _ = !1, I = !0, Qe = !0, Ye = !0, dt = !0, lt = /* @__PURE__ */ new Set(), at = {}, ut = {};
    function pt(e, t) {
      Yt(e, t), Yt(e + "Capture", t);
    }
    function Yt(e, t) {
      at[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), at[e] = t;
      {
        var a = e.toLowerCase();
        ut[a] = e, e === "onDoubleClick" && (ut.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        lt.add(t[i]);
    }
    var Ln = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
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
    var Yn = 0, Sr = 1, $a = 2, Mn = 3, Er = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ae = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Le = new RegExp("^[" + fi + "][" + ae + "]*$"), ot = {}, Vt = {};
    function nn(e) {
      return br.call(Vt, e) ? !0 : br.call(ot, e) ? !1 : Le.test(e) ? (Vt[e] = !0, !0) : (ot[e] = !0, g("Invalid attribute name: `%s`", e), !1);
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
    function rn(e) {
      return Qt.hasOwnProperty(e) ? Qt[e] : null;
    }
    function $t(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Mn || t === Er, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Qt = {}, fa = [
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
      Qt[e] = new $t(
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
      Qt[t] = new $t(
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
      Qt[e] = new $t(
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
      Qt[e] = new $t(
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
      Qt[e] = new $t(
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
      Qt[e] = new $t(
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
      Qt[e] = new $t(
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
      Qt[e] = new $t(
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
      Qt[e] = new $t(
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
      Qt[t] = new $t(
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
      Qt[t] = new $t(
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
      Qt[t] = new $t(
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
      Qt[e] = new $t(
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
    Qt[Hi] = new $t(
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
      Qt[e] = new $t(
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
          if (i.type === Mn)
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
            e[p] = v === Mn ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, S = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var b = u.type, w;
          b === Mn || b === Er && a === !0 ? w = "" : (In(a, y), w = "" + a, u.sanitizeURL && pl(w.toString())), S ? e.setAttributeNS(S, y, w) : e.setAttribute(y, w);
        }
      }
    }
    var Dr = Symbol.for("react.element"), ar = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), R = Symbol.for("react.context"), $ = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), Ce = Symbol.for("react.suspense_list"), tt = Symbol.for("react.memo"), Ze = Symbol.for("react.lazy"), yt = Symbol.for("react.scope"), vt = Symbol.for("react.debug_trace_mode"), wn = Symbol.for("react.offscreen"), an = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), ir = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function nt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var it = Object.assign, Ka = 0, nu, ru, hl, Wu, ml, Qr, $o;
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
            log: it({}, e, {
              value: nu
            }),
            info: it({}, e, {
              value: ru
            }),
            warn: it({}, e, {
              value: hl
            }),
            error: it({}, e, {
              value: Wu
            }),
            group: it({}, e, {
              value: ml
            }),
            groupCollapsed: it({}, e, {
              value: Qr
            }),
            groupEnd: it({}, e, {
              value: $o
            })
          });
        }
        Ka < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Gu = k.ReactCurrentDispatcher, yl;
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
            } catch (A) {
              i = A;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (A) {
              i = A;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (A) {
            i = A;
          }
          e();
        }
      } catch (A) {
        if (A && i && typeof A.stack == "string") {
          for (var p = A.stack.split(`
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
      var w = e ? e.displayName || e.name : "", N = w ? da(w) : "";
      return typeof e == "function" && Za.set(e, N), N;
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
        case se:
          return da("Suspense");
        case Ce:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case $:
            return Ku(e.render);
          case tt:
            return Pi(e.type, t, a);
          case Ze: {
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
        case ie:
          return da(e.type);
        case ft:
          return da("Lazy");
        case Z:
          return da("Suspense");
        case on:
          return da("SuspenseList");
        case B:
        case pe:
        case ce:
          return Ku(e.type);
        case Ge:
          return Ku(e.type.render);
        case G:
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
    function zt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Zu(e) {
      return e.displayName || "Context";
    }
    function Dt(e) {
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
        case se:
          return "Suspense";
        case Ce:
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
          case $:
            return zt(e, e.render, "ForwardRef");
          case tt:
            var i = e.displayName || null;
            return i !== null ? i : Dt(e.type) || "Memo";
          case Ze: {
            var u = e, s = u._payload, f = u._init;
            try {
              return Dt(f(s));
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
    function Xe(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Lt:
          return "Cache";
        case tn:
          var i = a;
          return hi(i) + ".Consumer";
        case ct:
          var u = a;
          return hi(u._context) + ".Provider";
        case Ct:
          return "DehydratedFragment";
        case Ge:
          return Qo(a, a.render, "ForwardRef");
        case St:
          return "Fragment";
        case ie:
          return a;
        case Ee:
          return "Portal";
        case q:
          return "Root";
        case Ie:
          return "Text";
        case ft:
          return Dt(a);
        case mt:
          return a === Wa ? "StrictMode" : "Mode";
        case Ae:
          return "Offscreen";
        case re:
          return "Profiler";
        case Ot:
          return "Scope";
        case Z:
          return "Suspense";
        case on:
          return "SuspenseList";
        case Nt:
          return "TracingMarker";
        case G:
        case B:
        case Tt:
        case pe:
        case ke:
        case ce:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Ju = k.ReactDebugCurrentFrame, lr = null, mi = !1;
    function Or() {
      {
        if (lr === null)
          return null;
        var e = lr._debugOwner;
        if (e !== null && typeof e < "u")
          return Xe(e);
      }
      return null;
    }
    function yi() {
      return lr === null ? "" : Vi(lr);
    }
    function fn() {
      Ju.getCurrentStack = null, lr = null, mi = !1;
    }
    function Wt(e) {
      Ju.getCurrentStack = e === null ? null : yi, lr = e, mi = !1;
    }
    function Sl() {
      return lr;
    }
    function $n(e) {
      mi = e;
    }
    function Lr(e) {
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
      var a = e, i = t.checked, u = it({}, t, {
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
        a.value != u) && (a.value = Lr(u)) : a.value !== Lr(u) && (a.value = Lr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? je(a, t.type, u) : t.hasOwnProperty("defaultValue") && je(a, t.type, xa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function z(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Lr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function F(e, t) {
      var a = e;
      C(a, t), te(a, t);
    }
    function te(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        In(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Mh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), C(f, p);
          }
        }
      }
    }
    function je(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Lr(e._wrapperState.initialValue) : e.defaultValue !== Lr(a) && (e.defaultValue = Lr(a)));
    }
    var oe = !1, Pe = !1, gt = !1;
    function kt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? j.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Pe || (Pe = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (gt || (gt = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !oe && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), oe = !0);
    }
    function ln(e, t) {
      t.value != null && e.setAttribute("value", Lr(xa(t.value)));
    }
    var Gt = Array.isArray;
    function st(e) {
      return Gt(e);
    }
    var qt;
    qt = !1;
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
            var i = st(e[a]);
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
        for (var S = Lr(xa(a)), b = null, w = 0; w < u.length; w++) {
          if (u[w].value === S) {
            u[w].selected = !0, i && (u[w].defaultSelected = !0);
            return;
          }
          b === null && !u[w].disabled && (b = u[w]);
        }
        b !== null && (b.selected = !0);
      }
    }
    function Ko(e, t) {
      return it({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      qo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !qt && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), qt = !0);
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
      var i = it({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Lr(a._wrapperState.initialValue)
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
            if (st(u)) {
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
    function nv(e, t) {
      var a = e, i = xa(t.value), u = xa(t.defaultValue);
      if (i != null) {
        var s = Lr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Lr(u));
    }
    function rv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Km(e, t) {
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
      var Xm = /^(?:webkit|moz|o)[A-Z]/, Zm = /^-ms-/, fv = /-(.)/g, ad = /;\s*$/, Si = {}, su = {}, dv = !1, Jo = !1, Jm = function(e) {
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
          Jm(e.replace(Zm, "ms-"))
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
        e.indexOf("-") > -1 ? pv(e) : Xm.test(e) ? id(e) : ad.test(t) && ld(e, t), typeof t == "number" && (isNaN(t) ? vv(e, t) : isFinite(t) || hv(e, t));
      };
    }
    var mv = cv;
    function ey(e) {
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
    function ty(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function gv(e) {
      var t = {};
      for (var a in e)
        for (var i = Xo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function ny(e, t) {
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
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ty(e[f]) ? "Removing" : "Updating", f, p);
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
    }, es = it({
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
    }, lo = {}, ry = new RegExp("^(aria)-[" + ae + "]*$"), uo = new RegExp("^(aria)[A-Z][" + ae + "]*$");
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
        if (ry.test(t)) {
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
      var ur = {}, cd = /^on./, vc = /^on[^A-Z]/, Ev = new RegExp("^(aria)-[" + ae + "]*$"), Cv = new RegExp("^(aria)[A-Z][" + ae + "]*$");
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
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ur[t] = !0, !0) : y ? !0 : sn(t, a, v, !1) ? (ur[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Mn && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ur[t] = !0), !0);
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
    function ay(e) {
      fu !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function iy() {
      fu === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function rs(e) {
      return e === fu;
    }
    function pd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var mc = null, du = null, Bt = null;
    function yc(e) {
      var t = ko(e);
      if (t) {
        if (typeof mc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Mh(a);
          mc(t.stateNode, t.type, i);
        }
      }
    }
    function gc(e) {
      mc = e;
    }
    function oo(e) {
      du ? Bt ? Bt.push(e) : Bt = [e] : du = e;
    }
    function wv() {
      return du !== null || Bt !== null;
    }
    function Sc() {
      if (du) {
        var e = du, t = Bt;
        if (du = null, Bt = null, yc(e), t)
          for (var a = 0; a < t.length; a++)
            yc(t[a]);
      }
    }
    var so = function(e, t) {
      return e(t);
    }, as = function() {
    }, wl = !1;
    function xv() {
      var e = wv();
      e && (as(), Sc());
    }
    function bv(e, t, a) {
      if (wl)
        return e(t, a);
      wl = !0;
      try {
        return so(e, t, a);
      } finally {
        wl = !1, xv();
      }
    }
    function ly(e, t, a) {
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
    function xl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Mh(a);
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
    if (Ln)
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
        var S = document.createEvent("Event"), b = !1, w = !0, N = window.event, A = Object.getOwnPropertyDescriptor(window, "event");
        function H() {
          vd.removeEventListener(P, Fe, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = N);
        }
        var de = Array.prototype.slice.call(arguments, 3);
        function Fe() {
          b = !0, H(), a.apply(i, de), w = !1;
        }
        var Me, _t = !1, Et = !1;
        function O(L) {
          if (Me = L.error, _t = !0, Me === null && L.colno === 0 && L.lineno === 0 && (Et = !0), L.defaultPrevented && Me != null && typeof Me == "object")
            try {
              Me._suppressLogging = !0;
            } catch {
            }
        }
        var P = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", O), vd.addEventListener(P, Fe, !1), S.initEvent(P, !1, !1), vd.dispatchEvent(S), A && Object.defineProperty(window, "event", A), b && w && (_t ? Et && (Me = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Me = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Me)), window.removeEventListener("error", O), !b)
          return H(), Cc.apply(this, arguments);
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
    function uy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var ze = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), yn = (
      /*                    */
      2
    ), wt = (
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
    ), Ne = (
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
    ), wc = (
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
    ), xc = (
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
      wt | Qn | 0
    ), kl = yn | wt | ka | Oa | Cn | qr | zn, Ol = wt | un | Cn | zn, Gi = Gr | ka, Un = Wi | xc | ho, La = k.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yn | qr)) !== ze && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === q ? a : null;
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
      return e.tag === q ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function Lv(e) {
      {
        var t = La.current;
        if (t !== null && t.tag === G) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Xe(a) || "A component"), i._warnedAboutRefsInRender = !0;
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
      if (i.tag !== q)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = _c(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === ie || e.tag === Ie)
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
      return t !== null ? Ma(t) : null;
    }
    function Ma(e) {
      if (e.tag === ie || e.tag === Ie)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== Ee) {
          var a = Ma(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var hd = V.unstable_scheduleCallback, Mv = V.unstable_cancelCallback, md = V.unstable_shouldYield, yd = V.unstable_requestPaint, Wn = V.unstable_now, Dc = V.unstable_getCurrentPriorityLevel, ss = V.unstable_ImmediatePriority, Ll = V.unstable_UserBlockingPriority, qi = V.unstable_NormalPriority, oy = V.unstable_LowPriority, mu = V.unstable_IdlePriority, kc = V.unstable_yieldValue, Nv = V.unstable_setDisableYieldValue, yu = null, xn = null, fe = null, va = !1, Zr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function mo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Qe && (e = it({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Na
        })), yu = t.inject(e), xn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function gd(e, t) {
      if (xn && typeof xn.onScheduleFiberRoot == "function")
        try {
          xn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Sd(e, t) {
      if (xn && typeof xn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Ne) === Ne;
          if (Ye) {
            var i;
            switch (t) {
              case Mr:
                i = ss;
                break;
              case _i:
                i = Ll;
                break;
              case za:
                i = qi;
                break;
              case Ua:
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
    function Ed(e) {
      if (xn && typeof xn.onPostCommitFiberRoot == "function")
        try {
          xn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Cd(e) {
      if (xn && typeof xn.onCommitFiberUnmount == "function")
        try {
          xn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function gn(e) {
      if (typeof kc == "function" && (Nv(e), Se(e)), xn && typeof xn.setStrictMode == "function")
        try {
          xn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Na(e) {
      fe = e;
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
      fe !== null && typeof fe.markCommitStarted == "function" && fe.markCommitStarted(e);
    }
    function Td() {
      fe !== null && typeof fe.markCommitStopped == "function" && fe.markCommitStopped();
    }
    function ha(e) {
      fe !== null && typeof fe.markComponentRenderStarted == "function" && fe.markComponentRenderStarted(e);
    }
    function ma() {
      fe !== null && typeof fe.markComponentRenderStopped == "function" && fe.markComponentRenderStopped();
    }
    function wd(e) {
      fe !== null && typeof fe.markComponentPassiveEffectMountStarted == "function" && fe.markComponentPassiveEffectMountStarted(e);
    }
    function zv() {
      fe !== null && typeof fe.markComponentPassiveEffectMountStopped == "function" && fe.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      fe !== null && typeof fe.markComponentPassiveEffectUnmountStarted == "function" && fe.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ml() {
      fe !== null && typeof fe.markComponentPassiveEffectUnmountStopped == "function" && fe.markComponentPassiveEffectUnmountStopped();
    }
    function Oc(e) {
      fe !== null && typeof fe.markComponentLayoutEffectMountStarted == "function" && fe.markComponentLayoutEffectMountStarted(e);
    }
    function Uv() {
      fe !== null && typeof fe.markComponentLayoutEffectMountStopped == "function" && fe.markComponentLayoutEffectMountStopped();
    }
    function cs(e) {
      fe !== null && typeof fe.markComponentLayoutEffectUnmountStarted == "function" && fe.markComponentLayoutEffectUnmountStarted(e);
    }
    function xd() {
      fe !== null && typeof fe.markComponentLayoutEffectUnmountStopped == "function" && fe.markComponentLayoutEffectUnmountStopped();
    }
    function fs(e, t, a) {
      fe !== null && typeof fe.markComponentErrored == "function" && fe.markComponentErrored(e, t, a);
    }
    function bi(e, t, a) {
      fe !== null && typeof fe.markComponentSuspended == "function" && fe.markComponentSuspended(e, t, a);
    }
    function ds(e) {
      fe !== null && typeof fe.markLayoutEffectsStarted == "function" && fe.markLayoutEffectsStarted(e);
    }
    function ps() {
      fe !== null && typeof fe.markLayoutEffectsStopped == "function" && fe.markLayoutEffectsStopped();
    }
    function Su(e) {
      fe !== null && typeof fe.markPassiveEffectsStarted == "function" && fe.markPassiveEffectsStarted(e);
    }
    function bd() {
      fe !== null && typeof fe.markPassiveEffectsStopped == "function" && fe.markPassiveEffectsStopped();
    }
    function Eu(e) {
      fe !== null && typeof fe.markRenderStarted == "function" && fe.markRenderStarted(e);
    }
    function Av() {
      fe !== null && typeof fe.markRenderYielded == "function" && fe.markRenderYielded();
    }
    function Lc() {
      fe !== null && typeof fe.markRenderStopped == "function" && fe.markRenderStopped();
    }
    function Sn(e) {
      fe !== null && typeof fe.markRenderScheduled == "function" && fe.markRenderScheduled(e);
    }
    function Mc(e, t) {
      fe !== null && typeof fe.markForceUpdateScheduled == "function" && fe.markForceUpdateScheduled(e, t);
    }
    function vs(e, t) {
      fe !== null && typeof fe.markStateUpdateScheduled == "function" && fe.markStateUpdateScheduled(e, t);
    }
    var Ue = (
      /*                         */
      0
    ), ht = (
      /*                 */
      1
    ), Ut = (
      /*                    */
      2
    ), Kt = (
      /*               */
      8
    ), At = (
      /*              */
      16
    ), An = Math.clz32 ? Math.clz32 : hs, Jn = Math.log, Nc = Math.LN2;
    function hs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jn(t) / Nc | 0) | 0;
    }
    var Cu = 31, Q = (
      /*                        */
      0
    ), Mt = (
      /*                          */
      0
    ), $e = (
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
    ), Uc = (
      /*                        */
      256
    ), Ac = (
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
    ), wu = (
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
    ), _d = wu, Ss = (
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
    ), Jr = (
      /*                   */
      1073741824
    );
    function jv(e) {
      {
        if (e & $e)
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
        if (e & xu)
          return "Idle";
        if (e & Jr)
          return "Offscreen";
      }
    }
    var en = -1, bu = Ru, Gc = wu;
    function Cs(e) {
      switch (Ul(e)) {
        case $e:
          return $e;
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
        case Uc:
        case Ac:
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
        case wu:
        case $c:
        case gs:
        case Qc:
        case Wc:
          return e & ys;
        case Ss:
          return Ss;
        case Es:
          return Es;
        case xu:
          return xu;
        case Jr:
          return Jr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function qc(e, t) {
      var a = e.pendingLanes;
      if (a === Q)
        return Q;
      var i = Q, u = e.suspendedLanes, s = e.pingedLanes, f = a & Dd;
      if (f !== Q) {
        var p = f & ~u;
        if (p !== Q)
          i = Cs(p);
        else {
          var v = f & s;
          v !== Q && (i = Cs(v));
        }
      } else {
        var y = a & ~u;
        y !== Q ? i = Cs(y) : s !== Q && (i = Cs(s));
      }
      if (i === Q)
        return Q;
      if (t !== Q && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === Q) {
        var S = Ul(i), b = Ul(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          S >= b || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          S === bn && (b & zl) !== Q
        )
          return t;
      }
      (i & ri) !== Q && (i |= a & bn);
      var w = e.entangledLanes;
      if (w !== Q)
        for (var N = e.entanglements, A = i & w; A > 0; ) {
          var H = jn(A), de = 1 << H;
          i |= N[H], A &= ~de;
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
        case $e:
        case Nl:
        case ri:
          return t + 250;
        case Tr:
        case bn:
        case Xi:
        case Ru:
        case zc:
        case Uc:
        case Ac:
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
        case wu:
        case $c:
        case gs:
        case Qc:
        case Wc:
          return en;
        case Ss:
        case Es:
        case xu:
        case Jr:
          return en;
        default:
          return g("Should have found matching lanes. This is a bug in React."), en;
      }
    }
    function Kc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p, y = s[p];
        y === en ? ((v & i) === Q || (v & u) !== Q) && (s[p] = kd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Fv(e) {
      return Cs(e.pendingLanes);
    }
    function Xc(e) {
      var t = e.pendingLanes & ~Jr;
      return t !== Q ? t : t & Jr ? Jr : Q;
    }
    function Hv(e) {
      return (e & $e) !== Q;
    }
    function Rs(e) {
      return (e & Dd) !== Q;
    }
    function _u(e) {
      return (e & ys) === e;
    }
    function Od(e) {
      var t = $e | ri | bn;
      return (e & t) === Q;
    }
    function Ld(e) {
      return (e & zl) === e;
    }
    function Zc(e, t) {
      var a = Nl | ri | Tr | bn;
      return (t & a) !== Q;
    }
    function Pv(e, t) {
      return (t & e.expiredLanes) !== Q;
    }
    function Md(e) {
      return (e & zl) !== Q;
    }
    function Nd() {
      var e = bu;
      return bu <<= 1, (bu & zl) === Q && (bu = Ru), e;
    }
    function Vv() {
      var e = Gc;
      return Gc <<= 1, (Gc & ys) === Q && (Gc = wu), e;
    }
    function Ul(e) {
      return e & -e;
    }
    function Ts(e) {
      return Ul(e);
    }
    function jn(e) {
      return 31 - An(e);
    }
    function or(e) {
      return jn(e);
    }
    function ea(e, t) {
      return (e & t) !== Q;
    }
    function Du(e, t) {
      return (e & t) === t;
    }
    function rt(e, t) {
      return e | t;
    }
    function ws(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function Bv(e) {
      return e;
    }
    function Iv(e, t) {
      return e !== Mt && e < t ? e : t;
    }
    function xs(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function So(e, t, a) {
      e.pendingLanes |= t, t !== xu && (e.suspendedLanes = Q, e.pingedLanes = Q);
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
    function Ud(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = Q, e.pingedLanes = Q, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p;
        i[p] = Q, u[p] = en, s[p] = en, f &= ~v;
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
    function Ad(e, t) {
      var a = Ul(t), i;
      switch (a) {
        case ri:
          i = Nl;
          break;
        case bn:
          i = Tr;
          break;
        case Ru:
        case zc:
        case Uc:
        case Ac:
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
        case wu:
        case $c:
        case gs:
        case Qc:
        case Wc:
          i = Xi;
          break;
        case xu:
          i = Es;
          break;
        default:
          i = Mt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Mt ? Mt : i;
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
    var Mr = $e, _i = ri, za = bn, Ua = xu, _s = Mt;
    function Aa() {
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
      var t = Ul(e);
      return er(Mr, t) ? er(_i, t) ? Rs(t) ? za : Ua : _i : Mr;
    }
    function tf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var ks;
    function wr(e) {
      ks = e;
    }
    function sy(e) {
      ks(e);
    }
    var ge;
    function Eo(e) {
      ge = e;
    }
    var nf;
    function qv(e) {
      nf = e;
    }
    var Kv;
    function Os(e) {
      Kv = e;
    }
    var Ls;
    function Fd(e) {
      Ls = e;
    }
    var rf = !1, Ms = [], Zi = null, Di = null, ki = null, _n = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), zr = [], Xv = [
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
          p !== null && ge(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function cy(e, t, a, i, u) {
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
          if (i === Z) {
            var u = wi(a);
            if (u !== null) {
              e.blockedOn = u, Ls(e.priority, function() {
                nf(a);
              });
              return;
            }
          } else if (i === q) {
            var s = a.stateNode;
            if (tf(s)) {
              e.blockedOn = xi(a);
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
          ay(s), u.target.dispatchEvent(s), iy();
        } else {
          var f = ko(i);
          return f !== null && ge(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Vd(e, t, a) {
      Ns(e) && a.delete(t);
    }
    function fy() {
      rf = !1, Zi !== null && Ns(Zi) && (Zi = null), Di !== null && Ns(Di) && (Di = null), ki !== null && Ns(ki) && (ki = null), _n.forEach(Vd), Nr.forEach(Vd);
    }
    function Al(e, t) {
      e.blockedOn === t && (e.blockedOn = null, rf || (rf = !0, V.unstable_scheduleCallback(V.unstable_NormalPriority, fy)));
    }
    function ku(e) {
      if (Ms.length > 0) {
        Al(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Zi !== null && Al(Zi, e), Di !== null && Al(Di, e), ki !== null && Al(ki, e);
      var i = function(p) {
        return Al(p, e);
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
    var sr = k.ReactCurrentBatchConfig, xt = !0;
    function Gn(e) {
      xt = !!e;
    }
    function Hn() {
      return xt;
    }
    function cr(e, t, a) {
      var i = af(t), u;
      switch (i) {
        case Mr:
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
      var u = Aa(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(Mr), Dn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = Aa(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(_i), Dn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Dn(e, t, a, i) {
      xt && zs(e, t, a, i);
    }
    function zs(e, t, a, i) {
      var u = Ro(e, t, a, i);
      if (u === null) {
        Dy(e, t, i, Oi, a), Hd(e, i);
        return;
      }
      if (cy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Hd(e, i), t & Da && Zv(e)) {
        for (; u !== null; ) {
          var s = ko(u);
          s !== null && sy(s);
          var f = Ro(e, t, a, i);
          if (f === null && Dy(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Dy(e, t, i, null, a);
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
          if (p === Z) {
            var v = wi(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === q) {
            var y = f.stateNode;
            if (tf(y))
              return xi(f);
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
            case Ll:
              return _i;
            case qi:
            case oy:
              return za;
            case mu:
              return Ua;
            default:
              return za;
          }
        }
        default:
          return za;
      }
    }
    function Us(e, t, a) {
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
    var ga = null, wo = null, Ou = null;
    function jl(e) {
      return ga = e, wo = As(), !0;
    }
    function lf() {
      ga = null, wo = null, Ou = null;
    }
    function Ji() {
      if (Ou)
        return Ou;
      var e, t = wo, a = t.length, i, u = As(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Ou = u.slice(e, p), Ou;
    }
    function As() {
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
      return it(t.prototype, {
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
    }, Li = xr(Pn), Ur = it({}, Pn, {
      view: 0,
      detail: 0
    }), ra = xr(Ur), uf, Fs, Lu;
    function dy(e) {
      e !== Lu && (Lu && e.type === "mousemove" ? (uf = e.screenX - Lu.screenX, Fs = e.screenY - Lu.screenY) : (uf = 0, Fs = 0), Lu = e);
    }
    var li = it({}, Ur, {
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
        return "movementX" in e ? e.movementX : (dy(e), uf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Fs;
      }
    }), Id = xr(li), Yd = it({}, li, {
      dataTransfer: 0
    }), Mu = xr(Yd), $d = it({}, Ur, {
      relatedTarget: 0
    }), el = xr($d), eh = it({}, Pn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), th = xr(eh), Qd = it({}, Pn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), of = xr(Qd), py = it({}, Pn, {
      data: 0
    }), nh = xr(py), rh = nh, ah = {
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
    function vy(e) {
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
    var hy = it({}, Ur, {
      key: vy,
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
    }), lh = xr(hy), my = it({}, li, {
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
    }), uh = xr(my), oh = it({}, Ur, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), sh = xr(oh), yy = it({}, Pn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ja = xr(yy), Wd = it({}, li, {
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
    }), gy = xr(Wd), Hl = [9, 13, 27, 32], Hs = 229, tl = Ln && "CompositionEvent" in window, Pl = null;
    Ln && "documentMode" in document && (Pl = document.documentMode);
    var Gd = Ln && "TextEvent" in window && !Pl, sf = Ln && (!tl || Pl && Pl > 8 && Pl <= 11), ch = 32, cf = String.fromCharCode(ch);
    function Sy() {
      pt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), pt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), pt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), pt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
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
    var Ey = {
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
      return t === "input" ? !!Ey[e.type] : t === "textarea";
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
    function Cy(e) {
      if (!Ln)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      pt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function vh(e, t, a, i) {
      oo(i);
      var u = Sh(t, "onChange");
      if (u.length > 0) {
        var s = new Li("onChange", "change", null, a, i);
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
      LE(e, 0);
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
    Ln && (m = Cy("input") && (!document.documentMode || document.documentMode > 9));
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
    function J(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function W(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function he(e, t) {
      if (e === "click")
        return c(t);
    }
    function Re(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function xe(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || je(e, "number", e.value);
    }
    function kn(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window, v, y;
      if (r(p) ? v = d : Ps(p) ? m ? v = Re : (v = J, y = K) : W(p) && (v = he), v) {
        var S = v(t, a);
        if (S) {
          vh(e, S, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && xe(p);
    }
    function D() {
      Yt("onMouseEnter", ["mouseout", "mouseover"]), Yt("onMouseLeave", ["mouseout", "mouseover"]), Yt("onPointerEnter", ["pointerout", "pointerover"]), Yt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function x(e, t, a, i, u, s, f) {
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
        var w, N;
        if (v) {
          var A = i.relatedTarget || i.toElement;
          if (w = a, N = A ? Ys(A) : null, N !== null) {
            var H = pa(N);
            (N !== H || N.tag !== ie && N.tag !== Ie) && (N = null);
          }
        } else
          w = null, N = a;
        if (w !== N) {
          var de = Id, Fe = "onMouseLeave", Me = "onMouseEnter", _t = "mouse";
          (t === "pointerout" || t === "pointerover") && (de = uh, Fe = "onPointerLeave", Me = "onPointerEnter", _t = "pointer");
          var Et = w == null ? S : Cf(w), O = N == null ? S : Cf(N), P = new de(Fe, _t + "leave", w, i, u);
          P.target = Et, P.relatedTarget = O;
          var L = null, ee = Ys(u);
          if (ee === a) {
            var ye = new de(Me, _t + "enter", N, i, u);
            ye.target = O, ye.relatedTarget = Et, L = ye;
          }
          NT(e, P, L, w, N);
        }
      }
    }
    function M(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var X = typeof Object.is == "function" ? Object.is : M;
    function Te(e, t) {
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
    function He(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Ve(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function qe(e, t) {
      for (var a = He(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = He(Ve(a));
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
      return jt(e, u, s, f, p);
    }
    function jt(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, S = e, b = null;
      e: for (; ; ) {
        for (var w = null; S === t && (a === 0 || S.nodeType === Yi) && (f = s + a), S === i && (u === 0 || S.nodeType === Yi) && (p = s + u), S.nodeType === Yi && (s += S.nodeValue.length), (w = S.firstChild) !== null; )
          b = S, S = w;
        for (; ; ) {
          if (S === e)
            break e;
          if (b === t && ++v === a && (f = s), b === i && ++y === u && (p = s), (w = S.nextSibling) !== null)
            break;
          S = b, b = S.parentNode;
        }
        S = w;
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
        var y = qe(e, f), S = qe(e, p);
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
    function Ry(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function yT() {
      var e = CE();
      return {
        focusedElem: e,
        selectionRange: Ry(e) ? ST(e) : null
      };
    }
    function gT(e) {
      var t = CE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && hT(a)) {
        i !== null && Ry(a) && ET(a, i);
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
    var CT = Ln && "documentMode" in document && document.documentMode <= 11;
    function RT() {
      pt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var mf = null, Ty = null, Jd = null, wy = !1;
    function TT(e) {
      if ("selectionStart" in e && Ry(e))
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
    function wT(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function RE(e, t, a) {
      var i = wT(a);
      if (!(wy || mf == null || mf !== _a(i))) {
        var u = TT(mf);
        if (!Jd || !Te(Jd, u)) {
          Jd = u;
          var s = Sh(Ty, "onSelect");
          if (s.length > 0) {
            var f = new Li("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = mf;
          }
        }
      }
    }
    function xT(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window;
      switch (t) {
        case "focusin":
          (Ps(p) || p.contentEditable === "true") && (mf = p, Ty = a, Jd = null);
          break;
        case "focusout":
          mf = null, Ty = null, Jd = null;
          break;
        case "mousedown":
          wy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          wy = !1, RE(e, i, u);
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
    }, xy = {}, TE = {};
    Ln && (TE = document.createElement("div").style, "AnimationEvent" in window || (delete yf.animationend.animation, delete yf.animationiteration.animation, delete yf.animationstart.animation), "TransitionEvent" in window || delete yf.transitionend.transition);
    function yh(e) {
      if (xy[e])
        return xy[e];
      if (!yf[e])
        return e;
      var t = yf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in TE)
          return xy[e] = t[a];
      return e;
    }
    var wE = yh("animationend"), xE = yh("animationiteration"), bE = yh("animationstart"), _E = yh("transitionend"), DE = /* @__PURE__ */ new Map(), kE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function _o(e, t) {
      DE.set(e, t), pt(t, [e]);
    }
    function bT() {
      for (var e = 0; e < kE.length; e++) {
        var t = kE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        _o(a, "on" + i);
      }
      _o(wE, "onAnimationEnd"), _o(xE, "onAnimationIteration"), _o(bE, "onAnimationStart"), _o("dblclick", "onDoubleClick"), _o("focusin", "onFocus"), _o("focusout", "onBlur"), _o(_E, "onTransitionEnd");
    }
    function _T(e, t, a, i, u, s, f) {
      var p = DE.get(t);
      if (p !== void 0) {
        var v = Li, y = t;
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
            v = Mu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = sh;
            break;
          case wE:
          case xE:
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
            v = gy;
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
          t === "scroll", w = LT(a, p, i.type, S, b);
          if (w.length > 0) {
            var N = new v(p, y, null, i, u);
            e.push({
              event: N,
              listeners: w
            });
          }
        }
      }
    }
    bT(), D(), Vs(), RT(), Sy();
    function DT(e, t, a, i, u, s, f) {
      _T(e, t, a, i, u, s);
      var p = (s & dd) === 0;
      p && (x(e, t, a, i, u), kn(e, t, a, i, u), xT(e, t, a, i, u), ph(e, t, a, i, u));
    }
    var ep = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], by = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(ep));
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
          var S = t[y], b = S.instance, w = S.currentTarget, N = S.listener;
          if (b !== i && e.isPropagationStopped())
            return;
          OE(e, N, w), i = b;
        }
    }
    function LE(e, t) {
      for (var a = (t & Da) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        kT(s, f, a);
      }
      ls();
    }
    function OT(e, t, a, i, u) {
      var s = pd(a), f = [];
      DT(f, e, i, a, s, t), LE(f, t);
    }
    function En(e, t) {
      by.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = lx(t), u = zT(e);
      i.has(u) || (ME(t, e, hc, a), i.add(u));
    }
    function _y(e, t, a) {
      by.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Da), ME(a, e, i, t);
    }
    var gh = "_reactListening" + Math.random().toString(36).slice(2);
    function tp(e) {
      if (!e[gh]) {
        e[gh] = !0, lt.forEach(function(a) {
          a !== "selectionchange" && (by.has(a) || _y(a, !1, e), _y(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[gh] || (t[gh] = !0, _y("selectionchange", !1, t)));
      }
    }
    function ME(e, t, a, i, u) {
      var s = cr(e, t, a), f = void 0;
      is && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Bd(e, t, s, f) : na(e, t, s) : f !== void 0 ? To(e, t, s, f) : Us(e, t, s);
    }
    function NE(e, t) {
      return e === t || e.nodeType === Nn && e.parentNode === t;
    }
    function Dy(e, t, a, i, u) {
      var s = i;
      if (!(t & fd) && !(t & hc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === q || v === Ee) {
              var y = p.stateNode.containerInfo;
              if (NE(y, f))
                break;
              if (v === Ee)
                for (var S = p.return; S !== null; ) {
                  var b = S.tag;
                  if (b === q || b === Ee) {
                    var w = S.stateNode.containerInfo;
                    if (NE(w, f))
                      return;
                  }
                  S = S.return;
                }
              for (; y !== null; ) {
                var N = Ys(y);
                if (N === null)
                  return;
                var A = N.tag;
                if (A === ie || A === Ie) {
                  p = s = N;
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
    function LT(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, S = null; y !== null; ) {
        var b = y, w = b.stateNode, N = b.tag;
        if (N === ie && w !== null && (S = w, p !== null)) {
          var A = xl(y, p);
          A != null && v.push(np(y, A, S));
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
        if (p === ie && f !== null) {
          var v = f, y = xl(u, a);
          y != null && i.unshift(np(u, y, v));
          var S = xl(u, t);
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
      while (e && e.tag !== ie);
      return e || null;
    }
    function MT(e, t) {
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
        if (b === ie && S !== null) {
          var w = S;
          if (u) {
            var N = xl(p, s);
            N != null && f.unshift(np(p, N, w));
          } else if (!u) {
            var A = xl(p, s);
            A != null && f.push(np(p, A, w));
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
      var s = i && u ? MT(i, u) : null;
      i !== null && zE(e, t, i, s, !1), u !== null && a !== null && zE(e, a, u, s, !0);
    }
    function zT(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, rp = "dangerouslySetInnerHTML", Eh = "suppressContentEditableWarning", Do = "suppressHydrationWarning", UE = "autoFocus", Bs = "children", Is = "style", Ch = "__html", ky, Rh, ap, AE, Th, jE, FE;
    ky = {
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
        registrationNameDependencies: at,
        possibleRegistrationNames: ut
      });
    }, jE = Ln && !document.documentMode, ap = function(e, t, a) {
      if (!Fa) {
        var i = wh(a), u = wh(t);
        u !== i && (Fa = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, AE = function(e) {
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
    var UT = /\r\n?/g, AT = /\u0000|\uFFFD/g;
    function wh(e) {
      Kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(UT, `
`).replace(AT, "");
    }
    function xh(e, t, a, i) {
      var u = wh(t), s = wh(e);
      if (s !== u && (i && (Fa || (Fa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && be))
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
          else s === Eh || s === Do || s === UE || (at.hasOwnProperty(s) ? f != null && (typeof f != "function" && Th(s, f), s === "onScroll" && En("scroll", t)) : f != null && _r(t, s, f, u));
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
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(ky, e) && (ky[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
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
          kt(e, a), s = a;
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
          Ja(e), z(e, a, !1);
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
          } else v === rp || v === Bs || v === Eh || v === Do || v === UE || (at.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var w = p[v], N = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || w === N || w == null && N == null))
          if (v === Is)
            if (w && Object.freeze(w), N) {
              for (y in N)
                N.hasOwnProperty(y) && (!w || !w.hasOwnProperty(y)) && (S || (S = {}), S[y] = "");
              for (y in w)
                w.hasOwnProperty(y) && N[y] !== w[y] && (S || (S = {}), S[y] = w[y]);
            } else
              S || (s || (s = []), s.push(v, S)), S = w;
          else if (v === rp) {
            var A = w ? w[Ch] : void 0, H = N ? N[Ch] : void 0;
            A != null && H !== A && (s = s || []).push(v, A);
          } else v === Bs ? (typeof w == "string" || typeof w == "number") && (s = s || []).push(v, "" + w) : v === Eh || v === Do || (at.hasOwnProperty(v) ? (w != null && (typeof w != "function" && Th(v, w), v === "onScroll" && En("scroll", e)), !s && N !== w && (s = [])) : (s = s || []).push(v, w));
      }
      return S && (ny(S, p[Is]), (s = s || []).push(Is, S)), s;
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
          kt(e, a);
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
          var w = S[b].name.toLowerCase();
          switch (w) {
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
      var N = null;
      for (var A in a)
        if (a.hasOwnProperty(A)) {
          var H = a[A];
          if (A === Bs)
            typeof H == "string" ? e.textContent !== H && (a[Do] !== !0 && xh(e.textContent, H, s, f), N = [Bs, H]) : typeof H == "number" && e.textContent !== "" + H && (a[Do] !== !0 && xh(e.textContent, H, s, f), N = [Bs, "" + H]);
          else if (at.hasOwnProperty(A))
            H != null && (typeof H != "function" && Th(A, H), A === "onScroll" && En("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var de = void 0, Fe = rn(A);
            if (a[Do] !== !0) {
              if (!(A === Eh || A === Do || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              A === "value" || A === "checked" || A === "selected")) {
                if (A === rp) {
                  var Me = e.innerHTML, _t = H ? H[Ch] : void 0;
                  if (_t != null) {
                    var Et = FE(e, _t);
                    Et !== Me && ap(A, Me, Et);
                  }
                } else if (A === Is) {
                  if (v.delete(A), jE) {
                    var O = ey(H);
                    de = e.getAttribute("style"), O !== de && ap(A, de, O);
                  }
                } else if (p && !_)
                  v.delete(A.toLowerCase()), de = tu(e, A, H), H !== de && ap(A, de, H);
                else if (!hn(A, Fe, p) && !Xn(A, H, Fe, p)) {
                  var P = !1;
                  if (Fe !== null)
                    v.delete(Fe.attributeName), de = vl(e, A, H, Fe);
                  else {
                    var L = i;
                    if (L === Ii && (L = td(t)), L === Ii)
                      v.delete(A.toLowerCase());
                    else {
                      var ee = $T(A);
                      ee !== null && ee !== A && (P = !0, v.delete(ee)), v.delete(A);
                    }
                    de = tu(e, A, H);
                  }
                  var ye = _;
                  !ye && H !== de && !P && ap(A, de, H);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Do] !== !0 && AE(v), t) {
        case "input":
          Ja(e), z(e, a, !0);
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
      return N;
    }
    function WT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Oy(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Ly(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function My(e, t, a) {
      {
        if (Fa)
          return;
        Fa = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function GT(e, t, a) {
      switch (t) {
        case "input":
          F(e, a);
          return;
        case "textarea":
          Km(e, a);
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
        var a = it({}, e || VE), i = {
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
              var w = "";
              v === "table" && e === "tr" && (w += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", S, v, b, w);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", S, v);
          }
        }
      };
    }
    var _h = "suppressHydrationWarning", Dh = "$", kh = "/$", up = "$?", op = "$!", ew = "style", zy = null, Uy = null;
    function tw(e) {
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
    function nw(e, t, a) {
      {
        var i = e, u = nd(i.namespace, t), s = lp(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function zD(e) {
      return e;
    }
    function rw(e) {
      zy = Hn(), Uy = yT();
      var t = null;
      return Gn(!1), t;
    }
    function aw(e) {
      gT(Uy), Gn(zy), zy = null, Uy = null;
    }
    function iw(e, t, a, i, u) {
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
      return fp(u, y), Iy(y, t), y;
    }
    function lw(e, t) {
      e.appendChild(t);
    }
    function uw(e, t, a, i, u) {
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
    function ow(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = lp(f.ancestorInfo, t);
          ip(null, p, v);
        }
      }
      return IT(e, t, a, i);
    }
    function Ay(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function sw(e, t, a, i) {
      {
        var u = a;
        ip(null, e, u.ancestorInfo);
      }
      var s = VT(e, t);
      return fp(i, s), s;
    }
    function cw() {
      var e = window.event;
      return e === void 0 ? za : af(e.type);
    }
    var jy = typeof setTimeout == "function" ? setTimeout : void 0, fw = typeof clearTimeout == "function" ? clearTimeout : void 0, Fy = -1, IE = typeof Promise == "function" ? Promise : void 0, dw = typeof queueMicrotask == "function" ? queueMicrotask : typeof IE < "u" ? function(e) {
      return IE.resolve(null).then(e).catch(pw);
    } : jy;
    function pw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function vw(e, t, a, i) {
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
    function hw(e, t, a, i, u, s) {
      YT(e, t, a, i, u), Iy(e, u);
    }
    function YE(e) {
      ao(e, "");
    }
    function mw(e, t, a) {
      e.nodeValue = a;
    }
    function yw(e, t) {
      e.appendChild(t);
    }
    function gw(e, t) {
      var a;
      e.nodeType === Nn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && bh(a);
    }
    function Sw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Ew(e, t, a) {
      e.nodeType === Nn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Cw(e, t) {
      e.removeChild(t);
    }
    function Rw(e, t) {
      e.nodeType === Nn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Hy(e, t) {
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
    function Tw(e, t) {
      e.nodeType === Nn ? Hy(e.parentNode, t) : e.nodeType === Wr && Hy(e, t), ku(e);
    }
    function ww(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function xw(e) {
      e.nodeValue = "";
    }
    function bw(e, t) {
      e = e;
      var a = t[ew], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = cc("display", i);
    }
    function _w(e, t) {
      e.nodeValue = t;
    }
    function Dw(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function kw(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Ow(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function Lw(e) {
      return e.nodeType !== Nn ? null : e;
    }
    function $E(e) {
      return e.data === up;
    }
    function Py(e) {
      return e.data === op;
    }
    function Mw(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Nw(e, t) {
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
    function zw(e) {
      return Oh(e.firstChild);
    }
    function Uw(e) {
      return Oh(e.firstChild);
    }
    function Aw(e) {
      return Oh(e.nextSibling);
    }
    function jw(e, t, a, i, u, s, f) {
      fp(s, e), Iy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & ht) !== Ue;
      return QT(e, t, a, p, i, y, f);
    }
    function Fw(e, t, a, i) {
      return fp(a, e), a.mode & ht, WT(e, t);
    }
    function Hw(e, t) {
      fp(t, e);
    }
    function Pw(e) {
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
    function Vw(e) {
      ku(e);
    }
    function Bw(e) {
      ku(e);
    }
    function Iw(e) {
      return e !== "head" && e !== "body";
    }
    function Yw(e, t, a, i) {
      var u = !0;
      xh(t.nodeValue, a, i, u);
    }
    function $w(e, t, a, i, u, s) {
      if (t[_h] !== !0) {
        var f = !0;
        xh(i.nodeValue, u, s, f);
      }
    }
    function Qw(e, t) {
      t.nodeType === Wr ? Oy(e, t) : t.nodeType === Nn || Ly(e, t);
    }
    function Ww(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? Oy(a, t) : t.nodeType === Nn || Ly(a, t));
      }
    }
    function Gw(e, t, a, i, u) {
      (u || t[_h] !== !0) && (i.nodeType === Wr ? Oy(a, i) : i.nodeType === Nn || Ly(a, i));
    }
    function qw(e, t, a) {
      My(e, t);
    }
    function Kw(e, t) {
      Ny(e, t);
    }
    function Xw(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && My(i, t);
      }
    }
    function Zw(e, t) {
      {
        var a = e.parentNode;
        a !== null && Ny(a, t);
      }
    }
    function Jw(e, t, a, i, u, s) {
      (s || t[_h] !== !0) && My(a, i);
    }
    function ex(e, t, a, i, u) {
      (u || t[_h] !== !0) && Ny(a, i);
    }
    function tx(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function nx(e) {
      tp(e);
    }
    var Sf = Math.random().toString(36).slice(2), Ef = "__reactFiber$" + Sf, Vy = "__reactProps$" + Sf, cp = "__reactContainer$" + Sf, By = "__reactEvents$" + Sf, rx = "__reactListeners$" + Sf, ax = "__reactHandles$" + Sf;
    function ix(e) {
      delete e[Ef], delete e[Vy], delete e[By], delete e[rx], delete e[ax];
    }
    function fp(e, t) {
      t[Ef] = e;
    }
    function Lh(e, t) {
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
      return t && (t.tag === ie || t.tag === Ie || t.tag === Z || t.tag === q) ? t : null;
    }
    function Cf(e) {
      if (e.tag === ie || e.tag === Ie)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Mh(e) {
      return e[Vy] || null;
    }
    function Iy(e, t) {
      e[Vy] = t;
    }
    function lx(e) {
      var t = e[By];
      return t === void 0 && (t = e[By] = /* @__PURE__ */ new Set()), t;
    }
    var GE = {}, qE = k.ReactDebugCurrentFrame;
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
    var Yy = [], zh;
    zh = [];
    var Uu = -1;
    function Oo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (Uu < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== zh[Uu] && g("Unexpected Fiber popped."), e.current = Yy[Uu], Yy[Uu] = null, zh[Uu] = null, Uu--;
    }
    function ia(e, t, a) {
      Uu++, Yy[Uu] = e.current, zh[Uu] = a, e.current = t;
    }
    var $y;
    $y = {};
    var ui = {};
    Object.freeze(ui);
    var Au = Oo(ui), Il = Oo(!1), Qy = ui;
    function Rf(e, t, a) {
      return a && Yl(t) ? Qy : Au.current;
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
          var p = Xe(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && KE(e, t, s), s;
      }
    }
    function Uh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Ah(e) {
      aa(Il, e), aa(Au, e);
    }
    function Wy(e) {
      aa(Il, e), aa(Au, e);
    }
    function XE(e, t, a) {
      {
        if (Au.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Au, t, e), ia(Il, a, e);
      }
    }
    function ZE(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Xe(e) || "Unknown";
            $y[s] || ($y[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Xe(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Xe(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return it({}, a, f);
      }
    }
    function jh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Qy = Au.current, ia(Au, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function JE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = ZE(e, t, Qy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Au, e), ia(Au, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function ux(e) {
      {
        if (!hu(e) || e.tag !== G)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case q:
              return t.stateNode.context;
            case G: {
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
    var Lo = 0, Fh = 1, ju = null, Gy = !1, qy = !1;
    function eC(e) {
      ju === null ? ju = [e] : ju.push(e);
    }
    function ox(e) {
      Gy = !0, eC(e);
    }
    function tC() {
      Gy && Mo();
    }
    function Mo() {
      if (!qy && ju !== null) {
        qy = !0;
        var e = 0, t = Aa();
        try {
          var a = !0, i = ju;
          for (Fn(Mr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          ju = null, Gy = !1;
        } catch (s) {
          throw ju !== null && (ju = ju.slice(e + 1)), hd(ss, Mo), s;
        } finally {
          Fn(t), qy = !1;
        }
      }
      return null;
    }
    var wf = [], xf = 0, Hh = null, Ph = 0, Mi = [], Ni = 0, $s = null, Fu = 1, Hu = "";
    function sx(e) {
      return Ws(), (e.flags & Ri) !== ze;
    }
    function cx(e) {
      return Ws(), Ph;
    }
    function fx() {
      var e = Hu, t = Fu, a = t & ~dx(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Ws(), wf[xf++] = Ph, wf[xf++] = Hh, Hh = e, Ph = t;
    }
    function nC(e, t, a) {
      Ws(), Mi[Ni++] = Fu, Mi[Ni++] = Hu, Mi[Ni++] = $s, $s = e;
      var i = Fu, u = Hu, s = Vh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Vh(t) + s;
      if (v > 30) {
        var y = s - s % 5, S = (1 << y) - 1, b = (f & S).toString(32), w = f >> y, N = s - y, A = Vh(t) + N, H = p << N, de = H | w, Fe = b + u;
        Fu = 1 << A | de, Hu = Fe;
      } else {
        var Me = p << s, _t = Me | f, Et = u;
        Fu = 1 << v | _t, Hu = Et;
      }
    }
    function Ky(e) {
      Ws();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), nC(e, a, i);
      }
    }
    function Vh(e) {
      return 32 - An(e);
    }
    function dx(e) {
      return 1 << Vh(e) - 1;
    }
    function Xy(e) {
      for (; e === Hh; )
        Hh = wf[--xf], wf[xf] = null, Ph = wf[--xf], wf[xf] = null;
      for (; e === $s; )
        $s = Mi[--Ni], Mi[Ni] = null, Hu = Mi[--Ni], Mi[Ni] = null, Fu = Mi[--Ni], Mi[Ni] = null;
    }
    function px() {
      return Ws(), $s !== null ? {
        id: Fu,
        overflow: Hu
      } : null;
    }
    function vx(e, t) {
      Ws(), Mi[Ni++] = Fu, Mi[Ni++] = Hu, Mi[Ni++] = $s, Fu = t.id, Hu = t.overflow, $s = e;
    }
    function Ws() {
      jr() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ar = null, zi = null, rl = !1, Gs = !1, No = null;
    function hx() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function rC() {
      Gs = !0;
    }
    function mx() {
      return Gs;
    }
    function yx(e) {
      var t = e.stateNode.containerInfo;
      return zi = Uw(t), Ar = e, rl = !0, No = null, Gs = !1, !0;
    }
    function gx(e, t, a) {
      return zi = Aw(t), Ar = e, rl = !0, No = null, Gs = !1, a !== null && vx(e, a), !0;
    }
    function aC(e, t) {
      switch (e.tag) {
        case q: {
          Qw(e.stateNode.containerInfo, t);
          break;
        }
        case ie: {
          var a = (e.mode & ht) !== Ue;
          Gw(
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
          i.dehydrated !== null && Ww(i.dehydrated, t);
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
    function Zy(e, t) {
      {
        if (Gs)
          return;
        switch (e.tag) {
          case q: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ie:
                var i = t.type;
                t.pendingProps, qw(a, i);
                break;
              case Ie:
                var u = t.pendingProps;
                Kw(a, u);
                break;
            }
            break;
          }
          case ie: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ie: {
                var v = t.type, y = t.pendingProps, S = (e.mode & ht) !== Ue;
                Jw(
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
              case Ie: {
                var b = t.pendingProps, w = (e.mode & ht) !== Ue;
                ex(
                  s,
                  f,
                  p,
                  b,
                  // TODO: Delete this argument when we remove the legacy root API.
                  w
                );
                break;
              }
            }
            break;
          }
          case Z: {
            var N = e.memoizedState, A = N.dehydrated;
            if (A !== null) switch (t.tag) {
              case ie:
                var H = t.type;
                t.pendingProps, Xw(A, H);
                break;
              case Ie:
                var de = t.pendingProps;
                Zw(A, de);
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
      t.flags = t.flags & ~qr | yn, Zy(e, t);
    }
    function uC(e, t) {
      switch (e.tag) {
        case ie: {
          var a = e.type;
          e.pendingProps;
          var i = kw(t, a);
          return i !== null ? (e.stateNode = i, Ar = e, zi = zw(i), !0) : !1;
        }
        case Ie: {
          var u = e.pendingProps, s = Ow(t, u);
          return s !== null ? (e.stateNode = s, Ar = e, zi = null, !0) : !1;
        }
        case Z: {
          var f = Lw(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: px(),
              retryLane: Jr
            };
            e.memoizedState = p;
            var v = T_(f);
            return v.return = e, e.child = v, Ar = e, zi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function Jy(e) {
      return (e.mode & ht) !== Ue && (e.flags & Ne) === ze;
    }
    function eg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function tg(e) {
      if (rl) {
        var t = zi;
        if (!t) {
          Jy(e) && (Zy(Ar, e), eg()), lC(Ar, e), rl = !1, Ar = e;
          return;
        }
        var a = t;
        if (!uC(e, t)) {
          Jy(e) && (Zy(Ar, e), eg()), t = sp(a);
          var i = Ar;
          if (!t || !uC(e, t)) {
            lC(Ar, e), rl = !1, Ar = e;
            return;
          }
          iC(i, a);
        }
      }
    }
    function Sx(e, t, a) {
      var i = e.stateNode, u = !Gs, s = jw(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function Ex(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Fw(t, a, e);
      if (i) {
        var u = Ar;
        if (u !== null)
          switch (u.tag) {
            case q: {
              var s = u.stateNode.containerInfo, f = (u.mode & ht) !== Ue;
              Yw(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ie: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, S = (u.mode & ht) !== Ue;
              $w(
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
    function Cx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Hw(a, e);
    }
    function Rx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Pw(a);
    }
    function oC(e) {
      for (var t = e.return; t !== null && t.tag !== ie && t.tag !== q && t.tag !== Z; )
        t = t.return;
      Ar = t;
    }
    function Bh(e) {
      if (e !== Ar)
        return !1;
      if (!rl)
        return oC(e), rl = !0, !1;
      if (e.tag !== q && (e.tag !== ie || Iw(e.type) && !Ay(e.type, e.memoizedProps))) {
        var t = zi;
        if (t)
          if (Jy(e))
            sC(e), eg();
          else
            for (; t; )
              iC(e, t), t = sp(t);
      }
      return oC(e), e.tag === Z ? zi = Rx(e) : zi = Ar ? sp(e.stateNode) : null, !0;
    }
    function Tx() {
      return rl && zi !== null;
    }
    function sC(e) {
      for (var t = zi; t; )
        aC(e, t), t = sp(t);
    }
    function bf() {
      Ar = null, zi = null, rl = !1, Gs = !1;
    }
    function cC() {
      No !== null && (rR(No), No = null);
    }
    function jr() {
      return rl;
    }
    function ng(e) {
      No === null ? No = [e] : No.push(e);
    }
    var wx = k.ReactCurrentBatchConfig, xx = null;
    function bx() {
      return wx.transition;
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
      var _x = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Kt && (t = a), a = a.return;
        return t;
      }, qs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, pp = [], vp = [], hp = [], mp = [], yp = [], gp = [], Ks = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && pp.push(e), e.mode & Kt && typeof t.UNSAFE_componentWillMount == "function" && vp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && hp.push(e), e.mode & Kt && typeof t.UNSAFE_componentWillReceiveProps == "function" && mp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && yp.push(e), e.mode & Kt && typeof t.UNSAFE_componentWillUpdate == "function" && gp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        pp.length > 0 && (pp.forEach(function(w) {
          e.add(Xe(w) || "Component"), Ks.add(w.type);
        }), pp = []);
        var t = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(w) {
          t.add(Xe(w) || "Component"), Ks.add(w.type);
        }), vp = []);
        var a = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(w) {
          a.add(Xe(w) || "Component"), Ks.add(w.type);
        }), hp = []);
        var i = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(w) {
          i.add(Xe(w) || "Component"), Ks.add(w.type);
        }), mp = []);
        var u = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(w) {
          u.add(Xe(w) || "Component"), Ks.add(w.type);
        }), yp = []);
        var s = /* @__PURE__ */ new Set();
        if (gp.length > 0 && (gp.forEach(function(w) {
          s.add(Xe(w) || "Component"), Ks.add(w.type);
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
          Be(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var S = qs(a);
          Be(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (u.size > 0) {
          var b = qs(u);
          Be(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, b);
        }
      };
      var Ih = /* @__PURE__ */ new Map(), fC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = _x(e);
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
              i.add(Xe(s) || "Component"), fC.add(s.type);
            });
            var u = qs(i);
            try {
              Wt(a), g(`Legacy context API has been detected within a strict-mode tree.

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
    var rg, ag, ig, lg, ug, dC = function(e, t) {
    };
    rg = !1, ag = !1, ig = {}, lg = {}, ug = {}, dC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Xe(t) || "Component";
        lg[a] || (lg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Dx(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Sp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Kt || I) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== G) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Dx(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = Xe(e) || "Component";
          ig[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), ig[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== G)
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
            var w = v.refs;
            b === null ? delete w[y] : w[y] = b;
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
        var t = Xe(e) || "Component";
        if (ug[t])
          return;
        ug[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function pC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function vC(e) {
      function t(O, P) {
        if (e) {
          var L = O.deletions;
          L === null ? (O.deletions = [P], O.flags |= ka) : L.push(P);
        }
      }
      function a(O, P) {
        if (!e)
          return null;
        for (var L = P; L !== null; )
          t(O, L), L = L.sibling;
        return null;
      }
      function i(O, P) {
        for (var L = /* @__PURE__ */ new Map(), ee = P; ee !== null; )
          ee.key !== null ? L.set(ee.key, ee) : L.set(ee.index, ee), ee = ee.sibling;
        return L;
      }
      function u(O, P) {
        var L = ic(O, P);
        return L.index = 0, L.sibling = null, L;
      }
      function s(O, P, L) {
        if (O.index = L, !e)
          return O.flags |= Ri, P;
        var ee = O.alternate;
        if (ee !== null) {
          var ye = ee.index;
          return ye < P ? (O.flags |= yn, P) : ye;
        } else
          return O.flags |= yn, P;
      }
      function f(O) {
        return e && O.alternate === null && (O.flags |= yn), O;
      }
      function p(O, P, L, ee) {
        if (P === null || P.tag !== Ie) {
          var ye = nE(L, O.mode, ee);
          return ye.return = O, ye;
        } else {
          var ve = u(P, L);
          return ve.return = O, ve;
        }
      }
      function v(O, P, L, ee) {
        var ye = L.type;
        if (ye === di)
          return S(O, P, L.props.children, ee, L.key);
        if (P !== null && (P.elementType === ye || // Keep this check inline so it only runs on the false path:
        SR(P, L) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof ye == "object" && ye !== null && ye.$$typeof === Ze && pC(ye) === P.type)) {
          var ve = u(P, L.props);
          return ve.ref = Sp(O, P, L), ve.return = O, ve._debugSource = L._source, ve._debugOwner = L._owner, ve;
        }
        var We = tE(L, O.mode, ee);
        return We.ref = Sp(O, P, L), We.return = O, We;
      }
      function y(O, P, L, ee) {
        if (P === null || P.tag !== Ee || P.stateNode.containerInfo !== L.containerInfo || P.stateNode.implementation !== L.implementation) {
          var ye = rE(L, O.mode, ee);
          return ye.return = O, ye;
        } else {
          var ve = u(P, L.children || []);
          return ve.return = O, ve;
        }
      }
      function S(O, P, L, ee, ye) {
        if (P === null || P.tag !== St) {
          var ve = Yo(L, O.mode, ee, ye);
          return ve.return = O, ve;
        } else {
          var We = u(P, L);
          return We.return = O, We;
        }
      }
      function b(O, P, L) {
        if (typeof P == "string" && P !== "" || typeof P == "number") {
          var ee = nE("" + P, O.mode, L);
          return ee.return = O, ee;
        }
        if (typeof P == "object" && P !== null) {
          switch (P.$$typeof) {
            case Dr: {
              var ye = tE(P, O.mode, L);
              return ye.ref = Sp(O, null, P), ye.return = O, ye;
            }
            case ar: {
              var ve = rE(P, O.mode, L);
              return ve.return = O, ve;
            }
            case Ze: {
              var We = P._payload, et = P._init;
              return b(O, et(We), L);
            }
          }
          if (st(P) || nt(P)) {
            var Zt = Yo(P, O.mode, L, null);
            return Zt.return = O, Zt;
          }
          Yh(O, P);
        }
        return typeof P == "function" && $h(O), null;
      }
      function w(O, P, L, ee) {
        var ye = P !== null ? P.key : null;
        if (typeof L == "string" && L !== "" || typeof L == "number")
          return ye !== null ? null : p(O, P, "" + L, ee);
        if (typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case Dr:
              return L.key === ye ? v(O, P, L, ee) : null;
            case ar:
              return L.key === ye ? y(O, P, L, ee) : null;
            case Ze: {
              var ve = L._payload, We = L._init;
              return w(O, P, We(ve), ee);
            }
          }
          if (st(L) || nt(L))
            return ye !== null ? null : S(O, P, L, ee, null);
          Yh(O, L);
        }
        return typeof L == "function" && $h(O), null;
      }
      function N(O, P, L, ee, ye) {
        if (typeof ee == "string" && ee !== "" || typeof ee == "number") {
          var ve = O.get(L) || null;
          return p(P, ve, "" + ee, ye);
        }
        if (typeof ee == "object" && ee !== null) {
          switch (ee.$$typeof) {
            case Dr: {
              var We = O.get(ee.key === null ? L : ee.key) || null;
              return v(P, We, ee, ye);
            }
            case ar: {
              var et = O.get(ee.key === null ? L : ee.key) || null;
              return y(P, et, ee, ye);
            }
            case Ze:
              var Zt = ee._payload, Ft = ee._init;
              return N(O, P, L, Ft(Zt), ye);
          }
          if (st(ee) || nt(ee)) {
            var qn = O.get(L) || null;
            return S(P, qn, ee, ye, null);
          }
          Yh(P, ee);
        }
        return typeof ee == "function" && $h(P), null;
      }
      function A(O, P, L) {
        {
          if (typeof O != "object" || O === null)
            return P;
          switch (O.$$typeof) {
            case Dr:
            case ar:
              dC(O, L);
              var ee = O.key;
              if (typeof ee != "string")
                break;
              if (P === null) {
                P = /* @__PURE__ */ new Set(), P.add(ee);
                break;
              }
              if (!P.has(ee)) {
                P.add(ee);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ee);
              break;
            case Ze:
              var ye = O._payload, ve = O._init;
              A(ve(ye), P, L);
              break;
          }
        }
        return P;
      }
      function H(O, P, L, ee) {
        for (var ye = null, ve = 0; ve < L.length; ve++) {
          var We = L[ve];
          ye = A(We, ye, O);
        }
        for (var et = null, Zt = null, Ft = P, qn = 0, Ht = 0, Vn = null; Ft !== null && Ht < L.length; Ht++) {
          Ft.index > Ht ? (Vn = Ft, Ft = null) : Vn = Ft.sibling;
          var ua = w(O, Ft, L[Ht], ee);
          if (ua === null) {
            Ft === null && (Ft = Vn);
            break;
          }
          e && Ft && ua.alternate === null && t(O, Ft), qn = s(ua, qn, Ht), Zt === null ? et = ua : Zt.sibling = ua, Zt = ua, Ft = Vn;
        }
        if (Ht === L.length) {
          if (a(O, Ft), jr()) {
            var Yr = Ht;
            Qs(O, Yr);
          }
          return et;
        }
        if (Ft === null) {
          for (; Ht < L.length; Ht++) {
            var si = b(O, L[Ht], ee);
            si !== null && (qn = s(si, qn, Ht), Zt === null ? et = si : Zt.sibling = si, Zt = si);
          }
          if (jr()) {
            var Ra = Ht;
            Qs(O, Ra);
          }
          return et;
        }
        for (var Ta = i(O, Ft); Ht < L.length; Ht++) {
          var oa = N(Ta, O, Ht, L[Ht], ee);
          oa !== null && (e && oa.alternate !== null && Ta.delete(oa.key === null ? Ht : oa.key), qn = s(oa, qn, Ht), Zt === null ? et = oa : Zt.sibling = oa, Zt = oa);
        }
        if (e && Ta.forEach(function($f) {
          return t(O, $f);
        }), jr()) {
          var Qu = Ht;
          Qs(O, Qu);
        }
        return et;
      }
      function de(O, P, L, ee) {
        var ye = nt(L);
        if (typeof ye != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          L[Symbol.toStringTag] === "Generator" && (ag || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), ag = !0), L.entries === ye && (rg || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), rg = !0);
          var ve = ye.call(L);
          if (ve)
            for (var We = null, et = ve.next(); !et.done; et = ve.next()) {
              var Zt = et.value;
              We = A(Zt, We, O);
            }
        }
        var Ft = ye.call(L);
        if (Ft == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qn = null, Ht = null, Vn = P, ua = 0, Yr = 0, si = null, Ra = Ft.next(); Vn !== null && !Ra.done; Yr++, Ra = Ft.next()) {
          Vn.index > Yr ? (si = Vn, Vn = null) : si = Vn.sibling;
          var Ta = w(O, Vn, Ra.value, ee);
          if (Ta === null) {
            Vn === null && (Vn = si);
            break;
          }
          e && Vn && Ta.alternate === null && t(O, Vn), ua = s(Ta, ua, Yr), Ht === null ? qn = Ta : Ht.sibling = Ta, Ht = Ta, Vn = si;
        }
        if (Ra.done) {
          if (a(O, Vn), jr()) {
            var oa = Yr;
            Qs(O, oa);
          }
          return qn;
        }
        if (Vn === null) {
          for (; !Ra.done; Yr++, Ra = Ft.next()) {
            var Qu = b(O, Ra.value, ee);
            Qu !== null && (ua = s(Qu, ua, Yr), Ht === null ? qn = Qu : Ht.sibling = Qu, Ht = Qu);
          }
          if (jr()) {
            var $f = Yr;
            Qs(O, $f);
          }
          return qn;
        }
        for (var Xp = i(O, Vn); !Ra.done; Yr++, Ra = Ft.next()) {
          var Zl = N(Xp, O, Yr, Ra.value, ee);
          Zl !== null && (e && Zl.alternate !== null && Xp.delete(Zl.key === null ? Yr : Zl.key), ua = s(Zl, ua, Yr), Ht === null ? qn = Zl : Ht.sibling = Zl, Ht = Zl);
        }
        if (e && Xp.forEach(function(eD) {
          return t(O, eD);
        }), jr()) {
          var J_ = Yr;
          Qs(O, J_);
        }
        return qn;
      }
      function Fe(O, P, L, ee) {
        if (P !== null && P.tag === Ie) {
          a(O, P.sibling);
          var ye = u(P, L);
          return ye.return = O, ye;
        }
        a(O, P);
        var ve = nE(L, O.mode, ee);
        return ve.return = O, ve;
      }
      function Me(O, P, L, ee) {
        for (var ye = L.key, ve = P; ve !== null; ) {
          if (ve.key === ye) {
            var We = L.type;
            if (We === di) {
              if (ve.tag === St) {
                a(O, ve.sibling);
                var et = u(ve, L.props.children);
                return et.return = O, et._debugSource = L._source, et._debugOwner = L._owner, et;
              }
            } else if (ve.elementType === We || // Keep this check inline so it only runs on the false path:
            SR(ve, L) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof We == "object" && We !== null && We.$$typeof === Ze && pC(We) === ve.type) {
              a(O, ve.sibling);
              var Zt = u(ve, L.props);
              return Zt.ref = Sp(O, ve, L), Zt.return = O, Zt._debugSource = L._source, Zt._debugOwner = L._owner, Zt;
            }
            a(O, ve);
            break;
          } else
            t(O, ve);
          ve = ve.sibling;
        }
        if (L.type === di) {
          var Ft = Yo(L.props.children, O.mode, ee, L.key);
          return Ft.return = O, Ft;
        } else {
          var qn = tE(L, O.mode, ee);
          return qn.ref = Sp(O, P, L), qn.return = O, qn;
        }
      }
      function _t(O, P, L, ee) {
        for (var ye = L.key, ve = P; ve !== null; ) {
          if (ve.key === ye)
            if (ve.tag === Ee && ve.stateNode.containerInfo === L.containerInfo && ve.stateNode.implementation === L.implementation) {
              a(O, ve.sibling);
              var We = u(ve, L.children || []);
              return We.return = O, We;
            } else {
              a(O, ve);
              break;
            }
          else
            t(O, ve);
          ve = ve.sibling;
        }
        var et = rE(L, O.mode, ee);
        return et.return = O, et;
      }
      function Et(O, P, L, ee) {
        var ye = typeof L == "object" && L !== null && L.type === di && L.key === null;
        if (ye && (L = L.props.children), typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case Dr:
              return f(Me(O, P, L, ee));
            case ar:
              return f(_t(O, P, L, ee));
            case Ze:
              var ve = L._payload, We = L._init;
              return Et(O, P, We(ve), ee);
          }
          if (st(L))
            return H(O, P, L, ee);
          if (nt(L))
            return de(O, P, L, ee);
          Yh(O, L);
        }
        return typeof L == "string" && L !== "" || typeof L == "number" ? f(Fe(O, P, "" + L, ee)) : (typeof L == "function" && $h(O), a(O, P));
      }
      return Et;
    }
    var _f = vC(!0), hC = vC(!1);
    function kx(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ic(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ic(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Ox(e, t) {
      for (var a = e.child; a !== null; )
        y_(a, t), a = a.sibling;
    }
    var og = Oo(null), sg;
    sg = {};
    var Qh = null, Df = null, cg = null, Wh = !1;
    function Gh() {
      Qh = null, Df = null, cg = null, Wh = !1;
    }
    function mC() {
      Wh = !0;
    }
    function yC() {
      Wh = !1;
    }
    function gC(e, t, a) {
      ia(og, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== sg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = sg;
    }
    function fg(e, t) {
      var a = og.current;
      aa(og, t), e._currentValue = a;
    }
    function dg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Du(i.childLanes, t) ? u !== null && !Du(u.childLanes, t) && (u.childLanes = rt(u.childLanes, t)) : (i.childLanes = rt(i.childLanes, t), u !== null && (u.childLanes = rt(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Lx(e, t, a) {
      Mx(e, t, a);
    }
    function Mx(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === G) {
                var p = Ts(a), v = Pu(en, p);
                v.tag = Kh;
                var y = i.updateQueue;
                if (y !== null) {
                  var S = y.shared, b = S.pending;
                  b === null ? v.next = v : (v.next = b.next, b.next = v), S.pending = v;
                }
              }
              i.lanes = rt(i.lanes, a);
              var w = i.alternate;
              w !== null && (w.lanes = rt(w.lanes, a)), dg(i.return, a, e), s.lanes = rt(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === ct)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Ct) {
          var N = i.return;
          if (N === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          N.lanes = rt(N.lanes, a);
          var A = N.alternate;
          A !== null && (A.lanes = rt(A.lanes, a)), dg(N, a, e), u = i.sibling;
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
            var H = u.sibling;
            if (H !== null) {
              H.return = u.return, u = H;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function kf(e, t) {
      Qh = e, Df = null, cg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function nr(e) {
      Wh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (cg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (Qh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, Qh.dependencies = {
            lanes: Q,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Xs = null;
    function pg(e) {
      Xs === null ? Xs = [e] : Xs.push(e);
    }
    function Nx() {
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
      return u === null ? (a.next = a, pg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, qh(e, i);
    }
    function zx(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, pg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Ux(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, pg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, qh(e, i);
    }
    function Ha(e, t) {
      return qh(e, t);
    }
    var Ax = qh;
    function qh(e, t) {
      e.lanes = rt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = rt(a.lanes, t)), a === null && (e.flags & (yn | qr)) !== ze && hR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = rt(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = rt(a.childLanes, t) : (u.flags & (yn | qr)) !== ze && hR(e), i = u, u = u.return;
      if (i.tag === q) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var EC = 0, CC = 1, Kh = 2, vg = 3, Xh = !1, hg, Zh;
    hg = !1, Zh = null;
    function mg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: Q
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
      if (Zh === u && !hg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), hg = !0), z1()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Ax(e, a);
      } else
        return Ux(e, u, t, a);
    }
    function Jh(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Md(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = rt(s, a);
          u.lanes = f, ef(e, f);
        }
      }
    }
    function yg(e, t) {
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
    function jx(e, t, a, i, u, s) {
      switch (a.tag) {
        case CC: {
          var f = a.payload;
          if (typeof f == "function") {
            mC();
            var p = f.call(s, i, u);
            {
              if (e.mode & Kt) {
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
        case vg:
          e.flags = e.flags & ~Zn | Ne;
        case EC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            mC(), y = v.call(s, i, u);
            {
              if (e.mode & Kt) {
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
          return y == null ? i : it({}, i, y);
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
          var b = S.updateQueue, w = b.lastBaseUpdate;
          w !== f && (w === null ? b.firstBaseUpdate = y : w.next = y, b.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var N = u.baseState, A = Q, H = null, de = null, Fe = null, Me = s;
        do {
          var _t = Me.lane, Et = Me.eventTime;
          if (Du(i, _t)) {
            if (Fe !== null) {
              var P = {
                eventTime: Et,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Mt,
                tag: Me.tag,
                payload: Me.payload,
                callback: Me.callback,
                next: null
              };
              Fe = Fe.next = P;
            }
            N = jx(e, u, Me, N, t, a);
            var L = Me.callback;
            if (L !== null && // If the update was already committed, we should not queue its
            // callback again.
            Me.lane !== Mt) {
              e.flags |= un;
              var ee = u.effects;
              ee === null ? u.effects = [Me] : ee.push(Me);
            }
          } else {
            var O = {
              eventTime: Et,
              lane: _t,
              tag: Me.tag,
              payload: Me.payload,
              callback: Me.callback,
              next: null
            };
            Fe === null ? (de = Fe = O, H = N) : Fe = Fe.next = O, A = rt(A, _t);
          }
          if (Me = Me.next, Me === null) {
            if (p = u.shared.pending, p === null)
              break;
            var ye = p, ve = ye.next;
            ye.next = null, Me = ve, u.lastBaseUpdate = ye, u.shared.pending = null;
          }
        } while (!0);
        Fe === null && (H = N), u.baseState = H, u.firstBaseUpdate = de, u.lastBaseUpdate = Fe;
        var We = u.shared.interleaved;
        if (We !== null) {
          var et = We;
          do
            A = rt(A, et.lane), et = et.next;
          while (et !== We);
        } else s === null && (u.shared.lanes = Q);
        Qp(A), e.lanes = A, e.memoizedState = N;
      }
      Zh = null;
    }
    function Fx(e, t) {
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
    function wC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Fx(f, a));
        }
    }
    var Ep = {}, Uo = Oo(Ep), Cp = Oo(Ep), nm = Oo(Ep);
    function rm(e) {
      if (e === Ep)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function xC() {
      var e = rm(nm.current);
      return e;
    }
    function gg(e, t) {
      ia(nm, t, e), ia(Cp, e, e), ia(Uo, Ep, e);
      var a = tw(t);
      aa(Uo, e), ia(Uo, a, e);
    }
    function Of(e) {
      aa(Uo, e), aa(Cp, e), aa(nm, e);
    }
    function Sg() {
      var e = rm(Uo.current);
      return e;
    }
    function bC(e) {
      rm(nm.current);
      var t = rm(Uo.current), a = nw(t, e.type);
      t !== a && (ia(Cp, e, e), ia(Uo, a, e));
    }
    function Eg(e) {
      Cp.current === e && (aa(Uo, e), aa(Cp, e));
    }
    var Hx = 0, _C = 1, DC = 1, Rp = 2, il = Oo(Hx);
    function Cg(e, t) {
      return (e & t) !== 0;
    }
    function Lf(e) {
      return e & _C;
    }
    function Rg(e, t) {
      return e & _C | t;
    }
    function Px(e, t) {
      return e | t;
    }
    function Ao(e, t) {
      ia(il, t, e);
    }
    function Mf(e) {
      aa(il, e);
    }
    function Vx(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function am(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === Z) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || $E(i) || Py(i))
              return t;
          }
        } else if (t.tag === on && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Ne) !== ze;
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
    ), Tg = [];
    function wg() {
      for (var e = 0; e < Tg.length; e++) {
        var t = Tg[e];
        t._workInProgressVersionPrimary = null;
      }
      Tg.length = 0;
    }
    function Bx(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var me = k.ReactCurrentDispatcher, Tp = k.ReactCurrentBatchConfig, xg, Nf;
    xg = /* @__PURE__ */ new Set();
    var Zs = Q, Xt = null, pr = null, vr = null, im = !1, wp = !1, xp = 0, Ix = 0, Yx = 25, Y = null, Ui = null, jo = -1, bg = !1;
    function It() {
      {
        var e = Y;
        Ui === null ? Ui = [e] : Ui.push(e);
      }
    }
    function le() {
      {
        var e = Y;
        Ui !== null && (jo++, Ui[jo] !== e && $x(e));
      }
    }
    function zf(e) {
      e != null && !st(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Y, typeof e);
    }
    function $x(e) {
      {
        var t = Xe(Xt);
        if (!xg.has(t) && (xg.add(t), Ui !== null)) {
          for (var a = "", i = 30, u = 0; u <= jo; u++) {
            for (var s = Ui[u], f = u === jo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function _g(e, t) {
      if (bg)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Y), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, Y, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!X(e[a], t[a]))
          return !1;
      return !0;
    }
    function Uf(e, t, a, i, u, s) {
      Zs = s, Xt = t, Ui = e !== null ? e._debugHookTypes : null, jo = -1, bg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = Q, e !== null && e.memoizedState !== null ? me.current = KC : Ui !== null ? me.current = qC : me.current = GC;
      var f = a(i, u);
      if (wp) {
        var p = 0;
        do {
          if (wp = !1, xp = 0, p >= Yx)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, bg = !1, pr = null, vr = null, t.updateQueue = null, jo = -1, me.current = XC, f = a(i, u);
        } while (wp);
      }
      me.current = gm, t._debugHookTypes = Ui;
      var v = pr !== null && pr.next !== null;
      if (Zs = Q, Xt = null, pr = null, vr = null, Y = null, Ui = null, jo = -1, e !== null && (e.flags & Un) !== (t.flags & Un) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & ht) !== Ue && g("Internal React error: Expected static flag was missing. Please notify the React team."), im = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Af() {
      var e = xp !== 0;
      return xp = 0, e;
    }
    function kC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & At) !== Ue ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = ws(e.lanes, a);
    }
    function OC() {
      if (me.current = gm, im) {
        for (var e = Xt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        im = !1;
      }
      Zs = Q, Xt = null, pr = null, vr = null, Ui = null, jo = -1, Y = null, IC = !1, wp = !1, xp = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return vr === null ? Xt.memoizedState = vr = e : vr = vr.next = e, vr;
    }
    function Ai() {
      var e;
      if (pr === null) {
        var t = Xt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = pr.next;
      var a;
      if (vr === null ? a = Xt.memoizedState : a = vr.next, a !== null)
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
        vr === null ? Xt.memoizedState = vr = i : vr = vr.next = i;
      }
      return vr;
    }
    function LC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Dg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function kg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: Q,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = qx.bind(null, Xt, s);
      return [i.memoizedState, f];
    }
    function Og(e, t, a) {
      var i = Ai(), u = i.queue;
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
        var S = f.next, b = s.baseState, w = null, N = null, A = null, H = S;
        do {
          var de = H.lane;
          if (Du(Zs, de)) {
            if (A !== null) {
              var Me = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Mt,
                action: H.action,
                hasEagerState: H.hasEagerState,
                eagerState: H.eagerState,
                next: null
              };
              A = A.next = Me;
            }
            if (H.hasEagerState)
              b = H.eagerState;
            else {
              var _t = H.action;
              b = e(b, _t);
            }
          } else {
            var Fe = {
              lane: de,
              action: H.action,
              hasEagerState: H.hasEagerState,
              eagerState: H.eagerState,
              next: null
            };
            A === null ? (N = A = Fe, w = b) : A = A.next = Fe, Xt.lanes = rt(Xt.lanes, de), Qp(de);
          }
          H = H.next;
        } while (H !== null && H !== S);
        A === null ? w = b : A.next = N, X(b, i.memoizedState) || zp(), i.memoizedState = b, i.baseState = w, i.baseQueue = A, u.lastRenderedState = b;
      }
      var Et = u.interleaved;
      if (Et !== null) {
        var O = Et;
        do {
          var P = O.lane;
          Xt.lanes = rt(Xt.lanes, P), Qp(P), O = O.next;
        } while (O !== Et);
      } else f === null && (u.lanes = Q);
      var L = u.dispatch;
      return [i.memoizedState, L];
    }
    function Lg(e, t, a) {
      var i = Ai(), u = i.queue;
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
    function UD(e, t, a) {
    }
    function AD(e, t, a) {
    }
    function Mg(e, t, a) {
      var i = Xt, u = Ql(), s, f = jr();
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
        Zc(v, Zs) || MC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, cm(zC.bind(null, i, y, e), [e]), i.flags |= Gr, bp(fr | Fr, NC.bind(null, i, y, s, t), void 0, null), s;
    }
    function lm(e, t, a) {
      var i = Xt, u = Ai(), s = t();
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
        Zc(S, Zs) || MC(i, t, s);
      }
      return s;
    }
    function MC(e, t, a) {
      e.flags |= vo;
      var i = {
        getSnapshot: t,
        value: a
      }, u = Xt.updateQueue;
      if (u === null)
        u = LC(), Xt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function NC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, UC(t) && AC(e);
    }
    function zC(e, t, a) {
      var i = function() {
        UC(t) && AC(e);
      };
      return a(i);
    }
    function UC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !X(a, i);
      } catch {
        return !0;
      }
    }
    function AC(e) {
      var t = Ha(e, $e);
      t !== null && gr(t, e, $e, en);
    }
    function um(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: Q,
        dispatch: null,
        lastRenderedReducer: Dg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Kx.bind(null, Xt, a);
      return [t.memoizedState, i];
    }
    function Ng(e) {
      return Og(Dg);
    }
    function zg(e) {
      return Lg(Dg);
    }
    function bp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = Xt.updateQueue;
      if (s === null)
        s = LC(), Xt.updateQueue = s, s.lastEffect = u.next = u;
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
    function Ug(e) {
      var t = Ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function om(e) {
      var t = Ai();
      return t.memoizedState;
    }
    function _p(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      Xt.flags |= e, u.memoizedState = bp(fr | t, a, void 0, s);
    }
    function sm(e, t, a, i) {
      var u = Ai(), s = i === void 0 ? null : i, f = void 0;
      if (pr !== null) {
        var p = pr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (_g(s, v)) {
            u.memoizedState = bp(t, a, f, s);
            return;
          }
        }
      }
      Xt.flags |= e, u.memoizedState = bp(fr | t, a, f, s);
    }
    function cm(e, t) {
      return (Xt.mode & At) !== Ue ? _p(Ti | Gr | xc, Fr, e, t) : _p(Gr | xc, Fr, e, t);
    }
    function Dp(e, t) {
      return sm(Gr, Fr, e, t);
    }
    function Ag(e, t) {
      return _p(wt, $l, e, t);
    }
    function fm(e, t) {
      return sm(wt, $l, e, t);
    }
    function jg(e, t) {
      var a = wt;
      return a |= Wi, (Xt.mode & At) !== Ue && (a |= _l), _p(a, dr, e, t);
    }
    function dm(e, t) {
      return sm(wt, dr, e, t);
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
    function Fg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = wt;
      return u |= Wi, (Xt.mode & At) !== Ue && (u |= _l), _p(u, dr, jC.bind(null, t, e), i);
    }
    function pm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return sm(wt, dr, jC.bind(null, t, e), i);
    }
    function Qx(e, t) {
    }
    var vm = Qx;
    function Hg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function hm(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (_g(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Pg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function mm(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (_g(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Vg(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function FC(e) {
      var t = Ai(), a = pr, i = a.memoizedState;
      return PC(t, i, e);
    }
    function HC(e) {
      var t = Ai();
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
          Xt.lanes = rt(Xt.lanes, u), Qp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function Wx(e, t, a) {
      var i = Aa();
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
          f > 10 && Be("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Bg() {
      var e = um(!1), t = e[0], a = e[1], i = Wx.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function VC() {
      var e = Ng(), t = e[0], a = Ai(), i = a.memoizedState;
      return [t, i];
    }
    function BC() {
      var e = zg(), t = e[0], a = Ai(), i = a.memoizedState;
      return [t, i];
    }
    var IC = !1;
    function Gx() {
      return IC;
    }
    function Ig() {
      var e = Ql(), t = jm(), a = t.identifierPrefix, i;
      if (jr()) {
        var u = fx();
        i = ":" + a + "R" + u;
        var s = xp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Ix++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function ym() {
      var e = Ai(), t = e.memoizedState;
      return t;
    }
    function qx(e, t, a) {
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
    function Kx(e, t, a) {
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
        if (e.lanes === Q && (s === null || s.lanes === Q)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = me.current, me.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, X(y, v)) {
                zx(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              me.current = p;
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
      return e === Xt || t !== null && t === Xt;
    }
    function $C(e, t) {
      wp = im = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function QC(e, t, a) {
      if (Md(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = rt(i, a);
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
      unstable_isNewReconciler: ne
    }, GC = null, qC = null, KC = null, XC = null, Wl = null, ll = null, Sm = null;
    {
      var Yg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Je = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      GC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", It(), zf(t), Hg(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", It(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", It(), zf(t), cm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", It(), zf(a), Fg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", It(), zf(t), Ag(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", It(), zf(t), jg(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", It(), zf(t);
          var a = me.current;
          me.current = Wl;
          try {
            return Pg(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", It();
          var i = me.current;
          me.current = Wl;
          try {
            return kg(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", It(), Ug(e);
        },
        useState: function(e) {
          Y = "useState", It();
          var t = me.current;
          me.current = Wl;
          try {
            return um(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", It(), void 0;
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", It(), Vg(e);
        },
        useTransition: function() {
          return Y = "useTransition", It(), Bg();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", It(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", It(), Mg(e, t, a);
        },
        useId: function() {
          return Y = "useId", It(), Ig();
        },
        unstable_isNewReconciler: ne
      }, qC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", le(), Hg(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", le(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", le(), cm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", le(), Fg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", le(), Ag(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", le(), jg(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", le();
          var a = me.current;
          me.current = Wl;
          try {
            return Pg(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", le();
          var i = me.current;
          me.current = Wl;
          try {
            return kg(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", le(), Ug(e);
        },
        useState: function(e) {
          Y = "useState", le();
          var t = me.current;
          me.current = Wl;
          try {
            return um(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", le(), void 0;
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", le(), Vg(e);
        },
        useTransition: function() {
          return Y = "useTransition", le(), Bg();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", le(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", le(), Mg(e, t, a);
        },
        useId: function() {
          return Y = "useId", le(), Ig();
        },
        unstable_isNewReconciler: ne
      }, KC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", le(), hm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", le(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", le(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", le(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", le(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", le(), dm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", le();
          var a = me.current;
          me.current = ll;
          try {
            return mm(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", le();
          var i = me.current;
          me.current = ll;
          try {
            return Og(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", le(), om();
        },
        useState: function(e) {
          Y = "useState", le();
          var t = me.current;
          me.current = ll;
          try {
            return Ng(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", le(), vm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", le(), FC(e);
        },
        useTransition: function() {
          return Y = "useTransition", le(), VC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", le(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", le(), lm(e, t);
        },
        useId: function() {
          return Y = "useId", le(), ym();
        },
        unstable_isNewReconciler: ne
      }, XC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", le(), hm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", le(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", le(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", le(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", le(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", le(), dm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", le();
          var a = me.current;
          me.current = Sm;
          try {
            return mm(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", le();
          var i = me.current;
          me.current = Sm;
          try {
            return Lg(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", le(), om();
        },
        useState: function(e) {
          Y = "useState", le();
          var t = me.current;
          me.current = Sm;
          try {
            return zg(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", le(), vm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", le(), HC(e);
        },
        useTransition: function() {
          return Y = "useTransition", le(), BC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", le(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", le(), lm(e, t);
        },
        useId: function() {
          return Y = "useId", le(), ym();
        },
        unstable_isNewReconciler: ne
      }, Wl = {
        readContext: function(e) {
          return Yg(), nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", Je(), It(), Hg(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", Je(), It(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", Je(), It(), cm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", Je(), It(), Fg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", Je(), It(), Ag(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", Je(), It(), jg(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", Je(), It();
          var a = me.current;
          me.current = Wl;
          try {
            return Pg(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", Je(), It();
          var i = me.current;
          me.current = Wl;
          try {
            return kg(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", Je(), It(), Ug(e);
        },
        useState: function(e) {
          Y = "useState", Je(), It();
          var t = me.current;
          me.current = Wl;
          try {
            return um(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", Je(), It(), void 0;
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", Je(), It(), Vg(e);
        },
        useTransition: function() {
          return Y = "useTransition", Je(), It(), Bg();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", Je(), It(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", Je(), It(), Mg(e, t, a);
        },
        useId: function() {
          return Y = "useId", Je(), It(), Ig();
        },
        unstable_isNewReconciler: ne
      }, ll = {
        readContext: function(e) {
          return Yg(), nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", Je(), le(), hm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", Je(), le(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", Je(), le(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", Je(), le(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", Je(), le(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", Je(), le(), dm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", Je(), le();
          var a = me.current;
          me.current = ll;
          try {
            return mm(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", Je(), le();
          var i = me.current;
          me.current = ll;
          try {
            return Og(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", Je(), le(), om();
        },
        useState: function(e) {
          Y = "useState", Je(), le();
          var t = me.current;
          me.current = ll;
          try {
            return Ng(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", Je(), le(), vm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", Je(), le(), FC(e);
        },
        useTransition: function() {
          return Y = "useTransition", Je(), le(), VC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", Je(), le(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", Je(), le(), lm(e, t);
        },
        useId: function() {
          return Y = "useId", Je(), le(), ym();
        },
        unstable_isNewReconciler: ne
      }, Sm = {
        readContext: function(e) {
          return Yg(), nr(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", Je(), le(), hm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", Je(), le(), nr(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", Je(), le(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", Je(), le(), pm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", Je(), le(), fm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", Je(), le(), dm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", Je(), le();
          var a = me.current;
          me.current = ll;
          try {
            return mm(e, t);
          } finally {
            me.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", Je(), le();
          var i = me.current;
          me.current = ll;
          try {
            return Lg(e, t, a);
          } finally {
            me.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", Je(), le(), om();
        },
        useState: function(e) {
          Y = "useState", Je(), le();
          var t = me.current;
          me.current = ll;
          try {
            return zg(e);
          } finally {
            me.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", Je(), le(), vm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", Je(), le(), HC(e);
        },
        useTransition: function() {
          return Y = "useTransition", Je(), le(), BC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", Je(), le(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", Je(), le(), lm(e, t);
        },
        useId: function() {
          return Y = "useId", Je(), le(), ym();
        },
        unstable_isNewReconciler: ne
      };
    }
    var Fo = V.unstable_now, ZC = 0, Em = -1, kp = -1, Cm = -1, $g = !1, Rm = !1;
    function JC() {
      return $g;
    }
    function Xx() {
      Rm = !0;
    }
    function Zx() {
      $g = !1, Rm = !1;
    }
    function Jx() {
      $g = Rm, Rm = !1;
    }
    function e0() {
      return ZC;
    }
    function t0() {
      ZC = Fo();
    }
    function Qg(e) {
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
            case q:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case re:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Wg(e) {
      if (Cm >= 0) {
        var t = Fo() - Cm;
        Cm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case q:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case re:
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
    function Gg() {
      Cm = Fo();
    }
    function qg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = it({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Kg = {}, Xg, Zg, Jg, eS, tS, r0, wm, nS, rS, aS, Op;
    {
      Xg = /* @__PURE__ */ new Set(), Zg = /* @__PURE__ */ new Set(), Jg = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), Op = /* @__PURE__ */ new Set();
      var a0 = /* @__PURE__ */ new Set();
      wm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          a0.has(a) || (a0.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, r0 = function(e, t) {
        if (t === void 0) {
          var a = Dt(e) || "Component";
          tS.has(a) || (tS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Kg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Kg);
    }
    function iS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Kt) {
          gn(!0);
          try {
            s = a(i, u);
          } finally {
            gn(!1);
          }
        }
        r0(t, s);
      }
      var f = s == null ? u : it({}, u, s);
      if (e.memoizedState = f, e.lanes === Q) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var lS = {
      isMounted: Lv,
      enqueueSetState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.payload = t, a != null && (wm(a, "setState"), f.callback = a);
        var p = zo(i, f, s);
        p !== null && (gr(p, i, s, u), Jh(p, i, s)), vs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.tag = CC, f.payload = t, a != null && (wm(a, "replaceState"), f.callback = a);
        var p = zo(i, f, s);
        p !== null && (gr(p, i, s, u), Jh(p, i, s)), vs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = po(e), i = Ca(), u = Bo(a), s = Pu(i, u);
        s.tag = Kh, t != null && (wm(t, "forceUpdate"), s.callback = t);
        var f = zo(a, s, u);
        f !== null && (gr(f, a, u, i), Jh(f, a, u)), Mc(a, u);
      }
    };
    function i0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Kt) {
            gn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              gn(!1);
            }
          }
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Dt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Te(a, i) || !Te(u, s) : !0;
    }
    function eb(e, t, a) {
      var i = e.stateNode;
      {
        var u = Dt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Op.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Kt) === Ue && (Op.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Op.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Kt) === Ue && (Op.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !rS.has(t) && (rS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Dt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !Jg.has(t) && (Jg.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Dt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || st(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function l0(e, t) {
      t.updater = lS, e.stateNode = t, vu(t, e), t._reactInternalInstance = Kg;
    }
    function u0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !aS.has(t)) {
          aS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Dt(t) || "Component", v);
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
      if (e.mode & Kt) {
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
          var w = Dt(t) || "Component";
          Zg.has(w) || (Zg.add(w), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", w, S.state === null ? "null" : "undefined", w));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof S.getSnapshotBeforeUpdate == "function") {
          var N = null, A = null, H = null;
          if (typeof S.componentWillMount == "function" && S.componentWillMount.__suppressDeprecationWarning !== !0 ? N = "componentWillMount" : typeof S.UNSAFE_componentWillMount == "function" && (N = "UNSAFE_componentWillMount"), typeof S.componentWillReceiveProps == "function" && S.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? A = "componentWillReceiveProps" : typeof S.UNSAFE_componentWillReceiveProps == "function" && (A = "UNSAFE_componentWillReceiveProps"), typeof S.componentWillUpdate == "function" && S.componentWillUpdate.__suppressDeprecationWarning !== !0 ? H = "componentWillUpdate" : typeof S.UNSAFE_componentWillUpdate == "function" && (H = "UNSAFE_componentWillUpdate"), N !== null || A !== null || H !== null) {
            var de = Dt(t) || "Component", Fe = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            eS.has(de) || (eS.add(de), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, de, Fe, N !== null ? `
  ` + N : "", A !== null ? `
  ` + A : "", H !== null ? `
  ` + H : ""));
          }
        }
      }
      return i && KE(e, u, s), S;
    }
    function tb(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Xe(e) || "Component"), lS.enqueueReplaceState(t, t.state, null));
    }
    function o0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Xe(e) || "Component";
          Xg.has(s) || (Xg.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        lS.enqueueReplaceState(t, t.state, null);
      }
    }
    function uS(e, t, a, i) {
      eb(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, mg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nr(s);
      else {
        var f = Rf(e, t, !0);
        u.context = Tf(e, f);
      }
      {
        if (u.state === a) {
          var p = Dt(t) || "Component";
          nS.has(p) || (nS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Kt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (iS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (tb(e, u), em(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = wt;
        y |= Wi, (e.mode & At) !== Ue && (y |= _l), e.flags |= y;
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
      var w = e.memoizedState, N = u.state = w;
      if (em(e, a, u, i), N = e.memoizedState, s === a && w === N && !Uh() && !tm()) {
        if (typeof u.componentDidMount == "function") {
          var A = wt;
          A |= Wi, (e.mode & At) !== Ue && (A |= _l), e.flags |= A;
        }
        return !1;
      }
      typeof S == "function" && (iS(e, t, S, a), N = e.memoizedState);
      var H = tm() || i0(e, t, s, a, w, N, v);
      if (H) {
        if (!b && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var de = wt;
          de |= Wi, (e.mode & At) !== Ue && (de |= _l), e.flags |= de;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Fe = wt;
          Fe |= Wi, (e.mode & At) !== Ue && (Fe |= _l), e.flags |= Fe;
        }
        e.memoizedProps = a, e.memoizedState = N;
      }
      return u.props = a, u.state = N, u.context = v, H;
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
        var w = Rf(t, a, !0);
        b = Tf(t, w);
      }
      var N = a.getDerivedStateFromProps, A = typeof N == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !A && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== b) && o0(t, s, i, b), TC();
      var H = t.memoizedState, de = s.state = H;
      if (em(t, i, s, u), de = t.memoizedState, f === v && H === de && !Uh() && !tm() && !Oe)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= wt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= Qn), !1;
      typeof N == "function" && (iS(t, a, N, i), de = t.memoizedState);
      var Fe = tm() || i0(t, a, p, i, H, de, b) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Oe;
      return Fe ? (!A && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, de, b), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, de, b)), typeof s.componentDidUpdate == "function" && (t.flags |= wt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Qn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= wt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= Qn), t.memoizedProps = i, t.memoizedState = de), s.props = i, s.state = de, s.context = b, Fe;
    }
    function Js(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function oS(e, t, a) {
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
    function sS(e, t) {
      try {
        var a = ab(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === G)
            return;
          console.error(i);
        }
        var p = u ? Xe(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === q)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var S = Xe(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + S + ".");
        }
        var b = v + `
` + f + `

` + ("" + y);
        console.error(b);
      } catch (w) {
        setTimeout(function() {
          throw w;
        });
      }
    }
    var ib = typeof WeakMap == "function" ? WeakMap : Map;
    function s0(e, t, a) {
      var i = Pu(en, a);
      i.tag = vg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        X1(u), sS(e, t);
      }, i;
    }
    function cS(e, t, a) {
      var i = Pu(en, a);
      i.tag = vg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          ER(e), sS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        ER(e), sS(e, t), typeof u != "function" && q1(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, $e) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Xe(e) || "Unknown"));
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
      if ((e.mode & ht) === Ue && (a === B || a === Ge || a === ce)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function f0(e) {
      var t = e;
      do {
        if (t.tag === Z && Vx(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function d0(e, t, a, i, u) {
      if ((e.mode & ht) === Ue) {
        if (e === t)
          e.flags |= Zn;
        else {
          if (e.flags |= Ne, a.flags |= wc, a.flags &= -52805, a.tag === G) {
            var s = a.alternate;
            if (s === null)
              a.tag = Tt;
            else {
              var f = Pu(en, $e);
              f.tag = Kh, zo(a, f, $e);
            }
          }
          a.lanes = rt(a.lanes, $e);
        }
        return e;
      }
      return e.flags |= Zn, e.lanes = u, e;
    }
    function ob(e, t, a, i, u) {
      if (a.flags |= os, Zr && Wp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        ub(a), jr() && a.mode & ht && rC();
        var f = f0(t);
        if (f !== null) {
          f.flags &= ~Rr, d0(f, t, a, e, u), f.mode & ht && c0(e, s, u), lb(f, e, s);
          return;
        } else {
          if (!Hv(u)) {
            c0(e, s, u), IS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (jr() && a.mode & ht) {
        rC();
        var v = f0(t);
        if (v !== null) {
          (v.flags & Zn) === ze && (v.flags |= Rr), d0(v, t, a, e, u), ng(Js(i, a));
          return;
        }
      }
      i = Js(i, a), V1(i);
      var y = t;
      do {
        switch (y.tag) {
          case q: {
            var S = i;
            y.flags |= Zn;
            var b = Ts(u);
            y.lanes = rt(y.lanes, b);
            var w = s0(y, S, b);
            yg(y, w);
            return;
          }
          case G:
            var N = i, A = y.type, H = y.stateNode;
            if ((y.flags & Ne) === ze && (typeof A.getDerivedStateFromError == "function" || H !== null && typeof H.componentDidCatch == "function" && !fR(H))) {
              y.flags |= Zn;
              var de = Ts(u);
              y.lanes = rt(y.lanes, de);
              var Fe = cS(y, N, de);
              yg(y, Fe);
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
    var Lp = k.ReactCurrentOwner, ol = !1, fS, Mp, dS, pS, vS, ec, hS, xm, Np;
    fS = {}, Mp = {}, dS = {}, pS = {}, vS = {}, ec = !1, hS = {}, xm = {}, Np = {};
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
          Dt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      kf(t, u), ha(t);
      {
        if (Lp.current = t, $n(!0), v = Uf(e, t, f, i, p, u), y = Af(), t.mode & Kt) {
          gn(!0);
          try {
            v = Uf(e, t, f, i, p, u), y = Af();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (kC(e, t, u), Vu(e, t, u)) : (jr() && y && Ky(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function v0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (h_(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Yf(s), t.tag = ce, t.type = f, gS(t, s), h0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            Dt(s)
          ), a.defaultProps !== void 0) {
            var v = Dt(s) || "Unknown";
            Np[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Np[v] = !0);
          }
        }
        var y = eE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var S = a.type, b = S.propTypes;
        b && nl(
          b,
          i,
          // Resolved props
          "prop",
          Dt(S)
        );
      }
      var w = e.child, N = wS(e, u);
      if (!N) {
        var A = w.memoizedProps, H = a.compare;
        if (H = H !== null ? H : Te, H(A, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var de = ic(w, i);
      return de.ref = t.ref, de.return = t, t.child = de, de;
    }
    function h0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Ze) {
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
            Dt(s)
          );
        }
      }
      if (e !== null) {
        var S = e.memoizedProps;
        if (Te(S, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = S, wS(e, u))
            (e.flags & wc) !== ze && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return mS(e, t, a, i, u);
    }
    function m0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ue)
        if ((t.mode & ht) === Ue) {
          var f = {
            baseLanes: Q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Fm(t, a);
        } else if (ea(a, Jr)) {
          var b = {
            baseLanes: Q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = b;
          var w = s !== null ? s.baseLanes : a;
          Fm(t, w);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = rt(y, a);
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
        var N;
        s !== null ? (N = rt(s.baseLanes, a), t.memoizedState = null) : N = a, Fm(t, N);
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
        t.flags |= wt;
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
    function mS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Dt(a)
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
        if (Lp.current = t, $n(!0), v = Uf(e, t, a, i, f, u), y = Af(), t.mode & Kt) {
          gn(!0);
          try {
            v = Uf(e, t, a, i, f, u), y = Af();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (kC(e, t, u), Vu(e, t, u)) : (jr() && y && Ky(t), t.flags |= ni, Sa(e, t, v, u), t.child);
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
            t.flags |= Ne, t.flags |= Zn;
            var y = new Error("Simulated error coming from DevTools"), S = Ts(u);
            t.lanes = rt(t.lanes, S);
            var b = cS(t, Js(y, t), S);
            yg(t, b);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var w = a.propTypes;
          w && nl(
            w,
            i,
            // Resolved props
            "prop",
            Dt(a)
          );
        }
      }
      var N;
      Yl(a) ? (N = !0, jh(t)) : N = !1, kf(t, u);
      var A = t.stateNode, H;
      A === null ? (_m(e, t), u0(t, a, i), uS(t, a, i, u), H = !0) : e === null ? H = nb(t, a, i, u) : H = rb(e, t, a, i, u);
      var de = yS(e, t, a, H, N, u);
      {
        var Fe = t.stateNode;
        H && Fe.props !== i && (ec || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Xe(t) || "a component"), ec = !0);
      }
      return de;
    }
    function yS(e, t, a, i, u, s) {
      y0(e, t);
      var f = (t.flags & Ne) !== ze;
      if (!i && !f)
        return u && JE(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Lp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, n0();
      else {
        ha(t);
        {
          if ($n(!0), v = p.render(), t.mode & Kt) {
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
      t.pendingContext ? XE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && XE(e, t.context, !1), gg(e, t.containerInfo);
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
          yx(t);
          var w = hC(t, null, p, a);
          t.child = w;
          for (var N = w; N; )
            N.flags = N.flags & ~yn | qr, N = N.sibling;
        }
      } else {
        if (bf(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function E0(e, t, a, i, u) {
      return bf(), ng(u), t.flags |= Rr, Sa(e, t, a, i), t.child;
    }
    function hb(e, t, a) {
      bC(t), e === null && tg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Ay(i, u);
      return p ? f = null : s !== null && Ay(i, s) && (t.flags |= Oa), y0(e, t), Sa(e, t, f, a), t.child;
    }
    function mb(e, t) {
      return e === null && tg(t), null;
    }
    function yb(e, t, a, i) {
      _m(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = m_(v), S = ul(v, u), b;
      switch (y) {
        case B:
          return gS(t, v), t.type = v = Yf(v), b = mS(null, t, v, S, i), b;
        case G:
          return t.type = v = GS(v), b = g0(null, t, v, S, i), b;
        case Ge:
          return t.type = v = qS(v), b = p0(null, t, v, S, i), b;
        case ke: {
          if (t.type !== t.elementType) {
            var w = v.propTypes;
            w && nl(
              w,
              S,
              // Resolved for outer only
              "prop",
              Dt(v)
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
      var N = "";
      throw v !== null && typeof v == "object" && v.$$typeof === Ze && (N = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + N));
    }
    function gb(e, t, a, i, u) {
      _m(e, t), t.tag = G;
      var s;
      return Yl(a) ? (s = !0, jh(t)) : s = !1, kf(t, u), u0(t, a, i), uS(t, a, i, u), yS(null, t, a, !0, s, u);
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
          var y = Dt(a) || "Unknown";
          fS[y] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), fS[y] = !0);
        }
        t.mode & Kt && al.recordLegacyContextWarning(t, null), $n(!0), Lp.current = t, p = Uf(null, t, a, u, s, i), v = Af(), $n(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var S = Dt(a) || "Unknown";
        Mp[S] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", S, S, S), Mp[S] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var b = Dt(a) || "Unknown";
          Mp[b] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", b, b, b), Mp[b] = !0);
        }
        t.tag = G, t.memoizedState = null, t.updateQueue = null;
        var w = !1;
        return Yl(a) ? (w = !0, jh(t)) : w = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, mg(t), l0(t, p), uS(t, a, u, i), yS(null, t, a, !0, w, i);
      } else {
        if (t.tag = B, t.mode & Kt) {
          gn(!0);
          try {
            p = Uf(null, t, a, u, s, i), v = Af();
          } finally {
            gn(!1);
          }
        }
        return jr() && v && Ky(t), Sa(null, t, p, i), gS(t, a), t.child;
      }
    }
    function gS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), vS[u] || (vS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Dt(t) || "Unknown";
          Np[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Np[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = Dt(t) || "Unknown";
          pS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), pS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Dt(t) || "Unknown";
          dS[v] || (g("%s: Function components do not support contextType.", v), dS[v] = !0);
        }
      }
    }
    var SS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Mt
    };
    function ES(e) {
      return {
        baseLanes: e,
        cachePool: sb(),
        transitions: null
      };
    }
    function Eb(e, t) {
      var a = null;
      return {
        baseLanes: rt(e.baseLanes, t),
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
      return Cg(e, Rp);
    }
    function Rb(e, t) {
      return ws(e.childLanes, t);
    }
    function C0(e, t, a) {
      var i = t.pendingProps;
      L_(t) && (t.flags |= Ne);
      var u = il.current, s = !1, f = (t.flags & Ne) !== ze;
      if (f || Cb(u, e) ? (s = !0, t.flags &= ~Ne) : (e === null || e.memoizedState !== null) && (u = Px(u, DC)), u = Lf(u), Ao(t, u), e === null) {
        tg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return _b(t, v);
        }
        var y = i.children, S = i.fallback;
        if (s) {
          var b = Tb(t, y, S, a), w = t.child;
          return w.memoizedState = ES(a), t.memoizedState = SS, b;
        } else
          return CS(t, y);
      } else {
        var N = e.memoizedState;
        if (N !== null) {
          var A = N.dehydrated;
          if (A !== null)
            return Db(e, t, f, i, A, N, a);
        }
        if (s) {
          var H = i.fallback, de = i.children, Fe = xb(e, t, de, H, a), Me = t.child, _t = e.child.memoizedState;
          return Me.memoizedState = _t === null ? ES(a) : Eb(_t, a), Me.childLanes = Rb(e, a), t.memoizedState = SS, Fe;
        } else {
          var Et = i.children, O = wb(e, t, Et, a);
          return t.memoizedState = null, O;
        }
      }
    }
    function CS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = RS(u, i);
      return s.return = e, e.child = s, s;
    }
    function Tb(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & ht) === Ue && s !== null ? (p = s, p.childLanes = Q, p.pendingProps = f, e.mode & Ut && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = RS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function RS(e, t, a) {
      return RR(e, t, Q, null);
    }
    function R0(e, t) {
      return ic(e, t);
    }
    function wb(e, t, a, i) {
      var u = e.child, s = u.sibling, f = R0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & ht) === Ue && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= ka) : p.push(s);
      }
      return t.child = f, f;
    }
    function xb(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & ht) === Ue && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var S = t.child;
        y = S, y.childLanes = Q, y.pendingProps = v, t.mode & Ut && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = R0(f, v), y.subtreeFlags = f.subtreeFlags & Un;
      var b;
      return p !== null ? b = ic(p, i) : (b = Yo(i, s, u, null), b.flags |= yn), b.return = t, y.return = t, y.sibling = b, t.child = y, b;
    }
    function bm(e, t, a, i) {
      i !== null && ng(i), _f(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = CS(t, s);
      return f.flags |= yn, t.memoizedState = null, f;
    }
    function bb(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = RS(f, s), v = Yo(i, s, u, null);
      return v.flags |= yn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & ht) !== Ue && _f(t, e.child, null, u), v;
    }
    function _b(e, t, a) {
      return (e.mode & ht) === Ue ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = $e) : Py(t) ? e.lanes = Tr : e.lanes = Jr, null;
    }
    function Db(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Rr) {
          t.flags &= ~Rr;
          var O = oS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return bm(e, t, f, O);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Ne, null;
          var P = i.children, L = i.fallback, ee = bb(e, t, P, L, f), ye = t.child;
          return ye.memoizedState = ES(f), t.memoizedState = SS, ee;
        }
      else {
        if (hx(), (t.mode & ht) === Ue)
          return bm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Py(u)) {
          var p, v, y;
          {
            var S = Mw(u);
            p = S.digest, v = S.message, y = S.stack;
          }
          var b;
          v ? b = new Error(v) : b = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var w = oS(b, p, y);
          return bm(e, t, f, w);
        }
        var N = ea(f, e.childLanes);
        if (ol || N) {
          var A = jm();
          if (A !== null) {
            var H = Ad(A, f);
            if (H !== Mt && H !== s.retryLane) {
              s.retryLane = H;
              var de = en;
              Ha(e, H), gr(A, e, H, de);
            }
          }
          IS();
          var Fe = oS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return bm(e, t, f, Fe);
        } else if ($E(u)) {
          t.flags |= Ne, t.child = e.child;
          var Me = J1.bind(null, e);
          return Nw(u, Me), null;
        } else {
          gx(t, u, s.treeContext);
          var _t = i.children, Et = CS(t, _t);
          return Et.flags |= qr, Et;
        }
      }
    }
    function T0(e, t, a) {
      e.lanes = rt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = rt(i.lanes, t)), dg(e.return, t, a);
    }
    function kb(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === Z) {
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
    function Lb(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !hS[e])
        if (hS[e] = !0, typeof e == "string")
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
    function Mb(e, t) {
      e !== void 0 && !xm[e] && (e !== "collapsed" && e !== "hidden" ? (xm[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (xm[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function w0(e, t) {
      {
        var a = st(e), i = !a && typeof nt(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Nb(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (st(e)) {
          for (var a = 0; a < e.length; a++)
            if (!w0(e[a], a))
              return;
        } else {
          var i = nt(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!w0(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function TS(e, t, a, i, u) {
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
    function x0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Lb(u), Mb(s, u), Nb(f, u), Sa(e, t, f, a);
      var p = il.current, v = Cg(p, Rp);
      if (v)
        p = Rg(p, Rp), t.flags |= Ne;
      else {
        var y = e !== null && (e.flags & Ne) !== ze;
        y && kb(t, t.child, a), p = Lf(p);
      }
      if (Ao(t, p), (t.mode & ht) === Ue)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var S = Ob(t.child), b;
            S === null ? (b = t.child, t.child = null) : (b = S.sibling, S.sibling = null), TS(
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
            var w = null, N = t.child;
            for (t.child = null; N !== null; ) {
              var A = N.alternate;
              if (A !== null && am(A) === null) {
                t.child = N;
                break;
              }
              var H = N.sibling;
              N.sibling = w, w = N, N = H;
            }
            TS(
              t,
              !0,
              // isBackwards
              w,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            TS(
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
      gg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = _f(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var b0 = !1;
    function Ub(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || b0 || (b0 = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (gC(t, u, p), f !== null) {
        var y = f.value;
        if (X(y, p)) {
          if (f.children === s.children && !Uh())
            return Vu(e, t, a);
        } else
          Lx(t, u, a);
      }
      var S = s.children;
      return Sa(e, t, S, a), t.child;
    }
    var _0 = !1;
    function Ab(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (_0 || (_0 = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), kf(t, a);
      var f = nr(i);
      ha(t);
      var p;
      return Lp.current = t, $n(!0), p = s(f), $n(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function zp() {
      ol = !0;
    }
    function _m(e, t) {
      (t.mode & ht) === Ue && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), n0(), Qp(t.lanes), ea(a, t.childLanes) ? (kx(e, t), t.child) : null;
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
    function wS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function Fb(e, t, a) {
      switch (t.tag) {
        case q:
          S0(t), t.stateNode, bf();
          break;
        case ie:
          bC(t);
          break;
        case G: {
          var i = t.type;
          Yl(i) && jh(t);
          break;
        }
        case Ee:
          gg(t, t.stateNode.containerInfo);
          break;
        case ct: {
          var u = t.memoizedProps.value, s = t.type._context;
          gC(t, s, u);
          break;
        }
        case re:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= wt);
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
              return Ao(t, Lf(il.current)), t.flags |= Ne, null;
            var y = t.child, S = y.childLanes;
            if (ea(a, S))
              return C0(e, t, a);
            Ao(t, Lf(il.current));
            var b = Vu(e, t, a);
            return b !== null ? b.sibling : null;
          } else
            Ao(t, Lf(il.current));
          break;
        }
        case on: {
          var w = (e.flags & Ne) !== ze, N = ea(a, t.childLanes);
          if (w) {
            if (N)
              return x0(e, t, a);
            t.flags |= Ne;
          }
          var A = t.memoizedState;
          if (A !== null && (A.rendering = null, A.tail = null, A.lastEffect = null), Ao(t, il.current), N)
            break;
          return null;
        }
        case Ae:
        case Pt:
          return t.lanes = Q, m0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function D0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return jb(e, t, eE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Uh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = wS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Ne) === ze)
            return ol = !1, Fb(e, t, a);
          (e.flags & wc) !== ze ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, jr() && sx(t)) {
        var f = t.index, p = cx();
        nC(t, p, f);
      }
      switch (t.lanes = Q, t.tag) {
        case pe:
          return Sb(e, t, t.type, a);
        case ft: {
          var v = t.elementType;
          return yb(e, t, v, a);
        }
        case B: {
          var y = t.type, S = t.pendingProps, b = t.elementType === y ? S : ul(y, S);
          return mS(e, t, y, b, a);
        }
        case G: {
          var w = t.type, N = t.pendingProps, A = t.elementType === w ? N : ul(w, N);
          return g0(e, t, w, A, a);
        }
        case q:
          return vb(e, t, a);
        case ie:
          return hb(e, t, a);
        case Ie:
          return mb(e, t);
        case Z:
          return C0(e, t, a);
        case Ee:
          return zb(e, t, a);
        case Ge: {
          var H = t.type, de = t.pendingProps, Fe = t.elementType === H ? de : ul(H, de);
          return p0(e, t, H, Fe, a);
        }
        case St:
          return fb(e, t, a);
        case mt:
          return db(e, t, a);
        case re:
          return pb(e, t, a);
        case ct:
          return Ub(e, t, a);
        case tn:
          return Ab(e, t, a);
        case ke: {
          var Me = t.type, _t = t.pendingProps, Et = ul(Me, _t);
          if (t.type !== t.elementType) {
            var O = Me.propTypes;
            O && nl(
              O,
              Et,
              // Resolved for outer only
              "prop",
              Dt(Me)
            );
          }
          return Et = ul(Me.type, Et), v0(e, t, Me, Et, a);
        }
        case ce:
          return h0(e, t, t.type, t.pendingProps, a);
        case Tt: {
          var P = t.type, L = t.pendingProps, ee = t.elementType === P ? L : ul(P, L);
          return gb(e, t, P, ee, a);
        }
        case on:
          return x0(e, t, a);
        case Ot:
          break;
        case Ae:
          return m0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function jf(e) {
      e.flags |= wt;
    }
    function k0(e) {
      e.flags |= Cn, e.flags |= ho;
    }
    var O0, xS, L0, M0;
    O0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ie || u.tag === Ie)
          lw(e, u.stateNode);
        else if (u.tag !== Ee) {
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
    }, xS = function(e, t) {
    }, L0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Sg(), v = ow(f, a, s, i, u, p);
        t.updateQueue = v, v && jf(t);
      }
    }, M0 = function(e, t, a, i) {
      a !== i && jf(t);
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
      var t = e.alternate !== null && e.alternate.child === e.child, a = Q, i = ze;
      if (t) {
        if ((e.mode & Ut) !== Ue) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = rt(a, rt(y.lanes, y.childLanes)), i |= y.subtreeFlags & Un, i |= y.flags & Un, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var S = e.child; S !== null; )
            a = rt(a, rt(S.lanes, S.childLanes)), i |= S.subtreeFlags & Un, i |= S.flags & Un, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ut) !== Ue) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = rt(a, rt(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = rt(a, rt(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Hb(e, t, a) {
      if (Tx() && (t.mode & ht) !== Ue && (t.flags & Ne) === ze)
        return sC(t), bf(), t.flags |= Rr | os | Zn, !1;
      var i = Bh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (Cx(t), Hr(t), (t.mode & Ut) !== Ue) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (bf(), (t.flags & Ne) === ze && (t.memoizedState = null), t.flags |= wt, Hr(t), (t.mode & Ut) !== Ue) {
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
      switch (Xy(t), t.tag) {
        case pe:
        case ft:
        case ce:
        case B:
        case Ge:
        case St:
        case mt:
        case re:
        case tn:
        case ke:
          return Hr(t), null;
        case G: {
          var u = t.type;
          return Yl(u) && Ah(t), Hr(t), null;
        }
        case q: {
          var s = t.stateNode;
          if (Of(t), Wy(t), wg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Bh(t);
            if (f)
              jf(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Rr) !== ze) && (t.flags |= Qn, cC());
            }
          }
          return xS(e, t), Hr(t), null;
        }
        case ie: {
          Eg(t);
          var v = xC(), y = t.type;
          if (e !== null && t.stateNode != null)
            L0(e, t, y, i, v), e.ref !== t.ref && k0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Hr(t), null;
            }
            var S = Sg(), b = Bh(t);
            if (b)
              Sx(t, v, S) && jf(t);
            else {
              var w = iw(y, i, v, S, t);
              O0(w, t, !1, !1), t.stateNode = w, uw(w, y, i, v) && jf(t);
            }
            t.ref !== null && k0(t);
          }
          return Hr(t), null;
        }
        case Ie: {
          var N = i;
          if (e && t.stateNode != null) {
            var A = e.memoizedProps;
            M0(e, t, A, N);
          } else {
            if (typeof N != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var H = xC(), de = Sg(), Fe = Bh(t);
            Fe ? Ex(t) && jf(t) : t.stateNode = sw(N, H, de, t);
          }
          return Hr(t), null;
        }
        case Z: {
          Mf(t);
          var Me = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var _t = Hb(e, t, Me);
            if (!_t)
              return t.flags & Zn ? t : null;
          }
          if ((t.flags & Ne) !== ze)
            return t.lanes = a, (t.mode & Ut) !== Ue && qg(t), t;
          var Et = Me !== null, O = e !== null && e.memoizedState !== null;
          if (Et !== O && Et) {
            var P = t.child;
            if (P.flags |= zn, (t.mode & ht) !== Ue) {
              var L = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              L || Cg(il.current, DC) ? P1() : IS();
            }
          }
          var ee = t.updateQueue;
          if (ee !== null && (t.flags |= wt), Hr(t), (t.mode & Ut) !== Ue && Et) {
            var ye = t.child;
            ye !== null && (t.treeBaseDuration -= ye.treeBaseDuration);
          }
          return null;
        }
        case Ee:
          return Of(t), xS(e, t), e === null && nx(t.stateNode.containerInfo), Hr(t), null;
        case ct:
          var ve = t.type._context;
          return fg(ve, t), Hr(t), null;
        case Tt: {
          var We = t.type;
          return Yl(We) && Ah(t), Hr(t), null;
        }
        case on: {
          Mf(t);
          var et = t.memoizedState;
          if (et === null)
            return Hr(t), null;
          var Zt = (t.flags & Ne) !== ze, Ft = et.rendering;
          if (Ft === null)
            if (Zt)
              Up(et, !1);
            else {
              var qn = B1() && (e === null || (e.flags & Ne) === ze);
              if (!qn)
                for (var Ht = t.child; Ht !== null; ) {
                  var Vn = am(Ht);
                  if (Vn !== null) {
                    Zt = !0, t.flags |= Ne, Up(et, !1);
                    var ua = Vn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= wt), t.subtreeFlags = ze, Ox(t, a), Ao(t, Rg(il.current, Rp)), t.child;
                  }
                  Ht = Ht.sibling;
                }
              et.tail !== null && Wn() > eR() && (t.flags |= Ne, Zt = !0, Up(et, !1), t.lanes = _d);
            }
          else {
            if (!Zt) {
              var Yr = am(Ft);
              if (Yr !== null) {
                t.flags |= Ne, Zt = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= wt), Up(et, !0), et.tail === null && et.tailMode === "hidden" && !Ft.alternate && !jr())
                  return Hr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wn() * 2 - et.renderingStartTime > eR() && a !== Jr && (t.flags |= Ne, Zt = !0, Up(et, !1), t.lanes = _d);
            }
            if (et.isBackwards)
              Ft.sibling = t.child, t.child = Ft;
            else {
              var Ra = et.last;
              Ra !== null ? Ra.sibling = Ft : t.child = Ft, et.last = Ft;
            }
          }
          if (et.tail !== null) {
            var Ta = et.tail;
            et.rendering = Ta, et.tail = Ta.sibling, et.renderingStartTime = Wn(), Ta.sibling = null;
            var oa = il.current;
            return Zt ? oa = Rg(oa, Rp) : oa = Lf(oa), Ao(t, oa), Ta;
          }
          return Hr(t), null;
        }
        case Ot:
          break;
        case Ae:
        case Pt: {
          BS(t);
          var Qu = t.memoizedState, $f = Qu !== null;
          if (e !== null) {
            var Xp = e.memoizedState, Zl = Xp !== null;
            Zl !== $f && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ue && (t.flags |= zn);
          }
          return !$f || (t.mode & ht) === Ue ? Hr(t) : ea(Xl, Jr) && (Hr(t), t.subtreeFlags & (yn | wt) && (t.flags |= zn)), null;
        }
        case Lt:
          return null;
        case Nt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Pb(e, t, a) {
      switch (Xy(t), t.tag) {
        case G: {
          var i = t.type;
          Yl(i) && Ah(t);
          var u = t.flags;
          return u & Zn ? (t.flags = u & ~Zn | Ne, (t.mode & Ut) !== Ue && qg(t), t) : null;
        }
        case q: {
          t.stateNode, Of(t), Wy(t), wg();
          var s = t.flags;
          return (s & Zn) !== ze && (s & Ne) === ze ? (t.flags = s & ~Zn | Ne, t) : null;
        }
        case ie:
          return Eg(t), null;
        case Z: {
          Mf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            bf();
          }
          var p = t.flags;
          return p & Zn ? (t.flags = p & ~Zn | Ne, (t.mode & Ut) !== Ue && qg(t), t) : null;
        }
        case on:
          return Mf(t), null;
        case Ee:
          return Of(t), null;
        case ct:
          var v = t.type._context;
          return fg(v, t), null;
        case Ae:
        case Pt:
          return BS(t), null;
        case Lt:
          return null;
        default:
          return null;
      }
    }
    function z0(e, t, a) {
      switch (Xy(t), t.tag) {
        case G: {
          var i = t.type.childContextTypes;
          i != null && Ah(t);
          break;
        }
        case q: {
          t.stateNode, Of(t), Wy(t), wg();
          break;
        }
        case ie: {
          Eg(t);
          break;
        }
        case Ee:
          Of(t);
          break;
        case Z:
          Mf(t);
          break;
        case on:
          Mf(t);
          break;
        case ct:
          var u = t.type._context;
          fg(u, t);
          break;
        case Ae:
        case Pt:
          BS(t);
          break;
      }
    }
    var U0 = null;
    U0 = /* @__PURE__ */ new Set();
    var Dm = !1, Pr = !1, Vb = typeof WeakSet == "function" ? WeakSet : Set, we = null, Ff = null, Hf = null;
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
    function A0(e, t) {
      try {
        Ho(dr, e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function bS(e, t, a) {
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
            if (Ye && dt && e.mode & Ut)
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
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Xe(e));
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
      rw(e.containerInfo), we = t, Qb();
      var a = F0;
      return F0 = !1, a;
    }
    function Qb() {
      for (; we !== null; ) {
        var e = we, t = e.child;
        (e.subtreeFlags & Dl) !== ze && t !== null ? (t.return = e, we = t) : Wb();
      }
    }
    function Wb() {
      for (; we !== null; ) {
        var e = we;
        Wt(e);
        try {
          Gb(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, we = t;
          return;
        }
        we = e.return;
      }
    }
    function Gb(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Qn) !== ze) {
        switch (Wt(e), e.tag) {
          case B:
          case Ge:
          case ce:
            break;
          case G: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ec && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = U0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Xe(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case q: {
            {
              var v = e.stateNode;
              Dw(v.containerInfo);
            }
            break;
          }
          case ie:
          case Ie:
          case Ee:
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
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Pa ? Ki(t) : (e & dr) !== Pa && cs(t), (e & $l) !== Pa && Gp(!0), km(t, a, p), (e & $l) !== Pa && Gp(!1), (e & Fr) !== Pa ? Ml() : (e & dr) !== Pa && xd());
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
            (e & Fr) !== Pa ? wd(t) : (e & dr) !== Pa && Oc(t);
            var f = s.create;
            (e & $l) !== Pa && Gp(!0), s.destroy = f(), (e & $l) !== Pa && Gp(!1), (e & Fr) !== Pa ? zv() : (e & dr) !== Pa && Uv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & dr) !== ze ? v = "useLayoutEffect" : (s.tag & $l) !== ze ? v = "useInsertionEffect" : v = "useEffect";
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
      if ((t.flags & wt) !== ze)
        switch (t.tag) {
          case re: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = e0(), p = t.alternate === null ? "mount" : "update";
            JC() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case q:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case re:
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
      if ((a.flags & Ol) !== ze)
        switch (a.tag) {
          case B:
          case Ge:
          case ce: {
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
          case G: {
            var u = a.stateNode;
            if (a.flags & wt && !Pr)
              if (t === null)
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(a) || "instance")), a.mode & Ut)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(a) || "instance")), a.mode & Ut)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(a) || "instance")), wC(a, p, u));
            break;
          }
          case q: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ie:
                    y = a.child.stateNode;
                    break;
                  case G:
                    y = a.child.stateNode;
                    break;
                }
              wC(a, v, y);
            }
            break;
          }
          case ie: {
            var S = a.stateNode;
            if (t === null && a.flags & wt) {
              var b = a.type, w = a.memoizedProps;
              vw(S, b, w);
            }
            break;
          }
          case Ie:
            break;
          case Ee:
            break;
          case re: {
            {
              var N = a.memoizedProps, A = N.onCommit, H = N.onRender, de = a.stateNode.effectDuration, Fe = e0(), Me = t === null ? "mount" : "update";
              JC() && (Me = "nested-update"), typeof H == "function" && H(a.memoizedProps.id, Me, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Fe);
              {
                typeof A == "function" && A(a.memoizedProps.id, Me, de, Fe), W1(a);
                var _t = a.return;
                e: for (; _t !== null; ) {
                  switch (_t.tag) {
                    case q:
                      var Et = _t.stateNode;
                      Et.effectDuration += de;
                      break e;
                    case re:
                      var O = _t.stateNode;
                      O.effectDuration += de;
                      break e;
                  }
                  _t = _t.return;
                }
              }
            }
            break;
          }
          case Z: {
            a1(e, a);
            break;
          }
          case on:
          case Tt:
          case Ot:
          case Ae:
          case Pt:
          case Nt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Pr || a.flags & Cn && H0(a);
    }
    function Xb(e) {
      switch (e.tag) {
        case B:
        case Ge:
        case ce: {
          if (e.mode & Ut)
            try {
              ql(), A0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            A0(e, e.return);
          break;
        }
        case G: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Yb(e, e.return, t), j0(e, e.return);
          break;
        }
        case ie: {
          j0(e, e.return);
          break;
        }
      }
    }
    function Zb(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ie) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? ww(u) : bw(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === Ie) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? xw(s) : _w(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === Ae || i.tag === Pt) && i.memoizedState !== null && i !== e)) {
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
          case ie:
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
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Xe(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Xe(e)), t.current = i;
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
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ie) {
          var a = e.stateNode;
          a !== null && ix(a);
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
      return e.tag === ie || e.tag === q || e.tag === Ee;
    }
    function B0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || V0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ie && t.tag !== Ie && t.tag !== Ct; ) {
          if (t.flags & yn || t.child === null || t.tag === Ee)
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
        case ie: {
          var a = t.stateNode;
          t.flags & Oa && (YE(a), t.flags &= ~Oa);
          var i = B0(e);
          DS(e, i, a);
          break;
        }
        case q:
        case Ee: {
          var u = t.stateNode.containerInfo, s = B0(e);
          _S(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function _S(e, t, a) {
      var i = e.tag, u = i === ie || i === Ie;
      if (u) {
        var s = e.stateNode;
        t ? Ew(a, s, t) : gw(a, s);
      } else if (i !== Ee) {
        var f = e.child;
        if (f !== null) {
          _S(f, t, a);
          for (var p = f.sibling; p !== null; )
            _S(p, t, a), p = p.sibling;
        }
      }
    }
    function DS(e, t, a) {
      var i = e.tag, u = i === ie || i === Ie;
      if (u) {
        var s = e.stateNode;
        t ? Sw(a, s, t) : yw(a, s);
      } else if (i !== Ee) {
        var f = e.child;
        if (f !== null) {
          DS(f, t, a);
          for (var p = f.sibling; p !== null; )
            DS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function n1(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ie: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case q: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case Ee: {
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
        case ie:
          Pr || Pf(a, t);
        case Ie: {
          {
            var i = Vr, u = cl;
            Vr = null, Po(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? Rw(Vr, a.stateNode) : Cw(Vr, a.stateNode));
          }
          return;
        }
        case Ct: {
          Vr !== null && (cl ? Tw(Vr, a.stateNode) : Hy(Vr, a.stateNode));
          return;
        }
        case Ee: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Po(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case B:
        case Ge:
        case ke:
        case ce: {
          if (!Pr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, S = y;
                do {
                  var b = S, w = b.destroy, N = b.tag;
                  w !== void 0 && ((N & $l) !== Pa ? km(a, t, w) : (N & dr) !== Pa && (cs(a), a.mode & Ut ? (ql(), km(a, t, w), Gl(a)) : km(a, t, w), xd())), S = S.next;
                } while (S !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case G: {
          if (!Pr) {
            Pf(a, t);
            var A = a.stateNode;
            typeof A.componentWillUnmount == "function" && bS(a, t, A);
          }
          Po(e, t, a);
          return;
        }
        case Ot: {
          Po(e, t, a);
          return;
        }
        case Ae: {
          if (
            // TODO: Remove this dead flag
            a.mode & ht
          ) {
            var H = Pr;
            Pr = H || a.memoizedState !== null, Po(e, t, a), Pr = H;
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
            s !== null && Bw(s);
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
      Ff = a, Hf = e, Wt(t), $0(t, e), Wt(t), Ff = null, Hf = null;
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
          Wt(p), $0(p, e), p = p.sibling;
      Wt(f);
    }
    function $0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case B:
        case Ge:
        case ke:
        case ce: {
          if (fl(t, e), Kl(e), u & wt) {
            try {
              sl($l | fr, e, e.return), Ho($l | fr, e);
            } catch (We) {
              dn(e, e.return, We);
            }
            if (e.mode & Ut) {
              try {
                ql(), sl(dr | fr, e, e.return);
              } catch (We) {
                dn(e, e.return, We);
              }
              Gl(e);
            } else
              try {
                sl(dr | fr, e, e.return);
              } catch (We) {
                dn(e, e.return, We);
              }
          }
          return;
        }
        case G: {
          fl(t, e), Kl(e), u & Cn && i !== null && Pf(i, i.return);
          return;
        }
        case ie: {
          fl(t, e), Kl(e), u & Cn && i !== null && Pf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                YE(s);
              } catch (We) {
                dn(e, e.return, We);
              }
            }
            if (u & wt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, S = e.updateQueue;
                if (e.updateQueue = null, S !== null)
                  try {
                    hw(f, S, y, v, p, e);
                  } catch (We) {
                    dn(e, e.return, We);
                  }
              }
            }
          }
          return;
        }
        case Ie: {
          if (fl(t, e), Kl(e), u & wt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var b = e.stateNode, w = e.memoizedProps, N = i !== null ? i.memoizedProps : w;
            try {
              mw(b, N, w);
            } catch (We) {
              dn(e, e.return, We);
            }
          }
          return;
        }
        case q: {
          if (fl(t, e), Kl(e), u & wt && i !== null) {
            var A = i.memoizedState;
            if (A.isDehydrated)
              try {
                Vw(t.containerInfo);
              } catch (We) {
                dn(e, e.return, We);
              }
          }
          return;
        }
        case Ee: {
          fl(t, e), Kl(e);
          return;
        }
        case Z: {
          fl(t, e), Kl(e);
          var H = e.child;
          if (H.flags & zn) {
            var de = H.stateNode, Fe = H.memoizedState, Me = Fe !== null;
            if (de.isHidden = Me, Me) {
              var _t = H.alternate !== null && H.alternate.memoizedState !== null;
              _t || H1();
            }
          }
          if (u & wt) {
            try {
              r1(e);
            } catch (We) {
              dn(e, e.return, We);
            }
            Y0(e);
          }
          return;
        }
        case Ae: {
          var Et = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & ht
          ) {
            var O = Pr;
            Pr = O || Et, fl(t, e), Pr = O;
          } else
            fl(t, e);
          if (Kl(e), u & zn) {
            var P = e.stateNode, L = e.memoizedState, ee = L !== null, ye = e;
            if (P.isHidden = ee, ee && !Et && (ye.mode & ht) !== Ue) {
              we = ye;
              for (var ve = ye.child; ve !== null; )
                we = ve, u1(ve), ve = ve.sibling;
            }
            Zb(ye, ee);
          }
          return;
        }
        case on: {
          fl(t, e), Kl(e), u & wt && Y0(e);
          return;
        }
        case Ot:
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
      Ff = a, Hf = t, we = e, Q0(e, t, a), Ff = null, Hf = null;
    }
    function Q0(e, t, a) {
      for (var i = (e.mode & ht) !== Ue; we !== null; ) {
        var u = we, s = u.child;
        if (u.tag === Ae && i) {
          var f = u.memoizedState !== null, p = f || Dm;
          if (p) {
            kS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, S = y || Pr, b = Dm, w = Pr;
            Dm = p, Pr = S, Pr && !w && (we = u, o1(u));
            for (var N = s; N !== null; )
              we = N, Q0(
                N,
                // New root; bubble back up to here and stop.
                t,
                a
              ), N = N.sibling;
            we = u, Dm = b, Pr = w, kS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== ze && s !== null ? (s.return = u, we = s) : kS(e, t, a);
      }
    }
    function kS(e, t, a) {
      for (; we !== null; ) {
        var i = we;
        if ((i.flags & Ol) !== ze) {
          var u = i.alternate;
          Wt(i);
          try {
            Kb(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          we = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, we = s;
          return;
        }
        we = i.return;
      }
    }
    function u1(e) {
      for (; we !== null; ) {
        var t = we, a = t.child;
        switch (t.tag) {
          case B:
          case Ge:
          case ke:
          case ce: {
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
          case G: {
            Pf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && bS(t, t.return, i);
            break;
          }
          case ie: {
            Pf(t, t.return);
            break;
          }
          case Ae: {
            var u = t.memoizedState !== null;
            if (u) {
              W0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, we = a) : W0(e);
      }
    }
    function W0(e) {
      for (; we !== null; ) {
        var t = we;
        if (t === e) {
          we = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, we = a;
          return;
        }
        we = t.return;
      }
    }
    function o1(e) {
      for (; we !== null; ) {
        var t = we, a = t.child;
        if (t.tag === Ae) {
          var i = t.memoizedState !== null;
          if (i) {
            G0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, we = a) : G0(e);
      }
    }
    function G0(e) {
      for (; we !== null; ) {
        var t = we;
        Wt(t);
        try {
          Xb(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          we = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, we = a;
          return;
        }
        we = t.return;
      }
    }
    function s1(e, t, a, i) {
      we = t, c1(t, e, a, i);
    }
    function c1(e, t, a, i) {
      for (; we !== null; ) {
        var u = we, s = u.child;
        (u.subtreeFlags & Gi) !== ze && s !== null ? (s.return = u, we = s) : f1(e, t, a, i);
      }
    }
    function f1(e, t, a, i) {
      for (; we !== null; ) {
        var u = we;
        if ((u.flags & Gr) !== ze) {
          Wt(u);
          try {
            d1(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          we = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, we = s;
          return;
        }
        we = u.return;
      }
    }
    function d1(e, t, a, i) {
      switch (t.tag) {
        case B:
        case Ge:
        case ce: {
          if (t.mode & Ut) {
            Gg();
            try {
              Ho(Fr | fr, t);
            } finally {
              Wg(t);
            }
          } else
            Ho(Fr | fr, t);
          break;
        }
      }
    }
    function p1(e) {
      we = e, v1();
    }
    function v1() {
      for (; we !== null; ) {
        var e = we, t = e.child;
        if ((we.flags & ka) !== ze) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              we = u, y1(u, e);
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
            we = e;
          }
        }
        (e.subtreeFlags & Gi) !== ze && t !== null ? (t.return = e, we = t) : h1();
      }
    }
    function h1() {
      for (; we !== null; ) {
        var e = we;
        (e.flags & Gr) !== ze && (Wt(e), m1(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, we = t;
          return;
        }
        we = e.return;
      }
    }
    function m1(e) {
      switch (e.tag) {
        case B:
        case Ge:
        case ce: {
          e.mode & Ut ? (Gg(), sl(Fr | fr, e, e.return), Wg(e)) : sl(Fr | fr, e, e.return);
          break;
        }
      }
    }
    function y1(e, t) {
      for (; we !== null; ) {
        var a = we;
        Wt(a), S1(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, we = i) : g1(e);
      }
    }
    function g1(e) {
      for (; we !== null; ) {
        var t = we, a = t.sibling, i = t.return;
        if (P0(t), t === e) {
          we = null;
          return;
        }
        if (a !== null) {
          a.return = i, we = a;
          return;
        }
        we = i;
      }
    }
    function S1(e, t) {
      switch (e.tag) {
        case B:
        case Ge:
        case ce: {
          e.mode & Ut ? (Gg(), sl(Fr, e, t), Wg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function E1(e) {
      switch (e.tag) {
        case B:
        case Ge:
        case ce: {
          try {
            Ho(dr | fr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case G: {
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
        case B:
        case Ge:
        case ce: {
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
        case B:
        case Ge:
        case ce: {
          try {
            sl(dr | fr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case G: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && bS(e, e.return, t);
          break;
        }
      }
    }
    function T1(e) {
      switch (e.tag) {
        case B:
        case Ge:
        case ce:
          try {
            sl(Fr | fr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Ap = Symbol.for;
      Ap("selector.component"), Ap("selector.has_pseudo_class"), Ap("selector.role"), Ap("selector.test_id"), Ap("selector.text");
    }
    var w1 = [];
    function x1() {
      w1.forEach(function(e) {
        return e();
      });
    }
    var b1 = k.ReactCurrentActQueue;
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
    var D1 = Math.ceil, OS = k.ReactCurrentDispatcher, LS = k.ReactCurrentOwner, Br = k.ReactCurrentBatchConfig, dl = k.ReactCurrentActQueue, hr = (
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
    ), Bu = 0, jp = 1, tc = 2, Om = 3, Fp = 4, X0 = 5, MS = 6, bt = hr, Ea = null, On = null, mr = Q, Xl = Q, NS = Oo(Q), yr = Bu, Hp = null, Lm = Q, Pp = Q, Mm = Q, Vp = null, Va = null, zS = 0, Z0 = 500, J0 = 1 / 0, k1 = 500, Iu = null;
    function Bp() {
      J0 = Wn() + k1;
    }
    function eR() {
      return J0;
    }
    var Nm = !1, US = null, Vf = null, nc = !1, Vo = null, Ip = Q, AS = [], jS = null, O1 = 50, Yp = 0, FS = null, HS = !1, zm = !1, L1 = 50, Bf = 0, Um = null, $p = en, Am = Q, tR = !1;
    function jm() {
      return Ea;
    }
    function Ca() {
      return (bt & (Ir | ji)) !== hr ? Wn() : ($p !== en || ($p = Wn()), $p);
    }
    function Bo(e) {
      var t = e.mode;
      if ((t & ht) === Ue)
        return $e;
      if ((bt & Ir) !== hr && mr !== Q)
        return Ts(mr);
      var a = bx() !== xx;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Am === Mt && (Am = Nd()), Am;
      }
      var u = Aa();
      if (u !== Mt)
        return u;
      var s = cw();
      return s;
    }
    function M1(e) {
      var t = e.mode;
      return (t & ht) === Ue ? $e : Vv();
    }
    function gr(e, t, a, i) {
      n_(), tR && g("useInsertionEffect must not schedule updates."), HS && (zm = !0), So(e, a, i), (bt & Ir) !== Q && e === Ea ? i_(t) : (Zr && bs(e, t, a), l_(t), e === Ea && ((bt & Ir) === hr && (Pp = rt(Pp, a)), yr === Fp && Io(e, mr)), Ba(e, i), a === $e && bt === hr && (t.mode & ht) === Ue && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
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
      var i = qc(e, e === Ea ? mr : Q);
      if (i === Q) {
        a !== null && yR(a), e.callbackNode = null, e.callbackPriority = Mt;
        return;
      }
      var u = Ul(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== QS)) {
        a == null && s !== $e && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && yR(a);
      var f;
      if (u === $e)
        e.tag === Lo ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), ox(aR.bind(null, e))) : eC(aR.bind(null, e)), dl.current !== null ? dl.current.push(Mo) : dw(function() {
          (bt & (Ir | ji)) === hr && Mo();
        }), f = null;
      else {
        var p;
        switch (Gv(i)) {
          case Mr:
            p = ss;
            break;
          case _i:
            p = Ll;
            break;
          case za:
            p = qi;
            break;
          case Ua:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = WS(p, nR.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function nR(e, t) {
      if (Zx(), $p = en, Am = Q, (bt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = qc(e, e === Ea ? mr : Q);
      if (u === Q)
        return null;
      var s = !Zc(e, u) && !Pv(e, u) && !t, f = s ? Y1(e, u) : Hm(e, u);
      if (f !== Bu) {
        if (f === tc) {
          var p = Xc(e);
          p !== Q && (u = p, f = PS(e, p));
        }
        if (f === jp) {
          var v = Hp;
          throw rc(e, Q), Io(e, u), Ba(e, Wn()), v;
        }
        if (f === MS)
          Io(e, u);
        else {
          var y = !Zc(e, u), S = e.current.alternate;
          if (y && !A1(S)) {
            if (f = Hm(e, u), f === tc) {
              var b = Xc(e);
              b !== Q && (u = b, f = PS(e, b));
            }
            if (f === jp) {
              var w = Hp;
              throw rc(e, Q), Io(e, u), Ba(e, Wn()), w;
            }
          }
          e.finishedWork = S, e.finishedLanes = u, U1(e, f, u);
        }
      }
      return Ba(e, Wn()), e.callbackNode === a ? nR.bind(null, e) : null;
    }
    function PS(e, t) {
      var a = Vp;
      if (tf(e)) {
        var i = rc(e, t);
        i.flags |= Rr, tx(e.containerInfo);
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
    function U1(e, t, a) {
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
            var i = zS + Z0 - Wn();
            if (i > 10) {
              var u = qc(e, Q);
              if (u !== Q)
                break;
              var s = e.suspendedLanes;
              if (!Du(s, a)) {
                Ca(), Jc(e, s);
                break;
              }
              e.timeoutHandle = jy(ac.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case Fp: {
          if (Io(e, a), Ld(a))
            break;
          if (!gR()) {
            var f = ai(e, a), p = f, v = Wn() - p, y = t_(v) - v;
            if (y > 10) {
              e.timeoutHandle = jy(ac.bind(null, e, Va, Iu), y);
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
    function A1(e) {
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
      t = ws(t, Mm), t = ws(t, Pp), Yv(e, t);
    }
    function aR(e) {
      if (Jx(), (bt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      $u();
      var t = qc(e, Q);
      if (!ea(t, $e))
        return Ba(e, Wn()), null;
      var a = Hm(e, t);
      if (e.tag !== Lo && a === tc) {
        var i = Xc(e);
        i !== Q && (t = i, a = PS(e, i));
      }
      if (a === jp) {
        var u = Hp;
        throw rc(e, Q), Io(e, t), Ba(e, Wn()), u;
      }
      if (a === MS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ac(e, Va, Iu), Ba(e, Wn()), null;
    }
    function j1(e, t) {
      t !== Q && (ef(e, rt(t, $e)), Ba(e, Wn()), (bt & (Ir | ji)) === hr && (Bp(), Mo()));
    }
    function VS(e, t) {
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
      var s = Aa(), f = Br.transition;
      try {
        return Br.transition = null, Fn(Mr), e(t, a, i, u);
      } finally {
        Fn(s), Br.transition = f, bt === hr && Bp();
      }
    }
    function Yu(e) {
      Vo !== null && Vo.tag === Lo && (bt & (Ir | ji)) === hr && $u();
      var t = bt;
      bt |= K0;
      var a = Br.transition, i = Aa();
      try {
        return Br.transition = null, Fn(Mr), e ? e() : void 0;
      } finally {
        Fn(i), Br.transition = a, bt = t, (bt & (Ir | ji)) === hr && Mo();
      }
    }
    function iR() {
      return (bt & (Ir | ji)) !== hr;
    }
    function Fm(e, t) {
      ia(NS, Xl, e), Xl = rt(Xl, t);
    }
    function BS(e) {
      Xl = NS.current, aa(NS, e);
    }
    function rc(e, t) {
      e.finishedWork = null, e.finishedLanes = Q;
      var a = e.timeoutHandle;
      if (a !== Fy && (e.timeoutHandle = Fy, fw(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          z0(u, i), i = i.return;
        }
      Ea = e;
      var s = ic(e.current, null);
      return On = s, mr = Xl = t, yr = Bu, Hp = null, Lm = Q, Pp = Q, Mm = Q, Vp = null, Va = null, Nx(), al.discardPendingWarnings(), s;
    }
    function lR(e, t) {
      do {
        var a = On;
        try {
          if (Gh(), OC(), fn(), LS.current = null, a === null || a.return === null) {
            yr = jp, Hp = t, On = null;
            return;
          }
          if (Ye && a.mode & Ut && Tm(a, !0), Qe)
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
      var e = OS.current;
      return OS.current = gm, e === null ? gm : e;
    }
    function oR(e) {
      OS.current = e;
    }
    function H1() {
      zS = Wn();
    }
    function Qp(e) {
      Lm = rt(e, Lm);
    }
    function P1() {
      yr === Bu && (yr = Om);
    }
    function IS() {
      (yr === Bu || yr === Om || yr === tc) && (yr = Fp), Ea !== null && (Rs(Lm) || Rs(Pp)) && Io(Ea, mr);
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
      return Lc(), Ea = null, mr = Q, yr;
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
      return Gh(), oR(i), bt = a, On !== null ? (Av(), Bu) : (Lc(), Ea = null, mr = Q, yr);
    }
    function $1() {
      for (; On !== null && !md(); )
        sR(On);
    }
    function sR(e) {
      var t = e.alternate;
      Wt(e);
      var a;
      (e.mode & Ut) !== Ue ? (Qg(e), a = YS(t, e, Xl), Tm(e, !0)) : a = YS(t, e, Xl), fn(), e.memoizedProps = e.pendingProps, a === null ? cR(e) : On = a, LS.current = null;
    }
    function cR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & os) === ze) {
          Wt(t);
          var u = void 0;
          if ((t.mode & Ut) === Ue ? u = N0(a, t, Xl) : (Qg(t), u = N0(a, t, Xl), Tm(t, !1)), fn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = Pb(a, t);
          if (s !== null) {
            s.flags &= Ov, On = s;
            return;
          }
          if ((t.mode & Ut) !== Ue) {
            Tm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= os, i.subtreeFlags = ze, i.deletions = null;
          else {
            yr = MS, On = null;
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
      var i = Aa(), u = Br.transition;
      try {
        Br.transition = null, Fn(Mr), Q1(e, t, a, i);
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
      if (s === Q && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = Q, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Mt;
      var f = rt(u.lanes, u.childLanes);
      Ud(e, f), e === Ea && (Ea = null, On = null, mr = Q), ((u.subtreeFlags & Gi) !== ze || (u.flags & Gi) !== ze) && (nc || (nc = !0, jS = a, WS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (Dl | kl | Ol | Gi)) !== ze, v = (u.flags & (Dl | kl | Ol | Gi)) !== ze;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var S = Aa();
        Fn(Mr);
        var b = bt;
        bt |= ji, LS.current = null, $b(e, u), t0(), i1(e, u, s), aw(e.containerInfo), e.current = u, ds(s), l1(u, e, s), ps(), yd(), bt = b, Fn(S), Br.transition = y;
      } else
        e.current = u, t0();
      var w = nc;
      if (nc ? (nc = !1, Vo = e, Ip = s) : (Bf = 0, Um = null), f = e.pendingLanes, f === Q && (Vf = null), w || vR(e.current, !1), Sd(u.stateNode, i), Zr && e.memoizedUpdaters.clear(), x1(), Ba(e, Wn()), t !== null)
        for (var N = e.onRecoverableError, A = 0; A < t.length; A++) {
          var H = t[A], de = H.stack, Fe = H.digest;
          N(H.value, {
            componentStack: de,
            digest: Fe
          });
        }
      if (Nm) {
        Nm = !1;
        var Me = US;
        throw US = null, Me;
      }
      return ea(Ip, $e) && e.tag !== Lo && $u(), f = e.pendingLanes, ea(f, $e) ? (Xx(), e === FS ? Yp++ : (Yp = 0, FS = e)) : Yp = 0, Mo(), Td(), null;
    }
    function $u() {
      if (Vo !== null) {
        var e = Gv(Ip), t = Ds(za, e), a = Br.transition, i = Aa();
        try {
          return Br.transition = null, Fn(t), G1();
        } finally {
          Fn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function W1(e) {
      AS.push(e), nc || (nc = !0, WS(qi, function() {
        return $u(), null;
      }));
    }
    function G1() {
      if (Vo === null)
        return !1;
      var e = jS;
      jS = null;
      var t = Vo, a = Ip;
      if (Vo = null, Ip = Q, (bt & (Ir | ji)) !== hr)
        throw new Error("Cannot flush passive effects while already rendering.");
      HS = !0, zm = !1, Su(a);
      var i = bt;
      bt |= ji, p1(t.current), s1(t, t.current, a, e);
      {
        var u = AS;
        AS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          qb(t, f);
        }
      }
      bd(), vR(t.current, !0), bt = i, Mo(), zm ? t === Um ? Bf++ : (Bf = 0, Um = t) : Bf = 0, HS = !1, zm = !1, Ed(t);
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
      Nm || (Nm = !0, US = e);
    }
    var X1 = K1;
    function dR(e, t, a) {
      var i = Js(a, t), u = s0(e, i, $e), s = zo(e, u, $e), f = Ca();
      s !== null && (So(s, $e, f), Ba(s, f));
    }
    function dn(e, t, a) {
      if (Bb(a), Gp(!1), e.tag === q) {
        dR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === q) {
          dR(i, e, a);
          return;
        } else if (i.tag === G) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !fR(s)) {
            var f = Js(a, e), p = cS(i, f, $e), v = zo(i, p, $e), y = Ca();
            v !== null && (So(v, $e, y), Ba(v, y));
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
      Jc(e, a), u_(e), Ea === e && Du(mr, a) && (yr === Fp || yr === Om && _u(mr) && Wn() - zS < Z0 ? rc(e, Q) : Mm = rt(Mm, a)), Ba(e, u);
    }
    function pR(e, t) {
      t === Mt && (t = M1(e));
      var a = Ca(), i = Ha(e, t);
      i !== null && (So(i, t, a), Ba(i, a));
    }
    function J1(e) {
      var t = e.memoizedState, a = Mt;
      t !== null && (a = t.retryLane), pR(e, a);
    }
    function e_(e, t) {
      var a = Mt, i;
      switch (e.tag) {
        case Z:
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
        throw Yp = 0, FS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Bf > L1 && (Bf = 0, Um = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function r_() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function vR(e, t) {
      Wt(e), Pm(e, _l, R1), t && Pm(e, Ti, T1), Pm(e, _l, E1), t && Pm(e, Ti, C1), fn();
    }
    function Pm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== ze ? i = i.child : ((i.flags & t) !== ze && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Vm = null;
    function hR(e) {
      {
        if ((bt & Ir) !== hr || !(e.mode & ht))
          return;
        var t = e.tag;
        if (t !== pe && t !== q && t !== G && t !== B && t !== Ge && t !== ke && t !== ce)
          return;
        var a = Xe(e) || "ReactComponent";
        if (Vm !== null) {
          if (Vm.has(a))
            return;
          Vm.add(a);
        } else
          Vm = /* @__PURE__ */ new Set([a]);
        var i = lr;
        try {
          Wt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Wt(e) : fn();
        }
      }
    }
    var YS;
    {
      var a_ = null;
      YS = function(e, t, a) {
        var i = TR(a_, t);
        try {
          return D0(e, t, a);
        } catch (s) {
          if (mx() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Gh(), OC(), z0(e, t), TR(t, i), t.mode & Ut && Qg(t), bl(null, D0, null, e, t, a), Qi()) {
            var u = us();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var mR = !1, $S;
    $S = /* @__PURE__ */ new Set();
    function i_(e) {
      if (mi && !Gx())
        switch (e.tag) {
          case B:
          case Ge:
          case ce: {
            var t = On && Xe(On) || "Unknown", a = t;
            if (!$S.has(a)) {
              $S.add(a);
              var i = Xe(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case G: {
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
    var QS = {};
    function WS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), QS) : hd(e, t);
      }
    }
    function yR(e) {
      if (e !== QS)
        return Mv(e);
    }
    function gR() {
      return dl.current !== null;
    }
    function l_(e) {
      {
        if (e.mode & ht) {
          if (!q0())
            return;
        } else if (!_1() || bt !== hr || e.tag !== B && e.tag !== Ge && e.tag !== ce)
          return;
        if (dl.current === null) {
          var t = lr;
          try {
            Wt(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Xe(e));
          } finally {
            t ? Wt(e) : fn();
          }
        }
      }
    }
    function u_(e) {
      e.tag !== Lo && q0() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

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
    function GS(e) {
      return Yf(e);
    }
    function qS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Yf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: $,
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
          case G: {
            typeof i == "function" && (u = !0);
            break;
          }
          case B: {
            (typeof i == "function" || s === Ze) && (u = !0);
            break;
          }
          case Ge: {
            (s === $ || s === Ze) && (u = !0);
            break;
          }
          case ke:
          case ce: {
            (s === tt || s === Ze) && (u = !0);
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
          KS(e.current, i, a);
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
    function KS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case B:
          case ce:
          case G:
            v = p;
            break;
          case Ge:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, S = !1;
        if (v !== null) {
          var b = Fi(v);
          b !== void 0 && (a.has(b) ? S = !0 : t.has(b) && (f === G ? S = !0 : y = !0));
        }
        if (If !== null && (If.has(e) || i !== null && If.has(i)) && (S = !0), S && (e._debugNeedsRemount = !0), S || y) {
          var w = Ha(e, $e);
          w !== null && gr(w, e, $e, en);
        }
        u !== null && !S && KS(u, t, a), s !== null && KS(s, t, a);
      }
    }
    var f_ = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return XS(e.current, i, a), a;
      }
    };
    function XS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case B:
          case ce:
          case G:
            p = f;
            break;
          case Ge:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? d_(e, a) : i !== null && XS(i, t, a), u !== null && XS(u, t, a);
      }
    }
    function d_(e, t) {
      {
        var a = p_(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ie:
              t.add(i.stateNode);
              return;
            case Ee:
              t.add(i.stateNode.containerInfo);
              return;
            case q:
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
        if (a.tag === ie)
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
    var ZS;
    {
      ZS = !1;
      try {
        var CR = Object.preventExtensions({});
      } catch {
        ZS = !0;
      }
    }
    function v_(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = ze, this.subtreeFlags = ze, this.deletions = null, this.lanes = Q, this.childLanes = Q, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !ZS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new v_(e, t, a, i);
    };
    function JS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function h_(e) {
      return typeof e == "function" && !JS(e) && e.defaultProps === void 0;
    }
    function m_(e) {
      if (typeof e == "function")
        return JS(e) ? G : B;
      if (e != null) {
        var t = e.$$typeof;
        if (t === $)
          return Ge;
        if (t === tt)
          return ke;
      }
      return pe;
    }
    function ic(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = ze, a.subtreeFlags = ze, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Un, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case pe:
        case B:
        case ce:
          a.type = Yf(e.type);
          break;
        case G:
          a.type = GS(e.type);
          break;
        case Ge:
          a.type = qS(e.type);
          break;
      }
      return a;
    }
    function y_(e, t) {
      e.flags &= Un | yn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = Q, e.lanes = t, e.child = null, e.subtreeFlags = ze, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = ze, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
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
      return e === Fh ? (i = ht, t === !0 && (i |= Kt, i |= At)) : i = Ue, Zr && (i |= Ut), oi(q, null, null, i);
    }
    function eE(e, t, a, i, u, s) {
      var f = pe, p = e;
      if (typeof e == "function")
        JS(e) ? (f = G, p = GS(p)) : p = Yf(p);
      else if (typeof e == "string")
        f = ie;
      else
        e: switch (e) {
          case di:
            return Yo(a.children, u, s, t);
          case Wa:
            f = mt, u |= Kt, (u & ht) !== Ue && (u |= At);
            break;
          case pi:
            return S_(a, u, s, t);
          case se:
            return E_(a, u, s, t);
          case Ce:
            return C_(a, u, s, t);
          case wn:
            return RR(a, u, s, t);
          case an:
          case yt:
          case cn:
          case ir:
          case vt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = ct;
                  break e;
                case R:
                  f = tn;
                  break e;
                case $:
                  f = Ge, p = qS(p);
                  break e;
                case tt:
                  f = ke;
                  break e;
                case Ze:
                  f = ft, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? Xe(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var S = oi(f, a, t, u);
      return S.elementType = e, S.type = p, S.lanes = s, S._debugOwner = i, S;
    }
    function tE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = eE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = oi(St, e, i, t);
      return u.lanes = a, u;
    }
    function S_(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(re, e, i, t | Ut);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function E_(e, t, a, i) {
      var u = oi(Z, e, i, t);
      return u.elementType = se, u.lanes = a, u;
    }
    function C_(e, t, a, i) {
      var u = oi(on, e, i, t);
      return u.elementType = Ce, u.lanes = a, u;
    }
    function RR(e, t, a, i) {
      var u = oi(Ae, e, i, t);
      u.elementType = wn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function nE(e, t, a) {
      var i = oi(Ie, e, null, t);
      return i.lanes = a, i;
    }
    function R_() {
      var e = oi(ie, null, null, Ue);
      return e.elementType = "DELETED", e;
    }
    function T_(e) {
      var t = oi(Ct, null, null, Ue);
      return t.stateNode = e, t;
    }
    function rE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(Ee, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function TR(e, t) {
      return e === null && (e = oi(pe, null, null, Ue)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function w_(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Fy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Mt, this.eventTimes = xs(Q), this.expirationTimes = xs(en), this.pendingLanes = Q, this.suspendedLanes = Q, this.pingedLanes = Q, this.expiredLanes = Q, this.mutableReadLanes = Q, this.finishedLanes = Q, this.entangledLanes = Q, this.entanglements = xs(Q), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Fh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function wR(e, t, a, i, u, s, f, p, v, y) {
      var S = new w_(e, t, a, p, v), b = g_(t, s);
      S.current = b, b.stateNode = S;
      {
        var w = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        b.memoizedState = w;
      }
      return mg(b), S;
    }
    var aE = "18.3.1";
    function x_(e, t, a) {
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
    var iE, lE;
    iE = !1, lE = {};
    function xR(e) {
      if (!e)
        return ui;
      var t = po(e), a = ux(t);
      if (t.tag === G) {
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
        if (u.mode & Kt) {
          var s = Xe(a) || "Component";
          if (!lE[s]) {
            lE[s] = !0;
            var f = lr;
            try {
              Wt(u), a.mode & Kt ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Wt(f) : fn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function bR(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return wR(e, t, v, y, a, i, u, s, f);
    }
    function _R(e, t, a, i, u, s, f, p, v, y) {
      var S = !0, b = wR(a, i, S, e, u, s, f, p, v);
      b.context = xR(null);
      var w = b.current, N = Ca(), A = Bo(w), H = Pu(N, A);
      return H.callback = t ?? null, zo(w, H, A), N1(b, A, N), b;
    }
    function qp(e, t, a, i) {
      gd(t, e);
      var u = t.current, s = Ca(), f = Bo(u);
      Sn(f);
      var p = xR(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && lr !== null && !iE && (iE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Xe(lr) || "Unknown"));
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
        case ie:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function __(e) {
      switch (e.tag) {
        case q: {
          var t = e.stateNode;
          if (tf(t)) {
            var a = Fv(t);
            j1(t, a);
          }
          break;
        }
        case Z: {
          Yu(function() {
            var u = Ha(e, $e);
            if (u !== null) {
              var s = Ca();
              gr(u, e, $e, s);
            }
          });
          var i = $e;
          uE(e, i);
          break;
        }
      }
    }
    function DR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Iv(a.retryLane, t));
    }
    function uE(e, t) {
      DR(e, t);
      var a = e.alternate;
      a && DR(a, t);
    }
    function D_(e) {
      if (e.tag === Z) {
        var t = Ss, a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        uE(e, t);
      }
    }
    function k_(e) {
      if (e.tag === Z) {
        var t = Bo(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        uE(e, t);
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
    var LR = function(e) {
      return !1;
    };
    function L_(e) {
      return LR(e);
    }
    var MR = null, NR = null, zR = null, UR = null, AR = null, jR = null, FR = null, HR = null, PR = null;
    {
      var VR = function(e, t, a) {
        var i = t[a], u = st(e) ? e.slice() : it({}, e);
        return a + 1 === t.length ? (st(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = VR(e[i], t, a + 1), u);
      }, BR = function(e, t) {
        return VR(e, t, 0);
      }, IR = function(e, t, a, i) {
        var u = t[i], s = st(e) ? e.slice() : it({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], st(s) ? s.splice(u, 1) : delete s[u];
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
          Be("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              Be("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return IR(e, t, a, 0);
      }, $R = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = st(e) ? e.slice() : it({}, e);
        return s[u] = $R(e[u], t, a + 1, i), s;
      }, QR = function(e, t, a) {
        return $R(e, t, 0, a);
      }, oE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      MR = function(e, t, a, i) {
        var u = oE(e, t);
        if (u !== null) {
          var s = QR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = it({}, e.memoizedProps);
          var f = Ha(e, $e);
          f !== null && gr(f, e, $e, en);
        }
      }, NR = function(e, t, a) {
        var i = oE(e, t);
        if (i !== null) {
          var u = BR(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = it({}, e.memoizedProps);
          var s = Ha(e, $e);
          s !== null && gr(s, e, $e, en);
        }
      }, zR = function(e, t, a, i) {
        var u = oE(e, t);
        if (u !== null) {
          var s = YR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = it({}, e.memoizedProps);
          var f = Ha(e, $e);
          f !== null && gr(f, e, $e, en);
        }
      }, UR = function(e, t, a) {
        e.pendingProps = QR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, $e);
        i !== null && gr(i, e, $e, en);
      }, AR = function(e, t) {
        e.pendingProps = BR(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, $e);
        a !== null && gr(a, e, $e, en);
      }, jR = function(e, t, a) {
        e.pendingProps = YR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, $e);
        i !== null && gr(i, e, $e, en);
      }, FR = function(e) {
        var t = Ha(e, $e);
        t !== null && gr(t, e, $e, en);
      }, HR = function(e) {
        OR = e;
      }, PR = function(e) {
        LR = e;
      };
    }
    function M_(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function N_(e) {
      return null;
    }
    function z_() {
      return lr;
    }
    function U_(e) {
      var t = e.findFiberByHostInstance, a = k.ReactCurrentDispatcher;
      return mo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: MR,
        overrideHookStateDeletePath: NR,
        overrideHookStateRenamePath: zR,
        overrideProps: UR,
        overridePropsDeletePath: AR,
        overridePropsRenamePath: jR,
        setErrorHandler: HR,
        setSuspenseHandler: PR,
        scheduleUpdate: FR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: M_,
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
        reconcilerVersion: aE
      });
    }
    var WR = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function sE(e) {
      this._internalRoot = e;
    }
    Im.prototype.render = sE.prototype.render = function(e) {
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
    }, Im.prototype.unmount = sE.prototype.unmount = function() {
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
    function A_(e, t) {
      if (!Ym(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      GR(e);
      var a = !1, i = !1, u = "", s = WR;
      t != null && (t.hydrate ? Be("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Dr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = bR(e, Fh, null, a, i, u, s);
      Lh(f.current, e);
      var p = e.nodeType === Nn ? e.parentNode : e;
      return tp(p), new sE(f);
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
      if (Lh(y.current, e), tp(e), u)
        for (var S = 0; S < u.length; S++) {
          var b = u[S];
          Bx(y, b);
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
    var H_ = k.ReactCurrentOwner, qR;
    qR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Nn) {
        var t = kR(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = cE(e), u = !!(i && ko(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function cE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function KR() {
    }
    function P_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var w = Bm(f);
            s.call(w);
          };
        }
        var f = _R(
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
          KR
        );
        e._reactRootContainer = f, Lh(f.current, e);
        var p = e.nodeType === Nn ? e.parentNode : e;
        return tp(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var w = Bm(S);
            y.call(w);
          };
        }
        var S = bR(
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
          KR
        );
        e._reactRootContainer = S, Lh(S.current, e);
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
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Dt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
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
      if (e == null || !uy(e))
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
          var a = cE(e), i = a && !ko(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          $m(null, null, e, !1, function() {
            e._reactRootContainer = null, WE(e);
          });
        }), !0;
      } else {
        {
          var u = cE(e), s = !!(u && ko(u)), f = e.nodeType === Wr && Kp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    wr(__), Eo(D_), qv(k_), Os(Aa), Fd(Qv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), gc(GT), ly(VS, F1, Yu);
    function W_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Ym(t))
        throw new Error("Target container is not a DOM element.");
      return x_(e, t, null, a);
    }
    function G_(e, t, a, i) {
      return $_(e, t, a, i);
    }
    var fE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [ko, Cf, Mh, oo, Sc, VS]
    };
    function q_(e, t) {
      return fE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), A_(e, t);
    }
    function K_(e, t, a) {
      return fE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), F_(e, t, a);
    }
    function X_(e) {
      return iR() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var Z_ = U_({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: aE,
      rendererPackageName: "react-dom"
    });
    if (!Z_ && Ln && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var JR = window.location.protocol;
      /^(https?|file):$/.test(JR) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (JR === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = fE, Ya.createPortal = W_, Ya.createRoot = q_, Ya.findDOMNode = B_, Ya.flushSync = X_, Ya.hydrate = I_, Ya.hydrateRoot = K_, Ya.render = Y_, Ya.unmountComponentAtNode = Q_, Ya.unstable_batchedUpdates = VS, Ya.unstable_renderSubtreeIntoContainer = G_, Ya.version = aE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ya;
}
function dT() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(dT);
    } catch (j) {
      console.error(j);
    }
  }
}
process.env.NODE_ENV === "production" ? (dT(), mE.exports = uD()) : mE.exports = oD();
var gE = mE.exports, yE, Wm = gE;
if (process.env.NODE_ENV === "production")
  yE = Wm.createRoot, Wm.hydrateRoot;
else {
  var sT = Wm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  yE = function(j, V) {
    sT.usingClientEntryPoint = !0;
    try {
      return Wm.createRoot(j, V);
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
}, pT = Jt.createContext(sD);
function cD({ children: j }) {
  const [V, k] = Jt.useState(Gm), [De, Se] = Jt.useState({}), Be = Jt.useMemo(
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
  ), g = Jt.useCallback(
    async (B) => {
      const G = B ?? V.key;
      if (Se((pe) => {
        var q;
        return {
          ...pe,
          [G]: {
            data: (q = pe[G]) == null ? void 0 : q.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        Se((pe) => {
          var q;
          return {
            ...pe,
            [G]: {
              data: (q = pe[G]) == null ? void 0 : q.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const pe = await fetch(`/api/editions/${G}/character-creation`);
        if (!pe.ok)
          throw new Error(`Failed to load edition data (${pe.status})`);
        const q = await pe.json(), Ee = (q == null ? void 0 : q.character_creation) ?? q;
        Se((ie) => ({
          ...ie,
          [G]: {
            data: Ee,
            loading: !1,
            error: void 0
          }
        }));
      } catch (pe) {
        const q = pe instanceof Error ? pe.message : "Unknown error loading edition data";
        Se((Ee) => {
          var ie;
          return {
            ...Ee,
            [G]: {
              data: (ie = Ee[G]) == null ? void 0 : ie.data,
              loading: !1,
              error: q
            }
          };
        });
      }
    },
    [V.key]
  ), Ke = Jt.useMemo(() => {
    const B = De[V.key];
    return {
      activeEdition: V,
      supportedEditions: Be,
      setEdition: (G) => {
        const pe = Be.find((q) => q.key === G);
        pe ? k(pe) : console.warn(`Edition '${G}' is not registered; keeping current edition.`);
      },
      characterCreationData: B == null ? void 0 : B.data,
      reloadEditionData: g,
      isLoading: (B == null ? void 0 : B.loading) ?? !1,
      error: B == null ? void 0 : B.error
    };
  }, [V, De, g, Be]);
  return Jt.useEffect(() => {
    const B = De[V.key];
    !(B != null && B.data) && !(B != null && B.loading) && g(V.key);
  }, [V.key, De, g]), Jt.useEffect(() => {
    var G, pe;
    const B = De[V.key];
    B != null && B.data && typeof window < "u" && ((pe = (G = window.ShadowmasterLegacyApp) == null ? void 0 : G.setEditionData) == null || pe.call(G, V.key, B.data));
  }, [V.key, De]), /* @__PURE__ */ _e.jsx(pT.Provider, { value: Ke, children: j });
}
function fD() {
  const j = Jt.useContext(pT);
  if (!j)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return j;
}
function SE() {
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
function pD(j) {
  return dD[j];
}
function vD(j, V) {
  var De;
  const k = (De = j == null ? void 0 : j.priorities) == null ? void 0 : De[V];
  return k ? qm.map((Se) => {
    const Be = k[Se] ?? { label: `Priority ${Se}` };
    return { code: Se, option: Be };
  }) : qm.map((Se) => ({
    code: Se,
    option: { label: `Priority ${Se}` }
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
function vT(j) {
  return Qf.reduce((V, k) => {
    const De = j[k];
    return De && V.push(De), V;
  }, []);
}
function cT(j) {
  const V = new Set(vT(j));
  return qm.filter((k) => !V.has(k));
}
function mD(j) {
  return vT(j).length === qm.length;
}
function yD(j) {
  return j ? j.summary || j.description || j.label || "" : "Drag a priority letter from the pool into this category.";
}
function gD(j) {
  return Object.fromEntries(
    Object.entries(j).map(([V, k]) => [V, k || null])
  );
}
function SD() {
  var De, Se;
  const j = hD();
  if (typeof window > "u")
    return j;
  const V = (Se = (De = window.ShadowmasterLegacyApp) == null ? void 0 : De.getPriorities) == null ? void 0 : Se.call(De);
  if (!V)
    return j;
  const k = { ...j };
  for (const Be of Qf) {
    const g = V[Be];
    typeof g == "string" && g.length === 1 && (k[Be] = g);
  }
  return k;
}
function ED() {
  const { characterCreationData: j, activeEdition: V, isLoading: k, error: De } = SE(), [Se, Be] = Jt.useState(() => SD()), [g, Ke] = Jt.useState(null), B = Jt.useRef({});
  Jt.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), Jt.useEffect(() => {
    var Z;
    const re = (Z = window.ShadowmasterLegacyApp) == null ? void 0 : Z.setPriorities;
    re && re(gD(Se));
  }, [Se]);
  const G = Jt.useMemo(() => cT(Se), [Se]), pe = mD(Se);
  function q(re) {
    Be((Z) => {
      const ke = { ...Z };
      for (const ce of Qf)
        ke[ce] === re && (ke[ce] = "");
      return ke;
    });
  }
  function Ee(re, Z) {
    Z.dataTransfer.effectAllowed = "move", Ke({ source: "pool", priority: re }), Z.dataTransfer.setData("text/plain", re);
  }
  function ie(re, Z, ke) {
    ke.dataTransfer.effectAllowed = "move", Ke({ source: "dropzone", category: re, priority: Z }), ke.dataTransfer.setData("text/plain", Z);
  }
  function Ie() {
    Ke(null);
  }
  function St(re, Z) {
    Z.preventDefault();
    const ke = Z.dataTransfer.getData("text/plain") || (g == null ? void 0 : g.priority) || "";
    if (!ke) {
      Ie();
      return;
    }
    Be((ce) => {
      const ft = { ...ce };
      for (const Tt of Qf)
        ft[Tt] === ke && (ft[Tt] = "");
      return ft[re] = ke, ft;
    }), Ie();
  }
  function mt(re, Z) {
    Z.preventDefault();
    const ke = B.current[re];
    ke && ke.classList.add("active");
  }
  function tn(re) {
    const Z = B.current[re];
    Z && Z.classList.remove("active");
  }
  function ct(re) {
    const Z = B.current[re];
    Z && Z.classList.remove("active");
  }
  function Ge(re) {
    const Z = G[0];
    if (!Z) {
      q(re);
      return;
    }
    Be((ke) => {
      const ce = { ...ke };
      for (const ft of Qf)
        ce[ft] === re && (ce[ft] = "");
      return ce[Z] = re, ce;
    });
  }
  return /* @__PURE__ */ _e.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ _e.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ _e.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ _e.jsx("strong", { children: V.label })
      ] }),
      /* @__PURE__ */ _e.jsx("span", { children: k ? "Loading priority data…" : De ? `Error: ${De}` : "Drag letters into categories" })
    ] }),
    /* @__PURE__ */ _e.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ _e.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ _e.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ _e.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (re) => {
              re.preventDefault(), Ke((Z) => Z && { ...Z, category: void 0 });
            },
            onDrop: (re) => {
              re.preventDefault();
              const Z = re.dataTransfer.getData("text/plain") || (g == null ? void 0 : g.priority) || "";
              Z && q(Z), Ie();
            },
            children: /* @__PURE__ */ _e.jsx("div", { className: "react-priority-chips", children: ["A", "B", "C", "D", "E"].map((re) => {
              const Z = cT(Se).includes(re) === !1, ke = (g == null ? void 0 : g.priority) === re && g.source === "pool";
              return /* @__PURE__ */ _e.jsx(
                "div",
                {
                  className: `react-priority-chip ${Z ? "used" : ""} ${ke ? "dragging" : ""}`,
                  draggable: !Z,
                  onDragStart: (ce) => !Z && Ee(re, ce),
                  onDragEnd: Ie,
                  onClick: () => Ge(re),
                  role: "button",
                  tabIndex: Z ? -1 : 0,
                  onKeyDown: (ce) => {
                    !Z && (ce.key === "Enter" || ce.key === " ") && (ce.preventDefault(), Ge(re));
                  },
                  children: re
                },
                re
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ _e.jsx("section", { className: "react-priority-dropzones", children: Qf.map((re) => {
        const Z = pD(re), ke = vD(j, re), ce = Se[re], ft = ke.find((Ct) => Ct.code === ce), Tt = (g == null ? void 0 : g.source) === "dropzone" && g.category === re;
        return /* @__PURE__ */ _e.jsxs(
          "div",
          {
            ref: (Ct) => {
              B.current[re] = Ct;
            },
            className: `react-priority-dropzone ${ce ? "filled" : ""}`,
            onDragOver: (Ct) => mt(re, Ct),
            onDragLeave: () => tn(re),
            onDrop: (Ct) => {
              St(re, Ct), ct(re);
            },
            children: [
              /* @__PURE__ */ _e.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ _e.jsx("span", { children: Z }),
                ce && /* @__PURE__ */ _e.jsxs("span", { children: [
                  ce,
                  " — ",
                  (ft == null ? void 0 : ft.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ _e.jsx("div", { className: "react-priority-description", children: yD(ft == null ? void 0 : ft.option) }),
              ce ? /* @__PURE__ */ _e.jsx(
                "div",
                {
                  className: `react-priority-chip ${Tt ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (Ct) => ie(re, ce, Ct),
                  onDragEnd: Ie,
                  onDoubleClick: () => q(ce),
                  children: ce
                }
              ) : /* @__PURE__ */ _e.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          re
        );
      }) })
    ] }),
    /* @__PURE__ */ _e.jsx(
      "div",
      {
        className: `react-priority-status ${pe ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: pe ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${G.join(", ")}`
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
function RD(j, V) {
  if (!j)
    return [];
  const k = V || "E";
  return j.metatypes.map((De) => {
    var Se;
    return {
      ...De,
      priorityAllowed: ((Se = De.priority_tiers) == null ? void 0 : Se.includes(k)) ?? !1
    };
  }).filter((De) => De.priorityAllowed);
}
function TD(j) {
  return j === 0 ? "+0" : j > 0 ? `+${j}` : `${j}`;
}
function wD(j) {
  const V = j.toLowerCase();
  return CD[V] ?? j;
}
function xD({ priority: j, selectedMetatype: V, onSelect: k }) {
  const { characterCreationData: De, isLoading: Se, error: Be, activeEdition: g } = SE();
  Jt.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const Ke = Jt.useMemo(() => RD(De, j), [
    De,
    j
  ]);
  return Se ? /* @__PURE__ */ _e.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : Be ? /* @__PURE__ */ _e.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    Be
  ] }) : Ke.length ? /* @__PURE__ */ _e.jsxs(_e.Fragment, { children: [
    /* @__PURE__ */ _e.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ _e.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ _e.jsxs("span", { children: [
        "Priority: ",
        j || "—"
      ] })
    ] }),
    /* @__PURE__ */ _e.jsx("div", { className: "react-metatype-grid", children: Ke.map((B) => /* @__PURE__ */ _e.jsxs(
      "article",
      {
        className: `react-metatype-card ${V === B.id ? "selected" : ""}`,
        onClick: () => k(B.id),
        children: [
          /* @__PURE__ */ _e.jsx("h4", { children: B.name }),
          /* @__PURE__ */ _e.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ _e.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const G = B.attribute_modifiers ? Object.entries(B.attribute_modifiers).filter(([, pe]) => pe !== 0) : [];
              return G.length === 0 ? /* @__PURE__ */ _e.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : G.map(([pe, q]) => /* @__PURE__ */ _e.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ _e.jsx("span", { children: wD(pe) }),
                /* @__PURE__ */ _e.jsx("span", { className: q > 0 ? "positive" : "negative", children: TD(q) })
              ] }, pe));
            })()
          ] }),
          g.key === "sr5" && B.special_attribute_points && Object.keys(B.special_attribute_points).length > 0 && /* @__PURE__ */ _e.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ _e.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(B.special_attribute_points).map(([G, pe]) => /* @__PURE__ */ _e.jsx("div", { className: "ability", children: /* @__PURE__ */ _e.jsxs("span", { children: [
              "Priority ",
              G,
              ": ",
              pe
            ] }) }, G))
          ] }),
          B.abilities && B.abilities.length > 0 && /* @__PURE__ */ _e.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ _e.jsx("strong", { children: "Special Abilities" }),
            B.abilities.map((G, pe) => /* @__PURE__ */ _e.jsx("div", { className: "ability", children: /* @__PURE__ */ _e.jsx("span", { children: G }) }, pe))
          ] }),
          (!B.abilities || B.abilities.length === 0) && /* @__PURE__ */ _e.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ _e.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ _e.jsx("div", { className: "ability", children: /* @__PURE__ */ _e.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      B.id
    )) })
  ] }) : /* @__PURE__ */ _e.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
function bD() {
  const [j, V] = Jt.useState(null);
  return Jt.useEffect(() => {
    V(document.getElementById("priority-assignment-react-root"));
  }, []), j ? gE.createPortal(/* @__PURE__ */ _e.jsx(ED, {}), j) : null;
}
function _D() {
  const [j, V] = Jt.useState(null), [k, De] = Jt.useState(""), [Se, Be] = Jt.useState(null);
  return Jt.useEffect(() => {
    V(document.getElementById("metatype-selection-react-root"));
  }, []), Jt.useEffect(() => {
    var B;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const Ke = () => {
      var G, pe;
      De(((G = g.getMetatypePriority) == null ? void 0 : G.call(g)) ?? ""), Be(((pe = g.getMetatypeSelection) == null ? void 0 : pe.call(g)) ?? null);
    };
    return Ke(), (B = g.subscribeMetatypeState) == null || B.call(g, Ke), () => {
      var G;
      (G = g.unsubscribeMetatypeState) == null || G.call(g, Ke);
    };
  }, []), j ? gE.createPortal(
    /* @__PURE__ */ _e.jsx(
      xD,
      {
        priority: k,
        selectedMetatype: Se,
        onSelect: (g) => {
          var Ke, B;
          Be(g), (B = (Ke = window.ShadowmasterLegacyApp) == null ? void 0 : Ke.setMetatypeSelection) == null || B.call(Ke, g);
        }
      }
    ),
    j
  ) : null;
}
function DD() {
  const { activeEdition: j, isLoading: V, error: k, characterCreationData: De } = SE();
  let Se = "· data pending";
  return V ? Se = "· loading edition data…" : k ? Se = `· failed to load data: ${k}` : De && (Se = "· edition data loaded"), /* @__PURE__ */ _e.jsxs(_e.Fragment, { children: [
    /* @__PURE__ */ _e.jsx("div", { className: "react-banner", "data-active-edition": j.key, children: /* @__PURE__ */ _e.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ _e.jsx("strong", { children: j.label }),
      " ",
      Se
    ] }) }),
    /* @__PURE__ */ _e.jsx(bD, {}),
    /* @__PURE__ */ _e.jsx(_D, {})
  ] });
}
const kD = document.getElementById("shadowmaster-react-root"), OD = kD ?? LD();
function LD() {
  const j = document.createElement("div");
  return j.id = "shadowmaster-react-root", j.dataset.controller = "react-shell", j.style.display = "contents", document.body.appendChild(j), j;
}
function MD() {
  return Jt.useEffect(() => {
    var j, V, k;
    (j = window.ShadowmasterLegacyApp) != null && j.initialize && !((k = (V = window.ShadowmasterLegacyApp).isInitialized) != null && k.call(V)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ _e.jsx(Jt.StrictMode, { children: /* @__PURE__ */ _e.jsx(cD, { children: /* @__PURE__ */ _e.jsx(DD, {}) }) });
}
const ND = yE(OD);
ND.render(/* @__PURE__ */ _e.jsx(MD, {}));
