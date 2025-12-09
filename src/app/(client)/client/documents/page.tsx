'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDocumentsStore, { type Document } from '@/stores/documents';
import UploadDocumentDialog from '@/components/upload-document-dialog';
import AddDocumentUrlDialog from '@/components/add-document-url-dialog';
import DocumentDetailsDialog from '@/components/document-details-dialog';
import { toast } from 'sonner';

export default function ClientDocumentsPage() {
  const { documents, addDocument } = useDocumentsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const categories = ['Contracts', 'Proposals', 'Reports', 'Deliverables', 'Technical Docs', 'Invoices'];
  const fileTypes = ['PDF', 'Word', 'Excel', 'Images', 'Archives'];

  const handleUploadDocument = (doc: any) => {
    addDocument({
      name: doc.name,
      type: doc.type,
      category: doc.category,
      projectName: 'Current Project', // Default project
      size: doc.size,
      uploadedBy: doc.uploadedBy,
      fileType: 'other', // Default file type
      description: `Uploaded document: ${doc.name}`,
      shared: doc.shared,
    });
  };

  const handleAddDocumentUrl = (doc: any) => {
    addDocument({
      name: doc.name,
      type: doc.type,
      category: doc.category,
      projectName: 'Current Project', // Default project
      size: doc.size,
      uploadedBy: doc.uploadedBy,
      fileType: 'other', // Default file type
      description: `Document link: ${doc.name}`,
      url: doc.url,
      shared: doc.shared,
    });
  };

  const handleDownloadDocument = (doc: Document) => {
    if (doc.url) {
      // For URL-based documents, open in new tab
      window.open(doc.url, '_blank');
    } else {
      // For uploaded documents, simulate download
      toast.info('Download functionality would be implemented here');
    }
  };

  const getFilteredDocuments = () => {
    let filtered = documents;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(d => d.category === filterCategory);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.type.toLowerCase() === filterType.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDocuments = getFilteredDocuments();
  const totalSize = documents.reduce((sum, d) => sum + parseInt(d.size.replace(' KB', '')), 0);

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, React.ReactElement> = {
      pdf: (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      doc: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      xls: (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      img: (
        <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <circle cx="10" cy="13" r="2" />
          <path d="m20 17-1.5-1.5c-.5-.5-1-.5-1.5 0L14 18" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      zip: (
        <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6M12 18v-6M10 14h4M10 18h4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    };
    return icons[fileType] || icons.pdf;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Access your project documents and files</p>
        </div>
        <div className="flex gap-2">
          <AddDocumentUrlDialog categories={categories} onAdd={handleAddDocumentUrl}>
            <Button variant="outline" className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors">
              <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Add URL
            </Button>
          </AddDocumentUrlDialog>
          <UploadDocumentDialog categories={categories} onUpload={handleUploadDocument}>
            <Button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
              <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </Button>
          </UploadDocumentDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{documents.length}</div>
            <p className="text-sm text-gray-500 mt-1">All files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{(totalSize / 1024).toFixed(1)} MB</div>
            <p className="text-sm text-gray-500 mt-1">Used space</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
            <p className="text-sm text-gray-500 mt-1">Document types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {documents.filter(d => {
                const daysSinceUpload = (Date.now() - d.uploadedDate.getTime()) / (1000 * 60 * 60 * 24);
                return daysSinceUpload <= 7;
              }).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search documents by name, project, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                  <p className="text-sm text-gray-600">{doc.projectName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{doc.size}</span>
                  </div>
                </div>
              </div>

              {doc.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>
              )}

              <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Uploaded:</span>
                  <span className="text-gray-900 font-medium">
                    {doc.uploadedDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Modified:</span>
                  <span className="text-gray-900 font-medium">
                    {doc.lastModified.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">By:</span>
                  <span className="text-gray-900 font-medium">{doc.uploadedBy}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <DocumentDetailsDialog doc={{
                  id: parseInt(doc.id.replace('DOC-', '')),
                  name: doc.name,
                  url: doc.url || '#',
                  type: doc.type,
                  size: doc.size,
                  uploadedBy: doc.uploadedBy,
                  uploadedDate: doc.uploadedDate.toISOString(),
                  category: doc.category,
                  shared: doc.shared,
                }}>
                  <Button className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                    View
                  </Button>
                </DocumentDetailsDialog>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadDocument(doc)}
                  className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
