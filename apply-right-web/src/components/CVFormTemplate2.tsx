import {useForm, useFieldArray, Controller, type Control, type FieldValues, type UseFormWatch, type UseFormSetValue} from 'react-hook-form';
import {useEffect, useState, useRef} from 'react';
import {motion} from 'framer-motion';
import {Accordion, AccordionTab} from 'primereact/accordion';
import {ColorPicker} from 'primereact/colorpicker';
import {Sparkles, Plus, Trash2, Zap, Upload, X, FileText, Eye, Camera} from 'lucide-react';
import {Dialog} from 'primereact/dialog';
import type {CVData} from '../types/cv.types';
import {useGemini} from '../hooks/useGemini';
import {useGeminiCareer} from '../hooks/useGeminiCareer';
import {useGeminiEducation} from '../hooks/useGeminiEducation';
import {useGeminiATS} from '../hooks/useGeminiATS';
import {useGeminiCVParser} from '../hooks/useGeminiCVParser';
import {useNavigate} from "react-router-dom";
import {useToast} from '../context/ToastContext';
import {FileUpload, type FileUploadSelectEvent} from "primereact/fileupload";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import TextInput from "./form/TextInput.tsx";
import TextAreaInput from "./form/TextAreaInput.tsx";
import DropdownInput from "./form/DropdownInput.tsx";
import CheckboxInput from "./form/CheckboxInput.tsx";
import ChipsInput from "./form/ChipsInput.tsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface CVFormTemplate2Props {
    onSubmit: (data: CVData) => void;
    initialData?: CVData;
}

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    file: File;
}

export default function CVFormTemplate2({onSubmit, initialData}: CVFormTemplate2Props) {
    const defaultValues: CVData = initialData || {
        header: {
            fullName: '',
            specialization: '',
            email: '',
            phone: '',
            links: [],
            address: '',
            photoUrl: ''
        },
        abstract: '',
        skills: [],
        career: [],
        personalProjects: [],
        education: '',
        sectionTitleColor: '017A8C',
        templateId: 'template2',
        additionalInfo: ''
    };

    const navigate = useNavigate();
    const {showToast} = useToast();
    // RHF's Control/UseForm* generics are invariant; the shared field wrappers
    // are typed against the generic FieldValues. Erase the type once here —
    // runtime is unchanged (same function references).
    const form = useForm<CVData>({defaultValues});
    const control = form.control as unknown as Control<FieldValues>;
    const watch = form.watch as unknown as UseFormWatch<FieldValues>;
    const setValue = form.setValue as unknown as UseFormSetValue<FieldValues>;

    // File upload state
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [isExtracting, setIsExtracting] = useState<boolean>(false);
    const [showTextDialog, setShowTextDialog] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');
    const fileUploadRef = useRef<FileUpload>(null);

    // Photo state
    const [photoPreview, setPhotoPreview] = useState<string>(initialData?.header.photoUrl || '');

    const {improveText, isLoading} = useGemini();
    const {improveText: improveEducationText, isLoading: isEducationLoading} = useGeminiEducation();
    const {isLoading: isATSLoading} = useGeminiATS();
    const {parseCV, isLoading: isParsing, error: parseError} = useGeminiCVParser();

    // Sync photoPreview when initialData changes
    useEffect(() => {
        if (initialData?.header.photoUrl) {
            setPhotoPreview(initialData.header.photoUrl);
        }
    }, [initialData?.header.photoUrl]);

    // Real-time form sync
    useEffect(() => {
        const subscription = watch((data) => {
            onSubmit(data as CVData);
        });
        return () => subscription.unsubscribe();
    }, [watch, onSubmit]);

    const {fields: linkFields, append: appendLink, remove: removeLink} = useFieldArray({
        control,
        name: 'header.links'
    });

    const {fields: careerFields, append: appendCareer, remove: removeCareer} = useFieldArray({
        control,
        name: 'career'
    });

    const handleImproveAbstract = async () => {
        const current = watch('abstract');
        if (!current?.trim()) return;
        try {
            const improved = await improveText(current);
            setValue('abstract', improved, {shouldValidate: true});
        } catch (error) {
            console.error('Failed to improve summary:', error);
        }
    };

    const handleImproveEducation = async () => {
        const current = watch('education');
        if (!current?.trim()) return;
        try {
            const improved = await improveEducationText(current);
            setValue('education', improved, {shouldValidate: true});
        } catch (error) {
            console.error('Failed to improve education:', error);
        }
    };

    // Photo upload handler
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showToast('warn', 'File Too Large', 'Photo must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setPhotoPreview(dataUrl);
            setValue('header.photoUrl', dataUrl, {shouldValidate: true});
        };
        reader.readAsDataURL(file);
    };

    const handleClearPhoto = () => {
        setPhotoPreview('');
        setValue('header.photoUrl', '', {shouldValidate: true});
    };

    // PDF text extraction
    const extractTextFromPDF = async (file: File): Promise<string> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map((item) => (item as { str: string }).str).join(' ') + '\n';
            }
            return fullText.trim();
        } catch (error) {
            throw new Error('Failed to extract text from PDF', { cause: error });
        }
    };

    const extractTextFromDOCX = async (file: File): Promise<string> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({arrayBuffer});
            return result.value.trim();
        } catch (error) {
            throw new Error('Failed to extract text from DOC/DOCX', { cause: error });
        }
    };

    const handleFileSelect = async (event: FileUploadSelectEvent) => {
        setUploadError('');
        setExtractedText('');
        const file = event.files[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            setUploadError('Please upload only PDF or DOC files');
            fileUploadRef.current?.clear();
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            fileUploadRef.current?.clear();
            return;
        }

        setUploadedFile({name: file.name, size: file.size, type: file.type, lastModified: file.lastModified, file});
        setIsExtracting(true);
        try {
            let text = '';
            if (file.type === 'application/pdf') {
                text = await extractTextFromPDF(file);
            } else {
                text = await extractTextFromDOCX(file);
            }
            setExtractedText(text);
        } catch {
            setUploadError('File uploaded but text extraction failed. You can still use the file.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setExtractedText('');
        setUploadError('');
        fileUploadRef.current?.clear();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleAutoFillFromCV = async () => {
        if (!extractedText.trim()) {
            setUploadError('No text extracted from the file. Please upload a valid CV.');
            return;
        }
        setUploadError('');
        try {
            const parsedData = await parseCV(extractedText);
            setValue('header.fullName', parsedData.header.fullName, {shouldValidate: true});
            setValue('header.specialization', parsedData.header.specialization, {shouldValidate: true});
            setValue('header.email', parsedData.header.email, {shouldValidate: true});
            setValue('header.phone', parsedData.header.phone, {shouldValidate: true});
            if (parsedData.header.links.length > 0) {
                setValue('header.links', parsedData.header.links, {shouldValidate: true});
            }
            if (parsedData.abstract) setValue('abstract', parsedData.abstract, {shouldValidate: true});
            if (parsedData.skills.length > 0) setValue('skills', parsedData.skills, {shouldValidate: true});
            if (parsedData.career.length > 0) setValue('career', parsedData.career, {shouldValidate: true});
            if (parsedData.education) setValue('education', parsedData.education, {shouldValidate: true});
            if (parsedData.sectionTitleColor) setValue('sectionTitleColor', parsedData.sectionTitleColor, {shouldValidate: true});
        } catch {
            setUploadError('Failed to parse CV data. Please check the file and try again.');
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-full">

            {/* Upload CV Document */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <h3 className="text-lg font-bold text-[#017A8C] mb-4">Upload CV Document</h3>
                <p className="text-sm text-[var(--color-text-light)] mb-4">Upload your existing CV in PDF or DOC format (Max 10MB)</p>

                {!uploadedFile ? (
                    <div className="relative">
                        <FileUpload
                            ref={fileUploadRef}
                            mode="basic"
                            name="cv-file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            maxFileSize={10485760}
                            customUpload
                            auto
                            onSelect={handleFileSelect}
                            chooseLabel="Choose"
                            className="hidden"
                        />
                        <motion.label
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-lg hover:from-[#015C6A] hover:to-[#017A8C] transition-all cursor-pointer shadow-md hover:shadow-lg"
                            onClick={() => fileUploadRef.current?.getInput()?.click()}
                        >
                            <Upload className="w-5 h-5"/>
                            <span>Choose</span>
                        </motion.label>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <motion.div
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#017A8C] truncate">{uploadedFile.name}</p>
                                    <p className="text-xs text-[var(--color-text-light)]">
                                        {formatFileSize(uploadedFile.size)}
                                        {isExtracting && <span className="ml-2">• Extracting text...</span>}
                                        {!isExtracting && extractedText && <span className="ml-2">• Text extracted ({extractedText.length} characters)</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isExtracting && extractedText && (
                                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} type="button"
                                        onClick={() => setShowTextDialog(true)}
                                        className="flex-shrink-0 p-2 text-[#017A8C] hover:bg-[#017A8C]/10 rounded-lg transition-all">
                                        <Eye className="w-5 h-5"/>
                                    </motion.button>
                                )}
                                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} type="button"
                                    onClick={handleRemoveFile}
                                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <X className="w-5 h-5"/>
                                </motion.button>
                            </div>
                        </motion.div>

                        {!isExtracting && extractedText && (
                            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="flex flex-col gap-2">
                                <motion.button whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} type="button"
                                    onClick={handleAutoFillFromCV} disabled={isParsing}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-lg hover:from-[#015C6A] hover:to-[#017A8C] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                                    <Sparkles className="w-5 h-5"/>
                                    {isParsing ? 'Parsing CV with AI...' : 'Auto-Fill Form from CV'}
                                </motion.button>
                                <p className="text-xs text-[var(--color-text-light)] text-center">Click to automatically parse and fill the form with data from your CV</p>
                            </motion.div>
                        )}

                        {parseError && (
                            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                    <span className="font-medium">Parse Error:</span>{parseError}
                                </p>
                            </motion.div>
                        )}
                    </div>
                )}

                {uploadError && (
                    <motion.p initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}}
                        className="text-sm text-red-500 mt-3 flex items-center gap-2">
                        <span className="font-medium">Error:</span>{uploadError}
                    </motion.p>
                )}
            </motion.div>

            {/* ATS Optimization */}
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className="bg-gradient-to-r from-[#017A8C]/10 via-[#019baf]/5 to-transparent p-4 rounded-xl border border-[#017A8C]/30"
            >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white"/>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-[#017A8C] mb-1">ATS Optimization</h3>
                        <p className="text-sm text-[var(--color-text-light)] mb-3">Let AI optimize your entire CV for Applicant Tracking Systems to increase your chances of getting interviews.</p>
                        <motion.button whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} type="button"
                            onClick={() => navigate("/ats")}
                            disabled={!watch('header.fullName') || !watch('abstract')?.trim() || isATSLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-lg hover:from-[#015C6A] hover:to-[#017A8C] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                            <Zap className="w-4 h-4"/>
                            {isATSLoading ? 'Optimizing...' : 'Optimize My CV for ATS'}
                        </motion.button>
                        {(!watch('header.fullName') || !watch('abstract')?.trim()) && (
                            <p className="text-xs text-[var(--color-text-light)] mt-2 italic">* Fill in your name and summary first to enable ATS optimization</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <h3 className="text-lg font-bold text-[#017A8C] mb-4">Personal Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="Full Name *" name="header.fullName" control={control} placeholder="John Doe" dataCy="fullName-input"/>
                    <TextInput label="Specialization *" name="header.specialization" control={control} placeholder="Financial Analyst" dataCy="specialization-input"/>
                    <TextInput label="Email *" name="header.email" control={control} placeholder="john.doe@example.com" dataCy="email-input"/>
                    <TextInput label="Phone Number *" name="header.phone" control={control} placeholder="+1234567890" dataCy="phone-input"/>
                    <div className="md:col-span-2">
                        <TextInput label="Address" name="header.address" control={control} placeholder="Market Street 12, New York, USA" dataCy="address-input"/>
                    </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="mt-5">
                    <label className="text-sm font-medium text-[var(--color-muted)] block mb-2">Profile Photo (optional)</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {photoPreview ? (
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <img src={photoPreview} alt="Profile preview" className="w-20 h-20 rounded-lg object-cover border-2 border-[#017A8C]"/>
                                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} type="button"
                                    onClick={handleClearPhoto}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
                                    <X className="w-3 h-3"/>
                                </motion.button>
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)] flex-shrink-0">
                                <Camera className="w-8 h-8 text-[var(--color-border)]"/>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-solid)] border border-[#017A8C]/30 text-[#017A8C] text-sm font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all cursor-pointer">
                                <Camera className="w-4 h-4"/>
                                {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
                            </label>
                            <p className="text-xs text-[var(--color-text-light)] mt-1.5">Max 2MB. JPG, PNG supported.</p>
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-[var(--color-muted)]">Links</label>
                        <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="button"
                            onClick={() => appendLink({name: '', url: ''})}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#017A8C] text-white text-sm font-semibold rounded-lg hover:bg-[#015C6A] transition-all">
                            <Plus className="w-4 h-4"/>Add Link
                        </motion.button>
                    </div>
                    <div className="space-y-3">
                        {linkFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]/30">
                                <div className="flex-1 space-y-3">
                                    <TextInput label="Link Name" name={`header.links.${index}.name`} control={control} placeholder="LinkedIn" dataCy={`link-name-input-${index}`}/>
                                    <TextInput label="URL" name={`header.links.${index}.url`} control={control} placeholder="https://..." dataCy={`link-url-input-${index}`}/>
                                </div>
                                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} type="button"
                                    onClick={() => removeLink(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all mt-6">
                                    <Trash2 className="w-4 h-4"/>
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Theme Color */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.1}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <h3 className="text-lg font-bold text-[#017A8C] mb-4">Theme Color</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Controller name="sectionTitleColor" control={control} render={({field}) => (
                        <>
                            <ColorPicker value={field.value || '017A8C'} onChange={(e) => field.onChange(e.value)} format="hex"/>
                            <div className="flex-1 h-12 rounded-lg border-2 border-[var(--color-border)] transition-all duration-300 flex items-center justify-center"
                                style={{backgroundColor: `#${field.value || '017A8C'}`}}>
                                <span className="text-white font-semibold text-sm">#{field.value || '017A8C'}</span>
                            </div>
                        </>
                    )}/>
                </div>
            </motion.div>

            {/* Summary */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.2}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#017A8C]">Summary</h3>
                    <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="button"
                        onClick={handleImproveAbstract}
                        disabled={!watch('abstract')?.trim() || isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-solid)] border border-[#017A8C]/30 text-[#017A8C] text-sm font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <Sparkles className="w-4 h-4"/>
                        {isLoading ? 'Improving...' : 'Improve with AI'}
                    </motion.button>
                </div>
                <TextAreaInput name="abstract" control={control} placeholder="Write a brief professional summary about yourself..." dataCy="abstract-input" rows={6}/>
            </motion.div>

            {/* Professional Experience */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.3}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#017A8C]">Professional Experience</h3>
                    <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="button"
                        onClick={() => appendCareer({
                            startDate: '', endDate: null, isPresent: false, location: '',
                            companyName: '', workSpecialization: '', jobType: 'Full time',
                            summarization: '', projects: []
                        })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#017A8C] text-white text-sm font-semibold rounded-lg hover:bg-[#015C6A] transition-all"
                        data-cy="add-career-button">
                        <Plus className="w-4 h-4"/>Add Experience
                    </motion.button>
                </div>

                <Accordion multiple className="career-accordion">
                    {careerFields.map((field, careerIndex) => (
                        <AccordionTab
                            key={field.id}
                            header={
                                <div className="flex justify-between items-center w-full pr-2">
                                    <span className="font-semibold">Experience Entry {careerIndex + 1}</span>
                                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} type="button"
                                        onClick={(e) => { e.stopPropagation(); removeCareer(careerIndex); }}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 className="w-4 h-4"/>
                                    </motion.button>
                                </div>
                            }
                        >
                            <CareerFieldsT2 control={control} careerIndex={careerIndex} watch={watch} setValue={setValue}/>
                        </AccordionTab>
                    ))}
                </Accordion>
            </motion.div>

            {/* Education */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.4}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#017A8C]">Education</h3>
                    <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="button"
                        onClick={handleImproveEducation}
                        disabled={!watch('education')?.trim() || isEducationLoading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-solid)] border border-[#017A8C]/30 text-[#017A8C] text-sm font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <Sparkles className="w-4 h-4"/>
                        {isEducationLoading ? 'Improving...' : 'Improve with AI'}
                    </motion.button>
                </div>
                <TextAreaInput name="education" control={control} placeholder="Describe your education background..." dataCy="education-input" rows={4}/>
            </motion.div>

            {/* Technical Skills */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.5}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <h3 className="text-lg font-bold text-[#017A8C] mb-4">Technical Skills</h3>
                <ChipsInput name="skills" control={control} dataCy="skills-input" placeholder="Type a skill and press Enter"/>
                <p className="text-xs text-[var(--color-text-light)] mt-2">Type a skill and press Enter. Examples: React, TypeScript, Node.js</p>
            </motion.div>

            {/* Additional Information */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.6}}
                className="bg-[var(--color-surface-50)] backdrop-blur-sm rounded-2xl shadow-md shadow-[#017A8C]/10 p-4 sm:p-6 border border-[#017A8C]/10"
            >
                <h3 className="text-lg font-bold text-[#017A8C] mb-4">Additional Information</h3>
                <TextAreaInput name="additionalInfo" control={control}
                    placeholder={"Languages: English, French\nCertificates: Financial Analyst License\nAwards/Activities: Best Employee 2023"}
                    dataCy="additionalInfo-input" rows={4}/>
                <p className="text-xs text-[var(--color-text-light)] mt-2">Each line will appear as a bullet point in your CV.</p>
            </motion.div>

            {/* Extracted Text Dialog */}
            <Dialog header="Extracted CV Text" visible={showTextDialog} onHide={() => setShowTextDialog(false)}
                style={{width: '90vw', maxWidth: '900px'}} modal dismissableMask draggable={false}>
                <div className="max-h-[70vh] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-[var(--color-muted)] font-mono leading-relaxed p-4 bg-[var(--color-bg)] rounded-lg">
                        {extractedText}
                    </pre>
                </div>
            </Dialog>
        </div>
    );
}

// Career Fields subcomponent for Template 2
function CareerFieldsT2({control, careerIndex, watch, setValue}: {
    control: Control<FieldValues>;
    careerIndex: number;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}) {
    const {fields: projectFields, append: appendProject, remove: removeProject} = useFieldArray({
        control,
        name: `career.${careerIndex}.projects`
    });

    const {improveText: improveCareerText, isLoading: isCareerLoading} = useGeminiCareer();

    const handleImproveCareerSummary = async () => {
        const currentSummary = watch(`career.${careerIndex}.summarization`);
        if (!currentSummary?.trim()) return;
        try {
            const improved = await improveCareerText(currentSummary);
            setValue(`career.${careerIndex}.summarization`, improved, {shouldValidate: true});
        } catch (error) {
            console.error('Failed to improve career summary:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput placeholder="Jan 2020" label="Start Date" control={control} name={`career.${careerIndex}.startDate`} dataCy={`career-startDate-input-${careerIndex}`}/>
                <TextInput placeholder="Jan 2022" label="End Date" control={control} name={`career.${careerIndex}.endDate`} dataCy={`career-endDate-input-${careerIndex}`}/>
            </div>

            <CheckboxInput label="I currently work here" name={`career.${careerIndex}.isPresent`} control={control} inputId={`present-t2-${careerIndex}`}/>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput placeholder="Company Inc." label="Company Name" control={control} name={`career.${careerIndex}.companyName`} dataCy={`career-companyName-input-${careerIndex}`}/>
                <TextInput placeholder="New York, USA" label="Location" control={control} name={`career.${careerIndex}.location`} dataCy={`career-location-input-${careerIndex}`}/>
                <TextInput placeholder="Financial Analyst" label="Position" control={control} name={`career.${careerIndex}.workSpecialization`} dataCy={`career-workSpecialization-input-${careerIndex}`}/>
                <DropdownInput label="Job Type" name={`career.${careerIndex}.jobType`} control={control} options={[
                    {label: 'Full time', value: 'Full time'}, {label: 'Part time', value: 'Part time'},
                    {label: 'Contract', value: 'Contract'}, {label: 'Freelance', value: 'Freelance'}
                ]} placeholder="Select job type" dataCy={`career-jobType-dropdown-${careerIndex}`}/>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-[var(--color-muted)]">Work Summary</label>
                    <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="button"
                        onClick={handleImproveCareerSummary}
                        disabled={!watch(`career.${careerIndex}.summarization`)?.trim() || isCareerLoading}
                        className="flex items-center gap-1 px-2 py-1 bg-[var(--color-surface-solid)] border border-[#017A8C]/30 text-[#017A8C] text-xs font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <Sparkles className="w-3 h-3"/>AI
                    </motion.button>
                </div>
                <TextAreaInput name={`career.${careerIndex}.summarization`} control={control}
                    placeholder="Describe your responsibilities and achievements (one per line)..."
                    dataCy={`career-summarization-input-${careerIndex}`} rows={4}/>
                <p className="text-xs text-[var(--color-text-light)] mt-1">Each line will appear as a bullet point in your CV.</p>
            </div>

            {/* Projects within Career */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]/30">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-[var(--color-muted)]">Projects</label>
                    <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="button"
                        onClick={() => appendProject({name: '', description: '', technologies: '', keyContributions: []})}
                        className="flex items-center gap-1 px-2 py-1 bg-[#017A8C]/10 text-[#017A8C] text-xs font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all">
                        <Plus className="w-3 h-3"/>Add Project
                    </motion.button>
                </div>
                <div className="space-y-3">
                    {projectFields.map((projField, projIndex) => (
                        <div key={projField.id} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]/30 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-[var(--color-muted)]">Project {projIndex + 1}</span>
                                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} type="button"
                                    onClick={() => removeProject(projIndex)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-all">
                                    <Trash2 className="w-3 h-3"/>
                                </motion.button>
                            </div>
                            <TextInput label="Project Name" name={`career.${careerIndex}.projects.${projIndex}.name`} control={control} placeholder="Project Name" dataCy={`career-project-name-input-${careerIndex}-${projIndex}`}/>
                            <TextAreaInput name={`career.${careerIndex}.projects.${projIndex}.description`} control={control} placeholder="Project description..." rows={2} dataCy={`career-project-description-input-${careerIndex}-${projIndex}`}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
