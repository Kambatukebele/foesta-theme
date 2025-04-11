const faqPlus = document.querySelectorAll("#faq-plus");
const faqMinus = document.querySelectorAll("#faq-minus");  
const faqContent = document.querySelectorAll("#faq-content"); 

faqPlus.forEach((plus, index)=>{
    plus.addEventListener("click", () =>{
        plus.classList.replace("block", "hidden");
        faqMinus[index].classList.replace("hidden", "block");
        faqContent[index].classList.remove("h-0", "overflow-hidden");
        faqContent[index].classList.add("h-28", "overflow-visible");
    })
});
faqMinus.forEach((minus, index)=>{
    minus.addEventListener("click", () =>{
        faqPlus[index].classList.replace("hidden", "block");
        minus.classList.replace("block", "hidden");
        faqContent[index].classList.add("h-0", "overflow-hidden");
        faqContent[index].classList.remove("h-28", "overflow-visible");
    })
});