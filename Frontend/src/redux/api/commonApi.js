// import { BASE_URL } from '@/context'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../context'

export const commonApi = createApi({
	reducerPath: 'common-api',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
	}),
	keepUnusedDataFor: 600,
	endpoints: (builder) => ({
		getStudents: builder.query({
			query: (token) => ({
				url: '/get-students',
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),

        getTrainers: builder.query({
            query: (token) => ({
                url: '/get-trainers',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getAllCameras: builder.query({
            query: (token) => ({
                url: '/camera/allcamera',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getCampuses: builder.query({
            query: (token) => ({
                url: `/get-campus`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getCampusById: builder.query({
            query: ({token, id}) => ({
                url: `/campus/byid/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        // getSidebarById: builder.query({
        //     query: ({token, id}) => ({
        //         url: `/sidebar/${id}`,
        //         method: 'GET',
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }
        //     })
        // }),

        getRestaurantById: builder.query({
            query: ({token, id}) => ({
                url: `/restaurant/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),
        
        getCourses: builder.query({
            query: (token) => ({
                url: `/get-course`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getReports: builder.query({
            query: (token) => ({
                url: `/reports`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getMonthlyReports: builder.query({
            query: (token) => ({
                url: `/monthly-reports`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getSidebarData: builder.query({
            query: (token) => ({
                url: `/restaurant?sortBy=name&limit=10`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),   

        getUserData: builder.query({
            query: (token) => ({
                url: `/user`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),   

        getAllRestaurant: builder.query({
            query: ({token, query}) => ({
                url: `/user/allUsers?role=${query}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getTableById: builder.query({
            query: ({token, id}) => ({
                url: `/table/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getAllTables: builder.query({
            query: (token) => ({
                url: `/table`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getDashboardStats: builder.query({
            query: (token) => ({
                url: `/dashboard/stats`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),


        getBranchById: builder.query({
            query: ({token, id}) => ({
                url: `/branch/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getCameraById: builder.query({
            query: ({token, id}) => ({
                url: `/camera/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),

        getSingleRestaurantBranches: builder.query({
            query: ({token, id}) => ({
                url: `/branch/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),
        
	}),
})

export const { useGetDashboardStatsQuery, useGetCameraByIdQuery, useGetSingleRestaurantBranchesQuery, useGetBranchByIdQuery, useGetAllTablesQuery, useGetTableByIdQuery, useGetAllRestaurantQuery, useGetAllCamerasQuery, useGetUserDataQuery, useGetStudentsQuery, useGetSidebarDataQuery, useGetRestaurantByIdQuery, useGetChatBotQuery, useGetReportsQuery, useGetMonthlyReportsQuery, useGetCourseByIdQuery, useGetTrainersQuery, useGetCoursesQuery, useGetCampusesQuery, useGetCampusByIdQuery } = commonApi
