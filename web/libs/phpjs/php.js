"use strict"
function PHP_JS() {

var that = this;

this.php_js = {};
this.window = window;

this.getenv = function (varname) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: We are not using $_ENV as in PHP, you could define
  // %        note 1: "$_ENV = this.php_js.ENV;" and get/set accordingly
  // %        note 2: Returns e.g. 'en-US' when set global this.php_js.ENV is set
  // %        note 3: Uses global: php_js to store environment info
  // *     example 1: getenv('LC_ALL');
  // *     returns 1: false
  if (!this.php_js || !this.php_js.ENV || !this.php_js.ENV[varname]) {
    return false;
  }

  return this.php_js.ENV[varname];
};

this.setlocale = function (category, locale) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   derived from: Blues at http://hacks.bluesmoon.info/strftime/strftime.js
  // +   derived from: YUI Library: http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html
  // -    depends on: getenv
  // %          note 1: Is extensible, but currently only implements locales en,
  // %          note 1: en_US, en_GB, en_AU, fr, and fr_CA for LC_TIME only; C for LC_CTYPE;
  // %          note 1: C and en for LC_MONETARY/LC_NUMERIC; en for LC_COLLATE
  // %          note 2: Uses global: php_js to store locale info
  // %          note 3: Consider using http://demo.icu-project.org/icu-bin/locexp as basis for localization (as in i18n_loc_set_default())
  // *     example 1: setlocale('LC_ALL', 'en_US');
  // *     returns 1: 'en_US'
  var categ = '',
    cats = [],
    i = 0,
    d = this.window.document;

  // BEGIN STATIC
  var _copy = function _copy(orig) {
    if (orig instanceof RegExp) {
      return new RegExp(orig);
    } else if (orig instanceof Date) {
      return new Date(orig);
    }
    var newObj = {};
    for (var i in orig) {
      if (typeof orig[i] === 'object') {
        newObj[i] = _copy(orig[i]);
      } else {
        newObj[i] = orig[i];
      }
    }
    return newObj;
  };

  // Function usable by a ngettext implementation (apparently not an accessible part of setlocale(), but locale-specific)
  // See http://www.gnu.org/software/gettext/manual/gettext.html#Plural-forms though amended with others from
  // https://developer.mozilla.org/En/Localization_and_Plurals (new categories noted with "MDC" below, though
  // not sure of whether there is a convention for the relative order of these newer groups as far as ngettext)
  // The function name indicates the number of plural forms (nplural)
  // Need to look into http://cldr.unicode.org/ (maybe future JavaScript); Dojo has some functions (under new BSD),
  // including JSON conversions of LDML XML from CLDR: http://bugs.dojotoolkit.org/browser/dojo/trunk/cldr
  // and docs at http://api.dojotoolkit.org/jsdoc/HEAD/dojo.cldr
  var _nplurals1 = function (n) { // e.g., Japanese
    return 0;
  };
  var _nplurals2a = function (n) { // e.g., English
    return n !== 1 ? 1 : 0;
  };
  var _nplurals2b = function (n) { // e.g., French
    return n > 1 ? 1 : 0;
  };
  var _nplurals2c = function (n) { // e.g., Icelandic (MDC)
    return n % 10 === 1 && n % 100 !== 11 ? 0 : 1;
  };
  var _nplurals3a = function (n) { // e.g., Latvian (MDC has a different order from gettext)
    return n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2;
  };
  var _nplurals3b = function (n) { // e.g., Scottish Gaelic
    return n === 1 ? 0 : n === 2 ? 1 : 2;
  };
  var _nplurals3c = function (n) { // e.g., Romanian
    return n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2;
  };
  var _nplurals3d = function (n) { // e.g., Lithuanian (MDC has a different order from gettext)
    return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
  };
  var _nplurals3e = function (n) { // e.g., Croatian
    return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
  };
  var _nplurals3f = function (n) { // e.g., Slovak
    return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;
  };
  var _nplurals3g = function (n) { // e.g., Polish
    return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
  };
  var _nplurals3h = function (n) { // e.g., Macedonian (MDC)
    return n % 10 === 1 ? 0 : n % 10 === 2 ? 1 : 2;
  };
  var _nplurals4a = function (n) { // e.g., Slovenian
    return n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3;
  };
  var _nplurals4b = function (n) { // e.g., Maltese (MDC)
    return n === 1 ? 0 : n === 0 || (n % 100 && n % 100 <= 10) ? 1 : n % 100 >= 11 && n % 100 <= 19 ? 2 : 3;
  };
  var _nplurals5 = function (n) { // e.g., Irish Gaeilge (MDC)
    return n === 1 ? 0 : n === 2 ? 1 : n >= 3 && n <= 6 ? 2 : n >= 7 && n <= 10 ? 3 : 4;
  };
  var _nplurals6 = function (n) { // e.g., Arabic (MDC) - Per MDC puts 0 as last group
    return n === 0 ? 5 : n === 1 ? 0 : n === 2 ? 1 : n % 100 >= 3 && n % 100 <= 10 ? 2 : n % 100 >= 11 && n % 100 <= 99 ? 3 : 4;
  };
  // END STATIC
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};

  var phpjs = this.php_js;

  // Reconcile Windows vs. *nix locale names?
  // Allow different priority orders of languages, esp. if implement gettext as in
  //     LANGUAGE env. var.? (e.g., show German if French is not available)
  if (!phpjs.locales) {
    // Can add to the locales
    phpjs.locales = {};

    phpjs.locales.en = {
      'LC_COLLATE': // For strcoll


      function (str1, str2) { // Fix: This one taken from strcmp, but need for other locales; we don't use localeCompare since its locale is not settable
        return (str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1);
      },
      'LC_CTYPE': { // Need to change any of these for English as opposed to C?
        an: /^[A-Za-z\d]+$/g,
        al: /^[A-Za-z]+$/g,
        ct: /^[\u0000-\u001F\u007F]+$/g,
        dg: /^[\d]+$/g,
        gr: /^[\u0021-\u007E]+$/g,
        lw: /^[a-z]+$/g,
        pr: /^[\u0020-\u007E]+$/g,
        pu: /^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
        sp: /^[\f\n\r\t\v ]+$/g,
        up: /^[A-Z]+$/g,
        xd: /^[A-Fa-f\d]+$/g,
        CODESET: 'UTF-8',
        // Used by sql_regcase
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      },
      'LC_TIME': { // Comments include nl_langinfo() constant equivalents and any changes from Blues' implementation
        a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        // ABDAY_
        A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        // DAY_
        b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        // ABMON_
        B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        // MON_
        c: '%a %d %b %Y %r %Z',
        // D_T_FMT // changed %T to %r per results
        p: ['AM', 'PM'],
        // AM_STR/PM_STR
        P: ['am', 'pm'],
        // Not available in nl_langinfo()
        r: '%I:%M:%S %p',
        // T_FMT_AMPM (Fixed for all locales)
        x: '%m/%d/%Y',
        // D_FMT // switched order of %m and %d; changed %y to %Y (C uses %y)
        X: '%r',
        // T_FMT // changed from %T to %r  (%T is default for C, not English US)
        // Following are from nl_langinfo() or http://www.cptec.inpe.br/sx4/sx4man2/g1ab02e/strftime.4.html
        alt_digits: '',
        // e.g., ordinal
        ERA: '',
        ERA_YEAR: '',
        ERA_D_T_FMT: '',
        ERA_D_FMT: '',
        ERA_T_FMT: ''
      },
      // Assuming distinction between numeric and monetary is thus:
      // See below for C locale
      'LC_MONETARY': { // Based on Windows "english" (English_United States.1252) locale
        int_curr_symbol: 'USD',
        currency_symbol: '$',
        mon_decimal_point: '.',
        mon_thousands_sep: ',',
        mon_grouping: [3],
        // use mon_thousands_sep; "" for no grouping; additional array members indicate successive group lengths after first group (e.g., if to be 1,23,456, could be [3, 2])
        positive_sign: '',
        negative_sign: '-',
        int_frac_digits: 2,
        // Fractional digits only for money defaults?
        frac_digits: 2,
        p_cs_precedes: 1,
        // positive currency symbol follows value = 0; precedes value = 1
        p_sep_by_space: 0,
        // 0: no space between curr. symbol and value; 1: space sep. them unless symb. and sign are adjacent then space sep. them from value; 2: space sep. sign and value unless symb. and sign are adjacent then space separates
        n_cs_precedes: 1,
        // see p_cs_precedes
        n_sep_by_space: 0,
        // see p_sep_by_space
        p_sign_posn: 3,
        // 0: parentheses surround quantity and curr. symbol; 1: sign precedes them; 2: sign follows them; 3: sign immed. precedes curr. symbol; 4: sign immed. succeeds curr. symbol
        n_sign_posn: 0 // see p_sign_posn
      },
      'LC_NUMERIC': { // Based on Windows "english" (English_United States.1252) locale
        decimal_point: '.',
        thousands_sep: ',',
        grouping: [3] // see mon_grouping, but for non-monetary values (use thousands_sep)
      },
      'LC_MESSAGES': {
        YESEXPR: '^[yY].*',
        NOEXPR: '^[nN].*',
        YESSTR: '',
        NOSTR: ''
      },
      nplurals: _nplurals2a
    };
    phpjs.locales.en_US = _copy(phpjs.locales.en);
    phpjs.locales.en_US.LC_TIME.c = '%a %d %b %Y %r %Z';
    phpjs.locales.en_US.LC_TIME.x = '%D';
    phpjs.locales.en_US.LC_TIME.X = '%r';
    // The following are based on *nix settings
    phpjs.locales.en_US.LC_MONETARY.int_curr_symbol = 'USD ';
    phpjs.locales.en_US.LC_MONETARY.p_sign_posn = 1;
    phpjs.locales.en_US.LC_MONETARY.n_sign_posn = 1;
    phpjs.locales.en_US.LC_MONETARY.mon_grouping = [3, 3];
    phpjs.locales.en_US.LC_NUMERIC.thousands_sep = '';
    phpjs.locales.en_US.LC_NUMERIC.grouping = [];

    phpjs.locales.en_GB = _copy(phpjs.locales.en);
    phpjs.locales.en_GB.LC_TIME.r = '%l:%M:%S %P %Z';

    phpjs.locales.en_AU = _copy(phpjs.locales.en_GB);
    phpjs.locales.C = _copy(phpjs.locales.en); // Assume C locale is like English (?) (We need C locale for LC_CTYPE)
    phpjs.locales.C.LC_CTYPE.CODESET = 'ANSI_X3.4-1968';
    phpjs.locales.C.LC_MONETARY = {
      int_curr_symbol: '',
      currency_symbol: '',
      mon_decimal_point: '',
      mon_thousands_sep: '',
      mon_grouping: [],
      p_cs_precedes: 127,
      p_sep_by_space: 127,
      n_cs_precedes: 127,
      n_sep_by_space: 127,
      p_sign_posn: 127,
      n_sign_posn: 127,
      positive_sign: '',
      negative_sign: '',
      int_frac_digits: 127,
      frac_digits: 127
    };
    phpjs.locales.C.LC_NUMERIC = {
      decimal_point: '.',
      thousands_sep: '',
      grouping: []
    };
    phpjs.locales.C.LC_TIME.c = '%a %b %e %H:%M:%S %Y'; // D_T_FMT
    phpjs.locales.C.LC_TIME.x = '%m/%d/%y'; // D_FMT
    phpjs.locales.C.LC_TIME.X = '%H:%M:%S'; // T_FMT
    phpjs.locales.C.LC_MESSAGES.YESEXPR = '^[yY]';
    phpjs.locales.C.LC_MESSAGES.NOEXPR = '^[nN]';

    phpjs.locales.fr = _copy(phpjs.locales.en);
    phpjs.locales.fr.nplurals = _nplurals2b;
    phpjs.locales.fr.LC_TIME.a = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
    phpjs.locales.fr.LC_TIME.A = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    phpjs.locales.fr.LC_TIME.b = ['jan', 'f\u00E9v', 'mar', 'avr', 'mai', 'jun', 'jui', 'ao\u00FB', 'sep', 'oct', 'nov', 'd\u00E9c'];
    phpjs.locales.fr.LC_TIME.B = ['janvier', 'f\u00E9vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao\u00FBt', 'septembre', 'octobre', 'novembre', 'd\u00E9cembre'];
    phpjs.locales.fr.LC_TIME.c = '%a %d %b %Y %T %Z';
    phpjs.locales.fr.LC_TIME.p = ['', ''];
    phpjs.locales.fr.LC_TIME.P = ['', ''];
    phpjs.locales.fr.LC_TIME.x = '%d.%m.%Y';
    phpjs.locales.fr.LC_TIME.X = '%T';

    phpjs.locales.fr_CA = _copy(phpjs.locales.fr);
    phpjs.locales.fr_CA.LC_TIME.x = '%Y-%m-%d';
  }
  if (!phpjs.locale) {
    phpjs.locale = 'en_US';
    var NS_XHTML = 'http://www.w3.org/1999/xhtml';
    var NS_XML = 'http://www.w3.org/XML/1998/namespace';
    if (d.getElementsByTagNameNS && d.getElementsByTagNameNS(NS_XHTML, 'html')[0]) {
      if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS && d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang')) {
        phpjs.locale = d.getElementsByTagName(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang');
      } else if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang) { // XHTML 1.0 only
        phpjs.locale = d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang;
      }
    } else if (d.getElementsByTagName('html')[0] && d.getElementsByTagName('html')[0].lang) {
      phpjs.locale = d.getElementsByTagName('html')[0].lang;
    }
  }
  phpjs.locale = phpjs.locale.replace('-', '_'); // PHP-style
  // Fix locale if declared locale hasn't been defined
  if (!(phpjs.locale in phpjs.locales)) {
    if (phpjs.locale.replace(/_[a-zA-Z]+$/, '') in phpjs.locales) {
      phpjs.locale = phpjs.locale.replace(/_[a-zA-Z]+$/, '');
    }
  }

  if (!phpjs.localeCategories) {
    phpjs.localeCategories = {
      'LC_COLLATE': phpjs.locale,
      // for string comparison, see strcoll()
      'LC_CTYPE': phpjs.locale,
      // for character classification and conversion, for example strtoupper()
      'LC_MONETARY': phpjs.locale,
      // for localeconv()
      'LC_NUMERIC': phpjs.locale,
      // for decimal separator (See also localeconv())
      'LC_TIME': phpjs.locale,
      // for date and time formatting with strftime()
      'LC_MESSAGES': phpjs.locale // for system responses (available if PHP was compiled with libintl)
    };
  }
  // END REDUNDANT
  if (locale === null || locale === '') {
    locale = this.getenv(category) || this.getenv('LANG');
  } else if (Object.prototype.toString.call(locale) === '[object Array]') {
    for (i = 0; i < locale.length; i++) {
      if (!(locale[i] in this.php_js.locales)) {
        if (i === locale.length - 1) {
          return false; // none found
        }
        continue;
      }
      locale = locale[i];
      break;
    }
  }

  // Just get the locale
  if (locale === '0' || locale === 0) {
    if (category === 'LC_ALL') {
      for (categ in this.php_js.localeCategories) {
        cats.push(categ + '=' + this.php_js.localeCategories[categ]); // Add ".UTF-8" or allow ".@latint", etc. to the end?
      }
      return cats.join(';');
    }
    return this.php_js.localeCategories[category];
  }

  if (!(locale in this.php_js.locales)) {
    return false; // Locale not found
  }

  // Set and get locale
  if (category === 'LC_ALL') {
    for (categ in this.php_js.localeCategories) {
      this.php_js.localeCategories[categ] = locale;
    }
  } else {
    this.php_js.localeCategories[category] = locale;
  }
  return locale;
};

