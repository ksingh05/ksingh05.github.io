/* Copyright (C) 2016 Jeff Irion */
function allowOnlyNumbers(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
        return false;
        }
    return true;
}

function lbstokg() {
  /* for the lbs <--> kg converter */
  var lbs = document.getElementById('lbs-input').value;
  var kg = Math.round(453.592*lbs)/1000.0;
  document.getElementById('kg-output').innerHTML = Number(kg) + " <strong>kg</strong>";
}

function kgtolbs() {
  /* for the lbs <--> kg converter */
  var kg = document.getElementById('kg-input').value;
  var lbs = Math.round(2204.62*kg)/1000.0;
  document.getElementById('lbs-output').innerHTML = Number(lbs) + " <strong>lbs.</strong>";
}

function calculate() {
  /* calculate all the meet stuff */
  /* reset everything */
  document.getElementById('totaltext').innerHTML = "";
  document.getElementById('wilkstext').innerHTML = "";
  document.getElementById('malonetext').innerHTML = "";
  document.getElementById('total1').innerHTML = "";
  document.getElementById('total2').innerHTML = "";
  document.getElementById('total3').innerHTML = "";
  document.getElementById('wilks1').innerHTML = "";
  document.getElementById('wilks2').innerHTML = "";
  document.getElementById('wilks3').innerHTML = "";
  document.getElementById('malone1').innerHTML = "";
  document.getElementById('malone2').innerHTML = "";
  document.getElementById('malone3').innerHTML = "";
  document.getElementById('reqdead').innerHTML = "";
  document.getElementById('beattotal').innerHTML = "";
  document.getElementById('beatWilks').innerHTML = "";
  document.getElementById('beatMalone').innerHTML = "";

  var bodyweight1 = parseFloat(document.getElementById('bodyweight1').value);
  var bodyweight2 = parseFloat(document.getElementById('bodyweight2').value);
  var bodyweight3 = parseFloat(document.getElementById('bodyweight3').value);
  var squat1 = parseFloat(document.getElementById('squat1').value);
  var squat2 = parseFloat(document.getElementById('squat2').value);
  var squat3 = parseFloat(document.getElementById('squat3').value);
  var bench1 = parseFloat(document.getElementById('bench1').value);
  var bench2 = parseFloat(document.getElementById('bench2').value);
  var bench3 = parseFloat(document.getElementById('bench3').value);
  var dead1 = parseFloat(document.getElementById('dead1').value);
  var dead2 = parseFloat(document.getElementById('dead2').value);
  var dead3 = parseFloat(document.getElementById('dead3').value);
  var desiredtotal = parseFloat(document.getElementById('desiredtotal').value);
  /* calculate the totals */
  var total1 = calculateTotal(squat1, bench1, dead1);
  var total2 = calculateTotal(squat2, bench2, dead2);
  var total3 = calculateTotal(squat3, bench3, dead3);
  /* calculate the Wilks scores */
  var wilks1 = calculateWilks(bodyweight1, total1);
  var wilks2 = calculateWilks(bodyweight2, total2);
  var wilks3 = calculateWilks(bodyweight3, total3);
  /* calculate the Malone scores */
  var malone1 = calculateMalone(bodyweight1, total1);
  var malone2 = calculateMalone(bodyweight2, total2);
  var malone3 = calculateMalone(bodyweight3, total3);
  /* calculate Lifter 1's Wilks and Malone coefficients */
  var wcoeff1 = coeffWilks(bodyweight1);
  var mcoeff1 = coeffMalone(bodyweight1);
  if (total1 != "" || total2 != "" || total3 != "") {
    /* display "Total", "Wilks", and "Malone" */
    document.getElementById('totaltext').innerHTML = "Total";
    document.getElementById('wilkstext').innerHTML = "<strong>Wilks</strong>";
    document.getElementById('malonetext').innerHTML = "<strong>Malone</strong>";
    /* display the totals */
    document.getElementById('total1').innerHTML = stringTotal(total1);
    document.getElementById('total2').innerHTML = stringTotal(total2);
    document.getElementById('total3').innerHTML = stringTotal(total3);
    /* display the Wilks scores */
    document.getElementById('wilks1').innerHTML = numberFormatter(wilks1, 2);
    document.getElementById('wilks2').innerHTML = numberFormatter(wilks2, 2);
    document.getElementById('wilks3').innerHTML = numberFormatter(wilks3, 2);
    /* display the Malone scores */
    document.getElementById('malone1').innerHTML = numberFormatter(malone1, 2);
    document.getElementById('malone2').innerHTML = numberFormatter(malone2, 2);
    document.getElementById('malone3').innerHTML = numberFormatter(malone3, 2);
  }
  /* calculate the required deadlift */
  if (!isNaN(squat1) && !isNaN(bench1) && !isNaN(desiredtotal)) {
    if (document.getElementById('units').value != document.getElementById('meet-units').value) {
      /* units != meet units */
      reqdead_meetunits = tomeetunits(desiredtotal) - tomeetunits(squat1) - tomeetunits(bench1);
      reqdead_units = Number(Math.floor(10.0*tounits(reqdead_meetunits)))/10.0;
      document.getElementById('reqdead').innerHTML = "You need a <strong>" + Number(reqdead_units) + " " + document.getElementById('units').value + "</strong> (<strong>" + reqdead_meetunits + " " + document.getElementById('meet-units').value + "</strong>) deadlift to hit a <strong>" + Number(tounits(tomeetunits(desiredtotal))) + " " +document.getElementById('units').value + "</strong> total.";
    }
    else {
      /* units == meet units */
      reqdead_meetunits = desiredtotal - squat1 - bench1;
      units = document.getElementById('units').value;
      document.getElementById('reqdead').innerHTML = "You need a <strong>" + Number(reqdead_meetunits) + " " + document.getElementById('units').value + "</strong> deadlift to hit a <strong>" + Number(desiredtotal) + " " + document.getElementById('units').value + "</strong> total.";
    }
  }
  /* calculate the deadlift required to have the highest total */
  if (!isNaN(squat1) && !isNaN(bench1) && (total2 != "" || total3 != "")) {
    /* figure out which total is higher, total2 or total3 */
    if (total2 == "") {
      var totaltobeat = total3;
      var lifter = "Lifter 3";
    }
    else if (total3 == "") {
      var totaltobeat = total2;
      var lifter = "Lifter 2";
    }
    else {
      var totaltobeat = Math.max(total2, total3);
      if (total2 > total3) {
        var lifter = "Lifter 2";
      }
      else {
        var lifter = "Lifter 3";
      }
    }
    /* the deadlift needed to beat the total */
    if (document.getElementById('meet-units').value == 'kg') {
      var reqdead_meetunits = 2.5 + totaltobeat - tomeetunits(squat1) - tomeetunits(bench1);
    }
    else {
      var reqdead_meetunits = 5.0 + totaltobeat - tomeetunits(squat1) - tomeetunits(bench1);
    }
    if (document.getElementById('units').value != document.getElementById('meet-units').value) {
      /* units != meet units */
      reqdead_units = Number(Math.floor(10.0*tounits(reqdead_meetunits)))/10.0;
      document.getElementById('beattotal').innerHTML = "You need a <strong>" + Number(reqdead_units) + " " + document.getElementById('units').value + "</strong> (<strong>" + reqdead_meetunits + " " + document.getElementById('meet-units').value + "</strong>) deadlift to beat " + lifter + "'s total.";
    }
    else {
      /* units == meet units */
      reqdead_meetunits = totaltobeat - squat1 - bench1;
      units = document.getElementById('units').value;
      document.getElementById('beattotal').innerHTML = "You need a <strong>" + Number(reqdead_meetunits) + " " + document.getElementById('units').value + "</strong> deadlift to beat " + lifter + "'s total.";
    }
  }
  /* calculate the deadlift required to have the highest Wilks score */
  if (!isNaN(bodyweight1) && !isNaN(squat1) && !isNaN(bench1) && (wilks2 != "" || wilks3 != "")) {
    /* figure out which Wilks is higher, wilks2 or wilks3 */
    if (wilks2 == "") {
      var wilkstobeat = wilks3;
      var lifter = "Lifter 3";
    }
    else if (wilks3 == "") {
      var wilkstobeat = wilks2;
      var lifter = "Lifter 2";
    }
    else {
      var wilkstobeat = Math.max(wilks2, wilks3);
      if (wilks2 > wilks3) {
        var lifter = "Lifter 2";
      }
      else {
        var lifter = "Lifter 3";
      }
    }
    /* the deadlift needed to beat the Wilks score */
    var reqdead_meetunits = beatWilks(wilkstobeat, wcoeff1) - tomeetunits(squat1) - tomeetunits(bench1);
    if (document.getElementById('units').value != document.getElementById('meet-units').value) {
      /* units != meet units */
      reqdead_units = Number(Math.floor(10.0*tounits(reqdead_meetunits)))/10.0;
      document.getElementById('beatWilks').innerHTML = "You need a <strong>" + Number(reqdead_units) + " " + document.getElementById('units').value + "</strong> (<strong>" + reqdead_meetunits + " " + document.getElementById('meet-units').value + "</strong>) deadlift to beat " + lifter + "'s Wilks score.";
    }
    else {
      /* units == meet units */
      units = document.getElementById('units').value;
      document.getElementById('beatWilks').innerHTML = "You need a <strong>" + Number(reqdead_meetunits) + " " + document.getElementById('units').value + "</strong> deadlift to beat " + lifter + "'s Wilks score.";
    }
    /* calculate the deadlift required to have the highest Malone score */
    if (mcoeff1 != "" && !isNaN(squat1) && !isNaN(bench1) && (malone2 != "" || malone3 != "") && (malone2 != "N/A" || malone3 != "N/A")) {
      /* figure out which Malone score is higher, malone2 or malone3 */
      if (malone2 == "") {
        var malonetobeat = malone3;
        var lifter = "Lifter 3";
      }
      else if (malone3 == "") {
        var malonetobeat = malone2;
        var lifter = "Lifter 2";
      }
      else {
        var malonetobeat = Math.max(malone2, malone3);
        if (malone2 > malone3) {
          var lifter = "Lifter 2";
        }
        else {
          var lifter = "Lifter 3";
        }
      }
      /* the deadlift needed to beat the Malone score */
      var reqdead_meetunits = beatMalone(malonetobeat, mcoeff1) - tomeetunits(squat1) - tomeetunits(bench1);
      if (document.getElementById('units').value != document.getElementById('meet-units').value) {
        /* units != meet units */
        reqdead_units = Number(Math.floor(10.0*tounits(reqdead_meetunits)))/10.0;
        document.getElementById('beatMalone').innerHTML = "You need a <strong>" + Number(reqdead_units) + " " + document.getElementById('units').value + "</strong> (<strong>" + reqdead_meetunits + " " + document.getElementById('meet-units').value + "</strong>) deadlift to beat " + lifter + "'s Malone score.";
      }
      else {
        /* units == meet units */
        units = document.getElementById('units').value;
        document.getElementById('beatMalone').innerHTML = "You need a <strong>" + Number(reqdead_meetunits) + " " + document.getElementById('units').value + "</strong> deadlift to beat " + lifter + "'s Malone score.";
        /* document.getElementById('beatMalone').innerHTML = "You need a <strong>" + Number(malonetobeat) + " " + document.getElementById('units').value + "</strong> deadlift to beat " + lifter + "'s Malone score."; */
      }
    }
  }
}

