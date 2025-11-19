frappe.ui.form.ControlInt = class ControlInt extends frappe.ui.form.ControlData {
	static trigger_change_on_input_event = false;
	static input_mode = "numeric";

	make() {
		super.make();
	}

	make_input() {
		super.make_input();
		this.$input.on("focus", () => {
			document.activeElement?.select?.();
			return false;
		});
	}
	parse_short_amount(value) {
		if (!value) return value;
		value = value.toUpperCase().trim();

		const multipliers = {
			K: 1000,
			L: 100000,
			LAC: 100000,
			LAKH: 100000,
			CR: 10000000,
			CRORE: 10000000,
			M: 1000000,
			B: 1000000000,
		};

		const match = value.match(/^([0-9]*\.?[0-9]+)\s*([A-Z]+)$/);

		if (!match) return value;

		const number = parseFloat(match[1]);
		const suffix = match[2];

		let multiplier = multipliers[suffix] || 1;
		return number * multiplier;
	}
	eval_expression(value) {
		if (typeof value === "string") {
			let short_val = this.parse_short_amount(value);
			if (typeof short_val === "number") {
				return short_val;
			}

			const parsed_components = value.match(/[^\d.,]+|[\d.,]+/g);
			let parsed_value = value;

			if (parsed_components !== null) {
				parsed_value = parsed_components
					.map((v) => (isNaN(parseFloat(v)) ? v : flt(v)))
					.join("");
			}

			if (parsed_value.match(/^[0-9+\-/*.() ]+$/)) {
				try {
					return eval(parsed_value);
				} catch (e) {
					return value;
				}
			}
		}

		return value;
	}
	parse(value) {
		let val = this.eval_expression(value);
		return cint(val, null);
	}
};

frappe.ui.form.ControlLongInt = frappe.ui.form.ControlInt;
