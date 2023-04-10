let token;
let phoneNo;
function apiCall(name, phone, email, check) {
  phoneNo = phone;
  let url = window.location.href;
  // let url = "https://tarunjangra4.github.io/KeyaHomesTest/?isOTP=true";
  let searchParams = new URLSearchParams(new URL(url).search);
  utm_source = searchParams.get("utm_source");
  utm_campaign = searchParams.get("utm_campaign");
  utm_medium = searchParams.get("utm_medium");
  utm_content = searchParams.get("utm_content");
  utm_terms = searchParams.get("utm_terms");
  const isOtp = new URLSearchParams(new URL(url).search).get("isOTP");

  let body = {
    phone: phone,
    name: name,
    projectId: 23,
    email: email,
    ...(utm_campaign != null && { campaignCode: utm_campaign }),
    ...(searchParams?.entries?.length > 0 && {
      metadata: {
        utm_campaign: utm_campaign,
        utm_content: utm_content,
        utm_medium: utm_medium,
        utm_source: utm_source,
        utm_terms: utm_terms,
      },
    }),
    fromPortal: false,
    requireOtp: true,
  };

  axios
    .post("https://api-dcrm.fincity.com/open/opportunity", body)
    .then((res) => {
      if (isOtp) {
        let modalForm = document.querySelector(
          check == 1
            ? ".form-wrapper"
            : check == 2
            ? ".modal-form-container"
            : ".mobile-form-wrapper"
        );
        let verifyOtp = document.querySelector(
          check == 1
            ? ".verification-otp-container1"
            : check == 2
            ? ".verification-otp-container2"
            : ".verification-otp-container4"
        );
        modalForm.style.display = "none";
        verifyOtp.style.display = "block";
        token = res?.data?.token;
        sendOtp(check);
      } else {
        setTimeout(() => {
          window.location.href = "thankyou.html";
        }, 1000);
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
}

function sendOtp(check) {
  let modalForm = document.querySelector(
    check == 1
      ? ".form-wrapper"
      : check == 2
      ? ".modal-form-container"
      : ".mobile-form-wrapper"
  );
  let verifyOtp = document.querySelector(
    check == 1
      ? ".verification-otp-container1"
      : check == 2
      ? ".verification-otp-container2"
      : ".verification-otp-container4"
  );
  modalForm.style.display = "none";
  let mobileNo = document.querySelector(
    check == 1
      ? ".verfication-no1"
      : check == 2
      ? ".verfication-no2"
      : ".verfication-no4"
  );
  mobileNo.innerHTML = phoneNo;
  verifyOtp.style.display = "block";
  axios
    .post(
      `https://api-dcrm.fincity.com/open/opportunity/send-otp?token=${token}`
    )
    .then((res) => {})
    .catch((err) => {});
}

function verifyOtp(check) {
  let otpInput1 = document.querySelector(
    check == 1 ? "#__1st" : check == 2 ? "#_1st" : "#_1st_"
  );
  let otpInput2 = document.querySelector(
    check == 1 ? "#__2nd" : check == 2 ? "#_2nd" : "#_2nd_"
  );
  let otpInput3 = document.querySelector(
    check == 1 ? "#__3rd" : check == 2 ? "#_3rd" : "#_3rd_"
  );
  let otpInput4 = document.querySelector(
    check == 1 ? "#__4th" : check == 2 ? "#_4th" : "#_4th_"
  );
  let otp =
    otpInput1.value + otpInput2.value + otpInput3.value + otpInput4.value;

  axios
    .post(`https://api-dcrm.fincity.com/open/opportunity/verify`, {
      token: token,
      otp: otp,
    })
    .then((res) => {
      document.querySelector(
        check == 1
          ? ".verification-otp-container1"
          : check == 2
          ? ".verification-otp-container2"
          : ".verification-otp-container4"
      ).style.display = "none";
      document.querySelector(
        check == 1
          ? ".location-container1"
          : check == 2
          ? ".location-container2"
          : ".location-container4"
      ).style.display = "block";
      setTimeout(() => {
        window.location.href = "https://dcrm.fincity.com/?&user=consumer";
      }, 5000);
    })
    .catch((err) => {});
}

const optionLocation = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function detectLocation(e) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // The location was successfully retrieved
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        axios
          .post(`https://api-dcrm.fincity.com/open/opportunity/verify`, {
            token: token,
            location: {
              lat: latitude,
              lng: longitude,
            },
          })
          .then((res) => {
            document.body.style.overflow = "scroll";
            modal.style.display = "none";
          })
          .catch((err) => {});
      },
      (error) => {
        console.error(error);
      },
      optionLocation
    );
  } else {
    console.log("geo-location not supported on your browser!");
  }
}