function numberFormatter(number, decimals) {
  /* round `number` down to `decimals` digits, or return "" if `number` is 0 */
  if (number == 0) {
    return "";
  }
  else if (number == "N/A") {
    return "N/A";
  }
  else {
    return Number(Math.floor(Math.pow(10, decimals)*number)/Math.pow(10, decimals));
  }
}

function calculateTotal(squat, bench, dead) {
  /* calculate and return the total [in meet units], or return "" if a lift is missing */
  if (isNaN(squat) || isNaN(bench) || isNaN(dead)) {
    return "";
  }
  else if (document.getElementById('units').value != document.getElementById('meet-units').value) {
    /* units != meet units */
    return tomeetunits(squat) + tomeetunits(bench) + tomeetunits(dead);
  }
  else {
    /* units == meet units */
    return squat + bench + dead;
  }
}

function stringTotal(total) {
  /* return the total as a string [in units] */
  if (total == "") {
    return "";
  }
  else if (document.getElementById('units').value != document.getElementById('meet-units').value) {
    /* units != meet units */
    return Number(tounits(total)) + " " + document.getElementById('units').value;
  }
  else {
    /* units == meet units */
    return Number(total) + " " + document.getElementById('units').value;
  }
}

function coeffWilks(bodyweight) {
  /* calculate the Wilks coefficient */
  if (isNaN(bodyweight)) {
    return "";
  }
  else {
    /* convert bodyweight to kg */
    if (document.getElementById('units').value == 'kg') {
      var bw = bodyweight;
    }
    else {
      var bw = 0.453592*bodyweight;
    }
    /* men's Wilks formula */
    if (document.getElementById('gender').value == 'm') {
      return 500.0/(-216.0475144 + 16.2606339*bw - 0.002388645*Math.pow(bw, 2) - 0.00113732*Math.pow(bw, 3) + 0.00000701863*Math.pow(bw, 4) - 0.00000001291*Math.pow(bw, 5));
    }
    /* women's Wilks formula */
    else {
      return 500.0/(594.31747775582 - 27.23842536447*bw + 0.82112226871*Math.pow(bw, 2) - 0.00930733913*Math.pow(bw, 3) + 0.00004731582*Math.pow(bw, 4) - 0.00000009054*Math.pow(bw, 5));
    }
  }
}

