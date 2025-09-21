(function () {
    'use strict';

    var SECTION_SELECTOR = 'main > section';
    var BULLET_CONTAINER_CLASS = 'section-pagination';
    var BULLET_CLASS = 'section-bullet';
    var ACTIVE_CLASS = 'active';
    var OBSERVER_THRESHOLD = 0.6;

    function createContainer() {
        var container = document.createElement('nav');
        container.className = BULLET_CONTAINER_CLASS;
        container.setAttribute('aria-label', 'Section pagination');
        return container;
    }

    function getSections() {
        var sections = Array.prototype.slice.call(document.querySelectorAll(SECTION_SELECTOR));
        // Optional: allow opt-out via data attribute
        return sections.filter(function (s) { return !s.hasAttribute('data-pagination-exclude'); });
    }

    function scrollToSection(section) {
        if (!section) return;
        try {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (_) {
            // Fallback
            var top = section.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    }

    function isInteractiveElement(el) {
        if (!el) return false;
        var tag = el.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') return true;
        if (el.isContentEditable) return true;
        return !!el.closest('a, button, [role="button"], [contenteditable="true"]');
    }

    function buildBullets(container, sections) {
        sections.forEach(function (section, index) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = BULLET_CLASS;
            btn.setAttribute('aria-label', 'Pergi ke seksyen ' + (index + 1));
            btn.setAttribute('data-index', String(index));
            btn.addEventListener('click', function () { scrollToSection(section); });
            container.appendChild(btn);
        });
    }

    function updateActive(container, activeIndex) {
        var bullets = container.querySelectorAll('.' + BULLET_CLASS);
        bullets.forEach(function (b, idx) {
            if (idx === activeIndex) {
                b.classList.add(ACTIVE_CLASS);
                b.setAttribute('aria-current', 'true');
            } else {
                b.classList.remove(ACTIVE_CLASS);
                b.removeAttribute('aria-current');
            }
        });
    }

    function getCurrentIndexByGeometry(sections) {
        var viewportMid = window.innerHeight * 0.5;
        var nearestIdx = 0;
        var nearestDist = Infinity;
        for (var i = 0; i < sections.length; i++) {
            var rect = sections[i].getBoundingClientRect();
            var mid = rect.top + rect.height * 0.3; // bias towards top
            var dist = Math.abs(mid - viewportMid);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestIdx = i;
            }
        }
        return nearestIdx;
    }

    function initKeyboardNav(sections, container) {
        var isScrolling = false;
        var allowKeys = ['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp', 'Home', 'End'];

        function onKey(e) {
            if (isInteractiveElement(document.activeElement)) return;
            if (allowKeys.indexOf(e.key) === -1) return;

            var currentIndex = getCurrentIndexByGeometry(sections);
            var targetIndex = currentIndex;

            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                targetIndex = Math.min(sections.length - 1, currentIndex + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                targetIndex = Math.max(0, currentIndex - 1);
            } else if (e.key === 'Home') {
                targetIndex = 0;
            } else if (e.key === 'End') {
                targetIndex = sections.length - 1;
            }

            if (targetIndex !== currentIndex && !isScrolling) {
                e.preventDefault();
                isScrolling = true;
                scrollToSection(sections[targetIndex]);
                // Unlock after scroll settles
                setTimeout(function () { isScrolling = false; }, 500);
            }
        }

        document.addEventListener('keydown', onKey);
    }

    function initObserver(sections, container) {
        if (!('IntersectionObserver' in window)) {
            // Fallback: update on scroll
            var onScroll = function () {
                var idx = getCurrentIndexByGeometry(sections);
                updateActive(container, idx);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
            return;
        }

        var visibleMap = new Map();
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visibleMap.set(entry.target, entry.isIntersecting && entry.intersectionRatio >= OBSERVER_THRESHOLD);
            });
            // Choose first visible, else nearest by geometry
            var activeIdx = -1;
            for (var i = 0; i < sections.length; i++) {
                if (visibleMap.get(sections[i])) { activeIdx = i; break; }
            }
            if (activeIdx === -1) {
                activeIdx = getCurrentIndexByGeometry(sections);
            }
            updateActive(container, activeIdx);
        }, { threshold: OBSERVER_THRESHOLD, rootMargin: '0px 0px -10%' });

        sections.forEach(function (s) { observer.observe(s); });
    }

    function mount() {
        // Hide on very small screens; CSS will also handle display none
        if (window.innerWidth < 768) return;

        var sections = getSections();
        if (!sections.length) return;

        var container = createContainer();
        buildBullets(container, sections);
        document.body.appendChild(container);

        initObserver(sections, container);
        initKeyboardNav(sections, container);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }

    window.addEventListener('resize', function () {
        // Simple approach: rebuild on breakpoint changes
        var existing = document.querySelector('.' + BULLET_CONTAINER_CLASS);
        if (existing) existing.remove();
        mount();
    });
})();


