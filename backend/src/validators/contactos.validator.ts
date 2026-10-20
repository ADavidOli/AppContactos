
import { body } from "express-validator";
import { handleValidationError } from "../middleware/validator.middleware.js";

export class ContactValidator {
    static get saveContacto() {
        return [
            body("name")
                .trim()
                .notEmpty()
                .withMessage("El nombre no puede ir vacío"),

            body("email")
                .optional({ values: "falsy" })
                .trim()
                .isEmail()
                .withMessage("El correo no es válido"),

            body("telefono")
                .trim()
                .notEmpty()
                .withMessage("El número de teléfono no puede ir vacío")
                .bail()
                .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
                .withMessage("Por favor, ingresa un número de teléfono válido"),

            handleValidationError
        ];
    }

    static get updateContacto() {
        return [
            body("name")
                .optional()
                .trim()
                .notEmpty()
                .withMessage("El nombre no puede estar vacío"),

            body("email")
                .optional({ values: "falsy" })
                .trim()
                .isEmail()
                .withMessage("El correo no es válido"),

            body("telefono")
                .optional()
                .trim()
                .notEmpty()
                .withMessage("El teléfono no puede estar vacío")
                .bail()
                .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
                .withMessage("Por favor, ingresa un número de teléfono válido"),

            handleValidationError
        ];
    }
}
