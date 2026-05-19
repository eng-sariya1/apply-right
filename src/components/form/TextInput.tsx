import {Controller, type Control, type FieldValues} from "react-hook-form";
import {InputText} from "primereact/inputtext";

const TextInput = ({label, name, control, dataCy, placeholder}: {
    label: string,
    name: string,
    control: Control<FieldValues>,
    dataCy: string,
    placeholder: string
}) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">{label}</label>
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <InputText
                        {...field}
                        className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                        placeholder={placeholder}
                        data-cy={dataCy}
                    />
                )}
            />
        </div>
    )
}
export default TextInput;