function calculateWilks(bodyweight, total) {
  /* calculate the Wilks score */
  if (isNaN(bodyweight) || isNaN(total)) {
    return "";
  }
  else {
    var coeff = coeffWilks(bodyweight);
    /* compute the Wilks score (using the total in kg) */
    if (document.getElementById('meet-units').value == 'kg') {
      return Math.floor(1000.0*total*coeff)/1000.0;
    }
    else {
      return Math.floor(1000.0*0.453592*total*coeff)/1000.0;
    }
  }
}

function beatWilks(score, coeff) {
  /* Given your coefficient, compute the total (in meet units) that you need to beat a Wilks score */
  var total = score/coeff + Math.pow(10, -6);
  if (document.getElementById('meet-units').value == 'kg') {
    return 2.5*Math.ceil(total/2.5);
  }
  else {
    return 5*Math.ceil(total*2.20462/5);
  }
}

function calculateMalone(bodyweight, total) {
  /* calculate the Malone score */
  if (isNaN(bodyweight) || isNaN(total)) {
    return "";
  }
  else {
    var coeff = coeffMalone(bodyweight);
    if (coeff == "") {
      return "N/A";
    }
    /* compute the Malone score (using the total in lbs.) */
    if (document.getElementById('meet-units').value == 'lbs.') {
      return Math.floor(1000.0*total*coeff)/1000.0;
    }
    else {
      return Math.floor(1000.0*2.20462*total*coeff)/1000.0;
    }
  }
}

