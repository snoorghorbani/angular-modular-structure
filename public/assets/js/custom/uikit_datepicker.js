/*! UIkit 2.24.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
// removed moment_js from core
// customized by tzd

(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-datepicker", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }

})(function (UI) {

    "use strict";

    // Datepicker

    var active = false, dropdown;

    UI.component('datepicker', {

        defaults: {
            mobile: false,
            weekstart: 0,
            i18n: {
                months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                weekdays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
            },
            format: "jYYYY.jMM.jDD",
            offsettop: 5,
            maxDate: false,
            minDate: false,
            pos: 'auto',
            addClass: '',
            template: function (data, opts) {

                var content = '', i;

                content += '<div class="uk-datepicker-nav uk-clearfix">';
                content += '<a href="" class="uk-datepicker-previous"></a>';
                content += '<a href="" class="uk-datepicker-next"></a>';

                if (UI.formSelect) {

                    //var currentyear = (new Date()).getFullYear(), options = [], months, years, minYear, maxYear;
                    var currentyear = _date.now.to.persian()[0], options = [], months, years, minYear, maxYear;

                    for (i = 0; i < opts.i18n.months.length; i++) {
                        if (i == data.month) {
                            options.push('<option value="' + i + '" selected>' + opts.i18n.months[i] + '</option>');
                        } else {
                            options.push('<option value="' + i + '">' + opts.i18n.months[i] + '</option>');
                        }
                    }

                    months = '<span class="uk-form-select">' + opts.i18n.months[data.month] + '<select class="update-picker-month">' + options.join('') + '</select></span>';

                    // --

                    options = [];
                    debugger
                    minYear = data.minDate ? data.minDate.year() : currentyear - 1;
                    maxYear = data.maxDate ? data.maxDate.year() : currentyear + 2;

                    for (i = minYear; i <= maxYear; i++) {
                        if (i == data.year) {
                            options.push('<option value="' + i + '" selected>' + i + '</option>');
                        } else {
                            options.push('<option value="' + i + '">' + i + '</option>');
                        }
                    }

                    years = '<span class="uk-form-select">' + data.year + '<select class="update-picker-year">' + options.join('') + '</select></span>';

                    content += '<div class="uk-datepicker-heading">' + months + ' ' + years + '</div>';

                } else {
                    content += '<div class="uk-datepicker-heading">' + opts.i18n.months[data.month] + ' ' + data.year + '</div>';
                }

                content += '</div>';

                content += '<table class="uk-datepicker-table">';
                content += '<thead>';
                for (i = 0; i < data.weekdays.length; i++) {
                    if (data.weekdays[i]) {
                        content += '<th>' + data.weekdays[i] + '</th>';
                    }
                }
                content += '</thead>';

                content += '<tbody>';
                for (i = 0; i < data.days.length; i++) {
                    if (data.days[i] && data.days[i].length) {
                        content += '<tr>';
                        for (var d = 0; d < data.days[i].length; d++) {
                            if (data.days[i][d]) {
                                var day = data.days[i][d],
                                    cls = [];

                                if (!day.inmonth) cls.push("uk-datepicker-table-muted");
                                if (day.selected) cls.push("uk-active");
                                if (day.disabled) cls.push('uk-datepicker-date-disabled uk-datepicker-table-muted');

                                content += '<td><a href="" class="' + cls.join(" ") + '" data-date="' + day.day.format('jYYYY.jMM.jDD') + '">' + day.day.format("jD") + '</a></td>';
                            }
                        }
                        content += '</tr>';
                    }
                }
                content += '</tbody>';

                content += '</table>';

                return content;
            }
        },

        boot: function () {

            UI.$win.on("resize orientationchange", function () {

                if (active) {
                    active.hide();
                }
            });

            // init code
            UI.$html.on("focus.datepicker.uikit", "[data-uk-datepicker]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("datepicker")) {
                    e.preventDefault();
                    UI.datepicker(ele, UI.Utils.options(ele.attr("data-uk-datepicker")));
                    ele.trigger("focus");
                }
            });

            UI.$html.on("click focus", '*', function (e) {

                var target = UI.$(e.target);

                if (active && target[0] != dropdown[0] && !target.data("datepicker") && !target.parents(".uk-datepicker:first").length) {
                    active.hide();
                }
            });
        },

        init: function () {

            // use native datepicker on touch devices
            if (UI.support.touch && this.element.attr('type') == 'date' && !this.options.mobile) {
                return;
            }

            var $this = this;

            this.current = this.element.val() ? moment(this.element.val(), this.options.format) : moment();

            this.on("click focus", function () {
                if (active !== $this) $this.pick(this.value ? this.value : ($this.options.minDate ? $this.options.minDate : ''));
            }).on("change", function () {
                if ($this.element.val() && !moment($this.element.val(), $this.options.format).isValid()) {
                    $this.element.val(moment().format($this.options.format));
                }
            });

            // init dropdown
            if (!dropdown) {

                dropdown = UI.$('<div class="uk-dropdown uk-datepicker ' + $this.options.addClass + '"></div>');

                dropdown.on("click", ".uk-datepicker-next, .uk-datepicker-previous, [data-date]", function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    var ele = UI.$(this);

                    if (ele.hasClass('uk-datepicker-date-disabled')) return false;

                    if (ele.is('[data-date]')) {
                        var jdate = ele.data("date").split('.');
                        jdate[1] = parseInt(jdate[1]) - 1;;
                        var gdate = _date.persian.to.georgian(parseInt(jdate[0]), parseInt(jdate[1]), parseInt(jdate[2]));

                        //active.current = moment(ele.data("date"));
                        active.current = moment(new Date(gdate.gy, gdate.gm, gdate.gd));
                        active.element.val(active.current.format(active.options.format)).trigger("change");
                        dropdown.removeClass('uk-dropdown-shown');
                        setTimeout(function () {
                            dropdown.removeClass('uk-dropdown-active')
                        }, 280);
                        active.hide();
                    } else {
                        active.add((ele.hasClass("uk-datepicker-next") ? 1 : -1), "months");
                    }
                });

                dropdown.on('change', '.update-picker-month, .update-picker-year', function () {

                    var select = UI.$(this);
                    active[select.is('.update-picker-year') ? 'setYear' : 'setMonth'](Number(select.val()));
                });

                dropdown.appendTo("body");
            }
        },

        pick: function (initdate) {

            var offset = this.element.offset(),
                offset_left = parseInt(offset.left),
                offset_top = parseInt(offset.top),
                css = {
                    'left': offset_left,
                    'right': ""
                };


            this.current = isNaN(initdate) ? moment(initdate, this.options.format) : moment();
            this.initdate = this.current.format(this.options.format);

            this.update();

            if (UI.langdirection == 'right' || (window.innerWidth - offset_left - dropdown.outerWidth() < 0)) {
                css.right = (window.innerWidth - (window.innerWidth - $('body').width())) - (css.left + this.element.outerWidth());
                css.left = "";
            }

            var posTop = (offset_top - this.element.outerHeight() + this.element.height()) - this.options.offsettop - dropdown.outerHeight(),
                posBottom = offset_top + this.element.outerHeight() + this.options.offsettop;

            css.top = posBottom;

            if (this.options.pos == 'top') {
                css.top = posTop;
                dropdown.addClass('dp-top');
            } else if (this.options.pos == 'auto' && (window.innerHeight - posBottom - dropdown.outerHeight() + UI.$win.scrollTop() < 0 && posTop >= 0)) {
                css.top = posTop;
                dropdown.addClass('dp-top');
            }

            css.minWidth = dropdown.actual('outerWidth');

            dropdown.css(css).addClass('uk-dropdown-active uk-dropdown-shown');

            this.trigger('show.uk.datepicker');

            active = this;
        },

        add: function (unit, value) {
            this.current.add(unit, value);
            this.update();
        },

        setMonth: function (month) {
            var georgian = _date.persian.to.georgian(this.current.jYear(), month, this.current.jDate());
            var gD = new Date(georgian.gy, georgian.gm, georgian.gd);

            this.current.month(georgian.gm);
            this.update();
        },

        setYear: function (year) {
            var gYear = _date.georgian.to.persian(year, this.current.jMonth(), this.current.jDate())[0];
            this.current.year(gYear);
            this.update();
        },

        update: function () {
            debugger
            var jalaliDate = _date.georgian.to.persian(this.current.year(), this.current.month(), this.current.date());
            var data = this.getRows(this.current.year(), this.current.month(), jalaliDate[0], jalaliDate[1]),
            //var data = this.getRows(this.current.year(), this.current.month(), this.current.jYear(), 1),
                tpl = this.options.template(data, this.options);

            dropdown.html(tpl);

            this.trigger('update.uk.datepicker');
        },
        jDay: function (day) {
            var georgian = _date.persian.to.georgian(1395, 1, 1);
            var gD = new Date(georgian[0], georgian[1]- 1, georgian[2]);
            var firstDay = gD.getDay() + 1;
            if (firstDay > 7) firstDay -= 7;

            var firstDay = 1;

            var dif = (day % 7) - 1;
            var weakDay = (firstDay + dif) % 7;
            weakDay = (weakDay == 6) ? 0 : weakDay;
            return weakDay;
        },
        getYearStartDayNumber: function (yearNumber) {
            debugger;
            yearNumber = parseInt(yearNumber);
            var res;
            var criterion = 1300;
            var yearsDif = yearNumber - criterion;
            var years = {
                1300: 3
            }
            if (years[yearNumber]) return years[yearNumber];

            var leapYears = 0;
            for (var i = 0; i < yearsDif; i++)
                if (_is.persianLeapYear(criterion + i))
                    leapYears++;

            var gap = ((yearsDif * 365) + leapYears) % 7;

            return years[yearNumber] = (gap + years[1300]) % 7;
        },
        jBefore: function (jdays, year, month) {
            //var previousMonth = month - 1;
            var previousMonth = month;

            var georgian = _date.persian.to.georgian(1395, 1, 1);
            var gD = new Date(georgian.gy, georgian.gm - 1, georgian.gd);
            var firstDay = gD.getDay() + 1;
            if (firstDay > 7) firstDay -= 7;

            var firstDay = this.getYearStartDayNumber(year);
            var dayNo = 0;
            for (var i = 0; i < previousMonth; i++) {
                dayNo += jdays[i];
            }
            dayNo += 1;

            var dif = (dayNo % 7) - 1;
            //dif = Math.abs(dif);
            dif = (dif) ? dif + 7 : dif;
            var weakDay = (firstDay + dif) % 7;
            //weakDay = (weakDay == 6) ? 0 : weakDay;
            weakDay = (weakDay == 0) ? 6 : weakDay - 1
            return weakDay;
        },
        nDaysLater: function (day, i) {
            //i = i || 1;
            var res = new Date(day);
            return res.setDate(res.getDate() + i);
        },
        getRows: function (year, month, jyear, jmonth) {
            var usualMonthNo = jmonth + 1;
            var jmoment = moment().local();
            var monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, (_is.persianLeapYear(jyear)) ? 30 : 29];
            var opts = this.options,
                now = moment().format('YYYY-MM-DD'),
                jnow = _date.now.to.persian().join('-'),
                days = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month],
                jdays = monthDays[jmonth],
                before = new Date(year, month, 1, 12).getDay(),
                jbefore = this.jBefore(monthDays, jyear, jmonth),
                data = { "month": month, "year": year, "weekdays": [], "days": [], "maxDate": false, "minDate": false },
                jdata = { "month": jmonth, "year": jyear, "weekdays": [], "days": [], "maxDate": false, "minDate": false },
                row = [];
            if (opts.maxDate !== false) {
                data.maxDate = isNaN(opts.maxDate) ? moment(opts.maxDate, opts.format) : moment().add(opts.maxDate, 'days');
            }

            if (opts.minDate !== false) {
                data.minDate = isNaN(opts.minDate) ? moment(opts.minDate, opts.format) : moment().add(opts.minDate - 1, 'days');
            }

            data.weekdays = (function () {

                for (var i = 0, arr = []; i < 7; i++) {

                    var day = i + (opts.weekstart || 0);

                    while (day >= 7) {
                        day -= 7;
                    }

                    arr.push(opts.i18n.weekdays[day]);
                }

                return arr;
            })();
            jdata.weekdays = (function () {

                for (var i = 0, arr = []; i < 7; i++) {

                    var day = i + (opts.weekstart || 0);

                    while (day >= 7) {
                        day -= 7;
                    }

                    arr.push(opts.i18n.weekdays[day]);
                }

                return arr;
            })();
            if (opts.weekstart && opts.weekstart > 0) {
                before -= opts.weekstart;
                jbefore -= opts.weekstart;
                if (before < 0) {
                    before += 7;
                }
                if (jbefore < 0) {
                    jbefore += 7;
                }
            }

            var cells = days + before, after = cells;
            var jcells = jdays + jbefore, jafter = jcells;

            while (after > 7) { after -= 7; }
            while (jafter > 7) { jafter -= 7; }

            cells += 7 - after;
            jcells += 7 - jafter;
            var day, isDisabled, isSelected, isToday, isInMonth;
            for (var i = 0, r = 0; i < cells; i++) {

                day = new Date(year, month, 1 + (i - before), 12);
                isDisabled = (data.minDate && data.minDate > day) || (data.maxDate && day > data.maxDate);
                isInMonth = !(i < before || i >= (days + before));

                day = moment(day);

                isSelected = this.initdate == day.format("YYYY-MM-DD");
                isToday = now == day.format("YYYY-MM-DD");

                row.push({ "selected": isSelected, "today": isToday, "disabled": isDisabled, "day": day, "inmonth": isInMonth });

                if (++r === 7) {
                    data.days.push(row);
                    row = [];
                    r = 0;
                }
            }


            var dayNo = 0;
            for (var i = 0; i < jmonth; i++) {
                dayNo += monthDays[i];
            }
            debugger
            var georgian = _date.persian.to.georgian(jyear, 0, 1);
            var calenderStartDay = new Date(georgian.gy, georgian.gm, georgian.gd);
            calenderStartDay.setDate(calenderStartDay.getDate() + dayNo - jbefore);
            for (var i = 0, r = 0; i < jcells; i++) {
                //var georgian = _date.persian.to.georgian(jyear, usualMonthNo, 1 + (i - jbefore));
                //var day = new Date(georgian.gy, georgian.gm - 1, georgian.gd);
                day = this.nDaysLater(calenderStartDay, i);
                //day = new Date(year, month, 1 + (i - jbefore), 12);
                isDisabled = (jdata.minDate && jdata.minDate > day) || (jdata.maxDate && day > jdata.maxDate);
                isInMonth = !(i < jbefore || i >= (jdays + jbefore));

                day = moment(day);

                isSelected = this.initdate == day.format("jYYYY.jMM.jDD");
                isToday = now == day.format("jYYYY.jMM.jDD");

                row.push({ "selected": isSelected, "today": isToday, "disabled": isDisabled, "day": day, "inmonth": isInMonth });

                if (++r === 7) {
                    jdata.days.push(row);
                    row = [];
                    r = 0;
                }
            }
            return jdata;
        },

        hide: function () {

            if (active && active === this) {
                dropdown.removeClass('uk-dropdown-shown');
                setTimeout(function () {
                    dropdown.removeClass('uk-dropdown-active dp-top')
                }, 280);
                active = false;
                this.trigger('hide.uk.datepicker');
            }
        }
    });

    UI.Utils.moment = moment();

    return UI.datepicker;
});