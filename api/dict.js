import http from '@/utils/request'

// get
export const getDict = (dictType) => http.get('/' + dictType)
