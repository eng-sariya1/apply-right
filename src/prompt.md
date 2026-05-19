
src/components/CVFormTemplate2.tsx:31:7 - error TS6133: 'jobTypeOptions' is declared but its value is never read.

31 const jobTypeOptions = [
~~~~~~~~~~~~~~

src/components/CVFormTemplate2.tsx:691:30 - error TS2741: Property 'dataCy' is missing in type '{ label: string; name: string; control: any; placeholder: string; }' but required in type '{ label: string; name: string; control: any; dataCy: string; placeholder: string; }'.

691                             <TextInput label="Project Name" name={`career.${careerIndex}.projects.${projIndex}.name`} control={control} placeholder="Project Name"/>
~~~~~~~~~

src/components/form/TextInput.tsx:8:5
8     dataCy: string,
~~~~~~
'dataCy' is declared here.

src/components/CVFormTemplate2.tsx:692:30 - error TS2741: Property 'dataCy' is missing in type '{ name: string; control: any; placeholder: string; rows: number; }' but required in type '{ label?: string | undefined; name: string; control: any; dataCy: string; placeholder: string; rows?: number | undefined; }'.

692                             <TextAreaInput name={`career.${careerIndex}.projects.${projIndex}.description`} control={control} placeholder="Project description..." rows={2}/>   
~~~~~~~~~~~~~

src/components/form/TextAreaInput.tsx:8:5
8     dataCy: string,
~~~~~~
'dataCy' is declared here.

src/components/CVFormTemplate3.tsx:631:30 - error TS2741: Property 'dataCy' is missing in type '{ label: string; name: string; control: any; placeholder: string; }' but required in type '{ label: string; name: string; control: any; dataCy: string; placeholder: string; }'.

631                             <TextInput label="Project Name" name={`career.${careerIndex}.projects.${projIndex}.name`} control={control} placeholder="Project Name"/>
~~~~~~~~~

src/components/form/TextInput.tsx:8:5
8     dataCy: string,
~~~~~~
'dataCy' is declared here.

src/components/CVFormTemplate3.tsx:632:30 - error TS2741: Property 'dataCy' is missing in type '{ name: string; control: any; placeholder: string; rows: number; }' but required in type '{ label?: string | undefined; name: string; control: any; dataCy: string; placeholder: string; rows?: number | undefined; }'.

632                             <TextAreaInput name={`career.${careerIndex}.projects.${projIndex}.description`} control={control} placeholder="Project description..." rows={2}/>   
~~~~~~~~~~~~~

src/components/form/TextAreaInput.tsx:8:5
8     dataCy: string,
~~~~~~
'dataCy' is declared here.


Found 5 errors.