this.strftime = function (fmt, timestamp) {
  // http://kevin.vanzonneveld.net
  // +      original by: Blues (http://tech.bluesmoon.info/)
  // + reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Alex
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -       depends on: setlocale
  // %        note 1: Uses global: php_js to store locale info
  // *        example 1: strftime("%A", 1062462400); // Return value will depend on date and locale
  // *        returns 1: 'Tuesday'
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
  // END REDUNDANT
  var phpjs = this.php_js;

  // BEGIN STATIC
  var _xPad = function (x, pad, r) {
    if (typeof r === 'undefined') {
      r = 10;
    }
    for (; parseInt(x, 10) < r && r > 1; r /= 10) {
      x = pad.toString() + x;
    }
    return x.toString();
  };

  var locale = phpjs.localeCategories.LC_TIME;
  var locales = phpjs.locales;
  var lc_time = locales[locale].LC_TIME;

  var _formats = {
    a: function (d) {
      return lc_time.a[d.getDay()];
    },
    A: function (d) {
      return lc_time.A[d.getDay()];
    },
    b: function (d) {
      return lc_time.b[d.getMonth()];
    },
    B: function (d) {
      return lc_time.B[d.getMonth()];
    },
    C: function (d) {
      return _xPad(parseInt(d.getFullYear() / 100, 10), 0);
    },
    d: ['getDate', '0'],
    e: ['getDate', ' '],
    g: function (d) {
      return _xPad(parseInt(this.G(d) / 100, 10), 0);
    },
    G: function (d) {
      var y = d.getFullYear();
      var V = parseInt(_formats.V(d), 10);
      var W = parseInt(_formats.W(d), 10);

      if (W > V) {
        y++;
      } else if (W === 0 && V >= 52) {
        y--;
      }

      return y;
    },
    H: ['getHours', '0'],
    I: function (d) {
      var I = d.getHours() % 12;
      return _xPad(I === 0 ? 12 : I, 0);
    },
    j: function (d) {
      var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
      ms += d.getTimezoneOffset() * 60000; // Line differs from Yahoo implementation which would be equivalent to replacing it here with:
      // ms = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT') - ms;
      var doy = parseInt(ms / 60000 / 60 / 24, 10) + 1;
      return _xPad(doy, 0, 100);
    },
    k: ['getHours', '0'],
    // not in PHP, but implemented here (as in Yahoo)
    l: function (d) {
      var l = d.getHours() % 12;
      return _xPad(l === 0 ? 12 : l, ' ');
    },
    m: function (d) {
      return _xPad(d.getMonth() + 1, 0);
    },
    M: ['getMinutes', '0'],
    p: function (d) {
      return lc_time.p[d.getHours() >= 12 ? 1 : 0];
    },
    P: function (d) {
      return lc_time.P[d.getHours() >= 12 ? 1 : 0];
    },
    s: function (d) { // Yahoo uses return parseInt(d.getTime()/1000, 10);
      return Date.parse(d) / 1000;
    },
    S: ['getSeconds', '0'],
    u: function (d) {
      var dow = d.getDay();
      return ((dow === 0) ? 7 : dow);
    },
    U: function (d) {
      var doy = parseInt(_formats.j(d), 10);
      var rdow = 6 - d.getDay();
      var woy = parseInt((doy + rdow) / 7, 10);
      return _xPad(woy, 0);
    },
    V: function (d) {
      var woy = parseInt(_formats.W(d), 10);
      var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
      // First week is 01 and not 00 as in the case of %U and %W,
      // so we add 1 to the final result except if day 1 of the year
      // is a Monday (then %W returns 01).
      // We also need to subtract 1 if the day 1 of the year is
      // Friday-Sunday, so the resulting equation becomes:
      var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
      if (idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4) {
        idow = 1;
      } else if (idow === 0) {
        idow = _formats.V(new Date('' + (d.getFullYear() - 1) + '/12/31'));
      }
      return _xPad(idow, 0);
    },
    w: 'getDay',
    W: function (d) {
      var doy = parseInt(_formats.j(d), 10);
      var rdow = 7 - _formats.u(d);
      var woy = parseInt((doy + rdow) / 7, 10);
      return _xPad(woy, 0, 10);
    },
    y: function (d) {
      return _xPad(d.getFullYear() % 100, 0);
    },
    Y: 'getFullYear',
    z: function (d) {
      var o = d.getTimezoneOffset();
      var H = _xPad(parseInt(Math.abs(o / 60), 10), 0);
      var M = _xPad(o % 60, 0);
      return (o > 0 ? '-' : '+') + H + M;
    },
    Z: function (d) {
      return d.toString().replace(/^.*\(([^)]+)\)$/, '$1');
/*
      // Yahoo's: Better?
      var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
      if(tz.length > 4) {
        tz = Dt.formats.z(d);
      }
      return tz;
      */
    },
    '%': function (d) {
      return '%';
    }
  };
  // END STATIC
/* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
Ec
EC
Ex
EX
Ey
EY
Od or Oe
OH
OI
Om
OM
OS
OU
Ow
OW
Oy
*/

  var _date = ((typeof(timestamp) == 'undefined') ? new Date() : // Not provided
  (typeof(timestamp) == 'object') ? new Date(timestamp) : // Javascript Date()
  new Date(timestamp * 1000) // PHP API expects UNIX timestamp (auto-convert to int)
  );

  var _aggregates = {
    c: 'locale',
    D: '%m/%d/%y',
    F: '%y-%m-%d',
    h: '%b',
    n: '\n',
    r: 'locale',
    R: '%H:%M',
    t: '\t',
    T: '%H:%M:%S',
    x: 'locale',
    X: 'locale'
  };


  // First replace aggregates (run in a loop because an agg may be made up of other aggs)
  while (fmt.match(/%[cDFhnrRtTxX]/)) {
    fmt = fmt.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
      var f = _aggregates[m1];
      return (f === 'locale' ? lc_time[m1] : f);
    });
  }

  // Now replace formats - we need a closure so that the date object gets passed through
  var str = fmt.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, function (m0, m1) {
    var f = _formats[m1];
    if (typeof f === 'string') {
      return _date[f]();
    } else if (typeof f === 'function') {
      return f(_date);
    } else if (typeof f === 'object' && typeof(f[0]) === 'string') {
      return _xPad(_date[f[0]](), f[1]);
    } else { // Shouldn't reach here
      return m1;
    }
  });
  return str;
}

this.str_pad = function (input, pad_length, pad_string, pad_type) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // + namespaced by: Michael White (http://getsprink.com)
  // +      input by: Marco van Oort
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
  // *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
  // *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
  // *     returns 2: '------Kevin van Zonneveld-----'
  var half = '',
    pad_to_go;

  var str_pad_repeater = function (s, len) {
    var collect = '',
      i;

    while (collect.length < len) {
      collect += s;
    }
    collect = collect.substr(0, len);

    return collect;
  };

  input += '';
  pad_string = pad_string !== undefined ? pad_string : ' ';

  if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
    pad_type = 'STR_PAD_RIGHT';
  }
  if ((pad_to_go = pad_length - input.length) > 0) {
    if (pad_type == 'STR_PAD_LEFT') {
      input = str_pad_repeater(pad_string, pad_to_go) + input;
    } else if (pad_type == 'STR_PAD_RIGHT') {
      input = input + str_pad_repeater(pad_string, pad_to_go);
    } else if (pad_type == 'STR_PAD_BOTH') {
      half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
      input = half + input + half;
      input = input.substr(0, pad_length);
    }
  }

  return input;
}

}