function changeNo(check) {
  document.querySelector(
    check == 1
      ? ".verification-otp-container1"
      : check == 2
      ? ".verification-otp-container2"
      : ".verification-otp-container4"
  ).style.display = "none";
  document.querySelector(
    check == 1
      ? ".form-wrapper"
      : check == 2
      ? ".modal-form-container"
      : ".mobile-form-wrapper"
  ).style.display = "block";
}

function removeClass() {
  let arr = document.getElementsByClassName("navlink");
  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.remove("active");
  }
}

let navigationContainer = document.querySelector(".navlist");

navigationContainer.addEventListener("click", (e) => {
  removeClass();
  e.target.classList.add("active");
});

let rm1 = document.querySelector(".read-more1");
let rl1 = document.querySelector(".read-less1");
let tncText = document.querySelector(".tnc-text");
tncText.innerHTML = "I hereby declare that I have";
rl1.style.display = "none";
rm1.addEventListener("click", () => {
  rm1.style.display = "none";
  rl1.style.display = "inline-block";
  tncText.innerHTML =
    "I hereby declare that I have read the consent and I appoint and allow FINCITY to access my credit information and I/We hereby authorize FINCITY & its affiliates including banking partners to call or SMS and/or WhatsApp with reference to my application or in relation to any of FINCITY products, notwithstanding anything to the contrary that may be contained anywhere, including any registration for DNC/ NDNC.";
});

rl1.addEventListener("click", () => {
  rm1.style.display = "inline-block";
  rl1.style.display = "none";
  tncText.innerHTML = "I hereby declare that I have";
});

let name1 = document.querySelector(".name1");
let phone1 = document.querySelector(".phone1");
let email1 = document.querySelector(".email1");
let tncCheck = document.querySelector(".tnc-check");
let getBtn = document.querySelector(".get-details");

function handleNameChange1() {
  if (name1.value === "") {
    document.querySelector(".name-validation").style.display = "inline-block";
  } else {
    document.querySelector(".name-validation").style.display = "none";
  }
  handleChange1();
}

const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function handlePhoneChange1() {
  if (phone1.value === "") {
    document.querySelector(".phone-validation").style.display = "inline-block";
    document.querySelector(".phone-validation").style.innerHTML =
      "Phone number.";
  } else if (!phoneRegex.test(phone1.value)) {
    document.querySelector(".phone-validation").innerHTML =
      "Enter valid phone number.";
    document.querySelector(".phone-validation").style.display = "inline-block";
  } else {
    document.querySelector(".phone-validation").style.display = "none";
  }
  handleChange1();
}

function handleEmailChange1() {
  if (email1.value === "") {
    document.querySelector(".email-validation").style.display = "inline-block";
    document.querySelector(".email-validation").innerHTML =
      "Email is required.";
  } else if (!emailRegex.test(email1.value)) {
    document.querySelector(".email-validation").innerHTML =
      "Email should be valid.";
    document.querySelector(".email-validation").style.display = "inline-block";
  } else {
    document.querySelector(".email-validation").style.display = "none";
  }
  handleChange1();
}

function handletncCheck1() {
  handleChange1();
}

function handleChange1() {
  getBtn.disabled = true;
  getBtn.style.backgroundColor = "#343a40";
  if (
    email1.value !== "" &&
    emailRegex.test(email1.value) &&
    name1.value !== "" &&
    phone1.value !== "" &&
    phoneRegex.test(phone1.value) &&
    tncCheck.checked
  ) {
    {
      document.querySelector(".name-validation").style.display = "none";
      document.querySelector(".phone-validation").style.display = "none";
      document.querySelector(".email-validation").style.display = "none";
      getBtn.disabled = false;
      getBtn.style.backgroundColor = "#212529";
    }
  }
}

