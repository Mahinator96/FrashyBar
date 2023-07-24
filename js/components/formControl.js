import { cartDataControl } from "./cartControl.js"
import { price } from "./config.js"
import { getFormData } from "./getFormData.js"

const formSubmit = (form, cb) => {
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const data = getFormData(form);
		cartDataControl.add(data);

		if (cb) {
			cb();
		}
	})
}

const calculateTotalPrice = (form, startPrice) => {
	let totalPrice = startPrice;
	const data = getFormData(form);

	if (Array.isArray(data.ingredients)) {
		data.ingredients.forEach(item => {
			totalPrice += price[item] || 0;
		})
	} else {
		totalPrice += price[data.ingredients] || 0;
	}

	if (Array.isArray(data.topping)) {
		data.topping.forEach(item => {
			totalPrice += price[item] || 0;
		})
	} else {
		totalPrice += price[data.topping] || 0;
	}

	totalPrice += price[data.cup] || 0;

	return totalPrice;
};

const calculateMakeYourOwn = () => {
	const modalMakeOwn = document.querySelector('.modal_make-your-own');
	const formMakeOwn = modalMakeOwn.querySelector('.make__form_make-yuor-own');
	const makeInputTitle = modalMakeOwn.querySelector('.make__input-title');
	const makeInputPrice = modalMakeOwn.querySelector('.make__input-price');
	const makeTotalPrice = modalMakeOwn.querySelector('.make__total-price');
	const makeAddBtn = modalMakeOwn.querySelector('.make__add-btn');

	const handlerChange = () => {
		const totalPrice = calculateTotalPrice(formMakeOwn, 150);
		const data = getFormData(formMakeOwn);

		if (data.ingredients) {
			const ingredients = Array.isArray(data.ingredients) 
				? data.ingredients.join(', ')
				: data.ingredients;

			makeInputTitle.value = `Конструктор: ${ingredients}`;
			makeAddBtn.disabled = false;
		} else {
			makeAddBtn.disabled = true;
		}

		makeInputPrice.value = totalPrice;
		makeTotalPrice.innerHTML = `${totalPrice}&nbsp;₽`;
	}

	formMakeOwn.addEventListener('change', handlerChange);
	formSubmit(formMakeOwn, () => {
		modalMakeOwn.closeModal('close');
	});
	handlerChange();

	const resetForm = () => {
		makeTotalPrice.textContent = '';
		makeAddBtn.disabled = true;

		formMakeOwn.reset();
	}

	return {resetForm};
};

const calculateAdd = () => {
	const modalAdd = document.querySelector('.modal_add');
	const formAdd = modalAdd.querySelector('.make__form_add');
	const makeTitle = modalAdd.querySelector('.make__title');
	const makeInputTitle = modalAdd.querySelector('.make__input-title');
	const makeTotalPrice = modalAdd.querySelector('.make__total-price');
	const makeInputStartPrice = modalAdd.querySelector('.make__input-start-price');
	const makeInputPrice = modalAdd.querySelector('.make__input-price');
	const makeTotalSize = modalAdd.querySelector('.make__total-size');
	const makeInputSize = modalAdd.querySelector('.make__input-size');

	const handlerChange = () => {
		const totalPrice = calculateTotalPrice(formAdd, +makeInputStartPrice.value);
		makeInputPrice.value = totalPrice;
		makeTotalPrice.innerHTML = `${totalPrice}&nbsp;₽`;
	};

	formAdd.addEventListener('change', handlerChange);
	formSubmit(formAdd, () => {
		modalAdd.closeModal('close');
	})

	const fillInForm = data => {
		makeInputTitle.value = data.title;
		makeTitle.textContent = data.title;
		makeInputStartPrice.value = data.price;
		makeInputPrice.value = data.price;
		makeTotalPrice.innerHTML = `${data.price}&nbsp;₽`;
		makeInputSize.value = data.size;
		makeTotalSize.textContent = data.size;
		handlerChange();
	};

	const resetForm = () => {
		makeTitle.textContent = '';
		makeTotalPrice.innerHTML = '';
		makeTotalSize.textContent = '';

		formAdd.reset();
	}

	return {fillInForm, resetForm};
}

export { formSubmit, calculateTotalPrice, calculateMakeYourOwn, calculateAdd }
