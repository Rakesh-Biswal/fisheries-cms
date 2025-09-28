// In your attendanceRoutes.js, update the create endpoint:
router.post("/create", async (req, res) => {
  try {
    const {
      date,
      title,
      description,
      departments, // Now accepts array
      status,
      startTime,
      endTime,
      displayTime,
      departmentColors,
      backgroundColor
    } = req.body;

    // Validate departments array
    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one department must be selected"
      });
    }

    // Check for existing holidays with any of the selected departments
    const existingHolidays = await Holiday.find({
      date,
      departments: { $in: departments }
    });
    
    if (existingHolidays.length > 0) {
      const conflictingDepts = existingHolidays.flatMap(holiday => 
        holiday.departments.filter(dept => departments.includes(dept))
      );
      return res.status(400).json({
        success: false,
        error: `Holidays already exist for this date in departments: ${[...new Set(conflictingDepts)].join(", ")}`
      });
    }

    const newHoliday = new Holiday({
      date,
      title,
      description,
      departments,
      status,
      startTime,
      endTime,
      displayTime,
      departmentColors,
      backgroundColor,
      createdBy: "Admin"
    });

    await newHoliday.save();
    
    res.status(201).json({
      success: true,
      message: "Holiday created successfully for multiple departments",
      data: newHoliday
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});