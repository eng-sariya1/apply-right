import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';
import type { CVData } from '../types/cv.types';

interface CVFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: CVData) => void;
  initialData?: CVData;
}

const jobTypeOptions = [
  { label: 'Full time', value: 'Full time' },
  { label: 'Part time', value: 'Part time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Freelance', value: 'Freelance' }
];

export default function CVForm({ visible, onHide, onSubmit, initialData }: CVFormProps) {
  const defaultValues: CVData = initialData || {
    header: {
      fullName: '',
      specialization: '',
      email: '',
      phone: '',
      links: []
    },
    abstract: '',
    skills: [],
    career: [],
    personalProjects: [],
    education: ''
  };

  const { control, handleSubmit, formState: { errors }, reset } = useForm<CVData>({
    defaultValues
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'header.links'
  });

  const { fields: careerFields, append: appendCareer, remove: removeCareer } = useFieldArray({
    control,
    name: 'career'
  });

  const { fields: personalProjectFields, append: appendPersonalProject, remove: removePersonalProject } = useFieldArray({
    control,
    name: 'personalProjects'
  });

  const onFormSubmit = (data: CVData) => {
    onSubmit(data);
    onHide();
  };

  const onReset = () => {
    reset(defaultValues);
  };

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      className="w-72
      "
      header={<h2 className="text-2xl font-bold text-yellow-500">CV Builder Form</h2>}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 p-4">
        {/* Header Section */}
        <div className="card p-4 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Personal Information</h3>

          <div className="flex flex-col gap-4">
            <div className="field">
              <label htmlFor="fullName" className="block mb-2 text-yellow-600">Full Name *</label>
              <Controller
                name="header.fullName"
                control={control}
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <InputText
                    id="fullName"
                    {...field}
                    className="w-full"
                    placeholder="John Doe"
                  />
                )}
              />
              {errors.header?.fullName && (
                <small className="text-red-500">{errors.header.fullName.message}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="specialization" className="block mb-2 text-yellow-600">Specialization *</label>
              <Controller
                name="header.specialization"
                control={control}
                rules={{ required: 'Specialization is required' }}
                render={({ field }) => (
                  <InputText
                    id="specialization"
                    {...field}
                    className="w-full"
                    placeholder="Software Engineer"
                  />
                )}
              />
              {errors.header?.specialization && (
                <small className="text-red-500">{errors.header.specialization.message}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="email" className="block mb-2 text-yellow-600">Email *</label>
              <Controller
                name="header.email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <InputText
                    id="email"
                    {...field}
                    className="w-full"
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                )}
              />
              {errors.header?.email && (
                <small className="text-red-500">{errors.header.email.message}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="phone" className="block mb-2 text-yellow-600">Phone Number *</label>
              <Controller
                name="header.phone"
                control={control}
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <InputText
                    id="phone"
                    {...field}
                    className="w-full"
                    placeholder="+1234567890"
                  />
                )}
              />
              {errors.header?.phone && (
                <small className="text-red-500">{errors.header.phone.message}</small>
              )}
            </div>

            {/* Links */}
            <Divider />
            <div className="field">
              <div className="flex justify-between items-center mb-3">
                <label className="text-yellow-600 font-semibold">Links</label>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label="Add Link"
                  size="small"
                  onClick={() => appendLink({ name: '', url: '' })}
                />
              </div>
              {linkFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-3 p-3 bg-gray-800 rounded">
                  <div className="flex-1">
                    <Controller
                      name={`header.links.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <InputText
                          {...field}
                          className="w-full mb-2"
                          placeholder="Link Name (e.g., LinkedIn)"
                        />
                      )}
                    />
                    <Controller
                      name={`header.links.${index}.url`}
                      control={control}
                      render={({ field }) => (
                        <InputText
                          {...field}
                          className="w-full"
                          placeholder="https://..."
                        />
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    onClick={() => removeLink(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Abstract Section */}
        <div className="card p-4 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Abstract</h3>
          <div className="field">
            <Controller
              name="abstract"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  rows={6}
                  className="w-full"
                  placeholder="Write a brief summary about yourself..."
                />
              )}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="card p-4 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Skills</h3>
          <div className="field">
            <label htmlFor="skills" className="block mb-2 text-yellow-600">Add your skills</label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Chips
                  id="skills"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  className="w-full"
                  placeholder="Type and press Enter to add skills"
                />
              )}
            />
            <small className="text-gray-400 mt-2 block">
              Type a skill and press Enter. Examples: React, TypeScript, Node.js
            </small>
          </div>
        </div>

        {/* Career Section */}
        <div className="card p-4 bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-yellow-500">Career</h3>
            <Button
              type="button"
              icon="pi pi-plus"
              label="Add Career"
              onClick={() => appendCareer({
                startDate: '',
                endDate: null,
                isPresent: false,
                location: '',
                companyName: '',
                workSpecialization: '',
                jobType: 'Full time',
                summarization: '',
                projects: []
              })}
            />
          </div>

          <Accordion multiple>
            {careerFields.map((field, careerIndex) => (
              <AccordionTab
                key={field.id}
                header={
                  <div className="flex justify-between items-center w-full">
                    <span>Career Entry {careerIndex + 1}</span>
                    <Button
                      type="button"
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      outlined
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCareer(careerIndex);
                      }}
                    />
                  </div>
                }
              >
                <CareerFields control={control} careerIndex={careerIndex} errors={errors} />
              </AccordionTab>
            ))}
          </Accordion>
        </div>

        {/* Personal Projects Section */}
        <div className="card p-4 bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-yellow-500">Personal Projects</h3>
            <Button
              type="button"
              icon="pi pi-plus"
              label="Add Project"
              onClick={() => appendPersonalProject({
                title: '',
                description: '',
                technologies: '',
                keyFeatures: []
              })}
            />
          </div>

          <Accordion multiple>
            {personalProjectFields.map((field, projectIndex) => (
              <AccordionTab
                key={field.id}
                header={
                  <div className="flex justify-between items-center w-full">
                    <span>Project {projectIndex + 1}</span>
                    <Button
                      type="button"
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      outlined
                      onClick={(e) => {
                        e.stopPropagation();
                        removePersonalProject(projectIndex);
                      }}
                    />
                  </div>
                }
              >
                <PersonalProjectFields control={control} projectIndex={projectIndex} errors={errors} />
              </AccordionTab>
            ))}
          </Accordion>
        </div>

        {/* Education Section */}
        <div className="card p-4 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Education</h3>
          <div className="field">
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  rows={4}
                  className="w-full"
                  placeholder="Describe your education..."
                />
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 sticky bottom-0 bg-gray-800 p-4 rounded-lg">
          <Button type="submit" label="Generate CV" icon="pi pi-check" className="flex-1" />
          <Button type="button" label="Reset" icon="pi pi-refresh" severity="secondary" onClick={onReset} />
          <Button type="button" label="Cancel" icon="pi pi-times" severity="danger" outlined onClick={onHide} />
        </div>
      </form>
    </Sidebar>
  );
}

// Career Fields Component
function CareerFields({ control, careerIndex, errors }: any) {
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: `career.${careerIndex}.projects`
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="field">
          <label className="block mb-2 text-yellow-600">Start Date</label>
          <Controller
            name={`career.${careerIndex}.startDate`}
            control={control}
            render={({ field }) => (
              <InputText {...field} className="w-full" placeholder="Jan 2020" />
            )}
          />
        </div>

        <div className="field">
          <label className="block mb-2 text-yellow-600">End Date</label>
          <Controller
            name={`career.${careerIndex}.endDate`}
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                value={field.value || ''}
                className="w-full"
                placeholder="Dec 2022"
              />
            )}
          />
        </div>
      </div>

      <div className="field">
        <Controller
          name={`career.${careerIndex}.isPresent`}
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                inputId={`present-${careerIndex}`}
                checked={field.value}
                onChange={(e) => field.onChange(e.checked)}
              />
              <label htmlFor={`present-${careerIndex}`} className="text-yellow-600">I currently work here</label>
            </div>
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Location</label>
        <Controller
          name={`career.${careerIndex}.location`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="New York, USA" />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Company Name</label>
        <Controller
          name={`career.${careerIndex}.companyName`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="Company Inc." />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Work Specialization</label>
        <Controller
          name={`career.${careerIndex}.workSpecialization`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="Frontend Developer" />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Job Type</label>
        <Controller
          name={`career.${careerIndex}.jobType`}
          control={control}
          render={({ field }) => (
            <Dropdown
              {...field}
              options={jobTypeOptions}
              className="w-full"
              placeholder="Select job type"
            />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Work Summary</label>
        <Controller
          name={`career.${careerIndex}.summarization`}
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={4}
              className="w-full"
              placeholder="Describe your work..."
            />
          )}
        />
      </div>

      <Divider />

      {/* Projects within Career */}
      <div className="field">
        <div className="flex justify-between items-center mb-3">
          <label className="text-yellow-600 font-semibold">Projects</label>
          <Button
            type="button"
            icon="pi pi-plus"
            label="Add Project"
            size="small"
            onClick={() => appendProject({
              name: '',
              description: '',
              technologies: '',
              keyContributions: []
            })}
          />
        </div>

        {projectFields.map((field, projectIndex) => (
          <div key={field.id} className="mb-4 p-3 bg-gray-800 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-yellow-500 font-semibold">Project {projectIndex + 1}</span>
              <Button
                type="button"
                icon="pi pi-trash"
                severity="danger"
                size="small"
                outlined
                onClick={() => removeProject(projectIndex)}
              />
            </div>

            <ProjectFields control={control} careerIndex={careerIndex} projectIndex={projectIndex} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Project Fields Component (for career projects)
function ProjectFields({ control, careerIndex, projectIndex }: any) {
  return (
    <div className="flex flex-col gap-3">
      <div className="field">
        <label className="block mb-2 text-yellow-600">Project Name</label>
        <Controller
          name={`career.${careerIndex}.projects.${projectIndex}.name`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="Project name" />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Description</label>
        <Controller
          name={`career.${careerIndex}.projects.${projectIndex}.description`}
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={3}
              className="w-full"
              placeholder="Project description"
            />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Technologies</label>
        <Controller
          name={`career.${careerIndex}.projects.${projectIndex}.technologies`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="React, TypeScript, Node.js" />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Key Contributions</label>
        <Controller
          name={`career.${careerIndex}.projects.${projectIndex}.keyContributions`}
          control={control}
          render={({ field }) => (
            <Chips
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              className="w-full"
              placeholder="Type and press Enter"
            />
          )}
        />
      </div>
    </div>
  );
}

// Personal Project Fields Component
function PersonalProjectFields({ control, projectIndex, errors }: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="field">
        <label className="block mb-2 text-yellow-600">Project Title</label>
        <Controller
          name={`personalProjects.${projectIndex}.title`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="My Awesome Project" />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Description</label>
        <Controller
          name={`personalProjects.${projectIndex}.description`}
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={4}
              className="w-full"
              placeholder="Describe your project..."
            />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Technologies</label>
        <Controller
          name={`personalProjects.${projectIndex}.technologies`}
          control={control}
          render={({ field }) => (
            <InputText {...field} className="w-full" placeholder="React, Firebase, TailwindCSS" />
          )}
        />
      </div>

      <div className="field">
        <label className="block mb-2 text-yellow-600">Key Features</label>
        <Controller
          name={`personalProjects.${projectIndex}.keyFeatures`}
          control={control}
          render={({ field }) => (
            <Chips
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              className="w-full"
              placeholder="Type and press Enter to add features"
            />
          )}
        />
      </div>
    </div>
  );
}