function coeffMalone(bodyweight) {
  /* calculate the Malone coefficient */
  if (isNaN(bodyweight)) {
    return "";
  }
  else {
    /* convert bodyweight to lbs */
    if (document.getElementById('units').value == 'kg') {
      var bw = 2.20462*bodyweight;
    }
    else {
      var bw = bodyweight;
    }
    /* for interpolating between coefficients, if necessary */
    var dbw = bw - Math.floor(bw);
    /* men's Malone formula */
    if (document.getElementById('gender').value == 'm') {
      /* make sure the body weight is within range */
      if (bw < 90 || bw > 361) {
        return "";
      }
      /* body weight is an integer --> look it up */
      else if (dbw == 0.0) {
        return mensmalone[Math.round(bw)];
      }
      /* interpolate */
      else {
        return (1.0-dbw)*mensmalone[Math.floor(bw)] + dbw*mensmalone[Math.ceil(bw)];
      }
    }
    /* women's Malone formula */
    else {
      /* make sure the body weight is within range */
      if (bw < 90 || bw > 249) {
        return "";
      }
      /* body weight is an integer --> look it up */
      else if (dbw == 0.0) {
        return womensmalone[Math.round(bw)];
      }
      /* interpolate */
      else {
        return (1.0-dbw)*womensmalone[Math.floor(bw)] + dbw*womensmalone[Math.ceil(bw)];
      }
    }
  }
}

