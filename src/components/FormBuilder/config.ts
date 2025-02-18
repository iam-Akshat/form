/**
 * By default a form field will ask for
 * Name of field (Used as name by react-hook-form)
 * Title of the question (This will be label)
 * Type of field and based on type selected a variant drop down may also be shown
 *  - Text
 *  - Number
 *      - Years
 *      - Temperature
 *  - Select
 * Each field also will have an option for marking it as required
 *
 * Additionnally each field may also have its own set of validations, for example text will have min length and maxLength, whereas number will have min and max
 * In summary for the form builder we need it to be declarative approach, where I define the field type and its related validations along with variants.
 */
