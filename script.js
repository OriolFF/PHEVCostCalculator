document.addEventListener('DOMContentLoaded', () => {
    const gasConsumptionInput = document.getElementById('gas-consumption');
    const gasPriceInput = document.getElementById('gas-price');
    const evConsumptionInput = document.getElementById('ev-consumption');
    const evPriceInput = document.getElementById('ev-price');
    const calculateBtn = document.getElementById('calculate-btn');
    const gasResultDiv = document.getElementById('gas-result');
    const evResultDiv = document.getElementById('ev-result');
    const comparisonDiv = document.getElementById('comparison-result');
    const unitRadios = document.querySelectorAll('input[name="units"]');

    const updateLabels = (units) => {
        const gasConsumptionLabel = document.querySelector('label[for="gas-consumption"]');
        const gasPriceLabel = document.querySelector('label[for="gas-price"]');
        const evConsumptionLabel = document.querySelector('label[for="ev-consumption"]');
        const evPriceLabel = document.querySelector('label[for="ev-price"]');

        if (units === 'metric') {
            gasConsumptionLabel.textContent = 'Consumption (L/100km)';
            gasPriceLabel.textContent = 'Gasoline Price (€/L)';
            evConsumptionLabel.textContent = 'Consumption (kWh/100km)';
            evPriceLabel.textContent = 'Electricity Price (€/kWh)';
            gasConsumptionInput.placeholder = 'e.g., 8.5';
            gasPriceInput.placeholder = 'e.g., 1.85';
            evConsumptionInput.placeholder = 'e.g., 17.5';
            evPriceInput.placeholder = 'e.g., 0.22';
        } else {
            gasConsumptionLabel.textContent = 'Consumption (MPG)';
            gasPriceLabel.textContent = 'Gasoline Price ($/gallon)';
            evConsumptionLabel.textContent = 'Consumption (miles/kWh)';
            evPriceLabel.textContent = 'Electricity Price ($/kWh)';
            gasConsumptionInput.placeholder = 'e.g., 30';
            gasPriceInput.placeholder = 'e.g., 3.50';
            evConsumptionInput.placeholder = 'e.g., 4';
            evPriceInput.placeholder = 'e.g., 0.15';
        }
    };

    unitRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            updateLabels(event.target.value);
            gasConsumptionInput.value = '';
            gasPriceInput.value = '';
            evConsumptionInput.value = '';
            evPriceInput.value = '';
            gasResultDiv.textContent = '';
            evResultDiv.textContent = '';
            comparisonDiv.style.display = 'none';
        });
    });

    calculateBtn.addEventListener('click', () => {
        gasResultDiv.textContent = '';
        evResultDiv.textContent = '';
        comparisonDiv.style.display = 'none';
        comparisonDiv.className = 'comparison';

        const units = document.querySelector('input[name="units"]:checked').value;
        const currencySymbol = units === 'metric' ? '€' : '$';

        let gasCostPerKm_calc = NaN;
        let evCostPerKm_calc = NaN;

        // Gasoline calculation
        const gasConsumption = parseFloat(gasConsumptionInput.value);
        const gasPrice = parseFloat(gasPriceInput.value);

        if (!isNaN(gasConsumption) && !isNaN(gasPrice) && gasConsumption > 0) {
            let gasCostPerKm, gasCostPerMile;
            if (units === 'metric') {
                gasCostPerKm = (gasConsumption / 100) * gasPrice;
                gasCostPerMile = gasCostPerKm * 1.60934;
            } else { // Imperial: MPG and $/gallon
                gasCostPerMile = (1 / gasConsumption) * gasPrice;
                gasCostPerKm = gasCostPerMile / 1.60934;
            }
            gasResultDiv.innerHTML = `Cost: ${gasCostPerKm.toFixed(3)} ${currencySymbol}/km <br> (${gasCostPerMile.toFixed(3)} ${currencySymbol}/mile)`;
            gasCostPerKm_calc = gasCostPerKm;
        }

        // Electric vehicle calculation
        const evConsumption = parseFloat(evConsumptionInput.value);
        const evPrice = parseFloat(evPriceInput.value);

        if (!isNaN(evConsumption) && !isNaN(evPrice) && evConsumption > 0) {
            let evCostPerKm, evCostPerMile;
            if (units === 'metric') {
                evCostPerKm = (evConsumption / 100) * evPrice;
                evCostPerMile = evCostPerKm * 1.60934;
            } else { // Imperial: miles/kWh and $/kWh
                evCostPerMile = (1 / evConsumption) * evPrice;
                evCostPerKm = evCostPerMile / 1.60934;
            }
            evResultDiv.innerHTML = `Cost: ${evCostPerKm.toFixed(3)} ${currencySymbol}/km <br> (${evCostPerMile.toFixed(3)} ${currencySymbol}/mile)`;
            evCostPerKm_calc = evCostPerKm;
        }

        // Comparison logic
        if (!isNaN(gasCostPerKm_calc) && !isNaN(evCostPerKm_calc)) {
            const difference = Math.abs(gasCostPerKm_calc - evCostPerKm_calc);
            const cheaperCost = Math.min(gasCostPerKm_calc, evCostPerKm_calc);
            const percentageDifference = cheaperCost > 0 ? (difference / cheaperCost) * 100 : 0;

            let message = '';
            if (evCostPerKm_calc < gasCostPerKm_calc) {
                message = `The electric vehicle is <strong>${difference.toFixed(3)} ${currencySymbol}/km</strong> cheaper (${percentageDifference.toFixed(0)}% less).`;
                comparisonDiv.className = 'comparison cheaper';
            } else if (gasCostPerKm_calc < evCostPerKm_calc) {
                message = `The gasoline vehicle is <strong>${difference.toFixed(3)} ${currencySymbol}/km</strong> cheaper (${percentageDifference.toFixed(0)}% less).`;
                comparisonDiv.className = 'comparison more-expensive';
            } else {
                message = `Both vehicles cost the same.`;
                comparisonDiv.className = 'comparison';
            }

            comparisonDiv.innerHTML = message;
            comparisonDiv.style.display = 'block';
        }
    });

    // Initial label setup
    updateLabels(document.querySelector('input[name="units"]:checked').value);
});