function beatMalone(score, coeff) {
  /* Given your coefficient, compute the total (in meet units) that you need to beat a Wilks score */
  var total = score/coeff + Math.pow(10, -6);
  if (document.getElementById('meet-units').value == 'lbs.') {
    return 5*Math.ceil(total/5);
  }
  else {
    return 2.5*Math.ceil(0.453592*total/2.5);
  }
}

function tomeetunits(wt) {
  /* Convert from the input units to the meet units.  If input units are lbs
  and meet units are kg, convert to kg and round to the nearest 2.5 kg.  If
  units are kg and meet units are lbs, convert to lbs and round to the nearest
  5 lbs. Otherwise, return the number unchanged.  */
  if (document.getElementById('units').value == "lbs." && document.getElementById('meet-units').value == "kg") {
    return 2.5*Math.round(0.453592*wt/2.5);
  }
  else if (document.getElementById('units').value == "kg" && document.getElementById('meet-units').value == "lbs.") {
    return 5.0*Math.round(2.20462*wt/5.0);
  }
  else {
    return wt;
  }
}

function tounits(wt) {
  /* Convert from meet units to the input units and round to 2 decimal places */
  if (document.getElementById('units').value == "lbs." && document.getElementById('meet-units').value == "kg") {
    return Math.floor(220.462*wt)/100.0;
  }
  else if (document.getElementById('units').value == "kg" && document.getElementById('meet-units').value == "lbs.") {
    return Math.floor(45.3592*wt)/100.0;
  }
  else {
    return wt;
  }
}


