"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaUser, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter, usePathname } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .required("Phone number is required")
    .test("is-valid-phone", "Phone number is invalid", (value) => {
      const digitsOnly = value.replace(/\D/g, ""); // remove non-digits
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const extractTrackingParams = () => {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get("utm_source") || "",
    utm_ad: urlParams.get("utm_ad") || "",
    utm_campaign: urlParams.get("utm_campaign") || "",
    utm_placement: urlParams.get("utm_placement") || "",
    utm_keyword: urlParams.get("utm_keyword") || "",
    gclid: urlParams.get("gclid") || "",
    fbclid: urlParams.get("fbclid") || "",
  };
};

export default function ContactForm({ countryFromURL }) {
  const [trackingParams, setTrackingParams] = useState({});
  const [phoneCountry, setPhoneCountry] = useState("ae");
  const router = useRouter();
  const pathname = usePathname();

  const countryCodeMap = {
    canada: "ca",
    usa: "us",
    india: "in",
    dubai: "ae",
    uae: "ae",
    uk: "gb",
    london: "gb",
    birhim: "bh",
    birmingham: "gb",
    france: "fr",
    paris: "fr",
    germany: "de",
  };

  const getPhoneCountryCode = (country) => {
    return countryCodeMap[country?.toLowerCase()] || "ae";
  };

  const getCountryFromPath = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || countryFromURL || "ae";
  };

  useEffect(() => {
    const countryFromPath = getCountryFromPath();
    setPhoneCountry(getPhoneCountryCode(countryFromPath));
  }, [pathname, countryFromURL]);

  useEffect(() => {
    const params = extractTrackingParams();
    setTrackingParams(params);
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const payload = { ...values, ...trackingParams };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbzyV65VjevZ4lxvEFE_JmhT4PUMjVq79Te524VR4so_wxe49wiT7qec107J3AGcI_VL/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const {
        name,
        mobile,
        email,
        utm_source,
        utm_campaign,
        utm_ad,
        utm_placement,
        utm_keyword,
        gclid,
        fbclid,
      } = payload;

      await fetch(
        "https://api.cparamount.com/leads/web-hook/campaigns?access_token=YUFZVDMSFFQKNDYWZKRLYBDIA",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            mobile,
            email,
            source: utm_source || "Google",
            // campaign: "Sobha_Central",
            campaign: utm_campaign || "Sobha_Central",
            notes: `
UTM Source: ${utm_source || ""}
UTM Campaign: ${utm_campaign || ""}
UTM Ad: ${utm_ad || ""}
UTM Placement: ${utm_placement || ""}
GCLID: ${gclid || ""}
FBCLID: ${fbclid || ""}
UTM Keywords: ${utm_keyword || ""}`,
          }),
        }
      );

      resetForm();
      router.push("/thankyou");
    } catch (err) {
      console.error("Form submission error:", err);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/ContImage.webp')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center text-white px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <div className="w-28 mx-auto">
            <Image
              src="/assets/Banner_Logo.webp"
              width={112}
              height={112}
              alt="Slider Logo"
              className="opacity-70"
            />
          </div>
          <h2 className="text-3xl mb-2 font-extralight">CONTACT US</h2>
          <div className="h-1 w-24 bg-yellow-500 mx-auto mb-4" />
          <p className="text-sm md:text-base font-extralight">
            Please Enter Your Details To Know More About Sobha Central
          </p>
        </div>

        <Formik
          initialValues={{
            name: "",
            mobile: "",
            email: "",
            ...trackingParams,
          }}
          validationSchema={ContactSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="w-full max-w-4xl space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FaUser className="absolute top-4 left-3 text-[#B18613]" />
                  <Field
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="pl-10 py-3 w-full rounded-md bg-white text-black outline-none"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div className="relative flex-1">
                  <div className="flex items-center bg-white text-black rounded-md border px-3 py-[5.5px]">
                    <FaPhoneAlt className="text-[#D2A23A] mr-2" />
                    <PhoneInput
                      country={phoneCountry}
                      value={values.mobile}
                      onChange={(phone) => setFieldValue("mobile", phone)}
                      inputStyle={{
                        width: "100%",
                        fontSize: "1rem",
                        border: "none",
                        fontWeight: "400",
                        fontFamily: "oswald",
                        background: "transparent",
                        boxShadow: "none",
                        color: "black",
                      }}
                      buttonStyle={{
                        border: "none",
                        background: "transparent",
                      }}
                      containerStyle={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                      }}
                      enableSearch
                      disableAreaCodes={true}
                      enableLongNumbers={true}
                      isValid={(value, country) => {
                        const digits = value.replace(/\D/g, "");
                        return digits.length >= 10 && digits.length <= 15;
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="relative">
                <FaEnvelope className="absolute top-4 left-3 text-[#B18613]" />
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10 py-3 w-full rounded-md bg-white text-black outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Hidden fields for tracking */}
              {Object.keys(trackingParams).map((key) => (
                <Field
                  key={key}
                  type="hidden"
                  name={key}
                  value={trackingParams[key]}
                />
              ))}

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#CAAD5E] cursor-pointer text-white font-medium px-6 py-2 rounded-md tracking-widest hover:bg-[#b8a675] transition"
                >
                  {isSubmitting ? "Submitting..." : "SUBMIT"}
                </button>
                <p className="mt-4 text-xl font-bold">
                  Call :{" "}
                  <span className="text-yellow-400">+971 56 531 1811</span>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