function getDetails() {
  apiCall(name1.value, phone1.value, email1.value, 1);
}

let rm2 = document.querySelector(".read-more2");
let rl2 = document.querySelector(".read-less2");
let overviewMore = document.querySelector(".overview-more");

rm2.addEventListener("click", () => {
  rm2.style.display = "none";
  rl2.style.display = "block";
  overviewMore.style.display = "block";
});

rl2.addEventListener("click", () => {
  rl2.style.display = "none";
  rm2.style.display = "block";
  overviewMore.style.display = "none";
});

let activeMenu = document.querySelector(".active-dropdown");
activeMenu.style.backgroundColor = "#343a40";
activeMenu.style.color = "#fff";

let dropdownBtn1 = document.querySelector(".dropdown-btn1");
let dropdownMenu1 = document.querySelector(".dropdown-menu1");
let floorPlanImg = document.querySelector(".floor-plan-img");
let dropdownBtn2 = document.querySelector(".dropdown-btn2");
let dropdownMenu2 = document.querySelector(".dropdown-menu2");
let dropdownItems = document.getElementsByClassName("dropdown-item");

dropdownBtn1.addEventListener("click", () => {
  if (
    dropdownMenu1.style.display === "flex" ||
    dropdownMenu1.style.display === "block"
  ) {
    dropdownMenu1.style.display = "none";
  } else {
    dropdownMenu1.style.display = "flex";
  }
});

function reset() {
  let arr = document.getElementsByClassName("dropdown-item");
  for (let i = 0; i < arr.length; i++) {
    arr[i].style.color = "#343a40";
    arr[i].style.backgroundColor = "#fff";
  }
}

dropdownMenu1.addEventListener("click", (e) => {
  if (dropdownMenu1 !== e.target) {
    reset();
    e.target.style.backgroundColor = "#343a40";
    e.target.style.color = "#fff";
    for (let i = 0; i < dropdownItems.length; i++) {
      if (dropdownItems[i] !== e.target) {
        dropdownItems[i].classList.add("drop-hover");
      }
    }
  }
  let target = e.target.innerHTML.trim() || "";
  if (target === "Duplex (3290+sq.ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Duplex-02-min.jpg";
  } else if (target === "Duplex (4180+sq.ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Duplex-01-min.jpg";
  } else if (target === "Duplex (4450+sq.ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Duplex-04-min.jpg";
  } else if (target === "Duplex (4470+sq.ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Duplex-01-min.jpg";
  } else if (target === "Penthouse (3300+sq.ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Penthouse-05-min.jpg";
  } else if (target === "Penthouse (4330+sq.+ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Penthouse-05-min.jpg";
  }
  dropdownMenu1.style.display = "none";
});

dropdownBtn2.addEventListener("click", () => {
  if (
    dropdownMenu2.style.display === "flex" ||
    dropdownMenu2.style.display === "block"
  ) {
    dropdownMenu2.style.display = "none";
  } else {
    dropdownMenu2.style.display = "flex";
  }
});

dropdownMenu2.addEventListener("click", (e) => {
  if (dropdownMenu2 !== e.target) {
    reset();
    e.target.style.backgroundColor = "#343a40";
    e.target.style.color = "#fff";
  }
  let target = e.target.innerHTML.trim() || "";
  if (target === "Penthouse+(4300+sq.+ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Penthouse-03-min.jpg";
  } else if (target === "Penthouse (4520+sq.+ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Penthouse-04-min.jpg";
  } else if (target === "Penthouse (4610+sq.+ft)") {
    floorPlanImg.src =
      "https://property.fincity.com/wp-content/uploads/2023/02/Penthouse-01-min.jpg";
  }
  dropdownMenu2.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (!document.querySelector(".dropdown1").contains(e.target)) {
    dropdownMenu1.style.display = "none";
  }
});

window.addEventListener("click", function (e) {
  if (!document.querySelector(".dropdown2").contains(e.target)) {
    dropdownMenu2.style.display = "none";
  }
});

let modal = document.querySelector(".modal");

function openModal() {
  document.body.style.overflow = "hidden";
  modal.style.display = "flex";
}

