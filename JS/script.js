// Premier Football Academy - WEDE5020 Part 3 JavaScript
document.addEventListener("DOMContentLoaded", function () {

    // 1. DOM manipulation: keep the footer year current
    var year = document.getElementById("year");
    if (year) { year.textContent = new Date().getFullYear(); }

    // 2. Mobile navigation toggle
    var toggle = document.querySelector(".nav-toggle");
    var navList = document.getElementById("nav-list");
    if (toggle && navList) {
        toggle.addEventListener("click", function () {
            var open = navList.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open);
        });
    }

    // 3. Scroll-reveal animation (skipped if the user prefers reduced motion)
    var reveals = document.querySelectorAll(".highlight-card, .service-card, .contact-card, .gallery-item, .acc-item");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduce) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
            });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
    }

    // 4. FAQ accordion (Services page)
    document.querySelectorAll(".acc-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var panel = document.getElementById(btn.getAttribute("aria-controls"));
            var open = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", !open);
            panel.hidden = open;
        });
    });

    // 5. Gallery with lightbox (About page)
    var items = document.querySelectorAll(".gallery-item");
    if (items.length) {
        var box = document.createElement("div");
        box.className = "lightbox";
        box.hidden = true;
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-modal", "true");
        box.setAttribute("aria-label", "Image viewer");
        box.innerHTML = '<button type="button" class="lb-close" aria-label="Close image">&times;</button><img alt="">';
        document.body.appendChild(box);
        var lbImg = box.querySelector("img");
        var lastFocus = null;
        var closeBox = function () { box.hidden = true; if (lastFocus) { lastFocus.focus(); } };
        items.forEach(function (it) {
            it.addEventListener("click", function () {
                lastFocus = it;
                lbImg.src = it.dataset.full;
                lbImg.alt = it.dataset.alt;
                box.hidden = false;
                box.querySelector(".lb-close").focus();
            });
        });
        box.addEventListener("click", function (e) { if (e.target !== lbImg) { closeBox(); } });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) { closeBox(); } });
    }

    // 6. Interactive map with Leaflet (Contact page)
    var mapEl = document.getElementById("map");
    if (mapEl && window.L) {
        var pos = [-33.9608, 25.6022];
        var map = L.map("map").setView(pos, 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);
        L.marker(pos).addTo(map).bindPopup("<strong>Premier Football Academy</strong><br>Gqeberha, South Africa").openPopup();
    }

    // 7. Shared helpers
    var RECIPIENT = "info@premierfootballacademy.example"; // recipient of the compiled contact email
    var programmes = window.PROGRAMMES || [];
    var money = function (n) { return "R" + Math.round(n).toLocaleString("en-ZA"); };
    var niceDate = function (d) { return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }); };
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var isoDate = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
    var el = function (tag, text, cls) {
        var e = document.createElement(tag);
        if (text !== undefined) { e.textContent = text; } // textContent (not innerHTML) keeps user input safe
        if (cls) { e.className = cls; }
        return e;
    };
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };
    var phoneOk = function (v) { v = v.replace(/[\s-]/g, ""); return v === "" || /^(0\d{9}|\+27\d{9})$/.test(v); };
    var val = function (id) { return document.getElementById(id).value.trim(); };

    // Character counters for any textarea with a maxlength
    document.querySelectorAll("textarea[maxlength]").forEach(function (ta) {
        var c = document.getElementById(ta.id + "-count");
        if (c) { ta.addEventListener("input", function () { c.textContent = ta.value.length + " / " + ta.maxLength; }); }
    });

    // Validation factory: shows an error under each field, returns validateAll()
    function setupValidation(rules) {
        var check = function (id) {
            var field = document.getElementById(id);
            var text = rules[id](field.value);
            document.getElementById(id + "-error").textContent = text;
            field.setAttribute("aria-invalid", text ? "true" : "false");
            field.classList.toggle("invalid", !!text);
            return !text;
        };
        Object.keys(rules).forEach(function (id) {
            var f = document.getElementById(id);
            f.addEventListener("blur", function () { check(id); });
            f.addEventListener("input", function () { if (f.classList.contains("invalid")) { check(id); } });
            f.addEventListener("change", function () { if (f.classList.contains("invalid")) { check(id); } });
        });
        return function () {
            var first = null;
            Object.keys(rules).forEach(function (id) { if (!check(id) && !first) { first = id; } });
            if (first) { document.getElementById(first).focus(); }
            return !first;
        };
    }

    // AJAX submission: posts JSON to the form's action URL without reloading the page
    function sendAjax(form, data) {
        return fetch(form.action, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
            .then(function (r) { if (!r.ok) { throw new Error("Server responded " + r.status); } return r.json(); });
    }

    // 8. Services page: dynamic content with search, filter and sort
    var grid = document.getElementById("services-grid");
    if (grid && programmes.length) {
        var search = document.getElementById("svc-search");
        var level = document.getElementById("svc-level");
        var sort = document.getElementById("svc-sort");
        var count = document.getElementById("svc-count");
        var render = function () {
            var term = search.value.trim().toLowerCase();
            var list = programmes.filter(function (p) {
                return (level.value === "all" || p.level === level.value) &&
                    (p.name + " " + p.description + " " + p.level).toLowerCase().indexOf(term) !== -1;
            });
            list.sort(function (a, b) {
                if (sort.value === "price-asc") { return a.price - b.price; }
                if (sort.value === "price-desc") { return b.price - a.price; }
                return a.name.localeCompare(b.name);
            });
            grid.textContent = "";
            list.forEach(function (p) {
                var card = el("article", undefined, "service-card");
                card.appendChild(el("h3", p.name));
                card.appendChild(el("p", p.description));
                var ul = el("ul", undefined, "details");
                ul.appendChild(el("li", "Level: " + p.level));
                ul.appendChild(el("li", "Ages: " + p.ages));
                ul.appendChild(el("li", "Monthly fee: " + money(p.price)));
                ul.appendChild(el("li", "Places left: " + p.spots));
                card.appendChild(ul);
                var link = el("a", "Enquire about this programme", "btn");
                link.href = "enquiry.html?programme=" + encodeURIComponent(p.id);
                card.appendChild(link);
                grid.appendChild(card);
            });
            count.textContent = list.length ? list.length + " programme" + (list.length === 1 ? "" : "s") + " found" : "No programmes match your search. Try different words or reset the filters.";
        };
        [search, level, sort].forEach(function (c) { c.addEventListener("input", render); c.addEventListener("change", render); });
        render();
    }

    // 9. Enquiry form: validation, AJAX submit and a response with cost and availability
    var form = document.getElementById("enquiry-form");
    if (form) {
        var start = document.getElementById("startdate");
        var today = new Date(); today.setHours(0, 0, 0, 0);
        start.min = isoDate(new Date(today.getTime() + 86400000));
        var prog = document.getElementById("programme");
        var find = function (id) { return programmes.filter(function (p) { return p.id === id; })[0]; };
        var showInfo = function () {
            var p = find(prog.value);
            document.getElementById("programme-info").textContent = p ? p.description + " (" + money(p.price) + " per player per month)" : "";
        };
        prog.addEventListener("change", showInfo);
        var wanted = new URLSearchParams(window.location.search).get("programme");
        if (wanted && find(wanted)) { prog.value = wanted; showInfo(); }

        var validateAll = setupValidation({
            name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters)."; },
            email: function (v) { return emailOk(v) ? "" : "Please enter a valid email address, e.g. name@example.com."; },
            phone: function (v) { return phoneOk(v) ? "" : "Enter a valid South African number, e.g. 0821234567 or +27821234567."; },
            programme: function (v) { return v ? "" : "Please choose a programme."; },
            players: function (v) { var n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 6 ? "" : "Enter a whole number of players from 1 to 6."; },
            startdate: function (v) {
                if (!v) { return "Please choose a preferred start date."; }
                var d = new Date(v + "T00:00:00");
                if (d <= today) { return "Please choose a date after today."; }
                if (d > new Date(today.getTime() + 365 * 86400000)) { return "Please choose a date within the next 12 months."; }
                return "";
            },
            message: function (v) { return v.trim().length >= 10 ? "" : "Please write a message of at least 10 characters."; }
        });

        var quote = document.getElementById("quote");
        var showQuote = function (d) {
            var p = find(d.programme), n = Number(d.players);
            var discount = n >= 2 ? 0.1 : 0;
            var total = p.price * n * (1 - discount);
            quote.textContent = "";
            quote.appendChild(el("h2", "Thank you, " + d.name));
            quote.appendChild(el("p", "Here is the information for " + p.name + ":"));
            var ul = el("ul", undefined, "details");
            ul.appendChild(el("li", "Fee: " + money(p.price) + " per player per month"));
            ul.appendChild(el("li", "Estimated monthly total for " + n + " player" + (n === 1 ? "" : "s") + ": " + money(total) + (discount ? " (includes a 10% multiple-player discount)" : "")));
            ul.appendChild(el("li", n <= p.spots ? "Availability: " + p.spots + " places left, enough for your group." : "Availability: only " + p.spots + " places left. The remaining players can join the waiting list."));
            ul.appendChild(el("li", "Next intake: " + niceDate(p.intake)));
            ul.appendChild(el("li", d.startdate >= p.intake ? "Your preferred start date (" + niceDate(d.startdate) + ") fits this intake." : "Your preferred start date is before the next intake, so the earliest start is " + niceDate(p.intake) + "."));
            quote.appendChild(ul);
            quote.appendChild(el("p", "A coach will confirm these details by email to " + d.email + "."));
            quote.hidden = false;
            quote.scrollIntoView({ behavior: "smooth" });
            quote.focus();
        };

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var err = document.getElementById("form-error");
            err.textContent = "";
            if (!validateAll()) { quote.hidden = true; return; }
            if (val("website")) { return; } // honeypot: bots fill this hidden field
            var data = { name: val("name"), email: val("email"), phone: val("phone"), programme: prog.value, players: val("players"), startdate: start.value, message: val("message") };
            var btn = form.querySelector("button[type=submit]");
            btn.disabled = true; btn.textContent = "Sending...";
            sendAjax(form, data).then(function () {
                showQuote(data);
                form.reset();
                document.getElementById("message-count").textContent = "0 / 500";
                document.getElementById("programme-info").textContent = "";
            }).catch(function () {
                err.textContent = "Sorry, we could not send your enquiry. Please check your connection and try again.";
            }).then(function () { btn.disabled = false; btn.textContent = "Submit Enquiry"; });
        });
    }

    // 10. Contact form: validation, AJAX submit and a compiled email
    var cform = document.getElementById("contact-form");
    if (cform) {
        var cValidate = setupValidation({
            "c-name": function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters)."; },
            "c-email": function (v) { return emailOk(v) ? "" : "Please enter a valid email address, e.g. name@example.com."; },
            "c-phone": function (v) { return phoneOk(v) ? "" : "Enter a valid South African number, e.g. 0821234567 or +27821234567."; },
            "c-type": function (v) { return v ? "" : "Please choose the type of message."; },
            "c-subject": function (v) { return v.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters)."; },
            "c-message": function (v) { return v.trim().length >= 20 ? "" : "Please write at least 20 characters so we can help you properly."; }
        });
        var preview = document.getElementById("email-preview");
        cform.addEventListener("submit", function (e) {
            e.preventDefault();
            var err = document.getElementById("c-form-error");
            err.textContent = "";
            if (!cValidate()) { preview.hidden = true; return; }
            if (val("c-website")) { return; }
            var data = { name: val("c-name"), email: val("c-email"), phone: val("c-phone"), type: val("c-type"), subject: val("c-subject"), message: val("c-message") };
            var btn = cform.querySelector("button[type=submit]");
            btn.disabled = true; btn.textContent = "Sending...";
            sendAjax(cform, data).then(function () {
                var subject = "[" + data.type + "] " + data.subject;
                var body = "Name: " + data.name + "\nEmail: " + data.email + "\nPhone: " + (data.phone || "Not provided") + "\nMessage type: " + data.type + "\n\n" + data.message;
                document.getElementById("email-to").textContent = RECIPIENT;
                document.getElementById("email-subject").textContent = subject;
                document.getElementById("email-body").textContent = body;
                document.getElementById("email-send").href = "mailto:" + RECIPIENT + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
                preview.hidden = false;
                preview.scrollIntoView({ behavior: "smooth" });
                preview.focus();
                cform.reset();
                document.getElementById("c-message-count").textContent = "0 / 1000";
            }).catch(function () {
                err.textContent = "Sorry, we could not send your message. Please check your connection and try again.";
            }).then(function () { btn.disabled = false; btn.textContent = "Send Message"; });
        });
    }
});
