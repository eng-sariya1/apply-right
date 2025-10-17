import {Controller} from "react-hook-form";
import {InputTextarea} from "primereact/inputtextarea";

const TextAreaInput = ({label, name, control, dataCy, placeholder, rows = 4}: {
    label?: string,
    name: string,
    control: any,
    dataCy: string,
    placeholder: string,
    rows?: number
}) => {
    return (
        <div>
            {label && <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">{label}</label>}
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <InputTextarea
                        {...field}
                        rows={rows}
                        className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                        placeholder={placeholder}
                        data-cy={dataCy}
                    />
                )}
            />
        </div>
    )
}
export default TextAreaInput;
