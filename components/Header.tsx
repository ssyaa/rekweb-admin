export const Header = () => (
    <header className="bg-blue-700 text-white p-4 shadow-md flex items-center justify-between">
        {/* Ikon Universitas Hasanuddin dan Nama Universitas */}
        <div className="flex items-center space-x-3">
            <img src="/icon/unhas.png" alt="Logo Unhas" className="w-10 h-10" />
            <div>
                <h1 className="text-lg font-semibold">UNIVERSITAS HASANUDDIN</h1>
            </div>
        </div>
        
        {/* Judul Portal Pengajuan Sidang (di kanan) */}
        <div className="text-lg font-semibold">
            <h1 className="text-lg font-semibold">PORTAL PENGAJUAN SIDANG</h1>
        </div>
    </header>
);
