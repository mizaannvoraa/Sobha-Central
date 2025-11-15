"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaUser, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Modal({ countryFromURL, onClose, isOpen }) {
  const [trackingParams, setTrackingParams] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname(); // ✅ Needed to read the path

  const [phoneCountry, setPhoneCountry] = useState("ae");

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
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const keys = [
        "utm_source", "utm_ad", "utm_campaign", "utm_placement",
        "utm_keyword", "gclid", "fbclid"
      ];
      const extracted = {};
      keys.forEach((key) => {
      const urlValue = query.get(key);
      if (urlValue) {
        extracted[key] = urlValue;
        localStorage.setItem(key, urlValue);
      } else {
        extracted[key] = localStorage.getItem(key) || "";
      }
    });
      setTrackingParams(extracted);
    }
  }, []);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
     phone: Yup.string()
  .required("Phone number is required")
  .test("is-valid-phone", "Phone number is invalid", value => {
    const digitsOnly = value.replace(/\D/g, ""); // remove non-digits
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setStatus("Submitting...");

      const fullData = {
        name: values.name,
        mobile: `+${values.phone}`,
        email: values.email,
        ...trackingParams,
      };

      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbzyV65VjevZ4lxvEFE_JmhT4PUMjVq79Te524VR4so_wxe49wiT7qec107J3AGcI_VL/exec",
          {
            method: "POST",
            body: JSON.stringify(fullData),
          }
        );

        const crmResponse = await fetch(
          "https://api.cparamount.com/leads/web-hook/campaigns?access_token=YUFZVDMSFFQKNDYWZKRLYBDIA",
          {
            method: "POST",
            headers: {
              Accept: "*/*",
              "User-Agent": "Thunder Client",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: fullData.name,
              mobile: fullData.mobile,
              email: fullData.email,
              source: fullData.utm_source || "Google",
              // campaign: fullData.utm_campaign || "",
               campaign: "Sobha_Central",
              notes: `
UTM Source: ${fullData.utm_source || ""}
UTM Campaign: ${fullData.utm_campaign || ""}
UTM Ad: ${fullData.utm_ad || ""}
UTM Placement: ${fullData.utm_placement || ""}
GCLID: ${fullData.gclid || ""}
FBCLID: ${fullData.fbclid || ""}
UTM Keywords: ${fullData.utm_keyword || ""}`,
            }),
          }
        );

        const crmJson = await crmResponse.json();
        console.log("CRM Response", crmJson);
        resetForm();
        router.push("/thankyou");
        setTimeout(onClose, 2000);
      } catch (err) {
        console.error("Submission Error", err);
        setStatus("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-80 z-0" />

      <div className="relative z-10 bg-[#353535] text-white rounded-lg w-full max-w-[600px] px-6 py-7 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl hover:text-red-600"
        >
          &times;
        </button>

        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
          <Image src="/assets/Banner_Logo.webp" alt="Logo" width={40} height={40} />
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-white uppercase text-xl font-extralight tracking-[3px]">
            Express Your Interest
          </h2>
          <p className="text-sm mt-1 font-sans font-light">
            Please Enter Your Details To Know More About Sobha
          </p>
        </div>

        {status && (
          <div className={`text-center font-medium my-4 text-sm ${status.includes("success") ? "text-green-500" : "text-red-500"}`}>
            {status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-4 md:flex-row flex-col justify-between">
            <div className="flex flex-col w-full">
              <div className="flex items-center bg-white rounded-md overflow-hidden">
                <div className="bg-white p-3 rounded">
                  <FaUser className="text-[#D2A23A]" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="w-full px-3 py-2 text-[#222222] text-base placeholder:text-[#222222] focus:outline-none"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 mt-[2px] text-sm ml-2">{formik.errors.name}</div>
              )}
            </div>

            <div className="flex flex-col w-full">
              <div className="flex items-center bg-white rounded-md overflow-hidden">
                <div className="bg-white p-3 rounded">
                  <FaPhoneAlt className="text-[#D2A23A]" />
                </div>
                <div className="flex-1">
                 <PhoneInput
  country={phoneCountry}
  value={formik.values.phone}
  onChange={(value) => formik.setFieldValue("phone", value)}
  inputProps={{
    name: "phone",
    required: true,
    onBlur: () => formik.setFieldTouched("phone", true),
  }}
  enableSearch
  disableAreaCodes={true}
  enableLongNumbers={true}
  isValid={(value, country) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }}
  containerClass="flex-1 !bg-transparent !border-0"
  inputClass="!w-full !text-[15px] !font-[400] !font-oswald !bg-transparent !shadow-none !text-black !border-none focus:!ring-0 focus:!outline-none"
  buttonClass="!bg-transparent !border-0"
  dropdownClass="!text-black"
/>
{/* <PhoneInput
  country={phoneCountry}
  value={formik.values.phone}
  onChange={(value) => formik.setFieldValue("phone", value)}
  inputProps={{
    name: "phone",
    required: true,
    onBlur: () => formik.setFieldTouched("phone", true),
  }}
  enableSearch
  disableAreaCodes={true}
  enableLongNumbers={true}
  isValid={(value, country) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }}
/> */}


                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 mt-[2px] text-sm ml-2">{formik.errors.phone}</div>
              )}
            </div>
          </div>

          <div className="flex-col flex">
            <div className="flex items-center bg-white rounded-md overflow-hidden">
              <div className="bg-white p-3 rounded">
                <FaEnvelope className="text-[#D2A23A]" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full px-3 py-2 text-[#222222] placeholder:text-[#222222] focus:outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-[2px] text-sm ml-2">{formik.errors.email}</div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full max-w-[125px] py-[6px] cursor-pointer font-semibold rounded-md text-white tracking-widest text-lg transition duration-200 ${
                isSubmitting ? "bg-gray-400" : "bg-[#D2A23A] hover:bg-yellow-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
