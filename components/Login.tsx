import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error message

  const handleLoginClick = () => {
    setLogin(!login);
  };

  const handleSubmit = async (values: { usuario: string; clave: string }) => {
    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.usuario,
            password: values.clave,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);

        router.push("/dashboard");
      } else if (response.status === 401) {
        // Unauthorized status
        console.error("Login failed:", response.status, response.statusText);
        setError("Credenciales incorrectas"); // Set error message

        // Clear form fields
        values.usuario = "";
        values.clave = "";
      } else {
        console.error("Login failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckbox = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen dark:bg-black bg-white">
        <div className="bg-white dark:bg-black min-w-[20rem]">
          <div className="flex justify-center items-center mb-10">
            <img src="/a.png" alt="Solana" />
          </div>

          <Formik
            initialValues={{ usuario: "", clave: "" }}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: any = {};

              if (!values.usuario) {
                errors.usuario = "Digite el usuario";
              }

              if (!values.clave) {
                errors.clave = "Digite la clave";
              }

              return errors;
            }}
          >
            <Form>
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="usuario"
                  className="block mb-2 font-bold dark:text-white text-sm w-full"
                >
                  Usuario:
                </label>
                <Field
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="Usuario"
                  className="block w-full px-6 py-3 dark:text-white dark:bg-black text-black bg-white border border-neutral-100 rounded-3xl appearance-none placeholder:text-neutral-400 dark:placeholder:text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage
                  name="usuario"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="clave"
                  className="block mb-2 font-bold dark:text-white text-sm"
                >
                  Clave:
                </label>
                <Field
                  id="clave"
                  name="clave"
                  type={!showPassword ? "password" : "text"}
                  placeholder="Clave"
                  className="block w-full px-6 py-3 dark:text-white dark:bg-black text-black bg-white border border-neutral-100 rounded-3xl appearance-none placeholder:text-neutral-400 dark:placeholder:text-neutral-100 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage
                  name="clave"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="flex my-3">
                <input
                  id="showPassword"
                  type="checkbox"
                  className="h-5 w-5 text-blue-500 checked:bg-purple-500 border-blue-500 dark:bg-purple-500 dark:border-blue-500 dark:checked:bg-blue-500"
                  onChange={handleCheckbox}
                />

                <label
                  className="ml-2 text-black dark:text-white"
                  htmlFor="showPassword"
                >
                  Mostrar clave
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="items-center justify-center w-full px-6 py-2.5 text-center hover:dark:border-neutral-100 dark:text-black hover:dark:text-white dark:bg-white text-white duration-200 p-3 mb-3 bg-black border-2 border-black rounded-3xl inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
                  disabled={submitting}
                >
                  {submitting ? "Enviando" : "Entrar"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
