import {Controller} from "react-hook-form";
import {Checkbox} from "primereact/checkbox";

const CheckboxInput = ({label, name, control, inputId}: {
    label: string,
    name: string,
    control: any,
    inputId: string
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field}) => (
                <div className="flex items-center gap-2">
                    <Checkbox
                        inputId={inputId}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.checked)}
                    />
                    <label htmlFor={inputId} className="text-sm text-[#5A6A6F]">{label}</label>
                </div>
            )}
        />
    )
}
export default CheckboxInput;
