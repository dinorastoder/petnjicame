document.addEventListener('DOMContentLoaded', () => {
    const datasets = {
        residents: {
            label: 'Stalni stanovnici',
            unit: 'stanovnika',
            source: 'Monstat - Popis stanovništva 2011. i preliminarni rezultati Popisa 2023.',
            data: [
                { year: 2011, value: 5482 },
                { year: 2023, value: 5552 }
            ]
        },
        enumerated: {
            label: 'Ukupno popisane osobe',
            unit: 'lica',
            source: 'Monstat - Popis stanovništva 2011. i preliminarni rezultati Popisa 2023.',
            data: [
                { year: 2011, value: 5482 },
                { year: 2023, value: 8279 }
            ]
        }
    };

    const scenarios = {
        youth: {
            title: 'Mentorstvo i stipendije za mlade',
            body: 'Više od 180 srednjoškolaca iz Petnjice i dijaspore povezuje se kroz zajedničke radionice. Program stipendiranja i ljetnje prakse mogao bi da zadrži dodatnih 25 učenika godišnje u lokalnom obrazovnom sistemu.'
        },
        return: {
            title: 'Podrška povratnicima i malim biznisima',
            body: 'U prethodne tri godine registrovano je 48 novih mikro preduzeća pokrenutih od strane povratnika. Ciljana finansijska podrška i servis za brzu administraciju mogli bi da udvostruče taj broj do 2026.'
        },
        digital: {
            title: 'Digitalni most sa dijasporom',
            body: 'Procjenjuje se da više od 7.000 ljudi porijeklom iz Petnjice živi privremeno u inostranstvu. Online platforma za mentorstvo i investicione klubove može da mobiliše makar 150 stručnjaka godišnje za projekte u lokalnoj zajednici.'
        }
    };

    const chartContainer = document.querySelector('[data-chart]');
    const chartSource = document.querySelector('[data-chart-source]');
    const chartToggles = document.querySelectorAll('[data-chart-toggle]');
    const scenarioToggles = document.querySelectorAll('[data-insight]');
    const scenarioTitle = document.querySelector('[data-narrative-title]');
    const scenarioBody = document.querySelector('[data-narrative-body]');
    let activeDataset = 'residents';

    const NS = 'http://www.w3.org/2000/svg';

    function renderChart(key) {
        const dataset = datasets[key];
        if (!dataset || !chartContainer) {
            return;
        }

        const width = chartContainer.clientWidth || 720;
        const height = 360;
        const padding = { top: 30, right: 32, bottom: 60, left: 70 };
        const availableWidth = width - padding.left - padding.right;
        const availableHeight = height - padding.top - padding.bottom;
        const values = dataset.data.map(d => d.value);
        const years = dataset.data.map(d => d.year);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        const minValue = Math.min(...values, 0);
        const maxValue = Math.max(...values, 0);
        const valueRange = maxValue - minValue || 1;
        const yearRange = maxYear - minYear || 1;

        chartContainer.innerHTML = '';
        chartContainer.classList.add('chart--ready');

        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', `${dataset.label} za Petnjicu`);
        svg.classList.add('chart__svg');

        const gridGroup = document.createElementNS(NS, 'g');
        gridGroup.setAttribute('class', 'chart__grid');
        svg.appendChild(gridGroup);

        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            const value = maxValue - ratio * valueRange;
            const y = padding.top + ratio * availableHeight;

            const line = document.createElementNS(NS, 'line');
            line.setAttribute('x1', padding.left);
            line.setAttribute('x2', width - padding.right);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            line.setAttribute('class', 'chart__grid-line');
            gridGroup.appendChild(line);

            const label = document.createElementNS(NS, 'text');
            label.setAttribute('x', padding.left - 14);
            label.setAttribute('y', y + 4);
            label.setAttribute('class', 'chart__axis-label');
            label.textContent = Math.round(value).toLocaleString('sr-RS');
            gridGroup.appendChild(label);
        }

        if (minValue < 0) {
            const zeroY = padding.top + ((maxValue - 0) / valueRange) * availableHeight;
            const zeroLine = document.createElementNS(NS, 'line');
            zeroLine.setAttribute('x1', padding.left);
            zeroLine.setAttribute('x2', width - padding.right);
            zeroLine.setAttribute('y1', zeroY);
            zeroLine.setAttribute('y2', zeroY);
            zeroLine.setAttribute('class', 'chart__zero-line');
            svg.appendChild(zeroLine);
        }

        const areaPath = document.createElementNS(NS, 'path');
        const linePath = document.createElementNS(NS, 'path');
        const points = dataset.data.map((d, index) => {
            const x = padding.left + ((d.year - minYear) / yearRange) * availableWidth;
            const y = padding.top + ((maxValue - d.value) / valueRange) * availableHeight;
            return { x, y, year: d.year, value: d.value };
        });

        const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
        linePath.setAttribute('d', pathData);
        linePath.setAttribute('class', 'chart__line');

        const areaData = `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} L ${points[points.length - 1].x} ${padding.top + availableHeight} L ${points[0].x} ${padding.top + availableHeight} Z`;
        areaPath.setAttribute('d', areaData);
        areaPath.setAttribute('class', 'chart__area');

        svg.appendChild(areaPath);
        svg.appendChild(linePath);

        const dotsGroup = document.createElementNS(NS, 'g');
        dotsGroup.setAttribute('class', 'chart__dots');
        points.forEach((point) => {
            const dot = document.createElementNS(NS, 'circle');
            dot.setAttribute('cx', point.x);
            dot.setAttribute('cy', point.y);
            dot.setAttribute('r', 5);
            dot.setAttribute('class', 'chart__dot');
            dotsGroup.appendChild(dot);
        });
        svg.appendChild(dotsGroup);

        const axisGroup = document.createElementNS(NS, 'g');
        axisGroup.setAttribute('class', 'chart__axis');
        dataset.data.forEach((d) => {
            const x = padding.left + ((d.year - minYear) / yearRange) * availableWidth;
            const tick = document.createElementNS(NS, 'line');
            tick.setAttribute('x1', x);
            tick.setAttribute('x2', x);
            tick.setAttribute('y1', height - padding.bottom);
            tick.setAttribute('y2', height - padding.bottom + 8);
            tick.setAttribute('class', 'chart__tick');
            axisGroup.appendChild(tick);

            const label = document.createElementNS(NS, 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', height - padding.bottom + 28);
            label.setAttribute('class', 'chart__axis-label chart__axis-label--x');
            label.textContent = d.year;
            axisGroup.appendChild(label);
        });
        svg.appendChild(axisGroup);

        const focusLine = document.createElementNS(NS, 'line');
        focusLine.setAttribute('class', 'chart__focus-line');
        focusLine.setAttribute('y1', padding.top);
        focusLine.setAttribute('y2', height - padding.bottom);
        focusLine.setAttribute('visibility', 'hidden');
        svg.appendChild(focusLine);

        const focusDot = document.createElementNS(NS, 'circle');
        focusDot.setAttribute('class', 'chart__focus-dot');
        focusDot.setAttribute('r', 7);
        focusDot.setAttribute('visibility', 'hidden');
        svg.appendChild(focusDot);

        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.setAttribute('hidden', 'true');
        chartContainer.appendChild(svg);
        chartContainer.appendChild(tooltip);

        const overlay = document.createElementNS(NS, 'rect');
        overlay.setAttribute('x', padding.left);
        overlay.setAttribute('y', padding.top);
        overlay.setAttribute('width', availableWidth);
        overlay.setAttribute('height', availableHeight);
        overlay.setAttribute('fill', 'transparent');
        overlay.setAttribute('pointer-events', 'all');
        svg.appendChild(overlay);

        const svgPoint = svg.createSVGPoint();

        function setActivePoint(point) {
            const pointForScreen = svg.createSVGPoint();
            pointForScreen.x = point.x;
            pointForScreen.y = point.y;
            const screenPoint = pointForScreen.matrixTransform(svg.getScreenCTM());

            focusLine.setAttribute('x1', point.x);
            focusLine.setAttribute('x2', point.x);
            focusLine.setAttribute('visibility', 'visible');

            focusDot.setAttribute('cx', point.x);
            focusDot.setAttribute('cy', point.y);
            focusDot.setAttribute('visibility', 'visible');

            tooltip.innerHTML = `<strong>${point.year}</strong><span>${point.value.toLocaleString('sr-RS')} ${dataset.unit}</span>`;
            tooltip.removeAttribute('hidden');

            const bounds = chartContainer.getBoundingClientRect();
            const tooltipBounds = tooltip.getBoundingClientRect();
            let left = screenPoint.x - bounds.left - tooltipBounds.width / 2;
            let top = screenPoint.y - bounds.top - tooltipBounds.height - 16;

            left = Math.max(0, Math.min(left, bounds.width - tooltipBounds.width));
            if (top < 0) {
                top = screenPoint.y - bounds.top + 16;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }

        function clearActivePoint() {
            focusLine.setAttribute('visibility', 'hidden');
            focusDot.setAttribute('visibility', 'hidden');
            tooltip.setAttribute('hidden', 'true');
        }

        function getNearestPoint(evt) {
            svgPoint.x = evt.clientX;
            svgPoint.y = evt.clientY;
            const localPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
            return points.reduce((closest, point) => {
                const distance = Math.abs(point.x - localPoint.x);
                if (!closest || distance < closest.distance) {
                    return { point, distance };
                }
                return closest;
            }, null)?.point;
        }

        overlay.addEventListener('pointerenter', (evt) => {
            const point = getNearestPoint(evt);
            if (point) {
                setActivePoint(point);
            }
        });

        overlay.addEventListener('pointermove', (evt) => {
            const point = getNearestPoint(evt);
            if (point) {
                setActivePoint(point);
            }
        });

        overlay.addEventListener('pointerleave', () => {
            clearActivePoint();
        });

        chartSource.textContent = `Izvor: ${dataset.source}`;
    }

    function setActiveToggle(buttons, activeValue) {
        buttons.forEach((button) => {
            const isActive = button.dataset.chartToggle === activeValue || button.dataset.insight === activeValue;
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    chartToggles.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.dataset.chartToggle;
            if (key && datasets[key]) {
                activeDataset = key;
                renderChart(activeDataset);
                setActiveToggle(chartToggles, key);
            }
        });
    });

    scenarioToggles.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.dataset.insight;
            const scenario = scenarios[key];
            if (!scenario) {
                return;
            }
            scenarioTitle.textContent = scenario.title;
            scenarioBody.textContent = scenario.body;
            setActiveToggle(scenarioToggles, key);
        });
    });

    renderChart(activeDataset);
    window.addEventListener('resize', () => {
        renderChart(activeDataset);
        setActiveToggle(chartToggles, activeDataset);
    });
});
