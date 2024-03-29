import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase";

const YoklamaOlustur = () => {
  const [yoklamaKodu, setYoklamaKodu] = useState("");
  const [existingKodlar, setExistingKodlar] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [basarili, setBasarili] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const correctAdminPassword = "test";

  useEffect(() => {
    const yoklamalarRef = collection(firestore, "yoklama");
    const getExistingKodlar = async () => {
      try {
        const querySnapshot = await getDocs(yoklamalarRef);
        const kodlar = querySnapshot.docs.map((doc) => doc.data().kod);
        setExistingKodlar(kodlar);
      } catch (error) {
        console.error("Verileri çekerken hata oluştu:", error);
      }
    };
    getExistingKodlar();
  }, []);

  const handleYoklamaOlustur = async () => {
    if (adminPassword !== correctAdminPassword) {
      setErrorMessage("Yoklama oluşturmak için gereken şifre yanlış.");
      return;
    }

    if (!yoklamaKodu) {
      setErrorMessage("Yoklama kodunu boş bırakmayınız.");
      return;
    }

    if (existingKodlar.includes(yoklamaKodu)) {
      setErrorMessage("Zaten bu kod ile bir yoklama oluşturulmuş");
      return;
    }

    setErrorMessage("");
    setBasarili("");

    const yoklamalarRef = collection(firestore, "yoklama");

    try {
      const docRef = await addDoc(yoklamalarRef, {
        kod: yoklamaKodu,
        olusturan: auth.currentUser.uid,
        katilanlar: [],
        olusturulmaTarihi: new Date(),
      });

      setBasarili("Yoklama Başarıyla Oluşturuldu, Yoklama Kodu " + yoklamaKodu);
    } catch (error) {
      console.error("Yoklama oluşturulurken hata oluştu:", error);
    }
  };

  return (
    <div className="flex flex-col w-full mt-10">
      <img
        className="w-64 ml-auto mr-auto"
        src="https://www.linkpicture.com/q/logo_18.jpg"
        alt="Logo"
      />
      <form className="flex flex-col items-center">
        <input
          className="p-4 w-72 lg:w-96 shadow-2xl border border-blue-100 appearance-none bg-gray-200 rounded-none rounded-t-md t-20"
          placeholder="Yoklama Kodu"
          value={yoklamaKodu}
          onChange={(e) => setYoklamaKodu(e.target.value)}
          required
        />
        <input
          className="p-4 w-72 lg:w-96 shadow-2xl border border-blue-100 appearance-none bg-gray-200 rounded-none rounded-b-md t-20"
          placeholder="Şifre"
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
      </form>
      <button
        className="rounded-none mx-auto mt-5 rounded-t-lg p-4 w-72 lg:w-96 shadow-2xl border border-blue-100 bg-gray-200 hover:bg-gray-400 "
        onClick={handleYoklamaOlustur}
      >
        Yoklama Oluştur
      </button>
      <Link
        to="/ogrenci-listesi"
        className="rounded-none text-center mx-auto p-4 w-72 lg:w-96 shadow-2xl border border-blue-100 bg-gray-200 hover:bg-gray-400 "
      >
        Öğrenci Listesi
      </Link>
      <Link
        to="/yoklama-gecmisi"
        className="rounded-none text-center mx-auto rounded-b-lg p-4 w-72 lg:w-96 shadow-2xl border border-blue-100 bg-gray-200 hover:bg-gray-400 "
      >
        Geçmiş Yoklamalar
      </Link>
      {errorMessage && (
        <p className="text-red-600 mt-2 text-center">{errorMessage}</p>
      )}
      {basarili && (
        <p className="text-green-600 mt-2 text-center">{basarili}</p>
      )}
      <Footer />
    </div>
  );
};

export default YoklamaOlustur;
