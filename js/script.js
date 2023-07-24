import { getData } from "./components/apiService.js";
import { renderCart } from "./components/cartControl.js";
import { calculateAdd, calculateMakeYourOwn } from "./components/formControl.js";
import { renderCardList } from "./components/goodsService.js";
import { modalController } from "./components/modalController.js";


const init = async () => {
	const data = await getData();

	renderCardList(document.querySelector(".goods__list"), data);

	modalController({
		modal: '.modal_order', 
		btnOpen: '.header__btn-order',
		open() {
			renderCart(data);
		},
	});
	
	const { resetForm: resetFormMakeYourOwn } = calculateMakeYourOwn();

	modalController({
		modal: '.modal_make-your-own',
		btnOpen: '.cocktail__btn_make',
		close: resetFormMakeYourOwn,
	});

	const { fillInForm: fillInFormAdd, resetForm: resetFormAdd } = calculateAdd();

	modalController({
		modal: ".modal_add",
		btnOpen: ".cocktail__btn_add",
		open({btn}) {
			const id = btn.dataset.id;
			const item = data.find(item => item.id.toString() === id);
			fillInFormAdd(item);
		},
		close: resetFormAdd,
	})
};
init()