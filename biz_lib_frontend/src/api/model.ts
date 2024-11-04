import { customFetch } from '@/utils/customFetch';

export const check_model_exists = (type: string, name: string) => customFetch('/bizyair/modelhost/check_model_exists', {
    method: 'POST',
    body: JSON.stringify({ type, name })
})

export const model_upload = (data: any) => customFetch('/bizyair/modelhost/model_upload', {
    method: 'POST',
    body: JSON.stringify(data)
})

export const models_files = (params: any, data: any) => customFetch(`/bizyair/community/models/query?${new URLSearchParams(params).toString()}`, {
    method: 'POST',
    body: JSON.stringify(data)
})

export const change_public = (data: any) => customFetch('/bizyair/modelhost/models/change_public', {
    method: 'PUT',
    body: JSON.stringify(data)
})

export const model_types = () => customFetch('/bizyair/community/model_types', {method: 'GET'})

export const base_model_types = () => customFetch('/bizyair/community/base_model_types', {method: 'GET'})

export const get_model_list = (params: any, data: any) => customFetch(`/bizyair/community/models/query?${new URLSearchParams(params).toString()}`, {
    method: 'POST',
    body: JSON.stringify(data)
})

export const check_folder = (url: string) => customFetch(`/bizyair/modelhost/check_folder?absolute_path=${encodeURIComponent(url)}`, {method: 'GET'})

export const submit_upload = (data: any) => customFetch(`/bizyair/community/submit_upload?clientId=${sessionStorage.getItem('clientId')}`, {
    method: 'POST',
    body: JSON.stringify(data)
})

export const delModels = (data: { type: string; name: string; }) => customFetch('/bizyair/modelhost/models', {
    method: 'DELETE',
    body: JSON.stringify({
        type: data.type,
        name: data.name,
    }),
})

export const getDescription = (data: any) => customFetch(`/bizyair/modelhost/models/description?${new URLSearchParams(data).toString()}`, {
    method: 'get'
})

export const putDescription = (data: any) => customFetch('/bizyair/modelhost/models/description', {
    method: 'put',
    body: JSON.stringify(data)
})
