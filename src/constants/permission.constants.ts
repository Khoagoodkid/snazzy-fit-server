export const PermissionStore = {
    // Role
    CREATE_ROLE: "role.create",
    GET_ROLES: "role.get",
    GET_ROLE_BY_ID: "role.get.by.id",
    UPDATE_ROLE: "role.update",
    DELETE_ROLE: "role.delete",

    // Permission
    CREATE_PERMISSION: "permission.create",
    GET_PERMISSIONS: "permission.get",
    GET_PERMISSION_BY_ID: "permission.get.by.id",
    UPDATE_PERMISSION: "permission.update",
    DELETE_PERMISSION: "permission.delete",

    // Role Permission
    CREATE_ROLE_PERMISSION: "role.permission.create",
    UPSERT_ROLE_PERMISSION: "role.permission.upsert",
    GET_ROLE_PERMISSIONS: "role.permission.get",
    UPDATE_ROLE_PERMISSION: "role.permission.update",
    UPDATE_ROLE_PERMISSION_BY_IDS: "role.permission.update.by.ids",
    DELETE_ROLE_PERMISSION: "role.permission.delete",

    // User Profile
    UPDATE_USER_PROFILE: "user.profile.update",
    UPDATE_USER_PASSWORD: "user.password.update",

    // Product
    GET_PRODUCTS: "product.get",
    GET_PRODUCT_BY_SLUG: "product.get.by.slug",

    // Variant
    GET_VARIANTS: "variant.get",

    // Collection
    GET_COLLECTIONS: "collection.get",
    GET_COLLECTIONS_WITH_CATEGORIES: "collection.get.with.categories",

    // Category
    GET_CATEGORIES: "category.get",

    // Cart
    GET_CART: "cart.get",
    ADD_TO_CART: "cart.add",
    UPDATE_CART: "cart.update",
    REMOVE_FROM_CART: "cart.remove",

    // Order
    CREATE_ORDER: "order.create",
    GET_ORDERS: "order.get",
    GET_ORDER_BY_ID: "order.get.by.id",

    // Address
    CREATE_ADDRESS: "address.create",
    GET_ADDRESSES: "address.get",
    UPDATE_ADDRESS: "address.update",
    DELETE_ADDRESS: "address.delete",

    // Product Review
    CREATE_REVIEW: "review.create",
    GET_REVIEWS_BY_PRODUCT: "review.get.by.product",
    UPDATE_REVIEW: "review.update",
    DELETE_REVIEW: "review.delete",

    // Ticket
    CREATE_TICKET: "ticket.create",
    GET_TICKETS: "ticket.get",
    GET_TICKET_BY_ID: "ticket.get.by.id",
    UPDATE_TICKET: "ticket.update",
    DELETE_TICKET: "ticket.delete",

    // Stripe/Payment
    CREATE_CHECKOUT_SESSION: "payment.checkout.create",
    HANDLE_STRIPE_WEBHOOK: "payment.webhook.handle",

    // Upload
    UPLOAD_IMAGE: "upload.image",

    // User
    GET_USERS: "user.get",

    // Ticket
    MARK_AS_RESOLVED: "ticket.mark.as.resolved",
};

export const permissionSeedData = [
    { "name": "role.create" },
    { "name": "role.get" },
    { "name": "role.get.by.id" },
    { "name": "role.update" },
    { "name": "role.delete" },

    { "name": "permission.create" },
    { "name": "permission.get" },
    { "name": "permission.get.by.id" },
    { "name": "permission.update" },
    { "name": "permission.delete" },

    { "name": "role.permission.create" },
    { "name": "role.permission.upsert" },
    { "name": "role.permission.get" },
    { "name": "role.permission.update" },
    { "name": "role.permission.update.by.ids" },
    { "name": "role.permission.delete" },

    { "name": "user.profile.update" },
    { "name": "user.password.update" },

    { "name": "user.get" },

    { "name": "product.get" },
    { "name": "product.get.by.slug" },

    { "name": "variant.get" },

    { "name": "collection.get" },
    { "name": "collection.get.with.categories" },

    { "name": "category.get" },

    { "name": "cart.get" },
    { "name": "cart.add" },
    { "name": "cart.update" },
    { "name": "cart.remove" },

    { "name": "order.create" },
    { "name": "order.get" },
    { "name": "order.get.by.id" },

    { "name": "address.create" },
    { "name": "address.get" },
    { "name": "address.update" },
    { "name": "address.delete" },

    { "name": "review.create" },
    { "name": "review.get.by.product" },
    { "name": "review.update" },
    { "name": "review.delete" },

    { "name": "ticket.create" },
    { "name": "ticket.get" },
    { "name": "ticket.get.by.id" },
    { "name": "ticket.update" },
    { "name": "ticket.delete" },

    { "name": "payment.checkout.create" },
    { "name": "payment.webhook.handle" },

    { "name": "upload.image" },

    { "name": "ticket.mark.as.resolved" },
];