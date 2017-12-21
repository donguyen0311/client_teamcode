export const SCALE_FACTORS =[
	{
		PREC:{
			rating: [
				{
					value: 6.20,
					description: 'Hoàn toàn chưa từng làm.'
				},
				{
					value: 4.96,
					description: 'Phần lớn là chưa từng làm.'
				},
				{
					value: 3.72,
					description: 'Có một phần là chưa từng làm.'
				},
				{
					value: 2.48,
					description: 'Đã từng ở mức tổng quát.'
				},
				{
					value: 1.24,
					description: 'Phần lớn là quen thuộc.'
				},
				{
					value: 0,
					description: 'Hoàn toàn quen thuộc.'
				}
			],
			description: 'Đã từng phát triển ứng dụng tương tự.'
		}
	},
	{
		FLEX: {
			rating: [
				{
					value: 5.07,
					description: 'Nghiêm ngặt.'
				},
				{
					value: 4.05,
					description: 'Thỉnh thoảng thay đổi.'
				},
				{
					value: 3.04,
					description: 'Một vài thay đổi.'
				},
				{
					value: 2.03,
					description: 'General conformity.'
				},
				{
					value: 1.01,
					description: 'Some conformity.'
				},
				{
					value: 0,
					description: 'General goals.'
				}
			],
			description: 'Tính mềm dẻo khi phát triển.'
		}
	},
	{
		RESL: {
			rating: [
				{
					value: 7.07,
					description: 'Little (20%).'
				},
				{
					value: 5.65,
					description: 'Some (40%).'
				},
				{
					value: 4.24,
					description: 'Often (60%).'
				},
				{
					value: 2.83,
					description: 'Generally (75%).'
				},
				{
					value: 1.41,
					description: 'Mostly (90%).'
				},
				{
					value: 0,
					description: 'Full (100%).'
				}
			],
			description: 'Architecture / Risk Resolution.'
		},
	},
	{
		TEAM: {
			rating: [
				{
					value: 5.48,
					description: 'Very difficult interactions.'
				},
				{
					value: 4.38,
					description: 'Some difficult interactions.'
				},
				{
					value: 3.29,
					description: 'Basically copperative interactions.'
				},
				{
					value: 2.19,
					description: 'Largely cooperative.'
				},
				{
					value: 1.1,
					description: 'Highly cooperative.'
				},
				{
					value: 0,
					description: 'Seamless interactions.'
				}
			],
			description: 'Team cohesion.'
		}
	},
	{
		PMAT: {
			rating: [
				{
					value: 7.8,
					description: 'CCM Level 1 (lower half).'
				},
				{
					value: 6.24,
					description: 'CCM Level 1 (upper half).'
				},
				{
					value: 4.68,
					description: 'CMM Level 2.'
				},
				{
					value: 3.12,
					description: 'CCM Level 3.'
				},
				{
					value: 1.56,
					description: 'CMM Level 4.'
				},
				{
					value: 0,
					description: 'CMM Level 5.'
				}
			],
			description: 'Process Maturity.'
		}
	}
];

export const NOMINAL_RATING_VALUE=2;


