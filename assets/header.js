// Toggle menu on mobile
const ToggleMenu = () => {
  const hamburgerMenu = document.querySelector("#hamburgerMenu");
  const closeMenu = document.querySelector("#closeMenu");
  const menu = document.querySelector("#menu");
  // Targeting the level menu
  hamburgerMenu.addEventListener("click", () => {
    menu.classList.remove("-left-[1300px]");
    menu.classList.add("left-0");
    closeMenu.classList.remove("hidden");
    hamburgerMenu.classList.add("hidden");
    // Closing
    closeMenu.addEventListener("click", () => {
    menu.classList.add("-left-[1300px]");
    menu.classList.remove("left-0");
    closeMenu.classList.add("hidden");
    hamburgerMenu.classList.remove("hidden");
    });
  });
  // Toggling submenu
  function toggleSubMenu (){
    const plusMenus = document.querySelectorAll(".plusMenus"); // targeting the plus on the main menu
    const minusMenus = document.querySelectorAll(".minusMenus"); // targeting the minus on the main menu
    const subMenuLists = document.querySelectorAll(".subMenuLists"); // targeting the submenu lists, first level
    const plusSubMenus = document.querySelectorAll(".plusSubMenus"); // targeting the plus on the first level menu
    const minusSubMenus = document.querySelectorAll(".minusSubMenus"); // targeting the minus on the first level menu
    const secondLevelSubMenuLists = document.querySelectorAll(".secondLevelSubMenuLists"); // targeting the second level submenu lists

    // This const menuHoverLargeScreen is going to show mega menu on hover
    const menuHoverLargeScreen = document.querySelectorAll(".menuHoverLargeScreen");
    const megaMenu = document.querySelector("#megaMenu"); // this select the mega menu to display on larger screen

    menuHoverLargeScreen[1].addEventListener("mouseenter", () =>{
      console.log("mouse enter successfully");
      megaMenu.classList.remove("lg:translate-y-11", "lg:opacity-0");      
      megaMenu.classList.add("lg:translate-y-0", "lg:opacity-100");      
    })
    megaMenu.addEventListener("mouseleave", () =>{
      console.log("mouse enter successfully");
      megaMenu.classList.add("lg:translate-y-11", "lg:opacity-0");      
      megaMenu.classList.remove("lg:translate-y-0", "lg:opacity-100");      
    })
    // End This const menuHoverLargeScreen is going to show mega menu on hover
    

    // Show the first submenu lists
    plusMenus.forEach((plus, index) =>{
      minusMenus.forEach((minus, min_index) =>{
        subMenuLists.forEach((subMenuList, sub_index) =>{
          plus.addEventListener("click", () =>{
            //console.log("click on index " + index + " " + subMenuLists);
            if (index === sub_index) {
              subMenuList.classList.replace("hidden", "block");
            }
            if (index === min_index) {
              minus.classList.replace("hidden", "block");
              plus.classList.replace("block", "hidden");
            }
          });
          minus.addEventListener("click", ()=>{
            if (index === sub_index) {
              subMenuList.classList.replace("block", "hidden");
            }  
            if (index === min_index) {
              minus.classList.replace("block", "hidden");
              plus.classList.replace("hidden", "block");
            }          
          });
        })
      }) 
    })    
    // Loop the subMenus
    plusSubMenus.forEach((plusSubMenu, plusSub_index) =>{
      minusSubMenus.forEach((minusSubMenu, minusSub_index) =>{
        secondLevelSubMenuLists.forEach((secondLevelSubMenuList, secondLevelSub_index) =>{
          plusSubMenu.addEventListener("click", ()=>{
            if (plusSub_index === secondLevelSub_index) {
              secondLevelSubMenuList.classList.replace("hidden", "block");
            }
            if (plusSub_index === minusSub_index){
              plusSubMenu.classList.replace("block", "hidden");
              minusSubMenu.classList.replace("hidden", "block");
            }         
          });
          minusSubMenu.addEventListener("click", ()=>{
            if (plusSub_index === secondLevelSub_index) {
              secondLevelSubMenuList.classList.replace("block", "hidden");
            }
            if (plusSub_index === minusSub_index){
              plusSubMenu.classList.replace("hidden", "block");
              minusSubMenu.classList.replace("block", "hidden");
            }      
          })
        });
      });
    });
  
  }
  toggleSubMenu();
}
// Toggle search bar
const ToggleSearch = () => {
  const searchBox = document.querySelector("#search");
  const searchIcon = document.querySelector("#searchIcon");
  const closeSearch = document.querySelector("#closeSearch");

  searchIcon.addEventListener("click", () => {
    searchBox.classList.remove("lg:-top-96");
    searchBox.classList.add("lg:top-0");
  });
  closeSearch.addEventListener("click", () => {
    searchBox.classList.add("lg:-top-96");
    searchBox.classList.remove("lg:top-0");
  });
};


ToggleMenu();
ToggleSearch();

