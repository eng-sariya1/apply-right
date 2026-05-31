import {Controller, type Control, type FieldValues} from "react-hook-form";
import {Chips} from "primereact/chips";

const ChipsInput = ({label, name, control, dataCy, placeholder}: {
    label?: string,
    name: string,
    control: Control<FieldValues>,
    dataCy?: string,
    placeholder: string
}) => {
    return (
        <div>
            {label && <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">{label}</label>}
            <div data-cy={dataCy}>
                <Controller
                    name={name}
                    control={control}
                    render={({field}) => (
                        <Chips
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            className="w-full"
                            placeholder={placeholder}
                        />
                    )}
                />
            </div>
        </div>
    )
}
export default ChipsInput;
