import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, UploadCloud } from 'lucide-react'; // Optional icons for coolness



function Upload() {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState('');
  const [year, setYear] = useState('');
  const [artist, setArtist] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'song') setAudioFile(files[0]);
    else if (name === 'image') setImageFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !movie || !year || !artist || !audioFile || !imageFile || !language || !genre) {
      setMessage('❌ Please fill out all fields and select both files');
      return;
    }
    setIsLoading(true);
    try {
      const safeTitle = title.replace(/\s+/g, '_').toLowerCase();
      const audioFileName = `${safeTitle}.mp3`;
      const imageFileName = `${safeTitle}.jpg`;

      const { data: audioData, error: audioError } = await supabase.storage.from('data').upload(`songs/${audioFileName}`, audioFile);
      if (audioError) throw audioError;
      const { data: imageData, error: imageError } = await supabase.storage.from('data').upload(`images/${imageFileName}`, imageFile);
      if (imageError) throw imageError;

      const { data: audioPublic } = supabase.storage.from('data').getPublicUrl(audioData.path);
      const { data: imagePublic } = supabase.storage.from('data').getPublicUrl(imageData.path);

      const { error: insertError } = await supabase.from('songs').insert([{
        title, movie, year, artist, audio_path: audioData.path, image_path: imageData.path,
        audio_url: audioPublic.publicUrl, image_url: imagePublic.publicUrl, language, genre,
      }]);
      if (insertError) throw insertError;

      setMessage('✅ Upload Successful!');
      setTitle('');
      setMovie('');
      setYear('');
      setArtist('');
      setLanguage('');
      setGenre('');
      setAudioFile(null);
      setImageFile(null);
    } catch (error) {
      setMessage(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-tr from-blue-100 via-white to-purple-100 rounded-2xl shadow-2xl mt-8 animate-fadeIn">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-blue-600 tracking-wide">Upload Your Song 🎵</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <InputField label="Movie" value={movie} onChange={(e) => setMovie(e.target.value)} />
          <InputField label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
          <InputField label="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField label="Language" value={language} setValue={setLanguage} options={['Tamil', 'English', 'Malayalam', 'Telugu', 'Hindi', 'Other']} />
          <SelectField label="Genre" value={genre} setValue={setGenre} options={['Love', 'Sad', 'Romantic', 'Melody', 'Dance', 'Mass', 'Kuthu', 'Friendship', 'Motivational', 'Devotional', 'Lofi', 'Folk', 'Instrumental', 'Other']} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadBox label="Audio File" accept="audio/*" name="song" onChange={handleFileChange} />
          <DragDropImageBox isDragging={isDragging} setIsDragging={setIsDragging} setImageFile={setImageFile} imageFile={imageFile} imageInputRef={imageInputRef} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl text-lg font-semibold transition-all duration-300"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

// Custom components
const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 transition"
      required
    />
  </div>
);

const SelectField = ({ label, value, setValue, options }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 transition"
      required
    >
      <option value="">Select {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const UploadBox = ({ label, accept, name, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      type="file"
      name={name}
      accept={accept}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-300"
      required
    />
  </div>
);

const DragDropImageBox = ({ isDragging, setIsDragging, setImageFile, imageFile, imageInputRef }) => (
  <div
    className={`w-full border-2 p-6 rounded-lg text-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    onClick={() => imageInputRef.current?.click()}
    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
    onDragLeave={() => setIsDragging(false)}
    onDrop={(e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) setImageFile(file);
    }}
  >
    {imageFile ? (
      <div>
        <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-24 h-24 object-cover mx-auto mb-2 rounded-lg" />
        <p className="text-green-600 font-semibold">{imageFile.name}</p>
      </div>
    ) : (
      <p className="text-gray-400 font-medium">Drag & Drop or Click to Upload Image</p>
    )}
    <input
      ref={imageInputRef}
      type="file"
      name="image"
      accept="image/*"
      onChange={(e) => setImageFile(e.target.files[0])}
      className="hidden"
    />
  </div>
);

export default Upload;