function closeModal() {
  document.body.style.overflow = "scroll";
  modal.style.display = "none";
}

let rm3 = document.querySelector(".read-more3");
let rl3 = document.querySelector(".read-less3");
let modaltncText = document.querySelector(".modal-tnc-text");
modaltncText.innerHTML = "I hereby declare that I have";
rl3.style.display = "none";

rm3.addEventListener("click", () => {
  document.querySelector(".modal").style.top = "50%";
  rm3.style.display = "none";
  rl3.style.display = "inline-block";
  modaltncText.innerHTML =
    "I hereby declare that I have read the consent and I appoint and allow FINCITY to access my credit information and I/We hereby authorize FINCITY & its affiliates including banking partners to call or SMS and/or WhatsApp with reference to my application or in relation to any of FINCITY products, notwithstanding anything to the contrary that may be contained anywhere, including any registration for DNC/ NDNC.";
});

rl3.addEventListener("click", () => {
  document.querySelector(".modal").style.top = "35%";
  rm3.style.display = "inline-block";
  rl3.style.display = "none";
  modaltncText.innerHTML = "I hereby declare that I have";
});

let name2 = document.querySelector(".name2");
let phone2 = document.querySelector(".phone2");
let email2 = document.querySelector(".email2");
let modaltncCheck = document.querySelector(".modal-tnc-check");
let getInfoBtn = document.querySelector(".get-info");

function handleNameChange2() {
  if (name2.value === "") {
    document.querySelector(".name-validation1").style.display = "inline-block";
  } else {
    document.querySelector(".name-validation1").style.display = "none";
  }
  handleChange2();
}

function handlePhoneChange2() {
  if (phone2.value === "") {
    document.querySelector(".phone-validation1").style.display = "inline-block";
    document.querySelector(".phone-validation1").style.innerHTML =
      "Phone number.";
  } else if (!phoneRegex.test(phone2.value)) {
    document.querySelector(".phone-validation1").innerHTML =
      "Enter valid phone number.";
    document.querySelector(".phone-validation1").style.display = "inline-block";
  } else {
    document.querySelector(".phone-validation1").style.display = "none";
  }
  handleChange2();
}

function handleEmailChange2() {
  if (email2.value === "") {
    document.querySelector(".email-validation1").style.display = "inline-block";
    document.querySelector(".email-validation1").innerHTML =
      "Email is required.";
  } else if (!emailRegex.test(email2.value)) {
    document.querySelector(".email-validation1").innerHTML =
      "Email should be valid.";
    document.querySelector(".email-validation1").style.display = "inline-block";
  } else {
    document.querySelector(".email-validation1").style.display = "none";
  }
  handleChange2();
}

function handletncCheck2() {
  handleChange2();
}

function handleChange2() {
  getInfoBtn.disabled = true;
  getInfoBtn.style.backgroundColor = "#343a40";
  if (
    email2.value !== "" &&
    emailRegex.test(email2.value) &&
    name2.value !== "" &&
    phone2.value !== "" &&
    phoneRegex.test(phone2.value) &&
    modaltncCheck.checked
  ) {
    {
      document.querySelector(".name-validation1").style.display = "none";
      document.querySelector(".phone-validation1").style.display = "none";
      document.querySelector(".email-validation1").style.display = "none";
      getInfoBtn.disabled = false;
      getInfoBtn.style.backgroundColor = "#212529";
    }
  }
}

function getMoreInformation() {
  apiCall(name2.value, phone2.value, email2.value, 2);
}

window.addEventListener("click", (e) => {
  if (modal.style.display === "flex" && e.target == modal) {
    document.body.style.overflow = "scroll";
    modal.style.display = "none";
  }
});

const container = document.querySelector(".mobile-navbar");
const btn = document.querySelector(".nav-button");

btn.addEventListener("click", () => {
  if (container.classList.contains("expand")) {
    setTimeout(() => {
      container.classList.remove("expand");
    }, 0);
  } else if (!container.classList.contains("expand")) {
    setTimeout(() => {
      container.classList.add("expand");
    }, 0);
  }
});
window.addEventListener("click", (e) => {
  if (container.classList.contains("expand")) {
    container.classList.remove("expand");
  }
});

