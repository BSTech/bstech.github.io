var BSOperations = {
	OhmsLaw: {
		V: function(I, R) { return I * R; },
		I: function(V, R) { return V / R; },
		R: function(V, I) { return V / I; }
	},
	Resistors: {
		Divider: {
			Vin: function(R1, R2, V)   { return (V * (R1 + R2)) / R2; },
			R1:  function(Vin, R2, V)  { return (((Vin * R2) / V) - R2); },
			R2:  function(Vin, R1, V)  { return ((R1 * V) / (Vin - V)); },
			V:   function(Vin, R1, R2) { return ((Vin * R2) / (R1 + R2)); }
		},
		Series: {Rss: function(Rss) { return (Rss && typeof Rss == 'object' && Rss.length > 0) ? BSCalc.Sum(Rss, (x, r) => r + x) : Rss; }},
		Parallel: {Rsp: function(Rsp) { return (Rsp && typeof Rsp == 'object' && Rsp.length > 0) ? (Rsp.includes(0) ? 0 : 1 / BSCalc.Sum(Rsp, (x, r) => r + 1 / x)) : Rsp; }}
	},
	Capacitors: {
		Series: {Css: function(Css) { return (Css && typeof Css == 'object' && Css.length > 0) ? (Css.includes(0) ? 0 : 1 / BSCalc.Sum(Css, (x, r) => r + 1 / x)) : Css; }},
		Parallel: {Csp: function(Csp) { return (Csp && typeof Csp == 'object' && Csp.length > 0) ? BSCalc.Sum(Csp, (x, r) => r + x) : Csp; }},
		Reactance: {
			C: function(f, Xc) { return 1 / (2 * Math.PI * f * Xc); },
			f: function(Xc, C) { return 1 / (2 * Math.PI * Xc * C); },
			Xc: function(f, C) { return 1 / (2 * Math.PI * f * C); }
		}
	},
	Inductors: {
		Series: {Lss: function(Lss) { return (Lss && typeof Lss == 'object' && Lss.length > 0) ? BSCalc.Sum(Lss, (x, r) => r + x) : Lss; }},
		Parallel: {Lsp: function(Lsp) { return (Lsp && typeof Lsp == 'object' && Lsp.length > 0) ? (Lsp.includes(0) ? 0 : 1 / BSCalc.Sum(Lsp, (x, r) => r + 1 / x)) : Lsp; }},
		Reactance: {
			L: function(f, Xl) { return Xl / (2 * Math.PI * f); },
			f: function(Xl, L) { return Xl / (2 * Math.PI * L); },
			Xl: function(f, L) { return 2 * Math.PI * f * L; }
		}
	},
	Filters: {
		RC: {
			R: function(C, f) {
				return 1 / (2 * Math.PI * f * C);
			},
			C: function(R, f) {
				return 1 / (2 * Math.PI * R * f);
			},
			f: function(R, C) {
				return 1 / (2 * Math.PI * R * C);
			}
		},
		RL: {
			R: function(L, f) {
				return 2 * Math.PI * L * f;
			},
			L: function(R, f) {
				return R / (2 * Math.PI * f);
			},
			f: function(R, L) {
				return R / (2 * Math.PI * L);
			}
		}
	},
	Osc: {
		LC: {
			L: function(C, f) {
				return 1 / (4 * (Math.PI ** 2) * (f ** 2) * C);
			},
			C: function(L, f) {
				return 1 / (4 * (Math.PI ** 2) * (f ** 2) * L);
			},
			f: function(L, C) {
				return 1 / (2 * Math.PI * Math.sqrt(L * C));
			}
		}
	},
	Amps: {
		OpInverting: {
			Rf: function(Rin, A) {
				return Rin * A;
			},
			Rin: function(Rf, A) {
				return Rf / A;
			},
			A: function(Rf, Rin) {
				return Rf / Rin;
			}
		},
		OpNonInverting: {
			Rf: function(Rin, A) {
				return Rin * (A - 1);
			},
			Rin: function(Rf, A) {
				return Rf / (A - 1);
			},
			A: function(Rf, Rin) {
				return 1 + (Rf / Rin);
			}
		}
	},
	Regs: {
		LM317V: {
			R1: function(R2, Vout) {
				return R2 / (Vout / 1.25 - 1);
			},
			R2: function(R1, Vout) {
				return R1 * (Vout / 1.25 - 1);
			},
			Vout: function(R1, R2) {
				return 1.25 * (1 + R2 / R1);
			}
		},
		LM317C: {
			R: function(I) {
				return I == 0 ? I : 1.25 / I;
			},
			I: function (R) {
				return R == 0 ? R : 1.25 / R;
			}
		},
		TL431: {
			R1: function(R2, Vz) {
				return R2 / (Vz / 2.5 - 1);
			},
			R2: function(R1, Vz) {
				return R1 * (Vz / 2.5 - 1);
			},
			Vz: function(R1, R2) {
				return 2.5 * (1 + R2 / R1);
			}
		}
	},
	Time: {
		fT: function(fT) { return fT == 0 ? fT : 1 / fT; }
	},
	CapDrop: {
		Vac: function(f, I, C) { return I * (1 / (2 * Math.PI * f * C)); },
		f: function(V, I, C) { return 1 / (2 * Math.PI * (V / I) * C); },
		Iac: function(V, f, C) { return V / (1 / (2 * Math.PI * f * C)); },
		C: function(V, f, I) { return 1 / (2 * Math.PI * f * (V / I)); }
	}
};

var __hash = ['ohms', 'rser', 'rpar', 'rdiv', 'cser', 'cpar', 'crea', 'lser', 'lpar', 'lrea', 'rcpf', 'rlpf', 'lctr', 'opin', 'opnn', '317v', '317c', '431z', 'time', 'cadp'];
var __func = ['OhmsLaw', 'Resistors.Series', 'Resistors.Parallel', 'Resistors.Divider', 'Capacitors.Series', 'Capacitors.Parallel', 'Capacitors.Reactance', 'Inductors.Series', 'Inductors.Parallel', 'Inductors.Reactance', 'Filters.RC', 'Filters.RL', 'Osc.LC', 'Amps.OpInverting', 'Amps.OpNonInverting', 'Regs.LM317V', 'Regs.LM317C', 'Regs.TL431', 'Time', 'CapDrop'];