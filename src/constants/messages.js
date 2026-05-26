export const MESSAGES = {
    // Auth
    USER_ALREADY_EXISTS: "User with this email or phone number already exists",
    USER_NOT_FOUND: "User not found",
    USER_REGISTER_SUCCESS: "User registered successfully. Please verify your email using the OTP sent.",
    LOGIN_SUCCESS: "User logged in successfully.",
    INVALID_CREDENTIALS: "Invalid credentials.",
    EMAIL_NOT_VERIFIED: "Please verify your email first.",
    EMAIL_ALREADY_VERIFIED: "Email is already verified",
    OTP_VERIFIED_SUCCESS: "Email verified successfully!",
    INVALID_OTP: "Invalid OTP",
    OTP_EXPIRED: "OTP has expired. Please request a new one",
    OTP_RESENT_SUCCESS: "OTP resent successfully. Please check your email.",
    LOGOUT_SUCCESS: "Logged out successfully.",
    TOKEN_REFRESHED: "Token refreshed successfully.",
    INVALID_REFRESH_TOKEN: "Invalid or expired refresh token.",
    REFRESH_TOKEN_REQUIRED: "Refresh token is required.",
    TOKEN_INVALIDATED: "Token has been invalidated. Please log in again.",

    // Cars
    CARS_FETCH_SUCCESS: "Cars retrieved successfully",
    CARS_NOT_FOUND: "No car found",
    CAR_ADD_SUCCESS: "Car added successfully!",
    CAR_DELETE_SUCCESS: "Car deleted successfully",
    CAR_UPDATE_SUCCESS: "Car updated successfully",
    USER_CARS: "User cars retrieved successfully",
    CAR_DETAIL_SUCCESS: "Car details retrieved successfully",
    INVALID_ID: "Invalid or missing Car ID",
    NO_FIELDS_UPDATE: "No fields to update",
    AT_LEAST_THREE_IMAGES: "At least 3 images are required.",
    CAR_NO_PRICING: "Car does not have pricing info.",

    // Bookings
    BOOKING_SUCCESS: "Booking created successfully.",
    BOOKING_IN_PROGRESS: "Another booking is being processed for this car, please try again shortly.",
    INVALID_BOOKING_DATES: "Invalid booking dates. End date must be after start date.",
    CAR_ALREADY_BOOKED: "Car is already booked for the selected dates.",
    INVALID_EXTRA_OPTION: "Invalid extra option.",
    BOOKING_NOT_FOUND: "Booking not found.",
    BOOKING_CANCELLED: "Booking cancelled successfully.",
    BOOKING_COMPLETED: "Booking completed successfully.",
    BOOKING_CONFIRMED_SUCCESS: "Booking confirmed successfully.",
    BOOKING_ALREADY_CANCELLED: "This booking is already cancelled.",
    BOOKING_ALREADY_COMPLETED: "This booking is already completed.",
    CANNOT_CANCEL_STARTED_BOOKING: "Cannot cancel a booking that has already started.",
    CANNOT_COMPLETE_FUTURE_BOOKING: "Cannot complete a booking that has not started yet.",
    BOOKING_MUST_BE_CONFIRMED: "Only confirmed bookings can be marked as completed.",
    BOOKING_MUST_BE_PENDING: "Only pending bookings can be confirmed.",
    UNAUTHORIZED_BOOKING_ACTION: "You are not authorized to perform this action on this booking.",
    BOOKINGS_FETCH_SUCCESS: "Bookings retrieved successfully.",
    BOOKING_DETAIL_SUCCESS: "Booking details retrieved successfully.",

    // Profile
    PROFILE_FETCH_SUCCESS: "Profile retrieved successfully.",
    PROFILE_UPDATE_SUCCESS: "Profile updated successfully.",
    PHONE_ALREADY_IN_USE: "This phone number is already in use.",
    NO_BOOKINGS_YET: "You have no bookings yet. Explore our cars to get started!",

    // Car ownership
    UNAUTHORIZED_CAR_ACTION: "You are not authorized to perform this action on this car.",

    // General
    SERVER_ERROR: "Something went wrong on the server",
  };
  