export const EAF = [
	{
		RELY:{
			rating:[
				{
					value: 0.82,
					description: 'Gây bất tiện nhỏ.'
				},
				{
					value: 0.92,
					description: 'Dễ dàng phục hồi hư hỏng, mất mát.'
				},
				{
					value: 1,
					description: 'Khả năng phục hồi hư hỏng, mất mát ở mức độ trung bình.'
				},
				{
					value: 1.1,
					description: 'Gây ảnh hưởng lớn về tài chính.'
				},
				{
					value: 1.26,
					description: 'Gây nguy hiểm đến tính mạng con người.'
				},
				{
					value: 0
				}
			],
			description: 'Mức độ ảnh hưởng khi phần mềm vận hành sai lệch.'
		},
	},{
		DATA:{
			rating: [
				{
					value: 0
				},
				{
					value: 0.9,
					description: 'Testing DB bytes/Pgm SLOC < 10.'
				},
				{
					value: 1,
					description: ' 10 <= D/P < 100.'
				},
				{
					value: 1.14,
					description: ' 100 <= D/P < 1000.'
				},
				{
					value: 1.28,
					description: 'D/P >= 1000.'
				},
				{
					value:0
				}
			],
			description: 'Độ lớn của cơ sở dữ liệu.'
		},
	},{
		CPLX:{
			rating: [
				{
					value: 0.73,
					description: 'A=B+C*(DE)'
				},
				{
					value: 0.87,
				 	description: 'D=SQRT(B**2-4.*A*C)'
				},
				{
					value: 1,
					description: 'Có sử dụng ma trận, vector.'
				},
				{
					value: 1.17,
					description: 'Phân tích số học cơ bản: phân tích nhiều chiều, nội suy.'
				},
				{
					value: 1.34,
					description: 'Phân tích số học nâng cao có cấu trúc: ma trận, phương trình vi phân, tính toán song song đơn giản.'
				},
				{
					value: 1.74,
					description: 'Phân tích số học nâng không có cấu trúc: cần độ chính xác cao, dữ liệu ngẫu nhiên, tính toán song song phức tạp.'
				}
			],
			description: 'Độ phức tạp của dự án.'
		},
	},{
		RUSE:{
			rating: [
				{
					value: 0,
				},
				{
					value: 0.95,
					description: 'Không tái sử dụng.'
				},
				{
					value: 1,
					description: 'Tái sử dụng ở mức độ Dự án.'
				},
				{
					value:1.07,
					description: 'Tái sử dụng ở mức độ Chương Trình.'
				},
				{
					value: 1.15,
					description: 'Tái sử dụng ở mức độ trong một Dòng sản phẩm.'
				},
				{
					value: 1.24,
					description: 'Tái sử dụng ở mức độ nhiều Dòng sản phẩm.'
				}
			],
			description: 'Mức độ có thể tái sử dụng khi tiến hành xây dựng các thành phần.'
		},
	},{
		DOCU:{
			rating: [
				{
					value: 0.81,
					description: 'Many life-cycle needs uncovered.'
				},
				{
					value: 0.91,
					description: 'Some life-cycle needs uncovered.'
				},
				{
					value: 1,
					description: 'Right-sized to life-cycle needs.'
				},
				{
					value: 1.11,
					description: 'Excessive for life-cycle needs.'
				},
				{
					value: 1.23,
					description: 'Very excessive for life-cycle needs.'
				},
				{
					value: 0
				}
			],
			description: 'Yêu cầu document.'
		},
	},{
		TIME:{
			rating: [
				{
					value: 0
				},
				{
					value: 0
				},
				{
					value: 1,
					description: 'Thời gian thực thi chiếm <= 50% thời gian sẵn sàng.'
				},
				{
					value: 1.11,
					description: 'Thời gian thực thi chiếm <= 70% thời gian sẵn sàng.'
				},
				{
					value: 1.29,
					description: 'Thời gian thực thi chiếm <= 85% thời gian sẵn sàng.'
				},
				{
					value: 1.63,
					description: 'Thời gian thực thi chiếm <= 95% thời gian sẵn sàng.'
				}
			],
			description: 'Thời gian thực thi.'
		},
	},{
		STOR:{
			rating: [
				{
					value: 0
				},
				{
					value: 0
				},
				{
					value: 1,
					description: 'Sử dụng <= 50% dung lượng bộ nhớ.'
				},
				{
					value: 1.05,
					description: 'Sử dụng <= 70% dung lượng bộ nhớ.'
				},
				{
					value: 1.17,
					description: 'Sử dụng <= 85% dung lượng bộ nhớ.'
				},
				{
					value: 1.46,
					description: 'Sử dụng <= 95% dung lượng bộ nhớ.'
				}
			],
			description: 'Sử dụng bộ nhớ.'
		},
	},{
		PVOL:{
			rating: [
				{
					value: 0
				},
				{
					value: 0.87,
					description: 'Thay đổi LỚN mỗi 12 tháng. Thay đổi NHỎ mỗi 01 tháng.'
				},
				{
					value: 1,
					description: 'Thay đổi LỚN mỗi 06 tháng. Thay đổi NHỎ mỗi 02 tuần.'
				},
				{
					value: 1.15,
					description: 'Thay đổi LỚN mỗi 02 tháng. Thay đổi NHỎ mỗi 01 tuần.'
				},
				{
					value: 1.3,
					description: 'Thay đổi LỚN mỗi 02 tuần. Thay đổi NHỎ mỗi 02 ngày.'
				},
				{
					value: 0
				}
			],
			description: 'Tính không ổn định của Platform.'
		},
	},{
		ACAP:{
			rating: [
				{
					value: 1.42,
					description: '15th percentile.'
				},
				{
					value: 1.19,
					description: '35th percentile.'
				},
				{
					value: 1,
					description: '55th percentile.'
				},
				{
					value: 0.85,
					description: '75th percentile.'
				},
				{
					value: 0.71,
					description: '90th percentile.'
				},
				{
					value: 0
				}
			],
			description: 'Năng lực phân tích.'
		},
	},{
		PCAP:{
			rating: [
				{
					value: 1.34,
					description: '15th percentile.'
				},
				{
					value: 1.15,
					description: '35th percentile.'
				},
				{
					value: 1,
					description: '55th percentile.'
				},
				{
					value: 0.88,
					description: '75th percentile.'
				},
				{
					value: 0.76,
					description: '90th percentile.'
				},
				{
					value: 0
				} 
			],
			description: 'Năng lực lập trình.'
		},
	},{
		PCON:{
			rating: [
				{
					value: 1.29,
					description: 'Thay thế 48% nhân viên 01 năm.'
				},
				{
					value: 1.12,
					description: 'Thay thế 24% nhân viên 01 năm.'
				},
				{
					value: 1,
					description: 'Thay thế 12% nhân viên 01 năm.'
				},
				{
					value: 0.9,
					description: 'Thay thế 06% nhân viên 01 năm.'
				},
				{
					value: 0.81,
					description: 'Thay thế 03% nhân viên 01 năm.'
				},
				{
					value: 0
				} 
			],
			description: 'Tính ổn định nhân lực.'
		},
	},{
		APEX:{
			rating: [
				{
					value: 1.22,
					description: 'Kinh nghiệm <= 02 tháng.'
				},
				{
					value: 1.1,
					description: 'Kinh nghiệm 06 tháng.'
				},
				{
					value: 1,
					description: 'Kinh nghiệm 01 năm.'
				},
				{
					value: 0.88,
					description: 'Kinh nghiệm 03 năm.'
				},
				{
					value: 0.81,
					description: 'Kinh nghiệm 06 năm.'
				},
				{ 
					value: 0
				}
			],
			description: 'Kinh nghiệm về ứng dụng.'
		},
	},{
		PLEX:{
			rating: [
				{
					value: 1.19,
					description: 'Kinh nghiệm <= 02 tháng.'
				},
				{
					value: 1.09,
					description: 'Kinh nghiệm 06 tháng.'
				},
				{
					value: 1,
					description: 'Kinh nghiệm 01 năm.'
				},
				{
					value: 0.91,
					description: 'Kinh nghiệm 03 năm.'
				},
				{
					value: 0.85,
					description: 'Kinh nghiệm 06 năm.'
				},
				{
					value: 0
				} 
			],
			description: 'Kinh nghiệm về nền tảng.'
		},
	},{
		LTEX:{
			rating: [
				{
					value: 1.2,
					description: 'Kinh nghiệm <= 02 tháng.'
				},
				{
					value: 1.09,
					description: 'Kinh nghiệm 06 tháng.'
				},
				{
					value: 1,
					description: 'Kinh nghiệm 01 năm.'
				},
				{
					value: 0.91,
					description: 'Kinh nghiệm 03 năm.'
				},
				{
					value: 0.84,
					description: 'Kinh nghiệm 06 năm.'
				},
				{ 
					value: 0
				}
			],
			description: 'Kinh nghiệm về sử dụng các công cụ và lập trình.'
		},
	},{
		TOOL:{
			rating: [
				{
					value: 1.17,
					description: 'edit, code, debug.'
				},
				{
					value: 1.09,
					description: 'simple frontend, backend CASE, little integration.'
				},
				{
					value: 1,
					description: 'basic lifecycle tools, moderately intergrated.'
				},
				{
					value: 0.9,
					description: 'strong mature lifecycle tools, moderately intergrated.'
				},
				{
					value: 0.78,
					description: 'strong mature proactive lifecycle tools, well intergrated with processes, methods, reuse.'
				},
				{
					value: 0
				} 
			],
			description: 'Lượng công cụ phần mềm sử dụng.'
		},
	},{
		SITE:{
			rating: [
				{
					value: 1.22,
					description: 'International.'
				},
				{
					value: 1.09,
					description: 'Multi-city and multi-company.'
				},
				{
					value: 1,
					description: 'Multi-city or multi-company.'
				},
				{
					value: 0.93,
					description: 'Same city or metro area.'
				},
				{
					value: 0.86,
					description: 'Same building or complex.'
				},
				{
					value: 0.8,
					description: 'Fully collocated.'
				}
			],
			description: 'Quy mô phát triển phần mềm.'
		},
	},{
		SCED:{
			rating: [
				{
					value: 1.43,
					description: '75% so với bình thường.'
				},
				{
					value: 1.14,
					description: '85% so với bình thường.'
				},
				{
					value: 1,
					description: '100% so với bình thường.'
				},
				{
					value: 1,
					description: '130% so với bình thường.'
				},
				{
					value: 1,
					description: '160% so với bình thường.'
				},
				{
					value: 0
				} 
			],
			description: 'Yêu cầu về kế hoạch phát triển phần mềm.'
		}
	}
];

