<template>
  <q-page class="row justify-center q-pa-lg bg-grey-3">
    <q-card
      style="width: 720px; max-width: 720px; line-height: 1.75em"
      class="column shadow-0"
    >
      <div
        class="text-h5 text-center text-weight-bold full-width q-pa-md bg-accent"
      >
        COOKIE POLICY
      </div>
      <div
        class="q-pa-xl text-weight-light"
        style="font-size: 17px; line-height: 1.5em"
      >
        <h6 class="q-mb-md q-mt-none">What Are Cookies</h6>
        <div class="q-mb-xl" align="justify">
          As it is a common practice with almost all professional websites, this
          site uses cookies which are tiny files that are downloaded to your
          computer, to improve your experience. This page describes what
          information they gather, how we use it and why we sometimes need to
          store these cookies. We will also share how you can prevent these
          cookies from being stored however this may downgrade or "break"
          certain elements of the sites functionality. For more general
          information on cookies see the Wikipedia article on HTTP Cookies.
        </div>

        <h6 class="q-mb-md q-mt-none">How We Use Cookies</h6>
        <div class="q-mb-xl" align="justify">
          We use cookies for a variety of reasons detailed below. Unfortunately
          in most cases there are no industry standard options for disabling
          cookies without completely disabling the functionality and features
          they add to this site. It is recommended that you leave on all cookies
          if you are not sure whether you need them or not in case they are used
          to provide a service that you use.
        </div>

        <h6 class="q-mb-md q-mt-none">Disabling Cookies</h6>
        <div class="q-mb-xl" align="justify">
          You can prevent the setting of cookies by adjusting the settings on
          your browser (see your browser Help for how to do this). Be aware that
          disabling cookies will affect the functionality of this and many other
          websites that you visit. Disabling cookies will usually result in also
          disabling certain functionality and features of this site. Therefore
          it is recommended that you do not disable cookies.
        </div>

        <h6 class="q-mb-md q-mt-none">The Cookies We Set</h6>
        <div class="q-mb-xl">
          <ul>
            <li class="q-mb-md" align="justify">
              <b>Account related cookies</b>: If you create an account with us
              then we will use cookies for the management of the signup process
              and general administration. These cookies will usually be deleted
              when you log out however in some cases they may remain afterwards
              to remember your site preferences when logged out.
            </li>
            <li class="q-mb-md" align="justify">
              <b>Login related cookies</b>: We use cookies when you are logged
              in so that we can remember this fact. This prevents you from
              having to log in every single time you visit a new page. These
              cookies are typically removed or cleared when you log out to
              ensure that you can only access restricted features and areas when
              logged in.
            </li>
            <li class="q-mb-md" align="justify">
              <p>
                <b>Third Party Cookies</b>: In some special cases we also use
                cookies provided by trusted third parties. The following section
                details which third party cookies you might encounter through
                this site.
              </p>
              <p>
                This site uses Google Analytics which is one of the most
                widespread and trusted analytics solutions on the web for
                helping us to understand how you use the site how we can improve
                your experience. These cookies may track things such as how long
                you spend on the site and the pages that you visit so we can
                continue to produce engaging content.
              </p>
            </li>
            <li>
              For more information on Google Analytics cookies, see the official
              Google Analytics page.
            </li>
          </ul>
        </div>

        <h6 class="q-mb-md q-mt-none">More Information</h6>
        <div align="justify">
          Hopefully that has clarified things for you and as was previously
          mentioned if there is something that you aren't sure whether you need
          or not it's usually safer to leave cookies enabled in case it does
          interact with one of the features you use on our site. However if you
          are still looking for more information, then you can contact us
          through one of our preferred contact methods: By visiting this link:
          https://uermhospital.com.ph
        </div>
      </div>
      <q-separator />
      <div class="row justify-center q-pa-lg">
        <q-btn outline label="HOME" to="/" />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CookiePolicy",
});
</script>
