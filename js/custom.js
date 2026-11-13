function initializeSite() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateYear() {
        document.querySelectorAll('[data-current-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }
    updateYear();
    window.addEventListener('pageshow', updateYear);
    document.addEventListener('visibilitychange', updateYear);
    window.setInterval(updateYear, 60000);

    document.querySelectorAll('[data-placeholder]').forEach(function (link) {
        link.title = 'Portfolio demo — Telegram is not connected';
        link.addEventListener('click', function (event) { event.preventDefault(); });
    });
    document.querySelectorAll('.left-block_1 > *').forEach(function (el, index) {
        el.style.setProperty('--reveal-delay', Math.min(index, 4) * 75 + 'ms');
        el.classList.add('hero-enter');
    });
    const revealItems = document.querySelectorAll('.benefits, .bg_right_section_3, .banner_4, .section_5 .h2, body:not(.article-page) .news, .left-block_7, .right-block_7, .article-cover');
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08 });
        revealItems.forEach(function (el) {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
    }

    const modal = document.querySelector('.box_2');
    const overlay = document.querySelector('.bg_form');
    if (modal && overlay) {
        let returnFocus;
        let closeTimer;
        let originalPaddingRight;
        function openModal(trigger) {
            clearTimeout(closeTimer);
            if (!document.body.classList.contains('modal-open') && !CSS.supports('scrollbar-gutter: stable')) {
                originalPaddingRight = document.body.style.paddingRight;
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.paddingRight = parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth + 'px';
            }
            returnFocus = trigger;
            overlay.classList.add('modal-mounted');
            modal.classList.add('modal-mounted');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            // Commit the initial position before starting the entrance transition.
            void modal.offsetWidth;
            overlay.classList.add('is-open');
            modal.classList.add('is-open');
            modal.focus({ preventScroll: true });
        }
        function closeModal() {
            overlay.classList.remove('is-open');
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (originalPaddingRight !== undefined) {
                document.body.style.paddingRight = originalPaddingRight;
                originalPaddingRight = undefined;
            }
            if (returnFocus) returnFocus.focus({ preventScroll: true });
            closeTimer = setTimeout(function () {
                overlay.classList.remove('modal-mounted');
                modal.classList.remove('modal-mounted');
            }, reducedMotion.matches ? 0 : 350);
        }
        document.addEventListener('click', function (event) {
            const trigger = event.target.closest('[data-modal-open]');
            const close = event.target.closest('[data-modal-close]');
            if (!trigger && !close) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            if (trigger) openModal(trigger);
            else closeModal();
        }, true);
        document.addEventListener('keydown', function (event) {
            if (modal.getAttribute('aria-hidden') !== 'false') return;
            if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
            if (event.key !== 'Tab') return;
            const items = [...modal.querySelectorAll('button, input, a[href], [tabindex="0"]')].filter(function (el) { return !el.disabled; });
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modal)) {
                event.preventDefault(); first.focus();
            }
        });
    }
    document.querySelectorAll('[data-demo-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            const status = form.querySelector('[role="status"]');
            status.textContent = 'Thank you!';
            status.hidden = false;
            form.reset();
        });
    });

    document.querySelectorAll('.drop-down-2').forEach(function (item, index) {
        const toggle = item.querySelector('.drop-2');
        const panel = item.querySelector('.open-drop');
        item.classList.add('faq-enhanced');
        const inner = document.createElement('div');
        inner.className = 'faq-panel-inner';
        while (panel.firstChild) inner.appendChild(panel.firstChild);
        panel.appendChild(inner);
        toggle.id = 'faq-question-' + index;
        panel.id = 'faq-answer-' + index;
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-controls', panel.id);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.removeAttribute('aria-haspopup');
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', toggle.id);
        panel.setAttribute('aria-hidden', 'true');
        panel.inert = true;
        function toggleAnswer(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            const open = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(open));
            panel.setAttribute('aria-hidden', String(!open));
            panel.inert = !open;
            item.classList.toggle('faq-open', open);
        }
        toggle.addEventListener('click', toggleAnswer, true);
        toggle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') toggleAnswer(event);
        }, true);
    });

    document.querySelectorAll('.w-slider').forEach(function (slider) {
        const slides = slider.querySelectorAll('.w-slide');
        function fitReviews() {
            const cards = slider.querySelectorAll('.left-block_5, .right_block_5');
            cards.forEach(function (card) { card.style.minHeight = ''; });
            const height = Math.max(...[...cards].map(function (card) { return card.offsetHeight; }));
            cards.forEach(function (card) { card.style.minHeight = height + 'px'; });
            slides.forEach(function (slide) { slide.style.height = height + 'px'; });
            slider.querySelector('.w-slider-mask').style.height = height + 'px';
        }
        window.addEventListener('resize', fitReviews);
        slider.querySelectorAll('img').forEach(function (img) { img.addEventListener('load', fitReviews); });
        if (document.fonts) document.fonts.ready.then(fitReviews);
        fitReviews();
    });
}

// Run after Webflow has attached its navigation/slider handlers.
if (window.Webflow) {
    window.Webflow.push(initializeSite);
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSite);
} else {
    initializeSite();
}