/* MALONE COEFFICIENTS */
var mensmalone = {
  90: 1.2803,
  91: 1.2627,
  92: 1.2455,
  93: 1.2287,
  94: 1.2124,
  95: 1.1965,
  96: 1.1809,
  97: 1.1657,
  98: 1.1509,
  99: 1.1365,
  100: 1.1223,
  101: 1.1086,
  102: 1.0952,
  103: 1.0821,
  104: 1.0693,
  105: 1.0569,
  106: 1.0448,
  107: 1.0329,
  108: 1.0214,
  109: 1.0101,
  110: 0.9991,
  111: 0.9884,
  112: 0.9779,
  113: 0.9677,
  114: 0.9578,
  115: 0.9481,
  116: 0.9385,
  117: 0.9293,
  118: 0.9203,
  119: 0.9115,
  120: 0.9029,
  121: 0.8946,
  122: 0.8863,
  123: 0.8783,
  124: 0.8706,
  125: 0.863,
  126: 0.8556,
  127: 0.8483,
  128: 0.8412,
  129: 0.8343,
  130: 0.8276,
  131: 0.821,
  132: 0.8146,
  133: 0.8083,
  134: 0.8022,
  135: 0.7961,
  136: 0.7903,
  137: 0.7846,
  138: 0.779,
  139: 0.7735,
  140: 0.7682,
  141: 0.763,
  142: 0.7579,
  143: 0.7528,
  144: 0.7479,
  145: 0.7432,
  146: 0.7385,
  147: 0.7339,
  148: 0.7294,
  149: 0.725,
  150: 0.7207,
  151: 0.7165,
  152: 0.7124,
  153: 0.7083,
  154: 0.7044,
  155: 0.7004,
  156: 0.6967,
  157: 0.693,
  158: 0.6893,
  159: 0.6857,
  160: 0.6822,
  161: 0.6787,
  162: 0.6753,
  163: 0.672,
  164: 0.6688,
  165: 0.6656,
  166: 0.6624,
  167: 0.6593,
  168: 0.6563,
  169: 0.6533,
  170: 0.6504,
  171: 0.6475,
  172: 0.6447,
  173: 0.642,
  174: 0.6392,
  175: 0.6365,
  176: 0.6339,
  177: 0.6313,
  178: 0.6288,
  179: 0.6262,
  180: 0.6238,
  181: 0.6214,
  182: 0.619,
  183: 0.6167,
  184: 0.6144,
  185: 0.6121,
  186: 0.6099,
  187: 0.6077,
  188: 0.6056,
  189: 0.6036,
  190: 0.6014,
  191: 0.5994,
  192: 0.5978,
  193: 0.5954,
  194: 0.5935,
  195: 0.5916,
  196: 0.5897,
  197: 0.5879,
  198: 0.5861,
  199: 0.5843,
  200: 0.5826,
  201: 0.5809,
  202: 0.5792,
  203: 0.5776,
  204: 0.576,
  205: 0.5744,
  206: 0.5729,
  207: 0.5714,
  208: 0.57,
  209: 0.5685,
  210: 0.567,
  211: 0.5657,
  212: 0.5643,
  213: 0.563,
  214: 0.5617,
  215: 0.5604,
  216: 0.5592,
  217: 0.558,
  218: 0.5568,
  219: 0.5556,
  220: 0.5545,
  221: 0.5535,
  222: 0.5524,
  223: 0.5514,
  224: 0.5504,
  225: 0.5494,
  226: 0.5485,
  227: 0.5476,
  228: 0.5467,
  229: 0.5458,
  230: 0.5449,
  231: 0.5441,
  232: 0.5433,
  233: 0.5426,
  234: 0.5418,
  235: 0.5411,
  236: 0.5405,
  237: 0.5398,
  238: 0.5391,
  239: 0.5385,
  240: 0.5379,
  241: 0.5373,
  242: 0.5367,
  243: 0.5362,
  244: 0.5357,
  245: 0.5352,
  246: 0.5347,
  247: 0.5342,
  248: 0.5337,
  249: 0.5333,
  250: 0.5328,
  251: 0.5325,
  252: 0.532,
  253: 0.5316,
  254: 0.5312,
  255: 0.5308,
  256: 0.5304,
  257: 0.53,
  258: 0.5296,
  259: 0.5292,
  260: 0.5289,
  261: 0.5284,
  262: 0.5281,
  263: 0.5276,
  264: 0.5273,
  265: 0.5268,
  266: 0.5263,
  267: 0.5259,
  268: 0.5254,
  269: 0.5248,
  270: 0.5243,
  271: 0.5239,
  272: 0.5232,
  273: 0.5227,
  274: 0.522,
  275: 0.5214,
  276: 0.5208,
  277: 0.5203,
  278: 0.5197,
  279: 0.5192,
  280: 0.5186,
  281: 0.518,
  282: 0.5175,
  283: 0.5169,
  284: 0.5164,
  285: 0.5158,
  286: 0.5154,
  287: 0.5147,
  288: 0.5142,
  289: 0.5137,
  290: 0.5132,
  291: 0.5126,
  292: 0.5121,
  293: 0.5115,
  294: 0.5109,
  295: 0.5104,
  296: 0.5098,
  297: 0.5094,
  298: 0.5088,
  299: 0.5083,
  300: 0.5077,
  301: 0.5072,
  302: 0.5067,
  303: 0.5062,
  304: 0.5057,
  305: 0.5053,
  306: 0.5047,
  307: 0.5043,
  308: 0.5037,
  309: 0.5032,
  310: 0.5027,
  311: 0.5022,
  312: 0.5017,
  313: 0.5013,
  314: 0.5007,
  315: 0.5002,
  316: 0.4998,
  317: 0.4992,
  318: 0.4988,
  319: 0.4982,
  320: 0.4978,
  321: 0.4973,
  322: 0.4968,
  323: 0.4964,
  324: 0.4959,
  325: 0.4955,
  326: 0.495,
  327: 0.4946,
  328: 0.4941,
  329: 0.4937,
  330: 0.4932,
  331: 0.4928,
  332: 0.4924,
  333: 0.4919,
  334: 0.4913,
  335: 0.4909,
  336: 0.4905,
  337: 0.4901,
  338: 0.4896,
  339: 0.4891,
  340: 0.4887,
  341: 0.4883,
  342: 0.4878,
  343: 0.4874,
  344: 0.487,
  345: 0.4866,
  346: 0.4862,
  347: 0.4858,
  348: 0.4854,
  349: 0.485,
  350: 0.4845,
  351: 0.4841,
  352: 0.4837,
  353: 0.4833,
  354: 0.4829,
  355: 0.4825,
  356: 0.4821,
  357: 0.4817,
  358: 0.4813,
  359: 0.4809,
  360: 0.4805,
  361: 0.4801,
}