let mobileNavlist = document.getElementsByClassName("mobile-navlink");
function mobileReset() {
  for (let i = 0; i < mobileNavlist.length; i++) {
    mobileNavlist[i].classList.remove("active");
  }
}

const mobileNavigation = document.querySelector(".navigation-container");
mobileNavigation.addEventListener("click", (e) => {
  mobileReset();
  e.target.classList.add("active");
});

let rm4 = document.querySelector(".read-more4");
let rl4 = document.querySelector(".read-less4");
let mobiletncText = document.querySelector(".mobile-tnc-text");
mobiletncText.innerHTML = "I hereby declare that I have read";
rl4.style.display = "none";
rm4.addEventListener("click", () => {
  rm4.style.display = "none";
  rl4.style.display = "inline-block";
  mobiletncText.innerHTML =
    "I hereby declare that I have read the consent and I appoint and allow FINCITY to access my credit information and I/We hereby authorize FINCITY & its affiliates including banking partners to call or SMS and/or WhatsApp with reference to my application or in relation to any of FINCITY products, notwithstanding anything to the contrary that may be contained anywhere, including any registration for DNC/ NDNC.";
});

rl4.addEventListener("click", () => {
  rm4.style.display = "inline-block";
  rl4.style.display = "none";
  mobiletncText.innerHTML = "I hereby declare that I have";
});

let name4 = document.querySelector(".name3");
let phone4 = document.querySelector(".phone3");
let email4 = document.querySelector(".email3");
let mobiletncCheck = document.querySelector(".mobile-tnc-check");
let mobileGetBtn = document.querySelector(".mobile-get-details");

function handleNameChange3() {
  if (name4.value === "") {
    document.querySelector(".name-validation3").style.display = "inline-block";
  } else {
    document.querySelector(".name-validation3").style.display = "none";
  }
  handleChange1();
}

// function checkNumber(item) {
//   item.addEventListener("input", () => {
//     const inputValue = item.value;
//     const numericValue = inputValue.replace(/[^0-9]/g, "");
//     item.value = numericValue;
//   });
// }

function handlePhoneChange3() {
  if (phone4.value === "") {
    document.querySelector(".phone-validation3").style.display = "inline-block";
    document.querySelector(".phone-validation3").style.innerHTML =
      "Phone number.";
  } else if (!phoneRegex.test(phone4.value)) {
    document.querySelector(".phone-validation3").innerHTML =
      "Enter valid phone number.";
    document.querySelector(".phone-validation3").style.display = "inline-block";
  } else {
    document.querySelector(".phone-validation3").style.display = "none";
  }
  handleChange3();
}

function handleEmailChange3() {
  if (email4.value === "") {
    document.querySelector(".email-validation3").style.display = "inline-block";
    document.querySelector(".email-validation3").innerHTML =
      "Email is required.";
  } else if (!emailRegex.test(email4.value)) {
    document.querySelector(".email-validation3").innerHTML =
      "Email should be valid.";
    document.querySelector(".email-validation3").style.display = "inline-block";
  } else {
    document.querySelector(".email-validation3").style.display = "none";
  }
  handleChange3();
}

function handletncCheck3() {
  handleChange3();
}

function handleChange3() {
  mobileGetBtn.disabled = true;
  if (
    email4.value !== "" &&
    emailRegex.test(email4.value) &&
    name4.value !== "" &&
    phone4.value !== "" &&
    phoneRegex.test(phone4.value) &&
    mobiletncCheck.checked
  ) {
    {
      document.querySelector(".name-validation3").style.display = "none";
      document.querySelector(".phone-validation3").style.display = "none";
      document.querySelector(".email-validation3").style.display = "none";
      mobileGetBtn.disabled = false;
    }
  }
}

function getDetails1() {
  apiCall(name4.value, phone4.value, email4.value, 4);
}

function clickEvent(first, last) {
  if (first.value.length) {
    document.getElementById(last).focus();
  }
}

function moveFocusBack(e) {
  var prevInput = e.target.previousElementSibling;

  if (e.key === "Backspace" && e.target.value === "" && prevInput != null) {
    prevInput.focus();
  }
}
