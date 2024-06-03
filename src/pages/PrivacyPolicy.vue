<template>
  <q-page class="flex flex-center q-pa-lg">
    <q-card
      style="width: 720px; max-width: 720px; line-height: 1.75em"
      class="column shadow-0"
    >
      <div
        class="text-h5 text-center text-weight-bold full-width q-pa-md bg-accent"
      >
        PRIVACY POLICY
      </div>

      <div
        class="q-pa-xl text-weight-light"
        style="font-size: 18px; line-height: 1.5em"
      >
        <p align="justify">
          The <b>EHR Patient Portal</b> allows patient to access results of
          hospital procedures availed in University of the East Ramon Magsaysay
          Memorial Medical Center, Inc. (the “Medical Center”), over the
          Internet, without going to the premises physically.
        </p>

        <p align="justify">
          For patients under the legal age of 18 years old, his/her parent(s) or
          his/her accompanying adult(s) with substitute parental authority (e.g.
          guardian) as defined under the Civil Code of the Philippines Articles
          349 and 351 shall access the EHR Patient Portal.
        </p>

        <div>
          <p>
            By using this facility, the patient/parent(s)/substituted parent(s),
            as applicable, understand and agree to the following:
          </p>
          <ul>
            <li class="q-mb-md" align="justify">
              Any and all personal information are protected under Republic Act
              10173 or Data Privacy Act of 2012 and governed by the Medical
              Center Privacy Policy;
            </li>
            <li class="q-mb-md" align="justify">
              Allow the Medical Center to provide the access to hospital results
              available at the Medical Center in this online portal;
            </li>
            <li class="q-mb-md" align="justify">
              Agree to provide true, accurate, current and complete information
              about yourself as prompted by the registration process. Usage of
              the EHR Patient Portal is based on the assumption that the user is
              the legally authorized recipient and viewer of all information
              made accessible and available by EHR Patient Portal.
            </li>
            <li class="q-mb-md" align="justify">
              You are responsible for all activities that occur in your access
              to EHR Patient Portal;
            </li>
            <li class="q-mb-md" align="justify">
              Not to share username and password with any other person and to
              keep it secured. Sharing your username and password with another
              person will allow that person to see confidential information
              recorded in this facility and that the Medical Center is not
              responsible for any loss or damage to you or to any third party
              concerning any breach of confidential medical information as a
              result of this action or any unauthorized access and/or use of
              your account;
            </li>
            <li class="q-mb-md" align="justify">
              Always make sure to log out and close the web browser when online
              session is finished;
            </li>
            <li class="q-mb-md">
              Take responsibility for securing the saved or printed data from
              the EHR Patient Portal as it is beyond the control of the Medical
              Center;
            </li>
            <li class="q-mb-md" align="justify">
              Use the EHR Patient Portal only as permitted and will not attempt
              to harm or circumvent any of its security features or use the EHR
              PxPortal for any purpose other than as described in this notice;
            </li>
            <li class="q-mb-md" align="justify">
              The Medical Center reserves the right, at the Medical Center's
              discretion, to terminate EHR Patient Portal, suspend user access
              and modify services available through the EHR Patient Portal
              without due cause or notice;
            </li>
            <li class="q-mb-md" align="justify">
              The Medical Center will attempt to provide EHR Patient Portal
              without interruption, but access is provided on an
              "as-is-available" basis. The Medical Center does not guarantee
              access to patient portal at any given time.
            </li>
            <li class="q-mb-md" align="justify">
              While the Medical Center exerts reasonable efforts to provide
              accurate information in the EHR Patient Portal, the Medical Center
              takes no responsibility for and disclaims any and all liability
              arising from any inaccuracies or defects in the information,
              software, communication lines, internet, computer hardware or
              software, or any other service or device used to access the EHR
              Patient Portal. In case of any inaccuracies or defects, the signed
              official results available in the Medical Center should be relied
              upon; and
            </li>
            <li class="q-mb-md" align="justify">
              The Medical Center reserves the right to modify the Terms and
              Conditions anytime. For this reason, periodic review of the Terms
              and Conditions is needed. Continued use of the EHR Patient Portal
              after such changes will be deemed acceptance of the changes.
            </li>
          </ul>
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
  name: "PrivacyPolicy",
});
</script>
