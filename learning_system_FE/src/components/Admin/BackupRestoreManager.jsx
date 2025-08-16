import React, { useState, useEffect } from 'react';
import {
    Download,
    Upload,
    Database,
    Clock,
    Shield,
    AlertTriangle,
    CheckCircle,
    FileText,
    Archive,
    Trash2,
    RefreshCw,
    Calendar,
    HardDrive,
    Settings
} from 'lucide-react';
import {
    getBackupHistory,
    getBackupSummary,
    restoreBackup,
    downloadBackupFile,
    createBackup,
    deleteBackupFile
} from '../../../services/CodeCompletionService';
import { toast } from 'react-toastify';

const BackupRestoreManager = () => {
    const [activeTab, setActiveTab] = useState('backup');
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [restoreMode, setRestoreMode] = useState('replace');
    const [notification, setNotification] = useState(null);
    const [backupStats, setBackupStats] = useState({
        totalBackups: 0,
        lastBackup: null,
        totalSize: 0
    });
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(''); // filename đang xóa

    useEffect(() => {
        loadBackupList();
        loadBackupStats();
    }, []);

    const loadBackupList = async () => {
        setLoading(true);
        try {
            const response = await getBackupHistory();
            console.log(response);
            setBackups(response.history || []);
        } catch {
            showNotification('error', 'Không thể tải danh sách backup');
        } finally {
            setLoading(false);
        }
    };

    const loadBackupStats = async () => {
        try {
            const res = await getBackupSummary();
            console.log(res);
            setBackupStats({
                totalBackups: res.total,
                lastBackup: res.latest_time,
                totalSize: res.total_size
            });
        } catch {
            setBackupStats({ totalBackups: 0, lastBackup: null, totalSize: 0 });
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['application/json', 'application/zip'];
            if (validTypes.includes(file.type) || file.name.endsWith('.json') || file.name.endsWith('.zip')) {
                setUploadFile(file);
            } else {
                showNotification('error', 'Chỉ chấp nhận file .json hoặc .zip');
            }
        }
    };

    const handleRestore = async () => {
        if (!uploadFile) {
            showNotification('error', 'Vui lòng chọn file backup');
            return;
        }
        setLoading(true);
        try {
            // Chỉ hỗ trợ chế độ replace (xóa toàn bộ và restore)
            const res = await restoreBackup(uploadFile);
            console.log(res);
            showNotification('success', res.message || 'Khôi phục thành công');
            setUploadFile(null);
            await loadBackupList();
            await loadBackupStats();
        } catch {
            showNotification('error', 'Lỗi khi khôi phục dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getFileIcon = (filename) => {
        if (filename.endsWith('.zip')) {
            return <Archive className="w-5 h-5 text-orange-500" />;
        }
        return <FileText className="w-5 h-5 text-blue-500" />;
    };

    // Tải file backup theo tên
    const handleDownloadBackup = async (filename) => {
        try {
            const res = await downloadBackupFile(filename);
            console.log(res);
            if (res) {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                showNotification('error', 'Tải file thất bại!');
            }
        } catch {
            showNotification('error', 'Tải file thất bại!');
        }
    };

    // Tạo backup mới
    const handleCreateBackup = async () => {
        setLoadingCreate(true);
        try {
            const res = await createBackup();
            console.log(res);
            if (res.status === 200) {
                toast.success('Tạo backup thành công!');
                await loadBackupList();
                await loadBackupStats();
            } else {
                toast.error('Lỗi khi tạo backup!');
            }
        } catch {
            toast.error('Lỗi khi tạo backup!');
        } finally {
            setLoadingCreate(false);
        }
    };

    const handleDeleteBackup = async (filename) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa file này?')) return;
        setLoadingDelete(filename);
        try {
            const res = await deleteBackupFile(filename);
            console.log(res);
            if (res.status === 200) {
                toast.success('Đã xóa file backup!');
                await loadBackupList();
                await loadBackupStats();
            } else {
                toast.error(res.data.error || 'Xóa file thất bại!');
            }
        } catch {
            toast.error('Xóa file thất bại!');
        } finally {
            setLoadingDelete('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500 rounded-lg text-white">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Backup & Restore</h1>
                                <p className="text-gray-500">Sao lưu và khôi phục dữ liệu hệ thống</p>
                            </div>
                        </div>
                        <button
                            onClick={loadBackupList}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${notification.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <HardDrive className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tổng số backup</p>
                                <p className="text-2xl font-bold text-gray-900">{backupStats.totalBackups}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Backup gần nhất</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {backupStats.lastBackup ? formatDate(backupStats.lastBackup) : 'Chưa có'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Settings className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tổng dung lượng</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatFileSize(backupStats.totalSize)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'backup', label: 'Tạo Backup', icon: Download },
                                { id: 'restore', label: 'Khôi phục', icon: Upload },
                                { id: 'history', label: 'Lịch sử Backup', icon: Clock }
                            ].map(({ id, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Icon hiển thị phía trước label */}
                                    {id === 'backup' && <Download className="w-4 h-4" />}
                                    {id === 'restore' && <Upload className="w-4 h-4" />}
                                    {id === 'history' && <Clock className="w-4 h-4" />}
                                    <span>{label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Backup Tab */}
                        {activeTab === 'backup' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Xuất Backup</h3>
                                    <p className="text-gray-600 mb-6">
                                        Tạo file backup chứa toàn bộ dữ liệu của hệ thống để lưu trữ hoặc di chuyển.
                                    </p>
                                </div>
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleCreateBackup}
                                        disabled={loadingCreate}
                                        className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-semibold text-lg transition-colors shadow"
                                    >
                                        <Download className="w-5 h-5" />
                                        {loadingCreate ? 'Đang tạo backup...' : 'Tạo backup mới'}
                                    </button>
                                </div>
                                {/* Schedule Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                                    <div className="flex items-start space-x-3">
                                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-900">Backup Tự động</h4>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Hệ thống tự động tạo backup hàng ngày lúc 2:00 AM và backup tuần lúc 1:00 AM chủ nhật.
                                                Các backup cũ sẽ được tự động dọn dẹp sau 30 ngày.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Restore Tab */}
                        {activeTab === 'restore' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Khôi phục từ Backup</h3>
                                    <p className="text-gray-600 mb-6">
                                        Upload file backup để khôi phục dữ liệu. Hãy cẩn thận vì thao tác này có thể thay đổi dữ liệu hiện tại.
                                    </p>
                                </div>

                                {/* Warning */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-yellow-900">Cảnh báo</h4>
                                            <p className="text-sm text-yellow-800 mt-1">
                                                Thao tác khôi phục có thể thay đổi hoặc xóa dữ liệu hiện tại.
                                                Hãy đảm bảo bạn đã tạo backup trước khi thực hiện.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <input
                                        type="file"
                                        accept=".json,.zip"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="backup-file"
                                    />
                                    <label htmlFor="backup-file" className="cursor-pointer">
                                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                            Chọn file backup
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Hỗ trợ file .json và .zip (tối đa 100MB)
                                        </p>
                                    </label>
                                </div>

                                {/* Selected File */}
                                {uploadFile && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            {getFileIcon(uploadFile.name)}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{uploadFile.name}</p>
                                                <p className="text-sm text-gray-500">{formatFileSize(uploadFile.size)}</p>
                                            </div>
                                            <button
                                                onClick={() => setUploadFile(null)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Restore Mode Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Chế độ khôi phục
                                    </label>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                value: 'replace',
                                                label: 'Thay thế hoàn toàn',
                                                description: 'Xóa tất cả dữ liệu hiện tại và thay thế bằng dữ liệu từ backup'
                                            },
                                            {
                                                value: 'append',
                                                label: 'Thêm vào',
                                                description: 'Giữ dữ liệu hiện tại và thêm dữ liệu từ backup'
                                            },
                                            {
                                                value: 'update',
                                                label: 'Cập nhật',
                                                description: 'Cập nhật record có sẵn và thêm record mới từ backup'
                                            }
                                        ].map((mode) => (
                                            <label key={mode.value} className="flex items-start space-x-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={mode.value}
                                                    checked={restoreMode === mode.value}
                                                    onChange={(e) => setRestoreMode(e.target.value)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{mode.label}</p>
                                                    <p className="text-sm text-gray-500">{mode.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Restore Button */}
                                <button
                                    onClick={handleRestore}
                                    disabled={!uploadFile || loading}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
                                >
                                    <Upload className="w-5 h-5" />
                                    <span>{loading ? 'Đang khôi phục...' : 'Khôi phục dữ liệu'}</span>
                                </button>
                            </div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Lịch sử Backup</h3>
                                        <p className="text-gray-600">Danh sách các file backup có sẵn trên hệ thống</p>
                                    </div>
                                </div>

                                {/* Backup List */}
                                <div className="space-y-3">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-500">Đang tải danh sách backup...</p>
                                        </div>
                                    ) : backups.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-500">Chưa có backup nào</p>
                                        </div>
                                    ) : (
                                        backups.map((backup, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                {getFileIcon(backup.filename)}
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{backup.filename}</p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                        <span>Kích thước: {formatFileSize(backup.size)}</span>
                                                        <span>Tạo: {formatDate(backup.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => handleDownloadBackup(backup.filename)}>
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        onClick={() => handleDeleteBackup(backup.filename)}
                                                        disabled={loadingDelete === backup.filename}
                                                    >
                                                        {loadingDelete === backup.filename ? (
                                                            <span className="animate-spin"><Trash2 className="w-4 h-4" /></span>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackupRestoreManager;