import {Controller, type Control, type FieldValues} from "react-hook-form";
import {Dropdown} from "primereact/dropdown";

const DropdownInput = ({label, name, control, dataCy, placeholder, options}: {
    label: string,
    name: string,
    control: Control<FieldValues>,
    dataCy: string,
    placeholder: string,
    options: { label: string; value: string }[]
}) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">{label}</label>
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <Dropdown
                        {...field}
                        options={options}
                        className="w-full"
                        placeholder={placeholder}
                        data-cy={dataCy}
                    />
                )}
            />
        </div>
    )
}
export default DropdownInput;
