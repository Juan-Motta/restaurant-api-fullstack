export const getStatusClass = (status: string): string => {
  switch (status) {
    case 'FINISHED':
      return 'bg-green-200 text-green-800 px-4 py-1 rounded-xl font-semibold'
    case 'PREPARING':
      return 'bg-yellow-200 text-yellow-800 px-4 py-1 rounded-xl font-semibold'
    case 'IN_KITCHEN':
      return 'bg-blue-200 text-blue-800 px-4 py-1 rounded-xl font-semibold'
    default:
      return 'bg-gray-200 text-gray-800 px-4 py-1 rounded-xl font-semibold'
  }
}