/*---COEFFICIENT OF COCOMO II 2000 Post-Architecture---*/
export const COEFFICIENT = {
	A: 2.94,
	B: 0.91,
	C: 3.67,
	D: 0.28
	// organic:{
	// 	a: 3.2,
	// 	b: 1.05,
	// 	c: 2.5,
	// 	d: 0.38
	// },
	// semi_detached: {
	// 	a: 3,
	// 	b: 1.12,
	// 	c: 2.5,
	// 	d: 0.35
	// },
	// emmbedded: {
	// 	a: 2.8,
	// 	b: 1.2,
	// 	c: 2.5,
	// 	d: 0.32
	// }
};

export const FUNCTION_POINT = [
	{
		EI: {
			description: 'Count each unique user data or user control input type that (i) enters the external boundary of the software system being measured and (ii) adds or changes data in a logical internal file.',
			standfor: 'External Input',
			weight: [
				3,
				4,
				6,
			]
		}
	},
	{
		EO: {
			description: 'Count each unique user data or control output type that leaves the external boundary of the software system being measured.',
			standfor: 'External Output',
			weight: [
				4,
				5,
				7,
			]
		}
	},
	{
		ILF: {
			description: 'Count each major logical group of user data or control information in the software system as a logical internal file type. Include each logical file (e.g., each logical group of data) that is generated, used, or maintained by the software system.',
			standfor: 'Internal Logical File',
			weight: [
				7,
				10,
				15,
			]
		}
	},
	{
		EIF: {
			description: 'Files passed or shared between software systems should be counted as external interface file types within each system.',
			standfor: 'External Interface Files',
			weight: [
				5,
				7,
				10,
			]
		}
	},
	{
		EQ: {
			description: 'Count each unique input-output combination, where an input causes and generates an immediate output, as an external inquiry type.',
			standfor: 'External Inquiry',
			weight: [
				3,
				4,
				6,
			]
		}
	}
];

export const FUNCTION_POINT_TO_SLOC = {
	'c': 99,
	'c++': 53,
	'c#': 59,
	'html': 40,
	'.net': 60,
	'pascal': 91,
	'prolog': 64,
	'php': 67,
	'java': 53,
	'javascript': 53,
	'oop': 30,
	'4gl': 20
};

// module.exports ={
// 	SCALE_FACTORS: SCALE_FACTORS,
// 	NOMINAL_RATING_VALUE: NOMINAL_RATING_VALUE,
// 	EAF: EAF,
// 	coefficient: coefficient,
// 	FUNCTION_POINT: FUNCTION_POINT,
// 	FUNCTION_POINT_TO_SLOC: FUNCTION_POINT_TO_SLOC
// }


