<script setup>
import { useAllAdminActions } from "@/apiservices/adminActions";
import { useHead } from "@vueuse/head";
import { onMounted, ref } from "vue";
const isCreateParishVisible = ref(false);
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");

const isConfirmDialogVisible = ref(false);
const AllAdminActions = useAllAdminActions();
useHead({
  title: "CCC Agiliti 1 ~ Landing",
  meta: [
    { charset: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, height=device-height, initial-scale=1.0",
    },
    { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
  ],
  link: [
    { rel: "icon", href: "/images/ccclogo.ico", type: "image/x-icon" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Roboto:400,500%7CIbarra+Real+Nova:400,600,600i,700",
    },
    // { rel: "stylesheet", href: "/css/bootstrap.css" },
    // { rel: "stylesheet", href: "/css/fonts.css" },
    // { rel: "stylesheet", href: "/css/style.css" },
  ],
});

onMounted(() => {
  // Create the first script element (core.min.js)
  const coreScript = document.createElement("script");
  coreScript.src = "/js/core.min.js";
  coreScript.type = "text/javascript";
  coreScript.async = true;

  // Once core.min.js is loaded, append the second script (script.js)
  coreScript.onload = () => {
    const mainScript = document.createElement("script");
    mainScript.src = "/js/script.js";
    mainScript.type = "text/javascript";
    mainScript.async = true;
    console.log("core.min.js loaded");

    // Append the second script after the first one is fully loaded
    document.body.appendChild(mainScript);
  };

  // Append the first script to the body
  document.body.appendChild(coreScript);
});
const isLoaded = ref(false); // State to track if loading is complete

onMounted(() => {
  // Select the preloader and page elements
  const preloader = document.querySelector(".preloader");
  const page = document.querySelector(".page");

  // Check if the preloader element exists
  if (preloader) {
    // Simulating loading time with a timeout
    setTimeout(() => {
      // Add 'loaded' class to preloader to trigger CSS transition
      preloader.classList.add("loaded");

      // Once preloader is done, make the page visible
      isLoaded.value = true; // Update the loading state
    }, 2000); // Adjust the timeout duration as necessary
  }
});
</script>

<template>
  <div>
    <div class="ie-panel">
      <a href="http://windows.microsoft.com/en-US/internet-explorer/"
        ><img
          src="/images/ie8-panel/warning_bar_0000_us.jpg"
          height="42"
          width="820"
          alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today."
      /></a>
    </div>
    <div class="preloader">
      <div class="preloader-body">
        <div class="cssload-container">
          <div class="cssload-speeding-wheel"></div>
        </div>
        <p>Loading...</p>
      </div>
    </div>
    <div class="page" :style="{ opacity: isLoaded ? '1' : '0' }">
      <header class="section page-header">
        <!--RD Navbar-->
        <div class="rd-navbar-wrap">
          <nav
            class="rd-navbar rd-navbar-classic"
            data-layout="rd-navbar-fixed"
            data-sm-layout="rd-navbar-fixed"
            data-md-layout="rd-navbar-fixed"
            data-md-device-layout="rd-navbar-fixed"
            data-lg-layout="rd-navbar-static"
            data-lg-device-layout="rd-navbar-static"
            data-xl-layout="rd-navbar-static"
            data-xl-device-layout="rd-navbar-static"
            data-lg-stick-up-offset="46px"
            data-xl-stick-up-offset="46px"
            data-xxl-stick-up-offset="46px"
            data-lg-stick-up="true"
            data-xl-stick-up="true"
            data-xxl-stick-up="true"
          >
            <div
              class="rd-navbar-collapse-toggle rd-navbar-fixed-element-1"
              data-rd-navbar-toggle=".rd-navbar-collapse"
            >
              <span></span>
            </div>
            <div class="rd-navbar-aside-outer rd-navbar-collapse">
              <div class="rd-navbar-aside">
                <ul class="list-inline list-inline-md">
                  <li>
                    <div class="unit unit-spacing-xs align-items-center">
                      <div class="unit-left">
                        <span
                          class="icon text-middle mdi-phone-in-talk mdi"
                        ></span>
                      </div>
                      <div class="unit-body">
                        <a href="tel:#">(+44) 7721480196</a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="unit unit-spacing-xs align-items-center">
                      <div class="unit-left">
                        <span
                          class="icon text-middle mdi-map-marker mdi"
                        ></span>
                      </div>
                      <div class="unit-body">
                        <a href="#"
                          >CCC Afonifoji Ibukun-Olu Agiliti 1, International
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul class="social-list">
                  <li>
                    <a href="#"
                      ><span class="icon fa fa-youtube-play"></span
                    ></a>
                  </li>
                  <li>
                    <a href="#"><span class="icon fa fa-twitter"></span></a>
                  </li>
                  <li>
                    <a href="#"><span class="icon fa fa-facebook-f"></span></a>
                  </li>
                  <li>
                    <a href="#"><span class="icon fa fa-rss"></span></a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="rd-navbar-main-outer">
              <div class="rd-navbar-main">
                <!--RD Navbar Panel-->
                <div class="rd-navbar-panel">
                  <!--RD Navbar Toggle-->
                  <button
                    class="rd-navbar-toggle"
                    data-rd-navbar-toggle=".rd-navbar-nav-wrap"
                  >
                    <span></span>
                  </button>
                  <!--RD Navbar Brand-->
                  <div class="rd-navbar-brand">
                    <!--Brand--><a class="brand" href="/landing"
                      ><img
                        class="brand-logo-dark"
                        src="/images/ccclogo.png"
                        alt=""
                        width="94"
                        height="27" /><img
                        class="brand-logo-light"
                        src="/images/ccclogo.png"
                        alt=""
                        width="94"
                        height="27"
                    /></a>
                  </div>
                </div>
                <div class="rd-navbar-main-element">
                  <div class="rd-navbar-nav-wrap">
                    <ul class="rd-navbar-nav">
                      <li class="rd-nav-item active">
                        <a class="rd-nav-link" href="/landing">Home</a>
                      </li>
                      <li class="rd-nav-item">
                        <a class="rd-nav-link" href="#about">About Us</a>
                      </li>
                      <li class="rd-nav-item">
                        <a class="rd-nav-link" href="#doctrine">Doctrine</a>
                      </li>
                      <li class="rd-nav-item">
                        <a class="rd-nav-link" href="#">Register</a>
                        <ul class="rd-menu rd-navbar-dropdown">
                          <li class="rd-dropdown-item">
                            <a class="rd-dropdown-link" href="/register"
                              >Register as a member</a
                            >
                          </li>
                          <!-- <li class="rd-dropdown-item">
                            <VBtn
                              prepend-icon="tabler-plus"
                              @click="isCreateParishVisible = true"
                            >
                              Register as a parish
                            </VBtn>
                          </li> -->
                        </ul>
                      </li>
                      <li class="rd-nav-item">
                        <a class="rd-nav-link" href="/login">Login</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <!--Intro-->
      <section class="section section-lg section-intro">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-xl-8 text-center">
              <h1
                class="font-weight-bold text-primary wow fadeInUp"
                data-wow-delay=".1s"
              >
                Loving God, loving others and serving the world
              </h1>
              <p class="wow fadeInUp sub" data-wow-delay=".2s">
                Welcome to CCC Agiliti 1, International.
              </p>
            </div>
          </div>
        </div>
      </section>
      <!--Welcome-->
      <section class="section section-lg bg-default">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-xl-8 col-lg-10">
              <div class="pre-title wow fadeInLeft" data-wow-delay=".1s">
                Welcome to Agiliti 1 International
              </div>
              <h2 class="wow fadeInRight" data-wow-delay=".2s">
                Sharing the God’s love with everyone
              </h2>
              <p class="text-sm wow fadeInUp" data-wow-delay=".3s">
                Our mission is helping people find their way back to God. We
                accomplish this by reaching people far from God, restoring God’s
                dream for the world, and reproducing this mission in others.
                There are three key relationships that help you develop a
                growing relationship with Jesus.
              </p>
              <a
                class="shadow btn btn-icon btn-icon-right btn-secondary btn-svg offset-xl-55 wow fadeInUp"
                href="#about"
                data-wow-delay=".3s"
                ><span class="svg-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="10"
                    viewbox="0 0 18 10"
                    fill="#fff"
                  >
                    <path
                      d="M13 10V6H0V4H13V0L18 5L13 10Z"
                      fill=""
                    ></path></svg></span
                ><span>More about us</span></a
              >
            </div>
          </div>
        </div>
      </section>
      <section class="section section-lg bg-default" id="about">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-xl-8 col-lg-10">
              <div class="pre-title wow fadeInLeft" data-wow-delay=".1s">
                History of Celestial Church of Christ
              </div>
              <h2 class="wow fadeInRight" data-wow-delay=".2s">
                Welcome to CCC Worldwide
              </h2>
              <p class="text-sm wow fadeInUp" data-wow-delay=".3s">
                The Celestial Church of Christ World-wide was divinely
                established on September 29, 1947, in Porto Novo, Republic of
                Benin (formerly Republic of Dahomey) by the Reverend Pastor
                Prophet Founder, Samuel Bilehou Joseph Oshoffa. The church's
                inception is considered a divine occurrence, marked by a
                heavenly order and divine revelation.
              </p>
              <h2 class="wow fadeInRight" data-wow-delay=".2s">
                The Divine Order
              </h2>
              <p class="text-sm wow fadeInUp" data-wow-delay=".4s">
                On that fateful day in 1947, during deep prayer, a winged angel,
                radiant with intense light, appeared to the Founder. It was then
                that God’s message came:
                <i>
                  “It is the wish of God to send you on an errand of preaching
                  to the world. Many nominal Christians, when faced with the
                  problems of this world, turn to fetish priests and powers of
                  darkness for help. As a result, on their death, they cannot
                  see Christ because Satan has left his spiritual mark on them.
                  To assist you in your work, miraculous works of holy divine
                  healing will be carried out in the name of Jesus Christ. These
                  miracles, along with God’s mark on you, will testify that you
                  are sent by God.”
                </i>
                Thus, the Celestial Church of Christ was born.
              </p>
              <h2 class="wow fadeInRight" data-wow-delay=".2s">
                Founding and Revelation of the Church's Name
              </h2>
              <p class="text-sm wow fadeInUp" data-wow-delay=".5s">
                The name of the Church,
                <i>“Eglise du Christianisme Céleste”</i> (Celestial Church of
                Christ), was revealed through Mr. Alexander Yanga. He was
                undergoing spiritual healing and was in a trance for seven days.
                On the seventh day, he requested a piece of chalk and inscribed
                the name on the wall.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-lg bg-default">
        <div class="container">
          <div class="row row-narrow-50 align-items-center row-30">
            <div class="col-lg-7 wow fadeInLeft" data-wow-delay=".2s">
              <div class="inset-xl-right-60">
                <img src="/images/church.jpg" alt="" width="660" height="495" />
              </div>
            </div>
            <div class="col-lg-5 wow fadeInRight" data-wow-delay=".3s">
              <div class="pre-title">History of our church</div>
              <h2>41 years and counting</h2>
              <p>
                The Church has its Supreme Headquarters in Porto Novo, Republic
                of Benin, its National (Diocesan) Headquarters at 12/15 Church
                Street, Makoko, Yaba, Lagos State, Nigeria, and its
                International Headquarters at Mission House, Ketu, Lagos State,
                Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-lg bg-default">
        <div class="container">
          <div
            class="row row-narrow-50 align-items-center row-30 flex-xl-row-reverse"
          >
            <div class="col-lg-7 wow fadeInRight" data-wow-delay=".2s">
              <div class="inset-xl-left-60">
                <img
                  src="/images/oshoffa.jpg"
                  alt=""
                  width="660"
                  height="495"
                />
              </div>
            </div>
            <div class="col-lg-5 wow fadeInLeft" data-wow-delay=".3s">
              <div class="pre-title">The Founder’s Role</div>
              <h2>Samuel Oshoffa<br />Founding pastor</h2>
              <p>
                Apart from being a prophet, the Founder was given permission by
                divine order to use the angelic title "EPASTORAL," which was
                translated to “Pastor.” This occurred after he spent five years
                as an “Evangelist” following the establishment of the Church.
              </p>
              <div class="quote-italic">“Halleluyah...”</div>
              <img
                src="/images/signature-132x43.png"
                alt=""
                width="132"
                height="43"
              />
            </div>
          </div>
        </div>
      </section>
      <section class="section section-lg bg-default" id="doctrine">
        <div class="container">
          <div class="row row-narrow-50 align-items-center row-30">
            <div class="col-lg-7 wow fadeInLeft" data-wow-delay=".2s">
              <div class="inset-xl-right-60">
                <img
                  src="/images/emf_smiling.webp"
                  alt=""
                  width="660"
                  height="495"
                />
              </div>
            </div>
            <div class="col-lg-5 wow fadeInRight" data-wow-delay=".3s">
              <div class="pre-title">Become a part of our community</div>
              <h2>Join our church</h2>
              <p><strong>It is ordained by the Holy Spirit that:</strong></p>
              <ul
                class="list-marked inset-xl-left-20 font-weight-medium text-primary"
              >
                <li>
                  Idolatry, fetish practices, black magic, charms, smoking, and
                  consuming alcohol or intoxicating drinks are strictly
                  forbidden.
                </li>
                <li>
                  Male and female members must sit separately, and females must
                  cover their heads inside the Church.
                </li>
              </ul>
              <p>
                There are so much more about the church you can learn when you
                join us
              </p>
              <a
                class="shadow btn btn-icon btn-icon-right btn-primary btn-svg offset-xl-55"
                href="#about"
                data-wow-delay=".3s"
                ><span class="svg-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="10"
                    viewbox="0 0 18 10"
                    fill="#fff"
                  >
                    <path
                      d="M13 10V6H0V4H13V0L18 5L13 10Z"
                      fill=""
                    ></path></svg></span
                ><span>Join now</span></a
              >
            </div>
          </div>
        </div>
      </section>
      <section class="section section-lg bg-default">
        <div class="container">
          <div
            class="row row-narrow-50 align-items-center row-30 flex-xl-row-reverse"
          >
            <div class="col-lg-7 wow fadeInRight" data-wow-delay="2.2s">
              <div class="inset-xl-left-60">
                <img
                  src="/images/founding.jpg"
                  alt=""
                  width="660"
                  height="495"
                />
              </div>
            </div>
            <div class="col-lg-5 wow fadeInLeft" data-wow-delay="2.3s">
              <div class="pre-title">The Founder Sherperd</div>
              <h2>Samuel Adekoya<br />Founding Sherperd</h2>
              <p>
                Apart from being a prophet, the Founder was given permission by
                divine order to use the angelic title "EPASTORAL," which was
                translated to “Pastor.” This occurred after he spent five years
                as an “Evangelist” following the establishment of the Church.
              </p>
              <div class="quote-italic">
                Omo Adekoya, O so gbo di le, O so gbe di igboro
              </div>
              <img
                src="/images/signature-132x43.png"
                alt=""
                width="132"
                height="43"
              />
            </div>
          </div>
        </div>
      </section>
      <section class="section section-lg bg-default" id="doctrine">
        <div class="container">
          <div class="row row-narrow-50 align-items-center row-30">
            <div class="col-lg-7 wow fadeInLeft" data-wow-delay="3.2s">
              <div class="inset-xl-right-60">
                <img
                  src="/images/sheperd.jpg"
                  alt=""
                  width="660"
                  height="495"
                />
              </div>
            </div>
            <div class="col-lg-5 wow fadeInLeft" data-wow-delay="3.3s">
              <div class="pre-title">The Current Sherperd</div>
              <h2>Daniel Adekoya<br />Current Sherperd</h2>
              <p>
                Apart from being a prophet, the Founder was given permission by
                divine order to use the angelic title "EPASTORAL," which was
                translated to “Pastor.” This occurred after he spent five years
                as an “Evangelist” following the establishment of the Church.
              </p>
              <div class="quote-italic">Eri Kankanbu || Sheperd by grace”</div>
              <img
                src="/images/signature-132x43.png"
                alt=""
                width="132"
                height="43"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        class="section section-centered-content bg-img-2 section-lg context-dark"
      >
        <div class="container text-center">
          <div class="h1 wow fadeInUp">Mode of Worship</div>
          <p class="wow fadeInUp text-sm">
            The mode of worship includes the altar's setup, seating arrangement,
            and candle usage for different services. The Holy Spirit revealed
            the seating arrangement through a Prophetess on October 5, 1947.
          </p>
        </div>
      </section>
      <!--Swiper-->
      <section class="section section-lg bg-primary">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-12">
              <div
                class="swiper-container swiper-slider swiper-style-1"
                data-swiper='{"autoplay":{"delay":4567},"effect":"fade"}'
              >
                <div class="swiper-wrapper">
                  <div class="swiper-slide context-dark">
                    <div class="swiper-slide-caption text-center text-lg-left">
                      <div class="row justify-content-center">
                        <div class="col-xl-10 p-xl-0">
                          <div
                            class="row justify-content-center row-20 align-items-center flex-column flex-md-row"
                          >
                            <div class="col-lg-9 inset-left-110">
                              <div class="h3">
                                “Raising the Dead.<span
                                  class="text-italic accent-block"
                                  >One of the most famous miracles attributed to
                                  Adekoya was when he reportedly raised a young
                                  boy from the dead during a service.</span
                                >
                                This event drew significant attention and
                                further established his reputation as a powerful
                                spiritual leader.”
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="swiper-slide context-dark">
                    <div class="swiper-slide-caption text-center text-lg-left">
                      <div class="row justify-content-center">
                        <div class="col-xl-10 p-xl-0">
                          <div
                            class="row justify-content-center align-items-center flex-column flex-md-row row-20"
                          >
                            <div class="col-lg-9 inset-left-110">
                              <div class="h3">
                                “Healing the Sick<span
                                  class="text-italic accent-block"
                                  >Adekoya was known for his ability to heal
                                  people with various illnesses, including those
                                  who were declared incurable by medical
                                  professionals.
                                </span>
                                Many came to him for healing, and numerous
                                testimonies of miraculous recoveries were
                                shared.”
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--Swiper Pagination-->
                <div class="swiper-pagination"></div>
                <!--Swiper Navigation-->
                <div class="swiper-button-prev">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="10"
                    viewbox="0 0 18 10"
                    fill=""
                  >
                    <path d="M5 10V6H18V4H5V0L0 5L5 10Z" fill=""></path>
                  </svg>
                </div>
                <div class="swiper-button-next">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="10"
                    viewbox="0 0 18 10"
                    fill=""
                  >
                    <path d="M5 10V6H18V4H5V0L0 5L5 10Z" fill=""></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        class="section section-vide section-lg video-wrap vide"
        data-vide-bg="video/video-1"
      >
        <!-- <div class="container text-center context-dark">
          <div class="h1">Attend the next church event</div>
          <p class="text-sm">See you at the sunday sermon</p>
        </div> -->
      </section>
      <footer class="section footer-classic">
        <div class="footer-body">
          <div class="container">
            <div
              class="row justify-content-xl-between row-40 justify-content-lg-center"
            >
              <div class="col-lg-6">
                <div class="row row-20">
                  <div class="col-sm-4 col-6 wow fadeInUp" data-wow-delay=".1s">
                    <div class="footer-title">Who We Are</div>
                    <ul class="nav-list">
                      <li><a href="#about">About Us</a></li>
                      <li><a href="#doctrine">Doctrine</a></li>
                      <li><a href="/register">Register</a></li>
                      <li><a href="/login">Login</a></li>
                    </ul>
                  </div>
                  <div class="col-sm-4 col-6 wow fadeInUp" data-wow-delay=".2s">
                    <div class="footer-title">Info</div>
                    <ul class="nav-list">
                      <li><a href="#">Pastors</a></li>
                      <li><a href="#">Careers</a></li>
                      <li><a href="#">Community</a></li>
                      <li><a href="#">Blog</a></li>
                      <li><a href="#">Gallery</a></li>
                    </ul>
                  </div>
                  <div class="col-sm-4 col-6 wow fadeInUp" data-wow-delay=".3s">
                    <div class="footer-title">Help</div>
                    <ul class="nav-list">
                      <li><a href="#">Donate Now</a></li>
                      <li><a href="#">FAQ</a></li>
                      <li><a href="privacy-policy.html">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                class="col-lg-5 inset-right-100 wow fadeInRight"
                data-wow-delay=".3s"
              >
                <div class="footer-title">Contact us</div>
                <ul class="contact-list">
                  <li>
                    18/20 Celestial Avenue, Agiliti, Mile 12.
                    <br />
                    Questions? Please write us at:<a
                      class="link-secondary"
                      href="mailto:info@cccagili1.org"
                      >info@cccagili1.org</a>
                  </li>
                  <li>
                    <span>Call us:</span
                    ><a class="phone" href="tel:#">(+44) 7721480196</a>
                  </li>
                </ul>
                <ul class="social-list">
                  <li>
                    <a href="#"
                      ><span class="icon fa fa-youtube-play"></span
                    ></a>
                  </li>
                  <li>
                    <a href="#"><span class="icon fa fa-twitter"></span></a>
                  </li>
                  <li>
                    <a href="#"><span class="icon fa fa-facebook-f"></span></a>
                  </li>
                  <li>
                    <a href="#"><span class="icon fa fa-rss"></span></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-aside">
          <div class="container">
            <div class="row row-xl-40">
              <div class="col-12 wow fadeInUp" data-wow-delay=".2s">
                <p>
                  CCC is a Family of Faith that is committed to Bible teaching
                  and joyful worship. Children, youth and adults of all ages are
                  ministered to and given opportunities to serve the Lord by
                  serving others. You are invited to join us and experience what
                  it is like to be a part of the family. We have much to offer
                  you. CCC is a state Church where each person is made to feel
                  welcomed and wanted. We take seriously our mission statement,
                  which is "To Know Jesus and make Him known; To Follow the
                  Leadership of the Holy Spirit; and to Take God's Word to God's
                  World."
                </p>
              </div>
              <div class="col-12 wow fadeInUp" data-wow-delay=".4s">
                <p class="rights">
                  <span>&copy;&nbsp; </span><span class="copyright-year"></span
                  ><span>&nbsp;</span><span>CCC Afonifoji Ibukun-Olu</span
                  ><span>.&nbsp;</span><span>All Rights Reserved.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <VCol cols="12" sm="6" md="4">
        <CreateParishDialog v-model:is-dialog-visible="isCreateParishVisible" />
      </VCol>
    </div>
  </div>
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to delete this parish  Did you want to continue ?"
    cancel-msg="Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Deleted!"
    @confirm="onDeleteParish"
    @cancel="onCancel"
  />
</template>

<style lang="scss">
.ie-panel {
  position: relative;
  z-index: 1;
  display: none;
  background: #212121;
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 30%);
  clear: both;
  padding-block: 10px;
  padding-inline: 0;
  text-align: center;
}

html.ie-10 .ie-panel,
html.lt-ie-10 .ie-panel {
  display: block;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