var womensmalone = {
  90: 1.1756,
  91: 1.1645,
  92: 1.1557,
  93: 1.145,
  94: 1.1365,
  95: 1.1261,
  96: 1.118,
  97: 1.1079,
  98: 1.098,
  99: 1.0903,
  100: 1.0807,
  101: 1.0732,
  102: 1.0657,
  103: 1.0566,
  104: 1.0494,
  105: 1.0405,
  106: 1.0336,
  107: 1.025,
  108: 1.0165,
  109: 1.0098,
  110: 1.0016,
  111: 0.9952,
  112: 0.9872,
  113: 0.9809,
  114: 0.9731,
  115: 0.967,
  116: 0.9595,
  117: 0.9536,
  118: 0.9462,
  119: 0.939,
  120: 0.9333,
  121: 0.9263,
  122: 0.9208,
  123: 0.911,
  124: 0.9086,
  125: 0.9019,
  126: 0.898,
  127: 0.8902,
  128: 0.8851,
  129: 0.8788,
  130: 0.8738,
  131: 0.8676,
  132: 0.8628,
  133: 0.8568,
  134: 0.8508,
  135: 0.8462,
  136: 0.841,
  137: 0.8358,
  138: 0.8302,
  139: 0.8257,
  140: 0.8202,
  141: 0.8159,
  142: 0.8105,
  143: 0.8052,
  144: 0.801,
  145: 0.7959,
  146: 0.7918,
  147: 0.7867,
  148: 0.7827,
  149: 0.7769,
  150: 0.7737,
  151: 0.7697,
  152: 0.7666,
  153: 0.7627,
  154: 0.7596,
  155: 0.7565,
  156: 0.752,
  157: 0.7487,
  158: 0.7453,
  159: 0.7431,
  160: 0.7387,
  161: 0.7358,
  162: 0.7322,
  163: 0.7293,
  164: 0.7258,
  165: 0.723,
  166: 0.7196,
  167: 0.7168,
  168: 0.7134,
  169: 0.7107,
  170: 0.7074,
  171: 0.704,
  172: 0.7014,
  173: 0.6981,
  174: 0.6956,
  175: 0.6923,
  176: 0.6898,
  177: 0.6866,
  178: 0.6838,
  179: 0.681,
  180: 0.6786,
  181: 0.6755,
  182: 0.6731,
  183: 0.6701,
  184: 0.6671,
  185: 0.6618,
  186: 0.6604,
  187: 0.6595,
  188: 0.6566,
  189: 0.6543,
  190: 0.6521,
  191: 0.6492,
  192: 0.6464,
  193: 0.6442,
  194: 0.6415,
  195: 0.6387,
  196: 0.6366,
  197: 0.6339,
  198: 0.6317,
  199: 0.63,
  200: 0.6286,
  201: 0.6269,
  202: 0.6256,
  203: 0.6239,
  204: 0.6226,
  205: 0.6209,
  206: 0.6196,
  207: 0.618,
  208: 0.6167,
  209: 0.6151,
  210: 0.6134,
  211: 0.6122,
  212: 0.6109,
  213: 0.6093,
  214: 0.6077,
  215: 0.6064,
  216: 0.6049,
  217: 0.6036,
  218: 0.6021,
  219: 0.6008,
  220: 0.5993,
  221: 0.5981,
  222: 0.5965,
  223: 0.5953,
  224: 0.5938,
  225: 0.5926,
  226: 0.5911,
  227: 0.5896,
  228: 0.5884,
  229: 0.5869,
  230: 0.5858,
  231: 0.5843,
  232: 0.5831,
  233: 0.5817,
  234: 0.5805,
  235: 0.5791,
  236: 0.5779,
  237: 0.5765,
  238: 0.5754,
  239: 0.574,
  240: 0.5725,
  241: 0.5714,
  242: 0.57,
  243: 0.5693,
  244: 0.5686,
  245: 0.5681,
  246: 0.5671,
  247: 0.5669,
  248: 0.5662,
  249: 0.5656,
}
