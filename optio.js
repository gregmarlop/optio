/**
 * Optio - A Layered Encryption System
 * https://github.com/gregmarlop/optio
 * 
 * MIT License
 * Copyright (c) 2026 Gregori M.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';
    
    const AU = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const AL = 'abcdefghijklmnopqrstuvwxyz';
    const A = AU + AL;

    function rng(s) {
        s = s >>> 0 || 1;
        return function() {
            s = (s + 0x6D2B79F5) >>> 0;
            let t = Math.imul(s ^ (s >>> 15), s | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function seed(k) {
        let h = 0;
        for (let i = 0; i < k.length; i++) {
            h = ((h << 5) - h + k.charCodeAt(i)) >>> 0;
        }
        return h || 1;
    }

    function caesar(t, sh, inv) {
        const d = inv ? -sh : sh;
        return t.split('').map(function(c) {
            let i = AU.indexOf(c);
            if (i !== -1) return AU[(i + d + 26) % 26];
            i = AL.indexOf(c);
            if (i !== -1) return AL[(i + d + 26) % 26];
            return c;
        }).join('');
    }

    function atbash(t) {
        return t.split('').map(function(c) {
            let i = AU.indexOf(c);
            if (i !== -1) return AU[25 - i];
            i = AL.indexOf(c);
            if (i !== -1) return AL[25 - i];
            return c;
        }).join('');
    }

    function vigenere(t, k, inv) {
        let ki = 0;
        return t.split('').map(function(c) {
            let i = AU.indexOf(c), b = AU;
            if (i === -1) { i = AL.indexOf(c); b = AL; }
            if (i === -1) return c;
            const sh = AU.indexOf(k[ki++ % k.length].toUpperCase());
            if (sh === -1) return c;
            return b[(i + (inv ? -sh : sh) + 26) % 26];
        }).join('');
    }

    function beaufort(t, k) {
        let ki = 0;
        return t.split('').map(function(c) {
            let i = AU.indexOf(c), b = AU;
            if (i === -1) { i = AL.indexOf(c); b = AL; }
            if (i === -1) return c;
            const ki2 = AU.indexOf(k[ki++ % k.length].toUpperCase());
            if (ki2 === -1) return c;
            return b[(ki2 - i + 26) % 26];
        }).join('');
    }

    function porta(t, k, inv) {
        return vigenere(t, k + 'abc', inv);
    }

    function trithemius(t, inv) {
        return t.split('').map(function(c, i) {
            let idx = AU.indexOf(c);
            if (idx !== -1) return AU[(idx + (inv ? -i : i) + 2600) % 26];
            idx = AL.indexOf(c);
            if (idx !== -1) return AL[(idx + (inv ? -i : i) + 2600) % 26];
            return c;
        }).join('');
    }

    function substitution(t, s, inv) {
        const r = rng(s);
        const ch = A.split('');
        for (let i = ch.length - 1; i > 0; i--) {
            const j = Math.floor(r() * (i + 1));
            const temp = ch[i]; ch[i] = ch[j]; ch[j] = temp;
        }
        if (!inv) {
            return t.split('').map(function(c) {
                const i = A.indexOf(c);
                return i !== -1 ? ch[i] : c;
            }).join('');
        }
        return t.split('').map(function(c) {
            const i = ch.indexOf(c);
            return i !== -1 ? A[i] : c;
        }).join('');
    }

    function alberti(t, s, inv) {
        const r = rng(s);
        const sh1 = 1 + Math.floor(r() * 25);
        const sh2 = 1 + Math.floor(r() * 25);
        const p = Math.floor(t.length * (0.3 + r() * 0.4));
        return caesar(t.slice(0, p), sh1, inv) + caesar(t.slice(p), sh2, inv);
    }

    function bifurcation(t, s, inv) {
        const r = rng(s);
        const sh1 = 1 + Math.floor(r() * 25);
        const sh2 = 1 + Math.floor(r() * 25);
        const mid = Math.floor(t.length / 2);
        return caesar(t.slice(0, mid), sh1, inv) + caesar(t.slice(mid), sh2, inv);
    }

    function railFence(t, rails, inv) {
        if (rails < 2) rails = 2;
        if (!inv) {
            const f = [];
            for (let i = 0; i < rails; i++) f.push([]);
            let rail = 0, dir = 1;
            for (let i = 0; i < t.length; i++) {
                f[rail].push(t[i]);
                rail += dir;
                if (rail === 0 || rail === rails - 1) dir *= -1;
            }
            return f.flat().join('');
        } else {
            const len = t.length;
            const pat = [];
            let rail = 0, dir = 1;
            for (let i = 0; i < len; i++) {
                pat.push(rail);
                rail += dir;
                if (rail === 0 || rail === rails - 1) dir *= -1;
            }
            const cnt = new Array(rails).fill(0);
            pat.forEach(function(r) { cnt[r]++; });
            const f = [];
            for (let i = 0; i < rails; i++) f.push([]);
            let idx = 0;
            for (let r = 0; r < rails; r++) {
                for (let i = 0; i < cnt[r]; i++) f[r].push(t[idx++]);
            }
            const ind = new Array(rails).fill(0);
            let res = '';
            for (let i = 0; i < pat.length; i++) {
                res += f[pat[i]][ind[pat[i]]++];
            }
            return res;
        }
    }

    function rotation(t, s, inv) {
        const r = rng(s);
        const bs = 3 + Math.floor(r() * 4);
        const bl = [];
        for (let i = 0; i < t.length; i += bs) bl.push(t.slice(i, i + bs));
        return bl.map(function(b, i) {
            const rot = Math.floor(rng(s + i)() * b.length);
            const x = inv ? (b.length - rot) % b.length : rot;
            return b.slice(x) + b.slice(0, x);
        }).join('');
    }

    function inversion(t, s) {
        const r = rng(s);
        const bs = 2 + Math.floor(r() * 3);
        const bl = [];
        for (let i = 0; i < t.length; i += bs) bl.push(t.slice(i, i + bs));
        return bl.map(function(b, i) {
            return rng(s + i * 1000)() > 0.5 ? b.split('').reverse().join('') : b;
        }).join('');
    }

    const M = [
        { f: function(t, p, i) { return caesar(t, p.c1, i); }, p: function(r) { return { c1: 1 + Math.floor(r() * 25) }; } },
        { f: function(t) { return atbash(t); } },
        { f: function(t, p, i, c) { return vigenere(t, c, i); } },
        { f: function(t, p, i, c) { return beaufort(t, c); } },
        { f: function(t, p, i, c) { return porta(t, c, i); } },
        { f: function(t, p, i) { return trithemius(t, i); } },
        { f: function(t, p, i) { return substitution(t, p.s1, i); }, p: function(r) { return { s1: Math.floor(r() * 1e6) }; } },
        { f: function(t, p, i) { return alberti(t, p.a1, i); }, p: function(r) { return { a1: Math.floor(r() * 1e6) }; } },
        { f: function(t, p, i) { return bifurcation(t, p.b1, i); }, p: function(r) { return { b1: Math.floor(r() * 1e6) }; } },
        { f: function(t, p, i) { return railFence(t, p.rf, i); }, p: function(r) { return { rf: 2 + Math.floor(r() * 4) }; } },
        { f: function(t, p, i) { return rotation(t, p.ro, i); }, p: function(r) { return { ro: Math.floor(r() * 1e6) }; } },
        { f: function(t, p) { return inversion(t, p.iv); }, p: function(r) { return { iv: Math.floor(r() * 1e6) }; } }
    ];

    function encrypt(key, message) {
        const s = seed(key);
        const r = rng(s);
        const params = {};
        M.forEach(function(m) { if (m.p) Object.assign(params, m.p(r)); });
        const order = M.slice();
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(r() * (i + 1));
            const temp = order[i]; order[i] = order[j]; order[j] = temp;
        }
        let res = message;
        for (let i = 0; i < order.length; i++) {
            res = order[i].f(res, params, false, key);
        }
        return btoa(unescape(encodeURIComponent(res)));
    }

    function decrypt(key, encrypted) {
        let res;
        try {
            res = decodeURIComponent(escape(atob(encrypted)));
        } catch (e) {
            return null;
        }
        const s = seed(key);
        const r = rng(s);
        const params = {};
        M.forEach(function(m) { if (m.p) Object.assign(params, m.p(r)); });
        const order = M.slice();
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(r() * (i + 1));
            const temp = order[i]; order[i] = order[j]; order[j] = temp;
        }
        for (let i = order.length - 1; i >= 0; i--) {
            res = order[i].f(res, params, true, key);
        }
        return res;
    }

    // Export for browser and Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { encrypt, decrypt };
    } else if (typeof window !== 'undefined') {
        window.Optio = { encrypt, decrypt };
    }
})();
